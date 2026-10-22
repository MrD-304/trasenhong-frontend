(function () {
  "use strict";

  const { PRODUCTS, CATEGORIES, TIKTOK_SHOP_URL, SHOW_PRICE } = window.TSH;
  const PAGE_SIZE = 9;

  const state = {
    category: "all",
    tag: "all",
    maxPrice: 1000000,
    search: "",
    sort: "default",
    page: 1,
  };

  const $ = (id) => document.getElementById(id);
  const productGrid = $("productGrid");
  const noResults = $("noResults");
  const resultCount = $("resultCount");
  const pagination = $("pagination");
  const activeFilters = $("activeFilters");

  const fmt = (n) => n.toLocaleString("vi-VN") + "₫";
  const catName = (slug) => CATEGORIES[slug] || slug;
  const emojis = ["🍵", "🌿", "🎁", "🌸", "🫖", "🌺", "🏆", "🫙"];
  const getEmoji = (id) => emojis[(id - 1) % emojis.length] || "🍵";
  const buyLink = (p) => p.tiktok || TIKTOK_SHOP_URL;
  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");

  // Ẩn bộ lọc giá nếu tắt hiển thị giá
  if (!SHOW_PRICE) $("priceRange")?.closest(".sidebar-block")?.remove();

  /* ---------- Lọc / sắp xếp / phân trang (chạy hoàn toàn trên trình duyệt) ---------- */
  function getFiltered() {
    const q = normalize(state.search);
    const list = PRODUCTS.filter(
      (p) =>
        (state.category === "all" || p.category === state.category) &&
        (state.tag === "all" || p.tags.includes(state.tag)) &&
        p.price <= state.maxPrice &&
        (!q || normalize(p.name + " " + p.desc).includes(q)),
    );
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "newest") list.sort((a, b) => b.id - a.id);
    else if (state.sort === "popular")
      list.sort(
        (a, b) =>
          b.tags.includes("bestseller") - a.tags.includes("bestseller") ||
          a.id - b.id,
      );
    return list;
  }

  function update() {
    const all = getFiltered();
    const rows = all.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
    render(rows, all.length);
    renderActiveFilters();
  }

  function updateCounts() {
    const allEl = $("count-all");
    if (allEl) allEl.textContent = PRODUCTS.length;
    Object.keys(CATEGORIES).forEach((slug) => {
      const el = $(`count-${slug}`);
      if (el)
        el.textContent = PRODUCTS.filter((p) => p.category === slug).length;
    });
  }

  /* ---------- Hiển thị ---------- */
  function priceHtml(p) {
    if (!SHOW_PRICE) return "";
    const discount = p.originalPrice
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;
    return `
      <div class="product-card__price">
        <span class="price-current">${fmt(p.price)}</span>
        ${p.originalPrice ? `<span class="price-original">${fmt(p.originalPrice)}</span>${discount ? `<span class="price-discount">-${discount}%</span>` : ""}` : ""}
      </div>`;
  }

  function renderCard(p) {
    const badges = p.tags
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
          <button class="product-card__quick" data-quick="${p.id}">
            <span class="material-symbols-outlined" aria-hidden="true">visibility</span> Xem nhanh
          </button>
        </div>
        <div class="product-card__body">
          <p class="product-card__cat">${catName(p.category)}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.desc}</p>
          <div class="product-card__stars"><span class="rating-count">${p.unit}</span></div>
          ${priceHtml(p)}
          <button class="btn-add-cart" data-buy="${p.id}">
            <span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            Mua trên TikTok Shop
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
      tags.push({ label: `Danh mục: ${catName(state.category)}`, key: "category" });
    if (state.tag !== "all")
      tags.push({ label: `Nhãn: ${state.tag}`, key: "tag" });
    if (SHOW_PRICE && state.maxPrice < 1000000)
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

  /* ---------- Xem nhanh ---------- */
  function closeModal() {
    $("quickViewOverlay").hidden = true;
    document.body.style.overflow = "";
  }

  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const discount = p.originalPrice
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;
    const detail = (p.detail || "")
      .split("\n")
      .filter(Boolean)
      .map((l) => `<li>${l}</li>`)
      .join("");

    $("modalContent").innerHTML = `
      <div class="modal-img-wrap">${
        p.images?.length
          ? `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
          : getEmoji(p.id)
      }</div>
      <div class="modal-info">
        <p class="modal-cat">${catName(p.category)}</p>
        <h2 class="modal-name">${p.name}</h2>
        <p class="rating-count" style="margin-bottom:10px">${p.unit}</p>
        ${
          SHOW_PRICE
            ? `<p class="modal-price">${fmt(p.price)}
          ${p.originalPrice ? `<del>${fmt(p.originalPrice)}</del> ${discount ? `<span class="price-discount">-${discount}%</span>` : ""}` : ""}
        </p>`
            : ""
        }
        <p class="modal-desc">${p.desc}</p>
        ${detail ? `<ul style="margin:0 0 16px;padding-left:18px;line-height:1.6;font-size:.92rem">${detail}</ul>` : ""}
        <button class="modal-add-btn" data-buy="${p.id}">
          <span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
          Mua trên TikTok Shop
        </button>
      </div>`;

    $("quickViewOverlay").hidden = false;
    document.body.style.overflow = "hidden";
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener("click", (e) => {
    const buy = e.target.closest("[data-buy]");
    const q = e.target.closest("[data-quick]");
    const pg = e.target.closest("[data-page]");
    const rmFilter = e.target.closest("[data-remove]");

    if (buy) {
      e.stopPropagation();
      const p = PRODUCTS.find((x) => x.id === +buy.dataset.buy);
      if (p) window.open(buyLink(p), "_blank", "noopener");
    }
    if (q) {
      e.stopPropagation();
      openModal(+q.dataset.quick);
    }
    if (pg && !e.target.disabled) {
      state.page = +pg.dataset.page;
      update();
      window.scrollTo({ top: $("shop").offsetTop - 100, behavior: "smooth" });
    }
    if (rmFilter) {
      const key = rmFilter.dataset.remove;
      if (key === "category") {
        state.category = "all";
        document
          .querySelectorAll(".category-btn")
          .forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
      }
      if (key === "tag") {
        state.tag = "all";
        document
          .querySelectorAll(".tag-filter")
          .forEach((b) => b.classList.toggle("active", b.dataset.tag === "all"));
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
      update();
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
      update();
    });
  });

  document.querySelectorAll(".tag-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tag-filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.tag = btn.dataset.tag;
      state.page = 1;
      update();
    });
  });

  document.querySelectorAll(".price-quick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".price-quick").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.maxPrice = +btn.dataset.max;
      $("priceRange").value = state.maxPrice;
      $("priceDisplay").textContent = fmt(state.maxPrice);
      state.page = 1;
      update();
    });
  });

  $("priceRange")?.addEventListener("input", (e) => {
    state.maxPrice = +e.target.value;
    $("priceDisplay").textContent = fmt(state.maxPrice);
    state.page = 1;
    update();
  });

  let searchTimer;
  $("searchInput").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = e.target.value.trim();
      state.page = 1;
      update();
    }, 250);
  });

  $("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    update();
  });

  $("resetFilter").addEventListener("click", () => {
    state.category = "all";
    state.tag = "all";
    state.maxPrice = 1000000;
    state.search = "";
    state.sort = "default";
    state.page = 1;
    if ($("priceRange")) {
      $("priceRange").value = 1000000;
      $("priceDisplay").textContent = "1.000.000₫";
    }
    $("searchInput").value = "";
    $("sortSelect").value = "default";
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
    document
      .querySelectorAll(".tag-filter")
      .forEach((b) => b.classList.toggle("active", b.dataset.tag === "all"));
    update();
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

  $("modalClose").addEventListener("click", closeModal);
  $("quickViewOverlay").addEventListener("click", (e) => {
    if (e.target === $("quickViewOverlay")) closeModal();
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
      if (!$("quickViewOverlay").hidden) closeModal();
      if (shopSidebar.classList.contains("open")) closeSidebar();
    }
  });

  // Hỗ trợ link từ footer: shop.html?cat=tra-moc
  const cat = new URLSearchParams(window.location.search).get("cat");
  if (cat && CATEGORIES[cat]) {
    state.category = cat;
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.category === cat));
  }

  updateCounts();
  update();
})();
