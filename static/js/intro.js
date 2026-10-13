/* liyc.pw — homepage intro: "the story so far".
   A ~5 s boot sequence of real work (data/intro.yaml): a log of milestones types out on the left
   while images / clips stack up on the right, then the name appears and the overlay closes like an
   iris into the portrait. Any click, key, scroll or the Skip button ends it at once.
   The gate in custom_head decides whether it runs (first visit, then at most weekly). */
(function () {
  'use strict';
  var d = document.documentElement;
  if (!d.classList.contains('intro-on')) return;
  var el = document.getElementById('intro-data');
  if (!el) { d.classList.remove('intro-on'); return; }
  var data;
  try { data = JSON.parse(el.textContent); } catch (e) { d.classList.remove('intro-on'); return; }
  var steps = data.steps || [], zh = data.lang === 'zh';
  if (!steps.length) { d.classList.remove('intro-on'); return; }

  function h(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---- overlay ----
  var ov = h('div', 'intro');
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', zh ? '开场动画' : 'Intro');
  var top = h('div', 'intro-top');
  top.appendChild(h('div', 'intro-brand', 'liyc.pw <b>▸</b> <span>' + (zh ? '加载到目前为止的故事' : 'loading the story so far') + '</span>'));
  var skip = h('button', 'intro-skip', (zh ? '跳过' : 'Skip') + ' <kbd>⏎</kbd>');
  skip.type = 'button';
  top.appendChild(skip);
  var main = h('div', 'intro-main');
  var log = h('ol', 'intro-log');
  var stage = h('div', 'intro-stage');
  main.appendChild(log); main.appendChild(stage);
  var bar = h('div', 'intro-bar', '<i></i>');
  var fin = h('div', 'intro-final', '<div class="intro-name">' + esc(data.name || '') + '</div>' + (data.tagline ? '<div class="intro-tag">' + esc(data.tagline) + '</div>' : ''));
  ov.appendChild(top); ov.appendChild(main); ov.appendChild(fin); ov.appendChild(bar);
  (document.body || d).appendChild(ov);
  skip.focus({ preventScroll: true });

  // ---- preload media (start after everything is ready, or after 700 ms at most) ----
  var loaders = [], videos = {};
  steps.forEach(function (s, i) {
    if (!s.media) return;
    if (/\.mp4(\?|$)/.test(s.media)) {
      var v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      if (s.poster) v.poster = s.poster;
      v.src = s.media;
      videos[i] = v;
    } else {
      loaders.push(new Promise(function (res) {
        var im = new Image(); im.referrerPolicy = 'no-referrer'; im.decoding = 'async';
        im.onload = function () { s._ok = true; res(); }; im.onerror = function () { s._ok = false; res(); };
        im.src = s.media;
      }));
    }
  });

  // ---- sequence ----
  var timers = [], done = false, cards = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function type(node, text) {
    var k = 0, step = Math.max(1, Math.ceil(text.length / 14));
    (function tick() {
      if (done) return;
      k = Math.min(text.length, k + step);
      node.textContent = text.slice(0, k);
      if (k < text.length) timers.push(setTimeout(tick, 16));
    })();
  }

  function show(i) {
    var s = steps[i];
    // log line
    Array.prototype.forEach.call(log.children, function (li) { li.classList.remove('is-cur'); });
    var li = h('li', 'is-cur', '<span class="y">' + esc(s.year) + '</span><span class="t"></span>');
    log.appendChild(li);
    type(li.querySelector('.t'), s.label);
    var all = log.children;
    for (var j = 0; j < all.length; j++) all[j].classList.toggle('is-recent', j >= all.length - 3);
    // card
    var card = h('figure', 'intro-card');
    card.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1.2 + (i * 7 % 5) * .5)).toFixed(1) + 'deg');
    if (videos[i]) {
      card.appendChild(videos[i]);
      var p = videos[i].play(); if (p && p.catch) p.catch(function () {});
    } else if (s.media && s._ok !== false) {
      var im = h('img'); im.alt = ''; im.referrerPolicy = 'no-referrer'; im.src = s.media;
      card.appendChild(im);
    } else {
      card.classList.add('is-logo');
      if (s.logo) { var lg = h('img'); lg.alt = ''; lg.src = s.logo; card.appendChild(lg); }
    }
    if (s.logo && !card.classList.contains('is-logo')) { var b = h('img', 'intro-badge'); b.alt = ''; b.src = s.logo; card.appendChild(b); }
    card.appendChild(h('figcaption', '', '<b>' + esc(s.year) + '</b> ' + esc(s.label)));
    stage.appendChild(card);
    cards.push(card);
    cards.forEach(function (c, k) {
      var depth = cards.length - 1 - k;
      c.style.setProperty('--d', depth);
      c.classList.toggle('is-back', depth > 0);
      if (depth > 3) { c.remove(); }
    });
    cards = cards.filter(function (c) { return c.isConnected; });
    bar.firstChild.style.width = ((i + 1) / steps.length * 100).toFixed(1) + '%';
  }

  function run() {
    if (done) return;
    ov.classList.add('is-running');
    var t = 150;
    steps.forEach(function (s, i) {
      later(function () { show(i); }, t);
      t += (s.media ? 480 : 380);
    });
    later(function () { ov.classList.add('is-final'); }, t + 150);
    later(function () { finish(false); }, t + 1350);
  }

  function finish(skipped) {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    try { localStorage.setItem('liyc-intro', String(Date.now())); } catch (e) {}
    ['keydown', 'wheel', 'touchstart'].forEach(function (ev) { window.removeEventListener(ev, onSkip, true); });
    // iris closes into the portrait (or the centre of the screen)
    var tgt = document.querySelector('#profile .pc-wrap, #profile img.portrait');
    var r = tgt && tgt.getBoundingClientRect();
    var cx = r && r.width ? r.left + r.width / 2 : innerWidth / 2;
    var cy = r && r.height ? r.top + r.height / 2 : innerHeight / 2;
    var rad = r && r.width ? r.width / 2 : 0;
    ov.style.setProperty('--cx', cx + 'px');
    ov.style.setProperty('--cy', cy + 'px');
    ov.style.setProperty('--rad', rad + 'px');
    ov.style.transitionDuration = skipped ? '.45s' : '.8s';
    d.classList.remove('intro-on');
    requestAnimationFrame(function () { ov.classList.add('is-closing'); });
    setTimeout(function () {
      Object.keys(videos).forEach(function (k) { try { videos[k].pause(); videos[k].removeAttribute('src'); videos[k].load(); } catch (e) {} });
      ov.remove();
      document.dispatchEvent(new CustomEvent('liyc:intro-done'));
    }, skipped ? 500 : 850);
  }

  function onSkip(e) {
    if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return;
    finish(true);
  }
  skip.addEventListener('click', function () { finish(true); });
  ov.addEventListener('click', function () { finish(true); });
  ['keydown', 'wheel', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, onSkip, { capture: true, passive: true }); });

  var gate = new Promise(function (res) { setTimeout(res, 700); });
  Promise.race([Promise.all(loaders), gate]).then(run);
})();
