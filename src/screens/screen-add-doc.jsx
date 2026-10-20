// Add Document — full-screen flow. Each category renders its own
// purpose-built fields (flight has airline / airports / times, hotel
// has check-in / check-out, etc.). The category-specific schema lives
// in docs-schema.jsx so AddDoc / DocDetail / list cards stay in sync.

function ScreenAddDoc({ back, onCreated }) {
  const [cat,       setCat]       = React.useState('flights');
  const [title,     setTitle]     = React.useState('');
  const [details,   setDetails]   = React.useState({});

  // Cost (only used when the category opts in via showCost)
  const tripLocal = window.TRIP?.localCurrency || 'USD';
  const tripHome  = window.TRIP?.homeCurrency  || 'USD';
  const [cost,        setCost]        = React.useState('');
  const [costCur,     setCostCur]     = React.useState(tripLocal);
  const [moreOpen,    setMoreOpen]    = React.useState(false);

  // Owner: null = shared with everyone; a user id = a specific traveler's
  // own doc (boarding pass, visa, personal ticket). Chosen explicitly, not
  // inferred from the uploader — one person often uploads for the others.
  const members = window.MEMBERS || [];
  // Always offer mine/everyone: people can join the trip later, and a
  // ticket added while you were alone must not become visible to them.
  const isGroupTrip = true;
  // Each traveler adds their OWN tickets/visas ("for me"); hotels and
  // rentals default to shared. Personal docs are private (RLS).
  const defaultOwner = (c) => (isGroupTrip && (c === 'flights' || c === 'visas')) ? window.currentUserId : null;
  const [ownerUserId, setOwnerUserId] = React.useState(() => defaultOwner('flights'));

  // Files
  const [file,        setFile]        = React.useState(null);
  const [secondary,   setSecondary]   = React.useState(null);
  const [coverFile,   setCoverFile]   = React.useState(null);
  const [coverPreview, setCoverPreview] = React.useState(null);
  const [coverToCrop, setCoverToCrop] = React.useState(null);

  const [saving, setSaving] = React.useState(false);
  const [error,  setError]  = React.useState(null);

  const fileRef      = React.useRef(null);
  const secondaryRef = React.useRef(null);
  const coverRef     = React.useRef(null);

  // Object URL preview for the cover
  React.useEffect(() => {
    if (!coverFile) { setCoverPreview(null); return; }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // Reset details + secondary when category switches — fields don't carry over
  React.useEffect(() => {
    setDetails({});
    setSecondary(null);
    setOwnerUserId(defaultOwner(cat));
  }, [cat]);

  const schema = window.DOC_SCHEMAS[cat] || window.DOC_SCHEMAS.visas;
  // The one or two facts each kind needs up front; the rest folds away.
  const ESSENTIAL = {
    flights:   ['dep_airport', 'arr_airport', 'dep_at'],
    lodging:   ['check_in_at', 'check_out_at'],
    transport: ['pickup_at'],
    visas:     ['expires_on'],
  };
  const essentialKeys = ESSENTIAL[cat] || [];
  const essentialFields = schema.fields.filter((f) => essentialKeys.includes(f.key))
    // a range end whose start isn't essential would render alone — fine
    .map((f) => (f.col === 2 ? { ...f, col: undefined } : f));
  const moreFields = schema.fields.filter((f) => !essentialKeys.includes(f.key))
    .map((f) => (f.col === 2 ? { ...f, col: undefined } : f));
  const CAT_TINT = { flights: 'indigo', lodging: 'clay', visas: 'moss', transport: 'honey' };
  const TINT_FILL = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' };
  const tint = CAT_TINT[cat] || 'clay';

  // Native inset-group surface — the section card that holds fields, so
  // they read as a grouped form instead of loose islands floating on
  // the page (the "feels like a browser" complaint).
  const groupCard = {
    background: 'var(--cream-2)', borderRadius: 16,
    border: '0.5px solid var(--hairline)', padding: 14,
    boxShadow: 'var(--shadow-xs)',
  };

  const handleSave = async () => {
    // Flights don't need a typed name: "IST → RUH" is built from the airports.
    const autoTitle = cat === 'flights' && details.dep_airport && details.arr_airport
      ? `${String(details.dep_airport).trim().toUpperCase()} → ${String(details.arr_airport).trim().toUpperCase()}` : '';
    const finalTitle = title.trim() || autoTitle;
    if (!finalTitle) { setError(window.isRTL ? (cat === 'flights' ? 'اكتب مطار المغادرة والوصول' : 'اكتب الاسم') : 'Enter a name'); return; }
    const rangeErr = window.validateDocRanges?.(schema, details);
    if (rangeErr) { setError(rangeErr); return; }
    const tripId = window.TRIP?.id;
    const userId = window.currentUserId;
    if (!tripId || !userId) { setError('No active trip or session'); return; }

    setSaving(true); setError(null);
    try {
      const costUSD = (cost && schema.showCost) ? window.toUSD(parseFloat(cost), costCur) : null;
      const doc = await window.addDocument(tripId, userId, {
        title:    finalTitle,
        category: cat,
        kind:     file && file.type?.startsWith('image/') ? 'img' : 'pdf',
        tint,
        details,
        costUSD,
        costLocal:    cost ? parseFloat(cost) : null,
        costCurrency: cost ? costCur : null,
        linkUrl:      details.location_url || null,
        linkLabel:    details.location_url ? (window.isRTL ? 'الرابط المرفق' : 'Location') : null,
        ownerUserId,
      });
      // The uploads + expense link are independent of each other — run
      // them in PARALLEL instead of one-after-another so the save isn't
      // the sum of every network round-trip. Each failure surfaces a
      // toast but doesn't abort the others (the doc row already exists).
      const tasks = [];
      if (file)      tasks.push(window.uploadDocumentFile(doc.id, tripId, file));
      if (secondary) tasks.push(window.uploadDocumentSecondaryFile(doc.id, tripId, secondary));
      if (coverFile) tasks.push(window.uploadDocCover(doc.id, tripId, coverFile)
        .catch((e) => window.toast?.(e.message || 'Cover upload failed', 'error')));
      // Shared booking with a cost → goes into the trip's general budget
      // automatically. Personal costs stay private ("Your trip cost").
      if (!ownerUserId && costUSD) tasks.push(window.syncDocExpense(doc.id, tripId)
        .catch((e) => window.toast?.(e.message || 'Expense link failed', 'error')));
      if (tasks.length) await Promise.allSettled(tasks);
      await window.loadDocuments(tripId);
      onCreated?.(doc.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div data-screen-label="Add Document" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 116,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 14px',
        background: 'linear-gradient(180deg, var(--cream) 88%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
        <button onClick={back} style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span></button>
        <div className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
          {window.isRTL ? 'إضافة مستند جديد' : 'New document'}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* 1 — What is it? */}
        <DocStep title={window.isRTL ? 'نوع المستند' : 'What is it?'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(window.DOC_CATEGORIES || []).map((c) => {
              const active = cat === c.key;
              const color = TINT_FILL[CAT_TINT[c.key]] || 'var(--clay)';
              const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
              const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
              const emoji = window.DOC_SCHEMAS[c.key]?.emoji || '📄';
              return (
                <button key={c.key} onClick={() => setCat(c.key)} style={{
                  padding: '13px 14px', borderRadius: 14, textAlign: 'start', minHeight: 48,
                  background: active ? color : 'var(--cream-2)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: active ? 'none' : '0.5px solid var(--hairline)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  flexDirection: 'row', transition: 'all 160ms',
                }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                </button>
              );
            })}
          </div>
        </DocStep>

        {/* 2 — The file first: it's what you open at the airport */}
        <DocStep title={schema.primaryFileLabel()}
                hint={window.isRTL ? 'صوّر الحجز أو ارفع ملف PDF' : 'Snap it or upload a PDF'}>
          <FilePicker file={file} setFile={setFile} pickerRef={fileRef} tint={TINT_FILL[tint]} />
        </DocStep>
        {schema.secondaryFile && (
          <DocStep title={schema.secondaryFile.label()} optional>
            <FilePicker file={secondary} setFile={setSecondary} pickerRef={secondaryRef} tint={TINT_FILL[tint]} />
          </DocStep>
        )}

        {/* 3 — Mine or everyone's (group trips) */}
        {isGroupTrip && (
          <DocStep title={window.isRTL ? 'لمن؟' : "Who's it for?"}
                   hint={ownerUserId
                     ? (window.isRTL ? 'لك أنت فقط — ما يشوفه أحد غيرك.' : 'Only you can see it.')
                     : (window.isRTL ? 'يشوفه كل أعضاء الرحلة.' : 'Everyone on the trip sees it.')}>
            <div style={{ display: 'flex', padding: 3, borderRadius: 14, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
              {[{ id: window.currentUserId, l: window.isRTL ? 'لي أنا' : 'Just me' },
                { id: null, l: window.isRTL ? 'مشترك للجميع' : 'Everyone' }].map((o) => {
                const active = ownerUserId === o.id;
                return (
                  <button key={o.id || 'all'} onClick={() => setOwnerUserId(o.id)} style={{
                    flex: 1, minHeight: 42, borderRadius: 11, fontSize: 14, fontWeight: 600,
                    background: active ? 'var(--ink)' : 'transparent',
                    color: active ? 'var(--cream)' : 'var(--ink-soft)', transition: 'all 150ms',
                  }}>{o.l}</button>
                );
              })}
            </div>
          </DocStep>
        )}

        {/* 4 — Only what matters for this kind of document */}
        <DocStep title={window.isRTL ? 'الأساسيات' : 'Essentials'}>
          <div style={groupCard}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-mute)', display: 'block', marginBottom: 6, textAlign: 'start' }}>
              {cat === 'flights' ? (window.isRTL ? 'اسم الرحلة (اختياري)' : 'Name (optional)') : schema.titleLabel()}
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={cat === 'flights' ? (window.isRTL ? 'يتكتب تلقائياً: IST → RUH' : 'Auto: IST → RUH') : schema.titlePlaceholder()}
              style={docFieldStyle} />
            {essentialFields.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <DocFieldGrid fields={essentialFields} values={details} onChange={setDetails} />
              </div>
            )}
          </div>
        </DocStep>

        {/* 5 — Cost: shared → general budget; mine → my trip cost (private) */}
        {schema.showCost && (
          <DocStep title={window.isRTL ? 'التكلفة' : 'Cost'} optional
                   hint={ownerUserId
                     ? (window.isRTL ? 'تظهر لك في «تكلفة رحلتك» ولا تدخل في ميزانية القروب.' : 'Shows in your trip cost only.')
                     : (window.isRTL ? 'إذا اندفعت، تنخصم من الميزانية العامة للرحلة (مو من مصروف اليوم).' : "Once paid, it counts in the trip's general budget (not today's).")}>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'row' }}>
              <NumberField value={cost} onChange={setCost} placeholder="0"
                style={{ ...docFieldStyle, flex: 1, minWidth: 0, fontFamily: 'var(--mono)' }} />
              <select value={costCur} onChange={(e) => setCostCur(e.target.value)} style={{
                ...docFieldStyle, width: 'auto', minWidth: 84, fontFamily: 'var(--mono)',
              }}>
                {window.currencyOptions(tripLocal, tripHome)
                  .map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {parseFloat(cost) > 0 && (
              <PaymentFields details={details} setDetails={setDetails} shared={!ownerUserId} cost={cost} currency={costCur} />
            )}
          </DocStep>
        )}

        {/* 6 — Everything else, folded */}
        {(
          <button onClick={() => setMoreOpen((v) => !v)} style={{
            width: '100%', minHeight: 46, borderRadius: 14,
            background: 'transparent', border: '0.5px dashed var(--hairline-2)',
            color: 'var(--ink-soft)', fontSize: 13.5, fontWeight: 500,
          }}>
            {moreOpen
              ? (window.isRTL ? 'إخفاء التفاصيل' : 'Hide details')
              : (window.isRTL ? 'تفاصيل أكثر (اختياري)' : 'More details (optional)')}
          </button>
        )}
        {moreOpen && moreFields.length > 0 && (
          <div style={groupCard}>
            <DocFieldGrid fields={moreFields} values={details} onChange={setDetails} />
          </div>
        )}
        {moreOpen && (
        <DocStep title={window.isRTL ? 'صورة الغلاف' : 'Cover photo'} optional>
          <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverToCrop(f); e.target.value = ''; }} />
          {coverPreview ? (
            <div style={{
              display: 'flex', gap: 10, alignItems: 'center', flexDirection: 'row',
              padding: 10, borderRadius: 14,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            }}>
              <div style={{
                width: 58, height: 58, borderRadius: 10, flexShrink: 0,
                backgroundImage: `url(${coverPreview})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: '0.5px solid var(--hairline)',
              }} />
              <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink)' }}>
                {window.isRTL ? 'تعيين صورة الغلاف' : 'Cover photo'}
              </div>
              <button onClick={() => coverRef.current?.click()} style={{
                padding: '7px 11px', borderRadius: 10, fontSize: 11.5, fontWeight: 500,
                background: 'var(--cream)', border: '0.5px solid var(--hairline)',
                color: 'var(--ink-soft)',
              }}>{window.isRTL ? 'تغيير الصورة' : 'Replace'}</button>
              <button onClick={() => setCoverFile(null)} style={{
                padding: '7px 9px', borderRadius: 10,
                background: 'transparent', color: 'var(--clay-deep)',
                border: '0.5px solid var(--hairline)',
              }}><window.IconTrash size={13} stroke="currentColor" /></button>
            </div>
          ) : (
            <button onClick={() => coverRef.current?.click()} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'var(--cream-2)', border: '1px dashed var(--hairline-2)',
              color: 'var(--ink-soft)', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexDirection: 'row',
            }}>
              <window.IconCamera size={16} stroke="currentColor" />
              {window.isRTL ? 'إدراج صورة من المعرض' : 'Add a photo'}
            </button>
          )}
        </DocStep>
        )}

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 12,
            background: 'oklch(0.62 0.13 35 / 0.10)',
            border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
            fontSize: 12.5, color: 'var(--clay-deep)',
          }}>{error}</div>
        )}
      </div>

      {/* Cropper */}
      {coverToCrop && (
        <window.ImageCropper
          file={coverToCrop}
          onCancel={() => setCoverToCrop(null)}
          onDone={(cropped) => { setCoverToCrop(null); setCoverFile(cropped); }}
        />
      )}

      {/* Anchored footer — flush to the bottom edge, full width, top
         hairline. This full-screen overlay covers the tab bar, so the
         action bar belongs at bottom:0 like a native form footer, not
         floating as a detached pill above a (hidden) nav. */}
      <div style={{
        position: 'fixed', bottom: 0, insetInlineStart: 0, insetInlineEnd: 0, zIndex: 49,
        display: 'flex', gap: 10, flexDirection: 'row',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: 'var(--cream)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '0.5px solid var(--hairline)',
      }}>
        <button onClick={back} disabled={saving} style={{
          padding: '16px 20px', borderRadius: 16,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline-2)',
          color: 'var(--ink-soft)', fontSize: 14, fontWeight: 500,
        }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: '16px', borderRadius: 16,
          background: saving ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
          fontSize: 15, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: 'row',
          boxShadow: saving ? 'none' : '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
        }}>
          {saving ? (
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
              display: 'inline-block', animation: 'expspin 0.7s linear infinite',
            }} />
          ) : (
            <>
              <IconCheck size={14} stroke="currentColor" />
              {window.isRTL ? 'حفظ ومتابعة' : 'Save document'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Shared field styles + components ────────────────────────────
// Inputs sit on --cream (the page colour) so that inside a --cream-2
// group card they read as defined fields. 16px to dodge iOS auto-zoom.
const docFieldStyle = {
  width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 12,
  border: '0.5px solid var(--hairline-2)',
  background: 'var(--cream)', color: 'var(--ink)',
  fontSize: 16, outline: 'none', fontFamily: 'var(--sans)',
  textAlign: 'start',
};

// Section label + content. The numbered step badges (1..7) were
// scaffold-y; native forms group by labelled sections, so this is a
// soft sentence-case label with an optional "· optional" note.
function DocStep({ title, hint, optional, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 7,
        margin: '2px 4px 9px', flexDirection: 'row',
      }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)' }}>{title}</div>
        {optional && (
          <span style={{
            fontSize: 11, color: 'var(--ink-mute)', fontWeight: 400,
          }}>· {window.isRTL ? 'اختياري' : 'optional'}</span>
        )}
      </div>
      {hint && (
        <div style={{
          fontSize: 11.5, color: 'var(--ink-mute)',
          margin: '-4px 4px 9px', lineHeight: 1.4,
        }}>{hint}</div>
      )}
      {children}
    </div>
  );
}

// ── Reusable numeric input ───────────────────────────────────
// type="text" + inputMode triggers the numeric keypad on iOS/Android AND
// sidesteps every type="number" quirk (scroll-wheel mutation, arrow keys,
// stray e/+/- chars, locale commas). We sanitize the string ourselves:
// `decimal` (default) keeps digits + a single dot (money); pass
// decimal={false} for integer-only fields (counts, nights).
function NumberField({ value, onChange, placeholder, decimal = true, style, id, ...rest }) {
  const sanitize = (s) => {
    if (!decimal) return String(s).replace(/\D/g, '');
    s = String(s).replace(/[^\d.]/g, '');
    const dot = s.indexOf('.');
    if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
    return s;
  };
  return (
    <input
      id={id}
      type="text"
      inputMode={decimal ? 'decimal' : 'numeric'}
      autoComplete="off" autoCorrect="off" spellCheck={false}
      value={value}
      onChange={(e) => onChange(sanitize(e.target.value))}
      placeholder={placeholder}
      style={style}
      {...rest}
    />
  );
}

// ── Unified date-time range (start → end) ────────────────────
// Native date / datetime-local inputs (so we keep the iOS wheel picker),
// stacked in one card so they read as a single range. The end input's
// `min` is bound to the start value, which makes iOS natively block any
// earlier datetime — INCLUDING earlier hours on the same day. Used for
// adjacent schema pairs (hotel check-in/out, transport pick-up/drop-off).
function DateTimeRange({ start, end, values, onChange }) {
  const isDate = start.type === 'date';
  const inputType = isDate ? 'date' : 'datetime-local';
  const toIn   = (x) => (!x ? '' : (isDate ? x : toLocalDateTimeInput(x)));
  const fromIn = (x) => (isDate ? x : fromLocalDateTimeInput(x));
  const startVal = values[start.key] || '';
  const endVal   = values[end.key] || '';
  const minEnd   = startVal ? toIn(startVal) : undefined;
  const cellLabel  = { fontSize: 11.5, fontWeight: 600, color: 'var(--ink-mute)', marginBottom: 6, display: 'block' };
  const inputStyle = { ...docFieldStyle, fontSize: 16, padding: '11px 13px' };
  return (
    <div style={{
      padding: 12, borderRadius: 14,
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div>
        <label style={cellLabel}>{start.label()}</label>
        <input type={inputType} value={toIn(startVal)}
          onChange={(e) => onChange({ ...values, [start.key]: fromIn(e.target.value) })}
          style={inputStyle} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px',
        color: 'var(--ink-mute)', fontSize: 11,
      }}>
        <span style={{ flex: 1, height: '0.5px', background: 'var(--hairline-2)' }} />
        <span className="icon-flip" style={{ transform: 'rotate(90deg)' }}>
          <window.IconChevron size={12} stroke="currentColor" />
        </span>
        <span style={{ flex: 1, height: '0.5px', background: 'var(--hairline-2)' }} />
      </div>
      <div>
        <label style={cellLabel}>{end.label()}</label>
        <input type={inputType} value={toIn(endVal)} min={minEnd}
          onChange={(e) => onChange({ ...values, [end.key]: fromIn(e.target.value) })}
          style={inputStyle} />
      </div>
    </div>
  );
}

// Convert a stored value into the native input's min format.
function rangeMin(field, startVal) {
  if (!startVal) return undefined;
  return field.type === 'datetime' ? toLocalDateTimeInput(startVal) : startVal;
}

// Render an array of schema field defs. Builds render blocks:
//   single  — one field
//   pair    — a col:2 field beside its predecessor (2fr/1fr)
//   range   — an end field whose `rangeStart` is the IMMEDIATELY preceding
//             field → unified DateTimeRange. Non-adjacent range ends (e.g.
//             flight arrival, separated from departure by the airport
//             fields) stay single but still get a native `min`.
function DocFieldGrid({ fields, values, onChange }) {
  const set = (key, val) => onChange({ ...values, [key]: val });
  const blocks = [];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const prev = blocks[blocks.length - 1];
    if (f.rangeStart && prev && prev.kind === 'single' && prev.field.key === f.rangeStart) {
      blocks[blocks.length - 1] = { kind: 'range', start: prev.field, end: f };
      continue;
    }
    if (f.col === 2 && prev && prev.kind === 'single') {
      blocks[blocks.length - 1] = { kind: 'pair', a: prev.field, b: f };
      continue;
    }
    blocks.push({ kind: 'single', field: f });
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {blocks.map((b, i) => {
        if (b.kind === 'range') {
          return <DateTimeRange key={i} start={b.start} end={b.end} values={values} onChange={onChange} />;
        }
        if (b.kind === 'pair') {
          return (
            <div key={i} style={{ display: 'grid', gap: 8, gridTemplateColumns: '2fr 1fr' }}>
              <DocField field={b.a} value={values[b.a.key] || ''} onChange={(v) => set(b.a.key, v)} />
              <DocField field={b.b} value={values[b.b.key] || ''} onChange={(v) => set(b.b.key, v)} />
            </div>
          );
        }
        const f = b.field;
        return (
          <DocField key={i} field={f} value={values[f.key] || ''}
            min={f.rangeStart ? rangeMin(f, values[f.rangeStart]) : undefined}
            onChange={(v) => set(f.key, v)} />
        );
      })}
    </div>
  );
}

function DocField({ field, value, onChange, min }) {
  const inputType = field.type === 'date' ? 'date'
                  : field.type === 'datetime' ? 'datetime-local'
                  : field.type === 'url' ? 'url' : 'text';
  // For datetime-local, the value must be in the local YYYY-MM-DDTHH:mm format.
  const v = (field.type === 'datetime' && value)
    ? toLocalDateTimeInput(value)
    : value;
  const labelEl = (
    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>{field.label()}</div>
  );
  if (field.type === 'number') {
    return (
      <div>
        {labelEl}
        <NumberField value={value} onChange={onChange}
          placeholder={field.placeholder ? field.placeholder() : ''}
          decimal={field.integer !== true}
          style={{ ...docFieldStyle, fontSize: 16, padding: '11px 13px' }} />
      </div>
    );
  }
  return (
    <div>
      {labelEl}
      <input
        type={inputType}
        value={v}
        min={min}
        onChange={(e) => onChange(field.type === 'datetime' ? fromLocalDateTimeInput(e.target.value) : e.target.value)}
        placeholder={field.placeholder ? field.placeholder() : ''}
        style={{ ...docFieldStyle, fontSize: 16, padding: '11px 13px' }} />
    </div>
  );
}

// datetime-local <input> uses local YYYY-MM-DDTHH:mm; we store ISO.
function toLocalDateTimeInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalDateTimeInput(local) {
  if (!local) return '';
  const d = new Date(local);
  return isNaN(d) ? '' : d.toISOString();
}

// Small file-picker block — reused by primary + secondary file.
function FilePicker({ file, setFile, pickerRef, tint }) {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      onClick={() => pickerRef.current?.click()}
      onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
      }}
      style={{
        padding: file ? '12px' : '20px', borderRadius: 16,
        background: drag ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
        border: drag ? '1.5px dashed var(--clay)'
                     : (file ? '0.5px solid var(--hairline)' : '1.5px dashed var(--sand-deep)'),
        cursor: 'pointer', transition: 'all 180ms',
      }}>
      <input ref={pickerRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files[0]; if (f) setFile(f); }} />
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: tint,
            color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            {file.type?.startsWith('image/') ? <IconImg size={20} stroke="#fff" /> : <IconPdf size={20} stroke="#fff" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{file.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB · {window.isRTL ? 'اضغط هنا لاستبدال الملف المرفق' : 'tap to replace'}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{
            padding: 8, borderRadius: 8, background: 'var(--cream)', border: '0.5px solid var(--hairline)',
          }}><IconTrash size={14} stroke="var(--clay-deep)" /></button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexDirection: 'row' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'var(--ink)',
            color: 'var(--cream)', display: 'grid', placeItems: 'center',
          }}><IconUpload size={20} /></div>
          <div style={{ textAlign: 'start' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
              {window.isRTL ? 'اختر ملفاً للرفع' : 'Pick a file'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
              {window.isRTL ? 'الصيغ المدعومة: PDF أو صور' : 'PDF or image'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.ScreenAddDoc = ScreenAddDoc;
window.DocStep = DocStep;
window.DocFieldGrid = DocFieldGrid;
window.DocField = DocField;
window.NumberField = NumberField;
window.DateTimeRange = DateTimeRange;
window.FilePicker = FilePicker;
window.toLocalDateTimeInput = toLocalDateTimeInput;
window.fromLocalDateTimeInput = fromLocalDateTimeInput;
window.docFieldStyle = docFieldStyle;


// ── Paid or not, who paid, when ────────────────────────────────────────
// Stored in details (paid / paid_by / paid_on). A shared booking only
// enters the trip budget once it's marked paid; the expense is dated the
// day it was paid and attributed to whoever paid it.
function PaymentFields({ details, setDetails, shared, legacyPaid, cost, currency }) {
  const ar = window.isRTL;
  const members = window.MEMBERS || [];
  const paid = details.paid === true || (details.paid === undefined && !!legacyPaid);
  const set = (patch) => setDetails({ ...details, ...patch });
  const markPaid = (v) => set(v
    ? { paid: true, paid_by: details.paid_by || window.currentUserId, paid_on: details.paid_on || window.localISO() }
    : { paid: false });
  // Several people paid parts of it: details.payers = { userId: amount }
  // (amounts in the booking's own currency).
  const multi = !!(details.payers && typeof details.payers === 'object');
  const payers = details.payers || {};
  const costNum = parseFloat(cost) || 0;
  const sumPaid = Object.values(payers).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const fmtN = (n) => `${Math.round(n * 100) / 100 === Math.round(n) ? Math.round(n).toLocaleString('en-US') : n.toLocaleString('en-US', { maximumFractionDigits: 2 })}${currency ? ' ' + currency : ''}`;
  const setPayer = (id, v) => {
    const next = { ...payers, [id]: v };
    if (!v) delete next[id];
    // The biggest payer is the one the budget line is filed under.
    const top = Object.entries(next).sort((a, b) => (parseFloat(b[1]) || 0) - (parseFloat(a[1]) || 0))[0];
    set({ payers: next, paid_by: top ? top[0] : (details.paid_by || window.currentUserId) });
  };
  const nameOf = (m) => m.id === window.currentUserId ? (ar ? 'أنا' : 'Me') : (m.name || '').split(' ')[0];
  const seg = (active) => ({
    flex: 1, minHeight: 42, borderRadius: 11, fontSize: 14, fontWeight: 600,
    background: active ? 'var(--ink)' : 'transparent', color: active ? 'var(--cream)' : 'var(--ink-soft)',
  });
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', padding: 3, borderRadius: 14, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
        <button type="button" onClick={() => markPaid(false)} style={seg(!paid)}>{ar ? 'لم يُدفع بعد' : 'Not paid yet'}</button>
        <button type="button" onClick={() => markPaid(true)} style={seg(paid)}>{ar ? 'مدفوع ✓' : 'Paid ✓'}</button>
      </div>
      {!paid && (
        <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 8, lineHeight: 1.5 }}>
          {ar ? 'ما ينحسب في الميزانية لين تسجّل إنه اندفع.' : "Won't count in the budget until it's marked paid."}
        </div>
      )}
      {paid && shared && members.length > 1 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 2px 6px' }}>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{ar ? 'مين دفع؟' : 'Who paid?'}</div>
            <div style={{ display: 'flex', padding: 2, borderRadius: 10, background: 'var(--cream-2)', border: '0.5px solid var(--hairline)' }}>
              <button type="button" onClick={() => set({ payers: null })} style={{ ...seg(!multi), minHeight: 30, fontSize: 12, padding: '0 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>{ar ? 'شخص واحد' : 'One person'}</button>
              <button type="button" onClick={() => set({ payers: costNum ? { [details.paid_by || window.currentUserId]: String(costNum) } : {} })} style={{ ...seg(multi), minHeight: 30, fontSize: 12, padding: '0 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>{ar ? 'أكثر من شخص' : 'Several'}</button>
            </div>
          </div>
          {multi && (
            <div style={{ display: 'grid', gap: 6 }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar m={m} size={28} />
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{nameOf(m)}</span>
                  <NumberField value={payers[m.id] || ''} onChange={(v) => setPayer(m.id, v)} placeholder="0"
                    style={{ ...docFieldStyle, width: 120, textAlign: 'end' }} />
                </div>
              ))}
              {costNum > 0 && (
                <div style={{ fontSize: 12.5, marginTop: 2, fontWeight: 600,
                  color: Math.abs(sumPaid - costNum) < 0.01 ? 'var(--moss)' : 'var(--clay-deep)' }}>
                  {Math.abs(sumPaid - costNum) < 0.01
                    ? (ar ? `✓ المجموع ${fmtN(sumPaid)} = التكلفة` : `✓ Total ${fmtN(sumPaid)} matches the cost`)
                    : sumPaid < costNum
                      ? (ar ? `المجموع ${fmtN(sumPaid)} — باقي ${fmtN(costNum - sumPaid)} من التكلفة` : `Total ${fmtN(sumPaid)} — ${fmtN(costNum - sumPaid)} left`)
                      : (ar ? `المجموع ${fmtN(sumPaid)} أكثر من التكلفة بـ ${fmtN(sumPaid - costNum)}` : `Total ${fmtN(sumPaid)} is ${fmtN(sumPaid - costNum)} over the cost`)}
                </div>
              )}
            </div>
          )}
          {!multi && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {members.map((m) => {
              const on = (details.paid_by || window.currentUserId) === m.id;
              return (
                <button type="button" key={m.id} onClick={() => set({ paid_by: m.id })} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 4px', minHeight: 40,
                  borderRadius: 999, background: on ? 'var(--statement)' : 'var(--cream-2)',
                  color: on ? 'var(--statement-fg)' : 'var(--ink)', border: on ? 'none' : '0.5px solid var(--hairline)',
                  fontSize: 13, fontWeight: 500,
                }}>
                  <Avatar m={m} size={28} />
                  {nameOf(m)}
                </button>
              );
            })}
          </div>}
        </>
      )}
      {paid && (
        <>
          <div style={{ fontSize: 13, color: 'var(--ink-mute)', margin: '12px 2px 6px' }}>{ar ? 'متى اندفع؟' : 'Paid on'}</div>
          <input type="date" value={details.paid_on || window.localISO()} max={window.localISO()}
            onChange={(e) => set({ paid_on: e.target.value })} style={{ ...docFieldStyle }} />
        </>
      )}
    </div>
  );
}
window.PaymentFields = PaymentFields;
