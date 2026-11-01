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
  // The group's cash: one pot brought from home, in the currency it's
  // carried in (usually the country's). amount_usd is its value when it
  // was entered — the budget adds it to the cards in the same terms.
  // Cash taken out of a card later adds to it (see cashOf); a trip with
  // no cash at the start gets a pot with the first withdrawal.
  const c = w.cash;
  const cashAmt = c ? parseFloat(c.amount) || 0 : 0;
  const tops = window.cashTopupsOf ? window.cashTopupsOf(trip) : [];
  const cash = (cashAmt > 0 || tops.length) ? {
    id: 'cash', amount: cashAmt,
    currency: String((cashAmt > 0 && c.currency) || trip.localCurrency || (tops[0] && tops[0].localCur) || 'USD').toUpperCase(),
    amountUSD: cashAmt > 0 ? (parseFloat(c.amount_usd) > 0 ? parseFloat(c.amount_usd) : window.toUSD(cashAmt, c.currency)) : 0,
  } : null;
  if (cards.length === 0 && !cash) return null;
  return { cards, cash };
};

// What an expense came to in a given currency: the amount as typed when it
// was entered in that currency, otherwise converted.
const _inCur = (e, cur) => (e.localCur === cur && e.local != null && isFinite(e.local) ? e.local : (e.usd || 0) * window.fxRate(cur));

// Cash taken out of a card into the group's cash (newest first), as
// positive amounts, each with its fee (a normal expense on that card).
window.cashTopupsOf = (trip) => {
  trip = trip || window.TRIP;
  if (!trip || !window.TRIP || trip.id !== window.TRIP.id) return [];
  const exp = window.EXPENSES || [];
  return (window.CASH_TOPUPS || []).map((r) => {
    const fee = exp.find((e) => e.id === window.topupFeeId(r.id)) || null;
    return {
      id: r.id, who: r.who, usd: -(Number(r.usd) || 0),
      local: r.local != null && isFinite(r.local) ? -Number(r.local) : null, localCur: r.localCur || null,
      createdAt: r.createdAt, fee, feeUSD: fee ? (fee.usd || 0) : 0, row: r,
    };
  }).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
};

// The cash pot as it stands: spent and left, in its own currency (exact —
// what's in your pocket) and in the budget's terms. Expenses before the
// trip (bookings) don't come out of it, the same rule as the cards. Cash
// taken out of a card adds to it (amount = at the start + added).
window.cashOf = (trip, expenses) => {
  const w = window.walletsOf(trip);
  if (!w || !w.cash) return null;
  const c = w.cash;
  const tops = window.cashTopupsOf(trip);
  const addedUSD = tops.reduce((s, t) => s + t.usd, 0);
  const added = tops.reduce((s, t) => s + _inCur(t, c.currency), 0);
  const amount = c.amount + added, amountUSD = c.amountUSD + addedUSD;
  const paid = (expenses || []).filter((e) => e.cash && !window.isGeneralBudgetExpense(e, trip));
  const spentUSD = paid.reduce((s, e) => s + (e.usd || 0), 0);
  const spent = paid.reduce((s, e) => s + _inCur(e, c.currency), 0);
  return { ...c, baseAmount: c.amount, baseUSD: c.amountUSD, added, addedUSD, topups: tops,
    amount, amountUSD, spentUSD, leftUSD: amountUSD - spentUSD, spent, left: amount - spent, count: paid.length, expenses: paid };
};
// Money that came into the cash from outside the trip's cards (a cash-only
// trip, or someone's own card): it adds to the trip's money. Cash taken out
// of one of the cards only moves money, so the total stays the same.
const _cashFromOutsideUSD = (trip, cardIds) => (window.cashTopupsOf(trip) || [])
  .filter((t) => !cardIds.has(t.who)).reduce((s, t) => s + t.usd, 0);

const _parseDay = (iso) => {
  const [y, m, d] = String(iso || '').split('-').map(Number);
  return y ? new Date(y, (m || 1) - 1, d || 1) : null;
};
const _daysBetween = (a, b) => Math.round((_parseDay(b) - _parseDay(a)) / 86400000);

// The daily budget, two ways:
//   planPerDay — the plan: the money ÷ the trip's days. Fixed; Analysis
//                compares every day against it.
//   allowance  — today's budget: what's left of the money ÷ the days left,
//                today included. It moves: spend less one day and the next
//                days get more, spend more and they get less.
// `pool` is the money for day-to-day spending; `daily` its expenses.
const _dayBudget = (pool, daily, trip, today) => {
  const dayOf = (e) => (e.createdAt ? window.localISO(e.createdAt) : today);
  const start = trip.startDate, end = trip.endDate;
  const totalDays = start && end ? Math.max(1, _daysBetween(start, end) + 1) : 1;
  const planPerDay = pool / totalDays;
  const spent = daily.reduce((s, e) => s + (e.usd || 0), 0);
  let phase = 'during';
  if (start && today < start) phase = 'before';
  else if (end && today > end) phase = 'after';
  let daysLeft, allowance, todaySpent = 0, todayLeft = null, nextDaysAllowance = null;
  if (phase === 'during') {
    daysLeft = Math.max(1, _daysBetween(today, end) + 1);              // includes today
    const beforeToday = daily.filter((e) => dayOf(e) < today).reduce((s, e) => s + (e.usd || 0), 0);
    todaySpent = daily.filter((e) => dayOf(e) === today).reduce((s, e) => s + (e.usd || 0), 0);
    allowance = (pool - beforeToday) / daysLeft;
    todayLeft = allowance - todaySpent;
    if (daysLeft > 1) nextDaysAllowance = (pool - beforeToday - todaySpent) / (daysLeft - 1);
  } else if (phase === 'before') {
    daysLeft = totalDays;
    allowance = (pool - spent) / totalDays;
  } else {
    daysLeft = 0;
    allowance = 0;
  }
  return { pool, spent, left: pool - spent, totalDays, planPerDay, phase, daysLeft, allowance, todaySpent, todayLeft, nextDaysAllowance };
};

window.computeTodayBudget = (trip, expenses, todayISO) => {
  const w = window.walletsOf(trip);
  if (!w) return null;
  expenses = expenses || [];
  const today = todayISO || window.localISO();
  const ids = new Set(w.cards.map((c) => c.id));
  // Bookings (logged before the trip starts, or from a document's cost) are
  // GENERAL budget: they count in the trip total, not against the cards.
  // Cash is its own pot: an expense paid in cash never touches a card.
  const cardExp = expenses.filter((e) => !e.cash && ids.has(e.who) && !window.isGeneralBudgetExpense(e, trip));

  // Cash taken out of a card is off the card (the fee is an expense on it).
  const tops = window.cashTopupsOf(trip);
  const cards = w.cards.map((c) => {
    const spent = cardExp.filter((e) => e.who === c.id).reduce((s, e) => s + (e.usd || 0), 0);
    const withdrawn = tops.filter((t) => t.who === c.id).reduce((s, t) => s + t.usd, 0);
    return { ...c, spent, withdrawn, left: c.amountUSD - spent - withdrawn };
  });
  const cash = window.cashOf(trip, expenses);
  const totalUSD = cards.reduce((s, c) => s + c.amountUSD, 0) + (cash ? cash.baseUSD + _cashFromOutsideUSD(trip, ids) : 0);
  const spentUSD = cards.reduce((s, c) => s + c.spent, 0) + (cash ? cash.spentUSD : 0);
  const leftUSD = totalUSD - spentUSD;
  const b = _dayBudget(totalUSD, cash ? [...cardExp, ...cash.expenses] : cardExp, trip, today);
  return { cards, cash, totalUSD, spentUSD, leftUSD, totalDays: b.totalDays, planPerDay: b.planPerDay, phase: b.phase, daysLeft: b.daysLeft,
    allowance: b.allowance, todaySpent: b.todaySpent, todayLeft: b.todayLeft, nextDaysAllowance: b.nextDaysAllowance };
};

// Today's budget for any trip: from the cards when the trip spends from
// cards, otherwise from the trip budget minus the bookings (those count
// once, not per day). null when there's no budget to divide.
window.dailyBudget = (trip, expenses, todayISO) => {
  trip = trip || window.TRIP;
  if (!trip?.startDate || !trip?.endDate) return null;
  expenses = expenses || window.EXPENSES || [];
  const today = todayISO || window.localISO();
  const w = window.walletsOf(trip);
  if (w) {
    const ids = new Set(w.cards.map((c) => c.id));
    const pool = w.cards.reduce((s, c) => s + c.amountUSD, 0) + (w.cash ? w.cash.amountUSD + _cashFromOutsideUSD(trip, ids) : 0);
    if (!(pool > 0)) return null;
    const daily = expenses.filter((e) => !window.isGeneralBudgetExpense(e, trip) && (e.cash ? !!w.cash : ids.has(e.who)));
    return { ..._dayBudget(pool, daily, trip, today), cards: true };
  }
  const planned = trip.budget?.plannedUSD || 0;
  if (!(planned > 0)) return null;
  const general = expenses.filter((e) => window.isGeneralBudgetExpense(e, trip)).reduce((s, e) => s + (e.usd || 0), 0);
  return { ..._dayBudget(Math.max(0, planned - general), expenses.filter((e) => !window.isGeneralBudgetExpense(e, trip)), trip, today), cards: false };
};

const _first = (m) => ((m && m.name) || '').trim().split(/\s+/)[0] || '?';

// ── Hub: today's money + the cards (two sections) ────────────────────
// Section 1 answers "how much can we spend today?" (one hero number, a
// bar for today, and two figures for the rest of the trip). Section 2 is
// the group's cards as physical 3D cards. Before the trip it shows the
// daily budget; after it, a short summary with a way into the analysis.
function TodayBudgetCard({ onManage, onOpen, onAnalysis }) {
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const b = window.computeTodayBudget(trip, window.EXPENSES);
  if (!b) return null;
  const ar = window.isRTL;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const Section = window.HubSection, Pill = window.HubPill, Stat = window.HubStat;
  const during = b.phase === 'during', before = b.phase === 'before';
  const over = during && b.todayLeft < 0;
  const roomy = b.allowance >= b.planPerDay;
  const todayISO = window.localISO();
  const daysWord = (n) => ar
    ? window.arPlural(n, { one: 'يوم واحد', two: 'يومان', few: `${n} أيام`, many: `${n} يوماً`, other: `${n} يوم` })
    : `${n} ${n === 1 ? 'day' : 'days'}`;
  const cardsWord = (n) => ar
    ? window.arPlural(n, { one: 'بطاقة واحدة', two: 'بطاقتان', few: `${n} بطاقات`, many: `${n} بطاقة`, other: `${n} بطاقة` })
    : `${n} ${n === 1 ? 'card' : 'cards'}`;
  // The money the group spends from: cards, the cash, or both.
  const nCards = b.cards.length, hasCash = !!b.cash;
  const moneyWord = hasCash ? (nCards ? (ar ? 'البطاقات والكاش' : 'Cards & cash') : (ar ? 'الكاش' : 'Cash')) : (ar ? 'البطاقات' : 'Cards');
  const moneySub = hasCash ? (nCards ? `${cardsWord(nCards)} + ${ar ? 'كاش' : 'cash'}` : (ar ? 'كاش القروب' : "The group's cash")) : cardsWord(nCards);
  const spentOn = hasCash ? (ar ? 'صرفتوا' : 'Spent') : (ar ? 'صرفتوا من البطاقات' : 'Spent on cards');

  let title, sub, label, big, pill;
  if (during) {
    title = ar ? 'ميزانية اليوم' : "Today's budget";
    sub = new Date(todayISO + 'T00:00:00').toLocaleDateString(ar ? 'ar' : 'en', { weekday: 'long', day: 'numeric', month: 'long' });
    label = over ? (ar ? 'تجاوزتوا اليوم بـ' : 'Over today by') : (ar ? 'باقي لليوم' : 'Left today');
    big = Math.abs(b.todayLeft);
    pill = over ? <Pill tone="warn">{ar ? 'فوق حد اليوم' : 'Over today'}</Pill>
      : roomy ? <Pill tone="good">{ar ? 'فيه متسع' : 'Room to spare'}</Pill>
      : <Pill tone="warn">{ar ? 'اقتصدوا شوي' : 'Ease off'}</Pill>;
  } else if (before) {
    const until = Math.max(0, Math.round((new Date(trip.startDate + 'T00:00:00') - new Date(todayISO + 'T00:00:00')) / 86400000));
    title = ar ? 'ميزانية الرحلة' : 'Trip budget';
    sub = trip.dates || '';
    label = ar ? 'ميزانيتكم اليومية' : 'Your daily budget';
    big = b.allowance;
    pill = <Pill tone="info">{until <= 1 ? (ar ? 'تبدأ بكرة' : 'Starts tomorrow') : (ar ? `تبدأ بعد ${daysWord(until)}` : `Starts in ${daysWord(until)}`)}</Pill>;
  } else {
    title = ar ? 'ملخص الرحلة' : 'Trip summary';
    sub = trip.dates || '';
    label = ar ? 'باقي بعد الرحلة' : 'Left after the trip';
    big = b.leftUSD;
    pill = <Pill tone="neutral">{ar ? 'انتهت الرحلة' : 'Trip ended'}</Pill>;
  }
  const pctToday = during && b.allowance > 0 ? Math.max(0, Math.min(1, b.todaySpent / b.allowance)) : 0;

  let stats;
  if (during) {
    stats = [
      b.daysLeft > 1 && b.nextDaysAllowance != null
        ? <Stat key="a" label={ar ? `للأيام الجاية (${b.daysLeft - 1})` : `Next ${b.daysLeft - 1} days`} value={fmtC(b.nextDaysAllowance)}
            sub={ar ? `لكل يوم · خطتكم ${fmtC(b.planPerDay)}` : `a day · plan ${fmtC(b.planPerDay)}`} />
        : <Stat key="a" label={spentOn} value={fmtC(b.spentUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
      <Stat key="b" label={ar ? 'باقي للرحلة' : 'Left for the trip'} value={fmtC(b.leftUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
    ];
  } else if (before) {
    stats = [
      <Stat key="a" label={hasCash ? moneyWord : (ar ? 'مجموع البطاقات' : 'On the cards')} value={fmtC(b.totalUSD)} sub={moneySub} />,
      <Stat key="b" label={ar ? 'مدة الرحلة' : 'Trip length'} value={daysWord(b.totalDays)} sub={trip.startDate ? (ar ? `تبدأ ${window.fmtDate(trip.startDate)}` : `from ${window.fmtDate(trip.startDate)}`) : ''} />,
    ];
  } else {
    stats = [
      <Stat key="a" label={spentOn} value={fmtC(b.spentUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
      <Stat key="b" label={ar ? 'متوسط اليوم' : 'Per day'} value={fmtC(b.totalDays ? b.spentUSD / b.totalDays : 0)} sub={ar ? `خطتكم ${fmtC(b.planPerDay)}` : `plan ${fmtC(b.planPerDay)}`} />,
    ];
  }

  return (
    <>
      <Section title={title} sub={sub}>
        <div onClick={onOpen} role="button" className="press-soft" style={{
          background: over ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
          borderRadius: 24, padding: '16px 16px 14px', cursor: onOpen ? 'pointer' : 'default',
          border: over ? '0.5px solid oklch(0.62 0.13 35 / 0.35)' : '0.5px solid var(--hairline)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: over ? 'var(--clay-deep)' : 'var(--ink-soft)' }}>{label}</span>
            {pill}
          </div>
          <div className="mono" style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2, color: over ? 'var(--clay-deep)' : 'var(--ink)' }}>
            <window.CountUp id={'today-big-' + (trip?.id || '') + b.phase} value={big} format={fmtC} />
          </div>
          {before && <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{ar ? `على ${daysWord(b.totalDays)}` : `over ${daysWord(b.totalDays)}`}</div>}

          {during && (
            <>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--cream)', marginTop: 10, overflow: 'hidden' }}>
                <div className="v-grow" style={{
                  width: `${(over ? 1 : pctToday) * 100}%`, height: '100%', borderRadius: 999,
                  background: over ? 'var(--clay)' : 'var(--moss)', transition: 'width 300ms cubic-bezier(.2,.8,.2,1)',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 6, fontSize: 12, color: 'var(--ink-mute)' }}>
                <span>{ar ? 'صرفتوا اليوم' : 'Spent today'} <b className="mono" style={{ color: 'var(--ink-soft)' }}>{fmtC(b.todaySpent)}</b></span>
                <span>{ar ? 'من' : 'of'} <span className="mono">{fmtC(b.allowance)}</span></span>
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8, marginTop: 14 }}>{stats}</div>

          {!during && !before && onAnalysis && (
            <button onClick={(e) => { e.stopPropagation(); onAnalysis(); }} style={{
              marginTop: 12, width: '100%', minHeight: 44, borderRadius: 14, background: 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 13.5, fontWeight: 600, color: 'var(--ink)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
              {ar ? 'شوف تحليل الرحلة' : 'See the trip analysis'}
            </button>
          )}
        </div>
      </Section>

      {/* The group's money — the cash as a banknote, the cards as physical
          3D cards: swipe or tap to flip through */}
      <Section title={moneyWord} sub={moneySub} action={ar ? 'إدارة' : 'Manage'} onAction={onManage}>
        <window.WalletCarousel cards={b.cards} cash={b.cash} members={members} fmt={fmtC} onOpenCard={(id) => window.openCardExpenses(id)} />
      </Section>
    </>
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
  // The group's cash: an amount in the currency it's carried in.
  const local = trip?.localCurrency || home;
  const rc = raw.cash && parseFloat(raw.cash.amount) > 0 ? raw.cash : null;
  const [cashOn, setCashOn] = React.useState(!!rc);
  const [cashCur, setCashCur] = React.useState(rc?.currency || (local !== home ? local : home));
  const [cashAmt, setCashAmt] = React.useState(rc ? String(Math.round(parseFloat(rc.amount))) : '');
  const cashNum = cashOn ? parseFloat(cashAmt) || 0 : 0;
  const cashHome = window.toUSD(cashNum, cashCur) * rate;
  const ids = Object.keys(cards);
  const totalHome = ids.reduce((s, id) => s + (parseFloat(cards[id]) || 0), 0) + cashHome;
  const days = trip?.startDate && trip?.endDate ? Math.max(1, _daysBetween(trip.startDate, trip.endDate) + 1) : 1;

  const save = async () => {
    setSaving(true);
    try {
      // Unchanged cash keeps the value it was entered at, so re-saving the
      // cards doesn't nudge the budget with the day's exchange rate.
      const sameCash = rc && parseFloat(rc.amount) === cashNum && rc.currency === cashCur;
      const wallets = {
        enabled,
        cards: ids.map((id) => ({
          user_id: id,
          amount_usd: Math.round(window.toUSD(parseFloat(cards[id]) || 0, home) * 100) / 100,
        })),
        cash: cashNum > 0 ? {
          amount: cashNum, currency: cashCur,
          amount_usd: sameCash ? parseFloat(rc.amount_usd) : Math.round(window.toUSD(cashNum, cashCur) * 100) / 100,
        } : null,
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

  // Only offer "Save" when something actually changed.
  const snap = (en, cs, cash) => JSON.stringify([!!en, Object.keys(cs).sort().map((k) => [k, Math.round(parseFloat(cs[k]) || 0)]), cash]);
  const savedCards = {};
  (raw.cards || []).forEach((c) => { savedCards[c.user_id] = String(Math.round((parseFloat(c.amount_usd) || 0) * rate)); });
  const dirty = snap(enabled, cards, cashNum > 0 ? [Math.round(cashNum), cashCur] : null)
    !== snap(raw.enabled, savedCards, rc ? [Math.round(parseFloat(rc.amount)), rc.currency] : null);

  return (
    <SetGroup title={ar ? 'البطاقات والكاش' : 'Cards & cash'}
      footer={ar ? 'من البطاقات والكاش يحسب التطبيق كم تقدرون تصرفون كل يوم، وكم باقي في كل بطاقة وفي الكاش.' : 'From the cards and the cash the app works out what you can spend each day and what is left on each.'}>
      <SetRow icon={<IconCard size={16} stroke="#fff" />} tint={SET_TINT.teal}
        label={ar ? 'نصرف من بطاقات وكاش محدد' : 'We spend from set cards & cash'}
        sub={ar ? 'تعرفون كم باقي في كل بطاقة وفي الكاش، وكم تقدرون تصرفون اليوم' : 'See what is left on each card and in the cash, and what you can spend today'}
        right={<SetSwitch on={enabled} onChange={(v) => setEnabled(v)} label={ar ? 'البطاقات والكاش' : 'Cards & cash'} />} />

      {enabled && (
        <div style={{ padding: '4px 14px 14px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: '6px 2px 8px' }}>
            {ar ? 'بطاقة مين؟' : 'Whose card?'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {members.map((m) => {
              const on = m.id in cards;
              return (
                <button key={m.id} onClick={() => setCards((p) => {
                  const n = { ...p }; if (on) delete n[m.id]; else n[m.id] = ''; return n;
                })} aria-pressed={on} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px 5px 5px', minHeight: 42,
                  borderRadius: 999, background: on ? 'var(--sel)' : 'var(--cream)',
                  color: on ? 'var(--sel-fg)' : 'var(--ink)', border: on ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
                  fontSize: 13.5, fontWeight: 500, transition: 'background 160ms, color 160ms',
                }}>
                  <Avatar m={m} size={30} />{_first(m)}
                </button>
              );
            })}
          </div>

          {ids.length > 0 && (
            <>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: '16px 2px 8px' }}>
                {ar ? `كم في كل بطاقة للرحلة؟ (${home})` : `Amount on each card (${home})`}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8 }}>
                {ids.map((id) => {
                  const m = members.find((x) => x.id === id) || { name: '?' };
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar m={m} size={30} />
                      <span style={{ width: 76, fontSize: 13.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{_first(m)}</span>
                      <window.NumberField value={cards[id]} placeholder="0"
                        onChange={(v) => setCards((p) => ({ ...p, [id]: v }))} style={field} />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* The group's cash */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid var(--hairline)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: 'grid', placeItems: 'center',
                background: 'linear-gradient(135deg, #4f8a73, #24503f)', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.25)' }}>
                <IconCash size={16} stroke="#fff" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'كاش القروب' : "The group's cash"}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 1 }}>{ar ? 'الفلوس اللي معكم نقد من قبل السفر' : 'The cash you bring along'}</div>
              </div>
              <SetSwitch on={cashOn} onChange={(v) => setCashOn(v)} label={ar ? 'الكاش' : 'Cash'} />
            </div>
            {cashOn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <window.NumberField value={cashAmt} placeholder="0" onChange={(v) => setCashAmt(v)} style={field} />
                {local !== home && (
                  <div role="radiogroup" aria-label={ar ? 'عملة الكاش' : 'Cash currency'} style={{ display: 'inline-flex', padding: 3, borderRadius: 12, background: 'var(--cream)', border: '0.5px solid var(--hairline)', flexShrink: 0 }}>
                    {[local, home].map((code) => (
                      <button key={code} role="radio" aria-checked={cashCur === code} onClick={() => setCashCur(code)} style={{
                        minWidth: 52, minHeight: 38, padding: '0 10px', borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)',
                        background: cashCur === code ? 'var(--sel)' : 'transparent', color: cashCur === code ? 'var(--sel-fg)' : 'var(--ink-soft)',
                      }}>{code}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {cashOn && cashCur !== home && cashNum > 0 && (
              <div className="mono" style={{ fontSize: 12, color: 'var(--ink-mute)', margin: '6px 2px 0' }}>≈ {Math.round(cashHome).toLocaleString('en')} {home}</div>
            )}
          </div>

          {(ids.length > 0 || cashNum > 0) && (
            <>
              {totalHome > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8, marginTop: 12 }}>
                  <div style={{ background: 'var(--well)', borderRadius: 14, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{ar ? 'المجموع' : 'Total'}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{Math.round(totalHome).toLocaleString('en')} {home}</div>
                  </div>
                  <div style={{ background: 'var(--well)', borderRadius: 14, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{ar ? `يومياً (${days} ${days >= 3 && days <= 10 ? 'أيام' : 'يوم'})` : `Per day (${days})`}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{Math.round(totalHome / days).toLocaleString('en')} {home}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {dirty && (
        <div style={{ padding: enabled ? '0 14px 14px' : '4px 14px 14px' }}>
          <button disabled={saving} onClick={save} style={{
            width: '100%', minHeight: 46, borderRadius: 14,
            background: 'var(--ink)', color: 'var(--cream)', fontSize: 14.5, fontWeight: 600, opacity: saving ? 0.6 : 1,
          }}>{saving ? '…' : (ar ? 'حفظ' : 'Save')}</button>
        </div>
      )}
    </SetGroup>
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
  // (a visa whose fee is already one of your personal expenses counts there, not twice)
  const myDocs = Object.values(window.DOCS_BY_CAT || {}).flat()
    .filter((d) => d && d.ownerUserId === me && d.costUSD != null && d.costUSD > 0 && !(d.category === 'visas' && d.linkedExpenseId));
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
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: '4px 0 6px' }}><window.CountUp id={'mycost-' + (window.TRIP?.id || '')} value={total} format={fmtC} /></div>
        <div style={{ borderTop: '0.5px solid var(--hairline)', paddingTop: 4 }}>
          {row(ar ? 'نصيبك من مصاريف الرحلة' : 'Your share of the trip',
               share, ar ? `${fmtC(groupTotal)} ÷ ${members.length}` : `${fmtC(groupTotal)} ÷ ${members.length}`)}
          {row(ar ? 'حجوزاتك (طيران وغيره)' : 'Your bookings (flights…)', docsUSD,
               myDocs.length ? myDocs.map((d) => d.title).join(' · ') : (ar ? 'أضف تكلفة تذكرتك من المستندات' : 'Add your ticket cost in Docs'))}
          {row(ar ? 'مصاريفك الشخصية' : 'Your personal spend', personalUSD,
               personal.length ? null : (ar ? 'من زر + اختر «شخصي»' : 'Tap + and choose “Personal”'))}
        </div>
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
        {/* day spend as 3D columns; the dashed line is the daily plan */}
        <window.Bars3D days={days} max={max} today={today} fmt={fmtC}
          planPerDay={planned > 0 ? Math.max(0, (planned - generalUSD) / Math.max(1, totalDays)) : 0} />
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
  const fromDocs = window._docLinkedExpenseIds ? window._docLinkedExpenseIds() : new Set();
  const spent = (window.MY_PERSONAL_EXPENSES || []).filter((e) => !fromDocs.has(e.id)).reduce((s, e) => s + (e.usd || 0), 0);
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
              {ar ? 'تسوق وغيره — ما يشمل طيرانك ولا حجوزاتك ولا رسوم التأشيرة' : 'Shopping etc. — excludes your flight, bookings and visa fee'}
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

// "My budget" view: my limit, my trip cost, where my money went, and every
// personal expense of mine, day by day (tap a category to narrow the list).
function MyBudgetView({ openSheet }) {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const home = trip?.homeCurrency || 'USD', local = trip?.localCurrency || home;
  const alt = home !== local ? (usd) => window.fmtMoney(usd, { in: 'local' }) : null;
  const personal = window.MY_PERSONAL_EXPENSES || [];
  const [cat, setCat] = React.useState('all');
  const total = personal.reduce((s, e) => s + (e.usd || 0), 0);
  const byCat = {};
  personal.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const cats = (window.CATEGORIES || []).filter((c) => byCat[c.key] > 0);
  const catName = (k) => window.CAT_META?.[k]?.[ar ? 'label_ar' : 'label_en'] || window.catLabel?.(k) || k;
  const fromDocs = window._docLinkedExpenseIds ? window._docLinkedExpenseIds() : new Set();
  const docOf = (e) => Object.values(window.DOCS_BY_CAT || {}).flat().find((d) => d && d.linkedExpenseId === e.id);
  const open = (e) => {
    const d = fromDocs.has(e.id) && docOf(e);
    if (d && window.openDocView) window.openDocView(d, (window.DOC_CATEGORIES || []).find((c) => c.key === d.category));
    else openSheet?.('editExpense', e);
  };

  // The list, newest first, by day; anything before the trip is one group.
  const list = (cat === 'all' ? personal : personal.filter((e) => e.cat === cat))
    .slice().sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const start = trip?.startDate, end = trip?.endDate;
  const dayNum = (k) => (start && k && k >= start && (!end || k <= end))
    ? Math.round((new Date(k + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000) + 1 : 0;
  const weekday = (k) => new Date(k + 'T00:00:00').toLocaleDateString(window._dateLocale ? window._dateLocale() : (ar ? 'ar' : 'en'), { weekday: 'long' });
  const groups = [], before = [];
  list.forEach((e) => {
    const k = e.createdAt ? window.localISO(e.createdAt) : '';
    if (start && k && k < start) { before.push({ e, k }); return; }
    const g = groups[groups.length - 1];
    if (g && g.k === k) g.items.push({ e, k }); else groups.push({ k, items: [{ e, k }] });
  });
  if (before.length) groups.push({ k: 'before', before: true, items: before });
  const headOf = (g) => {
    if (g.before) return { title: ar ? 'قبل الرحلة' : 'Before the trip', sub: '', dated: true };
    if (!g.k) return { title: ar ? 'بدون تاريخ' : 'No date', sub: '' };
    const n = dayNum(g.k);
    return n ? { title: ar ? `اليوم ${n}` : `Day ${n}`, sub: `${weekday(g.k)} · ${window.fmtDate(g.k)}` } : { title: weekday(g.k), sub: window.fmtDate(g.k) };
  };
  const listTotal = list.reduce((s, e) => s + (e.usd || 0), 0);
  const countWord = (n) => (ar
    ? window.arPlural(n, { one: 'مصروف واحد', two: 'مصروفان', few: `${n} مصاريف`, many: `${n} مصروفاً`, other: `${n} مصروف` })
    : `${n} ${n === 1 ? 'expense' : 'expenses'}`);

  return (
    <>
      <PersonalLimitCard />
      <window.MyTripCostCard openSheet={openSheet} />
      {cats.length > 0 && (
        <div style={{ padding: '0 14px 4px' }}>
          <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '16px 18px', border: '0.5px solid var(--hairline)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{ar ? 'وين راحت مصاريفك الشخصية' : 'Where your money went'}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', margin: '2px 0 10px' }}>{ar ? 'اضغط على تصنيف لتشوف مصاريفه تحت' : 'Tap a category to see its expenses below'}</div>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
              {cats.map((c) => <div key={c.key} style={{ flex: byCat[c.key], background: c.color, opacity: cat === 'all' || cat === c.key ? 1 : 0.3, transition: 'opacity 200ms' }} />)}
            </div>
            <div style={{ marginTop: 8, display: 'grid', gap: 2 }}>
              {cats.map((c) => {
                const on = cat === c.key;
                return (
                  <button key={c.key} onClick={() => { setCat(on ? 'all' : c.key); window.haptic?.(); }} aria-pressed={on} style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 38, padding: '0 8px',
                    borderRadius: 10, textAlign: 'start', background: on ? 'var(--cream)' : 'transparent', boxSizing: 'border-box',
                  }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', fontWeight: on ? 700 : 400 }}>{catName(c.key)}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{Math.round((byCat[c.key] / total) * 100)}%</span>
                    <span className="mono" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', minWidth: 80, textAlign: 'end' }}>{fmtC(byCat[c.key])}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {personal.length > 0 && window.ExpDay && window.ExpRow && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 20px 0' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
                {cat === 'all' ? (ar ? 'مصاريفك' : 'Your expenses') : catName(cat)}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                🔒 {countWord(list.length)} · <span className="mono">{fmtC(listTotal)}</span> · {ar ? 'تظهر لك فقط' : 'only you see these'}
              </div>
            </div>
            {cat !== 'all' && (
              <button onClick={() => setCat('all')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, flexShrink: 0,
                background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)',
              }}>✕ {ar ? 'الكل' : 'All'}</button>
            )}
          </div>
          {groups.map((g) => {
            const h = headOf(g);
            const sum = g.items.reduce((s, x) => s + (x.e.usd || 0), 0);
            return (
              <window.ExpDay key={g.k || 'nodate'} title={h.title} sub={h.sub}
                total={g.items.length > 1 ? fmtC(sum) : null}>
                {g.items.map((x, i) => (
                  <window.ExpRow key={x.e.id} e={x.e} first={i === 0} conv={fmtC} alt={alt}
                    meta={fromDocs.has(x.e.id) ? (ar ? '📘 من المستندات' : '📘 From documents') : catName(x.e.cat)}
                    dateLabel={h.dated && x.k ? window.fmtDate(x.k) : null}
                    onOpen={() => open(x.e)} />
                ))}
              </window.ExpDay>
            );
          })}
          <div style={{ height: 8 }} />
        </>
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

Object.assign(window, { TodayBudgetCard, WalletsSetup, MyTripCostCard, TripPaceCard, PersonalLimitCard, MyBudgetView, UnpaidBookingsNote });

// ── Card → its expenses ────────────────────────────────────────────────
// Open Expenses already filtered: { day: 'YYYY-MM-DD' } | { cat } | { paidBy }.
window.openExpenses = (f) => {
  window.__expFilter = f || null;
  const tid = window.TRIP?.id;
  if (tid) window.navigateRoute?.({ scope: 'trip', name: 'budget', tripId: tid });
};
window.openCardExpenses = (memberId) => window.openExpenses({ paidBy: memberId });   // 'cash' → the cash

// Expenses filtered to one person/card: their card up top, three figures,
// and a way back to everyone. (The category chips under it narrow the list.)
function PersonFocus({ memberId, conv, onClear }) {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const m = (window.MEMBERS || []).find((x) => x.id === memberId) || { id: memberId, name: '?', hue: 200 };
  const first = (m.name || '').split(' ')[0];
  // With cards, what someone paid in cash came out of the cash, not their card.
  const cardsOn = !!window.walletsOf?.(trip);
  const mine = (window.EXPENSES || []).filter((e) => e.who === memberId && !(cardsOn && e.cash));
  const total = mine.reduce((s, e) => s + (e.usd || 0), 0);
  const days = new Set(mine.map((e) => window.localISO(e.createdAt))).size;
  const b = window.walletsOf?.(trip) ? window.computeTodayBudget?.(trip, window.EXPENSES || [], window.localISO()) : null;
  const card = b && (b.cards || []).find((c) => c.id === memberId);
  const byCat = {};
  mine.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const cats = Object.entries(byCat).sort((a, b2) => b2[1] - a[1]);
  const top = cats[0];
  const tilt = window.useTiltRef ? window.useTiltRef({ max: 6 }) : undefined;
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });
  const tile = (label, value) => (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', borderRadius: 16, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{label}</div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  );
  return (
    <div style={{ padding: '6px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
        <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>{card ? (ar ? `بطاقة ${first}` : `${first}'s card`) : (ar ? `مدفوعات ${first}` : `Paid by ${first}`)}</div>
        <button onClick={onClear} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          ✕ {ar ? 'كل المصاريف' : 'Everyone'}
        </button>
      </div>
      {card ? (
        <div ref={tilt} style={{ height: 186, borderRadius: 20, position: 'relative' }} className="v-flip-in">
          <window.WalletCardFace c={card} m={m} fmt={fmtC} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px', borderRadius: 22, background: 'var(--statement)', color: 'var(--statement-fg)' }}>
          <Avatar m={m} size={46} />
          <div>
            <div style={{ fontSize: 12.5, opacity: 0.75 }}>{ar ? 'إجمالي ما دفعه' : 'Total paid'}</div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}><window.CountUp value={total} format={conv} /></div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {tile(ar ? 'العمليات' : 'Payments', String(mine.length))}
        {tile(ar ? 'متوسط اليوم' : 'Per day', conv(days ? total / days : 0))}
        {tile(ar ? 'الأكثر' : 'Most on', top ? `${window.CAT_META?.[top[0]]?.emoji || ''} ${window.CAT_META?.[top[0]]?.[ar ? 'label_ar' : 'label_en'] || t(top[0]) || top[0]}` : '—')}
      </div>
      {/* Cash taken out of this card → into the group's cash */}
      {card && window.openCashTopup && (
        <button onClick={() => { window.haptic?.(); window.openCashTopup({ card: memberId }); }} style={{
          width: '100%', marginTop: 10, minHeight: 46, borderRadius: 14, background: 'var(--cream-2)',
          border: '0.5px solid var(--hairline)', color: 'var(--ink)', fontSize: 13.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 7, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}>
            <IconCash size={14} stroke="#fff" />
          </span>
          {ar ? 'سحبت كاش من هذي البطاقة' : 'Took cash out of this card'}
          {card.withdrawn > 0 && <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>·</span>}
          {card.withdrawn > 0 && <span className="mono" style={{ color: 'var(--ink-mute)', fontWeight: 500, direction: 'ltr', unicodeBidi: 'isolate' }}>{fmtC(card.withdrawn)}</span>}
        </button>
      )}
    </div>
  );
}
window.PersonFocus = PersonFocus;

// Expenses paid in cash: the banknote up top, then the same three figures.
function CashFocus({ conv, onClear }) {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const cash = window.cashOf?.(trip, window.EXPENSES || []);
  const mine = (window.EXPENSES || []).filter((e) => e.cash);
  const total = mine.reduce((s, e) => s + (e.usd || 0), 0);
  const days = new Set(mine.map((e) => window.localISO(e.createdAt))).size;
  const byCat = {};
  mine.forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const top = Object.entries(byCat).sort((a, b2) => b2[1] - a[1])[0];
  const tilt = window.useTiltRef ? window.useTiltRef({ max: 6 }) : undefined;
  const tile = (label, value) => (
    <div style={{ flex: 1, minWidth: 0, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', borderRadius: 16, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{label}</div>
      <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  );
  return (
    <div style={{ padding: '6px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
        <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>{ar ? 'كاش القروب' : 'Group cash'}</div>
        <button onClick={onClear} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          ✕ {ar ? 'كل المصاريف' : 'Everyone'}
        </button>
      </div>
      {cash ? (
        <div ref={tilt} style={{ height: 186, borderRadius: 12, position: 'relative' }} className="v-flip-in">
          <window.CashNoteFace cash={cash} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px', borderRadius: 22, background: 'var(--statement)', color: 'var(--statement-fg)' }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}><IconCash size={22} stroke="#fff" /></span>
          <div>
            <div style={{ fontSize: 12.5, opacity: 0.75 }}>{ar ? 'المدفوع كاش' : 'Paid in cash'}</div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}><window.CountUp value={total} format={conv} /></div>
          </div>
        </div>
      )}
      {/* Took more cash out of a card? Add it here. */}
      {cash && window.openCashTopup && (
        <button onClick={() => { window.haptic?.(); window.openCashTopup(); }} className="press-soft" style={{
          width: '100%', marginTop: 12, minHeight: 56, borderRadius: 18, border: 'none',
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', textAlign: 'start',
          background: 'linear-gradient(135deg, #3d7763 0%, #24503f 100%)', color: '#fff',
          boxShadow: '0 10px 24px -8px rgba(28, 65, 53, 0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}>
          <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.16)' }}>
            <IconPlus size={18} stroke="#fff" />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{ar ? 'إضافة كاش' : 'Add cash'}</span>
            <span style={{ display: 'block', fontSize: 12, opacity: 0.78, marginTop: 1 }}>{ar ? 'سحبتوا من بطاقة؟ أضفه للكاش' : 'Took cash out of a card? Add it'}</span>
          </span>
          <span className="icon-flip" style={{ display: 'inline-flex', opacity: 0.7 }}><IconChevron size={15} stroke="#fff" /></span>
        </button>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {tile(ar ? 'العمليات' : 'Payments', String(mine.length))}
        {tile(ar ? 'متوسط اليوم' : 'Per day', conv(days ? total / days : 0))}
        {tile(ar ? 'الأكثر' : 'Most on', top ? `${window.CAT_META?.[top[0]]?.emoji || ''} ${window.CAT_META?.[top[0]]?.[ar ? 'label_ar' : 'label_en'] || t(top[0]) || top[0]}` : '—')}
      </div>
      {cash && cash.topups && cash.topups.length > 0 && <CashSources cash={cash} />}
    </div>
  );
}
window.CashFocus = CashFocus;

// Where the cash came from: what you started with, then every withdrawal
// (from which card, with its fee). Tap one to change or remove it.
function CashSources({ cash }) {
  const ar = window.isRTL;
  const members = window.MEMBERS || [];
  const fmtN = (v) => (window.fmtNative ? window.fmtNative(v, cash.currency) : `${Math.round(v).toLocaleString('en')} ${cash.currency}`);
  const fmtH = (usd) => window.fmtMoney(usd, { in: 'home' });
  const inPot = (t) => (t.localCur === cash.currency && t.local != null ? t.local : t.usd * window.fxRate(cash.currency));
  const row = (key, lead, title, sub, amount, amountSub, onClick, first) => (
    <button key={key} onClick={onClick} disabled={!onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', textAlign: 'start',
      background: 'transparent', border: 'none', cursor: onClick ? 'pointer' : 'default', opacity: 1,
    }}>
      {lead}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderTop: first ? 'none' : '0.5px solid var(--hairline)' }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          {sub && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>}
        </span>
        <span style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--moss)', direction: 'ltr', whiteSpace: 'nowrap' }}>{amount}</span>
          {amountSub && <span style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2, whiteSpace: 'nowrap' }}>{amountSub}</span>}
        </span>
      </span>
    </button>
  );
  const noteTile = (
    <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}>
      <IconCash size={17} stroke="#fff" />
    </span>
  );
  const rows = [];
  if (cash.baseAmount > 0) {
    rows.push(row('base', noteTile, ar ? 'من البداية' : 'At the start', ar ? 'الكاش اللي كان معكم' : 'The cash you brought', `+${fmtN(cash.baseAmount)}`, null, null, true));
  }
  cash.topups.forEach((t, i) => {
    const m = members.find((x) => x.id === t.who) || { id: t.who, name: '?', hue: 200 };
    const first = ((m.name || '').trim().split(/\s+/)[0]) || '?';
    const card = t.who === window.currentUserId ? (ar ? 'بطاقتي' : 'my card') : (ar ? `بطاقة ${first}` : `${first}'s card`);
    const day = t.createdAt ? window.fmtDate(window.localISO(t.createdAt)) : '';
    const off = t.usd + t.feeUSD;
    rows.push(row(t.id, <Avatar m={m} size={34} />,
      ar ? `سحب من ${card}` : `From ${card}`,
      [day, t.feeUSD > 0 ? (ar ? `رسوم ${fmtH(t.feeUSD)}` : `fee ${fmtH(t.feeUSD)}`) : null].filter(Boolean).map((x) => '\u2068' + x + '\u2069').join(' · '),
      `+${fmtN(inPot(t))}`,
      ar
        ? <>من البطاقة <bdi className="mono" style={{ direction: 'ltr' }}>−{fmtH(off)}</bdi></>
        : <><bdi className="mono" style={{ direction: 'ltr' }}>−{fmtH(off)}</bdi> off the card</>,
      () => window.openCashTopup?.({ topup: t }), !rows.length));
  });
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 8px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-soft)' }}>{ar ? 'مصادر الكاش' : 'Where the cash came from'}</div>
        <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-mute)', direction: 'ltr' }}>{fmtN(cash.amount)}</div>
      </div>
      <div className="v-list" style={{ background: 'var(--cream-2)', borderRadius: 18, border: '0.5px solid var(--hairline)', overflow: 'hidden' }}>{rows}</div>
    </div>
  );
}

// ── Add cash taken out of a card ──────────────────────────────────────
// The amount (in the country's currency), which card it came out of, and
// the fee, if any. The card is down by both; the cash is up by the amount
// only; the fee is a normal expense on that card (so the trip's spend
// grows by the fee alone — the rest just moved).
// 1000000 → 1,000,000 while typing (the field strips the commas back out).
function groupDigits(s) {
  if (!s) return '';
  const [i, d] = String(s).split('.');
  const g = (i || '').replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return d !== undefined ? `${g || '0'}.${d}` : g;
}

function CashTopupSheet({ existing, presetCard, onDone }) {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const w = window.walletsOf(trip);
  const cards = (w && w.cards) || [];
  const home = trip?.homeCurrency || 'USD';
  const local = trip?.localCurrency || home;
  const potCur = (w && w.cash && w.cash.currency) || local;
  const inputCur = existing?.localCur || local;           // what the ATM gave
  const r2 = (n) => Math.round(n * 100) / 100;
  const nf = (v, cur) => (window.fmtNative ? window.fmtNative(v, cur) : `${Math.round(v).toLocaleString('en')} ${cur}`);
  const fmtH = (usd) => window.fmtMoney(usd, { in: 'home' });

  const [amt, setAmt] = React.useState(existing ? String(r2(existing.local != null && existing.localCur === inputCur ? existing.local : existing.usd * window.fxRate(inputCur))) : '');
  const firstCard = existing?.who
    || (presetCard && cards.some((c) => c.id === presetCard) ? presetCard : null)
    || (cards.some((c) => c.id === window.currentUserId) ? window.currentUserId : (cards[0] && cards[0].id))
    || window.currentUserId;
  const [card, setCard] = React.useState(firstCard);
  const fee0 = existing?.fee;
  const [feeCur, setFeeCur] = React.useState(fee0 && fee0.localCur === local && local !== home && fee0.local != null ? local : home);
  const [fee, setFee] = React.useState(() => {
    if (!fee0) return '';
    if (fee0.localCur === local && local !== home && fee0.local != null) return String(r2(fee0.local));
    return String(r2((fee0.usd || 0) * window.fxRate(home)));
  });
  const todayKey = window.localISO();
  const yestKey = window.localISO(new Date(Date.now() - 86400000));
  const initialDay = existing?.createdAt ? (window.localISO(existing.createdAt) || todayKey) : todayKey;
  const [day, setDay] = React.useState(initialDay);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const amtNum = parseFloat(amt) || 0;
  const amtUSD = window.toUSD(amtNum, inputCur);
  const feeNum = parseFloat(fee) || 0;
  const feeUSD = window.toUSD(feeNum, feeCur);
  const toPot = inputCur === potCur ? amtNum : amtUSD * window.fxRate(potCur);
  const cashNow = window.cashOf(trip, window.EXPENSES || []);
  const leftBefore = cashNow ? cashNow.left - (existing ? (existing.localCur === potCur && existing.local != null ? existing.local : existing.usd * window.fxRate(potCur)) : 0) : 0;
  const cardOf = (id) => {
    const m = members.find((x) => x.id === id) || { id, name: '?' };
    const first = ((m.name || '').trim().split(/\s+/)[0]) || '?';
    return { m, label: id === window.currentUserId ? (ar ? 'بطاقتي' : 'My card') : first };
  };
  const createdAtFor = () => {
    if (existing ? day === initialDay : day === todayKey) return existing ? existing.createdAt : new Date().toISOString();
    const [y, mo, d] = day.split('-').map(Number);
    const tm = existing?.createdAt ? new Date(existing.createdAt) : new Date();
    return new Date(y, mo - 1, d, tm.getHours(), tm.getMinutes(), tm.getSeconds()).toISOString();
  };

  const save = async () => {
    if (!(amtNum > 0)) { setErr(ar ? 'اكتب المبلغ اللي سحبتوه' : 'Enter the amount'); return; }
    setBusy(true); setErr(null);
    try {
      const tripId = trip.id;
      const id = existing ? existing.id : window.newId();
      const at = createdAtFor();
      const payload = {
        title: ar ? 'سحب كاش' : 'Cash withdrawal', category: 'misc',
        amountUSD: -r2(amtUSD), amountLocal: -amtNum, localCurrency: inputCur,
        note: null, splitWith: [], isPersonal: false, paidWith: 'cash', createdAt: at,
      };
      const row = window.expenseRowFrom(id, card, payload, existing ? existing.row : undefined);
      if (existing) await window.outboxPush({ kind: 'edit', expId: id, tripId, payload: { ...payload, paidBy: card }, row });
      else await window.outboxPush({ kind: 'add', expId: id, tripId, createdBy: card, payload, row });
      // The fee: a normal expense on the same card.
      const feeId = window.topupFeeId(id);
      const feeRow = (window.EXPENSES || []).find((e) => e.id === feeId);
      if (feeUSD > 0) {
        const fp = {
          title: ar ? 'رسوم سحب كاش' : 'Cash withdrawal fee', category: 'misc',
          amountUSD: r2(feeUSD), amountLocal: feeCur === local ? feeNum : (local !== 'USD' ? r2(feeUSD * window.fxRate(local)) : null),
          localCurrency: local, note: null, splitWith: [], isPersonal: false, paidWith: null, createdAt: at,
        };
        const frow = window.expenseRowFrom(feeId, card, fp, feeRow);
        if (feeRow) await window.outboxPush({ kind: 'edit', expId: feeId, tripId, payload: { ...fp, paidBy: card }, row: frow });
        else await window.outboxPush({ kind: 'add', expId: feeId, tripId, createdBy: card, payload: fp, row: frow });
      } else if (feeRow) {
        await window.outboxPush({ kind: 'del', expId: feeId, tripId });
        window.EXPENSES = (window.EXPENSES || []).filter((e) => e.id !== feeId);
      }
      window.applyPendingOps?.(tripId);
      window.recomputeExpenseDerived?.(tripId);
      window.notifyDataChange?.();
      window.cachePersistTrip?.(tripId);
      window.haptic?.();
      onDone();
    } catch (e) {
      setErr(e.message || 'Failed'); setBusy(false);
    }
  };
  const remove = async () => {
    if (!existing) return;
    if (!confirm(ar ? 'تحذف هذا السحب؟ (ورسومه)' : 'Remove this withdrawal (and its fee)?')) return;
    setBusy(true);
    try {
      const tripId = trip.id;
      const feeId = window.topupFeeId(existing.id);
      await window.outboxPush({ kind: 'del', expId: existing.id, tripId });
      if ((window.EXPENSES || []).some((e) => e.id === feeId)) await window.outboxPush({ kind: 'del', expId: feeId, tripId });
      window.CASH_TOPUPS = (window.CASH_TOPUPS || []).filter((e) => e.id !== existing.id);
      window.EXPENSES = (window.EXPENSES || []).filter((e) => e.id !== feeId);
      window.recomputeExpenseDerived?.(tripId);
      window.notifyDataChange?.();
      window.cachePersistTrip?.(tripId);
      onDone();
    } catch (e) { setErr(e.message || 'Failed'); setBusy(false); }
  };

  const label = { fontSize: 12.5, color: 'var(--ink-mute)', marginBottom: 6 };
  const chip = (on) => ({
    flex: 1, minWidth: 0, minHeight: 42, padding: '0 10px', borderRadius: 13, boxSizing: 'border-box',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontSize: 13, fontWeight: 600, transition: 'all 160ms', cursor: 'pointer',
    background: on ? 'var(--statement)' : 'var(--cream-2)', color: on ? 'var(--statement-fg)' : 'var(--ink-soft)',
    border: on ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
  });
  const otherDay = day !== todayKey && day !== yestKey;
  const fmtDayChip = (k) => new Date(k + 'T00:00:00').toLocaleDateString(window._dateLocale ? window._dateLocale() : (ar ? 'ar' : 'en'), { day: 'numeric', month: 'short' });
  const cardName = cards.length ? cardOf(card).label : null;

  return (
    <div style={{ padding: '4px 22px 28px' }}>
      {/* The amount — into the cash */}
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: 22, padding: '18px 20px', marginBottom: 14, color: '#fff',
        background: 'linear-gradient(135deg, #427f69 0%, #2c5d4c 46%, #1c4135 100%)',
        boxShadow: '0 14px 30px -12px rgba(28,65,53,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 6, borderRadius: 17, border: '1px solid rgba(255,255,255,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.88 }}>{ar ? 'المبلغ اللي سحبتوه' : 'Cash taken out'}</span>
          <span className="mono" style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(246,222,160,0.55)', color: '#f6e3b0', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em' }}>{inputCur}</span>
        </div>
        <window.NumberField value={groupDigits(amt)} onChange={(v) => { setAmt(v); setErr(null); }} placeholder="0" style={{
          position: 'relative', background: 'transparent', border: 'none', outline: 'none', width: '100%',
          fontFamily: 'var(--serif)', fontSize: 48, lineHeight: 1.05, color: '#fff', textAlign: 'start',
        }} />
        <div className="mono" style={{ position: 'relative', fontSize: 12.5, opacity: 0.78, marginTop: 4, minHeight: 16, direction: 'ltr', textAlign: ar ? 'right' : 'left' }}>
          {amtNum > 0 && inputCur !== home ? `≈ ${fmtH(amtUSD)}` : ''}
        </div>
      </div>

      {/* Which card */}
      {cards.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={label}>{ar ? 'من أي بطاقة؟' : 'From which card?'}</div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
            {cards.map((c) => {
              const on = card === c.id;
              const { m, label: l } = cardOf(c.id);
              return (
                <button key={c.id} onClick={() => setCard(c.id)} aria-pressed={on} style={{
                  flexShrink: 0, minWidth: 78, minHeight: 64, padding: '8px 12px', borderRadius: 14,
                  background: on ? 'var(--statement)' : 'var(--cream-2)', border: on ? 'none' : '0.5px solid var(--hairline)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 160ms',
                }}>
                  <Avatar m={m} size={26} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--statement-fg)' : 'var(--ink)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* The fee */}
      {cards.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={label}>{ar ? 'رسوم السحب (إن وجدت)' : 'Withdrawal fee (if any)'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <window.NumberField value={fee} onChange={setFee} placeholder="0" style={{
              flex: 1, minWidth: 0, padding: '13px 14px', borderRadius: 14, fontSize: 16, boxSizing: 'border-box',
              border: '0.5px solid var(--hairline)', background: 'var(--cream)', color: 'var(--ink)', outline: 'none', fontFamily: 'var(--mono)',
            }} />
            {local !== home && (
              <div role="radiogroup" aria-label={ar ? 'عملة الرسوم' : 'Fee currency'} style={{ display: 'inline-flex', padding: 3, borderRadius: 12, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', flexShrink: 0 }}>
                {[home, local].map((code) => (
                  <button key={code} role="radio" aria-checked={feeCur === code} onClick={() => setFeeCur(code)} style={{
                    minWidth: 52, minHeight: 40, padding: '0 10px', borderRadius: 9, fontSize: 13, fontWeight: 600, fontFamily: 'var(--mono)',
                    background: feeCur === code ? 'var(--sel)' : 'transparent', color: feeCur === code ? 'var(--sel-fg)' : 'var(--ink-soft)',
                  }}>{code}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 6 }}>{ar ? 'تنخصم من البطاقة وما تنضاف للكاش' : 'Comes off the card, not into the cash'}</div>
        </div>
      )}

      {/* When */}
      <div style={{ marginBottom: 14 }}>
        <div style={label}>{ar ? 'متى؟' : 'When?'}</div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[[todayKey, ar ? 'اليوم' : 'Today'], [yestKey, ar ? 'أمس' : 'Yesterday']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setDay(k)} aria-pressed={day === k} style={chip(day === k)}>{l}</button>
          ))}
          <label style={{ ...chip(otherDay), position: 'relative', flex: 1.5 }}>
            <IconCalendar size={14} stroke="currentColor" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherDay ? fmtDayChip(day) : (ar ? 'يوم آخر' : 'Another day')}</span>
            <input type="date" value={day} max={todayKey} aria-label={ar ? 'اختر اليوم' : 'Pick the day'}
              onChange={(e) => { if (e.target.value) setDay(e.target.value); }}
              onClick={(e) => { try { e.currentTarget.showPicker?.(); } catch (_) {} }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, fontSize: 16, cursor: 'pointer', border: 'none', padding: 0, margin: 0 }} />
          </label>
        </div>
      </div>

      {/* What happens */}
      {amtNum > 0 && (
        <div style={{ borderRadius: 18, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', padding: '4px 16px', marginBottom: 12 }}>
          {cards.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 0', borderBottom: '0.5px solid var(--hairline)' }}>
              <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{ar ? `يخصم من ${cardName === 'بطاقتي' ? cardName : `بطاقة ${cardName}`}` : `Off ${cardName === 'My card' ? 'my card' : `${cardName}'s card`}`}</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--clay-deep)', direction: 'ltr', whiteSpace: 'nowrap' }}>−{fmtH(amtUSD + feeUSD)}</span>
                {feeUSD > 0 && <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', direction: 'ltr', whiteSpace: 'nowrap' }}>{fmtH(amtUSD)} + {fmtH(feeUSD)}</span>}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 0', borderBottom: '0.5px solid var(--hairline)' }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{ar ? 'يضاف للكاش' : 'Into the cash'}</span>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--moss)', direction: 'ltr' }}>+{nf(toPot, potCur)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 0' }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{ar ? 'الكاش بعدها' : 'Cash after'}</span>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', direction: 'ltr' }}>{nf(leftBefore + toPot, potCur)}</span>
          </div>
        </div>
      )}

      {err && (
        <div style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 12, background: 'oklch(0.62 0.13 35 / 0.10)', border: '0.5px solid oklch(0.62 0.13 35 / 0.3)', fontSize: 12.5, color: 'var(--clay-deep)' }}>{err}</div>
      )}

      <div style={{
        display: 'flex', gap: 10, position: 'sticky', bottom: -28, zIndex: 3,
        margin: '0 -22px -28px', padding: '14px 22px 28px',
        background: 'linear-gradient(180deg, transparent 0, var(--cream) 16px)',
      }}>
        {existing && (
          <button onClick={remove} disabled={busy} style={{
            padding: '16px 18px', borderRadius: 18, background: 'var(--cream-2)', color: 'var(--clay-deep)',
            border: '0.5px solid var(--hairline-2)', fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><IconTrash size={14} stroke="currentColor" />{ar ? 'حذف' : 'Remove'}</button>
        )}
        <button onClick={save} disabled={busy} style={{
          flex: 1, padding: '16px', borderRadius: 18, border: 'none',
          background: 'linear-gradient(135deg, #3d7763 0%, #24503f 100%)', color: '#fff',
          fontSize: 15, fontWeight: 700, boxShadow: '0 8px 20px rgba(28,65,53,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {existing ? (ar ? 'حفظ التغييرات' : 'Save changes') : (ar ? 'إضافة للكاش' : 'Add to the cash')}
        </button>
      </div>
    </div>
  );
}

function CashTopupHost() {
  const [st, setSt] = React.useState({ open: false, topup: null, key: 0 });
  React.useEffect(() => {
    window.openCashTopup = (o) => setSt((s) => ({ open: true, topup: (o && o.topup) || null, card: (o && o.card) || null, key: s.key + 1 }));
    return () => { window.openCashTopup = null; };
  }, []);
  const close = React.useCallback(() => setSt((s) => ({ ...s, open: false })), []);
  const ar = window.isRTL;
  const Sheet = window.Sheet;
  if (!Sheet) return null;
  return (
    <Sheet open={st.open} onClose={close} height={0.86}
      title={st.topup ? (ar ? 'تعديل السحب' : 'Edit withdrawal') : (ar ? 'إضافة كاش' : 'Add cash')}>
      {st.key ? <CashTopupSheet key={st.key} existing={st.topup} presetCard={st.card} onDone={close} /> : null}
    </Sheet>
  );
}
window.CashTopupHost = CashTopupHost;
