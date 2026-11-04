<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

if (!isset($_SESSION["customer_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Please login first."]);
    exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid order data."]);
    exit;
}

$customerName = trim($data["customerName"] ?? "");
$customerPhone = trim($data["customerPhone"] ?? "");
$deliveryAddress = trim($data["deliveryAddress"] ?? "");
$paymentMethod = $data["paymentMethod"] ?? "";
$items = $data["items"] ?? [];

if (
    $customerName === "" ||
    $customerPhone === "" ||
    $deliveryAddress === "" ||
    !in_array($paymentMethod, ["COD", "Bank Transfer"], true) ||
    !is_array($items) ||
    count($items) === 0
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid order details."]);
    exit;
}

// Temporary integration step.
// Product prices must be verified against the database before production use.
http_response_code(501);
echo json_encode([
    "success" => false,
    "message" => "Order saving is not enabled yet."
]);