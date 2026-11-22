// Afield Studio desktop: open, focus, drag and close windows; drag icons; tabs; menu-bar clock.
(function () {
  var desktop = document.getElementById("desktop");
  var iconsList = document.querySelector(".icons");
  var phone = window.matchMedia("(max-width: 700px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var z = 20;
  var cascade = 0;
  var openers = {};

  function front(win) {
    document.querySelectorAll(".win.is-front").forEach(function (w) { w.classList.remove("is-front"); });
    win.classList.add("is-front");
    win.style.zIndex = ++z;
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function place(win) {
    if (win.dataset.placed) return;
    var dw = desktop.clientWidth, dh = desktop.clientHeight;
    var ww = win.offsetWidth, wh = win.offsetHeight;
    var left, top;
    if (win.dataset.x) {
      left = dw * parseFloat(win.dataset.x);
      top = dh * parseFloat(win.dataset.y);
    } else {
      var start = iconsList.offsetWidth + 24;
      left = start + cascade * 32;
      top = 24 + cascade * 32;
      cascade = (cascade + 1) % 6;
    }
    win.style.left = clamp(left, 8, Math.max(8, dw - ww - 8)) + "px";
    win.style.top = clamp(top, 8, Math.max(8, dh - wh - 8)) + "px";
    win.dataset.placed = "1";
  }

  function open(id, opener, animate) {
    var win = document.getElementById(id);
    if (!win) return;
    var wasHidden = win.hidden;
    win.hidden = false;
    if (!phone.matches) place(win);
    front(win);
    if (opener) openers[id] = opener;
    if (wasHidden && animate !== false && opener && !reduceMotion.matches && !phone.matches) {
      var o = opener.getBoundingClientRect(), w = win.getBoundingClientRect();
      win.style.setProperty("--from-x", (o.left + o.width / 2 - (w.left + w.width / 2)) + "px");
      win.style.setProperty("--from-y", (o.top + o.height / 2 - (w.top + w.height / 2)) + "px");
      win.classList.remove("is-opening");
      void win.offsetWidth;
      win.classList.add("is-opening");
    }
    var heading = win.querySelector("h1, h2");
    if (heading && animate !== false) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function close(win) {
    win.hidden = true;
    win.classList.remove("is-front", "is-opening");
    var opener = openers[win.id];
    var rest = Array.prototype.filter.call(document.querySelectorAll(".win"), function (w) { return !w.hidden; });
    rest.sort(function (a, b) { return (+b.style.zIndex || 0) - (+a.style.zIndex || 0); });
    if (rest[0]) rest[0].classList.add("is-front");
    if (opener && document.body.contains(opener)) opener.focus({ preventScroll: true });
  }

  // Openers: icons, menu items and quick links. Icons ignore the click that ends a drag.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open]");
    if (t) {
      if (t.dataset.dragged) { delete t.dataset.dragged; return; }
      open(t.dataset.open, t);
      return;
    }
    var c = e.target.closest(".close");
    if (c) close(c.closest(".win"));
  });

  document.addEventListener("pointerdown", function (e) {
    var win = e.target.closest(".win");
    if (win) front(win);
    document.querySelectorAll(".icon.is-selected").forEach(function (i) { i.classList.remove("is-selected"); });
    var icon = e.target.closest(".icon");
    if (icon) icon.classList.add("is-selected");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var top = document.querySelector(".win.is-front:not([hidden])");
    if (top) close(top);
  });

  // Drag helper: calls onMove with the pointer delta once it passes a small threshold.
  function draggable(handle, onStart, onMove, onEnd) {
    handle.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || phone.matches || e.target.closest(".close")) return;
      var sx = e.clientX, sy = e.clientY, moved = false, state = null;
      handle.setPointerCapture(e.pointerId);
      function move(ev) {
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
        if (!moved) { moved = true; state = onStart(); }
        onMove(state, dx, dy);
      }
      function up() {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
        if (moved && onEnd) onEnd(state);
      }
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
  }

  document.querySelectorAll(".win").forEach(function (win) {
    draggable(win.querySelector(".bar"), function () {
      return { left: win.offsetLeft, top: win.offsetTop };
    }, function (s, dx, dy) {
      var dw = desktop.clientWidth, dh = desktop.clientHeight;
      win.style.left = clamp(s.left + dx, 80 - win.offsetWidth, dw - 80) + "px";
      win.style.top = clamp(s.top + dy, 0, dh - 40) + "px";
    });
  });

  document.querySelectorAll(".icon").forEach(function (icon) {
    draggable(icon, function () {
      icon.classList.add("is-dragging");
      var r = icon.getBoundingClientRect(), d = desktop.getBoundingClientRect();
      var x = +icon.dataset.x || 0, y = +icon.dataset.y || 0;
      // Limits keep the whole icon on the desktop.
      return { x: x, y: y, minX: x - (r.left - d.left), maxX: x + (d.right - r.right), minY: y - (r.top - d.top), maxY: y + (d.bottom - r.bottom) };
    }, function (s, dx, dy) {
      var nx = clamp(s.x + dx, s.minX, s.maxX), ny = clamp(s.y + dy, s.minY, s.maxY);
      icon.dataset.x = nx;
      icon.dataset.y = ny;
      icon.style.transform = "translate(" + nx + "px," + ny + "px)";
    }, function () {
      icon.classList.remove("is-dragging");
      icon.dataset.dragged = "1";
      setTimeout(function () { delete icon.dataset.dragged; }, 0);
    });
  });

  // Tabs inside app windows.
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!n) return;
        var next = tabs[(i + n + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  // Menu-bar clock.
  var clock = document.getElementById("clock");
  function tick() {
    var d = new Date();
    clock.dateTime = d.toISOString();
    clock.textContent = d.toLocaleDateString(undefined, { weekday: "short" }) + " " +
      d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 15000);

  // About opens first.
  open("about-win", null, false);
})();
