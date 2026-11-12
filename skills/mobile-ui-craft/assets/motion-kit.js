/* motion-kit.js (mobile-ui-craft 5.0). Zero dependencies. Inline it in one <script> of the prototype; it defines window.MK.
   Everything that should be filmable runs on WAAPI or view transitions, which scripts/capture.mjs `film:` slows down.
   requestAnimationFrame is used only for MK.tilt smoothing (pointer-driven, not filmed); never build a filmed move on it.
   Springs are CSS linear() easings generated at mass 1; the tokens are the Material 3 Expressive stiffness/damping pairs. */
(() => {
  const MK = (window.MK = { out: 'cubic-bezier(.2,.8,.2,1)' }); // out: for fades and menus, never for springs
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  MK.reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spring as a linear() easing: stiffness k, damping ratio zeta (<= 1). ms is the time to settle within 0.2%.
  MK.spring = (k, zeta, pts = 36) => {
    const w0 = Math.sqrt(k), wd = w0 * Math.sqrt(Math.max(1e-6, 1 - zeta * zeta));
    const x = zeta < 1
      ? (t) => 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t))
      : (t) => 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    let T = 0.02;
    while (T < 10 && !(Math.abs(1 - x(T)) < 0.002 && Math.abs(1 - x(T + 0.15)) < 0.002)) T += 0.01;
    const v = Array.from({ length: pts + 1 }, (_, i) => +x((T * i) / pts).toFixed(3));
    v[pts] = 1;
    return { easing: `linear(${v.join(', ')})`, ms: Math.round(T * 1000) };
  };
  // spatial moves things and may overshoot; effects (opacity, colour) must not overshoot
  MK.ease = { spatial: MK.spring(380, 0.8), fast: MK.spring(800, 0.6), slow: MK.spring(200, 0.8), effects: MK.spring(1600, 1) };

  // Shared-element and state morphs. Give the two ends the same view-transition-name (unique, set only while morphing).
  let vtStyle;
  MK.morph = (update, opts = {}) => {
    if (!document.startViewTransition || document.visibilityState !== 'visible') return Promise.resolve(update()).then(() => {});
    if (!vtStyle) {
      const e = MK.ease.spatial;
      vtStyle = document.head.appendChild(document.createElement('style'));
      // under Reduce Motion the named groups jump and only the page crossfades.
      // The page fades out before the new one fades in: a simultaneous crossfade shows old and new text on top of each other.
      vtStyle.textContent = `::view-transition-group(*){animation-duration:${e.ms}ms;animation-timing-function:${e.easing}}
::view-transition-group(root){animation-duration:200ms;animation-timing-function:ease-out}
::view-transition-old(root){animation:mk-vt-out 90ms ease-out both}::view-transition-new(root){animation:mk-vt-in 150ms 60ms ease-out both}
@keyframes mk-vt-out{to{opacity:0}}@keyframes mk-vt-in{from{opacity:0}}
@media (prefers-reduced-motion:reduce){::view-transition-group(*){animation-duration:.01ms}::view-transition-group(root){animation-duration:150ms}}`;
    }
    const typed = opts.types && window.ViewTransition && 'types' in ViewTransition.prototype;
    const vt = typed ? document.startViewTransition({ update, types: opts.types }) : document.startViewTransition(update);
    vt.ready.catch(() => {}); // a skipped transition rejects ready; the update still ran, so finished is what we return
    return vt.finished;
  };

  // Commit the on-screen transform and stop animations, so a grab or a new move starts from where the element is.
  MK.freeze = (el) => {
    const cs = getComputedStyle(el), t = cs.transform, tr = cs.translate, sc = cs.scale; // read before cancel: computed values are live
    el.getAnimations().forEach((a) => a.cancel());
    el.style.transform = t === 'none' ? '' : t;
    el.style.translate = tr === 'none' ? '' : tr; // MK.flip animates these two, so a mid-flip grab needs them too
    el.style.scale = sc === 'none' ? '' : sc;
  };

  // FLIP for one element or an array. Uses the translate/scale properties, so it composes with the element's own transform.
  // Scaling distorts children and radii: flip boxes, or use MK.morph for rich content.
  MK.flip = (targets, mutate, ease = MK.ease.spatial) => {
    const els = [].concat(targets), red = MK.reduced();
    const first = els.map((e) => e.getBoundingClientRect()); // measured while any earlier flip is still in flight
    els.forEach((e) => e.getAnimations().filter((a) => a.id === 'mk-flip').forEach((a) => a.cancel()));
    mutate();
    return Promise.all(els.map((e, i) => {
      const a = first[i], b = e.getBoundingClientRect();
      if (!a.width || !b.width) return;
      const o = { transformOrigin: '0 0' };
      const kf = red ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ ...o, translate: `${a.left - b.left}px ${a.top - b.top}px`, scale: `${a.width / b.width} ${a.height / b.height}` }, { ...o, translate: '0 0', scale: '1 1' }];
      const an = e.animate(kf, red ? { duration: 150, easing: 'ease-out' } : { duration: ease.ms, easing: ease.easing });
      an.id = 'mk-flip';
      return an.finished.catch(() => {});
    })).then(() => {});
  };

  // Pointer drag with capture. Velocity (px/ms) comes from the last ~80 ms of movement. Returns a disposer.
  // axis 'x' or 'y' locks the other axis and leaves that scroll direction to the browser.
  MK.drag = (el, { axis, onStart, onMove, onEnd } = {}) => {
    el.style.touchAction = axis === 'x' ? 'pan-y' : axis === 'y' ? 'pan-x' : 'none';
    let id = null, x0 = 0, y0 = 0, pts = [];
    const d = (e) => ({ dx: axis === 'y' ? 0 : e.clientX - x0, dy: axis === 'x' ? 0 : e.clientY - y0 });
    const down = (e) => {
      if (id !== null || (e.pointerType === 'mouse' && e.button)) return;
      MK.freeze(el);
      id = e.pointerId; x0 = e.clientX; y0 = e.clientY; pts = [[e.timeStamp, e.clientX, e.clientY]];
      try { el.setPointerCapture(id); } catch { /* synthetic events have no active pointer */ }
      onStart?.(e);
    };
    const move = (e) => {
      if (e.pointerId !== id) return;
      pts.push([e.timeStamp, e.clientX, e.clientY]);
      onMove?.(d(e).dx, d(e).dy, e);
    };
    const up = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      const p0 = pts.find((p) => e.timeStamp - p[0] <= 80) || pts[pts.length - 1], p1 = pts[pts.length - 1], dt = p1[0] - p0[0];
      const vx = dt > 1 && axis !== 'y' ? (p1[1] - p0[1]) / dt : 0, vy = dt > 1 && axis !== 'x' ? (p1[2] - p0[2]) / dt : 0;
      onEnd?.({ ...d(e), vx, vy });
    };
    const ev = [['pointerdown', down], ['pointermove', move], ['pointerup', up], ['pointercancel', up]];
    ev.forEach(([n, f]) => el.addEventListener(n, f));
    return () => ev.forEach(([n, f]) => el.removeEventListener(n, f));
  };

  // Spring on x, y (px), r (deg), s (scale), seeded with the release velocity v (units per ms). The spring is simulated
  // into WAAPI keyframes, so the move is a normal Animation: cancel it (or MK.freeze) to grab it mid-flight.
  MK.fling = (el, { from = {}, to = {}, v = {}, k = 380, zeta = 0.8 } = {}) => {
    if (MK.reduced()) { k = 1600; zeta = 1; v = {}; } // no overshoot, no carried momentum
    const base = { x: 0, y: 0, r: 0, s: 1 }, tol = { x: 0.3, y: 0.3, r: 0.05, s: 0.002 };
    const A = { ...base, ...from }, B = { ...base, ...to }, c = 2 * zeta * Math.sqrt(k), dt = 1 / 240, keys = Object.keys(base);
    const p = { ...A }, w = Object.fromEntries(keys.map((q) => [q, (v[q] || 0) * 1000]));
    const css = () => `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
    const frames = [{ transform: css() }];
    for (let i = 1; i < 720; i++) {
      keys.forEach((q) => { w[q] += (-k * (p[q] - B[q]) - c * w[q]) * dt; p[q] += w[q] * dt; });
      if (i % 4) continue;
      if (keys.every((q) => Math.abs(p[q] - B[q]) < tol[q] && Math.abs(w[q]) < tol[q] * 8)) break;
      frames.push({ transform: css() });
    }
    Object.assign(p, B);
    const end = css();
    frames.push({ transform: end });
    const an = el.animate(frames, { duration: (frames.length * 1000) / 60, easing: 'linear', fill: 'forwards' });
    an.finished.then(() => { el.style.transform = end; an.cancel(); }, () => {}); // a cancelled fling leaves the transform alone
    return an;
  };

  // Perspective tilt that follows the pointer, low-pass smoothed (rAF, see header), spring back on leave.
  // It owns el.style.transform: tilt an inner element if the outer one is thrown. Sets --mx/--my (0-100%) for a highlight.
  // Returns a disposer.
  MK.tilt = (el, { max = 10 } = {}) => {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const pose = () => `perspective(700px) rotateX(${-cy * max}deg) rotateY(${cx * max}deg)`;
    const step = () => {
      cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
      el.style.transform = pose();
      el.style.setProperty('--mx', `${50 + cx * 50}%`); el.style.setProperty('--my', `${50 + cy * 50}%`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const aim = (x, y) => { if (MK.reduced()) return; tx = clamp(x, -1, 1); ty = clamp(y, -1, 1); raf = raf || requestAnimationFrame(step); };
    const move = (e) => { const r = el.getBoundingClientRect(); aim(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1); };
    const leave = () => {
      cancelAnimationFrame(raf); raf = 0;
      const e = MK.ease.fast, from = pose(), cx0 = cx, cy0 = cy;
      tx = ty = cx = cy = 0;
      el.style.transform = '';
      el.style.setProperty('--mx', '50%'); el.style.setProperty('--my', '50%');
      if (!MK.reduced() && Math.abs(cx0) + Math.abs(cy0) > 0.01) el.animate([{ transform: from }, { transform: pose() }], { duration: e.ms, easing: e.easing });
    };
    const ev = [['pointermove', move], ['pointerleave', leave], ['pointerup', leave], ['pointercancel', leave]];
    ev.forEach(([n, f]) => el.addEventListener(n, f));
    el._mkAim = aim;
    return () => { leave(); ev.forEach(([n, f]) => el.removeEventListener(n, f)); delete el._mkAim; };
  };
  // Gyro tilt for el, started by a tap on button (iOS asks for permission inside a user gesture; needs HTTPS, so file:// gets nothing).
  MK.tilt.gyro = (button, el, opts) => {
    const on = (e) => el._mkAim?.((e.gamma || 0) / 30, ((e.beta || 0) - 45) / 30);
    const click = async () => {
      const D = window.DeviceOrientationEvent;
      if (!D || MK.reduced() || (typeof D.requestPermission === 'function' && (await D.requestPermission().catch(() => 'denied')) !== 'granted')) return;
      if (!el._mkAim) MK.tilt(el, opts);
      addEventListener('deviceorientation', on);
    };
    button.addEventListener('click', click);
    return () => { button.removeEventListener('click', click); removeEventListener('deviceorientation', on); };
  };

  // Digit roll for a figure in tabular numerals: only the digits that changed slide. text is the whole formatted string.
  // A different shape (where the digits and the other characters sit) rebuilds the figure with a fade. The element gets role=img and aria-label = text.
  MK.roll = (el, text) => {
    text = String(text);
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', text);
    if (el.dataset.mkText === text) return;
    const red = MK.reduced(), e = MK.ease.fast;
    const shape = text.replace(/\d/g, '0'); // same length is not same layout: '1h 20m' vs '12 min'
    if (el.dataset.mkLen !== shape) {
      el.dataset.mkLen = shape;
      el.style.cssText += ';display:inline-flex;height:1em;line-height:1;overflow:hidden;font-variant-numeric:tabular-nums';
      el.innerHTML = [...text].map((ch) => /\d/.test(ch)
        ? '<span aria-hidden="true" style="display:block;height:1em;overflow:hidden"><span class="mk-col" style="display:flex;flex-direction:column">'
          + [...'0123456789'].map((n) => `<i style="display:block;height:1em;font-style:normal">${n}</i>`).join('') + '</span></span>'
        : `<span aria-hidden="true">${ch}</span>`).join('');
      el.querySelectorAll('.mk-col').forEach((c) => { c.dataset.d = 0; });
      if (el.dataset.mkText !== undefined) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: MK.out });
    }
    let k = 0;
    el.querySelectorAll('.mk-col').forEach((col) => {
      while (k < text.length && !/\d/.test(text[k])) k++;
      const to = +text[k++], from = +col.dataset.d, at = (n) => `translateY(${-n}em)`;
      col.style.transform = at(to); col.dataset.d = to;
      if (from !== to && !red && el.dataset.mkText !== undefined) col.animate([{ transform: at(from) }, { transform: at(to) }], { duration: e.ms, easing: e.easing });
    });
    if (red && el.dataset.mkText !== undefined) el.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 150, easing: MK.out });
    el.dataset.mkText = text;
  };

  // navigator.vibrate patterns. iOS Safari has no vibrate: this is a silent no-op there, so never rely on it alone.
  const PATTERNS = { selection: 6, light: 10, medium: 20, success: [10, 40, 10], warning: [20, 60, 20], error: [30, 50, 30, 50, 30] };
  MK.haptic = (kind = 'light') => { try { navigator.vibrate?.(PATTERNS[kind] ?? 10); } catch { /* blocked before a user gesture */ } };
})();
