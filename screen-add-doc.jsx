// Add Document — full-screen flow. Designed to be obvious:
//   1. Pick what kind of document it is
//   2. Name it
//   3. Attach the file (and optionally a cover photo / link)
// Tint is auto-derived from the category — one less control to think about.

function ScreenAddDoc({ back, onCreated }) {
  const [cat,       setCat]       = React.useState('flights');
  const [title,     setTitle]     = React.useState('');
  const [reference, setReference] = React.useState('');   // PNR / confirmation
  const [link,      setLink]      = React.useState('');
  const [file,      setFile]      = React.useState(null);
  const [coverFile, setCoverFile]   = React.useState(null);
  const [coverPreview, setCoverPreview] = React.useState(null);
  const [coverToCrop, setCoverToCrop] = React.useState(null); // raw pick awaiting crop
  const [showMore,  setShowMore]  = React.useState(false);  // reveals reference + link
  const [drag,      setDrag]      = React.useState(false);
  const [saving,    setSaving]    = React.useState(false);
  const [error,     setError]     = React.useState(null);
  const fileRef  = React.useRef(null);
  const coverRef = React.useRef(null);

  React.useEffect(() => {
    if (!coverFile) { setCoverPreview(null); return; }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // Tint is implied by category — never user-picked.
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
      const doc = await window.addDocument(tripId, userId, {
        title:     title.trim(),
        subtitle:  reference.trim() || null,
        category:  cat,
        kind:      file && file.type?.startsWith('image/') ? 'img' : 'pdf',
        tint,
        linkUrl:   link.trim() || null,
        linkLabel: link.trim() ? (window.isRTL ? 'فتح الرابط' : 'Open link') : null,
      });
      if (file)      await window.uploadDocumentFile(doc.id, tripId, file);
      if (coverFile) {
        try { await window.uploadDocCover(doc.id, tripId, coverFile); }
        catch (e) { window.toast?.(e.message || 'Cover upload failed', 'error'); }
      }
      await window.loadDocuments(tripId);
      onCreated?.(doc.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const fieldStyle = {
    width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 14,
    border: '0.5px solid var(--hairline)',
    background: 'var(--cream-2)', color: 'var(--ink)',
    fontSize: 15, outline: 'none', fontFamily: 'var(--sans)',
    textAlign: 'start',
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

        {/* ── Step 1 · Category ─────────────────────────────────── */}
        <Step number="1" title={window.isRTL ? 'النوع' : 'What is it?'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(window.DOC_CATEGORIES || []).map((c) => {
              const active = cat === c.key;
              const color = TINT_FILL[CAT_TINT[c.key]] || 'var(--clay)';
              const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
              const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
              const emoji = { flights:'✈️', lodging:'🏨', visas:'📘', transport:'🚆' }[c.key] || '📄';
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
        </Step>

        {/* ── Step 2 · Title ────────────────────────────────────── */}
        <Step number="2" title={window.isRTL ? 'الاسم' : 'Name it'}>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={
              cat === 'flights' ? (window.isRTL ? 'مثال: طوكيو - الرياض'  : 'e.g. Tokyo → Riyadh') :
              cat === 'lodging' ? (window.isRTL ? 'مثال: فندق نيكي طوكيو' : 'e.g. Nikko Tokyo')   :
              cat === 'visas'   ? (window.isRTL ? 'مثال: تأشيرة اليابان'   : 'e.g. Japan eVisa')   :
                                  (window.isRTL ? 'مثال: قطار شينكانسن'    : 'e.g. Shinkansen pass')
            }
            style={fieldStyle} autoFocus={false} />
        </Step>

        {/* ── Step 3 · File ─────────────────────────────────────── */}
        <Step number="3" title={window.isRTL ? 'الملف' : 'Attach file'}
              hint={window.isRTL ? 'PDF أو صورة — حتى 25 ميغا' : 'PDF or image · up to 25 MB'}>
          <div
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault(); setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^.]+$/, '')); }
            }}
            style={{
              padding: file ? '12px' : '20px', borderRadius: 16,
              background: drag ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
              border: drag ? '1.5px dashed var(--clay)'
                           : (file ? '0.5px solid var(--hairline)' : '1.5px dashed var(--sand-deep)'),
              cursor: 'pointer', transition: 'all 180ms',
            }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^.]+$/, '')); }
              }} />
            {file ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                flexDirection: 'row',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: TINT_FILL[tint],
                  color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {file.type?.startsWith('image/')
                    ? <IconImg size={20} stroke="#fff" />
                    : <IconPdf size={20} stroke="#fff" />}
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
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                flexDirection: 'row',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: 'var(--ink)',
                  color: 'var(--cream)', display: 'grid', placeItems: 'center',
                }}><IconUpload size={20} /></div>
                <div style={{ textAlign: 'start' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                    {drag ? t('dropHere') : (window.isRTL ? 'اختر ملفاً' : 'Pick a file')}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                    {window.isRTL ? 'PDF أو صورة' : 'PDF or image'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Step>

        {/* ── Step 4 · Cover photo (clearly distinct from the file) ── */}
        <Step number="4" title={window.isRTL ? 'صورة الغلاف' : 'Cover photo'}
              optional
              hint={window.isRTL
                ? 'صورة صغيرة تظهر في القائمة بدل الأيقونة الافتراضية'
                : 'A small image that replaces the default icon in the list'}>
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
              <div style={{
                flex: 1, fontSize: 12.5, color: 'var(--ink)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{coverFile?.name}</div>
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
        </Step>

        {/* ── More fields (collapsed by default) ──────────────────── */}
        {!showMore ? (
          <button onClick={() => setShowMore(true)} style={{
            alignSelf: 'flex-start', padding: '8px 14px', borderRadius: 999,
            background: 'transparent', color: 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            fontSize: 12.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6, flexDirection: 'row',
          }}>
            <IconPlus size={12} stroke="currentColor" />
            {window.isRTL ? 'حقول إضافية (مرجع، رابط)' : 'More details (reference, link)'}
          </button>
        ) : (
          <>
            <Step number="5" title={window.isRTL ? 'مرجع' : 'Reference'} optional
                  hint={window.isRTL ? 'رقم الحجز، PNR، تاريخ، أي شيء يساعدك' : 'PNR, confirmation #, dates — anything you want to remember'}>
              <input value={reference} onChange={(e) => setReference(e.target.value)}
                placeholder={window.isRTL ? 'مثلاً: PNR ABC123' : 'e.g. PNR ABC123'}
                style={fieldStyle} />
            </Step>
            <Step number="6" title={window.isRTL ? 'رابط' : 'Link'} optional
                  hint={window.isRTL ? 'موقع الحجز، خرائط جوجل، إلخ.' : 'Booking page, Google Maps, etc.'}>
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                style={{ ...fieldStyle, fontFamily: 'var(--mono)', fontSize: 13 }} />
            </Step>
          </>
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

      {/* Image cropper — appears after the user picks a photo */}
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

// Numbered step container — gives the page a clear "do this, then this" rhythm.
function Step({ number, title, hint, optional, children }) {
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
          fontSize: 11, fontWeight: 600,
          fontFamily: 'var(--mono)',
        }}>{number}</div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: 'var(--ink)',
          letterSpacing: '-0.005em',
        }}>{title}</div>
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

window.ScreenAddDoc = ScreenAddDoc;
