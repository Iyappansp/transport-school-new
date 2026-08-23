/* ==========================================================================
   login-page.js — login.html interactions
   ========================================================================== */

(function () {
  "use strict";

  function initPasswordToggle() {
    var toggle = document.getElementById("passwordToggle");
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
      window.location.href = "dashboard/index.html";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPasswordToggle();
    initLoginForm();
  });
})();
