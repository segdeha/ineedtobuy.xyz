<?php

require('PasswordStorage.php');

$pdo = call_user_func(function () {
    $pdo = new PDO('mysql:host=db154.pair.com;dbname=segdeha_ineedtobuyxyz', 'segdeha_23', 'jqQhzv9C');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
});

function getUsers() {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM users WHERE 1 = 1;');
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $users;
}

function getUserByUserId($user_id) {
    global $pdo;

    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?;');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    return $user;
}

function addUser($full_name, $username, $email, $password) {
    global $pdo;

    $hashed_password = PasswordStorage::create_hash($password);

    $stmt = $pdo->prepare('INSERT INTO users (full_name, username, email, password) VALUES(?, ?, ?, ?);');
    $stmt->execute([$full_name, $username, $email, $hashed_password]);

    return $pdo->lastInsertId();
}

function updateUser($user_id, $full_name, $username, $email, $password) {
    global $pdo;

    // enforce minimum password length
    if (strlen($password) < 6) {
        $stmt = $pdo->prepare('UPDATE users SET full_name = ?, username = ?, email = ? WHERE id = ?;');
        return $stmt->execute([$full_name, $username, $email, $user_id]);
    }
    else {
        $hashed_password = PasswordStorage::create_hash($password);

        $stmt = $pdo->prepare('UPDATE users SET full_name = ?, username = ?, email = ?, password = ? WHERE id = ?;');
        return $stmt->execute([$full_name, $username, $email, $hashed_password, $user_id]);
    }
}
