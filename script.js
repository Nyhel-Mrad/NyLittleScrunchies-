// PRODUITS (élargis)
const products = [
  { id: 1, name: "Scrunchie doux", price: 4, category: "scrunchies", image: "scrunchie.JPG", description: "Doux pour vos cheveux" },
  { id: 2, name: "Barrettes", price: 6, category: "barrettes", image: "barettes.JPG", description: "Élégance discrète" },
  { id: 3, name: "Set Satin Premium", price: 25, category: "sets", image: "set satinèè.JPG", description: "3 accessoires assortis" },
  { id: 4, name: "Scrunchie Soie", price: 5, category: "scrunchies", image: "https://placehold.co/400x400/f9e6e0/black?text=Scrunchie+Soie", description: "100% soie naturelle" },
  { id: 5, name: "Barrette Papillon", price: 7, category: "barrettes", image: "papillon.JPG", description: "Motif papillon" },
  { id: 6, name: "Set Nuit Magique", price:35, category: "sets", image: "pack.JPG", description: "Pour des nuits douces" }
];

// STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Mettre à jour le compteur du panier
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.textContent = totalItems;
  }
}

// AFFICHER LES PRODUITS
function displayProducts(productsToShow = null, containerId = "productsContainer") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const productsToDisplay = productsToShow || products;

  if (productsToDisplay.length === 0 && containerId === "productsContainer") {
    container.innerHTML = `<div class="col-12 text-center"><p>Aucun produit trouvé</p></div>`;
    return;
  }

  const html = productsToDisplay.map(p => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card-product">
        <span onclick="toggleFavorite(${p.id})" 
          class="heart ${favorites.includes(p.id) ? 'active' : ''}">
          <i class="bi bi-heart${favorites.includes(p.id) ? '-fill' : ''}"></i>
        </span>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="p-3">
          <h6 class="fw-bold">${p.name}</h6>
          <p class="small text-muted">${p.description}</p>
          <p class="price mb-2">${p.price}DT</p>
          <button onclick="addToCart(${p.id})" class="btn btn-gold w-100">
            <i class="bi bi-bag-plus"></i> Ajouter
          </button>
        </div>
      </div>
    </div>
  `).join("");

  container.innerHTML = html;
}

// Afficher les produits en vedette sur l'accueil
function displayFeaturedProducts() {
  const featuredContainer = document.getElementById("featuredProducts");
  if (featuredContainer) {
    const featured = products.slice(0, 3);
    const html = featured.map(p => `
      <div class="col-md-4">
        <div class="card-product">
          <img src="${p.image}" alt="${p.name}">
          <div class="p-3 text-center">
            <h6>${p.name}</h6>
            <p class="price">${p.price}DT</p>
            <button onclick="addToCart(${p.id})" class="btn btn-sm btn-gold">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    `).join("");
    featuredContainer.innerHTML = html;
  }
}

// FILTRE
function filterProducts() {
  const filterValue = document.getElementById("filterCategory")?.value;
  const sortValue = document.getElementById("sortPrice")?.value;
  
  let filtered = [...products];
  
  if (filterValue && filterValue !== "all") {
    filtered = filtered.filter(p => p.category === filterValue);
  }
  
  if (sortValue === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }
  
  displayProducts(filtered);
}

// AJOUTER AU PANIER
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast();
}

// AFFICHER LE PANIER
function displayCart() {
  const container = document.getElementById("cartItems");
  const totalSpan = document.getElementById("cartTotal");
  const subtotalSpan = document.getElementById("cartSubtotal");
  const emptyCartDiv = document.getElementById("emptyCart");

  if (!container) return;

  if (cart.length === 0) {
    if (emptyCartDiv) emptyCartDiv.classList.remove("d-none");
    container.innerHTML = "";
    if (totalSpan) totalSpan.textContent = "0DT";
    if (subtotalSpan) subtotalSpan.textContent = "0DT";
    return;
  }

  if (emptyCartDiv) emptyCartDiv.classList.add("d-none");

  let total = 0;
  container.innerHTML = cart.map(item => {
    const qty = item.qty || 1;
    const itemTotal = item.price * qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p class="small text-muted mb-0">${item.price}DT x ${qty}</p>
        </div>
        <div>
          <span class="fw-bold me-3">${itemTotal}DT</span>
          <button onclick="updateQuantity(${item.id}, ${qty - 1})" class="btn btn-sm btn-outline-secondary">-</button>
          <span class="mx-2">${qty}</span>
          <button onclick="updateQuantity(${item.id}, ${qty + 1})" class="btn btn-sm btn-outline-secondary">+</button>
          <button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-danger ms-2">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");

  if (totalSpan) totalSpan.textContent = total + "DT";
  if (subtotalSpan) subtotalSpan.textContent = total + "DT";
}

// MODIFIER QUANTITÉ
function updateQuantity(id, newQty) {
  if (newQty <= 0) {
    removeFromCart(id);
    return;
  }
  
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
}

// SUPPRIMER DU PANIER
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// FAVORIS
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  
  // Rafraîchir l'affichage
  if (document.getElementById("productsContainer")) {
    filterProducts();
  }
  if (document.getElementById("featuredProducts")) {
    displayFeaturedProducts();
  }
}

// CHECKOUT
function checkout() {
  if (cart.length === 0) {
    alert("🛒 Votre panier est vide !");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  
  if (confirm(`💰 Total: ${total}€\n📦 Livraison offerte\n\nValider votre commande ?`)) {
    alert("🎉 Merci pour votre commande !\n📧 Vous recevrez un email de confirmation.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
    
    if (window.location.pathname.includes("panier")) {
      window.location.href = "index.html";
    }
  }
}

// TOAST NOTIFICATION
function showToast() {
  const toast = document.getElementById("cartToast");
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
  // Afficher les produits sur la page produits
  if (document.getElementById("productsContainer")) {
    displayProducts();
    
    const filterSelect = document.getElementById("filterCategory");
    const sortSelect = document.getElementById("sortPrice");
    
    if (filterSelect) filterSelect.addEventListener("change", filterProducts);
    if (sortSelect) sortSelect.addEventListener("change", filterProducts);
  }
  
  // Afficher les produits vedettes sur l'accueil
  displayFeaturedProducts();
  
  // Afficher le panier
  displayCart();
  updateCartCount();
  
  // Bouton panier dans la navbar
  const cartBtn = document.getElementById("cartIconBtn");
  if (cartBtn && !window.location.pathname.includes("panier")) {
    cartBtn.addEventListener("click", () => {
      window.location.href = "panier.html";
    });
  }
});