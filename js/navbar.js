(function () {
  "use strict";

  const navbar    = document.querySelector(".navbar");
  const hamburger = document.querySelector(".navbar__hamburger");
  const drawer    = document.querySelector(".navbar__drawer");
  const drawerLinks = document.querySelectorAll(".navbar__drawer .navbar__link");

  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.remove("transparent");
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.add("transparent");
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggleMenu = (open) => {
    hamburger.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    hamburger.setAttribute("aria-expanded", open);
    hamburger.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  };

  hamburger?.addEventListener("click", () => {
    toggleMenu(!drawer.classList.contains("open"));
  });

  drawerLinks.forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("click", (e) => {
    if (
      drawer.classList.contains("open") &&
      !drawer.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".navbar__link[data-section]");

  if (sections.length && navLinks.length) {
    const highlightNav = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach((section) => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const match = document.querySelector(`.navbar__link[data-section="${section.id}"]`);
          if (match) match.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", highlightNav, { passive: true });
  }
})();
