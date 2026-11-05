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

try {
    // Get orders belonging to the logged-in customer
    $stmt = $pdo->prepare(
        "SELECT order_id, order_date, payment_method,
                total, status
         FROM orders
         WHERE customer_id = ?
         ORDER BY order_id DESC"
    );

    $stmt->execute([$_SESSION["customer_id"]]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get products belonging to each order
    $itemStmt = $pdo->prepare(
        "SELECT product_name, size, quantity, price
         FROM order_items
         WHERE order_id = ?
         ORDER BY order_item_id ASC"
    );

    foreach ($orders as &$order) {
        $itemStmt->execute([$order["order_id"]]);
        $order["items"] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
    }

    unset($order);

    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to load orders."
    ]);
}