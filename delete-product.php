<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Admin login required."
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

require_once "db.php";

$productId = filter_var(
    $_POST["productId"] ?? null,
    FILTER_VALIDATE_INT
);

if ($productId === false || $productId === null || $productId <= 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid product ID."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "DELETE FROM products WHERE product_id = ?"
    );

    $stmt->execute([$productId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Product not found."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Product deleted successfully."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to delete product."
    ]);
}