// Doc Detail — structured per-category view + edit mode.
// Fields come from window.DOC_SCHEMAS so this stays in sync with AddDoc.

// One source for inline form labels (CATEGORY, COST). Was the same
// uppercase mono pattern duplicated inline; centralising it both
// removes the slop and means the next style nudge ships in one place.
const editLabelStyle = {
  fontSize: 12, fontWeight: 600,
  color: 'var(--ink)', marginBottom: 6,
};

function ScreenDocDetail({ doc: initialDoc, category, go, back }) {
  // Re-pull from window.DOCS_BY_CAT so edits show fresh data
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const doc = allDocs.find((d) => d.id === initialDoc?.id) || initialDoc;
  if (!doc) return null;

  const schema = window.DOC_SCHEMAS[doc.category] || window.DOC_SCHEMAS.visas;
  const TINT_FILL = { indigo: 'var(--indigo)', clay: 'var(--clay)', moss: 'var(--moss)', honey: 'var(--honey)' };
  const tintFill = TINT_FILL[doc.tint] || 'var(--clay)';

  // ── Edit state ────────────────────────────────────────────
  const [editing,  setEditing]  = React.useState(false);
  const [title,    setTitle]    = React.useState(doc.title || '');
  const [details,  setDetails]  = React.useState(doc.details || {});
  const [cat,      setCat]      = React.useState(doc.category || category?.key || 'flights');
  const [cost,     setCost]     = React.useState(doc.costLocal != null ? String(doc.costLocal) : (doc.costUSD != null ? String(doc.costUSD) : ''));
  const [costCur,  setCostCur]  = React.useState(doc.costCurrency || window.TRIP?.localCurrency || 'USD');
  const [saving,   setSaving]   = React.useState(false);

  // ── File / cover state ────────────────────────────────────
  const [uploading,    setUploading]    = React.useState(false);
  const [uploadingSec, setUploadingSec] = React.useState(false);
  const [uploadingCov, setUploadingCov] = React.useState(false);
  const [coverToCrop,  setCoverToCrop]  = React.useState(null);
  const [linking,      setLinking]      = React.useState(false);
  const fileRef      = React.useRef(null);
  const secondaryRef = React.useRef(null);
  const coverRef     = React.useRef(null);

  // Sync local form when underlying doc refreshes
  React.useEffect(() => {
    setTitle(doc.title || '');
    setDetails(doc.details || {});
    setCat(doc.category || category?.key || 'flights');
    setCost(doc.costLocal != null ? String(doc.costLocal) : (doc.costUSD != null ? String(doc.costUSD) : ''));
    setCostCur(doc.costCurrency || window.TRIP?.localCurrency || 'USD');
  }, [doc.id, doc.title, doc.category, JSON.stringify(doc.details), doc.costLocal, doc.costUSD, doc.costCurrency, category?.key]);

  // ── File operations ───────────────────────────────────────
  const replacePrimary = async (file) => {
    if (!file || !window.TRIP?.id) return;
    setUploading(true);
    try {
      await window.uploadDocumentFile(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
      window.toast?.(window.isRTL ? 'تم استبدال الملف المرفق بنجاح' : 'File replaced', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };
  const replaceSecondary = async (file) => {
    if (!file || !window.TRIP?.id) return;
    setUploadingSec(true);
    try {
      await window.uploadDocumentSecondaryFile(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
      window.toast?.(window.isRTL ? 'تم استبدال الملف المرفق بنجاح' : 'File replaced', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Upload failed', 'error');
    } finally { setUploadingSec(false); }
  };
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
  const removeCover = async () => {
    if (!doc.coverPath) return;
    if (!confirm(window.isRTL ? 'هل تريد إزالة صورة الغلاف؟' : 'Remove cover photo?')) return;
    try {
      await window.deleteDocCover(doc.id, doc.coverPath);
      await window.loadDocuments(window.TRIP?.id);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };
  const removePrimary = async () => {
    if (!doc.filePath) return;
    if (!confirm(window.isRTL ? 'هل تريد إزالة هذا الملف المرفق؟' : 'Remove file?')) return;
    try {
      await window.removeDocumentFile(doc.id, doc.filePath);
      await window.loadDocuments(window.TRIP?.id);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };
  const removeSecondary = async () => {
    if (!doc.secondaryFilePath) return;
    if (!confirm(window.isRTL ? 'هل تريد إزالة الملف الإضافي؟' : 'Remove file?')) return;
    try {
      await window.removeDocumentSecondaryFile(doc.id, doc.secondaryFilePath);
      await window.loadDocuments(window.TRIP?.id);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };

  // ── Save edits ─────────────────────────────────────────────
  const saveEdits = async () => {
    if (!title.trim()) { window.toast?.(window.isRTL ? 'يرجى إدخال عنوان للمستند' : 'Title is required', 'error'); return; }
    setSaving(true);
    try {
      const costNum = cost ? parseFloat(cost) : null;
      const costUSD = costNum != null ? window.toUSD(costNum, costCur) : null;
      await window.updateDocument(doc.id, {
        title, category: cat, details,
        costLocal: costNum, costCurrency: cost ? costCur : null,
        costUSD,
        linkUrl: details.location_url || null,
        linkLabel: details.location_url ? (window.isRTL ? 'الرابط المرجعي' : 'Location') : null,
      });
      await window.loadDocuments(window.TRIP?.id);
      setEditing(false);
      window.toast?.(window.isRTL ? 'تم حفظ جميع التعديلات بنجاح' : 'Saved', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  // ── Expense linkage ────────────────────────────────────────
  const toggleExpense = async () => {
    setLinking(true);
    try {
      if (doc.linkedExpenseId) {
        await window.unlinkDocExpense(doc.id, window.TRIP?.id);
        window.toast?.(window.isRTL ? 'تم استبعاد التكلفة من سجل المصروفات' : 'Removed from expenses', 'success');
      } else {
        await window.linkDocExpense(doc.id, window.TRIP?.id);
        window.toast?.(window.isRTL ? 'تم إدراج التكلفة في سجل المصروفات' : 'Added to expenses', 'success');
      }
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
    finally { setLinking(false); }
  };

  const deleteDoc = async () => {
    if (!confirm(window.isRTL ? 'هل أنت متأكد من حذف هذا المستند نهائياً؟' : 'Delete this document?')) return;
    try {
      // If linked to an expense, drop the expense too so we don't orphan it.
      if (doc.linkedExpenseId) {
        try { await window.unlinkDocExpense(doc.id, window.TRIP?.id); } catch (_) {}
      }
      await window.deleteDocument(doc.id, window.TRIP?.id, doc.title);
      await window.loadDocuments(window.TRIP?.id);
      back();
    } catch (err) { window.toast?.(err.message || 'Delete failed', 'error'); }
  };

  const hasFile  = !!doc.filePath;
  const hasSec   = !!doc.secondaryFilePath;
  const hasCover = !!doc.coverUrl;
  const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
  const catLabel = CAT_T[doc.category] ? t(CAT_T[doc.category]) : (category?.label || doc.category);
  const summary = window.fmtDocSummary(doc);

  return (
    <div data-screen-label={`Vault · ${doc.title}`} style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 140,
    }}>
      {/* ── COVER / HEADER ─────────────────────────────────── */}
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
          }}>{schema.emoji}</div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))',
        }} />

        {/* Top buttons */}
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

          {editing ? (
            <button onClick={saveEdits} disabled={saving} className="glass" style={{
              padding: '8px 14px', borderRadius: 999, color: '#fff',
              background: 'var(--clay)', fontSize: 12.5, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
            }}>
              {saving
                ? <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
                : <IconCheck size={13} stroke="#fff" />}
              {window.isRTL ? 'حفظ التعديلات' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="glass" style={{
              width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center',
              color: '#fff', background: 'rgba(0,0,0,0.38)',
            }}><IconEdit size={16} stroke="#fff" /></button>
          )}
        </div>

        {/* Cover edit chip (in edit mode only) */}
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
              {uploadingCov ? '…' : (hasCover ? (window.isRTL ? 'تغيير الصورة' : 'Change') : (window.isRTL ? 'إضافة غلاف' : 'Add cover'))}
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

      {/* ── TITLE + SUMMARY CARD ───────────────────────────── */}
      <div style={{
        margin: '-26px 14px 0', position: 'relative', zIndex: 4,
        background: 'var(--cream-2)', borderRadius: 22,
        padding: '16px 18px', boxShadow: 'var(--shadow-md)',
        border: '0.5px solid var(--hairline)',
      }}>
        {editing ? (
          // Edit input shares the read-mode .serif class (Geist semibold via
          // v63 tokens) instead of inline var(--serif) which mapped to the
          // Cormorant wordmark font. Same visual field, same font in both
          // modes -- "what I see is what I save."
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus
            className="serif" style={{
            width: '100%', boxSizing: 'border-box',
            fontSize: 22, lineHeight: 1.2,
            color: 'var(--ink)',
            border: 0, outline: 'none', background: 'transparent',
            borderBottom: '1.5px dashed var(--clay)', padding: '2px 0',
          }} />
        ) : (
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, color: 'var(--ink)' }}>
            {doc.title}
          </div>
        )}
        {!editing && summary && (
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
            {summary}
          </div>
        )}
      </div>

      {/* ── EDIT MODE: structured fields ─────────────────────── */}
      {editing && (
        <div style={{ padding: '18px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'البيانات والتفاصيل' : 'Details'}</SectionLabel>
          <div style={{ padding: '0 8px' }}>
            {/* Category switcher first */}
            <div style={{ marginBottom: 12 }}>
              <div style={editLabelStyle}>{window.isRTL ? 'الفئة' : 'Category'}</div>
              <select value={cat} onChange={(e) => setCat(e.target.value)} style={{
                ...window.docFieldStyle, fontSize: 14, padding: '11px 13px',
              }}>
                {(window.DOC_CATEGORIES || []).map((c) => {
                  const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
                  return <option key={c.key} value={c.key}>{label}</option>;
                })}
              </select>
            </div>

            {/* Category fields */}
            {schema.fields.length > 0 && (
              <window.DocFieldGrid fields={schema.fields} values={details} onChange={setDetails} />
            )}

            {/* Cost (only on cost-enabled categories) */}
            {schema.showCost && (
              <div style={{ marginTop: 14 }}>
                <div style={editLabelStyle}>{window.isRTL ? 'تفاصيل التكلفة' : 'Cost'}</div>
                <div style={{ display: 'flex', gap: 8, flexDirection: 'row' }}>
                  <input type="number" inputMode="decimal" value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0"
                    style={{ ...window.docFieldStyle, fontSize: 14, padding: '11px 13px', flex: 1 }} />
                  <select value={costCur} onChange={(e) => setCostCur(e.target.value)} style={{
                    ...window.docFieldStyle, fontSize: 14, padding: '11px 13px',
                    width: 'auto', minWidth: 80, fontFamily: 'var(--mono)',
                  }}>
                    {[window.TRIP?.localCurrency || 'USD', window.TRIP?.homeCurrency || 'USD', 'USD', 'SAR', 'AED', 'EUR']
                      .filter((v, i, a) => v && a.indexOf(v) === i)
                      .map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── READ MODE: structured field list + cost/expense ─── */}
      {!editing && schema.fields.length > 0 && (
        <div style={{ padding: '18px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'البيانات والتفاصيل' : 'Details'}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 18,
            margin: '0 8px', overflow: 'hidden',
            border: '0.5px solid var(--hairline)',
          }}>
            {schema.fields.map((f, i) => {
              const raw = (details || {})[f.key];
              if (!raw) return null;
              const v = f.type === 'datetime' ? fmtDateTime(raw)
                      : f.type === 'date'     ? fmtDateOnly(raw)
                      : raw;
              const isLink = f.type === 'url';
              return (
                <DocInfoRow key={f.key}
                  label={f.label()}
                  value={v}
                  href={isLink ? raw : undefined}
                  last={false} />
              );
            }).filter(Boolean).map((node, i, arr) =>
              i === arr.length - 1 ? React.cloneElement(node, { last: true }) : node
            )}
          </div>
        </div>
      )}

      {/* ── COST + EXPENSE TOGGLE (read mode) ─────────────────── */}
      {!editing && schema.showCost && doc.costUSD != null && (
        <div style={{ padding: '16px 14px 0' }}>
          <SectionLabel>{window.isRTL ? 'تفاصيل التكلفة' : 'Cost'}</SectionLabel>
          <div style={{
            margin: '0 8px', padding: '14px 16px',
            background: 'var(--cream-2)', borderRadius: 18,
            border: '0.5px solid var(--hairline)',
            display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
          }}>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
                {doc.costLocal != null && doc.costCurrency
                  ? `${doc.costCurrency} ${doc.costLocal.toLocaleString()}`
                  : `$${doc.costUSD.toLocaleString()}`}
              </div>
              {doc.linkedExpenseId ? (
                <div style={{
                  fontSize: 11, color: 'var(--moss)', marginTop: 3,
                  display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row',
                }}>
                  <IconCheck size={11} stroke="currentColor" />
                  {window.isRTL ? 'مُدرج في قائمة المصروفات' : 'Logged in expenses'}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>
                  {window.isRTL ? 'غير مدرج في ميزانية الرحلة' : 'Not in the trip budget'}
                </div>
              )}
            </div>
            <button onClick={toggleExpense} disabled={linking || doc.costUSD == null} style={{
              padding: '9px 14px', borderRadius: 12,
              background: doc.linkedExpenseId ? 'var(--cream)' : 'var(--ink)',
              color: doc.linkedExpenseId ? 'var(--ink)' : 'var(--cream)',
              border: doc.linkedExpenseId ? '0.5px solid var(--hairline)' : 'none',
              fontSize: 12.5, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row',
            }}>
              {linking ? '…'
                : (doc.linkedExpenseId
                    ? (window.isRTL ? 'استبعاد من المصروفات' : 'Remove')
                    : (window.isRTL ? 'إدراج في المصروفات' : 'Add to expenses'))}
            </button>
          </div>
        </div>
      )}

      {/* ── FILES SECTION ──────────────────────────────────────
         Primary + (if category has it) secondary file. Each shows
         open/replace/remove inline. */}
      <div style={{ padding: '18px 14px 0' }}>
        <SectionLabel>{window.isRTL ? 'الملفات المرفقة' : 'Files'}</SectionLabel>
        <div style={{
          margin: '0 8px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <FileRow
            label={schema.primaryFileLabel()}
            file={hasFile ? { name: window.isRTL ? 'ملف مرفوع' : 'Uploaded', size: doc.size, url: doc.link } : null}
            tint={tintFill}
            uploading={uploading}
            onPick={() => fileRef.current?.click()}
            onRemove={removePrimary}
          />
          <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) replacePrimary(e.target.files[0]); e.target.value = ''; }} />

          {schema.secondaryFile && (
            <>
              <FileRow
                label={schema.secondaryFile.label()}
                file={hasSec ? { name: window.isRTL ? 'ملف مرفوع' : 'Uploaded', size: null, url: doc.secondaryLink } : null}
                tint={tintFill}
                uploading={uploadingSec}
                onPick={() => secondaryRef.current?.click()}
                onRemove={removeSecondary}
              />
              <input ref={secondaryRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
                onChange={(e) => { if (e.target.files[0]) replaceSecondary(e.target.files[0]); e.target.value = ''; }} />
            </>
          )}
        </div>
      </div>

      {/* ── DELETE — only inside edit mode, at the end of the form ── */}
      {editing && (
        <div style={{ padding: '20px 14px 0' }}>
          <button onClick={deleteDoc} style={{
            width: '100%', margin: '0 8px', boxSizing: 'border-box',
            padding: '14px', borderRadius: 16,
            background: 'transparent', color: 'var(--clay-deep)',
            border: '0.5px solid var(--hairline)',
            fontSize: 13.5, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            flexDirection: 'row',
          }}>
            <IconTrash size={14} stroke="currentColor" />
            {window.isRTL ? 'حذف المستند بالكامل' : 'Delete document'}
          </button>
        </div>
      )}

      {/* Image cropper modal */}
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

// ── Read-only row, like InfoRow but value can be a clickable link. ──
function DocInfoRow({ label, value, href, last }) {
  const content = href ? (
    <a href={href} target="_blank" rel="noreferrer" style={{
      color: 'var(--clay-deep)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: 'row',
    }}>
      <IconLink size={12} stroke="currentColor" />
      {window.isRTL ? 'الانتقال للرابط' : 'Open'}
    </a>
  ) : (
    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{value}</div>
  );
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', flexDirection: 'row',
      borderBottom: last ? 'none' : '0.5px solid var(--hairline)',
    }}>
      {/* Was uppercase mono tracked 11px — the eyebrow pattern repeated
         across every structured field row (flight docs show 6-8 of these
         stacked). Now sentence-case sans, fixed-width to keep the
         label/value columns aligned across rows. */}
      <div style={{
        flex: '0 0 auto', minWidth: 110,
        fontSize: 12.5, fontWeight: 500,
        color: 'var(--ink-mute)',
        textAlign: 'start',
      }}>{label}</div>
      <div style={{ flex: 1, textAlign: 'end' }}>{content}</div>
    </div>
  );
}

// ── File row: shows name + size + open/replace/remove. ──
function FileRow({ label, file, tint, uploading, onPick, onRemove }) {
  return (
    <div style={{
      background: 'var(--cream-2)', borderRadius: 16,
      padding: '12px 14px',
      border: '0.5px solid var(--hairline)',
      display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 11, background: tint,
        color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <IconDoc size={18} stroke="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{label}</div>
        <div style={{
          fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {file ? (file.size ? `${file.name} · ${file.size}` : file.name) : (window.isRTL ? 'لا يوجد ملف مرفق حتى الآن' : 'No file yet')}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexDirection: 'row', flexShrink: 0 }}>
        {file && file.url && (
          <a href={file.url} target="_blank" rel="noreferrer" style={{
            padding: '7px 10px', borderRadius: 10,
            background: 'var(--ink)', color: 'var(--cream)',
            fontSize: 11.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 4, flexDirection: 'row',
            textDecoration: 'none',
          }}>
            <IconDoc size={11} stroke="currentColor" />
            {window.isRTL ? 'فتح الملف' : 'Open'}
          </a>
        )}
        <button onClick={onPick} disabled={uploading} style={{
          padding: '7px 10px', borderRadius: 10,
          background: 'var(--cream)', color: 'var(--ink-soft)',
          border: '0.5px solid var(--hairline)',
          fontSize: 11.5, fontWeight: 500,
        }}>
          {uploading ? '…' : (file ? (window.isRTL ? 'استبدال الملف' : 'Replace') : (window.isRTL ? 'رفع ملف جديد' : 'Upload'))}
        </button>
        {file && (
          <button onClick={onRemove} aria-label={window.isRTL ? 'إزالة' : 'Remove'} style={{
            padding: '7px', borderRadius: 10,
            background: 'transparent', color: 'var(--clay-deep)',
            border: '0.5px solid var(--hairline)',
            display: 'grid', placeItems: 'center',
          }}><window.IconClose size={12} stroke="currentColor" /></button>
        )}
      </div>
    </div>
  );
}

function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString(window.isRTL ? 'ar' : 'en', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}
function fmtDateOnly(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(window.isRTL ? 'ar' : 'en', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

window.ScreenDocDetail = ScreenDocDetail;
