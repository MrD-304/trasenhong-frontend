(function () {
  "use strict";

  const loader = document.querySelector(".page-loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hidden"), 800);
  });

  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const pct =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = pct + "%";
    }, { passive: true });
  }

  /* BUG FIX: bản gốc khởi tạo observer hai lần, lần đầu gọi .observe không có gán.
     Sửa: chỉ tạo một observer duy nhất. */
  const revealEls = document.querySelectorAll("[data-reveal], .stagger-children");
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  const counters = document.querySelectorAll(".counter[data-target]");
  if (counters.length) {
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = +el.getAttribute("data-target");
          const suffix = el.getAttribute("data-suffix") || "";
          let current = 0;
          const inc = target / (1800 / 16);
          const tick = () => {
            current += inc;
            if (current < target) {
              el.textContent = Math.floor(current).toLocaleString("vi-VN") + suffix;
              setTimeout(tick, 16);
            } else {
              el.textContent = target.toLocaleString("vi-VN") + suffix;
            }
          };
          tick();
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObs.observe(el));
  }

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  document.querySelectorAll(".ripple-wrap").forEach((el) => {
    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    });
  });

  if (window.matchMedia("(min-width: 1024px)").matches) {
    const parallaxImgs = document.querySelectorAll(".parallax-img-wrap img");
    if (parallaxImgs.length) {
      window.addEventListener("scroll", () => {
        parallaxImgs.forEach((img) => {
          const wrap = img.closest(".parallax-img-wrap");
          const rect = wrap.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const speed = parseFloat(wrap.getAttribute("data-parallax-speed") || "0.1");
          img.style.transform = `scale(1.15) translateY(${window.scrollY * speed}px)`;
        });
      }, { passive: true });
    }
  }
})();
