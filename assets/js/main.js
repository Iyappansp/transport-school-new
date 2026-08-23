/* ==========================================================================
   SAFEROUTE — main.js
   Header/footer injection, theme + RTL persistence, mobile nav,
   active-link highlighting, FAQ accordion, toast + modal helpers.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Path helpers — works whether the page lives at the root or in /dashboard/
     ------------------------------------------------------------------ */
  const isDashboard = /\/dashboard\//.test(location.pathname);
  const root = isDashboard ? "../" : "";
  const currentFile = location.pathname.split("/").pop() || "index.html";

  const NAV_LINKS = [
    { label: "Home", href: root + "index.html" },
    { label: "Home 2", href: root + "home-2.html" },
    { label: "Routes", href: root + "routes.html" },
    { label: "Tracking", href: root + "tracking.html" },
    { label: "Safety", href: root + "safety.html" },
    { label: "Plans", href: root + "plans.html" },
    { label: "About", href: root + "about.html" },
    { label: "FAQ", href: root + "faq.html" },
    { label: "Contact", href: root + "contact.html" }
  ];

  /* ------------------------------------------------------------------
     Header
     ------------------------------------------------------------------ */
  function buildHeader() {
    const mount = document.getElementById("main-header");
    if (!mount) return;

    const navHtml = NAV_LINKS.map((l) => {
      const file = l.href.split("/").pop();
      const active = !isDashboard && file === currentFile ? " active" : "";
      return `<a href="${l.href}" class="${active.trim()}">${l.label}</a>`;
    }).join("");

    const mobileNavHtml = NAV_LINKS.map(
      (l) => `<a href="${l.href}">${l.label}</a>`
    ).join("") + 
    `<a href="${root}login.html" class="fw-lead">Parent Login</a>` +
    `<a href="${root}dashboard/index.html" class="fw-lead">Dashboard</a>`;

    mount.innerHTML = `
      <div class="header-inner container-custom">
        <a href="${root}index.html" class="brand">
          <span class="brand-mark"><i class="bi bi-bus-front-fill"></i></span>
          <span class="brand-text">SafeRoute</span>
        </a>
        <nav class="main-nav" aria-label="Primary">${navHtml}</nav>
        <div class="header-actions">
          <button type="button" class="icon-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
            <i class="bi bi-moon-stars"></i>
          </button>
          <button type="button" class="btn-rtl-toggle" id="rtl-toggle" aria-label="Toggle RTL layout" title="Toggle RTL">
            <span class="rtl-label">RTL</span>
          </button>
          <a href="${root}login.html" class="btn-primary-custom btn-sm-custom d-none d-lg-inline-flex">Parent Login</a>
          <a href="${root}dashboard/index.html" class="btn-secondary-custom btn-sm-custom d-none d-lg-inline-flex">Dashboard</a>
          <button type="button" class="hamburger-btn" id="hamburger-btn" aria-label="Open menu" aria-expanded="false">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
      <div class="mobile-nav-backdrop" id="mobile-nav-backdrop"></div>
      <aside class="mobile-nav-panel" id="mobile-nav-panel" aria-label="Mobile navigation">
        <button type="button" class="icon-toggle mobile-panel-close" id="mobile-panel-close" aria-label="Close menu">
          <i class="bi bi-x-lg"></i>
        </button>
        ${mobileNavHtml}
      </aside>
    `;
  }

  /* ------------------------------------------------------------------
     Footer
     ------------------------------------------------------------------ */
  function buildFooter() {
    const mount = document.getElementById("main-footer");
    if (!mount) return;

    mount.innerHTML = `
      <div class="container-custom">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${root}index.html" class="brand" style="color:#fff;">
              <span class="brand-mark"><i class="bi bi-bus-front-fill"></i></span>
              <span>SafeRoute</span>
            </a>
            <p>Every school journey — visible, safe and connected for parents and students.</p>
            <div class="footer-social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="https://x.com" target="_blank" rel="noopener" aria-label="X (Twitter)" title="X (Twitter)"><i class="bi bi-twitter-x"></i></a>
              <a href="https://pinterest.com" target="_blank" rel="noopener" aria-label="Pinterest" title="Pinterest"><i class="bi bi-pinterest"></i></a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Transport</h5>
            <a href="${root}routes.html">Routes</a>
            <a href="${root}tracking.html">Live Tracking</a>
            <a href="${root}safety.html">Safety</a>
            <a href="${root}plans.html">Plans</a>
          </div>
          <div class="footer-col">
            <h5>Parents</h5>
            <a href="${root}login.html">Parent Login</a>
            <a href="${root}dashboard/journey.html">Child Journey</a>
            <a href="${root}dashboard/notifications.html">Notifications</a>
            <a href="${root}dashboard/subscription.html">Subscription</a>
            <a href="${root}dashboard/receipts.html">Receipts</a>
          </div>
          <div class="footer-col">
            <h5>Company</h5>
            <a href="${root}about.html">About</a>
            <a href="${root}faq.html">FAQ</a>
            <a href="${root}contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h5>Contact</h5>
            <address>+91 XXX XXX XXXX</address>
            <p>support@example.com</p>
            <p>Monday&ndash;Saturday<br>6:00 AM&ndash;7:00 PM</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 SafeRoute Student Transport. Demo project — sample data.</span>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Transport Policy</a>
          </div>
        </div>
      </div>
    `;
  }

  /* ------------------------------------------------------------------
     Theme toggle (persist via localStorage)
     ------------------------------------------------------------------ */
  function initTheme() {
    const saved = localStorage.getItem("saferoute-theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#theme-toggle");
      if (!btn) return;
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("saferoute-theme", next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if (!icon) return;
    icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }

  /* ------------------------------------------------------------------
     RTL toggle (persist via localStorage)
     ------------------------------------------------------------------ */
  function initRTL() {
    const saved = localStorage.getItem("saferoute-dir") || "ltr";
    document.documentElement.setAttribute("dir", saved);
    updateRtlLabel(saved);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#rtl-toggle");
      if (!btn) return;
      const current = document.documentElement.getAttribute("dir") || "ltr";
      const next = current === "rtl" ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", next);
      localStorage.setItem("saferoute-dir", next);
      updateRtlLabel(next);
    });
  }

  function updateRtlLabel(dir) {
    const btn = document.querySelector("#rtl-toggle");
    const label = document.querySelector("#rtl-toggle .rtl-label");
    if (label) {
      label.textContent = dir === "rtl" ? "LTR" : "RTL";
    }
    if (btn) {
      btn.classList.toggle("is-active", dir === "rtl");
    }
  }

  /* ------------------------------------------------------------------
     Mobile nav drawer
     ------------------------------------------------------------------ */
  function initMobileNav() {
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("mobile-nav-panel");
      const backdrop = document.getElementById("mobile-nav-backdrop");
      if (!panel || !backdrop) return;

      if (e.target.closest("#hamburger-btn")) {
        panel.classList.add("is-open");
        backdrop.classList.add("is-open");
        document.getElementById("hamburger-btn").setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
      if (e.target.closest("#mobile-panel-close") || e.target === backdrop || e.target.closest(".mobile-nav-panel a")) {
        panel.classList.remove("is-open");
        backdrop.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const panel = document.getElementById("mobile-nav-panel");
        const backdrop = document.getElementById("mobile-nav-backdrop");
        if (panel) panel.classList.remove("is-open");
        if (backdrop) backdrop.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ------------------------------------------------------------------
     Header shadow on scroll
     ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     FAQ accordion
     ------------------------------------------------------------------ */
  function initFAQ() {
    document.addEventListener("click", (e) => {
      const q = e.target.closest(".faq-question");
      if (!q) return;
      const item = q.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("is-open");

      // Close siblings within the same accordion group
      const group = item.closest(".faq-accordion");
      if (group) {
        group.querySelectorAll(".faq-item.is-open").forEach((sib) => {
          if (sib !== item) {
            sib.classList.remove("is-open");
            sib.querySelector(".faq-answer").style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  }

  /* ------------------------------------------------------------------
     Toast helper — window.SafeRouteToast(message, icon)
     ------------------------------------------------------------------ */
  function ensureToastStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    return stack;
  }

  window.SafeRouteToast = function (message, icon) {
    const stack = ensureToastStack();
    const el = document.createElement("div");
    el.className = "toast-item";
    el.innerHTML = `<i class="bi ${icon || "bi-check-circle-fill"}"></i><span>${message}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-visible"));
    setTimeout(() => {
      el.classList.remove("is-visible");
      setTimeout(() => el.remove(), 400);
    }, 3200);
  };

  /* ------------------------------------------------------------------
     Demo form intercept — any <form class="js-demo-form" data-success="...">
     prevents real submission, shows a toast, and resets the form.
     Used by contact.html and login.html.
     ------------------------------------------------------------------ */
  function initDemoForms() {
    document.addEventListener("submit", (e) => {
      const form = e.target.closest(".js-demo-form");
      if (!form) return;
      e.preventDefault();
      const message = form.getAttribute("data-success") || "Request received.";
      const redirect = form.getAttribute("data-redirect");
      window.SafeRouteToast(message, "bi-check-circle-fill");
      if (redirect) {
        setTimeout(() => {
          window.location.href = redirect;
        }, 600);
      } else {
        form.reset();
      }
    });
  }

  /* ------------------------------------------------------------------
     Route detail modal — cards with [data-route-trigger] populate
     #routeModal before Bootstrap shows it. Used by routes.html.
     ------------------------------------------------------------------ */
  function initRouteModal() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-route-trigger]");
      if (!trigger) return;
      const modal = document.getElementById("routeModal");
      if (!modal) return;

      const fields = ["route", "pickup", "first", "arrival", "stops", "service", "availability"];
      fields.forEach((f) => {
        const el = modal.querySelector(`[data-fill="${f}"]`);
        if (el) el.textContent = trigger.getAttribute(`data-${f}`) || "—";
      });
      const title = modal.querySelector(".modal-title");
      if (title) title.textContent = trigger.getAttribute("data-route") || "Route";
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("#routeRequestBtn")) {
        window.SafeRouteToast("Your route request has been received.", "bi-check-circle-fill");
      }
    });
  }

  /* ------------------------------------------------------------------
     Plan request modal — "Choose Plan" buttons prefill the plan name;
     a two-step form -> summary -> confirmation flow. Used by plans.html.
     ------------------------------------------------------------------ */
  function initPlanModal() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-plan-trigger]");
      if (trigger) {
        const modal = document.getElementById("planModal");
        if (!modal) return;
        const select = modal.querySelector("#planSelect");
        if (select) select.value = trigger.getAttribute("data-plan") || "";
        modal.querySelectorAll(".plan-step-form").forEach((el) => el.classList.remove("d-none"));
        modal.querySelectorAll(".plan-step-summary").forEach((el) => el.classList.add("d-none"));
      }

      if (e.target.closest("#planContinueBtn")) {
        const modal = document.getElementById("planModal");
        if (!modal) return;
        const get = (id) => modal.querySelector(`#${id}`)?.value || "—";
        modal.querySelector("[data-summary-plan]").textContent = get("planSelect");
        modal.querySelector("[data-summary-route]").textContent = get("routeSelect");
        modal.querySelector("[data-summary-pickup]").textContent = get("pickupInput") || "—";
        modal.querySelector("[data-summary-billing]").textContent = get("planSelect").includes("Year") ? "Annual" : "Monthly";
        modal.querySelectorAll(".plan-step-form").forEach((el) => el.classList.add("d-none"));
        modal.querySelectorAll(".plan-step-summary").forEach((el) => el.classList.remove("d-none"));
      }

      if (e.target.closest("#planConfirmBtn")) {
        const modalEl = document.getElementById("planModal");
        window.SafeRouteToast("Transport request received.", "bi-check-circle-fill");
        if (modalEl && window.bootstrap) {
          window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     FAQ category filter rail — pills with [data-faq-cat] show/hide
     matching .faq-category-block groups. Used by faq.html.
     ------------------------------------------------------------------ */
  function initFaqCategoryFilter() {
    document.addEventListener("click", (e) => {
      const pill = e.target.closest("[data-faq-cat]");
      if (!pill) return;
      const rail = pill.closest(".faq-cat-rail");
      if (rail) rail.querySelectorAll(".faq-cat-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const cat = pill.getAttribute("data-faq-cat");
      document.querySelectorAll(".faq-category-block").forEach((block) => {
        const show = cat === "all" || block.getAttribute("data-category") === cat;
        block.style.display = show ? "" : "none";
      });
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    buildHeader();
    buildFooter();
    initTheme();
    initRTL();
    initMobileNav();
    initHeaderScroll();
    initFAQ();
    initDemoForms();
    initRouteModal();
    initPlanModal();
    initFaqCategoryFilter();
  });
})();
