// Trip Hub ("اليوم") — the main landing, in clear sections:
//   cover → today's budget → cards → up next → today's plan → recent.
// Every section shares one header style (HubSection) and one rhythm
// (28px between sections), so the page reads as a list of answers:
// how much can we spend today, on which card, what's next, what we did.

function HubSection({ title, sub, action, onAction, children }) {
  return (
    <section style={{ padding: '28px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '0 6px 10px' }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em', color: 'var(--ink)' }}>{title}</h2>
          {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
        </div>
        {action && (
          <button onClick={onAction} style={{
            flexShrink: 0, minHeight: 32, padding: '0 2px', background: 'transparent',
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 13.5, fontWeight: 600, color: 'var(--clay-deep)',
          }}>
            {action}
            <span className="icon-flip" style={{ display: 'inline-flex' }}><IconChevron size={12} stroke="currentColor" /></span>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
window.HubSection = HubSection;

// Small status pill used by the hub cards (dot + short label).
function HubPill({ tone = 'neutral', children }) {
  const tones = {
    good:    { bg: 'oklch(0.50 0.08 155 / 0.14)', fg: 'var(--moss)' },
    warn:    { bg: 'oklch(0.62 0.13 35 / 0.14)',  fg: 'var(--clay-deep)' },
    info:    { bg: 'oklch(0.42 0.10 260 / 0.13)', fg: 'var(--indigo)' },
    neutral: { bg: 'var(--cream)',                fg: 'var(--ink-soft)' },
  }[tone] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
      padding: '5px 10px', borderRadius: 999, background: tones.bg, color: tones.fg,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: 'currentColor' }} />
      {children}
    </span>
  );
}
window.HubPill = HubPill;

// Two side-by-side figures under a hero number.
function HubStat({ label, value, sub }) {
  return (
    <div style={{ minWidth: 0, background: 'var(--well)', borderRadius: 16, padding: '11px 13px' }}>
      <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div className="mono" style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
    </div>
  );
}
window.HubStat = HubStat;

const _hubCard = {
  background: 'var(--cream-2)', borderRadius: 24,
  border: '0.5px solid var(--hairline)', boxShadow: 'var(--shadow-sm)',
};

function ScreenHub({ go, openSheet, loading }) {
  // Hero parallax: the cover drifts slower than the page and swells a
  // little when you pull past the top — the screen feels like it has depth.
  const heroImgRef = React.useRef(null);
  const heroTilt = window.useTiltRef({ max: 6 });
  React.useEffect(() => {
    const img = heroImgRef.current; if (!img || window.vReduce?.()) return;
    const sc = img.closest('.v-screen'); if (!sc) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const y = sc.scrollTop;
      const shift = Math.max(-40, Math.min(48, y * 0.28));
      const swell = y < 0 ? 1 + Math.min(0.18, -y / 500) : 1;
      img.style.transform = `translate3d(0, ${shift}px, 0) scale(${swell})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    sc.addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => { sc.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  });
  const trip    = window.TRIP;
  const dataReady = trip && window.isTripDataReady?.(trip.id);
  // Show skeleton until expenses for THIS trip are actually loaded —
  // prevents 'flash of 0 spent' before the real number arrives.
  if (loading || !trip || !dataReady) {
    return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  }
  const ar = window.isRTL;
  const spent   = trip?.budget?.spentUSD   || (window.EXPENSES || []).reduce((s, e) => s + (e.usd || 0), 0);
  const planned = trip?.budget?.plannedUSD || 0;
  const wallets = !!window.walletsOf?.(trip);

  // Use unified formatter — always shows the trip's home currency by default
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });

  // Today's plan (only while the trip is on) and what's coming next.
  const today = window.localISO();
  const during = !!(trip.startDate && trip.endDate && today >= trip.startDate && today <= trip.endDate);
  const todayPlan = during
    ? (window.ITINERARY || []).filter((it) => it.dayDate === today)
        .sort((a, b) => String(a.startTime || '99').localeCompare(String(b.startTime || '99')))
    : [];
  const events = (window.DOCS_TRIP_ID === trip.id) ? (window.computeUpcomingEvents?.() || []) : [];
  // A plan item already sits in "Today's plan" — keep "Up next" for the
  // richer things (flight, check-in, pickup) so nothing shows twice.
  const nextEv = events.find((e) => !(todayPlan.length > 0 && e.type === 'plan')) || null;
  // The recap: up top once the trip is over, at the end while it's on.
  const hasSpend = (window.EXPENSES || []).length > 0;
  const ended = !!(trip.endDate && today > trip.endDate);

  return (
    <div data-screen-label="01 Trip Hub" style={{
      background: 'var(--cream)', minHeight: '100%',
      paddingBottom: 110,
    }}>
      {/* Top bar — glass pills floating over hero */}
      <div style={{
        position: 'absolute', top: 'max(60px, calc(env(safe-area-inset-top) + 14px))', left: 0, right: 0, zIndex: 30,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: 'row',
        padding: '0 18px',
      }}>
        <button onClick={() => go('trips')} aria-label={ar ? 'رحلاتي' : 'My trips'} className="glass" style={{
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
                  aria-label={ar ? 'بحث في الرحلة' : 'Search'}><IconSearch size={18} /></button>
          <button className="glass" style={btnGlass} onClick={() => go('settings')}
                  aria-label={t('settings')}><IconGear size={18} /></button>
        </div>
      </div>

      {/* HERO — the trip's cover, its name and the overall budget */}
      <div style={{ position: 'relative', padding: '0 14px', paddingTop: 110 }}>
        <div ref={heroTilt} className="v-flip-in" style={{
          position: 'relative', height: 220, borderRadius: 32,
          overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Cover sits on a taller layer that drifts with scroll (parallax). */}
          <div ref={heroImgRef} style={{ position: 'absolute', inset: '-52px 0', willChange: 'transform' }}>
            {(trip.coverUrl || trip.coverImageUrl) ? (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${trip.coverUrl || trip.coverImageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
            ) : (
              <CoverArt kind={trip.cover || 'kyoto'} />
            )}
          </div>
          {(trip.coverUrl || trip.coverImageUrl) && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)', pointerEvents: 'none' }} />
          )}

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

          <div style={{ position: 'absolute', top: 18, insetInlineEnd: 18, color: '#fff', textAlign: 'end' }}>
            <div className="mono" style={{
              fontSize: 11.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              {trip.dates}
            </div>
          </div>

          {/* Bottom overlay — title + the trip's overall spend */}
          <div style={{
            position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 0,
            padding: '60px 22px 18px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)',
            color: '#fff',
          }}>
            <div className="serif-italic" style={{ fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {trip.title || (ar ? 'رحلة' : 'Trip')}
            </div>
            {trip.subtitle && (
              <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4, fontWeight: 500 }}>
                {trip.subtitle}
              </div>
            )}
            {planned > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, opacity: 0.75 }}>{ar ? 'صرف الرحلة' : 'Trip spend'}</span>
                  <span className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{fmtC(spent)}</span>
                  <span style={{ fontSize: 11, opacity: 0.75 }}>{ar ? 'من' : 'of'} {fmtC(planned)}</span>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.22)', marginTop: 7, overflow: 'hidden' }}>
                  <div className="v-grow" style={{ width: `${Math.min(100, (spent / planned) * 100)}%`, height: '100%', borderRadius: 99, background: spent > planned ? '#ffb4a2' : '#fff' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Over the trip budget — one quiet line, right under the cover */}
      {planned > 0 && spent > planned && (
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{
            borderRadius: 14, padding: '11px 14px',
            background: 'oklch(0.62 0.13 35 / 0.10)',
            border: '0.5px solid oklch(0.62 0.13 35 / 0.30)',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12.5, color: 'var(--clay-deep)',
          }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>⚠</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              {ar
                ? <>تجاوزتوا ميزانية الرحلة بـ <strong>{fmtC(spent - planned)}</strong> ({Math.round(((spent - planned) / planned) * 100)}٪).</>
                : <>Over the trip budget by <strong>{fmtC(spent - planned)}</strong> ({Math.round(((spent - planned) / planned) * 100)}%).</>}
            </span>
          </div>
        </div>
      )}

      {ended && hasSpend && <HubRecapCard trip={trip} big />}

      {/* TODAY'S MONEY — cards trips: today's allowance + the cards.
         Other trips: the budget at a glance. */}
      {wallets
        ? <window.TodayBudgetCard onManage={() => go('settings')} onOpen={() => go('budget')} onAnalysis={() => go('analytics')} />
        : <HubBudget trip={trip} spent={spent} planned={planned} fmtC={fmtC} onOpen={() => go('budget')} />}

      {window.SHOW_SPLIT && !wallets && <HubBalance fmtC={fmtC} openSheet={openSheet} />}

      {/* UP NEXT — flight, check-in, pickup (or a plan item) in the next 24h */}
      {nextEv && window.SmartTrackCard && (
        <HubSection title={ar ? 'التالي' : 'Up next'}>
          <window.SmartTrackCard event={nextEv} trip={trip} />
        </HubSection>
      )}

      {/* TODAY'S PLAN — what's on the itinerary today */}
      {todayPlan.length > 0 && (
        <HubSection title={ar ? 'برنامج اليوم' : "Today's plan"}
          sub={ar ? window.arPlural(todayPlan.length, { one: 'نشاط واحد', two: 'نشاطان', few: `${todayPlan.length} أنشطة`, many: `${todayPlan.length} نشاطاً`, other: `${todayPlan.length} نشاط` }) : `${todayPlan.length} ${todayPlan.length === 1 ? 'activity' : 'activities'}`}
          action={ar ? 'الخطة' : 'Plan'} onAction={() => go('plan')}>
          <HubPlanList items={todayPlan} onOpen={() => go('plan')} />
        </HubSection>
      )}

      {/* RECENT — the latest few expenses, one grouped list */}
      {(window.EXPENSES || []).length > 0 && (
        <HubSection title={t('recentActivity')} action={t('seeAll')} onAction={() => go('budget')}>
          <HubRecent fmtC={fmtC} wallets={wallets} openSheet={openSheet} />
        </HubSection>
      )}

      {!ended && hasSpend && during && <div style={{ paddingTop: 14 }}><HubRecapCard trip={trip} /></div>}
    </div>
  );
}

// "Watch your trip recap" — the cover behind a play button.
function HubRecapCard({ trip, big }) {
  const ar = window.isRTL;
  return (
    <div style={{ padding: big ? '14px 14px 0' : '14px 14px 0' }}>
      <button onClick={() => window.openRecap?.(trip.id)} className="press-soft" style={{
        position: 'relative', display: 'block', width: '100%', height: big ? 104 : 84, borderRadius: 24, overflow: 'hidden',
        textAlign: 'start', color: '#fff', background: '#0b0d12', boxShadow: 'var(--shadow-md)', padding: 0,
      }}>
        <span style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <CoverArt kind={trip.cover || 'kyoto'} imageUrl={trip.coverUrl || trip.coverImageUrl} />
        </span>
        <span style={{ position: 'absolute', inset: 0, background: `linear-gradient(${ar ? 270 : 90}deg, rgba(11,13,18,0.94) 25%, rgba(11,13,18,0.25) 100%)` }} />
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, height: '100%', padding: '0 18px' }}>
          <span aria-hidden="true" style={{
            width: big ? 50 : 42, height: big ? 50 : 42, borderRadius: 999, flexShrink: 0, background: '#fff',
            display: 'grid', placeItems: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
          }}>
            <svg width={big ? 18 : 15} height={big ? 18 : 15} viewBox="0 0 24 24" style={{ marginInlineStart: 3 }}><path d="M7 4.5v15l12-7.5z" fill="#14161d" /></svg>
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: big ? 17 : 15.5, fontWeight: 800 }}>
              {big ? (ar ? 'شاهد ملخص رحلتكم' : 'Watch your trip recap') : (ar ? 'ملخص الرحلة لين الحين' : 'Your trip so far')}
            </span>
            <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,0.78)', marginTop: 3 }}>
              {ar ? 'الأرقام واللحظات في دقيقة — وتقدر تشاركه' : 'The numbers and moments in a minute — ready to share'}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

// Budget at a glance for trips without cards.
function HubBudget({ trip, spent, planned, fmtC, onOpen }) {
  const ar = window.isRTL;
  const byCat = {};
  (window.EXPENSES || []).forEach((e) => { byCat[e.cat] = (byCat[e.cat] || 0) + (e.usd || 0); });
  const over = planned > 0 && spent > planned;
  const pct = planned > 0 ? Math.round((spent / planned) * 100) : 0;
  return (
    <HubSection title={ar ? 'الميزانية' : 'Budget'} action={ar ? 'التفاصيل' : 'Details'} onAction={onOpen}>
      <div onClick={onOpen} className="press-soft" role="button" style={{ ..._hubCard, padding: '16px 16px 14px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', fontWeight: 600 }}>{ar ? 'صرفتوا' : 'Spent'}</span>
          {planned > 0 && <HubPill tone={over ? 'warn' : 'good'}>{over ? (ar ? 'فوق الميزانية' : 'Over budget') : (ar ? `${pct}٪ من الميزانية` : `${pct}% of budget`)}</HubPill>}
        </div>
        <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginTop: 2, letterSpacing: '-0.01em' }}>
          <window.CountUp id={'hub-spent-' + (trip?.id || '')} value={spent} format={fmtC} />
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginBottom: 12 }}>
          {planned > 0
            ? (over
                ? (ar ? `من ${fmtC(planned)} · فوقها بـ ${fmtC(spent - planned)}` : `of ${fmtC(planned)} · ${fmtC(spent - planned)} over`)
                : (ar ? `من ${fmtC(planned)} · باقي ${fmtC(planned - spent)}` : `of ${fmtC(planned)} · ${fmtC(planned - spent)} left`))
            : (ar ? 'ما فيه ميزانية محددة للرحلة' : 'No trip budget set')}
        </div>
        {spent > 0 && window.CategoryBar && (
          <window.CategoryBar byCat={byCat} total={spent} scaleTo={planned > spent ? planned : spent} fmt={fmtC} compact />
        )}
        {/* today's budget — what's left ÷ the days left, so it moves with the spending */}
        {window.DailyBudgetRow && <window.DailyBudgetRow trip={trip} expenses={window.EXPENSES || []} conv={fmtC} onCard />}
      </div>
    </HubSection>
  );
}

// Today's itinerary as a compact timeline. Past items fade; the next one
// is marked so a glance says where you are in the day.
function HubPlanList({ items, onOpen }) {
  const ar = window.isRTL;
  const meta = (typeof PLAN_CAT_META !== 'undefined' && PLAN_CAT_META) || {};
  const now = new Date();
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const nextIdx = items.findIndex((it) => it.startTime && it.startTime.slice(0, 5) >= hm);
  const shown = items.slice(0, 5);
  return (
    <div style={{ ..._hubCard, overflow: 'hidden' }}>
      {shown.map((it, i) => {
        const m = meta[it.category] || (window.CAT_META?.[it.category]) || meta.misc || { emoji: '📌' };
        const past = it.startTime && it.startTime.slice(0, 5) < hm && i !== nextIdx;
        const isNext = i === nextIdx;
        return (
          <button key={it.id} onClick={onOpen} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'start',
            padding: '0 14px', background: isNext ? 'oklch(0.62 0.13 35 / 0.07)' : 'transparent',
          }}>
            <span className="mono" style={{ width: 42, flexShrink: 0, fontSize: 12.5, fontWeight: 600, color: isNext ? 'var(--clay-deep)' : past ? 'var(--ink-mute)' : 'var(--ink-soft)', direction: 'ltr', textAlign: ar ? 'right' : 'left' }}>
              {it.startTime ? it.startTime.slice(0, 5) : '—'}
            </span>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
              <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0, opacity: past ? 0.45 : 1, filter: past ? 'grayscale(1)' : 'none' }}>{m.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: past ? 500 : 600, color: past ? 'var(--ink-mute)' : 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
                {it.location && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.location}</span>}
              </span>
              {isNext && <HubPill tone="warn">{ar ? 'التالي' : 'Next'}</HubPill>}
            </span>
          </button>
        );
      })}
      {items.length > shown.length && (
        <button onClick={onOpen} style={{ width: '100%', padding: '11px 14px', borderTop: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 600, color: 'var(--clay-deep)', background: 'transparent' }}>
          {ar ? `+${items.length - shown.length} في الخطة` : `+${items.length - shown.length} more in the plan`}
        </button>
      )}
    </div>
  );
}

// The latest expenses as one grouped list (iOS inset style).
function HubRecent({ fmtC, wallets, openSheet }) {
  const ar = window.isRTL;
  const rows = (window.EXPENSES || []).slice()
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    .slice(0, 4);
  return (
    <div className="v-list" style={{ ..._hubCard, overflow: 'hidden' }}>
      {rows.map((e, i) => {
        const m = (window.MEMBERS || []).find((x) => x.id === e.who) || { name: '—', hue: 200, initials: '?' };
        const c = (window.CATEGORIES || []).find((x) => x.key === e.cat) || { color: 'var(--ink-mute)' };
        const first = (m.name || '').split(' ')[0];
        return (
          <button key={e.id} onClick={() => window.openExpenseOrDoc(e, openSheet)}
            aria-label={ar ? `تعديل ${e.title}، ${fmtC(e.usd)}` : `Edit ${e.title}, ${fmtC(e.usd)}`}
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'start', padding: '0 14px', background: 'transparent' }}>
            <span style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: c.color,
              display: 'grid', placeItems: 'center', fontSize: 18, lineHeight: 1,
            }}>{window.CAT_META?.[e.cat]?.emoji || '·'}</span>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                  {wallets && e.cash
                    ? <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #4f8a73, #24503f)' }}><IconCash size={10} stroke="#fff" sw={2} /></span>
                    : <Avatar m={m} size={14} />}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{[wallets && e.cash ? (ar ? 'كاش' : 'Cash') : wallets ? (ar ? `بطاقة ${first}` : `${first}'s card`) : first, window.docPartWith?.(e.id), e.when].filter(Boolean).map((x) => '\u2068' + x + '\u2069').join(' · ')}</span>
                </span>
              </span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>{fmtC(e.usd)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// "Who owes whom" — only when splitting is switched on (it's off: the
// group settles up outside the app). Kept so turning it on loses nothing.
function HubBalance({ fmtC, openSheet }) {
  const ar = window.isRTL;
  if ((window.MEMBERS || []).length < 2) return null;
  const balance = window.computeUserBalance?.(window.currentUserId, window.EXPENSES || [], window.SETTLEMENTS || []);
  if (!balance || Math.abs(balance.net) < 0.5) return null;
  const owed = balance.net > 0;
  const amount = fmtC(Math.abs(balance.net));
  return (
    <HubSection title={ar ? 'الحساب بينكم' : 'Between you'}>
      <button onClick={() => openSheet?.('settleUp')} style={{
        width: '100%', textAlign: 'start', borderRadius: 22, padding: '16px 18px', color: '#fff',
        background: owed
          ? 'linear-gradient(135deg, oklch(0.45 0.10 155) 0%, oklch(0.32 0.09 155) 100%)'
          : 'linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)',
        boxShadow: 'var(--shadow-md)', fontSize: 16, lineHeight: 1.5,
      }}>
        {owed ? (ar ? `لك ${amount}` : `You're owed ${amount}`) : (ar ? `عليك ${amount}` : `You owe ${amount}`)}
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{t('balanceTapToSettle')}</div>
      </button>
    </HubSection>
  );
}

const btnGlass = {
  width: 38, height: 38, borderRadius: 999,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink)',
};

window.ScreenHub = ScreenHub;
