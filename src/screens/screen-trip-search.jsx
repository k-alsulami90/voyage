// Trip search — one field over expenses, documents and plan activities.
// Results look the way they do on their own pages: an expense is the same
// row as in Expenses, a document is a small pass in its own colour, an
// activity carries its day. Everything is in the app's language — category
// names, people, airports and places all match.

function ScreenTripSearch({ back, openSheet, openDoc, go }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    // Focus the input on mount so the keyboard opens immediately
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const ar = window.isRTL;
  const lower = q.trim().toLowerCase();
  const hasQ = lower.length > 0;
  const match = (s) => s != null && s !== '' && String(s).toLowerCase().includes(lower);
  const members = window.MEMBERS || [];
  const nameOf = (id) => (members.find((m) => m.id === id)?.name || '');

  // ── Expenses: title, note, category (either language), who paid
  const catWords = (k) => [window.CAT_META?.[k]?.label_ar, window.CAT_META?.[k]?.label_en, window.catLabel?.(k)];
  const expenses = !hasQ ? [] : (window.EXPENSES || [])
    .filter((e) => match(e.title) || match(e.note) || catWords(e.cat).some(match) || match(nameOf(e.who)))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  // ── Documents: title, details (airports, addresses…), kind
  const DOC_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
  const cats = window.DOC_CATEGORIES || [];
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const docs = !hasQ ? [] : allDocs.filter((d) =>
    match(d.title) || match(d.sub) || match(DOC_T[d.category] && t(DOC_T[d.category])) || match(window.docKind?.(d))
    || Object.values(d.details || {}).some(match));

  // ── Plan activities: title, place, type
  const planMeta = window.PLAN_CAT_META || {};
  const planCat = window.planCatOf || ((c) => c);
  const planItems = !hasQ ? [] : (window.ITINERARY || []).filter((it) => {
    const meta = planMeta[planCat(it.category)];
    return match(it.title) || match(it.location) || match(meta?.label_ar) || match(meta?.label_en);
  });

  const total = expenses.length + docs.length + planItems.length;

  const trip = window.TRIP;
  const home = trip?.homeCurrency || 'USD';
  const local = trip?.localCurrency || home;
  const conv = (usd) => window.fmtMoney(usd, { in: home });
  const alt = home === local ? null : (usd) => window.fmtMoney(usd, { in: local });
  const wallets = !!window.walletsOf?.(trip);
  const dayNum = (iso) => (trip?.startDate && iso >= trip.startDate && (!trip.endDate || iso <= trip.endDate))
    ? Math.round((new Date(iso + 'T00:00:00') - new Date(trip.startDate + 'T00:00:00')) / 86400000) + 1 : 0;

  const onPickExpense = (e) => { back(); setTimeout(() => openSheet?.('editExpense', e), 50); };
  const onPickDoc = (d) => { back(); setTimeout(() => openDoc?.(d, cats.find((c) => c.key === d.category)), 50); };
  const onPickPlan = () => { back(); setTimeout(() => go?.('plan'), 50); };

  return (
    <div data-screen-label="Trip Search" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 60 }}>
      {/* Header — search input + close */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 12px)) 14px 12px',
        background: 'var(--bar-glass, var(--cream))',
        backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid var(--hairline)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 12px', minHeight: 44, borderRadius: 14,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          }}>
            <window.IconSearch size={16} stroke="var(--ink-mute)" />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={ar ? 'مصروف، فندق، رمز مطار، مكان…' : 'An expense, hotel, airport, place…'}
              style={{
                flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
                fontSize: 16, fontFamily: 'var(--sans)', color: 'var(--ink)', textAlign: 'start',
              }} />
            {q && (
              <button onClick={() => { setQ(''); inputRef.current?.focus(); }} aria-label={ar ? 'مسح' : 'Clear'} style={{
                width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                background: 'var(--ink-mute)', color: 'var(--cream)',
                display: 'grid', placeItems: 'center', fontSize: 14, lineHeight: 1,
              }}>×</button>
            )}
          </div>
          <button onClick={back} style={{
            flexShrink: 0, minHeight: 44, padding: '0 6px', background: 'transparent',
            fontSize: 14, fontWeight: 600, color: 'var(--clay-deep)',
          }}>{ar ? 'إلغاء' : 'Cancel'}</button>
        </div>
        {hasQ && (
          <div style={{ marginTop: 8, padding: '0 4px', fontSize: 12, color: 'var(--ink-mute)' }}>
            {total === 0
              ? (ar ? 'ما فيه نتائج' : 'No results')
              : (ar ? window.arPlural(total, { one: 'نتيجة واحدة', two: 'نتيجتان', few: `${total} نتائج`, many: `${total} نتيجة`, other: `${total} نتيجة` })
                : `${total} result${total === 1 ? '' : 's'}`)}
          </div>
        )}
      </div>

      {!hasQ && (
        <div style={{ padding: '64px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><window.IconSearch size={24} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>
            {ar ? 'ابحث في رحلتك' : 'Search this trip'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 280, lineHeight: 1.55 }}>
            {ar ? 'المصاريف والمستندات والخطة — بالاسم، المكان، رمز المطار أو صاحب البطاقة.'
              : 'Expenses, documents and the plan — by name, place, airport code or card holder.'}
          </div>
        </div>
      )}

      {/* ── Expenses: the same rows as the Expenses page, with their date ── */}
      {expenses.length > 0 && (
        <ResultSection title={ar ? 'المصاريف' : 'Expenses'} count={expenses.length}>
          <div style={{ background: 'var(--cream-2)', borderRadius: 22, border: '0.5px solid var(--hairline)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {expenses.slice(0, 30).map((e, i) => {
              const iso = e.createdAt ? window.localISO(e.createdAt) : '';
              const n = iso ? dayNum(iso) : 0;
              const when = iso ? (n ? (ar ? `اليوم ${n}` : `Day ${n}`) : window.fmtDate(iso)) : null;
              return window.ExpRow
                ? <window.ExpRow key={e.id} e={e} first={i === 0} conv={conv} alt={alt} wallets={wallets} dateLabel={when} onOpen={() => onPickExpense(e)} />
                : null;
            })}
          </div>
        </ResultSection>
      )}

      {/* ── Documents: small passes in their own colours ── */}
      {docs.length > 0 && (
        <ResultSection title={ar ? 'المستندات' : 'Documents'} count={docs.length}>
          <div style={{ display: 'grid', gap: 8 }}>
            {docs.slice(0, 30).map((d) => <DocResult key={d.id} d={d} onOpen={() => onPickDoc(d)} />)}
          </div>
        </ResultSection>
      )}

      {/* ── Plan activities, with their day ── */}
      {planItems.length > 0 && (
        <ResultSection title={ar ? 'الخطة' : 'Plan'} count={planItems.length}>
          <div style={{ background: 'var(--cream-2)', borderRadius: 22, border: '0.5px solid var(--hairline)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {planItems.slice(0, 30).map((it, i) => {
              const meta = planMeta[planCat(it.category)] || { emoji: '📌', color: 'var(--ink-soft)' };
              const n = it.dayDate ? dayNum(it.dayDate) : 0;
              const day = it.dayDate ? (n ? (ar ? `اليوم ${n}` : `Day ${n}`) : window.fmtDate(it.dayDate)) : '';
              const sub = [day, it.startTime ? String(it.startTime).slice(0, 5) : '', it.location].filter(Boolean).join(' · ');
              return (
                <button key={it.id} onClick={onPickPlan} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'start', padding: '0 14px', background: 'transparent' }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: meta.color,
                    display: 'grid', placeItems: 'center', fontSize: 18, lineHeight: 1,
                  }}>{meta.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0, padding: '12px 0', borderTop: i ? '0.5px solid var(--hairline)' : 'none' }}>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
                    {sub && <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </ResultSection>
      )}

      {hasQ && total === 0 && (
        <div style={{ padding: '44px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><window.IconSearch size={20} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 16, color: 'var(--ink)' }}>
            {ar ? `ما لقينا شي لـ «${q}»` : `Nothing for "${q}"`}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>
            {ar ? 'جرّب كلمة ثانية' : 'Try another word'}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, count, children }) {
  return (
    <section style={{ padding: '20px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 9px' }}>
        <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</span>
        <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{count}</span>
      </div>
      {children}
    </section>
  );
}

// A document as a small pass: its kind, its name (or route), its dates.
function DocResult({ d, onOpen }) {
  const ar = window.isRTL;
  const x = d.details || {};
  const day = (v) => String(v || '').slice(0, 10);
  const hm = (v) => (v && String(v).length > 11 ? String(v).slice(11, 16) : '');
  const [s, e] = window.docSpan ? window.docSpan(d) : [null, null];
  const when = d.category === 'visas'
    ? (x.expires_on ? (ar ? `ينتهي ${window.fmtDate(x.expires_on)}` : `Expires ${window.fmtDate(x.expires_on)}`) : '')
    : !s ? ''
    : d.category === 'lodging' && e ? window.fmtDateRange(day(s), day(e))
    : [window.fmtDate(day(s)), hm(s)].filter(Boolean).join(' · ');
  const title = d.category === 'flights' && x.dep_airport && x.arr_airport
    ? `${String(x.dep_airport).toUpperCase()} → ${String(x.arr_airport).toUpperCase()}` : d.title;
  const whose = window.docWhose?.(d);
  return (
    <button onClick={onOpen} className="press-soft" style={{
      position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'start',
      padding: '11px 14px', borderRadius: 16, color: '#fff', overflow: 'hidden',
      background: (window.DOC_PASS_BG || {})[d.category] || 'var(--statement)',
      boxShadow: '0 10px 20px -14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.16)',
    }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 11.5, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {[window.docKind?.(d), whose].filter(Boolean).join(' · ')}
        </span>
        <span dir="auto" style={{ display: 'block', fontSize: 15, fontWeight: 700, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        {when && <span style={{ display: 'block', fontSize: 12, opacity: 0.85, marginTop: 2 }}>{when}</span>}
      </span>
      <span className="icon-flip" style={{ display: 'inline-flex', opacity: 0.8, flexShrink: 0 }}><IconChevron size={13} stroke="#fff" /></span>
    </button>
  );
}

window.ScreenTripSearch = ScreenTripSearch;
