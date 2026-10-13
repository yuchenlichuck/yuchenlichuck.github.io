"""Render looping teaser videos for liyc.pw (640x400, 24 fps, H.264).

perceptio.mp4  real Perceptio outputs (RefCOCO masks, HardBlink depth) revealed by a decoding sweep
dance.mp4      (legacy placeholder; the site now uses a real generated clip with its music track)
fewshot.mp4    illustration of Prototypical Random Walks (AAAI-21 workshop paper)
compatpp.mp4   the official 3DCoMPaT++ header animation, re-encoded
pointnext.mp4  illustration: PointNet++/PointNeXt hierarchy (FPS 2048→512→128) then part segmentation
compat.mp4     illustration: one chair, parts re-dressed with different material compositions
"""
import numpy as np, imageio_ffmpeg, math, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 640, 400, 24
# usage: python3 scripts/media/make_teasers.py static/media/teasers [perceptio dance pointnext compat]
#   needs: pip install numpy pillow imageio-ffmpeg ; PERCEPTIO_DIR = checkout of github.com/yuchenlichuck/Perceptio
OUT = sys.argv[1] if len(sys.argv) > 1 else 'static/media/teasers'
PERCEPTIO_DIR = os.environ.get('PERCEPTIO_DIR', '../Perceptio')
os.makedirs(OUT, exist_ok=True)
BG = (248, 250, 252)
ACC = (11, 127, 120)
INK = (16, 27, 38)
try:
    F_MONO = ImageFont.truetype('DejaVuSansMono-Bold.ttf', 19)
except Exception:
    F_MONO = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 19)
try:
    F_SANS = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 21)
except Exception:
    F_SANS = F_MONO


def writer(name, n, crf=27):
    crf = 31 if name in ('pointnext', 'compat') else crf
    w = imageio_ffmpeg.write_frames(f'{OUT}/{name}.mp4', (W, H), fps=FPS, codec='libx264', pix_fmt_out='yuv420p',
                                    output_params=['-crf', str(crf), '-preset', 'slow', '-movflags', '+faststart', '-an'],
                                    macro_block_size=8)
    w.send(None)
    return w


def chip(d, xy, text, fg=(255, 255, 255), bg=ACC, font=F_MONO):
    x, y = xy
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    d.rounded_rectangle((x, y, x + r - l + 20, y + b - t + 14), radius=8, fill=bg)
    d.text((x + 10 - l, y + 7 - t), text, font=font, fill=fg)


def ease(x):
    x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)


def fit(im, w, h):
    s = min(w / im.width, h / im.height)
    return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)


# ---------------------------------------------------------------- Perceptio
def perceptio():
    P = PERCEPTIO_DIR + '/public/paper/'
    rc = Image.open(P + 'refcoco-0011.png').convert('RGB')
    hb = Image.open(P + 'hardblink-0026.png').convert('RGB')
    scenes = [
        (rc.crop((21, 117, 743, 1100)), rc.crop((2254, 117, 2976, 1100)), '[SEG] tokens → masks'),
        (hb.crop((15, 128, 717, 829)), hb.crop((1062, 128, 1764, 829)), '[DEPTH] tokens → depth'),
    ]
    dur = 4.0; n = int(dur * FPS * len(scenes)); w = writer('perceptio', n)
    for f in range(n):
        t = f / FPS; si = int(t // dur) % len(scenes); lt = t - si * dur
        a, b, label = scenes[si]
        fr = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(fr)
        ph = 300; A = fit(a, 290, ph); B = fit(b, 290, ph)
        gap = 16; x0 = (W - A.width - B.width - gap) // 2; y0 = 22 + (ph - A.height) // 2
        fr.paste(A, (x0, y0))
        bx = x0 + A.width + gap
        # right panel: RGB first, then the prediction is "decoded" top→bottom
        Bbase = A.resize(B.size)
        fr.paste(Bbase, (bx, y0))
        k = ease((lt - 0.5) / 2.2)
        cut = int(B.height * k)
        if cut > 0: fr.paste(B.crop((0, 0, B.width, cut)), (bx, y0))
        if 0 < k < 1: d.rectangle((bx, y0 + cut - 2, bx + B.width, y0 + cut + 1), fill=ACC)
        d.rectangle((x0 - 1, y0 - 1, x0 + A.width, y0 + A.height), outline=(214, 222, 230))
        d.rectangle((bx - 1, y0 - 1, bx + B.width, y0 + B.height), outline=(214, 222, 230))
        # label chip
        l, tt, r, bb = d.textbbox((0, 0), label, font=F_MONO)
        chip(d, ((W - (r - l + 20)) // 2, 342), label)
        # crossfade between scenes
        fade = 1 - ease(lt / 0.35) if lt < 0.35 else (ease((lt - dur + 0.35) / 0.35) if lt > dur - 0.35 else 0)
        if fade > 0: fr = Image.blend(fr, Image.new('RGB', (W, H), BG), fade)
        w.send(fr.tobytes())
    w.close()


# ---------------------------------------------------------------- dance
def dance():
    im = Image.open('content/publication/underreview2026dance/featured.png').convert('RGB')
    pairs = [(im.crop((50, 41, 596, 997)), im.crop((598, 41, 1152, 997))),
             (im.crop((1155, 41, 1700, 997)), im.crop((1706, 41, 2238, 997)))]
    bpm = 100; beat = 60 / bpm; dur = beat * 16; n = int(round(dur * FPS)); w = writer('dance', n)
    DK = (14, 17, 22)
    rng = np.random.default_rng(3); bars = rng.random((64, 40))
    for f in range(n):
        t = f / FPS; bi = int(t // beat); ph = (t % beat) / beat
        fr = Image.new('RGB', (W, H), DK); d = ImageDraw.Draw(fr)
        pi = (bi // 2) % 2
        nxt = ((bi + 1) // 2) % 2
        S, V = pairs[pi]
        S = fit(S, 200, 318); V = fit(V, 200, 318)
        xs = 120; xv = W - 120 - V.width; y0 = 18
        bump = int(6 * math.exp(-ph / 0.18))                       # little hop on every beat
        fr.paste(S, (xs, y0 + 6 - bump)); fr.paste(V, (xv, y0 + 6 - bump))
        if bi % 2 == 1 and ph > 0.8 and nxt != pi:                 # quick crossfade into the next pose
            S2, V2 = pairs[nxt]; S2 = fit(S2, 200, 318); V2 = fit(V2, 200, 318)
            a = ease((ph - 0.8) / 0.2)
            tmp = fr.copy(); tmp.paste(S2, (xs, y0 + 6)); tmp.paste(V2, (xv, y0 + 6)); fr = Image.blend(fr, tmp, a); d = ImageDraw.Draw(fr)
        # arrow pose → video
        cx = W // 2; cy = y0 + 160
        d.line((cx - 34, cy, cx + 30, cy), fill=(78, 232, 214), width=4)
        d.polygon([(cx + 36, cy), (cx + 22, cy - 9), (cx + 22, cy + 9)], fill=(78, 232, 214))
        d.text((cx - 32, cy + 14), 'pose', font=F_MONO, fill=(150, 160, 175))
        # music bars along the bottom, pulsing on the beat
        nb = 40; bw = (W - 80) / nb
        for i in range(nb):
            hgt = 6 + 34 * bars[f % 64, i] * (0.35 + 0.65 * math.exp(-ph / 0.25))
            x = 40 + i * bw
            d.rectangle((x, 392 - hgt, x + bw - 3, 392), fill=(78, 232, 214) if i % 8 == bi % 8 else (52, 66, 80))
        w.send(fr.tobytes())
    w.close()


# ---------------------------------------------------------------- 3D helpers
def render(pts, cols, yaw, pitch=-0.38, sizes=None, scale=150, bg=BG, extra=None, ss=2):
    c, s = math.cos(yaw), math.sin(yaw)
    x = pts[:, 0] * c + pts[:, 2] * s; z = -pts[:, 0] * s + pts[:, 2] * c; y = pts[:, 1]
    cp, sp = math.cos(pitch), math.sin(pitch)
    y2 = y * cp - z * sp; z2 = y * sp + z * cp
    f = 4.0; k = f / (f - z2)
    sx = W / 2 + x * k * scale; sy = H / 2 + 18 - y2 * k * scale
    order = np.argsort(z2)
    img = Image.new('RGB', (W * ss, H * ss), bg); d = ImageDraw.Draw(img)
    if extra: extra(d, sx, sy, k, ss)
    sz = sizes if sizes is not None else np.full(len(pts), 2.2)
    for i in order:
        r = sz[i] * k[i] * ss
        if r <= 0: continue
        cx, cy = sx[i] * ss, sy[i] * ss
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=tuple(int(v) for v in cols[i]))
    return img.resize((W, H), Image.LANCZOS)


def fps_idx(p, m, start=0):
    idx = [start]; dist = np.full(len(p), np.inf)
    for _ in range(m - 1):
        dist = np.minimum(dist, ((p - p[idx[-1]]) ** 2).sum(1)); idx.append(int(dist.argmax()))
    return np.array(idx)


def shade(base, normals, light=np.array([0.4, 0.8, 0.45])):
    light = light / np.linalg.norm(light)
    lam = np.clip(np.abs(normals @ light), 0, 1)
    return np.clip(base * (0.62 + 0.42 * lam[:, None]), 0, 255)


# ---------------------------------------------------------------- PointNeXt (illustration)
def airplane(rng):
    P, N, L = [], [], []
    def add(p, n, l): P.append(p); N.append(n); L.append(np.full(len(p), l))
    # fuselage (part 0)
    m = 820; u = rng.random(m); th = rng.random(m) * 2 * np.pi
    xs = -0.95 + 1.95 * u
    r = 0.12 * np.where(xs > 0.72, np.sqrt(np.clip(1 - ((xs - 0.72) / 0.28) ** 2, 0, 1)), 1.0)
    r = r * np.where(xs < -0.45, 0.35 + 0.65 * (xs + 0.95) / 0.5, 1.0)
    yc = np.where(xs < -0.45, 0.06 * (-(xs + 0.45) / 0.5), 0)
    p = np.stack([xs, yc + r * np.sin(th), r * np.cos(th)], 1); n = np.stack([0 * xs, np.sin(th), np.cos(th)], 1); add(p, n, 0)
    # wings (part 1)
    m = 700; s = rng.random(m) * 2 - 1; a = np.abs(s); v = rng.random(m)
    xle = 0.22 - 0.42 * a; ch = 0.40 - 0.26 * a
    p = np.stack([xle - v * ch, -0.03 + 0.06 * a + rng.choice([-1, 1], m) * 0.012, s * 1.0], 1)
    add(p, np.tile([0, 1, 0], (m, 1)), 1)
    # tail (part 2): stabilisers + fin
    m = 180; s = rng.random(m) * 2 - 1; a = np.abs(s); v = rng.random(m)
    p = np.stack([-0.72 - 0.12 * a - v * (0.2 - 0.1 * a), 0.06 + 0 * s, s * 0.38], 1); add(p, np.tile([0, 1, 0], (m, 1)), 2)
    m = 150; h = rng.random(m); v = rng.random(m)
    p = np.stack([-0.72 - 0.2 * h - v * (0.24 - 0.12 * h), 0.08 + h * 0.36, rng.choice([-1, 1], m) * 0.01], 1); add(p, np.tile([0, 0, 1], (m, 1)), 2)
    # engines (part 3)
    for zc in (-0.42, 0.42):
        m = 120; u = rng.random(m); th = rng.random(m) * 2 * np.pi
        p = np.stack([0.24 - 0.3 * u, -0.12 + 0.055 * np.sin(th), zc + 0.055 * np.cos(th)], 1)
        add(p, np.stack([0 * u, np.sin(th), np.cos(th)], 1), 3)
    return np.concatenate(P) * 1.05, np.concatenate(N), np.concatenate(L)


def pointnext():
    rng = np.random.default_rng(0)
    p, nrm, lab = airplane(rng)
    p = p - p.mean(0)
    N = len(p); i512 = fps_idx(p, 512); i128 = i512[fps_idx(p[i512], 128)]
    PART = np.array([[59, 130, 246], [239, 68, 68], [234, 179, 8], [16, 185, 129]], float)
    GREY = np.array([120, 134, 150], float)
    # distance (in "decoding order") from each point to the nearest 128-centroid
    d128 = np.sqrt(((p[:, None, :] - p[None, i128, :]) ** 2).sum(2)).min(1)
    dur = 9.0; n = int(dur * FPS); w = writer('pointnext', n)
    stages = [(0, '2048 points'), (1.8, 'FPS → 512 centroids'), (3.6, 'FPS → 128 centroids'), (5.4, 'decode → part segmentation')]
    for f in range(n):
        t = f / FPS; yaw = 2 * np.pi * t / dur + 0.6
        base = np.tile(GREY, (N, 1)); size = np.full(N, 1.9)
        a512 = ease((t - 1.8) / 0.5) * (1 - ease((t - 3.6) / 0.5))
        a128 = ease((t - 3.6) / 0.5) * (1 - ease((t - 5.4) / 0.5))
        seg = ease((t - 5.4 - d128 * 6) / 0.5) * (1 - ease((t - 8.4) / 0.5))
        dim = 1 - 0.6 * max(a512, a128)
        base = BG + (base - BG) * dim                                # non-selected points recede
        base = base * (1 - seg[:, None]) + PART[lab] * seg[:, None]
        cols = shade(base, nrm)
        for idx, a, col, sz in ((i512, a512, ACC, 2.8), (i128, a128, np.array([217, 70, 239]), 4.2)):
            if a > 0:
                cols[idx] = cols[idx] * (1 - a) + np.array(col) * a
                size[idx] = size[idx] * (1 - a) + sz * a
        def rings(d, sx, sy, k, ss, a=a128):
            if a <= 0.05: return
            for j in i128:
                r = 0.13 * 235 * k[j] * ss
                d.ellipse((sx[j] * ss - r, sy[j] * ss - r, sx[j] * ss + r, sy[j] * ss + r), outline=(236, 214, 245) if a > .5 else (242, 236, 246), width=ss)
        fr = render(p, cols, yaw, sizes=size, scale=235, extra=rings)
        d = ImageDraw.Draw(fr)
        cur = [s for s in stages if t >= s[0]][-1][1]
        chip(d, (18, 16), 'PointNeXt', bg=INK, font=F_MONO)
        chip(d, (150, 16), cur)
        w.send(fr.tobytes())
    w.close()


# ---------------------------------------------------------------- 3D-CoMPaT (illustration)
def box(rng, c0, c1, m, label):
    c0, c1 = np.array(c0, float), np.array(c1, float); ext = c1 - c0
    areas = np.array([ext[1] * ext[2], ext[1] * ext[2], ext[0] * ext[2], ext[0] * ext[2], ext[0] * ext[1], ext[0] * ext[1]])
    face = rng.choice(6, m, p=areas / areas.sum())
    u = rng.random((m, 3)); p = c0 + u * ext; n = np.zeros((m, 3))
    ax = face // 2; side = face % 2
    p[np.arange(m), ax] = np.where(side == 0, c0[ax], c1[ax])
    n[np.arange(m), ax] = np.where(side == 0, -1, 1)
    return p, n, np.full(m, label)


def chair(rng):
    parts = [box(rng, (-.42, .0, -.4), (.42, .07, .4), 1500, 0),            # seat
             box(rng, (-.42, .07, -.42), (.42, .78, -.35), 1400, 1)]       # back
    for x in (-.38, .32):
        for z in (-.38, .32):
            parts.append(box(rng, (x, -.62, z), (x + .06, 0, z + .06), 230, 2))   # legs
    for x in (-.46, .40):
        parts.append(box(rng, (x, .07, -.35), (x + .06, .12, .1), 160, 3))  # arm rests
        parts.append(box(rng, (x, .26, -.35), (x + .06, .31, .12), 200, 3))
        parts.append(box(rng, (x + .01, .07, .06), (x + .05, .28, .1), 120, 3))
    parts = [q for q in parts if q is not None]
    P = np.concatenate([q[0] for q in parts]); Nn = np.concatenate([q[1] for q in parts]); L = np.concatenate([q[2] for q in parts])
    return P - np.array([0, .2, 0]), Nn, L


def material(name, p, rng):
    n = len(p)
    if name == 'oak':
        g = 0.5 + 0.5 * np.sin(p[:, 0] * 40 + np.sin(p[:, 2] * 9) * 2)
        return np.array([168, 112, 62]) * (0.82 + 0.18 * g[:, None])
    if name == 'walnut':
        g = 0.5 + 0.5 * np.sin(p[:, 1] * 46 + np.sin(p[:, 0] * 7) * 2)
        return np.array([96, 60, 38]) * (0.8 + 0.2 * g[:, None])
    if name == 'steel':
        return np.array([168, 176, 188]) * (0.9 + 0.1 * rng.random((n, 1)))
    if name == 'brass':
        return np.array([196, 158, 72]) * (0.9 + 0.1 * rng.random((n, 1)))
    if name == 'teal fabric':
        chk = ((np.floor(p[:, 0] * 30) + np.floor(p[:, 2] * 30) + np.floor(p[:, 1] * 30)) % 2)
        return np.array([20, 128, 120]) * (0.88 + 0.12 * chk[:, None])
    if name == 'red velvet':
        return np.array([170, 38, 52]) * (0.85 + 0.15 * rng.random((n, 1)))
    if name == 'black leather':
        return np.array([44, 40, 40]) * (0.9 + 0.2 * rng.random((n, 1)))
    if name == 'cream linen':
        return np.array([226, 214, 190]) * (0.9 + 0.1 * rng.random((n, 1)))
    raise KeyError(name)


def compat():
    rng = np.random.default_rng(1)
    p, nrm, lab = chair(rng)
    combos = [('teal fabric', 'teal fabric', 'oak', 'oak'),
              ('red velvet', 'walnut', 'brass', 'walnut'),
              ('black leather', 'black leather', 'steel', 'steel'),
              ('cream linen', 'oak', 'oak', 'cream linen')]
    names = ['seat', 'back', 'legs', 'arms']
    mats = [np.stack([material(c[l], p, np.random.default_rng(7))[i] for i, l in enumerate(lab)]) for c in combos]
    seg = 2.25; dur = seg * len(combos); n = int(dur * FPS); w = writer('compat', n)
    hgt = (p[:, 1] - p[:, 1].min()) / np.ptp(p[:, 1])
    for f in range(n):
        t = f / FPS; ci = int(t // seg); lt = t - ci * seg
        cur = mats[ci]; nxt = mats[(ci + 1) % len(mats)]
        a = ease((lt - (seg - 0.75) - hgt * 0.45) / 0.25)            # new composition sweeps bottom → top
        base = cur * (1 - a[:, None]) + nxt * a[:, None]
        cols = shade(base, nrm)
        fr = render(p, cols, 2 * np.pi * t / dur + 0.7, pitch=-0.42, sizes=np.full(len(p), 1.7), scale=185)
        d = ImageDraw.Draw(fr)
        c = combos[ci if lt < seg - 0.4 else (ci + 1) % len(combos)]
        chip(d, (18, 16), '3D-CoMPaT', bg=INK)
        chip(d, (162, 16), 'parts × materials')
        txt = ' · '.join(f'{names[i]}: {c[i]}' for i in (0, 2))
        d.text((22, 56), txt, font=F_MONO, fill=(70, 84, 100))
        w.send(fr.tobytes())
    w.close()



# ---------------------------------------------------------------- Prototypical Random Walks (illustration)
def fewshot():
    """Animated version of the PRW figure: prototypes → random walk over unlabeled points → back
    to a prototype, then the embedding 'magnetizes' into compact class clusters."""
    rng = np.random.default_rng(5)
    COL = [(232, 93, 93), (86, 140, 230), (92, 184, 104)]          # red / blue / green classes
    LIGHT = [(246, 170, 170), (176, 206, 246), (178, 226, 182)]
    GREY = (176, 182, 190)
    centers = np.array([[210, 255], [440, 150], [470, 300]], float)
    pts, lab, labeled = [], [], []
    for c in range(3):
        for k in range(13):
            pts.append(centers[c] + rng.normal(0, 1, 2) * [78, 58]); lab.append(c); labeled.append(k < 2)
    P0 = np.array(pts); lab = np.array(lab); labeled = np.array(labeled)
    P0[:, 0] = P0[:, 0].clip(40, 600); P0[:, 1] = P0[:, 1].clip(80, 370)
    P1 = centers[lab] + rng.normal(0, 1, (len(lab), 2)) * 17       # magnetized positions
    proto0 = np.array([P0[(lab == c) & labeled].mean(0) for c in range(3)])
    unl = np.where(~labeled)[0]
    # one walk: red prototype → unlabeled h (near red) → τ=3 hops → back to the red prototype
    d0 = np.linalg.norm(P0[unl] - proto0[0], axis=1)
    near = unl[np.argsort(d0)]
    walk = [near[2]]
    for _ in range(3):
        cur = walk[-1]
        cand = [j for j in unl[np.argsort(np.linalg.norm(P0[unl] - P0[cur], axis=1))][1:5] if j not in walk]
        walk.append(cand[int(rng.integers(0, min(2, len(cand))))])
    # kNN graph among unlabeled points (for the x→x stage)
    edges = set()
    for i in unl:
        for j in unl[np.argsort(np.linalg.norm(P0[unl] - P0[i], axis=1))][1:4]:
            edges.add(tuple(sorted((int(i), int(j)))))
    dur = 10.0; n = int(dur * FPS); w = writer('fewshot', n, crf=26)
    stages = [(0, 'few labels + many unlabeled'), (1.5, 'prototype → unlabeled points'), (3.4, 'random walk, τ steps'),
              (5.2, 'walk back to a prototype'), (6.4, 'embeddings magnetize')]
    for f in range(n):
        t = f / FPS
        m = ease((t - 6.4) / 1.8) * (1 - ease((t - 9.3) / 0.7))          # magnetization amount (loops back)
        P = P0 * (1 - m) + P1 * m
        protos = np.array([P[(lab == c) & labeled].mean(0) for c in range(3)])
        protos = protos * (1 - m) + centers * m
        im = Image.new('RGB', (W * 2, H * 2), BG); d = ImageDraw.Draw(im)
        S = 2
        def L(a, b, col, wdt=1, dash=False):
            (x0, y0), (x1, y1) = a * S, b * S
            if not dash:
                d.line((x0, y0, x1, y1), fill=col, width=wdt * S); return
            nseg = int(np.hypot(x1 - x0, y1 - y0) / 14)
            for k in range(0, max(nseg, 1), 2):
                u0, u1 = k / max(nseg, 1), min(1, (k + 1) / max(nseg, 1))
                d.line((x0 + (x1 - x0) * u0, y0 + (y1 - y0) * u0, x0 + (x1 - x0) * u1, y0 + (y1 - y0) * u1), fill=col, width=wdt * S)
        def blend(c, a):
            return tuple(int(BG[i] + (c[i] - BG[i]) * a) for i in range(3))
        # stage 2: transition probabilities prototype → points (fan of lines from the red prototype)
        a2 = ease((t - 1.5) / 0.4) * (1 - ease((t - 3.4) / 0.4))
        if a2 > 0:
            dist = np.linalg.norm(P[unl] - protos[0], axis=1); pr = np.exp(-dist / 60); pr /= pr.max()
            for j, q in zip(unl, pr):
                L(protos[0], P[j], blend((120, 128, 138), a2 * (0.25 + 0.75 * q)), 1, dash=q < 0.35)
        # stage 3: kNN graph between unlabeled points
        a3 = ease((t - 3.4) / 0.4) * (1 - ease((t - 5.2) / 0.5))
        if a3 > 0:
            for i, j in edges:
                L(P[i], P[j], blend((150, 158, 168), a3 * 0.8), 1)
        # walker path so far
        path = [protos[0]] + [P[k] for k in walk] + [protos[0]]
        times = [1.9, 2.8, 3.8, 4.3, 4.8, 5.6]                       # arrival time at each node
        if 1.9 < t < 6.6:
            fade = 1 - ease((t - 6.2) / 0.4)
            for k in range(1, len(path)):
                if t >= times[k - 1]:
                    u = min(1, (t - times[k - 1]) / (times[k] - times[k - 1] if k < len(times) else 0.6))
                    end = path[k - 1] + (path[k] - path[k - 1]) * ease(u)
                    L(path[k - 1], end, blend(ACC, fade), 3)
                    if u < 1:
                        x, y = end * S; r = 7 * S
                        d.ellipse((x - r, y - r, x + r, y + r), fill=blend(ACC, fade))
        # points
        tint = ease((t - 6.6) / 1.2) * (1 - ease((t - 9.3) / 0.7))
        for i in range(len(P)):
            x, y = P[i] * S; r = 9 * S
            if labeled[i]: c = LIGHT[lab[i]]
            else: c = tuple(int(GREY[k] + (LIGHT[lab[i]][k] - GREY[k]) * tint * 0.8) for k in range(3))
            d.ellipse((x - r, y - r, x + r, y + r), fill=c)
        # h_i marker on the first visited point
        if 1.9 < t < 6.0:
            x, y = P[walk[0]] * S; r = 12 * S
            d.ellipse((x - r, y - r, x + r, y + r), outline=(60, 68, 80), width=2 * S)
            d.text((x + 14 * S, y - 26 * S), 'h', font=ImageFont.truetype('DejaVuSans-Oblique.ttf', 17 * S) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf') else F_MONO, fill=(60, 68, 80))
        # prototypes
        pa = ease((t - 0.6) / 0.6) if t < 9.3 else 1
        for c in range(3 if pa > 0.05 else 0):
            x, y = protos[c] * S; r = 13 * S
            d.ellipse((x - r, y - r, x + r, y + r), fill=blend(COL[c], pa), outline=blend((20, 24, 30), pa), width=3 * S)
        # landing check: walker returns to its own prototype
        if 5.6 < t < 6.6:
            a = ease((t - 5.6) / 0.25) * (1 - ease((t - 6.3) / 0.3))
            x, y = protos[0] * S; r = 24 * S
            d.ellipse((x - r, y - r, x + r, y + r), outline=blend(ACC, a), width=3 * S)
        fr = im.resize((W, H), Image.LANCZOS); dd = ImageDraw.Draw(fr)
        cur = [s for s in stages if t >= s[0]][-1][1]
        chip(dd, (18, 16), 'PRW', bg=INK)
        chip(dd, (82, 16), cur)
        w.send(fr.tobytes())
    w.close()


def compatpp(src=os.environ.get('COMPATPP_GIF', '../3DCoMPaT-v2/img/header_gif.gif')):
    """The official animated header of the 3DCoMPaT++ repo (BSD-3, Vision-CAIR / KAUST), re-encoded
    to a 640x400 H.264 loop: github.com/Vision-CAIR/3DCoMPaT-v2/blob/main/img/header_gif.gif"""
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    os.system(f'"{ff}" -loglevel error -y -i "{src}" -vf "crop=600:375:0:37,scale=640:400:flags=lanczos,fps=25" '
              f'-c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an {OUT}/compatpp.mp4')


if __name__ == '__main__':
    # dance.mp4 is now a real model output (with music); only re-render it explicitly.
    which = sys.argv[2:] or ['perceptio', 'pointnext', 'compat']
    for k in which:
        globals()[k](); print('done', k)
    # posters (first frame users see before the video starts / with reduced motion)
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    for k in which:
        os.system(f'"{ff}" -loglevel error -y -ss 4.5 -i {OUT}/{k}.mp4 -frames:v 1 -q:v 3 {OUT}/{k}.jpg')
