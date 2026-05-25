// Category-specific field schemas for the Vault (documents).
// Source of truth for AddDoc, DocDetail, and the list/grid cards.
//
// Each schema describes:
//   titleLabel / titlePlaceholder — the doc's main name
//   fields[] — structured data stored under documents.details (jsonb)
//   primaryFileLabel  — label for the main upload (file_path column)
//   secondaryFile     — if present, allows a second upload (secondary_file_path)
//   showCost          — whether to render the cost + "Add to expenses" toggle
//
// Field types: 'text' | 'datetime' | 'date' | 'url'
//   col: 2 means render side-by-side with the previous field on one row.

const DOC_SCHEMAS = {
  flights: {
    emoji: '✈️',
    titleLabel:       () => window.isRTL ? 'الرحلة' : 'Flight',
    titlePlaceholder: () => window.isRTL ? 'مثال: السعودية SV777 · طوكيو - الرياض' : 'e.g. Saudia SV777 · Tokyo → Riyadh',
    fields: [
      { key: 'airline',      type: 'text',     label: () => window.isRTL ? 'الناقل' : 'Airline',           placeholder: () => 'Saudia · Emirates · JAL' },
      { key: 'dep_airport',  type: 'text',     label: () => window.isRTL ? 'مطار المغادرة' : 'From airport', placeholder: () => 'HND' },
      { key: 'dep_terminal', type: 'text',     label: () => window.isRTL ? 'الصالة' : 'Terminal',           placeholder: () => '3', col: 2 },
      { key: 'dep_at',       type: 'datetime', label: () => window.isRTL ? 'موعد الإقلاع' : 'Departure' },
      { key: 'arr_airport',  type: 'text',     label: () => window.isRTL ? 'مطار الوصول' : 'To airport',   placeholder: () => 'RUH' },
      { key: 'arr_terminal', type: 'text',     label: () => window.isRTL ? 'الصالة' : 'Terminal',           placeholder: () => '1', col: 2 },
      { key: 'arr_at',       type: 'datetime', label: () => window.isRTL ? 'موعد الهبوط' : 'Arrival' },
      { key: 'location_url', type: 'url',      label: () => window.isRTL ? 'رابط المطار' : 'Airport map link', placeholder: () => 'https://maps.google.com/...' },
    ],
    primaryFileLabel: () => window.isRTL ? 'التذكرة الإلكترونية' : 'E-ticket',
    secondaryFile: {
      key: 'boarding_pass',
      label: () => window.isRTL ? 'بطاقة الصعود' : 'Boarding pass',
    },
    showCost: true,
  },
  lodging: {
    emoji: '🏨',
    titleLabel:       () => window.isRTL ? 'اسم الفندق' : 'Hotel / Stay',
    titlePlaceholder: () => window.isRTL ? 'مثال: فندق نيكو طوكيو' : 'e.g. Park Hyatt Tokyo',
    fields: [
      { key: 'check_in_at',  type: 'datetime', label: () => window.isRTL ? 'تسجيل الدخول' : 'Check-in' },
      { key: 'check_out_at', type: 'datetime', label: () => window.isRTL ? 'تسجيل الخروج' : 'Check-out' },
      { key: 'address',      type: 'text',     label: () => window.isRTL ? 'العنوان' : 'Address',         placeholder: () => 'Street, city' },
      { key: 'location_url', type: 'url',      label: () => window.isRTL ? 'رابط الموقع' : 'Location link', placeholder: () => 'https://maps.google.com/...' },
    ],
    primaryFileLabel: () => window.isRTL ? 'مرجع الحجز' : 'Reservation',
    showCost: true,
  },
  transport: {
    emoji: '🚆',
    titleLabel:       () => window.isRTL ? 'المزود / الخدمة' : 'Vendor / Service',
    titlePlaceholder: () => window.isRTL ? 'مثال: Hertz · إيجار سيارة' : 'e.g. Hertz · Car rental',
    fields: [
      { key: 'vendor',       type: 'text',     label: () => window.isRTL ? 'المزود' : 'Vendor',            placeholder: () => 'Hertz · Avis · JR' },
      { key: 'pickup_at',    type: 'datetime', label: () => window.isRTL ? 'الاستلام' : 'Pick-up' },
      { key: 'dropoff_at',   type: 'datetime', label: () => window.isRTL ? 'التسليم' : 'Drop-off' },
      { key: 'location_url', type: 'url',      label: () => window.isRTL ? 'رابط الموقع' : 'Location link', placeholder: () => 'https://maps.google.com/...' },
    ],
    primaryFileLabel: () => window.isRTL ? 'مرجع الإيجار' : 'Rental reference',
    showCost: true,
  },
  visas: {
    emoji: '📘',
    titleLabel:       () => window.isRTL ? 'الاسم' : 'Title',
    titlePlaceholder: () => window.isRTL ? 'مثال: تأشيرة اليابان' : 'e.g. Japan eVisa',
    fields: [
      { key: 'visa_type',  type: 'text', label: () => window.isRTL ? 'نوع التأشيرة' : 'Visa type', placeholder: () => 'Tourist · Business' },
      { key: 'issued_on',  type: 'date', label: () => window.isRTL ? 'تاريخ الإصدار' : 'Issued' },
      { key: 'expires_on', type: 'date', label: () => window.isRTL ? 'تاريخ الانتهاء' : 'Expires' },
    ],
    primaryFileLabel: () => window.isRTL ? 'وثيقة التأشيرة' : 'Visa document',
    showCost: false,
  },
};

// Format a stored value back to a human-readable card line.
function fmtDocSummary(doc) {
  const s = DOC_SCHEMAS[doc.category] || DOC_SCHEMAS.visas;
  const d = doc.details || {};
  const fmtDT = (iso) => {
    if (!iso) return null;
    const dt = new Date(iso);
    if (isNaN(dt)) return null;
    return dt.toLocaleString(window.isRTL ? 'ar' : 'en', {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };
  const fmtD = (iso) => {
    if (!iso) return null;
    const dt = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(dt)) return null;
    return dt.toLocaleDateString(window.isRTL ? 'ar' : 'en', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (doc.category === 'flights') {
    const route = (d.dep_airport && d.arr_airport)
      ? `${d.dep_airport} → ${d.arr_airport}`
      : null;
    const when = fmtDT(d.dep_at);
    return [route, when].filter(Boolean).join(' · ') || doc.sub || null;
  }
  if (doc.category === 'lodging') {
    const checkIn = fmtDT(d.check_in_at);
    const checkOut = fmtDT(d.check_out_at);
    if (checkIn && checkOut) return `${checkIn} → ${checkOut}`;
    return checkIn || doc.sub || null;
  }
  if (doc.category === 'transport') {
    const pickup = fmtDT(d.pickup_at);
    const vendor = d.vendor;
    return [vendor, pickup].filter(Boolean).join(' · ') || doc.sub || null;
  }
  if (doc.category === 'visas') {
    const exp = fmtD(d.expires_on);
    const type = d.visa_type;
    return [type, exp && `${window.isRTL ? 'ينتهي' : 'exp.'} ${exp}`].filter(Boolean).join(' · ')
      || doc.sub || null;
  }
  return doc.sub || null;
}

// ── Smart Track: aggregate upcoming time-anchored events ────
// Pulls timestamps out of docs (flights/lodging/rentals) and plan items
// and returns them in chronological order, annotated with display info
// + quick-action handles (file URL, location URL, etc.).
//
// We include events from (now - 4h) so a flight that "just took off"
// still surfaces briefly. Cutoff is +30 days out to keep the list tight.
function computeUpcomingEvents(opts = {}) {
  const now = opts.now || new Date();
  const cutoff = new Date(now.getTime() + 30 * 86400000);
  const grace = new Date(now.getTime() - 4 * 3600 * 1000);
  const events = [];

  // Documents — flights, lodging, transport (rentals).
  const docs = Object.values(window.DOCS_BY_CAT || {}).flat();
  docs.forEach((doc) => {
    const d = doc.details || {};
    if (doc.category === 'flights' && d.dep_at) {
      const startAt = new Date(d.dep_at);
      const endAt   = d.arr_at ? new Date(d.arr_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id:      `doc-${doc.id}`,
          type:    'flight',
          emoji:   '✈️',
          title:   doc.title || (d.airline || 'Flight'),
          detail:  [d.dep_airport, d.arr_airport].filter(Boolean).join(' → ') || null,
          subtle:  [d.airline, d.dep_terminal && `T${d.dep_terminal}`].filter(Boolean).join(' · ') || null,
          startAt, endAt,
          docCategory: 'flights',
          doc,
          locationUrl:    d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? 'التذكرة' : 'E-ticket',
          secondaryFileUrl: doc.secondaryLink,
          secondaryFileLabel: window.isRTL ? 'بطاقة الصعود' : 'Boarding pass',
        });
      }
    }
    if (doc.category === 'lodging' && d.check_in_at) {
      const startAt = new Date(d.check_in_at);
      const endAt   = d.check_out_at ? new Date(d.check_out_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id:      `doc-${doc.id}`,
          type:    'lodging',
          emoji:   '🏨',
          title:   doc.title || 'Hotel',
          detail:  window.isRTL ? 'تسجيل الدخول' : 'Check-in',
          subtle:  d.address || null,
          startAt, endAt,
          docCategory: 'lodging',
          doc,
          locationUrl:    d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? 'الحجز' : 'Reservation',
        });
      }
      // Also surface check-out as a separate event
      if (endAt && !isNaN(endAt) && endAt >= grace && endAt <= cutoff) {
        events.push({
          id:      `doc-${doc.id}-out`,
          type:    'lodging-out',
          emoji:   '🏨',
          title:   doc.title || 'Hotel',
          detail:  window.isRTL ? 'تسجيل الخروج' : 'Check-out',
          subtle:  d.address || null,
          startAt: endAt, endAt: null,
          docCategory: 'lodging',
          doc,
          locationUrl: d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? 'الحجز' : 'Reservation',
        });
      }
    }
    if (doc.category === 'transport' && d.pickup_at) {
      const startAt = new Date(d.pickup_at);
      const endAt   = d.dropoff_at ? new Date(d.dropoff_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id:      `doc-${doc.id}`,
          type:    'transport',
          emoji:   '🚆',
          title:   doc.title || d.vendor || 'Rental',
          detail:  window.isRTL ? 'الاستلام' : 'Pick-up',
          subtle:  d.vendor || null,
          startAt, endAt,
          docCategory: 'transport',
          doc,
          locationUrl:    d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? 'مرجع الإيجار' : 'Rental ref',
        });
      }
    }
  });

  // Itinerary items — show those with a startTime today/upcoming.
  (window.ITINERARY || []).forEach((it) => {
    if (!it.dayDate) return;
    const dayPart = it.dayDate;
    const timePart = it.startTime || '12:00:00';
    const startAt = new Date(`${dayPart}T${timePart.length === 5 ? timePart + ':00' : timePart}`);
    if (isNaN(startAt) || startAt < grace || startAt > cutoff) return;
    const PLAN_EMOJI = { food: '🍜', sight: '🎌', transport: '🚅', lodging: '🏨', misc: '📌' };
    events.push({
      id:      `plan-${it.id}`,
      type:    'plan',
      emoji:   PLAN_EMOJI[it.category] || '📌',
      title:   it.title,
      detail:  null,
      subtle:  it.location || null,
      startAt, endAt: null,
      doc:     null,
      locationUrl: it.location
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.location)}`
        : null,
    });
  });

  events.sort((a, b) => a.startAt - b.startAt);
  return events;
}

// Friendly relative label: "Now", "in 2h 15m", "Today · 14:30", "Tomorrow · 09:00", "Mon · Mar 12"
function relativeWhenLabel(startAt, now = new Date()) {
  const diffMs = startAt - now;
  const diffMin = Math.round(diffMs / 60000);
  // Past but within grace = "Now"
  if (diffMin <= 0 && diffMin > -240) return window.isRTL ? 'الآن' : 'Now';
  if (diffMin > 0 && diffMin < 60) return window.isRTL ? `بعد ${diffMin} د` : `in ${diffMin}m`;
  if (diffMin >= 60 && diffMin < 360) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return window.isRTL ? `بعد ${h} س ${m ? m + ' د' : ''}` : `in ${h}h${m ? ` ${m}m` : ''}`;
  }
  const isSameDay = startAt.toDateString() === now.toDateString();
  const tomorrow = new Date(now.getTime() + 86400000);
  const isTomorrow = startAt.toDateString() === tomorrow.toDateString();
  const time = startAt.toLocaleTimeString(window.isRTL ? 'ar' : 'en',
    { hour: 'numeric', minute: '2-digit' });
  if (isSameDay) return window.isRTL ? `اليوم · ${time}` : `Today · ${time}`;
  if (isTomorrow) return window.isRTL ? `غداً · ${time}` : `Tomorrow · ${time}`;
  const dayLabel = startAt.toLocaleDateString(window.isRTL ? 'ar' : 'en',
    { weekday: 'short', month: 'short', day: 'numeric' });
  return `${dayLabel} · ${time}`;
}

window.DOC_SCHEMAS = DOC_SCHEMAS;
window.fmtDocSummary = fmtDocSummary;
window.computeUpcomingEvents = computeUpcomingEvents;
window.relativeWhenLabel = relativeWhenLabel;
