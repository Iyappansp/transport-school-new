/* ==========================================================================
   SAFEROUTE — main.js
   Header/footer injection, theme + RTL persistence, mobile nav,
   active-link highlighting, FAQ accordion, toast + modal helpers,
   and interactive section widgets.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Global SafeRoute Preferences Manager
     ------------------------------------------------------------------ */
  window.SafeRoutePrefs = {
    getTheme: function () {
      return document.documentElement.getAttribute("data-theme") || localStorage.getItem("saferoute-theme") || "light";
    },
    setTheme: function (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("saferoute-theme", theme);
      updateAllThemeIcons(theme);
    },
    toggleTheme: function () {
      const next = this.getTheme() === "dark" ? "light" : "dark";
      this.setTheme(next);
      return next;
    },
    getDir: function () {
      return document.documentElement.getAttribute("dir") || localStorage.getItem("saferoute-dir") || "ltr";
    },
    setDir: function (dir) {
      document.documentElement.setAttribute("dir", dir);
      localStorage.setItem("saferoute-dir", dir);
      updateAllRtlLabels(dir);
    },
    toggleDir: function () {
      const next = this.getDir() === "rtl" ? "ltr" : "rtl";
      this.setDir(next);
      return next;
    }
  };

  /* ------------------------------------------------------------------
     Path helpers — works whether the page lives at the root or in /dashboard/
     ------------------------------------------------------------------ */
  const isDashboard = /\/dashboard\//.test(location.pathname);
  const root = isDashboard ? "../" : "";
  const currentFile = location.pathname.split("/").pop() || "index.html";

  const NAV_LINKS = [
    { label: "Home", href: root + "index.html" },
    { label: "Home 2", href: root + "home-2.html" },
        { label: "About", href: root + "about.html" },

    { label: "Routes", href: root + "routes.html" },
    { label: "Tracking", href: root + "tracking.html" },
    { label: "Safety", href: root + "safety.html" },
    { label: "Plans", href: root + "plans.html" },
    // { label: "FAQ", href: root + "faq.html" },
    { label: "Contact", href: root + "contact.html" }
  ];

  /* ------------------------------------------------------------------
     Header & Mobile Navigation Drawer
     ------------------------------------------------------------------ */
  function buildHeader() {
    const mount = document.getElementById("main-header");
    if (!mount) return;

    const navHtml = NAV_LINKS.map((l) => {
      const file = l.href.split("/").pop();
      const active = !isDashboard && file === currentFile ? " active" : "";
      return `<a href="${l.href}" class="${active.trim()}">${l.label}</a>`;
    }).join("");

    const mobileNavLinksHtml = NAV_LINKS.map((l) => {
      const file = l.href.split("/").pop();
      const active = !isDashboard && file === currentFile ? ' class="is-active" aria-current="page"' : "";
      return `<a href="${l.href}"${active}>${l.label}</a>`;
    }).join("");

    mount.innerHTML = `
      <div class="header-inner container-custom">
        <a href="${root}index.html" class="brand" aria-label="SafeRoute Home">
          <img src="${root}assets/image/logo1.png" alt="SafeRoute Logo" class="brand-logo-img">
        </a>
        <nav class="main-nav" aria-label="Primary">${navHtml}</nav>
        <div class="header-actions">
          <button type="button" class="icon-toggle theme-toggle-btn d-none d-lg-inline-flex" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
            <i class="bi bi-moon-stars"></i>
          </button>
          <button type="button" class="btn-rtl-toggle rtl-toggle-btn d-none d-lg-inline-flex" id="rtl-toggle" aria-label="Toggle RTL layout" title="Toggle RTL">
            <span class="rtl-label">RTL</span>
          </button>
          <a href="${root}login.html" class="btn-primary-custom btn-sm-custom d-none d-lg-inline-flex">Login</a>
          <a href="${root}dashboard/index.html" class="btn-secondary-custom btn-sm-custom d-none d-lg-inline-flex">Dashboard</a>
          <button type="button" class="hamburger-btn" id="hamburger-btn" aria-label="Open menu" aria-expanded="false">
            <i class="bi bi-list"></i>
          </button>
        </div>
      </div>
    `;

    // Ensure backdrop & panel are in document.body to avoid sticky/backdrop-filter clipping
    let backdrop = document.getElementById("mobile-nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "mobile-nav-backdrop";
      backdrop.className = "mobile-nav-backdrop";
      document.body.appendChild(backdrop);
    }

    let panel = document.getElementById("mobile-nav-panel");
    if (!panel) {
      panel = document.createElement("aside");
      panel.id = "mobile-nav-panel";
      panel.className = "mobile-nav-panel";
      panel.setAttribute("aria-label", "Mobile navigation");
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <div class="mobile-panel-header">
        <a href="${root}index.html" class="brand" aria-label="SafeRoute Home">
          <img src="${root}assets/image/logo1.png" alt="SafeRoute Logo" class="brand-logo-img">
        </a>
        <button type="button" class="icon-toggle mobile-panel-close" id="mobile-panel-close" aria-label="Close menu">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <nav class="mobile-nav-links" aria-label="Mobile navigation links">
        ${mobileNavLinksHtml}
      </nav>
      <div class="mobile-nav-actions">
        <a href="${root}login.html" class="btn-primary-custom w-100 justify-content-center py-2 mb-2">Login</a>
        <a href="${root}dashboard/index.html" class="btn-secondary-custom w-100 justify-content-center py-2 mb-3">Dashboard</a>
        <div class="mobile-sidebar-controls">
          <div class="mobile-pref-toggles">
            <button type="button" class="icon-toggle theme-toggle-btn" id="theme-toggle-mobile" aria-label="Toggle dark mode" title="Toggle theme">
              <i class="bi bi-moon-stars"></i>
            </button>
            <button type="button" class="btn-rtl-toggle rtl-toggle-btn" id="rtl-toggle-mobile" aria-label="Toggle RTL layout" title="Toggle RTL">
              <span class="rtl-label">RTL</span>
            </button>
          </div>
        </div>
      </div>
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
            <a href="${root}index.html" class="brand footer-brand" aria-label="SafeRoute Home">
              <img src="${root}assets/image/logo1.png" alt="SafeRoute Logo" class="brand-logo-img">
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
            <a href="${root}login.html">Login</a>
            <a href="${root}dashboard/index.html">Child Journey</a>
            <a href="${root}dashboard/index.html">Notifications</a>
            <a href="${root}dashboard/index.html">Subscription</a>
            <a href="${root}dashboard/index.html">Receipts</a>
          </div>
       
          <div class="footer-col footer-col-contact">
            <h5>Contact</h5>
            <div class="footer-contact-item">
              <span class="footer-contact-icon"><i class="bi bi-telephone-fill"></i></span>
              <a href="tel:+919876543210" class="footer-contact-link">+91 98765 43210</a>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon"><i class="bi bi-envelope-fill"></i></span>
              <a href="mailto:support@saferoute.com" class="footer-contact-link">support@saferoute.com</a>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon"><i class="bi bi-clock-fill"></i></span>
              <div class="footer-contact-text">
                <strong>Monday&ndash;Saturday</strong>
                <span>6:00 AM&ndash;7:00 PM</span>
              </div>
            </div>
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
     Theme toggle sync & listeners
     ------------------------------------------------------------------ */
  function updateAllThemeIcons(theme) {
    document.querySelectorAll(".theme-toggle-btn i, #theme-toggle i, #themeToggle i, #sidebarThemeToggle i, #theme-toggle-mobile i, .theme-toggle i").forEach((icon) => {
      icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    });
    document.querySelectorAll(".theme-toggle-btn, #theme-toggle, #themeToggle, #sidebarThemeToggle, #theme-toggle-mobile, .theme-toggle, .icon-btn.theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function initTheme() {
    const saved = window.SafeRoutePrefs.getTheme();
    document.documentElement.setAttribute("data-theme", saved);
    updateAllThemeIcons(saved);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#theme-toggle, #themeToggle, #sidebarThemeToggle, #theme-toggle-mobile, .theme-toggle-btn, .theme-toggle");
      if (!btn) return;
      window.SafeRoutePrefs.toggleTheme();
    });
  }

  /* ------------------------------------------------------------------
     RTL toggle sync & listeners
     ------------------------------------------------------------------ */
  function updateAllRtlLabels(dir) {
    document.querySelectorAll(".rtl-label, #rtlLabel, .btn-rtl-toggle span, .rtl-toggle-btn span").forEach((lbl) => {
      lbl.textContent = dir === "rtl" ? "LTR" : "RTL";
    });
    document.querySelectorAll(".btn-rtl-toggle, #rtl-toggle, #rtlToggle, #sidebarRtlToggle, #rtl-toggle-mobile, .rtl-toggle-btn, .rtl-toggle").forEach((btn) => {
      btn.classList.toggle("is-active", dir === "rtl");
      btn.setAttribute("aria-label", dir === "rtl" ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
      btn.setAttribute("title", dir === "rtl" ? "Switch to LTR" : "Switch to RTL");
    });
  }

  function initRTL() {
    const saved = window.SafeRoutePrefs.getDir();
    document.documentElement.setAttribute("dir", saved);
    updateAllRtlLabels(saved);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#rtl-toggle, #rtlToggle, #sidebarRtlToggle, #rtl-toggle-mobile, .btn-rtl-toggle, .rtl-toggle-btn, .rtl-toggle");
      if (!btn) return;
      window.SafeRoutePrefs.toggleDir();
    });
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
        const hb = document.getElementById("hamburger-btn");
        if (hb) hb.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
      if (e.target.closest("#mobile-panel-close") || e.target === backdrop || (e.target.closest(".mobile-nav-panel a") && !e.target.closest(".mobile-panel-toggles"))) {
        panel.classList.remove("is-open");
        backdrop.classList.remove("is-open");
        const hb = document.getElementById("hamburger-btn");
        if (hb) hb.setAttribute("aria-expanded", "false");
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
            const a = sib.querySelector(".faq-answer");
            if (a) a.style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        item.classList.remove("is-open");
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
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
     Route detail modal
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
     Plan request modal
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
        const pVal = modal.querySelector("[data-summary-plan]");
        if (pVal) pVal.textContent = get("planSelect");
        const rVal = modal.querySelector("[data-summary-route]");
        if (rVal) rVal.textContent = get("routeSelect");
        const puVal = modal.querySelector("[data-summary-pickup]");
        if (puVal) puVal.textContent = get("pickupInput") || "—";
        const bVal = modal.querySelector("[data-summary-billing]");
        if (bVal) bVal.textContent = get("planSelect").includes("Year") ? "Annual" : "Monthly";
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
     FAQ category filter rail
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
     Interactive Widgets for New Sections
     ------------------------------------------------------------------ */
  function initInteractiveSections() {
    // 1. Home Journey Lifecycle Switcher (Morning vs Evening)
    document.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-lifecycle-tab]");
      if (!tab) return;
      const container = tab.closest(".live-lifecycle-card");
      if (!container) return;
      container.querySelectorAll(".lifecycle-tab-btn").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const mode = tab.getAttribute("data-lifecycle-tab");
      const morningSteps = [
        { img: `${root}assets/ai/home/Stop-Arrival.png`, title: "1. Stop Arrival", time: "07:15 AM", badge: "On Time", desc: "Bus 24 arrives at Green Park stop." },
        { img: `${root}assets/ai/home/RFID-Boarded.png`, title: "2. RFID Boarded", time: "07:18 AM", badge: "Confirmed", desc: "Aarav tapped card. Parent." },
        { img: `${root}assets/ai/home/En-Route.png`, title: "3. En Route", time: "07:42 AM", badge: "Speed 34 km/h", desc: "Crossing Central Avenue flyover." },
        { img: `${root}assets/ai/home/Campus-Arrival.png`, title: "4. Campus Arrival", time: "08:05 AM", badge: "Safely Reached", desc: "Handover to school gate warden." }
      ];
      const eveningSteps = [
        { img: `${root}assets/ai/home/Boarding-Call.png`, title: "1. Boarding Call", time: "03:15 PM", badge: "Assembling", desc: "Students board at designated." },
        { img: `${root}assets/ai/home/RFID-Return-Tap.png`, title: "2. RFID Return Tap", time: "03:30 PM", badge: "Confirmed", desc: "Boarded bus. Afternoon transit." },
        { img: `${root}assets/ai/home/Returning-Route.png`, title: "3. Returning Route", time: "03:48 PM", badge: "ETA 12 min", desc: "Approaching Lakeview residential." },
        { img: `${root}assets/ai/home/Parent-Hand-off.png`, title: "4. Parent Hand-off", time: "04:02 PM", badge: "Complete", desc: "Safe drop-off to verified guardian." }
      ];

      const data = mode === "evening" ? eveningSteps : morningSteps;
      const cards = container.querySelectorAll(".lifecycle-step-card");
      cards.forEach((card, idx) => {
        if (!data[idx]) return;
        const item = data[idx];
        const imgEl = card.querySelector(".card-media-banner img, .lifecycle-icon img");
        if (imgEl && item.img) {
          imgEl.src = item.img;
          imgEl.alt = item.title;
        }
        const iconEl = card.querySelector(".lifecycle-icon i");
        if (iconEl && item.icon) iconEl.className = `bi ${item.icon}`;
        const titleEl = card.querySelector(".lifecycle-card-body h4");
        if (titleEl) titleEl.textContent = item.title;
        const descEl = card.querySelector(".lifecycle-card-body p");
        if (descEl) descEl.textContent = item.desc;
        const badgeEl = card.querySelector(".lifecycle-badge");
        if (badgeEl) badgeEl.textContent = item.badge;
        const timeEl = card.querySelector(".lifecycle-card-foot b");
        if (timeEl) timeEl.textContent = item.time;
      });
    });

    // 2. Home Fare & Route Estimator
    function updateFareEstimator() {
      const card = document.getElementById("fareEstimatorWidget");
      if (!card) return;

      const zoneSelect = card.querySelector("#calcZoneSelect");
      const freqActive = card.querySelector(".fare-pill-opt.active[data-freq]");
      const gradeSelect = card.querySelector("#calcGradeSelect");
      const priceDisplay = card.querySelector("#calcResultPrice");
      const routeDisplay = card.querySelector("#calcResultRoute");
      const busDisplay = card.querySelector("#calcResultBus");
      const etaDisplay = card.querySelector("#calcResultEta");

      const zone = zoneSelect ? zoneSelect.value : "peelamedu";
      const freq = freqActive ? freqActive.getAttribute("data-freq") : "two-way";
      
      let base = 2400;
      let routeName = "Route 08 (Peelamedu)";
      let etaVal = "18–22 min";
      let busVal = "Bus 24 (42-Seater AC)";

      if (zone === "gandhipuram") {
        base = 2800;
        routeName = "Route 12 (Gandhipuram)";
        etaVal = "25–30 min";
        busVal = "Bus 18 (42-Seater AC)";
      } else if (zone === "rspuram") {
        base = 3200;
        routeName = "Route 17 (RS Puram)";
        etaVal = "20–25 min";
        busVal = "Bus 09 (32-Seater AC)";
      } else if (zone === "saibaba") {
        base = 3100;
        routeName = "Route 05 (Saibaba Colony)";
        etaVal = "22–28 min";
        busVal = "Bus 14 (42-Seater AC)";
      }

      if (freq === "one-way") {
        base = Math.round(base * 0.65);
      }

      if (priceDisplay) priceDisplay.innerHTML = `₹${base.toLocaleString()}<span>/month</span>`;
      if (routeDisplay) routeDisplay.textContent = routeName;
      if (busDisplay) busDisplay.textContent = busVal;
      if (etaDisplay) etaDisplay.textContent = etaVal;
    }

    document.addEventListener("change", (e) => {
      if (e.target.closest("#calcZoneSelect, #calcGradeSelect")) {
        updateFareEstimator();
      }
    });

    document.addEventListener("click", (e) => {
      const pill = e.target.closest(".fare-pill-opt[data-freq]");
      if (!pill) return;
      const wrap = pill.closest(".fare-options-pills");
      if (wrap) wrap.querySelectorAll(".fare-pill-opt").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      updateFareEstimator();
    });

    // 3. Home 2 Verified Review Filter
    document.addEventListener("click", (e) => {
      const pill = e.target.closest("[data-review-filter]");
      if (!pill) return;
      const bar = pill.closest(".review-filter-bar");
      if (bar) bar.querySelectorAll(".review-filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const cat = pill.getAttribute("data-review-filter");
      document.querySelectorAll(".impact-review-card").forEach((card) => {
        const itemCat = card.getAttribute("data-cat");
        const show = cat === "all" || itemCat === cat;
        card.style.display = show ? "flex" : "none";
      });
    });

    // 4. Routes Landmark Explorer Zone Nav
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-zone-nav]");
      if (!btn) return;
      const bar = btn.closest(".zone-nav-bar");
      if (bar) bar.querySelectorAll(".zone-nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const zone = btn.getAttribute("data-zone-nav");
      document.querySelectorAll(".landmark-card").forEach((card) => {
        const cardZone = card.getAttribute("data-zone");
        const show = zone === "all" || cardZone === zone;
        card.style.display = show ? "block" : "none";
      });
    });

      // 5. Routes Route Pool Request Form
      document.addEventListener("submit", (e) => {
        const poolForm = e.target.closest("#routePoolForm");
        if (!poolForm) return;
        e.preventDefault();
        const loc = poolForm.querySelector("#poolAreaInput")?.value || "Your neighborhood";
        window.SafeRouteToast(`Route pooling interest registered for ${loc}! We will notify you once 5 neighbors join.`, "bi-people-fill");
        poolForm.reset();
      });

      // 6. Home 2 Gallery Category Filter
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-gallery-filter]");
        if (!btn) return;
        const bar = btn.closest(".gallery-filter-bar");
        if (bar) bar.querySelectorAll(".gallery-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-gallery-filter");
        document.querySelectorAll(".gallery-card").forEach((card) => {
          const cat = card.getAttribute("data-gallery-cat");
          const show = filter === "all" || cat === filter;
          card.style.display = show ? "flex" : "none";
        });
      });

      // Gallery Lightbox Preview
      document.addEventListener("click", (e) => {
        const zoomBtn = e.target.closest(".gallery-zoom-btn");
        if (!zoomBtn) return;
        const title = zoomBtn.getAttribute("data-img-title") || "SafeRoute Gallery";
        const desc = zoomBtn.getAttribute("data-img-desc") || "";
        window.SafeRouteToast(`${title} — ${desc}`, "bi-camera-fill");
      });

      // 7. Plans Interactive Route Cost Calculator
      function updatePlansCalculator() {
        const calcRoot = document.getElementById("plansCalculator");
        if (!calcRoot) return;

        const children = parseInt(calcRoot.querySelector("[data-calc-children].active")?.getAttribute("data-calc-children") || "1", 10);
        const zone = calcRoot.querySelector("[data-calc-zone].active")?.getAttribute("data-calc-zone") || "1";
        const tenure = calcRoot.querySelector("[data-calc-tenure].active")?.getAttribute("data-calc-tenure") || "monthly";

        let baseRatePerChild = 2400;
        if (zone === "2") baseRatePerChild = 3100;
        if (zone === "3") baseRatePerChild = 3850;

        let totalMonthly = 0;
        let siblingDiscount = 0;

        for (let i = 1; i <= children; i++) {
          if (i === 1) {
            totalMonthly += baseRatePerChild;
          } else if (i === 2) {
            const discounted = baseRatePerChild * 0.90;
            siblingDiscount += baseRatePerChild * 0.10;
            totalMonthly += discounted;
          } else {
            const discounted = baseRatePerChild * 0.85;
            siblingDiscount += baseRatePerChild * 0.15;
            totalMonthly += discounted;
          }
        }

        let displayAmount = Math.round(totalMonthly);
        let tenureSavings = 0;

        if (tenure === "annual") {
          const annualBase = totalMonthly * 10;
          tenureSavings = Math.round(totalMonthly * 2);
          displayAmount = Math.round(annualBase);
        }

        const elTotal = calcRoot.querySelector("#calcTotalAmount");
        const elBase = calcRoot.querySelector("#calcBaseRow");
        const elDiscount = calcRoot.querySelector("#calcDiscountRow");
        const elSavings = calcRoot.querySelector("#calcSavingsRow");
        const elTenureLabel = calcRoot.querySelector("#calcTotalTenureLabel");

        if (elTotal) elTotal.textContent = `₹${displayAmount.toLocaleString("en-IN")}`;
        if (elTenureLabel) elTenureLabel.textContent = tenure === "annual" ? "Annual Academic Total" : "Monthly Total";
        if (elBase) elBase.textContent = `₹${Math.round(baseRatePerChild * children).toLocaleString("en-IN")} / mo`;
        if (elDiscount) elDiscount.textContent = siblingDiscount > 0 ? `- ₹${Math.round(siblingDiscount).toLocaleString("en-IN")} / mo (Active)` : "None (1 Student)";
        if (elSavings) elSavings.textContent = tenure === "annual" ? `- ₹${tenureSavings.toLocaleString("en-IN")} (2 Months Free)` : "Available on Annual Plan";
      }

      document.addEventListener("click", (e) => {
        const segBtn = e.target.closest(".calc-segment-btn");
        if (!segBtn) return;
        const group = segBtn.closest(".calc-segmented");
        if (group) group.querySelectorAll(".calc-segment-btn").forEach((b) => b.classList.remove("active"));
        segBtn.classList.add("active");
        updatePlansCalculator();
      });

      updatePlansCalculator();

      // 8. Live Tracking Speed Telemetry Ticker
      const speedDisplay = document.getElementById("liveSpeedNumber");
      const speedBar = document.getElementById("liveSpeedBar");
      if (speedDisplay && speedBar) {
        setInterval(() => {
          const current = Math.floor(Math.random() * 6) + 33;
          speedDisplay.textContent = current;
          const pct = (current / 40) * 100;
          speedBar.style.width = `${pct}%`;
        }, 3500);
      }
    }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function boot() {
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
    initInteractiveSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
