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

$name = trim($_POST["productName"] ?? "");
$category = trim($_POST["productCategory"] ?? "");
$description = trim($_POST["productDescription"] ?? "");
$image = trim($_POST["productImage"] ?? "");

$price = filter_var(
    $_POST["productPrice"] ?? null,
    FILTER_VALIDATE_FLOAT
);

$allowedCategories = [
    "Blouses", "Skirts", "Trousers",
    "Dresses", "T-Shirts", "Tops"
];

if (
    $productId === false ||
    $productId === null ||
    $productId <= 0 ||
    $name === "" ||
    strlen($name) > 150 ||
    !in_array($category, $allowedCategories, true) ||
    $description === "" ||
    $image === "" ||
    strlen($image) > 255 ||
    $price === false ||
    $price === null ||
    $price <= 0 ||
    $price > 99999999.99
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid product details."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE products
         SET product_name = ?,
             category = ?,
             description = ?,
             price = ?,
             image = ?
         WHERE product_id = ?"
    );

    $stmt->execute([
        $name,
        $category,
        $description,
        $price,
        $image,
        $productId
    ]);

    // Confirm product exists, even if no values changed
    $check = $pdo->prepare(
        "SELECT product_id FROM products WHERE product_id = ?"
    );
    $check->execute([$productId]);

    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Product not found."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Product updated successfully."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update product."
    ]);
}