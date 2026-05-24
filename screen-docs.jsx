// Documents Vault — flat file-manager UI.
// One screen, real metadata, upload-status indicators, no decorative tilt.

function ScreenDocs({ go, openSheet, openDoc, loading }) {
  // All hooks declared at the top — never conditional, never after early returns
  const [view, setView]           = React.useState('grid');    // 'grid' | 'list'
  const [filter, setFilter]       = React.useState('all');     // 'all' | category key
  const [sortBy, setSortBy]       = React.useState('newest');  // 'newest' | 'name' | 'category'
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch]       = React.useState('');

  if (loading) {
    return <div style={{ background: 'var(--cream)', minHeight: '100%' }}><TripSkeleton /></div>;
  }

  // Translate category labels at render time so they follow the current language
  const CAT_KEY_TO_T = {
    flights:   'docFlights',
    lodging:   'docLodging',
    visas:     'docVisas',
    transport: 'docTransport',
  };
  const localizedLabel = (key, fallback) => {
    const tKey = CAT_KEY_TO_T[key];
    return tKey ? t(tKey) : (fallback || key);
  };

  const cats = (window.DOC_CATEGORIES || []).map((c) => ({
    ...c,
    label: localizedLabel(c.key, c.label),
  }));
  const docsByCat = window.DOCS_BY_CAT || {};

  // Flatten + tag with category for filtering/sorting
  const allDocs = cats.flatMap((c) =>
    (docsByCat[c.key] || []).map((d) => ({ ...d, category: c.key, categoryLabel: c.label, tint: d.tint || c.tint }))
  );

  // Filter → search → sort (pure, no mutation)
  const visible = allDocs
    .filter((d) => filter === 'all' || d.category === filter)
    .filter((d) => !search || (d.title || '').toLowerCase().includes(search.toLowerCase()) || (d.sub || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'category') return (a.categoryLabel || '').localeCompare(b.categoryLabel || '');
      return 0; // 'newest' — already created_at desc from loadDocuments
    });

  const totalCount = allDocs.length;
  const filteredCount = visible.length;

  return (
    <div data-screen-label="Vault" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* HEADER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px',
        background: 'linear-gradient(180deg, var(--cream) 90%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        <button onClick={() => go('hub')} style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span></button>

        <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', flex: 1, textAlign: 'center' }}>
          {t('vault')}
        </div>

        <button onClick={() => setShowSearch(!showSearch)} style={{
          width: 36, height: 36, borderRadius: 999,
          background: showSearch ? 'var(--ink)' : 'var(--cream-2)',
          border: '0.5px solid var(--hairline)',
          display: 'grid', placeItems: 'center',
        }}><IconSearch size={15} stroke={showSearch ? 'var(--cream)' : 'var(--ink-soft)'} /></button>
      </div>

      {/* SEARCH BAR */}
      {showSearch && (
        <div style={{ padding: '0 18px 10px' }}>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={window.isRTL ? 'ابحث في المستندات...' : 'Search documents...'}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 12,
              border: '1px solid var(--hairline-2)', background: 'var(--cream-2)',
              color: 'var(--ink)', fontSize: 14, outline: 'none',
              textAlign: 'start',
            }}
          />
        </div>
      )}

      {/* CATEGORY FILTER + VIEW TOGGLE row */}
      <div style={{
        padding: '0 14px 12px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Filter chips */}
        <div className="no-scrollbar" style={{
          display: 'flex', gap: 6, overflowX: 'auto',
          paddingInlineStart: 4, paddingInlineEnd: 4,
        }}>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            {t('all')} · {totalCount}
          </Chip>
          {cats.map((c) => {
            const count = (docsByCat[c.key] || []).length;
            return (
              <Chip key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)}>
                {c.label} · {count}
              </Chip>
            );
          })}
        </div>

        {/* View toggle + sort */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingInlineStart: 4, paddingInlineEnd: 4,
        }}>
          <SortMenu sortBy={sortBy} onChange={setSortBy} />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* EMPTY STATE — no docs at all */}
      {totalCount === 0 && <EmptyVault onAdd={() => openSheet?.('addDoc')} />}

      {/* EMPTY STATE — filter/search returned nothing */}
      {totalCount > 0 && filteredCount === 0 && (
        <div style={{
          padding: '32px 24px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', gap: 10,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--cream-2)',
            display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
          }}><IconSearch size={20} stroke="var(--ink-mute)" /></div>
          <div className="serif" style={{ fontSize: 16, color: 'var(--ink)' }}>
            {window.isRTL ? 'لا توجد نتائج' : 'No matching documents'}
          </div>
          <button onClick={() => { setFilter('all'); setSearch(''); }} style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)', color: 'var(--ink-soft)',
          }}>{window.isRTL ? 'مسح الفلتر' : 'Clear filter'}</button>
        </div>
      )}

      {/* DOCUMENT LIST */}
      {filteredCount > 0 && (view === 'grid' ? (
        <div style={{
          padding: '0 14px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {visible.map((d) => (
            <DocTileGrid key={d.id} doc={d} onOpen={() => openDoc?.(d, cats.find((c) => c.key === d.category))} />
          ))}
          {/* Add tile — fixed dashed slot */}
          <button onClick={() => openSheet?.('addDoc')} style={{
            aspectRatio: '0.78', borderRadius: 16,
            border: '1.5px dashed var(--hairline-2)', background: 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--ink-mute)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--cream-2)',
              display: 'grid', placeItems: 'center', border: '0.5px solid var(--hairline)',
            }}><IconPlus size={18} stroke="var(--ink-soft)" /></div>
            <div style={{ fontSize: 11.5, fontWeight: 500 }}>
              {window.isRTL ? 'إضافة' : 'Add'}
            </div>
          </button>
        </div>
      ) : (
        <div style={{
          padding: '0 14px',
          display: 'flex', flexDirection: 'column', gap: 0,
          background: 'var(--cream-2)', borderRadius: 18,
          margin: '0 14px',
          border: '0.5px solid var(--hairline)', overflow: 'hidden',
        }}>
          {visible.map((d, i) => (
            <window.SwipeRow key={d.id}
              actions={[{ key: 'delete', bg: 'var(--clay)', icon: <window.IconTrash size={18} stroke="#fff" /> }]}
              onAction={async (key) => {
                if (key !== 'delete') return;
                if (!confirm(window.isRTL ? 'حذف هذا المستند؟' : 'Delete this document?')) return;
                try {
                  await window.deleteDocument(d.id, window.TRIP?.id, d.title);
                  await window.loadDocuments(window.TRIP?.id);
                } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
              }}>
              <DocRowList
                doc={d}
                last={i === visible.length - 1}
                onOpen={() => openDoc?.(d, cats.find((c) => c.key === d.category))}
              />
            </window.SwipeRow>
          ))}
        </div>
      ))}

      {/* Floating "Add" FAB when grid has results */}
      {filteredCount > 0 && (
        <button onClick={() => openSheet?.('addDoc')} style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom) + 86px)',
          insetInlineEnd: 22,
          width: 54, height: 54, borderRadius: 999,
          background: 'var(--clay)', color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 12px 24px oklch(0.62 0.13 35 / 0.4)',
          zIndex: 30,
        }}>
          <IconPlus size={24} stroke="#fff" />
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3, gap: 2,
      background: 'var(--cream-2)', borderRadius: 12,
      border: '0.5px solid var(--hairline)',
    }}>
      {[
        { v: 'grid', icon: <GridIcon /> },
        { v: 'list', icon: <ListIcon /> },
      ].map(({ v, icon }) => (
        <button key={v} onClick={() => onChange(v)} style={{
          width: 32, height: 28, borderRadius: 9,
          background: view === v ? 'var(--ink)' : 'transparent',
          color: view === v ? 'var(--cream)' : 'var(--ink-soft)',
          display: 'grid', placeItems: 'center',
        }}>{icon}</button>
      ))}
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" />
    </svg>
  );
}

function SortMenu({ sortBy, onChange }) {
  const [open, setOpen] = React.useState(false);
  const opts = [
    { k: 'newest',   l: window.isRTL ? 'الأحدث' : 'Newest' },
    { k: 'name',     l: window.isRTL ? 'الاسم' : 'Name' },
    { k: 'category', l: window.isRTL ? 'الفئة' : 'Category' },
  ];
  const current = opts.find((o) => o.k === sortBy);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 500,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        color: 'var(--ink-soft)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <IconSwap size={11} stroke="currentColor" />
        {current?.l}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', insetInlineStart: 0, zIndex: 41,
            background: 'var(--cream)', borderRadius: 12, padding: 4, minWidth: 140,
            boxShadow: 'var(--shadow-lg)', border: '0.5px solid var(--hairline)',
          }}>
            {opts.map((o) => (
              <button key={o.k} onClick={() => { onChange(o.k); setOpen(false); }} style={{
                width: '100%', padding: '8px 10px', borderRadius: 8, textAlign: 'start',
                background: o.k === sortBy ? 'var(--sand)' : 'transparent',
                fontSize: 12.5, color: 'var(--ink)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {o.k === sortBy && <IconCheck size={11} stroke="var(--ink)" />}
                <span style={{ flex: 1 }}>{o.l}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Status: 'synced' (uploaded to storage), 'link-only' (external URL, no file), 'pending' (no file yet)
function docStatus(doc) {
  if (doc.filePath) return 'synced';
  if (doc.link)     return 'link';
  return 'pending';
}
function StatusDot({ status }) {
  const map = {
    synced:  { color: 'var(--moss)',     label: window.isRTL ? 'محفوظ' : 'Synced' },
    link:    { color: 'var(--indigo)',   label: window.isRTL ? 'رابط' : 'Link' },
    pending: { color: 'var(--ink-mute)', label: window.isRTL ? 'بانتظار الرفع' : 'No file' },
  };
  const s = map[status];
  return (
    <div title={s.label} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: s.color, flexShrink: 0 }} />
      <span style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
    </div>
  );
}

// Tint → solid color helper (used for the file-kind icon background)
function tintColor(tint) {
  return ({
    indigo: 'var(--indigo)',
    moss:   'var(--moss)',
    clay:   'var(--clay)',
    honey:  'var(--honey)',
  })[tint] || 'var(--clay)';
}

// Grid tile — fixed aspect ratio, no rotation, predictable layout
function DocTileGrid({ doc, onOpen }) {
  const status = docStatus(doc);
  const Icon = doc.kind === 'pdf' ? IconPdf : IconImg;
  const tint = tintColor(doc.tint);
  return (
    <button onClick={onOpen} style={{
      all: 'unset', cursor: 'pointer', display: 'block',
      borderRadius: 16, overflow: 'hidden',
      background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Top: tinted preview area */}
      <div style={{
        aspectRatio: '1.3',
        background: `linear-gradient(155deg, color-mix(in oklch, ${tint} 18%, var(--cream-2)) 0%, color-mix(in oklch, ${tint} 8%, var(--cream-2)) 100%)`,
        position: 'relative', display: 'grid', placeItems: 'center',
        borderBottom: '0.5px solid var(--hairline)',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: tint, display: 'grid', placeItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        }}>
          <Icon size={22} stroke="#fff" />
        </div>
        {/* File kind badge top-end */}
        <div style={{
          position: 'absolute', top: 8, insetInlineEnd: 8,
          padding: '2px 6px', borderRadius: 6,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: '0.06em',
          fontWeight: 600,
        }}>{(doc.kind || 'doc').toUpperCase()}</div>
      </div>

      {/* Bottom: metadata block — fixed height for layout stability */}
      <div style={{ padding: '10px 12px 12px', minHeight: 72 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 500, color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{doc.title || '—'}</div>
        <div style={{
          fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{doc.sub || doc.categoryLabel}</div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 6, gap: 6,
        }}>
          <StatusDot status={status} />
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{doc.size && doc.size !== '--' ? doc.size : ''}</span>
        </div>
      </div>
    </button>
  );
}

// List row — iOS list-cell style; full-width touch target
function DocRowList({ doc, last, onOpen }) {
  const status = docStatus(doc);
  const Icon = doc.kind === 'pdf' ? IconPdf : IconImg;
  const tint = tintColor(doc.tint);
  return (
    <button onClick={onOpen} style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : '0.5px solid var(--hairline)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: tint, color: '#fff',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      }}>
        <Icon size={18} stroke="#fff" />
      </div>

      <div style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: 'var(--ink)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{doc.title || '—'}</div>
        <div style={{
          fontSize: 11, color: 'var(--ink-mute)', marginTop: 2,
          display: 'flex', alignItems: 'center', gap: 6,
          overflow: 'hidden',
        }}>
          <span style={{
            padding: '1px 6px', borderRadius: 4,
            background: 'var(--sand)', color: 'var(--ink-soft)',
            fontSize: 9.5, fontFamily: 'var(--mono)', letterSpacing: '0.06em',
            textTransform: 'uppercase', flexShrink: 0,
          }}>{doc.categoryLabel}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.sub || doc.size}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        <StatusDot status={status} />
        {doc.size && doc.size !== '--' && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{doc.size}</span>
        )}
      </div>

      <IconChevron size={14} stroke="var(--ink-mute)" />
    </button>
  );
}

// Empty state — no docs uploaded yet
function EmptyVault({ onAdd }) {
  return (
    <div style={{
      padding: '60px 24px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center', gap: 14,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        display: 'grid', placeItems: 'center', position: 'relative',
      }}>
        <IconDoc size={32} stroke="var(--ink-mute)" />
      </div>
      <div className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>
        {window.isRTL ? 'مستوداع المستندات فارغ' : 'Your vault is empty'}
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-mute)', maxWidth: 250, lineHeight: 1.5 }}>
        {window.isRTL
          ? 'احفظ تذاكر السفر، التأشيرات، حجوزات الفندق وكل ما يخص رحلتك في مكان واحد آمن'
          : 'Keep tickets, visas, hotel bookings — everything for your trip in one safe place.'}
      </div>
      <button onClick={onAdd} style={{
        marginTop: 6, padding: '12px 22px', borderRadius: 14,
        background: 'var(--ink)', color: 'var(--cream)',
        fontSize: 13.5, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: 'var(--shadow-md)',
      }}>
        <IconUpload size={14} stroke="currentColor" />
        {window.isRTL ? 'إضافة أول مستند' : 'Add your first document'}
      </button>
    </div>
  );
}

window.ScreenDocs = ScreenDocs;
