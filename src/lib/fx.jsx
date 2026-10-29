// ── Currency converter ──────────────────────────────────────────────
//
// A floating pill above the "+" (every trip screen and My trips) opens a
// converter: the trip's currency and yours, ready; one tap on the arrows
// swaps them; a big keypad types the price (+ and × add up a few items);
// the answer shows as you type. Tap either currency to pick any other.
// Rates come from the app's FX tables, kept on the phone — works offline.
//
//   <window.FxFab trip={…} />   the pill (rendered by the bottom nav)
//   <window.FxHost />           the sheet (rendered once by the app)
//   window.openFx(trip)         open it from anywhere

const _fxRate = (code) => {
  if (!code) return null;
  if (code === 'USD') return 1;
  const r = (window.FX_RATES && window.FX_RATES[code]) || (window.FX_ALL && window.FX_ALL[code]);
  return r > 0 ? r : null;
};
const _fxConvert = (v, from, to) => {
  const a = _fxRate(from), b = _fxRate(to);
  return a && b ? (v / a) * b : 0;
};

// Flags: a currency's first two letters are its country, with a few exceptions.
const _FX_FLAG_CC = { EUR: 'EU', ANG: 'CW', XCD: 'AG', XAF: 'CM', XOF: 'SN', XPF: 'PF', XDR: null, XAU: null, XAG: null };
window.fxFlag = (code) => {
  const c = String(code || '').toUpperCase();
  const cc = Object.prototype.hasOwnProperty.call(_FX_FLAG_CC, c) ? _FX_FLAG_CC[c] : c.slice(0, 2);
  if (!cc || !/^[A-Z]{2}$/.test(cc)) return '💱';
  return String.fromCodePoint(...[...cc].map((ch) => 0x1F1E6 + ch.charCodeAt(0) - 65));
};
const _fxNames = {};
window.fxName = (code, lang) => {
  const l = lang || (window.isRTL ? 'ar' : 'en');
  const k = l + code;
  if (!(k in _fxNames)) {
    try { _fxNames[k] = new Intl.DisplayNames([l], { type: 'currency' }).of(code) || code; }
    catch (_) { _fxNames[k] = code; }
  }
  return _fxNames[k];
};

// Currencies without cents in practice.
const _FX_NO_CENTS = new Set(['JPY', 'IDR', 'KRW', 'VND', 'IRR', 'IQD', 'UZS', 'LBP', 'CLP', 'COP', 'HUF', 'ISK', 'PYG', 'UGX', 'TZS', 'MMK', 'KHR', 'LAK', 'SYP', 'KZT']);
const _fxFmt = (v, code) => {
  if (!isFinite(v)) return '0';
  const a = Math.abs(v);
  const dec = _FX_NO_CENTS.has(code) || a >= 100000 ? 0 : (a > 0 && a < 1 ? 3 : 2);
  return v.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: dec });
};
const _fxRateText = (r) => {
  if (!r || !isFinite(r)) return '—';
  if (r >= 100) return r.toLocaleString('en', { maximumFractionDigits: 1 });
  if (r >= 1) return r.toLocaleString('en', { maximumFractionDigits: 3 });
  return Number(r.toPrecision(3)).toString();
};

// The pair for a trip: its currency → yours, or what you last picked on it.
function _fxPairFor(trip) {
  const home = String(window.USER_DEFAULT_CURRENCY || (trip && trip.homeCurrency) || 'SAR').toUpperCase();
  let local = trip && trip.localCurrency ? String(trip.localCurrency).toUpperCase() : null;
  if (!local || local === home) local = home === 'USD' ? 'EUR' : 'USD';
  const ctx = (trip && trip.id) || 'none';
  try {
    const saved = JSON.parse(localStorage.getItem('voyage:fx') || 'null');
    if (saved && saved.ctx === ctx && _fxRate(saved.from) && _fxRate(saved.to) && saved.from !== saved.to) return saved;
  } catch (_) {}
  return { from: _fxRate(local) ? local : 'USD', to: home, ctx };
}
function _fxSavePair(p) {
  try { localStorage.setItem('voyage:fx', JSON.stringify(p)); } catch (_) {}
  window.dispatchEvent(new CustomEvent('voyage:fx-pair'));
}
// The trip the converter is about: the open one, else the one you're on / going to next.
window.fxTripNow = () => {
  const today = window.localISO ? window.localISO() : new Date().toISOString().slice(0, 10);
  const list = (window.TRIPS || []).filter((t) => t.endDate && t.endDate >= today)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
  return (window.activeTripNow && window.activeTripNow()) || list[0] || null;
};

// "1250+45×3" → 1385 (× before +). A trailing operator is ignored.
function _fxEval(expr) {
  const clean = String(expr || '').replace(/[+×]$/, '');
  if (!clean) return 0;
  return clean.split('+').reduce((sum, term) => sum + term.split('×').reduce((p, f) => p * (parseFloat(f) || 0), 1), 0);
}
const _fxGroup = (s) => {
  if (!s) return '';
  const [i, d] = s.split('.');
  const gi = i ? Number(i).toLocaleString('en') : '0';
  return d !== undefined ? `${gi}.${d}` : gi;
};

// Round "price-tag" amounts in a currency (≈ 5 … 200 USD), for quick checks.
function _fxQuick(code) {
  const r = _fxRate(code); if (!r) return [];
  const nice = (x) => {
    const p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p;
    return (m < 1.5 ? 1 : m < 2.25 ? 2 : m < 3.5 ? 2.5 : m < 7.5 ? 5 : 10) * p;
  };
  const out = [];
  [5, 10, 20, 50, 100, 200].forEach((usd) => { const v = nice(usd * r); if (!out.includes(v)) out.push(v); });
  return out;
}

// ── Pieces ──
function FxCoin({ code, size = 30 }) {
  return (
    <span aria-hidden="true" style={{
      width: size * 1.25, height: size, flexShrink: 0, display: 'grid', placeItems: 'center',
      fontSize: size, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))',
    }}>{window.fxFlag(code)}</span>
  );
}
function FxSwapIcon({ size = 18, stroke = 'currentColor', sw = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4v15" /><path d="M3.5 7.5 7 4l3.5 3.5" /><path d="M17 20V5" /><path d="M13.5 16.5 17 20l3.5-3.5" />
    </svg>
  );
}

// ── The floating pill (above the "+") ──
function FxFab({ trip }) {
  const [, bump] = React.useState(0);
  React.useEffect(() => {
    const on = () => bump((n) => n + 1);
    window.addEventListener('voyage:fx-pair', on);
    return () => window.removeEventListener('voyage:fx-pair', on);
  }, []);
  const t = trip || null;
  const pair = _fxPairFor(t);
  const ar = window.isRTL;
  return (
    <button onClick={() => { window.haptic?.(); window.openFx?.(t); }} className="fx-fab"
      aria-label={ar ? `تحويل العملة ${window.fxName(pair.from)} و${window.fxName(pair.to)}` : `Convert ${pair.from} and ${pair.to}`}
      style={{
        position: 'absolute', zIndex: 49, insetInlineEnd: 12,
        bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
        height: 42, padding: '0 10px', borderRadius: 999, border: 'none',
        display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
        background: 'var(--statement)', color: 'var(--statement-fg)',
        boxShadow: '0 10px 26px rgba(10, 14, 30, 0.32), inset 0 0 0 0.5px rgba(255,255,255,0.14)',
      }}>
      <FxCoin code={pair.from} size={21} />
      <span style={{ display: 'grid', placeItems: 'center', opacity: 0.85, transform: 'rotate(90deg)' }}><FxSwapIcon size={14} sw={2.3} /></span>
      <FxCoin code={pair.to} size={21} />
    </button>
  );
}

// ── The converter ──
// What you typed, kept for a minute after closing (a quick second look),
// otherwise it opens empty — ready for the next price.
let _fxLast = { expr: '', at: 0 };

function FxConverter({ trip, onClose }) {
  const ar = window.isRTL;
  const [pair, setPairState] = React.useState(() => _fxPairFor(trip));
  const [expr, setExpr] = React.useState(() => (Date.now() - _fxLast.at < 60000 ? _fxLast.expr : ''));
  const [turn, setTurn] = React.useState(0);           // swap button rotation
  const [picking, setPicking] = React.useState(null);  // null | 'from' | 'to'
  const [q, setQ] = React.useState('');
  const exprRef = React.useRef(expr); exprRef.current = expr;
  React.useEffect(() => () => { _fxLast = { expr: exprRef.current, at: Date.now() }; }, []);

  const setPair = (p) => { const next = { ...p, ctx: pair.ctx }; setPairState(next); _fxSavePair(next); };
  const swap = () => { window.haptic?.(); setTurn((n) => n + 1); setPair({ from: pair.to, to: pair.from }); };
  const pick = (side, code) => {
    window.haptic?.();
    const other = side === 'from' ? pair.to : pair.from;
    if (code === other) setPair({ from: pair.to, to: pair.from });
    else setPair(side === 'from' ? { from: code, to: pair.to } : { from: pair.from, to: code });
    setPicking(null); setQ('');
  };

  const press = React.useCallback((k) => {
    window.haptic?.();
    setExpr((e) => {
      const last = e.split(/[+×]/).pop();
      const digits = last.replace('.', '').length;
      if (/^[0-9]$/.test(k)) {
        if (last === '0') return e.slice(0, -1) + k;
        return digits >= 12 ? e : e + k;
      }
      if (k === '00') return (!last || last === '0' || digits >= 11) ? e : e + '00';
      if (k === '.') return last.includes('.') ? e : e + (last ? '.' : '0.');
      if (k === '+' || k === '×') {
        if (!e) return e;
        if (/[+×]$/.test(e)) return e.slice(0, -1) + k;
        return e.length > 48 ? e : e + k;
      }
      if (k === 'del') return e.slice(0, -1);
      if (k === 'C') return '';
      return e;
    });
  }, []);

  // A hardware keyboard works too.
  React.useEffect(() => {
    const onKey = (ev) => {
      if (picking) { if (ev.key === 'Escape') setPicking(null); return; }
      const k = ev.key;
      if (/^[0-9]$/.test(k)) press(k);
      else if (k === '.' || k === ',') press('.');
      else if (k === '+') press('+');
      else if (k === '*' || k === 'x' || k === 'X') press('×');
      else if (k === 'Backspace') press('del');
      else if (k === 'Escape') onClose?.();
      else return;
      ev.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press, picking, onClose]);

  const hasOps = /[+×]/.test(expr.replace(/[+×]$/, ''));   // a sum to work out
  const showExpr = /[+×]/.test(expr);                        // the line of prices above it
  const total = _fxEval(expr);
  const result = _fxConvert(total, pair.from, pair.to);
  const rate = _fxConvert(1, pair.from, pair.to);
  const fromText = expr ? (hasOps ? _fxFmt(total, pair.from) : _fxGroup(expr.replace(/[+×]$/, ''))) : '0';
  const toText = _fxFmt(result, pair.to);
  const exprText = showExpr ? expr.split(/([+×])/).map((s) => (s === '+' || s === '×' ? ` ${s} ` : _fxGroup(s))).join('') : '';
  const sizeFor = (s) => (s.length > 14 ? 24 : s.length > 10 ? 29 : 36);
  const caret = (h) => (
    <span aria-hidden="true" style={{ width: 2.5, height: h, borderRadius: 2, background: 'oklch(0.86 0.11 80)', animation: 'fxCaret 1.1s steps(1) infinite', marginInlineStart: 3, flexShrink: 0 }} />
  );

  const curBtn = (side) => {
    const code = pair[side];
    return (
      <button onClick={() => { window.haptic?.(); setPicking(side); setQ(''); }} style={{
        display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row', padding: '6px 10px 6px 6px',
        marginInlineStart: -6, borderRadius: 16, background: 'transparent', color: 'inherit', border: 'none',
        minWidth: 0, flexShrink: 1, textAlign: 'start',
      }}>
        <FxCoin code={code} size={30} />
        <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 700, letterSpacing: '0.02em' }}>
            {code}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </span>
          <span style={{ fontSize: 11.5, opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{window.fxName(code)}</span>
        </span>
      </button>
    );
  };

  const keys = ['7', '8', '9', 'del', '4', '5', '6', '×', '1', '2', '3', '+', '.', '0', '00', 'C'];
  const keyStyle = (k) => {
    const op = k === '+' || k === '×';
    return {
      height: 'clamp(46px, 6.7vh, 58px)', borderRadius: 16,
      display: 'grid', placeItems: 'center', fontFamily: 'var(--sans)',
      fontSize: op ? 26 : k === 'C' ? 17 : k === '00' ? 20 : 24, fontWeight: op || k === 'C' ? 600 : 500,
      color: op || k === 'C' ? 'var(--clay-deep)' : 'var(--ink)',
      background: op ? 'oklch(0.62 0.13 35 / 0.11)' : k === 'del' || k === 'C' ? 'transparent' : 'var(--cream-2)',
      border: k === 'del' || k === 'C' ? '0.5px solid var(--hairline)' : '0.5px solid var(--hairline)',
      boxShadow: op || k === 'del' || k === 'C' ? 'none' : 'var(--shadow-xs)',
      fontVariantNumeric: 'tabular-nums',
    };
  };

  // Currency list for the picker: this trip's two first, then the usual, then the rest.
  const list = React.useMemo(() => {
    if (!picking) return [];
    const base = ['SAR', 'USD', 'EUR', 'GBP', 'AED', 'TRY', 'EGP', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'MAD', 'CHF', 'JPY', 'INR', 'IDR', 'MYR', 'THB', 'SGD', 'CNY', 'KRW', 'GEL', 'AZN', 'PKR', 'LKR', 'MVR', 'AUD', 'CAD', 'ZAR', 'RUB', 'UZS', 'KZT'];
    const firsts = [trip && trip.localCurrency, trip && trip.homeCurrency, window.USER_DEFAULT_CURRENCY].filter(Boolean).map((c) => String(c).toUpperCase());
    const rest = Object.keys(window.FX_ALL || {}).sort((a, b) => window.fxName(a).localeCompare(window.fxName(b), ar ? 'ar' : 'en'));
    const all = [...firsts, ...(window.CURRENCIES || []), ...base, ...rest].filter((c, i, a) => c && a.indexOf(c) === i && _fxRate(c));
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((c) => c.toLowerCase().includes(needle) || window.fxName(c).toLowerCase().includes(needle) || window.fxName(c, 'en').toLowerCase().includes(needle));
  }, [picking, q]);

  return (
    <div style={{ padding: '2px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: '100%', boxSizing: 'border-box' }}>
      <style>{`
        @keyframes fxCaret { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes fxIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .fx-key:active { transform: scale(0.93); filter: brightness(0.96); }
      `}</style>

      {/* The two currencies */}
      <div style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        background: 'var(--statement)', color: 'var(--statement-fg)',
        boxShadow: '0 14px 34px rgba(10, 14, 30, 0.22)',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(70% 60% at 100% 0%, oklch(0.5 0.12 35 / 0.45) 0%, transparent 60%), radial-gradient(60% 60% at 0% 100%, oklch(0.5 0.09 200 / 0.35) 0%, transparent 60%)' }} />
        {[ 'from', 'to' ].map((side, i) => (
          <div key={side} style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row',
            minHeight: 92, padding: '10px 16px',
            borderTop: i === 1 ? '0.5px solid rgba(255,255,255,0.12)' : 'none',
          }}>
            {curBtn(side)}
            <div dir="ltr" style={{ direction: 'ltr', flex: 1, minWidth: 0, textAlign: ar ? 'left' : 'right', display: 'flex', flexDirection: 'column', alignItems: ar ? 'flex-start' : 'flex-end' }}>
              {side === 'from' && exprText && (
                <div className="mono" style={{ display: 'flex', alignItems: 'center', fontSize: 13, opacity: 0.7, whiteSpace: 'nowrap', maxWidth: '100%', direction: 'ltr' }}>
                  <span style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>{exprText.length > 30 ? '…' + exprText.slice(-29) : exprText}</span>
                  {!picking && caret('1em')}
                </div>
              )}
              <div className="mono" style={{
                display: 'flex', alignItems: 'center', gap: 2, maxWidth: '100%',
                fontSize: sizeFor(side === 'from' ? fromText : toText), fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15,
                color: side === 'to' ? 'oklch(0.86 0.11 80)' : (expr ? 'var(--statement-fg)' : 'rgba(255,255,255,0.35)'),
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{side === 'from' ? fromText : toText}</span>
                {side === 'from' && !picking && !showExpr && caret('0.95em')}
              </div>
            </div>
          </div>
        ))}
        {/* swap */}
        <button onClick={swap} aria-label={ar ? 'بدّل العملتين' : 'Swap currencies'} className="fx-key" style={{
          position: 'absolute', top: '50%', insetInlineStart: '50%', width: 44, height: 44, marginTop: -22,
          marginInlineStart: -22, borderRadius: 999, border: 'none', display: 'grid', placeItems: 'center',
          background: 'oklch(0.97 0.012 80)', color: 'oklch(0.22 0.025 250)',   // light in both themes
          boxShadow: '0 6px 16px rgba(0,0,0,0.35), 0 0 0 4px var(--statement)',
        }}>
          <span style={{ display: 'grid', placeItems: 'center', transform: `rotate(${turn * 180}deg)`, transition: 'transform 420ms cubic-bezier(.34,1.56,.64,1)' }}>
            <FxSwapIcon size={19} sw={2.3} />
          </span>
        </button>
      </div>

      {picking ? (
        /* Pick a currency */
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8, animation: 'fxIn 200ms ease' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={ar ? 'ابحث: ريال، دولار، EUR…' : 'Search: euro, dirham, USD…'}
              style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 14, border: '0.5px solid var(--hairline)', background: 'var(--cream-2)', color: 'var(--ink)', fontSize: 15, fontFamily: 'var(--sans)', outline: 'none' }} />
            <button onClick={() => { setPicking(null); setQ(''); }} style={{ minHeight: 44, padding: '0 14px', borderRadius: 14, border: 'none', background: 'transparent', color: 'var(--clay-deep)', fontSize: 14.5, fontWeight: 600 }}>
              {ar ? 'رجوع' : 'Back'}
            </button>
          </div>
          <div className="no-scrollbar" style={{ flex: 1, minHeight: 200, maxHeight: 'calc(4 * clamp(46px, 6.7vh, 58px) + 24px)', overflowY: 'auto', borderRadius: 18, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
            {list.map((c, i) => {
              const on = pair[picking] === c;
              return (
                <button key={c} onClick={() => pick(picking, c)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
                  padding: '10px 14px', border: 'none', background: on ? 'oklch(0.62 0.13 35 / 0.08)' : 'transparent',
                  borderTop: i ? '0.5px solid var(--hairline)' : 'none', color: 'var(--ink)', textAlign: 'start',
                }}>
                  <FxCoin code={c} size={28} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600 }}>{window.fxName(c)}</span>
                    <span className="mono" style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-mute)' }}>{c}</span>
                  </span>
                  {on && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clay)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7" /></svg>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* Today's rate + round prices at a glance (tap one) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div dir="ltr" className="mono" style={{ direction: 'ltr', textAlign: 'center', fontSize: 12, color: 'var(--ink-mute)' }}>
              1 {pair.from} = {_fxRateText(rate)} {pair.to}
            </div>
            <div className="no-scrollbar" dir="ltr" style={{ direction: 'ltr', display: 'flex', gap: 7, overflowX: 'auto', padding: '1px 1px 2px' }}>
              {_fxQuick(pair.from).map((v) => (
                <button key={v} onClick={() => { window.haptic?.(); setExpr(String(v)); }} className="fx-key" style={{
                  flexShrink: 0, padding: '7px 11px', borderRadius: 999, border: '0.5px solid var(--hairline)',
                  background: 'var(--cream-2)', color: 'var(--ink)', display: 'flex', alignItems: 'baseline', gap: 5,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{v.toLocaleString('en')}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>→ {_fxFmt(_fxConvert(v, pair.from, pair.to), pair.to)}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Keypad */}
          <div dir="ltr" style={{ direction: 'ltr', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 'auto' }}>
            {keys.map((k) => (
              <button key={k} className="fx-key" onClick={() => press(k)}
                aria-label={k === 'del' ? (ar ? 'حذف' : 'Delete') : k === 'C' ? (ar ? 'مسح' : 'Clear') : k}
                style={keyStyle(k)}>
                {k === 'del'
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z" /><path d="m17 9-6 6" /><path d="m11 9 6 6" /></svg>
                  : k}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FxHost() {
  const [state, setState] = React.useState({ open: false, trip: null, key: 0 });
  React.useEffect(() => {
    window.openFx = (trip) => setState((s) => ({ open: true, trip: trip || null, key: s.key + 1 }));
    return () => { window.openFx = null; };
  }, []);
  const close = React.useCallback(() => setState((s) => ({ ...s, open: false })), []);
  // Sized to its content: card + rate + prices + keypad (+ the home-bar inset).
  const vh = (typeof window !== 'undefined' && window.innerHeight) || 800;
  const keyH = Math.min(58, Math.max(46, vh * 0.067));
  const need = 24 + 184 + 12 + 18 + 8 + 38 + 12 + (4 * keyH + 24) + 16 + 34;
  const h = Math.min(0.94, need / vh);
  const Sheet = window.Sheet;
  if (!Sheet) return null;
  return (
    <Sheet open={state.open} onClose={close} height={h}>
      {state.open || state.key ? <FxConverter key={state.key} trip={state.trip} onClose={close} /> : null}
    </Sheet>
  );
}

window.FxFab = FxFab;
window.FxHost = FxHost;
