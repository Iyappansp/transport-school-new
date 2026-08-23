/* ==========================================================================
   SAFEROUTE — animations.js
   IntersectionObserver-driven scroll reveal + stagger, and the animated
   route line / moving bus marker used in the live-tracking sections.
   Respects prefers-reduced-motion throughout.
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Scroll reveal — elements with [data-reveal], optional [data-reveal-delay]
     ------------------------------------------------------------------ */
  function initScrollReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion) {
      items.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          setTimeout(() => el.classList.add("is-revealed"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     Stagger groups — [data-stagger] parent auto-delays [data-reveal] children
     ------------------------------------------------------------------ */
  function initStagger() {
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      const step = parseInt(group.getAttribute("data-stagger") || "80", 10);
      const children = group.querySelectorAll("[data-reveal]");
      children.forEach((child, i) => {
        child.setAttribute("data-reveal-delay", String(i * step));
      });
    });
  }

  /* ------------------------------------------------------------------
     Live route animation — draws the route line, then loops a marker
     along the path. Used by .tracking-map svg blocks.
     ------------------------------------------------------------------ */
  function initRouteAnimation() {
    const maps = document.querySelectorAll(".tracking-map");
    if (!maps.length) return;

    maps.forEach((map) => {
      const path = map.querySelector(".route-line-progress");
      const marker = map.querySelector(".bus-marker");
      if (!path) return;

      const draw = () => {
        path.classList.add("is-drawn");
        if (marker && !reduceMotion) animateMarker(path, marker);
      };

      if (reduceMotion) {
        path.style.strokeDashoffset = "0";
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              draw();
              observer.unobserve(map);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(map);
    });
  }

  function animateMarker(pathEl, markerEl) {
    const length = pathEl.getTotalLength();
    const duration = 7000; // ms per loop
    let start = null;

    function frame(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      const progress = elapsed / duration;
      const point = pathEl.getPointAtLength(progress * length);
      const nextPoint = pathEl.getPointAtLength(Math.min(progress * length + 1, length));
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
      markerEl.setAttribute("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initStagger();
    initScrollReveal();
    initRouteAnimation();
  });
})();
