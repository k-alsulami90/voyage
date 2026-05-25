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
  const [logExpense,  setLogExpense]  = React.useState(false);

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
  }, [cat]);

  const schema = window.DOC_SCHEMAS[cat] || window.DOC_SCHEMAS.visas;
  const CAT_TINT = { flights: 'indigo', lodging: 'clay', visas: 'moss', transport: 'honey' };
  const TINT_FILL = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' };
  const tint = CAT_TINT[cat] || 'clay';

  const handleSave = async () => {
    if (!title.trim()) { setError(window.isRTL ? 'أدخل عنواناً' : 'Enter a title'); return; }
    const tripId = window.TRIP?.id;
    const userId = window.currentUserId;
    if (!tripId || !userId) { setError('No active trip or session'); return; }

    setSaving(true); setError(null);
    try {
      const costUSD = (cost && schema.showCost) ? window.toUSD(parseFloat(cost), costCur) : null;
      const doc = await window.addDocument(tripId, userId, {
        title:    title.trim(),
        category: cat,
        kind:     file && file.type?.startsWith('image/') ? 'img' : 'pdf',
        tint,
        details,
        costUSD,
        costLocal:    cost ? parseFloat(cost) : null,
        costCurrency: cost ? costCur : null,
        linkUrl:      details.location_url || null,
        linkLabel:    details.location_url ? (window.isRTL ? 'الموقع' : 'Location') : null,
      });
      if (file)      await window.uploadDocumentFile(doc.id, tripId, file);
      if (secondary) await window.uploadDocumentSecondaryFile(doc.id, tripId, secondary);
      if (coverFile) {
        try { await window.uploadDocCover(doc.id, tripId, coverFile); }
        catch (e) { window.toast?.(e.message || 'Cover upload failed', 'error'); }
      }
      if (logExpense && costUSD) {
        try { await window.linkDocExpense(doc.id, tripId); }
        catch (e) { window.toast?.(e.message || 'Expense link failed', 'error'); }
      }
      await window.loadDocuments(tripId);
      onCreated?.(doc.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div data-screen-label="Add Document" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 140,
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
          {window.isRTL ? 'مستند جديد' : 'New document'}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Step 1 — Category */}
        <DocStep number="1" title={window.isRTL ? 'النوع' : 'What is it?'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(window.DOC_CATEGORIES || []).map((c) => {
              const active = cat === c.key;
              const color = TINT_FILL[CAT_TINT[c.key]] || 'var(--clay)';
              const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
              const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
              const emoji = window.DOC_SCHEMAS[c.key]?.emoji || '📄';
              return (
                <button key={c.key} onClick={() => setCat(c.key)} style={{
                  padding: '12px 14px', borderRadius: 14, textAlign: 'start',
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

        {/* Step 2 — Title (category-specific label) */}
        <DocStep number="2" title={schema.titleLabel()}>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={schema.titlePlaceholder()}
            style={docFieldStyle} />
        </DocStep>

        {/* Step 3 — Structured details (category-specific) */}
        {schema.fields.length > 0 && (
          <DocStep number="3" title={window.isRTL ? 'التفاصيل' : 'Details'}>
            <DocFieldGrid fields={schema.fields} values={details} onChange={setDetails} />
          </DocStep>
        )}

        {/* Step 4 — Primary file */}
        <DocStep number="4" title={schema.primaryFileLabel()} optional
                hint={window.isRTL ? 'PDF أو صورة — حتى 25 ميغا' : 'PDF or image · up to 25 MB'}>
          <FilePicker file={file} setFile={setFile} pickerRef={fileRef} tint={TINT_FILL[tint]} />
        </DocStep>

        {/* Step 4b — Secondary file (flights only) */}
        {schema.secondaryFile && (
          <DocStep number="5" title={schema.secondaryFile.label()} optional>
            <FilePicker file={secondary} setFile={setSecondary} pickerRef={secondaryRef} tint={TINT_FILL[tint]} />
          </DocStep>
        )}

        {/* Cost + log to expenses */}
        {schema.showCost && (
          <DocStep number={schema.secondaryFile ? '6' : '5'} title={window.isRTL ? 'التكلفة' : 'Cost'} optional>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'row' }}>
              <input type="number" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                style={{ ...docFieldStyle, flex: 1 }} />
              <select value={costCur} onChange={(e) => setCostCur(e.target.value)} style={{
                ...docFieldStyle, width: 'auto', minWidth: 80, fontFamily: 'var(--mono)',
              }}>
                {[tripLocal, tripHome, 'USD', 'SAR', 'AED', 'EUR']
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label style={{
              marginTop: 10, padding: '12px 14px', borderRadius: 14,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
              display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row',
              cursor: 'pointer',
            }}>
              <input type="checkbox" checked={logExpense} onChange={(e) => setLogExpense(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--clay)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>
                  {window.isRTL ? 'أضف إلى المصروفات' : 'Add to expenses'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>
                  {window.isRTL ? 'سيُسجَّل تلقائياً في الميزانية' : 'Auto-logged in your trip budget'}
                </div>
              </div>
            </label>
          </DocStep>
        )}

        {/* Cover photo */}
        <DocStep number={schema.showCost ? (schema.secondaryFile ? '7' : '6') : (schema.secondaryFile ? '6' : '5')}
                 title={window.isRTL ? 'صورة الغلاف' : 'Cover photo'} optional
                 hint={window.isRTL
                   ? 'صورة صغيرة تظهر في القائمة بدل الأيقونة الافتراضية'
                   : 'A small image shown in the list instead of the default icon'}>
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
                {window.isRTL ? 'صورة الغلاف' : 'Cover photo'}
              </div>
              <button onClick={() => coverRef.current?.click()} style={{
                padding: '7px 11px', borderRadius: 10, fontSize: 11.5, fontWeight: 500,
                background: 'var(--cream)', border: '0.5px solid var(--hairline)',
                color: 'var(--ink-soft)',
              }}>{window.isRTL ? 'تغيير' : 'Replace'}</button>
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
              {window.isRTL ? 'إضافة صورة' : 'Add a photo'}
            </button>
          )}
        </DocStep>

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

      {/* Sticky save bar */}
      <div style={{
        position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom) + 78px)',
        insetInlineStart: 14, insetInlineEnd: 14, zIndex: 49,
        display: 'flex', gap: 8, flexDirection: 'row',
        padding: 7, borderRadius: 20,
        background: 'rgba(255,251,244,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid var(--hairline-2)',
        boxShadow: '0 12px 30px rgba(34,28,22,0.18)',
      }}>
        <button onClick={back} disabled={saving} style={{
          padding: '13px 20px', borderRadius: 14,
          background: 'transparent', color: 'var(--ink-soft)',
          fontSize: 13.5, fontWeight: 500,
        }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: '13px', borderRadius: 14,
          background: saving ? 'var(--ink-soft)' : 'var(--clay)', color: '#fff',
          fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: 'row',
          boxShadow: '0 6px 14px oklch(0.62 0.13 35 / 0.4)',
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
              {window.isRTL ? 'حفظ' : 'Save document'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Shared field styles + components ────────────────────────────
const docFieldStyle = {
  width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 14,
  border: '0.5px solid var(--hairline)',
  background: 'var(--cream-2)', color: 'var(--ink)',
  fontSize: 15, outline: 'none', fontFamily: 'var(--sans)',
  textAlign: 'start',
};

function DocStep({ number, title, hint, optional, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10,
        flexDirection: 'row',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          background: 'var(--ink)', color: 'var(--cream)',
          display: 'grid', placeItems: 'center',
          fontSize: 11, fontWeight: 600, fontFamily: 'var(--mono)',
        }}>{number}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
        {optional && (
          <span style={{
            fontSize: 10.5, color: 'var(--ink-mute)',
            fontFamily: 'var(--mono)', letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>· {window.isRTL ? 'اختياري' : 'optional'}</span>
        )}
      </div>
      {hint && (
        <div style={{
          fontSize: 11.5, color: 'var(--ink-mute)',
          marginBottom: 10, padding: '0 2px', lineHeight: 1.4,
        }}>{hint}</div>
      )}
      {children}
    </div>
  );
}

// Render an array of schema field defs as a responsive 1- or 2-column grid.
function DocFieldGrid({ fields, values, onChange }) {
  // Group adjacent fields with col===2 next to their predecessor.
  const rows = [];
  let cursor = [];
  fields.forEach((f) => {
    if (f.col === 2 && cursor.length === 1) { cursor.push(f); rows.push(cursor); cursor = []; }
    else {
      if (cursor.length) rows.push(cursor);
      cursor = [f];
    }
  });
  if (cursor.length) rows.push(cursor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'grid', gap: 8,
          gridTemplateColumns: row.length === 2 ? '2fr 1fr' : '1fr',
        }}>
          {row.map((f) => (
            <DocField key={f.key} field={f}
              value={values[f.key] || ''}
              onChange={(v) => onChange({ ...values, [f.key]: v })} />
          ))}
        </div>
      ))}
    </div>
  );
}

function DocField({ field, value, onChange }) {
  const inputType = field.type === 'date' ? 'date'
                  : field.type === 'datetime' ? 'datetime-local'
                  : field.type === 'url' ? 'url' : 'text';
  // For datetime-local, the value must be in the local YYYY-MM-DDTHH:mm format.
  const v = (field.type === 'datetime' && value)
    ? toLocalDateTimeInput(value)
    : value;
  return (
    <div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.10em',
        color: 'var(--ink-mute)', textTransform: 'uppercase',
        marginBottom: 5,
      }}>{field.label()}</div>
      <input
        type={inputType}
        value={v}
        onChange={(e) => onChange(field.type === 'datetime' ? fromLocalDateTimeInput(e.target.value) : e.target.value)}
        placeholder={field.placeholder ? field.placeholder() : ''}
        style={{ ...docFieldStyle, fontSize: 14, padding: '11px 13px' }} />
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
              {(file.size / 1024 / 1024).toFixed(2)} MB · {window.isRTL ? 'اضغط للاستبدال' : 'tap to replace'}
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
              {window.isRTL ? 'اختر ملفاً' : 'Pick a file'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
              {window.isRTL ? 'PDF أو صورة' : 'PDF or image'}
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
window.FilePicker = FilePicker;
window.toLocalDateTimeInput = toLocalDateTimeInput;
window.fromLocalDateTimeInput = fromLocalDateTimeInput;
window.docFieldStyle = docFieldStyle;
