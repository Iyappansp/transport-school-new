/* ==========================================================================
   login-page.js — login.html interactions
   ========================================================================== */

(function () {
  "use strict";

  function initPasswordToggle() {
    var toggle = document.getElementById("pwToggle") || document.getElementById("passwordToggle");
    var input = document.getElementById("loginPassword");
    if (!toggle || !input) return;
    toggle.addEventListener("click", function () {
      var isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      toggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  }

  function initLoginForm() {
    var form = document.getElementById("loginForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = document.getElementById("loginSubmitBtn");
      if (btn) { btn.textContent = 'Logging in…'; btn.disabled = true; }
      if (window.SafeRouteToast) {
        window.SafeRouteToast('Welcome back! Logging you into SafeRoute portal...', 'bi-check-circle-fill');
      }
      setTimeout(function () {
        window.location.href = "dashboard/index.html";
      }, 800);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggle();
    initLoginForm();
  });
})();
