/* =======================
   Datos demo de tienda
======================= */
const products = [
  {
    id: 1,
    name: "Smartwatch Neo",
    category: "Tecnología",
    price: 89.99,
    featured: 1,
    img: "Docs/Smartwatch Neon.jpg",
    alt: "Teléfono inteligente sobre una mesa, representando un producto tecnológico",
  },
  {
    id: 2,
    name: "Auriculares Pro",
    category: "Audio",
    price: 59.00,
    featured: 2,
    img: "Docs/auricular.jpg",
    alt: "Auriculares sobre un fondo claro, representando un producto de audio",
  },
  {
    id: 3,
    name: "Teclado Mecánico",
    category: "Periféricos",
    price: 49.50,
    featured: 3,
    img: "Docs/Teclado Mecanico.jpg",
    alt: "Teclado mecánico iluminado sobre escritorio",
  },
  {
    id: 4,
    name: "Mouse Ergonómico",
    category: "Periféricos",
    price: 24.90,
    featured: 4,
    img: "Docs/Mause Ergonomico.jpg",
    alt: "Mouse sobre una superficie oscura, representando periférico",
  },
  {
    id: 5,
    name: "Mochila Urbana",
    category: "Accesorios",
    price: 34.75,
    featured: 5,
    img: "Docs/Mochila Urbana.jpg",
    alt: "Mochila sobre una mesa, representando accesorio para uso diario",
  },
  {
    id: 6,
    name: "Botella Térmica",
    category: "Hogar",
    price: 12.90,
    featured: 6,
    img: "Docs/Botella Termica.jpg",
    alt: "Botella térmica metálica sobre fondo neutro",
  },
  {
    id: 7,
    name: "Lámpara LED",
    category: "Hogar",
    price: 16.75,
    featured: 7,
    img: "Docs/lampara de pie.jpg",
    alt: "Lámpara encendida iluminando un espacio interior",
  },
  {
    id: 8,
    name: "Silla de Oficina",
    category: "Hogar",
    price: 149.00,
    featured: 8,
    img: "Docs/Silla Ergonomica.jpg",
    alt: "Silla de oficina en un ambiente de trabajo",
  },
];

/* =======================
   Elementos UI
======================= */
const views = {
  inicio: document.querySelector("#view-inicio"),
  login: document.querySelector("#view-login"),
  tienda: document.querySelector("#view-tienda"),
};

const main = document.querySelector("#main");
const yearEl = document.querySelector("#year");
const themeToggle = document.querySelector("#themeToggle");
const cartCountEl = document.querySelector("#cartCount");

const loginForm = document.querySelector("#loginForm");
const loginErrorSummary = document.querySelector("#loginErrorSummary");

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");
const storeStatus = document.querySelector("#storeStatus");

const cartList = document.querySelector("#cartList");
const cartSubtotalEl = document.querySelector("#cartSubtotal");
const cartShippingEl = document.querySelector("#cartShipping");
const cartTotalEl = document.querySelector("#cartTotal");
const checkoutBtn = document.querySelector("#checkoutBtn");
const clearCartBtn = document.querySelector("#clearCartBtn");

const checkoutDialog = document.querySelector("#checkoutDialog");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutErrorSummary = document.querySelector("#checkoutErrorSummary");
const closeCheckout = document.querySelector("#closeCheckout");

const productDialog = document.querySelector("#productDialog");
const detailDesc = document.querySelector("#detail-desc");
const closeDetail = document.querySelector("#closeDetail");

/* =======================
   Estado (carrito)
======================= */
const cart = new Map(); // id -> qty

/* =======================
   Router
======================= */
function setView(name) {
  Object.entries(views).forEach(([k, el]) => (el.hidden = k !== name));
  main.focus({ preventScroll: false });
  window.scrollTo({ top: 0, behavior: "instant" });

  if (name === "tienda") {
    renderCatalog();
    renderCart();
  }
}
function getRoute() {
  const hash = location.hash || "#/inicio";
  const route = hash.replace("#/", "").trim();
  return ["inicio", "login", "tienda"].includes(route) ? route : "inicio";
}
function onRouteChange() { setView(getRoute()); }
window.addEventListener("hashchange", onRouteChange);

/* =======================
   Tema claro/oscuro
======================= */
function getStoredTheme() { return localStorage.getItem("theme") || "light"; }
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  themeToggle.textContent = `Modo: ${isDark ? "Oscuro" : "Claro"}`;
  localStorage.setItem("theme", theme);
}
themeToggle.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});

/* =======================
   Validación Login
======================= */
function setFieldError(input, message) {
  const errorEl = document.querySelector(`#${input.id}-error`);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message || "";
}
function clearLoginErrors() {
  ["email", "password"].forEach((id) => setFieldError(document.querySelector(`#${id}`), ""));
  loginErrorSummary.hidden = true;
  loginErrorSummary.textContent = "";
}
function validateLogin(form) {
  clearLoginErrors();
  const email = form.email;
  const password = form.password;
  let errors = [];

  if (!email.value.trim()) {
    const msg = "El correo es obligatorio.";
    setFieldError(email, msg); errors.push(msg);
  } else if (!email.checkValidity()) {
    const msg = "Ingresa un correo válido (ej: nombre@correo.com).";
    setFieldError(email, msg); errors.push(msg);
  }

  if (!password.value.trim()) {
    const msg = "La contraseña es obligatoria.";
    setFieldError(password, msg); errors.push(msg);
  } else if (password.value.length < 6) {
    const msg = "La contraseña debe tener al menos 6 caracteres.";
    setFieldError(password, msg); errors.push(msg);
  }

  if (errors.length) {
    loginErrorSummary.hidden = false;
    loginErrorSummary.textContent = `Revisa el formulario: ${errors.join(" ")}`;
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return false;
  }
  return true;
}
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateLogin(loginForm)) location.hash = "#/tienda";
});
loginForm?.addEventListener("reset", () => setTimeout(clearLoginErrors, 0));

/* =======================
   Catálogo (búsqueda/orden)
======================= */
function announceStatus(message) {
  storeStatus.hidden = false;
  storeStatus.textContent = message;
  // opcional: ocultar luego de un tiempo (sin romper lectores)
  setTimeout(() => { storeStatus.hidden = true; }, 1800);
}

function getFilteredSortedProducts() {
  const q = (searchInput?.value || "").toLowerCase().trim();
  let list = products.filter(p => p.name.toLowerCase().includes(q));

  const sort = sortSelect?.value || "featured";
  list.sort((a, b) => {
    if (sort === "featured") return a.featured - b.featured;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return list;
}

function renderCatalog() {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  const list = getFilteredSortedProducts();

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("aria-label", `Producto: ${p.name}`);

    card.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.alt)}" loading="lazy" />
      <div class="product-body">
        <h3 class="product-title">${escapeHtml(p.name)}</h3>
        <div class="product-meta">
          <span class="badge">${escapeHtml(p.category)}</span>
          <span class="price">$${p.price.toFixed(2)}</span>
        </div>
        <p class="muted">Entrega rápida (demo). Garantía incluida.</p>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary" type="button"
          data-action="add" data-id="${p.id}"
          aria-label="Agregar ${escapeHtml(p.name)} al carrito">
          Agregar
        </button>
        <button class="btn btn-secondary" type="button"
          data-action="detail" data-id="${p.id}"
          aria-label="Ver detalle de ${escapeHtml(p.name)}">
          Detalle
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

productGrid?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const p = products.find(x => x.id === id);
  if (!p) return;

  if (btn.dataset.action === "add") {
    addToCart(id, 1);
    announceStatus(`Agregado: ${p.name}.`);
  }

  if (btn.dataset.action === "detail") {
    detailDesc.textContent = `${p.name} — Categoría: ${p.category}. Precio: $${p.price.toFixed(2)}.`;
    productDialog.showModal();
    closeDetail.focus();
  }
});

closeDetail?.addEventListener("click", () => productDialog.close());
productDialog?.addEventListener("cancel", () => productDialog.close());

searchInput?.addEventListener("input", renderCatalog);
sortSelect?.addEventListener("change", renderCatalog);

/* =======================
   Carrito (add/remove/qty)
======================= */
function addToCart(id, qty) {
  const cur = cart.get(id) || 0;
  cart.set(id, cur + qty);
  renderCart();
}
function setQty(id, qty) {
  if (qty <= 0) cart.delete(id);
  else cart.set(id, qty);
  renderCart();
}
function clearCart() {
  cart.clear();
  renderCart();
  announceStatus("Carrito vaciado.");
}

function cartCount() {
  let total = 0;
  for (const qty of cart.values()) total += qty;
  return total;
}
function calcSubtotal() {
  let sum = 0;
  for (const [id, qty] of cart.entries()) {
    const p = products.find(x => x.id === id);
    if (p) sum += p.price * qty;
  }
  return sum;
}
function calcShipping(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= 80 ? 0 : 4.99; // demo
}

function renderCart() {
  // contador en header
  cartCountEl.textContent = String(cartCount());

  if (!cartList) return;
  cartList.innerHTML = "";

  if (cart.size === 0) {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `<p class="muted" style="margin:0;">Tu carrito está vacío. Agrega productos del catálogo.</p>`;
    cartList.appendChild(li);
  } else {
    for (const [id, qty] of cart.entries()) {
      const p = products.find(x => x.id === id);
      if (!p) continue;

      const li = document.createElement("li");
      li.className = "cart-item";

      li.innerHTML = `
        <div class="cart-row">
          <strong>${escapeHtml(p.name)}</strong>
          <span>$${(p.price * qty).toFixed(2)}</span>
        </div>
        <div class="cart-row">
          <span class="muted">${escapeHtml(p.category)}</span>
          <div class="qty-controls" role="group" aria-label="Controles de cantidad">
            <button class="btn btn-secondary" type="button"
              data-action="dec" data-id="${id}" aria-label="Disminuir cantidad de ${escapeHtml(p.name)}">-</button>
            <span class="qty" aria-live="polite" aria-label="Cantidad">${qty}</span>
            <button class="btn btn-secondary" type="button"
              data-action="inc" data-id="${id}" aria-label="Aumentar cantidad de ${escapeHtml(p.name)}">+</button>
            <button class="btn btn-secondary" type="button"
              data-action="remove" data-id="${id}" aria-label="Quitar ${escapeHtml(p.name)} del carrito">Quitar</button>
          </div>
        </div>
      `;
      cartList.appendChild(li);
    }
  }

  const subtotal = calcSubtotal();
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartShippingEl.textContent = shipping === 0 && subtotal > 0 ? "Gratis" : `$${shipping.toFixed(2)}`;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  // habilitar/deshabilitar checkout
  checkoutBtn.disabled = cart.size === 0;
  checkoutBtn.setAttribute("aria-disabled", String(cart.size === 0));
}

cartList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const cur = cart.get(id) || 0;

  if (btn.dataset.action === "inc") setQty(id, cur + 1);
  if (btn.dataset.action === "dec") setQty(id, cur - 1);
  if (btn.dataset.action === "remove") setQty(id, 0);
});

clearCartBtn?.addEventListener("click", clearCart);

/* =======================
   Checkout (modal + validación)
======================= */
function setCheckoutError(input, message) {
  const errorEl = document.querySelector(`#${input.id}-error`);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  errorEl.textContent = message || "";
}
function clearCheckoutErrors() {
  ["fullName", "address", "card"].forEach((id) => setCheckoutError(document.querySelector(`#${id}`), ""));
  checkoutErrorSummary.hidden = true;
  checkoutErrorSummary.textContent = "";
}

function validateCheckout(form) {
  clearCheckoutErrors();
  const fullName = form.fullName;
  const address = form.address;
  const card = form.card;

  let errors = [];

  if (!fullName.value.trim()) {
    const msg = "El nombre completo es obligatorio.";
    setCheckoutError(fullName, msg); errors.push(msg);
  }
  if (!address.value.trim()) {
    const msg = "La dirección es obligatoria.";
    setCheckoutError(address, msg); errors.push(msg);
  }
  const digits = card.value.replace(/\D/g, "");
  if (!digits) {
    const msg = "La tarjeta es obligatoria (demo).";
    setCheckoutError(card, msg); errors.push(msg);
  } else if (digits.length < 12) {
    const msg = "La tarjeta debe tener al menos 12 dígitos (demo).";
    setCheckoutError(card, msg); errors.push(msg);
  }

  if (errors.length) {
    checkoutErrorSummary.hidden = false;
    checkoutErrorSummary.textContent = `Revisa el formulario: ${errors.join(" ")}`;
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return false;
  }
  return true;
}

checkoutBtn?.addEventListener("click", () => {
  if (cart.size === 0) return;
  checkoutDialog.showModal();
  clearCheckoutErrors();
  // foco al primer campo
  document.querySelector("#fullName")?.focus();
});

closeCheckout?.addEventListener("click", () => checkoutDialog.close());
checkoutDialog?.addEventListener("cancel", () => checkoutDialog.close());

checkoutForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateCheckout(checkoutForm)) return;

  // Pago demo exitoso
  checkoutDialog.close();
  clearCart();
  announceStatus("Compra realizada (demo). ¡Gracias!");
});

/* =======================
   Utilidades
======================= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =======================
   Init
======================= */
yearEl.textContent = new Date().getFullYear();
applyTheme(getStoredTheme());
onRouteChange();
