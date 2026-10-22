// Trip recap — the trip told back like a short film. Full-screen scenes play
// by themselves (tap the far side to skip, the near side to go back, hold to
// pause), each one a number or a moment from the trip: what you spent, the
// days, where the money went, the big one, whose card carried it, the
// bookings, the plan. It ends on a card you can share with the group.
//   window.openRecap(tripId?) — opens it (loads that trip first if needed)
//   <RecapHost/>              — mounted once in the app shell

const RC_CSS = `
@keyframes rc-in { from { opacity: 0; transform: translate3d(0, 18px, 0); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes rc-pop { 0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.07); } 100% { opacity: 1; transform: scale(1); } }
@keyframes rc-grow-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes rc-grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rc-burns { from { transform: scale(1.04); } to { transform: scale(1.2) translate3d(0, -2%, 0); } }
@keyframes rc-drift { 0% { transform: translate3d(-6%, -4%, 0) scale(1); } 50% { transform: translate3d(7%, 5%, 0) scale(1.18); } 100% { transform: translate3d(-6%, -4%, 0) scale(1); } }
@keyframes rc-scene { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: none; } }
@keyframes rc-drop { 0% { opacity: 0; transform: translate3d(0, -60px, 0) rotate(-7deg); } 65% { opacity: 1; transform: translate3d(0, 6px, 0) rotate(1.5deg); } 100% { opacity: 1; transform: rotate(-1.5deg); } }
@keyframes rc-slide { from { opacity: 0; transform: translate3d(var(--rc-dx, 48px), 0, 0); } to { opacity: 1; transform: none; } }
@keyframes rc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes rc-shine { from { transform: translateX(-120%); } to { transform: translateX(220%); } }
.rc-in   { animation: rc-in 700ms cubic-bezier(.2,.8,.2,1) both; }
.rc-pop  { animation: rc-pop 680ms cubic-bezier(.3,.7,.4,1) both; }
.rc-gy   { transform-origin: 50% 100%; animation: rc-grow-y 950ms cubic-bezier(.2,.8,.2,1) both; }
.rc-gx   { animation: rc-grow-x 950ms cubic-bezier(.2,.8,.2,1) both; }
.rc-drop { animation: rc-drop 850ms cubic-bezier(.3,.7,.4,1) both; }
.rc-slide{ animation: rc-slide 700ms cubic-bezier(.2,.8,.2,1) both; }
.rc-scene{ animation: rc-scene 560ms cubic-bezier(.2,.8,.2,1) both; }
.rc-reduce .rc-in, .rc-reduce .rc-pop, .rc-reduce .rc-drop, .rc-reduce .rc-slide, .rc-reduce .rc-scene { animation: rc-fade 380ms ease both; }
.rc-reduce .rc-gy, .rc-reduce .rc-gx { animation: none; }
.rc-reduce .rc-move { animation: none !important; }
`;

const _rcDelay = (ms) => ({ animationDelay: `${ms}ms` });
const _rcCatColor = (k) => `var(--cat-${['culture', 'lodging', 'transit', 'food', 'shopping', 'wellness', 'misc'].includes(k) ? k : 'misc'})`;
const _rcCatName = (k) => window.CAT_META?.[k]?.[window.isRTL ? 'label_ar' : 'label_en'] || (window.catLabel ? window.catLabel(k) : k);

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
    .filter((d) => !d.ownerUserId || d.ownerUserId === window.currentUserId);
  const plan = (window.ITINERARY || []).slice()
    .sort((a, b) => String(a.dayDate || '').localeCompare(String(b.dayDate || '')) || String(a.startTime || '').localeCompare(String(b.startTime || '')));
  const spent = m.days.filter((d) => d.v > 0);
  const calm = spent.length > 1 ? spent.reduce((a, d) => (d.v < a.v ? d : a), spent[0]) : null;
  const daysShown = m.ended ? m.totalDays : (m.daysSoFar || 0);
  const dayWord = (n) => (ar ? window.arPlural(n, { one: 'يوم واحد', two: 'يومين', few: `${n} أيام`, many: `${n} يوماً`, other: `${n} يوم` }) : `${n} ${n === 1 ? 'day' : 'days'}`);
  const peopleWord = (n) => (ar ? window.arPlural(n, { one: 'مسافر واحد', two: 'مسافرين', few: `${n} مسافرين`, many: `${n} مسافراً`, other: `${n} مسافر` }) : `${n} ${n === 1 ? 'traveller' : 'travellers'}`);
  return { ar, trip, expenses, m, fmt, members, wallets, cats, biggest, payers, docs, plan, calm, daysShown, dayWord, peopleWord };
}

// Counts up from zero once it's on screen.
function RcCount({ value, fmt, delay = 300, dur = 1500 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.vReduce?.()) { el.textContent = fmt(value); return; }
    let raf = 0, t0 = null;
    const tick = (now) => {
      if (t0 == null) t0 = now + delay;
      const p = Math.max(0, Math.min(1, (now - t0) / dur));
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? String(fmt(value * e)).replace(/\.\d+(?=\D*$)/, '') : fmt(value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span ref={ref} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{fmt(0)}</span>;
}

// A scene: dark stage, two slow-moving glows, content.
function RcScene({ bg = '#0b0d12', glow = [], align = 'center', children }) {
  return (
    <div className="rc-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: bg, color: '#fff' }}>
      {glow.map((c, i) => (
        <div key={i} className="rc-move" style={{
          position: 'absolute', width: '110%', height: '70%', borderRadius: '50%',
          insetInlineStart: i ? '15%' : '-35%', top: i ? '48%' : '-18%',
          background: `radial-gradient(closest-side, ${c}, transparent)`,
          animation: `rc-drift ${10 + i * 4}s ease-in-out infinite`, pointerEvents: 'none',
        }} />
      ))}
      <div style={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: align,
        padding: 'calc(env(safe-area-inset-top) + 84px) 28px calc(env(safe-area-inset-bottom) + 56px)',
      }}>{children}</div>
    </div>
  );
}

const _rcKicker = { fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.01em' };
const _rcBig = { fontSize: 60, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05 };

// ── Scenes ──────────────────────────────────────────────────────────
function RcIntro({ d }) {
  const { ar, trip, m, members } = d;
  const reduce = window.vReduce?.();
  return (
    <div className="rc-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0b0d12', color: '#fff' }}>
      <div className="rc-move" style={{ position: 'absolute', inset: '-3%', animation: reduce ? 'none' : 'rc-burns 7.5s ease-out both' }}>
        <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={trip.coverUrl || trip.coverImageUrl} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,6,10,0.45) 0%, rgba(5,6,10,0) 26%, rgba(5,6,10,0.18) 52%, rgba(5,6,10,0.94) 100%)' }} />
      <div style={{ position: 'absolute', insetInline: 28, bottom: 'calc(env(safe-area-inset-bottom) + 70px)' }}>
        <div className="rc-in" style={{ ..._rcDelay(250), ..._rcKicker }}>{ar ? 'ملخص رحلتكم' : 'Your trip, told back'}</div>
        <div className="rc-in serif-italic" style={{ ..._rcDelay(550), fontSize: 64, lineHeight: 1.02, marginTop: 6, textShadow: '0 4px 30px rgba(0,0,0,0.4)', overflowWrap: 'anywhere' }}>{trip.title || (ar ? 'رحلة' : 'Trip')}</div>
        <div className="rc-in" style={{ ..._rcDelay(950), fontSize: 16.5, fontWeight: 500, color: 'rgba(255,255,255,0.88)', marginTop: 14 }}>
          {[trip.dates, m.totalDays ? d.dayWord(m.totalDays) : null, members.length > 1 ? d.peopleWord(members.length) : null].filter(Boolean).join(' · ')}
        </div>
        {!m.ended && (
          <div className="rc-in" style={{ ..._rcDelay(1300), marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', fontSize: 13, fontWeight: 700 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: '#7be0a6' }} />
            {ar ? 'لين الحين' : 'So far'}
          </div>
        )}
      </div>
    </div>
  );
}

function RcTotal({ d }) {
  const { ar, m, fmt } = d;
  const planned = m.planned;
  const over = planned > 0 && m.total > planned;
  const pct = planned > 0 ? m.total / planned : 0;
  const left = planned - m.total;
  const verdict = planned > 0
    ? (over ? (ar ? `تجاوزتوا الميزانية بـ ${fmt(-left)}` : `${fmt(-left)} over budget`)
      : m.ended ? (ar ? `وبقى من الميزانية ${fmt(left)} 🎉` : `${fmt(left)} left in the budget 🎉`)
        : (ar ? `وباقي ${fmt(left)} من الميزانية` : `${fmt(left)} still in the budget`))
    : null;
  const len = String(fmt(m.total)).length;
  return (
    <RcScene bg="#0d0e13" glow={['rgba(226,120,80,0.55)', 'rgba(233,178,90,0.32)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{ar ? 'صرفتوا' : 'Together you spent'}</div>
      <div className="rc-pop" style={{ ..._rcDelay(350), ..._rcBig, fontSize: len > 11 ? 42 : len > 9 ? 50 : 56, marginTop: 6, whiteSpace: 'nowrap' }}><RcCount value={m.total} fmt={fmt} delay={450} /></div>
      {planned > 0 && (
        <div className="rc-in" style={{ ..._rcDelay(900), marginTop: 30 }}>
          <div style={{ position: 'relative', height: 14, borderRadius: 99, background: 'rgba(255,255,255,0.13)', overflow: 'hidden' }}>
            <div className="rc-gx" style={{
              ..._rcDelay(1100), transformOrigin: ar ? '100% 50%' : '0 50%',
              width: `${Math.min(100, pct * 100)}%`, height: '100%', borderRadius: 99,
              background: over ? 'linear-gradient(90deg, #ff9b7a, #e0503a)' : 'linear-gradient(90deg, #f7d58e, #e99b48)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginTop: 9 }}>
            <span>{Math.round(pct * 100)}%</span>
            <span>{ar ? 'من ميزانية' : 'of'} <b style={{ color: '#fff' }}>{fmt(planned)}</b></span>
          </div>
        </div>
      )}
      {verdict && <div className="rc-in" style={{ ..._rcDelay(1600), fontSize: 22, fontWeight: 800, marginTop: 30, lineHeight: 1.35, color: over ? '#ffb39c' : '#fff' }}>{verdict}</div>}
      {m.avg > 0 && (
        <div className="rc-in" style={{ ..._rcDelay(2000), fontSize: 15.5, color: 'rgba(255,255,255,0.7)', marginTop: 10 }}>
          {ar ? `بمعدل ${fmt(m.avg)} لليوم` : `${fmt(m.avg)} a day on average`}
        </div>
      )}
    </RcScene>
  );
}

function RcDays({ d }) {
  const { ar, m, fmt, calm } = d;
  const days = m.days;
  const b = m.planPerDay || 0;
  const max = Math.max(b * 1.25, ...days.map((x) => x.v), 1);
  const peak = m.peak;
  const dayName = (x) => (ar ? `اليوم ${x.i}` : `Day ${x.i}`);
  return (
    <RcScene bg="#0b0d18" glow={['rgba(92,112,235,0.5)', 'rgba(170,96,220,0.28)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{m.ended ? (ar ? 'رحلتكم كانت' : 'Your trip ran') : (ar ? 'لين الحين' : 'So far')}</div>
      <div className="rc-pop" style={{ ..._rcDelay(350), ..._rcBig, fontSize: 68 }}>{d.dayWord(d.daysShown)}</div>
      <div style={{ position: 'relative', height: 170, marginTop: 34, display: 'flex', alignItems: 'flex-end', gap: days.length > 14 ? 3 : 7 }}>
        {b > 0 && (
          <div className="rc-in" style={{ ..._rcDelay(700), position: 'absolute', insetInline: 0, bottom: `${(b / max) * 100}%`, borderTop: '2px dashed rgba(140,226,176,0.85)', zIndex: 2 }}>
            <span style={{ position: 'absolute', insetInlineEnd: 0, bottom: 4, fontSize: 11.5, fontWeight: 700, color: '#8ce2b0' }}>{ar ? 'الميزانية اليومية' : 'Daily budget'}</span>
          </div>
        )}
        {days.map((x, i) => {
          const h = Math.max(3, (x.v / max) * 100);
          const over = b > 0 && x.v > b;
          const cut = over ? (b / x.v) * 100 : 100;
          const isPeak = peak && x.k === peak.k;
          return (
            <div key={x.k} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div className="rc-gy" style={{
                ..._rcDelay(600 + i * 70), width: '100%', height: `${h}%`, borderRadius: '7px 7px 3px 3px',
                background: over ? `linear-gradient(to top, rgba(255,255,255,0.9) 0 ${cut}%, #ff8a66 ${cut}% 100%)` : 'rgba(255,255,255,0.88)',
                boxShadow: isPeak ? '0 0 26px rgba(255,138,102,0.65)' : 'none',
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: days.length > 14 ? 3 : 7, marginTop: 8 }}>
        {days.map((x, i) => (
          <div key={x.k} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>
            {days.length <= 14 || i % 2 === 0 ? x.i : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 26 }}>
        {peak && peak.v > 0 && (
          <div className="rc-in" style={{ ..._rcDelay(600 + days.length * 70 + 200), fontSize: 17, fontWeight: 700 }}>
            🔥 {ar ? 'أغلى يوم:' : 'Biggest day:'} {dayName(peak)} <span style={{ color: '#ffb39c' }}>· {fmt(peak.v)}</span>
          </div>
        )}
        {calm && (
          <div className="rc-in" style={{ ..._rcDelay(600 + days.length * 70 + 450), fontSize: 17, fontWeight: 700 }}>
            🌿 {ar ? 'أهدى يوم:' : 'Calmest day:'} {dayName(calm)} <span style={{ color: '#9ee6bf' }}>· {fmt(calm.v)}</span>
          </div>
        )}
      </div>
    </RcScene>
  );
}

function RcCategories({ d }) {
  const { ar, m, fmt, cats } = d;
  const [topK, topV] = cats[0];
  const total = m.total || 1;
  const rows = cats.slice(0, 5);
  const maxV = rows[0][1] || 1;
  return (
    <RcScene bg="#0c0e12" glow={['rgba(226,120,80,0.38)', 'rgba(57,135,229,0.3)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{ar ? 'وين راحت الفلوس؟' : 'Where did it go?'}</div>
      <div className="rc-pop" style={{ ..._rcDelay(400), fontSize: 92, lineHeight: 1, marginTop: 14 }}>{window.CAT_META?.[topK]?.emoji || '💸'}</div>
      <div className="rc-in" style={{ ..._rcDelay(800), fontSize: 28, fontWeight: 800, marginTop: 14, lineHeight: 1.25 }}>
        {_rcCatName(topK)} {ar ? 'أخذت' : 'took'} {Math.round((topV / total) * 100)}%
      </div>
      <div style={{ display: 'grid', gap: 14, marginTop: 28 }}>
        {rows.map(([k, v], i) => (
          <div key={k} className="rc-in" style={_rcDelay(1100 + i * 160)}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 15, fontWeight: 700 }}>
              <span>{window.CAT_META?.[k]?.emoji}</span>
              <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{_rcCatName(k)}</span>
              <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{fmt(v)}</span>
            </div>
            <div style={{ height: 9, borderRadius: 99, background: 'rgba(255,255,255,0.1)', marginTop: 7, overflow: 'hidden' }}>
              <div className="rc-gx" style={{ ..._rcDelay(1200 + i * 160), transformOrigin: ar ? '100% 50%' : '0 50%', width: `${(v / maxV) * 100}%`, height: '100%', borderRadius: 99, background: _rcCatColor(k) }} />
            </div>
          </div>
        ))}
      </div>
    </RcScene>
  );
}

function RcBiggest({ d }) {
  const { ar, m, fmt, biggest: e, wallets } = d;
  const who = (d.members.find((x) => x.id === e.who)?.name || '').split(' ')[0];
  const iso = e.createdAt ? window.localISO(e.createdAt) : '';
  const share = m.total ? Math.round(((e.usd || 0) / m.total) * 100) : 0;
  return (
    <RcScene bg="#110e0a" glow={['rgba(233,160,74,0.45)', 'rgba(226,120,80,0.28)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{ar ? 'أغلى مصروف' : 'The big one'}</div>
      <div className="rc-drop" style={{
        ..._rcDelay(450), marginTop: 26, position: 'relative', overflow: 'hidden',
        background: '#fbf6ec', color: '#1d1913', borderRadius: 24, padding: '22px 20px',
        boxShadow: '0 34px 70px -24px rgba(0,0,0,0.75)',
      }}>
        <span className="rc-move" aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, width: '35%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent)', animation: 'rc-shine 1.6s 1.3s ease-in-out both' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: _rcCatColor(e.cat), display: 'grid', placeItems: 'center', fontSize: 28, flexShrink: 0 }}>{window.CAT_META?.[e.cat]?.emoji || '💸'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{e.title}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(29,25,19,0.6)', marginTop: 4 }}>
              {[iso ? window.fmtDate(iso) : null, who ? (wallets ? (ar ? `بطاقة ${who}` : `${who}'s card`) : who) : null].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '2px dashed rgba(29,25,19,0.14)', margin: '18px 0 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, position: 'relative' }}>
          <span style={{ fontSize: 14, color: 'rgba(29,25,19,0.55)', fontWeight: 600 }}>{_rcCatName(e.cat)}</span>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}><RcCount value={e.usd || 0} fmt={fmt} delay={900} dur={1200} /></span>
        </div>
      </div>
      {share > 0 && (
        <div className="rc-in" style={{ ..._rcDelay(1700), fontSize: 18, fontWeight: 700, marginTop: 28, color: 'rgba(255,255,255,0.85)' }}>
          {ar ? `لحاله ${share}% من كل صرفكم` : `${share}% of everything you spent`}
        </div>
      )}
    </RcScene>
  );
}

function RcCards({ d }) {
  const { ar, m, fmt, payers, wallets } = d;
  const rows = payers.slice(0, 5);
  const max = rows[0].v || 1;
  const first = (mm) => (mm.name || '').split(' ')[0];
  const lead = rows[0];
  return (
    <RcScene bg="#09110d" glow={['rgba(84,204,146,0.38)', 'rgba(60,140,220,0.26)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{wallets ? (ar ? 'أي بطاقة شالت الحمل؟' : 'Which card carried it?') : (ar ? 'مين دفع أكثر؟' : 'Who paid the most?')}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 250, marginTop: 34 }}>
        {rows.map((r, i) => {
          const pct = Math.round((r.v / (m.total || 1)) * 100);
          const isLead = i === 0;
          return (
            <div key={r.m.id} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
              {isLead && <span className="rc-pop" style={{ ..._rcDelay(1400), fontSize: 24, lineHeight: 1 }}>👑</span>}
              <div className="rc-in" style={{ ..._rcDelay(900 + i * 140), fontSize: 15, fontWeight: 800, color: isLead ? '#9ee6bf' : 'rgba(255,255,255,0.8)' }}>{pct}%</div>
              <div className="rc-gy" style={{
                ..._rcDelay(500 + i * 140), width: '100%', maxWidth: 64, height: `${Math.max(6, (r.v / max) * 68)}%`, borderRadius: '12px 12px 4px 4px',
                background: isLead ? 'linear-gradient(to top, #2fae74, #8de3b4)' : 'rgba(255,255,255,0.28)',
                boxShadow: isLead ? '0 0 30px rgba(84,204,146,0.45)' : 'none',
              }} />
              {window.Avatar && <window.Avatar m={r.m} size={40} />}
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{first(r.m)}</div>
            </div>
          );
        })}
      </div>
      <div className="rc-in" style={{ ..._rcDelay(1700), fontSize: 20, fontWeight: 800, marginTop: 30, lineHeight: 1.35 }}>
        {wallets
          ? (ar ? `بطاقة ${first(lead.m)} دفعت ${fmt(lead.v)}` : `${first(lead.m)}'s card paid ${fmt(lead.v)}`)
          : (ar ? `${first(lead.m)} دفع ${fmt(lead.v)}` : `${first(lead.m)} paid ${fmt(lead.v)}`)}
      </div>
    </RcScene>
  );
}

function RcBookings({ d }) {
  const { ar, docs } = d;
  const count = (c) => docs.filter((x) => x.category === c).length;
  const counts = ['flights', 'lodging', 'transport', 'visas'].map((c) => [window.DOC_SCHEMAS?.[c]?.emoji || '📄', count(c)]).filter(([, n]) => n > 0);
  const order = { flights: 0, lodging: 1, transport: 2, visas: 3 };
  const list = docs.slice().sort((a, b) => order[a.category] - order[b.category]).slice(0, 4);
  const day = (v) => String(v || '').slice(0, 10);
  const lineOf = (x) => {
    const det = x.details || {};
    if (x.category === 'lodging' && det.check_in_at) {
      const n = det.check_out_at ? Math.max(1, Math.round((new Date(day(det.check_out_at)) - new Date(day(det.check_in_at))) / 86400000)) : 0;
      return [window.fmtDateRange(day(det.check_in_at), day(det.check_out_at || det.check_in_at)), n ? (ar ? (n === 1 ? 'ليلة' : n === 2 ? 'ليلتين' : `${n} ليالٍ`) : `${n} nights`) : null].filter(Boolean).join(' · ');
    }
    const [s] = window.docSpan ? window.docSpan(x) : [null];
    if (x.category === 'visas') return det.expires_on ? (ar ? `سارية لين ${window.fmtDate(det.expires_on)}` : `Valid to ${window.fmtDate(det.expires_on)}`) : '';
    return s ? [window.fmtDate(day(s)), String(s).length > 11 ? String(s).slice(11, 16) : null].filter(Boolean).join(' · ') : '';
  };
  const titleOf = (x) => {
    const det = x.details || {};
    return x.category === 'flights' && det.dep_airport && det.arr_airport ? `${String(det.dep_airport).toUpperCase()} → ${String(det.arr_airport).toUpperCase()}` : x.title;
  };
  return (
    <RcScene bg="#0a0e19" glow={['rgba(43,74,143,0.6)', 'rgba(192,96,63,0.32)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{ar ? 'حجوزاتكم' : 'Your bookings'}</div>
      <div className="rc-pop" style={{ ..._rcDelay(350), display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 34, fontWeight: 800, marginTop: 8 }}>
        {counts.map(([e, n]) => <span key={e}>{e} {n}</span>)}
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 28 }}>
        {list.map((x, i) => (
          <div key={x.id} className="rc-slide" style={{
            ..._rcDelay(700 + i * 230), '--rc-dx': ar ? '-56px' : '56px',
            borderRadius: 18, padding: '14px 16px', color: '#fff',
            background: (window.DOC_PASS_BG || {})[x.category] || '#2b4a8f',
            boxShadow: '0 16px 30px -18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}>
            <div style={{ fontSize: 12.5, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{window.docKind ? window.docKind(x) : ''}</div>
            <div dir="auto" style={{ fontSize: 19, fontWeight: 800, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{titleOf(x)}</div>
            {lineOf(x) && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>{lineOf(x)}</div>}
          </div>
        ))}
      </div>
    </RcScene>
  );
}

function RcPlan({ d }) {
  const { ar, plan } = d;
  const meta = window.PLAN_CAT_META || {};
  const catOf = window.planCatOf || ((c) => c);
  const n = plan.length;
  const shown = plan.slice(0, 12);
  return (
    <RcScene bg="#130d0a" glow={['rgba(226,120,80,0.42)', 'rgba(110,190,120,0.24)']}>
      <div className="rc-in" style={{ ..._rcDelay(150), ..._rcKicker }}>{ar ? 'خطتكم' : 'Your plan'}</div>
      <div className="rc-pop" style={{ ..._rcDelay(350), ..._rcBig, fontSize: 66 }}>
        {n} <span style={{ fontSize: 26, fontWeight: 700 }}>{ar ? (n === 1 ? 'نشاط' : n === 2 ? 'نشاطين' : n <= 10 ? 'أنشطة' : 'نشاط') : (n === 1 ? 'activity' : 'activities')}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 26 }}>
        {shown.map((it, i) => {
          const mt = meta[catOf(it.category)] || { emoji: '📌' };
          return (
            <span key={it.id} className="rc-pop" style={{
              ..._rcDelay(700 + i * 130), display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 13px', borderRadius: 999, background: 'rgba(255,255,255,0.12)',
              border: '0.5px solid rgba(255,255,255,0.16)', fontSize: 14.5, fontWeight: 700, maxWidth: '100%',
            }}>
              <span>{mt.emoji}</span>
              <span dir="auto" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
            </span>
          );
        })}
        {n > shown.length && (
          <span className="rc-pop" style={{ ..._rcDelay(700 + shown.length * 130), padding: '9px 13px', borderRadius: 999, fontSize: 14.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
            +{n - shown.length}
          </span>
        )}
      </div>
    </RcScene>
  );
}

// The closing card — the same one the share image draws.
function RcCard({ d }) {
  const { ar, trip, m, fmt, cats } = d;
  const peak = m.peak;
  const top = cats[0];
  const stats = [
    [ar ? 'صرفتوا' : 'Spent', fmt(m.total)],
    [ar ? 'الأيام' : 'Days', d.dayWord(d.daysShown)],
    [peak && peak.v > 0 ? (ar ? `أغلى يوم · اليوم ${peak.i}` : `Biggest day · Day ${peak.i}`) : (ar ? 'المعدل اليومي' : 'Per day'), peak && peak.v > 0 ? fmt(peak.v) : fmt(m.avg || 0)],
    [top ? (ar ? `الأكثر · ${Math.round((top[1] / (m.total || 1)) * 100)}%` : `Most on · ${Math.round((top[1] / (m.total || 1)) * 100)}%`) : (ar ? 'الأكثر' : 'Most on'), top ? `${window.CAT_META?.[top[0]]?.emoji || ''} ${_rcCatName(top[0])}` : '—'],
  ];
  return (
    <div className="rc-pop" style={{ ..._rcDelay(200), borderRadius: 26, overflow: 'hidden', background: '#14161d', border: '0.5px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.8)' }}>
      <div style={{ position: 'relative', height: 150 }}>
        <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={trip.coverUrl || trip.coverImageUrl} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,22,29,0) 30%, rgba(20,22,29,0.95) 100%)' }} />
        <div style={{ position: 'absolute', insetInline: 18, bottom: 12 }}>
          <div className="serif-italic" style={{ fontSize: 34, lineHeight: 1.05, color: '#fff' }}>{trip.title}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{trip.dates}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8, padding: '12px 12px 6px' }}>
        {stats.map(([l, v], i) => (
          <div key={i} style={{ borderRadius: 16, padding: '11px 12px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.08)', minWidth: 0 }}>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 18px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
        <span className="wordmark" style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)' }}>voyage</span>
        <span>{d.peopleWord(d.members.length || 1)}</span>
      </div>
    </div>
  );
}

function RcOutro({ d, onReplay, onClose }) {
  const { ar } = d;
  const blobRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {       // have the image ready before the tap
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
      const name = `${String(d.trip.title || 'trip').replace(/[^\p{L}\p{N}]+/gu, '-')}-voyage.png`;
      const file = new File([blob], name, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: d.trip.title || 'Voyage' });
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
  return (
    <RcScene bg="#0b0d12" glow={['rgba(226,120,80,0.36)', 'rgba(92,112,235,0.3)']} align="center">
      <div className="rc-in" style={{ ..._rcDelay(100), ..._rcKicker, textAlign: 'center', marginBottom: 14 }}>{d.m.ended ? (ar ? 'وهذي رحلتكم 🤍' : "And that's the trip 🤍") : (ar ? 'رحلتكم لين الحين' : 'Your trip so far')}</div>
      <RcCard d={d} />
      <div className="rc-in" style={{ ..._rcDelay(700), display: 'grid', gap: 8, marginTop: 18 }}>
        <button onClick={share} disabled={busy} style={{
          minHeight: 52, borderRadius: 16, background: '#fff', color: '#14161d', fontSize: 15.5, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: busy ? 0.7 : 1,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          {ar ? 'شارك مع القروب' : 'Share with the group'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onReplay(); }} style={{ flex: 1, minHeight: 48, borderRadius: 16, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 14.5, fontWeight: 700 }}>
            {ar ? '↻ شاهد مرة ثانية' : '↻ Watch again'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ flex: 1, minHeight: 48, borderRadius: 16, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 14.5, fontWeight: 700 }}>
            {ar ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </RcScene>
  );
}

// ── The player ──────────────────────────────────────────────────────
function TripRecap({ onClose }) {
  const d = React.useMemo(() => recapData(), []);
  const { ar } = d;
  const scenes = React.useMemo(() => {
    const s = [{ key: 'intro', dur: 5200, el: RcIntro }];
    if (d.expenses.length) s.push({ key: 'total', dur: 6200, el: RcTotal });
    if (d.m.days.length >= 2) s.push({ key: 'days', dur: 6800, el: RcDays });
    if (d.cats.length) s.push({ key: 'cats', dur: 6600, el: RcCategories });
    if (d.biggest) s.push({ key: 'big', dur: 5600, el: RcBiggest });
    if (d.payers.length >= 2) s.push({ key: 'cards', dur: 5600, el: RcCards });
    if (d.docs.length) s.push({ key: 'books', dur: 5600, el: RcBookings });
    if (d.plan.length) s.push({ key: 'plan', dur: 5600, el: RcPlan });
    s.push({ key: 'outro', dur: 0, el: RcOutro });
    return s;
  }, [d]);
  const [i, setI] = React.useState(0);
  const [run, setRun] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const pausedRef = React.useRef(false); pausedRef.current = paused;
  const fills = React.useRef([]);
  const clock = React.useRef({ t: 0, last: 0 });
  const hold = React.useRef(null);
  const reduce = window.vReduce?.();
  const cur = scenes[i];
  const go = (n) => {
    const j = Math.max(0, Math.min(scenes.length - 1, n));
    if (j !== i) { setI(j); window.haptic?.(); }
    else if (n < 0) { clock.current.t = 0; setRun((r) => r + 1); }   // first scene: restart it
  };

  // The clock: fills the current bar and moves on when it's full.
  React.useEffect(() => {
    fills.current.forEach((el, k) => { if (el) el.style.transform = `scaleX(${k < i ? 1 : 0})`; });
    if (!cur.dur) { const el = fills.current[i]; if (el) el.style.transform = 'scaleX(1)'; return; }
    clock.current = { t: 0, last: performance.now() };
    let raf = 0;
    const tick = (now) => {
      const c = clock.current; const dt = now - c.last; c.last = now;
      if (!pausedRef.current && !document.hidden) c.t += dt;
      const p = Math.min(1, c.t / cur.dur);
      const el = fills.current[i]; if (el) el.style.transform = `scaleX(${p})`;
      if (p >= 1) { setI((x) => Math.min(scenes.length - 1, x + 1)); window.haptic?.(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, run]);

  // Keys (desktop) and the back gesture
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(ar ? i - 1 : i + 1);
      if (e.key === 'ArrowLeft') go(ar ? i + 1 : i - 1);
      if (e.key === ' ') setPaused((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Tap the far side → next, the near side → back; hold anywhere → pause;
  // swipe down → close.
  const down = (e) => {
    hold.current = { x: e.clientX, y: e.clientY, t: performance.now(), held: false };
    hold.current.timer = setTimeout(() => { if (hold.current) { hold.current.held = true; setPaused(true); } }, 220);
  };
  const up = (e) => {
    const h = hold.current; hold.current = null;
    if (!h) return;
    clearTimeout(h.timer);
    if (e.clientY - h.y > 90) { onClose(); return; }          // swipe down closes
    if (h.held) { setPaused(false); return; }
    const w = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - w.left) / w.width;
    const back = ar ? frac > 0.68 : frac < 0.32;
    go(back ? i - 1 : i + 1);
  };
  const cancel = () => { const h = hold.current; hold.current = null; if (h) { clearTimeout(h.timer); if (h.held) setPaused(false); } };

  const Scene = cur.el;
  return (
    <div role="dialog" aria-modal="true" aria-label={ar ? 'ملخص الرحلة' : 'Trip recap'}
      className={reduce ? 'rc-reduce' : ''} style={{
        position: 'absolute', inset: 0, zIndex: 200, background: '#0b0d12', overflow: 'hidden',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation',
      }}>
      <style>{RC_CSS}</style>
      <div key={`${run}-${i}`} style={{ position: 'absolute', inset: 0 }}>
        <Scene d={d} onReplay={() => { setI(0); setRun((r) => r + 1); }} onClose={onClose} />
      </div>

      {/* tap / hold layer (the closing card is interactive instead) */}
      {cur.dur > 0 && (
        <div onPointerDown={down} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel}
          style={{ position: 'absolute', inset: 0, zIndex: 5 }} />
      )}

      {/* progress + close */}
      <div style={{
        position: 'absolute', insetInline: 0, top: 0, zIndex: 10,
        padding: 'calc(env(safe-area-inset-top) + 10px) 12px 10px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.38), transparent)', pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {scenes.map((s, k) => (
            <div key={s.key} style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.28)', overflow: 'hidden' }}>
              <div ref={(el) => { fills.current[k] = el; }} style={{
                height: '100%', borderRadius: 99, background: '#fff',
                transformOrigin: ar ? '100% 50%' : '0 50%', transform: `scaleX(${k < i ? 1 : 0})`,
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            <span className="wordmark" style={{ fontSize: 19, fontWeight: 400 }}>voyage</span>
            {paused && <span style={{ fontSize: 12, opacity: 0.8 }}>{ar ? '· موقوف' : '· paused'}</span>}
          </div>
          <button onClick={onClose} aria-label={ar ? 'إغلاق' : 'Close'} style={{
            pointerEvents: 'auto', width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.16)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Host + opener ───────────────────────────────────────────────────
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

// ── The share image (1080×1350), drawn on a canvas ─────────────────
const RC_PRESET = {
  kyoto: ['#d39b91', '#3a3956'], lisbon: ['#ddae77', '#934c3a'], oaxaca: ['#e6964f', '#86281d'],
  lofoten: ['#577ab5', '#101836'], patagon: ['#67acb0', '#183a5b'],
};

window.renderRecapImage = async function renderRecapImage(d, noPhoto) {
  const { ar, trip, m, fmt, cats } = d;
  const W = 1080, H = 1350, P = 72;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  try { await document.fonts?.ready; } catch (_) {}
  const SANS = '"Tajawal", "Geist", "IBM Plex Sans Arabic", system-ui, sans-serif';
  const SERIF = '"Markazi Text", "Instrument Serif", Georgia, serif';
  const S = ar ? W - P : P;                         // where a line starts
  const E = ar ? P : W - P;                         // where it ends
  const text = (str, px, weight, color, xx, yy, opt = {}) => {
    x.font = `${opt.italic ? 'italic ' : ''}${weight} ${px}px ${opt.serif ? SERIF : SANS}`;
    x.fillStyle = color; x.direction = ar ? 'rtl' : 'ltr';
    x.textAlign = opt.align || 'start'; x.textBaseline = 'alphabetic';
    x.fillText(String(str), xx, yy, opt.maxW);
  };
  const rrect = (xx, yy, w, h, r) => {
    x.beginPath();
    if (x.roundRect) x.roundRect(xx, yy, w, h, r);
    else { x.moveTo(xx + r, yy); x.arcTo(xx + w, yy, xx + w, yy + h, r); x.arcTo(xx + w, yy + h, xx, yy + h, r); x.arcTo(xx, yy + h, xx, yy, r); x.arcTo(xx, yy, xx + w, yy, r); x.closePath(); }
  };

  // background: the cover (photo, or the preset's colours) fading into night
  x.fillStyle = '#0b0d12'; x.fillRect(0, 0, W, H);
  let photo = false;
  const url = !noPhoto && (trip.coverUrl || trip.coverImageUrl);
  if (url) {
    try {
      const img = await new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = url; });
      const ch = 820, s = Math.max(W / img.width, ch / img.height);
      x.drawImage(img, (W - img.width * s) / 2, (ch - img.height * s) / 2, img.width * s, img.height * s);
      photo = true;
    } catch (_) {}
  }
  if (!photo) {
    const [a, b] = RC_PRESET[trip.cover] || RC_PRESET.kyoto;
    const g = x.createLinearGradient(0, 0, W * 0.4, 820); g.addColorStop(0, a); g.addColorStop(1, b);
    x.fillStyle = g; x.fillRect(0, 0, W, 820);
    const sun = x.createRadialGradient(W * 0.74, 250, 10, W * 0.74, 250, 340);
    sun.addColorStop(0, 'rgba(255,236,214,0.42)'); sun.addColorStop(1, 'rgba(255,236,214,0)');
    x.fillStyle = sun; x.fillRect(0, 0, W, 820);
  }
  const fade = x.createLinearGradient(0, 260, 0, 900);
  fade.addColorStop(0, 'rgba(11,13,18,0)'); fade.addColorStop(0.6, 'rgba(11,13,18,0.82)'); fade.addColorStop(1, '#0b0d12');
  x.fillStyle = fade; x.fillRect(0, 0, W, 900);
  const glow = x.createRadialGradient(W * 0.2, 1150, 10, W * 0.2, 1150, 620);
  glow.addColorStop(0, 'rgba(226,120,80,0.22)'); glow.addColorStop(1, 'rgba(226,120,80,0)');
  x.fillStyle = glow; x.fillRect(0, 700, W, H - 700);

  // top line
  text('voyage', 50, 400, 'rgba(255,255,255,0.92)', ar ? E : S, 120, { serif: true, italic: true, align: ar ? 'left' : 'left' });
  text(ar ? 'ملخص الرحلة' : 'Trip recap', 30, 700, 'rgba(255,255,255,0.8)', ar ? S : E, 116, { align: ar ? 'right' : 'right' });

  // title + dates
  text(trip.title || (ar ? 'رحلة' : 'Trip'), 118, 600, '#ffffff', S, 600, { serif: true, italic: true, maxW: W - P * 2 });
  text([trip.dates, d.dayWord(d.daysShown), d.members.length > 1 ? d.peopleWord(d.members.length) : null].filter(Boolean).join(' · '), 34, 500, 'rgba(255,255,255,0.78)', S, 668, { maxW: W - P * 2 });

  // four figures
  const peak = m.peak, top = cats[0];
  const stats = [
    [ar ? 'صرفتوا' : 'Spent', fmt(m.total)],
    [ar ? 'الأيام' : 'Days', d.dayWord(d.daysShown)],
    [peak && peak.v > 0 ? (ar ? `أغلى يوم · اليوم ${peak.i}` : `Biggest day · Day ${peak.i}`) : (ar ? 'المعدل اليومي' : 'Per day'), peak && peak.v > 0 ? fmt(peak.v) : fmt(m.avg || 0)],
    [top ? (ar ? `الأكثر · ${Math.round((top[1] / (m.total || 1)) * 100)}%` : `Most on · ${Math.round((top[1] / (m.total || 1)) * 100)}%`) : (ar ? 'الأكثر' : 'Most on'),
      top ? `${window.CAT_META?.[top[0]]?.emoji || ''} ${_rcCatName(top[0])}` : '—'],
  ];
  const gw = (W - P * 2 - 24) / 2, gh = 158;
  stats.forEach(([l, v], k) => {
    const col = k % 2, row = Math.floor(k / 2);
    const left = ar ? (W - P - gw - col * (gw + 24)) : (P + col * (gw + 24));
    const y0 = 722 + row * (gh + 20);
    x.fillStyle = 'rgba(255,255,255,0.07)'; rrect(left, y0, gw, gh, 30); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 2; rrect(left, y0, gw, gh, 30); x.stroke();
    const sx = ar ? left + gw - 32 : left + 32;
    text(l, 28, 600, 'rgba(255,255,255,0.62)', sx, y0 + 56, { maxW: gw - 64 });
    text(v, 50, 800, '#ffffff', sx, y0 + 122, { maxW: gw - 64 });
  });

  // the days, as small bars under a dashed budget line
  const days = m.days;
  if (days.length) {
    text(ar ? 'الصرف اليومي' : 'Daily spend', 26, 700, 'rgba(255,255,255,0.55)', S, 1112);
    const bx = P, bw = W - P * 2, by = 1262, bh = 118;
    const b = m.planPerDay || 0;
    const max = Math.max(b * 1.25, ...days.map((q) => q.v), 1);
    const slot = bw / days.length, w = Math.max(6, Math.min(70, slot * 0.6));
    days.forEach((q, k) => {
      const cx = ar ? bx + bw - slot * (k + 0.5) : bx + slot * (k + 0.5);
      const h = Math.max(4, (q.v / max) * bh);
      const over = b > 0 && q.v > b;
      x.fillStyle = 'rgba(255,255,255,0.85)'; rrect(cx - w / 2, by - h, w, h, Math.min(8, w / 2)); x.fill();
      if (over) { const hh = ((q.v - b) / max) * bh; x.fillStyle = '#ff8a66'; rrect(cx - w / 2, by - h, w, hh, Math.min(8, w / 2)); x.fill(); }
    });
    if (b > 0) {
      const yb = by - (b / max) * bh;
      x.setLineDash([12, 10]); x.strokeStyle = 'rgba(140,226,176,0.9)'; x.lineWidth = 3;
      x.beginPath(); x.moveTo(bx, yb); x.lineTo(bx + bw, yb); x.stroke(); x.setLineDash([]);
    }
  }
  text(ar ? 'صُنعت في Voyage' : 'Made with Voyage', 24, 500, 'rgba(255,255,255,0.42)', S, 1316);

  try {
    return await new Promise((res, rej) => c.toBlob((bl) => (bl ? res(bl) : rej(new Error('blob'))), 'image/png'));
  } catch (err) {
    if (photo && !noPhoto) return window.renderRecapImage(d, true);   // the photo blocked export — draw without it
    throw err;
  }
};

Object.assign(window, { TripRecap, RecapHost });
