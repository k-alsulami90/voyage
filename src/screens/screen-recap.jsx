// Trip recap — the trip played back as a short film. Not the app's cards
// and charts again: motion graphics on a dark, grainy screen, a slow camera
// push on every scene, real cuts between them (iris, zoom-through, flash),
// words that rise into place, numbers that roll, and a soft soundtrack.
//   1 the cover, letterboxed, with the trip's name
//   2 the days, counted like a slot machine
//   3 what you spent, rolling — and the budget as an orb filling up
//   4 a plane flying the route across the days, each day a light sized by its spend
//   5 where the money went, as floating bubbles
//   6 the biggest expense, slammed onto the screen
//   7 whose card carried it, on a podium
//   8 the flight as an arc between airports, the nights as moons
//   9 the places, lit up one by one along a path
//  10 a poster to share
// Tap the far side to skip, the near side to go back, hold to pause, swipe
// down to close.  window.openRecap(tripId?) · <RecapHost/>

const RC_CSS = `
@keyframes rc-dolly { from { transform: scale(1); } to { transform: scale(1.07); } }
@keyframes rc-burns { from { transform: scale(1.1) translate3d(1.5%, 1%, 0); } to { transform: scale(1.3) translate3d(-2%, -2.5%, 0); } }
@keyframes rc-grain { 0%{transform:translate(0,0)} 12%{transform:translate(-6%,-9%)} 25%{transform:translate(-13%,4%)} 37%{transform:translate(6%,-19%)} 50%{transform:translate(-5%,18%)} 62%{transform:translate(-14%,8%)} 75%{transform:translate(12%,0)} 87%{transform:translate(1%,13%)} 100%{transform:translate(0,0)} }
@keyframes rc-lb-top { from { transform: translateY(-100%); } to { transform: none; } }
@keyframes rc-lb-bot { from { transform: translateY(100%); } to { transform: none; } }
@keyframes rc-leak { 0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateX(260%) skewX(-18deg); opacity: 0; } }
@keyframes rc-rise { from { transform: translateY(115%); } to { transform: none; } }
@keyframes rc-fadeup { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes rc-track { from { opacity: 0; letter-spacing: .6em; } to { opacity: 1; letter-spacing: .16em; } }
@keyframes rc-slot { from { transform: translateY(0); } to { transform: translateY(var(--to)); } }
@keyframes rc-pop { 0% { opacity: 0; transform: scale(.3); } 60% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
@keyframes rc-float { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -9px, 0); } }
@keyframes rc-flyin { from { opacity: 0; transform: translate3d(var(--fx), var(--fy), 0) scale(.35); } to { opacity: 1; transform: none; } }
@keyframes rc-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes rc-fill { from { transform: translateY(100%); } to { transform: translateY(var(--fill)); } }
@keyframes rc-wave { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes rc-slam { 0% { opacity: 0; transform: scale(2.8); filter: blur(16px); } 55% { opacity: 1; transform: scale(.93); filter: blur(0); } 75% { transform: scale(1.03); } 100% { opacity: 1; transform: scale(1); } }
@keyframes rc-shake { 0%, 100% { transform: none; } 15% { transform: translate(-9px, 5px); } 30% { transform: translate(8px, -6px); } 45% { transform: translate(-6px, 3px); } 60% { transform: translate(5px, -3px); } 80% { transform: translate(-2px, 1px); } }
@keyframes rc-flash { 0% { opacity: 0; } 12% { opacity: .92; } 100% { opacity: 0; } }
@keyframes rc-out { to { opacity: 0; transform: translateY(-14px); } }
@keyframes rc-burst { 0% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); } 100% { opacity: 0; transform: translate(var(--bx), var(--by)) rotate(var(--br)) scale(.6); } }
@keyframes rc-confetti { 0% { opacity: 1; transform: translate(0, 0) rotate(0); } 80% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--cx), var(--cy)) rotate(var(--cr)); } }
@keyframes rc-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes rc-drop { 0% { opacity: 0; transform: translateY(-150px); } 55% { opacity: 1; transform: translateY(8px); } 75% { transform: translateY(-4px); } 100% { opacity: 1; transform: none; } }
@keyframes rc-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: .9; } }
@keyframes rc-streak { from { background-position: 0 0; } to { background-position: -480px 0; } }
@keyframes rc-pulse { 0%, 100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.18); } }
@keyframes rc-bubble { from { transform: translateY(0); opacity: 0; } 15% { opacity: .7; } to { transform: translateY(-220px); opacity: 0; } }
@keyframes rc-coin { 0% { transform: translateY(-120px) rotate(0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(110vh) rotate(540deg); opacity: 1; } }
@keyframes rc-iris { from { clip-path: circle(0% at 50% 50%); -webkit-clip-path: circle(0% at 50% 50%); } to { clip-path: circle(150% at 50% 50%); -webkit-clip-path: circle(150% at 50% 50%); } }
@keyframes rc-zin { from { opacity: 0; transform: scale(.82); } to { opacity: 1; transform: none; } }
@keyframes rc-zout { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(1.45); } }
@keyframes rc-fin { from { opacity: 0; } to { opacity: 1; } }
@keyframes rc-fout { from { opacity: 1; } to { opacity: 0; } }
@keyframes rc-dim { from { opacity: 1; } to { opacity: .35; } }
.rc-rise   { display: inline-block; animation: rc-rise 800ms cubic-bezier(.2,.9,.2,1) both; }
.rc-fadeup { animation: rc-fadeup 750ms cubic-bezier(.2,.8,.2,1) both; }
.rc-track  { animation: rc-track 1400ms cubic-bezier(.2,.8,.2,1) both; }
.rc-pop    { animation: rc-pop 700ms cubic-bezier(.3,.7,.4,1) both; }
.rc-paused, .rc-paused * { animation-play-state: paused !important; }
.rc-reduce * { animation-duration: 1ms !important; animation-delay: 0ms !important; transition-duration: 1ms !important; transition-delay: 0ms !important; }
.rc-reduce .rc-loop { animation: none !important; }
`;

const _rcFull = { position: 'absolute', inset: 0, overflow: 'hidden' };
const _rcRand = (s) => { const x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
const _rcCatName = (k) => window.CAT_META?.[k]?.[window.isRTL ? 'label_ar' : 'label_en'] || (window.catLabel ? window.catLabel(k) : k);
const _rcCatHex = { culture: '#3d8bff', lodging: '#ff6a3d', transit: '#22c38a', food: '#ffb020', shopping: '#ff5fa2', wellness: '#9b8cff', misc: '#a29d94' };
const _rcKicker = { fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.72)' };

// Arabic counted nouns the way people say them ("3 أيام", "11 يوم").
const _rcNoun = (n, ar, forms) => (ar ? (n === 1 ? forms[0] : n === 2 ? forms[1] : n <= 10 ? forms[2] : forms[3]) : (n === 1 ? forms[4] : forms[5]));
const _rcDays   = (n, ar) => _rcNoun(n, ar, ['يوم', 'يومين', 'أيام', 'يوم', 'day', 'days']);
const _rcPlaces = (n, ar) => _rcNoun(n, ar, ['مكان', 'مكانين', 'أماكن', 'مكان', 'place', 'places']);
const _rcNights = (n, ar) => _rcNoun(n, ar, ['ليلة', 'ليلتين', 'ليالٍ', 'ليلة', 'night', 'nights']);

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
  const payers = members
    .map((mm) => ({ m: mm, v: expenses.filter((e) => e.who === mm.id).reduce((s, e) => s + (e.usd || 0), 0) }))
    .filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
  const docs = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((x) => !x.ownerUserId || x.ownerUserId === window.currentUserId);
  const day = (v) => String(v || '').slice(0, 10);
  const flights = docs.filter((x) => x.category === 'flights' && x.details?.dep_airport && x.details?.arr_airport)
    .sort((a, b) => String(a.details.dep_at || '').localeCompare(String(b.details.dep_at || '')));
  const stays = docs.filter((x) => x.category === 'lodging');
  const nights = stays.reduce((s, x) => {
    const a = x.details?.check_in_at, b = x.details?.check_out_at;
    return a && b ? s + Math.max(0, Math.round((new Date(day(b)) - new Date(day(a))) / 86400000)) : s;
  }, 0);
  const rides = docs.filter((x) => x.category === 'transport');
  const plan = (window.ITINERARY || []).slice()
    .sort((a, b) => String(a.dayDate || '').localeCompare(String(b.dayDate || '')) || String(a.startTime || '').localeCompare(String(b.startTime || '')));
  const spentDays = m.days.filter((x) => x.v > 0);
  const calm = spentDays.length > 1 ? spentDays.reduce((a, x) => (x.v < a.v ? x : a), spentDays[0]) : null;
  const daysShown = m.ended ? m.totalDays : (m.daysSoFar || 0);
  const dayWord = (n) => `${n} ${_rcDays(n, ar)}`;
  const peopleWord = (n) => (ar ? window.arPlural(n, { one: 'مسافر واحد', two: 'مسافرين', few: `${n} مسافرين`, many: `${n} مسافراً`, other: `${n} مسافر` }) : `${n} ${n === 1 ? 'traveller' : 'travellers'}`);
  const cur = (trip.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD').toUpperCase();
  const curWord = ar ? ({ SAR: 'ريال', AED: 'درهم', KWD: 'دينار', BHD: 'دينار', USD: 'دولار', EUR: 'يورو', GBP: 'جنيه', EGP: 'جنيه', TRY: 'ليرة', JPY: 'ين', MAD: 'درهم', CHF: 'فرنك', INR: 'روبية', IDR: 'روبية' }[cur] || cur) : cur;
  const num = (usd) => (String(fmt(usd)).match(/[\d.,]+/) || ['0'])[0];
  return { ar, trip, expenses, m, fmt, num, curWord, members, wallets, cats, biggest, payers, docs, flights, stays, nights, rides, plan, calm, daysShown, dayWord, peopleWord };
}

// ── Small pieces of the film ───────────────────────────────────────
// Words rise into place from behind a mask, one after another. In Arabic,
// a run of Latin words and numbers ("Hotel Galata", "SAR 5,565", "5 – 14")
// moves as one piece and keeps its left-to-right order.
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
function RcWords({ text, delay = 0, stagger = 80, dur = 800, cls = 'rc-rise' }) {
  const toks = rcTokens(text);
  return (
    <>
      {toks.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', padding: '0.12em 0.04em 0.22em', margin: '-0.12em -0.04em -0.22em', ...(w.ltr ? { direction: 'ltr', unicodeBidi: 'isolate' } : null) }}>
            <span className={cls} style={{ animationDelay: `${delay + i * stagger}ms`, animationDuration: `${dur}ms` }}>{w.t}</span>
          </span>
          {i < toks.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
}

// An odometer: each digit spins into place, the last ones longest.
function RcOdometer({ text, delay = 300, dur = 1700 }) {
  const ref = React.useRef(null);
  const chars = String(text).split('');
  const digits = chars.filter((c) => /\d/.test(c)).length;
  React.useEffect(() => {
    const t = setTimeout(() => {
      ref.current?.querySelectorAll('[data-d]').forEach((el) => { el.style.transform = `translateY(-${(10 + Number(el.dataset.d)) * 5}%)`; });
    }, delay);
    return () => clearTimeout(t);
  }, [text]);
  let k = 0;
  return (
    <span ref={ref} style={{ display: 'inline-flex', direction: 'ltr', unicodeBidi: 'isolate', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i} style={{ whiteSpace: 'pre' }}>{c}</span>;
        const idx = k++;
        return (
          <span key={i} style={{ display: 'inline-block', height: '1em', overflow: 'hidden' }}>
            <span data-d={c} style={{ display: 'flex', flexDirection: 'column', transition: `transform ${dur + idx * 120}ms cubic-bezier(.12,.8,.2,1)` }}>
              {Array.from({ length: 20 }, (_, j) => <span key={j} style={{ height: '1em', lineHeight: 1 }}>{j % 10}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

// The slow push-in every scene gets — the screen never stands still.
function RcCam({ dur, children }) {
  return <div style={{ ..._rcFull, overflow: 'visible', animation: `rc-dolly ${dur + 1500}ms linear both` }}>{children}</div>;
}

function RcLetterbox({ delay = 0 }) {
  const bar = { position: 'absolute', insetInline: 0, height: '8.5%', background: '#000', zIndex: 4 };
  return (
    <>
      <div style={{ ...bar, top: 0, animation: `rc-lb-top 900ms ${delay}ms cubic-bezier(.2,.8,.2,1) both` }} />
      <div style={{ ...bar, bottom: 0, animation: `rc-lb-bot 900ms ${delay}ms cubic-bezier(.2,.8,.2,1) both` }} />
    </>
  );
}

function RcGlow({ color, x, y, size = 560, dur = 11 }) {
  return (
    <div className="rc-loop" style={{
      position: 'absolute', left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
      borderRadius: '50%', background: `radial-gradient(closest-side, ${color}, transparent)`,
      animation: `rc-float ${dur}s ease-in-out infinite`, pointerEvents: 'none',
    }} />
  );
}

function RcStars({ n = 60, seed = 1 }) {
  return (
    <div style={{ ..._rcFull, pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k) => _rcRand(seed * 97 + i * 13 + k);
        const s = 1 + r(3) * 2.2;
        return <span key={i} className="rc-loop" style={{
          position: 'absolute', left: `${r(1) * 100}%`, top: `${r(2) * 75}%`, width: s, height: s, borderRadius: 9,
          background: '#fff', animation: `rc-twinkle ${2.2 + r(4) * 3}s ${r(5) * 3}s ease-in-out infinite`,
        }} />;
      })}
    </div>
  );
}

function RcConfetti({ n = 34, delay = 0, x = '50%', y = '42%', seed = 3 }) {
  const colors = ['#ffd166', '#ff6a3d', '#22c38a', '#3d8bff', '#ff5fa2', '#ffffff'];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: 6, pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k) => _rcRand(seed * 31 + i * 7 + k);
        const ang = r(1) * Math.PI * 2, dist = 120 + r(2) * 220;
        return <span key={i} style={{
          position: 'absolute', width: 6 + r(3) * 6, height: 10 + r(4) * 8, borderRadius: 2,
          background: colors[i % colors.length],
          '--cx': `${Math.cos(ang) * dist}px`, '--cy': `${Math.sin(ang) * dist * 0.6 + 260 + r(5) * 200}px`, '--cr': `${(r(6) - 0.5) * 900}deg`,
          animation: `rc-confetti ${1500 + r(7) * 900}ms ${delay + r(8) * 120}ms cubic-bezier(.15,.6,.3,1) both`,
        }} />;
      })}
    </div>
  );
}

// A smooth line through points (Catmull-Rom → Bézier).
function rcPath(pts) {
  if (!pts.length) return '';
  let s = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    s += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return s;
}
const _rcPlane = 'M15,0 L4,-3 L-2,-14 L-6,-14 L-3,-3 L-10,-3 L-13,-8 L-16,-8 L-14,0 L-16,8 L-13,8 L-10,3 L-3,3 L-6,14 L-2,14 L4,3 Z';
const _rcCompact = (usd) => {
  const v = (usd || 0) * (window.fxRate ? window.fxRate(window.TRIP?.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD') : 1);
  return v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(Math.round(v));
};

// ── The scenes ─────────────────────────────────────────────────────
function RcOpen({ d, dur }) {
  const { ar, trip, m, members } = d;
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  const size = title.length <= 9 ? 80 : title.length <= 15 ? 62 : 46;
  const meta = [trip.dates, m.totalDays ? d.dayWord(m.totalDays) : null, members.length > 1 ? d.peopleWord(members.length) : null].filter(Boolean).join(' · ');
  return (
    <div style={{ ..._rcFull, background: '#050608', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: '-8%', animation: `rc-burns ${dur + 1200}ms cubic-bezier(.3,.1,.3,1) both` }}>
        <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={trip.coverUrl || trip.coverImageUrl} />
      </div>
      <div style={{ ..._rcFull, background: 'linear-gradient(180deg, rgba(4,5,8,.55) 0%, rgba(4,5,8,0) 28%, rgba(4,5,8,.15) 52%, rgba(4,5,8,.96) 100%)' }} />
      <div style={{ position: 'absolute', top: '-25%', bottom: '-25%', left: 0, width: '55%', mixBlendMode: 'screen', pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(255,176,104,.45), rgba(255,236,200,.22), transparent)', animation: 'rc-leak 3200ms 350ms ease-in-out both' }} />
      <RcLetterbox />
      <div style={{ position: 'absolute', insetInline: 28, bottom: '15%', zIndex: 5 }}>
        <div className={ar ? 'rc-fadeup' : 'rc-track'} style={{ animationDelay: '500ms', ..._rcKicker, letterSpacing: ar ? 0 : '.16em', textTransform: ar ? 'none' : 'uppercase', fontSize: ar ? 16 : 12.5 }}>
          {ar ? 'ملخص رحلتكم' : 'A trip to remember'}
        </div>
        <div className="serif-italic" style={{ fontSize: size, lineHeight: 1.02, marginTop: 10, textShadow: '0 8px 50px rgba(0,0,0,.55)' }}>
          <RcWords text={title} delay={900} stagger={160} dur={1100} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,.85)', marginTop: 16 }}>
          <RcWords text={meta} delay={1800} stagger={40} dur={700} />
        </div>
      </div>
    </div>
  );
}

function RcCount({ d, dur, sfx }) {
  const { ar, m, trip, members } = d;
  const n = Math.max(1, d.daysShown);
  const nums = Array.from({ length: n }, (_, k) => k + 1);
  React.useEffect(() => { if (n > 1) sfx('ticks', 350, Math.min(n, 30)); }, []);
  const region = (c) => { if (/^[A-Za-z]{2}$/.test(c || '')) { try { return new Intl.DisplayNames([ar ? 'ar' : 'en'], { type: 'region' }).of(String(c).toUpperCase()); } catch (_) {} } return c; };
  const lines = [members.length > 1 ? d.peopleWord(members.length) : null, (trip.countries || []).length ? trip.countries.map(region).join(' · ') : null].filter(Boolean).join(' · ');
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(120% 80% at 50% 42%, #1b2466 0%, #070912 72%)', color: '#fff' }}>
      <div className="rc-loop" style={{ position: 'absolute', inset: '-10%', opacity: .85, backgroundSize: '480px 480px', animation: 'rc-streak 700ms linear infinite, rc-fout 1600ms 1800ms ease-out forwards',
        backgroundImage: 'repeating-linear-gradient(100deg, transparent 0 52px, rgba(140,160,255,.13) 52px 54px, transparent 54px 130px)' }} />
      <RcCam dur={dur}>
        <div style={{ ..._rcFull, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div className="rc-fadeup" style={{ animationDelay: '100ms', ..._rcKicker }}>{m.ended ? (ar ? 'رحلتكم كانت' : 'Your trip ran') : (ar ? 'لين الحين' : 'So far')}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14, marginTop: 4 }}>
            <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', fontSize: 172, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', direction: 'ltr', filter: 'drop-shadow(0 0 28px rgba(120,140,255,.6))' }}>
              <span style={{ display: 'flex', flexDirection: 'column', '--to': `${-((n - 1) * 100) / n}%`, animation: `rc-slot 1900ms 300ms cubic-bezier(.12,.75,.18,1) both` }}>
                {nums.map((k) => <span key={k} style={{ height: '1em' }}>{k}</span>)}
              </span>
            </span>
            <span style={{ fontSize: 46, fontWeight: 800 }}><RcWords text={_rcDays(n, ar)} delay={2050} /></span>
          </div>
          {lines && <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,.8)', marginTop: 22 }}><RcWords text={lines} delay={2500} stagger={60} /></div>}
        </div>
      </RcCam>
    </div>
  );
}

function RcMoney({ d, dur, sfx }) {
  const { ar, m, fmt } = d;
  const planned = m.planned, over = planned > 0 && m.total > planned;
  const pct = planned > 0 ? Math.min(1, m.total / planned) : 0;
  const left = planned - m.total;
  React.useEffect(() => { if (over) sfx('boom', 3200); }, []);
  const verdict = planned > 0
    ? (over ? (ar ? `تجاوزتوا الميزانية بـ ${fmt(-left)}` : `${fmt(-left)} over budget`)
      : m.ended ? (ar ? `وبقى ${fmt(left)} 🎉` : `${fmt(left)} to spare 🎉`) : (ar ? `وباقي ${fmt(left)}` : `${fmt(left)} still to go`))
    : (m.avg > 0 ? (ar ? `بمعدل ${fmt(m.avg)} لليوم` : `${fmt(m.avg)} a day`) : null);
  const liquid = over ? ['#ff8a66', '#c02a1e'] : ['#ffd27a', '#e47a2e'];
  const wave = (fill, op, speed) => (
    <svg className="rc-loop" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ position: 'absolute', top: -22, left: 0, width: '200%', height: 24, opacity: op, animation: `rc-wave ${speed}s linear infinite` }}>
      <path d="M0,12 C50,0 100,24 150,12 C200,0 250,24 300,12 C350,0 400,24 400,12 L400,24 L0,24 Z" fill={fill} />
    </svg>
  );
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(110% 70% at 50% 60%, #2a1a10 0%, #0b0a0f 70%)', color: '#fff' }}>
      <RcGlow color={over ? 'rgba(220,60,40,.35)' : 'rgba(255,170,80,.28)'} x="50%" y="62%" size={620} />
      {planned <= 0 && Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="rc-loop" style={{ position: 'absolute', left: `${_rcRand(i + 5) * 92}%`, top: 0, fontSize: 22 + _rcRand(i + 9) * 16,
          animation: `rc-coin ${2600 + _rcRand(i + 2) * 1800}ms ${_rcRand(i + 7) * 2600}ms linear infinite` }}>🪙</span>
      ))}
      <RcCam dur={dur}>
        <div style={{ ..._rcFull, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 22px' }}>
          <div style={{ ..._rcKicker, fontSize: 17 }}><RcWords text={ar ? 'صرفتوا في هالرحلة' : 'Together you spent'} delay={150} /></div>
          <div className="rc-fadeup" style={{ animationDelay: '350ms', fontSize: String(fmt(m.total)).length > 11 ? 46 : 58, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 10, textShadow: '0 0 50px rgba(255,180,90,.35)' }}>
            <RcOdometer text={fmt(m.total)} delay={450} />
          </div>
          {planned > 0 && (
            <div className="rc-pop" style={{ animationDelay: '900ms', position: 'relative', width: 214, height: 214, marginTop: 30 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,.05)', boxShadow: `inset 0 0 0 2px rgba(255,255,255,.22), 0 0 60px ${over ? 'rgba(255,90,60,.45)' : 'rgba(255,190,100,.25)'}` }}>
                <div style={{ position: 'absolute', inset: 0, '--fill': `${(1 - pct) * 100}%`, animation: `rc-fill 2600ms 1100ms cubic-bezier(.3,.55,.2,1) both` }}>
                  {wave(liquid[0], .55, 3.2)}{wave(liquid[0], 1, 2.1)}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${liquid[0]}, ${liquid[1]})` }} />
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="rc-loop" style={{ position: 'absolute', bottom: 8, left: `${12 + _rcRand(i + 30) * 76}%`, width: 5 + _rcRand(i + 40) * 6, height: 5 + _rcRand(i + 40) * 6,
                      borderRadius: 9, border: '1.5px solid rgba(255,255,255,.55)', animation: `rc-bubble ${2200 + _rcRand(i + 50) * 1600}ms ${1600 + _rcRand(i + 60) * 1800}ms ease-in infinite` }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', inset: '9%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 32%)', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 40, fontWeight: 900, textShadow: '0 2px 18px rgba(0,0,0,.55)' }}>
                <span className="rc-fadeup" style={{ animationDelay: '2600ms' }}>{Math.round((m.total / planned) * 100)}%</span>
              </div>
            </div>
          )}
          {planned > 0 && (
            <div className="rc-fadeup" style={{ animationDelay: '2900ms', fontSize: 14.5, color: 'rgba(255,255,255,.65)', marginTop: 14 }}>
              {ar ? `من ميزانية ${fmt(planned)}` : `of a ${fmt(planned)} budget`}
            </div>
          )}
          {verdict && <div style={{ fontSize: 26, fontWeight: 900, marginTop: 18, color: over ? '#ffb39c' : '#fff' }}><RcWords text={verdict} delay={3300} stagger={70} /></div>}
        </div>
      </RcCam>
    </div>
  );
}

// A plane flies the route; every day lights up as it passes, sized by its spend.
function RcJourney({ d, dur, sfx }) {
  const { ar, m, fmt, calm } = d;
  const days = m.days;
  const n = days.length;
  const root = React.useRef(null);
  const motion = React.useRef(null);
  const plane = React.useRef(null);
  const [vw, setVw] = React.useState(402);
  React.useLayoutEffect(() => { if (root.current) setVw(root.current.clientWidth || 402); }, []);
  const gap = 150, pad = 110, H = 380;
  const W = pad * 2 + (n - 1) * gap;
  const pts = days.map((_, i) => {
    const x = pad + i * gap;
    return [ar ? W - x : x, Math.round(190 + 78 * Math.sin(i * 1.3 + 0.7))];
  });
  const dpath = rcPath(pts);
  const max = Math.max(...days.map((x) => x.v), 1);
  const peak = m.peak;
  const T = Math.min(5200, Math.max(2600, n * 520));
  const t0 = 700;
  const startX = vw / 2 - pts[0][0], endX = vw / 2 - pts[n - 1][0];
  const fits = W <= vw;
  const fx0 = fits ? (vw - W) / 2 : startX, fx1 = fits ? (vw - W) / 2 : endX;
  React.useEffect(() => {
    const t = setTimeout(() => { try { motion.current?.beginElement(); if (plane.current) plane.current.style.opacity = 1; } catch (_) {} }, t0);
    days.forEach((x, i) => { if (x.v > 0) sfx('pop', t0 + (n > 1 ? (i / (n - 1)) * T : 0)); });
    return () => clearTimeout(t);
  }, []);
  const pid = React.useRef('rcj' + Math.random().toString(36).slice(2, 8)).current;
  return (
    <div ref={root} style={{ ..._rcFull, background: 'radial-gradient(130% 80% at 50% 30%, #13233f 0%, #06080f 70%)', color: '#fff' }}>
      <RcStars n={45} seed={7} />
      <RcCam dur={dur}>
        <div style={{ position: 'absolute', insetInline: 26, top: '15%', textAlign: 'start' }}>
          <div style={{ ..._rcKicker, fontSize: 16 }}><RcWords text={ar ? 'رحلتكم يوم بيوم' : 'Day by day'} delay={100} /></div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.55)', marginTop: 6 }} className="rc-fadeup">{ar ? 'كل نقطة يوم — وكبرها على قد صرفه' : 'Each light is a day — sized by its spend'}</div>
        </div>
        <div style={{ position: 'absolute', top: '50%', marginTop: -H / 2, height: H, width: W, left: 0,
          '--x0': `${fx0}px`, '--x1': `${fx1}px`, transform: `translateX(${fx0}px)`,
          animation: fits ? 'none' : `rc-pan ${T}ms ${t0}ms linear both` }}>
          <style>{`@keyframes rc-pan { from { transform: translateX(var(--x0)); } to { transform: translateX(var(--x1)); } }`}</style>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
            <defs>
              <radialGradient id={pid + 'g'}><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset=".35" stopColor="#ffd27a" stopOpacity=".9" /><stop offset="1" stopColor="#ff8a3d" stopOpacity="0" /></radialGradient>
              <radialGradient id={pid + 'h'}><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset=".35" stopColor="#ff9b7a" stopOpacity=".95" /><stop offset="1" stopColor="#ff3d2e" stopOpacity="0" /></radialGradient>
            </defs>
            <path id={pid} d={dpath} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
            <path d={dpath} fill="none" stroke="rgba(255,214,140,.9)" strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1"
              style={{ strokeDashoffset: 1, animation: `rc-draw ${T}ms ${t0}ms linear both` }} />
            {days.map((x, i) => {
              const [cx, cy] = pts[i];
              const r = x.v > 0 ? 10 + 30 * Math.sqrt(x.v / max) : 5;
              const hot = peak && x.k === peak.k && x.v > 0;
              const isCalm = calm && x.k === calm.k;
              const at = t0 + (n > 1 ? (i / (n - 1)) * T : 0);
              return (
                <g key={x.k} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `rc-pop 650ms ${at}ms cubic-bezier(.3,.7,.4,1) both` }}>
                  {x.v > 0 && <circle cx={cx} cy={cy} r={r * 2.1} fill={`url(#${pid}${hot ? 'h' : 'g'})`} opacity=".55" />}
                  <circle cx={cx} cy={cy} r={r} fill={x.v > 0 ? `url(#${pid}${hot ? 'h' : 'g'})` : 'rgba(255,255,255,.35)'} />
                  <text x={cx} y={cy + Math.max(r, 10) + 26} textAnchor="middle" fontSize="15" fontWeight="700" fill="rgba(255,255,255,.75)" style={{ direction: ar ? 'rtl' : 'ltr', unicodeBidi: 'plaintext' }}>
                    {ar ? `اليوم ${x.i}` : `Day ${x.i}`}
                  </text>
                  {x.v > 0 && (
                    <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize={hot ? 19 : 14} fontWeight="800" fill={hot ? '#ffb39c' : 'rgba(255,255,255,.9)'} style={{ direction: 'ltr' }}>
                      {hot ? '🔥 ' : isCalm ? '🌿 ' : ''}{_rcCompact(x.v)}
                    </text>
                  )}
                </g>
              );
            })}
            <g ref={plane} style={{ opacity: 0 }}>
              <path d={_rcPlane} fill="#fff" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,.8))' }} />
              <animateMotion ref={motion} begin="indefinite" dur={`${T / 1000}s`} fill="freeze" rotate="auto" calcMode="linear">
                <mpath href={`#${pid}`} xlinkHref={`#${pid}`} />
              </animateMotion>
            </g>
          </svg>
        </div>
        {peak && peak.v > 0 && (
          <div style={{ position: 'absolute', insetInline: 26, bottom: '15%', fontSize: 19, fontWeight: 800, lineHeight: 1.5 }}>
            <div><RcWords text={`🔥 ${ar ? 'أغلى يوم: اليوم' : 'Biggest day: Day'} ${peak.i} · ${fmt(peak.v)}`} delay={t0 + T + 200} stagger={50} /></div>
            {calm && <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 16 }}><RcWords text={`🌿 ${ar ? 'أهدى يوم: اليوم' : 'Calmest: Day'} ${calm.i} · ${fmt(calm.v)}`} delay={t0 + T + 600} stagger={50} /></div>}
          </div>
        )}
      </RcCam>
    </div>
  );
}

// Where the money went — bubbles sized by what each category took.
function rcPack(radii, maxW, maxH) {
  const placed = [];
  radii.forEach((r, k) => {
    if (!k) { placed.push({ x: 0, y: 0, r }); return; }
    let best = null;
    placed.forEach((p) => {
      for (let a = 0; a < 360; a += 10) {
        const t = (a * Math.PI) / 180, x = p.x + Math.cos(t) * (p.r + r + 10), y = p.y + Math.sin(t) * (p.r + r + 10);
        if (placed.every((q) => Math.hypot(q.x - x, q.y - y) >= q.r + r + 9)) {
          const dist = Math.hypot(x * 0.9, y * 1.25);
          if (!best || dist < best.dist) best = { x, y, dist };
        }
      }
    });
    placed.push({ x: best ? best.x : 0, y: best ? best.y : 0, r });
  });
  const minX = Math.min(...placed.map((p) => p.x - p.r)), maxX = Math.max(...placed.map((p) => p.x + p.r));
  const minY = Math.min(...placed.map((p) => p.y - p.r)), maxY = Math.max(...placed.map((p) => p.y + p.r));
  const s = Math.min(1, maxW / (maxX - minX), maxH / (maxY - minY));
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  return placed.map((p) => ({ x: (p.x - cx) * s, y: (p.y - cy) * s, r: p.r * s }));
}

function RcBubbles({ d, dur, sfx }) {
  const { ar, m, cats } = d;
  const list = cats.slice(0, 7);
  const max = list[0][1] || 1;
  const placed = rcPack(list.map(([, v]) => 30 + 92 * Math.sqrt(v / max)), 350, 330);
  const [topK, topV] = list[0];
  const share = Math.round((topV / (m.total || 1)) * 100);
  React.useEffect(() => { list.forEach((_, i) => sfx('pop', 550 + i * 170)); }, []);
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(120% 80% at 50% 55%, #1a1230 0%, #07060c 72%)', color: '#fff' }}>
      <RcGlow color={`${_rcCatHex[topK] || '#ff6a3d'}55`} x="50%" y="56%" size={640} />
      <RcCam dur={dur}>
        <div style={{ position: 'absolute', insetInline: 24, top: '14%', textAlign: 'center' }}>
          <div style={{ ..._rcKicker, fontSize: 17 }}><RcWords text={ar ? 'وين راحت الفلوس؟' : 'Where did it all go?'} delay={100} /></div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '53%', width: 0, height: 0 }}>
          {placed.map((p, i) => {
            const [k, v] = list[i];
            const c = _rcCatHex[k] || '#a29d94';
            const ang = _rcRand(i + 11) * Math.PI * 2;
            return (
              <div key={k} style={{ position: 'absolute', left: p.x - p.r, top: p.y - p.r, width: p.r * 2, height: p.r * 2,
                '--fx': `${Math.cos(ang) * 420}px`, '--fy': `${Math.sin(ang) * 520}px`,
                animation: `rc-flyin 1000ms ${500 + i * 170}ms cubic-bezier(.2,.9,.25,1.12) both` }}>
                <div className="rc-loop" style={{ width: '100%', height: '100%', animation: `rc-float ${3 + _rcRand(i + 3) * 2}s ${1600 + i * 120}ms ease-in-out infinite` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,.6), ${c} 44%, ${c}cc 75%, ${c}88 100%)`,
                    boxShadow: `0 0 ${p.r * 0.9}px ${c}66, inset 0 -${p.r * 0.18}px ${p.r * 0.4}px rgba(0,0,0,.25)` }}>
                    <span style={{ fontSize: p.r * 0.62, lineHeight: 1 }}>{window.CAT_META?.[k]?.emoji || '💸'}</span>
                    {p.r >= 44 && <span style={{ fontSize: Math.max(12, p.r * 0.26), fontWeight: 900, marginTop: p.r * 0.06, textShadow: '0 1px 6px rgba(0,0,0,.35)' }}>{Math.round((v / (m.total || 1)) * 100)}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', insetInline: 24, bottom: '12%', textAlign: 'center', fontSize: 27, fontWeight: 900, lineHeight: 1.3 }}>
          <RcWords text={ar ? `${_rcCatName(topK)} أخذت ${share}%` : `${_rcCatName(topK)} took ${share}%`} delay={600 + list.length * 170 + 500} stagger={90} />
        </div>
      </RcCam>
    </div>
  );
}

function RcBig({ d, dur, sfx }) {
  const { ar, m, fmt, biggest: e, wallets } = d;
  const who = (d.members.find((x) => x.id === e.who)?.name || '').split(' ')[0];
  const share = m.total ? Math.round(((e.usd || 0) / m.total) * 100) : 0;
  const HIT = 1500;
  React.useEffect(() => { sfx('boom', HIT); }, []);
  const c = _rcCatHex[e.cat] || '#ffb020';
  return (
    <div style={{ ..._rcFull, background: '#060507', color: '#fff' }}>
      <div style={{ ..._rcFull, background: `radial-gradient(90% 60% at 50% 48%, ${c}40 0%, transparent 70%)`, opacity: 0, animation: `rc-fin 900ms ${HIT}ms ease-out forwards` }} />
      <div style={{ ..._rcFull, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, animation: `rc-out 280ms ${HIT - 180}ms ease-in forwards` }}>
        <span><RcWords text={ar ? 'وأغلى شي...' : 'And the big one...'} delay={150} stagger={160} dur={700} /></span>
      </div>
      <div style={{ ..._rcFull, animation: `rc-shake 520ms ${HIT}ms ease-out both` }}>
        <RcCam dur={dur}>
          <div style={{ ..._rcFull, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 22px' }}>
            <div style={{ fontSize: 70, lineHeight: 1, opacity: 0, animation: `rc-pop 700ms ${HIT + 250}ms cubic-bezier(.3,.7,.4,1) both` }}>{window.CAT_META?.[e.cat]?.emoji || '💸'}</div>
            <div style={{ fontSize: String(fmt(e.usd)).length > 10 ? 52 : 62, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 14, direction: 'ltr', textShadow: `0 0 50px ${c}88`,
              opacity: 0, animation: `rc-slam 760ms ${HIT}ms cubic-bezier(.2,.8,.2,1) both` }}>{fmt(e.usd)}</div>
            <div className="serif-italic" style={{ fontSize: 34, marginTop: 12, lineHeight: 1.15 }}><RcWords text={e.title} delay={HIT + 550} stagger={110} dur={900} /></div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,.62)', marginTop: 10 }} >
              <RcWords text={[e.createdAt ? window.fmtDate(window.localISO(e.createdAt)) : null, who ? (wallets ? (ar ? `بطاقة ${who}` : `${who}'s card`) : who) : null].filter(Boolean).join(' · ')} delay={HIT + 950} stagger={40} />
            </div>
            {share > 0 && <div style={{ fontSize: 20, fontWeight: 800, marginTop: 30, color: '#ffd27a' }}><RcWords text={ar ? `لحاله ${share}% من كل صرفكم` : `${share}% of everything you spent`} delay={HIT + 1500} stagger={60} /></div>}
          </div>
        </RcCam>
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '42%', width: 0, height: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2, dist = 140 + _rcRand(i + 21) * 120;
          return <span key={i} style={{ position: 'absolute', width: 7, height: 7, borderRadius: 9, background: i % 2 ? '#fff' : c,
            '--bx': `${Math.cos(a) * dist}px`, '--by': `${Math.sin(a) * dist}px`, '--br': '0deg', animation: `rc-burst 900ms ${HIT + 40}ms cubic-bezier(.1,.7,.3,1) both` }} />;
        })}
      </div>
      <div style={{ ..._rcFull, background: '#fff', opacity: 0, pointerEvents: 'none', animation: `rc-flash 420ms ${HIT}ms ease-out both` }} />
    </div>
  );
}

function RcPodium({ d, dur, sfx }) {
  const { ar, m, fmt, payers, wallets } = d;
  const top = payers.slice(0, 3);
  const order = top.length === 2 ? [1, 0] : [1, 0, 2];          // 2nd · 1st · 3rd, from the start side
  const heights = [168, 118, 86];
  const metal = ['linear-gradient(180deg, #ffe08a, #d8a12c)', 'linear-gradient(180deg, #eef1f6, #a7afbd)', 'linear-gradient(180deg, #f2b98a, #b06a3a)'];
  const rise = [1100, 650, 300];
  const drop = [2000, 1450, 1150];
  React.useEffect(() => { sfx('sparkle', drop[0] + 450); }, []);
  const first = (mm) => (mm.name || '').split(' ')[0];
  const lead = top[0];
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(100% 70% at 50% 100%, #2a2412 0%, #08080a 70%)', color: '#fff' }}>
      <div style={{ position: 'absolute', left: '50%', top: '-10%', width: 360, height: '95%', marginLeft: -180, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(255,240,190,.32), rgba(255,240,190,0) 85%)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)', WebkitClipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
        opacity: 0, animation: `rc-fin 900ms ${drop[0]}ms ease-out forwards` }} />
      <RcCam dur={dur}>
        <div style={{ position: 'absolute', insetInline: 24, top: '14%', textAlign: 'center' }}>
          <div style={{ ..._rcKicker, fontSize: 17 }}><RcWords text={wallets ? (ar ? 'أي بطاقة شالت الحمل؟' : 'Which card carried it?') : (ar ? 'مين دفع أكثر؟' : 'Who paid the most?')} delay={100} /></div>
        </div>
        <div style={{ position: 'absolute', insetInline: 18, bottom: '20%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10 }}>
          {order.filter((k) => top[k]).map((k) => {
            const p = top[k];
            const pct = Math.round((p.v / (m.total || 1)) * 100);
            return (
              <div key={p.m.id} style={{ width: 104, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {k === 0 && <span style={{ fontSize: 34, lineHeight: 1, marginBottom: 4, opacity: 0, animation: `rc-drop 800ms ${drop[0] + 450}ms cubic-bezier(.3,.7,.4,1) both` }}>👑</span>}
                <div style={{ opacity: 0, animation: `rc-drop 780ms ${drop[k]}ms cubic-bezier(.3,.7,.4,1) both`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {window.Avatar && <window.Avatar m={p.m} size={k === 0 ? 58 : 46} />}
                  <div style={{ fontSize: 13.5, fontWeight: 800, marginTop: 6, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{first(p.m)}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)', marginTop: 1, direction: 'ltr' }}>{_rcCompact(p.v)} · {pct}%</div>
                </div>
                <div style={{ width: '100%', height: heights[k], marginTop: 8, borderRadius: '12px 12px 0 0', background: metal[k], transformOrigin: '50% 100%',
                  animation: `rc-grow 800ms ${rise[k]}ms cubic-bezier(.2,.85,.25,1) both`, display: 'grid', placeItems: 'start center', paddingTop: 10,
                  boxShadow: k === 0 ? '0 0 50px rgba(255,210,110,.35)' : 'none' }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: 'rgba(0,0,0,.35)' }}>{k + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', insetInline: 24, bottom: '9%', textAlign: 'center', fontSize: 19, fontWeight: 800 }}>
          <RcWords text={wallets ? (ar ? `بطاقة ${first(lead.m)} دفعت ${fmt(lead.v)}` : `${first(lead.m)}'s card paid ${fmt(lead.v)}`) : (ar ? `${first(lead.m)} دفع ${fmt(lead.v)}` : `${first(lead.m)} paid ${fmt(lead.v)}`)} delay={drop[0] + 800} stagger={60} />
        </div>
      </RcCam>
      <RcConfetti delay={drop[0] + 500} y="40%" seed={5} />
    </div>
  );
}

// The flight as an arc between the airports; the nights as moons.
function RcTrips({ d, dur, sfx }) {
  const { ar, flights, stays, nights, rides } = d;
  const f = flights[0];
  const motion = React.useRef(null);
  const plane = React.useRef(null);
  const pid = React.useRef('rcf' + Math.random().toString(36).slice(2, 8)).current;
  const F = 1900, F0 = 600;
  React.useEffect(() => {
    const t = setTimeout(() => { try { motion.current?.beginElement(); if (plane.current) plane.current.style.opacity = 1; } catch (_) {} }, F0);
    if (f) sfx('whoosh', F0 + 200);
    return () => clearTimeout(t);
  }, []);
  const fx = f?.details || {};
  const from = String(fx.dep_airport || '').toUpperCase(), to = String(fx.arr_airport || '').toUpperCase();
  const ax = ar ? 300 : 40, bx = ar ? 40 : 300;
  const arc = `M${ax},150 Q170,-10 ${bx},150`;
  const moons = Math.min(nights, 14);
  const N0 = f ? 2900 : 700;
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(140% 90% at 50% 0%, #17265a 0%, #05070f 62%)', color: '#fff' }}>
      <RcStars n={80} seed={11} />
      <RcCam dur={dur}>
        <div style={{ ..._rcFull, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' }}>
          {f && (
            <>
              <div style={{ ..._rcKicker, fontSize: 16 }}><RcWords text={ar ? 'طرتوا' : 'You flew'} delay={100} /></div>
              <div style={{ position: 'relative', width: 340, height: 190, marginTop: 6 }}>
                <svg viewBox="0 0 340 190" width="340" height="190" style={{ overflow: 'visible' }}>
                  <path id={pid} d={arc} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2" strokeDasharray="3 8" />
                  <path d={arc} fill="none" stroke="#9ec5ff" strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: 1, animation: `rc-draw ${F}ms ${F0}ms cubic-bezier(.4,0,.2,1) both` }} />
                  <circle cx={ax} cy="150" r="6" fill="#9ec5ff" />
                  <circle cx={bx} cy="150" r="6" fill="#fff" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `rc-pop 500ms ${F0 + F}ms both` }} />
                  <g ref={plane} style={{ opacity: 0 }}>
                    <path d={_rcPlane} fill="#fff" style={{ filter: 'drop-shadow(0 0 10px rgba(160,200,255,.9))' }} />
                    <animateMotion ref={motion} begin="indefinite" dur={`${F / 1000}s`} fill="freeze" rotate="auto" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines=".4 0 .2 1">
                      <mpath href={`#${pid}`} xlinkHref={`#${pid}`} />
                    </animateMotion>
                  </g>
                </svg>
                <div className="rc-fadeup" style={{ position: 'absolute', top: 166, insetInlineStart: 0, width: 90, textAlign: 'center', animationDelay: '300ms' }}>
                  <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '.02em' }}>{from}</div>
                </div>
                <div className="rc-fadeup" style={{ position: 'absolute', top: 166, insetInlineEnd: 0, width: 90, textAlign: 'center', animationDelay: `${F0 + F}ms` }}>
                  <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '.02em' }}>{to}</div>
                </div>
              </div>
              <div className="rc-fadeup" style={{ animationDelay: `${F0 + F + 200}ms`, marginTop: 34, fontSize: 14.5, color: 'rgba(255,255,255,.65)' }}>
                {[fx.airline, fx.dep_at ? window.fmtDate(String(fx.dep_at).slice(0, 10)) : null, flights.length > 1 ? (ar ? `و${flights.length - 1} رحلة ثانية` : `+${flights.length - 1} more`) : null].filter(Boolean).join(' · ')}
              </div>
            </>
          )}
          {nights > 0 && (
            <div style={{ marginTop: f ? 40 : 0 }}>
              <div style={{ fontSize: f ? 38 : 64, fontWeight: 900, lineHeight: 1.1 }}>
                <RcWords text={`${nights} ${_rcNights(nights, ar)}`} delay={N0} stagger={120} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 12, maxWidth: 320 }}>
                {Array.from({ length: moons }, (_, i) => (
                  <span key={i} style={{ fontSize: 24, opacity: 0, animation: `rc-pop 500ms ${N0 + 350 + i * 110}ms cubic-bezier(.3,.7,.4,1) both`, filter: 'drop-shadow(0 0 8px rgba(255,230,150,.6))' }}>🌙</span>
                ))}
                {nights > moons && <span style={{ fontSize: 18, fontWeight: 800, alignSelf: 'center', opacity: 0, animation: `rc-fin 400ms ${N0 + 350 + moons * 110}ms both` }}>+{nights - moons}</span>}
              </div>
              <div style={{ fontSize: 14.5, color: 'rgba(255,255,255,.65)', marginTop: 12 }}>
                <RcWords text={[stays.length ? (ar ? `في ${stays.length === 1 ? 'فندق واحد' : stays.length === 2 ? 'فندقين' : `${stays.length} فنادق`}` : `in ${stays.length} ${stays.length === 1 ? 'hotel' : 'hotels'}`) : null,
                  rides.length ? (ar ? `و${rides.length === 1 ? 'سيارة' : `${rides.length} حجوزات تنقل`} 🚗` : `+ ${rides.length} ${rides.length === 1 ? 'ride' : 'rides'} 🚗`) : null].filter(Boolean).join(' ')} delay={N0 + 500 + moons * 110} stagger={50} />
              </div>
            </div>
          )}
        </div>
      </RcCam>
    </div>
  );
}

// The places, lit one after another along a winding path.
function RcPlaces({ d, dur, sfx }) {
  const { ar, plan } = d;
  const meta = window.PLAN_CAT_META || {};
  const catOf = window.planCatOf || ((c) => c);
  const items = plan.slice(0, 6);
  const n = plan.length;
  const BW = 340, BH = 400;
  const pts = items.map((_, k) => {
    const x = k % 2 ? (ar ? 110 : 230) : (ar ? 230 : 110);
    const y = items.length === 1 ? BH / 2 : 30 + k * ((BH - 60) / (items.length - 1));
    return [x, Math.round(y)];
  });
  const dpath = rcPath(pts);
  const T = 2600, T0 = 900;
  React.useEffect(() => { items.forEach((_, i) => sfx('pop', T0 + (items.length > 1 ? (i / (items.length - 1)) * T : 0))); }, []);
  return (
    <div style={{ ..._rcFull, background: 'radial-gradient(120% 80% at 50% 50%, #2a1410 0%, #09070a 72%)', color: '#fff' }}>
      <RcGlow color="rgba(255,120,70,.22)" x="30%" y="40%" size={420} dur={9} />
      <RcGlow color="rgba(120,200,140,.16)" x="75%" y="70%" size={380} dur={13} />
      <RcCam dur={dur}>
        <div style={{ position: 'absolute', insetInline: 24, top: '12%', textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1 }}><RcWords text={ar ? `${n} ${_rcPlaces(n, ar)}` : `${n} ${_rcPlaces(n, ar)}`} delay={150} stagger={120} /></div>
          <div style={{ ..._rcKicker, marginTop: 6 }}><RcWords text={ar ? 'في خطتكم' : 'on your plan'} delay={450} /></div>
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '57%', width: BW, height: BH, marginLeft: -BW / 2, marginTop: -BH / 2 }}>
          <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d={dpath} fill="none" stroke="rgba(255,190,140,.8)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1" pathLength="1" style={{ strokeDashoffset: 1, animation: `rc-draw ${T}ms ${T0}ms cubic-bezier(.4,0,.3,1) both` }} />
            {pts.map(([x, y], i) => (
              <g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `rc-pop 600ms ${T0 + (items.length > 1 ? (i / (items.length - 1)) * T : 0)}ms cubic-bezier(.3,.7,.4,1) both` }}>
                <circle cx={x} cy={y} r="18" fill="rgba(255,190,120,.25)" />
                <circle cx={x} cy={y} r="7" fill="#fff" />
              </g>
            ))}
          </svg>
          {items.map((it, i) => {
            const [x, y] = pts[i];
            const right = x > BW / 2;                     // the label goes toward the open side
            const mt = meta[catOf(it.category)] || { emoji: '📌' };
            const at = T0 + (items.length > 1 ? (i / (items.length - 1)) * T : 0) + 120;
            return (
              <div key={it.id} style={{
                position: 'absolute', top: y - 16, height: 32, display: 'flex', alignItems: 'center', gap: 6,
                ...(right ? { right: BW - x + 26, justifyContent: 'flex-end' } : { left: x + 26 }), maxWidth: 200,
                fontSize: 15.5, fontWeight: 800, whiteSpace: 'nowrap', opacity: 0, animation: `rc-fadeup 600ms ${at}ms cubic-bezier(.2,.8,.2,1) both`,
              }}>
                <span>{mt.emoji}</span>
                <span dir="auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
              </div>
            );
          })}
        </div>
        {n > items.length && (
          <div className="rc-fadeup" style={{ position: 'absolute', insetInline: 0, bottom: '9%', textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,.65)', animationDelay: `${T0 + T + 300}ms` }}>
            {ar ? `و${n - items.length} ${_rcPlaces(n - items.length, ar)} ثانية` : `and ${n - items.length} more`}
          </div>
        )}
      </RcCam>
    </div>
  );
}

// The closing poster — the same design the share image draws.
function rcStats(d) {
  const { ar, plan, nights, m, expenses, flights } = d;
  const out = [];
  if (d.daysShown) out.push([d.daysShown, _rcDays(d.daysShown, ar)]);
  if (plan.length) out.push([plan.length, _rcPlaces(plan.length, ar)]);
  if (nights) out.push([nights, _rcNights(nights, ar)]);
  if (out.length < 3 && flights.length) out.push([flights.length, ar ? (flights.length <= 2 ? 'رحلة طيران' : 'رحلات طيران') : (flights.length === 1 ? 'flight' : 'flights')]);
  if (out.length < 3 && expenses.length) out.push([expenses.length, ar ? (expenses.length <= 10 && expenses.length > 2 ? 'مصاريف' : 'مصروف') : 'expenses']);
  return out.slice(0, 3);
}

function RcFinale({ d, onReplay, onClose }) {
  const { ar, trip, m, cats } = d;
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
  const peak = m.peak, top = cats[0];
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  return (
    <div style={{ ..._rcFull, background: '#050608', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: '-8%', animation: 'rc-burns 9000ms ease-out both' }}>
        <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={trip.coverUrl || trip.coverImageUrl} />
      </div>
      <div style={{ ..._rcFull, background: 'linear-gradient(180deg, rgba(5,6,8,.55) 0%, rgba(5,6,8,.15) 22%, rgba(5,6,8,.72) 46%, rgba(5,6,8,.97) 72%)' }} />
      <RcConfetti delay={250} y="30%" seed={9} n={40} />
      <div style={{ position: 'absolute', insetInline: 26, top: 'calc(env(safe-area-inset-top) + 92px)', bottom: 'calc(env(safe-area-inset-bottom) + 22px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ ..._rcKicker }}><RcWords text={m.ended ? (ar ? 'وهذي كانت رحلتكم' : 'And that was the trip') : (ar ? 'رحلتكم لين الحين' : 'Your trip so far')} delay={200} /></div>
        <div className="serif-italic" style={{ fontSize: title.length <= 9 ? 70 : title.length <= 15 ? 54 : 42, lineHeight: 1.02, marginTop: 8 }}>
          <RcWords text={title} delay={450} stagger={140} dur={1000} />
        </div>
        <div className="rc-fadeup" style={{ animationDelay: '900ms', fontSize: 15, color: 'rgba(255,255,255,.75)', marginTop: 8 }}>{trip.dates}</div>
        <div style={{ flex: 1 }} />
        <div className="rc-fadeup" style={{ animationDelay: '1200ms' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', fontWeight: 600 }}>{ar ? 'صرفتوا' : 'Spent'}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
            <span style={{ fontSize: 58, fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, direction: 'ltr' }}>{d.num(m.total)}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>{d.curWord}</span>
          </div>
        </div>
        <div className="rc-fadeup" style={{ animationDelay: '1450ms', display: 'flex', marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.16)' }}>
          {stats.map(([v, l], i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, paddingInlineStart: i ? 14 : 0, borderInlineStart: i ? '1px solid rgba(255,255,255,.16)' : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="rc-fadeup" style={{ animationDelay: '1700ms', fontSize: 14.5, color: 'rgba(255,255,255,.82)', marginTop: 14, lineHeight: 1.65 }}>
          {peak && peak.v > 0 && <div>🔥 {ar ? `أغلى يوم: اليوم ${peak.i} · ${d.fmt(peak.v)}` : `Biggest day: Day ${peak.i} · ${d.fmt(peak.v)}`}</div>}
          {top && <div>{window.CAT_META?.[top[0]]?.emoji} {ar ? `الأكثر: ${_rcCatName(top[0])} ${Math.round((top[1] / (m.total || 1)) * 100)}%` : `Most on: ${_rcCatName(top[0])} ${Math.round((top[1] / (m.total || 1)) * 100)}%`}</div>}
        </div>
        <div className="rc-fadeup" style={{ animationDelay: '2000ms', display: 'grid', gap: 8, marginTop: 20 }}>
          <button onClick={share} disabled={busy} style={{
            minHeight: 52, borderRadius: 16, background: '#fff', color: '#121318', fontSize: 15.5, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: busy ? 0.7 : 1,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            {ar ? 'شارك مع القروب' : 'Share with the group'}
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e) => { e.stopPropagation(); onReplay(); }} style={{ flex: 1, minHeight: 48, borderRadius: 16, background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: '#fff', fontSize: 14.5, fontWeight: 700 }}>
              {ar ? '↻ شاهد مرة ثانية' : '↻ Watch again'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ flex: 1, minHeight: 48, borderRadius: 16, background: 'rgba(255,255,255,.14)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: '#fff', fontSize: 14.5, fontWeight: 700 }}>
              {ar ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sound: a soft generated track + effects (Web Audio) ────────────
const RcAudio = (() => {
  let ctx = null, master = null, music = null, rev = null, delay = null, noise = null, timer = null;
  let step = 0, nextT = 0, running = false, muted = false;
  try { muted = localStorage.getItem('voyage:recapMuted') === '1'; } catch (_) {}
  const mtof = (mm) => 440 * Math.pow(2, (mm - 69) / 12);
  const E8 = 60 / 84 / 2;                                   // an eighth note at 84 bpm
  const CH = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [45, 52, 54, 59, 61]];   // Dmaj9 · Bm9 · Gmaj9 · A6/9
  const ARP = [1, 2, 3, 4, 3, 2, 4, 3];
  const VOL = 0.9;
  const build = () => {
    if (master || !ctx) return;
    master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);
    rev = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    rev.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.3; rev.connect(wet); wet.connect(master);
    music = ctx.createGain(); music.gain.value = 1; music.connect(master); music.connect(rev);
    delay = ctx.createDelay(1.5); delay.delayTime.value = E8 * 3;
    const fb = ctx.createGain(); fb.gain.value = 0.3; delay.connect(fb); fb.connect(delay);
    const dw = ctx.createGain(); dw.gain.value = 0.35; delay.connect(dw); dw.connect(music);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  };
  const osc = (type, f, t, stop, out, gain) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = gain; o.connect(g); g.connect(out); o.start(t); o.stop(stop); return o; };
  const pad = (t, chord, len) => {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1150; lp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1, t + 1.1);
    g.gain.setValueAtTime(0.1, t + len - 0.1); g.gain.linearRampToValueAtTime(0, t + len + 1.5);
    lp.connect(g); g.connect(music);
    chord.slice(1).forEach((mm, k) => [-6, 6].forEach((c) => { const o = osc(k % 2 ? 'sine' : 'triangle', mtof(mm), t, t + len + 1.7, lp, 0.17); o.detune.value = c; }));
  };
  const bass = (t, mm, len) => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(mm - 12);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.03); g.gain.exponentialRampToValueAtTime(0.1, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(music); o.start(t); o.stop(t + len + 0.05);
  };
  const pluck = (t, mm, v = 0.06) => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(mm);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g); g.connect(music); g.connect(delay); o.start(t); o.stop(t + 0.6);
  };
  const kick = (t) => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.13);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.4);
  };
  const hiss = (t, len, v, type = 'highpass', f = 7000) => {
    const s = ctx.createBufferSource(); s.buffer = noise;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f;
    const g = ctx.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random() * 0.5, len + 0.05);
    return { fl, g };
  };
  const tick = () => {
    if (!running) return;
    while (nextT < ctx.currentTime + 0.3) {
      const bar = Math.floor(step / 8), s8 = step % 8, chord = CH[bar % 4];
      if (s8 === 0) { pad(nextT, chord, E8 * 8); bass(nextT, chord[0], E8 * 3.6); }
      if (s8 === 4 && bar >= 1) bass(nextT, chord[0], E8 * 3.6);
      if (bar >= 1) pluck(nextT, chord[ARP[s8]] + 12);
      if (bar >= 2 && (s8 === 0 || s8 === 4)) kick(nextT);
      if (bar >= 3 && s8 % 2 === 1) hiss(nextT, 0.05, 0.03);
      step++; nextT += E8;
    }
  };
  const ramp = (to, secs) => {
    if (!master) return;
    const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(to, t + secs);
  };
  return {
    // Call from inside the tap that opens the recap (iPhone needs a gesture).
    unlock() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        if (!ctx) ctx = new AC();
        if (ctx.state !== 'running') ctx.resume();
        const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0);
      } catch (_) {}
    },
    start() {
      if (!ctx) return; build();
      if (ctx.state !== 'running') { try { ctx.resume(); } catch (_) {} }
      if (!running) { running = true; step = 0; nextT = ctx.currentTime + 0.1; tick(); timer = setInterval(tick, 60); }
      ramp(muted ? 0 : VOL, 1.6);
    },
    stop() {
      if (!ctx) return;
      ramp(0, 0.45);
      running = false; clearInterval(timer); timer = null;
    },
    sfx(kind, inMs = 0, n = 0) {
      if (!ctx || !master || muted) return;
      const t = ctx.currentTime + inMs / 1000;
      try {
        if (kind === 'whoosh') {
          const { fl, g } = hiss(t, 0.7, 0.0001, 'bandpass', 300);
          fl.Q.value = 0.9; fl.frequency.setValueAtTime(260, t); fl.frequency.exponentialRampToValueAtTime(3400, t + 0.5);
          g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.22); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
          g.connect(rev);
        } else if (kind === 'boom') {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.7);
          const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.95, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
          o.connect(g); g.connect(master); g.connect(rev); o.start(t); o.stop(t + 1.2);
          hiss(t, 0.35, 0.45, 'lowpass', 380);
        } else if (kind === 'sparkle') {
          [88, 91, 95, 100, 103].forEach((mm, k) => pluck(t + k * 0.07, mm, 0.07));
        } else if (kind === 'pop') {
          const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(480, t); o.frequency.exponentialRampToValueAtTime(920, t + 0.07);
          const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.11, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
          o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16);
        } else if (kind === 'ticks') {
          const T = 1.9;                                             // follows the slot's ease-out
          for (let k = 1; k < n; k++) { const p = k / (n - 1); hiss(t + T * (1 - Math.cbrt(1 - p)), 0.025, 0.14, 'highpass', 2600); }
        }
      } catch (_) {}
    },
    get muted() { return muted; },
    setMuted(v) {
      muted = v; try { localStorage.setItem('voyage:recapMuted', v ? '1' : '0'); } catch (_) {}
      if (ctx && master) ramp(v ? 0 : VOL, 0.3);
    },
    suspend() { try { ctx && ctx.suspend(); } catch (_) {} },
    resume() { try { ctx && ctx.resume(); } catch (_) {} },
  };
})();

// ── The player ─────────────────────────────────────────────────────
let _rcGrain = null;
function rcGrain() {
  if (_rcGrain) return _rcGrain;
  try {
    const c = document.createElement('canvas'); c.width = c.height = 160;
    const x = c.getContext('2d'); const img = x.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 34; }
    x.putImageData(img, 0, 0); _rcGrain = c.toDataURL();
  } catch (_) { _rcGrain = ''; }
  return _rcGrain;
}

function TripRecap({ onClose }) {
  const d = React.useMemo(() => recapData(), []);
  const { ar } = d;
  const scenes = React.useMemo(() => {
    const s = [{ key: 'open', dur: 6200, tx: 'fade', el: RcOpen }];
    if (d.daysShown >= 1) s.push({ key: 'count', dur: 5200, tx: 'zoom', el: RcCount });
    if (d.expenses.length) s.push({ key: 'money', dur: 7200, tx: 'iris', el: RcMoney });
    if (d.m.days.length >= 2) s.push({ key: 'journey', dur: 1500 + Math.min(5200, Math.max(2600, d.m.days.length * 520)) + 1900, tx: 'zoom', el: RcJourney });
    if (d.cats.length) s.push({ key: 'bubbles', dur: 6800, tx: 'iris', el: RcBubbles });
    if (d.biggest) s.push({ key: 'big', dur: 6400, tx: 'flash', el: RcBig });
    if (d.payers.length >= 2) s.push({ key: 'podium', dur: 6800, tx: 'zoom', el: RcPodium });
    if (d.flights.length || d.nights) s.push({ key: 'trips', dur: 7000, tx: 'iris', el: RcTrips });
    if (d.plan.length) s.push({ key: 'places', dur: 6800, tx: 'zoom', el: RcPlaces });
    s.push({ key: 'finale', dur: 0, tx: 'flash', el: RcFinale });
    return s;
  }, [d]);
  const [i, setI] = React.useState(0);
  const [prev, setPrev] = React.useState(null);
  const [run, setRun] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [muted, setMutedState] = React.useState(RcAudio.muted);
  const pausedRef = React.useRef(false); pausedRef.current = paused;
  const iRef = React.useRef(0); iRef.current = i;
  const fills = React.useRef([]);
  const clock = React.useRef({ t: 0, last: 0 });
  const hold = React.useRef(null);
  const prevTimer = React.useRef(null);
  const reduce = window.vReduce?.();
  const cur = scenes[i];
  const sfx = React.useCallback((kind, ms, n) => RcAudio.sfx(kind, ms, n), []);

  const goTo = (j) => {
    const from = iRef.current;
    j = Math.max(0, Math.min(scenes.length - 1, j));
    if (j === from) { if (j === 0) { clock.current.t = 0; setRun((r) => r + 1); } return; }
    clearTimeout(prevTimer.current);
    setPrev({ idx: from });
    prevTimer.current = setTimeout(() => setPrev(null), 900);
    setI(j);
    RcAudio.sfx('whoosh');
    window.haptic?.();
  };
  const goRef = React.useRef(goTo); goRef.current = goTo;

  // Music for as long as the film is open; quiet while the app is hidden.
  React.useEffect(() => {
    RcAudio.start();
    const vis = () => { if (document.hidden) RcAudio.suspend(); else RcAudio.resume(); };
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); RcAudio.stop(); clearTimeout(prevTimer.current); };
  }, []);

  // The clock: fills the current bar and cuts to the next scene when full.
  React.useEffect(() => {
    fills.current.forEach((el, k) => { if (el) el.style.transform = `scaleX(${k < i ? 1 : 0})`; });
    if (!cur.dur) { const el = fills.current[i]; if (el) el.style.transform = 'scaleX(1)'; return; }
    clock.current = { t: 0, last: performance.now() };
    let raf = 0;
    const loop = (now) => {
      const c = clock.current; const dt = now - c.last; c.last = now;
      if (!pausedRef.current && !document.hidden) c.t += dt;
      const p = Math.min(1, c.t / cur.dur);
      const el = fills.current[i]; if (el) el.style.transform = `scaleX(${p})`;
      if (p >= 1) { goRef.current(iRef.current + 1); return; }
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
    const h = hold.current; hold.current = null;
    if (!h) return;
    clearTimeout(h.timer);
    if (e.clientY - h.y > 90) { onClose(); return; }
    if (h.held) { setPaused(false); return; }
    const w = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - w.left) / w.width;
    const back = ar ? frac > 0.68 : frac < 0.32;
    goTo(back ? i - 1 : i + 1);
  };
  const cancel = () => { const h = hold.current; hold.current = null; if (h) { clearTimeout(h.timer); if (h.held) setPaused(false); } };
  const toggleMute = (e) => { e.stopPropagation(); RcAudio.unlock(); const v = !muted; RcAudio.setMuted(v); setMutedState(v); if (!v) RcAudio.start(); };

  const enterAnim = { fade: 'rc-fin 700ms ease-out both', zoom: 'rc-zin 720ms cubic-bezier(.2,.8,.2,1) both', iris: 'rc-iris 820ms cubic-bezier(.6,.05,.3,1) both', flash: 'rc-fin 260ms ease-out both' };
  const exitAnim = { fade: 'rc-fout 600ms ease-in both', zoom: 'rc-zout 720ms cubic-bezier(.5,0,.8,.4) both', iris: 'rc-dim 820ms ease-in both', flash: 'rc-fout 220ms ease-in both' };
  const layers = [prev && prev.idx !== i ? { idx: prev.idx, cur: false } : null, { idx: i, cur: true }].filter(Boolean);
  const grain = rcGrain();
  return (
    <div role="dialog" aria-modal="true" aria-label={ar ? 'ملخص الرحلة' : 'Trip recap'}
      className={[reduce ? 'rc-reduce' : '', paused ? 'rc-paused' : ''].join(' ')} style={{
        position: 'absolute', inset: 0, zIndex: 200, background: '#000', overflow: 'hidden',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation',
      }}>
      <style>{RC_CSS}</style>
      {layers.map((l) => {
        const S = scenes[l.idx];
        return (
          <div key={`${run}-${l.idx}`} aria-hidden={l.cur ? undefined : 'true'} style={{
            ..._rcFull, zIndex: l.cur ? 2 : 1,
            animation: l.cur ? enterAnim[S.tx] : exitAnim[scenes[i].tx],
          }}>
            <S.el d={d} dur={S.dur || 9000} sfx={sfx} onReplay={() => { RcAudio.unlock(); RcAudio.start(); setPrev(null); setI(0); setRun((r) => r + 1); }} onClose={onClose} />
          </div>
        );
      })}
      {cur.tx === 'flash' && i > 0 && <div key={`flash-${run}-${i}`} style={{ ..._rcFull, zIndex: 3, background: '#fff', pointerEvents: 'none', animation: 'rc-flash 520ms ease-out both' }} />}

      {/* film: grain + vignette over everything */}
      <div style={{ ..._rcFull, zIndex: 4, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.55) 100%)' }} />
      {grain && <div className="rc-loop" style={{ position: 'absolute', inset: '-60%', zIndex: 4, pointerEvents: 'none', opacity: .5, mixBlendMode: 'overlay', backgroundImage: `url(${grain})`, animation: 'rc-grain 900ms steps(6) infinite' }} />}

      {cur.dur > 0 && (
        <div onPointerDown={down} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel}
          style={{ ..._rcFull, zIndex: 5 }} />
      )}

      {/* progress, sound, close */}
      <div style={{
        position: 'absolute', insetInline: 0, top: 0, zIndex: 10,
        padding: 'calc(env(safe-area-inset-top) + 10px) 12px 10px',
        background: 'linear-gradient(180deg, rgba(0,0,0,.42), transparent)', pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {scenes.map((s, k) => (
            <div key={s.key} style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,.28)', overflow: 'hidden' }}>
              <div ref={(el) => { fills.current[k] = el; }} style={{
                height: '100%', borderRadius: 99, background: '#fff',
                transformOrigin: ar ? '100% 50%' : '0 50%', transform: `scaleX(${k < i ? 1 : 0})`,
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 700 }}>
            <span className="wordmark" style={{ fontSize: 19, fontWeight: 400 }}>voyage</span>
            {paused && <span style={{ opacity: .8 }}>{ar ? '· موقوف' : '· paused'}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
            <button onClick={toggleMute} aria-label={muted ? (ar ? 'شغّل الصوت' : 'Sound on') : (ar ? 'اكتم الصوت' : 'Mute')} style={_rcRound}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="#fff" />
                {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <><path d="M15.5 8.5a5 5 0 010 7" /><path d="M18.5 5.5a9 9 0 010 13" /></>}
              </svg>
            </button>
            <button onClick={onClose} aria-label={ar ? 'إغلاق' : 'Close'} style={_rcRound}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const _rcRound = {
  width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,.16)',
  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center',
};

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
const RC_PRESET = {
  kyoto: ['#d39b91', '#3a3956'], lisbon: ['#ddae77', '#934c3a'], oaxaca: ['#e6964f', '#86281d'],
  lofoten: ['#577ab5', '#101836'], patagon: ['#67acb0', '#183a5b'],
};

window.renderRecapImage = async function renderRecapImage(d, noPhoto) {
  const { ar, trip, m, cats } = d;
  const W = 1080, H = 1350, P = 76;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await document.fonts?.ready; } catch (_) {}
  const SANS = '"Tajawal", "Geist", "IBM Plex Sans Arabic", system-ui, sans-serif';
  const SERIF = '"Markazi Text", "Instrument Serif", Georgia, serif';
  const S = ar ? W - P : P;
  const text = (str, px, weight, color, xx, yy, opt = {}) => {
    x.font = `${opt.italic ? 'italic ' : ''}${weight} ${px}px ${opt.serif ? SERIF : SANS}`;
    x.fillStyle = color; x.direction = opt.dir || (ar ? 'rtl' : 'ltr');
    x.textAlign = opt.align || 'start'; x.textBaseline = 'alphabetic';
    x.fillText(String(str), xx, yy, opt.maxW);
    return x.measureText(String(str)).width;
  };

  // the cover, full bleed, falling into night
  x.fillStyle = '#050608'; x.fillRect(0, 0, W, H);
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
    sun.addColorStop(0, 'rgba(255,236,214,0.5)'); sun.addColorStop(1, 'rgba(255,236,214,0)');
    x.fillStyle = sun; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(10,12,22,0.35)';                     // two quiet ridges
    x.beginPath(); x.moveTo(0, 620); x.lineTo(260, 430); x.lineTo(470, 600); x.lineTo(700, 380); x.lineTo(W, 640); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  }
  const fade = x.createLinearGradient(0, 0, 0, H);
  fade.addColorStop(0, 'rgba(5,6,8,0.55)'); fade.addColorStop(0.2, 'rgba(5,6,8,0.12)'); fade.addColorStop(0.42, 'rgba(5,6,8,0.55)');
  fade.addColorStop(0.62, 'rgba(5,6,8,0.92)'); fade.addColorStop(1, '#050608');
  x.fillStyle = fade; x.fillRect(0, 0, W, H);
  const vig = x.createRadialGradient(W / 2, H * 0.45, H * 0.3, W / 2, H * 0.45, H * 0.85);
  vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.5)');
  x.fillStyle = vig; x.fillRect(0, 0, W, H);

  // film grain
  try {
    const gc = document.createElement('canvas'); gc.width = 270; gc.height = 338;
    const gx = gc.getContext('2d'); const id = gx.createImageData(270, 338);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 15; }
    gx.putImageData(id, 0, 0); x.imageSmoothingEnabled = false; x.drawImage(gc, 0, 0, W, H); x.imageSmoothingEnabled = true;
  } catch (_) {}

  // top line
  text('voyage', 48, 400, 'rgba(255,255,255,0.92)', ar ? P : P, 116, { serif: true, italic: true, align: 'left', dir: 'ltr' });
  text(ar ? 'ملخص الرحلة' : 'TRIP RECAP', ar ? 30 : 24, 700, 'rgba(255,255,255,0.78)', W - P, 112, { align: 'right' });

  // title + dates
  const title = trip.title || (ar ? 'رحلة' : 'Trip');
  text(title, title.length <= 9 ? 150 : title.length <= 15 ? 118 : 88, 600, '#ffffff', S, 590, { serif: true, italic: true, maxW: W - P * 2 });
  text([trip.dates, d.dayWord(d.daysShown), d.members.length > 1 ? d.peopleWord(d.members.length) : null].filter(Boolean).join(' · '), 34, 500, 'rgba(255,255,255,0.8)', S, 660, { maxW: W - P * 2 });

  // the hero number
  text(ar ? 'صرفتوا' : 'Spent', 32, 700, 'rgba(255,255,255,0.66)', S, 790);
  x.font = `800 150px ${SANS}`; x.direction = 'ltr';
  const numStr = d.num(m.total), nw = x.measureText(numStr).width;
  const nx = ar ? W - P - nw : P;
  text(numStr, 150, 800, '#ffffff', nx, 930, { align: 'left', dir: 'ltr' });
  text(d.curWord, 46, 700, 'rgba(255,255,255,0.78)', ar ? nx - 22 : nx + nw + 22, 930, { align: ar ? 'right' : 'left' });

  // a row of figures
  x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(P, 985, W - P * 2, 2);
  const stats = rcStats(d);
  const colW = (W - P * 2) / Math.max(1, stats.length);
  stats.forEach(([v, l], k) => {
    const left = ar ? W - P - (k + 1) * colW : P + k * colW;
    const sx = ar ? left + colW - (k ? 32 : 0) : left + (k ? 32 : 0);
    if (k) { x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(ar ? left + colW : left, 1012, 2, 120); }
    text(String(v), 92, 800, '#ffffff', sx, 1095);
    text(l, 30, 600, 'rgba(255,255,255,0.66)', sx, 1138, { maxW: colW - 40 });
  });

  // two highlights
  const peak = m.peak, top = cats[0];
  if (peak && peak.v > 0) text(`🔥 ${ar ? `أغلى يوم: اليوم ${peak.i} · ${d.fmt(peak.v)}` : `Biggest day: Day ${peak.i} · ${d.fmt(peak.v)}`}`, 32, 600, 'rgba(255,255,255,0.86)', S, 1212, { maxW: W - P * 2 });
  if (top) text(`${window.CAT_META?.[top[0]]?.emoji || ''} ${ar ? `الأكثر: ${_rcCatName(top[0])} ${Math.round((top[1] / (m.total || 1)) * 100)}%` : `Most on: ${_rcCatName(top[0])} ${Math.round((top[1] / (m.total || 1)) * 100)}%`}`, 32, 600, 'rgba(255,255,255,0.86)', S, 1262, { maxW: W - P * 2 });
  text(ar ? 'صُنعت في Voyage' : 'Made with Voyage', 24, 500, 'rgba(255,255,255,0.4)', S, 1318);

  try {
    return await new Promise((res, rej) => c.toBlob((bl) => (bl ? res(bl) : rej(new Error('blob'))), 'image/png'));
  } catch (err) {
    if (photo && !noPhoto) return window.renderRecapImage(d, true);   // the photo blocked export — draw without it
    throw err;
  }
};

Object.assign(window, { TripRecap, RecapHost });
