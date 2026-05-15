// Documents Vault — categorized: Flights / Accommodation / Visas / Local Transport.

function ScreenDocs({ go, openSheet, openDoc, loading }) {
  if (loading) {
    return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  }
  const [cat, setCat] = React.useState(null); // null = category list view, else category key
  const [view, setView] = React.useState('grid');
  const [drag, setDrag] = React.useState(false);

  // Category list view
  if (!cat) {
    return (
      <div data-screen-label="03 Vault — Categories" style={{
        background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
      }}>
        <Header title={t('vault')} onBack={() => go('hub')} action={
          <button
            onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); }}
            onClick={() => openSheet?.('addDoc')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
              padding: '7px 12px', borderRadius: 999,
              background: drag ? 'var(--clay)' : 'var(--ink)',
              color: 'var(--cream)', fontSize: 12, fontWeight: 500,
              transition: 'background 180ms',
            }}>
            <IconUpload size={13} stroke="currentColor" /> {t('add')}
          </button>
        } />

        {/* CATEGORIES — 2-col grid of large tiles with overflowing icons */}
        <div style={{ padding: '4px 22px 0' }}>
          <SectionLabel>{t('piles')}</SectionLabel>
        </div>

        {/* Empty state when no docs in any category */}
        {window.DOC_CATEGORIES.every((c) => (window.DOCS_BY_CAT[c.key] || []).length === 0) && (
          <div style={{
            padding: '32px 24px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: 10,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><IconDoc size={22} stroke="var(--ink-mute)" /></div>
            <div className="serif" style={{ fontSize: 18, color: 'var(--ink)' }}>
              {window.isRTL ? 'لا توجد مستندات بعد' : 'No documents yet'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', maxWidth: 210, lineHeight: 1.5 }}>
              {window.isRTL ? 'اضغط على إضافة لرفع أول مستند' : 'Tap Add to upload your first document'}
            </div>
          </div>
        )}
        <div style={{
          padding: '0 14px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          {window.DOC_CATEGORIES.map((c, i) => (
            <CategoryTile key={c.key} c={c} tilt={[1, -1.5, -1, 2][i] || 0} onOpen={() => setCat(c.key)} />
          ))}
        </div>

        {/* Recent uploads strip */}
        <div style={{ padding: '24px 14px 0' }}>
          <SectionLabel>{t('recentlyShared')}</SectionLabel>
          <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {window.AUDIT.filter((a) => a.action === 'uploaded').map((a) => {
              const m = window.MEMBERS.find((x) => x.id === a.who);
              return (
                <div key={a.id} style={{
                  background: 'var(--cream-2)', borderRadius: 18,
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  flexDirection: window.isRTL ? 'row-reverse' : 'row',
                  border: '0.5px solid var(--hairline)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11,
                    background: 'var(--honey)', color: '#fff',
                    display: 'grid', placeItems: 'center',
                  }}><IconPdf size={18} stroke="#fff" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.target}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1,
                      display: 'flex', alignItems: 'center', gap: 5,
                      flexDirection: window.isRTL ? 'row-reverse' : 'row',
                    }}>
                      <Avatar m={m} size={14} /> {t('uploadedBy')} {m.name.split(' ')[0]} · {a.when}
                    </div>
                  </div>
                  <IconShare size={16} stroke="var(--ink-mute)" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ────── Category detail view ──────
  const category = window.DOC_CATEGORIES.find((c) => c.key === cat);
  const docs = window.DOCS_BY_CAT[cat] || [];
  return (
    <div data-screen-label={`03 Vault · ${category.label}`} style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* Category-tinted hero header — interlocks with title */}
      <div style={{ position: 'relative' }}>
        <div style={{
          height: 170, position: 'relative', overflow: 'hidden',
        }}>
          <TintCard tint={category.tint} />
          <div style={{ position: 'absolute', inset: 0, padding: '54px 18px 14px', color: '#fff' }}>
            <button onClick={() => setCat(null)} className="glass" style={{
              width: 36, height: 36, borderRadius: 999, color: '#fff',
              display: 'grid', placeItems: 'center',
              background: 'rgba(255,255,255,0.18)',
            }}>
              <span className="icon-flip"><IconBack size={17} stroke="#fff" /></span>
            </button>
          </div>
          <div style={{
            position: 'absolute', bottom: 14,
            ...(window.isRTL ? { right: 22 } : { left: 22 }),
            color: '#fff',
            textShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em', opacity: 0.9 }}>
              {docs.length} DOCUMENTS
            </div>
            <div className="serif-italic" style={{ fontSize: 38, lineHeight: 1, marginTop: 2 }}>
              {category.label}
            </div>
          </div>
          <CategoryGlyph kind={category.icon} />
        </div>
      </div>

      {/* View toggle */}
      <div style={{ padding: '16px 14px 12px', display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center', flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
        <Chip active>All · {docs.length}</Chip>
        <div style={{
          display: 'inline-flex', padding: 2, background: 'var(--cream-2)', borderRadius: 999,
          border: '0.5px solid var(--hairline)',
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
        }}>
          {['grid', 'list'].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
              background: view === v ? 'var(--ink)' : 'transparent',
              color: view === v ? 'var(--cream)' : 'var(--ink-soft)',
            }}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ padding: '0 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {docs.map((d, i) => (
            <button key={d.id} onClick={() => openDoc?.(d, category)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
              <DocCard d={d} tilt={i % 3 === 1 ? 2 : (i % 3 === 2 ? -1.5 : 0)} />
            </button>
          ))}
          {/* Add new — dashed tile */}
          <button onClick={() => openSheet?.('addDoc')} style={{
            aspectRatio: '0.82', borderRadius: 20,
            border: '1.5px dashed var(--sand-deep)', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--ink-mute)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center',
            }}><IconPlus size={18} stroke="var(--ink-soft)" /></div>
            <div style={{ fontSize: 11.5, fontWeight: 500 }}>{t('add')} {category.label}</div>
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docs.map((d) => (
            <button key={d.id} onClick={() => openDoc?.(d, category)} style={{
              all: 'unset', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
              background: 'var(--cream-2)', borderRadius: 18,
              border: '0.5px solid var(--hairline)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: `var(--${category.tint === 'indigo' ? 'indigo' : category.tint === 'moss' ? 'moss' : category.tint === 'honey' ? 'honey' : 'clay'})`,
                color: '#fff', display: 'grid', placeItems: 'center',
              }}>{d.kind === 'pdf' ? <IconPdf size={17} stroke="#fff" /> : <IconImg size={17} stroke="#fff" />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{d.sub} · {d.size}</div>
              </div>
              <IconChevron size={14} stroke="var(--ink-mute)" />
            </button>
          ))}
          {/* Add row */}
          <button onClick={() => openSheet?.('addDoc')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            flexDirection: window.isRTL ? 'row-reverse' : 'row',
            borderRadius: 18, border: '1.5px dashed var(--sand-deep)',
            background: 'transparent', color: 'var(--ink-mute)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center',
            }}><IconPlus size={18} stroke="var(--ink-soft)" /></div>
            <div style={{ flex: 1, textAlign: window.isRTL ? 'right' : 'left' }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)' }}>{t('addDocument')}</div>
              <div style={{ fontSize: 11 }}>Drop or browse · auto-sorted</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryTile({ c, tilt, onOpen }) {
  return (
    <button onClick={onOpen} className="lift" style={{
      position: 'relative', height: 160, borderRadius: 22, overflow: 'hidden',
      transform: `rotate(${tilt}deg)`, textAlign: window.isRTL ? 'right' : 'left',
      boxShadow: 'var(--shadow-card)',
    }}>
      <TintCard tint={c.tint} />
      <CategoryGlyph kind={c.icon} />
      <div style={{
        position: 'absolute', inset: 0, padding: 14,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: '#fff',
      }}>
        <div style={{
          alignSelf: window.isRTL ? 'flex-end' : 'flex-start', padding: '3px 8px', borderRadius: 999,
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em',
        }}>{c.count} ITEMS</div>
        <div>
          <div className="serif" style={{ fontSize: 24, lineHeight: 1 }}>{c.label}</div>
          <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>
            {c.key === 'flights' && 'Boarding · seats · loyalty'}
            {c.key === 'lodging' && 'Hotels · ryokan · Airbnb'}
            {c.key === 'visas' && 'Stamps · insurance · vax'}
            {c.key === 'transport' && 'JR Pass · IC card · bullet'}
          </div>
        </div>
      </div>
    </button>
  );
}

// Decorative oversized glyph that bleeds off the tile
function CategoryGlyph({ kind }) {
  const common = { position: 'absolute', right: -28, top: -22, opacity: 0.22, color: '#fff' };
  if (kind === 'plane') return (
    <svg width="180" height="180" viewBox="0 0 24 24" style={common} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16l20-7-7 14-2-6z" />
    </svg>
  );
  if (kind === 'bed') return (
    <svg width="180" height="180" viewBox="0 0 24 24" style={common} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18V8m18 10v-5a3 3 0 00-3-3H3" /><circle cx="8" cy="12" r="2" />
    </svg>
  );
  if (kind === 'stamp') return (
    <svg width="180" height="180" viewBox="0 0 24 24" style={common} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21h14v-3H5zM7 18V12a3 3 0 013-3v-2a2 2 0 014 0v2a3 3 0 013 3v6" />
    </svg>
  );
  if (kind === 'rail') return (
    <svg width="180" height="180" viewBox="0 0 24 24" style={common} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="14" rx="3" /><path d="M6 11h12M8 21l2-3M16 21l-2-3" />
      <circle cx="9" cy="14" r="0.8" fill="currentColor" /><circle cx="15" cy="14" r="0.8" fill="currentColor" />
    </svg>
  );
  return null;
}

function DocCard({ d, tilt = 0 }) {
  return (
    <div className="lift" style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      boxShadow: 'var(--shadow-card)',
      transform: `rotate(${tilt}deg)`, position: 'relative',
    }}>
      <div style={{ position: 'relative', aspectRatio: '0.82' }}>
        <TintCard tint={d.tint}>
          {d.kind === 'pdf' && (
            <>
              <div style={{
                position: 'absolute', inset: '18% 14% 14%',
                background: 'rgba(255,255,255,0.92)', borderRadius: 6,
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)', padding: '14px 10px',
              }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{
                    height: 3, marginBottom: 5, borderRadius: 2,
                    background: 'rgba(0,0,0,0.12)', width: `${100 - i * 7}%`,
                  }} />
                ))}
                <div style={{ height: 18, marginTop: 8, borderRadius: 3, background: 'rgba(0,0,0,0.06)' }} />
              </div>
              <div style={kindBadge}>PDF</div>
            </>
          )}
          {d.kind === 'img' && (
            <>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 6px, transparent 6px 12px)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24, width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} />
              <div style={{
                position: 'absolute', bottom: 14, left: 18, right: 30, height: 30,
                background: 'rgba(255,255,255,0.32)',
                clipPath: 'polygon(0 100%, 30% 30%, 55% 70%, 80% 20%, 100% 60%, 100% 100%)',
              }} />
              <div style={kindBadge}>JPG</div>
            </>
          )}
        </TintCard>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{d.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: window.isRTL ? 'row-reverse' : 'row', marginTop: 3 }}>
          <span style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>{d.sub}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{d.size}</span>
        </div>
      </div>
    </div>
  );
}

const kindBadge = {
  position: 'absolute', top: 10, right: 10,
  padding: '3px 7px', borderRadius: 6,
  background: 'rgba(0,0,0,0.4)', color: '#fff',
  fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em',
  backdropFilter: 'blur(4px)',
};

window.ScreenDocs = ScreenDocs;
