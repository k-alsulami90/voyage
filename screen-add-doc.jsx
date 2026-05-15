// Full-screen "Add document" page — replaces the small sheet.
// Lets the user fill title, subtitle, category, tint, file, link in one flow.

function ScreenAddDoc({ back, onCreated }) {
  const [title,     setTitle]     = React.useState('');
  const [subtitle,  setSubtitle]  = React.useState('');
  const [cat,       setCat]       = React.useState('flights');
  const [tint,      setTint]      = React.useState('indigo');
  const [link,      setLink]      = React.useState('');
  const [linkLabel, setLinkLabel] = React.useState('');
  const [file,      setFile]      = React.useState(null);
  const [drag,      setDrag]      = React.useState(false);
  const [saving,    setSaving]    = React.useState(false);
  const [error,     setError]     = React.useState(null);
  const fileRef = React.useRef(null);

  const TINTS = ['indigo', 'clay', 'moss', 'honey'];
  const TINT_FILL = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' };
  const DEFAULT_TINTS = { flights: 'indigo', lodging: 'clay', visas: 'moss', transport: 'honey' };

  // When the user picks a category, default the tint to match (they can still override)
  React.useEffect(() => { setTint(DEFAULT_TINTS[cat] || 'clay'); }, [cat]);

  const handleSave = async () => {
    if (!title.trim()) { setError(window.isRTL ? 'أدخل عنواناً' : 'Enter a title'); return; }
    const tripId = window.TRIP?.id;
    const userId = window.currentUserId;
    if (!tripId || !userId) { setError('No active trip or session'); return; }

    setSaving(true); setError(null);
    try {
      // 1. Create the document record
      const doc = await window.addDocument(tripId, userId, {
        title:     title.trim(),
        subtitle:  subtitle.trim() || null,
        category:  cat,
        kind:      file && file.type?.startsWith('image/') ? 'img' : 'pdf',
        tint,
        linkUrl:   link.trim() || null,
        linkLabel: linkLabel.trim() || (link.trim() ? 'Link' : null),
      });

      // 2. If user picked a file, upload it now
      if (file) {
        await window.uploadDocumentFile(doc.id, tripId, file);
      }

      await window.loadDocuments(tripId);
      onCreated?.(doc.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const fieldStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 14,
    border: '0.5px solid var(--hairline)',
    background: 'var(--cream)', color: 'var(--ink)',
    fontSize: 14, outline: 'none', fontFamily: 'var(--sans)',
    textAlign: window.isRTL ? 'right' : 'left',
  };
  const labelStyle = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
    color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 6, display: 'block',
  };

  return (
    <div data-screen-label="Add Document" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 120,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 14px',
        background: 'linear-gradient(180deg, var(--cream) 85%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
      }}>
        <button onClick={back} style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span></button>
        <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>
          {window.isRTL ? 'مستند جديد' : 'New document'}
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Category — big visual cards */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'الفئة' : 'Category'}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(window.DOC_CATEGORIES || []).map((c) => {
              const active = cat === c.key;
              const color = TINT_FILL[c.tint] || 'var(--clay)';
              return (
                <button key={c.key} onClick={() => setCat(c.key)} style={{
                  padding: '14px 14px', borderRadius: 16, textAlign: window.isRTL ? 'right' : 'left',
                  background: active ? color : 'var(--cream-2)',
                  color: active ? '#fff' : 'var(--ink)',
                  border: active ? 'none' : '0.5px solid var(--hairline)',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  transition: 'all 180ms',
                }}>
                  <div className="serif" style={{ fontSize: 16, lineHeight: 1.1 }}>{c.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>
                    {c.key === 'flights' && (window.isRTL ? 'تذاكر · بطاقات صعود' : 'Tickets · boarding')}
                    {c.key === 'lodging' && (window.isRTL ? 'فنادق · شقق' : 'Hotels · stays')}
                    {c.key === 'visas' && (window.isRTL ? 'تأشيرات · تأمين' : 'Visas · insurance')}
                    {c.key === 'transport' && (window.isRTL ? 'نقل · إيجار سيارة' : 'Transit · car rental')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'العنوان' : 'Title'} *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={window.isRTL ? 'مثال: تذكرة طوكيو' : 'e.g. Tokyo boarding pass'}
            style={fieldStyle} />
        </div>

        {/* Subtitle */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'وصف · رقم الحجز · تاريخ' : 'Subtitle · confirmation # · dates'}</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
            placeholder={window.isRTL ? 'مثال: 08 نوف · PNR ABC123' : 'e.g. 08 Nov · PNR ABC123'}
            style={fieldStyle} />
        </div>

        {/* File picker / drop zone */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'الملف' : 'File'} ({window.isRTL ? 'اختياري' : 'optional'})</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              if (e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                setFile(f);
                if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
              }
            }}
            style={{
              padding: '18px', borderRadius: 18, textAlign: 'center',
              background: drag ? 'oklch(0.62 0.13 35 / 0.10)' : 'var(--cream-2)',
              border: drag ? '1.5px dashed var(--clay)' : '1.5px dashed var(--sand-deep)',
              cursor: 'pointer', transition: 'all 200ms',
            }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  setFile(f);
                  if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
                }
              }} />
            {file ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: TINT_FILL[tint],
                  color: '#fff', display: 'grid', placeItems: 'center',
                }}><IconPdf size={20} stroke="#fff" /></div>
                <div style={{ textAlign: window.isRTL ? 'right' : 'left', minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · {window.isRTL ? 'اضغط للاستبدال' : 'tap to replace'}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{
                  padding: 6, borderRadius: 8, background: 'var(--cream)', border: '0.5px solid var(--hairline)',
                }}><IconTrash size={14} stroke="var(--clay-deep)" /></button>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ink)', color: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
                  <IconUpload size={20} />
                </div>
                <div style={{ textAlign: window.isRTL ? 'right' : 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                    {drag ? t('dropHere') : (window.isRTL ? 'اختر ملفاً' : 'Pick a file')}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>{t('pdfJpgPng')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optional external link */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'رابط خارجي (اختياري)' : 'External link (optional)'}</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            style={{ ...fieldStyle, fontFamily: 'var(--mono)', fontSize: 13 }} />
          {link.trim() && (
            <input type="text" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
              placeholder={window.isRTL ? 'نص الرابط (مثال: خرائط جوجل)' : 'Link label (e.g. Google Maps)'}
              style={{ ...fieldStyle, marginTop: 6, fontSize: 13 }} />
          )}
        </div>

        {/* Tint color (visual identity) */}
        <div>
          <label style={labelStyle}>{window.isRTL ? 'اللون' : 'Tint'}</label>
          <div style={{ display: 'flex', gap: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
            {TINTS.map((tt) => (
              <button key={tt} onClick={() => setTint(tt)} style={{
                width: 44, height: 44, borderRadius: 12,
                background: TINT_FILL[tt],
                border: tint === tt ? '3px solid var(--ink)' : '0.5px solid var(--hairline)',
                boxShadow: tint === tt ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 180ms',
              }} />
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 12,
            background: 'oklch(0.62 0.13 35 / 0.10)',
            border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
            fontSize: 12.5, color: 'var(--clay-deep)',
          }}>{error}</div>
        )}

        {/* Save bar */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
          <button onClick={back} disabled={saving} style={{
            padding: '15px 22px', borderRadius: 16,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
            fontSize: 13.5, fontWeight: 500,
          }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '15px', borderRadius: 16,
            background: saving ? 'var(--ink-soft)' : 'var(--ink)', color: 'var(--cream)',
            fontSize: 13.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
          }}>
            {saving ? (
              <span style={{ width: 14, height: 14, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
                display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
            ) : (
              <>
                <IconCheck size={14} stroke="currentColor" />
                {window.isRTL ? 'حفظ المستند' : 'Save document'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

window.ScreenAddDoc = ScreenAddDoc;
