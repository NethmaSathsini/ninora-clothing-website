<?php
session_start();

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Invalid request method.");
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === "") {
    exit("Please enter a valid email and password.");
}

try {
    $statement = $pdo->prepare(
        "SELECT customer_id, full_name, email, password_hash
         FROM customers
         WHERE email = ?"
    );

    $statement->execute([$email]);
    $customer = $statement->fetch(PDO::FETCH_ASSOC);

    if (
        !$customer ||
        !password_verify($password, $customer["password_hash"])
    ) {
        exit("Invalid email or password.");
    }

    // Create customer session
    session_regenerate_id(true);

    $_SESSION["customer_id"] = $customer["customer_id"];
    $_SESSION["customer_name"] = $customer["full_name"];
    $_SESSION["customer_email"] = $customer["email"];

    // Redirect after successful login
    header("Location: index.html");
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit("Login failed. Please try again.");
}