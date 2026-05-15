// Trip Hub — the main landing.
// Overlapping & interlocking cards: hero image + tilted stat cards + glass pills

function ScreenHub({ go, openSheet, loading }) {
  const trip    = window.TRIP;
  if (loading && !trip) {
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
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
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
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
          padding: '7px 14px', borderRadius: 999, color: 'var(--ink)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: 999,
            background: 'var(--moss)', boxShadow: '0 0 6px var(--moss)',
          }} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>{t('dayLbl')} {trip.daysIn} {t('ofLbl')} {trip.daysTotal}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
          <button className="glass" style={btnGlass} onClick={() => go('settings')}><IconBell size={18} /></button>
          <button className="glass" style={btnGlass} onClick={() => openSheet('share')}><IconShare size={18} /></button>
        </div>
      </div>

      {/* HERO — big illustration card with trip name bleeding off bottom */}
      <div style={{ position: 'relative', padding: '0 14px', paddingTop: 110 }}>
        <div style={{
          position: 'relative', height: 330, borderRadius: 32,
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}>
          {trip.coverImageUrl ? (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${trip.coverImageUrl})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />
            </div>
          ) : (
            <CoverArt kind={trip.cover || 'kyoto'} />
          )}

          {/* Inner labels — top-left tag */}
          <div style={{
            position: 'absolute', top: 18,
            ...(window.isRTL ? { right: 18 } : { left: 18 }),
            display: 'flex', alignItems: 'center', gap: 6,
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
            padding: '5px 11px 5px 9px', borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)', color: '#fff',
            fontSize: 11, fontWeight: 500, letterSpacing: 0.04,
          }}>
            <IconPin size={12} stroke="#fff" /> {trip.subtitle || trip.title}
          </div>

          {/* Date + temperature */}
          <div style={{
            position: 'absolute', top: 18,
            ...(window.isRTL ? { left: 18 } : { right: 18 }),
            color: '#fff', textAlign: window.isRTL ? 'left' : 'right',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, opacity: 0.85, letterSpacing: '0.1em' }}>
              {trip.dates.toUpperCase()}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5,
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
              fontSize: 12.5, fontWeight: 500,
            }}>
              <IconCloud size={14} stroke="#fff" /> {trip.weather.cond} · {trip.weather.temp}°
            </div>
          </div>

          {/* Subtitle */}
          <div style={{
            position: 'absolute',
            ...(window.isRTL ? { right: 22 } : { left: 22 }),
            bottom: 64, color: '#fff',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', opacity: 0.9,
          }}>{trip.subtitle}</div>
        </div>

        {/* TITLE — bleeds out of the hero card */}
        <div style={{
          position: 'relative', marginTop: -50, marginLeft: 8,
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 64, lineHeight: 0.95,
          color: '#fff', letterSpacing: '-0.03em',
          textShadow: '0 6px 24px rgba(0,0,0,0.18)',
          zIndex: 2, pointerEvents: 'none',
        }}>{(trip.title || '').split(' ').slice(0, 2).join(' ')}<br /><span style={{
          fontStyle: 'normal', fontFamily: 'var(--sans)', fontSize: 20,
          color: 'var(--ink)', textShadow: 'none',
          letterSpacing: '-0.01em', fontWeight: 500,
        }}>· {trip.subtitle || trip.dates}</span></div>

        {/* OVERLAPPING STAT TRIO — tilted off the hero */}
        <div style={{
          position: 'absolute',
          ...(window.isRTL ? { left: 22 } : { right: 22 }),
          top: 318, zIndex: 4,
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
        }}>
          {/* Days card — small, slightly rotated */}
          <div className="lift" style={{
            ...miniCard, transform: 'rotate(3deg)',
            background: 'var(--cream)',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-mute)', letterSpacing: '0.12em' }}>
              {t('daysLeft')}
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 36, lineHeight: 1, marginTop: 2, color: 'var(--ink)' }}>
              {trip.daysTotal - trip.daysIn}<span style={{ fontSize: 14, color: 'var(--ink-mute)', marginLeft: 3 }}>/{trip.daysTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* OVER-BUDGET BANNER — only when spent > planned */}
      {planned > 0 && spent > planned && (
        <div style={{ padding: '20px 14px 0', position: 'relative', zIndex: 3 }}>
          <div style={{
            borderRadius: 18, padding: '12px 14px',
            background: 'linear-gradient(135deg, var(--clay) 0%, var(--clay-deep) 100%)',
            color: '#fff', boxShadow: 'var(--shadow-md)',
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', fontSize: 18,
            }}>⚠</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {window.isRTL ? `تجاوزت الميزانية بنسبة ${Math.round(((spent - planned) / planned) * 100)}٪` : `Over budget by ${Math.round(((spent - planned) / planned) * 100)}%`}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>
                {fmtC(spent - planned)} {window.isRTL ? 'فوق الحد المخطط' : 'above your planned cap'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUDGET WORKSPACE CARD — overlaps with title above */}
      <div style={{ padding: '24px 14px 0', position: 'relative', zIndex: 3 }}>
        <button onClick={() => go('budget')} style={{
          display: 'block', width: '100%', textAlign: window.isRTL ? 'right' : 'left',
          background: 'var(--cream-2)', borderRadius: 28,
          padding: '20px 20px 18px',
          boxShadow: 'var(--shadow-card)', position: 'relative',
          overflow: 'visible',
          border: '0.5px solid var(--hairline)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
            marginBottom: 14,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)' }}>
                {t('sharedBudget')}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
                <span className="serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--ink)' }}>
                  {fmtC(spent)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{t('ofPlanned')} {fmtC(planned)}</span>
              </div>
              <div style={{
                marginTop: 4, fontSize: 12, color: 'var(--moss)', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 4,
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 999, background: 'var(--moss)',
                }} />
                {fmtC(remaining)} {t('leftOnPace')}
              </div>
            </div>
            <IconChevron size={16} stroke="var(--ink-mute)" />
          </div>

          {/* Stacked-bar visualization — categories overlap each other slightly */}
          <div style={{
            display: 'flex', borderRadius: 12, overflow: 'hidden',
            height: 16, marginBottom: 14,
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)',
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
          }}>
            {window.CATEGORIES.map((c, i) => (
              <div key={c.key} style={{
                flex: c.pct, background: c.color,
                position: 'relative',
                boxShadow: i > 0 ? 'inset 2px 0 0 var(--cream-2)' : 'none',
              }} />
            ))}
          </div>

          {/* Category legend — two cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
            {window.CATEGORIES.slice(0, 4).map((c) => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', flex: 1 }}>{c.label}</span>
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 500 }}>
                  {fmtC(c.amt)}
                </span>
              </div>
            ))}
          </div>

          {/* Members chip overlapping bottom-left */}
          <div style={{
            position: 'absolute', bottom: -14,
            ...(window.isRTL ? { right: 22 } : { left: 22 }),
            display: 'flex', alignItems: 'center', gap: 8,
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
            padding: '7px 12px 7px 8px', borderRadius: 999,
            background: 'var(--ink)', color: 'var(--cream)',
            boxShadow: '0 6px 16px rgba(34,28,22,0.3)',
          }}>
            <AvatarStack members={(window.MEMBERS || []).slice(0, 3)} size={20} />
            <span style={{ fontSize: 11.5, fontWeight: 500 }}>
              {Math.max(0, (window.MEMBERS || []).length - 3)} {t('splitting')}
            </span>
          </div>
        </button>
      </div>

      {/* UP NEXT — agenda card with overlapping pin */}
      <div style={{ padding: '28px 14px 0' }}>
        <SectionLabel>{t('upNext')}</SectionLabel>
        <div style={{
          background: 'linear-gradient(160deg, oklch(0.36 0.05 285) 0%, oklch(0.22 0.04 280) 100%)',
          color: '#fff', borderRadius: 26,
          padding: window.isRTL ? '18px 60px 18px 18px' : '18px 18px 18px 60px',
          position: 'relative', boxShadow: 'var(--shadow-card)',
          overflow: 'hidden', marginLeft: 22, marginRight: 14,
        }}>
          {/* Overlapping clock badge — bleeds off the left/right */}
          <div style={{
            position: 'absolute', top: '50%',
            ...(window.isRTL ? { right: -22 } : { left: -22 }),
            transform: 'translateY(-50%)',
            width: 64, height: 64, borderRadius: 20,
            background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 22px rgba(60,30,15,0.4)',
            border: '4px solid var(--cream)',
          }}>
            <IconClock size={26} stroke="#fff" />
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.7 }}>
            {trip.dates}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
            {trip.title}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            {trip.subtitle || `${trip.daysIn} ${t('ofLbl')} ${trip.daysTotal} ${t('travelDays')}`}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ padding: '22px 14px 0' }}>
        <SectionLabel>{t('quickActions')}</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9,
          padding: '0 14px',
        }}>
          {[
            { i: <IconPlus size={20} />, l: t('add'), onClick: () => openSheet('addExpense') },
            { i: <IconUpload size={18} />, l: t('upload'), onClick: () => go('docs') },
            { i: <IconQR size={18} />, l: t('invite'), onClick: () => openSheet('share') },
            { i: <IconCompass size={18} />, l: t('plan'), onClick: () => go('settings') },
          ].map((q, i) => (
            <button key={i} onClick={q.onClick} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '13px 6px', borderRadius: 18,
              background: 'var(--cream-2)',
              border: '0.5px solid var(--hairline)',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 11,
                background: i === 0 ? 'var(--ink)' : 'var(--cream)',
                color: i === 0 ? 'var(--cream)' : 'var(--ink)',
                display: 'grid', placeItems: 'center',
                border: i === 0 ? 'none' : '0.5px solid var(--hairline)',
              }}>{q.i}</div>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-soft)' }}>{q.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RECENT — overlapping receipt-stack preview */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel action={t('seeAll')} onAction={() => go('budget')}>{t('recentActivity')}</SectionLabel>
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {window.EXPENSES.slice(0, 3).map((e, i) => {
            const m = window.MEMBERS.find((x) => x.id === e.who);
            const c = window.CATEGORIES.find((x) => x.key === e.cat);
            return (
              <div key={e.id} style={{
                background: 'var(--cream-2)', borderRadius: 18,
                padding: '12px 14px',
                border: '0.5px solid var(--hairline)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex', alignItems: 'center', gap: 12,
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: c.color, color: '#fff',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic',
                  flexShrink: 0,
                }}>{c.label[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1,
                    display: 'flex', alignItems: 'center', gap: 5,
                    flexDirection: window.isRTL ? 'row-reverse' : 'row',
                  }}>
                    <Avatar m={m} size={14} /> {m.name.split(' ')[0]} · {e.when}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>
                  {fmtC(e.usd)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

window.ScreenHub = ScreenHub;
