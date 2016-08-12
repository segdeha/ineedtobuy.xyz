<?php
// routes.php

require('actions.php');

// render index view
$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml', $args);
});

// return info about a thing
$app->get('/api/thing/{barcode}', function ($request, $response, $args) {
    $barcode = filter_var((int)$args['barcode'], FILTER_VALIDATE_INT);

    $thing = getThingInfoFromBarcode($barcode);

    $data = array(
        'data' => array(
            'barcode' => $barcode,
            'thing' => $thing,
        )
    );

    return $response->withJson($data);
});

// return a list of the user's things
$app->get('/api/things/{user_id}', function ($request, $response, $args) {
    $user_id = filter_var((int)$args['user_id'], FILTER_VALIDATE_INT);

    $things = getListOfThingsFromUserId($user_id);

    $data = array(
        'data' => array(
            'user_id' => $user_id,
            'things' => $things
        )
    );

    return $response->withJson($data);
});

// add a new purchase record
$app->post('/api/purchase', function ($request, $response) {
    $json = $request->getParsedBody();

    $thing_id = filter_var((int)$json['data']['thing_id'], FILTER_VALIDATE_INT);

    $data = array(
        'data' => array(
            'thing_id' => $thing_id
        )
    );

    return $response->withJson($data);
});

// $app->post('/api/', function ($request, $response, $args) {});
