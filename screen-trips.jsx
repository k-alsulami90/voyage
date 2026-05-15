// Global Trips Dashboard — top-level page (app-scoped, NOT trip-scoped).
// Lists private + shared trips, with cumulative travel insights at the top.

function ScreenTrips({ goTrip, go }) {
  const [scope, setScope] = React.useState('all'); // all | private | shared
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const trips = window.TRIPS.filter((t) =>
    (scope === 'all' || (scope === 'shared' ? t.shared : !t.shared)) &&
    (!search || (t.title || '').toLowerCase().includes(search.toLowerCase()))
  );
  const active = window.TRIPS.find((t) => t.status === 'active');
  const upcoming = window.TRIPS.filter((t) => t.status === 'upcoming');
  const past = window.TRIPS.filter((t) => t.status === 'past');

  return (
    <div data-screen-label="00 Trips Home" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* Header — profile + insights link */}
      <div style={{
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--ink-mute)' }}>
            {t('heySunday')}
          </div>
          <div className="serif-italic" style={{ fontSize: 30, lineHeight: 1.05, marginTop: 4 }}>
            {t('yourTravels')}
          </div>
        </div>
        <button onClick={() => go('insights')} style={{
          width: 42, height: 42, borderRadius: 999,
          background: 'var(--ink)', display: 'grid', placeItems: 'center',
          color: 'var(--cream)', boxShadow: 'var(--shadow-md)',
        }}>
          <IconSparkle size={20} stroke="currentColor" />
        </button>
      </div>

      {/* GLOBAL INSIGHTS PREVIEW CARD — overlapping stat tiles */}
      <div style={{ padding: '0 14px' }}>
        <button onClick={() => go('insights')} style={{
          width: '100%', textAlign: window.isRTL ? 'right' : 'left',
          background: 'var(--statement)', color: 'var(--statement-fg)',
          borderRadius: 28, padding: '20px 20px 26px',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* aurora */}
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'radial-gradient(60% 50% at 10% 100%, oklch(0.45 0.10 35 / 0.55) 0%, transparent 60%),' +
              'radial-gradient(50% 45% at 90% 0%, oklch(0.40 0.10 260 / 0.5) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.55 }}>
                {t('lifetimeAllTrips')}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 4, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
                {t('seeAll')} <IconChevron size={11} stroke="currentColor" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
              <span className="serif" style={{ fontSize: 56, lineHeight: 0.9 }}>{window.GLOBAL.countries}</span>
              <span style={{ fontSize: 14, opacity: 0.65, marginLeft: 6 }}>{t('countries')}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.62, marginTop: 4 }}>
              {window.GLOBAL.continents} {t('continents')} · {window.GLOBAL.days} {t('travelDays')}
            </div>

            {/* Overlapping stat trio */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18 }}>
              {[
                { l: t('trips'),   v: window.TRIPS.length, s: t('logged') },
                { l: t('lifetime'), v: `$${(window.GLOBAL.lifetimeUSD / 1000).toFixed(1)}k`, s: t('spent') },
                { l: t('longest'),  v: `${window.GLOBAL.longestTrip.days}d`, s: window.GLOBAL.longestTrip.name },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontSize: 9.5, opacity: 0.55, fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>{s.l.toUpperCase()}</div>
                  <div className="serif" style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>{s.v}</div>
                  <div style={{ fontSize: 10, opacity: 0.55, marginTop: 1 }}>{s.s}</div>
                </div>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* SCOPE FILTER — chips for private vs shared */}
      <div style={{ padding: '20px 22px 10px' }}>
        <div style={{ display: 'flex', gap: 6, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
          {[
            { k: 'all',     l: t('all'),     n: window.TRIPS.length },
            { k: 'private', l: t('private'), n: window.TRIPS.filter((x) => !x.shared).length },
            { k: 'shared',  l: t('shared'),  n: window.TRIPS.filter((x) => x.shared).length },
          ].map((s) => (
            <Chip key={s.k} active={scope === s.k} onClick={() => setScope(s.k)}>
              {s.l} · {s.n}
            </Chip>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }} style={{
            width: 30, height: 30, borderRadius: 999,
            background: showSearch ? 'var(--ink)' : 'var(--cream-2)',
            border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
          }}><IconSearch size={14} stroke={showSearch ? 'var(--cream)' : 'var(--ink-soft)'} /></button>
        </div>
        {showSearch && (
          <div style={{ marginTop: 10 }}>
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={window.isRTL ? 'ابحث عن رحلة...' : 'Search trips...'}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--hairline-2)', background: 'var(--cream-2)',
                color: 'var(--ink)', fontSize: 13.5, outline: 'none',
                textAlign: window.isRTL ? 'right' : 'left',
              }} />
          </div>
        )}
      </div>

      {/* ACTIVE TRIP — large, overlapping cover + status pin */}
      {active && (scope === 'all' || scope === (active.shared ? 'shared' : 'private')) && (
        <div style={{ padding: '4px 14px 0' }}>
          <SectionLabel>{t('currentlyTraveling')}</SectionLabel>
          <ActiveTripCard t={active} onOpen={() => goTrip(active.id)} />
        </div>
      )}

      {/* UPCOMING — horizontal scroller */}
      {upcoming.length > 0 && (scope === 'all') && (
        <div style={{ padding: '24px 0 0' }}>
          <SectionLabel action={t('seeAll')}>{t('upcoming')}</SectionLabel>
          <div style={{ display: 'flex', gap: 12, padding: '0 22px 4px', overflowX: 'auto', flexDirection: window.isRTL ? 'row-reverse' : 'row' }} className="no-scrollbar">
            {upcoming.map((t) => (
              <button key={t.id} onClick={() => goTrip(t.id)} style={{
                flexShrink: 0, width: 200, textAlign: window.isRTL ? 'right' : 'left',
                borderRadius: 22, overflow: 'hidden',
                background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
                boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ height: 130, position: 'relative', overflow: 'hidden' }}>
                  <CoverArt kind={t.cover} imageUrl={t.coverImageUrl} />
                  <div className="glass" style={{
                    position: 'absolute', top: 10,
                    ...(window.isRTL ? { right: 10 } : { left: 10 }),
                    padding: '4px 9px', borderRadius: 999, fontSize: 10,
                    color: '#fff', background: 'rgba(0,0,0,0.32)',
                    fontFamily: 'var(--mono)', letterSpacing: '0.1em',
                  }}>{t.country}</div>
                  {t.shared && (
                    <div style={{ position: 'absolute', bottom: -10, right: 14 }}>
                      <AvatarStack members={window.MEMBERS.slice(0, t.members)} size={22} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 14px 12px' }}>
                  <div className="serif" style={{ fontSize: 22, lineHeight: 1 }}>{t.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 3 }}>{t.dates}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PAST — compact rows */}
      {(scope === 'all' || past.some((x) => scope === (x.shared ? 'shared' : 'private'))) && (
        <div style={{ padding: '24px 14px 0' }}>
          <SectionLabel>{t('pastTrips')}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
            {trips.filter((t) => t.status === 'past').map((t) => (
              <button key={t.id} onClick={() => goTrip(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
                padding: '10px 12px', borderRadius: 18, textAlign: window.isRTL ? 'right' : 'left',
                background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
              }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <CoverArt kind={t.cover} imageUrl={t.coverImageUrl} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    flexDirection: window.isRTL ? 'row-reverse' : 'row',
                  }}>
                    <span className="serif" style={{ fontSize: 18, lineHeight: 1 }}>{t.title}</span>
                    {t.shared && <RoleBadgeMini icon={<IconUsers size={10} stroke="var(--ink-soft)" />} label={`${t.members}`} />}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                    {t.sub} · {t.dates}
                  </div>
                </div>
                <IconChevron size={14} stroke="var(--ink-mute)" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state — no trips yet */}
      {trips.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '48px 32px', textAlign: 'center', gap: 12,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><IconCompass size={28} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>
            {window.isRTL ? 'لا توجد رحلات بعد' : 'No trips yet'}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-mute)', lineHeight: 1.5, maxWidth: 220 }}>
            {window.isRTL ? 'ستظهر رحلاتك هنا بمجرد إنشائها' : 'Your trips will appear here once created'}
          </div>
        </div>
      )}

      {/* Footer: privacy notice */}
      <div style={{
        margin: '24px 22px 0',
        padding: '12px 14px', borderRadius: 14,
        background: 'oklch(0.50 0.08 155 / 0.08)',
        border: '0.5px dashed oklch(0.50 0.08 155 / 0.35)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
      }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--moss)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <IconUsers size={14} stroke="#fff" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'oklch(0.30 0.07 155)', fontWeight: 500 }}>{t('crewPrivacy')}</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 1 }}>
            {t('crewPrivacySub')}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveTripCard({ t, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      width: '100%', textAlign: window.isRTL ? 'right' : 'left', borderRadius: 28,
      overflow: 'hidden', position: 'relative',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
        <CoverArt kind={t.cover} imageUrl={t.coverImageUrl} />
        {/* live pill */}
        <div className="glass" style={{
          position: 'absolute', top: 14,
          ...(window.isRTL ? { right: 14 } : { left: 14 }),
          display: 'flex', alignItems: 'center', gap: 6,
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
          padding: '5px 11px 5px 9px', borderRadius: 999,
          background: 'rgba(0,0,0,0.32)', color: '#fff',
          fontSize: 11, fontWeight: 500, letterSpacing: 0.04,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: 'oklch(0.78 0.18 145)', boxShadow: '0 0 6px oklch(0.78 0.18 145)' }} />
          {window.isRTL ? 'مباشر' : 'LIVE'}
        </div>
        <div style={{
          position: 'absolute', top: 14,
          ...(window.isRTL ? { left: 14 } : { right: 14 }),
          fontFamily: 'var(--mono)', fontSize: 10.5, color: '#fff',
          opacity: 0.85, letterSpacing: '0.1em',
        }}>{t.dates.toUpperCase()}</div>
        <div style={{
          position: 'absolute', bottom: 14,
          ...(window.isRTL ? { right: 18 } : { left: 18 }),
          color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}>
          <div className="serif-italic" style={{ fontSize: 38, lineHeight: 1 }}>{t.title}</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{t.sub}</div>
        </div>
      </div>
      {/* Stat row that "interlocks" with image */}
      <div style={{
        margin: '-22px 14px 0', position: 'relative',
        background: 'var(--cream)', borderRadius: 18,
        padding: '12px 14px',
        boxShadow: 'var(--shadow-md)',
        border: '0.5px solid var(--hairline)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
      }}>
        <AvatarStack members={window.MEMBERS.slice(0, t.members)} size={26} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{window.isRTL ? 'الميزانية' : 'Budget used'}</div>
          <div style={{ height: 5, marginTop: 4, borderRadius: 3, background: 'var(--sand)', overflow: 'hidden' }}>
            <div style={{ width: `${t.budgetPct}%`, height: '100%', background: 'var(--clay)' }} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>{t.budgetPct}%</div>
        <IconChevron size={14} stroke="var(--ink-mute)" />
      </div>
      <div style={{ height: 12 }} />
    </button>
  );
}

function RoleBadgeMini({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      flexDirection: window.isRTL ? 'row-reverse' : 'row',
      padding: '2px 6px', borderRadius: 999,
      background: 'var(--sand)', color: 'var(--ink-soft)',
      fontSize: 10, fontWeight: 500,
    }}>{icon}{label}</span>
  );
}

// Cover art — shows custom photo if available, otherwise geometric preset.
function CoverArt({ kind, imageUrl }) {
  if (imageUrl) {
    return (
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 60% at 50% 100%, transparent 50%, rgba(20,10,20,0.4) 100%)' }} />
      </div>
    );
  }
  const presets = {
    kyoto:   { from: 'oklch(0.74 0.07 30)',  to: 'oklch(0.36 0.05 285)', shapes: 'mountains' },
    lisbon:  { from: 'oklch(0.78 0.09 70)',  to: 'oklch(0.50 0.10 35)',  shapes: 'tile' },
    oaxaca:  { from: 'oklch(0.74 0.13 60)',  to: 'oklch(0.42 0.13 30)',  shapes: 'sun' },
    lofoten: { from: 'oklch(0.58 0.10 260)', to: 'oklch(0.22 0.06 270)', shapes: 'aurora' },
    patagon: { from: 'oklch(0.70 0.07 200)', to: 'oklch(0.34 0.07 250)', shapes: 'peaks' },
  };
  const p = presets[kind] || presets.kyoto;
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: `linear-gradient(160deg, ${p.from} 0%, ${p.to} 100%)`,
    }}>
      {p.shapes === 'mountains' && <KyotoHero />}
      {p.shapes === 'tile' && <TileCover />}
      {p.shapes === 'sun' && <SunCover />}
      {p.shapes === 'aurora' && <AuroraCover />}
      {p.shapes === 'peaks' && <PeaksCover />}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 60% at 50% 100%, transparent 50%, rgba(20,10,20,0.4) 100%)',
      }} />
    </div>
  );
}

const TileCover = () => (
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage:
      'radial-gradient(circle at 25% 25%, oklch(0.94 0.05 75) 0 4px, transparent 5px),' +
      'radial-gradient(circle at 75% 75%, oklch(0.94 0.05 75) 0 4px, transparent 5px)',
    backgroundSize: '40px 40px',
    opacity: 0.6,
  }} />
);
const SunCover = () => (
  <>
    <div style={{
      position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
      width: 200, height: 200, borderRadius: '50%',
      background: 'radial-gradient(circle, oklch(0.92 0.13 80) 0%, oklch(0.78 0.17 40) 100%)',
      filter: 'blur(2px)',
    }} />
    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, transparent 0 18px, oklch(0.20 0.06 30 / 0.18) 18px 19px)' }} />
  </>
);
const AuroraCover = () => (
  <>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(50% 30% at ${20 + i * 25}% ${20 + i * 12}%, oklch(0.78 0.13 ${145 + i * 30} / 0.6) 0%, transparent 60%)`,
        mixBlendMode: 'screen',
      }} />
    ))}
    {[20, 60, 120, 180, 240, 300].map((x, i) => (
      <div key={i} style={{
        position: 'absolute', left: x, top: 10 + (i % 3) * 18,
        width: 2, height: 2, borderRadius: '50%', background: '#fff', opacity: 0.7,
      }} />
    ))}
  </>
);
const PeaksCover = () => (
  <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <polygon points="0,160 80,40 150,110 220,30 290,90 360,50 400,80 400,200 0,200" fill="rgba(255,255,255,0.16)" />
    <polygon points="0,180 90,90 170,130 240,80 320,130 400,100 400,200 0,200" fill="rgba(255,255,255,0.28)" />
    <polygon points="0,200 60,160 140,180 240,150 320,180 400,160 400,200" fill="rgba(255,255,255,0.42)" />
  </svg>
);

Object.assign(window, { ScreenTrips, CoverArt });
