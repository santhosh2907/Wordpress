<?php
if (!defined('ABSPATH')) exit;  // if direct access

add_action('wp_footer', 'post_grid_global_css', 999);

function post_grid_global_css()
{

    global $postGridCss;
    global $postGridCustomCss;


    $reponsiveCssGroups = [];
    $reponsiveCss = '';


    if (!empty($postGridCss))
        foreach ($postGridCss as $selector => $attrs) {


            $attr = isset($arg['attr']) ? $arg['attr'] : '';
            $reponsive = isset($arg['reponsive']) ? $arg['reponsive'] : '';

            if (!empty($attrs))
                foreach ($attrs as $attr => $reponsive) {

                    if (!empty($reponsive))
                        foreach ($reponsive as $device => $value) {


                            if (!empty($value)) {

                                if ($attr == 'padding' || $attr == 'margin') {

                                    $valHtml = '';

                                    foreach ($value as $val) {
                                        $valHtml .= $val . ' ';
                                    }

                                    $reponsiveCssGroups[$device][$selector][] = ['attr' => $attr,  'val' => $valHtml];
                                } elseif ($attr == 'font-size' || $attr == 'line-height' || $attr == 'letter-spacing') {

                                    $val = isset($value['val']) ? $value['val'] : 18;
                                    $unit = isset($value['unit']) ? $value['unit'] : 'px';

                                    $reponsiveCssGroups[$device][$selector][] = ['attr' => $attr,  'val' => $val . $unit];
                                } elseif ($attr == 'text-decoration') {


                                    $reponsiveCssGroups[$device][$selector][] = ['attr' => $attr,  'val' => implode(' ', $value)];
                                } else {
                                    $reponsiveCssGroups[$device][$selector][] = ['attr' => $attr,  'val' => $value];
                                }
                            }
                        }
                }
        }





    if (!empty($reponsiveCssGroups['Mobile'])) {
        $reponsiveCss .= '@media only screen and (min-width: 0px) and (max-width: 360px){';

        foreach ($reponsiveCssGroups['Mobile'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            foreach ($atts as  $arg) {

                $attr = isset($arg['attr']) ? $arg['attr'] : '';
                $val = isset($arg['val']) ? $arg['val'] : '';

                if (!empty($val))
                    $reponsiveCss .=  $attr . ':' . $val . ';';
            }
            $reponsiveCss .= '}';
        }



        $reponsiveCss .= '}';
    }
    if (!empty($reponsiveCssGroups['Tablet'])) {
        $reponsiveCss .= '@media only screen and (min-width: 361px) and (max-width: 780px){';


        foreach ($reponsiveCssGroups['Tablet'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            foreach ($atts as  $arg) {

                $attr = isset($arg['attr']) ? $arg['attr'] : '';
                $val = isset($arg['val']) ? $arg['val'] : '';

                if (!empty($val))
                    $reponsiveCss .=  $attr . ':' . $val . ';';
            }
            $reponsiveCss .= '}';
        }


        $reponsiveCss .= '}';
    }
    if (!empty($reponsiveCssGroups['Desktop'])) {
        $reponsiveCss .= '@media only screen and (min-width: 783px){';


        foreach ($reponsiveCssGroups['Desktop'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            foreach ($atts as  $arg) {

                $attr = isset($arg['attr']) ? $arg['attr'] : '';
                $val = isset($arg['val']) ? $arg['val'] : '';

                if (!empty($val))
                    $reponsiveCss .=  $attr . ':' . $val . ';';
            }
            $reponsiveCss .= '}';
        }




        $reponsiveCss .= '}';
    }


?>
    <style>
        <?php echo $reponsiveCss; ?>
        /*Custom CSS*/
        <?php echo $postGridCustomCss; ?>
    </style>

<?php

    //$postGridCss .= 'asdasdasd';
    //echo serialize($postGridCss);

    //echo $postGridCss;
}


function post_grid_global_cssY()
{

    global $postGridCssY;

    //$url = $_SERVER['REQUEST_URI'];

    //error_log(serialize($url));

    $reponsiveCssGroups = [];
    $reponsiveCss = '';



    if (is_array($postGridCssY))
        foreach ($postGridCssY as $index => $blockCss) {

            if (is_array($blockCss))
                foreach ($blockCss as  $selector => $atts) {

                    if (is_array($blockCss))
                        foreach ($atts as  $att => $responsiveVals) {

                            if (is_array($responsiveVals))
                                foreach ($responsiveVals as  $device => $val) {
                                    $reponsiveCssGroups[$device][$selector][$att] = $val;
                                }
                        }



                    // $attr = isset($arg['attr']) ? $arg['attr'] : '';
                    // $id = isset($arg['id']) ? $arg['id'] : '';
                    // $reponsive = isset($arg['reponsive']) ? $arg['reponsive'] : '';


                    // foreach ($reponsive as $device => $value) {

                    //     if (!empty($value))
                    //         $reponsiveCssGroups[$device][] = ['id' => $id, 'attr' => $attr,  'val' => $value];
                    // }
                }
        }





    if (!empty($reponsiveCssGroups['Desktop'])) {
        //$reponsiveCss .= '@media only screen and (min-width: 782px){';


        foreach ($reponsiveCssGroups['Desktop'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            if (!empty($atts))
                foreach ($atts as  $attr => $val) {


                    //error_log(serialize($val));

                    if (!empty($val))
                        $reponsiveCss .=  $attr . ':' . $val . ';';
                }
            $reponsiveCss .= '}';
        }




        //$reponsiveCss .= '}';
    }



    if (!empty($reponsiveCssGroups['Tablet'])) {
        //$reponsiveCss .= '@media only screen and (min-width: 361px) and (max-width: 780px){';
        $reponsiveCss .= '@media(max-width: 780px){';


        foreach ($reponsiveCssGroups['Tablet'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            if (!empty($atts))
                foreach ($atts as  $attr => $val) {
                    if (!empty($val))
                        $reponsiveCss .=  $attr . ':' . $val . ';';
                }
            $reponsiveCss .= '}';
        }


        $reponsiveCss .= '}';
    }


    if (!empty($reponsiveCssGroups['Mobile'])) {
        //$reponsiveCss .= '@media only screen and (min-width: 0px) and (max-width: 360px){';
        $reponsiveCss .= '@media(max-width:360px){';

        foreach ($reponsiveCssGroups['Mobile'] as $selector => $atts) {

            $reponsiveCss .= $selector . '{';

            if (!empty($atts))
                foreach ($atts as  $attr => $val) {
                    if (!empty($val))
                        $reponsiveCss .=  $attr . ':' . $val . ';';
                }
            $reponsiveCss .= '}';
        }



        $reponsiveCss .= '}';
    }



?>
    <style>
        <?php echo $reponsiveCss; ?>
    </style>

<?php

    //$postGridCss .= 'asdasdasd';
    //echo serialize($postGridCss);

    //echo $postGridCss;
}
add_action('wp_footer', 'post_grid_global_cssY', 999);


function post_grid_global_vars()
{
    global $postGridScriptData;
    $postGridScriptData['siteUrl'] = get_bloginfo('url');


?>
    <script>
        var post_grid_vars = <?php echo (wp_json_encode($postGridScriptData)); ?>
    </script>
<?php
}
add_action('wp_footer', 'post_grid_global_vars', 999);







add_filter('block_categories_all', 'post_grid_block_categories', 10, 2);


/**
 * Register custom category for blocks
 */

function post_grid_block_categories($categories, $context)
{

    if (!empty($categories)) {
        return array_merge(
            array(
                array(
                    'slug'  => 'post-grid',
                    'title' => __('Post Grid Combo', 'boilerplate'),
                ),
                array(
                    'slug'  => 'post-grid-woo',
                    'title' => __('Post Grid Combo - WooCommerce', 'boilerplate'),
                ),
            ),
            $categories
        );
    } else {
        return $categories;
    }
}


add_filter('allowed_block_types_all', 'post_grid_allowed_block_types', 99, 2);

function post_grid_allowed_block_types($allowed_block_types, $editor_context)
{

    $post_grid_settings = get_option('post_grid_settings');

    $disable_blocks = isset($post_grid_settings['disable_blocks']) ? $post_grid_settings['disable_blocks'] : [];


    $blocks_list = [
        'post-grid/post-grid' => 'Post Grid',
        'post-grid/post-grid-filterable' => 'Post grid filterable',
        'post-grid/post-title' => 'Post title',
        'post-grid/post-excerpt' => 'Post excerpt',
        'post-grid/post-author' => 'Post author',
        'post-grid/post-author-fields' => 'Post author fields',
        'post-grid/post-featured-image' => 'Post featured image',
        'post-grid/image' => 'Image',
        'post-grid/post-categories' => 'Post categories',
        'post-grid/post-tags' => 'Post tags',
        'post-grid/post-taxonomies' => 'Post taxonomies',
        'post-grid/post-date' => 'Post date',
        'post-grid/post-meta' => 'Post meta',
        'post-grid/read-more' => 'Read more',
        'post-grid/layers' => 'Layers',
        'post-grid/layer' => 'Layer',
        'post-grid/accordion' => 'Accordion',
        'post-grid/tabs' => 'Tabs',
        'post-grid/list' => 'List',
        'post-grid/icon' => 'Icon',
        'post-grid/text' => 'Text',
    ];


    foreach ($disable_blocks as $block) {


        error_log($block);
    }

    //error_log(serialize($disable_blocks));

    return $allowed_block_types;
}

// enable gutenberg for woocommerce
function activate_gutenberg_product($can_edit, $post_type)
{
    if ($post_type == 'product') {
        $can_edit = true;
    }
    return $can_edit;
}
add_filter('use_block_editor_for_post_type', 'activate_gutenberg_product', 10, 2);

// enable taxonomy fields for woocommerce with gutenberg on
function enable_taxonomy_rest($args)
{
    $args['show_in_rest'] = true;
    return $args;
}
add_filter('woocommerce_taxonomy_args_product_cat', 'enable_taxonomy_rest');
add_filter('woocommerce_taxonomy_args_product_tag', 'enable_taxonomy_rest');
