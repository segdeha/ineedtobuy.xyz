<?php
// helper functions

define('HEADER', 'ineedtobuy.xyz');

function generateToken($user_id) {
    $username = getUsernameFromUserId($user_id);

    $header = HEADER;
    $payload = http_build_query(array(
        'username' => $username,
        'user_id' => $user_id,
        'expiry' => time() + (20 * 60), // 20 minutes
    ));
    $signature = PasswordStorage::create_hash($username);

    $joined = implode('||', array($header, $payload, $signature));
    $encoded = base64_encode($joined);
    return $encoded;
}

function validateToken($token) {
    $is_valid = false; // start off assuming the token is not valid

    $parsed = parseToken($token);

    if (NULL !== $parsed) {
        $payload = parseTokenPayload($parsed['payload']);

        if (NULL !== $payload) {
            // 123 - 124 = -1 // expiry in the future
            // 123 - 122 =  1 // expiry in the past
            $elapsed = time() - $payload['expiry'];

            $is_valid_header = HEADER === $parsed['header'];
            $has_not_expired = $elapsed < 0; // expiry in the future
            $is_valid_signature = PasswordStorage::verify_password($payload['username'], $parsed['signature']);

            $is_valid = $is_valid_header && $has_not_expired && $is_valid_signature;
        }
    }

    return $is_valid;
}

function parseToken($token) {
    $decoded = base64_decode($token);
    $split = explode('||', $decoded);

    if (3 === count($split)) {
        $header = $split[0];
        $payload = $split[1];
        $signature = $split[2];

        return array(
            'header' => $header,
            'payload' => $payload,
            'signature' => $signature,
        );
    }
    else {
        return NULL;
    }
}

function parseTokenPayload($payload) {
    parse_str($payload, $parsed);

    if (!isset($parsed['user_id']) || !isset($parsed['expiry'])) {
        return NULL;
    }

    return array(
        'username' => (string)$parsed['username'],
        'user_id' => (int)$parsed['user_id'],
        'expiry' => (int)$parsed['expiry'],
    );
}

function getUserIdFromToken($token) {
    $parsed = parseToken($token);

    if (NULL !== $parsed) {
        $payload = parseTokenPayload($parsed['payload']);

        if (NULL !== $payload) {
            return $payload['user_id'];
        }
        else {
            return NULL;
        }
    }
}
