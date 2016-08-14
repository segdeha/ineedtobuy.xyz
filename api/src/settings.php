<?php

return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
        ],

        // Database settings
        'db' => [
            'driver' => 'mysql',
            'host' => 'db154.pair.com',
            'username' => 'segdeha_23',
            'password' => 'jqQhzv9C',
            'dbname' => 'segdeha_ineedtobuyxyz',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ],

        // API keys
        // https://www.outpan.com/developers.php
        'outpan' => '831918d76cae3694b33f93cbac4a3501',
    ],
];
