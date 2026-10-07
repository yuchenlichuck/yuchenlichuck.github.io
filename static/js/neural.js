/* liyc.pw — portrait point cloud + section reveal.
   The profile photo is sampled into ~3,500 points that assemble on load, breathe slowly,
   scatter away from the cursor and re-form; hover (or tap) reveals the photograph.
   Colours follow the day/night toggle. Static single frame under prefers-reduced-motion. */
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.classList.contains('theme-claude')) return;
  body.classList.add('neural-ready');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal on scroll ----
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(document.querySelectorAll('section.home-section > .container'), function (c) { io.observe(c); });
  } else {
    body.classList.add('no-observer');
  }

  // ---- email: assembled in the browser so the address never sits in the HTML for scrapers ----
  function addr(el) { return el.getAttribute('data-u') + '@' + el.getAttribute('data-d'); }
  Array.prototype.forEach.call(document.querySelectorAll('.js-email'), function (a) {
    var m = addr(a);
    a.setAttribute('href', 'mailto:' + m);
    if (a.getAttribute('data-show')) { var t = a.querySelector('.js-email-text'); if (t) t.textContent = m; }
  });
  Array.prototype.forEach.call(document.querySelectorAll('.js-copy-email'), function (b) {
    var label = b.querySelector('span'), orig = label ? label.textContent : '';
    b.addEventListener('click', function () {
      var m = addr(b);
      var done = function () {
        b.classList.add('is-done'); if (label) label.textContent = b.getAttribute('data-done') || 'Copied';
        setTimeout(function () { b.classList.remove('is-done'); if (label) label.textContent = orig; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(m).then(done, function () { window.prompt('Email', m); });
      } else { window.prompt('Email', m); }
    });
  });

  // ---- portrait point cloud ----
  var img = document.querySelector('#profile img.portrait, .wg-about img.portrait');
  if (!img) return;

  var wrap = document.createElement('div');
  wrap.className = 'pc-wrap';
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  wrap.appendChild(cv);
  var cap = document.createElement('span');
  cap.className = 'pc-cap';
  wrap.parentNode.insertBefore(cap, wrap.nextSibling);

  var ctx = cv.getContext('2d'), dpr = Math.min(3, Math.max(2, window.devicePixelRatio || 1));   // always render at ≥2× for crisp stipple
  var SIZE = 190, W = SIZE * dpr, H = W;
  cv.width = W; cv.height = H;

  var pts = [], mouse = { x: -9999, y: -9999 }, t0 = null, assembled = false, running = true, lastTheme = null;

  function palette() {
    var dark = body.classList.contains('dark');
    return dark
      ? { ink: [78, 232, 214], mid: [139, 155, 255], bg: 'rgba(19,27,35,1)' }
      : { ink: [16, 27, 38], mid: [11, 127, 120], bg: 'rgba(248,250,252,1)' };
  }

  function sample() {
    var off = document.createElement('canvas'), G = 96;       // 96×96 sampling grid ≈ 6.5k points
    off.width = G; off.height = G;
    var oc = off.getContext('2d');
    try {
      oc.drawImage(img, 0, 0, G, G);
      var data = oc.getImageData(0, 0, G, G).data;
    } catch (e) { return false; }                               // tainted canvas: leave the photo as is
    pts = [];
    var cell = W / G, r2 = (G / 2) * (G / 2);
    for (var y = 0; y < G; y++) for (var x = 0; x < G; x++) {
      var dx = x - G / 2 + .5, dy = y - G / 2 + .5;
      if (dx * dx + dy * dy > r2) continue;                     // keep the circle
      var i = (y * G + x) * 4, a = data[i + 3];
      if (a < 40) continue;
      var lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      var dk = Math.pow(1 - lum, 1.4);                            // stipple weight: dark pixels = big ink dots
      if (dk < 0.06) continue;                                    // near-white background: no dot
      pts.push({
        hx: (x + .5) * cell, hy: (y + .5) * cell, dk: dk, rad: (0.25 + dk * cell * 0.75),
        x: W / 2 + (Math.random() - .5) * W * 1.6, y: H / 2 + (Math.random() - .5) * H * 1.6,
        vx: 0, vy: 0, ph: Math.random() * Math.PI * 2
      });
    }
    cap.textContent = pts.length.toLocaleString('en-US') + ' pts · point cloud';
    return true;
  }

  function draw(now) {
    var P = palette(), dark = body.classList.contains('dark');
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = P.bg; ctx.beginPath(); ctx.arc(W / 2, H / 2, W / 2, 0, Math.PI * 2); ctx.fill();
    var tt = (now || 0) / 1000;
    for (var k = 0; k < pts.length; k++) {
      var p = pts[k];
      // spring to home, breathing offset, mouse repulsion
      var bx = Math.sin(tt * 0.6 + p.ph) * 0.35 * dpr, by = Math.cos(tt * 0.5 + p.ph) * 0.35 * dpr;
      var tx = p.hx + bx, ty = p.hy + by;
      var mx = p.x - mouse.x, my = p.y - mouse.y, md2 = mx * mx + my * my, R = 34 * dpr;
      if (md2 < R * R) { var md = Math.sqrt(md2) || 1, f = (R - md) / R; tx += mx / md * f * 26 * dpr; ty += my / md * f * 26 * dpr; }
      p.vx = (p.vx + (tx - p.x) * 0.06) * 0.78; p.vy = (p.vy + (ty - p.y) * 0.06) * 0.78;
      p.x += p.vx; p.y += p.vy;
      // dark pixels → ink dots; light pixels → faint accent dots (a stippled portrait)
      var dk = p.dk, c = dk > 0.5 ? P.ink : P.mid, al = dark ? (0.2 + dk * 0.8) : (0.15 + dk * 0.95);
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.min(1, al).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  function frame(now) {
    if (!running) return;
    draw(now);
    if (reduce && assembled) return;
    requestAnimationFrame(frame);
  }

  function start() {
    if (!sample()) return;
    wrap.classList.remove('show-photo');
    if (reduce) { pts.forEach(function (p) { p.x = p.hx; p.y = p.hy; }); assembled = true; draw(0); return; }
    requestAnimationFrame(frame);
    setTimeout(function () { assembled = true; }, 2500);
  }
  if (img.complete && img.naturalWidth) start(); else img.addEventListener('load', start);

  // interaction
  wrap.addEventListener('mousemove', function (e) { var r = wrap.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width * W; mouse.y = (e.clientY - r.top) / r.height * H; }, { passive: true });
  wrap.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
  var hoverable = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (hoverable) {
    var tmr;
    wrap.addEventListener('mouseenter', function () { tmr = setTimeout(function () { wrap.classList.add('show-photo'); }, 700); });
    wrap.addEventListener('mouseleave', function () { clearTimeout(tmr); wrap.classList.remove('show-photo'); });
  }
  wrap.addEventListener('click', function () { wrap.classList.toggle('show-photo'); });
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) requestAnimationFrame(frame); });

  // repaint when the day/night toggle flips
  new MutationObserver(function () {
    var th = body.classList.contains('dark');
    if (th !== lastTheme) { lastTheme = th; if (reduce) draw(0); }
  }).observe(body, { attributes: true, attributeFilter: ['class'] });
})();
