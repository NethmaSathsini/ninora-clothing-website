<?php
session_start();
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Admin login required."
    ]);
    exit;
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$orderId = $data["orderId"] ?? null;
$newStatus = $data["status"] ?? null;

$allowedStatuses = [
    "Pending",
    "Processing",
    "Dispatched",
    "Delivered",
    "Cancelled"
];

if (
    !is_array($data) ||
    !filter_var($orderId, FILTER_VALIDATE_INT) ||
    (int) $orderId < 1 ||
    !in_array($newStatus, $allowedStatuses, true)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid order details."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE orders SET status = ? WHERE order_id = ?"
    );

    $stmt->execute([$newStatus, $orderId]);

    // Confirm the order exists
    $checkStmt = $pdo->prepare(
        "SELECT order_id FROM orders WHERE order_id = ?"
    );

    $checkStmt->execute([$orderId]);

    if (!$checkStmt->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Order not found."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Order status updated successfully."
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update order status."
    ]);
}