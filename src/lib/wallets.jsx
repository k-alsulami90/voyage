// ════════════════════════════════════════════════════════════════════
// Cards (البطاقات) + today's budget
//
// The group's trip money sits on a few people's cards. Setup is one list:
// whose card, and how much is on it. Every expense says which card paid.
// From that the app shows, at a glance:
//   * how much is left on each card
//   * how much the group can spend TODAY — the remaining money divided by
//     the remaining days, so overspending one day automatically tightens
//     the next days (and saving loosens them).
// No shares, no transfers, no settle-up: money between friends is sorted
// outside the app. Everything is a plain sum, so fixing a wrong expense
// (edit / delete) fixes every number.
// ════════════════════════════════════════════════════════════════════

// Splitting individual expenses between people ("who owes whom") is
// switched off: the group runs on one shared budget and settles up outside
// the app. Expenses are still saved as shared by everyone, so turning this
// back on later loses nothing.
window.SHOW_SPLIT = false;

window.walletsOf = (trip) => {
  const w = trip && trip.wallets;
  if (!w || !w.enabled) return null;
  const cards = (Array.isArray(w.cards) ? w.cards : [])
    .filter((c) => c && c.user_id)
    .map((c) => ({ id: c.user_id, amountUSD: parseFloat(c.amount_usd) || 0 }));
  if (cards.length === 0) return null;
  return { cards };
};

const _parseDay = (iso) => {
  const [y, m, d] = String(iso || '').split('-').map(Number);
  return y ? new Date(y, (m || 1) - 1, d || 1) : null;
};
const _daysBetween = (a, b) => Math.round((_parseDay(b) - _parseDay(a)) / 86400000);

window.computeTodayBudget = (trip, expenses, todayISO) => {
  const w = window.walletsOf(trip);
  if (!w) return null;
  expenses = expenses || [];
  const today = todayISO || window.localISO();
  const ids = new Set(w.cards.map((c) => c.id));
  const dayOf = (e) => (e.createdAt ? window.localISO(e.createdAt) : today);
  // Bookings (logged before the trip starts, or from a document's cost) are
  // GENERAL budget: they count in the trip total, not against the cards.
  const cardExp = expenses.filter((e) => ids.has(e.who) && !window.isGeneralBudgetExpense(e, trip));

  const cards = w.cards.map((c) => {
    const spent = cardExp.filter((e) => e.who === c.id).reduce((s, e) => s + (e.usd || 0), 0);
    return { ...c, spent, left: c.amountUSD - spent };
  });
  const totalUSD = cards.reduce((s, c) => s + c.amountUSD, 0);
  const spentUSD = cards.reduce((s, c) => s + c.spent, 0);
  const leftUSD = totalUSD - spentUSD;

  const start = trip.startDate, end = trip.endDate;
  const totalDays = start && end ? Math.max(1, _daysBetween(start, end) + 1) : 1;
  const planPerDay = totalUSD / totalDays;

  let phase = 'during';
  if (start && today < start) phase = 'before';
  else if (end && today > end) phase = 'after';

  let daysLeft, allowance, todaySpent = 0, todayLeft = null, nextDaysAllowance = null;
  if (phase === 'during') {
    daysLeft = Math.max(1, _daysBetween(today, end) + 1);              // includes today
    const beforeToday = cardExp.filter((e) => dayOf(e) < today).reduce((s, e) => s + (e.usd || 0), 0);
    todaySpent = cardExp.filter((e) => dayOf(e) === today).reduce((s, e) => s + (e.usd || 0), 0);
    allowance = (totalUSD - beforeToday) / daysLeft;
    todayLeft = allowance - todaySpent;
    if (daysLeft > 1) nextDaysAllowance = (totalUSD - beforeToday - todaySpent) / (daysLeft - 1);
  } else if (phase === 'before') {
    daysLeft = totalDays;
    allowance = leftUSD / totalDays;
  } else {
    daysLeft = 0;
    allowance = 0;
  }
  return { cards, totalUSD, spentUSD, leftUSD, totalDays, planPerDay, phase, daysLeft, allowance, todaySpent, todayLeft, nextDaysAllowance };
};

const _first = (m) => ((m && m.name) || '').trim().split(/\s+/)[0] || '?';

// ── Hub card ──────────────────────────────────────────────────────────
function TodayBudgetCard({ onManage }) {
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const b = window.computeTodayBudget(trip, window.EXPENSES);
  if (!b) return null;
  const ar = window.isRTL;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const over = b.phase === 'during' && b.todayLeft < 0;
  const roomy = b.allowance >= b.planPerDay;

  let headline, sub;
  if (b.phase === 'during') {
    headline = over
      ? (ar ? 'تجاوزتوا اليوم' : 'Over today by')
      : (ar ? 'باقي لليوم' : 'Left today');
    sub = ar ? `من ${fmtC(b.allowance)} لليوم` : `of ${fmtC(b.allowance)} for today`;
  } else if (b.phase === 'before') {
    headline = ar ? 'ميزانيتكم اليومية' : 'Your daily budget';
    sub = ar ? `على ${b.totalDays} أيام` : `over ${b.totalDays} days`;
  } else {
    headline = ar ? 'باقي بعد الرحلة' : 'Left after the trip';
    sub = '';
  }
  const bigValue = b.phase === 'during' ? Math.abs(b.todayLeft) : (b.phase === 'before' ? b.allowance : b.leftUSD);
  const pctToday = b.phase === 'during' && b.allowance > 0 ? Math.max(0, Math.min(1, b.todaySpent / b.allowance)) : 0;

  return (
    <div style={{ padding: '0 14px', marginTop: 16 }}>
      <div style={{
        background: over ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
        borderRadius: 24, padding: '18px 18px 12px',
        border: over ? '1px solid oklch(0.62 0.13 35 / 0.35)' : '0.5px solid var(--hairline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: over ? 'var(--clay-deep)' : 'var(--ink)' }}>{headline}</div>
          <button onClick={onManage} style={{
            fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500, minHeight: 36, padding: '0 4px', background: 'transparent',
          }}>{ar ? 'البطاقات' : 'Cards'}</button>
        </div>
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 32, fontWeight: 700, color: over ? 'var(--clay-deep)' : 'var(--ink)' }}>
            {fmtC(bigValue)}
          </span>
          {sub && <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{sub}</span>}
        </div>

        {b.phase === 'during' && (
          <div style={{ height: 6, borderRadius: 999, background: 'var(--cream)', marginTop: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${(over ? 1 : pctToday) * 100}%`, height: '100%', borderRadius: 999,
              background: over ? 'var(--clay)' : 'var(--moss)', transition: 'width 300ms cubic-bezier(.2,.8,.2,1)',
            }} />
          </div>
        )}

        {/* One plain sentence about the rest of the trip */}
        {b.phase === 'during' && (
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.7 }}>
            {ar
              ? <>باقي للرحلة <b className="mono">{fmtC(b.leftUSD)}</b>{b.daysLeft > 1 && b.nextDaysAllowance != null
                  ? <>، يعني <b className="mono">{fmtC(b.nextDaysAllowance)}</b> لكل يوم من الأيام الجاية ({b.daysLeft - 1}).</>
                  : '.'}</>
              : <>{fmtC(b.leftUSD)} left for the trip{b.daysLeft > 1 && b.nextDaysAllowance != null
                  ? <>, so <b>{fmtC(b.nextDaysAllowance)}</b> a day for the next {b.daysLeft - 1} days.</>
                  : '.'}</>}
          </div>
        )}
        {b.phase !== 'after' && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '5px 10px', borderRadius: 999,
            background: roomy ? 'oklch(0.50 0.08 155 / 0.12)' : 'oklch(0.62 0.13 35 / 0.12)',
            color: roomy ? 'var(--moss)' : 'var(--clay-deep)', fontSize: 12.5, fontWeight: 600,
          }}>
            {roomy
              ? (ar ? `فيه متسع · خطتكم ${fmtC(b.planPerDay)} يومياً` : `Room to spare · plan ${fmtC(b.planPerDay)}/day`)
              : (ar ? `اقتصدوا شوي · خطتكم ${fmtC(b.planPerDay)} يومياً` : `Ease off · plan ${fmtC(b.planPerDay)}/day`)}
          </div>
        )}

        {/* Cards */}
        <div style={{ marginTop: 12, borderTop: '0.5px solid var(--hairline)', paddingTop: 6 }}>
          {b.cards.map((c) => {
            const m = members.find((x) => x.id === c.id) || { id: c.id, name: '?' };
            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                <Avatar m={m} size={26} />
                <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>
                  {ar ? `بطاقة ${_first(m)}` : `${_first(m)}'s card`}
                </span>
                <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: c.left < 0 ? 'var(--clay-deep)' : 'var(--ink)' }}>
                  {fmtC(c.left)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Trip settings: the cards list ─────────────────────────────────────
function WalletsSetup() {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const home = trip?.homeCurrency || 'USD';
  const rate = window.fxRate(home);
  const raw = trip?.wallets || {};
  const [enabled, setEnabled] = React.useState(!!raw.enabled);
  const [cards, setCards] = React.useState(() => {
    const m = {};
    (raw.cards || []).forEach((c) => { m[c.user_id] = String(Math.round((parseFloat(c.amount_usd) || 0) * rate)); });
    return m;
  });
  const [saving, setSaving] = React.useState(false);
  const ids = Object.keys(cards);
  const totalHome = ids.reduce((s, id) => s + (parseFloat(cards[id]) || 0), 0);
  const days = trip?.startDate && trip?.endDate ? Math.max(1, _daysBetween(trip.startDate, trip.endDate) + 1) : 1;

  const save = async () => {
    setSaving(true);
    try {
      const wallets = {
        enabled,
        cards: ids.map((id) => ({
          user_id: id,
          amount_usd: Math.round(window.toUSD(parseFloat(cards[id]) || 0, home) * 100) / 100,
        })),
      };
      const { error } = await window.sb.from('trips').update({ wallets }).eq('id', trip.id);
      if (error) {
        throw new Error(/wallets/i.test(error.message || '')
          ? (ar ? 'قاعدة البيانات تحتاج تحديث: شغّل ملف 019_trip_cards.sql في Supabase' : 'Run migration 019_trip_cards.sql')
          : error.message);
      }
      await window.loadTripDetail(trip.id);
      window.notifyDataChange?.();
      window.toast?.(ar ? 'تم الحفظ' : 'Saved', 'success');
    } catch (e) {
      window.toast?.(e.message || 'Failed', 'error');
    }
    setSaving(false);
  };

  const field = {
    flex: 1, minWidth: 0, width: 'auto', padding: '12px 14px', borderRadius: 14, fontSize: 16,
    border: '0.5px solid var(--hairline)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none',
    fontFamily: 'var(--mono)',
  };

  return (
    <div style={{ padding: '24px 14px 0' }}>
      <SectionLabel>{ar ? 'البطاقات والميزانية اليومية' : 'Cards & daily budget'}</SectionLabel>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, margin: '0 8px', padding: 16, border: '0.5px solid var(--hairline)' }}>
        <button onClick={() => setEnabled((v) => !v)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, background: 'transparent',
        }}>
          <div style={{ flex: 1, textAlign: 'start' }}>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{ar ? 'نصرف من بطاقات محددة' : 'We spend from set cards'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 2, lineHeight: 1.5 }}>
              {ar ? 'تعرفون كم باقي في كل بطاقة، وكم تقدرون تصرفون اليوم' : 'See what is left on each card and what you can spend today'}
            </div>
          </div>
          <span aria-hidden style={{
            width: 46, height: 28, borderRadius: 999, flexShrink: 0, position: 'relative',
            background: enabled ? 'var(--moss)' : 'var(--hairline-2)', transition: 'background 180ms',
          }}>
            <span style={{
              position: 'absolute', top: 3, insetInlineStart: enabled ? 21 : 3, width: 22, height: 22,
              borderRadius: 999, background: '#fff', transition: 'inset-inline-start 180ms',
            }} />
          </span>
        </button>

        {enabled && (
          <>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', margin: '14px 0 8px' }}>
              {ar ? 'بطاقة مين؟' : 'Whose card?'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {members.map((m) => {
                const on = m.id in cards;
                return (
                  <button key={m.id} onClick={() => setCards((p) => {
                    const n = { ...p }; if (on) delete n[m.id]; else n[m.id] = ''; return n;
                  })} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 6px', minHeight: 44,
                    borderRadius: 999, background: on ? 'var(--statement)' : 'var(--cream)',
                    color: on ? 'var(--statement-fg)' : 'var(--ink)', border: on ? 'none' : '0.5px solid var(--hairline)',
                    fontSize: 13.5, fontWeight: 500,
                  }}>
                    <Avatar m={m} size={30} />{_first(m)}
                  </button>
                );
              })}
            </div>

            {ids.length > 0 && (
              <>
                <div style={{ fontSize: 13, color: 'var(--ink-mute)', margin: '16px 0 8px' }}>
                  {ar ? `كم في كل بطاقة للرحلة؟ (${home})` : `Amount on each card (${home})`}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8 }}>
                  {ids.map((id) => {
                    const m = members.find((x) => x.id === id) || { name: '?' };
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar m={m} size={30} />
                        <span style={{ width: 76, fontSize: 13.5, color: 'var(--ink)' }}>{_first(m)}</span>
                        <window.NumberField value={cards[id]} placeholder="0"
                          onChange={(v) => setCards((p) => ({ ...p, [id]: v }))} style={field} />
                      </div>
                    );
                  })}
                </div>
                {totalHome > 0 && (
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.7 }}>
                    {ar
                      ? <>المجموع <b className="mono">{Math.round(totalHome).toLocaleString('en')} {home}</b> على {days} أيام، يعني <b className="mono">{Math.round(totalHome / days).toLocaleString('en')} {home}</b> يومياً.</>
                      : <>Total <b>{Math.round(totalHome).toLocaleString('en')} {home}</b> over {days} days: <b>{Math.round(totalHome / days).toLocaleString('en')} {home}</b> a day.</>}
                  </div>
                )}
              </>
            )}
          </>
        )}

        <button disabled={saving} onClick={save} style={{
          marginTop: 16, width: '100%', minHeight: 48, borderRadius: 14,
          background: 'var(--ink)', color: 'var(--cream)', fontSize: 14.5, fontWeight: 600, opacity: saving ? 0.6 : 1,
        }}>{saving ? '…' : (ar ? 'حفظ' : 'Save')}</button>
      </div>
    </div>
  );
}

// ── "Your trip cost" — private to the viewer ──────────────────────────
// Your share of the group's spend (trip total ÷ members) + your own
// bookings (personal documents with a cost, e.g. your flight) + your
// personal expenses. Only you see this: personal docs and expenses are
// filtered by the database (RLS), not just hidden in the UI.
function MyTripCostCard({ openSheet }) {
  const ar = window.isRTL;
  const members = window.MEMBERS || [];
  const me = window.currentUserId;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const groupTotal = (window.EXPENSES || []).reduce((s, e) => s + (e.usd || 0), 0);
  const share = groupTotal / Math.max(1, members.length);
  const myDocs = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((d) => d && d.ownerUserId === me && d.costUSD != null && d.costUSD > 0);
  const docsUSD = myDocs.reduce((s, d) => s + (d.costUSD || 0), 0);
  const personal = window.MY_PERSONAL_EXPENSES || [];
  const personalUSD = personal.reduce((s, e) => s + (e.usd || 0), 0);
  const total = share + docsUSD + personalUSD;
  // Solo trip with nothing personal yet: the card would just repeat the total.
  if (members.length < 2 && !myDocs.length && !personal.length) return null;
  const row = (label, val, sub) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 1 }}>{sub}</div>}
      </div>
      <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{fmtC(val)}</span>
    </div>
  );
  return (
    <div style={{ padding: '0 14px 16px' }}>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'تكلفة رحلتك' : 'Your trip cost'}</div>
          <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>🔒 {ar ? 'تظهر لك فقط' : 'only you'}</span>
        </div>
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: '4px 0 6px' }}>{fmtC(total)}</div>
        <div style={{ borderTop: '0.5px solid var(--hairline)', paddingTop: 4 }}>
          {row(ar ? 'نصيبك من مصاريف الرحلة' : 'Your share of the trip',
               share, ar ? `${fmtC(groupTotal)} ÷ ${members.length}` : `${fmtC(groupTotal)} ÷ ${members.length}`)}
          {row(ar ? 'حجوزاتك (طيران وغيره)' : 'Your bookings (flights…)', docsUSD,
               myDocs.length ? myDocs.map((d) => d.title).join(' · ') : (ar ? 'أضف تكلفة تذكرتك من المستندات' : 'Add your ticket cost in Docs'))}
          {row(ar ? 'مصاريفك الشخصية' : 'Your personal spend', personalUSD,
               personal.length ? null : (ar ? 'من زر + اختر «شخصي»' : 'Tap + and choose “Personal”'))}
        </div>
        {personal.length > 0 && (
          <div style={{ marginTop: 6, display: 'grid', gap: 4 }}>
            {personal.slice(0, 6).map((e) => (
              <button key={e.id} onClick={() => openSheet?.('editExpense', e)} style={{
                display: 'flex', alignItems: 'center', gap: 8, minHeight: 40, padding: '0 12px', borderRadius: 12,
                background: 'var(--cream)', border: '0.5px solid var(--hairline)', textAlign: 'start',
              }}>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{e.title}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{e.when}</span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{fmtC(e.usd)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Trip pace: the one analysis that changes a decision ───────────────
// "At this pace you'll finish on X" + a small day-by-day bar row.
// Bookings (general budget) count once in the projection, not per day.
function TripPaceCard() {
  const ar = window.isRTL;
  const trip = window.TRIP;
  if (!trip?.startDate || !trip?.endDate) return null;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const expenses = window.EXPENSES || [];
  const planned = trip.budget?.plannedUSD || 0;
  const general = expenses.filter((e) => window.isGeneralBudgetExpense(e, trip));
  const daily = expenses.filter((e) => !window.isGeneralBudgetExpense(e, trip));
  const generalUSD = general.reduce((s, e) => s + (e.usd || 0), 0);
  const today = window.localISO();
  const totalDays = Math.max(1, _daysBetween(trip.startDate, trip.endDate) + 1);
  if (today < trip.startDate) return null;                 // nothing to pace yet
  const lastDay = today > trip.endDate ? trip.endDate : today;
  const daysSoFar = Math.max(1, _daysBetween(trip.startDate, lastDay) + 1);
  const byDay = {};
  daily.forEach((e) => { const k = window.localISO(e.createdAt); byDay[k] = (byDay[k] || 0) + (e.usd || 0); });
  const days = [];
  for (let i = 0; i < daysSoFar; i++) {
    const d = _parseDay(trip.startDate); d.setDate(d.getDate() + i);
    const k = window.localISO(d);
    days.push({ n: i + 1, k, v: byDay[k] || 0 });
  }
  const dailyUSD = days.reduce((s, d) => s + d.v, 0);
  const avg = dailyUSD / daysSoFar;
  const projection = generalUSD + avg * totalDays;
  const ended = today > trip.endDate;
  const diff = planned - projection;
  const max = Math.max(...days.map((d) => d.v), 1);
  const good = diff >= 0;
  return (
    <div style={{ padding: '0 14px 16px' }}>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'وتيرة الصرف' : 'Pace'}</div>
        <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.7 }}>
          {ar
            ? <>تصرفون يومياً <b className="mono">{fmtC(avg)}</b>. {ended ? 'خلصت الرحلة على' : 'بهالوتيرة بتخلصون على'} <b className="mono">{fmtC(ended ? generalUSD + dailyUSD : projection)}</b>{planned > 0 && <>، <span style={{ color: good ? 'var(--moss)' : 'var(--clay-deep)', fontWeight: 600 }}>{good ? 'أقل' : 'أعلى'} من الميزانية بـ {fmtC(Math.abs(ended ? planned - generalUSD - dailyUSD : diff))}</span></>}.</>
            : <>You spend <b>{fmtC(avg)}</b> a day. {ended ? 'You finished on' : "At this pace you'll finish on"} <b>{fmtC(ended ? generalUSD + dailyUSD : projection)}</b>{planned > 0 && <>, <span style={{ color: good ? 'var(--moss)' : 'var(--clay-deep)', fontWeight: 600 }}>{fmtC(Math.abs(ended ? planned - generalUSD - dailyUSD : diff))} {good ? 'under' : 'over'} budget</span></>}.</>}
        </div>
        {/* day bars — row direction follows the language */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 54, marginTop: 12 }}>
          {days.map((d) => (
            <div key={d.k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 0 }}>
              <div title={fmtC(d.v)} style={{
                width: '100%', maxWidth: 22, borderRadius: 5,
                height: Math.max(3, (d.v / max) * 40),
                background: d.k === today ? 'var(--clay)' : 'var(--ink-mute)', opacity: d.v ? 1 : 0.25,
              }} />
              <span style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{d.n}</span>
            </div>
          ))}
        </div>
        {generalUSD > 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 8 }}>
            {ar ? `الحجوزات (${fmtC(generalUSD)}) محسوبة مرة وحدة، مو ضمن الصرف اليومي.` : `Bookings (${fmtC(generalUSD)}) count once, not per day.`}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Personal limit (private) ──────────────────────────────────────────
window.MY_LIMITS = window.MY_LIMITS || {};
window.loadMyLimit = async (tripId) => {
  if (!tripId || !window.sb) return null;
  const { data, error } = await window.sb.from('personal_budgets')
    .select('amount_usd').eq('trip_id', tripId).eq('user_id', window.currentUserId).maybeSingle();
  if (error) return null;
  const v = data ? parseFloat(data.amount_usd) : null;
  window.MY_LIMITS[tripId] = v;
  return v;
};
window.saveMyLimit = async (tripId, usd) => {
  const { error } = await window.sb.from('personal_budgets')
    .upsert({ trip_id: tripId, user_id: window.currentUserId, amount_usd: Math.round(usd * 100) / 100, updated_at: new Date().toISOString() });
  if (error) {
    throw new Error(/personal_budgets/i.test(error.message || '')
      ? (window.isRTL ? 'قاعدة البيانات تحتاج تحديث: شغّل ملف 021_personal_budgets.sql' : 'Run migration 021_personal_budgets.sql')
      : error.message);
  }
  window.MY_LIMITS[tripId] = usd;
};

function PersonalLimitCard() {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const home = trip?.homeCurrency || 'USD';
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const [limit, setLimit] = React.useState(window.MY_LIMITS[trip?.id] ?? null);
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => { let on = true; window.loadMyLimit(trip?.id).then((v) => { if (on) setLimit(v); }); return () => { on = false; }; }, [trip?.id]);
  const spent = (window.MY_PERSONAL_EXPENSES || []).reduce((s, e) => s + (e.usd || 0), 0);
  const save = async () => {
    const n = parseFloat(val); if (!(n >= 0)) return;
    setSaving(true);
    try { const usd = window.toUSD(n, home); await window.saveMyLimit(trip.id, usd); setLimit(usd); setEditing(false); }
    catch (e) { window.toast?.(e.message || 'Failed', 'error'); }
    setSaving(false);
  };
  const field = { flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 14, fontSize: 16, border: '0.5px solid var(--hairline)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none', fontFamily: 'var(--mono)' };
  const left = limit != null ? limit - spent : null;
  const pct = limit ? Math.min(1, spent / limit) : 0;
  return (
    <div style={{ padding: '0 14px 16px' }}>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'حدّ مصاريفك الشخصية' : 'Personal spending limit'}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>
              {ar ? 'تسوق وغيره — ما يشمل طيرانك ولا حجوزاتك' : 'Shopping etc. — excludes your flight and bookings'}
            </div>
          </div>
          {limit != null && !editing && (
            <button onClick={() => { setVal(String(Math.round(limit * window.fxRate(home)))); setEditing(true); }}
              style={{ fontSize: 12.5, color: 'var(--ink-soft)', minHeight: 36, padding: '0 4px', background: 'transparent' }}>{ar ? 'تعديل' : 'Edit'}</button>
          )}
        </div>
        {(limit == null || editing) ? (
          <>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', margin: '6px 0 10px', lineHeight: 1.6 }}>
              {ar ? `كم تبي تصرف على نفسك في هالرحلة؟ (${home})` : `How much for yourself on this trip? (${home})`}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <window.NumberField value={val} onChange={setVal} placeholder="2000" style={field} />
              <button disabled={saving} onClick={save} style={{ minHeight: 46, padding: '0 18px', borderRadius: 14, background: 'var(--ink)', color: 'var(--cream)', fontSize: 14, fontWeight: 600 }}>
                {saving ? '…' : (ar ? 'حفظ' : 'Save')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: left < 0 ? 'var(--clay-deep)' : 'var(--ink)' }}>{fmtC(Math.abs(left))}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>
                {left < 0 ? (ar ? 'تجاوزت حدّك' : 'over your limit') : (ar ? `باقي من ${fmtC(limit)}` : `left of ${fmtC(limit)}`)}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--cream)', marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 999, background: left < 0 ? 'var(--clay)' : 'var(--moss)' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// "My budget" view: limit, my trip cost, my categories.
function MyBudgetView({ openSheet }) {
  const ar = window.isRTL;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const personal = window.MY_PERSONAL_EXPENSES || [];
  const total = personal.reduce((s, e) => s + (e.usd || 0), 0);
  const byCat = {};
  personal.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const cats = (window.CATEGORIES || []).filter((c) => byCat[c.key] > 0);
  return (
    <>
      <PersonalLimitCard />
      <window.MyTripCostCard openSheet={openSheet} />
      {cats.length > 0 && (
        <div style={{ padding: '0 14px 16px' }}>
          <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>{ar ? 'وين راحت مصاريفك الشخصية' : 'Where your money went'}</div>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
              {cats.map((c) => <div key={c.key} style={{ flex: byCat[c.key], background: c.color }} />)}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
              {cats.map((c) => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: c.color }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{window.catLabel(c.key, c.label)}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{Math.round((byCat[c.key] / total) * 100)}%</span>
                  <span className="mono" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', minWidth: 80, textAlign: 'end' }}>{fmtC(byCat[c.key])}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Shared bookings with a cost that nobody has paid yet: not in the budget,
// but worth seeing so they don't surprise you later.
function UnpaidBookingsNote() {
  const ar = window.isRTL;
  const unpaid = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((d) => d && !d.ownerUserId && d.costUSD > 0 && !window.isDocPaid(d));
  if (!unpaid.length) return null;
  const total = unpaid.reduce((s, d) => s + (d.costUSD || 0), 0);
  return (
    <div style={{ padding: '0 14px 16px' }}>
      <div style={{ borderRadius: 18, padding: '12px 16px', background: 'oklch(0.62 0.13 35 / 0.08)', border: '0.5px solid oklch(0.62 0.13 35 / 0.3)' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--clay-deep)' }}>
          {ar ? `⏳ حجوزات لم تُدفع بعد: ${window.fmtMoney(total, { in: 'home' })}` : `⏳ Unpaid bookings: ${window.fmtMoney(total, { in: 'home' })}`}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.5 }}>
          {unpaid.map((d) => d.title).join(' · ')}
          {ar ? ' — تنحسب في الميزانية لما تسجّل إنها اندفعت.' : ' — they count once marked paid.'}
        </div>
      </div>
    </div>
  );
}

// ── Shared bookings: each person's share vs what they actually paid ────
// Hotels, rentals, activities booked for everyone are split equally
// (total ÷ travelers). Whoever paid — one person, or several with their own
// amounts — has that deducted from their share. Bookings only: day-to-day
// expenses and the cards are not part of this.
window.bookingShares = () => {
  const members = window.MEMBERS || [];
  const docs = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((d) => d && !d.ownerUserId && d.costUSD > 0);
  const totalUSD = docs.reduce((s, d) => s + d.costUSD, 0);
  const paidBy = {};
  docs.forEach((d) => {
    if (!window.isDocPaid(d)) return;
    const det = d.details || {};
    const payers = det.payers && typeof det.payers === 'object' ? det.payers : null;
    if (payers && Object.keys(payers).length) {
      const base = d.costLocal > 0 ? d.costLocal : d.costUSD;
      Object.entries(payers).forEach(([id, v]) => {
        paidBy[id] = (paidBy[id] || 0) + (parseFloat(v) || 0) / base * d.costUSD;
      });
    } else if (det.paid_by) {
      paidBy[det.paid_by] = (paidBy[det.paid_by] || 0) + d.costUSD;
    }
  });
  const share = totalUSD / Math.max(1, members.length);
  return {
    docs, totalUSD, share,
    rows: members.map((m) => ({ member: m, paid: paidBy[m.id] || 0, left: share - (paidBy[m.id] || 0) })),
  };
};

function BookingSharesCard() {
  const ar = window.isRTL;
  const members = window.MEMBERS || [];
  if (members.length < 2) return null;
  const { docs, totalUSD, share, rows } = window.bookingShares();
  if (!docs.length) return null;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const me = window.currentUserId;
  return (
    <div style={{ padding: '0 14px 16px' }}>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'الحجوزات المشتركة' : 'Shared bookings'}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 2, lineHeight: 1.5 }}>
          {ar ? `نصيب كل شخص ${fmtC(share)} — المجموع ${fmtC(totalUSD)} على ${members.length} أشخاص`
              : `Each person's share ${fmtC(share)} (${fmtC(totalUSD)} ÷ ${members.length})`}
        </div>
        <div style={{ borderTop: '0.5px solid var(--hairline)', marginTop: 10, paddingTop: 4 }}>
          {rows.map(({ member: m, paid, left }) => {
            const done = Math.abs(left) < 0.5;
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                <Avatar m={m} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>{m.id === me ? (ar ? 'أنت' : 'You') : (m.name || '').split(' ')[0]}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{ar ? `${m.id === me ? 'دفعت' : 'دفع'} ${fmtC(paid)}` : `Paid ${fmtC(paid)}`}</div>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
                  color: done ? 'var(--moss)' : left > 0 ? 'var(--clay-deep)' : 'var(--moss)' }}>
                  {done ? (ar ? '✓ مكتمل' : '✓ Settled')
                    : left > 0 ? (ar ? `${m.id === me ? 'باقي عليك' : 'باقي عليه'} ${fmtC(left)}` : `Owes ${fmtC(left)}`)
                    : (ar ? `${m.id === me ? 'دفعت' : 'دفع'} زيادة ${fmtC(-left)}` : `Paid ${fmtC(-left)} extra`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BookingSharesCard, TodayBudgetCard, WalletsSetup, MyTripCostCard, TripPaceCard, PersonalLimitCard, MyBudgetView, UnpaidBookingsNote });
