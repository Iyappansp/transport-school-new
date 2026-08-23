/* ==========================================================================
   routes-page.js — routes.html filter interactions
   ========================================================================== */

(function () {
  "use strict";

  function initRouteFilters() {
    var grid = document.getElementById("routeGrid");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".route-card"));
    var countEl = document.getElementById("routeCount");

    var areaSel = document.getElementById("filterArea");
    var statusSel = document.getElementById("filterStatus");
    var timeSel = document.getElementById("filterTime");

    function matchesTime(cardTime, filterVal) {
      if (!filterVal) return true;
      var h = parseInt(cardTime.split(":")[0], 10);
      var m = parseInt(cardTime.split(":")[1], 10);
      var totalMin = h * 60 + m;
      if (filterVal === "Before 7:00 AM") return totalMin < 7 * 60;
      if (filterVal === "7:00-7:30 AM") return totalMin >= 7 * 60 && totalMin <= 7 * 60 + 30;
      if (filterVal === "7:30-8:00 AM") return totalMin > 7 * 60 + 30 && totalMin <= 8 * 60;
      if (filterVal === "After 8:00 AM") return totalMin > 8 * 60;
      return true;
    }

    function applyFilters() {
      var area = areaSel.value;
      var status = statusSel.value;
      var time = timeSel.value;

      cards.forEach(function (card) {
        var cardArea = card.getAttribute("data-area");
        var cardStatus = card.getAttribute("data-status");
        var cardTime = card.getAttribute("data-time");

        var match =
          (!area || cardArea === area) &&
          (!status || cardStatus === status) &&
          matchesTime(cardTime, time);

        card.classList.add("is-hiding");
        setTimeout(function () {
          if (match) {
            card.style.display = "";
            requestAnimationFrame(function () { card.classList.remove("is-hiding"); });
          } else {
            card.style.display = "none";
            card.classList.remove("is-hiding");
          }
          if (countEl) {
            countEl.textContent = grid.querySelectorAll('.route-card:not([style*="display: none"])').length;
          }
        }, 160);
      });
    }

    [areaSel, statusSel, timeSel].forEach(function (sel) {
      if (sel) sel.addEventListener("change", applyFilters);
    });
  }

  document.addEventListener("DOMContentLoaded", initRouteFilters);
})();
