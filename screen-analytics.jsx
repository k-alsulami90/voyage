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
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.72 }}>
                {window.isRTL ? 'المعدل اليومي' : 'DAILY AVERAGE'}
              </div>
              <div className="serif" style={{ fontSize: 44, lineHeight: 1, marginTop: 4 }}>
                {fmtC(dailyAvg)}
              </div>
              <div style={{ fontSize: 12, opacity: 0.62, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                {dailyPlan > 0 && (
                  <>
                    vs {fmtC(dailyPlan)} {window.isRTL ? 'مخطط' : 'planned'} ·{' '}
                    <span style={{ color: burnPct > 0 ? 'oklch(0.78 0.13 30)' : 'oklch(0.78 0.13 145)' }}>
                      {burnPct > 0 ? '+' : ''}{burnPct.toFixed(0)}%
                    </span>
                  </>
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

          {/* Full-trip daily bar chart — scrolls horizontally if many days */}
          {allDays.length > 0 && (
            <div className="no-scrollbar" style={{
              position: 'relative', marginTop: 18,
              overflowX: 'auto', overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end',
                gap: 5, height: 64, flexDirection: 'row',
                minWidth: '100%',
                // Each bar ~18px wide so a 14-day trip fits without scroll, longer scrolls
                width: Math.max(allDays.length * 22, 100),
              }}>
                {allDays.map((iso, i) => {
                  const val = dailyByISO[iso] || 0;
                  const isPeak = iso === peakISO && val > 0;
                  const heightPct = val > 0 ? Math.max((val / dailyMax) * 100, 4) : 2;
                  const d = new Date(iso + 'T00:00:00');
                  const isFirstOfMonth = d.getDate() === 1 || i === 0;
                  return (
                    <div key={iso} style={{
                      flex: '0 0 auto', width: 18,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    }}>
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{
                          width: '100%', height: `${heightPct}%`,
                          background: val === 0
                            ? 'rgba(255,255,255,0.08)'
                            : (isPeak ? 'var(--clay)' : 'rgba(255,255,255,0.32)'),
                          borderRadius: '3px 3px 0 0',
                        }} />
                      </div>
                      <div style={{
                        fontSize: 8, opacity: isFirstOfMonth ? 0.85 : 0.5,
                        fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
                        fontWeight: isFirstOfMonth ? 600 : 400,
                      }}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PEAK / LOWEST / TOP TX cards */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <div style={{
            padding: '14px', borderRadius: 18, background: 'var(--cream-2)',
            border: '0.5px solid var(--hairline)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -12, insetInlineEnd: -12, width: 48, height: 48,
              borderRadius: '50%', background: 'var(--clay)', opacity: 0.12,
            }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 4 }}>
              {window.isRTL ? 'أعلى يوم' : 'PEAK DAY'}
            </div>
            <div className="serif" style={{ fontSize: 22 }}>{fmtC(maxDay.val)}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>{maxDay.date}</div>
          </div>
          <div style={{
            padding: '14px', borderRadius: 18, background: 'var(--cream-2)',
            border: '0.5px solid var(--hairline)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -12, insetInlineEnd: -12, width: 48, height: 48,
              borderRadius: '50%', background: 'var(--moss)', opacity: 0.12,
            }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--ink-mute)', marginBottom: 4 }}>
              {window.isRTL ? 'أقل يوم' : 'LOWEST DAY'}
            </div>
            <div className="serif" style={{ fontSize: 22 }}>{fmtC(minDay.val === Infinity ? 0 : minDay.val)}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>{minDay.date}</div>
          </div>
        </div>
      </div>

      {/* TOP TRANSACTION */}
      {topTx && (
        <div style={{ padding: '9px 14px 0' }}>
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
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>
                {window.isRTL ? 'أعلى معاملة' : 'TOP TRANSACTION'}
              </div>
              <div style={{
                fontSize: 13.5, fontWeight: 500, marginTop: 2,
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
              <div style={{
                paddingTop: 8, borderTop: '0.5px solid var(--hairline)',
                display: 'flex', justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                <span style={{ fontSize: 11.5, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>
                  {window.isRTL ? 'المجموع' : 'TOTAL'}
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

      {/* BURN RATE summary */}
      <div style={{ padding: '22px 14px 0' }}>
        <div style={{
          background: 'var(--statement)', color: 'var(--statement-fg)',
          borderRadius: 22, padding: '18px 20px',
          margin: '0 8px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(50% 60% at 10% 80%, oklch(0.45 0.10 35 / 0.4) 0%, transparent 60%)',
          }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { l: window.isRTL ? 'المنفق' : 'Spent', v: fmtC(totalUSD) },
              { l: window.isRTL ? 'المتبقي' : 'Remaining', v: trip?.budget?.plannedUSD ? fmtC(Math.max(0, trip.budget.plannedUSD - totalUSD)) : '--' },
              { l: window.isRTL ? 'المعدل اليومي' : 'Daily avg', v: fmtC(dailyAvg) },
              { l: window.isRTL ? 'التوقع' : 'Projected', v: fmtC(dailyAvg * daysTotal) },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, opacity: 0.72, letterSpacing: '0.1em' }}>
                  {s.l.toUpperCase()}
                </div>
                <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 3 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenAnalytics = ScreenAnalytics;
