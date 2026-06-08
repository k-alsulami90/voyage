// Trip Hub — the main landing.
// Overlapping & interlocking cards: hero image + tilted stat cards + glass pills

function ScreenHub({ go, openSheet, loading }) {
  const trip    = window.TRIP;
  const dataReady = trip && window.isTripDataReady?.(trip.id);
  // Show skeleton until expenses for THIS trip are actually loaded —
  // prevents 'flash of 0 spent' before the real number arrives.
  if (loading || !trip || !dataReady) {
    return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  }
  const spent   = trip?.budget?.spentUSD   || (window.EXPENSES || []).reduce((s, e) => s + (e.usd || 0), 0);
  const planned = trip?.budget?.plannedUSD || 0;
  const pct     = planned > 0 ? (spent / planned) * 100 : 0;
  const remaining = planned - spent;

  // Use unified formatter — always shows the trip's home currency by default
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });

  if (!trip) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div className="serif" style={{ fontSize: 20, color: 'var(--ink-mute)' }}>
            {window.isRTL ? 'لا توجد رحلة نشطة' : 'No active trip'}
          </div>
          <button onClick={() => go('trips')} style={{
            marginTop: 14, padding: '10px 20px', borderRadius: 12,
            background: 'var(--ink)', color: 'var(--cream)', fontSize: 13.5,
          }}>{window.isRTL ? '← رحلاتي' : 'My Trips →'}</button>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="01 Trip Hub" style={{
      background: 'var(--cream)', minHeight: '100%',
      paddingBottom: 100,
    }}>
      {/* Top bar — glass pills floating over hero */}
      <div style={{
        position: 'absolute', top: 'max(60px, calc(env(safe-area-inset-top) + 14px))', left: 0, right: 0, zIndex: 30,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
        padding: '0 18px',
      }}>
        <button onClick={() => go('trips')} className="glass" style={{
          width: 38, height: 38, borderRadius: 999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: 'var(--ink)',
        }}>
          <span className="icon-flip"><IconBack size={18} /></span>
        </button>
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          flexDirection: 'row',
          padding: '7px 14px', borderRadius: 999, color: 'var(--ink)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 999,
            background: 'var(--moss)', boxShadow: '0 0 6px var(--moss)',
          }} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>{t('dayLbl')} {trip.daysIn} {t('ofLbl')} {trip.daysTotal}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'row' }}>
          <button className="glass" style={btnGlass} onClick={() => openSheet('search')}
                  aria-label={window.isRTL ? 'بحث' : 'Search'}><IconSearch size={18} /></button>
          <button className="glass" style={btnGlass} onClick={() => openSheet('share')}
                  aria-label={t('inviteTheCrew')}><IconShare size={18} /></button>
        </div>
      </div>

      {/* HERO — big illustration card with trip name bleeding off bottom */}
      <div style={{ position: 'relative', padding: '0 14px', paddingTop: 110 }}>
        <div style={{
          position: 'relative', height: 330, borderRadius: 32,
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}>
          {(trip.coverUrl || trip.coverImageUrl) ? (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${trip.coverUrl || trip.coverImageUrl})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
            </div>
          ) : (
            <CoverArt kind={trip.cover || 'kyoto'} />
          )}

          {/* Inner labels — top-leading countries chip */}
          {(trip.countries && trip.countries.length > 0) && (
            <div style={{
              position: 'absolute', top: 18,
              insetInlineStart: 18,
              display: 'flex', alignItems: 'center', gap: 6,
              flexDirection: 'row', maxWidth: '60%',
              padding: '5px 11px 5px 9px', borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)', color: '#fff',
              fontSize: 11, fontWeight: 500, letterSpacing: 0.04,
            }}>
              <IconPin size={12} stroke="#fff" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {trip.countries.join(' · ')}
              </span>
            </div>
          )}

          {/* Dates — top-right. Was uppercase mono with wide tracking,
             the saturated AI eyebrow shape sitting on top of a photo.
             Now: sentence-case, mono kept (numbers are tabular), no
             tracking, slightly larger so it's readable without shouting. */}
          <div style={{
            position: 'absolute', top: 18,
            insetInlineEnd: 18,
            color: '#fff', textAlign: 'end',
          }}>
            <div className="mono" style={{
              fontSize: 11.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              {trip.dates}
            </div>
          </div>

          {/* Bottom overlay — title + key stats on the cover itself */}
          <div style={{
            position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 0,
            padding: '60px 22px 18px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)',
            color: '#fff',
          }}>
            <div className="serif-italic" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {trip.title || (window.isRTL ? 'رحلة' : 'Trip')}
            </div>
            {trip.subtitle && (
              <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4, fontWeight: 500 }}>
                {trip.subtitle}
              </div>
            )}
            {/* Live stats row — day + spent */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginTop: 12,
              flexDirection: 'row', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{trip.daysIn}</span>
                <span style={{ fontSize: 11, opacity: 0.75 }}>/{trip.daysTotal} {window.isRTL ? 'يوم' : 'days'}</span>
              </div>
              {planned > 0 && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.5)' }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>{fmtC(spent)}</span>
                    <span style={{ fontSize: 11, opacity: 0.75 }}>/ {fmtC(planned)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* PERSONAL BALANCE CARD — only for shared trips with non-zero balance.
         Gradient surface kept (moss / clay carries the direction meaning at
         a glance). Hero-metric template gone: no uppercase mono eyebrow,
         no 26px serif amount, no big "+"/"−" glyph. The body is an
         editorial sentence with the amount as inline emphasis. */}
      {(window.MEMBERS || []).length > 1 && (() => {
        const balance = window.computeUserBalance?.(
          window.currentUserId,
          window.EXPENSES || [],
          window.SETTLEMENTS || []
        );
        if (!balance || Math.abs(balance.net) < 0.5) return null;  // hide near-zero
        const owed = balance.net > 0;
        const amount = fmtC(Math.abs(balance.net));
        // Show "X owes you" / "you owe X" with the other party's name
        // when there's only ONE counterparty (the common case for two-
        // person trips, and the most natural sentence). Fall back to
        // "N people owe you" only when there's more than one.
        const pairs = Object.entries(balance.byOther || {})
          .filter(([, v]) => Math.abs(v) > 0.5);
        const otherCount = pairs.length;
        // For the single-party case, pluck the counterparty's first name
        // off window.MEMBERS. The balance direction (owed vs owe) tells
        // us which side they're on; we just need the name.
        let singleName = null;
        if (otherCount === 1) {
          const otherId = pairs[0][0];
          const member = (window.MEMBERS || []).find((m) => m.id === otherId);
          singleName = (member?.name || '').split(' ')[0] || member?.name || '';
        }
        const sentence = otherCount === 1 && singleName
          ? (owed
              ? <>{window.isRTL
                  ? <>يدين <BalanceAmt>{singleName}</BalanceAmt> لك بمبلغ <BalanceAmt>{amount}</BalanceAmt>.</>
                  : <><BalanceAmt>{singleName}</BalanceAmt> owes you <BalanceAmt>{amount}</BalanceAmt>.</>}</>
              : <>{window.isRTL
                  ? <>أنت مدين لـ <BalanceAmt>{singleName}</BalanceAmt> بمبلغ <BalanceAmt>{amount}</BalanceAmt>.</>
                  : <>You owe <BalanceAmt>{singleName}</BalanceAmt> <BalanceAmt>{amount}</BalanceAmt>.</>}</>)
          : (owed
              ? <>{window.isRTL
                  ? <>يدين لك <BalanceAmt>{otherCount}</BalanceAmt> {otherCount === 1 ? 'شخص' : 'أشخاص'} بإجمالي <BalanceAmt>{amount}</BalanceAmt>.</>
                  : <><BalanceAmt>{otherCount}</BalanceAmt> {otherCount === 1 ? 'person owes' : 'people owe'} you <BalanceAmt>{amount}</BalanceAmt> total.</>}</>
              : <>{window.isRTL
                  ? <>أنت مدين لـ <BalanceAmt>{otherCount}</BalanceAmt> {otherCount === 1 ? 'شخص' : 'أشخاص'} بإجمالي <BalanceAmt>{amount}</BalanceAmt>.</>
                  : <>You owe <BalanceAmt>{otherCount}</BalanceAmt> {otherCount === 1 ? 'person' : 'people'} <BalanceAmt>{amount}</BalanceAmt> total.</>}</>);
        return (
          <div style={{ padding: '24px 14px 0', position: 'relative', zIndex: 3 }}>
            <button onClick={() => openSheet?.('settleUp')}
              aria-label={window.isRTL
                ? (owed
                    ? (singleName ? `يدين ${singleName} لك بمبلغ ${amount}` : `يدين لك ${otherCount} أشخاص بإجمالي ${amount}`)
                    : (singleName ? `أنت مدين لـ ${singleName} بمبلغ ${amount}` : `أنت مدين لـ ${otherCount} أشخاص بإجمالي ${amount}`))
                : (owed
                    ? (singleName ? `${singleName} owes you ${amount}` : `${otherCount} people owe you ${amount}`)
                    : (singleName ? `You owe ${singleName} ${amount}` : `You owe ${otherCount} people ${amount}`))}
              style={{
              width: '100%', textAlign: 'start',
              borderRadius: 22, padding: '16px 18px',
              background: owed
                ? 'linear-gradient(135deg, var(--moss) 0%, oklch(0.40 0.08 155) 100%)'
                : 'linear-gradient(135deg, var(--clay) 0%, var(--clay-deep) 100%)',
              color: '#fff', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 14,
              flexDirection: 'row',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 17, lineHeight: 1.4, color: '#fff', fontWeight: 400,
                }}>{sentence}</div>
                <div style={{
                  marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.85)',
                  display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: 'row',
                }}>
                  {t('balanceTapToSettle')}
                  <span className="icon-flip" style={{ opacity: 0.85 }}>
                    <IconChevron size={11} stroke="currentColor" />
                  </span>
                </div>
              </div>
            </button>
          </div>
        );
      })()}

      {/* OVER-BUDGET ALERT — when spent > planned.
         Was a full clay gradient surface, which collided visually with
         the Personal Balance "owe" gradient when both fired. Now: a
         restrained card with a clay-tinted background wash, hairline,
         clay-deep text, and inline icon. Still unmistakably "alert,"
         no longer competing with the balance gradient for the same eye. */}
      {planned > 0 && spent > planned && (
        <div style={{ padding: '24px 14px 0', position: 'relative', zIndex: 3 }}>
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
                <>تجاوزت الميزانية بـ <strong>{fmtC(spent - planned)}</strong> ({Math.round(((spent - planned) / planned) * 100)}٪ فوق الخطة).</>
              ) : (
                <>Over budget by <strong>{fmtC(spent - planned)}</strong> ({Math.round(((spent - planned) / planned) * 100)}% above plan).</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BUDGET WORKSPACE CARD — overlaps with title above */}
      <div style={{ padding: '24px 14px 0', position: 'relative', zIndex: 3 }}>
        <button onClick={() => go('budget')} style={{
          display: 'block', width: '100%', textAlign: 'start',
          background: 'var(--cream-2)', borderRadius: 28,
          padding: '20px 20px 18px',
          boxShadow: 'var(--shadow-card)', position: 'relative',
          overflow: 'visible',
          border: '0.5px solid var(--hairline)',
        }}>
          {/* Editorial sentence replaces the previous uppercase-mono eyebrow
             + 38px serif headline + supporting line (the hero-metric
             template from the bans list). Numbers carry hierarchy via
             weight; the inline pct + remaining hint live in the same
             prose so the eye reads them in one pass. */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 12, marginBottom: 14, flexDirection: 'row',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 17, lineHeight: 1.5, color: 'var(--ink-soft)', fontWeight: 400,
              }}>
                {window.isRTL ? (
                  planned > 0 ? (
                    <>صرفت <BudgetNum>{fmtC(spent)}</BudgetNum> من <BudgetNum dim>{fmtC(planned)}</BudgetNum>.</>
                  ) : (
                    <>صرفت <BudgetNum>{fmtC(spent)}</BudgetNum> حتى الآن.</>
                  )
                ) : (
                  planned > 0 ? (
                    <>Spent <BudgetNum>{fmtC(spent)}</BudgetNum> of <BudgetNum dim>{fmtC(planned)}</BudgetNum> planned.</>
                  ) : (
                    <>Spent <BudgetNum>{fmtC(spent)}</BudgetNum> so far.</>
                  )
                )}
              </div>
              {planned > 0 && spent <= planned && (
                <div style={{
                  marginTop: 6, fontSize: 12.5, color: 'var(--moss)', fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 5, flexDirection: 'row',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 999, background: 'var(--moss)',
                  }} />
                  {fmtC(remaining)} {t('leftOnPace')}
                  <span style={{ color: 'var(--ink-mute)' }}>· {Math.round(pct)}%</span>
                </div>
              )}
            </div>
            <IconChevron size={16} stroke="var(--ink-mute)" />
          </div>

          {/* Stacked-bar + legend only when we have spending */}
          {spent > 0 && (window.CATEGORIES || []).some((c) => c.amt > 0) && (
            <>
              <div style={{
                display: 'flex', borderRadius: 12, overflow: 'hidden',
                height: 16, marginBottom: 14,
                boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)',
                flexDirection: 'row',
              }}>
                {window.CATEGORIES.filter((c) => c.amt > 0).map((c, i) => (
                  <div key={c.key} style={{
                    flex: c.pct || c.amt, background: c.color,
                    boxShadow: i > 0 ? 'inset 2px 0 0 var(--cream-2)' : 'none',
                  }} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
                {window.CATEGORIES.filter((c) => c.amt > 0).slice(0, 4).map((c) => (
                  <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                    <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', flex: 1 }}>{t(c.key) || c.label}</span>
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 500 }}>
                      {fmtC(c.amt)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Members chip — only for shared trips */}
          {(window.MEMBERS || []).length > 1 && (
            <div style={{
              position: 'absolute', bottom: -14,
              insetInlineStart: 22,
              display: 'flex', alignItems: 'center', gap: 8,
              flexDirection: 'row',
              padding: '7px 12px 7px 8px', borderRadius: 999,
              background: 'var(--statement)', color: 'var(--statement-fg)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            }}>
              <AvatarStack members={(window.MEMBERS || []).slice(0, 3)} size={20} />
              <span style={{ fontSize: 11.5, fontWeight: 500 }}>
                {window.MEMBERS.length} {t('splitting')}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* QUICK ACTIONS — iOS HIG-style four-tile widget. Primary action
         (Add expense) takes a full-dark surface so the hierarchy reads
         as "1 primary + 3 secondary" instead of "4 interchangeable
         tiles." Labels match their destinations everywhere in the app
         (Vault label matches the bottom-tab Vault, not the prior
         action-verb "Upload" which masked where the tap actually went). */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('quickActions')}</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          padding: '0 14px',
        }}>
          {[
            { i: <IconPlus size={20} />,     l: t('add'),                primary: true,  onClick: () => openSheet('addExpense') },
            { i: <IconCompass size={18} />,  l: t('planNav') || t('plan'),                onClick: () => go('plan') },
            { i: <IconDoc size={18} />,      l: t('vaultNav'),                            onClick: () => go('docs') },
            { i: <IconSparkle size={18} />,  l: t('statsNav'),                            onClick: () => go('analytics') },
          ].map((q, i) => (
            <button key={i} onClick={q.onClick}
              aria-label={q.l} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '14px 4px 12px', borderRadius: 18,
              background: q.primary ? 'var(--ink)' : 'var(--cream-2)',
              border: q.primary ? 'none' : '0.5px solid var(--hairline)',
              boxShadow: q.primary
                ? '0 8px 18px -8px oklch(0.22 0.025 250 / 0.4)'
                : 'var(--shadow-xs)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: q.primary ? 'rgba(255,255,255,0.14)' : 'var(--cream)',
                color: q.primary ? 'var(--cream)' : 'var(--ink)',
                display: 'grid', placeItems: 'center',
                border: q.primary ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid var(--hairline)',
              }}>{q.i}</div>
              <span style={{
                fontSize: 11.5, fontWeight: q.primary ? 600 : 500,
                color: q.primary ? 'var(--cream)' : 'var(--ink-soft)',
                letterSpacing: q.primary ? '-0.005em' : 0,
              }}>{q.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RECENT — only when there are expenses.
         Rows used to be inert <div>s — they looked like list rows but
         did nothing on tap. Now wrapped in <button> with onClick that
         opens the edit sheet (same handler Budget uses on its rows).
         Trailing chevron makes the affordance visible. */}
      {(window.EXPENSES || []).length > 0 && (
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel action={t('seeAll')} onAction={() => go('budget')}>{t('recentActivity')}</SectionLabel>
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(window.EXPENSES || []).slice(0, 3).map((e, i) => {
            const m = (window.MEMBERS || []).find((x) => x.id === e.who) || { name: '—', hue: 200, initials: '?' };
            const c = (window.CATEGORIES || []).find((x) => x.key === e.cat) || { color: 'var(--ink-mute)', label: e.cat || '—' };
            return (
              <button key={e.id}
                onClick={() => openSheet?.('editExpense', e)}
                aria-label={window.isRTL
                  ? `تعديل ${e.title}، ${fmtC(e.usd)}`
                  : `Edit ${e.title}, ${fmtC(e.usd)}`}
                style={{
                all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                background: 'var(--cream-2)', borderRadius: 18,
                padding: '12px 14px',
                border: '0.5px solid var(--hairline)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex', alignItems: 'center', gap: 12,
                flexDirection: 'row',
              }}>
                {/* Category badge. Was a single serif-italic letter on a
                   colour square ("F" for Food, "C" for Culture) which
                   required memorising the system. Now: the category
                   emoji from window.CAT_META — same vocabulary the
                   Add-Expense sheet and Budget filters use, so the
                   user only learns it once. Colour square stays for
                   wayfinding by hue. */}
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: c.color,
                  display: 'grid', placeItems: 'center',
                  fontSize: 19, lineHeight: 1,
                  flexShrink: 0,
                }}>{(window.CAT_META?.[e.cat]?.emoji) || '·'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1,
                    display: 'flex', alignItems: 'center', gap: 5,
                    flexDirection: 'row',
                  }}>
                    <Avatar m={m} size={14} /> {m.name.split(' ')[0]} · {e.when}
                  </div>
                </div>
                <div className="mono" style={{
                  fontSize: 13.5, color: 'var(--ink)', fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {fmtC(e.usd)}
                </div>
                <span className="icon-flip" style={{ color: 'var(--ink-mute)', flexShrink: 0 }}>
                  <IconChevron size={13} stroke="currentColor" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}

const btnGlass = {
  width: 38, height: 38, borderRadius: 999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};

const miniCard = {
  background: 'var(--cream-2)', borderRadius: 18,
  padding: '10px 14px', boxShadow: 'var(--shadow-md)',
  border: '0.5px solid var(--hairline)',
};

// Inline emphasis for the balance amount inside the editorial sentence.
// Mono for tabular alignment of money, slightly heavier weight, same
// colour as body so the eye reads it as inline-bold rather than as a
// separate headline.
function BalanceAmt({ children }) {
  return (
    <span className="mono" style={{
      fontWeight: 700, fontSize: '1.15em', letterSpacing: '-0.01em',
    }}>{children}</span>
  );
}

// Same idea for the Budget Workspace card sentence. `dim` softens the
// "of $X planned" reference number so the spent number reads as the
// primary one without size escalation.
function BudgetNum({ children, dim }) {
  return (
    <span className="mono" style={{
      fontWeight: dim ? 500 : 700,
      fontSize: '1.15em',
      color: dim ? 'var(--ink-mute)' : 'var(--ink)',
      letterSpacing: '-0.01em',
    }}>{children}</span>
  );
}

window.ScreenHub = ScreenHub;
