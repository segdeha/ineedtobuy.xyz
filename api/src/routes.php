<?php
// routes

require('PasswordStorage.php'); // password hashing
require('helpers.php'); // helper/pure functions
require('actions.php'); // functions for interacting with the database

// render index view
$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml');
});

// return info about a thing
$app->get('/api/thing/{barcode}', function ($request, $response, $args) {
    $barcode = $args['barcode'];

    if (!ctype_digit($barcode)) {
        // respond with error
        return $response->withStatus(400)->withJson(array(
            'error' => 'Invalid barcode'
        ));
    }

    $thing = getThingInfoFromBarcode($barcode);

    $data = array(
        'data' => $thing
    );

    return $response->withJson($data);
});

// return a list of the user's things
$app->get('/api/things/{user_id}', function ($request, $response, $args) {
    $user_id = filter_var((int)$args['user_id'], FILTER_VALIDATE_INT);

    $things = getListOfThingsFromUserId($user_id);
    $things = array_map('addLastPurchased', $things);

    $data = array(
        'data' => $things
    );

    return $response->withJson($data);
});

// add a new purchase record
$app->post('/api/purchase', function ($request, $response) {
    $json = $request->getParsedBody();

    $user_id = filter_var((int)$json['data']['user_id'], FILTER_VALIDATE_INT);
    $thing_id = filter_var((int)$json['data']['thing_id'], FILTER_VALIDATE_INT);

    $data = array(
        'data' => addPurchase($user_id, $thing_id)
    );

    return $response->withJson($data);
});

// $app->post('/api/register', function ($request, $response) {
//     $json = $request->getParsedBody();
//
//     $full_name = filter_var((string)$json['data']['full_name'], FILTER_SANITIZE_STRING);
//     $username = filter_var((string)$json['data']['username'], FILTER_SANITIZE_STRING);
//     $email = filter_var((string)$json['data']['email'], FILTER_VALIDATE_EMAIL);
//     $password = filter_var((string)$json['data']['password'], FILTER_SANITIZE_STRING);
//
//     $hashed_password = PasswordStorage::create_hash($password);
//
//     // TODO insert into DB
// });

$app->post('/api/login', function ($request, $response) {
    $vars = $request->getParsedBody();

    $username = filter_var((string)$vars['username'], FILTER_SANITIZE_STRING);
    $password = filter_var((string)$vars['password'], FILTER_SANITIZE_STRING);

    $user = getUserFromUsername($username);

    if ($user) {
        $is_valid = PasswordStorage::verify_password($password, $user['password']);
        unset($user['password']);
    }

    if ($is_valid) {
        $succeeded = updateLastLoginDateById($user['id']);
    }
    else {
        $response = $response->withStatus(403);
        $user = NULL;
    }

    $data = array(
        'data' => $user
    );

    return $response->withJson($data);
});
