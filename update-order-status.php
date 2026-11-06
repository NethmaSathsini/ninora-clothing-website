
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

$orderId = is_array($data) ? ($data["orderId"] ?? null) : null;
$newStatus = is_array($data) ? ($data["status"] ?? null) : null;

$allowedTransitions = [
    "Pending" => ["Processing", "Cancelled"],
    "Processing" => ["Dispatched", "Cancelled"],
    "Dispatched" => ["Delivered"],
    "Delivered" => [],
    "Cancelled" => []
];

if (
    !filter_var($orderId, FILTER_VALIDATE_INT) ||
    (int) $orderId < 1 ||
    !is_string($newStatus) ||
    !array_key_exists($newStatus, $allowedTransitions)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid order details."
    ]);
    exit;
}

try {
    // Start transaction to prevent conflicting updates
    $pdo->beginTransaction();

    // Get current status and lock the order row
    $checkStmt = $pdo->prepare(
        "SELECT status FROM orders WHERE order_id = ? FOR UPDATE"
    );

    $checkStmt->execute([(int) $orderId]);
    $order = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        $pdo->rollBack();

        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Order not found."
        ]);
        exit;
    }

    $currentStatus = $order["status"];

    // Validate the requested status transition
    if (
        !isset($allowedTransitions[$currentStatus]) ||
        !in_array(
            $newStatus,
            $allowedTransitions[$currentStatus],
            true
        )
    ) {
        $pdo->rollBack();

        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" =>
                "Cannot change order status from " .
                $currentStatus . " to " . $newStatus . "."
        ]);
        exit;
    }

    // Update status only after validation
    $stmt = $pdo->prepare(
        "UPDATE orders SET status = ? WHERE order_id = ?"
    );

    $stmt->execute([$newStatus, (int) $orderId]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order status updated successfully."
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Unable to update order status."
    ]);
}
