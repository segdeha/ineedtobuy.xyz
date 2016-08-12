<?php
// Routes

$app->get('/[{name}]', function ($request, $response, $args) {
    // echo '<pre>';var_dump($args);exit;

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->get('/api/thing/{barcode}', function ($request, $response, $args) {
    // echo '<pre>';var_dump($args);exit;

    // return info about a thing
    $thing_id = (int)$args['barcode'];
});

$app->get('/api/things/{user_id}', function ($request, $response, $args) {
    // echo '<pre>';var_dump($args);exit;

    // return a list of the user's things
});

$app->post('/api/purchase', function ($request, $response, $args) {
    // add a new purchase record
});

// $app->post('/api/', function ($request, $response, $args) {});
