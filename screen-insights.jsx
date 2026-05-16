// Global Insights — app-level lifetime travel analytics page.

function ScreenInsights({ go }) {
  const g = window.GLOBAL;
  const maxYear = Math.max(...g.yearly.map((y) => y.days));

  return (
    <div data-screen-label="00b Global Insights" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      <Header title={t('insightsNav')} onBack={() => go('trips')} />

      {/* HERO STAT — countries map dots */}
      <div style={{ padding: '0 14px' }}>
        <div style={{
          background: 'linear-gradient(160deg, oklch(0.32 0.04 30) 0%, oklch(0.18 0.03 280) 100%)',
          color: '#fff', borderRadius: 28, padding: '22px',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-card)', height: 240,
        }}>
          {/* faux globe — concentric arcs */}
          <svg viewBox="0 0 400 240" style={{ position: 'absolute', right: -60, top: -10, width: 380, height: 280, opacity: 0.18 }}>
            {[60, 90, 120, 150].map((r) => (
              <ellipse key={r} cx="200" cy="120" rx={r * 1.4} ry={r} fill="none" stroke="#fff" strokeWidth="0.5" />
            ))}
            <ellipse cx="200" cy="120" rx="168" ry="120" fill="none" stroke="#fff" strokeWidth="1" />
            {[[60,80],[110,140],[150,90],[200,130],[230,60],[270,100],[310,150],[100,160],[330,90]].map(([x,y], i) => (
              <circle key={i} cx={x + 70} cy={y} r="3" fill="oklch(0.78 0.13 30)" />
            ))}
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.55 }}>
              {t('since2020')}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4, flexDirection: 'row' }}>
              <span className="serif" style={{ fontSize: 100, lineHeight: 0.85 }}>{g.countries}</span>
              <span className="serif-italic" style={{ fontSize: 28, opacity: 0.7 }}>{t('countries')}</span>
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 8 }}>
              {t('continents').replace('continents', '')} {g.continents} {t('continents')}, {g.days} {t('travelDays')}
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAPPING STAT TRIO */}
      <div style={{
        padding: '0 22px', marginTop: -26, position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {[
          { l: t('trips'),   v: window.TRIPS.length,   s: 'total' },
          { l: t('lifetime'), v: `$${(g.lifetimeUSD/1000).toFixed(1)}k`, s: t('spent') },
          { l: t('longest'),  v: `${g.longestTrip.days}d`, s: g.longestTrip.name },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '12px 14px', borderRadius: 16,
            background: 'var(--cream-2)',
            border: '0.5px solid var(--hairline)',
            boxShadow: 'var(--shadow-sm)',
            transform: `rotate(${(i - 1) * 1.5}deg)`,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>
              {s.l.toUpperCase()}
            </div>
            <div className="serif" style={{ fontSize: 24, lineHeight: 1, marginTop: 2, color: 'var(--ink)' }}>{s.v}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 1 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* YEARLY CHART */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('travelDaysByYear')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22, padding: '18px 18px 14px',
          margin: '0 8px', border: '0.5px solid var(--hairline)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 8, height: 110, padding: '0 4px',
          }}>
            {g.yearly.map((y) => (
              <div key={y.y} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${(y.days / maxYear) * 100}%`,
                    background: y.y === 2025
                      ? 'linear-gradient(180deg, var(--clay) 0%, var(--clay-deep) 100%)'
                      : 'linear-gradient(180deg, var(--sand-deep) 0%, var(--sand) 100%)',
                    borderRadius: 6,
                    position: 'relative',
                  }}>
                    {y.y === 2025 && (
                      <div style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--clay-deep)', fontWeight: 600,
                      }}>{y.days}d</div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>'{String(y.y).slice(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BY CONTINENT — stacked bar + legend */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('daysByContinent')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22, padding: '18px',
          margin: '0 8px', border: '0.5px solid var(--hairline)',
        }}>
          <div style={{
            display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', marginBottom: 14,
            flexDirection: 'row',
            boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)',
          }}>
            {g.byContinent.map((c, i) => (
              <div key={c.name} style={{
                flex: c.days, background: c.color,
                boxShadow: i > 0 ? 'inset 2px 0 0 var(--cream-2)' : 'none',
              }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
            {g.byContinent.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', flex: 1 }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink)' }}>{c.days}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP CATEGORY callout */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('whereMoneyGoes')}</SectionLabel>
        <div style={{
          margin: '0 8px',
          background: 'var(--ink)', color: 'var(--cream)',
          borderRadius: 22, padding: '18px 20px',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20, width: 120, height: 120,
            borderRadius: '50%', background: 'oklch(0.62 0.13 35 / 0.4)', filter: 'blur(30px)',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.55 }}>
              {t('topCategoryLifetime')}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6, flexDirection: 'row' }}>
              <span className="serif-italic" style={{ fontSize: 36 }}>{g.topCategory.name}</span>
              <span style={{ fontSize: 13, opacity: 0.65 }}>· {g.topCategory.pct}%</span>
            </div>
            <div className="mono" style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
              ${g.topCategory.usd.toLocaleString()} {t('acrossAllTrips')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenInsights = ScreenInsights;
