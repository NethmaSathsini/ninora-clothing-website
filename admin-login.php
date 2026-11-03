<?php
session_start();

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: admin-login.html");
    exit;
}

$email = trim($_POST["adminEmail"] ?? "");
$password = $_POST["adminPassword"] ?? "";

if ($email === "" || $password === "") {
    header("Location: admin-login.html?error=1");
    exit;
}

$stmt = $pdo->prepare(
    "SELECT admin_id, email, password_hash
     FROM admins
     WHERE email = ?"
);

$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($admin && password_verify($password, $admin["password_hash"])) {

    session_regenerate_id(true);

    $_SESSION["admin_id"] = $admin["admin_id"];
    $_SESSION["admin_email"] = $admin["email"];

    header("Location: admin-dashboard.php");
    exit;

} else {
    header("Location: admin-login.html?error=1");
    exit;
}