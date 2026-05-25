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

window.DOC_SCHEMAS = DOC_SCHEMAS;
window.fmtDocSummary = fmtDocSummary;
