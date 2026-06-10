// Trip search — full-screen overlay that searches expenses, docs, and
// plan items at once. Triggered from the Hub header.

function ScreenTripSearch({ back, openSheet, openDoc, go }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    // Focus the input on mount so the keyboard opens immediately
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const lower = q.trim().toLowerCase();
  const hasQ = lower.length > 0;

  // Search helpers — case-insensitive substring match.
  const match = (s) => s && String(s).toLowerCase().includes(lower);

  // ── Expenses ──
  const expenses = !hasQ ? [] : (window.EXPENSES || []).filter((e) =>
    match(e.title) || match(e.note) || match(e.cat));

  // ── Docs ──
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const docs = !hasQ ? [] : allDocs.filter((d) => {
    if (match(d.title) || match(d.sub) || match(d.categoryLabel)) return true;
    // Also search structured details (airport codes, addresses, etc.)
    const det = d.details || {};
    return Object.values(det).some((v) => match(v));
  });

  // ── Plan items ──
  const planItems = !hasQ ? [] : (window.ITINERARY || []).filter((it) =>
    match(it.title) || match(it.location));

  const total = expenses.length + docs.length + planItems.length;

  const cats = window.DOC_CATEGORIES || [];
  const eCats = window.CATEGORIES || [];

  const onPickExpense = (e) => {
    back();
    setTimeout(() => openSheet?.('editExpense', e), 50);
  };
  const onPickDoc = (d) => {
    back();
    setTimeout(() => openDoc?.(d, cats.find((c) => c.key === d.category)), 50);
  };
  const onPickPlan = () => {
    back();
    setTimeout(() => go?.('plan'), 50);
  };

  return (
    <div data-screen-label="Trip Search" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 60,
    }}>
      {/* Header — search input + close */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 12px)) 14px 12px',
        background: 'var(--cream)',
        borderBottom: '0.5px solid var(--hairline)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row',
          padding: '8px 12px', borderRadius: 14,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        }}>
          <window.IconSearch size={16} stroke="var(--ink-mute)" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={window.isRTL ? 'ابحث عن مصروفات، مستندات، تفاصيل في الخطة…' : 'Search expenses, docs, plan…'}
            style={{
              flex: 1, border: 0, outline: 'none', background: 'transparent',
              fontSize: 15, fontFamily: 'var(--sans)', color: 'var(--ink)',
              textAlign: 'start',
            }}
          />
          {q && (
            <button onClick={() => { setQ(''); inputRef.current?.focus(); }} aria-label="Clear"
              style={{
                width: 22, height: 22, borderRadius: 999,
                background: 'var(--ink-mute)', color: 'var(--cream)',
                display: 'grid', placeItems: 'center', fontSize: 14, lineHeight: 1,
              }}>×</button>
          )}
          <button onClick={back} style={{
            padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 500,
            background: 'transparent', color: 'var(--ink-soft)',
          }}>{window.isRTL ? 'إلغاء البحث' : 'Cancel'}</button>
        </div>
        {hasQ && (
          // Was uppercase mono 0.06em tracked. Now sentence-case sans
          // ink-mute -- reads as the natural "3 results" sub-label, not
          // a barcode under the search input.
          <div style={{
            marginTop: 8, padding: '0 4px',
            fontSize: 12, color: 'var(--ink-mute)',
          }}>
            {total === 0
              ? (window.isRTL ? 'لم نجد أي نتائج تطابق كلمة البحث' : 'No results')
              : (window.isRTL
                  ? `وجدنا ${window.arPlural(total, { one: 'نتيجة واحدة', two: 'نتيجتين', few: `${total} نتائج`, many: `${total} نتيجة`, other: `${total} نتيجة` })}`
                  : `${total} result${total === 1 ? '' : 's'}`)}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 100px' }}>
        {!hasQ && (
          <div style={{
            padding: '60px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><window.IconSearch size={24} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>
              {window.isRTL ? 'ابحث في تفاصيل ومحتوى الرحلة' : 'Search this trip'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', maxWidth: 280, lineHeight: 1.5 }}>
              {window.isRTL
                ? 'تتبع وابحث في كل مكان: قائمة مصروفاتك، ححوزاتك ومستنداتك (تذاكر وفنادق وتأشيرات)، وجداول أنشطة الأيام — كل شيء متاح هنا فوراً.'
                : 'Expenses, docs (tickets, hotels, visas), plan items — all in one place.'}
            </div>
          </div>
        )}

        {/* ── Expenses section ── */}
        {expenses.length > 0 && (
          <ResultSection
            title={window.isRTL ? 'مصروفات الرحلة' : 'Expenses'}
            count={expenses.length}>
            {expenses.slice(0, 30).map((e) => {
              const c = eCats.find((x) => x.key === e.cat);
              const m = (window.MEMBERS || []).find((x) => x.id === e.who);
              return (
                <ResultRow key={e.id}
                  icon={<div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: c?.color || 'var(--ink-mute)',
                    display: 'grid', placeItems: 'center', fontSize: 16,
                  }}>{(window.CAT_META?.[e.cat]?.emoji) || '💸'}</div>}
                  title={e.title}
                  detail={`${c?.label || e.cat}${m ? ' · ' + m.name.split(' ')[0] : ''}${e.when ? ' · ' + e.when : ''}`}
                  trailing={<div className="mono" style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--ink)',
                  }}>{window.fmtMoney(e.usd, { in: 'home' })}</div>}
                  onClick={() => onPickExpense(e)}
                />
              );
            })}
          </ResultSection>
        )}

        {/* ── Docs section ── */}
        {docs.length > 0 && (
          <ResultSection
            title={window.isRTL ? 'مستندات وحجوزات' : 'Documents'}
            count={docs.length}>
            {docs.slice(0, 30).map((d) => {
              const cat = cats.find((c) => c.key === d.category);
              const tintFill = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' }[d.tint] || 'var(--clay)';
              return (
                <ResultRow key={d.id}
                  icon={d.coverUrl ? (
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      backgroundImage: `url(${d.coverUrl})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                  ) : (
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: tintFill, color: '#fff',
                      display: 'grid', placeItems: 'center',
                    }}><window.IconDoc size={16} stroke="#fff" /></div>
                  )}
                  title={d.title}
                  detail={`${cat?.label || d.category}${window.fmtDocSummary?.(d) ? ' · ' + window.fmtDocSummary(d) : ''}`}
                  onClick={() => onPickDoc(d)}
                />
              );
            })}
          </ResultSection>
        )}

        {/* ── Plan items ── */}
        {planItems.length > 0 && (
          <ResultSection
            title={window.isRTL ? 'أنشطة الخطة' : 'Plan'}
            count={planItems.length}>
            {planItems.slice(0, 30).map((it) => {
              const PLAN_EMOJI = { food: '🍜', sight: '🎌', transport: '🚅', lodging: '🏨', misc: '📌' };
              const d = it.dayDate ? new Date(it.dayDate + 'T00:00:00') : null;
              const dayLabel = d ? d.toLocaleDateString(window.isRTL ? 'ar' : 'en',
                { weekday: 'short', month: 'short', day: 'numeric' }) : '';
              const time = it.startTime ? it.startTime.slice(0, 5) : '';
              return (
                <ResultRow key={it.id}
                  icon={<div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
                    display: 'grid', placeItems: 'center', fontSize: 18,
                  }}>{PLAN_EMOJI[it.category] || '📌'}</div>}
                  title={it.title}
                  detail={[dayLabel, time, it.location].filter(Boolean).join(' · ')}
                  onClick={onPickPlan}
                />
              );
            })}
          </ResultSection>
        )}

        {hasQ && total === 0 && (
          <div style={{
            padding: '40px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><window.IconSearch size={20} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 16, color: 'var(--ink)' }}>
              {window.isRTL ? `لم نجد نتائج لـ "${q}"` : `No results for "${q}"`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
              {window.isRTL ? 'جرّب كلمة بحث أخرى' : 'Try a different keyword'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultSection({ title, count, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {/* Section header was uppercase mono 0.10em tracked -- cascades
         3x per search (Expenses / Documents / Plan). Now sans semibold
         sentence-case matching SectionLabel's typography, with the
         count on the right where it was. */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        flexDirection: 'row', padding: '0 4px', marginBottom: 8,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)' }}>{count}</div>
      </div>
      <div style={{
        background: 'var(--cream-2)', borderRadius: 18, overflow: 'hidden',
        border: '0.5px solid var(--hairline)',
      }}>
        {children}
      </div>
    </div>
  );
}

function ResultRow({ icon, title, detail, trailing, onClick }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
      padding: '11px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      flexDirection: 'row',
      borderBottom: '0.5px solid var(--hairline)',
    }}>
      {icon}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
        {detail && (
          <div style={{
            fontSize: 11, color: 'var(--ink-mute)', marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{detail}</div>
        )}
      </div>
      {trailing}
    </button>
  );
}

window.ScreenTripSearch = ScreenTripSearch;
