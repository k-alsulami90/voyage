// Expenses — the trip's money, day by day.
//   • A short summary up top (spent, what's left, one bar split by
//     category). The details live in Analysis, one tap away.
//   • Categories and who paid filter the list; search sits in the header.
//   • Each day is one card holding its expenses — the date lives in the
//     day's header, never repeated on every row. Bookings paid before the
//     trip are one "before the trip" group.
// Tap an expense to edit or delete it.

function ScreenBudget({ go, openSheet, loading }) {
  const trip = window.TRIP;
  // Default display currency = home. Toggle switches between home and local.
  const [displayMode, setDisplayMode] = React.useState('home'); // 'home' | 'local'
  // Arriving from elsewhere (a card on Today, a day or a category in
  // Analysis): open already filtered — see window.openExpenses.
  const arrival = React.useRef(undefined);
  if (arrival.current === undefined) { arrival.current = window.__expFilter || null; window.__expFilter = null; }
  const [filter, setFilter]   = React.useState(arrival.current?.cat || 'all');    // category
  const [paidBy, setPaidBy]   = React.useState(arrival.current?.paidBy || 'all'); // member id
  const [dayFilter, setDayFilter] = React.useState(arrival.current?.day || null); // 'YYYY-MM-DD'
  const [search, setSearch]   = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  // Two views: the group's trip budget, and my own (private) budget.
  const [tab, setTabState] = React.useState(() => {
    if (arrival.current) return 'trip';
    try { return sessionStorage.getItem('voyage:expTab') || 'trip'; } catch (_) { return 'trip'; }
  });
  const setTab = (v) => {
    setTabState(v); if (v !== 'trip') { setShowSearch(false); setSearch(''); }
    try { sessionStorage.setItem('voyage:expTab', v); } catch (_) {}
  };
  // A new arrival while this screen is still mounted (back from Analysis).
  React.useEffect(() => {
    const f = window.__expFilter; if (!f) return;
    window.__expFilter = null;
    setFilter(f.cat || 'all'); setPaidBy(f.paidBy || 'all'); setDayFilter(f.day || null);
    setSearch(''); setShowSearch(false); setTab('trip');
  });

  const ar = window.isRTL;
  const searchBtn = tab === 'trip' ? (
    <button onClick={() => { setShowSearch((v) => !v); setSearch(''); }}
      aria-label={ar ? 'بحث في المصاريف' : 'Search expenses'} aria-pressed={showSearch} style={{
      width: 36, height: 36, borderRadius: 999,
      background: showSearch ? 'var(--sel)' : 'var(--cream-2)',
      border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
    }}><IconSearch size={15} stroke={showSearch ? 'var(--sel-fg)' : 'var(--ink-soft)'} /></button>
  ) : null;

  // Skeleton while this trip's data is still loading — no flash of zeros.
  const dataReady = trip && window.isTripDataReady?.(trip.id);
  if (loading || !trip || !dataReady) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('budgetNav')} onBack={() => go('hub')} />
        <ExpensesSwitch active={tab} onChange={setTab} />
        {!trip && !loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
            <div className="serif" style={{ fontSize: 18 }}>
              {ar ? 'يرجى تحديد وفتح رحلة أولاً' : 'Open a trip first'}
            </div>
          </div>
        ) : <TripSkeleton />}
      </div>
    );
  }

  const home  = trip.homeCurrency  || 'USD';
  const local = trip.localCurrency || home;
  const sameHomeLocal = home === local;
  const conv = (usd) => window.fmtMoney(usd, { in: displayMode === 'home' ? home : local });
  const alt  = sameHomeLocal ? null : (usd) => window.fmtMoney(usd, { in: displayMode === 'home' ? local : home });
  const wallets = !!window.walletsOf?.(trip);
  const members = window.MEMBERS || [];

  // What's shown: person → search → category. The chips count what's left
  // after person + search, so each chip says how many it would show.
  const expenses = window.EXPENSES || [];
  const q = search.trim().toLowerCase();
  // With cards, an expense paid in cash belongs to the cash, not to whoever logged it.
  const paidFrom = (e) => (wallets && e.cash ? 'cash' : e.who);
  const pool = expenses.filter((e) =>
    (paidBy === 'all' || paidFrom(e) === paidBy) &&
    (!dayFilter || (e.createdAt && window.localISO(e.createdAt) === dayFilter)) &&
    (!q || [e.title, e.note].some((v) => String(v || '').toLowerCase().includes(q))));
  const visible = filter === 'all' ? pool : pool.filter((e) => e.cat === filter);
  const catCount = {};
  pool.forEach((e) => { catCount[e.cat] = (catCount[e.cat] || 0) + 1; });
  const order = window.CAT_ORDER || ['culture', 'lodging', 'transit', 'food', 'shopping', 'wellness', 'misc'];
  const catKeys = [...order.filter((k) => catCount[k]), ...Object.keys(catCount).filter((k) => !order.includes(k))];
  if (filter !== 'all' && !catKeys.includes(filter)) catKeys.push(filter);
  const payers = members.filter((m) => expenses.some((e) => paidFrom(e) === m.id));
  const cashChip = wallets && expenses.some((e) => e.cash);
  const sources = payers.length + (cashChip ? 1 : 0);
  const narrowed = filter !== 'all' || !!q || !!dayFilter;
  const countWord = (n) => (ar
    ? window.arPlural(n, { zero: 'ولا مصروف', one: 'مصروف واحد', two: 'مصروفان', few: `${n} مصاريف`, many: `${n} مصروفاً`, other: `${n} مصروف` })
    : `${n} ${n === 1 ? 'expense' : 'expenses'}`);
  const clearAll = () => { setFilter('all'); setSearch(''); setShowSearch(false); setDayFilter(null); };

  // Group by day, newest first. Anything paid before the trip is one group.
  const start = trip.startDate, end = trip.endDate;
  const todayIso = window.localISO();
  const dayNum = (k) => (start && k && k >= start && (!end || k <= end))
    ? Math.round((new Date(k + 'T00:00:00') - new Date(start + 'T00:00:00')) / 86400000) + 1 : 0;
  const groups = [], before = [];
  visible.slice().sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).forEach((e) => {
    const k = e.createdAt ? window.localISO(e.createdAt) : '';
    if (start && k && k < start) { before.push({ e, k }); return; }
    const g = groups[groups.length - 1];
    if (g && g.k === k) g.items.push({ e, k }); else groups.push({ k, items: [{ e, k }] });
  });
  if (before.length) groups.push({ k: 'before', before: true, items: before });
  const dayLabel = dayFilter ? (dayNum(dayFilter) ? (ar ? `اليوم ${dayNum(dayFilter)}` : `Day ${dayNum(dayFilter)}`) : window.fmtDate(dayFilter)) : '';
  const weekday = (k) => new Date(k + 'T00:00:00').toLocaleDateString(window._dateLocale ? window._dateLocale() : (ar ? 'ar' : 'en'), { weekday: 'long' });
  const headOf = (g) => {
    if (g.before) {
      const ks = g.items.map((x) => x.k).filter(Boolean).sort();
      const one = ks[0] === ks[ks.length - 1];
      return { title: ar ? 'قبل الرحلة' : 'Before the trip', sub: one ? window.fmtDate(ks[0]) : window.fmtDateRange(ks[0], ks[ks.length - 1]), dated: !one };
    }
    if (!g.k) return { title: ar ? 'بدون تاريخ' : 'No date', sub: '' };
    const n = dayNum(g.k);
    return n
      ? { title: ar ? `اليوم ${n}` : `Day ${n}`, sub: `${weekday(g.k)} · ${window.fmtDate(g.k)}` }
      : { title: weekday(g.k), sub: window.fmtDate(g.k) };
  };

  return (
    <div data-screen-label="02 Budget" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 120 }}>
      <Header title={t('budgetNav')} onBack={() => go('hub')} action={searchBtn} />
      <ExpensesSwitch active={tab} onChange={setTab} />
      {tab === 'mine' ? <window.MyBudgetView openSheet={openSheet} /> : <>

      {showSearch && (
        <div style={{ padding: '0 18px 10px' }}>
          <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={ar ? 'ابحث باسم المصروف أو الملاحظة…' : 'Search title or note…'}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 14, boxSizing: 'border-box',
              border: '1px solid var(--hairline-2)', background: 'var(--cream-2)',
              color: 'var(--ink)', fontSize: 16, outline: 'none', textAlign: 'start',
            }} />
        </div>
      )}

      {/* The card you came from, or the trip's summary (hidden while searching
         or looking at one day) */}
      {paidBy === 'cash' ? (
        <window.CashFocus conv={conv} onClear={() => { setPaidBy('all'); setFilter('all'); }} />
      ) : paidBy !== 'all' ? (
        <window.PersonFocus key={paidBy} memberId={paidBy} conv={conv} onClear={() => { setPaidBy('all'); setFilter('all'); }} />
      ) : !showSearch && !dayFilter && (
        <window.ExpenseSummary trip={trip} expenses={expenses} conv={conv}
          onAnalysis={expenses.length ? () => go('analytics') : null}
          currencyToggle={!sameHomeLocal ? (
            <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, border: '0.5px solid rgba(255,255,255,0.1)' }}>
              {[['home', home], ['local', local]].map(([m, code]) => (
                <button key={m} onClick={() => setDisplayMode(m)} aria-pressed={displayMode === m} style={{
                  padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                  background: displayMode === m ? 'var(--statement-fg)' : 'transparent',
                  color: displayMode === m ? 'var(--statement)' : 'var(--statement-sub)',
                }}>{code}</button>
              ))}
            </div>
          ) : null} />
      )}

      {/* Filters: categories, then who paid */}
      {expenses.length > 0 && (
        <div className="no-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', padding: '10px 18px 2px' }}>
          {dayFilter && (
            <button onClick={() => { setDayFilter(null); window.haptic?.(); }} aria-label={ar ? `إلغاء فلتر ${dayLabel}` : `Clear ${dayLabel}`} style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999,
              background: 'var(--sel)', color: 'var(--sel-fg)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              <IconCalendar size={13} stroke="currentColor" />{dayLabel}<span aria-hidden="true" style={{ opacity: 0.7 }}>✕</span>
            </button>
          )}
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>{t('all')} · {pool.length}</Chip>
          {catKeys.map((k) => (
            <Chip key={k} active={filter === k} onClick={() => { setFilter(filter === k ? 'all' : k); window.haptic?.(); }}>
              {window.CAT_META?.[k]?.emoji} {window.CAT_META?.[k]?.[ar ? 'label_ar' : 'label_en'] || window.catLabel(k)} · {catCount[k] || 0}
            </Chip>
          ))}
          {sources > 1 && <span aria-hidden="true" style={{ width: 1, height: 22, background: 'var(--hairline-2)', flexShrink: 0, margin: '0 4px' }} />}
          {sources > 1 && cashChip && (() => {
            const on = paidBy === 'cash';
            return (
              <button onClick={() => { setPaidBy(on ? 'all' : 'cash'); setFilter('all'); window.haptic?.(); }} aria-pressed={on} style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 0', borderRadius: 999,
                paddingInlineStart: 5, paddingInlineEnd: 12,
                background: on ? 'var(--sel)' : 'var(--chip)', color: on ? 'var(--sel-fg)' : 'var(--ink-soft)',
                border: '0.5px solid ' + (on ? 'transparent' : 'var(--hairline)'),
                fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', minHeight: 32,
              }}>
                <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 7, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}>
                  <IconCash size={13} stroke="#fff" />
                </span>
                {ar ? 'الكاش' : 'Cash'}
              </button>
            );
          })()}
          {sources > 1 && payers.map((m) => {
            const on = paidBy === m.id;
            const first = (m.name || '').split(' ')[0];
            return (
              <button key={m.id} onClick={() => { setPaidBy(on ? 'all' : m.id); setFilter('all'); window.haptic?.(); }} aria-pressed={on} style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 0', borderRadius: 999,
                paddingInlineStart: 5, paddingInlineEnd: 12,
                background: on ? 'var(--sel)' : 'var(--chip)', color: on ? 'var(--sel-fg)' : 'var(--ink-soft)',
                border: '0.5px solid ' + (on ? 'transparent' : 'var(--hairline)'),
                fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', minHeight: 32,
              }}>
                <Avatar m={m} size={22} />
                {wallets ? (ar ? `بطاقة ${first}` : `${first}'s card`) : first}
              </button>
            );
          })}
        </div>
      )}

      {/* What the filter / search adds up to */}
      {narrowed && visible.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px 0', fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{countWord(visible.length)}</span>
          <span style={{ color: 'var(--ink-mute)' }}>·</span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{conv(visible.reduce((s, e) => s + (e.usd || 0), 0))}</span>
          <span style={{ flex: 1 }} />
          <button onClick={clearAll} style={{
            minHeight: 30, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
          }}>{ar ? 'مسح ✕' : 'Clear ✕'}</button>
        </div>
      )}

      {/* Empty — nothing logged yet */}
      {expenses.length === 0 && (
        <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><IconWallet size={28} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
            {ar ? 'ما فيه مصاريف بعد' : 'No expenses yet'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 260, lineHeight: 1.5 }}>
            {ar ? 'سجّل أول مصروف، والأرقام والتحليل تتحدث لحالها.' : 'Log the first one — the numbers update by themselves.'}
          </div>
          <button onClick={() => openSheet?.('addExpense')} style={{
            marginTop: 6, minHeight: 46, padding: '0 22px', borderRadius: 14,
            background: 'var(--clay)', color: '#fff', fontSize: 14, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 6px 14px oklch(0.62 0.13 35 / 0.35)',
          }}>
            <IconPlus size={14} stroke="currentColor" />
            {ar ? 'أضف أول مصروف' : 'Add the first expense'}
          </button>
        </div>
      )}

      {/* Empty — the filter / search found nothing */}
      {expenses.length > 0 && visible.length === 0 && (
        <div style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--cream-2)', fontSize: 22,
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}>{filter !== 'all' && !q ? (window.CAT_META?.[filter]?.emoji || '•') : <IconSearch size={20} stroke="var(--ink-mute)" />}</div>
          <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>
            {q ? (ar ? 'ما لقينا شي بهذا البحث' : 'Nothing matches')
              : dayFilter && filter === 'all' ? (ar ? `ما فيه مصاريف في ${dayLabel}` : `Nothing on ${dayLabel}`)
              : (ar ? 'ما فيه مصاريف هنا' : 'Nothing here')}
          </div>
          <button onClick={() => { clearAll(); setPaidBy('all'); }} style={{
            minHeight: 38, padding: '0 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
          }}>{ar ? 'كل المصاريف' : 'Show all'}</button>
        </div>
      )}

      {/* The days */}
      {groups.map((g) => {
        const h = headOf(g);
        const sum = g.items.reduce((s, x) => s + (x.e.usd || 0), 0);
        return (
          <ExpDay key={g.k || 'nodate'} title={h.title} sub={h.sub}
            pill={g.k === todayIso && window.HubPill ? <window.HubPill tone="good">{ar ? 'اليوم' : 'Today'}</window.HubPill> : null}
            total={g.items.length > 1 && !(narrowed && groups.length === 1) ? conv(sum) : null}>
            {g.items.map((x, i) => (
              <ExpRow key={x.e.id} e={x.e} first={i === 0} conv={conv} alt={alt} wallets={wallets}
                dateLabel={h.dated ? window.fmtDate(x.k) : null}
                onOpen={() => openSheet?.('editExpense', x.e)} />
            ))}
          </ExpDay>
        );
      })}

      {/* Activity log — collapsed by default */}
      {(window.AUDIT || []).length > 0 && !narrowed && paidBy === 'all' && window.HubSection && (
        <window.HubSection title={t('auditLog')}>
          <AuditLogPanel entries={window.AUDIT} />
        </window.HubSection>
      )}
      </>}
    </div>
  );
}

// One day: its name and date once, then its expenses in one card.
function ExpDay({ title, sub, pill, total, children }) {
  return (
    <section style={{ padding: '22px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 9px', minWidth: 0 }}>
        <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0 }}>{title}</span>
        {sub && <span style={{ fontSize: 12.5, color: 'var(--ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{sub}</span>}
        {pill}
        <span style={{ flex: 1 }} />
        {total && <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', flexShrink: 0 }}>{total}</span>}
      </div>
      <div className="v-list" style={{
        background: 'var(--cream-2)', borderRadius: 22, border: '0.5px solid var(--hairline)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>{children}</div>
    </section>
  );
}

// One expense: category tile · title · whose card · amount.
// `meta` (optional) replaces whose card / who paid — e.g. the category on
// a list of your own personal expenses.
function ExpRow({ e, first, conv, alt, wallets, dateLabel, onOpen, meta }) {
  const ar = window.isRTL;
  const m = (window.MEMBERS || []).find((x) => x.id === e.who) || { name: '—', hue: 200, initials: '?' };
  const firstName = (m.name || '').split(' ')[0];
  const color = (window.CATEGORIES || []).find((c) => c.key === e.cat)?.color || 'var(--cat-misc)';
  const paidCash = wallets && e.cash;
  const who = paidCash ? (ar ? 'كاش' : 'Cash') : wallets ? (ar ? `بطاقة ${firstName}` : `${firstName}'s card`) : firstName;
  const pending = String(e.id).startsWith('temp-');
  const isPdf = e.receiptUrl && window.isPdfPath?.(e.receiptPath);
  return (
    <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(ev) => { if (ev.key === 'Enter') onOpen(); }}
      aria-label={ar ? `تعديل ${e.title}، ${conv(e.usd)}` : `Edit ${e.title}, ${conv(e.usd)}`}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', cursor: 'pointer' }}>
      <span style={{
        width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: color,
        display: 'grid', placeItems: 'center', fontSize: 18, lineHeight: 1,
      }}>{window.CAT_META?.[e.cat]?.emoji || '💸'}</span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: first ? 'none' : '0.5px solid var(--hairline)' }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
            {pending && (
              <span style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 999,
                background: 'oklch(0.78 0.13 80 / 0.18)', color: 'var(--honey)', fontSize: 10, fontWeight: 700,
              }}><IconClock size={9} stroke="currentColor" />{ar ? 'بانتظار المزامنة' : 'Pending'}</span>
            )}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 3, minWidth: 0 }}>
            {meta != null ? null : paidCash
              ? <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}><IconCash size={10} stroke="#fff" sw={2} /></span>
              : <Avatar m={m} size={14} />}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{[meta != null ? meta : who, dateLabel, e.note].filter(Boolean).join(' · ')}</span>
          </span>
        </span>
        {e.receiptUrl && (isPdf ? (
          <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer" onClick={(ev) => ev.stopPropagation()}
            aria-label={ar ? 'الإيصال' : 'Receipt'} style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center',
            background: 'var(--clay)', color: '#fff', fontSize: 9, fontWeight: 700, textDecoration: 'none',
          }}>PDF</a>
        ) : (
          <img src={e.receiptUrl} alt={ar ? 'الإيصال' : 'Receipt'}
            onClick={(ev) => { ev.stopPropagation(); window.openImageOverlay?.(e.receiptUrl); }}
            style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 8, border: '0.5px solid var(--hairline)', flexShrink: 0, cursor: 'zoom-in' }} />
        ))}
        <span style={{ textAlign: 'end', flexShrink: 0 }}>
          <span className="mono" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{conv(e.usd)}</span>
          {alt && <span className="mono" style={{ display: 'block', fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>{alt(e.usd)}</span>}
        </span>
      </span>
    </div>
  );
}

// Collapsed audit log — shows just the latest entry as a short bar. Tap
// to expand and see the full list.
function AuditLogPanel({ entries }) {
  const [open, setOpen] = React.useState(false);
  const list = entries || [];
  const latest = list[0];
  const m = latest && (window.MEMBERS || []).find((x) => x.id === latest.who);

  return (
    <div style={{
      background: 'var(--cream-2)', borderRadius: 22,
      border: '0.5px solid var(--hairline)',
      overflow: 'hidden',
    }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row',
      }}>
        {latest && m ? <Avatar m={m} size={22} /> : (
          <div style={{
            width: 22, height: 22, borderRadius: 999, background: 'var(--cream)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><IconClock size={11} stroke="var(--ink-mute)" /></div>
        )}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
          {latest ? (
            <>
              <div style={{
                fontSize: 12.5, color: 'var(--ink-soft)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{(m?.name || '—').split(' ')[0]}</span>
                <span style={{ color: 'var(--ink-mute)' }}> {latest.action} </span>
                <span style={{ fontWeight: 500 }}>{latest.target}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 1 }}>
                {window.isRTL
                  ? window.arPlural(list.length, {
                      zero: 'لا توجد عمليات', one: 'عملية واحدة', two: 'عمليتان',
                      few: `${list.length} عمليات`,
                      many: `${list.length} عملية`,
                      other: `${list.length} من العمليات`,
                    })
                  : `${list.length} ${list.length === 1 ? 'entry' : 'entries'}`}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>
              {window.isRTL ? 'لا يوجد سجل بعد' : 'No activity yet'}
            </div>
          )}
        </div>
        <span style={{
          color: 'var(--ink-mute)',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 200ms',
        }} className="icon-flip">
          <IconChevron size={13} stroke="currentColor" />
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 12px', borderTop: '0.5px solid var(--hairline)' }}>
          {list.slice(1).map((a) => {
            const am = (window.MEMBERS || []).find((x) => x.id === a.who);
            return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                flexDirection: 'row',
                padding: '8px 0',
                borderTop: '0.5px solid var(--hairline)',
              }}>
                <Avatar m={am} size={22} />
                <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)', textAlign: 'start' }}>
                  <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{(am?.name || '—').split(' ')[0]}</span>
                  <span style={{ color: 'var(--ink-mute)' }}> {a.action} </span>
                  <span style={{ fontWeight: 500 }}>{a.target}</span>
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{a.when}</div>
              </div>
            );
          })}
          {list.length === 1 && (
            <div style={{
              padding: '10px 0 0', fontSize: 11.5, color: 'var(--ink-mute)', textAlign: 'center',
            }}>{window.isRTL ? 'هذا كل النشاط' : "That's all the activity"}</div>
          )}
        </div>
      )}
    </div>
  );
}

// Shared header for sub-screens
function Header({ title, onBack, action }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 14px',
      background: 'linear-gradient(180deg, var(--cream) 85%, transparent)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexDirection: 'row',
    }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 999,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        display: 'grid', placeItems: 'center', color: 'var(--ink)',
      }}>
        <span className="icon-flip"><IconBack size={17} /></span>
      </button>
      <div className="serif" style={{
        fontSize: 22, color: 'var(--ink)',
        flex: 1, textAlign: 'center', minWidth: 0,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        padding: '0 8px',
      }}>{title}</div>
      <div style={{
        minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        flexShrink: 0, gap: 8, flexDirection: 'row',
      }}>
        {action || <span style={{ width: 36 }} aria-hidden="true" />}
      </div>
    </div>
  );
}

// Expenses = one tab with two views: the list (budget) and the analysis.
// The "+" in the tab bar adds expenses, so neither view needs its own.
function ExpensesSwitch({ active, onChange }) {
  const opts = [
    { k: 'trip', l: window.isRTL ? 'الرحلة' : 'Trip' },
    { k: 'mine', l: window.isRTL ? '🔒 ميزانيتي' : '🔒 My budget' },
  ];
  return (
    <div style={{ padding: '0 22px 12px' }}>
      <div style={{
        display: 'flex', padding: 3, borderRadius: 14,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      }}>
        {opts.map((o) => (
          <button key={o.k} onClick={() => o.k !== active && onChange?.(o.k)} aria-current={o.k === active ? 'page' : undefined} style={{
            flex: 1, minHeight: 40, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
            background: o.k === active ? 'var(--sel)' : 'transparent',
            color: o.k === active ? 'var(--sel-fg)' : 'var(--ink-soft)',
            transition: 'background 180ms, color 180ms',
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenBudget, Header, ExpensesSwitch, ExpRow, ExpDay });
