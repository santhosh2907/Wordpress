<?php
/**
 * Optml_Media_Offload class.
 *
 * @package    \Optimole\Inc
 * @author     Optimole <friends@optimole.com>
 */

/**
 * Class Optml_Admin
 */
class Optml_Media_Offload extends Optml_App_Replacer {
	use Optml_Normalizer;

	/**
	 * Hold the settings object.
	 *
	 * @var Optml_Settings Settings object.
	 */
	public $settings;
	/**
	 * Cached object instance.
	 *
	 * @var Optml_Media_Offload
	 */
	private static $instance = null;

	const KEYS = [
		'uploaded_flag'        => 'id:',
		'not_processed_flag'        => 'process:',
	];
	const POST_OFFLOADED_FLAG = 'optimole_offload_post';
	const POST_ROLLBACK_FLAG = 'optimole_rollback_post';
	/**
	 * Flag used inside wp_get_attachment url filter.
	 *
	 * @var bool Whether or not to return the original url of the image.
	 */
	private static $return_original_url = false;
	/**
	 * Flag used inside wp_get_attachment url filter.
	 *
	 * @var bool Whether or not to return the original url of the image.
	 */
	private static $offload_update_post = false;
	/**
	 * Flag used inside wp_unique_filename filter.
	 *
	 * @var bool Whether to skip our custom deduplication.
	 */
	private static $should_not_deduplicate = false;

	/**
	 * Flag used inside wp_unique_filename filter.
	 *
	 * @var bool Whether to skip our custom deduplication.
	 */
	private static $current_file_deduplication = false;
	/**
	 * Keeps the last deduplicated lower case value.
	 *
	 * @var string Used to check if the current processed image was deduplicated.
	 */
	private static $last_deduplicated = false;
	/**
	 * Keeps the last deduplicated original value.
	 *
	 * @var string Used when moving the file to our servers.
	 */
	private static $last_deduplicated_original;
	/**
	 * Checks if the plugin was installed before adding POST_OFFLOADED_FLAG.
	 *
	 * @var bool Used when applying the flags for the page query.
	 */
	private static $is_legacy_install = null;

	/**
	 * Adds page meta query args
	 *
	 * @param string $action The action for which the args are needed.
	 * @param array  $args The initial args without the added meta_query args.
	 * @return array The args with the added meta_query args.
	 */
	public static function add_page_meta_query_args( $action, $args ) {
		if ( $action === 'offload_images' ) {
			$args['meta_query'] = [
				'relation' => 'AND',
				[
					'key' => self::POST_OFFLOADED_FLAG,
					'compare' => 'NOT EXISTS',
				],
			];
		}
		if ( $action === 'rollback_images' ) {
			$args['meta_query'] = [
				'relation' => 'AND',
				[
					'key' => self::POST_ROLLBACK_FLAG,
					'compare' => 'NOT EXISTS',
				],
			];
			if ( self::$is_legacy_install ) {
				$args['meta_query'][] = [
					'key' => self::POST_OFFLOADED_FLAG,
					'value' => 'true',
					'compare' => '=',
				];
			}
		}
		return $args;
	}

	/**
	 * Enqueue script for generating cloud media tab.
	 */
	public function add_cloud_script( $hook ) {
		if ( $hook === 'post.php' || $hook === 'post-new.php' ) {
			wp_enqueue_script( 'optimole_media', OPTML_URL . 'assets/js/optimole_media.js' );
		}
	}

	/**
	 * Generate exactly the response format expected by wp media modal.
	 *
	 * @param string $url Original url to be optimized.
	 * @param string $resource_id Image id from cloud.
	 * @param int    $width Image width.
	 * @param int    $height Image height.
	 * @return array The format expected for a single image in the media modal.
	 */
	private function media_attachment_template( $url, $resource_id, $width, $height, $last_attach ) {
		$filename = pathinfo( $url, PATHINFO_FILENAME );
		$optimized_url = $this->get_media_optimized_url( $url, $resource_id, $width, $height );
		return
		[
			'id' => $last_attach + 1 + crc32( $filename ),
			'title' => $filename,
			'url' => $optimized_url,
			'link' => $optimized_url,
			'alt' => '',
			'author' => 1,
			'status' => 'inherit',
			'menuOrder' => 0,
			'mime' => 'image/jpeg',
			'type' => 'image',
			'subtype' => 'jpeg',
			'icon' => $optimized_url,
			'editLink' => $optimized_url,
			'authorName' => 'Optimole',
			'height' => $height,
			'width' => $width,
			'orientation' => 'landscape',
			// just adding the thumbnail size for for smooth display inside the modal
			// this sizes are ignored for everything else no point to define them
			'sizes' =>
			[
				'thumbnail' =>
				[
					'height' => '150',
					'width' => '150',
					'url' => $this->get_media_optimized_url( $url, $resource_id, 150, 150, $this->to_optml_crop( true ) ),
					'orientation' => 'landscape',
				],
			],
		];
	}

	/**
	 * Get count of all images from db.
	 *
	 * @return int Number of all images.
	 */
	public static function number_of_all_images() {
		$total_images_by_mime = wp_count_attachments( 'image' );
		return  array_sum( (array) $total_images_by_mime );
	}
	/**
	 * Parse images from api endpoint response images and send them to wp media modal.
	 */
	public function pull_images() {
		$images_on_page = 40;
		$last_attach = self::number_of_all_images();
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_send_json_error();
		}
		if ( isset( $_REQUEST['query'] ) && isset( $_REQUEST['query']['post_mime_type'] ) && $_REQUEST['query']['post_mime_type'][0] === 'optml_cloud' ) {
			$search = '';
			if ( isset( $_REQUEST['query']['s'] ) ) {
				$search = $_REQUEST['query']['s'];
			}
			$page = 0;
			if ( isset( $_REQUEST['query']['paged'] ) ) {
				$page = $_REQUEST['query']['paged'] - 1;
			}
			$images = [];
			$view_sites = [];
			$all_sites = false;
			$filter_sites = $this->settings->get( 'cloud_sites' );

			if ( isset( $filter_sites['all'] ) && $filter_sites['all'] === 'true' ) {
				$all_sites = true;
			}
			if ( ! $all_sites ) {
				foreach ( $filter_sites as $site => $value ) {
					if ( $value === 'true' ) {
						$view_sites[] = $site;
					}
				}
			}
			$cloud_images = [];
			$request = new Optml_Api();
			$decoded_response = $request->get_cloud_images( $page, $view_sites, $search );

			if ( isset( $decoded_response['images'] ) ) {
				$cloud_images = $decoded_response['images'];
			}

			foreach ( $cloud_images as $index => $image ) {
				$width = 'auto';
				$height = 'auto';
				if ( ! isset( $image['meta']['originURL'] ) || ! isset( $image['meta']['resourceS3'] ) ) {
					continue;
				}
				if ( isset( $image['meta']['originalHeight'] ) ) {
					$height = $image['meta']['originalHeight'];
				}
				if ( isset( $image['meta']['originalWidth'] ) ) {
					$width = $image['meta']['originalWidth'];
				}
				$images[] = $this->media_attachment_template( $image['meta']['originURL'], $image['meta']['resourceS3'], $width, $height, $last_attach );
			}
			wp_send_json_success( $images );
		}
	}
	/**
	 * Optml_Media_Offload constructor.
	 */
	public static function instance() {
		if ( null === self::$instance ||
			( self::$instance->settings !== null && ( ! self::$instance->settings->is_connected()
				|| self::$instance->settings->get( 'offload_media' ) === 'disabled'
				|| self::$instance->settings->get( 'cloud_images' ) === 'disabled' ) ) ) {
			self::$instance = new self();
			self::$instance->settings = new Optml_Settings();
			if ( self::$instance->settings->is_connected() ) {
				self::$instance->init();
			}
			if ( self::$instance->settings->get( 'cloud_images' ) === 'enabled' ) {
				add_action( 'wp_ajax_query-attachments', [self::$instance, 'pull_images'], -2 );
				add_action( 'admin_enqueue_scripts', [self::$instance, 'add_cloud_script'] );
			}
			if ( self::$instance->settings->get( 'offload_media' ) === 'enabled' ) {
				add_filter( 'image_downsize', [self::$instance, 'generate_filter_downsize_urls'], 10, 3 );
				add_filter( 'wp_generate_attachment_metadata', [self::$instance, 'generate_image_meta'], 10, 2 );
				add_filter( 'wp_get_attachment_url', [self::$instance, 'get_image_attachment_url'], -999, 2 );
				add_action( 'wp_insert_post_data', [self::$instance, 'filter_uploaded_images'] );
				add_action( 'delete_attachment', [self::$instance, 'delete_attachment_hook'], 10 );
				add_filter( 'handle_bulk_actions-upload', [self::$instance, 'bulk_action_handler'], 10, 3 );
				add_filter( 'bulk_actions-upload', [self::$instance, 'register_bulk_media_actions'] );
				add_filter( 'media_row_actions', [self::$instance, 'add_inline_media_action'], 10, 2 );
				add_filter( 'wp_calculate_image_srcset', [self::$instance, 'calculate_image_srcset'], 1, 5 );
				add_action( 'post_updated', [self::$instance, 'update_offload_meta'], 10, 3 );
				add_filter( 'wp_insert_attachment_data', [self::$instance, 'insert'], 10, 4 );

				if ( self::$is_legacy_install === null ) {
					self::$is_legacy_install = get_option( 'optimole_wp_install', 0 ) > 1677171600;
				}
			}
		}
		return self::$instance;
	}


	/**
	 * Function for `update_attached_file` filter-hook.
	 *
	 * @param string $file          Path to the attached file to update.
	 * @param int    $attachment_id Attachment ID.
	 *
	 * @return string
	 */
	function wp_update_attached_file_filter( $file, $attachment_id ) {

		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'called updated attached' );
		}
		$info = pathinfo( $file );
		$file_name = basename( $file );
		$no_ext_file_name = basename( $file, '.' . $info['extension'] );
		// if we have current deduplication set and it contains the filename that is updated
		// we replace the updated filename with the deduplicated filename
		if ( ! empty( self::$current_file_deduplication ) && stripos( self::$current_file_deduplication, $no_ext_file_name ) !== false ) {
			$file = str_replace( $file_name, self::$current_file_deduplication, $file );
			// we need to store the filename we replaced to check when uploading the image if it was deduplicated
			self::$last_deduplicated = $file_name;

			self::$current_file_deduplication = false;
		}
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', self::$last_deduplicated );
		}
		remove_filter( 'update_attached_file', [self::$instance, 'wp_update_attached_file_filter'], 10 );
		return $file;
	}

	/**
	 * Function for `wp_insert_attachment_data` filter-hook.
	 * Because we remove the images when new images are added the wp deduplication using the files will not work
	 * To overcome this we hook the attachment data when it's added to the database and we use the post name (slug) which is unique against the database
	 * For creating a unique quid by replacing the filename with the slug inside the existing guid
	 * This will ensure the guid is unique and the next step will be to make sure the attached_file meta for the image is also unique
	 * For this we will hook `update_attached_file` filter which is called after the data is inserted and there we will make sure we replace the filename
	 * with the deduplicated one which we stored into `$current_file_deduplication` variable
	 *
	 * @param array $data                An array of slashed, sanitized, and processed attachment post data.
	 * @param array $postarr             An array of slashed and sanitized attachment post data, but not processed.
	 * @param array $unsanitized_postarr An array of slashed yet *unsanitized* and unprocessed attachment post data as originally passed to wp_insert_post().
	 * @param bool  $update              Whether this is an existing attachment post being updated.
	 *
	 * @return array
	 */
	function insert( $data, $postarr, $unsanitized_postarr, $update ) {

		// the post name is unique against the database so not affected by removing the files
		// https://developer.wordpress.org/reference/functions/wp_unique_post_slug/
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'data before' );
			do_action( 'optml_log', $data );
		}
		if ( empty( $data['guid'] ) ) {
			return $data;
		}

		$filename = wp_basename( $data['guid'] );
		$ext = $this->get_ext( $filename );
		// skip if the file is not an image
		if ( ! isset( Optml_Config::$all_extensions[ $ext ] ) && ! in_array( $ext, ['jpg', 'jpeg', 'jpe'], true ) ) {
			return $data;
		}

		// on some instances (just unit tests) the post name has the extension appended like this : `image-1-jpg`
		// we remove that as it is redundant for the file name deduplication we are using it
		$sanitized_post_name = str_replace( '-' . $ext, '', $data['post_name'] );

		// with the wp deduplication working the post_title is identical to the post_name
		// so when they are different it means we need to deduplicate using the post_name
		if ( ! empty( $data['post_name'] ) && $data['post_title'] !== $sanitized_post_name ) {
			// we append the extension to the post_name to create a filename
			// and use it to replace the filename in the guid
			$no_ext_filename = str_replace( '.' . $ext, '', $filename );

			$no_ext_filename_sanitized = sanitize_title( $no_ext_filename );

			// get the deduplication addition from the database post_name
			$diff = str_replace( strtolower( $no_ext_filename_sanitized ), '', $sanitized_post_name );

			// create the deduplicated filename
			$to_replace_with = $no_ext_filename . $diff . '.' . $ext;

			$data['guid'] = str_replace( $filename, $to_replace_with, $data['guid'] );
			// we store the deduplication to be used and add the filter for updating the attached_file meta
			self::$current_file_deduplication = $to_replace_with;
			add_filter( 'update_attached_file', [self::$instance, 'wp_update_attached_file_filter'], 10, 2 );
		}
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'data after' );
			do_action( 'optml_log', $data );
		}

		return $data;
	}





	/**
	 * Update offload meta when the page is updated.
	 *
	 * @param int     $post_ID Updated post id.
	 * @param WP_Post $post_after Post before the update.
	 * @param WP_post $post_before Post after the update.
	 * @uses action:post_updated
	 *
	 * @return void
	 */
	public function update_offload_meta( $post_ID, $post_after, $post_before ) {
		if ( self::$offload_update_post === true ) {
			return;
		}
		if ( get_post_type( $post_ID ) === 'attachment' ) {
			return;
		}

		// revisions are skipped inside the function no need to check them before
		delete_post_meta( $post_ID, self::POST_ROLLBACK_FLAG );
	}
	/**
	 * Get image size name from width and meta.
	 *
	 * @param array  $sizes Image sizes .
	 * @param string $width Size width.
	 * @param string $filename Image filename.
	 *
	 * @return null|string
	 */
	public static function get_image_name_from_width( $sizes, $width, $filename ) {
		foreach ( $sizes as $name => $size ) {
			if ( $width === absint( $size['width'] ) && $size['file'] === $filename ) {
				return $name;
			}
		}

		return null;
	}
	/**
	 * Replace image URLs in the srcset attributes.
	 *
	 * @param array  $sources Array of image sources.
	 * @param array  $size_array Array of width and height values in pixels (in that order).
	 * @param string $image_src The 'src' of the image.
	 * @param array  $image_meta The image meta data as returned by 'wp_get_attachment_metadata()'.
	 * @param int    $attachment_id Image attachment ID.
	 *
	 * @return array
	 */
	public function calculate_image_srcset( $sources, $size_array, $image_src, $image_meta, $attachment_id ) {

		if ( ! is_array( $sources ) ) {
			return $sources;
		}

		if ( ! Optml_Media_Offload::is_uploaded_image( $image_src ) || ! isset( $image_meta['file'] ) || ! Optml_Media_Offload::is_uploaded_image( $image_meta['file'] ) ) {
			return $sources;
		}
		foreach ( $sources as $width => $source ) {
			$filename      = wp_basename( $image_meta['file'] );
			$size          = $this->get_image_name_from_width( $image_meta['sizes'], $width, $filename );
			$optimized_url = wp_get_attachment_image_src( $attachment_id, $size );

			if ( false === $optimized_url || ! isset( $optimized_url[0] ) ) {
				continue;
			}

			$sources[ $width ]['url'] = $optimized_url[0];
		}
		return $sources;
	}
	/**
	 *  Get the dimension from optimized url.
	 *
	 * @param string $url The image url.
	 * @return array Contains the width and height values in this order.
	 */
	public static function parse_dimension_from_optimized_url( $url ) {
		$catch = [];
		$height = 'auto';
		$width = 'auto';
		preg_match( '/\/w:(.*)\/h:(.*)\/q:/', $url, $catch );
		if ( isset( $catch[1] ) && isset( $catch[2] ) ) {
			$width = $catch[1];
			$height = $catch[2];
		}
		return [$width, $height];
	}

	/**
	 * Check if the image is stored on our servers or not.
	 *
	 * @param string $src Image src or url.
	 * @return bool Whether image is upload or not.
	 */
	public static function is_not_processed_image( $src ) {
		return strpos( $src, self::KEYS['not_processed_flag'] ) !== false;
	}
	/**
	 * Check if the image is stored on our servers or not.
	 *
	 * @param string $src Image src or url.
	 * @return bool Whether image is upload or not.
	 */
	public static function is_uploaded_image( $src ) {
		return strpos( $src, '/' . self::KEYS['uploaded_flag'] ) !== false;
	}
	/**
	 * Get the attachment ID from the image tag.
	 *
	 * @param string $image Image tag.
	 *
	 * @return int|false
	 */
	public function get_id_from_tag( $image ) {
		$attachment_id = false;
		if ( preg_match( '#class=["|\']?[^"\']*(wp-image-|wp-video-)([\d]+)[^"\']*["|\']?#i', $image, $found ) ) {
			$attachment_id = intval( $found[2] );
		}

		return $attachment_id;
	}

	/**
	 * Get attachment id from url
	 *
	 * @param string $url  The optimized url .
	 * @return false|mixed The attachment id .
	 */
	public static function get_attachment_id_from_url( $url ) {
		preg_match( '/\/' . Optml_Media_Offload::KEYS['not_processed_flag'] . '([^\/]*)\//', $url, $attachment_id );
		return isset( $attachment_id[1] ) ? $attachment_id[1] : false;
	}

	/**
	 * Get attachment id from local url
	 *
	 * @param string $url The url to look for.
	 * @return array The attachment id and the size from the url.
	 */
	private function get_local_attachement_id_from_url( $url ) {

		$size = 'full';
		$found_size = $this->parse_dimensions_from_filename( $url );
		$strip_url = $url;
		$scaled_url = $url;
		if ( $found_size[0] !== false && $found_size[1] !== false ) {
			$size = $found_size;
			$strip_url = str_replace( '-' . $found_size[0] . 'x' . $found_size[1], '', $url );
			$scaled_url = str_replace( '-' . $found_size[0] . 'x' . $found_size[1], '-scaled', $url );
		}
		$strip_url = $this->add_schema( $strip_url );

		$attachment_id = attachment_url_to_postid( $strip_url );
		if ( $attachment_id === 0 ) {
			$scaled_url = $this->add_schema( $scaled_url );
			$attachment_id = attachment_url_to_postid( $scaled_url );
		}

		return [ 'attachment_id' => $attachment_id, 'size' => $size ];
	}
	/**
	 * Filter out the urls that are saved to our servers when saving to the DB.
	 *
	 * @param array $data The post data array to save.
	 *
	 * @return array
	 * @uses filter:wp_insert_post_data
	 */
	public function filter_uploaded_images( $data ) {

		$content = trim( wp_unslash( $data['post_content'] ) );
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'content to update' );
			do_action( 'optml_log', $content );
		}
		$images  = Optml_Manager::instance()->extract_urls_from_content( $content );
		if ( ! isset( $images[0] ) ) {
			return $data;
		}
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'images to update' );
			do_action( 'optml_log', $images );
		}
		foreach ( $images as $url ) {
			$is_original_uploaded = self::is_uploaded_image( $url );
			$attachment_id = false;
			if ( $is_original_uploaded ) {
				$found_size = $this->parse_dimension_from_optimized_url( $url );
				if ( $found_size[0] !== 'auto' && $found_size[1] !== 'auto' ) {
					$size = $found_size;
				}
				$attachment_id = self::get_attachment_id_from_url( $url );
			} else {
				$id_and_size = $this->get_local_attachement_id_from_url( $url );
				$attachment_id = $id_and_size['attachment_id'];
				$size = $id_and_size['size'];
			}

			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', 'image id and found size' );
				do_action( 'optml_log', $attachment_id );
				do_action( 'optml_log', $size );
			}
			if ( false === $attachment_id || ! wp_attachment_is_image( $attachment_id ) ) {
				continue;
			}
			$optimized_url = wp_get_attachment_image_src( $attachment_id, $size );
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' image url to replace with ' );
				do_action( 'optml_log', $optimized_url );
			}

			if ( ! isset( $optimized_url[0] ) ) {
				continue;
			}
			if ( $is_original_uploaded === self::is_uploaded_image( $optimized_url[0] ) ) {
				continue;
			}
			$content = str_replace( $url, $optimized_url[0], $content );
		}
		$data['post_content'] = wp_slash( $content );
		return $data;
	}

	/**
	 * Get all images that need to be updated from a post.
	 *
	 * @param string $post_content The content of the post.
	 * @param string $job The job name.
	 * @return array An array containing the image ids.
	 */
	public function get_image_id_from_content( $post_content, $job ) {
		$content = trim( wp_unslash( $post_content ) );
		$images  = Optml_Manager::instance()->extract_urls_from_content( $content );
		$found_images = [];
		if ( isset( $images[0] ) ) {
			foreach ( $images as $url ) {
				$is_original_uploaded = self::is_uploaded_image( $url );
				$attachment_id = false;
				if ( $is_original_uploaded ) {
					if ( $job === 'rollback_images' ) {
						$attachment_id = self::get_attachment_id_from_url( $url );
					}
				} else {
					if ( $job === 'offload_images' ) {
						$id_and_size = $this->get_local_attachement_id_from_url( $url );
						$attachment_id = $id_and_size['attachment_id'];
					}
				}
				if ( false === $attachment_id || $attachment_id === 0 || ! wp_attachment_is_image( $attachment_id ) ) {
					continue;
				}
				$found_images[] = intval( $attachment_id );
			}
		}
		return apply_filters( 'optml_content_images_to_update', $found_images, $content );
	}

	/**
	 * Get the posts ids and the images from them that need sync/rollback.
	 *
	 * @param int    $page The current page from the query.
	 * @param string $job The job name rollback_images/offload_images.
	 * @param int    $batch How many posts to query on a page.
	 * @return array An array containing the page of the query and an array containing the images for every post that need to be updated.
	 */
	public function update_content( $page, $job, $batch = 1 ) {
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', ' updating_content ' );
		}
		$post_types = array_values(
			array_filter(
				get_post_types(),
				function( $post_type ) {
					if ( $post_type === 'attachment' || $post_type === 'revision' ) {
						return false;
					}
					return true;
				}
			)
		);
		$query_args = apply_filters(
			'optml_replacement_wp_query_args',
			['post_type' => $post_types, 'post_status' => 'any', 'fields' => 'ids',
				'posts_per_page' => $batch,
				'update_post_meta_cache' => true,
				'update_post_term_cache' => false,
			]
		);
		$query_args = self::add_page_meta_query_args( $job, $query_args );
		$content = new \WP_Query( $query_args );
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', $page );
		}
		$images_to_update = [];
		if ( $content->have_posts() ) {
			while ( $content->have_posts() ) {
				$content->the_post();
				$content_id = get_the_ID();
				if ( get_post_type() !== 'attachment' ) {
					$ids = $this->get_image_id_from_content( get_post_field( 'post_content', $content_id ), $job );
					if ( count( $ids ) > 0 ) {
						$images_to_update[ $content_id ] = $ids;
						$duplicated_pages = apply_filters( 'optml_offload_duplicated_images', [], $content_id );
						if ( is_array( $duplicated_pages ) && ! empty( $duplicated_pages ) ) {
							foreach ( $duplicated_pages as $duplicated_id ) {
								$duplicated_ids = $this->get_image_id_from_content( get_post_field( 'post_content', $duplicated_id ), $job );
								$images_to_update[ $duplicated_id ] = $duplicated_ids;
							}
						}
					}
					if ( $job === 'offload_images' ) {
						update_post_meta( $content_id, self::POST_OFFLOADED_FLAG, 'true' );
						delete_post_meta( $content_id, self::POST_ROLLBACK_FLAG );
					}
					if ( $job === 'rollback_images' ) {
						update_post_meta( $content_id, self::POST_ROLLBACK_FLAG, 'true' );
						delete_post_meta( $content_id, self::POST_OFFLOADED_FLAG );
					}
				}
			}
			$page ++;
		}
		$result['page'] = $page;
		$result['imagesToUpdate'] = $images_to_update;
		return $result;
	}
	/**
	 * Add inline action to push to our servers.
	 *
	 * @param array    $actions All actions.
	 * @param \WP_Post $post    The current post image object.
	 *
	 * @return array
	 */
	public function add_inline_media_action( $actions, $post ) {
		$meta = wp_get_attachment_metadata( $post->ID );
		if ( ! isset( $meta['file'] ) ) {
			return $actions;
		}
		$file = $meta['file'];
		if ( wp_check_filetype( $file, Optml_Config::$all_extensions )['ext'] === false || ! current_user_can( 'delete_post', $post->ID ) ) {
			return $actions;
		}
		if ( ! self::is_uploaded_image( $file ) ) {
			$upload_action_url = add_query_arg(
				[
					'action' => 'offload_images',
					'media[]' => $post->ID,
					'_wpnonce' => wp_create_nonce( 'bulk-media' ),
				],
				'upload.php'
			);

			$actions['offload_images'] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				$upload_action_url,
				esc_attr__( 'Offload to Optimole', 'optimole-wp' ),
				esc_html__( 'Offload to Optimole', 'optimole-wp' )
			);
		}
		if ( self::is_uploaded_image( $file ) ) {
			$rollback_action_url = add_query_arg(
				[
					'action' => 'rollback_images',
					'media[]' => $post->ID,
					'_wpnonce' => wp_create_nonce( 'bulk-media' ),
				],
				'upload.php'
			);
			$actions['rollback_images'] = sprintf(
				'<a href="%s" aria-label="%s">%s</a>',
				$rollback_action_url,
				esc_attr__( 'Restore image to media library', 'optimole-wp' ),
				esc_html__( 'Restore image to media library', 'optimole-wp' )
			);
		}
		return $actions;
	}
	/**
	 * Upload images to our servers and update inside pages.
	 *
	 * @param array $image_ids The id of the attachments for the selected images.
	 * @return int The number of successfully processed images.
	 */
	public function upload_and_update_existing_images( $image_ids ) {
		$success_up = 0;
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', ' images to upload ' );
			do_action( 'optml_log', $image_ids );
		}
		foreach ( $image_ids as $id ) {
			if ( self::is_uploaded_image( wp_get_attachment_metadata( $id )['file'] ) ) {
				// if this meta flag below failed at the initial update but the file meta above is updated it will cause an infinite query loop
				update_post_meta( $id, 'optimole_offload', 'true' );
				$success_up ++;
				continue;
			}

			$meta = $this->generate_image_meta( wp_get_attachment_metadata( $id ), $id );
			if ( isset( $meta['file'] ) && self::is_uploaded_image( $meta['file'] ) ) {
				$success_up ++;
				wp_update_attachment_metadata( $id, $meta );
			}
		}
		if ( $success_up > 0 ) {
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' call post update, succesful images: ' );
				do_action( 'optml_log', $success_up );
			}
		}
		return $success_up;
	}

	/**
	 * Return the original url of an image attachment.
	 *
	 * @param integer $post_id Image attachment id.
	 * @return string The original url of the image.
	 */
	public static function get_original_url( $post_id ) {
		self::$return_original_url = true;
		$original_url = wp_get_attachment_url( $post_id );
		self::$return_original_url = false;
		return $original_url;
	}
	/**
	 * Bring images back to media library and update inside pages.
	 *
	 * @param array $image_ids The id of the attachments for the selected images.
	 * @return int The number of successfully processed images.
	 */
	public function rollback_and_update_images( $image_ids ) {
		$success_back = 0;
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', ' images to rollback ' );
			do_action( 'optml_log', $image_ids );
		}

		self::$should_not_deduplicate = true;

		foreach ( $image_ids as $id ) {
			$current_meta = wp_get_attachment_metadata( $id );
			if ( ! isset( $current_meta['file'] ) || ! self::is_uploaded_image( $current_meta['file'] ) ) {
				delete_post_meta( $id, 'optimole_offload' );
				$success_back++;
				continue;
			}
			$table_id = [];
			$filename = pathinfo( $current_meta['file'], PATHINFO_BASENAME );
			preg_match( '/\/' . self::KEYS['uploaded_flag'] . '([^\/]*)\//', $current_meta['file'], $table_id );
			if ( ! isset( $table_id[1] ) ) {
				continue;
			}
			$table_id = $table_id[1];
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' image cloud id ' );
				do_action( 'optml_log', $table_id );
			}
			$request = new Optml_Api();
			$get_response = $request->call_upload_api( '', 'false', $table_id, 'false', 'true' );

			if ( is_wp_error( $get_response ) || wp_remote_retrieve_response_code( $get_response ) !== 200 ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				if ( OPTML_DEBUG_MEDIA ) {
					do_action( 'optml_log', ' error get url' );
				}
				continue;
			}

			$get_url = json_decode( $get_response['body'], true )['getUrl'];

			if ( ! function_exists( 'download_url' ) ) {
				include_once ABSPATH . 'wp-admin/includes/file.php';
			}
			if ( ! function_exists( 'download_url' ) ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}
			$timeout_seconds = 60;
			$temp_file = download_url( $get_url, $timeout_seconds );

			if ( is_wp_error( $temp_file ) ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				if ( OPTML_DEBUG_MEDIA ) {
					do_action( 'optml_log', ' download_url error ' );
				}
				continue;
			}

			$extension = $this->get_ext( $filename );

			if ( ! isset( Optml_Config::$image_extensions [ $extension ] ) ) {
				if ( OPTML_DEBUG_MEDIA ) {
					do_action( 'optml_log', ' image has invalid extension' );
					do_action( 'optml_log', $extension );
				}
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}

			$type = Optml_Config::$image_extensions [ $extension ];
			$file = [
				'name'     => $filename,
				'type'     => $type,
				'tmp_name' => $temp_file,
				'error'    => 0,
				'size'     => filesize( $temp_file ),
			];

			$overrides = [
				// do not expect the default form data from normal uploads
				'test_form' => false,

				// Setting this to false lets WordPress allow empty files, not recommended.
				'test_size' => true,

				// A properly uploaded file will pass this test. There should be no reason to override this one.
				'test_upload' => true,
			];

			if ( ! function_exists( 'wp_handle_sideload' ) ) {
				include_once ABSPATH . '/wp-admin/includes/file.php';
			}
			if ( ! function_exists( 'wp_handle_sideload' ) ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}

			// Move the temporary file into the uploads directory.
			$results = wp_handle_sideload( $file, $overrides );
			if ( ! empty( $results['error'] ) ) {
				if ( OPTML_DEBUG_MEDIA ) {
					do_action( 'optml_log', ' wp_handle_sideload error' );
				}
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}

			if ( ! function_exists( 'wp_create_image_subsizes' ) ) {
				include_once ABSPATH . '/wp-admin/includes/image.php';
			}
			if ( ! function_exists( 'wp_create_image_subsizes' ) ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}
			$original_meta = wp_create_image_subsizes( $results['file'], $id );
			if ( $type === 'image/svg+xml' ) {
				if ( ! function_exists( 'wp_get_attachment_metadata' ) || ! function_exists( 'wp_update_attachment_metadata' ) ) {
					include_once ABSPATH . '/wp-admin/includes/post.php';
				}
				if ( ! function_exists( 'wp_get_attachment_metadata' ) ) {
					update_post_meta( $id, 'optimole_rollback_error', 'true' );
					continue;
				}
				$meta = wp_get_attachment_metadata( $id );
				if ( ! isset( $meta['file'] ) ) {
					update_post_meta( $id, 'optimole_rollback_error', 'true' );
					continue;
				}
				$meta['file'] = $results['file'];
				wp_update_attachment_metadata( $id, $meta );
			}

			if ( ! function_exists( 'update_attached_file' ) ) {
				include_once ABSPATH . '/wp-admin/includes/post.php';
			}
			if ( ! function_exists( 'update_attached_file' ) ) {
				update_post_meta( $id, 'optimole_rollback_error', 'true' );
				continue;
			}
			update_attached_file( $id, $results['file'] );
			$duplicated_images = apply_filters( 'optml_offload_duplicated_images', [], $id );
			if ( is_array( $duplicated_images ) && ! empty( $duplicated_images ) ) {
				foreach ( $duplicated_images as $duplicated_id ) {
					$duplicated_meta = wp_get_attachment_metadata( $duplicated_id );
					if ( isset( $duplicated_meta['file'] ) && self::is_uploaded_image( $duplicated_meta['file'] ) ) {
						$duplicated_meta['file'] = $results['file'];
						if ( isset( $duplicated_meta['sizes'] ) ) {
							foreach ( $meta['sizes'] as $key => $value ) {
								if ( isset( $original_meta['sizes'][ $key ]['file'] ) ) {
									$duplicated_meta['sizes'][ $key ]['file'] = $original_meta['sizes'][ $key ]['file'];
								}
							}
						}
						wp_update_attachment_metadata( $duplicated_id, $duplicated_meta );
						delete_post_meta( $duplicated_id, 'optimole_offload' );
					}
				}
			}
			$success_back++;
			$original_url  = self::get_original_url( $id );
			if ( $original_url === false ) {
				continue;
			}
			$this->delete_attachment_from_server( $original_url, $id, $table_id );
		}
		self::$should_not_deduplicate = false;
		if ( $success_back > 0 ) {
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' call update post, success rollback' );
				do_action( 'optml_log', $success_back );
			}
		}
		return $success_back;
	}

	/**
	 * Handle the bulk actions.
	 *
	 * @param string $redirect  The current url from the media library.
	 * @param string $doaction  The current action selected.
	 * @param array  $image_ids The id of the attachments for the selected images.
	 * @return string The url with the correspondent query args for the executed actions.
	 */
	public function bulk_action_handler( $redirect, $doaction, $image_ids ) {

		if ( empty( $image_ids ) ) {
			return $redirect;
		}
		$redirect = remove_query_arg( [ 'optimole_offload_images_succes', 'optimole_offload_images_failed', 'optimole_back_to_media_success', 'optimole_back_to_media_failed', 'optimole_offload_images_extra', 'optimole_rollback_images_extra'  ], $redirect );
		$image_ids = array_slice( $image_ids, 0, 20, true );

		$redirect = add_query_arg( 'optimole_action', $doaction, $redirect );
		$redirect = add_query_arg( 'page', 'optimole', $redirect );
		$redirect = add_query_arg( $image_ids, $redirect );
		return $redirect;

	}
	/**
	 *  Register the bulk media actions.
	 *
	 *  @param array $bulk_array The existing actions array.
	 *  @return array The array with the appended actions.
	 */
	public function register_bulk_media_actions( $bulk_array ) {

		$bulk_array['offload_images'] = __( 'Push Image to Optimole', 'optimole-wp' );
		$bulk_array['rollback_images'] = __( 'Restore image to media library', 'optimole-wp' );
		return $bulk_array;

	}

	/**
	 * Send delete request to our servers and update the meta.
	 *
	 * @param string  $original_url Original url of the image.
	 * @param integer $post_id Image id inside db.
	 * @param string  $table_id Our cloud id for the image.
	 */
	public function delete_attachment_from_server( $original_url, $post_id, $table_id ) {
		$request = new Optml_Api();
		$delete_response = $request->call_upload_api( $original_url, 'true', $table_id );

		delete_post_meta( $post_id, 'optimole_offload' );
		if ( is_wp_error( $delete_response ) || wp_remote_retrieve_response_code( $delete_response ) !== 200 ) {
			// should add some routine to retry delete once if delete fails
		}
	}
	/**
	 * Delete an image from our servers after it is removed from media.
	 *
	 * @param int $post_id The deleted post id.
	 */
	public function delete_attachment_hook( $post_id ) {
		$file = wp_get_attachment_metadata( $post_id );
		if ( $file === false || ! isset( $file['file'] ) ) {
			return;
		}
		$file = $file['file'];
		if ( self::is_uploaded_image( $file ) ) {

			$original_url  = self::get_original_url( $post_id );
			if ( $original_url === false ) {
				return;
			}
			$table_id = [];

			preg_match( '/\/' . self::KEYS['uploaded_flag'] . '([^\/]*)\//', $file, $table_id );

			if ( ! isset( $table_id[1] ) ) {
				return;
			}
			$this->delete_attachment_from_server( $original_url, $post_id, $table_id[1] );
		}
	}

	/**
	 * Get optimized URL for an attachment image if it is uploaded to our servers.
	 *
	 * @param string $url The current url.
	 * @param int    $attachment_id The attachment image id.
	 * @return string Optimole cdn URL.
	 * @uses filter:wp_get_attachment_url
	 */
	public function get_image_attachment_url( $url, $attachment_id ) {
		if ( self::$return_original_url === true ) {
			return $url;
		}
		$meta = wp_get_attachment_metadata( $attachment_id );
		if ( ! isset( $meta['file'] ) ) {
			return $url;
		}
		$file = $meta['file'];
		if ( self::is_uploaded_image( $file ) ) {
			$optimized_url = ( new Optml_Image( $url, ['width' => 'auto', 'height' => 'auto', 'quality' => $this->settings->get_numeric_quality()], $this->settings->get( 'cache_buster' ) ) )->get_url();
			return str_replace( '/' . $url, '/' . self::KEYS['not_processed_flag'] . $attachment_id . $file, $optimized_url );
		} else {
			// this is for the users that already offloaded the images before the other fixes
			$local_file = get_attached_file( $attachment_id );
			if ( ! file_exists( $local_file ) ) {
				$duplicated_images = apply_filters( 'optml_offload_duplicated_images', [], $attachment_id );
				if ( is_array( $duplicated_images ) && ! empty( $duplicated_images ) ) {
					foreach ( $duplicated_images as $id ) {
						if ( ! empty( $id ) ) {
							$duplicated_meta = wp_get_attachment_metadata( $id );
							if ( isset( $duplicated_meta['file'] ) && self::is_uploaded_image( $duplicated_meta['file'] ) ) {
								$optimized_url = ( new Optml_Image( $url, ['width' => 'auto', 'height' => 'auto', 'quality' => $this->settings->get_numeric_quality()], $this->settings->get( 'cache_buster' ) ) )->get_url();
								return str_replace( '/' . $url, '/' . self::KEYS['not_processed_flag'] . $id . $duplicated_meta['file'], $optimized_url );
							}
						}
					}
				}
			}
		}
		return $url;
	}
	/**
	 * Filter the requested image url.
	 *
	 * @param null         $image         The previous image value (null).
	 * @param int          $attachment_id The ID of the attachment.
	 * @param string|array $size          Requested size of image. Image size name, or array of width and height values (in that order).
	 *
	 * @return array The image sizes and optimized url.
	 * @uses filter:image_downsize
	 */
	public function generate_filter_downsize_urls( $image, $attachment_id, $size ) {
		if ( self::$return_original_url === true ) {
			return $image;
		}
		$sizes2crop  = self::size_to_crop();
		if ( wp_attachment_is( 'video', $attachment_id ) && doing_action( 'wp_insert_post_data' ) ) {
			return $image;
		}
		$data      = image_get_intermediate_size( $attachment_id, $size );
		if ( ! isset( $data['url'] ) || ! isset( $data['width'] ) || ! isset( $data['height'] ) || ! self::is_uploaded_image( $data['url'] ) ) {
			return $image;
		}
		$resize = apply_filters( 'optml_default_crop', [] );
		if ( isset( $sizes2crop[ $data['width'] . $data['height'] ] ) ) {
			$resize = $this->to_optml_crop( $sizes2crop[ $data['width'] . $data['height'] ] );
		}
		$id_filename = [];

		preg_match( '/\/(' . self::KEYS['not_processed_flag'] . '.*)/', $data['url'], $id_filename );
		if ( ! isset( $id_filename[1] ) ) {
			return $image;
		}
		$url = self::get_original_url( $attachment_id );
		$optimized_url = ( new Optml_Image( $url, ['width' => $data['width'], 'height' => $data['height'], 'resize' => $resize, 'quality' => $this->settings->get_numeric_quality()], $this->settings->get( 'cache_buster' ) ) )->get_url();
		$optimized_url = str_replace( $url, $id_filename[1], $optimized_url );
		$image = [
			$optimized_url,
			$data['width'],
			$data['height'],
			true,
		];
		return $image;
	}
	/**
	 * Get image extension.
	 *
	 * @param string $path  Image path.
	 *
	 * @return string
	 */
	private function get_ext( $path ) {
		return pathinfo( $path, PATHINFO_EXTENSION );
	}
	/**
	 * Update image meta with optimized cdn path.
	 *
	 * @param array $meta    Meta information of the image.
	 * @param int   $attachment_id The image attachment ID.
	 *
	 * @return array
	 * @uses filter:wp_generate_attachment_metadata
	 */
	public function generate_image_meta( $meta, $attachment_id ) {

		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'called generate meta' );
		}
		if ( ! isset( $meta['file'] ) || ! isset( $meta['width'] ) || ! isset( $meta['height'] ) || self::is_uploaded_image( $meta['file'] ) ) {
			do_action( 'optml_log', 'invalid meta' );
			do_action( 'optml_log', $meta );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		if ( false === Optml_Filters::should_do_image( $meta['file'], self::$filters[ Optml_Settings::FILTER_TYPE_OPTIMIZE ][ Optml_Settings::FILTER_FILENAME ] ) ) {
			do_action( 'optml_log', 'optimization filter' );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		$original_url  = self::get_original_url( $attachment_id );

		if ( $original_url === false ) {
			do_action( 'optml_log', 'error getting original url' );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}

		$local_file = get_attached_file( $attachment_id );

		$extension = $this->get_ext( $local_file );
		$content_type = Optml_Config::$image_extensions [ $extension ];
		$temp = explode( '/', $local_file );
		$file_name = end( $temp );
		$no_ext_filename = str_replace( '.' . $extension, '', $file_name );
		$original_name = $file_name;
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'file before replace' );
			do_action( 'optml_log', $local_file );
		}

		// check if the current filename is the last deduplicated filename
		if ( ! empty( self::$last_deduplicated ) && strpos( $no_ext_filename, str_replace( '.' . $extension, '', self::$last_deduplicated ) ) !== false ) {
			// replace the file with the original before deduplication to get the path where the image is uploaded
			$local_file = str_replace( $file_name, self::$last_deduplicated, $local_file );
			$original_name = self::$last_deduplicated;
			self::$last_deduplicated = false;
		}
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'file after replace' );
			do_action( 'optml_log', $local_file );
		}
		if ( ! file_exists( $local_file ) ) {
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			do_action( 'optml_log', 'missing file' );
			do_action( 'optml_log', $local_file );
			return $meta;
		}

		if ( ! isset( Optml_Config::$image_extensions [ $extension ] ) ) {
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			do_action( 'optml_log', 'invalid extension' );
			do_action( 'optml_log', $extension );
			return $meta;
		}
		if ( false === Optml_Filters::should_do_extension( self::$filters[ Optml_Settings::FILTER_TYPE_OPTIMIZE ][ Optml_Settings::FILTER_EXT ], $extension ) ) {
			do_action( 'optml_log', 'extension filter' );
			do_action( 'optml_log', $extension );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}

		$request = new Optml_Api();
		$generate_url_response = $request->call_upload_api( $original_url );

		if ( is_wp_error( $generate_url_response ) || wp_remote_retrieve_response_code( $generate_url_response ) !== 200 ) {
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' call to signed url error' );
				do_action( 'optml_log', $generate_url_response );
			}
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		$decoded_response = json_decode( $generate_url_response['body'], true );

		if ( ! isset( $decoded_response['tableId'] ) || ! isset( $decoded_response['uploadUrl'] ) ) {
			if ( OPTML_DEBUG_MEDIA ) {
				do_action( 'optml_log', ' missing table id or upload url' );
				do_action( 'optml_log', $decoded_response );
			}
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		$table_id = $decoded_response['tableId'];
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', ' table id' );
			do_action( 'optml_log', $table_id );
		}
		$upload_signed_url = $decoded_response['uploadUrl'];
		$image = file_get_contents( $local_file );
		if ( $image === false ) {
			do_action( 'optml_log', 'can not find file' );
			do_action( 'optml_log', $local_file );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		if ( $upload_signed_url !== 'found_resource' ) {

			$request = new Optml_Api();
			$result = $request->upload_image( $upload_signed_url, $content_type, $image );

			if ( is_wp_error( $result ) || wp_remote_retrieve_response_code( $result ) !== 200 ) {
				do_action( 'optml_log', 'upload error' );
				do_action( 'optml_log', $result );
				update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
				return $meta;
			}
			$file_size = filesize( $local_file );
			if ( $file_size === false ) {
				$file_size = 0;
			}
			$request = new Optml_Api();
			$result_update = $request->call_upload_api(
				$original_url,
				'false',
				$table_id,
				'success',
				'false',
				$meta['width'],
				$meta['height'],
				$file_size
			);
			if ( is_wp_error( $result_update ) || wp_remote_retrieve_response_code( $result_update ) !== 200 ) {
				do_action( 'optml_log', 'dynamo update error' );
				do_action( 'optml_log', $result_update );
				update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
				return $meta;
			}
		}
		$url_to_append = $original_url;
		$url_parts = parse_url( $original_url );

		if ( isset( $url_parts['scheme'] ) && isset( $url_parts['host'] ) ) {
			$url_to_append = $url_parts['scheme'] . '://' . $url_parts['host'] . '/' . $file_name;
		}
		$optimized_url = $this->get_media_optimized_url( $url_to_append, $table_id );
		$request = new Optml_Api();
		if ( $request->check_optimized_url( $optimized_url ) === false ) {
			do_action( 'optml_log', 'optimization error' );
			do_action( 'optml_log', $optimized_url );
			$request->call_upload_api( $original_url, 'true', $table_id );
			update_post_meta( $attachment_id, 'optimole_offload_error', 'true' );
			return $meta;
		}
		file_exists( $local_file ) && unlink( $local_file );
		update_post_meta( $attachment_id, 'optimole_offload', 'true' );
		$meta['file'] = '/' . self::KEYS['uploaded_flag'] . $table_id . '/' . $url_to_append;

		if ( isset( $meta['sizes'] ) ) {
			foreach ( $meta['sizes'] as $key => $value ) {
				$generated_image_size_path = str_replace( $original_name, $meta['sizes'][ $key ]['file'], $local_file );
				file_exists( $generated_image_size_path ) && unlink( $generated_image_size_path );
				$meta['sizes'][ $key ]['file'] = $file_name;
			}
		}
		$duplicated_images = apply_filters( 'optml_offload_duplicated_images', [], $attachment_id );

		if ( is_array( $duplicated_images ) && ! empty( $duplicated_images ) ) {
			foreach ( $duplicated_images as $duplicated_id ) {
				$duplicated_meta = wp_get_attachment_metadata( $duplicated_id );
				if ( isset( $duplicated_meta['file'] ) && ! self::is_uploaded_image( $duplicated_meta['file'] ) ) {
					$duplicated_meta['file'] = $meta['file'];
					if ( isset( $duplicated_meta['sizes'] ) ) {
						foreach ( $meta['sizes'] as $key => $value ) {
							$duplicated_meta['sizes'][ $key ]['file'] = $file_name;
						}
					}
					wp_update_attachment_metadata( $duplicated_id, $duplicated_meta );
					update_post_meta( $duplicated_id, 'optimole_offload', 'true' );
				}
			}
		}
		if ( OPTML_DEBUG_MEDIA ) {
			do_action( 'optml_log', 'success offload' );
		}
		$attachment_page_id = wp_get_post_parent_id( $attachment_id );

		if ( $attachment_page_id !== false && $attachment_page_id !== 0 ) {
			self::$offload_update_post = true;
			update_post_meta( $attachment_page_id, self::POST_OFFLOADED_FLAG, 'true' );
			self::$offload_update_post = false;
		}
		return $meta;
	}

	/** Get the args for wp query according to the scope.
	 *
	 * @param int    $batch Number of images to get.
	 * @param string $action The action for which to get the images.
	 * @return array|false The query options array or false if not passed a valid action.
	 */
	public static function get_images_query_args( $batch, $action, $get_images = false ) {
		$args = [
			'posts_per_page'      => $batch,
			'fields'              => 'ids',
			'ignore_sticky_posts' => false,
			'no_found_rows'       => true,
		];
		if ( $get_images === true ) {
			$args ['post_type'] = 'attachment';
			$args ['post_mime_type'] = 'image';
			$args ['post_status'] = 'inherit';
			if ( $action === 'offload_images' ) {
				$args['meta_query'] = [
					'relation' => 'AND',
					[
						'key' => 'optimole_offload',
						'compare' => 'NOT EXISTS',
					],
					[
						'key' => 'optimole_offload_error',
						'compare' => 'NOT EXISTS',
					],
				];
				return $args;
			}
			if ( $action === 'rollback_images' ) {
				$args['meta_query'] = [
					'relation' => 'AND',
					[
						'key' => 'optimole_offload',
						'value' => 'true',
						'compare' => '=',
					],
					[
						'key' => 'optimole_rollback_error',
						'compare' => 'NOT EXISTS',
					],
				];
				return $args;
			}
		} else {
			$args = self::add_page_meta_query_args( $action, $args );
		}
		$post_types = array_values(
			array_filter(
				get_post_types(),
				function( $post_type ) {
					if ( $post_type === 'attachment' || $post_type === 'revision' ) {
						return false;
					}
					return true;
				}
			)
		);
		$args ['post_type'] = $post_types;
		return $args;
	}
	/**
	 *  Query the database and upload images to our servers.
	 *
	 * @param int $batch Number of images to process in a batch.
	 * @return array Number of found images and number of successfully processed images.
	 */
	public function upload_images( $batch, $images = [] ) {
		if ( empty( $images ) || $images === 'none' ) {
			$args = self::get_images_query_args( $batch, 'offload_images', true );
			$attachments = new \WP_Query( $args );
			$ids = $attachments->get_posts();
		} else {
			$ids = array_slice( $images, 0, $batch );
		}
		$result = [ 'found_images' => count( $ids ) ];
		$result['success_offload'] = $this->upload_and_update_existing_images( $ids );
		return $result;
	}
	/**
	 *  Query the database and bring back image to media library.
	 *
	 * @param int $batch Number of images to process in a batch.
	 * @return array Number of found images and number of successfully processed images.
	 */
	public function rollback_images( $batch, $images = [] ) {
		if ( empty( $images ) || $images === 'none' ) {
			$args = self::get_images_query_args( $batch, 'rollback_images', true );
			$attachments = new \WP_Query( $args );
			$ids = $attachments->get_posts();
		} else {
			$ids = array_slice( $images, 0, $batch );
		}
		$result = [ 'found_images' => count( $ids ) ];
		$result['success_rollback'] = $this->rollback_and_update_images( $ids );
		return $result;
	}

	/**
	 * Update the post with the given id, the images will be updated by the filters we use.
	 *
	 * @param int $post_id The post id to update.
	 * @return bool Whether the update was succesful or not.
	 */
	public function update_page( $post_id ) {
		self::$offload_update_post = true;
		$post_update = wp_update_post( ['ID' => $post_id] );
		self::$offload_update_post = false;
		if ( is_wp_error( $post_update ) || $post_update === 0 ) {
			return false;
		}
		do_action( 'optml_updated_post', $post_id );
		return true;
	}
	/**
	 *  Calculate the number of images in media library and the number of posts/pages.
	 *
	 * @param string $action The actions for which to get the number of images.
	 * @return int Number of images.
	 */
	public static function number_of_images_and_pages( $action ) {
		$args = self::get_images_query_args( -1, $action );
		$pages = new \WP_Query( $args );
		$pages_count = $pages->post_count;
		$args = self::get_images_query_args( -1, $action, true );
		$images = new \WP_Query( $args );
		return $pages_count + $images->post_count;
	}
}
