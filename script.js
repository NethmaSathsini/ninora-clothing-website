
document.addEventListener("DOMContentLoaded", function () {
    const cartCount = document.getElementById("cart-count");

    // Display the initial cart item count
    if (cartCount) {
        cartCount.textContent = "0";
    }

    console.log("Ninora Home Page loaded successfully!");
});
