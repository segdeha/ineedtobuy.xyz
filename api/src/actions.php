<?php
// actions

$pdo = $app->getContainer()['db'];

function getListOfThingsFromUserId($user_id) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM things, purchases WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $things = $stmt->fetch(PDO::FETCH_ASSOC);

    return $things;
}

function getThingInfoFromBarcode($barcode) {
    global $pdo;

        $stmt = $pdo->prepare('SELECT * FROM things WHERE barcode = ?');
        $stmt->execute([$barcode]);
        $thing = $stmt->fetch(PDO::FETCH_ASSOC);

    return $thing;
}
