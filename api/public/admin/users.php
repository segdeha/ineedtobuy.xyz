<?php

// comment out this block to use in production
if ('0.0.0.0' !== $_SERVER['SERVER_NAME']) {
    header($_SERVER['SERVER_PROTOCOL'].' 404 Not Found');
    header('Location: /');
    exit;
}

define('BASE_DIR', '/usr/home/segdeha/apps/ineedtobuy.xyz');
$is_dev = $_SERVER['SERVER_NAME'] === '0.0.0.0';

// DEVELOPMENT
if ($is_dev) {
    require('../../src/app.php');
}
else {
    require(BASE_DIR . '/src/app.php');
}

// default form values
$user_id = '';
$user = array(
    'id' => '',
    'username' => '',
    'email' => '',
    'password' => '',
    'full_name' => '',
    'created_date' => '',
    'modified_date' => '',
    'last_login_date' => '',
);
$action = 'newuser';

if (isset($_GET['id'])) {
    $user_id = filter_var((int)$_GET['id'], FILTER_VALIDATE_INT);
    $user = getUserByUserId($user_id);
    $action = 'updateuser';
}
// update the user
else if (isset($_POST['action']) && 'updateuser' === $_POST['action']) {
    $user_id = filter_var((int)$_POST['id'], FILTER_VALIDATE_INT);

    // set up variables
    $full_name = trim($_POST['full_name']);
    $username = trim($_POST['username']);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $password = trim($_POST['password']);

    // if all are valid, do the update
    updateUser($user_id, $full_name, $username, $email, $password);

    header('Location: users.php');
}
// create a new user
else if (isset($_POST['action']) && 'newuser' === $_POST['action']) {
    // set up variables
    $full_name = trim($_POST['full_name']);
    $username = trim($_POST['username']);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $password = trim($_POST['password']);

    // if all are valid, do the insert
    addUser($full_name, $username, $email, $password);

    header('Location: users.php');
}

// do this last in case we just inserted or updated a user
$users = getUsers();

// echo '<pre>';var_dump($users);exit;

?><!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Manage Users : Admin : iNeedToBuy.XYZ</title>
        <style type="text/css">
        body {
            font: 200 14px/1.5 "Helvetica Neue", Sans-Serif;
        }
        a {
            color: blue;
            text-decoration: none;
        }
            a:hover {
                border-bottom: solid 1px blue;
            }
        form {
            padding-bottom: 1em;
        }
        label {
            display: inline-block;
            margin: 0 1em 1em 0;
        }
        table {
            border: solid 1px black;
        }
        th, td {
            padding: 0.25em 0.5em;
        }
        th {
            background: #eee;
        }
        </style>
    </head>
    <body>
        <h1><a href="users.php">Manage Users</a></h1>
        <hr>
        <h2>
<?php if ('updateuser' === $action): ?>
            Update User
<?php else: ?>
            Add User
<?php endif; ?>
        </h2>
        <form action="users.php" method="post">
            <input type="hidden" name="action" value="<?=$action?>">
            <input type="hidden" name="id" value="<?=$user['id']?>">
            <label>
                Username<br>
                <input type="text" name="username" value="<?=$user['username']?>">
            </label>
            <label>
                Email<br>
                <input type="text" name="email" value="<?=$user['email']?>">
            </label>
            <label>
                Full Name<br>
                <input type="text" name="full_name" value="<?=$user['full_name']?>">
            </label>
            <label>
                Password<?php if ('updateuser' === $action) { echo ' (Leave blank to keep the current password)'; } ?><br>
                <input type="text" name="" value="">
            </label>
            <div>
                <button type="submit">
<?php if ('updateuser' === $action): ?>
                    Update User
<?php else: ?>
                    Add User
<?php endif; ?>
                </button>
            </div>
        </form>
        <hr>
        <h2>Current Users</h2>
<?php if ($users): ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Created Date</th>
                <th>Last Login</th>
                <th>Actions</th>
            </tr>
    <?php foreach ($users as $user): ?>
            <tr>
                <td><?=$user['id']?></td>
                <td><?=$user['username']?></td>
                <td><?=$user['full_name']?></td>
                <td><?=$user['email']?></td>
                <td><?=$user['created_date']?></td>
                <td><?=$user['last_login_date']?></td>
                <td><a href="users.php?id=<?=$user['id']?>">Edit</a></td>
            </tr>
    <?php endforeach; ?>
        </table>
<?php else: ?>
        <p><em>No users in the system</em></p>
<?php endif; ?>
    </body>
</html>
