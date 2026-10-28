
document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.getElementById("cart-count");

    // Display the initial cart item count
    if (cartCount) {
        cartCount.textContent = "0";
    }

    console.log("Ninora Home Page loaded successfully!");
});




/* Registration Form Validation */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Frontend validation completed
        alert("Registration form validated successfully! Redirecting to login.");

        // Redirect to login page
        window.location.href = "login.html";
    });
}


/*Login Form Validation*/

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            alert("Please enter a valid password.");
            return;
        }

        alert("Login form validated successfully!");
    });
}

/* Product Search and Filtering */

const productSearch = document.getElementById("productSearch");
const categorySelect = document.getElementById("categorySelect");

if (productSearch && categorySelect) {

    function filterProducts() {

        const productCards = document.querySelectorAll(".product-card");
        const noProductsMessage = document.getElementById("noProductsMessage");
let visibleProducts = 0;

        const searchText = productSearch.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;

        productCards.forEach(function (card) {

            const productName = card.querySelector("h3").textContent.toLowerCase();

            const productCategory = card.dataset.category;

            const matchesSearch = productName.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;

           if (matchesSearch && matchesCategory) {
                card.style.display = "";
            visibleProducts++;
            } else {
                card.style.display = "none";
            }

        });
    }

    productSearch.addEventListener("input", filterProducts);

    categorySelect.addEventListener("change", filterProducts);

    // Get selected category from Home Page URL
const urlParams = new URLSearchParams(window.location.search);
const categoryFromURL = urlParams.get("category");

if (categoryFromURL) {
    categorySelect.value = categoryFromURL;
    filterProducts();
}

    // Allows newly added products to be filtered
    window.filterNinoraProducts = filterProducts;

    // Apply category filter after the page has fully loaded
window.addEventListener("load", function () {
    const category = new URLSearchParams(window.location.search).get("category");

    if (category) {
        categorySelect.value = category;
        filterProducts();
    }
});
}

/*Dynamic Product Details*/

const products = [
    {
        id: 1,
        name: "Elegant Blouse",
        price: 2500,
        image: "images/image1.jpg",
        description: "A stylish and comfortable blouse for everyday wear."
    },
    {
        id: 2,
        name: "Casual Dress",
        price: 3800,
        image: "images/image2.jpg",
        description: "A comfortable and fashionable dress for casual occasions."
    },
    {
        id: 3,
        name: "Classic Top",
        price: 1950,
        image: "images/image3.jpg",
        description: "A simple and stylish top suitable for everyday outfits."
    },
    {
        id: 4,
        name: "Wide Leg Trousers",
        price: 3200,
        image: "images/image5.jpeg",
        description: "Comfortable wide leg trousers for a modern look."
    }
];


/* Get selected product from URL */

const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");
const adminProductIndex = urlParams.get("adminProduct");

let selectedProduct = null;

// Existing customer shop products
if (productId !== null) {

    selectedProduct = products.find(function (product) {
        return product.id === Number(productId);
    }) || null;

}

// Products added by admin
else if (adminProductIndex !== null) {

    const adminProducts = getAdminProducts();

    const index = Number(adminProductIndex);

    if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < adminProducts.length
    ) {

        const adminProduct = adminProducts[index];

        selectedProduct = {
            id: "admin-" + index,
            name: adminProduct.name,
            price: Number(adminProduct.price),
            image: adminProduct.image,
            description: adminProduct.description ||
                "Explore this stylish clothing item from Ninora."
        };
    }
}


// Get HTML elements
const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailDescription = document.getElementById("detailDescription");

// Display selected product details
if (detailImage && selectedProduct) {
    detailImage.src = selectedProduct.image;
    detailImage.alt = selectedProduct.name;

    detailName.textContent = selectedProduct.name;

    detailPrice.textContent =
        "Rs. " + selectedProduct.price.toLocaleString("en-US");

    detailDescription.textContent = selectedProduct.description;
} else if (detailImage) {
    detailName.textContent = "Product not found";
    detailImage.style.display = "none";
    detailPrice.textContent = "";
    detailDescription.textContent =
        "Please return to the products page and select a product.";
}


/*Add to Cart Functionality*/

const addToCartBtn = document.getElementById("addToCartBtn");

if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {

        const size = document.getElementById("productSize").value;
        const quantity = Number(
            document.getElementById("productQuantity").value
        );

        // Validate size
        if (size === "") {
            alert("Please select a size.");
            return;
        }

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            alert("Please enter a valid quantity.");
            return;
        }

        // Check selected product
        if (!selectedProduct) {
            alert("Product not found.");
            return;
        }

        // Create cart item
        const cartItem = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            size: size,
            quantity: quantity
        };

        // Get existing cart items
        const cart = JSON.parse(localStorage.getItem("ninoraCart")) || [];

        // Add new item
        cart.push(cartItem);

        // Save cart
        localStorage.setItem("ninoraCart", JSON.stringify(cart));

        alert("Product added to cart successfully!");
    });
}


/*Shopping Cart Functionality*/

const cartItemsContainer = document.getElementById("cartItems");

if (cartItemsContainer) {
    displayCart();
}

function getCart() {
    return JSON.parse(localStorage.getItem("ninoraCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("ninoraCart", JSON.stringify(cart));
}

function displayCart() {
    const cart = getCart();

    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartCount = document.getElementById("cart-count");

    cartItemsContainer.innerHTML = "";

    // Calculate cart quantity and total
    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        subtotal += price * quantity;
        totalQuantity += quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-details">
                <h3>${item.name}</h3>

                <p>Size: ${item.size}</p>

                <p class="cart-item-price">
                    Rs. ${(price * quantity).toLocaleString()}
                </p>

                <label>
                    Quantity:
                    <input
                        type="number"
                        class="cart-quantity"
                        min="1"
                        value="${quantity}"
                        data-index="${index}"
                    >
                </label>

                <br>

                <button
                    type="button"
                    class="remove-cart-btn"
                    data-index="${index}"
                >
                    Remove
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Update subtotal and total
    subtotalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;
    totalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    // Empty cart handling
    if (cart.length === 0) {
        emptyCartMessage.hidden = false;
        checkoutBtn.style.pointerEvents = "none";
        checkoutBtn.style.opacity = "0.5";
    } else {
        emptyCartMessage.hidden = true;
        checkoutBtn.style.pointerEvents = "auto";
        checkoutBtn.style.opacity = "1";
    }
}

// Handle quantity changes and remove buttons
if (cartItemsContainer) {

    cartItemsContainer.addEventListener("change", function(event) {
        if (event.target.classList.contains("cart-quantity")) {

            const index = Number(event.target.dataset.index);
            const quantity = Number(event.target.value);

            if (!Number.isInteger(quantity) || quantity < 1) {
                alert("Please enter a valid quantity.");
                displayCart();
                return;
            }

            const cart = getCart();
            cart[index].quantity = quantity;

            saveCart(cart);
            displayCart();
        }
    });

    cartItemsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("remove-cart-btn")) {

            const index = Number(event.target.dataset.index);
            const cart = getCart();

            cart.splice(index, 1);

            saveCart(cart);
            displayCart();
        }
    });
}


/*Checkout Order Summary*/

const checkoutItemsContainer = document.getElementById("checkoutItems");

if (checkoutItemsContainer) {
    displayCheckoutSummary();
}

function displayCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("ninoraCart")) || [];

    const checkoutTotal = document.getElementById("checkoutTotal");
    const placeOrderBtn = document.querySelector(".place-order-btn");

    checkoutItemsContainer.innerHTML = "";

    let total = 0;

    // Display each product
    cart.forEach((item) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        const itemTotal = price * quantity;

        total += itemTotal;

        const checkoutItem = document.createElement("div");
        checkoutItem.className = "checkout-item";

        const itemDetails = document.createElement("div");

        const itemName = document.createElement("p");
        itemName.textContent = `${item.name} (Size: ${item.size})`;

        const itemQuantity = document.createElement("p");
        itemQuantity.textContent = `Quantity: ${quantity}`;

        const itemPrice = document.createElement("p");
        itemPrice.className = "checkout-item-price";
        itemPrice.textContent = `Rs. ${itemTotal.toLocaleString()}`;

        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemQuantity);

        checkoutItem.appendChild(itemDetails);
        checkoutItem.appendChild(itemPrice);

        checkoutItemsContainer.appendChild(checkoutItem);
    });

    // Display total
    checkoutTotal.textContent = `Rs. ${total.toLocaleString()}`;

    // Disable order button when cart is empty
    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your shopping cart is empty.";

        checkoutItemsContainer.appendChild(emptyMessage);
        placeOrderBtn.disabled = true;
        placeOrderBtn.style.opacity = "0.5";
    } else {
        placeOrderBtn.disabled = false;
        placeOrderBtn.style.opacity = "1";
    }
}


/* ==============================
   Place Order Functionality
============================== */

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get cart products
        const cart = JSON.parse(localStorage.getItem("ninoraCart")) || [];

        if (cart.length === 0) {
            alert("Your shopping cart is empty.");
            return;
        }

        // Get customer details
        const customerName = document.getElementById("customerName").value.trim();
        const customerPhone = document.getElementById("customerPhone").value.trim();
        const deliveryAddress = document.getElementById("deliveryAddress").value.trim();

        const paymentMethod = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!customerName || !customerPhone || !deliveryAddress || !paymentMethod) {
            alert("Please complete all required fields.");
            return;
        }

        // Calculate order total
        const total = cart.reduce((sum, item) => {
            return sum + Number(item.price) * Number(item.quantity);
        }, 0);

        // Create order
        const order = {
            orderId: "NIN" + Date.now(),
            customerName: customerName,
            customerPhone: customerPhone,
            deliveryAddress: deliveryAddress,
            paymentMethod: paymentMethod.value,
            items: cart,
            total: total,
            status: "Pending",
            orderDate: new Date().toISOString()
        };

        // Save order for frontend testing
        const orders = JSON.parse(localStorage.getItem("ninoraOrders")) || [];

        orders.push(order);

        localStorage.setItem("ninoraOrders", JSON.stringify(orders));

        // Clear shopping cart
        localStorage.removeItem("ninoraCart");

        // Save latest order ID
        localStorage.setItem("ninoraLatestOrderId", order.orderId);

        // Go to confirmation page
        window.location.href = "order-confirmation.html";
    });
}


/*Order Confirmation Functionality*/

const confirmOrderId = document.getElementById("confirmOrderId");

if (confirmOrderId) {
    displayOrderConfirmation();
}

function displayOrderConfirmation() {

    const latestOrderId = localStorage.getItem("ninoraLatestOrderId");

    const orders = JSON.parse(
        localStorage.getItem("ninoraOrders")
    ) || [];

    // Find the latest order
    const order = orders.find(
        item => item.orderId === latestOrderId
    );

    if (!order) {
        document.querySelector(".confirmation-card h1").textContent =
            "Order Not Found";

        document.querySelector(".confirmation-message").textContent =
            "No order details are available.";

        document.querySelector(".confirmation-icon").style.display = "none";
        document.querySelector(".confirmation-details").style.display = "none";

        return;
    }

    // Display order details
    document.getElementById("confirmOrderId").textContent =
        order.orderId;

    document.getElementById("confirmOrderDate").textContent =
        new Date(order.orderDate).toLocaleDateString("en-GB");

    document.getElementById("confirmPaymentMethod").textContent =
        order.paymentMethod;

    document.getElementById("confirmOrderStatus").textContent =
        order.status;

    document.getElementById("confirmOrderTotal").textContent =
        "Rs. " + Number(order.total).toLocaleString();
}


/*My Orders Page Functionality*/

const ordersList = document.getElementById("ordersList");

if (ordersList) {
    displayMyOrders();
}

function displayMyOrders() {
    const orders = JSON.parse(
        localStorage.getItem("ninoraOrders")
    ) || [];

    const noOrdersMessage = document.getElementById("noOrdersMessage");

    ordersList.innerHTML = "";

    // Show empty message when there are no orders
    if (orders.length === 0) {
        noOrdersMessage.hidden = false;
        return;
    }

    noOrdersMessage.hidden = true;

    // Display newest orders first
    const sortedOrders = [...orders].reverse();

    sortedOrders.forEach((order) => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-card";

        // Order header
        const header = document.createElement("div");
        header.className = "order-card-header";

        const orderId = document.createElement("h3");
        orderId.textContent = `Order #${order.orderId}`;

        const orderDate = document.createElement("span");
        orderDate.className = "order-date";
        orderDate.textContent = new Date(order.orderDate)
            .toLocaleDateString("en-GB");

        header.appendChild(orderId);
        header.appendChild(orderDate);

        // Order information
        const info = document.createElement("div");
        info.className = "order-info";

        const total = document.createElement("p");
        total.textContent = `Total: Rs. ${Number(order.total).toLocaleString()}`;

        const payment = document.createElement("p");
        payment.textContent = `Payment: ${order.paymentMethod}`;

        const statusWrapper = document.createElement("p");
        statusWrapper.textContent = "Status: ";

        const status = document.createElement("span");
        status.className = "order-status";

        const statusName = String(order.status || "Pending");
        status.classList.add(statusName.toLowerCase());
        status.textContent = statusName;

        statusWrapper.appendChild(status);

        info.appendChild(total);
        info.appendChild(payment);
        info.appendChild(statusWrapper);

        // Ordered products
        const productsSection = document.createElement("div");
        productsSection.className = "order-products";

        const productsHeading = document.createElement("h4");
        productsHeading.textContent = "Ordered Products";

        productsSection.appendChild(productsHeading);

        order.items.forEach((item) => {
            const productRow = document.createElement("div");
            productRow.className = "order-product";

            const productName = document.createElement("span");
            productName.textContent =
                `${item.name} (Size: ${item.size}) × ${item.quantity}`;

            const productPrice = document.createElement("span");
            productPrice.textContent =
                `Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}`;

            productRow.appendChild(productName);
            productRow.appendChild(productPrice);

            productsSection.appendChild(productRow);
        });

        orderCard.appendChild(header);
        orderCard.appendChild(info);
        orderCard.appendChild(productsSection);

        ordersList.appendChild(orderCard);
    });
}


/*Admin Product Form Open / Close*/

const addProductBtn = document.getElementById("addProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");
const productFormSection = document.getElementById("productFormSection");
const adminProductForm = document.getElementById("adminProductForm");
const productFormTitle = document.getElementById("productFormTitle");
const editProductId = document.getElementById("editProductId");

// Open Add Product Form
if (addProductBtn && productFormSection && adminProductForm) {
    addProductBtn.addEventListener("click", function () {

        adminProductForm.reset();

        if (editProductId) {
            editProductId.value = "";
        }

        if (productFormTitle) {
            productFormTitle.textContent = "Add New Product";
        }

        productFormSection.hidden = false;
    });
}

// Close Product Form
if (cancelProductBtn && productFormSection && adminProductForm) {
    cancelProductBtn.addEventListener("click", function () {

        adminProductForm.reset();

        if (editProductId) {
            editProductId.value = "";
        }

        productFormSection.hidden = true;
    });
}


/*Admin Product Management*/

// Get saved admin products
function getAdminProducts() {
    return JSON.parse(
        localStorage.getItem("ninoraAdminProducts") || "[]"
    );
}

// Save admin products
function saveAdminProducts(products) {
    localStorage.setItem(
        "ninoraAdminProducts",
        JSON.stringify(products)
    );
}


 // Display products in admin table
function displayAdminProducts() {
    const tableBody = document.getElementById(
        "adminProductsTableBody"
    );

    if (!tableBody) return;

    const products = getAdminProducts();
    tableBody.innerHTML = "";

    if (products.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No products added yet.";

        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    products.forEach(function (product) {
        const row = document.createElement("tr");

        // Product image
        const imageCell = document.createElement("td");
        const image = document.createElement("img");

        image.src = product.image;
        image.alt = product.name;
        image.className = "admin-product-table-image";

        imageCell.appendChild(image);

        // Product name
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        // Category
        const categoryCell = document.createElement("td");
        categoryCell.textContent = product.category;

        // Price
        const priceCell = document.createElement("td");
        priceCell.textContent = Number(product.price).toFixed(2);

        // Description
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent =
            product.description || "No description";

        // Actions
        const actionsCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "admin-edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function () {
            editAdminProduct(product.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "admin-delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            deleteAdminProduct(product.id);
        });

        actionsCell.append(editBtn, deleteBtn);

        row.append(
            imageCell,
            nameCell,
            categoryCell,
            priceCell,
            descriptionCell,
            actionsCell
        );

        tableBody.appendChild(row);
    });
}

 // Add or update product
const productManagementForm = document.getElementById(
    "adminProductForm"
);

if (productManagementForm) {
    productManagementForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const idField = document.getElementById("editProductId");

        const name = document.getElementById("productName").value.trim();

        const price = Number(
            document.getElementById("productPrice").value
        );

        const category = document.getElementById("productCategory").value;

        const image = document.getElementById("productImage").value.trim();

        const description = document.getElementById(
            "productDescription"
        ).value.trim();

        // Validate product details
        if (
            !name ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !category ||
            !image ||
            !description
        ) {
            alert("Please enter valid product details.");
            return;
        }

        const products = getAdminProducts();
        const editingId = idField.value;

        if (editingId) {
            // Update existing product
            const product = products.find(
                item => String(item.id) === editingId
            );

            if (!product) {
                alert("Product not found.");
                return;
            }

            product.name = name;
            product.price = price;
            product.category = category;
            product.image = image;
            product.description = description;

            alert("Product updated successfully!");

        } else {
            // Add new product
            const newProduct = {
                id: "admin-" + Date.now() + "-" +
                    Math.random().toString(36).slice(2, 8),
                name: name,
                price: price,
                category: category,
                image: image,
                description: description
            };

            products.push(newProduct);

            alert("Product added successfully!");
        }

        // Save products to localStorage
        saveAdminProducts(products);
        displayAdminProducts();

        // Reset form
        productManagementForm.reset();
        idField.value = "";

        document.getElementById(
            "productFormSection"
        ).hidden = true;
    });
}

// Edit product
function editAdminProduct(productId) {
    const product = getAdminProducts().find(
        item => item.id === productId
    );

    if (!product) return;

    document.getElementById("editProductId").value =
        product.id;

    document.getElementById("productName").value =
        product.name;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productImage").value =
        product.image;

    document.getElementById("productDescription").value =
        product.description || "";

    document.getElementById("productFormTitle").textContent =
        "Edit Product";

    const formSection = document.getElementById(
        "productFormSection"
    );

    formSection.hidden = false;
    formSection.scrollIntoView({ behavior: "smooth" });
}

// Delete product
function deleteAdminProduct(productId) {
    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const products = getAdminProducts().filter(
        item => item.id !== productId
    );

    saveAdminProducts(products);
    displayAdminProducts();

    alert("Product deleted successfully!");
}

// Load admin products when page opens
displayAdminProducts();


/*Admin Manage Orders Functionality*/

// Get customer orders from localStorage
function getAdminOrders() {
    try {
        return JSON.parse(
            localStorage.getItem("ninoraOrders") || "[]"
        );
    } catch (error) {
        console.error("Error reading orders:", error);
        return [];
    }
}

// Save updated orders
function saveAdminOrders(orders) {
    localStorage.setItem(
        "ninoraOrders",
        JSON.stringify(orders)
    );
}

// Format order date
function formatAdminOrderDate(dateValue) {
    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString("en-GB");
}

// Display customer orders in admin table
function displayAdminOrders() {
    const tableBody = document.getElementById(
        "adminOrdersTableBody"
    );

    if (!tableBody) return;

    const orders = getAdminOrders().reverse();

    tableBody.innerHTML = "";

    if (orders.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No customer orders found.";

        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    orders.forEach(function (order) {
        const row = document.createElement("tr");

        function addCell(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
            return cell;
        }

        addCell(order.orderId);
        addCell(order.customerName);
        addCell(formatAdminOrderDate(order.orderDate));

        addCell(
            Number(order.total).toFixed(2)
        );

        addCell(order.paymentMethod);

        // Order status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        const status = order.status || "Pending";

        statusBadge.className =
            "admin-order-status " + status.toLowerCase();

        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // View Details button
        const actionsCell = document.createElement("td");

        const viewBtn = document.createElement("button");
        viewBtn.type = "button";
        viewBtn.className = "admin-view-order-btn";
        viewBtn.textContent = "View Details";

        viewBtn.addEventListener("click", function () {
            viewAdminOrderDetails(order.orderId);
        });

        actionsCell.appendChild(viewBtn);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// Display selected order details
function viewAdminOrderDetails(orderId) {
    const order = getAdminOrders().find(
        item => item.orderId === orderId
    );

    if (!order) {
        alert("Order not found.");
        return;
    }

    const detailsSection = document.getElementById(
        "adminOrderDetailsSection"
    );

    const detailsContent = document.getElementById(
        "adminOrderDetailsContent"
    );

    if (!detailsSection || !detailsContent) return;

    detailsContent.innerHTML = "";

    // Customer and order information
    const info = document.createElement("div");
    info.className = "admin-order-info";

    const information = [
        ["Order ID", order.orderId],
        ["Customer Name", order.customerName],
        ["Phone Number", order.customerPhone],
        ["Delivery Address", order.deliveryAddress],
        ["Order Date", formatAdminOrderDate(order.orderDate)],
        ["Payment Method", order.paymentMethod],
        ["Order Status", order.status || "Pending"],
        ["Total (LKR)", Number(order.total).toFixed(2)]
    ];

    information.forEach(function ([label, value]) {
        const paragraph = document.createElement("p");

        const strong = document.createElement("strong");
        strong.textContent = label + ": ";

        paragraph.appendChild(strong);
        paragraph.appendChild(
            document.createTextNode(String(value ?? "N/A"))
        );

        info.appendChild(paragraph);
    });

    detailsContent.appendChild(info);

    // Ordered products
    const productsSection = document.createElement("div");
    productsSection.className = "admin-order-products";

    const productsHeading = document.createElement("h3");
    productsHeading.textContent = "Ordered Products";

    productsSection.appendChild(productsHeading);

    (order.items || []).forEach(function (item) {
        const productRow = document.createElement("div");
        productRow.className = "admin-order-product-item";

        productRow.textContent =
            item.name +
            " | Size: " + (item.size || "N/A") +
            " | Quantity: " + item.quantity +
            " | LKR " +
            (Number(item.price) * Number(item.quantity)).toFixed(2);

        productsSection.appendChild(productRow);
    });

    detailsContent.appendChild(productsSection);

    // Update order status
    const updateSection = document.createElement("div");
    updateSection.className = "admin-update-status";

    const label = document.createElement("label");
    label.textContent = "Update Order Status";

    const statusSelect = document.createElement("select");

    const statuses = [
        "Pending",
        "Processing",
        "Dispatched",
        "Delivered",
        "Cancelled"
    ];

    statuses.forEach(function (status) {
        const option = document.createElement("option");

        option.value = status;
        option.textContent = status;

        statusSelect.appendChild(option);
    });

    statusSelect.value = order.status || "Pending";

    const updateBtn = document.createElement("button");
    updateBtn.type = "button";
    updateBtn.textContent = "Update Status";

    updateBtn.addEventListener("click", function () {
        updateAdminOrderStatus(
            order.orderId,
            statusSelect.value
        );
    });

    updateSection.appendChild(label);
    updateSection.appendChild(statusSelect);
    updateSection.appendChild(updateBtn);

    detailsContent.appendChild(updateSection);

    detailsSection.hidden = false;

    detailsSection.scrollIntoView({
        behavior: "smooth"
    });
}

// Update order status in localStorage
function updateAdminOrderStatus(orderId, newStatus) {
    const orders = getAdminOrders();

    const order = orders.find(
        item => item.orderId === orderId
    );

    if (!order) {
        alert("Order not found.");
        return;
    }

    const allowedStatuses = [
        "Pending",
        "Processing",
        "Dispatched",
        "Delivered",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(newStatus)) {
        alert("Invalid order status.");
        return;
    }

    order.status = newStatus;

    saveAdminOrders(orders);

    displayAdminOrders();
    viewAdminOrderDetails(orderId);

    alert("Order status updated successfully!");
}

// Close order details section
const closeOrderDetailsBtn = document.getElementById(
    "closeOrderDetailsBtn"
);

if (closeOrderDetailsBtn) {
    closeOrderDetailsBtn.addEventListener("click", function () {
        document.getElementById(
            "adminOrderDetailsSection"
        ).hidden = true;
    });
}

// Load customer orders when admin page opens
displayAdminOrders();


/*Admin Customer Details Functionality*/

function displayAdminCustomers() {

    const tableBody = document.getElementById(
        "adminCustomersTableBody"
    );

    // Run only on Admin Customer Details Page
    if (!tableBody) return;

    let orders = [];

    // Get customer orders
    try {
        const savedOrders = JSON.parse(
            localStorage.getItem("ninoraOrders") || "[]"
        );

        if (Array.isArray(savedOrders)) {
            orders = savedOrders;
        }

    } catch (error) {
        console.error("Error loading customer details:", error);
    }

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Show message if no orders exist
    if (orders.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "admin-customers-empty";
        cell.textContent = "No customer details found.";

        row.appendChild(cell);
        tableBody.appendChild(row);

        return;
    }

    // Display newest orders first
    orders.slice().reverse().forEach(function (order) {

        const row = document.createElement("tr");

        let orderDate = "N/A";

        if (order.orderDate) {
            const date = new Date(order.orderDate);

            if (!isNaN(date.getTime())) {
                orderDate = date.toLocaleDateString("en-GB");
            }
        }

        const customerDetails = [
            order.customerName || "N/A",
            order.customerPhone || "N/A",
            order.deliveryAddress || "N/A",
            order.orderId || "N/A",
            orderDate
        ];

        customerDetails.forEach(function (value) {

            const cell = document.createElement("td");

            // Safely display customer information
            cell.textContent = value;

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Load customer details when page opens
displayAdminCustomers();


/*Display Admin Products on Shop Page*/

function displayAdminProductsOnShop() {

    const productsGrid = document.getElementById("productsGrid");

    // Run only on Customer Products Page
    if (!productsGrid) return;

    let adminProducts = [];

    try {
        adminProducts = getAdminProducts();

        if (!Array.isArray(adminProducts)) {
            adminProducts = [];
        }

    } catch (error) {
        console.error("Error loading admin products:", error);
        return;
    }

    adminProducts.forEach(function (product, index) {

        const productCard = document.createElement("article");
        productCard.className = "product-card";

        // Normalize category for filtering
        const category = String(product.category || "")
            .toLowerCase()
            .replace(/[\s-]/g, "");

        productCard.dataset.category = category;

        // Product image
        const productImage = document.createElement("img");
        productImage.src = product.image || "images/placeholder.jpg";
        productImage.alt = product.name || "Clothing Product";

        // Product name
        const productName = document.createElement("h3");
        productName.textContent = product.name || "Unnamed Product";

        // Product price
        const productPrice = document.createElement("p");
        productPrice.className = "product-price";

        const price = Number(product.price);

        productPrice.textContent = Number.isFinite(price)
            ? "Rs. " + price.toLocaleString("en-LK")
            : "Price unavailable";

        // View Details link
        const detailsLink = document.createElement("a");
        detailsLink.className = "view-product-btn";
        detailsLink.textContent = "View Details";

        // Temporary admin product identifier
        detailsLink.href = "product-details.html?adminProduct=" + index;

        // Add elements to product card
        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(detailsLink);

        // Add card to products grid
        productsGrid.appendChild(productCard);

    });

    // Apply current search and category filter
    if (typeof window.filterNinoraProducts === "function") {
        window.filterNinoraProducts();
    }
}

// Display admin products when Shop Page opens
displayAdminProductsOnShop();
