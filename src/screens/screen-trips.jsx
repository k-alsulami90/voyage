// Global Trips Dashboard — top-level page (app-scoped, NOT trip-scoped).
// Lists private + shared trips, with cumulative travel insights at the top.
// Each trip card is state-aware: current trips show live progress, upcoming
// trips show countdown, past trips show a completed badge + total.

// ── Trip state helpers ──────────────────────────────────────
// We compute the temporal state from start/end dates, not just the DB status,
// so the UI is always correct (DB status can drift if cron doesn't run).
function tripTemporalState(trip) {
  if (!trip?.startDate || !trip?.endDate) return { kind: trip?.status || 'upcoming' };
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate); start.setHours(0, 0, 0, 0);
  const end = new Date(trip.endDate); end.setHours(0, 0, 0, 0);
  const ms = 86400000;
  if (now < start) {
    const daysUntil = Math.round((start - now) / ms);
    return { kind: 'upcoming', daysUntil };
  }
  if (now > end) {
    const totalDays = Math.max(1, Math.round((end - start) / ms) + 1);
    return { kind: 'past', totalDays };
  }
  const dayN = Math.min(Math.max(1, Math.round((now - start) / ms) + 1), Math.round((end - start) / ms) + 1);
  const totalDays = Math.round((end - start) / ms) + 1;
  return { kind: 'current', dayN, totalDays, daysRemaining: totalDays - dayN };
}

function ScreenTrips({ goTrip, go }) {
  const [scope, setScope] = React.useState('all'); // all | private | shared
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [initialLoad, setInitialLoad] = React.useState(!window.TRIPS || window.TRIPS.length === 0);
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || null);
  // Tick once a minute so the relative time labels ("in 25m", "Now")
  // stay fresh while the page is open.
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Smart Track candidate trip — must compute BEFORE any early return so
  // the React hook order stays stable across renders.
  const smartTripCandidate = (() => {
    const list = (window.TRIPS || []).map((trip) => ({ ...trip, state: tripTemporalState(trip) }));
    return list.find((t) => t.state.kind === 'current')
        || list.find((t) => t.state.kind === 'upcoming')
        || null;
  })();
  React.useEffect(() => {
    if (!smartTripCandidate) return;
    if (window.TRIP?.id === smartTripCandidate.id) return;
    window.loadTripData?.(smartTripCandidate.id);
  }, [smartTripCandidate?.id]);

  // Lazy-load lifetime stats once trips exist
  React.useEffect(() => {
    if (!stats && window.TRIPS && window.TRIPS.length > 0 && window.loadLifetimeStats) {
      window.loadLifetimeStats().then((s) => setStats(s)).catch(() => {});
    }
  }, [stats, window.TRIPS?.length]);

  // Mark initial load complete once TRIPS appears
  React.useEffect(() => {
    if ((window.TRIPS || []).length > 0) setInitialLoad(false);
    else {
      const t = setTimeout(() => setInitialLoad(false), 2000);
      return () => clearTimeout(t);
    }
  }, [window.TRIPS?.length]);

  // Show skeleton if we're waiting for the first load and have no data
  if (initialLoad && (!window.TRIPS || window.TRIPS.length === 0)) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <div style={{ padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px' }}>
          <Skeleton w={120} h={12} style={{ marginBottom: 8 }} />
          <Skeleton w={200} h={28} r={6} />
        </div>
        <div style={{ padding: '0 14px' }}>
          <Skeleton h={180} r={28} style={{ marginBottom: 24 }} />
          <Skeleton h={48} r={14} style={{ marginBottom: 12 }} />
          <Skeleton h={48} r={14} style={{ marginBottom: 12 }} />
          <Skeleton h={48} r={14} />
        </div>
      </div>
    );
  }

  // Compute temporal state for every trip once per render
  const enrichedTrips = (window.TRIPS || []).map((trip) => ({
    ...trip,
    state: tripTemporalState(trip),
  }));

  const matchesScope  = (t) => scope === 'all' || (scope === 'shared' ? t.shared : !t.shared);
  const matchesSearch = (t) => !search || (t.title || '').toLowerCase().includes(search.toLowerCase());

  const trips    = enrichedTrips.filter((t) => matchesScope(t) && matchesSearch(t));
  // ALL current trips — a traveler can have two overlapping live trips at
  // once (e.g. a long regional trip + a short side trip). Previously this
  // was a singular `.find`, so the second concurrent trip showed in no
  // section at all and silently disappeared from the home screen.
  const current  = enrichedTrips.filter((t) => t.state.kind === 'current');
  const upcoming = enrichedTrips.filter((t) => t.state.kind === 'upcoming');
  const past     = enrichedTrips.filter((t) => t.state.kind === 'past');

  // Compute upcoming events when the candidate's data is loaded.
  const events = (smartTripCandidate && window.TRIP?.id === smartTripCandidate.id)
    ? (window.computeUpcomingEvents?.() || [])
    : [];
  const nextEvent  = events[0] || null;
  const followups  = events.slice(1, 4);

  return (
    <div data-screen-label="00 Trips Home" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* Header — no duplicate Insights button. The bottom tab bar already
         carries Insights as a labeled tab; the duplicate sparkle button
         here was unlabeled and stole focus on a first-time visit. */}
      <LargeTitleHeader
        title={t('yourTravels')}
        subtitle={t('heySunday')}
      />

      {/* GLOBAL INSIGHTS CARD — editorial composition.
         Card surface stays (visual anchor for the page) but the structural
         slop inside it is gone: no 56px hero-metric serif number, no
         identical 3-tile mini KPI grid, no uppercase mono eyebrow. The
         body reads as a sentence; numbers carry hierarchy via weight,
         not via tile frames. */}
      {stats && stats.totalTrips > 0 && (
        <div style={{ padding: '0 14px' }}>
          <button onClick={() => go('insights')}
            aria-label={window.isRTL
              ? `افتح الإحصائيات — ${stats.totalTrips} رحلات، ${stats.totalDays} يوم سفر`
              : `Open insights — ${stats.totalTrips} trips, ${stats.totalDays} travel days`}
            style={{
            all: 'unset', cursor: 'pointer',
            width: '100%', boxSizing: 'border-box',
            background: 'var(--statement)', color: 'var(--statement-fg)',
            borderRadius: 26, padding: '20px 22px',
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            display: 'block',
          }}>
            {/* Subtle single-direction glow — replaces the dual-aurora
               SaaS-dashboard gradient. One warm wash, low chroma, off
               to one corner. */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(70% 60% at 100% 0%, oklch(0.45 0.10 35 / 0.42) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative' }}>
              {/* Editorial sentence. No eyebrow above it — the sentence
                 IS the section label. */}
              <div style={{
                fontSize: 17, lineHeight: 1.45,
                color: 'var(--statement-sub)',
                fontWeight: 400,
              }}>
                {window.isRTL ? (
                  <>
                    خضت <NumSpan>{window.arPlural(stats.totalTrips, { one: 'رحلة واحدة', two: 'رحلتين', few: `${stats.totalTrips} رحلات`, many: `${stats.totalTrips} رحلة`, other: `${stats.totalTrips} رحلة` })}</NumSpan>
                    {' · '}
                    على مدار <NumSpan>{window.arPlural(stats.totalDays, { one: 'يوم واحد', two: 'يومين', few: `${stats.totalDays} أيام`, many: `${stats.totalDays} يوماً`, other: `${stats.totalDays} يوماً` })}</NumSpan> من السفر
                    {' · '}
                    شملت <NumSpan>{window.arPlural(stats.countries, { one: 'دولة واحدة', two: 'دولتين', few: `${stats.countries} دول`, many: `${stats.countries} دولة`, other: `${stats.countries} دولة` })}</NumSpan>
                  </>
                ) : (
                  <>
                    <NumSpan>{stats.totalTrips}</NumSpan> {stats.totalTrips === 1 ? 'trip' : 'trips'}
                    {' · '}
                    <NumSpan>{stats.totalDays}</NumSpan> travel days
                    {' · '}
                    <NumSpan>{stats.countries}</NumSpan> {stats.countries === 1 ? 'country' : 'countries'}
                  </>
                )}
              </div>

              {/* Headline row — spend on the left, "See insights" on the
                 right. The chevron affordance ships even when spend is
                 $0 (new trip with no expenses logged yet) so the card
                 doesn't *look* untappable in that state. */}
              <div style={{
                marginTop: 10,
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                gap: 8, flexDirection: 'row',
              }}>
                {stats.totalSpentUSD > 0 ? (
                  <div className="mono" style={{
                    fontSize: 26, fontWeight: 600,
                    color: 'var(--statement-fg)', letterSpacing: '-0.02em',
                  }}>
                    {window.fmtMoney(stats.totalSpentUSD, { in: 'home' })}
                  </div>
                ) : (
                  // Keep the row anchored even with no spend yet — empty
                  // span pushes the affordance to the trailing edge.
                  <span />
                )}
                <div style={{
                  fontSize: 12, color: 'var(--statement-sub)',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  flexDirection: 'row',
                }}>
                  {window.isRTL ? 'عرض الإحصائيات' : 'See insights'}
                  <span className="icon-flip"><IconChevron size={12} stroke="currentColor" /></span>
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* SCOPE FILTER — chips for private vs shared */}
      <div style={{ padding: '20px 22px 10px' }}>
        <div style={{ display: 'flex', gap: 6, flexDirection: 'row' }}>
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
          {/* Was 30x30 which is below the iOS HIG thumb-zone floor.
             38x38 keeps it close to the chip row visually but gives
             distracted-mobile users (Casey) a target they can actually
             hit one-handed without mis-tapping a chip. */}
          <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }}
            aria-label={window.isRTL ? 'بحث عن رحلة' : 'Search trips'} style={{
            width: 38, height: 38, borderRadius: 999,
            background: showSearch ? 'var(--ink)' : 'var(--cream-2)',
            border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
            flexShrink: 0,
          }}><IconSearch size={15} stroke={showSearch ? 'var(--cream)' : 'var(--ink-soft)'} /></button>
        </div>
        {showSearch && (
          <div style={{ marginTop: 10 }}>
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={window.isRTL ? 'ابحث عن رحلة...' : 'Search trips...'}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--hairline-2)', background: 'var(--cream-2)',
                color: 'var(--ink)', fontSize: 13.5, outline: 'none',
                textAlign: 'start',
              }} />
          </div>
        )}
      </div>

      {/* SMART TRACK — next time-anchored event (flight, check-in, pickup) */}
      {nextEvent && scope === 'all' && (
        <div style={{ padding: '4px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'الحدث القادم' : 'Up next'}</SectionLabel>
          <SmartTrackCard event={nextEvent} trip={smartTripCandidate} onOpenTrip={() => goTrip(smartTripCandidate.id)} />
          {followups.length > 0 && (
            <div style={{
              marginTop: 8, background: 'var(--cream-2)', borderRadius: 18,
              border: '0.5px solid var(--hairline)', overflow: 'hidden',
            }}>
              {followups.map((ev, i) => (
                <SmartTrackRow key={ev.id} event={ev} last={i === followups.length - 1}
                  onOpenTrip={() => goTrip(smartTripCandidate.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CURRENT TRIP — live progress card */}
      {(() => {
        const live = current.filter((tr) => scope === 'all' || scope === (tr.shared ? 'shared' : 'private'));
        if (live.length === 0) return null;
        return (
          <div style={{ padding: '4px 14px 0' }}>
            <SectionLabel>{t('currentlyTraveling')}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {live.map((tr) => (
                <CurrentTripCard key={tr.id} trip={tr} onOpen={() => goTrip(tr.id)} />
              ))}
            </div>
          </div>
        );
      })()}

      {/* UPCOMING — countdown cards in horizontal scroller */}
      {upcoming.length > 0 && (scope === 'all') && (
        <div style={{ padding: '24px 0 0' }}>
          <SectionLabel>{t('upcoming')}</SectionLabel>
          <div style={{ display: 'flex', gap: 12, padding: '0 22px 4px', overflowX: 'auto' }} className="no-scrollbar">
            {upcoming.map((trip) => (
              <UpcomingTripCard key={trip.id} trip={trip} onOpen={() => goTrip(trip.id)} />
            ))}
          </div>
        </div>
      )}

      {/* PAST — completed rows with total spend */}
      {past.length > 0 && (scope === 'all' || past.some((x) => scope === (x.shared ? 'shared' : 'private'))) && (
        <div style={{ padding: '24px 14px 0' }}>
          <SectionLabel>{t('pastTrips')}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
            {trips.filter((tr) => tr.state.kind === 'past').map((trip) => (
              <PastTripCard key={trip.id} trip={trip} onOpen={() => goTrip(trip.id)} />
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
            {window.isRTL ? 'ستظهر تفاصيل رحلاتك هنا بمجرد إنشائها' : 'Your trips will appear here once created'}
          </div>
        </div>
      )}

      {/* Crew-privacy notice removed from the home page per user request —
         the same message lives in App Settings (tripScopedCollab/Sub). */}
    </div>
  );
}

// ── CURRENT trip card — large hero, live "Day N of M", live progress ──
function CurrentTripCard({ trip, onOpen }) {
  const { dayN, totalDays, daysRemaining } = trip.state;
  return (
    <button onClick={onOpen} style={{
      width: '100%', textAlign: 'start', borderRadius: 28,
      overflow: 'hidden', position: 'relative',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
        <CoverArt kind={trip.cover} imageUrl={trip.coverUrl || trip.coverImageUrl} />
        {/* LIVE pill — pulsing green dot */}
        <div className="glass" style={{
          position: 'absolute', top: 14, insetInlineStart: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 11px 5px 9px', borderRadius: 999,
          background: 'rgba(0,0,0,0.40)', color: '#fff',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: 999,
            background: 'oklch(0.78 0.18 145)',
            boxShadow: '0 0 8px oklch(0.78 0.18 145)',
            animation: 'pulse 1.6s ease-in-out infinite',
          }} />
          <span>{window.isRTL ? 'الآن' : 'LIVE'}</span>
        </div>
        {/* Day N of M */}
        <div className="glass" style={{
          position: 'absolute', top: 14, insetInlineEnd: 14,
          padding: '5px 11px', borderRadius: 999,
          background: 'rgba(0,0,0,0.40)', color: '#fff',
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 0,
          fontWeight: 600,
        }}>{t('dayOfTotal', { n: dayN, total: totalDays })}</div>
        {/* Title overlay */}
        <div style={{
          position: 'absolute', bottom: 14, insetInlineStart: 18, insetInlineEnd: 18,
          color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}>
          <div className="serif-italic" style={{ fontSize: 36, lineHeight: 1 }}>{trip.title}</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
            {trip.sub || (window.isRTL ? window.arPlural?.(daysRemaining, { zero: 'لا توجد أيام متبقية', one: 'يوم واحد متبقٍ', two: 'يومان متبقيان', few: `${daysRemaining} أيام متبقية`, many: `${daysRemaining} يوماً متبقياً`, other: `${daysRemaining} يوم متبقٍ` }) || `${daysRemaining} أيام متبقية` : `${daysRemaining} days remaining`)}
          </div>
        </div>
      </div>
      {/* Interlocking budget tracker bar */}
      <div style={{
        margin: '-22px 14px 0', position: 'relative',
        background: 'var(--cream)', borderRadius: 18,
        padding: '12px 14px',
        boxShadow: 'var(--shadow-md)',
        border: '0.5px solid var(--hairline)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {trip.members > 0 && <AvatarStack members={window.MEMBERS.slice(0, trip.members)} size={26} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>
            {window.isRTL ? 'الميزانية المستهلكة' : 'Budget used'}
          </div>
          <div style={{
            height: 5, marginTop: 4, borderRadius: 3,
            background: 'var(--sand)', overflow: 'hidden',
          }}>
            {/* Track is full-width; the fill scales via transform so the
               animation runs on the compositor (no layout reflow). Origin
               is leading-edge in both LTR and RTL. */}
            <div style={{
              width: '100%', height: '100%',
              background: trip.budgetPct > 100 ? 'var(--clay-deep)' : 'var(--clay)',
              transform: `scaleX(${Math.min(trip.budgetPct, 100) / 100})`,
              transformOrigin: window.isRTL ? 'right center' : 'left center',
              transition: 'transform 380ms cubic-bezier(.2,.8,.2,1)',
              willChange: 'transform',
            }} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{trip.budgetPct}%</div>
        <span className="icon-flip"><IconChevron size={14} stroke="var(--ink-mute)" /></span>
      </div>
      <div style={{ height: 12 }} />
    </button>
  );
}

// ── UPCOMING trip card — countdown to launch ──
function UpcomingTripCard({ trip, onOpen }) {
  const { daysUntil } = trip.state;
  const countdownLabel =
    daysUntil === 0 ? t('startingToday') :
    daysUntil === 1 ? t('dayAway') :
    t('daysAway', { n: daysUntil });
  return (
    <button onClick={onOpen} style={{
      flexShrink: 0, width: 220, textAlign: 'start',
      borderRadius: 22, overflow: 'hidden',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
        <CoverArt kind={trip.cover} imageUrl={trip.coverUrl || trip.coverImageUrl} />
        {/* Countdown badge — top center */}
        <div className="glass" style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          padding: '5px 12px', borderRadius: 999,
          background: 'rgba(0,0,0,0.45)', color: '#fff',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
          backdropFilter: 'blur(8px)',
          display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
        }}>
          <IconClock size={11} stroke="#fff" />
          {countdownLabel}
        </div>
        {/* Country badge */}
        {trip.country && (
          <div className="glass" style={{
            position: 'absolute', top: 12, insetInlineStart: 10,
            padding: '4px 9px', borderRadius: 999, fontSize: 10.5,
            color: '#fff', background: 'rgba(0,0,0,0.40)',
            fontFamily: 'var(--mono)', letterSpacing: 0, fontWeight: 600,
          }}>{trip.country}</div>
        )}
        {trip.shared && (
          <div style={{ position: 'absolute', bottom: -10, insetInlineEnd: 14 }}>
            <AvatarStack members={window.MEMBERS.slice(0, trip.members)} size={22} />
          </div>
        )}
      </div>
      <div style={{ padding: '14px 14px 12px' }}>
        <div className="serif" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>{trip.title}</div>
        <div style={{
          fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.dates}</span>
          <BalancePill tripId={trip.id} />
        </div>
      </div>
    </button>
  );
}

// Personal balance pill — shows owed/owe for a shared trip.
// Formats using the SPECIFIC TRIP's currency + fx (via fmtTripMoney)
// so the displayed amount doesn't shift when the user opens / exits a
// different trip. Previously this used fmtMoney({in:'home'}) which
// reads window.TRIP -- the last-opened trip's currency was leaking
// into every trip card.
function BalancePill({ tripId, big = false }) {
  const balance = window.LIFETIME_STATS?.balanceByTrip?.[tripId];
  if (!balance || Math.abs(balance) < 0.5) return null;
  const trip = (window.TRIPS || []).find((t) => t.id === tripId);
  const owed = balance > 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: big ? '4px 10px' : '2px 8px', borderRadius: 999,
      background: owed ? 'oklch(0.50 0.08 155 / 0.15)' : 'oklch(0.62 0.13 35 / 0.15)',
      color:      owed ? 'var(--moss)' : 'var(--clay-deep)',
      fontSize: big ? 11.5 : 10, fontWeight: 600,
      fontFamily: 'var(--mono)', letterSpacing: '0.04em',
      flexShrink: 0,
    }}>
      {owed ? '+' : '−'} {window.fmtTripMoney(Math.abs(balance), trip)}
    </span>
  );
}

// ── PAST trip card — completed badge + total spend ──
function PastTripCard({ trip, onOpen }) {
  const { totalDays } = trip.state;
  // Real spent for this trip comes from LIFETIME_STATS.tripSpend (sum
  // of amount_usd across this trip's expenses). The old formula
  // `budgetPlannedUSD * budgetPct/100` was a stub estimate -- budgetPct
  // never gets populated on real data (only set in mock data.jsx), so
  // the displayed value was always 0 until a fluke side-effect of
  // opening another trip set it. Now we look up the authoritative
  // per-trip total directly.
  const tripStat = (window.LIFETIME_STATS?.tripSpend || [])
    .find((t) => t.id === trip.id);
  const spent = tripStat?.spent || 0;
  return (
    <button onClick={onOpen} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 18, textAlign: 'start', width: '100%',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
    }}>
      <div style={{
        width: 54, height: 54, borderRadius: 14, overflow: 'hidden',
        flexShrink: 0, position: 'relative',
      }}>
        <CoverArt kind={trip.cover} imageUrl={trip.coverUrl || trip.coverImageUrl} />
        {/* Completed check overlay */}
        <div style={{
          position: 'absolute', bottom: 4, insetInlineEnd: 4,
          width: 20, height: 20, borderRadius: 999,
          background: 'var(--moss)', display: 'grid', placeItems: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)', border: '1.5px solid #fff',
        }}><IconCheck size={11} stroke="#fff" /></div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="serif" style={{ fontSize: 17, lineHeight: 1.1, color: 'var(--ink)' }}>{trip.title}</span>
          {trip.shared && (
            <RoleBadgeMini icon={<IconUsers size={10} stroke="var(--ink-soft)" />} label={`${trip.members}`} />
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 8px', borderRadius: 999,
            background: 'oklch(0.50 0.08 155 / 0.14)',
            color: 'var(--moss)',
            fontSize: 10.5, fontWeight: 500,
            flexShrink: 0,
          }}>{t('completed')}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t('lastedDays', { n: totalDays })} · {trip.dates}
          </span>
        </div>
        {spent > 0 && (
          <div style={{
            fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 3,
            display: 'flex', alignItems: 'baseline', gap: 5, flexDirection: 'row',
          }}>
            <span className="mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>
              {window.fmtTripMoney(spent, trip)}
            </span>
            <span style={{ color: 'var(--ink-mute)' }}>{t('spentTotal').toLowerCase()}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <BalancePill tripId={trip.id} />
        <span className="icon-flip"><IconChevron size={14} stroke="var(--ink-mute)" /></span>
      </div>
    </button>
  );
}

function RoleBadgeMini({ icon, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      flexDirection: 'row',
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

// ──────────────────────────────────────────────────────────────
// Smart Track — hero card for the next time-anchored event
// (flight, hotel check-in, rental pick-up, or planned activity).
// ──────────────────────────────────────────────────────────────
// Smart Track now uses an event-type-tinted surface instead of a dark
// surface. Splits the previous "two dark cards" pattern: Insights
// stays dark (permanent summary), Smart Track is colored (contextual,
// time-anchored). Surface lightness is L 0.28-0.34 so white text hits
// AA on body and AAA on the title; chroma is high enough to read as
// the brand colour even on small previews.
const SMART_TRACK_PALETTES = {
  flight:        { surface: 'oklch(0.28 0.10 260)', glow: 'oklch(0.55 0.16 260)', chip: 'var(--indigo)' },
  lodging:       { surface: 'oklch(0.32 0.10 35)',  glow: 'oklch(0.60 0.14 35)',  chip: 'var(--clay)' },
  'lodging-out': { surface: 'oklch(0.32 0.10 35)',  glow: 'oklch(0.60 0.14 35)',  chip: 'var(--clay)' },
  transport:     { surface: 'oklch(0.34 0.08 75)',  glow: 'oklch(0.74 0.13 80)',  chip: 'var(--honey)' },
  plan:          { surface: 'oklch(0.30 0.09 155)', glow: 'oklch(0.55 0.13 155)', chip: 'var(--moss)' },
};
function getSmartTrackPalette(type) {
  return SMART_TRACK_PALETTES[type] || SMART_TRACK_PALETTES.plan;
}

function SmartTrackCard({ event, trip, onOpenTrip }) {
  const when = window.relativeWhenLabel(event.startAt);
  const isNow = /now|الآن/i.test(when);
  const palette = getSmartTrackPalette(event.type);

  return (
    <div style={{
      position: 'relative', borderRadius: 24, overflow: 'hidden',
      background: palette.surface, color: '#fff',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Top-corner brightness wash. Same hue as the surface but at higher
         lightness + chroma; lifts the corner without introducing a new
         color. Keeps the card identifiably one-colour. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(85% 60% at 100% 0%, ${palette.glow} 0%, transparent 60%)`,
        opacity: 0.38, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', padding: '18px 18px 16px' }}>
        {/* Status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: isNow ? palette.chip : 'rgba(255,255,255,0.14)',
          border: '0.5px solid rgba(255,255,255,0.20)',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
          letterSpacing: 0,
        }}>
          {isNow && <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#fff',
            boxShadow: '0 0 8px #fff', animation: 'pulse-fade 1.6s ease-in-out infinite',
          }} />}
          {when}
        </div>

        {/* Title row */}
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
        }}>
          {/* The icon chip used to be the accent color on a dark surface;
             now the surface IS the accent. So flip the chip to a light
             frosted treatment so it pops against the brand-tinted card. */}
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            border: '0.5px solid rgba(255,255,255,0.25)',
            display: 'grid', placeItems: 'center',
            backdropFilter: 'blur(8px)',
          }}>
            <SmartTrackTypeIcon type={event.type} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="serif" style={{
              fontSize: 22, lineHeight: 1.15, color: '#fff',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{event.title}</div>
            {event.detail && (
              <div className="mono" style={{
                fontSize: 13, color: 'rgba(255,255,255,0.86)', marginTop: 3,
                letterSpacing: '0.02em',
              }}>{event.detail}</div>
            )}
            {event.subtle && (
              <div style={{
                fontSize: 11.5, color: 'rgba(255,255,255,0.68)', marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{event.subtle}</div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        {(event.primaryFileUrl || event.secondaryFileUrl || event.locationUrl) && (
          <div style={{
            marginTop: 14, display: 'flex', gap: 8, flexDirection: 'row', flexWrap: 'wrap',
          }}>
            {event.secondaryFileUrl && (
              <ActionPill label={event.secondaryFileLabel || 'Open'} href={event.secondaryFileUrl}
                icon={<window.IconDoc size={13} stroke="currentColor" />} primary />
            )}
            {event.primaryFileUrl && (
              <ActionPill label={event.primaryFileLabel || 'Open file'} href={event.primaryFileUrl}
                icon={<window.IconDoc size={13} stroke="currentColor" />}
                primary={!event.secondaryFileUrl} />
            )}
            {event.locationUrl && (
              <ActionPill label={window.isRTL ? 'الموقع' : 'Location'} href={event.locationUrl}
                icon={<window.IconPin size={13} stroke="currentColor" />} />
            )}
            <button onClick={onOpenTrip} style={{
              padding: '8px 12px', borderRadius: 999,
              background: 'transparent', color: 'rgba(255,255,255,0.85)',
              border: '0.5px solid rgba(255,255,255,0.22)',
              fontSize: 12, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 5, flexDirection: 'row',
            }}>
              {window.isRTL ? 'الرحلة' : 'Trip'}
              <span className="icon-flip" style={{ opacity: 0.7 }}>
                <window.IconChevron size={11} stroke="currentColor" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Smaller secondary row, used for "later today" / follow-up events.
function SmartTrackRow({ event, last, onOpenTrip }) {
  const when = window.relativeWhenLabel(event.startAt);
  return (
    <div style={{
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
      borderTop: last ? 'none' : 'none',
      borderBottom: last ? 'none' : '0.5px solid var(--hairline)',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: event.type === 'flight' ? 'var(--indigo)'
                  : event.type === 'lodging' || event.type === 'lodging-out' ? 'var(--clay)'
                  : event.type === 'transport' ? 'var(--honey)' : 'var(--moss)',
        display: 'grid', placeItems: 'center',
      }}>
        <SmartTrackTypeIcon type={event.type} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{event.title}</div>
        <div style={{
          fontSize: 11, color: 'var(--ink-mute)', marginTop: 1,
          display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
        }}>
          <span>{when}</span>
          {event.detail && <span>· {event.detail}</span>}
        </div>
      </div>
      {/* Touch targets bumped per Casey persona red flag from the
         critique. Padding 11 + 14px icons puts the effective hit area
         around 36px instead of the previous 29px. Distracted thumb
         users (taxi, airport line) hit them now. */}
      {event.locationUrl && (
        <a href={event.locationUrl} target="_blank" rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={window.isRTL ? 'الموقع' : 'Location'} style={{
          minWidth: 36, minHeight: 36, padding: 11, borderRadius: 10,
          background: 'var(--cream)', color: 'var(--ink-soft)',
          border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center', textDecoration: 'none',
          boxSizing: 'border-box',
        }}><window.IconPin size={14} stroke="currentColor" /></a>
      )}
      <button onClick={onOpenTrip}
        aria-label={window.isRTL ? 'فتح تفاصيل الرحلة' : 'Open trip'} style={{
        minWidth: 36, minHeight: 36, padding: 11, borderRadius: 10,
        background: 'transparent', color: 'var(--ink-mute)',
        border: '0.5px solid var(--hairline)',
        display: 'grid', placeItems: 'center',
        boxSizing: 'border-box',
      }}><span className="icon-flip"><window.IconChevron size={14} stroke="currentColor" /></span></button>
    </div>
  );
}

// Sits on either the dark Insights card or the colored Smart Track surface.
// Primary = bright white pill with dark ink text (high-contrast CTA).
// Secondary = transparent with light border on whatever surface it's on.
function ActionPill({ label, href, icon, primary }) {
  // PRIMARY pill: white background, dark text. The text color is
  // HARDCODED to a dark slate (not var(--ink)) because var(--ink) flips
  // to near-white in dark mode, which made the white-on-white pill
  // disappear. Hardcoded oklch matches the LIGHT-mode --ink value
  // and stays dark regardless of theme since the pill background is
  // always white.
  //
  // SECONDARY pill: transparent, semi-white text. Always on the
  // dark Smart Track card gradient, so the white text reads in
  // both themes.
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      padding: '8px 12px', borderRadius: 999,
      background: primary ? '#fff' : 'transparent',
      color: primary ? 'oklch(0.22 0.025 250)' : 'rgba(255,255,255,0.92)',
      border: primary ? 'none' : '0.5px solid rgba(255,255,255,0.22)',
      fontSize: 12, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5, flexDirection: 'row',
      textDecoration: 'none',
    }}>
      {icon}
      {label}
    </a>
  );
}

// Inline emphasis for numbers inside an editorial sentence. The numbers
// carry hierarchy via weight + colour, not via tile frames around them.
function NumSpan({ children }) {
  return (
    <span style={{
      color: 'var(--statement-fg)', fontWeight: 600,
    }}>{children}</span>
  );
}

// Small inline glyph by event type — used in place of an emoji on the
// Smart Track card so the design stays restrained.
function SmartTrackTypeIcon({ type, size = 22 }) {
  const stroke = '#fff';
  if (type === 'flight') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    );
  }
  if (type === 'lodging' || type === 'lodging-out') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V8a1 1 0 011-1h16a1 1 0 011 1v13" />
        <path d="M3 21h18M7 12h2M7 16h2M13 12h4v9h-4z" />
      </svg>
    );
  }
  if (type === 'transport') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="13" rx="2.5" />
        <path d="M4 11h16M8 17v3M16 17v3" />
        <circle cx="8.5" cy="14.5" r=".8" fill={stroke} />
        <circle cx="15.5" cy="14.5" r=".8" fill={stroke} />
      </svg>
    );
  }
  // plan / generic
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

Object.assign(window, { ScreenTrips, CoverArt, SmartTrackCard, SmartTrackRow });
