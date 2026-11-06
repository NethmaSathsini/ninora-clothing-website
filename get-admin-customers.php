
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
    $stmt = $pdo->prepare(
        "SELECT
            order_id,
            customer_name,
            customer_phone,
            delivery_address,
            order_date
         FROM orders
         ORDER BY order_id DESC"
    );

    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "customers" => $orders
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load customer details."
    ]);
}
