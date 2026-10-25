/* ==========================================================================
   liyc.pw — "Neko-VLM" Interactive AI Kitten Pet (static/js/ai-pet.js)
   A procedural 2.5D canvas kitten in the bottom-right corner of the homepage
   with spring physics, cursor-tracking eyes, petting detection, goofy/cute
   expressions, 360° point-cloud spins, UCanDance beat-synced dancing, bouncy
   hopping, and a live Computer Vision (Perceptio <seg>/<depth> + Pose Skeleton)
   AI overlay mode.
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  if (!body || !body.classList.contains('theme-claude')) return;
  if (document.getElementById('neko-pet')) return;

  var zh = (document.documentElement.lang || '').toLowerCase().indexOf('zh') === 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var I18N = {
    zh: {
      tag: 'NEKO-AI · 视觉小猫',
      minTitle: '收起小猫',
      restoreLabel: '召唤 AI 小猫 Neko',
      btns: [
        { act: 'spin', icon: '🌀', label: '转圈' },
        { act: 'dance', icon: '💃', label: '跳舞' },
        { act: 'hop', icon: '🐾', label: '蹦跶' },
        { act: 'derp', icon: '😜', label: '搞怪' },
        { act: 'ai', icon: '✨', label: 'AI 视角' }
      ],
      lines: {
        greet: [
          '喵～我是禹陈的 AI 小猫 Neko！点我转圈、跳舞、蹦跶，或者摸摸我的头 🐾',
          '叮！Perceptio 空间感知已上线～今天想看我转圈圈还是跳支舞？🐱',
          '呼噜噜… 我是由点云与扩散模型养大的小猫，随时为你表演！✨'
        ],
        spin: [
          '呜哇——360° 点云旋转！再转就要变成 3D Gaussian Splatting 啦 ～',
          '转圈圈！PointNeXt 旋转不变性测试通过 🌀',
          '呼——转了三圈半，我的空间 token 都要摇匀啦！'
        ],
        dizzy: [
          '晕乎乎 @_@ 梯度爆炸啦… 让我缓一秒钟喵～',
          '哇啊啊转晕了 @_@ 满眼都是小星星 ★'
        ],
        dance: [
          '💃 UCanDance 启动！跟着 2D 姿态扩散模型的节拍摇摆 ♪',
          '喵呜 ♪ 左爪画个龙，右爪画彩虹，AI 猫猫跳起舞来从不掉帧 ♫',
          '动次打次！正在复现 Sony AI 实习期间训练的舞蹈生成律动 ♬'
        ],
        hop: [
          '蹦！蹦！正在跨越 Loss Landscape 的局部最优～🐾',
          'Boing! 弹性拉满！看我一跃跳过 719 万个 3D 渲染部件！',
          '哒哒哒～小猫蹦跶一下，实验指标涨三个点 📈'
        ],
        derp: {
          blep: '略略略 :P 假装自己是一个正经的视觉语言模型（其实忘了收舌头）',
          shock: '⊙〇⊙ 瞳孔地震！！你刚刚说 Reviewer #2 给打满分了？！',
          starry: '✧ω✧ 星星眼发射！看到漂亮的代码和好玩的想法就走不动道～',
          squint: '¬_¬ 傲娇凝视：这个深度图，我一眼就看出远近了喵。',
          cool: '⌐■-■ 赛博墨镜已戴好——叫我迪拜小猫王子！',
          cross: '>w< 鼻尖上有一颗会发光的空间 token，好想抓！'
        },
        pet: [
          '呼噜噜噜 ^ω^ 好舒服喵～算力 +100，心情 +100 ♥',
          '喵呜～在「72小时AI生存挑战」里，禹陈专门换了 15 分钟上天台撸猫呢 ♥',
          '再摸摸头，我就给你吐一串高置信度的 <seg> 小爱心 ♥'
        ],
        aiOn: '🔍 AI 视觉模式开启：实时渲染 2D 骨骼关键点 + Perceptio 深度检测框！',
        aiOff: '🐾 已切回毛茸茸小猫模式～但我的神经网络还在后台转着呢！',
        sections: {
          about: '👀 看到左边的头像了吗？它会从照片变成 6,600 个 3D 点云哦！',
          'focused-areas': '🧠 这里是四大研究方向：空间 VLM、舞蹈视频生成、3D 感知与神经渲染！',
          publications: '📄 PointNeXt 引用已经破 1,680+ 啦！快看看最新的 Perceptio 和 UCanDance～',
          news: '🎉 最新消息：禹陈刚从德国第 13 届海德堡学者论坛（HLF）回来！',
          media: '🎬 这里有五源资本《72小时AI生存挑战》纪录片和 36氪脱口秀视频！',
          beyond: '☕ 100 杯咖啡计划进行中！还有那次在天台撸猫 15 分钟的名场面 🐱'
        }
      }
    },
    en: {
      tag: 'NEKO-AI · VISION PET',
      minTitle: 'Minimize pet',
      restoreLabel: 'Wake up AI Kitty Neko',
      btns: [
        { act: 'spin', icon: '🌀', label: 'Spin' },
        { act: 'dance', icon: '💃', label: 'Dance' },
        { act: 'hop', icon: '🐾', label: 'Hop' },
        { act: 'derp', icon: '😜', label: 'Goofy' },
        { act: 'ai', icon: '✨', label: 'AI View' }
      ],
      lines: {
        greet: [
          "Meow~ I'm Neko, Yuchen's AI kitty! Click to make me spin, dance, hop, or pet my head 🐾",
          'Perceptio spatial tokens online! Want to see a 360° spin or a little dance? 🐱',
          'Purrrr... Raised on 3D point clouds and pose diffusion models—ready to perform! ✨'
        ],
        spin: [
          "Wheee—360° point-cloud spin! One more and I'll turn into 3D Gaussian Splatting~",
          'Spinning around! PointNeXt rotation-invariance check passed 🌀',
          'Whoosh! All my spatial tokens are thoroughly shuffled now!'
        ],
        dizzy: [
          'Whoa @_@ Gradient explosion... give me a second to un-dizzy, meow~',
          'So dizzy @_@ Seeing orbiting stars everywhere ★'
        ],
        dance: [
          '💃 UCanDance mode ON! Grooving to 2D pose diffusion beats ♪',
          'Meow ♪ Left paw up, right paw up—long-horizon dance synthesis at 60 FPS ♫',
          'Bop-bop! Channeling the rhythm from Yuchen’s Sony AI Tokyo internship ♬'
        ],
        hop: [
          'Boing! Boing! Hopping right over local minima in the loss landscape~ 🐾',
          'Hop! Jumping across 7.19 million 3D CoMPaT part-material compositions!',
          'Boing~ Every happy hop boosts validation accuracy by +3% 📈'
        ],
        derp: {
          blep: 'Blep :P Pretending to be a serious Vision-Language Model (forgot to tuck my tongue in)',
          shock: '⊙〇⊙ SHOCKED!! Did you just say Reviewer #2 gave a Strong Accept?!',
          starry: '✧ω✧ Starry-eyed! Nothing beats clean geometry and a cute demo~',
          squint: '¬_¬ Side-eye mode: estimating your monocular depth map right now, meow.',
          cool: '⌐■-■ Cyber visor engaged — call me the little Dubai Cat Prince!',
          cross: '>w< There is a glowing spatial token floating right on my nose!'
        },
        pet: [
          'Purrrrr ^ω^ That feels pawsome~ Compute +100, Serotonin +100 ♥',
          'Meow~ In the 72-Hour AI Survival Challenge, Yuchen spent his reward on 15 mins of rooftop cat-petting ♥',
          'Keep petting and I will emit high-confidence <seg> heart tokens ♥'
        ],
        aiOn: '🔍 AI Vision ON: live 2D pose keypoints + Perceptio depth bounding box!',
        aiOff: '🐾 Back to fluffy kitty mode~ my neural net is still purring underneath!',
        sections: {
          about: '👀 Notice the portrait on the left? It morphs into a 6,600-point 3D cloud!',
          'focused-areas': '🧠 Four core research pillars: Spatial VLMs, Dance Generation, 3D Vision & Neural Rendering!',
          publications: '📄 PointNeXt just passed 1,680+ citations! Check out Perceptio & UCanDance too~',
          news: '🎉 Latest news: Yuchen just returned from the 13th Heidelberg Laureate Forum!',
          media: '🎬 Watch the 72-Hour AI Survival Challenge documentary & 36Kr stand-up here!',
          beyond: '☕ 100 Coffees in progress—plus the famous 15-minute rooftop cat break! 🐱'
        }
      }
    }
  };

  var T = I18N[zh ? 'zh' : 'en'];

  // ---- Build DOM ----
  var root = document.createElement('aside');
  root.id = 'neko-pet';
  root.className = 'neko-pet';
  root.setAttribute('aria-label', zh ? 'AI 互动小猫宠物' : 'Interactive AI kitten pet');

  var html = '' +
    '<button type="button" class="neko-restore" id="neko-restore" aria-label="' + T.restoreLabel + '" title="' + T.restoreLabel + '">' +
      '<span class="neko-restore-dot"></span>' +
      '<span class="neko-restore-face">🐱</span>' +
      '<span class="neko-restore-txt">Neko AI</span>' +
    '</button>' +
    '<div class="neko-card" id="neko-card">' +
      '<div class="neko-bubble" id="neko-bubble" role="status" aria-live="polite"></div>' +
      '<div class="neko-top">' +
        '<span class="neko-tag"><i class="neko-led"></i><span id="neko-tag-txt">' + T.tag + '</span></span>' +
        '<button type="button" class="neko-min" id="neko-min" aria-label="' + T.minTitle + '" title="' + T.minTitle + '">−</button>' +
      '</div>' +
      '<div class="neko-stage" id="neko-stage">' +
        '<canvas id="neko-canvas" width="320" height="290"></canvas>' +
      '</div>' +
      '<div class="neko-dock" role="toolbar" aria-label="Pet actions">' +
        T.btns.map(function (b) {
          return '<button type="button" class="neko-btn" data-act="' + b.act + '" title="' + b.label + '">' +
            '<span class="neko-btn-ic" aria-hidden="true">' + b.icon + '</span>' +
            '<span class="neko-btn-lb">' + b.label + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
    '</div>';

  root.innerHTML = html;
  body.appendChild(root);

  var cardEl = document.getElementById('neko-card');
  var bubbleEl = document.getElementById('neko-bubble');
  var tagTxtEl = document.getElementById('neko-tag-txt');
  var stageEl = document.getElementById('neko-stage');
  var canvas = document.getElementById('neko-canvas');
  var minBtn = document.getElementById('neko-min');
  var restoreBtn = document.getElementById('neko-restore');
  var actionBtns = root.querySelectorAll('.neko-btn');
  var ctx = canvas.getContext('2d');

  // ---- Sizing & HiDPI ----
  var CW = 164, CH = 148, dpr = Math.min(2.5, Math.max(1.5, window.devicePixelRatio || 1));
  function resizeCanvas() {
    dpr = Math.min(2.5, Math.max(1.5, window.devicePixelRatio || 1));
    canvas.width = Math.round(CW * dpr);
    canvas.height = Math.round(CH * dpr);
    canvas.style.width = CW + 'px';
    canvas.style.height = CH + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ---- State & Physics ----
  var DERP_FACES = ['blep', 'shock', 'starry', 'cool', 'squint', 'cross'];
  var derpIdx = 0;

  var state = {
    mode: 'idle',          // 'idle' | 'spin' | 'dance' | 'hop' | 'derp' | 'pet' | 'dizzy'
    expr: 'normal',        // 'normal' | 'happy' | 'blep' | 'shock' | 'starry' | 'cool' | 'squint' | 'cross' | 'dizzy' | 'sleepy'
    aiView: false,         // live CV skeleton + depth bounding box
    minimized: false,
    modeStart: performance.now(),
    modeDur: 0,
    spinCount: 0,
    lastSpinAt: 0,
    // Physics coordinates (relative to stage center)
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    scaleX: 1,
    scaleY: 1,
    rot: 0,                // 2D tilt
    spinAngle: 0,          // 360° turntable angle (0..2π)
    hopPhase: 0,
    danceTime: 0,
    // Cursor tracking & petting
    mouseX: 0,
    mouseY: 0,
    mouseIn: false,
    lastPetX: null,
    petScore: 0,
    lastInteract: performance.now(),
    blinkTimer: 0,
    isBlinking: false,
    earTwitch: 0,
    particles: []
  };

  // ---- Speech Bubble Controller ----
  var bubbleTimer = null;
  function say(text, duration) {
    if (!text || state.minimized) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.add('is-on');
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      bubbleEl.classList.remove('is-on');
    }, duration || 4800);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ---- Particle Spawner (hearts, stars, musical notes, spatial tokens, paw puffs) ----
  function spawnParticle(kind, ox, oy) {
    var colors = ['#4ee8d6', '#0b7f78', '#f59e0b', '#fb7185', '#8b9bff'];
    state.particles.push({
      kind: kind, // 'heart' | 'star' | 'note' | 'token' | 'puff'
      x: (CW / 2) + (ox || (Math.random() - 0.5) * 56),
      y: (CH / 2) + (oy || (Math.random() - 0.5) * 36),
      vx: (Math.random() - 0.5) * 42,
      vy: -28 - Math.random() * 34,
      life: 1,
      decay: 0.7 + Math.random() * 0.45,
      size: 9 + Math.random() * 5,
      color: pick(colors),
      txt: kind === 'note' ? pick(['♪', '♫', '♬']) :
           kind === 'token' ? pick(['<seg>', '<depth>', 'z=0.42', 'xyz', '0.99']) :
           kind === 'heart' ? '♥' : '✦'
    });
  }

  function syncToolbarUI() {
    Array.prototype.forEach.call(actionBtns, function (btn) {
      var act = btn.getAttribute('data-act');
      var active = (act === 'ai' && state.aiView) ||
                   (act !== 'ai' && state.mode === act);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (state.aiView) {
      tagTxtEl.textContent = 'PERCEPTIO · <SEG> <DEPTH>';
    } else if (state.mode === 'dance') {
      tagTxtEl.textContent = 'UCANDANCE · 124 BPM';
    } else if (state.mode === 'spin') {
      tagTxtEl.textContent = 'POINTNEXT · 3D SPIN';
    } else {
      tagTxtEl.textContent = T.tag;
    }
  }

  // ---- Trigger Actions ----
  function triggerAction(act, silent) {
    var now = performance.now();
    state.lastInteract = now;

    if (act === 'ai') {
      state.aiView = !state.aiView;
      for (var i = 0; i < 5; i++) spawnParticle('token', (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 50);
      if (!silent) say(state.aiView ? T.lines.aiOn : T.lines.aiOff, 4600);
      syncToolbarUI();
      return;
    }

    if (act === 'spin') {
      if (now - state.lastSpinAt < 3200) state.spinCount++;
      else state.spinCount = 1;
      state.lastSpinAt = now;

      state.mode = 'spin';
      state.expr = 'happy';
      state.modeStart = now;
      state.modeDur = 1450;
      state.vy = -125;
      state.scaleX = 0.88;
      state.scaleY = 1.16;
      for (var s = 0; s < 7; s++) spawnParticle(state.aiView ? 'token' : 'star', (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40);
      if (!silent) say(pick(T.lines.spin), 4400);
      syncToolbarUI();
      return;
    }

    if (act === 'dance') {
      if (state.mode === 'dance' && !silent) {
        state.mode = 'idle';
        state.expr = 'normal';
        state.x = 0;
        state.rot = 0;
        syncToolbarUI();
        return;
      }
      state.mode = 'dance';
      state.expr = 'happy';
      state.modeStart = now;
      state.modeDur = 6400;
      state.danceTime = 0;
      for (var d = 0; d < 4; d++) spawnParticle('note', (Math.random() - 0.5) * 65, -20);
      if (!silent) say(pick(T.lines.dance), 5200);
      syncToolbarUI();
      return;
    }

    if (act === 'hop') {
      state.mode = 'hop';
      state.expr = 'happy';
      state.modeStart = now;
      state.modeDur = 2100;
      state.hopPhase = 0;
      state.vy = -175;
      state.vx = (Math.random() > 0.5 ? 1 : -1) * 55;
      state.scaleX = 0.82;
      state.scaleY = 1.22;
      for (var h = 0; h < 5; h++) spawnParticle('puff', (Math.random() - 0.5) * 35, 36);
      if (!silent) say(pick(T.lines.hop), 4400);
      syncToolbarUI();
      return;
    }

    if (act === 'derp') {
      var face = DERP_FACES[derpIdx % DERP_FACES.length];
      derpIdx++;
      state.mode = 'derp';
      state.expr = face;
      state.modeStart = now;
      state.modeDur = 4200;
      // Little pop bounce
      state.vy = -75;
      state.scaleX = 1.14;
      state.scaleY = 0.88;
      if (face === 'starry' || face === 'cool') {
        for (var k = 0; k < 5; k++) spawnParticle('star', (Math.random() - 0.5) * 60, -15);
      }
      if (!silent && T.lines.derp[face]) say(T.lines.derp[face], 4800);
      syncToolbarUI();
      return;
    }
  }

  // ---- Event Listeners ----
  Array.prototype.forEach.call(actionBtns, function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      triggerAction(btn.getAttribute('data-act'), false);
    });
  });

  // Clicking on the cat stage cycles through fun actions & goofy faces
  var stageClickCycle = ['hop', 'derp', 'spin', 'dance', 'derp'];
  var stageClickIdx = 0;
  stageEl.addEventListener('click', function () {
    var nextAct = stageClickCycle[stageClickIdx % stageClickCycle.length];
    stageClickIdx++;
    triggerAction(nextAct, false);
  });

  // Cursor tracking across viewport + petting on the stage
  window.addEventListener('pointermove', function (e) {
    if (state.minimized) return;
    var rect = canvas.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    state.mouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / 220));
    state.mouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / 220));

    var insideStage = (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    );
    state.mouseIn = insideStage;

    // Detect back-and-forth rubbing over the head ("摸头杀")
    if (insideStage && e.clientY < rect.top + rect.height * 0.62) {
      if (state.lastPetX !== null) {
        var dx = Math.abs(e.clientX - state.lastPetX);
        if (dx > 6) {
          state.petScore += dx;
          if (state.petScore > 95) {
            state.petScore = 0;
            state.lastInteract = performance.now();
            if (state.mode !== 'pet') {
              state.mode = 'pet';
              state.expr = 'happy';
              state.modeStart = performance.now();
              state.modeDur = 2400;
              say(pick(T.lines.pet), 4200);
            }
            spawnParticle('heart', (Math.random() - 0.5) * 44, -22);
          }
        }
      }
      state.lastPetX = e.clientX;
    } else {
      state.lastPetX = null;
      state.petScore = Math.max(0, state.petScore - 2);
    }
  }, { passive: true });

  // Minimize / Restore
  minBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    state.minimized = true;
    root.classList.add('is-minimized');
    bubbleEl.classList.remove('is-on');
  });
  restoreBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    state.minimized = false;
    root.classList.remove('is-minimized');
    state.lastInteract = performance.now();
    triggerAction('hop', true);
    say(pick(T.lines.greet), 4500);
  });

  // Automatically groove along if a teaser video with sound is unmuted on the page
  document.addEventListener('volumechange', function (e) {
    var v = e.target;
    if (v && v.tagName === 'VIDEO' && !v.muted) {
      if (state.mode !== 'dance') triggerAction('dance', false);
    }
  }, true);

  // Scroll section observer: Neko reacts with context-aware commentary (with cooldown)
  var lastSectionCommentAt = 0;
  var seenSections = {};
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      var now = performance.now();
      if (now - lastSectionCommentAt < 14000 || state.minimized) return;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (id && T.lines.sections[id] && !seenSections[id]) {
          seenSections[id] = true;
          lastSectionCommentAt = now;
          say(T.lines.sections[id], 5200);
          // Subtle ear twitch / happy bounce
          state.vy = -45;
          state.earTwitch = 1;
        }
      });
    }, { threshold: 0.35 });

    ['about', 'focused-areas', 'publications', 'news', 'media', 'beyond'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) secIO.observe(el);
    });
  }

  // Initial greeting (waits for homepage intro if active)
  function initialGreet() {
    setTimeout(function () {
      if (state.minimized) return;
      triggerAction('hop', true);
      say(pick(T.lines.greet), 5500);
    }, 1100);
  }
  if (document.documentElement.classList.contains('intro-on')) {
    document.addEventListener('liyc:intro-done', initialGreet, { once: true });
  } else {
    initialGreet();
  }

  // ---- Drawing Helpers ----
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR, rot) {
    var step = Math.PI / spikes;
    ctx.beginPath();
    for (var i = 0; i < 2 * spikes; i++) {
      var r = (i % 2 === 0) ? outerR : innerR;
      var a = i * step + (rot || 0);
      var x = cx + Math.cos(a) * r;
      var y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ---- Main Physics & Render Loop ----
  var lastTime = performance.now();

  function stepAndRender(now) {
    requestAnimationFrame(stepAndRender);
    if (state.minimized || document.hidden) {
      lastTime = now;
      return;
    }

    var dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    var elapsed = now - state.modeStart;

    // 1. Autonomous AI state transitions
    if (state.mode !== 'idle' && state.modeDur > 0 && elapsed > state.modeDur) {
      if (state.mode === 'spin' && state.spinCount >= 2) {
        state.mode = 'dizzy';
        state.expr = 'dizzy';
        state.modeStart = now;
        state.modeDur = 3200;
        state.spinCount = 0;
        say(pick(T.lines.dizzy), 4000);
      } else {
        state.mode = 'idle';
        state.expr = 'normal';
        state.modeDur = 0;
      }
      syncToolbarUI();
    }

    // Idle autonomous behaviors (every ~9s do something cute)
    if (state.mode === 'idle') {
      var idleSec = (now - state.lastInteract) / 1000;
      if (idleSec > 28) {
        state.expr = 'sleepy';
      } else if (Math.random() < dt * 0.14 && !reduceMotion) {
        var r = Math.random();
        if (r < 0.32) {
          state.earTwitch = 1;
        } else if (r < 0.58) {
          // Mini happy bounce
          state.vy = -65;
          state.scaleX = 0.92;
          state.scaleY = 1.09;
        } else if (r < 0.80) {
          state.expr = pick(['happy', 'blep', 'starry', 'normal']);
          setTimeout(function () {
            if (state.mode === 'idle') state.expr = 'normal';
          }, 2200);
        } else if (state.aiView) {
          spawnParticle('token', (Math.random() - 0.5) * 50, -15);
        }
      }
    }

    // Blinking timer
    state.blinkTimer -= dt;
    if (state.blinkTimer <= 0) {
      state.isBlinking = true;
      setTimeout(function () { state.isBlinking = false; }, 140);
      state.blinkTimer = 2.6 + Math.random() * 3.2;
    }
    state.earTwitch = Math.max(0, state.earTwitch - dt * 4.5);

    // 2. Mode-specific kinematics
    var beat = 0;
    var leftPawRaise = 0;
    var rightPawRaise = 0;
    var hipSway = 0;
    var headBob = 0;

    if (state.mode === 'spin') {
      var p = Math.min(1, elapsed / state.modeDur);
      // Smooth cubic ease in-out for 2 full 360° turns (or 1 turn)
      var turns = state.spinCount >= 2 ? 2 : 1;
      var easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      state.spinAngle = easeP * Math.PI * 2 * turns;
      if (Math.random() < 0.35) {
        spawnParticle(state.aiView ? 'token' : 'star', (Math.random() - 0.5) * 64, (Math.random() - 0.5) * 44);
      }
    } else {
      state.spinAngle += (0 - state.spinAngle) * Math.min(1, dt * 12);
    }

    if (state.mode === 'dance') {
      state.danceTime += dt;
      var bpm = 124;
      beat = state.danceTime * (bpm / 60) * Math.PI * 2;
      hipSway = Math.sin(beat * 0.5) * 7.5;
      headBob = Math.abs(Math.sin(beat)) * -5.5;
      state.rot = Math.sin(beat * 0.5) * 0.13;
      leftPawRaise = Math.max(0, Math.sin(beat * 0.5 + 0.4));
      rightPawRaise = Math.max(0, Math.sin(beat * 0.5 + Math.PI + 0.4));
      // Every 4 beats, do a little rhythmic hop
      if (Math.sin(beat) > 0.96 && state.y >= -1) {
        state.vy = -78;
        state.scaleX = 0.91;
        state.scaleY = 1.10;
      }
      if (Math.random() < dt * 2.6) {
        spawnParticle(state.aiView ? 'token' : 'note', (Math.random() - 0.5) * 65, -24);
      }
    } else if (state.mode === 'dizzy') {
      state.rot = Math.sin(now * 0.008) * 0.16;
      hipSway = Math.cos(now * 0.008) * 4;
    } else if (state.mode === 'pet') {
      headBob = Math.sin(now * 0.025) * 1.8;
      state.rot = Math.sin(now * 0.01) * 0.06;
    } else {
      state.rot += (0 - state.rot) * Math.min(1, dt * 10);
    }

    if (state.mode === 'hop') {
      // Multi-hop sequence
      if (state.y >= 0 && state.vy >= 0 && elapsed < state.modeDur - 350) {
        state.hopPhase++;
        state.vy = -155 - (state.hopPhase % 2) * 25;
        state.vx = (state.x > 0 ? -1 : 1) * (48 + Math.random() * 25);
        state.scaleX = 0.83;
        state.scaleY = 1.20;
        spawnParticle('puff', state.x - 10, 38);
        spawnParticle('puff', state.x + 10, 38);
        if (state.aiView) spawnParticle('token', state.x, -15);
      }
      leftPawRaise = state.y < -10 ? 0.85 : 0;
      rightPawRaise = state.y < -10 ? 0.85 : 0;
    }

    // 3. Spring-damper physics for X, Y, and Squash/Stretch
    var gravity = 560;
    state.vy += gravity * dt;
    state.y += state.vy * dt;
    state.x += state.vx * dt;

    // Horizontal spring back to center
    var springForceX = -state.x * 14;
    state.vx += springForceX * dt;
    state.vx *= Math.pow(0.08, dt);

    // Ground collision at y = 0
    if (state.y > 0) {
      if (state.vy > 45) {
        // Landing squash!
        var impact = Math.min(0.26, state.vy / 750);
        state.scaleX = 1 + impact * 1.15;
        state.scaleY = 1 - impact;
      }
      state.y = 0;
      state.vy = 0;
    }

    // Relax scaleX, scaleY back to (1, 1)
    state.scaleX += (1 - state.scaleX) * Math.min(1, dt * 14);
    state.scaleY += (1 - state.scaleY) * Math.min(1, dt * 14);

    // 4. Render on Canvas
    var isDark = body.classList.contains('dark');
    var accent = isDark ? '#4ee8d6' : '#0b7f78';
    var accentSoft = isDark ? 'rgba(78, 232, 214, 0.22)' : 'rgba(11, 127, 120, 0.16)';

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CW, CH);

    var groundY = CH - 24;
    var centerX = CW / 2 + state.x + hipSway * 0.45;
    var centerY = groundY + state.y;

    // ---- Ground Shadow & AI Pedestal Ring ----
    var heightFactor = Math.max(0.35, 1 - Math.abs(state.y) / 95);
    ctx.save();
    ctx.translate(CW / 2 + state.x * 0.7, groundY + 4);
    ctx.beginPath();
    ctx.ellipse(0, 0, 32 * heightFactor, 7.5 * heightFactor, 0, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.42)' : 'rgba(16, 27, 38, 0.14)';
    ctx.fill();

    // Glowing AI / Dance ring on the floor
    if (state.aiView || state.mode === 'dance' || state.mode === 'spin') {
      var ringPulse = 1 + 0.08 * Math.sin(now * 0.008);
      ctx.beginPath();
      ctx.ellipse(0, 0, 38 * ringPulse, 9 * ringPulse, 0, 0, Math.PI * 2);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // ---- Cat Body & Head Transform ----
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(state.rot);
    ctx.scale(state.scaleX, state.scaleY);

    // 3D turntable orientation: cosA > 0 means facing front, cosA < 0 means facing back
    var cosA = Math.cos(state.spinAngle);
    var sinA = Math.sin(state.spinAngle);
    var facingFront = cosA >= 0;
    var turnX = sinA * 10; // Horizontal parallax during 360° turn

    var breath = Math.sin(now * 0.0032) * 1.2;

    // ---- Tail (behind body when facing front, in front when facing back) ----
    var tailWave = Math.sin(now * (state.mode === 'dance' ? 0.012 : 0.0045)) * 14 +
                   (state.mode === 'pet' ? Math.sin(now * 0.018) * 10 : 0);
    function drawTail() {
      ctx.save();
      ctx.beginPath();
      var tailBaseX = -turnX * 0.5 + (facingFront ? 16 : 0);
      var tailBaseY = -12;
      ctx.moveTo(tailBaseX, tailBaseY);
      ctx.bezierCurveTo(
        tailBaseX + 22 + tailWave * 0.4, tailBaseY - 8,
        tailBaseX + 30 + tailWave, tailBaseY - 34,
        tailBaseX + 18 + tailWave * 1.1, tailBaseY - 44
      );
      ctx.lineCap = 'round';
      ctx.lineWidth = 8.5;
      ctx.strokeStyle = '#334155';
      ctx.stroke();
      // Glowing cyan tip on tail
      ctx.beginPath();
      ctx.arc(tailBaseX + 18 + tailWave * 1.1, tailBaseY - 44, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();
    }

    if (facingFront) drawTail();

    // ---- Torso / Fluffy Body ----
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, -23 + breath * 0.4, 23, 21 - breath * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fffaf2';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    if (facingFront) {
      // Soft cream-pink belly patch
      ctx.beginPath();
      ctx.ellipse(-turnX * 0.25, -20 + breath * 0.4, 12, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fef2f2';
      ctx.fill();

      // AI Cyber Collar + Gold Bell
      ctx.beginPath();
      ctx.arc(0, -35 + breath * 0.5, 16, 0.22 * Math.PI, 0.78 * Math.PI);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Collar Bell (glows on beat)
      ctx.beginPath();
      ctx.arc(-turnX * 0.2, -31 + breath * 0.5, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();
    } else {
      // Back tabby stripes when turned around
      ctx.fillStyle = '#475569';
      for (var st = -1; st <= 1; st++) {
        roundRect(ctx, -9, -31 + st * 6, 18, 3.2, 1.6);
        ctx.fill();
      }
    }
    ctx.restore();

    // ---- Hind Feet ----
    var leftFootLift = state.mode === 'dance' ? Math.max(0, Math.sin(beat)) * 5 : 0;
    var rightFootLift = state.mode === 'dance' ? Math.max(0, -Math.sin(beat)) * 5 : 0;
    ctx.fillStyle = '#fffaf2';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    // Left hind paw
    ctx.beginPath();
    ctx.ellipse(-13, -4 - leftFootLift, 7.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right hind paw
    ctx.beginPath();
    ctx.ellipse(13, -4 - rightFootLift, 7.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ---- Front Paws (wave in the air when dancing or hopping!) ----
    if (facingFront) {
      var lPawY = -20 - leftPawRaise * 22;
      var lPawX = -19 - leftPawRaise * 6;
      var rPawY = -20 - rightPawRaise * 22;
      var rPawX = 19 + rightPawRaise * 6;

      // Left front paw
      ctx.save();
      ctx.translate(lPawX, lPawY);
      ctx.rotate(-leftPawRaise * 0.55);
      ctx.beginPath();
      ctx.ellipse(0, 0, 5.5, 8.5, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fffaf2';
      ctx.fill();
      ctx.stroke();
      // Cute pink paw pad when raised
      if (leftPawRaise > 0.35) {
        ctx.beginPath();
        ctx.arc(0, -1.5, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#fda4af';
        ctx.fill();
      }
      ctx.restore();

      // Right front paw
      ctx.save();
      ctx.translate(rPawX, rPawY);
      ctx.rotate(rightPawRaise * 0.55);
      ctx.beginPath();
      ctx.ellipse(0, 0, 5.5, 8.5, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fffaf2';
      ctx.fill();
      ctx.stroke();
      if (rightPawRaise > 0.35) {
        ctx.beginPath();
        ctx.arc(0, -1.5, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#fda4af';
        ctx.fill();
      }
      ctx.restore();
    }

    // ---- Head & Ears ----
    var headX = turnX * 0.55 + (state.mouseIn ? state.mouseX * 3.2 : 0);
    var headY = -62 + breath + headBob + (state.mouseIn ? state.mouseY * 2.2 : 0);

    ctx.save();
    ctx.translate(headX, headY);

    // Ears
    var earWiggle = Math.sin(now * 0.015) * state.earTwitch * 0.28 +
                    (state.mode === 'dance' ? Math.sin(beat) * 0.09 : 0);

    // Left Ear
    ctx.save();
    ctx.translate(-19, -15);
    ctx.rotate(-0.22 - earWiggle);
    ctx.beginPath();
    ctx.moveTo(-8, 12);
    ctx.lineTo(-3, -15);
    ctx.lineTo(13, 6);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    if (facingFront) {
      ctx.beginPath();
      ctx.moveTo(-4, 8);
      ctx.lineTo(-2, -9);
      ctx.lineTo(8, 5);
      ctx.closePath();
      ctx.fillStyle = '#fda4af';
      ctx.fill();
    }
    ctx.restore();

    // Right Ear
    ctx.save();
    ctx.translate(19, -15);
    ctx.rotate(0.22 + earWiggle);
    ctx.beginPath();
    ctx.moveTo(-13, 6);
    ctx.lineTo(3, -15);
    ctx.lineTo(8, 12);
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
    if (facingFront) {
      ctx.beginPath();
      ctx.moveTo(-8, 5);
      ctx.lineTo(2, -9);
      ctx.lineTo(4, 8);
      ctx.closePath();
      ctx.fillStyle = '#fda4af';
      ctx.fill();
    }
    ctx.restore();

    // Tiny AI Neural Antenna on top of head
    ctx.save();
    var antSway = Math.sin(now * 0.006) * 3;
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.quadraticCurveTo(antSway * 0.5, -29, antSway, -33);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(antSway, -34, 3.3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.restore();

    // Head shape (squishy rounded cat cheek silhouette)
    ctx.beginPath();
    ctx.ellipse(0, 0, 29, 23.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = facingFront ? '#fffaf2' : '#334155';
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    if (facingFront) {
      var faceShiftX = turnX * 0.45 + state.mouseX * 2.5;
      var faceShiftY = state.mouseY * 1.8;

      // Forehead dark tabby cap & cute M-stripe
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(faceShiftX * 0.3, -18, 16, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      // Glowing cyan neural diamond on forehead
      ctx.beginPath();
      ctx.moveTo(faceShiftX * 0.4, -17);
      ctx.lineTo(faceShiftX * 0.4 + 3.2, -13.5);
      ctx.lineTo(faceShiftX * 0.4, -10);
      ctx.lineTo(faceShiftX * 0.4 - 3.2, -13.5);
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();

      // Rosy Blush Cheeks
      var blushAlpha = (state.expr === 'happy' || state.expr === 'starry' || state.mode === 'pet' || state.mode === 'dance') ? 0.68 : 0.36;
      ctx.fillStyle = 'rgba(251, 113, 133, ' + blushAlpha + ')';
      ctx.beginPath();
      ctx.ellipse(-17 + faceShiftX * 0.6, 5 + faceShiftY, 5.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(17 + faceShiftX * 0.6, 5 + faceShiftY, 5.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Whiskers
      var whiskerJitter = state.expr === 'shock' ? Math.sin(now * 0.08) * 1.8 : 0;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      [-1, 1].forEach(function (dir) {
        for (var w = 0; w < 2; w++) {
          ctx.beginPath();
          var wx0 = dir * 21 + faceShiftX * 0.4;
          var wy0 = 2 + w * 4.5 + faceShiftY;
          ctx.moveTo(wx0, wy0);
          ctx.lineTo(wx0 + dir * 11, wy0 + (w === 0 ? -1.5 : 2) + whiskerJitter);
          ctx.stroke();
        }
      });

      // ---- Eyes (Dynamic Expressions + Cursor Tracking) ----
      var eyeY = -2 + faceShiftY;
      var leftEyeX = -11.5 + faceShiftX;
      var rightEyeX = 11.5 + faceShiftX;

      if (state.isBlinking || state.expr === 'sleepy') {
        // Soft closed arcs
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.4;
        [-11.5, 11.5].forEach(function (ex) {
          ctx.beginPath();
          ctx.arc(ex + faceShiftX, eyeY + 1, 5.5, 0.15 * Math.PI, 0.85 * Math.PI);
          ctx.stroke();
        });
      } else if (state.expr === 'happy') {
        // Happy ^ ^ arcs
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.6;
        [-11.5, 11.5].forEach(function (ex) {
          ctx.beginPath();
          ctx.arc(ex + faceShiftX, eyeY + 3, 5.8, 1.15 * Math.PI, 1.85 * Math.PI);
          ctx.stroke();
        });
      } else if (state.expr === 'dizzy') {
        // Rotating spiral @_@ eyes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.8;
        [leftEyeX, rightEyeX].forEach(function (ex, idx) {
          ctx.save();
          ctx.translate(ex, eyeY);
          ctx.rotate(now * 0.012 * (idx === 0 ? 1 : -1));
          ctx.beginPath();
          for (var a = 0; a < Math.PI * 3.6; a += 0.25) {
            var sr = 0.9 * a;
            var sx = Math.cos(a) * sr;
            var sy = Math.sin(a) * sr;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
          ctx.restore();
        });
      } else if (state.expr === 'squint') {
        // Unimpressed ¬_¬ half-lidded side-eye
        [leftEyeX, rightEyeX].forEach(function (ex) {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(ex + 1.5, eyeY + 1, 4.2, 0, Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(ex - 6, eyeY - 1);
          ctx.lineTo(ex + 6, eyeY - 0.5);
          ctx.stroke();
        });
      } else {
        // Round glossy eyes (normal, blep, shock, starry, cross, cool)
        [leftEyeX, rightEyeX].forEach(function (ex, idx) {
          // In 'blep', left eye winks '>' while right eye is big and goofy!
          if (state.expr === 'blep' && idx === 0) {
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(ex - 4.5, eyeY - 4);
            ctx.lineTo(ex + 3.5, eyeY);
            ctx.lineTo(ex - 4.5, eyeY + 4);
            ctx.stroke();
            return;
          }

          var eyeR = state.expr === 'shock' ? 7.4 : (state.expr === 'blep' ? 6.8 : 6.2);
          ctx.beginPath();
          ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2);
          ctx.fillStyle = state.expr === 'shock' ? '#ffffff' : '#1e293b';
          ctx.fill();
          if (state.expr === 'shock') {
            ctx.lineWidth = 2.2;
            ctx.strokeStyle = '#1e293b';
            ctx.stroke();
          }

          // Pupils
          var px = ex + state.mouseX * 2.4;
          var py = eyeY + state.mouseY * 2.0;
          if (state.expr === 'cross') {
            px = ex + (idx === 0 ? 3.2 : -3.2);
            py = eyeY + 1.2;
          }

          if (state.expr === 'shock') {
            // Tiny vibrating pinpoint pupils
            ctx.beginPath();
            ctx.arc(px + (Math.random() - 0.5) * 1.5, py, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = '#1e293b';
            ctx.fill();
          } else if (state.expr === 'starry') {
            // Golden rotating star pupils!
            ctx.fillStyle = '#fbbf24';
            drawStar(ctx, px, py, 4, 4.8, 2.0, now * 0.005);
          } else {
            // Teal iris ring + bright catchlights
            ctx.beginPath();
            ctx.arc(px, py, 3.6, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px, py, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            // White catchlights
            ctx.beginPath();
            ctx.arc(px - 1.8, py - 1.8, 1.7, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(px + 1.6, py + 1.5, 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Cyber sunglasses in 'cool' mode (⌐■-■)
        if (state.expr === 'cool') {
          ctx.save();
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.6;
          roundRect(ctx, leftEyeX - 8.5, eyeY - 5.5, 16, 10.5, 2.5);
          ctx.fill();
          ctx.stroke();
          roundRect(ctx, rightEyeX - 7.5, eyeY - 5.5, 16, 10.5, 2.5);
          ctx.fill();
          ctx.stroke();
          // Bridge & temples
          ctx.beginPath();
          ctx.moveTo(leftEyeX + 7.5, eyeY - 2);
          ctx.lineTo(rightEyeX - 7.5, eyeY - 2);
          ctx.moveTo(leftEyeX - 8.5, eyeY - 2);
          ctx.lineTo(-27, eyeY - 4);
          ctx.moveTo(rightEyeX + 8.5, eyeY - 2);
          ctx.lineTo(27, eyeY - 4);
          ctx.stroke();
          // Cyan laser glint
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(leftEyeX - 5, eyeY + 2);
          ctx.lineTo(leftEyeX - 1, eyeY - 3);
          ctx.moveTo(rightEyeX - 4, eyeY + 2);
          ctx.lineTo(rightEyeX, eyeY - 3);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ---- Nose & Mouth ----
      var noseX = faceShiftX * 0.9;
      var noseY = 3.5 + faceShiftY;
      ctx.beginPath();
      ctx.moveTo(noseX - 2.6, noseY - 1.5);
      ctx.lineTo(noseX + 2.6, noseY - 1.5);
      ctx.lineTo(noseX, noseY + 1.8);
      ctx.closePath();
      ctx.fillStyle = '#fb7185';
      ctx.fill();

      // Glowing firefly on nose when in 'cross' derp mode
      if (state.expr === 'cross') {
        var fx = noseX + Math.sin(now * 0.008) * 3;
        var fy = noseY - 4 + Math.cos(now * 0.01) * 2;
        ctx.beginPath();
        ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      }

      // Mouth (`ω` or `:O` or `:P` blep)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      if (state.expr === 'shock') {
        ctx.beginPath();
        ctx.ellipse(noseX, noseY + 6.5, 3.6, 4.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fda4af';
        ctx.fill();
        ctx.stroke();
      } else {
        // Cute pink tongue sticking out in 'blep' or 'dance'
        if (state.expr === 'blep' || (state.mode === 'dance' && Math.sin(beat * 0.5) > 0.2)) {
          ctx.beginPath();
          ctx.arc(noseX + (state.expr === 'blep' ? 2.2 : 0), noseY + 6.2, 3.6, 0, Math.PI);
          ctx.fillStyle = '#fb7185';
          ctx.fill();
          ctx.stroke();
        }
        // Classic cat 'ω' mouth
        ctx.beginPath();
        ctx.arc(noseX - 3.2, noseY + 3.5, 3.2, 0.05 * Math.PI, 0.92 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(noseX + 3.2, noseY + 3.5, 3.2, 0.08 * Math.PI, 0.95 * Math.PI);
        ctx.stroke();
      }
    }

    // Orbiting dizzy stars above head
    if (state.expr === 'dizzy') {
      for (var ds = 0; ds < 3; ds++) {
        var da = now * 0.006 + ds * ((Math.PI * 2) / 3);
        var sx = Math.cos(da) * 24;
        var sy = -26 + Math.sin(da) * 6;
        ctx.fillStyle = '#fbbf24';
        drawStar(ctx, sx, sy, 4, 4.5, 2, da);
      }
    }

    ctx.restore(); // end Head

    if (!facingFront) drawTail();

    // ---- AI Vision Overlay (2D Pose Skeleton + Perceptio Bounding Box) ----
    if (state.aiView) {
      ctx.save();
      // 1. Keypoint Skeleton (UCanDance style)
      var kpNeck = { x: headX * 0.5, y: -38 + breath * 0.5 };
      var kpHead = { x: headX, y: headY };
      var kpLEar = { x: headX - 20, y: headY - 24 };
      var kpREar = { x: headX + 20, y: headY - 24 };
      var kpHip = { x: 0, y: -12 };
      var kpLPaw = { x: -19 - leftPawRaise * 6, y: -20 - leftPawRaise * 22 };
      var kpRPaw = { x: 19 + rightPawRaise * 6, y: -20 - rightPawRaise * 22 };
      var kpTail = { x: 18 + tailWave * 0.8, y: -48 };

      var bones = [
        [kpHead, kpLEar], [kpHead, kpREar], [kpHead, kpNeck],
        [kpNeck, kpLPaw], [kpNeck, kpRPaw], [kpNeck, kpHip], [kpHip, kpTail]
      ];
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      bones.forEach(function (b) {
        ctx.beginPath();
        ctx.moveTo(b[0].x, b[0].y);
        ctx.lineTo(b[1].x, b[1].y);
        ctx.stroke();
      });
      [kpHead, kpLEar, kpREar, kpNeck, kpLPaw, kpRPaw, kpHip, kpTail].forEach(function (pt, idx) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#fbbf24' : accent;
        ctx.fill();
      });

      // 2. Perceptio Corner-Bracketed Bounding Box
      var bx = -38, by = -98, bw = 76, bh = 98, bl = 10;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(bx, by + bl); ctx.lineTo(bx, by); ctx.lineTo(bx + bl, by);
      // Top-right
      ctx.moveTo(bx + bw - bl, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bl);
      // Bottom-left
      ctx.moveTo(bx, by + bh - bl); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bl, by + bh);
      // Bottom-right
      ctx.moveTo(bx + bw - bl, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bl);
      ctx.stroke();

      // Label pill on top of box
      ctx.fillStyle = accent;
      roundRect(ctx, bx, by - 13, 66, 12, 3);
      ctx.fill();
      ctx.fillStyle = isDark ? '#04201c' : '#ffffff';
      ctx.font = '600 8px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText('neko: 0.99', bx + 4, by - 4);
      ctx.restore();
    }

    ctx.restore(); // end Cat Body transform

    // ---- Floating Particles (Hearts, Stars, Musical Notes, Tokens, Puffs) ----
    for (var i = state.particles.length - 1; i >= 0; i--) {
      var pt = state.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= pt.decay * dt;
      if (pt.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.life));
      if (pt.kind === 'puff') {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = accentSoft;
        ctx.fill();
      } else {
        ctx.fillStyle = pt.kind === 'heart' ? '#fb7185' : pt.color;
        ctx.font = '700 ' + Math.round(pt.size) + 'px ui-monospace, system-ui, sans-serif';
        ctx.fillText(pt.txt, pt.x, pt.y);
      }
      ctx.restore();
    }

    // Sleepy Zzz when idle for a long time
    if (state.expr === 'sleepy' && Math.random() < dt * 0.9) {
      state.particles.push({
        kind: 'note',
        x: centerX + 18,
        y: centerY - 76,
        vx: 10,
        vy: -18,
        life: 1,
        decay: 0.55,
        size: 11,
        color: accent,
        txt: 'Zzz'
      });
    }

    ctx.restore();
  }

  requestAnimationFrame(stepAndRender);
})();
