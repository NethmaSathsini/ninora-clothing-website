<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

// Allow logged-in admins only
if (!isset($_SESSION["admin_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Admin login required."
    ]);
    exit;
}

// Accept POST requests only
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

require_once "db.php";

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
    $name === "" ||
    strlen($name) > 150 ||
    !in_array($category, $allowedCategories, true) ||
    $description === "" ||
    $image === "" ||
    strlen($image) > 255 ||
    $price === false ||
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
        "INSERT INTO products
         (product_name, category, description, price, image)
         VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $name,
        $category,
        $description,
        $price,
        $image
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Product added successfully.",
        "product_id" => (int) $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to save product."
    ]);
}