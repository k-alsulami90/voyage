// Plan screen — day-by-day itinerary for a trip.
// Each day is a section; activities sort by start_time then sort_order.

function ScreenPlan({ go, openSheet, loading }) {
  const trip = window.TRIP;
  const items = window.ITINERARY || [];
  const [editingItem, setEditingItem] = React.useState(null);
  const [addingForDay, setAddingForDay] = React.useState(null);

  const dataReady = trip && window.isTripDataReady?.(trip.id);
  if (loading || !trip || !dataReady) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('planNav') || 'Plan'} onBack={() => go('hub')} />
        {!trip && !loading ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
            <div className="serif" style={{ fontSize: 18 }}>
              {window.isRTL ? 'الرجاء فتح رحلة أولاً' : 'Open a trip first'}
            </div>
          </div>
        ) : <TripSkeleton />}
      </div>
    );
  }

  // Build the day array from trip start/end dates
  const start = trip.startDate ? new Date(trip.startDate + 'T00:00:00') : null;
  const end   = trip.endDate   ? new Date(trip.endDate   + 'T00:00:00') : start;
  const days = [];
  if (start && end) {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
  }

  const isoDay = (d) => d.toISOString().slice(0, 10);
  const itemsByDay = {};
  items.forEach((it) => {
    (itemsByDay[it.dayDate] = itemsByDay[it.dayDate] || []).push(it);
  });

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }} className="no-scrollbar">
      <LargeTitleHeader
        title={t('planNav') || 'Plan'}
        subtitle={trip.title}
        onBack={() => go('hub')}
      />

      <div style={{ padding: '8px 14px 24px' }}>
        {days.length === 0 ? (
          <div style={{
            padding: '36px 22px', textAlign: 'center',
            color: 'var(--ink-mute)', fontSize: 13,
            background: 'var(--cream-2)', borderRadius: 22,
            border: '0.5px solid var(--hairline)',
            margin: '14px 8px',
          }}>
            {window.isRTL
              ? 'أضف تواريخ البداية والنهاية في إعدادات الرحلة لرؤية الأيام.'
              : 'Add start & end dates in trip settings to see your days.'}
          </div>
        ) : days.map((d, idx) => {
          const iso = isoDay(d);
          const dayItems = (itemsByDay[iso] || []).slice().sort((a, b) => {
            if (a.startTime && !b.startTime) return -1;
            if (!a.startTime && b.startTime) return 1;
            if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          });
          return (
            <PlanDay
              key={iso}
              date={d}
              dayNumber={idx + 1}
              items={dayItems}
              onAdd={() => setAddingForDay(iso)}
              onTapItem={(it) => setEditingItem(it)}
              openSheet={openSheet}
            />
          );
        })}
      </div>

      {/* Add sheet */}
      <Sheet open={!!addingForDay} onClose={() => setAddingForDay(null)}
             title={t('planAddTitle') || 'Add activity'} height={0.78}>
        {addingForDay && (
          <AddPlanItemSheet
            dayDate={addingForDay}
            onDone={() => setAddingForDay(null)}
          />
        )}
      </Sheet>

      {/* Edit sheet */}
      <Sheet open={!!editingItem} onClose={() => setEditingItem(null)}
             title={t('planEditTitle') || 'Edit activity'} height={0.78}>
        {editingItem && (
          <AddPlanItemSheet
            existing={editingItem}
            dayDate={editingItem.dayDate}
            onDone={() => setEditingItem(null)}
          />
        )}
      </Sheet>
    </div>
  );
}

const PLAN_CAT_META = {
  food:      { emoji: '🍜', label_en: 'Food',      label_ar: 'طعام',     color: 'var(--clay)' },
  sight:     { emoji: '🎌', label_en: 'Sight',     label_ar: 'معلم',     color: 'var(--moss)' },
  transport: { emoji: '🚅', label_en: 'Transit',   label_ar: 'تنقل',     color: 'var(--indigo)' },
  lodging:   { emoji: '🏨', label_en: 'Lodging',   label_ar: 'إقامة',    color: 'var(--honey)' },
  misc:      { emoji: '📌', label_en: 'Misc',      label_ar: 'متنوع',    color: 'var(--ink-soft)' },
};

function fmtDayLabel(d, dayNumber) {
  const weekday = d.toLocaleDateString(window.isRTL ? 'ar' : 'en', { weekday: 'short' });
  const datePart = d.toLocaleDateString(window.isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric' });
  return { weekday, datePart, dayNumber };
}

function fmtTime(hms) {
  if (!hms) return '';
  const [h, m] = hms.split(':');
  const d = new Date(); d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString(window.isRTL ? 'ar' : 'en', { hour: 'numeric', minute: '2-digit' });
}

function PlanDay({ date, dayNumber, items, onAdd, onTapItem, openSheet }) {
  const { weekday, datePart } = fmtDayLabel(date, dayNumber);
  return (
    <div style={{ marginTop: 18 }}>
      {/* Day header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px 8px', flexDirection: 'row',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexDirection: 'row' }}>
          <span className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
            {window.isRTL ? `اليوم ${dayNumber}` : `Day ${dayNumber}`}
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
            · {weekday} {datePart}
          </span>
        </div>
        <button onClick={onAdd} style={{
          padding: '5px 10px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--cream)',
          fontSize: 11, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row',
        }}>
          <window.IconPlus size={11} stroke="currentColor" />
          {t('planAddBtn') || 'Add'}
        </button>
      </div>

      {/* Items */}
      <div style={{
        background: 'var(--cream-2)', borderRadius: 22,
        border: '0.5px solid var(--hairline)',
        margin: '0 8px', overflow: 'hidden',
      }}>
        {items.length === 0 ? (
          <button onClick={onAdd} style={{
            width: '100%', padding: '20px 18px',
            background: 'transparent', color: 'var(--ink-mute)',
            fontSize: 12.5, textAlign: 'start',
            display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row',
          }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>📝</span>
            <span>{t('planEmptyDay') || 'Nothing planned yet — tap to add'}</span>
          </button>
        ) : items.map((it, i) => (
          <PlanRow key={it.id} item={it} isLast={i === items.length - 1}
                   onTap={() => onTapItem(it)} openSheet={openSheet} />
        ))}
      </div>
    </div>
  );
}

// Plan categories don't 1:1 map to expense categories — translate.
const PLAN_TO_EXPENSE_CAT = {
  food: 'food', sight: 'culture', transport: 'transit',
  lodging: 'lodging', misc: 'misc',
};

function PlanRow({ item, isLast, onTap, openSheet }) {
  const meta = PLAN_CAT_META[item.category] || PLAN_CAT_META.misc;
  const openMaps = (e) => {
    e.stopPropagation();
    if (!item.location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`, '_blank');
  };
  const logExpense = (e) => {
    e.stopPropagation();
    openSheet?.('addExpense', {
      title: item.title,
      cat: PLAN_TO_EXPENSE_CAT[item.category] || 'misc',
    });
  };
  return (
    <div onClick={onTap} style={{
      padding: '12px 14px', cursor: 'pointer',
      display: 'flex', alignItems: 'flex-start', gap: 12, flexDirection: 'row',
      borderBottom: isLast ? 'none' : '0.5px solid var(--hairline)',
    }}>
      {/* Time column */}
      <div style={{
        minWidth: 52, paddingTop: 2,
        fontFamily: 'var(--mono)', fontSize: 11,
        color: 'var(--ink-mute)', letterSpacing: '0.04em',
      }}>
        {item.startTime ? fmtTime(item.startTime) : '—'}
      </div>
      {/* Dot */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: meta.color, marginTop: 6, flexShrink: 0,
      }} />
      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: 'var(--ink)',
          display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
        }}>
          <span style={{ fontSize: 14 }}>{meta.emoji}</span>
          <span>{item.title}</span>
        </div>
        <div style={{
          marginTop: 4, display: 'flex', alignItems: 'center',
          gap: 10, flexDirection: 'row', flexWrap: 'wrap',
        }}>
          {item.location && (
            <button onClick={openMaps} style={{
              padding: 0, background: 'transparent',
              color: 'var(--ink-soft)', fontSize: 11.5,
              display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: 'row',
              textAlign: 'start',
            }}>
              <window.IconPin size={11} stroke="currentColor" />
              <span style={{ textDecoration: 'underline' }}>{item.location}</span>
            </button>
          )}
          <button onClick={logExpense} style={{
            padding: '3px 9px', borderRadius: 999,
            background: 'var(--cream)', color: 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            fontSize: 10.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: 'row',
          }}>
            <window.IconWallet size={10} stroke="currentColor" />
            {t('planLogExpense') || 'Log expense'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddPlanItemSheet({ dayDate, existing, onDone }) {
  const trip = window.TRIP;
  const isEdit = !!existing;
  const [title,    setTitle]    = React.useState(existing?.title || '');
  const [category, setCategory] = React.useState(existing?.category || 'sight');
  const [time,     setTime]     = React.useState(existing?.startTime ? existing.startTime.slice(0, 5) : '');
  const [location, setLocation] = React.useState(existing?.location || '');
  const [loading,  setLoading]  = React.useState(false);
  const [error,    setError]    = React.useState(null);

  const handleSave = async () => {
    if (!title.trim()) { setError(t('planTitleReq') || 'Enter a title'); return; }
    setLoading(true); setError(null);
    try {
      const payload = {
        dayDate,
        startTime: time || null,
        title,
        category,
        location,
      };
      if (isEdit) {
        await window.updateItineraryItem(existing.id, trip?.id, payload);
      } else {
        await window.addItineraryItem(trip?.id, payload);
      }
      await window.loadItinerary(trip?.id);
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(window.isRTL ? 'حذف هذا النشاط؟' : 'Delete this activity?')) return;
    setLoading(true);
    try {
      await window.deleteItineraryItem(existing.id, trip?.id);
      await window.loadItinerary(trip?.id);
      onDone();
    } catch (err) { setError(err.message); setLoading(false); }
  };

  const fieldStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 14,
    border: '0.5px solid var(--hairline)',
    background: 'var(--cream)', color: 'var(--ink)',
    fontSize: 14, fontFamily: 'var(--sans)', outline: 'none',
    textAlign: 'start',
  };
  const labelStyle = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
    color: 'var(--ink-mute)', marginBottom: 6, textTransform: 'uppercase',
  };

  return (
    <div style={{ padding: '4px 22px 28px' }}>
      <div style={{ marginBottom: 10 }}>
        <div style={labelStyle}>{t('planFieldTitle') || 'Activity'}</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={window.isRTL ? 'مثلاً: زيارة المتحف' : 'e.g. Visit museum'}
          style={fieldStyle} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={labelStyle}>{t('planFieldCategory') || 'Category'}</div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 7, overflowX: 'auto', flexDirection: 'row' }}>
          {Object.entries(PLAN_CAT_META).map(([k, meta]) => {
            const active = category === k;
            return (
              <button key={k} onClick={() => setCategory(k)} style={{
                flexShrink: 0, padding: '9px 13px', borderRadius: 14,
                background: active ? meta.color : 'var(--cream-2)',
                color: active ? '#fff' : 'var(--ink-soft)',
                border: active ? 'none' : '0.5px solid var(--hairline)',
                fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
              }}>
                <span style={{ fontSize: 15 }}>{meta.emoji}</span>
                <span>{window.isRTL ? meta.label_ar : meta.label_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={labelStyle}>{t('planFieldTime') || 'Time (optional)'}</div>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          style={fieldStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={labelStyle}>{t('planFieldLocation') || 'Location (optional)'}</div>
        <input value={location} onChange={(e) => setLocation(e.target.value)}
          placeholder={window.isRTL ? 'العنوان أو اسم المكان' : 'Address or place name'}
          style={fieldStyle} />
      </div>

      {error && (
        <div style={{
          marginBottom: 10, padding: '10px 14px', borderRadius: 12,
          background: 'oklch(0.62 0.13 35 / 0.10)',
          border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
          fontSize: 12.5, color: 'var(--clay-deep)',
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 10, flexDirection: 'row' }}>
        {isEdit && (
          <button onClick={handleDelete} disabled={loading} style={{
            padding: '16px 18px', borderRadius: 18,
            background: 'var(--cream-2)', color: 'var(--clay-deep)',
            border: '0.5px solid var(--hairline-2)',
            fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <window.IconTrash size={14} stroke="currentColor" />
            {window.isRTL ? 'حذف' : 'Delete'}
          </button>
        )}
        <button onClick={handleSave} disabled={loading} style={{
          flex: 1, padding: '16px', borderRadius: 18,
          background: loading ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
          fontSize: 14, fontWeight: 600,
          boxShadow: loading ? 'none' : '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
        }}>
          {loading
            ? (window.isRTL ? 'جارٍ الحفظ…' : 'Saving…')
            : (isEdit
                ? (window.isRTL ? 'حفظ التعديلات' : 'Save changes')
                : (window.isRTL ? 'إضافة للخطة' : 'Add to plan'))}
        </button>
      </div>
    </div>
  );
}

window.ScreenPlan = ScreenPlan;
