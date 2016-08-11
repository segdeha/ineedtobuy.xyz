<?php
// Routes

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

/*
url(r'thing/(?P<barcode_number>[0-9]+)', views.barcode ),
url(r'things/(?P<user_id>\w+)', views.things_list),
url(r'purchase', views.purchase)
*/

$app->get('/api/thing/[{barcode}]', function ($request, $response, $args) {
    // return info about a thing
});

$app->get('/api/things/[{user_id}]', function ($request, $response, $args) {
    // return a list of the user's things
});
