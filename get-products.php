<?php
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";

try {
    $stmt = $pdo->query(
        "SELECT product_id, product_name, category,
                description, price, image
         FROM products
         ORDER BY product_id DESC"
    );

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "products" => $products
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to load products."
    ]);
}