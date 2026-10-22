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
        : <Stat key="a" label={ar ? 'صرفتوا من البطاقات' : 'Spent on cards'} value={fmtC(b.spentUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
      <Stat key="b" label={ar ? 'باقي للرحلة' : 'Left for the trip'} value={fmtC(b.leftUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
    ];
  } else if (before) {
    stats = [
      <Stat key="a" label={ar ? 'مجموع البطاقات' : 'On the cards'} value={fmtC(b.totalUSD)} sub={cardsWord(b.cards.length)} />,
      <Stat key="b" label={ar ? 'مدة الرحلة' : 'Trip length'} value={daysWord(b.totalDays)} sub={trip.startDate ? (ar ? `تبدأ ${window.fmtDate(trip.startDate)}` : `from ${window.fmtDate(trip.startDate)}`) : ''} />,
    ];
  } else {
    stats = [
      <Stat key="a" label={ar ? 'صرفتوا من البطاقات' : 'Spent on cards'} value={fmtC(b.spentUSD)} sub={ar ? `من ${fmtC(b.totalUSD)}` : `of ${fmtC(b.totalUSD)}`} />,
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

      {/* The group's cards — physical 3D cards: swipe or tap to flip through */}
      <Section title={ar ? 'البطاقات' : 'Cards'} sub={cardsWord(b.cards.length)} action={ar ? 'إدارة' : 'Manage'} onAction={onManage}>
        <window.WalletCarousel cards={b.cards} members={members} fmt={fmtC} onOpenCard={(id) => window.openCardExpenses(id)} />
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

  // Only offer "Save" when something actually changed.
  const snap = (en, cs) => JSON.stringify([!!en, Object.keys(cs).sort().map((k) => [k, Math.round(parseFloat(cs[k]) || 0)])]);
  const savedCards = {};
  (raw.cards || []).forEach((c) => { savedCards[c.user_id] = String(Math.round((parseFloat(c.amount_usd) || 0) * rate)); });
  const dirty = snap(enabled, cards) !== snap(raw.enabled, savedCards);

  return (
    <SetGroup title={ar ? 'البطاقات والميزانية اليومية' : 'Cards & daily budget'}
      footer={ar ? 'من البطاقات يحسب التطبيق كم باقي لكم كل يوم، وكم باقي في كل بطاقة.' : 'From the cards the app works out what you can spend each day and what is left on each card.'}>
      <SetRow icon={<IconCard size={16} stroke="#fff" />} tint={SET_TINT.teal}
        label={ar ? 'نصرف من بطاقات محددة' : 'We spend from set cards'}
        sub={ar ? 'تعرفون كم باقي في كل بطاقة، وكم تقدرون تصرفون اليوم' : 'See what is left on each card and what you can spend today'}
        right={<SetSwitch on={enabled} onChange={(v) => setEnabled(v)} label={ar ? 'البطاقات' : 'Cards'} />} />

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
        <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', margin: '4px 0 6px' }}><window.CountUp id={'mycost-' + (window.TRIP?.id || '')} value={total} format={fmtC} /></div>
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

Object.assign(window, { TodayBudgetCard, WalletsSetup, MyTripCostCard, TripPaceCard, PersonalLimitCard, MyBudgetView, UnpaidBookingsNote });

// ── Card → its expenses ────────────────────────────────────────────────
window.openCardExpenses = (memberId) => {
  window.__expFilter = { paidBy: memberId };
  const tid = window.TRIP?.id;
  if (tid) window.navigateRoute?.({ scope: 'trip', name: 'budget', tripId: tid });
};

// Expenses filtered to one person/card: their card up top, three figures,
// and a way back to everyone. (The category chips under it narrow the list.)
function PersonFocus({ memberId, conv, onClear }) {
  const ar = window.isRTL;
  const trip = window.TRIP;
  const m = (window.MEMBERS || []).find((x) => x.id === memberId) || { id: memberId, name: '?', hue: 200 };
  const first = (m.name || '').split(' ')[0];
  const mine = (window.EXPENSES || []).filter((e) => e.who === memberId);
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
    </div>
  );
}
window.PersonFocus = PersonFocus;
