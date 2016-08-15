<?php
// helper functions

function generateToken($username, $user_id) {
    $header = 'ineedtobuy.xyz';
    $payload = 'user_id=' . $user_id . '&expiry=' . (time() + (20 * 60)); // 20 minutes
    $signature = PasswordStorage::create_hash($username);
    $joined = implode('||', array($header, $payload, $signature));
    $encoded = base64_encode($joined);
    return $encoded;
}

function validateToken($username, $token) {
    $decoded = base64_decode($token);
    $split = explode('||');
    $signature = $split[2];
    $is_valid = PasswordStorage::verify_password($signature, $username);
    return $is_valid;
}

// based on http://stackoverflow.com/a/36297417/11577
function dateDifference($time) {
    $time = time() - $time; // to get the time since that moment
    $time = $time < 1 ? 1 : $time;
    $tokens = array (
        31536000 => 'year',
         2592000 => 'month',
          604800 => 'week',
           86400 => 'day',
            3600 => 'hour',
              60 => 'minute',
               1 => 'second'
    );
    foreach ($tokens as $unit => $text) {
        if ($time < $unit) {
            continue;
        }
        $numberOfUnits = floor($time / $unit);
        return $numberOfUnits . ' ' . $text . ($numberOfUnits > 1 ? 's' : '');
    }
}

function addLastPurchased($thing) {
    date_default_timezone_set('America/Los_Angeles');
    $thing['last_purchased'] = dateDifference(strtotime($thing['purchase_date']));
    return $thing;
}
