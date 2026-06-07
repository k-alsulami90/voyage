// Trip Analytics — fully computed from real window.EXPENSES data.

// ── SVG Donut / Pie chart ─────────────────────────────────────
function PieChart({ data, size = 148 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10, ir = r * 0.52;
  let angle = -Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {data.map((d, i) => {
        const slice = (d.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        angle += slice;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const xi1 = cx + ir * Math.cos(angle - slice);
        const yi1 = cy + ir * Math.sin(angle - slice);
        const xi2 = cx + ir * Math.cos(angle);
        const yi2 = cy + ir * Math.sin(angle);
        const large = slice > Math.PI ? 1 : 0;
        return (
          <path key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`}
            fill={d.color} stroke="var(--cream-2)" strokeWidth="1.5"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={ir - 2} fill="var(--cream-2)" />
    </svg>
  );
}

// ── Main screen ───────────────────────────────────────────────
function ScreenAnalytics({ go, loading }) {
  // Tap a bar in the daily chart -> show that day's detail card below
  const [selectedDay, setSelectedDay] = React.useState(null);
  if (loading) return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  const expenses = window.EXPENSES || [];
  const trip     = window.TRIP;
  const members  = window.MEMBERS || [];
  const cats     = window.CATEGORIES || [];

  // Use unified formatter (home currency)
  const fmtC = (usd) => window.fmtMoney(usd, { in: 'home' });

  // ── Computed stats ──────────────────────────────────────────
  const totalUSD    = expenses.reduce((s, e) => s + (e.usd || 0), 0);
  const daysElapsed = Math.max(trip?.daysIn || 1, 1);
  const daysTotal   = Math.max(trip?.daysTotal || daysElapsed, 1);
  const dailyAvg    = totalUSD / daysElapsed;
  const dailyPlan   = (trip?.budget?.plannedUSD || 0) / daysTotal;
  const burnPct     = dailyPlan > 0 ? ((dailyAvg / dailyPlan) * 100 - 100) : 0;

  // Group by date string
  const byDate = expenses.reduce((acc, e) => {
    const d = e.when || 'Unknown';
    acc[d] = (acc[d] || 0) + (e.usd || 0);
    return acc;
  }, {});
  const dateEntries = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]));
  const maxDay = dateEntries.reduce((m, [d, v]) => v > m.val ? { date: d, val: v } : m, { date: '--', val: 0 });
  const minDay = dateEntries.length > 1
    ? dateEntries.reduce((m, [d, v]) => v < m.val ? { date: d, val: v } : m, { date: '--', val: Infinity })
    : { date: '--', val: 0 };

  // Top transaction
  const topTx = expenses.reduce((m, e) => (e.usd || 0) > (m?.usd || 0) ? e : m, null);

  // Category totals for pie
  const catTotals = cats.map((c) => ({
    key:   c.key,
    label: c.label,
    color: c.color,
    value: expenses.filter((e) => e.cat === c.key).reduce((s, e) => s + (e.usd || 0), 0),
  })).filter((c) => c.value > 0);

  // Contributor breakdown
  const contribs = members.map((m) => {
    const paid = expenses.filter((e) => e.who === m.id).reduce((s, e) => s + (e.usd || 0), 0);
    return { ...m, paid, pct: totalUSD > 0 ? Math.round((paid / totalUSD) * 100) : 0 };
  }).filter((m) => m.paid > 0).sort((a, b) => b.paid - a.paid);

  // Full-trip daily buckets — every day from start_date to end_date (or today).
  // Bucket by ISO YYYY-MM-DD from raw createdAt so we don't depend on display format.
  const isoOf = (iso) => (iso || '').slice(0, 10);
  const dailyByISO = {};
  const dailyByISOCats = {};
  expenses.forEach((e) => {
    const k = isoOf(e.createdAt);
    if (!k) return;
    dailyByISO[k] = (dailyByISO[k] || 0) + (e.usd || 0);
    const m = dailyByISOCats[k] || (dailyByISOCats[k] = {});
    m[e.cat] = (m[e.cat] || 0) + (e.usd || 0);
  });
  const allDays = (() => {
    if (!trip?.startDate) return Object.keys(dailyByISO).sort();
    const start = new Date(trip.startDate + 'T00:00:00');
    const endRaw = trip.endDate ? new Date(trip.endDate + 'T00:00:00') : new Date();
    const end = endRaw < new Date() ? endRaw : new Date();
    const out = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  })();
  const dailyMax = Math.max(...allDays.map((k) => dailyByISO[k] || 0), 1);
  const peakISO = allDays.reduce((m, k) => (dailyByISO[k] || 0) > (dailyByISO[m] || 0) ? k : m, allDays[0]);

  // ── Empty state ─────────────────────────────────────────────
  if (expenses.length === 0) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('statsNav')} onBack={() => go('hub')} />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '60px 32px', textAlign: 'center', gap: 14,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><IconSparkle size={28} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>
            {window.isRTL ? 'لا توجد بيانات بعد' : 'No data yet'}
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-mute)', lineHeight: 1.5, maxWidth: 240 }}>
            {window.isRTL ? 'أضف مصروفات لرؤية الإحصائيات هنا' : 'Add expenses to see analytics here'}
          </div>
          <button onClick={() => go('budget')} style={{
            marginTop: 6, padding: '12px 22px', borderRadius: 14,
            background: 'var(--statement)', color: 'var(--statement-fg)', fontSize: 13.5, fontWeight: 500,
          }}>{window.isRTL ? '← الميزانية' : 'Go to Budget →'}</button>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="06 Trip Analytics" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      <Header title={t('statsNav')} onBack={() => go('hub')} />

      {/* DAILY AVG hero + sparkline */}
      <div style={{ padding: '0 14px' }}>
        <div style={{
          background: 'var(--statement)', color: 'var(--statement-fg)',
          borderRadius: 28, padding: '22px',
          position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(60% 50% at 90% 0%, oklch(0.42 0.10 260 / 0.5) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'relative', display: 'flex',
            justifyContent: 'space-between', alignItems: 'flex-start',
            flexDirection: 'row',
          }}>
            {/* Editorial sentence replaces the previous hero-metric template
               (uppercase mono "DAILY AVERAGE" eyebrow + 44px Cormorant serif
               headline + small "vs $X planned" sub-line). Same dark card
               surface, same information density, different shape: numbers
               carry hierarchy via inline weight, not via size escalation. */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 17, lineHeight: 1.5, color: 'var(--statement-sub)', fontWeight: 400,
              }}>
                {window.isRTL ? (
                  dailyPlan > 0 ? (
                    <>تصرف <AnaNum>{fmtC(dailyAvg)}</AnaNum> يومياً، الخطة <AnaNum dim>{fmtC(dailyPlan)}</AnaNum>.{' '}
                    <span style={{
                      color: burnPct > 0 ? 'oklch(0.78 0.13 30)' : 'oklch(0.78 0.13 145)',
                      fontWeight: 600,
                    }}>{burnPct > 0 ? '+' : ''}{burnPct.toFixed(0)}%</span></>
                  ) : (
                    <>تصرف <AnaNum>{fmtC(dailyAvg)}</AnaNum> يومياً.</>
                  )
                ) : (
                  dailyPlan > 0 ? (
                    <>You're spending <AnaNum>{fmtC(dailyAvg)}</AnaNum> a day, <AnaNum dim>{fmtC(dailyPlan)}</AnaNum> planned.{' '}
                    <span style={{
                      color: burnPct > 0 ? 'oklch(0.78 0.13 30)' : 'oklch(0.78 0.13 145)',
                      fontWeight: 600,
                    }}>{burnPct > 0 ? '+' : ''}{burnPct.toFixed(0)}%</span></>
                  ) : (
                    <>You're spending <AnaNum>{fmtC(dailyAvg)}</AnaNum> a day.</>
                  )
                )}
              </div>
            </div>
            <div style={{
              padding: '6px 10px', borderRadius: 10,
              background: 'rgba(255,255,255,0.08)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              fontSize: 11, fontWeight: 500,
            }}>{daysElapsed} / {daysTotal} {window.isRTL ? 'يوم' : 'days'}</div>
          </div>

          {/* Full-trip daily bar chart with cumulative-spend overlay line.
             Bars = each day's spend; thin line = running total against the
             planned budget. Scrolls horizontally for trips > ~16 days. */}
          {allDays.length > 0 && (() => {
            const cumByDay = [];
            let running = 0;
            allDays.forEach((iso) => {
              running += dailyByISO[iso] || 0;
              cumByDay.push(running);
            });
            const cumMax = Math.max(running, trip?.budget?.plannedUSD || 0, 1);
            const plannedY = trip?.budget?.plannedUSD
              ? 100 - (trip.budget.plannedUSD / cumMax) * 100
              : null;
            const barWidth = 18;
            const barGap   = 5;
            const slot = barWidth + barGap;
            const totalWidth = Math.max(allDays.length * slot - barGap, 100);

            // Bars area is now a FIXED 64px row (was sharing height with
            // the label inside each button — labelled vs unlabelled days
            // had different bar slots, so same-value bars rendered at
            // different visual heights and the chart looked floating).
            // Labels live in their own row below the baseline. Polyline
            // + planned line + baseline are absolutely positioned siblings
            // of the bars row so everything shares one coordinate space.
            const BARS_H = 64;
            return (
              <div className="no-scrollbar" style={{
                position: 'relative', marginTop: 18,
                overflowX: 'auto', overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
              }}>
                <div style={{
                  minWidth: '100%', width: totalWidth,
                }}>
                  {/* ── BARS AREA ─────────────────────────────────── */}
                  <div style={{ position: 'relative', height: BARS_H }}>
                    {/* Planned daily reference line (cumulative budget cap)
                       — positioned inside the bars area so the y-coordinate
                       lines up with the bars + polyline. */}
                    {plannedY !== null && (
                      <>
                        <div style={{
                          position: 'absolute', left: 0, right: 0,
                          top: `${plannedY}%`,
                          borderTop: '1px dashed rgba(255,255,255,0.5)',
                          pointerEvents: 'none', zIndex: 2,
                        }} />
                        <div style={{
                          position: 'absolute', insetInlineEnd: 0, top: `${plannedY}%`,
                          transform: 'translateY(-110%)',
                          fontSize: 9, color: 'rgba(255,255,255,0.7)', padding: '0 2px',
                          zIndex: 3,
                        }}>{window.isRTL ? 'الميزانية' : 'budget'}</div>
                      </>
                    )}

                    {/* Cumulative-spend line (SVG polyline). Now uses the
                       same BARS_H coordinate space so it sits perfectly
                       over the bars. */}
                    <svg width={totalWidth} height={BARS_H}
                      viewBox={`0 0 ${totalWidth} ${BARS_H}`}
                      style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 1 }}>
                      <polyline
                        fill="none"
                        stroke="var(--clay)" strokeWidth="1.75"
                        strokeLinecap="round" strokeLinejoin="round"
                        points={cumByDay.map((c, i) => {
                          const x = i * slot + barWidth / 2;
                          const y = BARS_H - (c / cumMax) * (BARS_H - 4);
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>

                    {/* Bars row — every button is the same fixed height,
                       so bars share a common baseline regardless of
                       whether the day shows a label. */}
                    <div style={{
                      display: 'flex', alignItems: 'flex-end',
                      gap: barGap, height: '100%', position: 'relative', zIndex: 0,
                    }}>
                      {allDays.map((iso, i) => {
                        const val = dailyByISO[iso] || 0;
                        const isPeak = iso === peakISO && val > 0;
                        const isSelected = iso === selectedDay;
                        // Min heights bumped so small + zero days are
                        // visible above the baseline (was 4% / 2% which
                        // rendered as ~1-2px against the dark card).
                        const heightPct = val > 0
                          ? Math.max((val / dailyMax) * 88, 9)
                          : 5;
                        return (
                          <button key={iso}
                            onClick={() => setSelectedDay((cur) => cur === iso ? null : iso)}
                            aria-label={`Day ${i + 1}`}
                            style={{
                              all: 'unset', cursor: 'pointer',
                              flex: '0 0 auto', width: barWidth, height: '100%',
                              display: 'flex', alignItems: 'flex-end',
                            }}>
                            <div style={{
                              width: '100%', height: `${heightPct}%`,
                              // Non-peak bars opacity bumped 0.32 -> 0.45
                              // for readable contrast against the dark
                              // statement card. Zero-spend day is a thin
                              // marker, not a faint ghost.
                              background: val === 0
                                ? 'rgba(255,255,255,0.18)'
                                : (isSelected ? '#fff' : (isPeak ? 'var(--clay)' : 'rgba(255,255,255,0.45)')),
                              borderRadius: '3px 3px 0 0',
                              outline: isSelected ? '1.5px solid var(--clay)' : 'none',
                              transition: 'background 160ms, height 160ms ease-out',
                            }} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Baseline axis — a 1px line at the bottom of the
                       bars area so every bar visually rests on something
                       instead of floating in the void. */}
                    <div style={{
                      position: 'absolute', left: 0, right: 0, bottom: 0,
                      height: 1, background: 'rgba(255,255,255,0.30)',
                      pointerEvents: 'none', zIndex: 4,
                    }} />
                  </div>

                  {/* ── LABELS ROW ────────────────────────────────────
                     Day numbers used to live inside each bar's flex
                     column, which broke the bars' shared baseline.
                     Now they're a separate row aligned to the bar
                     columns by matching width + gap. */}
                  <div style={{
                    display: 'flex', gap: barGap, marginTop: 6,
                  }}>
                    {allDays.map((iso, i) => {
                      const dayNum = i + 1;
                      const isSelected = iso === selectedDay;
                      const labelEvery = allDays.length <= 7 ? 1
                                      : allDays.length <= 14 ? 2
                                      : 5;
                      const showLabel = dayNum === 1
                        || dayNum === allDays.length
                        || dayNum % labelEvery === 0;
                      return (
                        <div key={iso} style={{
                          flex: '0 0 auto', width: barWidth,
                          textAlign: 'center', height: 13,
                          fontSize: 9, fontFamily: 'var(--mono)',
                          whiteSpace: 'nowrap',
                          color: isSelected ? 'var(--clay)' : 'rgba(255,255,255,0.65)',
                          fontWeight: isSelected ? 700 : 500,
                        }}>
                          {showLabel ? dayNum : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Legend + inline peak/lowest annotation. Was uppercase mono
                   tracked. Now sentence-case. The peak/lowest values used to
                   live in two separate cards below the chart that duplicated
                   the chart's own peak-bar highlight; folded them inline here
                   so the data sits next to the visual it describes. */}
                <div style={{
                  marginTop: 8, display: 'flex', gap: 12, flexDirection: 'row',
                  flexWrap: 'wrap',
                  fontSize: 10.5, color: 'rgba(255,255,255,0.65)',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.32)' }} />
                    {window.isRTL ? 'يومي' : 'daily'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 12, height: 2, background: 'var(--clay)' }} />
                    {window.isRTL ? 'تراكمي' : 'running total'}
                  </span>
                  {plannedY !== null && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 12, height: 1, borderTop: '1px dashed rgba(255,255,255,0.45)' }} />
                      {window.isRTL ? 'الميزانية' : 'budget'}
                    </span>
                  )}
                  {maxDay.val > 0 && (
                    <span style={{
                      marginInlineStart: 'auto',
                      color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                    }}>
                      {window.isRTL
                        ? `أعلى يوم: ${fmtC(maxDay.val)}`
                        : `Peak: ${fmtC(maxDay.val)}`}
                    </span>
                  )}
                </div>

                {/* Selected day detail — appears below the chart when a bar is tapped */}
                {selectedDay && (() => {
                  const val = dailyByISO[selectedDay] || 0;
                  const catMix = dailyByISOCats[selectedDay] || {};
                  const dayNum = allDays.indexOf(selectedDay) + 1;
                  const d = new Date(selectedDay + 'T00:00:00');
                  const dateStr = d.toLocaleDateString(window.isRTL ? 'ar' : 'en',
                    { weekday: 'short', month: 'short', day: 'numeric' });
                  const sortedCats = Object.entries(catMix).sort((a, b) => b[1] - a[1]);
                  return (
                    <div style={{
                      marginTop: 12, padding: '12px 14px', borderRadius: 14,
                      background: 'rgba(255,255,255,0.10)',
                      border: '0.5px solid rgba(255,255,255,0.18)',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                        gap: 8, flexDirection: 'row',
                      }}>
                        <div>
                          <div className="serif" style={{ fontSize: 18, lineHeight: 1.1 }}>
                            {window.isRTL ? `اليوم ${dayNum}` : `Day ${dayNum}`}
                          </div>
                          <div style={{ fontSize: 11, opacity: 0.72, marginTop: 2, fontFamily: 'var(--mono)' }}>
                            {dateStr}
                          </div>
                        </div>
                        <div className="mono" style={{
                          fontSize: 22, fontWeight: 600,
                        }}>{fmtC(val)}</div>
                      </div>
                      {sortedCats.length > 0 ? (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {sortedCats.slice(0, 4).map(([k, v]) => {
                            const c = cats.find((x) => x.key === k);
                            const pct = val > 0 ? (v / val) * 100 : 0;
                            return (
                              <div key={k} style={{
                                display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row',
                              }}>
                                <span style={{
                                  width: 8, height: 8, borderRadius: 2,
                                  background: c?.color || 'rgba(255,255,255,0.4)', flexShrink: 0,
                                }} />
                                <span style={{ flex: 1, fontSize: 12, opacity: 0.85 }}>{c?.label || k}</span>
                                <span className="mono" style={{ fontSize: 11.5, opacity: 0.72 }}>
                                  {Math.round(pct)}%
                                </span>
                                <span className="mono" style={{ fontSize: 11.5, fontWeight: 500, minWidth: 50, textAlign: 'end' }}>
                                  {fmtC(v)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ marginTop: 8, fontSize: 11.5, opacity: 0.6 }}>
                          {window.isRTL ? 'لا مصروفات في هذا اليوم' : 'No spending on this day'}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Peak/Lowest cards lived here as a 2-up identical-card-grid with
         hero-metric chrome on each. Removed: the peak value now annotates
         the chart inline (above) where it belongs, and "lowest day" was
         rarely actionable (a zero-spend day isn't useful information).
         The screen reads more as data + interpretation, less as dashboard. */}

      {/* TOP TRANSACTION. Was wrapped in the hero-metric template
         (uppercase mono "TOP TRANSACTION" eyebrow above title and date).
         Now: sentence-case "Biggest expense" sits as a quiet label
         inside the row itself. The row reads like the expense rows the
         user already knows from Budget, just with a label of context. */}
      {topTx && (
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{
            padding: '14px 16px', borderRadius: 18, background: 'var(--cream-2)',
            border: '0.5px solid var(--hairline)',
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: cats.find((c) => c.key === topTx.cat)?.color || 'var(--clay)',
              display: 'grid', placeItems: 'center', fontSize: 18,
            }}>💸</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                {window.isRTL ? 'أكبر مصروف' : 'Biggest expense'}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 500, marginTop: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{topTx.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{topTx.when}</div>
            </div>
            <div className="mono" style={{ fontSize: 17, fontWeight: 600, color: 'var(--clay-deep)', flexShrink: 0 }}>
              {fmtC(topTx.usd)}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY PIE + LEGEND */}
      {catTotals.length > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'حسب الفئة' : 'By category'}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 22, padding: '18px',
            margin: '0 8px', border: '0.5px solid var(--hairline)',
            display: 'flex', alignItems: 'center', gap: 16,
            flexDirection: 'row',
          }}>
            <PieChart data={catTotals} size={148} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {catTotals.map((c) => (
                <div key={c.key} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  flexDirection: 'row',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)', textAlign: 'start' }}>{c.label}</span>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                    {totalUSD > 0 ? Math.round((c.value / totalUSD) * 100) : 0}%
                  </span>
                </div>
              ))}
              {/* Footer was uppercase mono "TOTAL". Same eyebrow shape as
                 elsewhere. Now sentence-case sans with the same hairline
                 divider above; total still reads as the closer. */}
              <div style={{
                paddingTop: 8, borderTop: '0.5px solid var(--hairline)',
                display: 'flex', justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
                  {window.isRTL ? 'المجموع' : 'Total'}
                </span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{fmtC(totalUSD)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTRIBUTOR BREAKDOWN */}
      {contribs.length > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'من يدفع' : "Who's paying"}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 22, padding: '14px 16px',
            margin: '0 8px', border: '0.5px solid var(--hairline)',
          }}>
            {contribs.map((m, i) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderTop: i ? '0.5px solid var(--hairline)' : 'none',
                flexDirection: 'row',
              }}>
                <Avatar m={m} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    flexDirection: 'row',
                  }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 500 }}>{fmtC(m.paid)}</span>
                  </div>
                  <div style={{ height: 5, marginTop: 5, borderRadius: 3, background: 'var(--sand)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${m.pct}%`, height: '100%',
                      background: `linear-gradient(90deg, oklch(0.62 0.13 ${m.hue}) 0%, oklch(0.48 0.13 ${m.hue}) 100%)`,
                    }} />
                  </div>
                  <div style={{
                    fontSize: 10, color: 'var(--ink-mute)', marginTop: 3,
                    display: 'flex', justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                    <span>{m.pct}% {window.isRTL ? 'من الإجمالي' : 'of total'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY-BY-DAY list with category mix */}
      {allDays.length > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'يوم بيوم' : 'Day by day'}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 22,
            margin: '0 8px', overflow: 'hidden',
            border: '0.5px solid var(--hairline)',
          }}>
            {allDays.slice().reverse().map((iso, idx) => {
              const val = dailyByISO[iso] || 0;
              const catMix = dailyByISOCats[iso] || {};
              const d = new Date(iso + 'T00:00:00');
              const dayNum = trip?.startDate
                ? Math.floor((d - new Date(trip.startDate + 'T00:00:00')) / 86400000) + 1
                : null;
              const weekday = d.toLocaleDateString(window.isRTL ? 'ar' : 'en', { weekday: 'short' });
              const date = d.toLocaleDateString(window.isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric' });
              const isToday = iso === new Date().toISOString().slice(0, 10);
              return (
                <div key={iso} style={{
                  padding: '11px 14px',
                  borderTop: idx ? '0.5px solid var(--hairline)' : 'none',
                  opacity: val === 0 ? 0.55 : 1,
                  display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
                }}>
                  {/* Left: day label */}
                  <div style={{ minWidth: 64 }}>
                    <div style={{
                      fontSize: 12.5, fontWeight: 500,
                      color: isToday ? 'var(--clay-deep)' : 'var(--ink)',
                    }}>
                      {dayNum ? (window.isRTL ? `يوم ${dayNum}` : `Day ${dayNum}`) : date}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink-mute)', marginTop: 1 }}>
                      {weekday} · {date}
                    </div>
                  </div>
                  {/* Middle: category mix bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {val > 0 ? (
                      <div style={{
                        height: 6, borderRadius: 3, overflow: 'hidden',
                        background: 'var(--sand)',
                        display: 'flex', flexDirection: 'row',
                      }}>
                        {cats.map((c) => {
                          const cv = catMix[c.key] || 0;
                          if (cv === 0) return null;
                          return (
                            <div key={c.key} style={{
                              width: `${(cv / val) * 100}%`, height: '100%',
                              background: c.color,
                            }} />
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        height: 6, borderRadius: 3,
                        background: 'var(--hairline)',
                      }} />
                    )}
                    <div style={{ fontSize: 9.5, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>
                      {Object.keys(catMix).length === 0
                        ? (window.isRTL ? 'لا مصروفات' : 'no spend')
                        : Object.entries(catMix)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([k]) => cats.find((c) => c.key === k)?.label || k)
                            .join(' · ')}
                    </div>
                  </div>
                  {/* Right: amount */}
                  <div className="mono" style={{
                    fontSize: 13, fontWeight: 500, minWidth: 62, textAlign: 'end',
                    color: val === 0 ? 'var(--ink-mute)' : 'var(--ink)',
                  }}>
                    {val === 0 ? '—' : fmtC(val)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BURN RATE summary. Was a second dark statement card with a 4-cell
         identical-card-grid inside, each cell its own mini hero-metric
         (uppercase mono eyebrow + 26px Cormorant serif headline). Doubly
         banned: identical-card-grid AND repeated hero-metric template.
         Now: an editorial sentence with bolded inline numbers, on the
         lighter card-bg the rest of the screen uses. Same four numbers,
         same information, conversational shape -- and only ONE dark
         statement card on the screen (the hero at top) instead of two. */}
      {totalUSD > 0 && (
        <div style={{ padding: '22px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'الإيقاع' : 'Pace'}</SectionLabel>
          <div style={{
            margin: '0 8px', padding: '14px 16px', borderRadius: 18,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            fontSize: 15, lineHeight: 1.55, color: 'var(--ink-soft)',
          }}>
            {window.isRTL ? (
              trip?.budget?.plannedUSD ? (
                <>
                  صرفت <AnaNum solid>{fmtC(totalUSD)}</AnaNum> من <AnaNum solid dim>{fmtC(trip.budget.plannedUSD)}</AnaNum>،
                  بمعدل <AnaNum solid>{fmtC(dailyAvg)}</AnaNum> يومياً.
                  بهذا الإيقاع ستنهي الرحلة على <AnaNum solid>{fmtC(dailyAvg * daysTotal)}</AnaNum>.
                </>
              ) : (
                <>
                  صرفت <AnaNum solid>{fmtC(totalUSD)}</AnaNum> بمعدل <AnaNum solid>{fmtC(dailyAvg)}</AnaNum> يومياً.
                  بهذا الإيقاع ستنهي الرحلة على <AnaNum solid>{fmtC(dailyAvg * daysTotal)}</AnaNum>.
                </>
              )
            ) : (
              trip?.budget?.plannedUSD ? (
                <>
                  Spent <AnaNum solid>{fmtC(totalUSD)}</AnaNum> of <AnaNum solid dim>{fmtC(trip.budget.plannedUSD)}</AnaNum> planned,
                  averaging <AnaNum solid>{fmtC(dailyAvg)}</AnaNum> a day.
                  At this pace you'll end on <AnaNum solid>{fmtC(dailyAvg * daysTotal)}</AnaNum>.
                </>
              ) : (
                <>
                  Spent <AnaNum solid>{fmtC(totalUSD)}</AnaNum>, averaging <AnaNum solid>{fmtC(dailyAvg)}</AnaNum> a day.
                  At this pace you'll end on <AnaNum solid>{fmtC(dailyAvg * daysTotal)}</AnaNum>.
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline emphasis for money numbers inside the editorial sentences on the
// hero card (dark, on-statement) and the pace summary (light card). The
// `solid` flag picks the ink-colored variant for the light card; without
// it the helper uses statement-fg for legibility on the dark hero. `dim`
// softens reference numbers (e.g. "of $X planned") so the spent number
// reads as primary without size escalation.
function AnaNum({ children, solid, dim }) {
  const color = solid
    ? (dim ? 'var(--ink-mute)' : 'var(--ink)')
    : (dim ? 'rgba(255,251,244,0.55)' : 'var(--statement-fg)');
  return (
    <span className="mono" style={{
      fontWeight: dim ? 500 : 700,
      fontSize: '1.15em',
      color,
      letterSpacing: '-0.01em',
    }}>{children}</span>
  );
}

window.ScreenAnalytics = ScreenAnalytics;
