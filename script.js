const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if ("bar") {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if ("close") {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// script.js

// 1. ADD TO CART FROM INDEX/SHOP PAGE
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".fa-plus.cart");

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = btn.closest(".pro");
      const image = product.querySelector("img").getAttribute("src");
      const name = product.querySelector("h5").innerText;
      const priceText = product.querySelector("h4").innerText;
      const price = parseFloat(priceText.replace("Rs.", "").replace(",", ""));

      const newItem = {
        name,
        price,
        image,
        quantity: 1
      };

      // Get cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if item already exists in cart
      const index = cart.findIndex((item) => item.name === newItem.name);
      if (index !== -1) {
        cart[index].quantity += 1; // increase quantity if already added
      } else {
        cart.push(newItem);
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Item added to cart!");
    });
  });

  // 2. RENDER CART PAGE
  if (window.location.href.includes("cart.html")) {
    renderCart();
  }
});

function renderCart() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach((item, i) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="#" class="remove" data-index="${i}"><i class="fa-regular fa-circle-xmark"></i></a></td>
      <td><img src="${item.image}" alt=""></td>
      <td>${item.name}</td>
      <td>Rs. ${item.price.toFixed(2)}</td>
      <td><input type="number" value="${item.quantity}" min="1" data-index="${i}" class="qty-input"></td>
      <td>Rs. ${subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });

  // Update total in cart summary
  const summary = document.querySelector(".subtotal table");
  if (summary) {
    summary.innerHTML = `
      <tr><td>Cart Subtotal</td><td>Rs. ${total.toFixed(2)}</td></tr>
      <tr><td>Shipping</td><td>Free</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>Rs. ${total.toFixed(2)}</strong></td></tr>
    `;
  }

  // Add remove listeners
  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = btn.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  // Quantity change
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = input.getAttribute("data-index");
      const newQty = parseInt(input.value);
      if (newQty > 0) {
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });
  });
}
