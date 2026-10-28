// Trip recap — the trip as a short film.
//
// One continuous piece, not a deck of cards: the trip's cover stays behind
// every scene (sharp at the start and the end, blurred and dark in between)
// and over it the trip arrives in a calm, editorial style — light figures
// that count up, lines that draw, a ring that fills — over a soft score.
// No stickers, no cartoons: type, lines and timing.
//   1 the title over the cover
//   2 the trip in numbers — days, people, places, nights
//   3 what you spent, counted up, and the budget as one line
//   4 day by day — the spend drawn as a line, the biggest day called out
//   5 where it went — a ring, category by category
//   6 the biggest single expense
//   7 who paid (or whose card) — the lead, then the rest
//   8 getting there and staying — the flight's arc, the nights as a strip
//   9 the plan, rolling like end credits
//  10 a poster to share
// Everything sits inside the safe area and sizes itself to the screen
// (container units), so nothing is cut off on a small or a tall phone.
// Tap the far side to skip, the near side to go back, hold to pause, swipe
// down to close.   window.openRecap(tripId?) · <RecapHost/>

const RC_CSS = `
.rc-root {
  container-type: size;
  --rc-sat: env(safe-area-inset-top, 0px);
  --rc-sab: env(safe-area-inset-bottom, 0px);
  --rc-ease: cubic-bezier(.16, 1, .3, 1);
  --rc-fg: #f5f2ec;
  --rc-fg2: rgba(245, 242, 236, .72);
  --rc-fg3: rgba(245, 242, 236, .48);
  --rc-line: rgba(245, 242, 236, .16);
  --rc-good: #94d8ae;
  --rc-bad: #ff9c87;
  font-family: 'Geist', 'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif;
  color: var(--rc-fg);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}
@keyframes rc-in { from { opacity: 0; transform: translate3d(0, .42em, 0); filter: blur(9px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes rc-fade { from { opacity: 0; transform: translate3d(0, 12px, 0); } to { opacity: 1; transform: none; } }
@keyframes rc-op { from { opacity: 0; } to { opacity: 1; } }
@keyframes rc-grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rc-grow-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes rc-scene-in { from { opacity: 0; transform: translate3d(0, 16px, 0); } to { opacity: 1; transform: none; } }
@keyframes rc-scene-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translate3d(0, -12px, 0); } }
@keyframes rc-burns { from { transform: scale(1.16) translate3d(1.2%, 1.4%, 0); } to { transform: scale(1.03) translate3d(-1%, -1%, 0); } }
@keyframes rc-drift { from { transform: translate3d(-3%, -2%, 0) scale(1); } to { transform: translate3d(3%, 2.5%, 0) scale(1.08); } }
@keyframes rc-glow { from { transform: translate3d(-7%, -5%, 0) scale(1); } to { transform: translate3d(7%, 6%, 0) scale(1.12); } }
@keyframes rc-grain { 0%{transform:translate(0,0)} 20%{transform:translate(-7%,-9%)} 40%{transform:translate(-13%,5%)} 60%{transform:translate(6%,-15%)} 80%{transform:translate(-4%,14%)} 100%{transform:translate(0,0)} }
@keyframes rc-ring { from { opacity: .8; transform: scale(.5); } to { opacity: 0; transform: scale(3); } }
@keyframes rc-unveil { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
.rc-w { display: inline-block; animation: rc-in 1000ms var(--rc-ease) both; }
.rc-fade { animation: rc-fade 900ms var(--rc-ease) both; }
.rc-op { animation: rc-op 900ms ease both; }
.rc-stage {
  position: absolute; inset: 0; box-sizing: border-box; display: flex; flex-direction: column;
  padding: calc(var(--rc-sat) + 80px) 26px calc(var(--rc-sab) + 30px);
}
.rc-fill { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: center; }
.rc-eye {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  font-size: 12px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: var(--rc-fg2);
  animation: rc-fade 900ms var(--rc-ease) both;
}
.rc-root[dir="rtl"] .rc-eye { font-size: 15px; letter-spacing: 0; text-transform: none; }
.rc-eye i {
  display: block; width: 22px; height: 1.5px; border-radius: 2px; background: var(--rc-accent);
  transform-origin: 0 50%; animation: rc-grow-x 1000ms var(--rc-ease) both; animation-delay: inherit;
}
.rc-root[dir="rtl"] .rc-eye i { transform-origin: 100% 50%; }
.rc-title { font-family: 'Instrument Serif', 'Markazi Text', Georgia, serif; font-style: italic; font-weight: 400; line-height: 1.02; letter-spacing: -0.012em; }
.rc-root[dir="rtl"] .rc-title { font-family: 'Markazi Text', 'Instrument Serif', Georgia, serif; font-style: normal; font-weight: 500; line-height: 1.16; letter-spacing: 0; }
.rc-hero { font-family: 'Geist', system-ui, sans-serif; font-weight: 300; line-height: 1; letter-spacing: -0.045em; white-space: nowrap; }
.rc-h2 { font-weight: 500; line-height: 1.28; }
.rc-root[dir="ltr"] .rc-h2 { letter-spacing: -0.015em; }
.rc-body { font-size: 15px; line-height: 1.6; color: var(--rc-fg2); }
.rc-small { font-size: 12.5px; line-height: 1.5; color: var(--rc-fg3); }
.rc-num { font-family: 'Geist', system-ui, sans-serif; font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: isolate; }
.rc-rule { height: 1px; background: var(--rc-line); transform-origin: 0 50%; animation: rc-grow-x 1200ms var(--rc-ease) both; }
.rc-root[dir="rtl"] .rc-rule { transform-origin: 100% 50%; }
.rc-bar { display: block; height: 100%; border-radius: 3px; transform-origin: 0 50%; animation: rc-grow-x 1400ms var(--rc-ease) both; }
.rc-root[dir="rtl"] .rc-bar { transform-origin: 100% 50%; }
.rc-ell { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rc-btn {
  min-height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: inherit; font-size: 15px; font-weight: 600;
}
.rc-glass { background: rgba(255,255,255,.12); color: #fff; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 0 0 .5px rgba(255,255,255,.2); }
.rc-paused, .rc-paused * { animation-play-state: paused !important; }
/* Reduce Motion: the film still plays — fades, counts and lines drawing —
   only the movement goes (words rising, scenes sliding, the camera drift). */
.rc-reduce .rc-w, .rc-reduce .rc-fade, .rc-reduce .rc-in { animation-name: rc-op !important; }
.rc-reduce .rc-out { animation-name: rc-unveil !important; }
.rc-reduce .rc-loop { animation: none !important; }
`;

// ── Small helpers ──────────────────────────────────────────────────
const _rcClamp = (x, a, b) => Math.max(a, Math.min(b, x));
const _rcOut = (p) => 1 - Math.pow(1 - p, 4);
const _rcInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const _rcCatName = (k) => window.CAT_META?.[k]?.[window.isRTL ? 'label_ar' : 'label_en'] || (window.catLabel ? window.catLabel(k) : k);
// The categories in the app's own hues, lifted a little for a dark screen.
const RC_CAT = { culture: '#5f9ef2', lodging: '#ef8352', transit: '#3dc395', food: '#efb444', shopping: '#ec90b5', wellness: '#978cec', misc: '#a8a39a' };
const rcCatColor = (k) => RC_CAT[k] || 'rgba(245,242,236,.55)';
// One accent per film, taken from the trip's cover.
const RC_ACCENT = { kyoto: '#efab97', lisbon: '#f1bc7e', oaxaca: '#f49f64', lofoten: '#93b8ff', patagon: '#82d1ca' };

// Counted words the way people say them: "ليلة واحدة", "ليلتين", "3 ليالٍ", "11 ليلة".
const RC_WORDS = {
  day:     { ar: ['يوم', 'يومين', 'أيام', 'يوم'], one: 'واحد', en: ['day', 'days'] },
  night:   { ar: ['ليلة', 'ليلتين', 'ليالٍ', 'ليلة'], one: 'واحدة', en: ['night', 'nights'] },
  place:   { ar: ['مكان', 'مكانين', 'أماكن', 'مكان'], one: 'واحد', en: ['place', 'places'] },
  person:  { ar: ['مسافر', 'مسافرين', 'مسافرين', 'مسافر'], one: 'واحد', en: ['traveller', 'travellers'] },
  flight:  { ar: ['رحلة طيران', 'رحلتين طيران', 'رحلات طيران', 'رحلة طيران'], one: 'واحدة', en: ['flight', 'flights'] },
  payment: { ar: ['عملية دفع', 'عمليتين دفع', 'عمليات دفع', 'عملية دفع'], one: 'واحدة', en: ['payment', 'payments'] },
  country: { ar: ['دولة', 'دولتين', 'دول', 'دولة'], one: 'واحدة', en: ['country', 'countries'] },
  stay:    { ar: ['فندق', 'فندقين', 'فنادق', 'فندق'], one: 'واحد', en: ['stay', 'stays'] },
};
// Just the noun that goes after a number shown on its own ("أيام" next to a big 9).
const rcNoun = (n, kind, ar) => {
  const w = RC_WORDS[kind];
  if (!ar) return n === 1 ? w.en[0] : w.en[1];
  return n === 1 ? w.ar[0] : n === 2 ? w.ar[1] : n <= 10 ? w.ar[2] : w.ar[3];
};
// The whole phrase ("ليلة واحدة", "ليلتين", "3 ليالٍ").
const rcCount = (n, kind, ar) => {
  const w = RC_WORDS[kind];
  if (!ar) return `${n} ${n === 1 ? w.en[0] : w.en[1]}`;
  if (n === 1) return `${w.ar[0]} ${w.one}`;
  if (n === 2) return w.ar[1];
  return `${n} ${n <= 10 ? w.ar[2] : w.ar[3]}`;
};
const _rcCompact = (usd) => {
  const v = (usd || 0) * (window.fxRate ? window.fxRate(window.TRIP?.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD') : 1);
  return v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(Math.round(v));
};
const _rcFirst = (mm) => ((mm && mm.name) || '').trim().split(/\s+/)[0] || '?';

// Everything the film needs, worked out once.
function recapData() {
  const ar = window.isRTL;
  const trip = window.TRIP || {};
  const expenses = window.EXPENSES || [];
  const m = window.tripModel(trip, expenses);
  const fmt = (usd) => window.fmtMoney(usd, { in: 'home' });
  const members = window.MEMBERS || [];
  const wallets = !!window.walletsOf?.(trip);
  const cats = Object.entries(m.byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const biggest = expenses.slice().sort((a, b) => (b.usd || 0) - (a.usd || 0))[0] || null;
  // Who paid — with cards, what went out in cash is the cash's, not whoever logged it.
  const payers = members
    .map((mm) => ({ m: mm, v: expenses.filter((e) => e.who === mm.id && !(wallets && e.cash)).reduce((s, e) => s + (e.usd || 0), 0) }))
    .filter((x) => x.v > 0);
  const cashPaid = wallets ? expenses.filter((e) => e.cash).reduce((s, e) => s + (e.usd || 0), 0) : 0;
  if (cashPaid > 0) payers.push({ m: { id: 'cash', cash: true, name: ar ? 'الكاش' : 'Cash' }, v: cashPaid });
  payers.sort((a, b) => b.v - a.v);
  const docs = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((x) => x && (!x.ownerUserId || x.ownerUserId === window.currentUserId));
  const day = (v) => String(v || '').slice(0, 10);
  const flights = docs.filter((x) => x.category === 'flights' && x.details?.dep_airport && x.details?.arr_airport)
    .sort((a, b) => String(a.details.dep_at || '').localeCompare(String(b.details.dep_at || '')));
  const nightsOf = (x) => {
    const a = x.details?.check_in_at, b = x.details?.check_out_at;
    return a && b ? Math.max(0, Math.round((new Date(day(b)) - new Date(day(a))) / 86400000)) : 0;
  };
  const stays = docs.filter((x) => x.category === 'lodging');
  const stayList = stays.map((x) => ({ id: x.id, title: x.title || '', nights: nightsOf(x), at: day(x.details?.check_in_at) }))
    .filter((x) => x.nights > 0).sort((a, b) => a.at.localeCompare(b.at));
  const nights = stayList.reduce((s, x) => s + x.nights, 0);
  const plan = (window.ITINERARY || []).slice()
    .sort((a, b) => String(a.dayDate || '').localeCompare(String(b.dayDate || '')) || String(a.startTime || '').localeCompare(String(b.startTime || '')));
  const daysShown = m.ended ? m.totalDays : (m.daysSoFar || 0);
  const dayWord = (n) => rcCount(n, 'day', ar);
  const peopleWord = (n) => rcCount(n, 'person', ar);
  const cur = (trip.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD').toUpperCase();
  const curWord = ar ? ({ SAR: 'ريال', AED: 'درهم', KWD: 'دينار', BHD: 'دينار', USD: 'دولار', EUR: 'يورو', GBP: 'جنيه', EGP: 'جنيه', TRY: 'ليرة', JPY: 'ين', MAD: 'درهم', CHF: 'فرنك', INR: 'روبية', IDR: 'روبية' }[cur] || cur) : cur;
  let curName = curWord;
  try { curName = new Intl.DisplayNames([ar ? 'ar' : 'en'], { type: 'currency' }).of(cur) || curWord; } catch (_) {}
  const num = (usd) => (String(fmt(usd)).match(/[\d.,]+/) || ['0'])[0];
  const photo = !!(trip.coverUrl || trip.coverImageUrl);
  const accent = photo ? '#f0b680' : (RC_ACCENT[trip.cover] || RC_ACCENT.kyoto);
  return { ar, trip, expenses, m, fmt, num, cur, curWord, curName, members, wallets, cats, biggest, payers, docs, flights, stays, stayList, nights, plan, daysShown, dayWord, peopleWord, photo, accent };
}

// The figures for "the trip in numbers" — up to four, in this order.
function rcFigures(d) {
  const { ar, members, plan, nights, flights, expenses, trip } = d;
  const out = [];
  if (d.daysShown) out.push({ k: 'days', v: d.daysShown, l: rcNoun(d.daysShown, 'day', ar) });
  if (members.length > 1) out.push({ k: 'people', v: members.length, l: rcNoun(members.length, 'person', ar) });
  const cc = (trip.countries || []).length;
  if (cc > 1) out.push({ k: 'countries', v: cc, l: rcNoun(cc, 'country', ar) });
  if (plan.length) out.push({ k: 'places', v: plan.length, l: ar ? `${rcNoun(plan.length, 'place', ar)} في الخطة` : `${rcNoun(plan.length, 'place', ar)} on the plan` });
  if (nights) out.push({ k: 'nights', v: nights, l: rcNoun(nights, 'night', ar) });
  if (flights.length) out.push({ k: 'flights', v: flights.length, l: rcNoun(flights.length, 'flight', ar) });
  if (expenses.length) out.push({ k: 'pays', v: expenses.length, l: rcNoun(expenses.length, 'payment', ar) });
  return out.slice(0, 4);
}

// ── Text and time ──────────────────────────────────────────────────
// Words arrive one after another, rising out of a soft blur. In Arabic, a
// run of Latin words and numbers ("Hotel Galata", "SAR 5,565") moves as
// one piece and keeps its left-to-right order.
const _rcAr = (w) => /[\u0600-\u06FF]/.test(w);
const _rcLtr = (w) => !_rcAr(w) && /[A-Za-z0-9]/.test(w);
function rcTokens(text) {
  const words = String(text == null ? '' : text).split(' ').filter(Boolean);
  if (!window.isRTL) return words.map((w) => ({ t: w }));
  const g = [];
  words.forEach((w) => {
    if (_rcLtr(w)) {
      let j = g.length - 1;
      while (j >= 0 && g[j].neutral) j--;
      if (j >= 0 && g[j].ltr) { g[j].t = [g[j].t, ...g.splice(j + 1).map((x) => x.t), w].join(' '); return; }
      g.push({ t: w, ltr: true }); return;
    }
    g.push({ t: w, neutral: !_rcAr(w) });
  });
  return g;
}
function RcText({ text, at = 0, stagger = 80, dur = 1000 }) {
  const toks = rcTokens(text);
  return (
    <>
      {toks.map((w, i) => (
        <React.Fragment key={i}>
          <span className="rc-w" style={{ animationDelay: `${at + i * stagger}ms`, animationDuration: `${dur}ms`, ...(w.ltr ? { direction: 'ltr', unicodeBidi: 'isolate' } : null) }}>{w.t}</span>
          {i < toks.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}
function RcEyebrow({ at = 0, children }) {
  return <div className="rc-eye" style={{ animationDelay: `${at}ms` }}><i />{children}</div>;
}

// Every scene has its own clock (ms since it started), which stops while
// the film is paused. Anything drawn by script reads it, so a paused film
// is paused everywhere and a scene left mid-way keeps its last frame.
function useRcTick(clock, fn) {
  const ref = React.useRef(fn); ref.current = fn;
  React.useEffect(() => {
    let raf = 0, on = true;
    const loop = () => {
      if (!on) return;
      if (ref.current(clock.reduce ? 1e9 : clock.t) !== true) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { on = false; cancelAnimationFrame(raf); };
  }, [clock]);
}

// A number that counts up. The final value reserves the space, so nothing
// around it moves while it counts; the digits grow from the units side.
// It stays hidden until its moment, then fades in as it starts counting —
// no row of zeros waiting on screen.
function RcNum({ clock, value, fmt, at = 0, dur = 1600, style }) {
  const ref = React.useRef(null);
  useRcTick(clock, (t) => {
    const p = _rcClamp((t - at) / dur, 0, 1);
    const el = ref.current;
    if (el) {
      el.textContent = fmt(p >= 1 ? value : value * _rcOut(p));
      el.style.opacity = String(_rcClamp((t - at + 60) / 320, 0, 1));
    }
    return p >= 1;
  });
  const final = fmt(value);
  return (
    <span className="rc-num" style={{ position: 'relative', display: 'inline-block', ...style }}>
      <span style={{ visibility: 'hidden' }}>{final}</span>
      <span ref={ref} aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, whiteSpace: 'nowrap', opacity: clock.reduce ? 1 : 0 }}>{fmt(clock.reduce ? value : 0)}</span>
    </span>
  );
}

// A monogram for a person — quiet, in their own hue. The cash gets a note.
function RcMono({ m, size = 30, at }) {
  const s = typeof size === 'number' ? `${size}px` : size;
  if (m && m.cash) {
    return (
      <span className={at != null ? 'rc-fade' : undefined} style={{
        animationDelay: at != null ? `${at}ms` : undefined, width: s, height: s, borderRadius: '28%', flexShrink: 0, display: 'inline-grid', placeItems: 'center',
        background: 'linear-gradient(135deg, #4f8a73, #1f4537)', boxShadow: 'inset 0 0 0 1px rgba(246,222,160,.35)',
      }}>
        <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%' }} fill="none" stroke="#f6e3b0" strokeWidth="1.6" strokeLinecap="round">
          <rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.2h1.6M16.4 14.8H18" />
        </svg>
      </span>
    );
  }
  const hue = m && m.hue != null ? m.hue : 210;
  return (
    <span className={at != null ? 'rc-fade' : undefined} style={{
      animationDelay: at != null ? `${at}ms` : undefined,
      width: s, height: s, borderRadius: '50%', flexShrink: 0, display: 'inline-grid', placeItems: 'center',
      background: `radial-gradient(120% 120% at 30% 20%, oklch(0.6 0.08 ${hue}), oklch(0.34 0.06 ${hue}))`,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.22)', color: '#fff', fontWeight: 500, fontSize: `calc(${s} * .38)`,
    }}>{(m && m.initials) || _rcFirst(m).slice(0, 1)}</span>
  );
}

// A smooth line through the days that never overshoots (monotone cubic),
// worked out left to right and then mapped (mirrored for Arabic).
function rcMonotone(pts, mapX) {
  const n = pts.length;
  if (!n) return '';
  const f = (v) => v.toFixed(1);
  if (n === 1) return `M${f(mapX(pts[0][0]))},${f(pts[0][1])}`;
  const dx = [], s = [], t = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; s[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]; }
  t[0] = s[0]; t[n - 1] = s[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = s[i - 1] * s[i] <= 0 ? 0 : (s[i - 1] + s[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / s[i], b = t[i + 1] / s[i], q = a * a + b * b;
    if (q > 9) { const k = 3 / Math.sqrt(q); t[i] = k * a * s[i]; t[i + 1] = k * b * s[i]; }
  }
  let out = `M${f(mapX(pts[0][0]))},${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    out += ` C${f(mapX(pts[i][0] + h))},${f(pts[i][1] + t[i] * h)} ${f(mapX(pts[i + 1][0] - h))},${f(pts[i + 1][1] - t[i + 1] * h)} ${f(mapX(pts[i + 1][0]))},${f(pts[i + 1][1])}`;
  }
  return out;
}

// ── The backdrop: one piece behind the whole film ──────────────────
// In between, the cover is drawn tiny on a canvas and shown full screen:
// scaling it up is the blur — soft colour fields for free, no filter for
// the phone to recompute every frame.
const RC_PRESET = {
  kyoto: ['#d39b91', '#3a3956'], lisbon: ['#ddae77', '#934c3a'], oaxaca: ['#e6964f', '#86281d'],
  lofoten: ['#577ab5', '#101836'], patagon: ['#67acb0', '#183a5b'],
};
function RcAmbient({ d }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const c = ref.current; if (!c) return;
    const x = c.getContext('2d'); if (!x) return;
    const W = c.width, H = c.height;
    const [a, b] = RC_PRESET[d.trip.cover] || RC_PRESET.kyoto;
    const g = x.createLinearGradient(0, 0, W * 0.6, H); g.addColorStop(0, a); g.addColorStop(1, b);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const r = x.createRadialGradient(W * 0.7, H * 0.25, 1, W * 0.7, H * 0.25, W * 0.9);
    r.addColorStop(0, 'rgba(255,236,214,0.45)'); r.addColorStop(1, 'rgba(255,236,214,0)');
    x.fillStyle = r; x.fillRect(0, 0, W, H);
    const url = d.trip.coverUrl || d.trip.coverImageUrl;
    if (url) {
      const im = new Image();
      im.onload = () => {
        try {
          const k = Math.max(W / im.width, H / im.height), w = im.width * k, h = im.height * k;
          const offs = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];
          offs.forEach(([ox, oy], n) => { x.globalAlpha = 1 / (n + 1); x.drawImage(im, (W - w) / 2 + ox * 1.5, (H - h) / 2 + oy * 1.5, w, h); });
          x.globalAlpha = 1;
        } catch (_) {}
      };
      im.src = url;
    }
  }, []);
  return <canvas ref={ref} width="24" height="48" className="rc-loop" style={{ position: 'absolute', inset: '-12%', width: '124%', height: '124%', animation: 'rc-drift 30s ease-in-out infinite alternate' }} />;
}

function RcBackdrop({ d, sharp, glow, end }) {
  const { trip } = d;
  const url = trip.coverUrl || trip.coverImageUrl;
  const layer = { position: 'absolute', inset: 0, transition: 'opacity 1500ms ease' };
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#060607' }}>
      {/* in between: the cover as soft colour, dark */}
      <div style={{ ...layer, opacity: sharp ? 0 : 1 }}>
        <RcAmbient d={d} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,8,.72) 0%, rgba(6,6,8,.56) 45%, rgba(6,6,8,.84) 100%)' }} />
      </div>
      {/* the start and the end: the cover itself, slowly pushing in */}
      <div style={{ ...layer, opacity: sharp ? 1 : 0 }}>
        <div className="rc-loop" style={{ position: 'absolute', inset: 0, animation: 'rc-burns 24s cubic-bezier(.3,.1,.3,1) infinite alternate' }}>
          <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={url} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,8,.6) 0%, rgba(6,6,8,.06) 24%, rgba(6,6,8,.18) 46%, rgba(6,6,8,.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: end ? 1 : 0, transition: 'opacity 1500ms ease', background: 'linear-gradient(180deg, transparent 18%, rgba(6,6,8,.55) 40%, rgba(6,6,8,.9) 62%, #060607 100%)' }} />
      </div>
      {/* a soft light in the trip's colour, drifting */}
      <div className="rc-loop" style={{
        position: 'absolute', inset: '-25%', opacity: glow ? 1 : 0.45, transition: 'opacity 1600ms ease',
        background: `radial-gradient(38% 28% at 50% 46%, ${d.accent}2e, transparent 72%)`,
        animation: 'rc-glow 18s ease-in-out infinite alternate',
      }} />
    </div>
  );
}

// ── The scenes ─────────────────────────────────────────────────────
function RcTitle({ d }) {
  const { ar, trip, m, members } = d;
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  const len = [...title].length;
  const size = len <= 8 ? 'min(20cqw, 12cqh)' : len <= 14 ? 'min(14.5cqw, 9cqh)' : 'min(11cqw, 7cqh)';
  const meta = [trip.dates, m.totalDays ? d.dayWord(m.totalDays) : null, members.length > 1 ? d.peopleWord(members.length) : null].filter(Boolean);
  return (
    <div className="rc-stage" style={{ justifyContent: 'flex-end', paddingBottom: 'calc(var(--rc-sab) + 44px)' }}>
      <RcEyebrow at={700}>{ar ? 'ملخص الرحلة' : 'Trip recap'}</RcEyebrow>
      <div className="rc-title" style={{ fontSize: size, marginTop: 16, textShadow: '0 6px 40px rgba(0,0,0,.35)' }}>
        <RcText text={title} at={1000} stagger={150} dur={1400} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 10, rowGap: 4, marginTop: 18, fontSize: 15, color: 'var(--rc-fg2)' }}>
        {meta.map((x, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="rc-op" style={{ animationDelay: `${1800 + i * 150}ms`, width: 3, height: 3, borderRadius: 3, background: 'var(--rc-fg3)' }} />}
            <span className="rc-fade" style={{ animationDelay: `${1800 + i * 150}ms` }}>{x}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function RcFigures({ d, clock }) {
  const { ar } = d;
  const rows = rcFigures(d);
  const w = Math.max(...rows.map((r) => String(r.v).length));
  const int = (x) => String(Math.round(x));
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'الرحلة بالأرقام' : 'The trip in numbers'}</RcEyebrow>
      <div className="rc-fill">
        {rows.map((r, i) => {
          const at = 450 + i * 380;
          return (
            <div key={r.k}>
              <div className="rc-rule" style={{ animationDelay: `${at}ms` }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'min(5cqw, 22px)', padding: 'min(2.3cqh, 18px) 0' }}>
                <span className="rc-hero" style={{ fontSize: 'min(16cqw, 8.4cqh)', minWidth: `${w * 0.6 + 0.05}em`, textAlign: 'start' }}>
                  <RcNum clock={clock} value={r.v} fmt={int} at={at + 120} dur={900 + Math.min(900, r.v * 10)} />
                </span>
                <span className="rc-fade" style={{ animationDelay: `${at + 380}ms`, fontSize: 'min(5.6cqw, 3.1cqh)', color: 'var(--rc-fg2)' }}>{r.l}</span>
              </div>
            </div>
          );
        })}
        <div className="rc-rule" style={{ animationDelay: `${450 + rows.length * 380}ms` }} />
      </div>
    </div>
  );
}

function RcStat({ at, label, value }) {
  return (
    <div className="rc-fade" style={{ animationDelay: `${at}ms`, minWidth: 0 }}>
      <div className="rc-small" style={{ fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 'min(5.4cqw, 3cqh)', marginTop: 4 }}><span className="rc-num">{value}</span></div>
    </div>
  );
}

// The budget as one line: the spend fills it, a tick marks the budget.
function RcBudgetLine({ d, at }) {
  const { ar, m } = d;
  const over = m.total > m.planned;
  const max = Math.max(m.total, m.planned);
  const fillP = m.total / max, planP = m.planned / max;
  const pct = Math.round((m.total / m.planned) * 100);
  const left = m.planned - m.total;
  const split = over ? (planP / fillP) * 100 : 100;
  const verdict = over ? (ar ? `تجاوزتوا الميزانية بـ ${d.fmt(-left)}` : `${d.fmt(-left)} over budget`)
    : m.ended ? (ar ? `ووفرتوا ${d.fmt(left)}` : `${d.fmt(left)} saved`)
    : (ar ? `وباقي ${d.fmt(left)}` : `${d.fmt(left)} still to spend`);
  return (
    <div className="rc-fade" style={{ animationDelay: `${at}ms`, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, fontSize: 13, color: 'var(--rc-fg3)' }}>
        <span>{ar ? 'من ميزانية' : 'Of a budget of'} <span className="rc-num" style={{ color: 'var(--rc-fg2)' }}>{d.fmt(m.planned)}</span></span>
        <span className="rc-num" style={{ fontSize: 15, color: over ? 'var(--rc-bad)' : 'var(--rc-fg)' }}>{pct}%</span>
      </div>
      <div style={{ position: 'relative', height: 3, borderRadius: 3, background: 'rgba(255,255,255,.14)', marginTop: 10 }}>
        <span className="rc-bar" style={{
          position: 'absolute', top: 0, insetInlineStart: 0, width: `${fillP * 100}%`, animationDelay: `${at + 250}ms`, animationDuration: '1700ms',
          background: `linear-gradient(${ar ? 'to left' : 'to right'}, var(--rc-accent) 0 ${split}%, var(--rc-bad) ${split}% 100%)`,
        }} />
        {over && <span className="rc-op" style={{ animationDelay: `${at + 900}ms`, position: 'absolute', top: -5, bottom: -5, width: 1.5, background: 'var(--rc-fg)', insetInlineStart: `calc(${planP * 100}% - .75px)` }} />}
      </div>
      <div className="rc-h2 rc-fade" style={{ animationDelay: `${at + 1300}ms`, fontSize: 'min(5.4cqw, 3cqh)', marginTop: 14, color: over ? 'var(--rc-bad)' : m.ended ? 'var(--rc-good)' : 'var(--rc-fg)' }}>
        {verdict}
      </div>
    </div>
  );
}

function RcTotal({ d, clock, sfx }) {
  const { ar, m, members } = d;
  const s = d.num(m.total);
  const fs = `min(${Math.min(22, 120 / Math.max(5, s.length)).toFixed(1)}cqw, 12cqh)`;
  const n = d.daysShown;
  React.useEffect(() => { sfx('hit', 2250); }, []);
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'صرفتوا في هالرحلة' : 'Together you spent'}</RcEyebrow>
      <div className="rc-fill">
        <div className="rc-hero" style={{ fontSize: fs }}><RcNum clock={clock} value={m.total} fmt={d.num} at={450} dur={2000} /></div>
        <div className="rc-fade" style={{ animationDelay: '1000ms', marginTop: 14, fontSize: 'min(5cqw, 2.8cqh)', color: 'var(--rc-fg2)' }}>
          {d.curName}{n ? ` · ${ar ? `خلال ${d.dayWord(n)}` : `over ${d.dayWord(n)}`}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 'min(10cqw, 44px)', marginTop: 'min(5cqh, 40px)' }}>
          {members.length > 1 && <RcStat at={1500} label={ar ? 'نصيب الشخص' : 'Per person'} value={d.fmt(m.total / members.length)} />}
          {m.avg > 0 && <RcStat at={1680} label={ar ? 'متوسط اليوم' : 'A day, on average'} value={d.fmt(m.avg)} />}
        </div>
      </div>
      {m.planned > 0 && <RcBudgetLine d={d} at={2300} />}
    </div>
  );
}

// Day by day: the spend drawn as one line, a light riding its tip, the
// plan as a dashed line, and the biggest day called out once it's drawn.
function RcDaily({ d, clock, sfx }) {
  const { ar, m } = d;
  const days = m.days, n = days.length;
  const W = 340, H = 220, top = 44, base = H - 34, padX = 14;
  const plan = m.planPerDay || 0;
  const peak = m.peak && m.peak.v > 0 ? m.peak : null;
  const max = Math.max(plan, ...days.map((x) => x.v), 1) * 1.06;
  const xL = (i) => padX + (n === 1 ? (W - padX * 2) / 2 : (i * (W - padX * 2)) / (n - 1));
  const X = (x) => (ar ? W - x : x);
  const Y = (v) => base - (v / max) * (base - top);
  const pts = days.map((x, i) => [xL(i), Y(x.v)]);
  const line = rcMonotone(pts, X);
  const area = `${line} L${X(pts[n - 1][0]).toFixed(1)},${base} L${X(pts[0][0]).toFixed(1)},${base} Z`;
  const T0 = 750, T = Math.min(3400, Math.max(2300, n * 250));
  const done = T0 + T;
  const lineRef = React.useRef(null), dotRef = React.useRef(null), clipRef = React.useRef(null), len = React.useRef(0);
  const pid = React.useRef('rcd' + Math.random().toString(36).slice(2, 8)).current;
  useRcTick(clock, (t) => {
    const p = _rcInOut(_rcClamp((t - T0) / T, 0, 1));
    const el = lineRef.current;
    if (!el) return false;
    if (!len.current) len.current = el.getTotalLength() || 1;
    el.style.strokeDashoffset = String(1 - p);
    const pt = el.getPointAtLength(p * len.current);
    if (dotRef.current) { dotRef.current.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`); dotRef.current.style.opacity = p > 0 ? 1 : 0; }
    if (clipRef.current) {
      const w = Math.max(0, ar ? W - pt.x : pt.x);
      clipRef.current.setAttribute('width', w.toFixed(1));
      if (ar) clipRef.current.setAttribute('x', pt.x.toFixed(1));
    }
    return p >= 1;
  });
  React.useEffect(() => { sfx('swell', T0); }, []);
  const pk = peak ? days.findIndex((x) => x.k === peak.k) : -1;
  const px = pk >= 0 ? X(pts[pk][0]) : 0, py = pk >= 0 ? pts[pk][1] : 0;
  const every = n <= 10 ? 1 : n <= 20 ? 2 : 3;
  const pctX = (x) => `${(x / W) * 100}%`, pctY = (y) => `${(y / H) * 100}%`;
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'يوم بيوم' : 'Day by day'}</RcEyebrow>
      <div className="rc-fill">
        <div style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}`, flexShrink: 0 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', direction: 'ltr' }}>
            <defs>
              <linearGradient id={pid + 'a'} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={d.accent} stopOpacity=".34" />
                <stop offset="1" stopColor={d.accent} stopOpacity="0" />
              </linearGradient>
              <clipPath id={pid + 'c'}><rect ref={clipRef} x={ar ? W : 0} y="0" width="0" height={H} /></clipPath>
            </defs>
            <line className="rc-rule" x1={padX} x2={W - padX} y1={base} y2={base} stroke="rgba(245,242,236,.22)" strokeWidth="1" />
            {plan > 0 && (
              <line className="rc-op" style={{ animationDelay: '500ms' }} x1={padX} x2={W - padX} y1={Y(plan)} y2={Y(plan)}
                stroke="rgba(245,242,236,.42)" strokeWidth="1" strokeDasharray="3 5" />
            )}
            <path d={area} fill={`url(#${pid}a)`} clipPath={`url(#${pid}c)`} />
            <path ref={lineRef} d={line} fill="none" stroke={d.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: 1 }} />
            {pk >= 0 && (
              <line className="rc-op" style={{ animationDelay: `${done}ms` }} x1={px} x2={px} y1={py + 6} y2={base}
                stroke="rgba(245,242,236,.35)" strokeWidth="1" strokeDasharray="2 3" />
            )}
            <g ref={dotRef} style={{ opacity: 0 }}>
              <circle r="9" fill={d.accent} opacity=".22" />
              <circle r="3.6" fill="#fff" />
            </g>
          </svg>
          {/* labels in HTML, so Arabic and numbers lay out as text should */}
          {plan > 0 && (() => {
            // the label goes to whichever end the line is farthest from the plan, on the far side of it
            const yP = Y(plan), y0 = pts[0][1], y1 = pts[n - 1][1];
            const atStart = Math.abs(y0 - yP) > Math.abs(y1 - yP);
            const below = (atStart ? y0 : y1) < yP;
            return (
              <div className="rc-op rc-small" style={{
                animationDelay: '600ms', position: 'absolute', top: below ? `calc(${pctY(yP)} + 5px)` : `calc(${pctY(yP)} - 22px)`,
                ...(atStart ? { insetInlineStart: 0 } : { insetInlineEnd: 0 }), fontSize: 11.5, padding: '1px 7px', borderRadius: 6, background: 'rgba(6,6,8,.55)',
              }}>{ar ? 'الخطة اليومية' : 'Daily plan'}</div>
            );
          })()}
          {pk >= 0 && (
            <>
              <span style={{ position: 'absolute', left: pctX(px), top: pctY(py), width: 10, height: 10, margin: '-5px 0 0 -5px', borderRadius: 10, border: `1.5px solid ${d.accent}`, opacity: 0, animation: `rc-ring 1400ms ${done}ms ease-out both` }} />
              {/* the label sits above the peak (nothing of the line is higher); near an edge it
                  lines up with the point instead of centring on it, so it never leaves the chart */}
              <div style={{
                position: 'absolute', top: pctY(py), whiteSpace: 'nowrap',
                ...(px / W > 0.82 ? { right: `${(1 - px / W) * 100}%`, transform: 'translate(10px, calc(-100% - 12px))', textAlign: 'right' }
                  : px / W < 0.18 ? { left: pctX(px), transform: 'translate(-10px, calc(-100% - 12px))', textAlign: 'left' }
                  : { left: pctX(px), transform: 'translate(-50%, calc(-100% - 12px))', textAlign: 'center' }),
              }}>
                <div className="rc-fade" style={{ animationDelay: `${done + 80}ms` }}>
                  <div className="rc-small" style={{ fontSize: 11.5 }}>{ar ? `اليوم ${peak.i}` : `Day ${peak.i}`}</div>
                  <div><span className="rc-num" style={{ fontSize: 15 }}>{d.fmt(peak.v)}</span></div>
                </div>
              </div>
            </>
          )}
          {days.map((x, i) => ((i % every === 0 || i === n - 1) ? (
            <span key={x.k} className="rc-op rc-num" style={{
              animationDelay: `${T0 + (n > 1 ? (i / (n - 1)) * T : 0)}ms`, position: 'absolute', top: `calc(${pctY(base)} + 9px)`,
              left: pctX(X(pts[i][0])), transform: 'translateX(-50%)', fontSize: 11, color: 'var(--rc-fg3)',
            }}>{x.i}</span>
          ) : null))}
        </div>
        <div style={{ marginTop: 'min(5cqh, 38px)' }}>
          {peak && (
            <div className="rc-h2 rc-fade" style={{ animationDelay: `${done + 250}ms`, fontSize: 'min(5.8cqw, 3.2cqh)' }}>
              {ar ? `أغلى يوم كان اليوم ${peak.i}` : `Day ${peak.i} was the big one`}
            </div>
          )}
          <div className="rc-body rc-fade" style={{ animationDelay: `${done + 450}ms`, marginTop: 6 }}>
            {ar ? `متوسطكم ${d.fmt(m.avg)} في اليوم` : `${d.fmt(m.avg)} a day on average`}
            {plan > 0 ? (ar ? ` · الخطة ${d.fmt(plan)}` : ` · plan ${d.fmt(plan)}`) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

// Where it went: a thin ring that fills category by category.
function RcWhere({ d, clock }) {
  const { ar, m, cats } = d;
  const total = cats.reduce((s, [, v]) => s + v, 0) || 1;
  let list = cats.slice(0, 4);
  const rest = cats.slice(4).reduce((s, [, v]) => s + v, 0);
  if (rest > 0) list = [...list, ['_other', rest]];
  const R = 80, SW = 11, C = 2 * Math.PI * R, GAP = list.length > 1 ? 4 : 0;
  let acc = 0, tAcc = 450;
  const segs = list.map(([k, v]) => {
    const frac = v / total;
    const s = { k, v, frac, len: Math.max(0.6, frac * C - GAP), rot: (acc / total) * 360, at: tAcc, dur: Math.max(320, frac * 2100) };
    acc += v; tAcc += s.dur * 0.82;
    return s;
  });
  const refs = React.useRef([]);
  useRcTick(clock, (t) => {
    let all = true;
    segs.forEach((s, i) => {
      const p = _rcInOut(_rcClamp((t - s.at) / s.dur, 0, 1));
      if (p < 1) all = false;
      const el = refs.current[i];
      if (el) el.style.strokeDashoffset = String(s.len * (1 - p));
    });
    return all;
  });
  const top = segs[0];
  const name = (k) => (k === '_other' ? (ar ? 'أخرى' : 'Other') : _rcCatName(k));
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'وين راحت الفلوس؟' : 'Where it went'}</RcEyebrow>
      <div className="rc-fill" style={{ alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 'min(62cqw, 30cqh)', aspectRatio: '1 / 1', flexShrink: 0 }}>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}>
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(245,242,236,.08)" strokeWidth={SW} />
            {segs.map((s, i) => (
              <circle key={s.k} ref={(el) => { refs.current[i] = el; }} cx="100" cy="100" r={R} fill="none" stroke={rcCatColor(s.k)} strokeWidth={SW}
                strokeDasharray={`${s.len.toFixed(2)} ${C.toFixed(2)}`} transform={`rotate(${(s.rot + ((GAP / 2) / C) * 360).toFixed(2)} 100 100)`}
                style={{ strokeDashoffset: s.len }} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div>
              <div className="rc-hero" style={{ fontSize: 'min(12.5cqw, 6.2cqh)' }}>
                <RcNum clock={clock} value={Math.round(top.frac * 100)} fmt={(x) => `${Math.round(x)}%`} at={450} dur={1500} />
              </div>
              <div className="rc-fade" style={{ animationDelay: '1000ms', fontSize: 'min(4cqw, 2.2cqh)', color: 'var(--rc-fg2)', marginTop: 6 }}>{name(top.k)}</div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', marginTop: 'min(5cqh, 38px)', display: 'grid', gap: 'min(1.7cqh, 13px)' }}>
          {segs.map((s) => (
            <div key={s.k} className="rc-fade" style={{ animationDelay: `${s.at + 150}ms`, display: 'flex', alignItems: 'center', gap: 12, fontSize: 'min(4.3cqw, 2.4cqh)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: rcCatColor(s.k), flexShrink: 0 }} />
              <span className="rc-ell" style={{ flex: 1 }}>{name(s.k)}</span>
              <span className="rc-num" style={{ color: 'var(--rc-fg3)', fontSize: '.86em' }}>{d.fmt(s.v)}</span>
              <span className="rc-num" style={{ display: 'inline-block', minWidth: '3em', textAlign: 'right' }}>{Math.round(s.frac * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RcBiggest({ d, clock, sfx }) {
  const { ar, m, biggest: e, wallets } = d;
  const who = _rcFirst(d.members.find((x) => x.id === e.who));
  const onCard = wallets && !window.isGeneralBudgetExpense?.(e, d.trip);
  const pct = m.total ? Math.round(((e.usd || 0) / m.total) * 100) : 0;
  const title = e.title || _rcCatName(e.cat);
  const size = [...title].length <= 14 ? 'min(12cqw, 6.6cqh)' : [...title].length <= 24 ? 'min(9.5cqw, 5.2cqh)' : 'min(7.6cqw, 4.2cqh)';
  const meta = [e.createdAt ? window.fmtDate(window.localISO(e.createdAt)) : null,
    wallets && e.cash ? (ar ? 'كاش' : 'in cash')
      : who && who !== '?' ? (onCard ? (ar ? `بطاقة ${who}` : `${who}'s card`) : (ar ? `دفعها ${who}` : `paid by ${who}`)) : null].filter(Boolean).join(' · ');
  React.useEffect(() => { sfx('hit', 2250); }, []);
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'أغلى مصروف' : 'The biggest expense'}</RcEyebrow>
      <div className="rc-fill">
        <div className="rc-fade" style={{ animationDelay: '450ms', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--rc-fg2)' }}>
          <span style={{ width: 8, height: 8, borderRadius: 8, background: rcCatColor(e.cat) }} />{_rcCatName(e.cat)}
        </div>
        <div className="rc-title" style={{ fontSize: size, marginTop: 12 }}><RcText text={title} at={650} stagger={110} dur={1200} /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 'min(3.4cqh, 26px)' }}>
          <span className="rc-hero" style={{ fontSize: 'min(15cqw, 8cqh)' }}><RcNum clock={clock} value={e.usd || 0} fmt={d.num} at={1100} dur={1500} /></span>
          <span className="rc-fade" style={{ animationDelay: '1400ms', fontSize: 'min(4.6cqw, 2.6cqh)', color: 'var(--rc-fg2)' }}>{d.curWord}</span>
        </div>
        {meta && <div className="rc-fade rc-body" style={{ animationDelay: '1700ms', marginTop: 10 }}>{meta}</div>}
      </div>
      {pct > 0 && (
        <div className="rc-fade" style={{ animationDelay: '2300ms', flexShrink: 0 }}>
          <div style={{ fontSize: 'min(4.6cqw, 2.6cqh)', color: 'var(--rc-fg2)' }}>
            {ar ? <>لحاله <span className="rc-num" style={{ color: 'var(--rc-fg)' }}>{pct}%</span> من صرف الرحلة</> : <><span className="rc-num" style={{ color: 'var(--rc-fg)' }}>{pct}%</span> of the whole trip, on its own</>}
          </div>
          <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,.14)', marginTop: 12 }}>
            <span className="rc-bar" style={{ width: `${Math.max(2, pct)}%`, background: 'var(--rc-accent)', animationDelay: '2500ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}

function RcWho({ d, clock }) {
  const { ar, m, payers, wallets } = d;
  const lead = payers[0], rest = payers.slice(1, 5);
  const share = Math.round((lead.v / (m.total || 1)) * 100);
  const label = (mm) => (mm.cash ? (ar ? 'الكاش' : 'The cash') : wallets ? (ar ? `بطاقة ${_rcFirst(mm)}` : `${_rcFirst(mm)}'s card`) : _rcFirst(mm));
  const withCash = payers.some((p) => p.m.cash);
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{wallets ? (withCash ? (ar ? 'وش اللي شال الحمل؟' : 'What carried it') : (ar ? 'أي بطاقة شالت الحمل؟' : 'Which card carried it')) : (ar ? 'مين دفع أكثر؟' : 'Who paid the most')}</RcEyebrow>
      <div className="rc-fill">
        <RcMono m={lead.m} size="min(16cqw, 8.4cqh)" at={450} />
        <div className="rc-h2" style={{ fontSize: 'min(8.4cqw, 4.6cqh)', marginTop: 'min(2.6cqh, 20px)' }}><RcText text={label(lead.m)} at={700} stagger={110} /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
          <span className="rc-hero" style={{ fontSize: 'min(13cqw, 7cqh)' }}><RcNum clock={clock} value={lead.v} fmt={d.num} at={1000} dur={1500} /></span>
          <span className="rc-fade" style={{ animationDelay: '1300ms', fontSize: 'min(4.6cqw, 2.6cqh)', color: 'var(--rc-fg2)' }}>{d.curWord}</span>
        </div>
        <div className="rc-fade rc-body" style={{ animationDelay: '1500ms', marginTop: 8 }}>
          {ar ? `${share}% من صرف الرحلة` : `${share}% of what the trip cost`}
        </div>
      </div>
      {rest.length > 0 && (
        <div style={{ display: 'grid', gap: 'min(1.9cqh, 14px)', flexShrink: 0 }}>
          {rest.map((p, i) => {
            const at = 1900 + i * 170;
            return (
              <div key={p.m.id} className="rc-fade" style={{ animationDelay: `${at}ms`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <RcMono m={p.m} size={30} />
                <span className="rc-ell" style={{ width: '30%', fontSize: 15 }}>{label(p.m)}</span>
                <span style={{ flex: 1, height: 3, borderRadius: 3, background: 'rgba(255,255,255,.12)' }}>
                  <span className="rc-bar" style={{ width: `${Math.max(3, (p.v / lead.v) * 100)}%`, background: 'rgba(245,242,236,.7)', animationDelay: `${at + 150}ms` }} />
                </span>
                <span className="rc-num" style={{ display: 'inline-block', minWidth: '3.6em', textAlign: 'right', fontSize: 14, color: 'var(--rc-fg2)' }}>{_rcCompact(p.v)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Getting there and staying: the flight's arc between the two airports,
// then the nights as a strip — one block a night, toned by the hotel.
function RcTravel({ d, clock, sfx }) {
  const { ar, flights, stayList, nights } = d;
  const f = flights[0], fx = f?.details || {};
  const from = String(fx.dep_airport || '').toUpperCase(), to = String(fx.arr_airport || '').toUpperCase();
  const back = f ? flights.find((x, i) => i > 0 && String(x.details?.dep_airport || '').toUpperCase() === to) : null;
  const hm = (v) => (String(v || '').match(/T(\d\d:\d\d)/) || [])[1] || '';
  const dateOf = (v) => (v ? window.fmtDate(String(v).slice(0, 10)) : '');
  const W = 340, H = 120, ax = ar ? W - 30 : 30, bx = ar ? 30 : W - 30, ay = 104;
  const arc = `M${ax},${ay} Q${W / 2},-6 ${bx},${ay}`;
  const F0 = 650, F = 2000;
  const arcRef = React.useRef(null), dotRef = React.useRef(null), len = React.useRef(0);
  useRcTick(clock, (t) => {
    if (!f) return true;
    const p = _rcInOut(_rcClamp((t - F0) / F, 0, 1));
    const el = arcRef.current;
    if (!el) return false;
    if (!len.current) len.current = el.getTotalLength() || 1;
    el.style.strokeDashoffset = String(1 - p);
    const pt = el.getPointAtLength(p * len.current);
    if (dotRef.current) { dotRef.current.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`); dotRef.current.style.opacity = p > 0 && p < 1 ? 1 : 0; }
    return p >= 1;
  });
  React.useEffect(() => { if (f) sfx('whoosh', 750); }, []);
  const cells = [];
  stayList.forEach((s, si) => { for (let k = 0; k < s.nights; k++) cells.push(si); });
  const shown = cells.slice(0, 30);
  const N0 = f ? 2700 : 500;
  const tone = (si) => [d.accent, 'rgba(245,242,236,.82)', 'rgba(245,242,236,.45)', '#9fc7b3'][si % 4];
  const flightLine = [f?.sub || fx.airline, dateOf(fx.dep_at)].filter(Boolean).join(' · ');
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{f && nights ? (ar ? 'الطيران والسكن' : 'Flights & stays') : f ? (ar ? 'الطيران' : 'The flight') : (ar ? 'السكن' : 'Where you stayed')}</RcEyebrow>
      <div className="rc-fill" style={{ gap: 'min(7cqh, 54px)' }}>
        {f && (
          <div style={{ flexShrink: 0 }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', direction: 'ltr' }}>
                <path d={arc} fill="none" stroke="rgba(245,242,236,.18)" strokeWidth="1" strokeDasharray="2 5" />
                <path ref={arcRef} d={arc} fill="none" stroke={d.accent} strokeWidth="1.8" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: 1 }} />
                <circle cx={ax} cy={ay} r="3.5" fill={d.accent} className="rc-op" style={{ animationDelay: '400ms' }} />
                <circle cx={bx} cy={ay} r="3.5" fill="#fff" className="rc-op" style={{ animationDelay: `${F0 + F - 100}ms` }} />
                <g ref={dotRef} style={{ opacity: 0 }}><circle r="8" fill={d.accent} opacity=".25" /><circle r="3.2" fill="#fff" /></g>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: -6 }}>
              <div className="rc-fade" style={{ animationDelay: '350ms' }}>
                <div className="rc-hero" style={{ fontSize: 'min(12cqw, 6.4cqh)', letterSpacing: '-0.02em' }}>{from}</div>
                {hm(fx.dep_at) && <div className="rc-small" style={{ marginTop: 6 }}><span className="rc-num">{hm(fx.dep_at)}</span></div>}
              </div>
              <div className="rc-fade" style={{ animationDelay: `${F0 + F - 150}ms`, textAlign: 'end' }}>
                <div className="rc-hero" style={{ fontSize: 'min(12cqw, 6.4cqh)', letterSpacing: '-0.02em' }}>{to}</div>
                {hm(fx.arr_at) && <div className="rc-small" style={{ marginTop: 6 }}><span className="rc-num">{hm(fx.arr_at)}</span></div>}
              </div>
            </div>
            {flightLine && <div className="rc-body rc-fade" style={{ animationDelay: `${F0 + F + 100}ms`, marginTop: 12 }}>{flightLine}</div>}
            {back && (
              <div className="rc-small rc-fade" style={{ animationDelay: `${F0 + F + 300}ms`, marginTop: 2 }}>
                {ar ? 'والعودة ' : 'Back on '}{dateOf(back.details?.dep_at)}
                {flights.length > 2 ? (ar ? ` · و${rcCount(flights.length - 2, 'flight', ar)} ثانية` : ` · +${flights.length - 2} more`) : ''}
              </div>
            )}
          </div>
        )}
        {nights > 0 && (
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className="rc-hero" style={{ fontSize: 'min(14cqw, 7.4cqh)' }}><RcNum clock={clock} value={nights} fmt={(x) => String(Math.round(x))} at={N0} dur={1100} /></span>
              <span className="rc-fade" style={{ animationDelay: `${N0 + 250}ms`, fontSize: 'min(5.4cqw, 3cqh)', color: 'var(--rc-fg2)' }}>
                {rcNoun(nights, 'night', ar)}{stayList.length > 1 ? (ar ? ` في ${rcCount(stayList.length, 'stay', ar)}` : ` in ${rcCount(stayList.length, 'stay', ar)}`) : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 16, height: 'min(3.2cqh, 22px)' }}>
              {shown.map((si, k) => (
                <span key={k} style={{ flex: 1, maxWidth: 26, borderRadius: 3, background: tone(si), transformOrigin: '50% 100%', animation: `rc-grow-y 600ms ${N0 + 250 + k * 55}ms var(--rc-ease) both` }} />
              ))}
            </div>
            <div style={{ display: 'grid', gap: 9, marginTop: 16 }}>
              {stayList.slice(0, 3).map((s, si) => (
                <div key={s.id} className="rc-fade" style={{ animationDelay: `${N0 + 600 + si * 160}ms`, display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: tone(si), flexShrink: 0 }} />
                  <span className="rc-ell" dir="auto" style={{ flex: 1 }}>{s.title}</span>
                  <span style={{ color: 'var(--rc-fg3)', fontSize: 13.5, flexShrink: 0 }}>{rcCount(s.nights, 'night', ar)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// The plan, day by day, rolling up like end credits when it's long.
function RcPlaces({ d, clock, dur }) {
  const { ar, plan, trip } = d;
  const n = plan.length;
  const groups = [];
  plan.forEach((it) => { const k = it.dayDate || ''; const g = groups[groups.length - 1]; if (g && g.k === k) g.items.push(it); else groups.push({ k, items: [it] }); });
  const start = trip.startDate;
  const dayNo = (k) => (start && k ? Math.round((new Date(k + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000) + 1 : 0);
  const viewRef = React.useRef(null), listRef = React.useRef(null), roll = React.useRef(0);
  React.useLayoutEffect(() => {
    const v = viewRef.current, l = listRef.current;
    if (v && l) roll.current = Math.max(0, l.scrollHeight - v.clientHeight + 30);
  }, []);
  const R0 = 1500, RD = Math.max(1800, (dur || 7600) - R0 - 700);
  useRcTick(clock, (t) => {
    if (!roll.current) return t > R0;
    const p = _rcClamp((t - R0) / RD, 0, 1);
    if (listRef.current) listRef.current.style.transform = `translate3d(0, ${(-roll.current * _rcInOut(p)).toFixed(1)}px, 0)`;
    return p >= 1;
  });
  const fade = 'linear-gradient(180deg, transparent 0, #000 7%, #000 86%, transparent 100%)';
  return (
    <div className="rc-stage">
      <RcEyebrow at={150}>{ar ? 'الأماكن' : 'The places'}</RcEyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 'min(3cqh, 22px)', flexShrink: 0 }}>
        <span className="rc-hero" style={{ fontSize: 'min(15cqw, 8cqh)' }}><RcNum clock={clock} value={n} fmt={(x) => String(Math.round(x))} at={350} dur={1000} /></span>
        <span className="rc-fade" style={{ animationDelay: '650ms', fontSize: 'min(5.4cqw, 3cqh)', color: 'var(--rc-fg2)' }}>{ar ? `${rcNoun(n, 'place', ar)} في خطتكم` : `${rcNoun(n, 'place', ar)} on your plan`}</span>
      </div>
      <div ref={viewRef} style={{ flex: 1, minHeight: 0, overflow: 'hidden', marginTop: 'min(2.6cqh, 20px)', WebkitMaskImage: fade, maskImage: fade }}>
        <div ref={listRef} style={{ paddingTop: 14, willChange: 'transform' }}>
          {groups.map((g, gi) => (
            <div key={gi} className="rc-fade" style={{ animationDelay: `${750 + Math.min(gi, 4) * 170}ms`, paddingBottom: 14 }}>
              <div className="rc-small" style={{ marginBottom: 4 }}>
                {[dayNo(g.k) > 0 ? (ar ? `اليوم ${dayNo(g.k)}` : `Day ${dayNo(g.k)}`) : null, g.k ? window.fmtDate(g.k) : null].filter(Boolean).join(' · ')}
              </div>
              {g.items.map((it) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '9px 0', borderTop: '1px solid var(--rc-line)' }}>
                  <span className="rc-num" style={{ display: 'inline-block', width: '2.9em', flexShrink: 0, fontSize: 13, color: 'var(--rc-fg3)' }}>{(it.startTime || '').slice(0, 5)}</span>
                  <span className="rc-ell" dir="auto" style={{ flex: 1, fontSize: 'min(4.5cqw, 2.5cqh)' }}>{it.title}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// The closing poster — the same design the share image draws.
function rcStats(d) {
  const { ar, plan, nights, expenses, flights, members } = d;
  const out = [];
  if (d.daysShown) out.push([d.daysShown, rcNoun(d.daysShown, 'day', ar)]);
  if (plan.length) out.push([plan.length, rcNoun(plan.length, 'place', ar)]);
  if (nights) out.push([nights, rcNoun(nights, 'night', ar)]);
  if (out.length < 3 && flights.length) out.push([flights.length, rcNoun(flights.length, 'flight', ar)]);
  if (out.length < 3 && members.length > 1) out.push([members.length, rcNoun(members.length, 'person', ar)]);
  if (out.length < 3 && expenses.length) out.push([expenses.length, rcNoun(expenses.length, 'payment', ar)]);
  return out.slice(0, 3);
}
function rcHighlights(d) {
  const { ar, m, cats } = d;
  const out = [];
  if (m.peak && m.peak.v > 0) out.push(ar ? `أغلى يوم: اليوم ${m.peak.i} · ${d.fmt(m.peak.v)}` : `Biggest day: Day ${m.peak.i} · ${d.fmt(m.peak.v)}`);
  const pct = cats[0] ? `\u2066${Math.round((cats[0][1] / (m.total || 1)) * 100)}%\u2069` : '';
  if (cats[0]) out.push(ar ? `أكثر شي: ${_rcCatName(cats[0][0])} · ${pct}` : `Most on: ${_rcCatName(cats[0][0])} · ${pct}`);
  return out;
}

function RcFinale({ d, onReplay, onClose }) {
  const { ar, trip, m } = d;
  const blobRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    window.renderRecapImage?.(d).then((b) => { if (alive) blobRef.current = b; }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const share = async (e) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const blob = blobRef.current || await window.renderRecapImage(d);
      const name = `${String(trip.title || 'trip').replace(/[^\p{L}\p{N}]+/gu, '-')}-voyage.png`;
      const file = new File([blob], name, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: trip.title || 'Voyage' });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') window.toast?.(ar ? 'ما قدرنا نجهز الصورة' : "Couldn't make the image", 'error');
    }
    setBusy(false);
  };
  const stats = rcStats(d);
  const lights = rcHighlights(d);
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  const len = [...title].length;
  const size = len <= 8 ? 'min(16cqw, 8.6cqh)' : len <= 14 ? 'min(12cqw, 6.6cqh)' : 'min(9.4cqw, 5.2cqh)';
  return (
    <div className="rc-stage" style={{ paddingTop: 'calc(var(--rc-sat) + 72px)', paddingBottom: 'calc(var(--rc-sab) + 16px)' }}>
      <div style={{ flex: 1, minHeight: 6 }} />
      <RcEyebrow at={200}>{m.ended ? (ar ? 'وهذي كانت رحلتكم' : 'And that was the trip') : (ar ? 'رحلتكم لين الحين' : 'Your trip so far')}</RcEyebrow>
      <div className="rc-title" style={{ fontSize: size, marginTop: 10 }}><RcText text={title} at={420} stagger={120} dur={1100} /></div>
      {trip.dates && <div className="rc-fade rc-body" style={{ animationDelay: '800ms', marginTop: 2 }}>{trip.dates}</div>}

      <div className="rc-fade" style={{ animationDelay: '1000ms', marginTop: 'min(3cqh, 22px)', paddingTop: 'min(1.8cqh, 14px)', borderTop: '1px solid var(--rc-line)', flexShrink: 0 }}>
        <div className="rc-small" style={{ fontSize: 13 }}>{ar ? 'صرفتوا' : 'Spent'}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
          <span className="rc-hero" style={{ fontSize: 'min(12cqw, 6.4cqh)' }}><span className="rc-num">{d.num(m.total)}</span></span>
          <span style={{ fontSize: 'min(4.6cqw, 2.5cqh)', color: 'var(--rc-fg2)' }}>{d.curWord}</span>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="rc-fade" style={{ animationDelay: '1150ms', display: 'flex', marginTop: 'min(1.8cqh, 14px)', paddingTop: 'min(1.8cqh, 14px)', borderTop: '1px solid var(--rc-line)', flexShrink: 0 }}>
          {stats.map(([v, l], k) => (
            <div key={k} style={{ flex: 1, minWidth: 0, paddingInlineStart: k ? 14 : 0, borderInlineStart: k ? '1px solid var(--rc-line)' : 'none' }}>
              <div className="rc-hero" style={{ fontSize: 'min(8cqw, 4.2cqh)' }}><span className="rc-num">{v}</span></div>
              <div className="rc-small rc-ell" style={{ fontSize: 13, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      {lights.length > 0 && (
        <div className="rc-fade" style={{ animationDelay: '1300ms', marginTop: 'min(2.2cqh, 16px)', display: 'grid', gap: 5, flexShrink: 0 }}>
          {lights.map((x, k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: 'var(--rc-fg2)' }}>
              <span style={{ width: 5, height: 5, borderRadius: 1.5, background: 'var(--rc-accent)', flexShrink: 0 }} />
              <span className="rc-ell">{x}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rc-fade" style={{ animationDelay: '1550ms', display: 'grid', gap: 8, marginTop: 'min(3cqh, 22px)', flexShrink: 0 }}>
        <button onClick={share} disabled={busy} className="rc-btn" style={{ background: '#f5f2ec', color: '#141418', opacity: busy ? 0.7 : 1 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          {ar ? 'شارك الملخص مع القروب' : 'Share with the group'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onReplay(); }} className="rc-btn rc-glass" style={{ flex: 1, minHeight: 46 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9.3 9.3 0 00-6.4 2.6L3 8" /><path d="M3 3v5h5" /></svg>
            {ar ? 'شاهد مرة ثانية' : 'Watch again'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="rc-btn rc-glass" style={{ flex: 1, minHeight: 46 }}>
            {ar ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sound: a generated score + a few cues (Web Audio) ─────────────
// Made for a phone speaker, which plays almost nothing under ~300 Hz: the
// parts live between 300 Hz and 6 kHz (a felt piano, a saw pad, a bass
// whose overtones carry it, a shaker, a soft kick with a click), and the
// mix is compressed and limited so it sounds full at a normal volume.
// The arrangement follows the film — piano and pad for the title, a soft
// beat once the numbers start, quiet again for the poster — and the cuts
// fall on the beat (80 bpm; the scenes last whole beats).
const RcAudio = (() => {
  let ctx = null, master = null, bus = null, rev = null, echo = null, noise = null, timer = null, silent = null, silentURL = null;
  let step = 0, nextT = 0, running = false, muted = false, open = false, mood = 0, nextMood = 0;
  try { muted = localStorage.getItem('voyage:recapMuted') === '1'; } catch (_) {}
  const ua = navigator.userAgent || '';
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const VOL = 1;
  const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const BEAT = 60 / 80, S16 = BEAT / 4, BAR = BEAT * 4;
  const CH = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [45, 52, 54, 59, 61]];   // Dmaj9 · Bm9 · Gmaj9 · A6/9
  const ARP = [1, 3, 2, 4, 3, 2, 4, 3];
  const VEL = [1, 0.55, 0.75, 0.55, 0.9, 0.55, 0.75, 0.6];
  const SHK = [0.4, 0.18, 0.75, 0.2, 0.4, 0.18, 0.75, 0.25, 0.4, 0.18, 0.75, 0.2, 0.4, 0.22, 0.8, 0.3];

  // An iPhone plays Web Audio on the ringer channel, so the silent switch
  // mutes it. Asking for a "playback" session — and on older iOS keeping a
  // silent <audio> running — moves it to the media channel, like a video.
  const session = (type) => { try { if (navigator.audioSession && navigator.audioSession.type !== type) navigator.audioSession.type = type; } catch (_) {} };
  const silentSrc = () => {
    if (silentURL) return silentURL;
    const rate = 48000, n = Math.round(rate * 0.25), bytes = new Uint8Array(44 + n * 2), v = new DataView(bytes.buffer);
    const s = (o, str) => { for (let k = 0; k < str.length; k++) bytes[o + k] = str.charCodeAt(k); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    silentURL = URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
    return silentURL;
  };
  const silentOn = () => {
    if (!iOS) return;
    try {
      if (!silent) {
        silent = document.createElement('audio');
        silent.setAttribute('x-webkit-airplay', 'deny'); silent.setAttribute('playsinline', '');
        silent.preload = 'auto'; silent.loop = true; silent.src = silentSrc();
        try { silent.disableRemotePlayback = true; } catch (_) {}
      }
      const p = silent.play(); if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  };
  const silentOff = (drop) => {
    try { if (silent) { silent.pause(); if (drop) { silent.removeAttribute('src'); silent.load(); silent = null; } } } catch (_) {}
  };

  const build = () => {
    if (master || !ctx) return;
    master = ctx.createGain(); master.gain.value = 0;
    // master: cut the rumble a phone can't play anyway, a touch of air,
    // glue compression, then a limiter so nothing clips
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 48; hp.Q.value = 0.7;
    const shelf = ctx.createBiquadFilter(); shelf.type = 'highshelf'; shelf.frequency.value = 2600; shelf.gain.value = 5;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.012; comp.release.value = 0.22;
    const trim = ctx.createGain(); trim.gain.value = 1.25;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -6; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.12;
    master.connect(hp); hp.connect(shelf); shelf.connect(comp); comp.connect(trim); trim.connect(lim); lim.connect(ctx.destination);
    rev = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let k = 0; k < len; k++) ch[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / len, 3.2); }
    rev.buffer = ir;
    const rlp = ctx.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 5200;
    const wet = ctx.createGain(); wet.gain.value = 0.3; rev.connect(rlp); rlp.connect(wet); wet.connect(master);
    bus = ctx.createGain(); bus.gain.value = 1; bus.connect(master);
    echo = ctx.createDelay(1.5); echo.delayTime.value = S16 * 3;                 // a dotted-eighth echo for the piano
    const fb = ctx.createGain(); fb.gain.value = 0.3;
    const ef = ctx.createBiquadFilter(); ef.type = 'lowpass'; ef.frequency.value = 3400;
    echo.connect(ef); ef.connect(fb); fb.connect(echo);
    const ew = ctx.createGain(); ew.gain.value = 0.22; ef.connect(ew); ew.connect(bus);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noise.getChannelData(0); for (let k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
  };
  const toRev = (node, amt) => { const s = ctx.createGain(); s.gain.value = amt; node.connect(s); s.connect(rev); };
  const out = (node, dest, p) => {
    if (p && ctx.createStereoPanner) { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); s.connect(dest); return s; }
    node.connect(dest); return node;
  };
  const decay = (g, t, peak, a, d) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };

  // A wide pad: two detuned saws a note, left and right, under a slow filter.
  const pad = (t, chord, len) => {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.6;
    lp.frequency.setValueAtTime(1300, t); lp.frequency.linearRampToValueAtTime(3200, t + len * 0.55); lp.frequency.linearRampToValueAtTime(1600, t + len + 1.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 1.1);
    g.gain.setValueAtTime(0.05, t + len - 0.3); g.gain.linearRampToValueAtTime(0.0001, t + len + 1.5);
    lp.connect(g); g.connect(bus); toRev(g, 0.45);
    chord.slice(1).forEach((n) => [-9, 9].forEach((c, k) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(n); o.detune.value = c;
      const og = ctx.createGain(); og.gain.value = 0.22;
      o.connect(og); out(og, lp, k ? 0.45 : -0.45); o.start(t); o.stop(t + len + 1.6);
    }));
  };
  // Bass: a filtered saw (its overtones are what a phone plays) over a sine an octave down.
  const bass = (t, n, len, v) => {
    const f = mtof(n);
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = f / 2;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1;
    lp.frequency.setValueAtTime(420, t); lp.frequency.exponentialRampToValueAtTime(1500, t + 0.025); lp.frequency.exponentialRampToValueAtTime(560, t + 0.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.17 * v, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.1 * v, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const sg = ctx.createGain(); sg.gain.value = 0.28;
    o.connect(lp); lp.connect(g); sub.connect(sg); sg.connect(g); g.connect(bus);
    o.start(t); sub.start(t); o.stop(t + len + 0.05); sub.stop(t + len + 0.05);
  };
  // A felt piano: five soft partials, the high ones dying first, a breath of hammer.
  const keys = (t, n, v) => {
    const f = mtof(n);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(7000, t); lp.frequency.exponentialRampToValueAtTime(2000, t + 1.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.15 * v, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.058 * v, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
    [[1, 1, 0], [2, 0.62, 3], [3, 0.32, -4], [4, 0.17, 5], [5, 0.08, -3]].forEach(([h, a, c]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * h; o.detune.value = c;
      const hg = ctx.createGain(); hg.gain.setValueAtTime(a, t);
      if (h > 1) hg.gain.exponentialRampToValueAtTime(a * 0.2, t + 0.9 / h);
      o.connect(hg); hg.connect(lp); o.start(t); o.stop(t + 1.95);
    });
    const s = ctx.createBufferSource(); s.buffer = noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(6500, f * 5); bp.Q.value = 1.1;
    const ng = ctx.createGain(); decay(ng, t, 0.035 * v, 0.002, 0.035);
    s.connect(bp); bp.connect(ng); ng.connect(g); s.start(t, Math.random() * 0.5); s.stop(t + 0.05);
    lp.connect(g);
    const o2 = out(g, bus, ((n % 12) / 12 - 0.5) * 0.5);
    toRev(o2, 0.32); g.connect(echo);
  };
  const shaker = (t, v) => {
    const s = ctx.createBufferSource(); s.buffer = noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 7400; bp.Q.value = 0.8;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 4200;
    const g = ctx.createGain(); decay(g, t, 0.15 * v, 0.004, 0.06 + 0.05 * v);
    s.connect(bp); bp.connect(hp); hp.connect(g); out(g, bus, 0.28);
    s.start(t, Math.random() * 0.8); s.stop(t + 0.15);
  };
  // A soft kick, with a click on top — the click is what a phone hears.
  const kick = (t, v) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(135, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.11);
    const g = ctx.createGain(); decay(g, t, 0.26 * v, 0.004, 0.34);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.4);
    const c = ctx.createOscillator(); c.type = 'triangle';
    c.frequency.setValueAtTime(1500, t); c.frequency.exponentialRampToValueAtTime(320, t + 0.025);
    const cg = ctx.createGain(); decay(cg, t, 0.09 * v, 0.001, 0.03);
    c.connect(cg); cg.connect(bus); c.start(t); c.stop(t + 0.04);
  };
  // A finger snap on two and four: three quick bursts and a little room.
  const snap = (t) => {
    [0, 0.011, 0.022].forEach((dt, k) => {
      const s = ctx.createBufferSource(); s.buffer = noise;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2000; bp.Q.value = 1.3;
      const g = ctx.createGain(); decay(g, t + dt, k === 2 ? 0.17 : 0.09, 0.001, k === 2 ? 0.11 : 0.012);
      s.connect(bp); bp.connect(g);
      const o2 = out(g, bus, -0.18); toRev(o2, 0.55);
      s.start(t + dt, Math.random() * 0.8); s.stop(t + dt + 0.14);
    });
  };
  const bell = (t, n, v) => {
    [[1, 1], [2.76, 0.3], [5.4, 0.1], [8.9, 0.035]].forEach(([h, a]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(n) * h;
      const g = ctx.createGain(); decay(g, t, v * a, 0.006, 2.8 / Math.sqrt(h));
      o.connect(g); g.connect(master); toRev(g, 0.5); o.start(t); o.stop(t + 3);
    });
  };
  // Filtered noise moving through a band, panned across — the whoosh of a cut.
  const air = (t, len, peak, type, f0, f1, p0, p1) => {
    const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.Q.value = 0.9;
    fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + len * 0.85);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + len * 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(fl); fl.connect(g);
    let last = g;
    if ((p0 || p1) && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.setValueAtTime(p0 || 0, t); p.pan.linearRampToValueAtTime(p1 || 0, t + len); g.connect(p); last = p; }
    last.connect(master); toRev(last, 0.35);
    s.start(t, Math.random() * 0.5); s.stop(t + len + 0.05);
  };

  // 16ths, a little ahead of time. 0 = piano + pad · 1 = with the beat ·
  // 2 = the full groove · 3 = the end: back to piano and pad, softer.
  const tick = () => {
    if (!running || !ctx) return;
    while (nextT < ctx.currentTime + 0.3) {
      const s = step % 16, bar = Math.floor(step / 16), chord = CH[bar % 4];
      if (s % 4 === 0 && mood !== nextMood) {
        mood = nextMood;
        const t = nextT;
        bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(bus.gain.value, t); bus.gain.linearRampToValueAtTime(mood === 3 ? 0.62 : 1, t + (mood === 3 ? 4 : 0.6));
      }
      const beat = mood === 1 || mood === 2;
      if (s === 0) { pad(nextT, chord, BAR); bass(nextT, chord[0], BEAT * 1.9, 1); }
      else if (s === 8 && beat) bass(nextT, chord[0], BEAT * 1.4, 0.8);
      else if (s === 14 && mood === 2) bass(nextT, chord[0] + 12, BEAT * 0.45, 0.5);
      if (beat ? s % 2 === 0 : s % 4 === 0) { const k = s >> 1; keys(nextT, chord[ARP[k]] + 12, VEL[k] * (beat ? 1 : 0.9)); }
      if (beat) {
        shaker(nextT, SHK[s]);
        if (s === 0 || s === 8) kick(nextT, s === 0 ? 1 : 0.85);
        if (mood === 2 && s === 10 && bar % 2) kick(nextT, 0.55);
      }
      if (mood === 2 && (s === 4 || s === 12)) snap(nextT);
      step++; nextT += S16;
    }
  };
  const ramp = (to, secs) => {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(to, t + secs);
  };
  const resumeCtx = () => { try { if (ctx && ctx.state !== 'running') { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } } catch (_) {} };
  return {
    // Call from inside the tap that opens the film (an iPhone needs the tap).
    unlock() {
      open = true;
      if (muted) return;
      session('playback');
      silentOn();
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!ctx) { try { ctx = new AC({ latencyHint: 'playback' }); } catch (_) { ctx = new AC(); } }
        resumeCtx();
        const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0);
      } catch (_) {}
    },
    start() {
      open = true;
      if (!ctx || muted) return;
      build(); resumeCtx();
      if (!running) {
        running = true; step = 0; mood = nextMood; nextT = ctx.currentTime + 0.03;
        bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(mood === 3 ? 0.62 : 1, ctx.currentTime);
        tick(); timer = setInterval(tick, 70);
      }
      ramp(VOL, 1.2);
    },
    stop() {
      open = false;
      if (ctx) { ramp(0, 0.5); running = false; clearInterval(timer); timer = null; }
      setTimeout(() => { if (!open) { silentOff(true); session('auto'); } }, 700);
    },
    // The arrangement for what's on screen; it changes on the next beat.
    mood(level) { nextMood = level; },
    sfx(kind, inMs = 0) {
      if (!ctx || !master || muted) return;
      const t = ctx.currentTime + inMs / 1000;
      try {
        if (kind === 'whoosh') air(t, 0.8, 0.12, 'bandpass', 320, 3400, -0.35, 0.35);
        else if (kind === 'swell') air(t, 2.4, 0.055, 'lowpass', 420, 3600);
        else if (kind === 'hit') {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.9);
          const g = ctx.createGain(); decay(g, t, 0.28, 0.012, 1.15);
          o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.25);
          const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.setValueAtTime(230, t); o2.frequency.exponentialRampToValueAtTime(115, t + 0.3);
          const g2 = ctx.createGain(); decay(g2, t, 0.24, 0.005, 0.5);
          o2.connect(g2); g2.connect(master); toRev(g2, 0.45); o2.start(t); o2.stop(t + 0.55);
          air(t, 0.6, 0.08, 'lowpass', 2600, 260);
          bell(t + 0.01, 86, 0.045); bell(t + 0.01, 93, 0.018);
        } else if (kind === 'chime') {
          [74, 78, 81, 86].forEach((n, k) => bell(t + k * 0.12, n, 0.05));
        }
      } catch (_) {}
    },
    // True while the film is open, sound is on, and the iPhone still hasn't let it play.
    blocked() { return open && !muted && (!ctx || ctx.state !== 'running'); },
    get muted() { return muted; },
    setMuted(v) {
      muted = v;
      try { localStorage.setItem('voyage:recapMuted', v ? '1' : '0'); } catch (_) {}
      if (v) { ramp(0, 0.3); silentOff(false); session('auto'); } else ramp(VOL, 0.4);
    },
    suspend() { try { if (ctx) ctx.suspend(); } catch (_) {} silentOff(false); },
    resume() { if (!open || muted) return; session('playback'); silentOn(); resumeCtx(); },
  };
})();

// ── The player ─────────────────────────────────────────────────────
let _rcGrainURL = null;
function rcGrain() {
  if (_rcGrainURL !== null) return _rcGrainURL;
  try {
    const c = document.createElement('canvas'); c.width = c.height = 160;
    const x = c.getContext('2d'); const img = x.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 14; }
    x.putImageData(img, 0, 0); _rcGrainURL = c.toDataURL();
  } catch (_) { _rcGrainURL = ''; }
  return _rcGrainURL;
}

function TripRecap({ onClose }) {
  const d = React.useMemo(() => recapData(), []);
  const { ar } = d;
  // Each scene lasts whole beats of the score (80 bpm), so the cuts land on
  // the beat; `mood` is the arrangement under it.
  const scenes = React.useMemo(() => {
    const beats = (ms) => Math.ceil(ms / 750) * 750;
    const s = [{ key: 'title', dur: 6000, mood: 0, sharp: true, el: RcTitle }];
    if (rcFigures(d).length >= 2) s.push({ key: 'figures', dur: 6000, mood: 1, el: RcFigures });
    if (d.expenses.length) s.push({ key: 'total', dur: 7500, mood: 2, glow: true, el: RcTotal });
    if (d.m.days.length >= 3 && d.m.days.filter((x) => x.v > 0).length >= 2) s.push({ key: 'daily', dur: beats(1300 + Math.min(3400, Math.max(2300, d.m.days.length * 250)) + 2600), mood: 2, el: RcDaily });
    if (d.cats.length >= 2) s.push({ key: 'where', dur: 7500, mood: 2, el: RcWhere });
    if (d.biggest) s.push({ key: 'biggest', dur: 6000, mood: 1, glow: true, el: RcBiggest });
    if (d.payers.length >= 2) s.push({ key: 'who', dur: 6750, mood: 2, el: RcWho });
    if (d.flights.length || d.nights) s.push({ key: 'travel', dur: 7500, mood: 2, el: RcTravel });
    if (d.plan.length) s.push({ key: 'places', dur: d.plan.length > 6 ? 8250 : 6000, mood: 1, el: RcPlaces });
    s.push({ key: 'finale', dur: 0, mood: 3, sharp: true, el: RcFinale });
    return s;
  }, [d]);
  const [i, setI] = React.useState(0);
  const [prev, setPrev] = React.useState(null);
  const [run, setRun] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [muted, setMutedState] = React.useState(RcAudio.muted);
  const [needTap, setNeedTap] = React.useState(false);
  const reduce = !!window.vReduce?.();
  const pausedRef = React.useRef(false); pausedRef.current = paused;
  const iRef = React.useRef(0); iRef.current = i;
  const runRef = React.useRef(0); runRef.current = run;
  const fills = React.useRef([]);
  const clocks = React.useRef({});
  const hold = React.useRef(null);
  const prevTimer = React.useRef(null);
  const cur = scenes[i];
  const clockOf = (key) => (clocks.current[key] = clocks.current[key] || { t: 0 });
  const sfx = React.useCallback((kind, ms) => RcAudio.sfx(kind, ms), []);

  const goTo = (j) => {
    const from = iRef.current;
    j = Math.max(0, Math.min(scenes.length - 1, j));
    if (j === from) {
      if (j === 0) { delete clocks.current[`${runRef.current}-0`]; setRun((r) => r + 1); }
      return;
    }
    clearTimeout(prevTimer.current);
    setPrev({ idx: from, run: runRef.current });
    prevTimer.current = setTimeout(() => setPrev(null), 800);
    setI(j);
    RcAudio.sfx(j === scenes.length - 1 ? 'chime' : 'whoosh');
    window.haptic?.();
  };
  const goRef = React.useRef(goTo); goRef.current = goTo;

  // Sound for as long as the film is open; quiet while the app is hidden.
  React.useEffect(() => {
    RcAudio.mood(scenes[0].mood);
    RcAudio.start();
    const vis = () => { if (document.hidden) RcAudio.suspend(); else RcAudio.resume(); };
    document.addEventListener('visibilitychange', vis);
    const iv = setInterval(() => setNeedTap(RcAudio.blocked()), 900);
    return () => { document.removeEventListener('visibilitychange', vis); clearInterval(iv); RcAudio.stop(); clearTimeout(prevTimer.current); };
  }, []);

  // The clock: runs the current scene's clock, fills its bar, cuts when full.
  React.useEffect(() => {
    fills.current.forEach((el, k) => { if (el) el.style.transform = `scaleX(${k < i || (!scenes[k].dur && k === i) ? 1 : 0})`; });
    const c = clockOf(`${run}-${i}`);
    c.t = 0;
    RcAudio.mood(cur.mood);
    let last = performance.now(), raf = 0, cued = false;
    const loop = (now) => {
      const dt = Math.min(100, now - last); last = now;
      if (!pausedRef.current && !document.hidden) c.t += dt;
      if (cur.dur) {
        const p = Math.min(1, c.t / cur.dur);
        const el = fills.current[i]; if (el) el.style.transform = `scaleX(${p})`;
        // tell the score a moment early, so the next scene's beat starts on the cut
        if (!cued && c.t >= cur.dur - 450 && scenes[i + 1]) { cued = true; RcAudio.mood(scenes[i + 1].mood); }
        if (p >= 1) { goRef.current(iRef.current + 1); return; }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [i, run]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goRef.current(ar ? iRef.current - 1 : iRef.current + 1);
      if (e.key === 'ArrowLeft') goRef.current(ar ? iRef.current + 1 : iRef.current - 1);
      if (e.key === ' ') setPaused((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Tap the far side → next, the near side → back; hold → pause; swipe down → close.
  const down = (e) => {
    RcAudio.resume();
    hold.current = { x: e.clientX, y: e.clientY, held: false };
    hold.current.timer = setTimeout(() => { if (hold.current) { hold.current.held = true; setPaused(true); } }, 220);
  };
  const up = (e) => {
    RcAudio.resume();
    const h = hold.current; hold.current = null;
    if (!h) return;
    clearTimeout(h.timer);
    if (e.clientY - h.y > 90) { onClose(); return; }
    if (h.held) { setPaused(false); return; }
    const w = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - w.left) / w.width;
    const back = ar ? frac > 0.7 : frac < 0.3;
    goTo(back ? i - 1 : i + 1);
  };
  const cancel = () => { const h = hold.current; hold.current = null; if (h) { clearTimeout(h.timer); if (h.held) setPaused(false); } };
  const toggleMute = (e) => {
    e.stopPropagation();
    const v = !muted;
    RcAudio.setMuted(v); setMutedState(v);
    if (!v) { RcAudio.unlock(); RcAudio.start(); }
  };
  const tapSound = (e) => { e.stopPropagation(); RcAudio.unlock(); RcAudio.start(); setNeedTap(false); };
  const replay = () => {
    RcAudio.unlock(); RcAudio.start();
    clocks.current = {};
    setPrev(null); setI(0); setRun((r) => r + 1);
  };

  const layers = [prev && !(prev.idx === i && prev.run === run) ? { idx: prev.idx, run: prev.run, cur: false } : null, { idx: i, run, cur: true }].filter(Boolean);
  const grain = rcGrain();
  return (
    <div role="dialog" aria-modal="true" aria-label={ar ? 'ملخص الرحلة' : 'Trip recap'} dir={ar ? 'rtl' : 'ltr'}
      className={['rc-root', reduce ? 'rc-reduce' : '', paused ? 'rc-paused' : ''].join(' ')} style={{
        position: 'absolute', inset: 0, zIndex: 200, background: '#060607', overflow: 'hidden',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation', '--rc-accent': d.accent,
      }}>
      <style>{RC_CSS}</style>
      <RcBackdrop d={d} sharp={!!cur.sharp} glow={!!cur.glow} end={!cur.dur} />
      <div key={`unveil-${run}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#060607', pointerEvents: 'none', animation: 'rc-unveil 1600ms ease 150ms both' }} />
      {layers.map((l) => {
        const S = scenes[l.idx];
        const first = l.cur && l.idx === 0;
        return (
          <div key={`${l.run}-${l.idx}`} aria-hidden={l.cur ? undefined : 'true'} className={l.cur ? 'rc-in' : 'rc-out'} style={{
            position: 'absolute', inset: 0, zIndex: l.cur ? 2 : 1, pointerEvents: l.cur ? undefined : 'none',
            animation: l.cur ? (first ? 'rc-op 1200ms ease both' : 'rc-scene-in 950ms var(--rc-ease) 140ms both') : 'rc-scene-out 560ms cubic-bezier(.4,0,1,1) both',
          }}>
            <S.el d={d} dur={S.dur || 9000} clock={clockOf(`${l.run}-${l.idx}`)} sfx={sfx} onReplay={replay} onClose={onClose} />
          </div>
        );
      })}

      {/* film: a soft vignette and a little grain over everything */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(130% 95% at 50% 45%, transparent 58%, rgba(0,0,0,.42) 100%)' }} />
      {grain && <div className="rc-loop" style={{ position: 'absolute', inset: '-60%', zIndex: 4, pointerEvents: 'none', opacity: 0.5, backgroundImage: `url(${grain})`, animation: 'rc-grain 900ms steps(5) infinite' }} />}

      {cur.dur > 0 && (
        <div onPointerDown={down} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel}
          style={{ position: 'absolute', inset: 0, zIndex: 5 }} />
      )}

      {/* progress, sound, close */}
      <div style={{
        position: 'absolute', insetInline: 0, top: 0, zIndex: 10,
        padding: 'calc(var(--rc-sat) + 10px) 14px 14px',
        background: 'linear-gradient(180deg, rgba(0,0,0,.38), transparent)', pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {scenes.map((s, k) => (
            <div key={s.key} style={{ flex: 1, height: 2, borderRadius: 2, background: 'rgba(255,255,255,.24)', overflow: 'hidden' }}>
              <div ref={(el) => { fills.current[k] = el; }} style={{
                height: '100%', borderRadius: 2, background: 'rgba(255,255,255,.92)',
                transformOrigin: ar ? '100% 50%' : '0 50%', transform: `scaleX(${k < i ? 1 : 0})`,
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span className="wordmark" style={{ fontSize: 19, fontWeight: 400, opacity: 0.9 }}>voyage</span>
            {paused && <span style={{ fontSize: 12.5, color: 'var(--rc-fg2)' }}>{ar ? 'موقوف' : 'Paused'}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto', alignItems: 'center' }}>
            {needTap && !muted && (
              <button onClick={tapSound} className="rc-glass" style={{ height: 34, padding: '0 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                {ar ? 'اضغط للصوت' : 'Tap for sound'}
              </button>
            )}
            <button onClick={toggleMute} aria-label={muted ? (ar ? 'شغّل الصوت' : 'Sound on') : (ar ? 'اكتم الصوت' : 'Mute')} className="rc-glass" style={_rcRound}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="#fff" />
                {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <><path d="M15.5 8.5a5 5 0 010 7" /><path d="M18.5 5.5a9 9 0 010 13" /></>}
              </svg>
            </button>
            <button onClick={onClose} aria-label={ar ? 'إغلاق' : 'Close'} className="rc-glass" style={_rcRound}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const _rcRound = { width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center', padding: 0 };

// ── Host + opener ──────────────────────────────────────────────────
function RecapHost() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener('voyage:recap', on);
    return () => window.removeEventListener('voyage:recap', on);
  }, []);
  if (!open) return null;
  return <TripRecap onClose={() => setOpen(false)} />;
}

window.openRecap = (tripId) => {
  RcAudio.unlock();                                    // inside the tap: lets the sound play on iPhone
  const id = tripId || window.TRIP?.id;
  if (!id) return;
  const ready = () => window.TRIP?.id === id && window.isTripDataReady?.(id);
  if (ready()) { window.dispatchEvent(new Event('voyage:recap')); return; }
  window.navigateRoute?.({ scope: 'trip', name: 'hub', tripId: id });
  let n = 0;
  const iv = setInterval(() => {
    if (ready()) { clearInterval(iv); window.dispatchEvent(new Event('voyage:recap')); }
    else if (++n > 75) clearInterval(iv);
  }, 200);
};

// ── The share image: a 1080×1350 poster drawn on a canvas ─────────
window.renderRecapImage = async function renderRecapImage(d, noPhoto) {
  const { ar, trip, m } = d;
  const W = 1080, H = 1350, P = 80;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await document.fonts?.ready; } catch (_) {}
  const SANS = '"Geist", "IBM Plex Sans Arabic", "Tajawal", system-ui, sans-serif';
  const SERIF = ar ? '"Markazi Text", "Instrument Serif", Georgia, serif' : '"Instrument Serif", "Markazi Text", Georgia, serif';
  const S = ar ? W - P : P;
  const text = (str, px, weight, color, xx, yy, opt = {}) => {
    x.font = `${opt.italic ? 'italic ' : ''}${weight} ${px}px ${opt.serif ? SERIF : SANS}`;
    x.fillStyle = color; x.direction = opt.dir || (ar ? 'rtl' : 'ltr');
    x.textAlign = opt.align || 'start'; x.textBaseline = 'alphabetic';
    x.fillText(String(str), xx, yy, opt.maxW);
    return x.measureText(String(str)).width;
  };

  // the cover, full bleed, falling into night
  x.fillStyle = '#060607'; x.fillRect(0, 0, W, H);
  let photo = false;
  const url = !noPhoto && (trip.coverUrl || trip.coverImageUrl);
  if (url) {
    try {
      const img = await new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = url; });
      const s = Math.max(W / img.width, H / img.height);
      x.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
      photo = true;
    } catch (_) {}
  }
  if (!photo) {
    const [a, b] = RC_PRESET[trip.cover] || RC_PRESET.kyoto;
    const g = x.createLinearGradient(0, 0, W * 0.5, H * 0.75); g.addColorStop(0, a); g.addColorStop(1, b);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const sun = x.createRadialGradient(W * 0.72, 300, 10, W * 0.72, 300, 380);
    sun.addColorStop(0, 'rgba(255,236,214,0.45)'); sun.addColorStop(1, 'rgba(255,236,214,0)');
    x.fillStyle = sun; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(10,12,22,0.32)';                     // two quiet ridges
    x.beginPath(); x.moveTo(0, 620); x.lineTo(260, 430); x.lineTo(470, 600); x.lineTo(700, 380); x.lineTo(W, 640); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  }
  const fade = x.createLinearGradient(0, 0, 0, H);
  fade.addColorStop(0, 'rgba(6,6,7,0.55)'); fade.addColorStop(0.2, 'rgba(6,6,7,0.1)'); fade.addColorStop(0.4, 'rgba(6,6,7,0.5)');
  fade.addColorStop(0.6, 'rgba(6,6,7,0.92)'); fade.addColorStop(1, '#060607');
  x.fillStyle = fade; x.fillRect(0, 0, W, H);
  const vig = x.createRadialGradient(W / 2, H * 0.45, H * 0.3, W / 2, H * 0.45, H * 0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.45)');
  x.fillStyle = vig; x.fillRect(0, 0, W, H);
  try {                                                       // a little film grain
    const gc = document.createElement('canvas'); gc.width = 270; gc.height = 338;
    const gx = gc.getContext('2d'); const id = gx.createImageData(270, 338);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 13; }
    gx.putImageData(id, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(gc, 0, 0, W, H); x.imageSmoothingEnabled = true;
  } catch (_) {}

  const fg = '#f5f2ec', fg2 = 'rgba(245,242,236,0.74)', fg3 = 'rgba(245,242,236,0.5)', line = 'rgba(245,242,236,0.18)';
  // top line
  x.font = 'italic 400 54px "Instrument Serif", Georgia, serif'; x.fillStyle = 'rgba(245,242,236,0.92)';
  x.direction = 'ltr'; x.textAlign = 'left'; x.fillText('voyage', P, 118);
  const eye = ar ? 'ملخص الرحلة' : 'TRIP RECAP';
  const ew = text(eye, ar ? 30 : 24, 500, fg2, W - P, 112, { align: 'right' });
  x.fillStyle = d.accent; x.fillRect(W - P - ew - 52, 102, 34, 3);

  // title + dates
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  const tl = [...title].length;
  text(title, tl <= 9 ? 150 : tl <= 15 ? 116 : 86, ar ? 500 : 400, fg, S, 590, { serif: true, italic: !ar, maxW: W - P * 2 });
  text([trip.dates, d.dayWord(d.daysShown), d.members.length > 1 ? d.peopleWord(d.members.length) : null].filter(Boolean).join(' · '), 34, 400, fg2, S, 662, { maxW: W - P * 2 });

  // the hero number
  x.fillStyle = line; x.fillRect(P, 712, W - P * 2, 2);
  text(ar ? 'صرفتوا' : 'Spent', 30, 500, fg3, S, 776);
  x.font = `300 148px ${SANS}`; x.direction = 'ltr';
  const numStr = d.num(m.total), nw = x.measureText(numStr).width;
  const nx = ar ? W - P - nw : P;
  text(numStr, 148, 300, fg, nx, 912, { align: 'left', dir: 'ltr' });
  text(d.curWord, 44, 400, fg2, ar ? nx - 24 : nx + nw + 24, 912, { align: ar ? 'right' : 'left' });

  // a row of figures
  x.fillStyle = line; x.fillRect(P, 968, W - P * 2, 2);
  const stats = rcStats(d);
  const colW = (W - P * 2) / Math.max(1, stats.length);
  stats.forEach(([v, l], k) => {
    const left = ar ? W - P - (k + 1) * colW : P + k * colW;
    const sx = ar ? left + colW - (k ? 32 : 0) : left + (k ? 32 : 0);
    if (k) { x.fillStyle = line; x.fillRect(ar ? left + colW : left, 996, 2, 116); }
    text(String(v), 92, 300, fg, sx, 1078, { dir: 'ltr', align: ar ? 'right' : 'left' });
    text(l, 30, 400, fg3, sx, 1122, { maxW: colW - 40 });
  });

  // two highlights
  rcHighlights(d).forEach((h, k) => {
    const yy = 1200 + k * 50;
    x.fillStyle = d.accent; x.fillRect(ar ? W - P - 10 : P, yy - 18, 10, 10);
    text(h, 31, 400, fg2, ar ? W - P - 30 : P + 30, yy, { maxW: W - P * 2 - 30 });
  });
  text(ar ? 'صُنعت في Voyage' : 'Made with Voyage', 24, 400, 'rgba(245,242,236,0.38)', S, 1310);

  try {
    return await new Promise((res, rej) => c.toBlob((bl) => (bl ? res(bl) : rej(new Error('blob'))), 'image/png'));
  } catch (err) {
    if (photo && !noPhoto) return window.renderRecapImage(d, true);   // the photo blocked export — draw without it
    throw err;
  }
};

Object.assign(window, { TripRecap, RecapHost });
