// ── Voyage motion system ───────────────────────────────────────────────
// One place for how the app moves, following Apple's fluid-interface rules:
//   • springs (damping ratio + response), never fixed-duration curves
//   • motion starts from what's on screen and can be interrupted
//   • gestures track the finger 1:1 and hand their velocity to the spring
//   • enter/exit share a path; reduced-motion gets gentle cross-fades
//
// Exposes on window:
//   vSpring(damping, response) → { duration, easing } for WAAPI / CSS
//   vSpringTo({...})           → rAF spring with initial velocity (gestures)
//   vAnimate(el, frames, opts) → Element.animate with a spring curve
//   haptic()                   → light tap on supporting phones
//   CountUp                    → numbers that roll to their new value
//   ScreenStage                → screen layers + transitions + swipe-back
//   Overlay                    → full-screen modal that slides up / drags down

const vReduce = () => !document.documentElement.classList.contains('motion-full')
  && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
window.vReduce = vReduce;
const vProject = (v, d = 0.998) => (v / 1000) * d / (1 - d);   // Apple's momentum projection

// ── Springs ────────────────────────────────────────────────────────────
const _springCache = {};
const _linearOK = !!(window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)'));
function vSpring(damping = 1, response = 0.4) {
  const key = damping + '|' + response;
  if (_springCache[key]) return _springCache[key];
  const k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * damping / response;
  let x = 0, v = 0, t = 0;
  const pts = [0], h = 1 / 240, frame = 1 / 60;
  let nextSample = frame;
  while (t < 2.5) {
    v += (k * (1 - x) - c * v) * h; x += v * h; t += h;
    if (t >= nextSample) { pts.push(x); nextSample += frame; }
    if (t > 0.08 && Math.abs(1 - x) < 0.0015 && Math.abs(v) < 0.02) break;
  }
  pts.push(1);
  const out = {
    duration: Math.round(t * 1000),
    easing: _linearOK ? `linear(${pts.map((p) => +p.toFixed(4)).join(', ')})` : 'cubic-bezier(.2,.9,.25,1)',
    pts,
  };
  return (_springCache[key] = out);
}
// Value of the spring curve at progress p ∈ [0,1] (for JS-driven numbers).
function vCurve(sp, p) {
  if (p >= 1) return 1;
  const f = p * (sp.pts.length - 1), i = Math.floor(f);
  return sp.pts[i] + (sp.pts[i + 1] - sp.pts[i]) * (f - i);
}
function vAnimate(el, frames, { damping = 1, response = 0.4, delay = 0, fill = 'both' } = {}) {
  const sp = vSpring(damping, response);
  return el.animate(frames, { duration: sp.duration, easing: sp.easing, delay, fill });
}
// Physical spring with an initial velocity — what a released finger needs.
function vSpringTo({ from, to, velocity = 0, damping = 1, response = 0.35, onUpdate, onDone }) {
  const k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * damping / response;
  let x = from, v = velocity, last = performance.now(), raf = 0, dead = false;
  const step = (now) => {
    if (dead) return;
    let dt = Math.min(0.064, (now - last) / 1000); last = now;
    while (dt > 0) { const h = Math.min(dt, 1 / 240); v += (-k * (x - to) - c * v) * h; x += v * h; dt -= h; }
    if (Math.abs(x - to) < 0.5 && Math.abs(v) < 8) { onUpdate && onUpdate(to, 0); dead = true; onDone && onDone(); return; }
    onUpdate && onUpdate(x, v);
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => { dead = true; cancelAnimationFrame(raf); };
}

// ── Haptics ────────────────────────────────────────────────────────────
// Android: Vibration API. iPhone (iOS 18+): Safari plays the system tick
// when a `switch` checkbox toggles, so we toggle a hidden one. Harmless
// where unsupported. Used sparingly: commits, snaps, success/error.
let _hLabel = null;
function haptic() {
  try {
    if (navigator.vibrate) { navigator.vibrate(8); return; }
    if (!_hLabel) {
      const id = 'v-haptic-switch';
      const input = document.createElement('input');
      input.type = 'checkbox'; input.id = id; input.setAttribute('switch', '');
      input.setAttribute('aria-hidden', 'true'); input.tabIndex = -1;
      const hide = 'position:fixed;left:-200px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;';
      input.style.cssText = hide;
      _hLabel = document.createElement('label');
      _hLabel.htmlFor = id; _hLabel.style.cssText = hide; _hLabel.setAttribute('aria-hidden', 'true');
      document.body.appendChild(input); document.body.appendChild(_hLabel);
    }
    _hLabel.click();
  } catch (_) {}
}

// Progressive resistance past an edge (Apple's rubber-band).
const vRubber = (over, dim, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over));
Object.assign(window, { vSpring, vCurve, vAnimate, vSpringTo, vProject, vRubber, haptic });

// ── CountUp: numbers roll to their new value ───────────────────────────
// First time an `id` appears this session it counts up from 0; after that
// it starts from the last value it showed — so logging an expense and
// coming back shows the budget visibly move (cause → effect).
window.__vCount = window.__vCount || {};
function CountUp({ id, value, format, className, style }) {
  const target = Number(value) || 0;
  const seen = id != null ? window.__vCount[id] : undefined;
  // Counts up from zero each time it appears (the screen feels alive);
  // while mounted, later changes roll from the current value.
  const startRef = React.useRef(vReduce() ? target : 0);
  const curRef = React.useRef(startRef.current);
  const fmtRef = React.useRef(format); fmtRef.current = format;
  const spanRef = React.useRef(null);
  React.useEffect(() => {
    const el = spanRef.current;
    const from = curRef.current;
    if (id != null) window.__vCount[id] = target;
    if (!el || vReduce() || Math.abs(target - from) < 0.005) {
      curRef.current = target; if (el) el.textContent = fmtRef.current(target); return;
    }
    const sp = vSpring(1, 0.75);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / sp.duration);
      const x = from + (target - from) * vCurve(sp, p);
      curRef.current = x;
      el.textContent = p < 1 ? String(fmtRef.current(x)).replace(/\.\d+(?=\D*$)/, '') : fmtRef.current(target);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <span ref={spanRef} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{format(curRef.current)}</span>;
}
window.CountUp = CountUp;

// ── Screen stage: layers, transitions, swipe-back ──────────────────────
const routeKey = (r) => `${r.scope}:${r.name}:${r.tripId || ''}`;
const TRIP_TABS = ['hub', 'plan', 'budget', 'docs'];
const APP_TABS = ['trips', 'appSettings'];
function parentOf(r) {
  if (!r) return null;
  if (r.scope === 'trip') {
    if (r.name === 'analytics') return { scope: 'trip', name: 'budget', tripId: r.tripId };
    return r.name === 'hub' ? { scope: 'app', name: 'trips' } : { scope: 'trip', name: 'hub', tripId: r.tripId };
  }
  if (r.scope === 'app' && r.name === 'insights') return { scope: 'app', name: 'trips' };
  return null;
}
const sameRoute = (a, b) => !!(a && b) && routeKey(a) === routeKey(b);
function tabIndex(r) {
  const list = r.scope === 'trip' ? TRIP_TABS : r.scope === 'app' ? APP_TABS : [];
  return list.indexOf(r.name === 'analytics' ? 'budget' : r.name);
}
function kindOf(from, to) {
  const intent = window.__navIntent; window.__navIntent = null;
  if (!from) return 'none';
  if (from.scope === 'auth' || to.scope === 'auth' || from.name === 'onboarding' || to.name === 'onboarding') return 'fade';
  if (intent === 'tab' && from.scope === to.scope) return 'tab';
  if (sameRoute(parentOf(from), to)) return 'pop';
  if (sameRoute(parentOf(to), from)) return 'push';
  if (from.scope === to.scope && tabIndex(from) >= 0 && tabIndex(to) >= 0) return 'tab';
  return 'fade';
}
// Current on-screen transform/opacity (so an interrupted move continues
// from where it visibly is, not from its target).
function liveState(el) {
  const cs = getComputedStyle(el);
  return { transform: cs.transform === 'none' ? 'translate3d(0,0,0)' : cs.transform, opacity: cs.opacity };
}
function runTransition(kind, inEl, outEl, fromIdx, toIdx) {
  const s = window.isRTL ? -1 : 1;
  const W = inEl.offsetWidth || window.innerWidth;
  const outFrom = liveState(outEl);
  outEl.getAnimations().forEach((a) => a.cancel());
  const anims = [];
  if (vReduce()) {
    anims.push(inEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out', fill: 'both' }));
    anims.push(outEl.animate([{ opacity: outFrom.opacity }, { opacity: 0 }], { duration: 160, easing: 'ease-out', fill: 'both' }));
  } else if (kind === 'push') {
    inEl.classList.add('v-elevated');
    anims.push(vAnimate(inEl, [{ transform: `translate3d(${s * W}px,0,0)` }, { transform: 'translate3d(0,0,0)' }], { response: 0.44 }));
    anims.push(vAnimate(outEl, [outFrom, { transform: `translate3d(${-s * W * 0.3}px,0,0)`, opacity: 0.92 }], { response: 0.44 }));
  } else if (kind === 'pop') {
    outEl.classList.add('v-elevated');
    anims.push(vAnimate(inEl, [{ transform: `translate3d(${-s * W * 0.3}px,0,0)`, opacity: 0.92 }, { transform: 'translate3d(0,0,0)', opacity: 1 }], { response: 0.4 }));
    anims.push(vAnimate(outEl, [outFrom, { transform: `translate3d(${s * W}px,0,0)` }], { response: 0.4 }));
  } else if (kind === 'tab') {
    const dir = (Math.sign(toIdx - fromIdx) || 1) * s;
    anims.push(vAnimate(inEl, [{ opacity: 0, transform: `translate3d(${dir * 24}px,0,0)` }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { response: 0.38, delay: 70 }));
    anims.push(vAnimate(outEl, [outFrom, { opacity: 0, transform: `translate3d(${-dir * 18}px,0,0)` }], { response: 0.18 }));
  } else {
    anims.push(vAnimate(inEl, [{ opacity: 0, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }], { response: 0.4 }));
    anims.push(vAnimate(outEl, [outFrom, { opacity: 0 }], { response: 0.3 }));
  }
  return Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
    anims[0] && anims[0].cancel();            // incoming: drop the fill (its end state = natural)
    inEl.classList.remove('v-elevated');
  });
}

function ScreenStage({ route, render, onNavigate, scrollerRef, dimmed, children }) {
  const [layers, setLayers] = React.useState(() => [{ key: routeKey(route), route }]);
  const els = React.useRef({});
  const scrollers = React.useRef({});
  const stageRef = React.useRef(null);
  const ranRef = React.useRef(null);
  const swipeRef = React.useRef({ committing: false });
  const layersRef = React.useRef(layers); layersRef.current = layers;
  // A screen on its way out is frozen as it last looked: re-rendering it
  // mid-slide could show data that changed underneath (e.g. another trip).
  const nodes = React.useRef({});
  const nodeFor = (l) => {
    if (l.leaving && nodes.current[l.key]) return nodes.current[l.key];
    return (nodes.current[l.key] = render(l.route));
  };
  Object.keys(nodes.current).forEach((k) => { if (!layers.some((l) => l.key === k)) delete nodes.current[k]; });

  // Route changed → add the new layer above (or reveal the swiped-to parent).
  React.useLayoutEffect(() => {
    const k = routeKey(route);
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top.key === k) return top.route === route ? prev : prev.map((l) => (l.key === k ? { ...l, route } : l));
      const under = prev.find((l) => l.key === k && l.under);
      if (under) return [{ key: k, route, calm: true }];
      const kind = kindOf(top.route, route);
      if (kind === 'none') return [{ key: k, route }];
      return [{ ...top, leaving: true, under: false, kind }, {
        key: k, route, kind, id: Math.random(), fromIdx: tabIndex(top.route), toIdx: tabIndex(route),
        calm: kind === 'pop',
      }];
    });
  }, [routeKey(route)]);

  // Run the transition for a freshly added top layer.
  React.useLayoutEffect(() => {
    const top = layers[layers.length - 1];
    if (!top || !top.id || ranRef.current === top.id) return;
    ranRef.current = top.id;
    const out = layers.find((l) => l.leaving);
    const inEl = els.current[top.key], outEl = out && els.current[out.key];
    const done = () => setLayers((prev) => (prev[prev.length - 1].id === top.id
      ? prev.filter((l) => !l.leaving).map((l) => (l.key === top.key ? { key: l.key, route: l.route, calm: l.calm } : l))
      : prev));
    if (!inEl || !outEl) { done(); return; }
    runTransition(top.kind, inEl, outEl, top.fromIdx, top.toIdx).then(done);
  }, [layers]);

  // The top layer's scroller is "the" scroller (scroll-to-top, parallax).
  const top = layers[layers.length - 1];
  React.useEffect(() => {
    const sc = scrollers.current[top.key] || null;
    window.__activeScroller = sc;
    if (scrollerRef) scrollerRef.current = sc;
  });

  // ── Interactive swipe-back from the leading edge ──
  React.useEffect(() => {
    const stage = stageRef.current; if (!stage) return;
    const s = window.isRTL ? -1 : 1;
    let g = null;   // gesture state
    const W = () => stage.offsetWidth || window.innerWidth;
    const topEl = () => { const L = layersRef.current; const t = L[L.length - 1]; return t && els.current[t.key]; };
    const parentEl = () => { const p = layersRef.current.find((l) => l.under); return p && els.current[p.key]; };
    const apply = (p) => {
      const w = W(), te = topEl(), pe = parentEl();
      if (te) te.style.transform = `translate3d(${s * p}px,0,0)`;
      if (pe) { pe.style.transform = `translate3d(${-s * w * 0.3 * (1 - p / w)}px,0,0)`; pe.style.opacity = String(0.92 + 0.08 * (p / w)); }
    };
    const ts = (e) => {
      if (g || swipeRef.current.committing) return;
      const L = layersRef.current;
      if (L.length !== 1) return;                               // mid-transition
      const parent = parentOf(L[0].route);
      if (!parent) return;
      const te = topEl(); if (!te || !te.contains(e.target)) return;   // sheets/overlays sit outside
      const r = stage.getBoundingClientRect();
      const x = e.touches[0].clientX - r.left;
      const edge = s > 0 ? x < 26 : x > r.width - 26;
      if (!edge) return;
      g = { x0: e.touches[0].clientX, y0: e.touches[0].clientY, active: false, parent, p: 0, hist: [] };
    };
    const tm = (e) => {
      if (!g) return;
      const t = e.touches[0];
      const dx = (t.clientX - g.x0) * s, dy = t.clientY - g.y0;
      if (!g.active) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { g = null; return; }   // it's a scroll
        if (dx < 10) return;
        g.active = true; g.x0 = t.clientX;
        const pk = routeKey(g.parent);
        setLayers((prev) => (prev.some((l) => l.key === pk) ? prev : [{ key: pk, route: g.parent, under: true, calm: true }, ...prev]));
        topEl() && topEl().classList.add('v-elevated');
      }
      e.preventDefault();
      g.p = Math.max(0, (t.clientX - g.x0) * s);
      const now = performance.now();
      g.hist.push({ p: g.p, t: now }); while (g.hist.length > 2 && now - g.hist[0].t > 100) g.hist.shift();
      apply(g.p);
    };
    const te = () => {
      if (!g) return;
      const G = g; g = null;
      if (!G.active) return;
      const a = G.hist[0], b = G.hist[G.hist.length - 1];
      const v = a && b && b.t > a.t ? ((b.p - a.p) / (b.t - a.t)) * 1000 : 0;
      const w = W();
      const commit = (G.p + vProject(v) > w * 0.5 && v > -300) || v > 900;
      swipeRef.current.committing = true;
      vSpringTo({
        from: G.p, to: commit ? w : 0, velocity: v, damping: 1, response: 0.32,
        onUpdate: (p) => apply(p),
        onDone: () => {
          swipeRef.current.committing = false;
          const pe = parentEl(), tEl = topEl();
          if (commit) {
            haptic();
            if (pe) { pe.style.transform = ''; pe.style.opacity = ''; }
            onNavigate(G.parent);
          } else {
            if (tEl) { tEl.style.transform = ''; tEl.classList.remove('v-elevated'); }
            setLayers((prev) => prev.filter((l) => !l.under));
          }
        },
      });
    };
    stage.addEventListener('touchstart', ts, { passive: true });
    stage.addEventListener('touchmove', tm, { passive: false });
    stage.addEventListener('touchend', te);
    stage.addEventListener('touchcancel', te);
    return () => {
      stage.removeEventListener('touchstart', ts); stage.removeEventListener('touchmove', tm);
      stage.removeEventListener('touchend', te); stage.removeEventListener('touchcancel', te);
    };
  }, [onNavigate]);

  const recede = vSpring(1, 0.42);
  const zOf = (l) => (l.under ? 1 : l.leaving ? (l.kind === 'pop' ? 3 : 1) : 2);
  return (
    <div ref={stageRef} style={{
      position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--cream)',
      transform: dimmed ? 'scale(0.93)' : 'scale(1)', borderRadius: dimmed ? 18 : 0,
      transition: `transform ${recede.duration}ms ${recede.easing}, border-radius ${recede.duration}ms ${recede.easing}`,
    }}>
      {layers.map((l) => (
        <div key={l.key}
          ref={(el) => { if (el) els.current[l.key] = el; else delete els.current[l.key]; }}
          aria-hidden={l.leaving || l.under ? 'true' : undefined}
          style={{
            position: 'absolute', inset: 0, zIndex: zOf(l), background: 'var(--cream)',
            pointerEvents: l.leaving || l.under ? 'none' : 'auto',
          }}>
          <div
            ref={(el) => { if (el) scrollers.current[l.key] = el; else delete scrollers.current[l.key]; }}
            className={'no-scrollbar v-screen' + (l.calm ? ' v-calm' : '')}
            style={{
              position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain',
            }}>
            {nodeFor(l)}
          </div>
        </div>
      ))}
      {children}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 70, background: '#000', pointerEvents: 'none',
        opacity: dimmed ? 0.28 : 0, transition: `opacity ${recede.duration}ms ease`,
      }} />
    </div>
  );
}
window.ScreenStage = ScreenStage;

// ── Overlay: full-screen modal (doc detail, add document, search…) ─────
// Slides up on a spring, slides back down the same path, and can be
// dragged down to dismiss when scrolled to the top.
function Overlay({ open, onClose, z = 85, dismissible = true, children }) {
  const [mounted, setMounted] = React.useState(open);
  const ref = React.useRef(null);
  const kids = React.useRef(children); if (open) kids.current = children;
  const st = React.useRef({ y: 0, v: 0, H: 1, cancel: null }).current;
  const closeRef = React.useRef(onClose); closeRef.current = onClose;
  // At rest the transform is dropped: a transformed box is the containing
  // block for position:fixed children (a form's save bar, the photo
  // cropper), which would then ride along with the scrolled content
  // instead of staying on screen.
  const set = (y, v) => {
    st.y = y; if (v != null) st.v = v;
    const el = ref.current; if (!el) return;
    if (y === 0) { el.style.transform = 'none'; el.style.willChange = 'auto'; }
    else { el.style.transform = `translate3d(0,${y}px,0)`; el.style.willChange = 'transform'; }
  };
  const stop = () => { if (st.cancel) st.cancel(); st.cancel = null; };

  React.useEffect(() => {
    if (open) { if (!mounted) setMounted(true); else if (st.y > 0) { stop(); st.cancel = vSpringTo({ from: st.y, to: 0, velocity: st.v, response: 0.42, onUpdate: set }); } return; }
    if (!mounted) return;
    stop();
    if (vReduce()) { setMounted(false); return; }
    st.cancel = vSpringTo({ from: st.y, to: st.H, velocity: st.v, damping: 1, response: 0.34, onUpdate: set, onDone: () => { st.v = 0; setMounted(false); } });
  }, [open]);
  React.useLayoutEffect(() => {
    if (!mounted || !open || !ref.current) return;
    st.H = ref.current.offsetHeight || window.innerHeight;
    if (vReduce()) { set(0); return; }
    set(st.H, 0);
    st.cancel = vSpringTo({ from: st.H, to: 0, damping: 1, response: 0.42, onUpdate: set });
  }, [mounted]);
  React.useEffect(() => () => stop(), []);

  React.useEffect(() => {
    const el = ref.current; if (!el || !mounted || !dismissible) return;
    let g = null;
    const ts = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el.scrollTop > 0) return;
      g = { y0: e.touches[0].clientY, x0: e.touches[0].clientX, active: false, hist: [] };
    };
    const tm = (e) => {
      if (!g) return;
      const t = e.touches[0], dy = t.clientY - g.y0, dx = t.clientX - g.x0;
      if (!g.active) {
        if (dy < 0 || Math.abs(dx) > Math.abs(dy) || el.scrollTop > 0) { if (Math.abs(dy) > 6 || Math.abs(dx) > 6) g = null; return; }
        if (dy < 10) return;
        g.active = true; g.y0 = t.clientY; stop();
      }
      e.preventDefault();
      const y = Math.max(0, t.clientY - g.y0);
      const now = performance.now();
      g.hist.push({ y, t: now }); while (g.hist.length > 2 && now - g.hist[0].t > 100) g.hist.shift();
      set(y);
    };
    const te = () => {
      if (!g) return; const G = g; g = null; if (!G.active) return;
      const a = G.hist[0], b = G.hist[G.hist.length - 1];
      const v = a && b && b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0;
      if (st.y + vProject(v) > st.H * 0.4 || v > 900) { st.v = v; haptic(); closeRef.current && closeRef.current(); }
      else st.cancel = vSpringTo({ from: st.y, to: 0, velocity: v, damping: 0.85, response: 0.32, onUpdate: set });
    };
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', te); el.addEventListener('touchcancel', te);
    return () => { el.removeEventListener('touchstart', ts); el.removeEventListener('touchmove', tm); el.removeEventListener('touchend', te); el.removeEventListener('touchcancel', te); };
  }, [mounted, dismissible]);

  if (!mounted) return null;
  return (
    <div ref={ref} className="no-scrollbar" style={{
      position: 'absolute', inset: 0, zIndex: z, overflowY: 'auto', overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'none', background: 'var(--cream)',
      boxShadow: '0 -12px 40px rgba(0,0,0,0.28)', transform: 'translate3d(0,100%,0)', willChange: 'transform',
      pointerEvents: open ? 'auto' : 'none',
    }}>{open ? children : kids.current}</div>
  );
}
window.Overlay = Overlay;
