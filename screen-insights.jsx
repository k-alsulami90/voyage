// Global Insights — full lifetime analytics dashboard.
// Aggregates every trip + every expense via window.loadLifetimeStats().

function ScreenInsights({ go }) {
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || null);
  const [loading, setLoading] = React.useState(!window.LIFETIME_STATS);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (window.LIFETIME_STATS) { setStats(window.LIFETIME_STATS); return; }
      setLoading(true);
      try {
        const s = await window.loadLifetimeStats?.();
        if (alive) setStats(s || null);
      } catch (err) {
        console.error('insights load', err);
        window.toast?.(err.message || 'Failed to load insights', 'error');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const HeaderEl = (
    <LargeTitleHeader
      title={t('insightsTitle')}
      subtitle={t('insightsSub')}
      onBack={() => go('trips')}
    />
  );

  if (loading) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        {HeaderEl}<TripSkeleton />
      </div>
    );
  }
  if (!stats || stats.totalTrips === 0) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        {HeaderEl}
        <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center' }}><IconSparkle size={32} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>{t('noInsightsYet')}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 260, lineHeight: 1.5 }}>{t('noInsightsSub')}</div>
          <button onClick={() => go('trips')} style={{ marginTop: 4, padding: '12px 22px', borderRadius: 14, background: 'var(--ink)', color: 'var(--cream)', fontSize: 13.5, fontWeight: 600 }}>{window.isRTL ? '← الرحلات' : 'Go to trips →'}</button>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Lifetime Insights" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
      {HeaderEl}
      <LifetimeHero stats={stats} />
      <KpiGrid stats={stats} />
      {stats.byYear.length > 0 && <YearlyChart stats={stats} />}
      {stats.byCategory.length > 0 && <CategoryBreakdown stats={stats} />}
      {stats.tripSpend.length > 0 && <TripLeaderboard stats={stats} go={go} />}
      <HighlightCards stats={stats} />
      <TripStatusBreakdown stats={stats} />
      {stats.byMember.length > 1 && <MemberBreakdown stats={stats} />}
      <div style={{ padding: '32px 22px 20px', textAlign: 'center' }}>
        <div className="serif-italic" style={{ fontSize: 18, color: 'var(--ink-mute)' }}>voyage</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', marginTop: 4, color: 'var(--ink-mute)' }}>
          {stats.expenseCount} {window.isRTL ? 'مصروف · ' : 'EXPENSES · '}{stats.totalTrips} {window.isRTL ? 'رحلة' : 'TRIPS'}
        </div>
      </div>
    </div>
  );
}

// ── HERO ─────────────────────────────────────────────────────
function LifetimeHero({ stats }) {
  return (
    <div style={{ padding: '4px 14px 0' }}>
      <div style={{
        background: 'var(--statement)', color: 'var(--statement-fg)',
        borderRadius: 28, padding: '24px', position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(55% 45% at 12% 100%, oklch(0.45 0.10 35 / 0.50) 0%, transparent 60%),' +
            'radial-gradient(45% 40% at 90% 0%, oklch(0.40 0.10 260 / 0.45) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', opacity: 0.72 }}>
            {t('kpiLifetimeSpent').toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span className="serif" style={{ fontSize: 56, lineHeight: 0.9 }}>{window.fmtMoney(stats.totalSpentUSD, { in: 'home' })}</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.78, marginTop: 6 }}>
            {window.fmtMoney(stats.avgDailyAcrossLifetime, { in: 'home' })} {window.isRTL ? 'في اليوم في المتوسط' : 'avg / day across all travel'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── KPI grid ─────────────────────────────────────────────────
function KpiGrid({ stats }) {
  const tiles = [
    { label: t('kpiTotalTrips'),    value: stats.totalTrips,    tint: 'var(--clay)' },
    { label: t('kpiCountries'),     value: stats.countries,     tint: 'var(--moss)' },
    { label: t('kpiTravelDays'),    value: stats.totalDays,     tint: 'var(--indigo)' },
    { label: t('statTotalExpenses'),value: stats.expenseCount,  tint: 'var(--honey)' },
  ];
  return (
    <div style={{ padding: '14px 14px 0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {tiles.map((tile, i) => (
        <div key={i} style={{
          padding: '14px 16px', borderRadius: 18,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -10, insetInlineEnd: -10,
            width: 44, height: 44, borderRadius: '50%',
            background: tile.tint, opacity: 0.16,
          }} />
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>
            {tile.label.toUpperCase()}
          </div>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1, marginTop: 6, color: 'var(--ink)' }}>{tile.value}</div>
        </div>
      ))}
    </div>
  );
}

// ── Yearly bar chart with metric toggle ─────────────────────
function YearlyChart({ stats }) {
  const [metric, setMetric] = React.useState('spent');
  const maxVal = Math.max(...stats.byYear.map((y) => y[metric] || 0), 1);
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 8px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500 }}>
          {t('sectionByYear')}
        </div>
        <div style={{ display: 'inline-flex', padding: 2, gap: 2, background: 'var(--cream-2)', borderRadius: 999, border: '0.5px solid var(--hairline)' }}>
          {[
            { k: 'spent', l: '$' },
            { k: 'days',  l: window.isRTL ? 'يوم' : 'D' },
            { k: 'trips', l: window.isRTL ? 'رحلة' : 'N' },
          ].map((m) => (
            <button key={m.k} onClick={() => setMetric(m.k)} style={{
              padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: metric === m.k ? 'var(--ink)' : 'transparent',
              color: metric === m.k ? 'var(--cream)' : 'var(--ink-soft)',
            }}>{m.l}</button>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '18px', margin: '0 8px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, height: 130, padding: '0 4px' }}>
          {stats.byYear.map((y) => {
            const v = y[metric] || 0;
            const pct = (v / maxVal) * 100;
            return (
              <div key={y.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: `${Math.max(pct, 4)}%`,
                    background: 'linear-gradient(180deg, var(--clay) 0%, var(--clay-deep) 100%)',
                    borderRadius: '6px 6px 0 0', minHeight: 4,
                    transition: 'height 380ms cubic-bezier(.32,.72,0,1)',
                  }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>'{String(y.year).slice(2)}</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink)', fontWeight: 600 }}>
                  {metric === 'spent' ? window.fmtMoney(v, { in: 'home' }) :
                   metric === 'days'  ? `${v}d` : `${v}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Category donut ──────────────────────────────────────────
function CategoryBreakdown({ stats }) {
  const CAT_COLOR = {
    lodging: 'var(--clay)', food: 'var(--honey)', transit: 'var(--moss)',
    culture: 'var(--indigo)', misc: 'var(--ink-mute)',
  };
  const total = stats.byCategory.reduce((s, c) => s + c.value, 0);
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500, padding: '0 22px 8px' }}>
        {t('sectionByCategory')}
      </div>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '18px', margin: '0 8px', border: '0.5px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 18 }}>
        <DonutSVG data={stats.byCategory.map((c) => ({ value: c.value, color: CAT_COLOR[c.key] || 'var(--ink-mute)' }))} size={130} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
          {stats.byCategory.slice(0, 5).map((c) => (
            <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: CAT_COLOR[c.key] || 'var(--ink-mute)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)', textAlign: 'start', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t(c.key) || c.key}
              </span>
              <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 600 }}>{Math.round(c.pct)}%</span>
            </div>
          ))}
          <div style={{ paddingTop: 8, borderTop: '0.5px solid var(--hairline)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>{window.isRTL ? 'الإجمالي' : 'TOTAL'}</span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{window.fmtMoney(total, { in: 'home' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutSVG({ data, size = 130 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 8, ir = r * 0.58;
  let angle = -Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {data.map((d, i) => {
        const slice = (d.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        angle += slice;
        const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
        const xi1 = cx + ir * Math.cos(angle - slice), yi1 = cy + ir * Math.sin(angle - slice);
        const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
        const large = slice > Math.PI ? 1 : 0;
        return (
          <path key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`}
            fill={d.color} stroke="var(--cream-2)" strokeWidth="1.5" />
        );
      })}
    </svg>
  );
}

// ── Trip leaderboard ────────────────────────────────────────
function TripLeaderboard({ stats }) {
  const top = stats.tripSpend.filter((tr) => tr.spent > 0).slice(0, 5);
  if (top.length === 0) return null;
  const maxSpent = top[0].spent;
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500, padding: '0 22px 8px' }}>
        {t('sectionTopTrips')}
      </div>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, margin: '0 8px', border: '0.5px solid var(--hairline)', overflow: 'hidden' }}>
        {top.map((tr, i) => (
          <div key={tr.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
            <div className="mono" style={{ width: 22, fontSize: 11, color: 'var(--ink-mute)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.title}</div>
              <div style={{ height: 4, marginTop: 5, borderRadius: 2, background: 'var(--sand)', overflow: 'hidden' }}>
                <div style={{ width: `${(tr.spent / maxSpent) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--clay) 0%, var(--clay-deep) 100%)' }} />
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 3 }}>
                {tr.dur} {window.isRTL ? 'يوم' : 'days'} · {window.fmtMoney(tr.dailyAvg, { in: 'home' })} {window.isRTL ? '/ يوم' : '/ day'}
              </div>
            </div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
              {window.fmtMoney(tr.spent, { in: 'home' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Highlight pace cards ────────────────────────────────────
function HighlightCards({ stats }) {
  const items = [
    stats.longestTrip && { label: t('statLongestTrip'),   value: `${stats.longestTrip.dur}d`, sub: stats.longestTrip.title, tint: 'var(--moss)' },
    stats.mostExpensive && { label: t('statMostExpensive'), value: window.fmtMoney(stats.mostExpensive.spent, { in: 'home' }), sub: stats.mostExpensive.title, tint: 'var(--clay)' },
    { label: t('statAvgTrip'),  value: window.fmtMoney(stats.avgTripCost, { in: 'home' }),            sub: `${stats.totalTrips} ${window.isRTL ? 'رحلة' : 'trips'}`, tint: 'var(--indigo)' },
    { label: t('statDailyAvg'), value: window.fmtMoney(stats.avgDailyAcrossLifetime, { in: 'home' }), sub: `${stats.totalDays} ${window.isRTL ? 'يوم' : 'days'}`,  tint: 'var(--honey)' },
  ].filter(Boolean);
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500, padding: '0 22px 8px' }}>
        {t('sectionPace')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 18, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -8, insetInlineEnd: -8, width: 40, height: 40, borderRadius: '50%', background: it.tint, opacity: 0.14 }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>{it.label.toUpperCase()}</div>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1, marginTop: 4, color: 'var(--ink)' }}>{it.value}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Trip status horizontal stacked bar ──────────────────────
function TripStatusBreakdown({ stats }) {
  const { current, upcoming, past } = stats.statusCounts;
  const items = [
    { label: t('statusCurrent'),  v: current,  c: 'var(--moss)'   },
    { label: t('statusUpcoming'), v: upcoming, c: 'var(--honey)'  },
    { label: t('statusPast'),     v: past,     c: 'var(--ink-mute)' },
  ];
  if (current + upcoming + past === 0) return null;
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500, padding: '0 22px 8px' }}>
        {t('sectionTripStatus')}
      </div>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '14px 18px', margin: '0 8px', border: '0.5px solid var(--hairline)' }}>
        <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)' }}>
          {items.map((it, i) => it.v > 0 && (
            <div key={it.label} style={{ flex: it.v, background: it.c, boxShadow: i > 0 ? 'inset 2px 0 0 var(--cream-2)' : 'none' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
          {items.map((it) => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: it.c }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{it.v}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Per-member contributors ─────────────────────────────────
function MemberBreakdown({ stats }) {
  const top = stats.byMember.slice(0, 5).map((m) => {
    const member = (window.MEMBERS || []).find((x) => x.id === m.userId);
    return {
      ...m,
      name: member?.name || (m.userId === window.currentUserId ? (window.isRTL ? 'أنت' : 'You') : (m.userId?.slice(0, 6) || 'Unknown')),
      hue: member?.hue || 200,
      initials: member?.initials || '?',
    };
  });
  return (
    <div style={{ padding: '22px 14px 0' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500, padding: '0 22px 8px' }}>
        {t('sectionMembers')}
      </div>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, padding: '14px 16px', margin: '0 8px', border: '0.5px solid var(--hairline)' }}>
        {top.map((m, i) => (
          <div key={m.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
            <Avatar m={m} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{m.name}</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                  {window.fmtMoney(m.value, { in: 'home' })}
                </span>
              </div>
              <div style={{ height: 5, marginTop: 5, borderRadius: 3, background: 'var(--sand)', overflow: 'hidden' }}>
                <div style={{
                  width: `${m.pct}%`, height: '100%',
                  background: `linear-gradient(90deg, oklch(0.62 0.13 ${m.hue}) 0%, oklch(0.48 0.13 ${m.hue}) 100%)`,
                  transition: 'width 380ms cubic-bezier(.32,.72,0,1)',
                }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 3 }}>
                {Math.round(m.pct)}% {window.isRTL ? 'من الإجمالي' : 'of lifetime spend'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ScreenInsights = ScreenInsights;
