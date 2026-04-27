(function () {
  "use strict";

  class Slider {
    constructor(el) {
      this.el         = el;
      this.track      = el.querySelector(".slider__track");
      this.cards      = el.querySelectorAll(".product-card");
      this.dotsWrap   = el.querySelector(".slider__dots");
      this.btnPrev    = el.querySelector(".slider__btn--prev");
      this.btnNext    = el.querySelector(".slider__btn--next");
      this.current    = 0;
      this.total      = this.cards.length;
      this.autoPlayId = null;
      this.touchStartX = 0;

      if (this.total === 0) return;
      this._buildDots();
      this._bindEvents();
      this._update(false);
      this._startAutoPlay();
    }

    _buildDots() {
      if (!this.dotsWrap) return;
      this.dotsWrap.innerHTML = "";
      this.cards.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "slider__dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Sản phẩm ${i + 1}`);
        dot.addEventListener("click", () => this._goTo(i));
        this.dotsWrap.appendChild(dot);
      });
    }

    _goTo(index) {
      this.current = (index + this.total) % this.total;
      this._update(true);
      this._resetAutoPlay();
    }

    _prev() { this._goTo(this.current - 1); }
    _next() { this._goTo(this.current + 1); }

    _update(animate) {
      this.track.style.transition = animate
        ? "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      this.track.style.transform = `translateX(-${this.current * 100}%)`;

      this.dotsWrap?.querySelectorAll(".slider__dot").forEach((d, i) => {
        d.classList.toggle("active", i === this.current);
      });

      if (this.btnPrev) this.btnPrev.disabled = this.current === 0;
      if (this.btnNext) this.btnNext.disabled = this.current === this.total - 1;
    }

    _bindEvents() {
      this.btnPrev?.addEventListener("click", () => this._prev());
      this.btnNext?.addEventListener("click", () => this._next());

      this.el.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this._prev();
        if (e.key === "ArrowRight") this._next();
      });

      this.el.addEventListener("touchstart", (e) => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.el.addEventListener("touchend", (e) => {
        const diff = this.touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? this._next() : this._prev();
      }, { passive: true });

      this.el.addEventListener("mouseenter", () => this._stopAutoPlay());
      this.el.addEventListener("mouseleave", () => this._startAutoPlay());
    }

    _startAutoPlay(delay = 5000) {
      this._stopAutoPlay();
      this.autoPlayId = setInterval(() => this._next(), delay);
    }

    _stopAutoPlay()  { clearInterval(this.autoPlayId); }
    _resetAutoPlay() { this._stopAutoPlay(); this._startAutoPlay(); }
  }

  document.querySelectorAll(".slider").forEach((el) => new Slider(el));
})();
