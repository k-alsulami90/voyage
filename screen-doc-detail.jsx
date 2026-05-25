// Doc Detail — one job: show a document and let you change it.
// Layout: cover/header → title → primary actions (open file / open link) →
// editable detail rows → replace file / delete in a sticky footer.

function ScreenDocDetail({ doc: initialDoc, category, go, back }) {
  // Re-pull from window.DOCS_BY_CAT so edits show fresh data here.
  // (DOCS_BY_CAT is keyed by category — search all of them in case the
  // category itself was changed in this session.)
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const doc = allDocs.find((d) => d.id === initialDoc?.id) || initialDoc;
  if (!doc) return null;

  const TINT_FILL = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' };
  const tintFill = TINT_FILL[doc.tint] || 'var(--clay)';

  // Edit state — toggling the pencil pulls the rows into input mode.
  const [editing,  setEditing]  = React.useState(false);
  const [title,    setTitle]    = React.useState(doc.title || '');
  const [subtitle, setSubtitle] = React.useState(doc.sub || '');
  const [link,     setLink]     = React.useState(doc.link || '');
  const [cat,      setCat]      = React.useState(doc.category || category?.key || 'flights');
  const [saving,   setSaving]   = React.useState(false);

  // File / cover replace
  const [uploading,    setUploading]    = React.useState(false);
  const [uploadingCov, setUploadingCov] = React.useState(false);
  const [coverToCrop,  setCoverToCrop]  = React.useState(null);  // file awaiting crop
  const fileRef  = React.useRef(null);
  const coverRef = React.useRef(null);

  // When the underlying doc object refreshes (after save), sync the local form.
  React.useEffect(() => {
    setTitle(doc.title || '');
    setSubtitle(doc.sub || '');
    setLink(doc.link || '');
    setCat(doc.category || category?.key || 'flights');
  }, [doc.id, doc.title, doc.sub, doc.link, doc.category, category?.key]);

  const replaceFile = async (file) => {
    if (!file || !window.TRIP?.id) return;
    setUploading(true);
    try {
      await window.uploadDocumentFile(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
      window.toast?.(window.isRTL ? 'تم استبدال الملف' : 'File replaced', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };

  // The flow is: pick → ImageCropper opens → user adjusts → onDone gives us
  // a cropped Blob/File → upload that. So this only runs with the cropped output.
  const replaceCover = async (file) => {
    if (!file || !window.TRIP?.id) return;
    setUploadingCov(true);
    try {
      await window.uploadDocCover(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
    } catch (err) {
      window.toast?.(err.message || 'Cover upload failed', 'error');
    } finally { setUploadingCov(false); }
  };

  const removeFile = async () => {
    if (!doc.filePath) return;
    if (!confirm(window.isRTL ? 'إزالة الملف المرفق؟' : 'Remove the attached file?')) return;
    try {
      await window.removeDocumentFile(doc.id, doc.filePath);
      await window.loadDocuments(window.TRIP?.id);
      window.toast?.(window.isRTL ? 'تم حذف الملف' : 'File removed', 'success');
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };

  const removeCover = async () => {
    if (!doc.coverPath) return;
    if (!confirm(window.isRTL ? 'إزالة صورة الغلاف؟' : 'Remove cover photo?')) return;
    try {
      await window.deleteDocCover(doc.id, doc.coverPath);
      await window.loadDocuments(window.TRIP?.id);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };

  const saveEdits = async () => {
    if (!title.trim()) { window.toast?.(window.isRTL ? 'العنوان مطلوب' : 'Title is required', 'error'); return; }
    setSaving(true);
    try {
      await window.updateDocument(doc.id, {
        title, subtitle, category: cat, linkUrl: link,
        linkLabel: link.trim() ? (window.isRTL ? 'فتح الرابط' : 'Open link') : null,
      });
      await window.loadDocuments(window.TRIP?.id);
      setEditing(false);
      window.toast?.(window.isRTL ? 'تم الحفظ' : 'Saved', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const deleteDoc = async () => {
    if (!confirm(window.isRTL ? 'حذف هذا المستند؟' : 'Delete this document?')) return;
    try {
      await window.deleteDocument(doc.id, window.TRIP?.id, doc.title);
      await window.loadDocuments(window.TRIP?.id);
      back();
    } catch (err) { window.toast?.(err.message || 'Delete failed', 'error'); }
  };

  const hasFile  = !!doc.filePath;
  const hasLink  = !!(link && link.trim());
  const hasCover = !!doc.coverUrl;

  const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
  const catLabel = CAT_T[cat] ? t(CAT_T[cat]) : (category?.label || cat);

  return (
    <div data-screen-label={`Vault · ${doc.title}`} style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 140,
    }}>

      {/* ── COVER HEADER ─────────────────────────────────────────
         Either: uploaded cover photo, or a clean tinted header with
         the category emoji. No more fake-paper preview.
         ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', height: 240, overflow: 'hidden',
        background: hasCover ? 'var(--ink)' : tintFill,
      }}>
        {hasCover && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${doc.coverUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        )}
        {!hasCover && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', placeItems: 'center',
            fontSize: 80, opacity: 0.4,
          }}>
            {{ flights:'✈️', lodging:'🏨', visas:'📘', transport:'🚆' }[cat] || '📄'}
          </div>
        )}
        {/* Bottom-fade so the title card below blends in */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))',
        }} />

        {/* Header buttons floating over the cover */}
        <div style={{
          position: 'absolute', top: 0, insetInlineStart: 0, insetInlineEnd: 0, zIndex: 5,
          padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexDirection: 'row',
        }}>
          <button onClick={back} className="glass" style={{
            width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center',
            color: '#fff', background: 'rgba(0,0,0,0.38)',
          }}><span className="icon-flip"><IconBack size={17} stroke="#fff" /></span></button>

          <div className="glass" style={{
            padding: '5px 12px', borderRadius: 999, color: '#fff',
            background: 'rgba(0,0,0,0.38)', fontSize: 11, fontWeight: 500, letterSpacing: 0.04,
          }}>{catLabel}</div>

          {/* Edit toggle. In edit mode it becomes the Save button. */}
          {editing ? (
            <button onClick={saveEdits} disabled={saving} className="glass" style={{
              padding: '8px 14px', borderRadius: 999, color: '#fff',
              background: 'var(--clay)', fontSize: 12.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
            }}>
              {saving
                ? <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
                : <IconCheck size={13} stroke="#fff" />}
              {window.isRTL ? 'حفظ' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="glass" style={{
              width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center',
              color: '#fff', background: 'rgba(0,0,0,0.38)',
            }}><IconEdit size={16} stroke="#fff" /></button>
          )}
        </div>

        {/* Cover-edit affordance — small floating button on the cover */}
        {editing && (
          <div style={{
            position: 'absolute', bottom: 12, insetInlineEnd: 14, zIndex: 6,
            display: 'flex', gap: 6, flexDirection: 'row',
          }}>
            <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverToCrop(f); e.target.value = ''; }} />
            <button onClick={() => coverRef.current?.click()} disabled={uploadingCov} className="glass" style={{
              padding: '6px 12px', borderRadius: 999, color: '#fff',
              background: 'rgba(0,0,0,0.55)', fontSize: 11.5, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
            }}>
              <window.IconCamera size={12} stroke="#fff" />
              {uploadingCov ? '…' : (hasCover ? (window.isRTL ? 'تغيير' : 'Change') : (window.isRTL ? 'إضافة' : 'Add cover'))}
            </button>
            {hasCover && (
              <button onClick={removeCover} className="glass" style={{
                padding: '6px 10px', borderRadius: 999, color: '#fff',
                background: 'rgba(0,0,0,0.55)',
                display: 'grid', placeItems: 'center',
              }}><IconTrash size={12} stroke="#fff" /></button>
            )}
          </div>
        )}
      </div>

      {/* ── TITLE CARD ─────────────────────────────────────────── */}
      <div style={{
        margin: '-26px 14px 0', position: 'relative', zIndex: 4,
        background: 'var(--cream-2)', borderRadius: 22,
        padding: '16px 18px', boxShadow: 'var(--shadow-md)',
        border: '0.5px solid var(--hairline)',
      }}>
        {editing ? (
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus style={{
            width: '100%', boxSizing: 'border-box',
            fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.2,
            color: 'var(--ink)', letterSpacing: '-0.01em',
            border: 0, outline: 'none', background: 'transparent',
            borderBottom: '1.5px dashed var(--clay)',
            padding: '2px 0',
          }} />
        ) : (
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, color: 'var(--ink)' }}>
            {doc.title}
          </div>
        )}
        {(subtitle || editing) && (
          editing ? (
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder={window.isRTL ? 'مرجع أو رقم حجز' : 'Reference or confirmation'}
              style={{
                width: '100%', boxSizing: 'border-box', marginTop: 6,
                fontSize: 13, color: 'var(--ink-soft)',
                border: 0, outline: 'none', background: 'transparent',
                borderBottom: '1px dashed var(--hairline-2)', padding: '2px 0',
              }} />
          ) : (
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 5 }}>{subtitle}</div>
          )
        )}
      </div>

      {/* ── PRIMARY ACTIONS — open file / open link ─────────────── */}
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{
          display: 'grid', gap: 8,
          gridTemplateColumns: (hasFile && hasLink) ? '1fr 1fr' : '1fr',
        }}>
          {hasFile && (
            <a href={doc.link} target="_blank" rel="noreferrer" style={{
              padding: '14px 16px', borderRadius: 16,
              background: 'var(--ink)', color: 'var(--cream)',
              fontSize: 13.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexDirection: 'row', textDecoration: 'none',
            }}>
              <IconDoc size={16} stroke="currentColor" />
              {window.isRTL ? 'فتح الملف' : 'Open file'}
            </a>
          )}
          {hasLink && !editing && (
            <a href={link} target="_blank" rel="noreferrer" style={{
              padding: '14px 16px', borderRadius: 16,
              background: tintFill, color: '#fff',
              fontSize: 13.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexDirection: 'row', textDecoration: 'none',
            }}>
              <IconLink size={16} stroke="currentColor" />
              {window.isRTL ? 'فتح الرابط' : 'Open link'}
            </a>
          )}
        </div>
        {!hasFile && !editing && (
          <div style={{
            marginTop: 8, padding: '10px 14px', borderRadius: 12,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center',
          }}>
            {window.isRTL ? 'لا يوجد ملف مرفوع — استخدم زر الاستبدال أدناه' : 'No file attached yet — use Replace below'}
          </div>
        )}
      </div>

      {/* ── EDITABLE DETAILS ─────────────────────────────────── */}
      {editing && (
        <div style={{ padding: '20px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'التفاصيل' : 'Details'}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 18,
            margin: '0 8px', overflow: 'hidden',
            border: '0.5px solid var(--hairline)',
          }}>
            {/* Category */}
            <DetailEditRow label={window.isRTL ? 'الفئة' : 'Category'}>
              <select value={cat} onChange={(e) => setCat(e.target.value)} style={{
                fontSize: 13, color: 'var(--ink)', fontWeight: 500,
                background: 'transparent', border: 0, outline: 'none',
                textAlign: 'end', padding: '2px 0',
              }}>
                {(window.DOC_CATEGORIES || []).map((c) => {
                  const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
                  return <option key={c.key} value={c.key}>{label}</option>;
                })}
              </select>
            </DetailEditRow>
            {/* Link */}
            <DetailEditRow label={window.isRTL ? 'رابط' : 'Link'} last>
              <input value={link} onChange={(e) => setLink(e.target.value)}
                placeholder="https://..." type="url" style={{
                  flex: 1, fontSize: 13, color: 'var(--ink)', fontWeight: 500,
                  border: 0, outline: 'none', background: 'transparent',
                  textAlign: 'end', fontFamily: 'var(--mono)',
                }} />
            </DetailEditRow>
          </div>
        </div>
      )}

      {/* ── METADATA (read-only) ─────────────────────────────── */}
      {!editing && (
        <div style={{ padding: '20px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'معلومات' : 'About'}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 18,
            margin: '0 8px', overflow: 'hidden',
            border: '0.5px solid var(--hairline)',
          }}>
            <InfoRow label={window.isRTL ? 'الفئة' : 'Category'} value={catLabel} />
            <InfoRow label={window.isRTL ? 'النوع' : 'Type'} value={(doc.kind || '').toUpperCase() || '—'} />
            <InfoRow label={window.isRTL ? 'الحجم' : 'Size'} value={doc.size && doc.size !== '--' ? doc.size : '—'} />
            <InfoRow label={window.isRTL ? 'الحالة' : 'Status'}
              value={hasFile ? (window.isRTL ? 'متزامن' : 'Uploaded') : (window.isRTL ? 'لا ملف' : 'No file')}
              accent={hasFile ? 'var(--moss)' : 'var(--clay-deep)'} last />
          </div>
        </div>
      )}

      {/* ── STICKY BOTTOM ACTIONS ────────────────────────────── */}
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
        <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) replaceFile(e.target.files[0]); }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
          flex: 1, padding: '12px', borderRadius: 14,
          background: 'var(--cream)', border: '0.5px solid var(--hairline)',
          color: 'var(--ink)',
          fontSize: 12.5, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          flexDirection: 'row',
        }}>
          {uploading
            ? <span style={{ width:12, height:12, borderRadius:'50%', border:'2px solid var(--hairline-2)', borderTopColor:'var(--ink)', animation:'expspin 0.8s linear infinite' }} />
            : <IconUpload size={13} stroke="currentColor" />}
          {hasFile ? (window.isRTL ? 'استبدال' : 'Replace') : (window.isRTL ? 'رفع ملف' : 'Upload file')}
        </button>
        {hasFile && (
          <button onClick={removeFile} title={window.isRTL ? 'إزالة الملف' : 'Remove file'}
            aria-label={window.isRTL ? 'إزالة الملف' : 'Remove file'} style={{
            padding: '12px', borderRadius: 14,
            background: 'transparent', color: 'var(--ink-soft)',
            border: '0.5px solid var(--hairline)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <window.IconClose size={14} stroke="currentColor" />
          </button>
        )}
        <button onClick={deleteDoc} title={window.isRTL ? 'حذف المستند' : 'Delete document'}
          aria-label={window.isRTL ? 'حذف المستند' : 'Delete document'} style={{
          padding: '12px', borderRadius: 14,
          background: 'transparent', color: 'var(--clay-deep)',
          border: '0.5px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconTrash size={14} stroke="currentColor" />
        </button>
      </div>

      {/* Image cropper modal — opens when user picks a cover, closes when they hit Done/Cancel */}
      {coverToCrop && (
        <window.ImageCropper
          file={coverToCrop}
          onCancel={() => setCoverToCrop(null)}
          onDone={(cropped) => { setCoverToCrop(null); replaceCover(cropped); }}
        />
      )}
    </div>
  );
}

// Read-only row inside the About card.
function InfoRow({ label, value, accent, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', flexDirection: 'row',
      borderBottom: last ? 'none' : '0.5px solid var(--hairline)',
    }}>
      <div style={{
        flex: '0 0 auto', minWidth: 80,
        fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.06em',
        color: 'var(--ink-mute)', textTransform: 'uppercase',
        textAlign: 'start',
      }}>{label}</div>
      <div style={{
        flex: 1, textAlign: 'end',
        fontSize: 13, fontWeight: 500,
        color: accent || 'var(--ink)',
      }}>{value}</div>
    </div>
  );
}

// Inline-edit row (used in edit mode).
function DetailEditRow({ label, children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', flexDirection: 'row',
      borderBottom: last ? 'none' : '0.5px solid var(--hairline)',
    }}>
      <div style={{
        flex: '0 0 auto', minWidth: 80,
        fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.06em',
        color: 'var(--ink-mute)', textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
    </div>
  );
}

window.ScreenDocDetail = ScreenDocDetail;
