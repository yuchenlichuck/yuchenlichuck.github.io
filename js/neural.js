/* liyc.pw — section reveal, e-mail helpers, video facades, in-view teaser videos and the
   portrait that turns from a photo into a colour 3D point cloud (see the portrait block below).
   Everything stays still under prefers-reduced-motion. */
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

  // ---- video facades: load the Bilibili player only when asked ----
  Array.prototype.forEach.call(document.querySelectorAll('.vfacade'), function (f) {
    var btn = f.querySelector('.vfacade-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var fr = document.createElement('iframe');
      fr.src = f.getAttribute('data-src');
      fr.title = f.getAttribute('data-title') || 'Video';
      fr.setAttribute('allowfullscreen', 'true');
      fr.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      fr.setAttribute('scrolling', 'no');
      f.innerHTML = '';
      f.appendChild(fr);
    });
  });

  // ---- video teasers: play only while on screen (saves battery, keeps the page calm) ----
  var vids = document.querySelectorAll('video.js-inview');
  if (vids.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.25 });
      Array.prototype.forEach.call(vids, function (v) { v.muted = true; vio.observe(v); });
    } else if (reduce) {
      Array.prototype.forEach.call(vids, function (v) { v.removeAttribute('autoplay'); v.pause(); });
    }
  }

  // ---- teasers with a music track get a small unmute button (videos always start muted) ----
  Array.prototype.forEach.call(document.querySelectorAll('video[data-sound]'), function (v) {
    var box = v.closest('.publication-image-container, .focus-area-media') || v.parentNode;
    var zhs = (document.documentElement.lang || '').indexOf('zh') === 0;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'teaser-sound';
    var set = function () {
      b.setAttribute('aria-label', v.muted ? (zhs ? '打开声音' : 'Play with sound') : (zhs ? '静音' : 'Mute'));
      b.innerHTML = v.muted ? '<i class="fas fa-volume-mute" aria-hidden="true"></i><span>' + (zhs ? '声音' : 'Sound') + '</span>'
                            : '<i class="fas fa-volume-up" aria-hidden="true"></i><span>' + (zhs ? '静音' : 'Mute') + '</span>';
    };
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var turnOn = v.muted;
      // only one teaser plays sound at a time
      Array.prototype.forEach.call(document.querySelectorAll('video[data-sound]'), function (o) { if (o !== v && !o.muted) { o.muted = true; o.dispatchEvent(new Event('volumechange')); } });
      v.muted = !turnOn;
      if (turnOn) { v.currentTime = 0; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      set();
    });
    v.addEventListener('volumechange', set);
    set();
    box.appendChild(b);
  });

  // ---- portrait: photo first, then it lifts into a beating 3D point cloud ----
  // Each point keeps the colour of its pixel in the photo; depth comes from a monocular
  // depth map (Depth Anything V2) shipped next to the photo. Timeline:
  //   photo (1.6 s) → dense dots under the photo → photo fades → dots shrink, background
  //   thins out, the face extrudes in depth, the cloud sways and pulses on a ~96 bpm beat.
  // Cursor tilts the cloud and pushes points aside; click / tap toggles back to the photo.
  var img = document.querySelector('#profile img.portrait, .wg-about img.portrait');
  if (!img || reduce) return;                                     // reduced motion: the photo stays as is

  var wrap = document.createElement('div');
  wrap.className = 'pc-wrap is-photo';
  wrap.setAttribute('role', 'button');
  wrap.setAttribute('tabindex', '0');
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  wrap.insertBefore(cv, img);
  var cap = document.createElement('span');
  cap.className = 'pc-cap';
  wrap.parentNode.insertBefore(cap, wrap.nextSibling);
  var zh = (document.documentElement.lang || '').indexOf('zh') === 0;
  wrap.setAttribute('aria-label', zh ? '切换照片与点云' : 'Toggle photo / point cloud');
  wrap.title = zh ? '点击切换：照片 ↔ 点云' : 'Click: photo ↔ point cloud';

  var ctx = cv.getContext('2d');
  var dpr = Math.min(2.5, Math.max(1.5, window.devicePixelRatio || 1));
  var W = 0, H = 0;
  function resize() {
    var s = wrap.getBoundingClientRect().width || 220;
    W = Math.round(s * dpr); H = W; cv.width = W; cv.height = H;
  }

  var G = 92;                                                     // sampling grid → ~6.6k points
  var bg = [], fg = [], all = [];
  var mode = 'photo', m = 0, target = 0, t0 = 0, last = 0, running = true, onScreen = true, sortTick = 0;
  var mouse = { x: -1e4, y: -1e4, in: false, yaw: 0, pitch: 0 };

  function loadImg(src) {
    return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
  }
  function grab(im) {
    var c = document.createElement('canvas'); c.width = G; c.height = G;
    var x = c.getContext('2d'); x.drawImage(im, 0, 0, G, G);
    return x.getImageData(0, 0, G, G).data;
  }

  function build(col, dep) {
    var r2 = (G / 2) * (G / 2);
    for (var y = 0; y < G; y++) for (var x = 0; x < G; x++) {
      var dx = x - G / 2 + .5, dy = y - G / 2 + .5;
      if (dx * dx + dy * dy > r2) continue;
      var i = (y * G + x) * 4;
      var d = dep ? dep[i] / 255 : 0.5;
      var p = {
        u: (x + .5) / G * 2 - 1, v: (y + .5) / G * 2 - 1,
        z: (d - 0.42) * 1.15,                                     // disparity → depth around the face plane
        c: 'rgb(' + col[i] + ',' + col[i + 1] + ',' + col[i + 2] + ')',
        r: Math.sqrt(dx * dx + dy * dy) / (G / 2),
        j: Math.random() * Math.PI * 2,
        px: 0, py: 0, vx: 0, vy: 0, sz: 0, init: false
      };
      p.bg = !!(dep && d < 0.16);
      (p.bg ? bg : fg).push(p);
    }
    all = bg.concat(fg);
    cap.textContent = all.length.toLocaleString('en-US') + (zh ? ' 个点 · 单目深度' : ' pts · monocular depth');
  }

  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function draw(now) {
    var t = (now - t0) / 1000, dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    // morph progress towards target (≈1.8 s each way)
    m += (target > m ? 1 : -1) * dt / 1.8;
    m = Math.max(0, Math.min(1, m));
    var e = ease(m);
    if (target === 0 && m === 0 && mode !== 'photo') { mode = 'photo'; wrap.classList.add('is-photo'); }

    // gentle sway + mouse parallax
    mouse.yaw += ((mouse.in ? (mouse.x / W - .5) * 0.9 : 0) - mouse.yaw) * 0.08;
    mouse.pitch += ((mouse.in ? (mouse.y / H - .5) * -0.6 : 0) - mouse.pitch) * 0.08;
    var yaw = e * (0.30 * Math.sin(t * 0.55) + mouse.yaw), pitch = e * (0.09 * Math.sin(t * 0.41) + mouse.pitch);
    var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    var beatT = 60 / 96, f = 3.2, k = 1 - 0.10 * e, cell = W / G;
    var R = 22 * dpr, R2 = R * R;

    ctx.clearRect(0, 0, W, H);
    for (var n = 0; n < all.length; n++) {
      var p = all[n], isBg = p.bg;
      // a beat that ripples outward from the centre of the face
      var ph = ((t - p.r * 0.5) % beatT + beatT) % beatT;
      var pulse = Math.exp(-ph / 0.11) * e;
      var X = p.u * (1 + pulse * 0.035), Y = p.v * (1 + pulse * 0.035);
      var Z = p.z * e * (isBg ? 1.6 : 1) + (isBg ? 0 : pulse * 0.10);
      Y += Math.sin(t * 2.2 + p.j) * 0.006 * e;                   // tiny per-point shimmer
      var x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy;
      var y1 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp;
      var s = f / (f - z2);
      var tx = W / 2 + x1 * s * k * W / 2, ty = H / 2 + y1 * s * k * H / 2;
      // cursor pushes points aside
      var mx = tx - mouse.x, my = ty - mouse.y, md2 = mx * mx + my * my;
      if (e > 0.2 && md2 < R2) { var md = Math.sqrt(md2) || 1, ff = (R - md) / R * e; tx += mx / md * ff * 9 * dpr; ty += my / md * ff * 9 * dpr; }
      if (!p.init) { p.px = tx; p.py = ty; p.init = true; }
      p.vx = (p.vx + (tx - p.px) * 0.22) * 0.62; p.vy = (p.vy + (ty - p.py) * 0.22) * 0.62;
      p.px += p.vx; p.py += p.vy;
      p.sz = cell * (0.74 - 0.30 * e) * s * (1 + pulse * 0.12);
      p.al = isBg ? 1 - 0.88 * e : 1;
      p.dz = isBg ? z2 - 10 : z2;                                 // background always paints first
    }
    // painter's order: far points first (re-sorted every few frames — rotation is slow)
    if (e > 0 && (sortTick++ % 6 === 0)) all.sort(function (a, b) { return a.dz - b.dz; });
    var curA = -1;
    for (var q = 0; q < all.length; q++) {
      var o = all[q];
      if (o.al < 0.02) continue;
      if (o.al !== curA) { ctx.globalAlpha = curA = o.al; }
      ctx.fillStyle = o.c;
      ctx.beginPath(); ctx.arc(o.px, o.py, o.sz, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running || !onScreen) { looping = false; return; }
    draw(now);
    if (target === 0 && m === 0 && mode === 'photo') { looping = false; return; }   // photo is showing: idle
    requestAnimationFrame(frame);
  }
  var looping = false;
  function kick() { if (!looping && running && onScreen) { looping = true; last = 0; requestAnimationFrame(frame); } }

  function toCloud() {
    target = 1; mode = 'cloud';
    wrap.classList.remove('is-photo');                            // CSS fades the photo out over the dense dots
    kick();
  }
  function toPhoto() { target = 0; kick(); }

  function start(dep) {
    try { build(grab(img), dep ? grab(dep) : null); } catch (err) { return; }   // tainted canvas → keep the photo
    resize();
    t0 = performance.now();
    wrap.classList.add('pc-on');
    kick();
    setTimeout(toCloud, 1600);
  }

  var ready = (img.complete && img.naturalWidth) ? Promise.resolve() : new Promise(function (r) { img.addEventListener('load', r); });
  var dsrc = img.getAttribute('data-depth');
  ready.then(function () { return dsrc ? loadImg(dsrc).catch(function () { return null; }) : null; }).then(start);

  // interaction
  function setMouse(e) { var r = wrap.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width * W; mouse.y = (e.clientY - r.top) / r.height * H; mouse.in = true; }
  wrap.addEventListener('pointermove', setMouse, { passive: true });
  wrap.addEventListener('pointerleave', function () { mouse.x = mouse.y = -1e4; mouse.in = false; });
  function toggle() { if (target > 0.5) toPhoto(); else toCloud(); }
  wrap.addEventListener('click', toggle);
  wrap.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  document.addEventListener('visibilitychange', function () { running = !document.hidden; kick(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; kick(); }).observe(wrap);
  }
  window.addEventListener('resize', function () { var w = W; resize(); if (W !== w) all.forEach(function (p) { p.init = false; }); });
})();
