// Document — the pass, opened. The whole ticket sits on top (same colours
// and facts as the pass in the list; nothing below repeats it), then what
// you do with it: open the files, see or mark the payment, edit, delete.
// Edit mode keeps the pass on top as a live preview of the changes.

// Solid colour per category (icon tiles), from the pass gradients.
const DOC_TINT = { flights: '#2b4a8f', lodging: '#c0603f', transport: '#b48a2e', visas: '#2f7656' };

function ScreenDocDetail({ doc: initialDoc, category, go, back, openSheet }) {
  // Re-pull from window.DOCS_BY_CAT so edits show fresh data
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const doc = allDocs.find((d) => d.id === initialDoc?.id) || initialDoc || {};

  // ── Edit state (all hooks before any return) ──────────────
  const [editing,  setEditing]  = React.useState(false);
  const [title,    setTitle]    = React.useState(doc.title || '');
  const [details,  setDetails]  = React.useState(doc.details || {});
  const [cat,      setCat]      = React.useState(doc.category || category?.key || 'flights');
  const [cost,     setCost]     = React.useState(doc.costLocal != null ? String(doc.costLocal) : (doc.costUSD != null ? String(doc.costUSD) : ''));
  // A cost saved without its original currency is a USD amount — edit it as USD.
  const costCurOf = (d) => d.costCurrency || (d.costLocal == null && d.costUSD != null ? 'USD' : (window.TRIP?.localCurrency || 'USD'));
  const [costCur,  setCostCur]  = React.useState(costCurOf(doc));
  const [ownerUserId, setOwnerUserId] = React.useState(doc.ownerUserId || null);
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

  // Reset the form from the saved document (on open, after saves, on cancel)
  const resetForm = () => {
    setTitle(doc.title || '');
    setDetails(doc.details || {});
    setCat(doc.category || category?.key || 'flights');
    setCost(doc.costLocal != null ? String(doc.costLocal) : (doc.costUSD != null ? String(doc.costUSD) : ''));
    setCostCur(costCurOf(doc));
    setOwnerUserId(doc.ownerUserId || null);
  };
  React.useEffect(resetForm, [doc.id, doc.title, doc.category, JSON.stringify(doc.details), doc.costLocal, doc.costUSD, doc.costCurrency, doc.ownerUserId, category?.key]);

  if (!doc.id) return null;

  const ar = window.isRTL;
  const tripId = window.TRIP?.id;

  // ── File operations ───────────────────────────────────────
  const replacePrimary = async (file) => {
    if (!file || !tripId) return;
    setUploading(true);
    try {
      await window.uploadDocumentFile(doc.id, tripId, file);
      await window.loadDocuments(tripId);
      window.toast?.(ar ? 'تم رفع الملف' : 'File uploaded', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };
  const replaceSecondary = async (file) => {
    if (!file || !tripId) return;
    setUploadingSec(true);
    try {
      await window.uploadDocumentSecondaryFile(doc.id, tripId, file);
      await window.loadDocuments(tripId);
      window.toast?.(ar ? 'تم رفع الملف' : 'File uploaded', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Upload failed', 'error');
    } finally { setUploadingSec(false); }
  };
  const replaceCover = async (file) => {
    if (!file || !tripId) return;
    setUploadingCov(true);
    try {
      await window.uploadDocCover(doc.id, tripId, file);
      await window.loadDocuments(tripId);
    } catch (err) {
      window.toast?.(err.message || 'Cover upload failed', 'error');
    } finally { setUploadingCov(false); }
  };
  const removeCover = async () => {
    if (!doc.coverPath) return;
    if (!confirm(ar ? 'تشيل الصورة اللي خلف التذكرة؟' : 'Remove the photo behind the pass?')) return;
    try {
      await window.deleteDocCover(doc.id, doc.coverPath);
      await window.loadDocuments(tripId);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };
  const removePrimary = async () => {
    if (!doc.filePath) return;
    if (!confirm(ar ? 'تشيل هذا الملف؟' : 'Remove this file?')) return;
    try {
      await window.removeDocumentFile(doc.id, doc.filePath);
      await window.loadDocuments(tripId);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };
  const removeSecondary = async () => {
    if (!doc.secondaryFilePath) return;
    if (!confirm(ar ? 'تشيل هذا الملف؟' : 'Remove this file?')) return;
    try {
      await window.removeDocumentSecondaryFile(doc.id, doc.secondaryFilePath);
      await window.loadDocuments(tripId);
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };

  // ── Save edits ─────────────────────────────────────────────
  const editSchema = window.DOC_SCHEMAS[cat] || window.DOC_SCHEMAS.visas;
  const saveEdits = async () => {
    if (!title.trim()) { window.toast?.(ar ? 'اكتب اسم المستند' : 'Title is required', 'error'); return; }
    const rangeErr = window.validateDocRanges?.(editSchema, details);
    if (rangeErr) { window.toast?.(rangeErr, 'error'); return; }
    setSaving(true);
    try {
      const costNum = cost ? parseFloat(cost) : null;
      const costUSD = costNum != null ? window.toUSD(costNum, costCur) : null;
      await window.updateDocument(doc.id, {
        title, category: cat, details,
        costLocal: costNum, costCurrency: cost ? costCur : null,
        costUSD,
        ownerUserId,
        linkUrl: details.location_url || null,
        linkLabel: details.location_url ? (ar ? 'الرابط المرجعي' : 'Location') : null,
      });
      // Shared + cost → general budget; personal or no cost → nothing.
      try { await window.syncDocExpense(doc.id, tripId); } catch (_) {}
      await window.loadDocuments(tripId);
      setEditing(false);
      window.toast?.(ar ? 'تم الحفظ' : 'Saved', 'success');
    } catch (err) {
      window.toast?.(err.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };
  const cancelEdit = () => { resetForm(); setEditing(false); };

  // One tap: paid by me, today. Who/when can be changed in Edit.
  const markPaid = async () => {
    setLinking(true);
    try {
      await window.updateDocument(doc.id, { details: { ...(doc.details || {}), paid: true,
        paid_by: (doc.details || {}).paid_by || window.currentUserId, paid_on: window.localISO() } });
      await window.syncDocExpense(doc.id, tripId);
      await window.loadDocuments(tripId);
      window.toast?.(ar ? 'تم تسجيل الدفع' : 'Marked as paid', 'success');
    } catch (e) { window.toast?.(e.message || 'Failed', 'error'); }
    setLinking(false);
  };

  const deleteDoc = async () => {
    if (!confirm(ar ? 'تحذف هذا المستند نهائياً؟' : 'Delete this document?')) return;
    try {
      // If linked to an expense, drop the expense too so we don't orphan it.
      if (doc.linkedExpenseId) {
        try { await window.unlinkDocExpense(doc.id, tripId); } catch (_) {}
      }
      await window.deleteDocument(doc.id, tripId, doc.title);
      await window.loadDocuments(tripId);
      back();
    } catch (err) { window.toast?.(err.message || 'Delete failed', 'error'); }
  };

  // ── What the screen shows ──────────────────────────────────
  const view = editing ? { ...doc, title, details, category: cat, ownerUserId } : doc;
  const schema = window.DOC_SCHEMAS[doc.category] || window.DOC_SCHEMAS.visas;
  const CAT_T = { flights: 'docFlights', lodging: 'docLodging', visas: 'docVisas', transport: 'docTransport' };
  const catLabel = (k) => (CAT_T[k] ? t(CAT_T[k]) : (category?.label || k));
  const today = window.localISO();
  const nowStr = window.docNowStr ? window.docNowStr() : `${today}T12:00`;
  const tm = window.docTiming ? window.docTiming(view, nowStr, today) : {};
  const x = doc.details || {};
  const tint = DOC_TINT[doc.category] || DOC_TINT.flights;
  const hasFile = !!doc.filePath, hasSec = !!doc.secondaryFilePath, hasCover = !!doc.coverUrl;

  // Quick actions: the files and the place, one tap each
  const fileWord = { flights: ar ? 'التذكرة' : 'Ticket', lodging: ar ? 'الحجز' : 'Booking', transport: ar ? 'الحجز' : 'Booking', visas: ar ? 'التأشيرة' : 'Visa' }[doc.category] || (ar ? 'الملف' : 'File');
  const mapUrl = x.location_url || (x.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.address)}` : null);
  // Files open in the app, from the phone — no signal needed.
  const actions = [
    hasFile ? { key: 'file', onOpen: () => window.openDocFile(doc, 'primary', `${fileWord} · ${doc.title}`), icon: <IconDoc size={19} stroke="currentColor" />, label: fileWord } : null,
    hasSec ? { key: 'sec', onOpen: () => window.openDocFile(doc, 'secondary', `${ar ? 'بطاقة الصعود' : 'Boarding pass'} · ${doc.title}`), icon: <IconQR size={19} stroke="currentColor" />, label: ar ? 'بطاقة الصعود' : 'Boarding pass' } : null,
    mapUrl ? { key: 'map', href: mapUrl, icon: <IconPin size={19} stroke="currentColor" />, label: ar ? 'الموقع' : 'Location' } : null,
  ].filter(Boolean);

  // Files group labels (short)
  const primaryLabel = { flights: ar ? 'التذكرة الإلكترونية' : 'E-ticket', lodging: ar ? 'تأكيد الحجز' : 'Booking confirmation', transport: ar ? 'تأكيد الحجز' : 'Booking confirmation', visas: ar ? 'وثيقة التأشيرة' : 'Visa document' }[doc.category] || (ar ? 'الملف' : 'File');

  // Payment
  const paid = window.isDocPaid?.(doc);
  const nm = (m) => m.id === window.currentUserId ? (ar ? 'أنت' : 'you') : (m.name || '').split(' ')[0];
  const multi = x.payers && typeof x.payers === 'object' && Object.keys(x.payers).length > 1;
  const payer = (window.MEMBERS || []).find((m) => m.id === x.paid_by);
  const payerName = multi
    ? Object.entries(x.payers).map(([id, v]) => {
        const m = (window.MEMBERS || []).find((y) => y.id === id);
        return m ? `${nm(m)} ${(parseFloat(v) || 0).toLocaleString('en-US')}` : null;
      }).filter(Boolean).join(' · ')
    : (payer ? nm(payer) : null);
  const paidOn = x.paid_on ? window.fmtDate(x.paid_on) : null;
  const homeCode = window.TRIP?.homeCurrency || window.USER_DEFAULT_CURRENCY || 'USD';

  const roundBtn = {
    width: 38, height: 38, borderRadius: 999, flexShrink: 0,
    background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
    display: 'grid', placeItems: 'center', color: 'var(--ink)',
  };

  return (
    <div data-screen-label={`Vault · ${doc.title}`} style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 120,
    }}>
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 16px 12px',
        background: 'linear-gradient(180deg, var(--cream) 80%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        <button onClick={editing ? cancelEdit : back} aria-label={editing ? (ar ? 'إلغاء' : 'Cancel') : (ar ? 'رجوع' : 'Back')} style={roundBtn}>
          {editing ? <IconClose size={15} stroke="var(--ink)" /> : <span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span>}
        </button>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {editing ? (ar ? 'تعديل المستند' : 'Edit document') : `${window.DOC_SCHEMAS?.[doc.category]?.emoji || '📄'} ${catLabel(doc.category)}`}
        </div>
        {editing ? (
          <button onClick={saveEdits} disabled={saving} style={{
            minHeight: 38, padding: '0 16px', borderRadius: 999, flexShrink: 0,
            background: 'var(--clay)', color: '#fff', fontSize: 13.5, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {saving
              ? <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
              : <IconCheck size={13} stroke="#fff" />}
            {ar ? 'حفظ' : 'Save'}
          </button>
        ) : (
          <button onClick={() => setEditing(true)} aria-label={ar ? 'تعديل' : 'Edit'} style={roundBtn}>
            <IconEdit size={16} stroke="var(--ink)" />
          </button>
        )}
      </div>

      {/* ── THE PASS ────────────────────────────────────────── */}
      <div style={{ padding: '0 14px' }}>
        <DetailPass doc={view} tm={tm} />
      </div>

      {!editing && (
        <>
          {/* QUICK ACTIONS — open the ticket / boarding pass / map */}
          {actions.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))`, gap: 10, padding: '16px 14px 0' }}>
              {actions.map((a) => {
                const Tag = a.onOpen ? 'button' : 'a';
                const link = a.onOpen ? { type: 'button', onClick: a.onOpen } : { href: a.href, target: '_blank', rel: 'noreferrer' };
                return (
                  <Tag key={a.key} {...link} className="press-soft" style={{
                    minHeight: actions.length === 1 ? 54 : 66, borderRadius: 18, textDecoration: 'none',
                    background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', boxShadow: 'var(--shadow-xs)',
                    display: 'flex', flexDirection: actions.length === 1 ? 'row' : 'column', alignItems: 'center', justifyContent: 'center',
                    gap: actions.length === 1 ? 10 : 5, color: 'var(--ink)', fontSize: actions.length === 1 ? 14.5 : 13, fontWeight: 600,
                    fontFamily: 'inherit', width: '100%', padding: 0,
                  }}>
                    <span style={{ width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: tint, color: '#fff' }}>{a.icon}</span>
                    {a.label}
                  </Tag>
                );
              })}
            </div>
          )}

          {/* FILES */}
          <SetGroup title={ar ? 'الملفات' : 'Files'}>
            <DocFileRow label={primaryLabel} tint={tint} has={hasFile} size={doc.size} href={doc.link}
              busy={uploading} onPick={() => fileRef.current?.click()} onRemove={removePrimary} />
            {schema.secondaryFile && (
              <DocFileRow label={schema.secondaryFile.label()} tint={tint} has={hasSec} href={doc.secondaryLink}
                busy={uploadingSec} onPick={() => secondaryRef.current?.click()} onRemove={removeSecondary} icon={<IconQR size={16} stroke="#fff" />} />
            )}
          </SetGroup>

          {/* A VISA'S FEE — its holder's own expense */}
          {schema.feeIsPersonal && doc.costUSD != null && doc.costUSD > 0 && (
            <SetGroup title={schema.costLabel ? schema.costLabel() : (ar ? 'الرسوم' : 'Fee')}
              footer={doc.linkedExpenseId
                ? (ar ? '🔒 محسوبة لك كمصروف شخصي — تشوفها في «ميزانيتي»، وما تدخل في ميزانية القروب.' : '🔒 Counted as your personal expense — see it in “My budget”.')
                : (ar ? 'تظهر لصاحب التأشيرة في «تكلفة رحلته».' : "Shows in the holder's own trip cost.")}>
              <div style={{ padding: '14px 16px' }}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {window.fmtDocCost ? window.fmtDocCost(doc) : window.fmtMoney(doc.costUSD, { in: 'home' })}
                </div>
                {doc.costCurrency && doc.costCurrency !== homeCode && (
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 1 }}>≈ {window.fmtMoney(doc.costUSD, { in: 'home' })}</div>
                )}
              </div>
            </SetGroup>
          )}

          {/* PAYMENT */}
          {schema.showCost && !schema.feeIsPersonal && doc.costUSD != null && doc.costUSD > 0 && (
            <SetGroup title={ar ? 'الدفع' : 'Payment'}
              footer={doc.ownerUserId
                ? (ar ? '🔒 تكلفتك — تظهر لك في «تكلفة رحلتك» بس' : '🔒 Your cost — only in your trip cost')
                : paid
                  ? (ar ? 'محسوبة في الميزانية العامة للرحلة' : "Counted in the trip's general budget")
                  : (ar ? 'ما تنحسب في الميزانية لين تندفع' : "Not in the budget until it's paid")}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                    {window.fmtDocCost ? window.fmtDocCost(doc) : window.fmtMoney(doc.costUSD, { in: 'home' })}
                  </div>
                  {doc.costCurrency && doc.costCurrency !== homeCode && (
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 1 }}>≈ {window.fmtMoney(doc.costUSD, { in: 'home' })}</div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    {window.HubPill
                      ? <window.HubPill tone={paid ? 'good' : 'warn'}>
                          {paid
                            ? (ar ? `مدفوع${payerName && !doc.ownerUserId ? ` — ${multi ? 'دفعوه' : 'دفعه'} ${payerName}` : ''}${paidOn ? ` · ${paidOn}` : ''}`
                                  : `Paid${payerName && !doc.ownerUserId ? ` by ${payerName}` : ''}${paidOn ? ` · ${paidOn}` : ''}`)
                            : (ar ? 'لم يُدفع بعد' : 'Not paid yet')}
                        </window.HubPill>
                      : null}
                  </div>
                </div>
                {!paid && (
                  <button onClick={markPaid} disabled={linking} style={{
                    minHeight: 42, padding: '0 16px', borderRadius: 14, flexShrink: 0,
                    background: 'var(--ink)', color: 'var(--cream)', fontSize: 13.5, fontWeight: 600,
                  }}>{linking ? '…' : (ar ? 'تم الدفع' : 'Mark paid')}</button>
                )}
              </div>
            </SetGroup>
          )}

          {/* DELETE */}
          <SetGroup>
            <SetRow icon={<IconTrash size={16} stroke="#fff" />} tint={SET_TINT.red}
              label={ar ? 'حذف المستند' : 'Delete document'} danger onClick={deleteDoc} />
          </SetGroup>
        </>
      )}

      {/* ── EDIT FORM ───────────────────────────────────────── */}
      {editing && (
        <>
          <SetGroup title={ar ? 'الاسم' : 'Name'}>
            <div style={{ padding: 14 }}>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder={editSchema.titlePlaceholder?.() || ''} style={{ ...window.docFieldStyle }} />
            </div>
          </SetGroup>

          <SetGroup title={ar ? 'النوع' : 'Type'}>
            <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(window.DOC_CATEGORIES || []).map((c) => {
                const on = cat === c.key;
                return (
                  <button key={c.key} onClick={() => setCat(c.key)} style={{
                    minHeight: 46, borderRadius: 14, padding: '0 12px', textAlign: 'start',
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600,
                    background: on ? (window.DOC_PASS_BG?.[c.key] || 'var(--sel)') : 'var(--cream)',
                    color: on ? '#fff' : 'var(--ink)', border: on ? '0.5px solid transparent' : '0.5px solid var(--hairline)',
                  }}>
                    <span style={{ fontSize: 17 }}>{window.DOC_SCHEMAS?.[c.key]?.emoji}</span>{catLabel(c.key)}
                  </button>
                );
              })}
            </div>
          </SetGroup>

          {editSchema.fields.length > 0 && (
            <SetGroup title={ar ? 'التفاصيل' : 'Details'}>
              <div style={{ padding: 14 }}>
                <window.DocFieldGrid fields={editSchema.fields} values={details} onChange={setDetails} />
              </div>
            </SetGroup>
          )}

          <SetGroup title={ar ? 'لمين؟' : "Who's it for?"}
            footer={ar ? 'المستند الخاص يشوفه صاحبه بس، وتكلفته ما تدخل ميزانية القروب.' : 'A personal document is only visible to its owner and stays out of the group budget.'}>
            <div style={{ padding: 14, display: 'flex', gap: 8 }}>
              {[{ id: window.currentUserId, name: ar ? '🔒 لي أنا' : '🔒 Just me' },
                { id: null, name: ar ? '👥 للجميع' : '👥 Everyone' }].map((o) => {
                const on = ownerUserId === o.id;
                return (
                  <button key={o.id || 'all'} onClick={() => setOwnerUserId(o.id)} style={{
                    flex: 1, minHeight: 44, borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: on ? 'var(--sel)' : 'var(--cream)',
                    color: on ? 'var(--sel-fg)' : 'var(--ink-soft)',
                    border: '0.5px solid var(--hairline-2)', transition: 'all 150ms',
                  }}>{o.name}</button>
                );
              })}
            </div>
          </SetGroup>

          {editSchema.showCost && (
            <SetGroup title={editSchema.costLabel ? editSchema.costLabel() : (ar ? 'التكلفة' : 'Cost')}
              footer={editSchema.feeIsPersonal ? (ar ? '🔒 تنحسب لك كمصروف شخصي في «ميزانيتي».' : '🔒 Counted as your personal expense in “My budget”.') : undefined}>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <window.NumberField value={cost} onChange={setCost} placeholder="0"
                    style={{ ...window.docFieldStyle, flex: 1 }} />
                  <select value={costCur} onChange={(e) => setCostCur(e.target.value)} style={{
                    ...window.docFieldStyle, width: 'auto', minWidth: 88, fontFamily: 'var(--mono)',
                  }}>
                    {window.currencyOptions(window.TRIP?.localCurrency, window.TRIP?.homeCurrency)
                      .map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {parseFloat(cost) > 0 && !editSchema.feeIsPersonal && (
                  <window.PaymentFields details={details} setDetails={setDetails} shared={!ownerUserId} legacyPaid={!!doc.linkedExpenseId} cost={cost} currency={costCur} />
                )}
              </div>
            </SetGroup>
          )}

          <SetGroup title={ar ? 'صورة خلف التذكرة' : 'Photo behind the pass'}>
            <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverToCrop(f); e.target.value = ''; }} />
            <SetRow icon={<IconCamera size={16} stroke="#fff" />} tint={SET_TINT.purple}
              label={hasCover ? (ar ? 'تغيير الصورة' : 'Change photo') : (ar ? 'إضافة صورة' : 'Add a photo')}
              sub={ar ? 'مثلاً صورة الفندق — تطلع خلف التذكرة' : 'e.g. the hotel — shows behind the pass'}
              value={uploadingCov ? '…' : null}
              onClick={() => coverRef.current?.click()} />
            {hasCover && (
              <SetRow icon={<IconTrash size={16} stroke="#fff" />} tint={SET_TINT.red}
                label={ar ? 'إزالة الصورة' : 'Remove photo'} danger onClick={removeCover} />
            )}
          </SetGroup>

          <div style={{ padding: '22px 14px 0', display: 'flex', gap: 8 }}>
            <button onClick={saveEdits} disabled={saving} style={{
              flex: 1, minHeight: 50, borderRadius: 16, fontSize: 15, fontWeight: 700,
              background: 'var(--ink)', color: 'var(--cream)', opacity: saving ? 0.6 : 1,
            }}>{saving ? '…' : (ar ? 'حفظ التعديلات' : 'Save changes')}</button>
            <button onClick={cancelEdit} style={{
              minHeight: 50, padding: '0 20px', borderRadius: 16, fontSize: 15,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
            }}>{ar ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </>
      )}

      {/* hidden file inputs */}
      <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) replacePrimary(e.target.files[0]); e.target.value = ''; }} />
      <input ref={secondaryRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) replaceSecondary(e.target.files[0]); e.target.value = ''; }} />

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

// ── The full pass: header strip, the main fact, a tear line, three fields ──
function DetailPass({ doc, tm }) {
  const ar = window.isRTL;
  const x = doc.details || {};
  const hm = (v) => (v && String(v).length > 11 ? String(v).slice(11, 16) : '');
  const dayOnly = (v) => String(v || '').slice(0, 10);
  const dt = (v) => (v ? [window.fmtDate(dayOnly(v)), hm(v)].filter(Boolean).join(' · ') : '—');
  const kind = window.docKind ? window.docKind(doc) : '';
  const whose = window.docWhose ? window.docWhose(doc) : null;
  const route = doc.category === 'flights' && x.dep_airport && x.arr_airport;
  const pillBg = (window.DOC_PILL_BG || {})[tm.tone] || 'rgba(255,255,255,0.18)';

  let sub = null, fields = [];
  if (doc.category === 'flights') {
    sub = route ? null : (doc.sub || null);
    fields = [
      [ar ? 'التاريخ' : 'Date', x.dep_at ? new Date(dayOnly(x.dep_at) + 'T00:00:00').toLocaleDateString(window._dateLocale(), { weekday: 'long', day: 'numeric', month: 'long' }) : '—'],
      doc.sub ? [ar ? 'الرحلة' : 'Flight', doc.sub] : null,
    ];
  } else if (doc.category === 'lodging') {
    sub = x.address || doc.sub || null;
    const n = x.check_in_at && x.check_out_at
      ? Math.max(1, Math.round((new Date(dayOnly(x.check_out_at)) - new Date(dayOnly(x.check_in_at))) / 86400000)) : 0;
    fields = [
      [ar ? 'الدخول' : 'Check-in', dt(x.check_in_at)],
      [ar ? 'الليالي' : 'Nights', n ? String(n) : '—'],
      [ar ? 'الخروج' : 'Check-out', dt(x.check_out_at)],
    ];
  } else if (doc.category === 'transport') {
    sub = doc.sub || null;
    fields = [
      [ar ? 'الاستلام' : 'Pick-up', dt(x.pickup_at)],
      [ar ? 'التسليم' : 'Drop-off', dt(x.dropoff_at)],
    ];
  } else {
    sub = doc.sub || null;
    fields = [
      [ar ? 'صدرت' : 'Issued', x.issued_on ? window.fmtDate(x.issued_on) : '—'],
      [ar ? 'تنتهي' : 'Expires', x.expires_on ? window.fmtDate(x.expires_on) : '—'],
      [ar ? 'الحالة' : 'Status', tm.pill || '—'],
    ];
  }
  fields = fields.filter(Boolean);
  const notch = { position: 'absolute', top: -11, width: 22, height: 22, borderRadius: 99, background: 'var(--cream)' };
  const code = (v) => String(v).toUpperCase().slice(0, 3);

  return (
    <div className="v-flip-in" style={{
      position: 'relative', borderRadius: 26, overflow: 'hidden', color: '#fff',
      background: doc.coverUrl ? '#1b1f2a' : ((window.DOC_PASS_BG || {})[doc.category] || 'var(--statement)'),
      boxShadow: '0 22px 40px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
    }}>
      {doc.coverUrl && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${doc.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      {doc.coverUrl && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,12,20,0.45) 0%, rgba(10,12,20,0.78) 100%)' }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 42%)', pointerEvents: 'none' }} />

      {/* header strip + the main fact */}
      <div style={{ position: 'relative', padding: '16px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, minWidth: 0 }}>
          <span style={{ flex: 1, minWidth: 0, opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kind}</span>
          {whose && <span style={{ flexShrink: 0, padding: '2px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.16)', fontWeight: 600 }}>{whose}</span>}
          {tm.pill && doc.category !== 'visas' && (
            <span style={{ flexShrink: 0, padding: '2px 9px', borderRadius: 99, background: pillBg, fontWeight: 700 }}>
              {tm.active && tm.stubDate ? `${tm.pill} · ${tm.caption} ${window.fmtDate(dayOnly(tm.stubDate))}` : tm.pill}
            </span>
          )}
        </div>

        {route ? (
          <div dir="ltr" style={{ direction: 'ltr', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{code(x.dep_airport)}</div>
              {hm(x.dep_at) && <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{hm(x.dep_at)}</div>}
              {x.dep_terminal && <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>{ar ? `صالة ${x.dep_terminal}` : `Terminal ${x.dep_terminal}`}</div>}
            </div>
            <div style={{ fontSize: 18, opacity: 0.85, letterSpacing: '-0.05em', paddingBottom: 18 }}>——✈——</div>
            <div style={{ textAlign: 'right', minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{code(x.arr_airport)}</div>
              {hm(x.arr_at) && <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{hm(x.arr_at)}</div>}
              {x.arr_terminal && <div style={{ fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>{ar ? `صالة ${x.arr_terminal}` : `Terminal ${x.arr_terminal}`}</div>}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.01em', overflowWrap: 'anywhere' }}>{doc.title || '—'}</div>
            {sub && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6, lineHeight: 1.45 }}>{sub}</div>}
          </div>
        )}
      </div>

      {/* tear line, with the notches cut from the page colour */}
      <div style={{ position: 'relative', height: 2 }}>
        <span style={{ position: 'absolute', insetInline: 22, top: 0, borderTop: '2px dashed rgba(255,255,255,0.3)' }} />
        <span style={{ ...notch, left: -11 }} />
        <span style={{ ...notch, right: -11 }} />
      </div>

      {/* fields */}
      <div style={{
        position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${fields.length || 1}, minmax(0, 1fr))`,
        gap: 10, padding: '16px 18px 18px',
      }}>
        {fields.map(([l, v], i) => (
          <div key={i} style={{ minWidth: 0, textAlign: fields.length === 3 && i === 1 ? 'center' : (fields.length > 1 && i === fields.length - 1 ? 'end' : 'start') }}>
            <div style={{ fontSize: 11, opacity: 0.72 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── A file in the Files group: replace it, remove it, or upload one.
// (Opening is the quick action above the group, so it isn't offered twice.)
function DocFileRow({ label, tint, has, size, href, busy, onPick, onRemove, icon }) {
  const ar = window.isRTL;
  return (
    <SetRow icon={icon || <IconDoc size={16} stroke="#fff" />} tint={tint} label={label}
      sub={has ? (size && size !== '--' && size !== '...' ? (ar ? `مرفق · ${size}` : `Attached · ${size}`) : (ar ? 'مرفق' : 'Attached')) : (ar ? 'ما فيه ملف بعد' : 'No file yet')}
      right={(
        <span style={{ display: 'inline-flex', gap: 6, flexShrink: 0 }}>
          <button onClick={onPick} disabled={busy} style={{
            minHeight: 34, padding: '0 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
            background: has ? 'var(--cream)' : 'var(--clay)', color: has ? 'var(--ink-soft)' : '#fff',
            border: has ? '0.5px solid var(--hairline-2)' : '0.5px solid transparent',
          }}>{busy ? '…' : (has ? (ar ? 'استبدال' : 'Replace') : (ar ? 'رفع' : 'Upload'))}</button>
          {has && (
            <button onClick={onRemove} aria-label={ar ? 'إزالة' : 'Remove'} style={{
              width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center',
              background: 'transparent', color: 'var(--clay-deep)', border: '0.5px solid var(--hairline-2)',
            }}><IconClose size={12} stroke="currentColor" /></button>
          )}
        </span>
      )} />
  );
}

window.ScreenDocDetail = ScreenDocDetail;
