// ── Analysis: one chart kit, three surfaces ────────────────────────────
//   ExpenseSummary   — the single summary card at the top of Expenses
//   TripAnalysis     — "تحليل السفر" for the open trip
//   LifetimeInsights — the all-trips analysis
// Chart rules (dataviz): one hero figure per view, thin bars with a 4px
// rounded data end, 2px lines, 10% area wash, hairline solid gridlines,
// a legend whenever there are 2+ series, tap for exact values, text never
// in a series colour. Category colours are the validated set in tokens.css
// (--cat-*), stacked in a fixed order, never by rank.

const CAT_ORDER = ['culture', 'lodging', 'transit', 'food', 'shopping', 'wellness', 'misc'];
const catColor = (k) => `var(--cat-${CAT_ORDER.includes(k) ? k : 'misc'})`;
const catName = (k) => (typeof t === 'function' && t(k)) || k;
const _rtl = () => !!window.isRTL;
const _home = (usd) => window.fmtMoney(usd, { in: 'home' });
const _rate = () => (window.fxRate ? window.fxRate(window.TRIP?.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD') : 1) || 1;
const _niceUSD = (usd) => _niceMax(usd * _rate()) / _rate();   // round in the currency people read
function _compact(usd) {                       // axis ticks: 0 / 1.2K / 12K in home currency
  const v = (usd || 0) * _rate();
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (v >= 1000) return (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K';
  return String(Math.round(v));
}
function _niceMax(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
const _day = (iso) => new Date(iso + 'T00:00:00');
const _addDays = (iso, n) => { const d = _day(iso); d.setDate(d.getDate() + n); return window.localISO(d); };
const _between = (a, b) => Math.round((_day(b) - _day(a)) / 86400000);

// One model of the trip's money, shared by Expenses and the analysis.
function tripModel(trip, expenses) {
  const planned = trip?.budget?.plannedUSD || 0;
  const today = window.localISO();
  const total = expenses.reduce((s, e) => s + (e.usd || 0), 0);
  const general = expenses.filter((e) => window.isGeneralBudgetExpense?.(e, trip));
  const generalUSD = general.reduce((s, e) => s + (e.usd || 0), 0);
  const byCat = {}; expenses.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const m = { planned, total, generalUSD, byCat, today, days: [], started: false, ended: false };
  if (!trip?.startDate || !trip?.endDate) return m;
  m.totalDays = Math.max(1, _between(trip.startDate, trip.endDate) + 1);
  m.started = today >= trip.startDate; m.ended = today > trip.endDate;
  const last = m.ended ? trip.endDate : (m.started ? today : trip.startDate);
  m.daysSoFar = m.started ? Math.max(1, _between(trip.startDate, last) + 1) : 0;
  const byDay = {};
  expenses.forEach((e) => { if (window.isGeneralBudgetExpense?.(e, trip)) return; const k = window.localISO(e.createdAt); (byDay[k] = byDay[k] || { v: 0, n: 0 }); byDay[k].v += e.usd || 0; byDay[k].n += 1; });
  for (let i = 0; i < m.daysSoFar; i++) { const k = _addDays(trip.startDate, i); m.days.push({ i: i + 1, k, v: byDay[k]?.v || 0, n: byDay[k]?.n || 0 }); }
  m.dailyUSD = m.days.reduce((s, d) => s + d.v, 0);
  m.avg = m.daysSoFar ? m.dailyUSD / m.daysSoFar : 0;
  m.planPerDay = planned > 0 ? Math.max(0, (planned - generalUSD) / m.totalDays) : 0;
  m.projection = generalUSD + m.avg * m.totalDays;
  m.peak = m.days.reduce((a, d) => (d.v > (a?.v || 0) ? d : a), null);
  m.daysLeft = m.ended ? 0 : m.totalDays - m.daysSoFar + (m.started ? 1 : 0);
  return m;
}
window.tripModel = tripModel;

// ── Chart kit ──────────────────────────────────────────────────────────
function Panel({ title, sub, right, children, style }) {
  return (
    <div style={{ margin: '0 14px 14px', background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', borderRadius: 22, padding: '16px 16px 14px', ...style }}>
      {(title || right) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 3, lineHeight: 1.5 }}>{sub}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
function StatTile({ label, value, sub, tone }) {
  return (
    <div style={{ background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', borderRadius: 18, padding: '12px 14px', minWidth: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight: 700, color: tone || 'var(--ink)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
    </div>
  );
}
const Grid2 = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10, margin: '0 14px 14px' }}>{children}</div>;
const LineKey = ({ color, dash, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-soft)' }}>
    <svg width="16" height="6"><line x1="1" y1="3" x2="15" y2="3" stroke={color} strokeWidth="2" strokeDasharray={dash ? '3 3' : undefined} strokeLinecap="round" /></svg>{label}
  </span>
);
const BoxKey = ({ color, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-soft)' }}>
    <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />{label}
  </span>
);
// Tap/hover readout: value first (strong), label second.
const Tip = ({ x, value, label, W }) => (
  <div style={{ position: 'absolute', top: -6, left: `${Math.max(14, Math.min(86, (x / W) * 100))}%`, transform: 'translate(-50%, -100%)', pointerEvents: 'none',
    background: 'var(--ink)', color: 'var(--cream)', borderRadius: 10, padding: '6px 10px', whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,0.18)', zIndex: 3 }}>
    <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
    <div style={{ fontSize: 11, opacity: 0.75 }}>{label}</div>
  </div>
);

// Columns over time, optional reference line; columns above it are emphasised.
function ColumnChart({ points, refValue, refLabel, fmt = _home, height = 150, emphasise, labelEvery }) {
  const ar = _rtl(), W = 340, H = height, top = 12, base = H - 22, left = ar ? 4 : 34, right = ar ? 34 : 4;
  const [sel, setSel] = React.useState(null);
  const max = _niceUSD(Math.max(refValue || 0, ...points.map((p) => p.value), 0) * 1.05);
  const n = Math.max(1, points.length), plotW = W - left - right, slot = plotW / n, bw = Math.min(22, slot * 0.62);
  const y = (v) => base - (v / max) * (base - top);
  const xOf = (i) => { const c = left + slot * (i + 0.5); return ar ? W - c : c; };
  const ticks = [0, max / 2, max];
  const every = labelEvery || Math.ceil(n / 10);
  const s = sel != null ? points[sel] : null;
  return (
    <div style={{ position: 'relative' }}>
      {s && <Tip x={xOf(sel)} value={fmt(s.value)} label={s.tip || s.label} W={W} />}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', direction: 'ltr', overflow: 'visible' }} onPointerLeave={() => setSel(null)}>
        {ticks.map((tv, i) => (
          <g key={i}>
            <line x1={left} x2={W - right} y1={y(tv)} y2={y(tv)} stroke="var(--viz-grid)" strokeWidth="1" />
            <text x={ar ? W - 2 : 2} y={y(tv) + 3.5} textAnchor={ar ? 'end' : 'start'} fontSize="9.5" fill="var(--ink-mute)">{_compact(tv)}</text>
          </g>
        ))}
        {points.map((p, i) => {
          const h = Math.max(p.value > 0 ? 2 : 0, base - y(p.value)), x = xOf(i) - bw / 2, r = Math.min(4, bw / 2, h);
          const hot = emphasise ? emphasise(p) : false;
          const fill = sel === i ? 'var(--ink)' : hot ? 'var(--clay)' : 'var(--ink-mute)';
          return (
            <g key={p.key} onPointerEnter={() => setSel(i)} onPointerDown={() => setSel(sel === i ? null : i)} style={{ cursor: 'pointer' }}>
              <rect x={xOf(i) - slot / 2} y={top} width={slot} height={base - top + 18} fill="transparent" />
              {h > 0 && <path className="v-bar" style={{ animationDelay: `${80 + i * 35}ms` }} fill={fill} opacity={sel == null || sel === i ? 1 : 0.55}
                d={`M${x},${base} V${base - h + r} Q${x},${base - h} ${x + r},${base - h} H${x + bw - r} Q${x + bw},${base - h} ${x + bw},${base - h + r} V${base} Z`} />}
              {(i % every === 0 || (!labelEvery && i === n - 1)) && <text x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="9.5" fill="var(--ink-mute)">{p.label}</text>}
            </g>
          );
        })}
        <line x1={left} x2={W - right} y1={base} y2={base} stroke="var(--hairline-2)" strokeWidth="1" />
        {refValue > 0 && <line x1={left} x2={W - right} y1={y(refValue)} y2={y(refValue)} stroke="var(--moss)" strokeWidth="1.5" strokeDasharray="4 4" />}
      </svg>
      {refValue > 0 && (
        <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
          {emphasise && <BoxKey color="var(--clay)" label={ar ? 'فوق الخطة' : 'Over plan'} />}
          <BoxKey color="var(--ink-mute)" label={ar ? 'ضمن الخطة' : 'Within plan'} />
          <LineKey color="var(--moss)" dash label={refLabel} />
        </div>
      )}
    </div>
  );
}

// Cumulative spend vs budget, with a dashed projection to the last day.
function BurnChart({ m }) {
  const ar = _rtl(), W = 340, H = 170, top = 12, base = H - 22, left = ar ? 4 : 34, right = ar ? 34 : 4;
  const [sel, setSel] = React.useState(null);
  const cum = []; let acc = m.generalUSD;
  m.days.forEach((d) => { acc += d.v; cum.push(acc); });
  const max = _niceUSD(Math.max(m.planned, m.projection || 0, acc) * 1.05);
  const X = (day) => { const c = left + (day / m.totalDays) * (W - left - right); return ar ? W - c : c; };
  const Y = (v) => base - (v / max) * (base - top);
  const pts = [[0, m.generalUSD], ...cum.map((v, i) => [i + 1, v])];
  const line = pts.map(([d, v], i) => `${i ? 'L' : 'M'}${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${X(pts[pts.length - 1][0]).toFixed(1)},${base} L${X(0).toFixed(1)},${base} Z`;
  const lastD = pts[pts.length - 1][0], lastV = pts[pts.length - 1][1];
  const over = m.planned > 0 && m.projection > m.planned;
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect(); let fx = (e.clientX - r.left) / r.width * W; if (ar) fx = W - fx;
    const d = Math.round(((fx - left) / (W - left - right)) * m.totalDays); setSel(Math.max(0, Math.min(lastD, d)));
  };
  const ticks = [0, max / 2, max];
  return (
    <div style={{ position: 'relative' }}>
      {sel != null && <Tip x={X(sel)} value={_home(pts[sel][1])} label={sel === 0 ? (ar ? 'قبل الرحلة (حجوزات)' : 'Before the trip (bookings)') : (ar ? `حتى اليوم ${sel}` : `Through day ${sel}`)} W={W} />}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', direction: 'ltr', overflow: 'visible', touchAction: 'pan-y' }}
        onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setSel(null)}>
        <defs><linearGradient id="burn-wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--cat-culture)" stopOpacity="0.16" /><stop offset="1" stopColor="var(--cat-culture)" stopOpacity="0.02" /></linearGradient></defs>
        {ticks.map((tv, i) => (
          <g key={i}><line x1={left} x2={W - right} y1={Y(tv)} y2={Y(tv)} stroke="var(--viz-grid)" />
            <text x={ar ? W - 2 : 2} y={Y(tv) + 3.5} textAnchor={ar ? 'end' : 'start'} fontSize="9.5" fill="var(--ink-mute)">{_compact(tv)}</text></g>
        ))}
        {m.planned > 0 && <>
          <line x1={X(0)} x2={X(m.totalDays)} y1={Y(m.planned)} y2={Y(m.planned)} stroke="var(--ink-soft)" strokeWidth="1.5" />
          <line x1={X(0)} x2={X(m.totalDays)} y1={Y(m.generalUSD)} y2={Y(m.planned)} stroke="var(--moss)" strokeWidth="1.5" strokeDasharray="4 4" />
        </>}
        <path d={area} fill="url(#burn-wash)" className="v-wash" />
        <path d={line} fill="none" stroke="var(--cat-culture)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="v-draw" pathLength="1" />
        {!m.ended && lastD < m.totalDays && <line x1={X(lastD)} y1={Y(lastV)} x2={X(m.totalDays)} y2={Y(m.projection)} stroke={over ? 'var(--clay)' : 'var(--cat-culture)'} strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />}
        {sel != null && <line x1={X(sel)} x2={X(sel)} y1={top} y2={base} stroke="var(--ink-mute)" strokeWidth="1" />}
        <circle cx={X(sel != null ? sel : lastD)} cy={Y(sel != null ? pts[sel][1] : lastV)} r="5" fill="var(--cat-culture)" stroke="var(--cream-2)" strokeWidth="2" />
        <line x1={left} x2={W - right} y1={base} y2={base} stroke="var(--hairline-2)" />
        {[1, Math.ceil(m.totalDays / 2), m.totalDays].map((d) => <text key={d} x={X(d)} y={H - 6} textAnchor="middle" fontSize="9.5" fill="var(--ink-mute)">{ar ? `يوم ${d}` : `Day ${d}`}</text>)}
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
        <LineKey color="var(--cat-culture)" label={ar ? 'المصروف التراكمي' : 'Spent so far'} />
        {!m.ended && <LineKey color={over ? 'var(--clay)' : 'var(--cat-culture)'} dash label={ar ? 'التوقع بنفس الوتيرة' : 'Projection'} />}
        {m.planned > 0 && <LineKey color="var(--moss)" dash label={ar ? 'المسار المثالي' : 'Ideal pace'} />}
        {m.planned > 0 && <LineKey color="var(--ink-soft)" label={ar ? 'الميزانية' : 'Budget'} />}
      </div>
    </div>
  );
}

// Part-to-whole in one bar (fixed category order, 2px surface gaps) + legend.
function CategoryBar({ byCat, total, scaleTo, onPick, active, onDark, fmt = _home, height = 12, compact }) {
  const items = CAT_ORDER.map((k) => [k, byCat[k] || 0]).filter(([, v]) => v > 0);
  const extra = Object.keys(byCat).filter((k) => !CAT_ORDER.includes(k)).reduce((s, k) => s + byCat[k], 0);
  if (extra) { const misc = items.find(([k]) => k === 'misc'); if (misc) misc[1] += extra; else items.push(['misc', extra]); }
  const whole = scaleTo || total || 1;
  const fill = Math.min(1, total / whole);
  const track = onDark ? 'rgba(255,255,255,0.12)' : 'var(--cream)';
  const ranked = items.slice().sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <div style={{ height, borderRadius: 99, background: track, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
        <div className="v-grow" style={{ width: `${fill * 100}%`, display: 'flex', flexDirection: 'row', gap: 2, height: '100%' }}>
          {items.map(([k, v]) => <div key={k} style={{ flex: `${v} 0 0`, background: catColor(k), opacity: active && active !== 'all' && active !== k ? 0.3 : 1, transition: 'opacity 200ms' }} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'minmax(0,1fr) minmax(0,1fr)' : 'none', gridAutoFlow: compact ? 'row' : undefined, ...(compact ? {} : { display: 'flex', flexWrap: 'wrap' }), gap: 8, marginTop: 12 }}>
        {ranked.map(([k, v]) => {
          const on = active === k;
          const Tag = onPick ? 'button' : 'div';
          return (
            <Tag key={k} onClick={onPick ? () => { onPick(on ? 'all' : k); window.haptic?.(); } : undefined} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: compact ? '6px 9px' : '6px 10px', borderRadius: 999, minHeight: 32, minWidth: 0, overflow: 'hidden',
              background: on ? (onDark ? 'var(--statement-fg)' : 'var(--sel)') : (onDark ? 'rgba(255,255,255,0.08)' : 'var(--cream)'),
              color: on ? (onDark ? 'var(--statement)' : 'var(--sel-fg)') : (onDark ? 'var(--statement-fg)' : 'var(--ink)'),
              border: onDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid var(--hairline)', fontSize: 12.5,
            }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: catColor(k), flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: compact ? 1 : 'none', textAlign: 'start' }}>{compact ? (window.CAT_META?.[k]?.[window.isRTL ? 'label_ar' : 'label_en'] || catName(k)) : catName(k)}</span>
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{fmt(v)}</span>
              {!compact && <span style={{ opacity: 0.6, fontSize: 11 }}>{Math.round((v / (total || 1)) * 100)}%</span>}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

// Ranked horizontal bars (one hue; the leader in ink, the rest muted).
function RankBars({ rows, fmt = _home }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {rows.map((r, i) => (
        <button key={r.key} onClick={r.onClick} disabled={!r.onClick} style={{ display: 'block', width: '100%', textAlign: 'start', background: 'transparent', cursor: r.onClick ? 'pointer' : 'default' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{fmt(r.value)}</span>
          </div>
          {r.sub && <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>{r.sub}</div>}
          <div style={{ height: 8, borderRadius: 99, background: 'var(--cream)', marginTop: 6, overflow: 'hidden' }}>
            <div className="v-grow" style={{ width: `${(r.value / max) * 100}%`, height: '100%', borderRadius: 99, background: r.color || (i === 0 ? 'var(--ink)' : 'var(--ink-mute)'), animationDelay: `${100 + i * 60}ms` }} />
          </div>
        </button>
      ))}
    </div>
  );
}
Object.assign(window, { AnPanel: Panel, AnStatTile: StatTile, ColumnChart, BurnChart, CategoryBar, RankBars, CAT_ORDER });

// "At this pace you'll finish on X — Y under budget" (null before the trip).
function paceLine(m, fmt) {
  if (!m.started || !(m.planned > 0) || !m.days.length) return null;
  const ar = _rtl();
  const end = m.ended ? m.total : m.projection, diff = m.planned - end;
  const tone = { display: 'block', color: diff >= 0 ? '#9fe6bd' : '#ffb4a2', fontWeight: 700 };
  return ar
    ? <>{m.ended ? 'خلصت الرحلة على ' : 'بهالوتيرة بتخلصون على '}<b>{fmt(end)}</b><span style={tone}>{diff >= 0 ? 'أقل' : 'أعلى'} من الميزانية بـ {fmt(Math.abs(diff))}</span></>
    : <>{m.ended ? 'Finished on ' : "At this pace you'll finish on "}<b>{fmt(end)}</b><span style={tone}>{fmt(Math.abs(diff))} {diff >= 0 ? 'under budget' : 'over budget'}</span></>;
}

// ── Expenses: a short summary — spent, what's left, one bar ───────────
// The category split shows as the bar's colours (the chips under it are
// the legend and the filter); pace and the rest live in Analysis.
function ExpenseSummary({ trip, expenses, conv, currencyToggle, onAnalysis }) {
  const ar = _rtl();
  const m = tripModel(trip, expenses);
  const pct = m.planned > 0 ? m.total / m.planned : 0;
  const over = m.planned > 0 && m.total > m.planned;
  const unpaid = Object.values(window.DOCS_BY_CAT || {}).flat().filter((d) => d && !d.ownerUserId && d.costUSD > 0 && !window.isDocPaid?.(d));
  const unpaidUSD = unpaid.reduce((s, d) => s + (d.costUSD || 0), 0);
  const items = CAT_ORDER.map((k) => [k, m.byCat[k] || 0]).filter(([, v]) => v > 0);
  const extra = Object.keys(m.byCat).filter((k) => !CAT_ORDER.includes(k)).reduce((s, k) => s + m.byCat[k], 0);
  if (extra) { const misc = items.find(([k]) => k === 'misc'); if (misc) misc[1] += extra; else items.push(['misc', extra]); }
  const scale = m.planned > m.total ? m.planned : (m.total || 1);
  return (
    <div style={{ padding: '0 14px 4px' }}>
      <div style={{ background: 'var(--statement)', color: 'var(--statement-fg)', borderRadius: 24, padding: '16px 18px 14px', boxShadow: 'var(--shadow-card)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 100% 0%, oklch(0.45 0.10 35 / 0.35) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--statement-sub)' }}>{ar ? 'صرفتوا' : 'Spent'}</div>
            {currencyToggle}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap' }}>
              <window.CountUp id={'sum-' + trip.id} value={m.total} format={conv} />
            </div>
            {m.planned > 0 && (
              <div style={{ textAlign: 'end', flexShrink: 0, paddingBottom: 3 }}>
                <div style={{ fontSize: 11.5, color: 'var(--statement-sub)' }}>{over ? (ar ? 'تجاوزتوا بـ' : 'Over by') : (ar ? 'باقي' : 'Left')}</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: over ? '#ffb4a2' : 'var(--statement-fg)', whiteSpace: 'nowrap' }}>{conv(Math.abs(m.planned - m.total))}</div>
              </div>
            )}
          </div>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginTop: 12, display: 'flex' }}>
            <div className="v-grow" style={{ width: `${Math.min(1, m.total / scale) * 100}%`, display: 'flex', gap: 2, height: '100%' }}>
              {items.map(([k, v]) => <div key={k} style={{ flex: `${v} 0 0`, background: over ? 'var(--clay)' : catColor(k) }} />)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8, fontSize: 12.5, color: 'var(--statement-sub)' }}>
            <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {m.planned > 0
                ? (ar ? <>{Math.round(pct * 100)}% من ميزانية <b style={{ color: 'var(--statement-fg)' }}>{conv(m.planned)}</b></> : <>{Math.round(pct * 100)}% of <b style={{ color: 'var(--statement-fg)' }}>{conv(m.planned)}</b></>)
                : (ar ? 'ما فيه ميزانية محددة' : 'No budget set')}
            </span>
            {onAnalysis && (
              <button onClick={onAnalysis} style={{
                flexShrink: 0, minHeight: 32, padding: '0 2px', background: 'transparent',
                display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--statement-fg)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
                {ar ? 'التحليل' : 'Analysis'}
                <span className="icon-flip" style={{ display: 'inline-flex' }}><IconChevron size={11} stroke="currentColor" /></span>
              </button>
            )}
          </div>
          {unpaidUSD > 0 && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.12)', fontSize: 12.5, color: 'var(--statement-sub)', lineHeight: 1.5 }}>
              ⏳ {ar ? <>حجوزات ما اندفعت بعد <b style={{ color: 'var(--statement-fg)' }}>{conv(unpaidUSD)}</b> — تنحسب لما تندفع</> : <>Unpaid bookings <b style={{ color: 'var(--statement-fg)' }}>{conv(unpaidUSD)}</b> — counted once paid</>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.ExpenseSummary = ExpenseSummary;

// ── تحليل السفر (trip) ─────────────────────────────────────────────────
function TripAnalysis({ go, loading }) {
  const ar = _rtl();
  const trip = window.TRIP;
  const Header = window.Header;
  const head = <Header title={ar ? 'تحليل السفر' : 'Travel analysis'} onBack={() => go('budget')} action={<span />} />;
  if (loading || !trip || !window.isTripDataReady?.(trip.id)) return <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>{head}<TripSkeleton /></div>;
  const expenses = window.EXPENSES || [];
  if (!expenses.length) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>{head}
        <div style={{ padding: '60px 32px', textAlign: 'center', color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          <div style={{ fontSize: 38 }}>📊</div>
          <div className="serif" style={{ fontSize: 19, color: 'var(--ink)', margin: '8px 0' }}>{ar ? 'التحليل يبدأ مع أول مصروف' : 'Analysis starts with your first expense'}</div>
        </div>
      </div>
    );
  }
  const m = tripModel(trip, expenses);
  const members = window.MEMBERS || [];
  const wallets = window.walletsOf?.(trip);
  const b = wallets ? window.computeTodayBudget?.(trip, expenses, m.today) : null;
  const pct = m.planned > 0 ? Math.min(1, m.total / m.planned) : 0;
  const top = expenses.slice().sort((x, y) => (y.usd || 0) - (x.usd || 0)).slice(0, 5);
  const fmtDay = (k) => _day(k).toLocaleDateString(ar ? 'ar' : 'en', { weekday: 'short', day: 'numeric', month: 'short' });
  const leftToday = m.started && !m.ended && m.planned > 0 && m.daysLeft > 0 ? (m.planned - m.total) / m.daysLeft : null;
  const payers = members.map((mm) => ({ m: mm, v: expenses.filter((e) => e.who === mm.id).reduce((s, e) => s + (e.usd || 0), 0) })).filter((x) => x.v > 0).sort((a, c) => c.v - a.v);
  return (
    <div data-screen-label="Trip analysis" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 110 }}>
      {head}
      {/* hero: the one number + meter */}
      <div style={{ margin: '0 14px 14px', background: 'var(--statement)', color: 'var(--statement-fg)', borderRadius: 26, padding: '18px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ fontSize: 13, color: 'var(--statement-sub)' }}>{ar ? 'إجمالي الصرف' : 'Total spent'}{m.started ? (ar ? ` · ${m.ended ? 'الرحلة خلصت' : `اليوم ${m.daysSoFar} من ${m.totalDays}`}` : ` · ${m.ended ? 'trip ended' : `day ${m.daysSoFar} of ${m.totalDays}`}`) : ''}</div>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 2 }}><window.CountUp value={m.total} format={_home} /></div>
        {m.planned > 0 && <>
          <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.12)', marginTop: 12, overflow: 'hidden' }}>
            <div className="v-grow" style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 99, background: m.total > m.planned ? 'var(--clay)' : 'var(--statement-fg)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--statement-sub)', marginTop: 6 }}>
            <span>{Math.round((m.total / m.planned) * 100)}% {ar ? 'من الميزانية' : 'of budget'}</span>
            <span>{ar ? 'الميزانية' : 'Budget'} {_home(m.planned)}</span>
          </div>
        </>}
        {paceLine(m, _home) && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.12)', display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--statement-sub)', lineHeight: 1.55 }}>
            <span aria-hidden="true">📈</span><span style={{ minWidth: 0 }}>{paceLine(m, _home)}</span>
          </div>
        )}
      </div>
      <Grid2>
        <StatTile label={ar ? 'المتوسط اليومي' : 'Daily average'} value={_home(m.avg || 0)} sub={m.planPerDay ? (ar ? `الخطة ${_home(m.planPerDay)}` : `Plan ${_home(m.planPerDay)}`) : (ar ? 'بدون الحجوزات' : 'excl. bookings')} tone={m.planPerDay && m.avg > m.planPerDay ? 'var(--clay-deep)' : undefined} />
        <StatTile label={ar ? 'أعلى يوم' : 'Biggest day'} value={m.peak ? _home(m.peak.v) : '—'} sub={m.peak ? fmtDay(m.peak.k) : ''} />
        <StatTile label={ar ? 'الحجوزات' : 'Bookings'} value={_home(m.generalUSD)} sub={ar ? 'طيران وسكن قبل الرحلة' : 'paid before the trip'} />
        {leftToday != null
          ? <StatTile label={ar ? 'متاح لكل يوم باقي' : 'Per remaining day'} value={_home(Math.max(0, leftToday))} sub={ar ? `${m.daysLeft} أيام باقية` : `${m.daysLeft} days left`} tone={leftToday < 0 ? 'var(--clay-deep)' : 'var(--moss)'} />
          : <StatTile label={ar ? 'عدد المصاريف' : 'Expenses'} value={String(expenses.length)} sub={ar ? `${payers.length} دافعين` : `${payers.length} payers`} />}
      </Grid2>
      {m.started && m.days.length > 0 && (
        <Panel title={ar ? 'وتيرة الصرف' : 'Spending pace'} sub={m.planned > 0 ? (ar ? 'المصروف التراكمي مقابل الميزانية — اسحب على الرسم لتشوف أي يوم' : 'Cumulative spend vs budget — drag across for any day') : null}>
          <BurnChart m={m} />
        </Panel>
      )}
      {m.days.length > 0 && (
        <Panel title={ar ? 'الصرف اليومي' : 'Daily spend'} sub={ar ? 'بدون الحجوزات. اضغط على أي يوم لقيمته' : 'Excludes bookings. Tap a day for its total'}>
          <ColumnChart points={m.days.map((d) => ({ key: d.k, label: String(d.i), value: d.v, tip: `${ar ? 'يوم' : 'Day'} ${d.i} · ${fmtDay(d.k)} · ${d.n} ${ar ? 'عمليات' : 'items'}` }))}
            refValue={m.planPerDay} refLabel={ar ? 'خطة اليوم' : 'Daily plan'} emphasise={m.planPerDay ? (p) => p.value > m.planPerDay : null} />
        </Panel>
      )}
      <Panel title={ar ? 'حسب التصنيف' : 'By category'}>
        <CategoryBar byCat={m.byCat} total={m.total} />
      </Panel>
      {b && b.cards && b.cards.length > 0 ? (
        <Panel title={ar ? 'البطاقات' : 'Cards'} sub={ar ? 'اضغط بطاقة لتشوف مصاريفها' : 'Tap a card for its spending'}>
          <div style={{ display: 'grid', gap: 12 }}>
            {b.cards.map((c) => {
              const mm = members.find((x) => x.id === c.id) || { id: c.id, name: '?' };
              const p = c.amountUSD > 0 ? Math.min(1, c.spent / c.amountUSD) : 0;
              return (
                <button key={c.id} onClick={() => window.openCardExpenses?.(c.id)} style={{ display: 'block', width: '100%', textAlign: 'start', background: 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar m={mm} size={28} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{ar ? `بطاقة ${(mm.name || '').split(' ')[0]}` : `${(mm.name || '').split(' ')[0]}'s card`}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.left < 0 ? 'var(--clay-deep)' : 'var(--ink)' }}>{ar ? 'باقي ' : ''}{_home(c.left)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--cream)', marginTop: 7, overflow: 'hidden' }}>
                    <div className="v-grow" style={{ width: `${p * 100}%`, height: '100%', borderRadius: 99, background: c.left < 0 ? 'var(--clay)' : 'var(--ink-soft)' }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 4 }}>{ar ? `صُرف ${_home(c.spent)} من ${_home(c.amountUSD)}` : `${_home(c.spent)} of ${_home(c.amountUSD)}`}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      ) : payers.length > 1 && (
        <Panel title={ar ? 'مين دفع' : 'Who paid'}>
          <RankBars rows={payers.map(({ m: mm, v }) => ({ key: mm.id, label: (mm.name || '').split(' ')[0], value: v, onClick: () => window.openCardExpenses?.(mm.id) }))} />
        </Panel>
      )}
      <Panel title={ar ? 'أكبر المصاريف' : 'Largest expenses'}>
        <div style={{ display: 'grid', gap: 2 }}>
          {top.map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--cream)', fontSize: 16, flexShrink: 0, boxShadow: `inset 0 0 0 2px ${catColor(e.cat)}` }}>{window.CAT_META?.[e.cat]?.emoji || '•'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{catName(e.cat)} · {e.when}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{_home(e.usd)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
window.ScreenAnalytics = TripAnalysis;

// ── التحليل العام (all trips) ──────────────────────────────────────────
function LifetimeInsights({ go, goTrip }) {
  const ar = _rtl();
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG || null);
  React.useEffect(() => {
    let alive = true;
    window.loadLifetimeStats?.().then((s) => { if (alive && s) setStats(s); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const head = <LargeTitleHeader title={ar ? 'تحليل رحلاتك' : 'Your travels'} subtitle={ar ? 'كل رحلاتك في مكان واحد' : 'Every trip, at a glance'} onBack={() => go('trips')} />;
  if (!stats) return <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>{head}<TripSkeleton /></div>;
  const trips = (stats.tripSpend || []).filter((x) => x.spent > 0);
  // Month names never get chopped: full names on every third month, the
  // exact month + amount shows on tap.
  const monthName = (i, form) => new Date(2026, i, 1).toLocaleDateString(ar ? 'ar' : 'en', { month: form });
  const months = (stats.byMonth || []).map((mo, i) => ({ key: 'm' + i, label: monthName(i, ar ? 'long' : 'short'), value: mo.spent || 0, tip: `${monthName(i, 'long')} · ${mo.count || 0} ${ar ? 'عمليات' : 'items'}` }));
  const wk = (stats.byWeekday || []).map((d) => ({ key: 'w' + d.day, label: new Date(2026, 0, 4 + d.day).toLocaleDateString(ar ? 'ar' : 'en', { weekday: 'short' }), value: d.avg || 0, tip: ar ? 'متوسط اليوم' : 'avg per day' }));
  const topWk = wk.reduce((a, d) => (d.value > (a?.value || 0) ? d : a), null);
  const byCat = {}; (stats.byCategory || []).forEach((c) => { byCat[c.key] = c.value; });
  const fmtT = (tr) => (v) => window.fmtTripMoney ? window.fmtTripMoney(v, tr) : _home(v);
  return (
    <div data-screen-label="Lifetime analysis" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 110 }}>
      {head}
      <div style={{ margin: '0 14px 14px', borderRadius: 28, overflow: 'hidden', background: 'var(--statement)', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 50% 40%, oklch(0.45 0.10 35 / 0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', padding: '18px 18px 0', color: 'var(--statement-fg)' }}>
          <div style={{ fontSize: 13, color: 'var(--statement-sub)' }}>{ar ? 'صرفت على السفر' : 'Spent on travel'}</div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}><window.CountUp value={stats.totalSpentUSD || 0} format={_home} /></div>
          <div style={{ fontSize: 13, color: 'var(--statement-sub)', marginTop: 4 }}>
            {ar ? `${stats.totalTrips} رحلات · ${stats.totalDays} يوم · ${stats.countries} دول` : `${stats.totalTrips} trips · ${stats.totalDays} days · ${stats.countries} countries`}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -6 }}>
          <window.Globe width={380} height={300} radius={128} cy={160} pins={window.tripPins(window.TRIPS)} homeCode={window.homeCountryCode()} />
        </div>
      </div>
      <Grid2>
        <StatTile label={ar ? 'متوسط اليوم' : 'Per day'} value={_home(stats.avgDailyAcrossLifetime || 0)} sub={ar ? 'على كل أيام السفر' : 'across all travel days'} />
        <StatTile label={ar ? 'متوسط الرحلة' : 'Per trip'} value={_home(stats.avgTripCost || 0)} />
        <StatTile label={ar ? 'أطول رحلة' : 'Longest trip'} value={stats.longestTrip ? (ar ? `${stats.longestTrip.dur} يوم` : `${stats.longestTrip.dur} days`) : '—'} sub={stats.longestTrip?.title} />
        <StatTile label={ar ? 'أكبر عملية' : 'Biggest expense'} value={stats.topTx ? _home(stats.topTx.value || 0) : '—'}
          sub={stats.topTx ? [catName(stats.topTx.category), (window.TRIPS || []).find((x) => x.id === stats.topTx.trip_id)?.title].filter(Boolean).join(' · ') : ''} />
      </Grid2>
      {trips.length > 0 && (
        <Panel title={ar ? 'رحلاتك' : 'Your trips'} sub={ar ? 'مرتبة حسب الصرف — اضغط لتفتح الرحلة' : 'Ranked by spend — tap to open'}>
          <RankBars rows={trips.slice(0, 8).map((tr) => ({ key: tr.id, label: tr.title, value: tr.spent, sub: ar ? `${tr.dur} أيام · ${fmtT(tr)(tr.dailyAvg)} لليوم` : `${tr.dur} days · ${fmtT(tr)(tr.dailyAvg)}/day`, onClick: () => goTrip?.(tr.id) }))} />
        </Panel>
      )}
      {Object.keys(byCat).length > 0 && (
        <Panel title={ar ? 'وين تروح فلوسك' : 'Where it goes'}>
          <CategoryBar byCat={byCat} total={Object.values(byCat).reduce((s, v) => s + v, 0)} />
        </Panel>
      )}
      {months.some((mo) => mo.value > 0) && (
        <Panel title={ar ? 'الصرف على مدار السنة' : 'Through the year'} sub={ar ? 'اضغط على شهر لقيمته' : 'Tap a month'}>
          <ColumnChart points={months} labelEvery={3} />
        </Panel>
      )}
      {wk.some((d) => d.value > 0) && (
        <Panel title={ar ? 'أي يوم تصرف فيه أكثر؟' : 'Your priciest weekday'} sub={topWk ? (ar ? `${topWk.label} هو الأغلى بمتوسط ${_home(topWk.value)}` : `${topWk.label} averages ${_home(topWk.value)}`) : null}>
          <ColumnChart points={wk} emphasise={(p) => topWk && p.key === topWk.key} />
        </Panel>
      )}
    </div>
  );
}
window.ScreenInsights = LifetimeInsights;
