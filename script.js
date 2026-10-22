
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
