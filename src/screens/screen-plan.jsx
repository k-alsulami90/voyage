// Plan — the trip as one timeline, day by day.
//   • Each day is a timeline: time · dot on a rail · the activity.
//   • Your bookings (flight, hotel check-in / check-out, car pick-up /
//     drop-off) appear on their day as small passes, straight from
//     Documents — unless you already wrote that activity yourself.
//   • Empty days don't repeat "nothing here" cards: a run of free days is
//     one quiet row. Each day has a single "+".
//   • Today is marked, with a "now" line between what's done and what's next.
// Tap an activity to edit it (move it to another day, log it as an expense,
// delete it); tap a booking to open its pass.

const PLAN_CAT_META = {
  food:      { emoji: '🍜', label_en: 'Food',      label_ar: 'مطاعم ومقاهي',  color: 'var(--clay)' },
  sight:     { emoji: '🎌', label_en: 'Sight',     label_ar: 'معالم سياحية',  color: 'var(--moss)' },
  transport: { emoji: '🚅', label_en: 'Transit',   label_ar: 'تنقل ومواصلات', color: 'var(--indigo)' },
  lodging:   { emoji: '🏨', label_en: 'Lodging',   label_ar: 'سكن وإقامة',    color: 'var(--honey)' },
  misc:      { emoji: '📌', label_en: 'Misc',      label_ar: 'أنشطة أخرى',    color: 'var(--ink-soft)' },
};
// Older items may carry expense categories — read them as plan ones.
const _planCat = (c) => PLAN_CAT_META[c] ? c : ({ culture: 'sight', transit: 'transport', shopping: 'misc', wellness: 'misc' }[c] || 'misc');

// Plan categories don't 1:1 map to expense categories — translate.
const PLAN_TO_EXPENSE_CAT = {
  food: 'food', sight: 'culture', transport: 'transit',
  lodging: 'lodging', misc: 'misc',
};

const _hhmm = (v) => (v ? String(v).slice(0, 5) : '');

// Bookings from Documents that land on the trip's days.
function planBookings(trip) {
  if (!trip || window.DOCS_TRIP_ID !== trip.id) return [];
  const ar = window.isRTL;
  const out = [];
  const add = (doc, at, label) => {
    if (!at) return;
    const day = String(at).slice(0, 10);
    if (trip.startDate && day < trip.startDate) return;
    if (trip.endDate && day > trip.endDate) return;
    out.push({ kind: 'booking', id: `${doc.id}-${label}`, doc, dayDate: day, time: String(at).length > 11 ? String(at).slice(11, 16) : '', label });
  };
  Object.values(window.DOCS_BY_CAT || {}).flat().forEach((doc) => {
    const x = doc.details || {};
    if (doc.category === 'flights') add(doc, x.dep_at, ar ? 'إقلاع' : 'Departs');
    if (doc.category === 'lodging') { add(doc, x.check_in_at, ar ? 'تسجيل دخول' : 'Check-in'); add(doc, x.check_out_at, ar ? 'تسجيل خروج' : 'Check-out'); }
    if (doc.category === 'transport') { add(doc, x.pickup_at, ar ? 'استلام' : 'Pick-up'); add(doc, x.dropoff_at, ar ? 'تسليم' : 'Drop-off'); }
  });
  return out;
}
// Did the traveller already write this booking as an activity that day?
const _GENERIC = new Set(['hotel', 'palace', 'resort', 'airport', 'rental', 'check', 'flight', 'فندق', 'مطار', 'رحلة']);
function _alreadyPlanned(booking, dayItems) {
  const words = String(booking.doc.title || '').toLowerCase().split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 4 && !_GENERIC.has(w));
  if (!words.length) return false;
  return dayItems.some((it) => { const tl = String(it.title || '').toLowerCase(); return words.some((w) => tl.includes(w)); });
}

function ScreenPlan({ go, openSheet, openDoc, loading }) {
  const drumRoot = React.useRef(null);
  React.useEffect(() => {
    const root = drumRoot.current; if (!root || !window.bindDepthScroll) return;
    return window.bindDepthScroll(root.closest('.v-screen'), () => Array.from(root.querySelectorAll('.v-drum')), { axis: 'y', rot: 11, scale: 0.05 });
  });
  const trip = window.TRIP;
  const items = window.ITINERARY || [];
  const [editingItem, setEditingItem] = React.useState(null);
  const [addingForDay, setAddingForDay] = React.useState(null);
  const [showPast, setShowPast] = React.useState(false);

  const dataReady = trip && window.isTripDataReady?.(trip.id);
  if (loading || !trip || !dataReady) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('planNav') || 'Plan'} onBack={() => go('hub')} />
        {!trip && !loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
            <div className="serif" style={{ fontSize: 18 }}>
              {window.isRTL ? 'يرجى تحديد وفتح رحلة أولاً' : 'Open a trip first'}
            </div>
          </div>
        ) : <TripSkeleton />}
      </div>
    );
  }

  const ar = window.isRTL;
  // Build the day array from trip start/end dates
  const start = trip.startDate ? new Date(trip.startDate + 'T00:00:00') : null;
  const end   = trip.endDate   ? new Date(trip.endDate   + 'T00:00:00') : start;
  const days = [];
  if (start && end) {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(new Date(d));
  }
  const isoDay = (d) => window.localISO(d);
  const todayIso = window.localISO();
  const now = new Date();
  const nowHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // One sorted timeline per day: your activities + bookings not written yet
  const itemsByDay = {};
  items.forEach((it) => { (itemsByDay[it.dayDate] = itemsByDay[it.dayDate] || []).push(it); });
  const bookingsByDay = {};
  planBookings(trip).forEach((b) => { (bookingsByDay[b.dayDate] = bookingsByDay[b.dayDate] || []).push(b); });
  const rowsOf = (iso) => {
    const mine = (itemsByDay[iso] || []).map((it) => ({ kind: 'item', id: it.id, it, time: _hhmm(it.startTime), order: it.sortOrder || 0 }));
    const books = (bookingsByDay[iso] || []).filter((b) => !_alreadyPlanned(b, itemsByDay[iso] || []));
    return [...mine, ...books].sort((a, b) => {
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      if (a.time !== b.time) return a.time.localeCompare(b.time);
      return (a.order || 0) - (b.order || 0);
    });
  };

  // Group the days: busy days stand alone, consecutive free days merge
  const pastCount = days.filter((d) => isoDay(d) < todayIso).length;
  const foldPast = pastCount > 0 && pastCount < days.length;
  const blocks = [];
  days.forEach((d, idx) => {
    const iso = isoDay(d);
    if (foldPast && !showPast && iso < todayIso) return;
    const rows = rowsOf(iso);
    const isToday = iso === todayIso;
    const last = blocks[blocks.length - 1];
    if (!rows.length && !isToday) {
      if (last && last.free) { last.days.push({ d, idx, iso }); return; }
      blocks.push({ free: true, days: [{ d, idx, iso }] });
    } else {
      blocks.push({ free: false, d, idx, iso, rows, isToday });
    }
  });
  const planned = items.length;
  const span = days.length;

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 110 }} className="no-scrollbar">
      <LargeTitleHeader
        title={t('planNav') || 'Plan'}
        subtitle={[trip.title, trip.dates, span ? (ar ? window.arPlural(span, { one: 'يوم واحد', two: 'يومان', few: `${span} أيام`, many: `${span} يوماً`, other: `${span} يوم` }) : `${span} days`) : null].filter(Boolean).join(' · ')}
        onBack={() => go('hub')}
      />

      <div ref={drumRoot} style={{ padding: '4px 14px 24px' }}>
        {days.length === 0 ? (
          <div style={{
            padding: '44px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            background: 'var(--cream-2)', borderRadius: 24, border: '0.5px solid var(--hairline)', marginTop: 10,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'var(--cream)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><IconCalendar size={24} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>
              {ar ? 'حدد تواريخ الرحلة أول' : 'Pick your trip dates first'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 260, lineHeight: 1.55 }}>
              {ar ? 'بعدها تطلع أيام الرحلة هنا وتقدر تخطط كل يوم.' : 'Then the days show up here and you can plan each one.'}
            </div>
            <button onClick={() => go?.('settings')} style={{
              marginTop: 4, minHeight: 44, padding: '0 18px', borderRadius: 14,
              background: 'var(--ink)', color: 'var(--cream)', fontSize: 13.5, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <IconGear size={14} stroke="currentColor" />
              {ar ? 'إعدادات الرحلة' : 'Trip settings'}
            </button>
          </div>
        ) : (
          <>
            {foldPast && (
              <button onClick={() => { setShowPast((v) => !v); window.haptic?.(); }} style={{
                width: '100%', marginTop: 6, minHeight: 44, borderRadius: 14,
                background: 'transparent', border: '0.5px dashed var(--hairline-2)',
                fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {showPast
                  ? (ar ? 'إخفاء الأيام اللي راحت' : 'Hide past days')
                  : (ar ? `الأيام اللي راحت (${pastCount})` : `Past days (${pastCount})`)}
              </button>
            )}
            {blocks.map((b) => b.free ? (
              <PlanFreeDays key={b.days[0].iso} days={b.days} onAdd={() => setAddingForDay(b.days[0].iso)} />
            ) : (
              <PlanDay key={b.iso} date={b.d} dayNumber={b.idx + 1} rows={b.rows} isToday={b.isToday}
                past={b.iso < todayIso} nowHM={nowHM}
                onAdd={() => setAddingForDay(b.iso)}
                onTapItem={(it) => setEditingItem(it)}
                onTapBooking={(doc) => openDoc?.(doc, (window.DOC_CATEGORIES || []).find((c) => c.key === doc.category))} />
            ))}
            {planned === 0 && (
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 18, lineHeight: 1.6 }}>
                {ar ? 'حجوزاتك من المستندات تطلع هنا تلقائياً — وأضف أنت الأماكن والمطاعم.' : 'Bookings from Documents show up here by themselves — add the places and food.'}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add sheet */}
      <Sheet open={!!addingForDay} onClose={() => setAddingForDay(null)}
             title={ar ? 'نشاط جديد' : 'New activity'} height={0.86}>
        {addingForDay && (
          <AddPlanItemSheet dayDate={addingForDay} days={days.map(isoDay)} openSheet={openSheet}
            onDone={() => setAddingForDay(null)} />
        )}
      </Sheet>

      {/* Edit sheet */}
      <Sheet open={!!editingItem} onClose={() => setEditingItem(null)}
             title={ar ? 'تعديل النشاط' : 'Edit activity'} height={0.86}>
        {editingItem && (
          <AddPlanItemSheet existing={editingItem} dayDate={editingItem.dayDate} days={days.map(isoDay)} openSheet={openSheet}
            onDone={() => setEditingItem(null)} />
        )}
      </Sheet>
    </div>
  );
}

function fmtDayLabel(d) {
  const weekday = d.toLocaleDateString(window._dateLocale ? window._dateLocale() : (window.isRTL ? 'ar' : 'en'), { weekday: 'long' });
  const datePart = window.fmtDate ? window.fmtDate(window.localISO(d)) : d.toLocaleDateString();
  return { weekday, datePart };
}

// A day: header (number, weekday + date, today badge, one "+") + timeline
function PlanDay({ date, dayNumber, rows, isToday, past, nowHM, onAdd, onTapItem, onTapBooking }) {
  const ar = window.isRTL;
  const { weekday, datePart } = fmtDayLabel(date);
  // Where "now" falls in today's timeline
  const nowAt = isToday ? rows.findIndex((r) => r.time && r.time > nowHM) : -1;
  const nowIdx = isToday ? (nowAt === -1 ? rows.filter((r) => r.time).length : nowAt) : -1;
  return (
    <section className="v-drum" style={{ marginTop: 22, transformOrigin: '50% 50%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 9px' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {ar ? `اليوم ${dayNumber}` : `Day ${dayNumber}`}
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{weekday} · {datePart}</span>
          {isToday && window.HubPill && <window.HubPill tone="good">{ar ? 'اليوم' : 'Today'}</window.HubPill>}
        </div>
        <button onClick={onAdd} aria-label={ar ? `إضافة نشاط لليوم ${dayNumber}` : `Add to day ${dayNumber}`} style={{
          width: 34, height: 34, borderRadius: 999, flexShrink: 0,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center', color: 'var(--ink-soft)',
        }}><IconPlus size={14} stroke="currentColor" /></button>
      </div>

      <div style={{
        background: 'var(--cream-2)', borderRadius: 22, border: isToday ? '1px solid oklch(0.62 0.13 35 / 0.35)' : '0.5px solid var(--hairline)',
        padding: '6px 0', boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
      }}>
        {rows.length === 0 && (
          <button onClick={onAdd} style={{ width: '100%', padding: '14px 16px', textAlign: 'start', fontSize: 13, color: 'var(--ink-mute)', background: 'transparent' }}>
            {ar ? 'ما فيه شي اليوم بعد — اضغط + وأضف' : 'Nothing today yet — tap + to add'}
          </button>
        )}
        {rows.map((r, i) => (
          <React.Fragment key={r.kind + r.id}>
            {i === nowIdx && <PlanNowLine nowHM={nowHM} />}
            <PlanRow row={r} first={i === 0} last={i === rows.length - 1}
              done={past || (isToday && r.time && r.time <= nowHM)}
              onTap={() => (r.kind === 'item' ? onTapItem(r.it) : onTapBooking(r.doc))} />
          </React.Fragment>
        ))}
        {isToday && rows.length > 0 && nowIdx === rows.length && <PlanNowLine nowHM={nowHM} />}
      </div>
    </section>
  );
}

// Consecutive days with nothing on them, as one quiet row.
function PlanFreeDays({ days, onAdd }) {
  const ar = window.isRTL;
  const first = days[0], lastD = days[days.length - 1];
  const many = days.length > 1;
  const title = many
    ? (ar ? `اليوم ${first.idx + 1} – ${lastD.idx + 1}` : `Days ${first.idx + 1}–${lastD.idx + 1}`)
    : (ar ? `اليوم ${first.idx + 1}` : `Day ${first.idx + 1}`);
  const range = many
    ? (window.fmtDateRange ? window.fmtDateRange(first.iso, lastD.iso) : `${first.iso} – ${lastD.iso}`)
    : `${fmtDayLabel(first.d).weekday} · ${fmtDayLabel(first.d).datePart}`;
  return (
    <button onClick={onAdd} className="v-drum" style={{
      width: '100%', marginTop: 22, minHeight: 60, borderRadius: 20, padding: '10px 16px', textAlign: 'start',
      background: 'transparent', border: '1px dashed var(--hairline-2)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--ink-soft)' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>
          {range} · {many ? (ar ? 'أيام فاضية' : 'free days') : (ar ? 'يوم فاضي' : 'free day')}
        </span>
      </span>
      <span style={{
        flexShrink: 0, minHeight: 34, padding: '0 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)',
      }}><IconPlus size={12} stroke="currentColor" />{ar ? 'أضف' : 'Add'}</span>
    </button>
  );
}

// "Now" marker inside today's timeline
function PlanNowLine({ nowHM }) {
  const ar = window.isRTL;
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 14px' }}>
      <span className="mono" style={{ width: 44, fontSize: 11, fontWeight: 700, color: 'var(--clay-deep)', direction: 'ltr', textAlign: ar ? 'right' : 'left' }}>{nowHM}</span>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--clay)', boxShadow: '0 0 0 3px oklch(0.62 0.13 35 / 0.18)', flexShrink: 0, marginInline: 2 }} />
      <span style={{ flex: 1, height: 1.5, background: 'var(--clay)', opacity: 0.55, borderRadius: 99 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--clay-deep)' }}>{ar ? 'الحين' : 'Now'}</span>
    </div>
  );
}

// One line of the timeline: time · dot on the rail · the activity or booking
function PlanRow({ row, first, last, done, onTap }) {
  const ar = window.isRTL;
  const isBooking = row.kind === 'booking';
  const it = row.it;
  const cat = isBooking ? null : _planCat(it.category);
  const meta = cat ? PLAN_CAT_META[cat] : null;
  const doc = row.doc;
  const dotColor = isBooking ? ({ flights: '#2b4a8f', lodging: '#c0603f', transport: '#b48a2e' }[doc.category] || 'var(--ink-soft)') : meta.color;
  const openMaps = (e) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.location)}`, '_blank');
  };
  const x = isBooking ? (doc.details || {}) : null;
  const bookingTitle = isBooking
    ? (doc.category === 'flights' && x.dep_airport && x.arr_airport ? `${String(x.dep_airport).toUpperCase()} → ${String(x.arr_airport).toUpperCase()}` : doc.title)
    : null;
  return (
    <div role="button" tabIndex={0} onClick={onTap} onKeyDown={(e) => { if (e.key === 'Enter') onTap(); }} style={{
      display: 'flex', alignItems: 'stretch', gap: 8, padding: '0 14px', cursor: 'pointer',
      opacity: done ? 0.6 : 1,
    }}>
      {/* time */}
      <span className="mono" style={{
        width: 44, flexShrink: 0, paddingTop: 13, fontSize: 12.5, fontWeight: 700,
        color: row.time ? 'var(--ink-soft)' : 'var(--ink-mute)', direction: 'ltr', textAlign: ar ? 'right' : 'left',
      }}>{row.time || '—'}</span>
      {/* rail */}
      <span style={{ position: 'relative', width: 14, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <span style={{ position: 'absolute', top: first ? 18 : 0, bottom: last ? 'calc(100% - 18px)' : 0, width: 2, borderRadius: 2, background: 'var(--hairline-2)' }} />
        <span style={{ position: 'relative', marginTop: 13, width: 10, height: 10, borderRadius: 99, background: dotColor, boxShadow: '0 0 0 3px var(--cream-2)' }} />
      </span>
      {/* content */}
      <span style={{ flex: 1, minWidth: 0, padding: '9px 0 10px' }}>
        {isBooking ? (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 14, color: '#fff',
            background: (window.DOC_PASS_BG || {})[doc.category] || 'var(--statement)',
            boxShadow: '0 8px 16px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.16)',
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{window.DOC_SCHEMAS?.[doc.category]?.emoji || '📄'}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 11.5, opacity: 0.85 }}>{row.label}</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bookingTitle}</span>
            </span>
            <span className="icon-flip" style={{ display: 'inline-flex', opacity: 0.8 }}><IconChevron size={13} stroke="#fff" /></span>
          </span>
        ) : (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>{meta.emoji}</span>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
            </span>
            {(it.location || it.linkedExpenseId) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, fontSize: 12, color: 'var(--ink-mute)', minWidth: 0 }}>
                {it.location && (
                  <span role="link" onClick={openMaps} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, minWidth: 0, color: 'var(--ink-soft)', textDecoration: 'underline', textDecorationColor: 'var(--hairline-2)', textUnderlineOffset: 3 }}>
                    <IconPin size={11} stroke="currentColor" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.location}</span>
                  </span>
                )}
                {it.linkedExpenseId && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, color: 'var(--moss)', fontWeight: 600 }}>
                    <IconCheck size={11} stroke="currentColor" />{ar ? 'مسجّل كمصروف' : 'Logged'}
                  </span>
                )}
              </span>
            )}
          </>
        )}
      </span>
    </div>
  );
}

function AddPlanItemSheet({ dayDate, days, existing, onDone, openSheet }) {
  const trip = window.TRIP;
  const ar = window.isRTL;
  const isEdit = !!existing;
  const [title,    setTitle]    = React.useState(existing?.title || '');
  const [category, setCategory] = React.useState(existing ? _planCat(existing.category) : 'sight');
  const [time,     setTime]     = React.useState(existing?.startTime ? existing.startTime.slice(0, 5) : '');
  const [location, setLocation] = React.useState(existing?.location || '');
  const [day,      setDay]      = React.useState(dayDate);
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState(null);
  const dayRef = React.useRef(null);
  React.useEffect(() => {           // bring the chosen day into view
    const el = dayRef.current?.querySelector('[data-on="1"]');
    el?.scrollIntoView?.({ block: 'nearest', inline: 'center' });
  }, []);

  const handleSave = async () => {
    if (!title.trim()) { setError(ar ? 'اكتب اسم النشاط' : 'Enter a title'); return; }
    setLoading(true); setError(null);
    try {
      const payload = { dayDate: day, startTime: time || null, title, category, location };
      if (isEdit) await window.updateItineraryItem(existing.id, trip?.id, payload);
      else await window.addItineraryItem(trip?.id, payload);
      await window.loadItinerary(trip?.id);
      window.toast?.(isEdit ? (ar ? 'تم الحفظ' : 'Saved') : (ar ? 'انضاف للخطة' : 'Added to the plan'), 'success');
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(ar ? 'تحذف هذا النشاط من الخطة؟' : 'Delete this activity?')) return;
    setLoading(true);
    try {
      await window.deleteItineraryItem(existing.id, trip?.id);
      await window.loadItinerary(trip?.id);
      onDone();
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const logExpense = () => {
    onDone();
    openSheet?.('addExpense', {
      title: existing.title,
      cat: PLAN_TO_EXPENSE_CAT[_planCat(existing.category)] || 'misc',
      source: { plan: existing.id },   // links the expense back to this activity
    });
  };

  const field = {
    width: '100%', padding: '13px 14px', borderRadius: 14, boxSizing: 'border-box',
    border: '0.5px solid var(--hairline-2)', background: 'var(--cream)', color: 'var(--ink)',
    fontSize: 16, fontFamily: 'var(--sans)', outline: 'none', textAlign: 'start',
  };
  const label = { fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', margin: '16px 2px 8px' };

  return (
    <div style={{ padding: '4px 20px 28px' }}>
      <div style={{ ...label, marginTop: 4 }}>{ar ? 'وش النشاط؟' : 'What is it?'}</div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus={!isEdit}
        placeholder={ar ? 'مثلاً: آيا صوفيا، عشاء في ميكلا' : 'e.g. Hagia Sophia, dinner at Mikla'} style={field} />

      <div style={label}>{ar ? 'النوع' : 'Type'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
        {Object.entries(PLAN_CAT_META).map(([k, meta]) => {
          const on = category === k;
          return (
            <button key={k} onClick={() => setCategory(k)} aria-pressed={on} style={{
              minHeight: 64, borderRadius: 14, padding: '6px 2px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              background: on ? meta.color : 'var(--cream)', color: on ? '#fff' : 'var(--ink-soft)',
              border: on ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
              fontSize: 11, fontWeight: 600, lineHeight: 1.2, textAlign: 'center',
            }}>
              <span style={{ fontSize: 19 }}>{meta.emoji}</span>
              <span>{(ar ? meta.label_ar : meta.label_en).split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {(days || []).length > 1 && (
        <>
          <div style={label}>{ar ? 'اليوم' : 'Day'}</div>
          <div ref={dayRef} className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {days.map((iso, i) => {
              const on = day === iso;
              const d = new Date(iso + 'T00:00:00');
              return (
                <button key={iso} data-on={on ? '1' : '0'} onClick={() => setDay(iso)} style={{
                  flexShrink: 0, minWidth: 58, minHeight: 58, borderRadius: 14, padding: '6px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                  background: on ? 'var(--sel)' : 'var(--cream)', color: on ? 'var(--sel-fg)' : 'var(--ink-soft)',
                  border: on ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
                }}>
                  <span style={{ fontSize: 10.5, opacity: 0.8 }}>{ar ? `اليوم ${i + 1}` : `Day ${i + 1}`}</span>
                  <span className="mono" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{d.getDate()}</span>
                  <span style={{ fontSize: 10.5, opacity: 0.8 }}>{d.toLocaleDateString(window._dateLocale ? window._dateLocale() : 'en', { weekday: 'short' })}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 10 }}>
        <div>
          <div style={label}>{ar ? 'الوقت' : 'Time'}</div>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ ...field, direction: 'ltr' }} />
        </div>
        <div>
          <div style={label}>{ar ? 'المكان' : 'Place'}</div>
          <input value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder={ar ? 'الحي أو العنوان' : 'Area or address'} style={field} />
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 12,
          background: 'oklch(0.62 0.13 35 / 0.10)', border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
          fontSize: 13, color: 'var(--clay-deep)',
        }}>{error}</div>
      )}

      <button onClick={handleSave} disabled={loading} style={{
        width: '100%', marginTop: 20, minHeight: 52, borderRadius: 16,
        background: loading ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
        fontSize: 15, fontWeight: 700,
        boxShadow: loading ? 'none' : '0 8px 20px oklch(0.62 0.13 35 / 0.35)',
      }}>
        {loading ? (ar ? 'جارٍ الحفظ…' : 'Saving…') : (isEdit ? (ar ? 'حفظ' : 'Save') : (ar ? 'أضف للخطة' : 'Add to plan'))}
      </button>

      {isEdit && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {!existing.linkedExpenseId && (
            <button onClick={logExpense} disabled={loading} style={{
              flex: 1, minHeight: 46, borderRadius: 14, fontSize: 13.5, fontWeight: 600,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}><IconWallet size={14} stroke="currentColor" />{ar ? 'سجّل كمصروف' : 'Log as expense'}</button>
          )}
          <button onClick={handleDelete} disabled={loading} style={{
            flex: 1, minHeight: 46, borderRadius: 14, fontSize: 13.5, fontWeight: 600,
            background: 'transparent', border: '0.5px solid var(--hairline-2)', color: 'var(--clay-deep)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}><IconTrash size={14} stroke="currentColor" />{ar ? 'حذف' : 'Delete'}</button>
        </div>
      )}
    </div>
  );
}

window.ScreenPlan = ScreenPlan;
