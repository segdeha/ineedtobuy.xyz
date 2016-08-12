<?php
// actions

require('helpers.php');

$pdo = $app->getContainer()['db'];

function getListOfThingsFromUserId($user_id) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM things, purchases WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $things = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $things;
}

function getThingInfoFromBarcode($barcode) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM things WHERE barcode = ?;');
    $stmt->execute([$barcode]);
    $thing = $stmt->fetch(PDO::FETCH_ASSOC);

    return $thing;
}

function addPurchase($user_id, $thing_id) {
    global $pdo;

    $estimated_number_of_days = 7;
    $predicted_replace_days = 7;

    $stmt = $pdo->prepare('INSERT into purchases (user_id, thing_id, estimated_number_of_days, predicted_replace_days) VALUES(?, ?, ?, ?);');
    $stmt->execute([$user_id, $thing_id, $estimated_number_of_days, $predicted_replace_days]);

    return 'OK';
}
