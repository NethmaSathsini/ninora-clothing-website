
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

        alert("Registration form validated successfully!");
    });
}


/* ==============================
   Login Form Validation
============================== */

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


/*Product Search and Filtering*/

const productSearch = document.getElementById("productSearch");
const categorySelect = document.getElementById("categorySelect");

if (productSearch && categorySelect) {

    const productCards = document.querySelectorAll(".product-card");

    function filterProducts() {

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
            } else {
                card.style.display = "none";
            }

        });
    }

    productSearch.addEventListener("input", filterProducts);
    categorySelect.addEventListener("change", filterProducts);
}


/* ==============================
   Dynamic Product Details
============================== */

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

// Get product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get("id"));

// Find the selected product
const selectedProduct = products.find(function(product) {
    return product.id === productId;
});

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


/* ==============================
   Add to Cart Functionality
============================== */

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


/* ==============================
   Shopping Cart Functionality
============================== */

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


/* ==============================
   Checkout Order Summary
============================== */

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


/* ==============================
   Order Confirmation Functionality
============================== */

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


/* ==============================
   My Orders Page Functionality
============================== */

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


/* ==============================
   Admin Product Form Open / Close
============================== */

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
