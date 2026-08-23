/* ==========================================================================
   safety-page.js — safety.html checklist interaction
   ========================================================================== */

(function () {
  "use strict";

  function initChecklist() {
    var items = document.querySelectorAll("#safetyChecklist [data-check]");
    items.forEach(function (item) {
      item.addEventListener("click", function () {
        item.classList.toggle("is-checked");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initChecklist);
})();
