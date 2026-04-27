(function () {
  "use strict";

  const API_URL = "https://trasenhong-backend-production.up.railway.app/api";
  const PAGE_SIZE = 9;

  const state = {
    category: "all",
    tag: "all",
    maxPrice: 1000000,
    search: "",
    sort: "default",
    page: 1,
    total: 0,
  };

  let productsCache = [];
  let cart = JSON.parse(localStorage.getItem("tsh_cart") || "[]");

  const $ = (id) => document.getElementById(id);

  const productGrid = $("productGrid");
  const noResults = $("noResults");
  const resultCount = $("resultCount");
  const pagination = $("pagination");
  const activeFilters = $("activeFilters");
  const cartCount = $("cartCount");
  const cartItems = $("cartItems");
  const cartFooter = $("cartFooter");
  const cartSubtotal = $("cartSubtotal");
  const cartEmpty = $("cartEmpty");
  const toast = $("toast");

  const fmt = (n) => n.toLocaleString("vi-VN") + "₫";
  const stars = (r) => "★".repeat(r) + "☆".repeat(5 - r);
  const catName = (slug) =>
    ({
      "tra-moc": "Trà Mộc",
      "tra-tui-loc": "Trà Túi Lọc",
      "qua-tang": "Bộ Quà Tặng",
      "thanh-phan": "Thành Phần",
    })[slug] || slug;
  const emojis = [
    "🍵",
    "🌿",
    "🎁",
    "🌸",
    "🫖",
    "🌺",
    "🏆",
    "🫙",
    "🥢",
    "💚",
    "🧧",
    "🍯",
  ];
  const getEmoji = (id) => emojis[(id - 1) % emojis.length] || "🍵";

  function showLoading() {
    productGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--shop-text-muted)">
        <div style="font-size:2.5rem;margin-bottom:12px;animation:pulse 1.5s infinite">🍃</div>
        <p>Đang tải sản phẩm…</p>
      </div>`;
  }

  function showError() {
    productGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--shop-text-muted)">
        <div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>
        <p>Không thể tải sản phẩm. Kiểm tra backend đang chạy chưa?</p>
        <button onclick="location.reload()" style="margin-top:14px;padding:9px 22px;background:var(--shop-primary);border:none;border-radius:8px;cursor:pointer;color:#fff;font-weight:600">Thử lại</button>
      </div>`;
  }

  async function fetchProducts() {
    showLoading();
    const params = new URLSearchParams();
    params.set("page", state.page);
    params.set("limit", PAGE_SIZE);
    if (state.category !== "all") params.set("category", state.category);
    if (state.tag !== "all") params.set("tag", state.tag);
    if (state.search) params.set("search", state.search);
    if (state.maxPrice < 1000000) params.set("maxPrice", state.maxPrice);
    if (state.sort !== "default") params.set("sort", state.sort);

    try {
      const res = await fetch(`${API_URL}/products?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      productsCache = data.rows;
      state.total = data.total;
      render(data.rows, data.total);
      renderActiveFilters();
      updateCounts();
    } catch (err) {
      console.error("[shop] fetchProducts:", err);
      showError();
    }
  }

  async function updateCounts() {
    try {
      const res = await fetch(`${API_URL}/products/categories`);
      const data = await res.json();
      if (!data.success) return;

      const allEl = $("count-all");
      if (allEl) allEl.textContent = state.total;

      for (const cat of data.categories) {
        const el = $(`count-${cat.slug}`);
        if (!el) continue;
        const r = await fetch(
          `${API_URL}/products?category=${cat.slug}&limit=1`,
        );
        const d = await r.json();
        el.textContent = d.total || 0;
      }
    } catch {}
  }

  function renderCard(p) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const origPrice = p.original_price;
    const discount = origPrice
      ? Math.round((1 - p.price / origPrice) * 100)
      : 0;

    const badges = tags
      .map((t) => {
        if (t === "bestseller")
          return `<span class="badge badge--ban-chay">🔥 Bán chạy</span>`;
        if (t === "new") return `<span class="badge badge--moi">✨ Mới</span>`;
        if (t === "sale")
          return `<span class="badge badge--giam-gia">💚 Giảm</span>`;
        return "";
      })
      .join("");

    const imgHtml = p.images?.length
      ? `<img class="product-card__img" src="${p.images[0]}" alt="${p.name}" loading="lazy">`
      : `<div class="product-card__img-placeholder">${getEmoji(p.id)}</div>`;

    return `
      <div class="product-card" role="listitem" data-id="${p.id}">
        <div class="product-card__img-wrap">
          ${imgHtml}
          ${badges ? `<div class="product-card__badges">${badges}</div>` : ""}
          <button class="product-card__wish" aria-label="Yêu thích" data-wish="${p.id}">
            <i class="fa-regular fa-heart"></i>
          </button>
          <button class="product-card__quick" data-quick="${p.id}">
            <i class="fa-regular fa-eye"></i> Xem nhanh
          </button>
        </div>
        <div class="product-card__body">
          <p class="product-card__cat">${catName(p.category_slug)}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.description || ""}</p>
          <div class="product-card__stars">
            <span class="stars">${stars(5)}</span>
            <span class="rating-count">(${p.stock > 0 ? "Còn hàng" : "Hết hàng"})</span>
          </div>
          <div class="product-card__price">
            <span class="price-current">${fmt(p.price)}</span>
            ${origPrice ? `<span class="price-original">${fmt(origPrice)}</span><span class="price-discount">-${discount}%</span>` : ""}
          </div>
          <button class="btn-add-cart" data-add="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
            <i class="fa-solid fa-bag-shopping"></i>
            ${p.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>`;
  }

  function render(rows, total) {
    resultCount.textContent = total;
    if (!rows.length) {
      productGrid.innerHTML = "";
      noResults.hidden = false;
      pagination.innerHTML = "";
      return;
    }
    noResults.hidden = true;
    productGrid.innerHTML = rows.map(renderCard).join("");
    renderPagination(total);
  }

  function renderPagination(total) {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) {
      pagination.innerHTML = "";
      return;
    }
    let html = `<button class="page-btn page-btn--arrow" ${state.page === 1 ? "disabled" : ""} data-page="${state.page - 1}">‹</button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn ${i === state.page ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn page-btn--arrow" ${state.page === pages ? "disabled" : ""} data-page="${state.page + 1}">›</button>`;
    pagination.innerHTML = html;
  }

  function renderActiveFilters() {
    const tags = [];
    if (state.category !== "all")
      tags.push({
        label: `Danh mục: ${catName(state.category)}`,
        key: "category",
      });
    if (state.tag !== "all")
      tags.push({ label: `Nhãn: ${state.tag}`, key: "tag" });
    if (state.maxPrice < 1000000)
      tags.push({ label: `Giá ≤ ${fmt(state.maxPrice)}`, key: "price" });
    if (state.search)
      tags.push({ label: `Tìm: "${state.search}"`, key: "search" });
    activeFilters.innerHTML = tags
      .map(
        (t) =>
          `<span class="active-filter-tag">${t.label}<button aria-label="Xóa" data-remove="${t.key}">✕</button></span>`,
      )
      .join("");
  }

  function showToast(msg, type = "success") {
    toast.textContent = msg;
    toast.className = `toast toast--${type} show`;
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function saveCart() {
    localStorage.setItem("tsh_cart", JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(id) {
    const p = productsCache.find((x) => x.id === id);
    if (!p) return;
    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id,
        qty: 1,
        name: p.name,
        price: p.price,
        emoji: getEmoji(p.id),
      });
    }
    saveCart();
    showToast(`✅ Đã thêm "${p.name}" vào giỏ hàng`);
  }

  function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCount.textContent = total;
    cartCount.classList.add("bump");
    setTimeout(() => cartCount.classList.remove("bump"), 300);

    if (!cart.length) {
      cartItems.innerHTML = "";
      cartItems.appendChild(cartEmpty);
      cartFooter.hidden = true;
      return;
    }

    if (cartEmpty.parentNode) cartEmpty.remove();
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item__thumb">${item.emoji || "🍵"}</div>
        <div class="cart-item__info">
          <p class="cart-item__name">${item.name}</p>
          <p class="cart-item__price">${fmt(item.price)}</p>
          <div class="cart-item__controls">
            <button class="cart-qty-btn" data-dec="${item.id}">−</button>
            <span class="cart-item__qty">${item.qty}</span>
            <button class="cart-qty-btn" data-inc="${item.id}">+</button>
            <button class="cart-item__remove" data-rem="${item.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>`,
      )
      .join("");

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartSubtotal.textContent = fmt(subtotal);
    cartFooter.hidden = false;
  }

  function openModal(id) {
    const p = productsCache.find((x) => x.id === id);
    if (!p) return;
    const origPrice = p.original_price;
    const discount = origPrice
      ? Math.round((1 - p.price / origPrice) * 100)
      : 0;

    $("modalContent").innerHTML = `
      <div class="modal-img-wrap">${
        p.images?.length
          ? `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
          : getEmoji(p.id)
      }</div>
      <div class="modal-info">
        <p class="modal-cat">${catName(p.category_slug)}</p>
        <h2 class="modal-name">${p.name}</h2>
        <div class="product-card__stars">
          <span class="stars">${stars(5)}</span>
          <span class="rating-count">${p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Hết hàng"}</span>
        </div>
        <p class="modal-price">
          ${fmt(p.price)}
          ${origPrice ? `<del>${fmt(origPrice)}</del> <span class="price-discount">-${discount}%</span>` : ""}
        </p>
        <p class="modal-desc">${p.description || ""}</p>
        <div class="modal-qty">
          <label>Số lượng:</label>
          <div class="qty-wrap">
            <button class="qty-btn" id="qtyDec">−</button>
            <input class="qty-input" type="number" id="qtyInput" value="1" min="1" max="${p.stock}">
            <button class="qty-btn" id="qtyInc">+</button>
          </div>
        </div>
        <button class="modal-add-btn" id="modalAddBtn" ${p.stock === 0 ? "disabled" : ""}>
          <i class="fa-solid fa-bag-shopping"></i>
          ${p.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
        </button>
      </div>`;

    $("quickViewOverlay").hidden = false;
    document.body.style.overflow = "hidden";

    $("qtyDec").onclick = () => {
      const i = $("qtyInput");
      i.value = Math.max(1, +i.value - 1);
    };
    $("qtyInc").onclick = () => {
      const i = $("qtyInput");
      i.value = Math.min(p.stock || 99, +i.value + 1);
    };
    $("modalAddBtn").onclick = () => {
      const qty = +$("qtyInput").value;
      for (let i = 0; i < qty; i++) addToCart(id);
      $("quickViewOverlay").hidden = true;
      document.body.style.overflow = "";
    };
  }

  function openCart() {
    $("cartDrawer").classList.add("open");
    $("cartOverlay").classList.add("open");
    $("cartDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("cartDrawer").classList.remove("open");
    $("cartOverlay").classList.remove("open");
    $("cartDrawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add]");
    const q = e.target.closest("[data-quick]");
    const w = e.target.closest("[data-wish]");
    const pg = e.target.closest("[data-page]");
    const rm = e.target.closest("[data-rem]");
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rmFilter = e.target.closest("[data-remove]");

    if (t) {
      e.stopPropagation();
      addToCart(+t.dataset.add);
    }
    if (q) {
      e.stopPropagation();
      openModal(+q.dataset.quick);
    }
    if (w) {
      e.stopPropagation();
      w.classList.toggle("active");
      w.querySelector("i").className = w.classList.contains("active")
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";
    }
    if (pg && !e.target.disabled) {
      state.page = +pg.dataset.page;
      fetchProducts();
      window.scrollTo({ top: $("shop").offsetTop - 100, behavior: "smooth" });
    }
    if (rm) {
      cart = cart.filter((i) => i.id !== +rm.dataset.rem);
      saveCart();
    }
    if (inc) {
      const item = cart.find((i) => i.id === +inc.dataset.inc);
      if (item) {
        item.qty++;
        saveCart();
      }
    }
    if (dec) {
      const item = cart.find((i) => i.id === +dec.dataset.dec);
      if (item) {
        item.qty > 1
          ? item.qty--
          : (cart = cart.filter((i) => i.id !== item.id));
        saveCart();
      }
    }
    if (rmFilter) {
      const key = rmFilter.dataset.remove;
      if (key === "category") {
        state.category = "all";
        document
          .querySelectorAll(".category-btn")
          .forEach((b) =>
            b.classList.toggle("active", b.dataset.category === "all"),
          );
      }
      if (key === "tag") {
        state.tag = "all";
        document
          .querySelectorAll(".tag-filter")
          .forEach((b) =>
            b.classList.toggle("active", b.dataset.tag === "all"),
          );
      }
      if (key === "price") {
        state.maxPrice = 1000000;
        $("priceRange").value = 1000000;
        $("priceDisplay").textContent = "1.000.000₫";
      }
      if (key === "search") {
        state.search = "";
        $("searchInput").value = "";
      }
      state.page = 1;
      fetchProducts();
    }
  });

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      state.category = btn.dataset.category;
      state.page = 1;
      fetchProducts();
    });
  });

  document.querySelectorAll(".tag-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tag-filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.tag = btn.dataset.tag;
      state.page = 1;
      fetchProducts();
    });
  });

  document.querySelectorAll(".price-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".price-quick")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.maxPrice = +btn.dataset.max;
      $("priceRange").value = state.maxPrice;
      $("priceDisplay").textContent = fmt(state.maxPrice);
      state.page = 1;
      fetchProducts();
    });
  });

  $("priceRange").addEventListener("input", (e) => {
    state.maxPrice = +e.target.value;
    $("priceDisplay").textContent = fmt(state.maxPrice);
    state.page = 1;
    fetchProducts();
  });

  let searchTimer;
  $("searchInput").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = e.target.value.trim();
      state.page = 1;
      fetchProducts();
    }, 400);
  });

  $("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    fetchProducts();
  });

  $("resetFilter").addEventListener("click", () => {
    state.category = "all";
    state.tag = "all";
    state.maxPrice = 1000000;
    state.search = "";
    state.sort = "default";
    state.page = 1;
    $("priceRange").value = 1000000;
    $("priceDisplay").textContent = "1.000.000₫";
    $("searchInput").value = "";
    $("sortSelect").value = "default";
    document
      .querySelectorAll(".category-btn")
      .forEach((b) =>
        b.classList.toggle("active", b.dataset.category === "all"),
      );
    document
      .querySelectorAll(".tag-filter")
      .forEach((b) => b.classList.toggle("active", b.dataset.tag === "all"));
    fetchProducts();
  });

  $("gridView").addEventListener("click", () => {
    productGrid.classList.remove("list-mode");
    $("gridView").classList.add("active");
    $("listView").classList.remove("active");
    $("gridView").setAttribute("aria-pressed", "true");
    $("listView").setAttribute("aria-pressed", "false");
  });
  $("listView").addEventListener("click", () => {
    productGrid.classList.add("list-mode");
    $("listView").classList.add("active");
    $("gridView").classList.remove("active");
    $("listView").setAttribute("aria-pressed", "true");
    $("gridView").setAttribute("aria-pressed", "false");
  });

  $("cartToggle").addEventListener("click", openCart);
  $("cartClose").addEventListener("click", closeCart);
  $("cartOverlay").addEventListener("click", closeCart);
  $("continueShop")?.addEventListener("click", closeCart);

  $("modalClose").addEventListener("click", () => {
    $("quickViewOverlay").hidden = true;
    document.body.style.overflow = "";
  });
  $("quickViewOverlay").addEventListener("click", (e) => {
    if (e.target === $("quickViewOverlay")) {
      $("quickViewOverlay").hidden = true;
      document.body.style.overflow = "";
    }
  });

  const filterToggle = $("filterToggle");
  const shopSidebar = $("shopSidebar");
  const sidebarClose = $("sidebarClose");
  const sidebarOverlay = $("sidebarOverlay");

  const closeSidebar = () => {
    shopSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    document.body.style.overflow = "";
    filterToggle?.setAttribute("aria-expanded", "false");
  };

  filterToggle?.addEventListener("click", () => {
    shopSidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    filterToggle.setAttribute("aria-expanded", "true");
  });
  sidebarClose?.addEventListener("click", closeSidebar);
  sidebarOverlay?.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("quickViewOverlay").hidden) {
        $("quickViewOverlay").hidden = true;
        document.body.style.overflow = "";
      }
      if ($("cartDrawer").classList.contains("open")) closeCart();
      if (shopSidebar.classList.contains("open")) closeSidebar();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("cat")) {
    state.category = urlParams.get("cat");
    document
      .querySelectorAll(".category-btn")
      .forEach((b) =>
        b.classList.toggle("active", b.dataset.category === state.category),
      );
  }

  fetchProducts();
  updateCartUI();
})();
