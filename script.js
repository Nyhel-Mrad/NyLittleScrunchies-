// PRODUITS (élargis avec stock et prix numériques)
const products = [
  { id: 1, name: "Scrunchie doux", price: 4, stock: 10, category: "scrunchies", image: "scrunchie.JPG", description: "Doux pour vos cheveux" },
  { id: 2, name: "Barrettes", price: 6, stock: 5, category: "barrettes", image: "barettes.JPG", description: "Élégance discrète" },
  { id: 3, name: "Set Satin Premium", price: 25, stock: 0, category: "sets", image: "set satinèè.JPG", description: "3 accessoires assortis" },
  { id: 4, name: "Scrunchie Soie", price: 5, stock: 8, category: "scrunchies", image: "https://placehold.co/400x400/f9e6e0/black?text=Scrunchie+Soie", description: "100% soie naturelle" },
  { id: 5, name: "Barrette Papillon", price: 7, stock: 12, category: "barrettes", image: "papillon.JPG", description: "Motif papillon" },
  { id: 6, name: "Set Nuit Magique", price: 35, stock: 3, category: "sets", image: "pack.JPG", description: "Pour des nuits douces" }
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

// AFFICHER LES PRODUITS (Optimisé pour le Layout Shift et le Stock)
function displayProducts(productsToShow = null, containerId = "productsContainer") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const productsToDisplay = productsToShow || products;

  if (productsToDisplay.length === 0) {
    container.innerHTML = `<div class="col-12 text-center"><p>Aucun produit trouvé</p></div>`;
    return;
  }

  const html = productsToDisplay.map(p => {
    const isOutOfStock = p.stock === 0;
    return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card-product">
        <span onclick="toggleFavorite(${p.id})" 
          class="heart ${favorites.includes(p.id) ? 'active' : ''}">
          <i class="bi bi-heart${favorites.includes(p.id) ? '-fill' : ''}"></i>
        </span>
        <div class="img-container" style="height: 280px; overflow: hidden;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="p-3">
          <h6 class="fw-bold">${p.name}</h6>
          <p class="small text-muted">${p.description}</p>
          <p class="price mb-2">${p.price}DT</p>
          <button onclick="addToCart(${p.id})" 
                  class="btn btn-gold w-100" 
                  ${isOutOfStock ? 'disabled' : ''}>
            <i class="bi ${isOutOfStock ? 'bi-x-circle' : 'bi-bag-plus'}"></i> 
            ${isOutOfStock ? 'Rupture de stock' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  `}).join("");

  container.innerHTML = html;
}

// FILTRE ET TRI
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

// AFFICHER LE PANIER (Correctif Bug présence éléments)
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

// ... (reste des fonctions addToCart, updateQuantity, showToast identiques)

// INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productsContainer")) {
    displayProducts();
    document.getElementById("filterCategory")?.addEventListener("change", filterProducts);
    document.getElementById("sortPrice")?.addEventListener("change", filterProducts);
  }
  
  if (document.getElementById("featuredProducts")) {
      displayFeaturedProducts();
  }

  displayCart();
  updateCartCount();
});