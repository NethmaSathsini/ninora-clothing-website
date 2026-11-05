<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["customer_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);
    exit;
}

require_once "db.php";

$orderId = filter_input(
    INPUT_GET,
    "orderId",
    FILTER_VALIDATE_INT
);

if (!$orderId || $orderId < 1) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid order ID."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "SELECT order_id, order_date, payment_method,
                status, total
         FROM orders
         WHERE order_id = ?
         AND customer_id = ?"
    );

    $stmt->execute([
        $orderId,
        $_SESSION["customer_id"]
    ]);

    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Order not found."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "order" => $order
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load order details."
    ]);
}