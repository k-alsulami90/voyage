// Insights — Year Ledger.
// Reads top-to-bottom like a personal travel annual report, not a
// dashboard. Hero year + editorial sentence + a few quiet chapters
// (notable trips, category stack, sparkline, this year's trip list),
// then a previous-years footer and lifetime imprint at the bottom.
//
// Aggregates every trip + every expense via window.loadLifetimeStats().
// No card grid. Each chapter is plain typography on cream, separated
// by 0.5px hairlines with generous vertical rhythm.

function ScreenInsights({ go, goTrip }) {
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || null);
  const [loading, setLoading] = React.useState(!window.LIFETIME_STATS);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      // Stale-while-revalidate: show the cached aggregate instantly (no
      // blank), then ALWAYS refetch so the numbers are fresh even if the
      // cache was warm. recomputeExpenseDerived nulls the cache on every
      // expense change, but refetching on mount is the belt-and-
      // suspenders that keeps Insights from ever showing stale totals.
      if (window.LIFETIME_STATS) setStats(window.LIFETIME_STATS);
      else setLoading(true);
      try {
        const s = await window.loadLifetimeStats?.();
        if (alive && s) setStats(s);
      } catch (err) {
        console.error('insights load', err);
        if (!window.LIFETIME_STATS) window.toast?.(err.message || 'Failed to load insights', 'error');
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
        <div style={{
          padding: '60px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 12,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            display: 'grid', placeItems: 'center',
          }}><IconSparkle size={32} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>{t('noInsightsYet')}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 260, lineHeight: 1.5 }}>{t('noInsightsSub')}</div>
          <button onClick={() => go('trips')} style={{
            marginTop: 4, padding: '12px 22px', borderRadius: 14,
            background: 'var(--ink)', color: 'var(--cream)',
            fontSize: 13.5, fontWeight: 600,
          }}>{window.isRTL ? '← قائمة الرحلات' : 'Go to trips →'}</button>
        </div>
      </div>
    );
  }

  // ── Hero year: most recent year with activity. byYear is sorted
  // ascending; the last entry with spent > 0 is the year the user
  // most recently traveled in. Falls back to last entry if none have
  // positive spend (defensive — shouldn't happen if totalTrips > 0). */
  const yearsWithActivity = stats.byYear.filter((y) => (y.trips || 0) > 0);
  const heroYearRow = yearsWithActivity.length > 0
    ? yearsWithActivity[yearsWithActivity.length - 1]
    : stats.byYear[stats.byYear.length - 1];
  const heroYear = heroYearRow.year;

  // Current-year trips. tripSpend carries startDate; filter to the hero
  // year using the trip's start. Sorted by start ascending so the list
  // reads chronologically (Jan first, Dec last).
  const yearTrips = stats.tripSpend
    .filter((tr) => tr.startDate && new Date(tr.startDate).getFullYear() === heroYear)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Previous years footer — every year EXCEPT the hero year, most
  // recent first (descending), only ones with at least one trip.
  const previousYears = stats.byYear
    .filter((y) => y.year !== heroYear && (y.trips || 0) > 0)
    .sort((a, b) => b.year - a.year);

  return (
    <div data-screen-label="Lifetime Insights · Year Ledger" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {HeaderEl}

      <YearHero year={heroYear} />
      <LedgerSentence row={heroYearRow} />

      <LedgerDivider />
      <NotableTrips stats={stats} />

      {stats.byCategory.length > 0 && (
        <>
          <LedgerDivider />
          <CategoryStack stats={stats} />
        </>
      )}

      {stats.byMonth.some((m) => m.spent > 0) && (
        <>
          <LedgerDivider />
          <MonthSparkline byMonth={stats.byMonth} />
        </>
      )}

      {yearTrips.length > 0 && (
        <>
          <LedgerDivider />
          <TripList trips={yearTrips} year={heroYear} goTrip={goTrip} />
        </>
      )}

      {previousYears.length > 0 && (
        <>
          <LedgerDivider />
          <PreviousYears years={previousYears} />
        </>
      )}

      <LedgerFooter stats={stats} />
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────
// Tiny label + very large year number. The year is the page anchor
// (and someday the year selector — for now read-only). Type chosen:
// Geist 600 large; size carries authority, not the font itself.
function YearHero({ year }) {
  return (
    <div style={{
      padding: '20px 22px 18px', textAlign: 'center',
    }}>
      <div style={{
        fontSize: 12, fontWeight: 500, color: 'var(--ink-mute)',
        marginBottom: 6, letterSpacing: 0,
      }}>{window.isRTL ? 'سنة السفر والترحال' : 'Travel year'}</div>
      <div style={{
        fontFamily: 'var(--sans)',
        fontSize: 'clamp(80px, 22vw, 128px)',
        fontWeight: 600, lineHeight: 1,
        color: 'var(--ink)',
        letterSpacing: '-0.05em',
        fontVariantNumeric: 'tabular-nums',
      }}>{year}</div>
    </div>
  );
}

// ── Editorial sentence ────────────────────────────────────────
// Composed natural-language paragraph with bolded inline counts.
// Max ~42ch so it doesn't sprawl on wider phones. Centered to match
// the hero, ink-soft so the numbers (ink, semibold) carry emphasis.
function LedgerSentence({ row }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  const trips     = row.trips || 0;
  const countries = row.countries || 0;
  const days      = row.days || 0;
  const spent     = row.spent || 0;
  const dailyAvg  = days > 0 ? spent / days : 0;
  return (
    <div style={{
      padding: '0 22px',
      display: 'flex', justifyContent: 'center',
    }}>
      <p style={{
        margin: 0, maxWidth: '42ch', textAlign: 'center',
        fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)',
        fontWeight: 400,
      }}>
        {isAr ? (
          <>
            خضت <LN>{window.arPlural(trips, { one: 'رحلة واحدة', two: 'رحلتين', few: `${trips} رحلات`, many: `${trips} رحلة`, other: `${trips} رحلة` })}</LN>{' '}
            شملت <LN>{window.arPlural(countries, { one: 'وجهة دولية واحدة', two: 'وجهتين دوليتين', few: `${countries} وجهات دولية`, many: `${countries} وجهة دولية`, other: `${countries} وجهة دولية` })}</LN>{' '}
            عبر <LN>{window.arPlural(days, { one: 'يوم سفر واحد', two: 'يومي سفر', few: `${days} أيام سفر`, many: `${days} يوماً من السفر`, other: `${days} يوم سفر` })}</LN>.{' '}
            بلغ إجمالي إنفاقك <LN>{fmt(spent)}</LN>
            {days > 0 && <> بمعدل يومي قدره <LN>{fmt(dailyAvg)}</LN></>}.
          </>
        ) : (
          <>
            <LN>{trips}</LN> {trips === 1 ? 'trip' : 'trips'},
            in <LN>{countries}</LN> {countries === 1 ? 'country' : 'countries'},
            across <LN>{days}</LN> {days === 1 ? 'day' : 'days'} of travel.
            You spent <LN>{fmt(spent)}</LN>
            {days > 0 && <>, averaging <LN>{fmt(dailyAvg)}</LN> a day</>}.
          </>
        )}
      </p>
    </div>
  );
}

// Inline number/proper-noun emphasis used throughout the ledger.
// Geist 700, ink-colored, no size change so it reads as inline bold
// rather than as a separate headline.
function LN({ children }) {
  return (
    <span style={{
      fontWeight: 700, color: 'var(--ink)',
      letterSpacing: '-0.005em',
    }}>{children}</span>
  );
}

// ── Notable trips ─────────────────────────────────────────────
// Two-column inline facts: Longest + Biggest. Lifetime scope (the
// trip name appears in Cormorant italic, the one earned brand
// moment in this chapter). Stats below in sans semibold. No card.
function NotableTrips({ stats }) {
  const longest = stats.longestTrip;
  const expensive = stats.mostExpensive;
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  if (!longest && !expensive) return null;

  // If the longest trip IS also the most expensive (common for big
  // international trips), collapse to a single centered entry showing
  // both stats. Rendering the same trip name twice in adjacent columns
  // looks broken; a combined entry reads as "this one trip carried
  // both records," which is actually the real insight.
  const sameTrip = longest && expensive && longest.id === expensive.id;
  if (sameTrip) {
    return (
      <ChapterFrame title={isAr ? 'المحطة الأبرز في رحلاتك' : 'Notable trip'}
                    subtitle={isAr ? 'الرحلة الأطول والأكثر إنفاقاً بين أسفارك' : 'longest and biggest of all your travel'}>
        <div style={{ padding: '0 22px', textAlign: 'center' }}>
          <div className="serif-italic" style={{
            fontSize: 26, lineHeight: 1.2, color: 'var(--ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{longest.title}</div>
          <div className="mono" style={{
            marginTop: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {isAr
              ? `استغرقت ${window.arPlural(longest.dur, { one: 'يوماً واحداً', two: 'يومين', few: `${longest.dur} أيام`, many: `${longest.dur} يوماً`, other: `${longest.dur} يوماً` })}`
              : `${longest.dur} ${longest.dur === 1 ? 'day' : 'days'}`}
            <span style={{ color: 'var(--ink-mute)' }}> · {isAr ? 'بإجمالي' : ''} </span>
            {window.fmtTripMoney(expensive.spent, expensive)}
          </div>
        </div>
      </ChapterFrame>
    );
  }

  return (
    <ChapterFrame title={isAr ? 'محطات بارزة في رحلاتك' : 'Notable trips'}
                  subtitle={isAr ? 'مقتطفات متميزة من كافة أسفارك' : 'across all your travel'}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: longest && expensive ? '1fr 1fr' : '1fr',
        gap: 24, padding: '0 22px',
      }}>
        {longest && (
          <NotableEntry
            label={isAr ? 'الرحلة الأطول' : 'Longest'}
            name={longest.title}
            stat={isAr
              ? window.arPlural(longest.dur, { one: 'يوم واحد', two: 'يومان', few: `${longest.dur} أيام`, many: `${longest.dur} يوماً`, other: `${longest.dur} يوم` })
              : `${longest.dur} ${longest.dur === 1 ? 'day' : 'days'}`}
          />
        )}
        {expensive && (
          <NotableEntry
            label={isAr ? 'الرحلة الأعلى إنفاقاً' : 'Biggest'}
            name={expensive.title}
            stat={window.fmtTripMoney(expensive.spent, expensive)}
          />
        )}
      </div>
    </ChapterFrame>
  );
}

function NotableEntry({ label, name, stat }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 11, fontWeight: 500, color: 'var(--ink-mute)',
        marginBottom: 6,
      }}>{label}</div>
      <div className="serif-italic" style={{
        fontSize: 22, lineHeight: 1.2, color: 'var(--ink)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        padding: '0 4px',
      }}>{name}</div>
      <div className="mono" style={{
        marginTop: 4, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)',
        fontVariantNumeric: 'tabular-nums',
      }}>{stat}</div>
    </div>
  );
}

// ── Category stack ────────────────────────────────────────────
// Single thin stacked bar showing lifetime category proportions, then
// a legend with amount + percent per row. Replaces the donut + legend
// card. Labeled clearly as lifetime so it isn't misread as per-year.
function CategoryStack({ stats }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  const CAT_COLOR = {
    lodging: 'var(--clay)', food: 'var(--honey)', transit: 'var(--moss)',
    culture: 'var(--indigo)', misc: 'var(--ink-mute)',
  };
  const cats = stats.byCategory.slice(0, 5);
  const total = cats.reduce((s, c) => s + c.value, 0);
  if (total === 0) return null;
  return (
    <ChapterFrame title={isAr ? 'أين تذهب ميزانيتك؟' : 'How you spend'}
                  subtitle={isAr ? 'تحليل المصروفات لكافة الرحلات' : 'across all your travel'}>
      <div style={{ padding: '0 28px' }}>
        {/* Stacked bar — flex strip with each category as a flex-grown
           segment. White hairline between segments for definition. */}
        <div style={{
          display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden',
          boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.05)',
        }}>
          {cats.map((c, i) => (
            <div key={c.key} style={{
              flex: c.value,
              background: CAT_COLOR[c.key] || 'var(--ink-mute)',
              boxShadow: i > 0
                ? `inset ${window.isRTL ? '-' : ''}2px 0 0 var(--cream)`
                : 'none',
            }} />
          ))}
        </div>

        {/* Legend rows — dot + label + amount + percent. */}
        <div style={{
          marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {cats.map((c) => (
            <div key={c.key} style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              flexDirection: 'row',
            }}>
              <span style={{
                width: 9, height: 9, borderRadius: 3,
                background: CAT_COLOR[c.key] || 'var(--ink-mute)',
                flexShrink: 0, transform: 'translateY(1px)',
              }} />
              <span style={{
                flex: 1, fontSize: 13.5, color: 'var(--ink)',
                textAlign: 'start',
              }}>{t(c.key) || c.key}</span>
              <span className="mono" style={{
                fontSize: 13, fontWeight: 600, color: 'var(--ink)',
                fontVariantNumeric: 'tabular-nums',
              }}>{fmt(c.value)}</span>
              <span className="mono" style={{
                fontSize: 12, color: 'var(--ink-mute)',
                minWidth: 32, textAlign: 'end',
                fontVariantNumeric: 'tabular-nums',
              }}>{Math.round(c.pct)}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChapterFrame>
  );
}

// ── Month sparkline ───────────────────────────────────────────
// Tiny 12-month sparkline — 36px tall bars, hairline baseline, current
// month gets a clay tint. Replaces the 150px-tall monthly chart card.
// Below: a single line of micro-context (busiest month + days).
function MonthSparkline({ byMonth }) {
  const isAr = !!window.isRTL;
  const maxVal = Math.max(...byMonth.map((m) => m.spent || 0), 1);
  const now = new Date();
  const isCurrent = (m) => m.year === now.getFullYear() && m.month === now.getMonth();
  // sqrt scaling so smaller months stay distinguishable when one big
  // outlier pushes the linear max.
  const heightOf = (m) => m.spent > 0
    ? Math.max(Math.sqrt(m.spent / maxVal) * 100, 8)
    : 4;
  const monthShort = (m) => new Date(2000, m.month, 1)
    .toLocaleDateString(isAr ? 'ar' : 'en', { month: 'short' });
  // Busiest month for the micro-context line
  const busiest = byMonth.reduce((m, x) => (x.spent || 0) > (m?.spent || 0) ? x : m, null);
  return (
    <ChapterFrame title={isAr ? 'مواسم السفر والترحال' : 'When you travel'}
                  subtitle={isAr ? 'تفاصيل النشاط خلال آخر 12 شهراً' : 'last 12 months'}>
      <div style={{ padding: '0 26px' }}>
        {/* Bars — fixed 40px row, hairline baseline */}
        <div style={{ position: 'relative', height: 40 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            gap: 4, height: '100%',
          }}>
            {byMonth.map((m) => {
              const h = heightOf(m);
              const cur = isCurrent(m);
              return (
                <div key={m.key} style={{
                  flex: 1, height: '100%',
                  display: 'flex', alignItems: 'flex-end', minWidth: 0,
                }}>
                  <div style={{
                    width: '100%', height: `${h}%`,
                    background: m.spent === 0
                      ? 'var(--hairline-2)'
                      : (cur ? 'var(--clay)' : 'var(--ink-soft)'),
                    borderRadius: '2px 2px 0 0',
                    transition: 'background 200ms',
                  }} />
                </div>
              );
            })}
          </div>
          {/* Baseline */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: 0.5, background: 'var(--hairline)',
          }} />
        </div>
        {/* Month labels — separate row, aligned to the columns */}
        <div style={{
          display: 'flex', gap: 4, marginTop: 6,
        }}>
          {byMonth.map((m) => (
            <div key={m.key} style={{
              flex: 1, textAlign: 'center', minWidth: 0,
              fontSize: 9.5, fontFamily: 'var(--mono)',
              color: isCurrent(m) ? 'var(--clay-deep)' : 'var(--ink-mute)',
              fontWeight: isCurrent(m) ? 600 : 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{monthShort(m)}</div>
          ))}
        </div>
        {/* Micro-context */}
        {busiest && busiest.spent > 0 && (
          <div style={{
            marginTop: 14, fontSize: 12.5, color: 'var(--ink-soft)',
            textAlign: 'center',
          }}>
            {isAr ? 'الشهر الأنشط' : 'Busiest'}:{' '}
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
              {monthShort(busiest)} {busiest.year}
            </span>
            {' · '}
            <span className="mono" style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>
              {window.fmtMoney(busiest.spent, { in: 'home' })}
            </span>
          </div>
        )}
      </div>
    </ChapterFrame>
  );
}

// ── Trip list ─────────────────────────────────────────────────
// Chronological list of the current year's trips. Each row is a
// button → opens that trip's analytics. Title + dates + duration + spend.
function TripList({ trips, year, goTrip }) {
  const isAr = !!window.isRTL;
  // Each trip row formats in ITS OWN currency via fmtTripMoney. The
  // tripSpend objects now carry homeCurrency + fx (enriched in
  // loadLifetimeStats) so the displayed amount matches what the user
  // sees inside that specific trip, regardless of which trip they
  // last opened. Without this, all trip rows here rendered at
  // window.TRIP's current rate and the same trip showed different
  // numbers across navigation states.
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  const monthDay = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString(isAr ? 'ar' : 'en', { month: 'short', day: 'numeric' });
  };
  return (
    <ChapterFrame title={isAr ? `حصاد رحلات عام ${year}` : `Trips in ${year}`}
                  subtitle={isAr
                    ? `خضت فيها ${window.arPlural(trips.length, { one: 'رحلة واحدة', two: 'رحلتين', few: `${trips.length} رحلات`, many: `${trips.length} رحلة`, other: `${trips.length} رحلة` })}`
                    : `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'}`}>
      <div style={{
        padding: '0 22px',
        display: 'flex', flexDirection: 'column',
      }}>
        {trips.map((tr, i) => {
          const dateRange = tr.startDate && tr.endDate
            ? `${monthDay(tr.startDate)} – ${monthDay(tr.endDate)}`
            : '—';
          return (
            <button key={tr.id}
              onClick={() => goTrip?.(tr.id)}
              aria-label={isAr ? `فتح تفاصيل ${tr.title}` : `Open ${tr.title}`}
              style={{
                all: 'unset', cursor: 'pointer', width: '100%',
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 12, alignItems: 'baseline',
                padding: '14px 0',
                borderTop: i > 0 ? '0.5px solid var(--hairline)' : 'none',
              }}>
              {/* Title + dates */}
              <div style={{ minWidth: 0 }}>
                <div className="serif-italic" style={{
                  fontSize: 18, color: 'var(--ink)', lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{tr.title}</div>
                <div style={{
                  marginTop: 3, fontSize: 12, color: 'var(--ink-mute)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  flexDirection: 'row',
                }}>
                  <span>{dateRange}</span>
                  <span>·</span>
                  <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {isAr
                      ? window.arPlural(tr.dur, { one: 'يوم واحد', two: 'يومان', few: `${tr.dur} أيام`, many: `${tr.dur} يوماً`, other: `${tr.dur} يوماً` })
                      : `${tr.dur} ${tr.dur === 1 ? 'day' : 'days'}`}
                  </span>
                </div>
              </div>
              {/* Amount */}
              <div className="mono" style={{
                fontSize: 15, fontWeight: 600, color: 'var(--ink)',
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'end',
              }}>{window.fmtTripMoney(tr.spent, tr)}</div>
            </button>
          );
        })}
      </div>
    </ChapterFrame>
  );
}

// ── Previous years footer ─────────────────────────────────────
// Quiet rows, year + small totals. v1 is read-only; v2 will make rows
// tappable to switch the whole ledger to that year (needs per-year
// breakdown in data layer first).
function PreviousYears({ years }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  return (
    <ChapterFrame title={isAr ? 'أرشيف السنوات السابقة' : 'Previous years'}>
      <div style={{
        padding: '0 22px',
        display: 'flex', flexDirection: 'column',
      }}>
        {years.map((y, i) => (
          <div key={y.year} style={{
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', gap: 12,
            padding: '12px 0',
            borderTop: i > 0 ? '0.5px solid var(--hairline)' : 'none',
            flexDirection: 'row',
          }}>
            <div style={{
              fontSize: 16, fontWeight: 600, color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}>{y.year}</div>
            <div style={{
              flex: 1, textAlign: 'end',
              fontSize: 12.5, color: 'var(--ink-mute)',
            }}>
              {isAr
                ? `شملت ${window.arPlural(y.trips || 0, { zero: 'لا توجد رحلات', one: 'رحلة واحدة', two: 'رحلتين', few: `${y.trips} رحلات`, many: `${y.trips} رحلة`, other: `${y.trips} رحلة` })}`
                : `${y.trips || 0} ${(y.trips || 0) === 1 ? 'trip' : 'trips'}`}
              {' · '}
              {isAr ? 'بإجمالي ' : ''}
              <span className="mono" style={{
                color: 'var(--ink-soft)', fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}>{fmt(y.spent)}</span>
            </div>
          </div>
        ))}
      </div>
    </ChapterFrame>
  );
}

// ── Footer / imprint ──────────────────────────────────────────
// Wordmark + tiny lifetime totals — closes the page like a magazine
// imprint. The wordmark serif is the brand moment the page earns.
function LedgerFooter({ stats }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: 'home' });
  return (
    <div style={{
      padding: '48px 22px 24px', textAlign: 'center',
    }}>
      <div className="wordmark" style={{
        fontSize: 28, color: 'var(--ink-soft)', lineHeight: 1,
      }}>voyage</div>
      <div style={{
        marginTop: 10, fontSize: 11.5, color: 'var(--ink-mute)',
        lineHeight: 1.6,
      }}>
        {isAr
          ? <>السجل الكلي للترحال: {window.arPlural(stats.totalTrips, { one: 'رحلة واحدة', two: 'رحلتان', few: `${stats.totalTrips} رحلات`, many: `${stats.totalTrips} رحلة`, other: `${stats.totalTrips} رحلة` })} · شملت {window.arPlural(stats.countries, { one: 'وجهة دولية واحدة', two: 'وجهتين دوليتين', few: `${stats.countries} وجهات دولية`, many: `${stats.countries} وجهة دولية`, other: `${stats.countries} وجهة دولية` })}<br />
              على مدار {window.arPlural(stats.totalDays, { one: 'يوم واحد', two: 'يومين', few: `${stats.totalDays} أيام`, many: `${stats.totalDays} يوماً`, other: `${stats.totalDays} يوماً` })} من السفر · بإجمالي إنفاق <span className="mono">{fmt(stats.totalSpentUSD)}</span></>
          : <>Lifetime: {stats.totalTrips} {stats.totalTrips === 1 ? 'trip' : 'trips'} · {stats.countries} {stats.countries === 1 ? 'country' : 'countries'}<br />
              {stats.totalDays} {stats.totalDays === 1 ? 'day' : 'days'} of travel · <span className="mono">{fmt(stats.totalSpentUSD)}</span></>}
      </div>
    </div>
  );
}

// ── Shared chapter chrome ─────────────────────────────────────
// Centered title + optional smaller subtitle, with the standard
// generous top padding the ledger uses for vertical rhythm. Children
// render below.
function ChapterFrame({ title, subtitle, children }) {
  return (
    <div style={{ padding: '32px 0 0' }}>
      <div style={{
        padding: '0 22px 16px', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--ink)',
          letterSpacing: '-0.01em',
        }}>{title}</div>
        {subtitle && (
          <div style={{
            marginTop: 3, fontSize: 11, color: 'var(--ink-mute)',
          }}>{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  );
}

// Hairline rule between chapters. Centered, with breathing room. The
// rule itself is short (~120px max) so it reads as a punctuation mark,
// not a visual barrier.
function LedgerDivider() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      padding: '0 22px', marginTop: 32,
    }}>
      <div style={{
        width: 'min(120px, 30%)', height: 0.5,
        background: 'var(--ink-mute)', opacity: 0.4,
      }} />
    </div>
  );
}

window.ScreenInsights = ScreenInsights;
