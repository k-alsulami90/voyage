// Budget screen — donut chart, currency toggle, expense list with swipe + audit log

function ScreenBudget({ go, openSheet, loading }) {
  const trip = window.TRIP;
  // Default display currency = home. Toggle switches between home and local.
  const [displayMode, setDisplayMode] = React.useState('home'); // 'home' | 'local'
  const [filter, setFilter]   = React.useState('all');     // category
  const [paidBy, setPaidBy]   = React.useState('all');     // member.id or 'all'
  const [dayFilter, setDayFilter] = React.useState('all'); // 'all' | day number
  const [search, setSearch]   = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
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
        <Header title={t('budget')} onBack={() => go('hub')} />
        {!trip && !loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
            <div className="serif" style={{ fontSize: 18 }}>
              {window.isRTL ? 'الرجاء فتح رحلة أولاً' : 'Open a trip first'}
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
      {/* Header */}
      <Header title={t('budget')} onBack={() => go('hub')} action={
        <>
          <button onClick={() => go('analytics')} aria-label={t('statsNav')} title={t('statsNav')} style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--cream-2)', color: 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            display: 'grid', placeItems: 'center',
          }}>
            <IconSparkle size={15} stroke="currentColor" />
          </button>
          <button onClick={() => openSheet?.('addExpense')} aria-label={t('add')} style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--clay)', display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 10px oklch(0.62 0.13 35 / 0.4)',
          }}>
            <IconPlus size={16} stroke="#fff" />
          </button>
        </>
      } />

      {/* OVER-BUDGET BANNER */}
      {overBudget && (
        <div style={{ padding: '4px 14px 0' }}>
          <div style={{
            borderRadius: 18, padding: '12px 14px',
            background: 'linear-gradient(135deg, var(--clay) 0%, var(--clay-deep) 100%)',
            color: '#fff', boxShadow: 'var(--shadow-md)',
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center',
              fontSize: 18,
            }}>⚠</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {window.isRTL ? `تجاوزت الميزانية بنسبة ${overPct}٪` : `Over budget by ${overPct}%`}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>
                {conv(realSpent - planned)} {window.isRTL ? 'فوق الحد المخطط' : 'above your planned cap'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DONUT + STAT — overlapping */}
      <div style={{ padding: '6px 14px 0', position: 'relative' }}>
        <div style={{
          background: 'var(--statement)', color: 'var(--statement-fg)',
          borderRadius: 28, padding: '22px 22px 26px',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Beam */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(60% 50% at 80% 0%, oklch(0.40 0.06 35 / 0.6) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexDirection: 'row',
            position: 'relative',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.72 }}>
                {t('totalSpent')}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 44, lineHeight: 1, marginTop: 4 }}>
                {conv(realSpent)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                {t('ofPlanned')} {conv(planned)} {t('planned')}
              </div>
              {/* Currency toggle — Home ↔ Local (only shown if they differ) */}
              {!sameHomeLocal && (
                <div style={{
                  marginTop: 14, display: 'inline-flex', padding: 3,
                  background: 'rgba(255,255,255,0.08)', borderRadius: 999,
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  flexDirection: 'row',
                }}>
                  {[['home', home], ['local', local]].map(([m, code]) => (
                    <button key={m} onClick={() => setDisplayMode(m)} style={{
                      padding: '5px 12px', borderRadius: 999, fontSize: 11.5, fontWeight: 500,
                      background: displayMode === m ? 'var(--cream)' : 'transparent',
                      color: displayMode === m ? 'var(--ink)' : 'var(--cream)',
                      display: 'flex', alignItems: 'center', gap: 5,
                      flexDirection: 'row',
                    }}>
                      {displayMode !== m && <IconSwap size={11} stroke="currentColor" />}
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Donut */}
            <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
              <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="75" cy="75" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
                {cats.map((c) => {
                  const len = (c.pct / 100) * C;
                  const dasharray = `${len} ${C - len}`;
                  const el = (
                    <circle key={c.key} cx="75" cy="75" r={R} fill="none"
                            stroke={c.color} strokeWidth="14" strokeLinecap="butt"
                            strokeDasharray={dasharray} strokeDashoffset={-offset} />
                  );
                  offset += len + 2; // small gap
                  return el;
                })}
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 34, lineHeight: 1 }}>
                  {planned > 0 ? Math.min(Math.round((realSpent / planned) * 100), 999) : 0}<span style={{ fontSize: 16 }}>%</span>
                </div>
                <div style={{ fontSize: 10, opacity: 0.6, fontFamily: 'var(--mono)', letterSpacing: '0.12em', marginTop: 2 }}>{t('used')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category cards row */}
        <div style={{
          marginTop: 12, display: 'flex', gap: 9, overflowX: 'auto', padding: '0 4px 8px',
          flexDirection: 'row',
        }} className="no-scrollbar">
          {cats.map((c) => (
            <div key={c.key} style={{
              flexShrink: 0, minWidth: 110,
              background: 'var(--cream-2)', borderRadius: 18, padding: '12px 14px',
              boxShadow: 'var(--shadow-sm)', border: '0.5px solid var(--hairline)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: c.color }} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-soft)' }}>{t(c.key) || c.label}</span>
              </div>
              <div className="mono" style={{ fontSize: 17, marginTop: 4, color: 'var(--ink)', fontWeight: 500 }}>
                {conv(c.amt)}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 1, fontFamily: 'var(--mono)' }}>
                {c.pct}{t('ofTotal')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER + LIST */}
      <div style={{ padding: '18px 14px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexDirection: 'row',
          padding: '0 8px 10px',
        }}>
          <div className="serif" style={{ fontSize: 22 }}>{t('expenses')}</div>
          <div style={{ display: 'flex', gap: 5, flexDirection: 'row' }}>
            <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }} style={{
              width: 30, height: 30, borderRadius: 10,
              background: showSearch ? 'var(--ink)' : 'var(--cream-2)',
              border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
            }}><IconSearch size={14} stroke={showSearch ? 'var(--cream)' : 'var(--ink-soft)'} /></button>
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

        {/* Category chips + filter toggle */}
        <div style={{ display: 'flex', gap: 6, padding: '0 4px 10px', overflowX: 'auto', flexDirection: 'row', alignItems: 'center' }} className="no-scrollbar">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            {t('all')} · {window.EXPENSES.length}
          </Chip>
          {cats.map((c) => (
            <Chip key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)}>{t(c.key) || c.label}</Chip>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowFilters(!showFilters)} style={{
            flexShrink: 0, padding: '6px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 500,
            background: showFilters || paidBy !== 'all' || dayFilter !== 'all' ? 'var(--ink)' : 'var(--cream-2)',
            color: showFilters || paidBy !== 'all' || dayFilter !== 'all' ? 'var(--cream)' : 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            ⚙ {window.isRTL ? 'فلاتر' : 'Filters'}
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
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6 }}>
                {window.isRTL ? 'دفع بواسطة' : 'Paid by'}
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
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6 }}>
                  {window.isRTL ? 'اليوم' : 'Day'}
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
                {window.isRTL ? 'مسح الفلاتر' : 'Clear filters'}
              </button>
            )}
          </div>
        )}

        {/* Filter summary — totals + count for whatever's currently filtered */}
        {(paidBy !== 'all' || dayFilter !== 'all' || filter !== 'all' || search)
          && filteredExpenses.length > 0 && (() => {
          const total = filteredExpenses.reduce((s, e) => s + (e.usd || 0), 0);
          const labels = [];
          if (filter !== 'all') {
            const c = cats.find((x) => x.key === filter);
            labels.push(c?.label || filter);
          }
          if (paidBy !== 'all') {
            const m = (window.MEMBERS || []).find((x) => x.id === paidBy);
            if (m) labels.push(`${window.isRTL ? 'دفعها' : 'paid by'} ${m.name.split(' ')[0]}`);
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
                  fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em',
                  opacity: 0.72, textTransform: 'uppercase',
                }}>
                  {filteredExpenses.length} {window.isRTL ? 'مصروف' : (filteredExpenses.length === 1 ? 'expense' : 'expenses')}
                </div>
                <div style={{
                  fontSize: 12.5, marginTop: 3, opacity: 0.88,
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
              {window.isRTL ? 'لا توجد مصروفات بعد' : 'No expenses yet'}
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
              {window.isRTL ? 'لا توجد نتائج' : 'No matching expenses'}
            </div>
            <button onClick={() => { setFilter('all'); setPaidBy('all'); setDayFilter('all'); setSearch(''); }} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
            }}>{window.isRTL ? 'مسح الفلاتر' : 'Clear filters'}</button>
          </div>
        )}

        {/* Expense rows — swipeable with delete */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 4px' }}>
          {filteredExpenses.map((e) => {
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
                  if (!confirm(window.isRTL ? `حذف "${e.title}"؟` : `Delete "${e.title}"?`)) return;
                  try {
                    await window.deleteExpense(e.id, trip.id);
                    await window.loadExpenses(trip.id);
                    window.toast?.(window.isRTL ? 'تم الحذف' : 'Deleted', 'success');
                  } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
                }}>
                <div onClick={() => openSheet?.('editExpense', e)} style={{
                  background: 'var(--cream-2)', borderRadius: 18, cursor: 'pointer',
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  flexDirection: 'row',
                  border: '0.5px solid var(--hairline)',
                }}>
                  <div style={{
                    width: 6, alignSelf: 'stretch', borderRadius: 3,
                    background: c.color, marginInlineEnd: window.isRTL ? 0 : -2,
                    marginInlineStart: window.isRTL ? -2 : 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{e.title}</div>
                    <div style={{
                      fontSize: 11, color: 'var(--ink-mute)', marginTop: 3,
                      display: 'flex', alignItems: 'center', gap: 6,
                      flexDirection: 'row',
                    }}>
                      <Avatar m={m} size={15} />
                      <span>{m.name.split(' ')[0]} · {e.when}</span>
                      {e.note && <span style={{ opacity: 0.7 }}>· {e.note}</span>}
                    </div>
                    {/* Split badge — show on shared expenses */}
                    {(e.splitWith && e.splitWith.length > 0) && (() => {
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
                  {e.receiptUrl && (
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
          })}
        </div>
      </div>

      {/* AUDIT LOG — collapsed by default, expand on tap */}
      {(window.AUDIT || []).length > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{t('auditLog')}</SectionLabel>
          <AuditLogPanel entries={window.AUDIT} />
        </div>
      )}
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
                {list.length} {window.isRTL ? 'إجراء' : (list.length === 1 ? 'entry' : 'entries')}
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

Object.assign(window, { ScreenBudget, Header });
