/* ==========================================================================
   plans-page.js — plans.html plan-selection modal
   ========================================================================== */

(function () {
  "use strict";

  function initPlanModal() {
    var scrim = document.getElementById("planScrim");
    var modal = document.getElementById("planModal");
    var closeBtn = document.getElementById("planModalClose");
    var successCloseBtn = document.getElementById("planSuccessClose");
    var form = document.getElementById("planForm");
    var formView = document.getElementById("planFormView");
    var successView = document.getElementById("planSuccessView");
    var summaryPlan = document.getElementById("summaryPlan");
    var summaryPrice = document.getElementById("summaryPrice");
    if (!modal) return;

    function open(planName, planPrice) {
      summaryPlan.textContent = planName;
      summaryPrice.textContent = planPrice;
      formView.style.display = "";
      successView.style.display = "none";
      modal.classList.add("is-open");
      scrim.classList.add("is-open");
      document.body.classList.add("nav-locked");
    }
    function close() {
      modal.classList.remove("is-open");
      scrim.classList.remove("is-open");
      document.body.classList.remove("nav-locked");
    }

    document.querySelectorAll("[data-plan-select]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(btn.getAttribute("data-plan-select"), btn.getAttribute("data-plan-price"));
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (scrim) scrim.addEventListener("click", close);
    if (successCloseBtn) successCloseBtn.addEventListener("click", close);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        formView.style.display = "none";
        successView.style.display = "";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initPlanModal);
})();
