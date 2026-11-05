<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Admin login required."
    ]);
    exit;
}

require_once "db.php";

try {
    $stmt = $pdo->query(
        "SELECT order_id, customer_id, customer_name,
                customer_phone, delivery_address,
                payment_method, total, status, order_date
         FROM orders
         ORDER BY order_id DESC"
    );

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        "message" => "Unable to load admin orders."
    ]);
}