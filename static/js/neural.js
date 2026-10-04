/* NEURAL skin — animated node network behind the page, section eyebrows, reveal-on-scroll.
   Stays cheap: ~110 nodes, one canvas, pauses when the tab is hidden, static frame under reduced motion. */
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.classList.contains('theme-claude')) return;

  // The skin is dark-only: keep the theme's dark variation regardless of an old day/night preference.
  try { localStorage.setItem('dark_mode', '1'); } catch (e) {}
  body.classList.add('dark');
  body.classList.add('neural-ready');

  // Section eyebrows: "// about", "// featured", …
  var sections = document.querySelectorAll('section.home-section');
  Array.prototype.forEach.call(sections, function (s) {
    var c = s.querySelector(':scope > .container');
    if (c && s.id) c.setAttribute('data-label', '// ' + s.id.replace(/-/g, ' '));
  });

  // Reveal on scroll
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(document.querySelectorAll('section.home-section > .container'), function (c) { io.observe(c); });
  } else {
    body.classList.add('no-observer');
  }

  // Background network
  var cv = document.createElement('canvas');
  cv.id = 'neural-bg';
  cv.setAttribute('aria-hidden', 'true');
  body.insertBefore(cv, body.firstChild);
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1, nodes = [], mouse = { x: -1e4, y: -1e4 }, running = true;
  var N = Math.min(130, Math.max(60, Math.round(window.innerWidth * window.innerHeight / 14000)));

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.width = Math.round(window.innerWidth * dpr);
    H = cv.height = Math.round(window.innerHeight * dpr);
    cv.style.width = window.innerWidth + 'px';
    cv.style.height = window.innerHeight + 'px';
  }
  function seed() {
    nodes = [];
    for (var i = 0; i < N; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr, r: (1 + Math.random() * 1.6) * dpr, d: Math.random() });
    }
  }
  resize(); seed();
  window.addEventListener('resize', function () { resize(); seed(); if (reduce) draw(); });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running && !reduce) requestAnimationFrame(frame); });

  var LINK = 150 * dpr, LINK2 = LINK * LINK;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // edges
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK2) {
          var t = 1 - d2 / LINK2;
          ctx.strokeStyle = 'rgba(78,232,214,' + (t * 0.22).toFixed(3) + ')';
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    // nodes (depth-coded: far = periwinkle/dim, near = cyan/bright)
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      var mx = n.x - mouse.x, my = n.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
      var near = md < 180 * dpr;
      ctx.fillStyle = n.d > 0.55 ? 'rgba(78,232,214,' + (0.45 + n.d * 0.5).toFixed(2) + ')' : 'rgba(124,140,255,' + (0.25 + n.d * 0.4).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, near ? n.r * 1.8 : n.r, 0, Math.PI * 2); ctx.fill();
      if (near) { ctx.strokeStyle = 'rgba(78,232,214,.35)'; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
  }
  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = W + 10; else if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; else if (n.y > H + 10) n.y = -10;
    }
  }
  function frame() { if (!running) return; step(); draw(); requestAnimationFrame(frame); }
  if (reduce) draw(); else requestAnimationFrame(frame);
})();
