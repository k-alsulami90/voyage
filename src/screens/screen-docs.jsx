// Documents — every document exactly once, as a wallet pass, in the order
// you'll need them:
//   القادمة — bookings still ahead (or happening now), soonest first
//   الوثائق — visas and anything without a date
//   انتهت  — finished bookings, folded away while there's something ahead
// Category chips and search filter all three. A pass carries what you look
// for at the airport or the hotel desk: the route or the name, the dates,
// whose it is, paid or not, and whether the file is attached. Tap it for
// the full document (files, details, edit, delete).

const DOC_PASS_BG = {
  flights:   'linear-gradient(135deg, #2b4a8f 0%, #172447 100%)',
  lodging:   'linear-gradient(135deg, #c0603f 0%, #6d2a1d 100%)',
  transport: 'linear-gradient(135deg, #b48a2e 0%, #5d4315 100%)',
  visas:     'linear-gradient(135deg, #2f7656 0%, #163a2a 100%)',
};

// [start, end] of a document's time window (local "YYYY-MM-DDTHH:MM" or a date).
function docSpan(d) {
  const x = d.details || {};
  if (d.category === 'flights')   return [x.dep_at, x.arr_at || x.dep_at];
  if (d.category === 'lodging')   return [x.check_in_at, x.check_out_at || x.check_in_at];
  if (d.category === 'transport') return [x.pickup_at, x.dropoff_at || x.pickup_at];
  if (d.category === 'visas')     return [x.issued_on, x.expires_on];
  return [null, null];
}
// Comparable minute-precision string; a bare date counts as the whole day.
const _docT = (v, endOfDay) => (!v ? null
  : String(v).length === 10 ? `${v}T${endOfDay ? '23:59' : '00:00'}` : String(v).slice(0, 16));

function ScreenDocs({ go, openSheet, openDoc, loading }) {
  // All hooks declared at the top — never conditional, never after early returns
  const [filter, setFilter]         = React.useState('all');   // 'all' | category key
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch]         = React.useState('');
  const [showPast, setShowPast]     = React.useState(false);

  if (loading) {
    return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  }

  const ar = window.isRTL;
  const Section = window.HubSection;

  // Translate category labels at render time so they follow the current language
  const CAT_KEY_TO_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
  const cats = (window.DOC_CATEGORIES || []).map((c) => ({
    ...c,
    label: CAT_KEY_TO_T[c.key] ? t(CAT_KEY_TO_T[c.key]) : (c.label || c.key),
  }));
  const docsByCat = window.DOCS_BY_CAT || {};
  const allDocs = cats.flatMap((c) =>
    (docsByCat[c.key] || []).map((d) => ({ ...d, category: c.key, categoryLabel: c.label, tint: d.tint || c.tint }))
  );
  const catOf = (d) => cats.find((c) => c.key === d.category);
  const open = (d) => openDoc?.(d, catOf(d));

  // Filter + search (title, subtitle, airline, airports, vendor, address…)
  const q = search.trim().toLowerCase();
  const matches = (d) => {
    if (!q) return true;
    const x = d.details || {};
    return [d.title, d.sub, x.airline, x.dep_airport, x.arr_airport, x.vendor, x.address, x.visa_type]
      .some((v) => String(v || '').toLowerCase().includes(q));
  };
  const visible = allDocs.filter((d) => (filter === 'all' || d.category === filter) && matches(d));

  // One timeline: ahead / papers / done
  const now = new Date();
  const today = window.localISO();
  const nowStr = `${today}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const ahead = [], papers = [], done = [];
  visible.forEach((d) => {
    const [s, e] = docSpan(d);
    const item = { d, S: _docT(s, false), E: _docT(e || s, true) };
    if (d.category === 'visas' || !item.S) papers.push(item);
    else if (item.E >= nowStr) ahead.push(item);
    else done.push(item);
  });
  ahead.sort((a, b) => a.S.localeCompare(b.S));
  done.sort((a, b) => b.E.localeCompare(a.E));
  papers.sort((a, b) => ((a.d.category === 'visas' ? 0 : 1) - (b.d.category === 'visas' ? 0 : 1))
    || String(a.E || '9').localeCompare(String(b.E || '9')));
  const pastOpen = showPast || ahead.length === 0 || !!q;

  const totalCount = allDocs.length;
  const countWord = (n, one, two, few, many) => (ar
    ? (n === 1 ? one : n === 2 ? two : `${n} ${(n >= 3 && n <= 10) ? few : many}`)
    : null);
  const bookingsWord = (n) => countWord(n, 'حجز واحد', 'حجزان', 'حجوزات', 'حجزاً') || `${n} ${n === 1 ? 'booking' : 'bookings'}`;
  const docsWord = (n) => countWord(n, 'مستند واحد', 'مستندان', 'مستندات', 'مستنداً') || `${n} ${n === 1 ? 'document' : 'documents'}`;
  const passList = (items, isDone) => (
    <div className="v-list v-deck" style={{ display: 'grid', gap: 12 }}>
      {items.map((it) => (
        <DocPass key={it.d.id} item={it} nowStr={nowStr} today={today} done={isDone} onOpen={() => open(it.d)} />
      ))}
    </div>
  );

  return (
    <div data-screen-label="Vault" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 150,
    }}>
      {/* HEADER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px',
        background: 'linear-gradient(180deg, var(--cream) 90%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        <button onClick={() => go('hub')} aria-label={ar ? 'رجوع' : 'Back'} style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span></button>

        <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', flex: 1, textAlign: 'center' }}>
          {ar ? 'المستندات' : 'Documents'}
        </div>

        <button onClick={() => { setShowSearch(!showSearch); setSearch(''); }} aria-label={ar ? 'بحث' : 'Search'} style={{
          width: 36, height: 36, borderRadius: 999,
          background: showSearch ? 'var(--sel)' : 'var(--cream-2)',
          border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><IconSearch size={15} stroke={showSearch ? 'var(--sel-fg)' : 'var(--ink-soft)'} /></button>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div style={{ padding: '0 18px 10px' }}>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ar ? 'ابحث بالاسم، المطار، الشركة…' : 'Search name, airport, company…'}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 14,
              border: '1px solid var(--hairline-2)', background: 'var(--cream-2)',
              color: 'var(--ink)', fontSize: 16, outline: 'none',
              textAlign: 'start',
            }}
          />
        </div>
      )}

      {/* CATEGORY CHIPS */}
      {totalCount > 0 && (
        <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 18px 2px' }}>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>{t('all')} · {totalCount}</Chip>
          {cats.map((c) => (
            <Chip key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)}>
              {window.DOC_SCHEMAS?.[c.key]?.emoji} {c.label} · {(docsByCat[c.key] || []).length}
            </Chip>
          ))}
        </div>
      )}

      {/* EMPTY — no docs at all */}
      {totalCount === 0 && <EmptyVault onAdd={() => openSheet?.('addDoc')} />}

      {/* EMPTY — the filter / search found nothing */}
      {totalCount > 0 && visible.length === 0 && (() => {
        const isCategoryFilter = filter !== 'all' && !q;
        const catLabel = isCategoryFilter ? (catOf({ category: filter })?.label || filter) : null;
        return (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'var(--cream-2)', fontSize: 24,
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}>{isCategoryFilter ? (window.DOC_SCHEMAS?.[filter]?.emoji || '📄') : <IconSearch size={22} stroke="var(--ink-mute)" />}</div>
            <div className="serif" style={{ fontSize: 17, color: 'var(--ink)' }}>
              {isCategoryFilter
                ? (ar ? `ما فيه ${catLabel} بعد` : `No ${catLabel} yet`)
                : (ar ? 'ما لقينا شي بهذا البحث' : 'No matching documents')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {isCategoryFilter && (
                <button onClick={() => openSheet?.('addDoc')} style={{
                  minHeight: 40, padding: '0 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  background: 'var(--clay)', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}><IconPlus size={12} stroke="currentColor" />{ar ? 'إضافة' : 'Add'}</button>
              )}
              <button onClick={() => { setFilter('all'); setSearch(''); }} style={{
                minHeight: 40, padding: '0 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
              }}>{ar ? 'كل المستندات' : 'Show all'}</button>
            </div>
          </div>
        );
      })()}

      {/* AHEAD — flights, stays and pickups still to come (or on now) */}
      {ahead.length > 0 && (
        <Section title={ar ? 'القادمة' : 'Coming up'} sub={bookingsWord(ahead.length)}>
          {passList(ahead, false)}
        </Section>
      )}

      {/* PAPERS — visas and anything without a date */}
      {papers.length > 0 && (
        <Section title={ar ? 'الوثائق' : 'Papers'} sub={docsWord(papers.length)}>
          {passList(papers, false)}
        </Section>
      )}

      {/* DONE — finished bookings (folded while something is ahead) */}
      {done.length > 0 && (
        <Section title={ar ? 'انتهت' : 'Done'} sub={bookingsWord(done.length)}
          action={ahead.length > 0 && !q ? (pastOpen ? (ar ? 'إخفاء' : 'Hide') : (ar ? 'عرض' : 'Show')) : null}
          onAction={() => { setShowPast((v) => !v); window.haptic?.(); }}>
          {pastOpen && passList(done, true)}
        </Section>
      )}

      {/* "Add document" — a LABELED pill in ink, so it can't be confused
         with the tab bar's clay "+" (which always adds an expense). */}
      <button onClick={() => openSheet?.('addDoc')} style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom) + 86px)',
          left: '50%', translate: '-50% 0',   // `translate`, not transform: the press-scale on :active must not undo the centring
          minHeight: 46, padding: '0 20px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--cream)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
          boxShadow: '0 10px 22px oklch(0.22 0.025 250 / 0.35)',
          zIndex: 30,
        }}>
        <IconDoc size={17} stroke="currentColor" />
        {ar ? 'إضافة مستند' : 'Add document'}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// The pass
// ──────────────────────────────────────────────────────────────

// Cost as the booking was paid (local currency when stored), else home.
function fmtDocCost(doc) {
  if (doc.costUSD == null) return null;
  if (doc.costCurrency && doc.costLocal != null) {
    return `${doc.costCurrency} ${Math.round(doc.costLocal).toLocaleString('en')}`;
  }
  return window.fmtMoney(doc.costUSD, { in: 'home' });
}

// First name of the traveler a doc belongs to (null = shared / solo trip).
function docOwnerName(doc) {
  if (!doc.ownerUserId) return null;
  const members = window.MEMBERS || [];
  if (members.length <= 1) return null;
  const m = members.find((x) => x.id === doc.ownerUserId);
  return m?.name?.split(' ')[0] || null;
}

const _clip = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l8.6-8.6a3.7 3.7 0 015.2 5.2l-8.6 8.6a1.8 1.8 0 01-2.6-2.6l7.9-7.9" />
  </svg>
);

function DocPass({ item, nowStr, today, done, onOpen }) {
  const { d, S, E } = item;
  const ar = window.isRTL;
  const x = d.details || {};
  const isVisa = d.category === 'visas';
  const active = !done && !isVisa && S && S <= nowStr && nowStr <= E;
  const owner = docOwnerName(d);
  const mine = !!d.ownerUserId && d.ownerUserId === window.currentUserId;
  const cost = d.costUSD > 0 ? fmtDocCost(d) : null;
  const paid = window.isDocPaid?.(d);
  const hasFile = !!(d.filePath || d.secondaryFilePath);
  const emoji = window.DOC_SCHEMAS?.[d.category]?.emoji || '📄';
  const hm = (v) => (v && String(v).length > 11 ? String(v).slice(11, 16) : '');
  const dayOnly = (v) => String(v || '').slice(0, 10);
  const daysFromToday = (v) => Math.round((new Date(dayOnly(v) + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000);

  // ── Stub: the one date that matters + where you are relative to it
  let stubDate = null, caption = '', pill = '', tone = 'plain';
  if (isVisa) {
    stubDate = x.expires_on || null;
    caption = ar ? 'ينتهي' : 'Expires';
    if (stubDate) {
      const expired = _docT(stubDate, true) < nowStr;
      pill = expired ? (ar ? 'منتهية' : 'Expired') : (ar ? 'سارية' : 'Valid');
      tone = expired ? 'warn' : 'good';
    }
  } else if (S) {
    if (done) { stubDate = E; pill = ar ? 'انتهى' : 'Done'; }
    else if (active) { stubDate = E; caption = ar ? 'حتى' : 'Until'; pill = ar ? 'الحين' : 'Now'; tone = 'good'; }
    else {
      stubDate = S;
      const k = daysFromToday(S);
      pill = k <= 0 ? (ar ? 'اليوم' : 'Today') : k === 1 ? (ar ? 'بكرة' : 'Tomorrow') : k === 2 ? (ar ? 'بعد يومين' : 'In 2 days')
        : ar ? (k <= 10 ? `بعد ${k} أيام` : `بعد ${k} يوماً`) : `In ${k} days`;
      tone = k <= 1 ? 'hot' : 'plain';
    }
  }
  const sd = stubDate ? new Date(dayOnly(stubDate) + 'T00:00:00') : null;
  const pillBg = { good: 'rgba(120,215,160,0.28)', warn: 'rgba(255,170,130,0.32)', hot: 'rgba(255,255,255,0.30)', plain: 'rgba(255,255,255,0.18)' }[tone];

  // ── Body lines
  const kind = d.category === 'flights' ? `${emoji} ${x.airline || (ar ? 'طيران' : 'Flight')}`
    : d.category === 'lodging' ? `${emoji} ${ar ? 'إقامة' : 'Stay'}`
    : d.category === 'transport' ? `${emoji} ${x.vendor || (ar ? 'تنقل' : 'Transport')}`
    : `${emoji} ${x.visa_type || (ar ? 'تأشيرة' : 'Visa')}`;
  const whose = mine ? (ar ? '🔒 لك' : '🔒 Yours') : owner ? (ar ? `🔒 لـ ${owner}` : `🔒 ${owner}'s`) : null;
  let line = '';
  if (d.category === 'flights') {
    // The stub already has the date: the flight number + terminal are what you look for.
    line = [
      d.sub || null,
      x.dep_terminal ? (ar ? `صالة ${x.dep_terminal}` : `Terminal ${x.dep_terminal}`) : null,
    ].filter(Boolean).join(' · ')
      || (x.dep_at ? new Date(dayOnly(x.dep_at) + 'T00:00:00').toLocaleDateString(window._dateLocale(), { weekday: 'long', day: 'numeric', month: 'long' }) : '');
  } else if (d.category === 'lodging') {
    const n = x.check_in_at && x.check_out_at
      ? Math.max(1, Math.round((new Date(dayOnly(x.check_out_at)) - new Date(dayOnly(x.check_in_at))) / 86400000)) : 0;
    const nights = n ? (ar ? (n === 1 ? 'ليلة' : n === 2 ? 'ليلتان' : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`) : `${n} ${n === 1 ? 'night' : 'nights'}`) : null;
    line = [x.check_in_at ? window.fmtDateRange(dayOnly(x.check_in_at), dayOnly(x.check_out_at || x.check_in_at)) : null, nights]
      .filter(Boolean).join(' · ');
  } else if (d.category === 'transport') {
    line = [
      hm(x.pickup_at) ? (ar ? `الاستلام ${hm(x.pickup_at)}` : `Pick-up ${hm(x.pickup_at)}`) : null,
      x.dropoff_at ? (ar ? `التسليم ${window.fmtDate(dayOnly(x.dropoff_at))}` : `Drop-off ${window.fmtDate(dayOnly(x.dropoff_at))}`) : null,
    ].filter(Boolean).join(' · ');
  } else {
    line = x.issued_on ? (ar ? `صدرت ${window.fmtDate(x.issued_on)}` : `Issued ${window.fmtDate(x.issued_on)}`) : '';
  }
  if (!line) line = d.sub || '';

  const route = d.category === 'flights' && x.dep_airport && x.arr_airport;
  const notch = { position: 'absolute', insetInlineEnd: 'calc(27% - 9px)', width: 18, height: 18, borderRadius: 99, background: 'var(--cream)', zIndex: 3 };

  return (
    <button onClick={onOpen} className="press-soft"
      aria-label={[d.title, line, pill, cost && (paid ? (ar ? 'مدفوع' : 'paid') : (ar ? 'غير مدفوع' : 'unpaid'))].filter(Boolean).join('، ')}
      style={{
        position: 'relative', display: 'block', width: '100%', height: 128, borderRadius: 20,
        overflow: 'hidden', textAlign: 'start', color: '#fff', padding: 0,
        boxShadow: done ? 'none' : '0 16px 30px -16px rgba(0,0,0,0.5)',
      }}>
      {/* the pass itself (faded once it's done) */}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden',
        background: d.coverUrl ? '#1b1f2a' : (DOC_PASS_BG[d.category] || DOC_PASS_BG.flights),
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
        filter: done ? 'saturate(0.3)' : 'none', opacity: done ? 0.78 : 1,
      }}>
        {d.coverUrl && <span style={{ position: 'absolute', inset: 0, backgroundImage: `url(${d.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
        {d.coverUrl && <span style={{ position: 'absolute', inset: 0, background: 'rgba(10,12,20,0.62)' }} />}
        <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%)' }} />
        {/* perforation between body and stub */}
        <span style={{ position: 'absolute', top: 12, bottom: 12, insetInlineEnd: '27%', borderInlineStart: '2px dashed rgba(255,255,255,0.28)' }} />

        {/* body */}
        <span style={{
          position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, insetInlineEnd: '27%',
          padding: '13px 16px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, minWidth: 0 }}>
            <span style={{ opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{kind}</span>
            {whose && <span style={{ flexShrink: 0, padding: '1px 7px', borderRadius: 99, background: 'rgba(255,255,255,0.16)', fontWeight: 600 }}>{whose}</span>}
          </span>

          {route ? (
            <span dir="ltr" style={{ direction: 'ltr', display: 'flex', alignItems: 'center', gap: 10, justifyContent: ar ? 'flex-end' : 'flex-start' }}>
              <span>
                <span className="mono" style={{ display: 'block', fontSize: 27, fontWeight: 800, lineHeight: 1 }}>{String(x.dep_airport).toUpperCase().slice(0, 3)}</span>
                {hm(x.dep_at) && <span style={{ display: 'block', fontSize: 11, opacity: 0.78, marginTop: 3 }}>{hm(x.dep_at)}</span>}
              </span>
              <span style={{ opacity: 0.85, fontSize: 14, letterSpacing: '-0.05em' }}>——✈——</span>
              <span>
                <span className="mono" style={{ display: 'block', fontSize: 27, fontWeight: 800, lineHeight: 1 }}>{String(x.arr_airport).toUpperCase().slice(0, 3)}</span>
                {hm(x.arr_at) && <span style={{ display: 'block', fontSize: 11, opacity: 0.78, marginTop: 3 }}>{hm(x.arr_at)}</span>}
              </span>
            </span>
          ) : (
            <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title || '—'}</span>
          )}

          <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 12, opacity: 0.88, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line}</span>
            {cost && (
              <span className="mono" style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                background: paid ? 'rgba(255,255,255,0.16)' : 'rgba(255,190,120,0.30)',
                color: paid ? '#fff' : '#ffe1bf',
              }}>
                {paid ? '✓' : (ar ? 'غير مدفوع' : 'Unpaid')} {cost}
              </span>
            )}
          </span>
        </span>

        {/* stub */}
        <span style={{
          position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: '27%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textAlign: 'center',
        }}>
          {hasFile && (
            <span title={ar ? 'الملف مرفق' : 'File attached'} style={{ position: 'absolute', top: 9, insetInlineEnd: 10, opacity: 0.8, display: 'inline-flex' }}>{_clip}</span>
          )}
          {caption && <span style={{ fontSize: 10.5, opacity: 0.75 }}>{caption}</span>}
          {sd ? (
            <>
              <span className="mono" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{sd.getDate()}</span>
              <span style={{ fontSize: 11, opacity: 0.82 }}>{sd.toLocaleDateString(window._dateLocale(), { month: 'short' })}</span>
            </>
          ) : (
            <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
          )}
          {pill && <span style={{ marginTop: 4, padding: '2px 9px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: pillBg, whiteSpace: 'nowrap' }}>{pill}</span>}
        </span>
      </span>
      {/* ticket notches cut from the page colour */}
      <span style={{ ...notch, top: -9 }} />
      <span style={{ ...notch, bottom: -9 }} />
    </button>
  );
}

// Empty state — no docs uploaded yet
function EmptyVault({ onAdd }) {
  const ar = window.isRTL;
  return (
    <div style={{
      padding: '56px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: 14,
    }}>
      {/* three blank passes, fanned */}
      <div aria-hidden="true" style={{ position: 'relative', width: 150, height: 96, marginBottom: 4 }}>
        {['flights', 'lodging', 'visas'].map((k, i) => (
          <span key={k} style={{
            position: 'absolute', inset: 0, borderRadius: 16, background: DOC_PASS_BG[k],
            transform: `translateY(${(2 - i) * -9}px) scale(${0.88 + i * 0.06}) rotate(${(i - 1) * -4}deg)`,
            boxShadow: '0 10px 20px -10px rgba(0,0,0,0.45)', opacity: 0.55 + i * 0.22,
          }} />
        ))}
      </div>
      <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>
        {ar ? 'ما فيه مستندات بعد' : 'No documents yet'}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-mute)', maxWidth: 260, lineHeight: 1.55 }}>
        {ar
          ? 'حط تذاكر الطيران، حجوزات الفنادق، التأشيرات والسيارات هنا — كل وحدة تصير بطاقة بموعدها.'
          : 'Add flights, hotel bookings, visas and rentals — each becomes a pass with its date.'}
      </div>
      <button onClick={onAdd} style={{
        marginTop: 6, minHeight: 46, padding: '0 22px', borderRadius: 14,
        background: 'var(--ink)', color: 'var(--cream)',
        fontSize: 14, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: 'var(--shadow-md)',
      }}>
        <IconUpload size={14} stroke="currentColor" />
        {ar ? 'إضافة أول مستند' : 'Add your first document'}
      </button>
    </div>
  );
}

window.ScreenDocs = ScreenDocs;
