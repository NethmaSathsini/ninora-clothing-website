<?php
session_start();
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Invalid request method.");
}

$fullName = trim($_POST["fullName"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";
$confirmPassword = $_POST["confirmPassword"] ?? "";

if (
    $fullName === "" ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($password) < 8 ||
    $password !== $confirmPassword
) {
    exit("Invalid registration details.");
}

try {
    $check = $pdo->prepare(
        "SELECT customer_id FROM customers WHERE email = ?"
    );
    $check->execute([$email]);

    if ($check->fetch()) {
        exit("This email is already registered.");
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insert = $pdo->prepare(
        "INSERT INTO customers (full_name, email, password_hash)
         VALUES (?, ?, ?)"
    );

    $insert->execute([$fullName, $email, $passwordHash]);

    header("Location: login.html?registered=1");
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit("Registration failed. Please try again.");
}