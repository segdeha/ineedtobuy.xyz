<?php
// actions

$container = $app->getContainer();

$pdo = $container->get('db');
$api_key = $container->get('settings')['outpan'];

function getListOfThingsFromUserId($user_id) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM things, purchases WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $things = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $things;
}

function getThingFromDatabaseFromBarcode($barcode) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM things WHERE barcode = ?;');
    $stmt->execute([$barcode]);
    $thing = $stmt->fetch(PDO::FETCH_ASSOC);

    return $thing;
}

function getThingInfoFromBarcode($barcode) {
    global $pdo, $api_key;

    $thing = getThingFromDatabaseFromBarcode($barcode);

    /* invalid barcode response:
    {
        "error": {
            "code": 1003,
            "message": "Invalid GTIN."
        }
    }
    */
    /* valid barcode response
    {
        "gtin": "0027000488058",
        "outpan_url": "https:\/\/www.outpan.com\/view_product.php?barcode=0027000488058",
        "name": null,
        "attributes": {
            "Brand": "Orville Redenbacher's",
            "Net Weight": "30 oz"
        },
        "images": [],
        "videos": [],
        "categories": []
    }
    */
    // if no match, try to get it from outpan
    if (!$thing) {
        $url = "https://api.outpan.com/v2/products/$barcode?apikey=$api_key";
        $options = array(
            CURLOPT_URL            => $url,
            CURLOPT_HEADER         => false,
            CURLOPT_RETURNTRANSFER => true,
        );
        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $response = json_decode(curl_exec($ch));
        curl_close($ch);

        if (NULL === $response->error) {
            // add to database
            if (NULL !== $response->name) {
                $name = $response->name;
            }
            else {
                $name = $response->attributes->Brand;
            }

            if ($name) {
                $stmt = $pdo->prepare('INSERT INTO things (name, barcode) VALUES(?, ?);');
                $stmt->execute([$name, $barcode]);

                $thing = getThingFromDatabaseFromBarcode($barcode);
            }
        }
    }

    return $thing;
}

function addPurchase($user_id, $thing_id) {
    global $pdo;

    $estimated_number_of_days = 7;
    $predicted_replace_days = 7;

    $stmt = $pdo->prepare('INSERT INTO purchases (user_id, thing_id, estimated_number_of_days, predicted_replace_days) VALUES(?, ?, ?, ?);');
    $stmt->execute([$user_id, $thing_id, $estimated_number_of_days, $predicted_replace_days]);

    return 'OK';
}

function getUserFromUsername($username) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?;');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    return $user;
}

function updateLastLoginDateById($user_id) {
    global $pdo;

    $stmt = $pdo->prepare('UPDATE users SET last_login_date = CURRENT_TIMESTAMP WHERE id = ?;');

    return $stmt->execute([$user_id]);
}
