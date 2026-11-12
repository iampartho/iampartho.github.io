/* =====================================================================
   viz.js: interactive illustrations (Projects page + home page art)

   Everything drawn here is PROCEDURAL: a synthetic chest "phantom" and
   a synthetic airway tree generated from random numbers in the browser.
   No patient data and no outputs of real models are shown.

   A widget is any element with  data-viz="randomize" | "compare" |
   "airway" | "masked" | "hero-tree"; see projects.html for the markup.
   ===================================================================== */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------------------------------------------------------------- *
   *  Small helpers                                                    *
   * ---------------------------------------------------------------- */
  function rng(seed) {                       // mulberry32: fast seeded PRNG
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function angDist(a, b) { var d = Math.abs(a - b) % TAU; return d > Math.PI ? TAU - d : d; }
  function bump(t, c, w) { var d = angDist(t, c) / w; return Math.exp(-d * d); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function dprOf() { return Math.min(window.devicePixelRatio || 1, 2); }
  function sizeCanvas(cv) {
    var d = dprOf();
    var w = Math.max(2, Math.round(cv.clientWidth * d));
    var h = Math.max(2, Math.round(cv.clientHeight * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; return true; }
    return false;
  }
  function onResize(el, fn) {
    if ('ResizeObserver' in window) new ResizeObserver(function () { fn(); }).observe(el);
    else window.addEventListener('resize', fn);
  }
  /* Runs onShow/onHide as the element scrolls in/out of view or the tab hides */
  function whenVisible(el, onShow, onHide) {
    var vis = false;
    function update() { if (vis && !document.hidden) onShow(); else onHide(); }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; update(); }, { threshold: 0.02 }).observe(el);
    } else { vis = true; update(); }
    document.addEventListener('visibilitychange', update);
  }
  function Loop(step) {
    var raf = 0, last = 0, on = false;
    function tick(t) {
      if (!on) return;
      raf = requestAnimationFrame(tick);
      var dt = last ? Math.min(50, t - last) : 16; last = t;
      step(dt);
    }
    return {
      start: function () { if (!on) { on = true; last = 0; raf = requestAnimationFrame(tick); } },
      stop: function () { on = false; cancelAnimationFrame(raf); },
      isOn: function () { return on; }
    };
  }
  function setPressed(list, active) {
    Array.prototype.forEach.call(list, function (b) { b.setAttribute('aria-pressed', b === active ? 'true' : 'false'); });
  }

  /* ---------------------------------------------------------------- *
   *  1. Synthetic axial chest phantom                                 *
   *     normalised coordinates: x in [-1, 1], y down (posterior)      *
   * ---------------------------------------------------------------- */
  var PW = 320, PH = 240;                  // raster size of the phantom (4:3)
  var PS = PW / 2.04;                      // pixels per unit
  var PY = 0.03;                           // vertical centre of the body

  function lungRadius(side, th, ph) {     // side -1 = right lung (viewer's left), +1 = left lung
    var rx = side < 0 ? 0.31 : 0.28, ry = side < 0 ? 0.47 : 0.46;
    var c = Math.cos(th), s = Math.sin(th);
    var r = (rx * ry) / Math.sqrt((ry * c) * (ry * c) + (rx * s) * (rx * s));
    r *= 1 - 0.24 * bump(th, side < 0 ? 0 : Math.PI, 0.55);     // flat medial side (mediastinum)
    r *= 1 - 0.12 * bump(th, -Math.PI / 2, 0.6);                 // narrow anterior tip
    r *= 1 + 0.08 * bump(th, side < 0 ? 2.25 : 0.9, 0.7);        // full posterolateral base
    if (side > 0) r *= 1 - 0.30 * bump(th, -2.55, 0.45);         // cardiac notch
    r *= 1 + 0.02 * Math.sin(3 * th + ph) + 0.012 * Math.sin(5 * th + 2 * ph);
    return r;
  }
  function bodyPoint(t, k) {
    var p = 2.3, rx = 0.94 * k, ry = 0.66 * k, c = Math.cos(t), s = Math.sin(t);
    var x = rx * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / p);
    var y = ry * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 2 / p);
    if (y > 0) y -= 0.03 * k * Math.exp(-(x / 0.16) * (x / 0.16));   // dip over the spine
    return [x, y + PY];
  }
  function polyPath(pts) {
    var p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
    p.closePath(); return p;
  }

  function makePhantom(seed) {
    var r = rng(seed), N = 220, i, k, t;
    var P = { lungs: [], ribs: [] }, body = [], inner = [];
    for (i = 0; i < N; i++) { t = i / N * TAU; body.push(bodyPoint(t, 1)); inner.push(bodyPoint(t, 0.935)); }
    P.body = polyPath(body); P.inner = polyPath(inner);

    var C = [[-0.40, 0.05], [0.43, 0.06]];
    [-1, 1].forEach(function (side, li) {
      var c = C[li], phase = r() * TAU, pts = [];
      for (i = 0; i < N; i++) {
        t = -Math.PI + i / N * TAU;
        var rr = lungRadius(side, t, phase);
        pts.push([c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)]);
      }
      var L = { side: side, c: c, phase: phase, path: polyPath(pts), vessels: [], dots: [] };
      L.hilum = [c[0] - side * 0.17, c[1] - 0.02];
      var inside = function (x, y, m) {
        var dx = x - c[0], dy = y - c[1];
        return Math.sqrt(dx * dx + dy * dy) < lungRadius(side, Math.atan2(dy, dx), phase) * m;
      };
      var grow = function (x, y, ang, w, depth) {
        for (var s = 0; s < 40 && w > 0.0026; s++) {
          var nx = x + Math.cos(ang) * 0.024, ny = y + Math.sin(ang) * 0.024;
          if (!inside(nx, ny, 0.95)) break;
          L.vessels.push([x, y, nx, ny, w]);
          x = nx; y = ny; ang += gauss(r) * 0.22; w *= 0.915;
          if (s > 2 && r() < 0.07) break;                          // the vessel leaves the slice
          if (depth < 3 && r() < 0.17) grow(x, y, ang + (r() < 0.5 ? -1 : 1) * (0.45 + r() * 0.5), w * 0.78, depth + 1);
        }
      };
      var lateral = side < 0 ? Math.PI : 0;
      for (k = 0; k < 9; k++) grow(L.hilum[0], L.hilum[1], lateral + (r() - 0.5) * 4.4, 0.012 + r() * 0.005, 0);
      for (k = 0; k < 110; k++) {
        var a = r() * TAU, f = Math.sqrt(r()) * 0.92, R0 = lungRadius(side, a, phase) * f;
        var px = c[0] + R0 * Math.cos(a), py = c[1] + R0 * Math.sin(a);
        var dh = Math.sqrt((px - L.hilum[0]) * (px - L.hilum[0]) + (py - L.hilum[1]) * (py - L.hilum[1]));
        L.dots.push([px, py, clamp(0.009 - dh * 0.011, 0.0024, 0.009) * (0.6 + r() * 0.7)]);
      }
      P.lungs.push(L);
    });
    for (var sd = -1; sd <= 1; sd += 2) {
      for (k = 0; k < 7; k++) {
        var phi = -1.12 + k * 0.355 + (r() - 0.5) * 0.06;
        P.ribs.push([sd * 0.83 * Math.cos(phi), PY + 0.6 * Math.sin(phi), 0.042, 0.022, sd > 0 ? phi + Math.PI / 2 : Math.PI / 2 - phi]);
      }
    }
    return P;
  }

  /* Tissue intensities (0..1) for each "modality" */
  var PAL_CT = { air: 0.015, table: 0.42, fat: 0.66, muscle: 0.8, blood: 0.78, bone: 1.0, marrow: 0.86, csf: 0.76, lung: 0.09, vessel: 0.7 };
  var PAL_MRI = { air: 0.04, table: 0.04, fat: 0.95, muscle: 0.62, blood: 0.42, bone: 0.3, marrow: 0.82, csf: 0.55, lung: 0.2, vessel: 0.31 };

  function makeRenderer() {
    var P = makePhantom(7);
    var cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    var cache = {};

    function gray(v) { v = Math.round(clamp(v, 0, 1) * 255); return 'rgb(' + v + ',' + v + ',' + v + ')'; }
    function ell(x, y, rx, ry, rot, fill) { cx.beginPath(); cx.ellipse(x, y, rx, ry, rot, 0, TAU); cx.fillStyle = fill; cx.fill(); }

    function paint(p) {
      cx.setTransform(1, 0, 0, 1, 0, 0);
      cx.fillStyle = gray(p.air); cx.fillRect(0, 0, PW, PH);
      cx.setTransform(PS, 0, 0, PS, PW / 2, PH / 2 - PY * PS);
      cx.strokeStyle = gray(p.table); cx.lineWidth = 0.022;                                             // scanner table
      cx.beginPath(); cx.ellipse(0, -0.3, 1.12, 1.05, 0, 0.62, Math.PI - 0.62); cx.stroke();
      cx.lineWidth = 0.01;
      cx.beginPath(); cx.ellipse(0, -0.3, 1.12, 1.09, 0, 0.7, Math.PI - 0.7); cx.stroke();
      cx.fillStyle = gray(p.fat); cx.fill(P.body);
      cx.fillStyle = gray(p.muscle); cx.fill(P.inner);
      P.ribs.forEach(function (b) {
        ell(b[0], b[1], b[2], b[3], b[4], gray(p.bone));
        ell(b[0], b[1], b[2] * 0.55, b[3] * 0.45, b[4], gray(p.marrow));
      });
      ell(0, -0.565, 0.075, 0.03, 0, gray(p.bone)); ell(0, -0.565, 0.05, 0.016, 0, gray(p.marrow));      // sternum
      ell(0.09, -0.12, 0.29, 0.255, -0.35, gray(p.fat));                                                  // pericardial fat
      ell(0.09, -0.12, 0.265, 0.232, -0.35, gray(p.blood));                                               // heart
      ell(0.10, 0.29, 0.066, 0.066, 0, gray(p.muscle)); ell(0.10, 0.29, 0.056, 0.056, 0, gray(p.blood)); // descending aorta
      ell(-0.01, 0.19, 0.03, 0.026, 0, gray(p.muscle)); ell(-0.006, 0.19, 0.008, 0.006, 0, gray(p.air)); // oesophagus
      ell(0, 0.37, 0.108, 0.098, 0, gray(p.bone)); ell(0, 0.37, 0.088, 0.078, 0, gray(p.marrow));        // vertebral body
      ell(0, 0.505, 0.038, 0.034, 0, gray(p.csf));                                                        // spinal canal
      cx.beginPath(); cx.ellipse(0, 0.525, 0.085, 0.05, 0, 0.15, Math.PI - 0.15);
      cx.lineWidth = 0.022; cx.strokeStyle = gray(p.bone); cx.stroke();                                   // lamina
      ell(0, 0.6, 0.02, 0.038, 0, gray(p.bone));                                                          // spinous process
      P.lungs.forEach(function (L) {
        cx.fillStyle = gray(p.lung); cx.fill(L.path);
        cx.save(); cx.clip(L.path);
        cx.lineCap = 'round';
        L.vessels.forEach(function (v) {                     // thin peripheral vessels look fainter (partial volume)
          cx.strokeStyle = gray(p.lung + (p.vessel - p.lung) * clamp(v[4] / 0.011, 0.3, 1));
          cx.lineWidth = v[4]; cx.beginPath(); cx.moveTo(v[0], v[1]); cx.lineTo(v[2], v[3]); cx.stroke();
        });
        L.dots.forEach(function (d) {
          cx.fillStyle = gray(p.lung + (p.vessel - p.lung) * clamp(d[2] / 0.008, 0.3, 1));
          cx.beginPath(); cx.arc(d[0], d[1], d[2], 0, TAU); cx.fill();
        });
        var bx = L.hilum[0] - L.side * 0.035, by = L.hilum[1] - 0.05;                                     // lobar bronchus
        ell(bx, by, 0.03, 0.03, 0, gray(p.vessel)); ell(bx, by, 0.021, 0.021, 0, gray(p.air));
        cx.restore();
      });
      cx.setTransform(1, 0, 0, 1, 0, 0);
      var d = cx.getImageData(0, 0, PW, PH).data, n = PW * PH, f = new Float32Array(n);
      for (var i = 0; i < n; i++) f[i] = d[i * 4] / 255;
      return f;
    }

    function blur(f, passes) {                       // separable 3-tap box blur
      var n = f.length, a = new Float32Array(f), b = new Float32Array(n), x, y, i;
      for (var p = 0; p < passes; p++) {
        for (y = 0; y < PH; y++) for (x = 0; x < PW; x++) {
          i = y * PW + x;
          b[i] = (a[x > 0 ? i - 1 : i] + a[i] + a[x < PW - 1 ? i + 1 : i]) / 3;
        }
        for (y = 0; y < PH; y++) for (x = 0; x < PW; x++) {
          i = y * PW + x;
          a[i] = (b[y > 0 ? i - PW : i] + b[i] + b[y < PH - 1 ? i + PW : i]) / 3;
        }
      }
      return a;
    }
    function conv3(f, k, bias) {
      var o = new Float32Array(f.length);
      for (var y = 0; y < PH; y++) {
        var y0 = y > 0 ? y - 1 : 0, y2 = y < PH - 1 ? y + 1 : y;
        for (var x = 0; x < PW; x++) {
          var x0 = x > 0 ? x - 1 : 0, x2 = x < PW - 1 ? x + 1 : x;
          o[y * PW + x] = bias +
            k[0] * f[y0 * PW + x0] + k[1] * f[y0 * PW + x] + k[2] * f[y0 * PW + x2] +
            k[3] * f[y * PW + x0] + k[4] * f[y * PW + x] + k[5] * f[y * PW + x2] +
            k[6] * f[y2 * PW + x0] + k[7] * f[y2 * PW + x] + k[8] * f[y2 * PW + x2];
        }
      }
      return o;
    }
    function normalize(f) {                          // robust min-max to [0, 1]
      var s = [], i;
      for (i = 0; i < f.length; i += 37) s.push(f[i]);
      s.sort(function (a, b) { return a - b; });
      var lo = s[Math.floor(s.length * 0.01)], hi = s[Math.floor(s.length * 0.99)];
      var span = hi - lo > 1e-6 ? hi - lo : 1;
      for (i = 0; i < f.length; i++) f[i] = clamp((f[i] - lo) / span, 0, 1);
      return f;
    }
    function toCanvas(f, target) {
      var c = target || document.createElement('canvas');
      c.width = PW; c.height = PH;
      var g = c.getContext('2d'), img = g.createImageData(PW, PH), d = img.data;
      for (var i = 0, j = 0; i < f.length; i++, j += 4) {
        var v = Math.round(clamp(f[i], 0, 1) * 255); d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c;
    }

    function ct() {
      if (!cache.ct) {
        var f = paint(PAL_CT), r = rng(3);
        for (var i = 0; i < f.length; i++) f[i] = clamp(f[i] + gauss(r) * 0.018, 0, 1);
        cache.ctF = f; cache.ct = toCanvas(f);
      }
      return cache.ct;
    }
    function mri() {
      if (!cache.mri) {
        var f = blur(paint(PAL_MRI), 1), r = rng(5);
        for (var y = 0; y < PH; y++) for (var x = 0; x < PW; x++) {
          var xn = x / PW * 2 - 1, yn = y / PH * 2 - 1, i = y * PW + x;
          var bias = 0.62 + 0.5 * yn * yn + 0.12 * xn + 0.22 * Math.exp(-((xn + 0.35) * (xn + 0.35) + (yn + 0.7) * (yn + 0.7)) / 0.18);
          var s = f[i] * bias, n1 = gauss(r) * 0.05, n2 = gauss(r) * 0.05;
          f[i] = clamp(Math.sqrt((s + n1) * (s + n1) + n2 * n2), 0, 1);   // Rician-like noise floor
        }
        cache.mriF = f; cache.mri = toCanvas(f);
      }
      return cache.mri;
    }
    function blurred(kind) {
      var key = kind + 'Blur';
      if (!cache[key]) { if (kind === 'ct') ct(); else mri(); cache[key] = toCanvas(blur(cache[kind + 'F'], 3)); }
      return cache[key];
    }
    /* A randomised appearance: random tissue intensities + random convolutions (GIN-style) */
    function randomLook(seed, target) {
      var r = rng(1000 + seed * 7919), pal = {}, keys = Object.keys(PAL_CT);
      keys.forEach(function (k) { pal[k] = r(); });
      var guard = 0;
      while (Math.abs(pal.lung - pal.muscle) < 0.28 && guard++ < 20) pal.lung = r();
      var f = paint(pal), i;
      var kern = function () { var k = [], s = 0, j; for (j = 0; j < 9; j++) { k.push(gauss(r)); s += Math.abs(k[j]); } for (j = 0; j < 9; j++) k[j] /= s; return k; };
      var g = conv3(f, kern(), (r() - 0.5) * 0.2);
      for (i = 0; i < g.length; i++) if (g[i] < 0) g[i] *= 0.2;              // leaky ReLU
      g = normalize(conv3(g, kern(), (r() - 0.5) * 0.2));
      var alpha = 0.35 + r() * 0.5, gamma = 0.6 + r() * 1.2, noise = r() * 0.035;
      for (i = 0; i < f.length; i++) f[i] = alpha * g[i] + (1 - alpha) * f[i];
      normalize(f);
      for (i = 0; i < f.length; i++) f[i] = clamp(Math.pow(f[i], gamma) + gauss(r) * noise, 0, 1);
      return toCanvas(f, target);
    }

    return { P: P, ct: ct, mri: mri, blurred: blurred, randomLook: randomLook };
  }
  var _R = null;
  function R() { return _R || (_R = makeRenderer()); }

  /* Draw a phantom raster to a display canvas, plus helpers for the lung overlay */
  function drawImage(ctx, src, W, H) {
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, PW, PH, 0, 0, W, H);
  }
  function lungOverlay(ctx, W) {               // gold lung "segmentation" drawn from the exact vector outline
    var sc = W / PW * PS;
    ctx.save();
    ctx.setTransform(sc, 0, 0, sc, W / 2, ctx.canvas.height / 2 - PY * sc);
    R().P.lungs.forEach(function (L) {
      ctx.fillStyle = 'rgba(255, 205, 0, 0.16)'; ctx.fill(L.path);
      ctx.lineWidth = 2 * dprOf() / sc; ctx.strokeStyle = '#ffcd00'; ctx.lineJoin = 'round'; ctx.stroke(L.path);
    });
    ctx.restore();
  }

  /* ---------------------------------------------------------------- *
   *  Widget: "randomize" (same anatomy, many appearances)             *
   * ---------------------------------------------------------------- */
  function initRandomize(root) {
    var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var label = root.querySelector('[data-role="label"]');
    var modeBtns = root.querySelectorAll('[data-mode]');
    var maskBtn = root.querySelector('[data-toggle="mask"]');
    var shuffleBtn = root.querySelector('[data-action="shuffle"]');
    var mode = 'random', showMask = true, seed = 1, fade = 1, timer = 0;
    var bufA = document.createElement('canvas'), bufB = document.createElement('canvas');
    var cur = null, prev = null;

    function newRandom() {
      seed += 1; prev = cur;
      var target = cur === bufA ? bufB : bufA;
      cur = R().randomLook(seed, target);
      fade = prev ? 0 : 1;
      if (label && mode === 'random') label.textContent = 'Randomized #' + seed;
    }
    function draw() {
      sizeCanvas(cv);
      var W = cv.width, H = cv.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      if (mode === 'ct') drawImage(ctx, R().ct(), W, H);
      else if (mode === 'mri') drawImage(ctx, R().mri(), W, H);
      else {
        if (!cur) newRandom();
        if (prev && fade < 1) { drawImage(ctx, prev, W, H); ctx.globalAlpha = ease(fade); }
        drawImage(ctx, cur, W, H); ctx.globalAlpha = 1;
      }
      if (showMask) lungOverlay(ctx, W);
    }
    var loop = Loop(function (dt) {
      if (mode !== 'random') return;
      timer += dt;
      if (fade < 1) { fade = Math.min(1, fade + dt / 380); draw(); }
      if (timer > 1700) { timer = 0; newRandom(); draw(); }
    });
    Array.prototype.forEach.call(modeBtns, function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-mode'); setPressed(modeBtns, b); timer = 0; fade = 1;
        if (label) label.textContent = mode === 'ct' ? 'CT' : mode === 'mri' ? 'UTE MRI (simulated)' : 'Randomized #' + seed;
        draw();
      });
    });
    if (maskBtn) maskBtn.addEventListener('click', function () {
      showMask = !showMask; maskBtn.setAttribute('aria-pressed', showMask ? 'true' : 'false'); draw();
    });
    if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
      var rb = root.querySelector('[data-mode="random"]');
      mode = 'random'; if (rb) setPressed(modeBtns, rb);
      newRandom(); fade = 1; timer = 0; draw();
    });
    onResize(cv, draw);
    draw();
    whenVisible(root, function () { if (!RM) loop.start(); }, loop.stop);
  }

  /* ---------------------------------------------------------------- *
   *  Widget: "compare" (MRI | synthetic-CT slider)                     *
   * ---------------------------------------------------------------- */
  function initCompare(root) {
    var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var range = root.querySelector('input[type="range"]');
    var maskBtn = root.querySelector('[data-toggle="mask"]');
    var hint = root.querySelector('.viz-hint');
    var pos = 0.5, showMask = false, touched = false, intro = 0, dragging = false;

    function draw() {
      sizeCanvas(cv);
      var W = cv.width, H = cv.height, x = Math.round(pos * W), d = dprOf();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, H); ctx.clip(); drawImage(ctx, R().mri(), W, H); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W - x, H); ctx.clip(); drawImage(ctx, R().ct(), W, H); ctx.restore();
      if (showMask) lungOverlay(ctx, W);
      ctx.fillStyle = '#fff'; ctx.fillRect(x - d, 0, 2 * d, H);
      ctx.beginPath(); ctx.arc(x, H / 2, 17 * d, 0, TAU); ctx.fillStyle = '#ffcd00'; ctx.fill();
      ctx.lineWidth = 2 * d; ctx.strokeStyle = '#111'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 4 * d, H / 2 - 6 * d); ctx.lineTo(x - 10 * d, H / 2); ctx.lineTo(x - 4 * d, H / 2 + 6 * d);
      ctx.moveTo(x + 4 * d, H / 2 - 6 * d); ctx.lineTo(x + 10 * d, H / 2); ctx.lineTo(x + 4 * d, H / 2 + 6 * d);
      ctx.stroke();
      if (range) range.value = String(Math.round(pos * 100));
    }
    function setFromEvent(e) {
      var rect = cv.getBoundingClientRect();
      pos = clamp((e.clientX - rect.left) / rect.width, 0.02, 0.98);
      draw();
    }
    function interacted() { touched = true; if (hint) hint.style.opacity = '0'; }
    cv.addEventListener('pointerdown', function (e) {
      dragging = true; interacted(); setFromEvent(e);
      if (cv.setPointerCapture) try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    cv.addEventListener('pointermove', function (e) { if (dragging) setFromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { cv.addEventListener(t, function () { dragging = false; }); });
    if (range) range.addEventListener('input', function () { interacted(); pos = clamp(+range.value / 100, 0.02, 0.98); draw(); });
    if (maskBtn) maskBtn.addEventListener('click', function () {
      showMask = !showMask; maskBtn.setAttribute('aria-pressed', showMask ? 'true' : 'false'); draw();
    });
    var loop = Loop(function (dt) {                 // one-time gentle sweep to hint that it slides
      if (touched) { loop.stop(); return; }
      intro += dt / 2600;
      if (intro >= 1) { pos = 0.5; draw(); loop.stop(); touched = true; return; }
      pos = 0.5 + 0.24 * Math.sin(intro * TAU) * (1 - intro * 0.3);
      draw();
    });
    onResize(cv, draw);
    draw();
    whenVisible(root, function () { if (!RM && !touched) loop.start(); }, loop.stop);
  }

  /* ---------------------------------------------------------------- *
   *  2. Synthetic 3D airway tree                                      *
   * ---------------------------------------------------------------- */
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.sqrt(dot(a, a)) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rotAround(v, k, t) {                         // Rodrigues' rotation of v about unit axis k
    var c = Math.cos(t), s = Math.sin(t), kv = cross(k, v), kd = dot(k, v) * (1 - c);
    return [v[0] * c + kv[0] * s + k[0] * kd, v[1] * c + kv[1] * s + k[1] * kd, v[2] * c + kv[2] * s + k[2] * kd];
  }

  function makeAirway(seed, maxGen) {
    var r = rng(seed), segs = [], tips = [];
    var E = [{ c: [-0.40, 0.16, 0.0], s: [0.33, 0.6, 0.36] }, { c: [0.40, 0.2, 0.0], s: [0.3, 0.56, 0.34] }];
    function inLung(p, m) {
      for (var i = 0; i < 2; i++) {
        var e = E[i], dx = (p[0] - e.c[0]) / e.s[0], dy = (p[1] - e.c[1]) / e.s[1], dz = (p[2] - e.c[2]) / e.s[2];
        if (dx * dx + dy * dy + dz * dz < m * m) return true;
      }
      return false;
    }
    function grow(p, dir, len, rad, gen, roll) {
      var q = add(p, mul(dir, len));
      if (gen >= 3 && !inLung(q, 0.97)) {
        var ok = false;
        for (var t = 0; t < 5 && !ok; t++) {
          var d2 = norm(add(dir, [gauss(r) * 0.55, gauss(r) * 0.55, gauss(r) * 0.55]));
          var q2 = add(p, mul(d2, len * 0.8));
          if (inLung(q2, 0.97)) { dir = d2; q = q2; len *= 0.8; ok = true; }
        }
        if (!ok) { tips.push(p); return; }
      }
      segs.push({ a: p, b: q, r: rad, g: gen });
      if (gen >= maxGen) { tips.push(q); return; }
      var ref = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      var u = rotAround(norm(cross(dir, ref)), dir, roll);
      var a1 = 0.42 + r() * 0.28, a2 = 0.5 + r() * 0.32, nr = roll + Math.PI / 2 + gauss(r) * 0.3;
      grow(q, norm(rotAround(dir, u, a1)), len * (0.8 + r() * 0.1), rad * 0.79, gen + 1, nr);
      grow(q, norm(rotAround(dir, u, -a2)), len * (0.68 + r() * 0.12), rad * 0.7, gen + 1, nr);
    }
    var top = [0, -0.85, 0.04], carina = [0, -0.36, 0.05];
    segs.push({ a: top, b: carina, r: 0.05, g: 0 });
    var rmb = add(carina, mul(norm([-0.62, 0.62, 0.06]), 0.2));      // right main bronchus: shorter, steeper
    var lmb = add(carina, mul(norm([0.75, 0.48, -0.04]), 0.28));     // left main bronchus: longer, flatter
    segs.push({ a: carina, b: rmb, r: 0.04, g: 1 }, { a: carina, b: lmb, r: 0.034, g: 1 });
    var bi = add(rmb, mul(norm([-0.2, 0.97, 0.05]), 0.12));           // bronchus intermedius
    segs.push({ a: rmb, b: bi, r: 0.032, g: 2 });
    grow(rmb, norm([-0.55, -0.6, 0.15]), 0.13, 0.028, 2, 0.4);        // right upper lobe
    grow(bi, norm([-0.45, 0.45, -0.75]), 0.12, 0.022, 3, 1.2);        // right middle lobe
    grow(bi, norm([-0.15, 0.9, 0.4]), 0.15, 0.028, 3, 0.1);           // right lower lobe
    grow(lmb, norm([0.45, -0.65, -0.1]), 0.13, 0.026, 2, -0.5);       // left upper lobe
    grow(lmb, norm([0.25, 0.92, 0.2]), 0.16, 0.028, 2, 0.2);          // left lower lobe
    return { segs: segs, tips: tips, E: E, inLung: inLung };
  }

  function makeHoneycomb(tree, seed) {
    var r = rng(seed), cysts = [], leaks = [];
    tree.E.forEach(function (e) {
      for (var c = 0; c < 15; c++) {
        var th = r() * TAU, uy = 0.2 + r() * 0.72, rr = Math.sqrt(1 - uy * uy);
        var dir = [Math.cos(th) * rr, uy, Math.sin(th) * rr];
        if (dir[2] < -0.2) dir[2] = -dir[2];                         // basal + posterior, under the pleura
        var shell = 0.88 + r() * 0.07;
        var cc = [e.c[0] + dir[0] * e.s[0] * shell, e.c[1] + dir[1] * e.s[1] * shell, e.c[2] + dir[2] * e.s[2] * shell];
        for (var k = 0; k < 10; k++) {
          var p = [cc[0] + gauss(r) * 0.034, cc[1] + gauss(r) * 0.034, cc[2] + gauss(r) * 0.034];
          if (tree.inLung(p, 1.0)) cysts.push({ p: p, r: 0.011 + r() * 0.017 });
        }
      }
    });
    cysts.forEach(function (c) {
      var best = null, bd = 0.11;
      tree.tips.forEach(function (t) {
        var dx = t[0] - c.p[0], dy = t[1] - c.p[1], dz = t[2] - c.p[2], d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < bd) { bd = d; best = t; }
      });
      if (best && r() < 0.75) leaks.push({ from: best, c: c });
    });
    return { cysts: cysts, leaks: leaks };
  }

  function initAirway(root) {
    var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var modeBtns = root.querySelectorAll('[data-mode]');
    var hint = root.querySelector('.viz-hint');
    var tree = makeAirway(21, 9), hc = makeHoneycomb(tree, 5);
    var cloud = [], r = rng(77);
    tree.E.forEach(function (e) {
      for (var i = 0; i < 520; i++) {
        var z = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - z * z);
        cloud.push([e.c[0] + Math.cos(a) * s * e.s[0], e.c[1] + z * e.s[1], e.c[2] + Math.sin(a) * s * e.s[2]]);
      }
    });
    var yaw = -0.55, pitch = 0.16, mode = 'healthy', dragging = false, lx = 0, ly = 0, idle = 0, W = 0, H = 0;
    var tmpA = [0, 0, 0, 0], tmpB = [0, 0, 0, 0];

    function proj(p, out) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy, y1 = p[1] + 0.02;
      var y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp, s = 3 / (3 + z2), k = Math.min(H / 1.95, W / 1.6);
      out[0] = W / 2 + x1 * k * s; out[1] = H / 2 + y2 * k * s; out[2] = z2; out[3] = k * s;
      return out;
    }
    function shade(z) { return clamp(0.5 + 0.5 * (1 - (z + 0.6) / 1.2), 0.25, 1); }

    function draw() {
      sizeCanvas(cv); W = cv.width; H = cv.height;
      var d = dprOf(), i;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      var g = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      g.addColorStop(0, '#141a24'); g.addColorStop(1, '#06070a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < cloud.length; i++) {                         // faint lung surfaces
        proj(cloud[i], tmpA);
        ctx.fillStyle = 'rgba(150, 175, 210,' + (0.1 + 0.24 * shade(tmpA[2])).toFixed(3) + ')';
        ctx.fillRect(tmpA[0], tmpA[1], 1.5 * d, 1.5 * d);
      }
      var items = [];
      tree.segs.forEach(function (sg) {
        var a = proj(sg.a, [0, 0, 0, 0]), b = proj(sg.b, [0, 0, 0, 0]);
        items.push({ t: 0, z: (a[2] + b[2]) / 2, a: a, b: b, r: sg.r, g: sg.g });
      });
      if (mode !== 'healthy') hc.cysts.forEach(function (c) { var p = proj(c.p, [0, 0, 0, 0]); items.push({ t: 1, z: p[2], p: p, r: c.r }); });
      if (mode === 'leak') hc.leaks.forEach(function (l) {
        var a = proj(l.from, [0, 0, 0, 0]), p = proj(l.c.p, [0, 0, 0, 0]);
        items.push({ t: 2, z: p[2] - 0.001, a: a, p: p, r: l.c.r });
      });
      items.sort(function (m, n) { return n.z - m.z; });
      ctx.lineCap = 'round';
      for (i = 0; i < items.length; i++) {
        var it = items[i], sh = shade(it.z);
        if (it.t === 0) {
          var w = Math.max(0.8 * d, it.r * 2 * it.a[3] * 0.85);
          var light = it.g < 2 ? 1 : 0;
          ctx.strokeStyle = light ? 'rgba(255, 226, 122,' + (0.55 + 0.45 * sh).toFixed(3) + ')'
                                  : 'rgba(255, ' + Math.round(170 + 50 * sh) + ', 0,' + (0.35 + 0.65 * sh).toFixed(3) + ')';
          ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(it.a[0], it.a[1]); ctx.lineTo(it.b[0], it.b[1]); ctx.stroke();
        } else if (it.t === 1) {
          var rr = Math.max(1.6 * d, it.r * it.p[3]);
          ctx.beginPath(); ctx.arc(it.p[0], it.p[1], rr, 0, TAU);
          ctx.fillStyle = 'rgba(120, 205, 220,' + (0.05 + 0.08 * sh).toFixed(3) + ')'; ctx.fill();
          ctx.lineWidth = 1.1 * d; ctx.strokeStyle = 'rgba(120, 205, 220,' + (0.35 + 0.5 * sh).toFixed(3) + ')'; ctx.stroke();
        } else {
          var rl = Math.max(1.8 * d, it.r * it.p[3] * 1.05);
          ctx.strokeStyle = 'rgba(255, 98, 82, 0.85)'; ctx.lineWidth = Math.max(1.2 * d, rl * 0.45);
          ctx.beginPath(); ctx.moveTo(it.a[0], it.a[1]); ctx.lineTo(it.p[0], it.p[1]); ctx.stroke();
          ctx.beginPath(); ctx.arc(it.p[0], it.p[1], rl, 0, TAU);
          ctx.fillStyle = 'rgba(255, 98, 82,' + (0.55 + 0.4 * sh).toFixed(3) + ')'; ctx.fill();
        }
      }
    }
    var loop = Loop(function (dt) {
      if (dragging) return;
      idle += dt;
      if (idle > 1800) { yaw += dt * 0.00028; draw(); }
    });
    cv.addEventListener('pointerdown', function (e) {
      dragging = true; lx = e.clientX; ly = e.clientY; idle = 0;
      if (hint) hint.style.opacity = '0';
      if (cv.setPointerCapture) try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    cv.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      yaw += (e.clientX - lx) * 0.008; pitch = clamp(pitch + (e.clientY - ly) * 0.005, -0.7, 0.7);
      lx = e.clientX; ly = e.clientY; draw();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { cv.addEventListener(t, function () { dragging = false; idle = 0; }); });
    cv.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { yaw -= 0.12; draw(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { yaw += 0.12; draw(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { pitch = clamp(pitch - 0.08, -0.7, 0.7); draw(); e.preventDefault(); }
      if (e.key === 'ArrowDown') { pitch = clamp(pitch + 0.08, -0.7, 0.7); draw(); e.preventDefault(); }
    });
    Array.prototype.forEach.call(modeBtns, function (b) {
      b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); setPressed(modeBtns, b); draw(); });
    });
    onResize(cv, draw);
    draw();
    whenVisible(root, function () { if (!RM) loop.start(); }, loop.stop);
  }

  /* ---------------------------------------------------------------- *
   *  Widget: "masked" (masked-image modelling for a foundation model)  *
   * ---------------------------------------------------------------- */
  function initMasked(root) {
    var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var range = root.querySelector('input[type="range"]'), out = root.querySelector('output');
    var labMod = root.querySelector('[data-role="modality"]'), labState = root.querySelector('[data-role="state"]');
    var playBtn = root.querySelector('[data-toggle="play"]');
    var GX = 16, GY = 12, N = GX * GY, ratio = range ? +range.value / 100 : 0.75;
    var r = rng(99), masked = new Uint8Array(N), start = new Float32Array(N), modality = 'ct';
    var phase = 'masked', t = 0, playing = !RM, visible = false;
    var REVEAL = 1500, PATCH = 520;

    function remask() {
      var idx = [], i, j, tmp, m = Math.round(N * ratio);
      for (i = 0; i < N; i++) idx.push(i);
      for (i = N - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp; }
      masked = new Uint8Array(N); start = new Float32Array(N);
      var chosen = idx.slice(0, m), key = {};
      chosen.forEach(function (k) { masked[k] = 1; key[k] = (k % GX) + Math.floor(k / GX) * 0.35 + r() * 3; });
      chosen.sort(function (a, b) { return key[a] - key[b]; });
      chosen.forEach(function (k, n) { start[k] = chosen.length > 1 ? n / (chosen.length - 1) * REVEAL : 0; });
      phase = 'masked'; t = 0;
      if (out) out.textContent = Math.round(ratio * 100) + '%';
    }
    function stateText() {
      return phase === 'masked' ? Math.round(ratio * 100) + '% of patches hidden'
        : phase === 'reveal' ? 'reconstructing…' : 'reconstructed';
    }
    function draw() {
      sizeCanvas(cv);
      var W = cv.width, H = cv.height, pw = W / GX, ph = H / GY, sw = PW / GX, sh = PH / GY, d = dprOf();
      var sharp = modality === 'ct' ? R().ct() : R().mri(), soft = R().blurred(modality);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawImage(ctx, sharp, W, H);
      for (var k = 0; k < N; k++) {
        if (!masked[k]) continue;
        var cx = k % GX, cy = Math.floor(k / GX), x = cx * pw, y = cy * ph;
        var s = phase === 'masked' ? 0 : phase === 'hold' ? 2 : clamp((t - start[k]) / PATCH, 0, 2);
        if (s >= 2) continue;
        if (s < 1) {
          ctx.fillStyle = '#1a1f28'; ctx.fillRect(x, y, pw + 0.5, ph + 0.5);
          ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = d; ctx.strokeRect(x + 0.5 * d, y + 0.5 * d, pw - d, ph - d);
          if (s > 0) { ctx.globalAlpha = s; ctx.drawImage(soft, cx * sw, cy * sh, sw, sh, x, y, pw + 0.5, ph + 0.5); ctx.globalAlpha = 1; }
        } else {
          ctx.globalAlpha = 2 - s; ctx.drawImage(soft, cx * sw, cy * sh, sw, sh, x, y, pw + 0.5, ph + 0.5); ctx.globalAlpha = 1;
        }
        if (s > 0) {
          ctx.strokeStyle = 'rgba(255, 205, 0,' + (0.75 * (1 - Math.abs(s - 1))).toFixed(3) + ')';
          ctx.lineWidth = 1.2 * d; ctx.strokeRect(x + 0.6 * d, y + 0.6 * d, pw - 1.2 * d, ph - 1.2 * d);
        }
      }
      if (labMod) labMod.textContent = modality === 'ct' ? 'CT' : 'UTE MRI (simulated)';
      if (labState) labState.textContent = stateText();
    }
    var loop = Loop(function (dt) {
      if (!playing) { loop.stop(); return; }
      t += dt;
      if (phase === 'masked' && t > 1100) { phase = 'reveal'; t = 0; }
      else if (phase === 'reveal' && t > REVEAL + PATCH * 2) { phase = 'hold'; t = 0; }
      else if (phase === 'hold' && t > 1300) { modality = modality === 'ct' ? 'mri' : 'ct'; remask(); }
      draw();
    });
    if (range) range.addEventListener('input', function () { ratio = +range.value / 100; remask(); draw(); });
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    function syncPlay() {
      if (!playBtn) return;
      playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      playBtn.innerHTML = (playing ? ICON_PAUSE : ICON_PLAY) + '<span>' + (playing ? 'Pause' : 'Play') + '</span>';
    }
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        playing = !playing; syncPlay();
        if (playing && visible) loop.start(); else loop.stop();
      });
      syncPlay();
    }
    remask();
    onResize(cv, draw);
    draw();
    whenVisible(root, function () { visible = true; if (playing) loop.start(); }, function () { visible = false; loop.stop(); });
  }

  /* ---------------------------------------------------------------- *
   *  Home page: an airway tree that grows behind the portrait          *
   * ---------------------------------------------------------------- */
  function initHeroTree(cv) {
    var ctx = cv.getContext('2d'), tree = makeAirway(21, 8), grow = RM ? 1 : 0, maxG = 8;
    function isDark() {
      var t = document.documentElement.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    function draw() {
      sizeCanvas(cv);
      var W = cv.width, H = cv.height, k = Math.min(H / 1.55, W / 1.05), yaw = 0.35, cy = Math.cos(yaw), sy = Math.sin(yaw);
      var dark = isDark(), g = grow * (maxG + 1);
      var c0 = dark ? [255, 205, 0] : [190, 146, 18], c1 = dark ? [120, 98, 24] : [228, 208, 150];   // trunk -> fine tips
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      tree.segs.forEach(function (sg) {
        if (sg.g > g) return;
        var f = clamp(g - sg.g, 0, 1);
        var ax = sg.a[0] * cy + sg.a[2] * sy, bx = sg.b[0] * cy + sg.b[2] * sy;
        var x0 = W / 2 + ax * k, y0 = H * 0.5 + (sg.a[1] + 0.12) * k;
        var x1 = W / 2 + bx * k, y1 = H * 0.5 + (sg.b[1] + 0.12) * k;
        var u = clamp(sg.g / maxG, 0, 1);              // solid colours: no darker blobs where strokes overlap
        ctx.strokeStyle = 'rgb(' + Math.round(c0[0] + (c1[0] - c0[0]) * u) + ',' + Math.round(c0[1] + (c1[1] - c0[1]) * u) + ',' + Math.round(c0[2] + (c1[2] - c0[2]) * u) + ')';
        ctx.lineWidth = Math.max(0.7 * dprOf(), sg.r * 2 * k * 0.8);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f); ctx.stroke();
      });
    }
    var loop = Loop(function (dt) {
      grow = Math.min(1, grow + dt / 2200); draw();
      if (grow >= 1) loop.stop();
    });
    onResize(cv, draw);
    document.addEventListener('themechange', draw);
    draw();
    if (!RM) loop.start();
  }

  /* ---------------------------------------------------------------- *
   *  Boot                                                              *
   * ---------------------------------------------------------------- */
  function boot() {
    var map = { randomize: initRandomize, compare: initCompare, airway: initAirway, masked: initMasked };
    Array.prototype.forEach.call(document.querySelectorAll('[data-viz]'), function (el) {
      var kind = el.getAttribute('data-viz');
      try {
        if (kind === 'hero-tree') initHeroTree(el);
        else if (map[kind]) map[kind](el);
      } catch (err) {
        if (window.console) console.error('viz "' + kind + '" failed:', err);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
