/* ==========================================================================
   dashboard.js — parent portal interactions
   Panel switching, offcanvas sidebar, receipt modal, tracking demo.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. PANEL SWITCHING (tab-like single-page dashboard)
  ------------------------------------------------------------------ */
  function initPanels() {
    var navLinks = document.querySelectorAll("[data-panel-link]");
    var panels = document.querySelectorAll("[data-panel]");
    var gotoBtns = document.querySelectorAll("[data-panel-goto]");

    function activate(name) {
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === name);
      });
      navLinks.forEach(function (l) {
        l.classList.toggle("is-active", l.getAttribute("data-panel-link") === name);
      });
      var panelEl = document.getElementById("panel-" + name);
      if (panelEl) {
        panelEl.querySelectorAll(".widget-reveal").forEach(function (w) {
          w.style.animation = "none";
          void w.offsetWidth;
          w.style.animation = "";
        });
      }
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      closeSidebar();
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        activate(link.getAttribute("data-panel-link"));
      });
    });

    gotoBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn.getAttribute("data-panel-goto"));
      });
    });

    /* Deep-link support via hash */
    var initial = window.location.hash.replace("#", "");
    var valid = Array.prototype.map.call(navLinks, function (l) { return l.getAttribute("data-panel-link"); });
    if (initial && valid.indexOf(initial) !== -1) {
      activate(initial);
    }
  }

  /* ------------------------------------------------------------------
     2. OFFCANVAS SIDEBAR (mobile)
  ------------------------------------------------------------------ */
  var sidebar = document.getElementById("dashSidebar");
  var scrim = document.getElementById("dashScrim");
  var menuToggle = document.getElementById("dashMenuToggle");

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.classList.add("nav-locked");
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-open");
    document.body.classList.remove("nav-locked");
  }
  function initOffcanvas() {
    if (menuToggle) menuToggle.addEventListener("click", openSidebar);
    if (scrim) scrim.addEventListener("click", closeSidebar);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ------------------------------------------------------------------
     3. RECEIPT MODAL
  ------------------------------------------------------------------ */
  function initReceiptModal() {
    var modal = document.getElementById("receiptModal");
    var scrimEl = document.getElementById("receiptScrim");
    var closeBtn = document.getElementById("receiptModalClose");
    var monthValue = document.getElementById("receiptMonthValue");
    if (!modal) return;

    function open(month) {
      if (monthValue) monthValue.textContent = month;
      modal.classList.add("is-open");
      scrimEl.classList.add("is-open");
      document.body.classList.add("nav-locked");
    }
    function close() {
      modal.classList.remove("is-open");
      scrimEl.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
    }

    document.querySelectorAll("[data-receipt-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn.getAttribute("data-receipt-month") || "August 2026");
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (scrimEl) scrimEl.addEventListener("click", close);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ------------------------------------------------------------------
     4. LIVE TRACKING DEMO (dashboard map refresh)
  ------------------------------------------------------------------ */
  function initDashMap() {
    /* Support both markers (overview preview + full tracking panel) */
    var markers = [document.getElementById("dashBusMarker"), document.getElementById("dashBusMarker2")];
    var refreshBtns = [document.getElementById("dashRefreshBtn"), document.getElementById("dashRefreshBtn2")];
    var contactBtn = document.getElementById("dashContactBtn");

    var points = [
      { x: 250, y: 120 },
      { x: 380, y: 72 },
      { x: 462, y: 44 },
      { x: 550, y: 18 },
    ];
    var pointsFull = [
      { x: 255, y: 185 },
      { x: 380, y: 110 },
      { x: 465, y: 68 },
      { x: 560, y: 30 },
    ];
    var idx = 0;

    refreshBtns.forEach(function (refreshBtn, ri) {
      if (!refreshBtn) return;
      refreshBtn.addEventListener("click", function () {
        idx = (idx + 1) % points.length;
        var pts = ri === 0 ? points : pointsFull;
        var p = pts[idx];
        var marker = markers[ri];
        if (marker) marker.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
        var originalText = refreshBtn.textContent;
        refreshBtn.textContent = "Refreshed ✓";
        setTimeout(function () { refreshBtn.textContent = originalText; }, 1200);
      });
    });

    if (contactBtn) {
      contactBtn.addEventListener("click", function () {
        var originalText = contactBtn.textContent;
        contactBtn.textContent = "Request Sent";
        setTimeout(function () { contactBtn.textContent = originalText; }, 1600);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPanels();
    initOffcanvas();
    initReceiptModal();
    initDashMap();

    /* Topbar notification button → navigate to notifications panel */
    var notifBtn = document.getElementById("topbarNotifBtn");
    if (notifBtn) {
      notifBtn.addEventListener("click", function () {
        document.querySelectorAll("[data-panel]").forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-panel") === "notifications");
        });
        document.querySelectorAll("[data-panel-link]").forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("data-panel-link") === "notifications");
        });
        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      });
    }

    /* RTL label sync for dashboard topbar */
    function syncRtl() {
      var lbl = document.getElementById('rtlLabel');
      if (lbl) lbl.textContent = document.documentElement.getAttribute('dir') === 'rtl' ? 'AR' : 'EN';
    }
    syncRtl();
    var rtlBtn = document.getElementById('rtlToggle');
    if (rtlBtn) rtlBtn.addEventListener('click', function () { window.SafeRoutePrefs && window.SafeRoutePrefs.toggleDir(); syncRtl(); });
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', function () { window.SafeRoutePrefs && window.SafeRoutePrefs.toggleTheme(); });
  });
})();
