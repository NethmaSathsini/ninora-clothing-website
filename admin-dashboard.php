<?php
session_start();

if (!isset($_SESSION["admin_id"])) {
    header("Location: admin-login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Admin Dashboard | Ninora Clothing</title>

    <link rel="stylesheet" href="/ninora/style.css?v=19">
</head>
<body>

    <div class="admin-dashboard-layout">

        <!-- Sidebar -->
        <aside class="admin-sidebar">

            <div class="admin-sidebar-logo">
                <h2>NINORA</h2>
                <p>Admin Panel</p>
            </div>

            <nav class="admin-sidebar-nav">
                <a href="admin-dashboard.php" class="active">
                    Dashboard
                </a>

                <a href="admin-products.php">
                    Manage Products
                </a>

                <a href="admin-orders.php">
                    Manage Orders
                </a>

                <a href="admin-customers.php">
                    Customer Details
                </a>
            </nav>

            <div class="admin-sidebar-footer">
                <a href="index.html">Back to Website</a>
                <a href="admin-logout.php">Logout</a>
            </div>

        </aside>

        <!-- Main Dashboard Content -->
        <main class="admin-dashboard-main">

            <header class="admin-dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the Ninora Clothing Admin Panel.</p>
                </div>
            </header>

            <!-- Dashboard Cards -->
            <section class="admin-dashboard-cards">

                <div class="admin-dashboard-card">
                    <h3>Manage Products</h3>
                    <p>Add, edit, and remove clothing products.</p>
                    <a href="admin-products.php">
                        View Products
                    </a>
                </div>

                <div class="admin-dashboard-card">
                    <h3>Manage Orders</h3>
                    <p>View customer orders and update order status.</p>
                    <a href="admin-orders.php">
                        View Orders
                    </a>
                </div>

                <div class="admin-dashboard-card">
                    <h3>Customer Details</h3>
                    <p>View customer information related to orders.</p>
                    <a href="admin-customers.php">
                        View Customers
                    </a>
                </div>

            </section>

        </main>

    </div>

</body>
</html>
