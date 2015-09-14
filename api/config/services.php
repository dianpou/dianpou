<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, Mandrill, and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => '',
        'secret' => '',
    ],

    'mandrill' => [
        'secret' => '',
    ],

    'ses' => [
        'key' => '',
        'secret' => '',
        'region' => 'us-east-1',
    ],

    'stripe' => [
        'model'  => 'App\User',
        'secret' => '',
    ],
    'github'=>[
        'client_id' => env('SERVICE_GITHUB_CLIENT_ID'),
        'client_secret' => env('SERVICE_GITHUB_CLIENT_SECRET'),
        'redirect' => env('SERVICE_GITHUB_REDIRECT')
    ],
    'facebook'=>[
        'client_id' => '',
        'client_secret' => '',
        'redirect' => ''
    ],
    'twitter'=>[
        'client_id' => '',
        'client_secret' => '',
        'redirect' => ''
    ],
    'weibo' => [
        'client_id' => '',
        'client_secret' => '',
        'redirect' => '',
    ],
];
