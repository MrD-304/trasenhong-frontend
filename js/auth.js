(function () {
  "use strict";

  // ── Inject CSS một lần ──────────────────────────────────
  if (!document.getElementById("tshAuthStyle")) {
    const s = document.createElement("style");
    s.id = "tshAuthStyle";
    s.textContent = `
      @keyframes tshFadeIn {
        from { opacity:0; transform:translateY(6px); }
        to   { opacity:1; transform:translateY(0); }
      }
      .tsh-nav-btn {
        display:inline-flex;align-items:center;gap:7px;
        background:rgba(106,184,42,.15);
        border:1.5px solid rgba(106,184,42,.4);
        border-radius:30px;
        padding:5px 13px 5px 7px;
        cursor:pointer;
        font-family:inherit;font-size:.82rem;font-weight:700;
        color:#1a2e1a;transition:.2s;white-space:nowrap;
      }
      .tsh-nav-btn:hover { background:rgba(106,184,42,.28); }
      .tsh-avatar-sm {
        width:28px;height:28px;
        background:#6ab82a;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:800;font-size:.82rem;flex-shrink:0;
      }
      .tsh-dropdown {
        position:absolute;top:calc(100% + 10px);right:0;
        background:#fff;border-radius:14px;
        box-shadow:0 8px 36px rgba(0,0,0,.15);
        min-width:210px;overflow:hidden;
        z-index:9999;border:1px solid #d4e8c2;
        animation:tshFadeIn .18s ease;
      }
      .tsh-dropdown-head {
        padding:13px 16px;border-bottom:1px solid #eaf2e0;background:#fafcf8;
      }
      .tsh-dropdown-head strong { display:block;font-size:.88rem;color:#1a2e1a; }
      .tsh-dropdown-head span   { font-size:.72rem;color:#6b7c6b; }
      .tsh-dropdown a {
        display:flex;align-items:center;gap:10px;
        padding:11px 16px;text-decoration:none;
        color:#2c3e2c;font-size:.84rem;font-weight:500;
        transition:background .15s;
      }
      .tsh-dropdown a:hover       { background:#f0f9e8; }
      .tsh-dropdown-admin         { color:#3949ab!important;font-weight:700!important;border-top:1px solid #eaf2e0; }
      .tsh-dropdown-admin:hover   { background:#e8eaf6!important; }
      .tsh-dropdown-logout {
        display:flex;align-items:center;gap:10px;
        padding:11px 16px;width:100%;
        border:none;background:none;
        color:#e53935;font-size:.84rem;font-weight:600;
        cursor:pointer;font-family:inherit;
        border-top:1px solid #eaf2e0;transition:background .15s;
      }
      .tsh-dropdown-logout:hover  { background:#fff5f5; }
      .tsh-login-btn {
        display:inline-flex;align-items:center;gap:6px;
        padding:6px 16px;background:#6ab82a;color:#fff;
        border-radius:30px;text-decoration:none;
        font-size:.82rem;font-weight:700;transition:.2s;white-space:nowrap;
      }
      .tsh-login-btn:hover { background:#4e9a1a; }
    `;
    document.head.appendChild(s);
  }

  // ── Helpers ─────────────────────────────────────────────
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("tsh_user"));
    } catch {
      return null;
    }
  };
  const getToken = () => localStorage.getItem("tsh_token");

  // ── Render navbar ────────────────────────────────────────
  function renderNavUser() {
    const area = document.getElementById("navUserArea");
    const areaMobile = document.getElementById("navUserAreaMobile");
    if (!area) return;

    const user = getUser();
    const token = getToken();

    if (user && token) {
      // ĐÃ ĐĂNG NHẬP
      const initial = (user.full_name || user.email || "U")
        .charAt(0)
        .toUpperCase();
      const lastName =
        (user.full_name || "").trim().split(" ").pop() || "Tài khoản";

      const wrap = document.createElement("div");
      wrap.id = "userDropdownWrap";
      wrap.style.position = "relative";
      wrap.innerHTML = `
        <button class="tsh-nav-btn" onclick="tshToggleMenu()" id="userDropdownBtn" aria-haspopup="true" aria-expanded="false">
          <div class="tsh-avatar-sm">${initial}</div>
          ${lastName} ▾
        </button>
        <div class="tsh-dropdown" id="userDropdownMenu" style="display:none">
          <div class="tsh-dropdown-head">
            <strong>${user.full_name || "Bạn"}</strong>
            <span>${user.email || ""}</span>
          </div>
          <a href="profile.html">👤 Tài khoản của tôi</a>
          <a href="profile.html#orders"> Đơn hàng của tôi</a>
          ${
            user.role === "admin"
              ? `<a href="admin.html" class="tsh-dropdown-admin">⚙️ Trang Quản Trị</a>`
              : ""
          }
          <button class="tsh-dropdown-logout" onclick="tshLogout()">⏻ Đăng xuất</button>
        </div>`;
      area.innerHTML = "";
      area.appendChild(wrap);

      // Mobile
      if (areaMobile) {
        areaMobile.innerHTML = `
          <a href="profile.html" class="navbar__link" style="border-top:1px solid rgba(255,255,255,.12);margin-top:6px;padding-top:12px">
            👤 ${lastName}
          </a>
          <a href="profile.html#orders" class="navbar__link">📦 Đơn hàng</a>
          ${user.role === "admin" ? `<a href="admin.html" class="navbar__link" style="color:#6ab82a;font-weight:700">⚙️ Quản trị</a>` : ""}
          <button onclick="tshLogout()" style="background:none;border:none;color:#e53935;font-size:.88rem;font-weight:600;cursor:pointer;padding:10px 0;font-family:inherit;text-align:left;display:block;width:100%">
            ⏻ Đăng xuất
          </button>`;
      }
    } else {
      // CHƯA ĐĂNG NHẬP
      area.innerHTML = `<a href="login.html" class="tsh-login-btn"> Đăng Nhập</a>`;
      if (areaMobile) {
        areaMobile.innerHTML = `
          <a href="login.html" class="navbar__link" style="color:#6ab82a;font-weight:700;border-top:1px solid rgba(255,255,255,.12);margin-top:6px;padding-top:12px">
             Đăng Nhập / Đăng Ký
          </a>`;
      }
    }
  }

  // ── Toggle dropdown ──────────────────────────────────────
  window.tshToggleMenu = function () {
    const menu = document.getElementById("userDropdownMenu");
    const btn = document.getElementById("userDropdownBtn");
    if (!menu) return;
    const open = menu.style.display === "none" || menu.style.display === "";
    menu.style.display = open ? "block" : "none";
    if (btn) btn.setAttribute("aria-expanded", String(open));
  };

  document.addEventListener("click", function (e) {
    const wrap = document.getElementById("userDropdownWrap");
    const menu = document.getElementById("userDropdownMenu");
    if (wrap && menu && !wrap.contains(e.target)) {
      menu.style.display = "none";
      const btn = document.getElementById("userDropdownBtn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });

  // ── Logout ───────────────────────────────────────────────
  window.tshLogout = function () {
    localStorage.removeItem("tsh_token");
    localStorage.removeItem("tsh_user");
    location.href = "index.html";
  };

  // ── Autofill checkout ────────────────────────────────────
  function autofillCheckout() {
    if (!document.getElementById("firstName")) return; // không phải trang checkout
    const user = getUser();
    if (!user) return;

    const nameParts = (user.full_name || "").trim().split(" ");
    const lastName = nameParts.pop() || "";
    const firstName = nameParts.join(" ") || "";

    const fill = (id, val) => {
      const el = document.getElementById(id);
      if (el && !el.value && val) el.value = val;
    };
    fill("firstName", firstName);
    fill("lastName", lastName);
    fill("phone", user.phone);
    fill("email", user.email);
    fill("address", user.address);

    // Banner thông báo đã tự điền
    if (user.full_name || user.phone || user.address) {
      const card = document.getElementById("sectionContact");
      if (!card) return;
      const body = card.querySelector(".co-card__body");
      if (!body || body.querySelector(".tsh-autofill-banner")) return;
      const banner = document.createElement("div");
      banner.className = "tsh-autofill-banner";
      banner.style.cssText =
        "background:#e8f5e0;border:1px solid #a5d6a7;border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:.82rem;color:#2e7d32;display:flex;align-items:center;gap:8px;flex-wrap:wrap;";
      banner.innerHTML = `✅ Đã tự điền thông tin từ tài khoản. <a href="profile.html" style="color:#1b5e20;font-weight:700;margin-left:auto;text-decoration:none">Cập nhật địa chỉ →</a>`;
      body.prepend(banner);
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    renderNavUser();
    autofillCheckout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
