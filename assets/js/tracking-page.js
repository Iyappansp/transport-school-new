/* ==========================================================================
   tracking-page.js — tracking.html live trip simulation
   ========================================================================== */

(function () {
  "use strict";

  function initTripSimulation() {
    var busMarker = document.getElementById("busMarker");
    var simBtn = document.getElementById("simulateTripBtn");
    var etaValue = document.getElementById("etaValue");
    var nextStopValue = document.getElementById("nextStopValue");
    if (!busMarker || !simBtn) return;

    var stops = [
      { x: 400, y: 190, name: "Lakeview Apartments", eta: "6 min" },
      { x: 60, y: 380, name: "Central Avenue", eta: "4 min" },
      { x: 600, y: 70, name: "School", eta: "Arrived" },
    ];

    var current = -1;
    var running = false;

    function moveTo(index) {
      var s = stops[index];
      busMarker.setAttribute("transform", "translate(" + s.x + "," + s.y + ")");
      if (index < stops.length - 1) {
        nextStopValue.textContent = stops[index + 1].name;
        etaValue.textContent = stops[index + 1].eta;
      } else {
        nextStopValue.textContent = "School";
        etaValue.textContent = "Arrived";
      }
    }

    function runTrip() {
      if (running) return;
      running = true;
      current = 0;
      moveTo(0);
      simBtn.textContent = "Simulating...";
      simBtn.setAttribute("aria-disabled", "true");

      var step = function () {
        current++;
        if (current >= stops.length) {
          running = false;
          simBtn.textContent = "Simulate Live Trip";
          simBtn.removeAttribute("aria-disabled");
          return;
        }
        moveTo(current);
        setTimeout(step, 1400);
      };
      setTimeout(step, 1400);
    }

    simBtn.addEventListener("click", runTrip);
  }

  function initRouteLineDraw() {
    var path = document.getElementById("routePath");
    if (!path || !("IntersectionObserver" in window)) {
      if (path) path.classList.add("is-drawn");
      return;
    }
    var len = path.getTotalLength ? path.getTotalLength() : 1000;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.classList.add("route-line-draw");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            requestAnimationFrame(function () { path.classList.add("is-drawn"); });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(path);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTripSimulation();
    initRouteLineDraw();
  });
})();
