const catalog = typeof products !== "undefined" ? products : [];

// STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function formatDT(value) {
  return `${value}DT`;
}

function findProduct(productId) {
  return catalog.find(product => product.id === productId);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function showToast(message = "Produit ajouté au panier") {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  const textNode = toast.querySelector("span");
  if (textNode) {
    textNode.textContent = message;
  }

  toast.classList.add("show");
  window.clearTimeout(window.cartToastTimeout);
  window.cartToastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function animateCartIcon() {
  const cartIcon = document.getElementById("cartIconBtn");
  if (!cartIcon) return;

  cartIcon.classList.remove("cart-vibrate");
  void cartIcon.offsetWidth;
  cartIcon.classList.add("cart-vibrate");

  window.clearTimeout(window.cartIconTimeout);
  window.cartIconTimeout = window.setTimeout(() => {
    cartIcon.classList.remove("cart-vibrate");
  }, 500);
}

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

  const productsToDisplay = productsToShow || catalog;

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
          
          <a href="product-detail.html?id=${p.id}" class="text-decoration-none">
            <div class="img-container" style="height: 280px; overflow: hidden;">
                <img src="${p.image}" alt="${p.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </a>

          <div class="p-3">
            <a href="product-detail.html?id=${p.id}" class="text-decoration-none text-dark">
              <h6 class="fw-bold mb-1">${p.name}</h6>
            </a>
            
            <p class="small text-muted mb-2">${p.description}</p>
            <p class="price mb-3">${p.price}DT</p>
            
            <div class="d-flex flex-column gap-2">
              <a href="product-detail.html?id=${p.id}" class="btn btn-outline-dark btn-sm rounded-pill">
                <i class="bi bi-eye"></i> Voir détails
              </a>
              
              <button onclick="addToCart(${p.id})" 
                      class="btn btn-gold btn-sm w-100 rounded-pill" 
                      ${isOutOfStock ? 'disabled' : ''}>
                <i class="bi ${isOutOfStock ? 'bi-x-circle' : 'bi-bag-plus'}"></i> 
                ${isOutOfStock ? 'Rupture' : 'Ajouter'}
              </button>
            </div>
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
  
  let filtered = [...catalog];
  
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

function displayFeaturedProducts() {
  displayProducts(catalog.slice(0, 4), "featuredProducts");
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartCount();
  displayCart();
  showToast(`${product.name} ajouté au panier`);
  animateCartIcon();
}

function updateQuantity(productId, nextQuantity) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  if (nextQuantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].qty = nextQuantity;
  }

  saveCart();
  updateCartCount();
  displayCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  displayCart();
}

function toggleFavorite(productId) {
  if (favorites.includes(productId)) {
    favorites = favorites.filter(id => id !== productId);
  } else {
    favorites.push(productId);
  }

  saveFavorites();
  displayProducts();
  displayFeaturedProducts();
}

// AFFICHER LE PANIER
function displayCart() {
  const container = document.getElementById("cartItems");
  const totalSpan = document.getElementById("cartTotal");
  const subtotalSpan = document.getElementById("cartSubtotal");
  const shippingSpan = document.getElementById("cartShipping");
  const emptyCartDiv = document.getElementById("emptyCart");

  if (!container) return;

  if (cart.length === 0) {
    if (emptyCartDiv) emptyCartDiv.classList.remove("d-none");
    container.innerHTML = "";
    if (totalSpan) totalSpan.textContent = formatDT(0);
    if (subtotalSpan) subtotalSpan.textContent = formatDT(0);
    if (shippingSpan) shippingSpan.textContent = formatDT(0);
    return;
  }

  if (emptyCartDiv) emptyCartDiv.classList.add("d-none");

  let subtotal = 0;
  const rows = cart.map(item => {
    const qty = item.qty || 1;
    const itemTotal = item.price * qty;
    subtotal += itemTotal;
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="cart-thumb">
            <div>
              <div class="fw-semibold">${item.name}</div>
              <div class="text-muted small">Réf. #${item.id}</div>
            </div>
          </div>
        </td>
        <td class="text-nowrap">${formatDT(item.price)}</td>
        <td>
          <div class="quantity-control">
            <button type="button" class="btn btn-sm btn-outline-dark" onclick="updateQuantity(${item.id}, ${qty - 1})">-</button>
            <span class="fw-semibold">${qty}</span>
            <button type="button" class="btn btn-sm btn-outline-dark" onclick="updateQuantity(${item.id}, ${qty + 1})">+</button>
          </div>
        </td>
        <td class="fw-bold text-nowrap">${formatDT(itemTotal)}</td>
        <td class="text-end">
          <button type="button" onclick="removeFromCart(${item.id})" class="btn btn-sm btn-outline-danger">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  const shipping = subtotal > 100 ? 0 : 7;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="table-responsive cart-table-wrap">
      <table class="table align-middle table-borderless cart-table mb-0">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Total ligne</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  if (subtotalSpan) subtotalSpan.textContent = formatDT(subtotal);
  if (shippingSpan) shippingSpan.textContent = shipping === 0 ? "Offert" : formatDT(shipping);
  if (totalSpan) totalSpan.textContent = formatDT(total);
}

function checkout() {
  if (!cart.length) {
    showToast("Votre panier est vide");
    return;
  }

  showToast("Paiement simulé avec succès");
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartIconBtn");
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      window.location.href = "panier.html";
    });
  }

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
// 1. Récupérer le produit depuis l'URL
function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = products.find(p => p.id === productId);
  const container = document.getElementById("productDetailContainer");

  if (!product || !container) return;

  const isOutOfStock = product.stock === 0;

  container.innerHTML = `
    <div class="col-md-6 animate__animated animate__fadeIn">
      <div class="rounded overflow-hidden shadow-sm">
        <img src="${product.image}" class="img-fluid w-100" alt="${product.name}" style="min-height: 500px; object-fit: cover;">
      </div>
    </div>
    <div class="col-md-6">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="products.html" class="text-decoration-none">Boutique</a></li>
          <li class="breadcrumb-item active text-capitalize">${product.category}</li>
        </ol>
      </nav>
      <h1 class="fw-bold display-5">${product.name}</h1>
      <p class="fs-3 text-gold fw-bold mb-4">${product.price}DT</p>
      <hr>
      <p class="text-muted lead mb-4">${product.longDescription || product.description}</p>
      
      <div class="mb-4">
        <label class="form-label fw-bold">Quantité</label>
        <div class="d-flex align-items-center gap-3">
          <input type="number" id="detailQty" value="1" min="1" max="${product.stock}" class="form-control" style="width: 80px;">
          <span class="small text-muted">${product.stock} pièces disponibles</span>
        </div>
      </div>

      <button onclick="addToCartWithQty(${product.id})" class="btn btn-dark btn-lg w-100 py-3 mb-3" ${isOutOfStock ? 'disabled' : ''}>
        <i class="bi bi-bag-plus me-2"></i> ${isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
      </button>
      
      <div class="d-flex gap-3 text-muted small mt-4">
        <span><i class="bi bi-truck me-1"></i> Livraison 24/48h</span>
        <span><i class="bi bi-arrow-repeat me-1"></i> Retours gratuits</span>
      </div>
    </div>
  `;

  displayRelatedProducts(product);
}

// 2. Ajouter au panier avec quantité spécifique
function addToCartWithQty(id) {
  const qtyInput = document.getElementById("detailQty");
  const qty = parseInt(qtyInput.value) || 1;
  
  for(let i = 0; i < qty; i++) {
    addToCart(id); // Réutilise ta fonction existante
  }
}

// 3. Afficher les produits similaires
function displayRelatedProducts(currentProduct) {
  const container = document.getElementById("relatedProductsContainer");
  if (!container) return;

  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 3);

  displayProducts(related, "relatedProductsContainer");
}

// 4. Modifier displayProducts pour rendre les cartes cliquables
// Dans ta fonction displayProducts existante, modifie le lien de l'image et du titre :
/* Exemple de modification du HTML généré :
   <a href="product-detail.html?id=${p.id}" class="text-decoration-none text-dark">
      <h6 class="fw-bold">${p.name}</h6>
   </a>
*/

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("product-detail")) {
    loadProductDetails();
  }
});