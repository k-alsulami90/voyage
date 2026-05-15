// Document detail subpage — shows full details, links, photos. Upload/file is optional.

function ScreenDocDetail({ doc, category, go, back, openSheet }) {
  const [editing, setEditing] = React.useState(false);
  const [localLink, setLocalLink] = React.useState(doc?.link || '');
  const [linkEditing, setLinkEditing] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState(null);
  const fileInputRef = React.useRef(null);
  if (!doc) return null;

  const handleFileUpload = async (file) => {
    if (!file || !window.TRIP?.id) return;
    setUploading(true);
    setUploadErr(null);
    try {
      const url = await window.uploadDocumentFile(doc.id, window.TRIP.id, file);
      setLocalLink(url);
      await window.loadDocuments(window.TRIP.id);
    } catch (err) {
      setUploadErr(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const tintFill = {
    indigo: 'var(--indigo)', moss: 'var(--moss)', clay: 'var(--clay)', honey: 'var(--honey)',
  }[doc.tint] || 'var(--clay)';

  const hasPhotos = doc.photos && doc.photos.length > 0;
  const hasLink = localLink && localLink.trim().length > 0;

  return (
    <div data-screen-label={`03 Vault · ${doc.title}`} style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 120,
    }}>
      {/* HEADER — translucent over preview */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
      }}>
        <button onClick={back} className="glass" style={{
          width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center',
          color: '#fff', background: 'rgba(0,0,0,0.32)',
        }}><span className="icon-flip"><IconBack size={17} stroke="#fff" /></span></button>
        <div className="glass" style={{
          padding: '5px 12px', borderRadius: 999, color: '#fff',
          background: 'rgba(0,0,0,0.32)', fontSize: 11, fontWeight: 500, letterSpacing: 0.04,
        }}>{category?.label || 'Vault'}</div>
        <button onClick={() => setEditing(!editing)} className="glass" style={{
          width: 36, height: 36, borderRadius: 999, display: 'grid', placeItems: 'center',
          color: '#fff', background: editing ? 'var(--clay)' : 'rgba(0,0,0,0.32)',
        }}>{editing ? <IconCheck size={15} stroke="#fff" /> : <IconEdit size={16} stroke="#fff" />}</button>
      </div>

      {/* PREVIEW PANE */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <TintCard tint={doc.tint}>
          <div style={{
            position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
            width: 200, height: 250, borderRadius: 8,
            background: '#fff', boxShadow: '0 24px 50px -10px rgba(0,0,0,0.45)',
            padding: '16px 14px',
          }}>
            {doc.kind === 'pdf' && (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingBottom: 10, borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}>
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: 12, color: 'var(--ink)',
                    fontWeight: 600, letterSpacing: '-0.01em',
                  }}>{doc.title.split(/[·—]/)[0].trim()}</div>
                  <div style={{
                    padding: '2px 6px', borderRadius: 4, background: tintFill,
                    color: '#fff', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em',
                  }}>PDF</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  {[100, 92, 78, 95, 88, 70, 55, 90].map((w, i) => (
                    <div key={i} style={{
                      height: 3, marginBottom: 6, borderRadius: 2,
                      background: 'rgba(0,0,0,0.10)', width: `${w}%`,
                    }} />
                  ))}
                </div>
                <div style={{
                  marginTop: 12, padding: 8, borderRadius: 6,
                  background: 'rgba(0,0,0,0.04)', display: 'flex', gap: 6, alignItems: 'center',
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: tintFill, opacity: 0.7 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 4, background: 'rgba(0,0,0,0.12)', borderRadius: 2, width: '60%' }} />
                    <div style={{ height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 2, marginTop: 3, width: '40%' }} />
                  </div>
                </div>
              </>
            )}
            {doc.kind === 'img' && (
              <div style={{
                width: '100%', height: '100%', borderRadius: 4,
                background: `linear-gradient(155deg, oklch(0.72 0.08 60) 0%, oklch(0.42 0.10 30) 100%)`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 28, left: 28, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
                  background: 'rgba(255,255,255,0.35)',
                  clipPath: 'polygon(0 100%, 22% 40%, 45% 70%, 70% 25%, 100% 65%, 100% 100%)',
                }} />
              </div>
            )}
          </div>
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6,
          }}>
            {[0,1,2,3].map((i) => (
              <div key={i} style={{
                width: i === 0 ? 16 : 6, height: 6, borderRadius: 999,
                background: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
              }} />
            ))}
          </div>
        </TintCard>
      </div>

      {/* TITLE + META CARD */}
      <div style={{
        margin: '-22px 14px 0', position: 'relative', zIndex: 4,
        background: 'var(--cream-2)', borderRadius: 24,
        padding: '18px 20px', boxShadow: 'var(--shadow-md)',
        border: '0.5px solid var(--hairline)',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          color: tintFill, fontWeight: 600,
        }}>{category?.label.toUpperCase() || 'DOCUMENT'} · {doc.kind.toUpperCase()}</div>
        {editing ? (
          <input defaultValue={doc.title} autoFocus style={{
            marginTop: 4, fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1.1,
            color: 'var(--ink)', letterSpacing: '-0.01em', width: '100%',
            border: 0, outline: 'none', background: 'transparent',
            borderBottom: '1.5px dashed var(--clay)',
          }} />
        ) : (
          <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>
            {doc.title}
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>{doc.sub}</div>

        {/* Stat row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          marginTop: 14, paddingTop: 14, borderTop: '0.5px solid var(--hairline)',
        }}>
          {[
            { l: t('sizeLbl'),   v: doc.size },
            { l: t('pagesLbl'),  v: doc.kind === 'pdf' ? '—' : '1' },
            { l: t('syncedLbl'), v: doc.filePath ? (window.isRTL ? 'متزامن' : 'synced') : (window.isRTL ? 'لا يوجد' : 'no file') },
          ].map((s, i) => (
            <div key={i} style={{
              padding: i === 1 ? '0 14px' : '0',
              borderLeft: i ? '0.5px solid var(--hairline)' : 'none',
              textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
            }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: '0.12em', color: 'var(--ink-mute)' }}>
                {s.l.toUpperCase()}
              </div>
              <div className="mono" style={{ fontSize: 14, marginTop: 2, color: 'var(--ink)', fontWeight: 500 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILS — editable fields (primary) */}
      <div style={{ padding: '20px 14px 0' }}>
        <SectionLabel>{t('details')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22,
          margin: '0 8px', overflow: 'hidden',
          border: '0.5px solid var(--hairline)',
        }}>
          {detailFields(doc, category).map((f, i, arr) => (
            <DetailRow key={i} {...f} editing={editing} last={i === arr.length - 1} />
          ))}
        </div>
      </div>

      {/* LINK — location, booking, or reference URL */}
      <div style={{ padding: '20px 14px 0' }}>
        <SectionLabel>{t('link')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22,
          margin: '0 8px', border: '0.5px solid var(--hairline)',
          overflow: 'hidden',
        }}>
          {(hasLink && !linkEditing) ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: tintFill,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}><IconLink size={16} stroke="#fff" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                  {doc.linkLabel || 'LINK'}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 500, color: tintFill,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{localLink}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
                <button onClick={() => setLinkEditing(true)} style={{
                  padding: '6px 10px', borderRadius: 10, background: 'var(--cream)',
                  border: '0.5px solid var(--hairline)', fontSize: 11.5, color: 'var(--ink-soft)',
                }}>{t('edit')}</button>
                <a href={localLink} target="_blank" rel="noreferrer" style={{
                  padding: '6px 12px', borderRadius: 10, background: 'var(--ink)',
                  color: 'var(--cream)', fontSize: 11.5, fontWeight: 500,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>{t('open')}</a>
              </div>
            </div>
          ) : linkEditing ? (
            <div style={{ padding: '14px 16px', display: 'flex', gap: 8, alignItems: 'center', flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
              <input
                value={localLink}
                onChange={(e) => setLocalLink(e.target.value)}
                placeholder={t('linkPlaceholder')}
                autoFocus
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 12,
                  border: '1px solid var(--clay)', background: 'var(--cream)',
                  fontSize: 13, outline: 'none', fontFamily: 'var(--mono)', color: 'var(--ink)',
                }}
              />
              <button onClick={() => setLinkEditing(false)} style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'var(--ink)', color: 'var(--cream)', fontSize: 12.5, fontWeight: 500,
              }}>{t('save')}</button>
            </div>
          ) : (
            <button onClick={() => setLinkEditing(true)} style={{
              width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--ink-mute)', flexDirection: window.isRTL ? 'row-reverse' : 'row',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--cream)',
                display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
                flexShrink: 0,
              }}><IconLink size={16} stroke="var(--ink-soft)" /></div>
              <div style={{ textAlign: window.isRTL ? 'right' : 'left' }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)' }}>{t('addLink')}</div>
                <div style={{ fontSize: 11, marginTop: 1 }}>{t('linkHint')}</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* PHOTOS */}
      <div style={{ padding: '20px 14px 0' }}>
        <SectionLabel>{t('photos')}</SectionLabel>
        <div style={{ padding: '0 8px' }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', flexDirection: window.isRTL ? 'row-reverse' : 'row' }} className="no-scrollbar">
            {hasPhotos && (
              <div style={{
                flexShrink: 0, width: 120, height: 120, borderRadius: 16, overflow: 'hidden',
                position: 'relative',
              }}>
                <TintCard tint={doc.tint}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 6px, transparent 6px 12px)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    padding: '3px 7px', borderRadius: 6,
                    background: 'rgba(0,0,0,0.4)', color: '#fff',
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em',
                    backdropFilter: 'blur(4px)',
                  }}>JPG</div>
                </TintCard>
              </div>
            )}
            {/* Add photo button */}
            <label style={{
              flexShrink: 0, width: 120, height: 120, borderRadius: 16,
              border: '1.5px dashed var(--sand-deep)', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              color: 'var(--ink-mute)', cursor: 'pointer',
            }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                if (e.target.files[0]) console.log('Photo selected:', e.target.files[0].name);
              }} />
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--cream-2)',
                display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
              }}><IconPlus size={16} stroke="var(--ink-soft)" /></div>
              <div style={{ fontSize: 11, fontWeight: 500 }}>{t('addPhoto')}</div>
            </label>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div style={{ padding: '22px 14px 0' }}>
        <SectionLabel>{t('activity')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22,
          margin: '0 8px', padding: '12px 16px',
          border: '0.5px solid var(--hairline)',
        }}>
          {(window.AUDIT || []).filter((a) => a.target === doc.title).slice(0, 5).map((a, i, arr) => {
            const m = window.MEMBERS.find((x) => x.id === a.who) || { name: '—', hue: 200, initials: '?' };
            return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                flexDirection: window.isRTL ? 'row-reverse' : 'row',
                borderTop: i ? '0.5px solid var(--hairline)' : 'none',
              }}>
                <Avatar m={m} size={22} />
                <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                  <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{m.name.split(' ')[0]}</span> {a.action}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{a.when}</div>
              </div>
            );
          })}
          {((window.AUDIT || []).filter((a) => a.target === doc.title).length === 0) && (
            <div style={{ padding: '12px 0', fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center' }}>
              {window.isRTL ? 'لا يوجد نشاط بعد' : 'No activity yet'}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom) + 78px)',
        left: 14, right: 14, zIndex: 49,
        display: 'flex', gap: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row',
        padding: 6, borderRadius: 22,
        background: 'rgba(255,251,244,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid var(--hairline-2)',
        boxShadow: '0 12px 30px rgba(34,28,22,0.18)',
        overflow: 'visible',
      }}>
        <button onClick={() => setEditing(true)} style={{
          flex: 1, padding: '11px', borderRadius: 16,
          background: 'var(--cream)', border: '0.5px solid var(--hairline)',
          fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
        }}>
          <IconEdit size={14} stroke="currentColor" /> {t('edit')}
        </button>
        <button onClick={() => openSheet?.('share')} style={{
          flex: 1, padding: '11px', borderRadius: 16,
          background: 'var(--cream)', border: '0.5px solid var(--hairline)',
          fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
        }}>
          <IconShare size={14} stroke="currentColor" /> {t('share')}
        </button>
        <label style={{
          flex: 1.4, padding: '11px', borderRadius: 16,
          background: uploading ? 'var(--ink-soft)' : 'var(--ink)', color: 'var(--cream)',
          fontSize: 12.5, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
          boxShadow: '0 6px 14px rgba(34,28,22,0.3)',
        }}>
          <input ref={fileInputRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); }} />
          {uploading
            ? <><div style={{ width:13, height:13, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'appspin 0.8s linear infinite' }} /> Uploading…</>
            : <><IconUpload size={14} stroke="currentColor" /> {doc.filePath ? t('replace') || 'Replace' : t('uploadBtn')}</>
          }
        </label>
        {uploadErr && (
          <div style={{ position:'absolute', bottom:90, left:14, right:14, padding:'8px 14px', borderRadius:10, background:'var(--clay)', color:'#fff', fontSize:12 }}>
            {uploadErr}
          </div>
        )}
      </div>
    </div>
  );
}

function detailFields(doc, category) {
  // Generic fields derived from the actual document — no hardcoded mock data.
  const rtl = window.isRTL;
  return [
    { label: rtl ? 'العنوان' : 'Title',    value: doc.title || '—' },
    { label: rtl ? 'الفئة' : 'Category',   value: category?.label || '—' },
    { label: rtl ? 'النوع' : 'Type',       value: (doc.kind || '').toUpperCase() || '—' },
    { label: rtl ? 'التفاصيل' : 'Details', value: doc.sub || '—' },
    { label: rtl ? 'الحجم' : 'Size',       value: doc.size || '—' },
    { label: rtl ? 'الملف' : 'File',       value: doc.filePath ? (rtl ? 'مرفوع' : 'uploaded') : (rtl ? 'غير مرفوع' : 'not uploaded'), accent: doc.filePath ? 'var(--moss)' : 'var(--clay-deep)' },
  ];
}

function DetailRow({ label, value, mono, accent, editing, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      flexDirection: window.isRTL ? 'row-reverse' : 'row',
      borderBottom: !last ? '0.5px solid var(--hairline)' : 'none',
    }}>
      <div style={{
        fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.06em',
        color: 'var(--ink-mute)', textTransform: 'uppercase', flex: '0 0 90px',
        textAlign: window.isRTL ? 'right' : 'left',
      }}>{label}</div>
      {editing ? (
        <input defaultValue={value} style={{
          flex: 1, fontSize: 13, fontFamily: mono ? 'var(--mono)' : 'var(--sans)',
          color: accent || 'var(--ink)', fontWeight: 500,
          border: 0, outline: 'none', background: 'transparent',
          borderBottom: '1px dashed var(--clay)',
          padding: '2px 0', textAlign: 'right',
        }} />
      ) : (
        <div style={{
          flex: 1, textAlign: window.isRTL ? 'left' : 'right',
          fontSize: 13, fontFamily: mono ? 'var(--mono)' : 'var(--sans)',
          color: accent || 'var(--ink)', fontWeight: 500,
        }}>{value}</div>
      )}
    </div>
  );
}

window.ScreenDocDetail = ScreenDocDetail;
