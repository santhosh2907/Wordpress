<?php
if (!defined('ABSPATH')) exit();

add_filter('form_wrap_process_loginForm', 'form_wrap_process_loginForm', 99, 2);

function form_wrap_process_loginForm($formFields, $onprocessargs)
{

    $response = [];

    $username = isset($formFields['username']) ? sanitize_text_field($formFields['username']) : '';
    $password = isset($formFields['password']) ? sanitize_text_field($formFields['password']) : '';
    $remember = isset($formFields['remember']) ? sanitize_text_field($formFields['remember']) : '';


    $email_data = [];

    $user = get_user_by('email', $username);
    if (empty($user)) $user = get_user_by('login', $username);


    if (!$user) {
        // $response['loginUsernotExist'] = 'User not exist';
        $response['errors']['loginUsernotExist'] = __('User not exist', 'post-grid');

        return $response;
    }


    $email = isset($user->user_email) ? $user->user_email : '';
    $full_name = isset($user->display_name) ? $user->display_name : '';


    foreach ($onprocessargs as $arg) {

        $id = $arg->id;


        if ($id == 'loggedInUser') {

            $credentials = [];

            $credentials['user_login'] = $user->user_login;
            $credentials['password'] = $password;
            $credentials['remember'] = $remember;


            $status = form_wrap_process_logged_user($credentials);


            if ($status) {
                //$response['loggedInUser'] = 'loggedInUser Success';
                $response['success']['loggedInUser'] = __('User Login success', 'post-grid');
            } else {
                //$response['loggedInUser'] = 'loggedInUser Failed';
                $response['errors']['loggedInUser'] = __('User Login failed', 'post-grid');
            }
        }



        if ($id == 'createEntry') {
            $status = form_wrap_process_create_entry($email_data);


            if ($status) {
                //$response['createEntry'] = 'createEntry Success';
                $response['success']['createEntry'] = __('Create entry success', 'post-grid');
            } else {
                //$response['createEntry'] = 'createEntry Failed';
                $response['errors']['createEntry'] = __('Create entry failed', 'post-grid');
            }
        }
    }









    return $response;
}



function form_wrap_process_logged_user($credentials)
{
    $user = get_user_by('login', $credentials['user_login']);
    $user_id = $user->ID;


    $user = wp_authenticate($credentials['user_login'], $credentials['password']);

    if (!is_wp_error($user)) {
        wp_set_current_user($user_id, $user->user_login);
        wp_set_auth_cookie($user_id);
        do_action('wp_login', $user->user_login, $user);

        return true;
    } else {
        return false;
    }
}






add_filter('form_wrap_process_registerForm', 'form_wrap_process_registerForm', 99, 2);

function form_wrap_process_registerForm($formFields, $onprocessargs)
{

    $response = [];

    $username = isset($formFields['username']) ? sanitize_text_field($formFields['username']) : '';

    $email = isset($formFields['email']) ? sanitize_text_field($formFields['email']) : '';
    $password = isset($formFields['password']) ? sanitize_text_field($formFields['password']) : '';
    $password_confirm = isset($formFields['password_confirm']) ? sanitize_text_field($formFields['password_confirm']) : '';



    if ($password !== $password_confirm) {
        //$response['registerUserConfirm'] = 'Password Missmatch';
        $response['errors']['registerUserConfirm'] = __('Password Missmatch', 'post-grid');

        return $response;
    }

    $user = get_user_by('email', $email);

    if ($user) {
        //$response['registerUserExist'] = 'User already exist';
        $response['errors']['registerUserExist'] = __('User already exist', 'post-grid');

        return $response;
    }

    if (empty($username)) {

        $emailArr = explode(',', $email);
        $username = isset($emailArr[0]) ? $emailArr[0] : '';
    }

    $username = form_wrap_process_regenerate_username($username);


    $email_data = [];








    foreach ($onprocessargs as $arg) {

        $id = $arg->id;


        if ($id == 'registerUser') {

            $credentials = [];

            $credentials['email'] = $email;
            $credentials['password'] = $password;
            $credentials['username'] = $username;

            $status = form_wrap_process_register_user($credentials);


            if ($status) {
                //$response['registerUser'] = 'User register Success';
                $response['success']['registerUserExist'] = __('User register Success', 'post-grid');
            } else {
                // $response['registerUser'] = 'User register Failed';
                $response['errors']['registerUserExist'] = __('User register Failed', 'post-grid');
            }
        }



        if ($id == 'createEntry') {
            $status = form_wrap_process_create_entry($email_data);


            if ($status) {
                //$response['createEntry'] = 'createEntry Success';
                $response['success']['createEntry'] = __('Create entry success', 'post-grid');
            } else {
                //$response['createEntry'] = 'createEntry Failed';
                $response['errors']['createEntry'] = __('Create entry failed', 'post-grid');
            }
        }
    }









    return $response;
}



function form_wrap_process_register_user($credentials)
{
    $user = get_user_by('login', $credentials['user_login']);
    $user_id = $user->ID;


    $user_id = wp_create_user($credentials['username'],  $credentials['password'], $credentials['email']);


    if ($user_id) {

        return true;
    } else {
        return false;
    }
}

function form_wrap_process_regenerate_username($username)
{

    if (username_exists($username)) {
        $x = 1;
        while (username_exists($username)) {
            $username = $username . $x;
            $x++;
        }
    }

    return $username;
}





add_filter('form_wrap_process_contactForm', 'form_wrap_process_contactForm', 99, 2);

function form_wrap_process_contactForm($formFields, $onprocessargs)
{

    $response = [];

    $full_name = isset($formFields['full_name']) ? sanitize_text_field($formFields['full_name']) : '';
    $email = isset($formFields['email']) ? sanitize_email($formFields['email']) : '';
    $message = isset($formFields['message']) ? wp_kses_post($formFields['message']) : '';
    $subject = isset($formFields['subject']) ? wp_kses_post($formFields['subject']) : '';

    $extraFields = $formFields;

    unset($extraFields['full_name']);
    unset($extraFields['email']);
    unset($extraFields['message']);
    unset($extraFields['subject']);

    error_log(serialize($extraFields));

    $email_data = [];




    foreach ($onprocessargs as $arg) {



        $id = $arg->id;

        if ($id == 'sendMail') {
            $fromEmail = $email;
            $fromName = $full_name;
            $replyTo = $email;
            $replyToName = $full_name;

            $mailTo = isset($arg->mailTo) ? $arg->mailTo : '';
            $bcc = isset($arg->bcc) ? $arg->bcc : '';
            $footer = isset($arg->footer) ? $arg->footer : '';
            $showOnResponse = isset($arg->showOnResponse) ? $arg->showOnResponse : true;

            $email_data['email_to'] = $mailTo;
            $email_data['email_bcc'] = $bcc;
            $email_data['email_from'] = $email;
            $email_data['email_from_name'] = $full_name;
            $email_data['subject'] = $subject;
            $email_data['html'] = $message . $footer;
            $email_data['attachments'] = [];


            $status = form_wrap_process_send_email($email_data);

            if ($showOnResponse) {
                if ($status) {
                    $response['success']['sendMail'] = __('Send mail success', 'post-grid');
                } else {
                    $response['errors']['sendMail'] = __('Send mail failed', 'post-grid');
                }
            }
        }

        if ($id == 'emailCopyUser') {

            $fromEmail = isset($arg->fromEmail) ? $arg->fromEmail : '';
            $fromName = isset($arg->fromName) ? $arg->fromName : '';
            $replyTo = isset($arg->replyTo) ? $arg->replyTo : '';
            $replyToName = isset($arg->replyToName) ? $arg->replyToName : '';
            $footer = isset($arg->footer) ? $arg->footer : '';
            $showOnResponse = isset($arg->showOnResponse) ? $arg->showOnResponse : true;



            $email_data['email_to'] = $email;
            $email_data['email_bcc'] = $bcc;
            $email_data['email_from'] = $fromEmail;
            $email_data['email_from_name'] = $fromName;
            $email_data['reply_to'] = $replyTo;
            $email_data['reply_to_name'] = $replyToName;
            $email_data['subject'] = $subject;
            $email_data['html'] = $message . $footer;
            $email_data['attachments'] = [];

            $status = form_wrap_process_send_email($email_data);

            if ($showOnResponse) {
                if ($status) {
                    $response['success']['emailCopyUser'] = __('Email copy user success', 'post-grid');
                } else {
                    $response['errors']['emailCopyUser'] = __('Email copy user failed', 'post-grid');
                }
            }
        }

        if ($id == 'emailBcc') {
            $mailTo = isset($arg->mailTo) ? $arg->mailTo : '';

            $fromEmail = isset($arg->fromEmail) ? $arg->fromEmail : '';
            $fromName = isset($arg->fromName) ? $arg->fromName : '';
            $replyTo = isset($arg->replyTo) ? $arg->replyTo : '';
            $replyToName = isset($arg->replyToName) ? $arg->replyToName : '';
            $footer = isset($arg->footer) ? $arg->footer : '';
            $showOnResponse = isset($arg->showOnResponse) ? $arg->showOnResponse : true;


            $email_data['email_to'] = $mailTo;
            $email_data['email_bcc'] = $bcc;
            $email_data['email_from'] = $fromEmail;
            $email_data['email_from_name'] = $fromName;
            $email_data['reply_to'] = $replyTo;
            $email_data['reply_to_name'] = $replyToName;
            $email_data['subject'] = $subject;
            $email_data['html'] = $message . $footer;
            $email_data['attachments'] = [];


            $status = form_wrap_process_send_email($email_data);

            if ($showOnResponse) {
                if ($status) {
                    $response['success']['emailBcc'] = __('Email Bcc success', 'post-grid');
                } else {
                    $response['errors']['emailBcc'] = __('Email Bcc failed', 'post-grid');
                }
            }
        }

        if ($id == 'autoReply') {
            $fromEmail = isset($arg->fromEmail) ? $arg->fromEmail : '';
            $fromName = isset($arg->fromName) ? $arg->fromName : '';
            $replyTo = isset($arg->replyTo) ? $arg->replyTo : '';
            $replyToName = isset($arg->replyToName) ? $arg->replyToName : '';
            $footer = isset($arg->footer) ? $arg->footer : '';
            $message = isset($arg->message) ? $arg->message : '';
            $showOnResponse = isset($arg->showOnResponse) ? $arg->showOnResponse : true;

            $email_data['email_to'] = $email;
            $email_data['email_bcc'] = $bcc;
            $email_data['email_from'] = $fromEmail;
            $email_data['email_from_name'] = $fromName;
            $email_data['reply_to'] = $replyTo;
            $email_data['reply_to_name'] = $replyToName;
            $email_data['subject'] = $subject;
            $email_data['html'] = $message . $footer;
            $email_data['attachments'] = [];

            $status = form_wrap_process_send_email($email_data);

            if ($showOnResponse) {
                if ($status) {
                    $response['success']['autoReply'] = __('Auto Reply success', 'post-grid');
                } else {
                    $response['errors']['autoReply'] = __('Auto Reply failed', 'post-grid');
                }
            }
        }

        if ($id == 'createEntry') {
            $status = form_wrap_process_create_entry($email_data);
            $showOnResponse = isset($arg->showOnResponse) ? $arg->showOnResponse : false;

            if ($showOnResponse) {
                if ($status) {
                    $response['success']['createEntry'] = __('Create entry success', 'post-grid');
                } else {
                    $response['errors']['createEntry'] = __('Create entry failed', 'post-grid');
                }
            }
        }
    }









    return $response;
}


function form_wrap_process_create_entry($email_data)
{

    return true;
}





function form_wrap_process_send_email($email_data)
{

    $email_to = isset($email_data['email_to']) ? $email_data['email_to'] : '';
    $email_bcc = isset($email_data['email_bcc']) ? $email_data['email_bcc'] : '';
    $email_from = !empty($email_data['email_from']) ? $email_data['email_from'] : get_option('admin_email');
    $email_from_name = !empty($email_data['email_from_name']) ? $email_data['email_from_name'] : get_bloginfo('name');
    $subject = isset($email_data['subject']) ? $email_data['subject'] : '';
    $email_body = isset($email_data['html']) ? $email_data['html'] : '';
    $attachments = isset($email_data['attachments']) ? $email_data['attachments'] : '';

    $headers = array();
    $headers[] = "From: " . $email_from_name . " <" . $email_from . ">";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/html; charset=UTF-8";

    if (!empty($email_bcc)) {
        $headers[] = "Bcc: " . $email_bcc;
    }
    $headers = apply_filters('post_grid_mail_headers', $headers);


    //var_dump($headers);

    $status = wp_mail($email_to, $subject, $email_body, $headers, $attachments);

    return $status;
}
