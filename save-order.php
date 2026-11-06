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
    !in_array($paymentMethod, ["Cash on Delivery", "Bank Transfer"], true) ||
    !is_array($items) ||
    count($items) === 0
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid order details."]);
    exit;
}

try {
    $pdo->beginTransaction();

    $total = 0;
    $validatedItems = [];

    foreach ($items as $item) {

        if (!is_array($item)) {
            throw new InvalidArgumentException("Invalid cart item.");
        }

        $cartId = $item["id"] ?? "";
        $quantity = filter_var(
            $item["quantity"] ?? null,
            FILTER_VALIDATE_INT
        );
        $size = $item["size"] ?? "";

        if (
            !is_string($cartId) ||
            !preg_match('/^db-([1-9][0-9]*)$/', $cartId, $matches) ||
            $quantity === false ||
            $quantity < 1 ||
            $quantity > 100 ||
            !is_string($size) ||
            !in_array($size, ["S", "M", "L", "XL"], true)
        ) {
            throw new InvalidArgumentException("Invalid cart item.");
        }

        $productId = (int) $matches[1];

        $stmt = $pdo->prepare(
            "SELECT product_name, price
             FROM products
             WHERE product_id = ?"
        );
        $stmt->execute([$productId]);

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new InvalidArgumentException("Product not found.");
        }

        $price = (float) $product["price"];

        $total += $price * $quantity;

        $validatedItems[] = [
            "name" => $product["product_name"],
            "price" => $price,
            "size" => $size,
            "quantity" => $quantity
        ];
    }

    $stmt = $pdo->prepare(
        "INSERT INTO orders
        (customer_id, customer_name, customer_phone,
         delivery_address, payment_method, total, status)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')"
    );

    $stmt->execute([
        $_SESSION["customer_id"],
        $customerName,
        $customerPhone,
        $deliveryAddress,
        $paymentMethod,
        $total
    ]);

    $orderId = $pdo->lastInsertId();

    $stmt = $pdo->prepare(
        "INSERT INTO order_items
        (order_id, product_name, size, quantity, price)
        VALUES (?, ?, ?, ?, ?)"
    );

    foreach ($validatedItems as $item) {
        $stmt->execute([
            $orderId,
            $item["name"],
            $item["size"],
            $item["quantity"],
            $item["price"]
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully.",
        "orderId" => (int) $orderId
    ]);

} catch (InvalidArgumentException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Unable to save order."
    ]);
}