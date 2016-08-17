<?php
// routes

require('PasswordStorage.php'); // password hashing
require('helpers.php'); // helper/pure functions
require('actions.php'); // functions for interacting with the database

// render index view
$app->get('/', function ($request, $response, $args) {
    return $this->renderer->render($response, 'index.phtml');
});

// TODO finish implementing registration
// $app->post('/register', function ($request, $response) {
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

$app->post('/login', function ($request, $response) {
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
        $token = generateToken($user['id']);
    }
    else {
        $response = $response->withStatus(403);
        $user = NULL;
    }

    $data = array(
        'data' => array(
            'token' => $token,
            'user' => $user,
        )
    );

    return $response->withJson($data);
});

// API routes
$app->group('/api', function () use ($app) {
    // return info about a thing
    $app->get('/thing/{user_id}/{barcode}/{token}', function ($request, $response, $args) {
        $user_id = filter_var((int)$args['user_id'], FILTER_VALIDATE_INT);

        $barcode = $args['barcode'];

        if (!ctype_digit($barcode)) {
            // respond with error
            return $response->withStatus(400)->withJson(array(
                'error' => 'Invalid barcode'
            ));
        }

        $thing = getThingInfoFromBarcode($barcode);
        $token = generateToken($user_id);

        $data = array(
            'data' => array(
                'token' => $token,
                'thing' => $thing,
            )
        );

        return $response->withJson($data);
    });

    // return a list of the user's things
    $app->get('/things/{user_id}/{token}', function ($request, $response, $args) {
        $user_id = filter_var((int)$args['user_id'], FILTER_VALIDATE_INT);

        $things = getListOfThingsFromUserId($user_id);
        $token  = generateToken($user_id);

        $data = array(
            'data' => array(
                'token'  => $token,
                'things' => $things,
            )
        );

        return $response->withJson($data);
    });

    // add a new purchase record
    $app->post('/purchase', function ($request, $response) {
        $vars = $request->getParsedBody();

        $user_id  = filter_var((int)$vars['user_id'], FILTER_VALIDATE_INT);
        $thing_id = filter_var((int)$vars['thing_id'], FILTER_VALIDATE_INT);

        // add purchase of item already in the user's list
        if (0 === $user_id || 0 === $thing_id) {
            // TODO calculate new numbers for predicted_replace_days
            // to start, just use the average of the predicted_replace_days
            $predicted_replace_days = 7;

            $purchase_id = filter_var((int)$vars['purchase_id'], FILTER_VALIDATE_INT);

            $ids = getThingAndUserIdsFromPurchaseId($purchase_id);

            if (NULL === $ids) {
                $status = NULL;
                $token = NULL;
            }
            else {
                $status = addPurchase($ids['user_id'], $ids['thing_id'], $predicted_replace_days);
                $token = generateToken($ids['user_id']);
            }
        }
        // add a new item to the user's list
        else {
            $estimated_number_of_days = filter_var((int)$vars['estimated_number_of_days'], FILTER_VALIDATE_INT);
            if (0 === $estimated_number_of_days) {
                $estimated_number_of_days = 7; // TODO put the default value in a constant somewhere
            }
            // user the user's estimate for the first prediction
            $predicted_replace_days = $estimated_number_of_days;

            $status = addPurchase($user_id, $thing_id, $estimated_number_of_days, $predicted_replace_days);
            $token = generateToken($user_id);
        }

        $data = array(
            'data' => array(
                'token'  => $token,
                'status' => $status,
            )
        );

        return $response->withJson($data);
    });
})->add(function ($request, $response, $next) {
    // middleware to authenticate tokens

    if ($request->isPost()) {
        $vars  = $request->getParsedBody();
        $token = $vars['token'];
    }
    else { // GET
        $route = $request->getAttribute('route');
        $token = $route->getArgument('token');
    }

    if (!validateToken($token)) {
        $error = array(
            'error' => 'Unauthorized',
            'status' => 401,
        );
        return $response->withJson($error)->withStatus(401);
    }

    return $next($request, $response);
});
