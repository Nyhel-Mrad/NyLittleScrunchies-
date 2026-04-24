(function () {
  function navLink(label, href, currentPage, pageKey) {
    const activeClass = currentPage === pageKey ? " active" : "";
    return `<li class="nav-item"><a class="nav-link${activeClass}" href="${href}">${label}</a></li>`;
  }

  function navbarTemplate(currentPage) {
    return `
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
          <a class="navbar-brand fw-bold fs-3" href="index.html">NyLittleWorld</a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavGlobal" aria-controls="navbarNavGlobal" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNavGlobal">
            <ul class="navbar-nav mx-auto">
              ${navLink("Accueil", "index.html", currentPage, "index")}
              ${navLink("Produits", "products.html", currentPage, "products")}
              ${navLink("Panier", "panier.html", currentPage, "panier")}
            </ul>
          </div>

          <div class="d-flex gap-3 align-items-center">
            <a href="products.html" class="text-dark" aria-label="Favoris"><i class="bi bi-heart"></i></a>
            <button id="cartIconBtn" class="btn btn-gold position-relative" type="button" aria-label="Panier">
              <i class="bi bi-bag"></i>
              <span id="cartCount" class="cart-badge">0</span>
            </button>
          </div>
        </div>
      </nav>
    `;
  }

  function resolvePageKey() {
    if (document.body && document.body.dataset && document.body.dataset.page) {
      return document.body.dataset.page;
    }

    const path = window.location.pathname.toLowerCase();
    if (path.includes("products")) return "products";
    if (path.includes("panier")) return "panier";
    if (path.includes("index")) return "index";
    return "";
  }

  function renderNavbarComponent() {
    const host = document.querySelector("[data-navbar-root]");
    if (!host) return;
    host.innerHTML = navbarTemplate(resolvePageKey());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNavbarComponent);
  } else {
    renderNavbarComponent();
  }
})();