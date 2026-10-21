// Budget screen — donut chart, currency toggle, expense list with swipe + audit log

function ScreenBudget({ go, openSheet, loading }) {
  const heroTilt = window.useTiltRef({ max: 5 });
  const catRow = window.useDepthRowRef({ rot: 24 });
  const trip = window.TRIP;
  // Default display currency = home. Toggle switches between home and local.
  const [displayMode, setDisplayMode] = React.useState('home'); // 'home' | 'local'
  // Arriving from a card on Today: open filtered to that person's card.
  const arrival = React.useRef(undefined);
  if (arrival.current === undefined) { arrival.current = window.__expFilter || null; window.__expFilter = null; }
  const [filter, setFilter]   = React.useState('all');     // category
  const [paidBy, setPaidBy]   = React.useState(arrival.current?.paidBy || 'all');     // member.id or 'all'
  const [dayFilter, setDayFilter] = React.useState('all'); // 'all' | day number
  const [search, setSearch]   = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  // Two views: the group's trip budget, and my own (private) budget.
  const [tab, setTabState] = React.useState(() => {
    if (arrival.current?.paidBy) return 'trip';
    try { return sessionStorage.getItem('voyage:expTab') || 'trip'; } catch (_) { return 'trip'; }
  });
  const setTab = (v) => { setTabState(v); try { sessionStorage.setItem('voyage:expTab', v); } catch (_) {} };
  const cats = window.CATEGORIES || [];

  // Compute "day N" for each expense relative to trip start date
  const tripStart = trip?.startDate ? new Date(trip.startDate) : null;
  const dayOf = (createdAt) => {
    if (!tripStart || !createdAt) return 0;
    const diff = Math.floor((new Date(createdAt) - tripStart) / 86400000) + 1;
    return Math.max(1, Math.min(diff, trip?.daysTotal || 30));
  };
  const daysAvailable = trip?.daysTotal ? Array.from({ length: trip.daysTotal }, (_, i) => i + 1) : [];

  // Pre-filtered list — reused by both the empty-state and the rows below
  const filteredExpenses = (window.EXPENSES || []).filter((e) =>
    (filter === 'all' || e.cat === filter) &&
    (paidBy === 'all' || e.who === paidBy) &&
    (dayFilter === 'all' || dayOf(e.createdAt) === dayFilter) &&
    (!search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.note?.toLowerCase().includes(search.toLowerCase()))
  );

  // Show skeleton while data is still loading for this trip — prevents the
  // 'flash of zeros' before real numbers arrive.
  const dataReady = trip && window.isTripDataReady?.(trip.id);
  if (loading || !trip || !dataReady) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('budgetNav')} onBack={() => go('hub')} />
        <ExpensesSwitch active={tab} onChange={setTab} />
        {!trip && !loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
            <div className="serif" style={{ fontSize: 18 }}>
              {window.isRTL ? 'يرجى تحديد وفتح رحلة أولاً' : 'Open a trip first'}
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

  // Live totals from real expenses (in USD base)
  const expenses = window.EXPENSES || [];
  const realSpent = expenses.reduce((s, e) => s + (e.usd || 0), 0);
  const planned = trip.budget?.plannedUSD || 0;
  const remaining = planned - realSpent;
  const overBudget = planned > 0 && realSpent > planned;
  const overPct = planned > 0 ? Math.round(((realSpent - planned) / planned) * 100) : 0;

  // Donut math
  const R = 64, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div data-screen-label="02 Budget" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
      {/* Header — the travel analysis opens from the chart icon */}
      <Header title={t('budgetNav')} onBack={() => go('hub')} action={
        <button onClick={() => go('analytics')} aria-label={window.isRTL ? 'تحليل السفر' : 'Travel analysis'} style={{
          height: 36, padding: '0 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--ink)', color: 'var(--cream)', fontSize: 12.5, fontWeight: 600,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
          {window.isRTL ? 'التحليل' : 'Analysis'}
        </button>
      } />
      <ExpensesSwitch active={tab} onChange={setTab} />
      {tab === 'mine' ? <window.MyBudgetView openSheet={openSheet} /> : <>

      {/* OVER-BUDGET ALERT — matches the v72 Hub treatment.
         Was a full clay gradient surface, the loud SaaS-alert pattern.
         Now: a restrained clay-tinted card with hairline, small icon
         chip, and inline body sentence. Still unmistakably "alert,"
         but no longer competing with the statement card below for
         the same eye. */}
      {overBudget && (
        <div style={{ padding: '4px 14px 0' }}>
          <div style={{
            borderRadius: 14, padding: '12px 14px',
            background: 'oklch(0.62 0.13 35 / 0.10)',
            border: '0.5px solid oklch(0.62 0.13 35 / 0.30)',
            display: 'flex', alignItems: 'center', gap: 10,
            flexDirection: 'row',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'var(--clay)', color: '#fff',
              display: 'grid', placeItems: 'center', fontSize: 14, lineHeight: 1,
            }}>⚠</div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--clay-deep)' }}>
              {window.isRTL ? (
                <>تجاوزت الميزانية بمقدار <strong>{conv(realSpent - planned)}</strong> (أي بنسبة {overPct}٪ فوق الخطة المحددة).</>
              ) : (
                <>Over budget by <strong>{conv(realSpent - planned)}</strong> ({overPct}% above plan).</>
              )}
            </div>
          </div>
        </div>
      )}

      {paidBy !== 'all' ? (
        <window.PersonFocus memberId={paidBy} conv={conv} onClear={() => { setPaidBy('all'); setFilter('all'); }}
          activeCat={filter} onPickCat={setFilter} />
      ) : (<>
      {/* One summary: spent, budget meter split by category (tap to filter), pace */}
      <window.ExpenseSummary trip={trip} expenses={expenses} conv={conv} activeCat={filter} onPickCat={setFilter}
        currencyToggle={!sameHomeLocal ? (
          <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, border: '0.5px solid rgba(255,255,255,0.1)' }}>
            {[['home', home], ['local', local]].map(([m, code]) => (
              <button key={m} onClick={() => setDisplayMode(m)} style={{
                padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                background: displayMode === m ? 'var(--cream)' : 'transparent',
                color: displayMode === m ? 'var(--ink)' : 'var(--cream)',
              }}>{code}</button>
            ))}
          </div>
        ) : null} />
      </>)}

      {/* FILTER + LIST */}
      <div style={{ padding: '18px 14px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexDirection: 'row',
          padding: '0 8px 10px',
        }}>
          <div className="serif" style={{ fontSize: 22 }}>{t('expenses')}</div>
          <div style={{ display: 'flex', gap: 5, flexDirection: 'row' }}>
            {/* Was 30x30, below iOS thumb-zone floor and inconsistent with
               the 36x36 header buttons. Now 38x38 to match the v69 Trips
               home fix; aria-label added for screen reader support. */}
            <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }}
              aria-label={window.isRTL ? 'بحث في المصروفات' : 'Search expenses'} style={{
              width: 38, height: 38, borderRadius: 12,
              background: showSearch ? 'var(--ink)' : 'var(--cream-2)',
              border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
              flexShrink: 0,
            }}><IconSearch size={16} stroke={showSearch ? 'var(--cream)' : 'var(--ink-soft)'} /></button>
          </div>
        </div>

        {showSearch && (
          <div style={{ padding: '0 8px 10px' }}>
            <input
              autoFocus
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={window.isRTL ? 'ابحث في المصروفات...' : 'Search expenses...'}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--clay)', background: 'var(--cream)',
                color: 'var(--ink)', fontSize: 13.5, outline: 'none',
                textAlign: 'start',
              }}
            />
          </div>
        )}

        {/* Active category (picked in the summary) + filters */}
        <div style={{ display: 'flex', gap: 6, padding: '0 4px 10px', flexDirection: 'row', alignItems: 'center' }}>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999,
              background: 'var(--ink)', color: 'var(--cream)', fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: `var(--cat-${filter})` }} />{t(filter) || filter} ✕
            </button>
          )}
          <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>
            {window.isRTL ? `${filteredExpenses.length} مصروف` : `${filteredExpenses.length} expenses`}
          </span>
          <div style={{ flex: 1 }} />
          {/* Was a Unicode "⚙" dingbat that rendered inconsistently
             across platforms (filled vs outlined, weight, even color
             on emoji-rendering systems). Now uses IconFilter from the
             SVG icon set, matching every other icon on the screen. */}
          <button onClick={() => setShowFilters(!showFilters)} style={{
            flexShrink: 0, padding: '6px 12px 6px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 500,
            background: showFilters || paidBy !== 'all' || dayFilter !== 'all' ? 'var(--ink)' : 'var(--cream-2)',
            color: showFilters || paidBy !== 'all' || dayFilter !== 'all' ? 'var(--cream)' : 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <IconFilter size={12} stroke="currentColor" />
            {window.isRTL ? 'تصفية' : 'Filters'}
            {(paidBy !== 'all' || dayFilter !== 'all') && (
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--clay)' }} />
            )}
          </button>
        </div>

        {/* Expanded filters: Day + Paid by */}
        {showFilters && (
          <div style={{
            margin: '0 4px 12px', padding: '12px 14px', borderRadius: 16,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {/* Paid by row */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                {window.isRTL ? 'دُفع بواسطة' : 'Paid by'}
              </div>
              <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', flexDirection: 'row' }}>
                <Chip active={paidBy === 'all'} onClick={() => setPaidBy('all')}>{t('all')}</Chip>
                {(window.MEMBERS || []).map((m) => (
                  <Chip key={m.id} active={paidBy === m.id} onClick={() => setPaidBy(m.id)}>
                    {m.name.split(' ')[0]}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Day row */}
            {daysAvailable.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
                  {window.isRTL ? 'اليوم المحدد' : 'Day'}
                </div>
                <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', flexDirection: 'row' }}>
                  <Chip active={dayFilter === 'all'} onClick={() => setDayFilter('all')}>{t('all')}</Chip>
                  {daysAvailable.map((d) => (
                    <Chip key={d} active={dayFilter === d} onClick={() => setDayFilter(d)}>
                      {window.isRTL ? `يوم ${d}` : `Day ${d}`}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Clear filters */}
            {(paidBy !== 'all' || dayFilter !== 'all' || filter !== 'all') && (
              <button onClick={() => { setPaidBy('all'); setDayFilter('all'); setFilter('all'); }} style={{
                alignSelf: 'flex-start', padding: '6px 12px', borderRadius: 999, fontSize: 11.5,
                background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
              }}>
                {window.isRTL ? 'مسح التصفية' : 'Clear filters'}
              </button>
            )}
          </div>
        )}

        {/* Filter summary — totals + count for whatever's currently filtered */}
        {(dayFilter !== 'all' || (filter !== 'all' && paidBy === 'all') || search)
          && filteredExpenses.length > 0 && (() => {
          const total = filteredExpenses.reduce((s, e) => s + (e.usd || 0), 0);
          const labels = [];
          if (filter !== 'all') {
            const c = cats.find((x) => x.key === filter);
            labels.push(c?.label || filter);
          }
          if (paidBy !== 'all') {
            const m = (window.MEMBERS || []).find((x) => x.id === paidBy);
            if (m) labels.push(`${window.isRTL ? 'دُفعت بواسطة' : 'paid by'} ${m.name.split(' ')[0]}`);
          }
          if (dayFilter !== 'all') {
            labels.push(`${window.isRTL ? 'يوم' : 'Day'} ${dayFilter}`);
          }
          if (search) labels.push(`"${search}"`);
          return (
            <div style={{
              margin: '0 4px 8px', padding: '12px 14px', borderRadius: 16,
              background: 'var(--statement)', color: 'var(--statement-fg)',
              border: '0.5px solid var(--hairline-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexDirection: 'row', gap: 12,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: 'var(--statement-fg)',
                }}>
                  {window.isRTL
                    ? window.arPlural(filteredExpenses.length, {
                        zero: 'لا توجد مصروفات', one: 'مصروف واحد', two: 'مصروفان',
                        few: `${filteredExpenses.length} مصروفات`,
                        many: `${filteredExpenses.length} مصروفاً`,
                        other: `${filteredExpenses.length} مصروف`,
                      })
                    : `${filteredExpenses.length} ${filteredExpenses.length === 1 ? 'expense' : 'expenses'}`}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 3, opacity: 0.78,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{labels.join(' · ')}</div>
              </div>
              <div className="mono" style={{
                fontSize: 18, fontWeight: 600, flexShrink: 0,
              }}>{window.fmtMoney(total, { in: 'home' })}</div>
            </div>
          );
        })()}

        {/* Empty state — no expenses at all */}
        {window.EXPENSES.length === 0 && (
          <div style={{
            padding: '40px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><IconWallet size={28} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
              {window.isRTL ? 'لا توجد مصروفات مسجلة لهذه الرحلة بعد' : 'No expenses yet'}
            </div>
            <div style={{
              fontSize: 13, color: 'var(--ink-mute)',
              maxWidth: 260, lineHeight: 1.5,
            }}>
              {window.isRTL
                ? 'تتبَّع كل ما تصرفه في الرحلة — تظهر الإحصائيات تلقائياً'
                : 'Track every expense — stats and charts update automatically.'}
            </div>
            <button onClick={() => openSheet?.('addExpense')} style={{
              marginTop: 6, padding: '12px 22px', borderRadius: 14,
              background: 'var(--clay)', color: '#fff',
              fontSize: 13.5, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8, flexDirection: 'row',
              boxShadow: '0 6px 14px oklch(0.62 0.13 35 / 0.35)',
            }}>
              <IconPlus size={14} stroke="currentColor" />
              {window.isRTL ? 'أضف أول مصروف' : 'Add first expense'}
            </button>
          </div>
        )}
        {/* Filter narrowed to zero results */}
        {window.EXPENSES.length > 0 && filteredExpenses.length === 0 && (
          <div style={{
            padding: '28px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><IconSearch size={18} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 16, color: 'var(--ink)' }}>
              {window.isRTL ? 'لا توجد نتائج تطابق خيارات التصفية' : 'No matching expenses'}
            </div>
            <button onClick={() => { setFilter('all'); setPaidBy('all'); setDayFilter('all'); setSearch(''); }} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
            }}>{window.isRTL ? 'إعادة تعيين الفلاتر' : 'Show all'}</button>
          </div>
        )}

        {/* Expense rows — swipeable with delete */}
        <div className="v-list" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 4px' }}>
          {(() => {
            const groups = [];
            filteredExpenses.slice().sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || ''))).forEach((e) => {
              const k = e.createdAt ? window.localISO(e.createdAt) : '';
              const g = groups[groups.length - 1];
              if (g && g.k === k) g.items.push(e); else groups.push({ k, items: [e] });
            });
            return groups;
          })().flatMap((g) => [
            <div key={'day-' + g.k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '10px 6px 2px' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}>
                {g.k ? new Date(g.k + 'T00:00:00').toLocaleDateString(window.isRTL ? 'ar' : 'en', { weekday: 'long' }) + ' · ' + window.fmtDate(g.k) : ''}
                {g.k && dayOf(g.k + 'T12:00:00') > 0 && trip.startDate && g.k >= trip.startDate ? <span style={{ fontWeight: 500, color: 'var(--ink-mute)' }}>{window.isRTL ? ` · يوم ${dayOf(g.k + 'T12:00:00')}` : ` · Day ${dayOf(g.k + 'T12:00:00')}`}</span> : null}
              </span>
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}>{conv(g.items.reduce((s2, x) => s2 + (x.usd || 0), 0))}</span>
            </div>,
            ...g.items.map((e) => {
            const m = window.MEMBERS.find((x) => x.id === e.who) || { name: 'Unknown', hue: 200, initials: '?' };
            const c = cats.find((x) => x.key === e.cat) || { color: 'var(--ink-mute)' };
            const localAmt = e.jpy > 0 ? `¥${e.jpy.toLocaleString()}` : null;
            return (
              <SwipeRow key={e.id}
                actions={[
                  { key: 'delete', bg: 'var(--clay)', icon: <IconTrash size={18} stroke="#fff" /> },
                ]}
                onAction={async (key) => {
                  if (key !== 'delete') return;
                  if (!confirm(window.isRTL ? `هل تريد حذف "${e.title}"؟` : `Delete "${e.title}"?`)) return;
                  try {
                    await window.deleteExpense(e.id, trip.id);
                    await window.loadExpenses(trip.id);
                    window.toast?.(window.isRTL ? 'تم الحذف بنجاح' : 'Deleted', 'success');
                  } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
                }}>
                <div onClick={() => openSheet?.('editExpense', e)} style={{
                  background: 'var(--cream-2)', borderRadius: 18, cursor: 'pointer',
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  flexDirection: 'row',
                  border: '0.5px solid var(--hairline)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      flexDirection: 'row',
                    }}>
                      {/* Category dot replaces the banned side-stripe.
                         Same information, no decorative left-border. */}
                      <span style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: c.color, flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{e.title}</span>
                      {/* Queued offline — not yet synced to the server. */}
                      {String(e.id).startsWith('temp-') && (
                        <span style={{
                          flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 7px', borderRadius: 999,
                          background: 'oklch(0.78 0.13 80 / 0.18)', color: 'var(--honey)',
                          fontSize: 9.5, fontWeight: 700,
                        }}>
                          <IconClock size={9} stroke="currentColor" />
                          {window.isRTL ? 'بانتظار المزامنة' : 'Pending'}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 4,
                      display: 'flex', alignItems: 'center', gap: 6,
                      flexDirection: 'row', paddingInlineStart: 16,
                    }}>
                      <Avatar m={m} size={15} />
                      <span>{window.walletsOf?.(window.TRIP) ? (window.isRTL ? `بطاقة ${m.name.split(' ')[0]}` : `${m.name.split(' ')[0]}'s card`) : m.name.split(' ')[0]} · {e.when}</span>
                      {e.note && <span style={{ opacity: 0.7 }}>· {e.note}</span>}
                    </div>
                    {/* Split badge — show on shared expenses */}
                    {window.SHOW_SPLIT && !window.walletsOf?.(window.TRIP) && (e.splitWith && e.splitWith.length > 0) && (() => {
                      const totalSharers = e.splitWith.length + 1;
                      const userIsInSplit = e.who === window.currentUserId
                        || e.splitWith.includes(window.currentUserId);
                      const yourShare = userIsInSplit ? (e.usd || 0) / totalSharers : 0;
                      return (
                        <div style={{
                          fontSize: 10.5, color: 'var(--moss)', marginTop: 4,
                          fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5,
                          flexDirection: 'row',
                        }}>
                          <span style={{
                            padding: '2px 6px', borderRadius: 999,
                            background: 'oklch(0.50 0.08 155 / 0.12)',
                            fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.06em',
                          }}>÷{totalSharers}</span>
                          {userIsInSplit && (
                            <span>{t('splitYourShare')}: <strong>{conv(yourShare)}</strong></span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  {e.receiptUrl && window.isPdfPath?.(e.receiptPath) && (
                    <a href={e.receiptUrl} target="_blank" rel="noopener noreferrer"
                      onClick={(ev) => ev.stopPropagation()} style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center',
                        background: 'var(--clay)', color: '#fff', fontSize: 9.5, fontWeight: 700, textDecoration: 'none',
                      }}>PDF</a>
                  )}
                  {e.receiptUrl && !window.isPdfPath?.(e.receiptPath) && (
                    <img
                      src={e.receiptUrl}
                      alt="receipt"
                      onClick={(ev) => { ev.stopPropagation(); window.openImageOverlay?.(e.receiptUrl); }}
                      style={{
                        width: 32, height: 32, objectFit: 'cover',
                        borderRadius: 8, border: '0.5px solid var(--hairline)',
                        flexShrink: 0, cursor: 'zoom-in',
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'end' }}>
                    <div className="mono" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                      {conv(e.usd)}
                    </div>
                    {!sameHomeLocal && (
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
                        {window.fmtMoney(e.usd, { in: displayMode === 'home' ? local : home })}
                      </div>
                    )}
                  </div>
                </div>
              </SwipeRow>
            );
          })])}
        </div>
      </div>

      {/* AUDIT LOG — collapsed by default, expand on tap */}
      {(window.AUDIT || []).length > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{t('auditLog')}</SectionLabel>
          <AuditLogPanel entries={window.AUDIT} />
        </div>
      )}
      </>}
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
      margin: '0 8px', border: '0.5px solid var(--hairline)',
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
        {action || <IconMore size={18} stroke="var(--ink-soft)" />}
      </div>
    </div>
  );
}

// Inline emphasis for money numbers inside the editorial sentence on the
// statement card. Mono for tabular alignment, semibold for emphasis;
// `dim` softens the "of $X planned" reference number so the spent
// number reads as the primary one without size escalation.
function BudgetNum({ children, dim }) {
  return (
    <span className="mono" style={{
      fontWeight: dim ? 500 : 700,
      fontSize: '1.18em',
      color: dim ? 'rgba(255,251,244,0.55)' : 'var(--statement-fg)',
      letterSpacing: '-0.01em',
    }}>{children}</span>
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
            background: o.k === active ? 'var(--ink)' : 'transparent',
            color: o.k === active ? 'var(--cream)' : 'var(--ink-soft)',
            transition: 'background 180ms, color 180ms',
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenBudget, Header, ExpensesSwitch });
