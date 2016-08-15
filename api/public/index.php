<?php

if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

define('BASE_DIR', '/usr/home/segdeha/apps/ineedtobuy.xyz');

// echo '<pre>';var_dump($_SERVER);exit;

$is_dev = $_SERVER["SERVER_NAME"] === "0.0.0.0";

// DEVELOPMENT
if ($is_dev) {
    require __DIR__ . '/../vendor/autoload.php';
    session_start();
    // Instantiate the app
    $settings = require __DIR__ . '/../src/settings.php';
    $app = new \Slim\App($settings);
    // Set up dependencies
    require __DIR__ . '/../src/dependencies.php';
    // Register middleware
    require __DIR__ . '/../src/middleware.php';
    // Register routes
    require __DIR__ . '/../src/routes.php';
    // enable CORS
    $app->options('/{routes:.+}', function ($request, $response, $args) {
        return $response;
    });
    $app->add(function ($request, $response, $next) {
        $response = $next($request, $response);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    });
}
// PRODUCTION
else {
    require BASE_DIR . '/vendor/autoload.php';
    session_start();
    // Instantiate the app
    $settings = require BASE_DIR . '/src/settings.php';
    $app = new \Slim\App($settings);
    // Set up dependencies
    require BASE_DIR . '/src/dependencies.php';
    // Register middleware
    require BASE_DIR . '/src/middleware.php';
    // Register routes
    require BASE_DIR . '/src/routes.php';
    // enable CORS
    $app->options('/{routes:.+}', function ($request, $response, $args) {
        return $response;
    });
    $app->add(function ($request, $response, $next) {
        $response = $next($request, $response);
        return $response
            ->withHeader('Access-Control-Allow-Origin', 'ineedtobuy.xyz')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    });
}

// Run app
$app->run();
