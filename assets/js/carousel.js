// Screenshot carousels: swipe or scroll the phone, or tap a dot. The caption follows the screen in view.
(function () {
  document.querySelectorAll("[data-carousel]").forEach(function (fig) {
    var track = fig.querySelector(".slides");
    var shots = Array.prototype.slice.call(track.querySelectorAll("img"));
    var dots = Array.prototype.slice.call(fig.querySelectorAll(".dots button"));
    var caption = fig.querySelector("figcaption");
    var current = 0;

    function show(i) {
      if (i === current) return;
      current = i;
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); });
      caption.textContent = shots[i].dataset.caption || "";
    }
    function go(i) { track.scrollTo({ left: i * track.clientWidth }); }

    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    track.addEventListener("scroll", function () {
      show(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    }, { passive: true });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(Math.min(current + 1, shots.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(Math.max(current - 1, 0)); }
    });
  });
})();
