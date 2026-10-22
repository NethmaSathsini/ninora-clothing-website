
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
