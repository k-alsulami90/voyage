// Trip-level Settings — now includes Crew (Members) inline.

function ScreenSettings({ go, openSheet }) {
  const trip    = window.TRIP;
  const [members,    setMembers]    = React.useState(window.MEMBERS || []);
  const [coverUrl,   setCoverUrl]   = React.useState(trip?.coverImageUrl || null);
  const [uploading,  setUploading]  = React.useState(false);
  const coverInputRef = React.useRef(null);
  const counts = members.reduce((acc, m) => { acc[m.role] = (acc[m.role] || 0) + 1; return acc; }, {});

  const handleCoverUpload = async (file) => {
    if (!file || !trip?.id) return;
    setUploading(true);
    try {
      const url = await window.uploadTripCover(trip.id, file);
      setCoverUrl(url);
    } catch (err) { window.toast?.(err.message || 'Action failed', 'error'); }
    finally { setUploading(false); }
  };

  if (!trip) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('settings')} onBack={() => go('hub')} />
        <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
          <div className="serif" style={{ fontSize: 18 }}>
            {window.isRTL ? 'الرجاء فتح رحلة أولاً' : 'Open a trip first'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="05 Trip Settings" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
      <Header title={t('settings')} onBack={() => go('hub')} />

      {/* Trip cover */}
      <div style={{ padding: '0 14px' }}>
        <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
        <div style={{
          borderRadius: 26, overflow: 'hidden', position: 'relative',
          boxShadow: 'var(--shadow-card)', height: 170,
        }}>
          {coverUrl ? (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          ) : (
            <KyotoHero />
          )}
          {/* Dim overlay for readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
            <div className="serif" style={{ fontSize: 30, lineHeight: 1.05 }}>{trip.title || 'Trip'}</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{trip.dates || ''}</div>
          </div>
          <button onClick={() => coverInputRef.current?.click()} className="glass" style={{
            position: 'absolute', top: 14,
            insetInlineEnd: 14,
            padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, color: '#fff',
            background: uploading ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {uploading ? (
              <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
            ) : <IconUpload size={12} stroke="#fff" />}
            {uploading ? (window.isRTL ? 'جاري الرفع...' : 'Uploading...') : t('editCover')}
          </button>
        </div>
      </div>

      {/* CREW SECTION — embedded, replaces standalone Members tab */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel action={t('invite')} onAction={() => openSheet('share')}>{t('crewSection')} · {members.length}</SectionLabel>

        {/* Stacked-avatars + role tally — overlapping pill */}
        <div style={{ padding: '0 8px' }}>
          <div style={{
            background: 'var(--statement)', color: 'var(--statement-fg)',
            borderRadius: 24, padding: '16px 18px',
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(70% 60% at 90% 0%, oklch(0.42 0.10 260 / 0.45) 0%, transparent 60%)',
            }} />
            <div style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 14,
              flexDirection: 'row',
            }}>
              <AvatarStack members={members} size={36} />
              <button onClick={() => openSheet('share')} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--cream)', color: 'var(--ink)',
                marginInlineStart: -14, zIndex: 5,
                display: 'grid', placeItems: 'center',
                boxShadow: '0 0 0 2px var(--ink), 0 4px 8px rgba(0,0,0,0.3)',
              }}><IconPlus size={18} /></button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', opacity: 0.72 }}>
                  {t('tripScopedNote')}
                </div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.05, marginTop: 1 }}>
                  {members.length} {t('travelers')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, position: 'relative', flexDirection: 'row' }}>
              {['Admin', 'Editor', 'Viewer'].map((r) => (
                <div key={r} style={{
                  flex: 1, padding: '8px 10px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontSize: 9.5, opacity: 0.72, fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>
                    {r === 'Admin' ? t('admin') : r === 'Editor' ? t('editor') : t('viewer')}
                  </div>
                  <div className="serif" style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>
                    {counts[r] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member rows — compact, swipeable */}
        <div style={{ marginTop: 10, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {members.map((m) => (
            <SwipeRow key={m.id}
              actions={[
                { key: 'remove', bg: 'var(--clay)', icon: <IconTrash size={18} stroke="#fff" /> },
              ]}
              onAction={async (key) => {
                if (key === 'remove' && m.id !== window.currentUserId) {
                  try {
                    await window.removeMember(trip.id, m.id);
                    setMembers(members.filter((x) => x.id !== m.id));
                  } catch (err) { window.toast?.(err.message || 'Action failed', 'error'); }
                }
              }}>
              <div style={{
                background: 'var(--cream-2)', borderRadius: 16,
                padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 11,
                flexDirection: 'row',
                border: '0.5px solid var(--hairline)',
              }}>
                <Avatar m={m} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{m.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>
                    {m.id === window.currentUserId ? (window.isRTL ? 'أنت · المالك' : 'you · owner') : (window.isRTL ? 'عضو في الرحلة' : 'trip member')}
                  </div>
                </div>
                <RoleSelect role={m.role} onChange={async (r) => {
                  setMembers(members.map((x) => x.id === m.id ? { ...x, role: r } : x));
                  try { await window.updateMemberRole(trip.id, m.id, r); } catch (err) { console.error(err); }
                }} />
              </div>
            </SwipeRow>
          ))}
        </div>

        {/* Permission matrix — collapsed under "View permissions" */}
        <details style={{ marginTop: 12, padding: '0 8px' }}>
          <summary style={{
            cursor: 'pointer', listStyle: 'none',
            padding: '12px 14px', borderRadius: 14,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
            display: 'flex', alignItems: 'center', gap: 8,
            flexDirection: 'row',
            fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500,
          }}>
            <IconChevron size={13} stroke="var(--ink-mute)" />
            {t('viewPermissions')}
          </summary>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 16,
            marginTop: 6, padding: '6px 14px',
            border: '0.5px solid var(--hairline)',
          }}>
            {[
              { perm: window.isRTL ? 'عرض الرحلة والمستندات' : 'View trip & docs',    a: true,  e: true,  v: true  },
              { perm: window.isRTL ? 'إضافة مصروفات ومستندات' : 'Add expenses & docs', a: true,  e: true,  v: false },
              { perm: window.isRTL ? 'دعوة أعضاء' : 'Invite members',                  a: true,  e: false, v: false },
              { perm: window.isRTL ? 'تعديل إعدادات الرحلة' : 'Edit trip settings',    a: true,  e: false, v: false },
              { perm: window.isRTL ? 'أرشفة أو حذف' : 'Archive or delete',             a: true,  e: false, v: false },
            ].map((row, i) => (
              <div key={row.perm} style={{
                display: 'grid', gridTemplateColumns: '1fr 30px 30px 30px',
                padding: '9px 0', alignItems: 'center',
                borderTop: i ? '0.5px solid var(--hairline)' : 'none',
              }}>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{row.perm}</div>
                {['a', 'e', 'v'].map((k) => (
                  <div key={k} style={{ display: 'grid', placeItems: 'center' }}>
                    {row[k] ? (
                      <div style={{
                        width: 16, height: 16, borderRadius: 5, background: 'var(--ink)',
                        display: 'grid', placeItems: 'center',
                      }}><IconCheck size={10} stroke="#fff" /></div>
                    ) : (
                      <div style={{
                        width: 16, height: 16, borderRadius: 5,
                        border: '1.5px dashed var(--hairline-2)',
                      }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 30px 30px 30px',
              padding: '7px 0 4px', borderTop: '0.5px solid var(--hairline)',
              fontSize: 9.5, fontFamily: 'var(--mono)', letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase',
            }}>
              <div></div><div style={{ textAlign: 'center' }}>Adm</div>
              <div style={{ textAlign: 'center' }}>Edit</div><div style={{ textAlign: 'center' }}>View</div>
            </div>
          </div>
        </details>
      </div>

      {/* Parameters — now fully editable */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('tripParameters')}</SectionLabel>
        <EditableTripParams trip={trip} />
      </div>

      {/* Notifications */}
      <div style={{ padding: '18px 14px 0' }}>
        <SectionLabel>{t('notifications')}</SectionLabel>
        <ParamGroup items={[
          { icon: <IconBell size={16} stroke="var(--ink)" />,  label: t('newExpenses'), toggle: true, on: true },
          { icon: <IconUsers size={16} stroke="var(--ink)" />, label: t('memberJoins'), toggle: true, on: true },
          { icon: <IconDoc size={16} stroke="var(--ink)" />,   label: t('docUploads'),  toggle: true, on: false, last: true },
        ]} />
      </div>

      {/* Lifecycle */}
      <LifecycleActions />

      <div style={{ textAlign: 'center', padding: '32px 0 20px', color: 'var(--ink-mute)' }}>
        <div className="serif-italic" style={{ fontSize: 18 }}>voyage</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', marginTop: 4 }}>
          TRIP ID · {(trip.id || '').toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function ParamGroup({ items }) {
  return (
    <div style={{
      background: 'var(--cream-2)', borderRadius: 22,
      margin: '0 8px', overflow: 'hidden',
      border: '0.5px solid var(--hairline)',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          flexDirection: 'row',
          padding: '13px 16px',
          borderTop: i ? '0.5px solid var(--hairline)' : 'none',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
            background: 'var(--cream)', border: '0.5px solid var(--hairline)',
          }}>{it.icon}</div>
          <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textAlign: 'start' }}>{it.label}</div>
          {it.toggle ? <Toggle on={it.on} /> :
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
              <span style={{ fontSize: 12.5, color: it.accent ? 'var(--clay-deep)' : 'var(--ink-mute)', fontWeight: it.accent ? 500 : 400 }}>{it.value}</span>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </div>
          }
        </div>
      ))}
    </div>
  );
}

function Toggle({ on: initOn }) {
  const [on, setOn] = React.useState(initOn);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 40, height: 24, borderRadius: 999,
      background: on ? 'var(--ink)' : 'var(--sand-deep)',
      padding: 2, transition: 'background 200ms', position: 'relative',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: on ? `translateX(${window.isRTL ? -16 : 16}px)` : 'translateX(0)',
        transition: 'transform 220ms cubic-bezier(.2,.8,.2,1)',
      }} />
    </button>
  );
}

function ActionRow({ icon, label, sub, labelColor, last, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'start',
      display: 'flex', alignItems: 'center', gap: 12,
      flexDirection: 'row',
      padding: '14px 16px',
      borderTop: !last ? '0.5px solid var(--hairline)' : 'none',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center',
        background: 'var(--cream)', border: '0.5px solid var(--hairline)',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, color: labelColor || 'var(--ink)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>{sub}</div>
      </div>
      <IconChevron size={14} stroke="var(--ink-mute)" />
    </button>
  );
}

function RoleSelect({ role, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}><RoleBadge role={role} /></button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            zIndex: 40,
            background: 'var(--cream)', borderRadius: 14, padding: 6,
            boxShadow: 'var(--shadow-lg)', border: '0.5px solid var(--hairline)',
            display: 'flex', flexDirection: 'column', gap: 2, minWidth: 130,
          }}>
            {['Admin', 'Editor', 'Viewer'].map((r) => (
              <button key={r} onClick={() => { onChange(r); setOpen(false); }} style={{
                padding: '6px 8px', borderRadius: 8, textAlign: 'start',
                background: r === role ? 'var(--sand)' : 'transparent',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5,
                flexDirection: 'row',
              }}>
                <RoleBadge role={r} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LifecycleActions() {
  const [archived, setArchived] = React.useState(window.TRIP?.status === 'past');
  const [exported, setExported] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  return (
    <div style={{ padding: '20px 14px 0' }}>
      <SectionLabel>{t('tripLifecycle')}</SectionLabel>
      <div style={{
        background: 'var(--cream-2)', borderRadius: 22,
        margin: '0 8px', overflow: 'hidden',
        border: '0.5px solid var(--hairline)',
      }}>
        <ActionRow
          icon={<IconArchive size={17} stroke={archived ? 'var(--moss)' : 'var(--ink)'} />}
          label={archived ? t('archived') : t('archiveTrip')}
          labelColor={archived ? 'var(--moss)' : undefined}
          sub={archived ? t('archivedSub') : t('archiveSub')}
          onClick={() => setArchived(!archived)} />
        <ActionRow
          icon={<IconShare size={17} stroke={exported ? 'var(--indigo)' : 'var(--ink)'} />}
          label={exported ? t('pdfReady') : t('exportPDF')}
          labelColor={exported ? 'var(--indigo)' : undefined}
          sub={t('exportSub')}
          onClick={() => setExported(true)} />
        {confirmDelete ? (
          <div style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
            flexDirection: 'row',
            borderTop: '0.5px solid var(--hairline)',
          }}>
            <div style={{ flex: 1, fontSize: 12.5, color: 'var(--clay-deep)', fontWeight: 500 }}>
              {t('areYouSure')}
            </div>
            <button onClick={() => setConfirmDelete(false)} style={{
              padding: '7px 12px', borderRadius: 10, fontSize: 12,
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
            }}>{t('cancel')}</button>
            <button disabled={deleting} onClick={async () => {
              const tripId = window.TRIP?.id;
              if (!tripId) return;
              setDeleting(true);
              try {
                await window.sb.from('trips').delete().eq('id', tripId);
                window.clearAllMockData();
                window.location.reload();
              } catch (err) { console.error(err); setDeleting(false); }
            }} style={{
              padding: '7px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: deleting ? 'var(--ink-mute)' : 'var(--clay)', color: '#fff',
            }}>{deleting ? '...' : t('delete')}</button>
          </div>
        ) : (
          <ActionRow
            icon={<IconTrash size={17} stroke="var(--clay-deep)" />}
            label={t('deleteTrip')} labelColor="var(--clay-deep)"
            sub={t('deleteSub')} last
            onClick={() => setConfirmDelete(true)} />
        )}
      </div>
    </div>
  );
}

// ── Editable trip parameters — tap any row to edit + save to Supabase ──
function EditableTripParams({ trip: tripProp }) {
  const [tick, setTick] = React.useState(0);
  const trip = window.TRIP || tripProp;  // always read latest from window after save
  const [editing, setEditing] = React.useState(null); // 'title' | 'dates' | 'budget' | 'currency' | 'cover'
  const [saving,  setSaving]  = React.useState(false);
  const [err,     setErr]     = React.useState(null);

  // Form state mirrors trip — refreshed when the trip prop changes
  const [title,    setTitle]    = React.useState(trip.title || '');
  const [subtitle, setSubtitle] = React.useState(trip.subtitle || '');
  const [start,    setStart]    = React.useState(trip.startDate || '');
  const [end,      setEnd]      = React.useState(trip.endDate || '');
  // Budget is stored as USD in DB. User edits in any currency they pick.
  const [budgetCur, setBudgetCur] = React.useState(trip.homeCurrency || 'USD');
  const [budgetAmt, setBudgetAmt] = React.useState(() => {
    const usd = trip.budget?.plannedUSD || 0;
    const rate = window.fxRate(trip.homeCurrency || 'USD');
    return usd > 0 ? Math.round(usd * rate) : '';
  });
  const [homeCur,  setHomeCur]  = React.useState(trip.homeCurrency || 'USD');
  const [localCur, setLocalCur] = React.useState(trip.localCurrency || 'USD');
  const [fx,       setFx]       = React.useState(trip.fx || window.FX_RATES[trip.homeCurrency || 'USD'] || 1);
  const [cover,    setCover]    = React.useState(trip.cover || 'kyoto');

  React.useEffect(() => {
    setTitle(trip.title || ''); setSubtitle(trip.subtitle || '');
    setStart(trip.startDate || ''); setEnd(trip.endDate || '');
    const home = trip.homeCurrency || 'USD';
    const rate = window.fxRate(home);
    setBudgetCur(home);
    setBudgetAmt(trip.budget?.plannedUSD > 0 ? Math.round(trip.budget.plannedUSD * rate) : '');
    setHomeCur(home);
    setLocalCur(trip.localCurrency || 'USD');
    setFx(trip.fx || window.FX_RATES[home] || 1);
    setCover(trip.cover || 'kyoto');
  }, [trip.id, trip.budget?.plannedUSD, trip.homeCurrency, trip.localCurrency, trip.fx]);

  const CURRENCIES = ['USD','SAR','EUR','GBP','JPY','AED','EGP','MAD','TRY','INR','CHF'];
  const COVERS = ['kyoto','lisbon','oaxaca','lofoten','patagon'];

  const save = async (fields) => {
    setSaving(true); setErr(null);
    try {
      const { error } = await window.sb.from('trips').update(fields).eq('id', trip.id);
      if (error) throw error;
      await window.loadTripDetail(trip.id);
      setEditing(null);
      setTick((n) => n + 1);
      window.toast?.(window.isRTL ? 'تم الحفظ' : 'Saved', 'success');
    } catch (e) {
      setErr(e.message);
      window.toast?.(e.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: 12,
    flexDirection: 'row',
    padding: '13px 16px', width: '100%', textAlign: 'start',
  };
  const iconBox = {
    width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
    background: 'var(--cream)', border: '0.5px solid var(--hairline)',
  };
  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '0.5px solid var(--hairline-2)', background: 'var(--cream)',
    color: 'var(--ink)', fontSize: 13, outline: 'none',
    textAlign: 'start',
  };

  // Compact row with chevron — tap to expand to edit form
  const Row = ({ icon, label, value, fieldKey, children, last }) => {
    const isOpen = editing === fieldKey;
    return (
      <div style={{ borderTop: fieldKey !== 'title' ? '0.5px solid var(--hairline)' : 'none' }}>
        <button onClick={() => setEditing(isOpen ? null : fieldKey)} style={rowStyle}>
          <div style={iconBox}>{icon}</div>
          <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{value}</span>
            <span style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', display: 'inline-block' }}>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </span>
          </div>
        </button>
        {isOpen && (
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      background: 'var(--cream-2)', borderRadius: 22, margin: '0 8px',
      border: '0.5px solid var(--hairline)', overflow: 'hidden',
    }}>
      {/* Destination (title + subtitle) */}
      <Row icon={<IconCompass size={16} stroke="var(--ink)" />} label={t('destination')}
           value={trip.subtitle || trip.title || '—'} fieldKey="title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={window.isRTL ? 'اسم الرحلة' : 'Trip title'} style={inputStyle} />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={window.isRTL ? 'وصف' : 'Subtitle'} style={inputStyle} />
        <SaveCancelBar saving={saving} onSave={() => save({ title: title.trim(), subtitle: subtitle.trim() || null })} onCancel={() => setEditing(null)} />
      </Row>

      {/* Dates */}
      <Row icon={<IconClock size={16} stroke="var(--ink)" />} label={t('dates')}
           value={trip.dates || '—'} fieldKey="dates">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} />
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ start_date: start, end_date: end })} onCancel={() => setEditing(null)} />
      </Row>

      {/* Budget — pick currency AND amount; we convert to USD on save */}
      <Row icon={<IconWallet size={16} stroke="var(--ink)" />} label={t('budgetCap')}
           value={trip.budget?.plannedUSD ? window.fmtMoney(trip.budget.plannedUSD, { in: 'home' }) : '—'}
           fieldKey="budget">
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {window.isRTL ? 'العملة' : 'Currency'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => {
              // Convert visible amount when switching currency, so the value stays consistent
              const n = parseFloat(budgetAmt) || 0;
              if (n > 0) {
                const usd = n / window.fxRate(budgetCur);
                const newAmt = Math.round(usd * window.fxRate(c) * 100) / 100;
                setBudgetAmt(newAmt);
              }
              setBudgetCur(c);
            }} style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 500,
              background: budgetCur === c ? 'var(--ink)' : 'var(--cream)',
              color: budgetCur === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)',
            }}>{c}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
          {window.isRTL ? `المبلغ (${budgetCur})` : `Amount (${budgetCur})`}
        </div>
        <input type="number" inputMode="decimal" value={budgetAmt}
          onChange={(e) => setBudgetAmt(e.target.value)}
          placeholder="0" style={inputStyle} />
        {parseFloat(budgetAmt) > 0 && (
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {budgetCur !== 'USD' && <span>= {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'USD' })}</span>}
            {budgetCur !== homeCur && <span>≈ {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'home' })}</span>}
            {budgetCur !== localCur && localCur !== homeCur && <span>≈ {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'local' })}</span>}
          </div>
        )}
        <SaveCancelBar saving={saving} onSave={() => save({
          budget_planned_usd: budgetAmt ? window.toUSD(budgetAmt, budgetCur) : null,
        })} onCancel={() => setEditing(null)} />
      </Row>

      {/* Currencies (home + local + fx) */}
      <Row icon={<IconSwap size={16} stroke="var(--ink)" />} label={t('currencies')}
           value={`${trip.homeCurrency || 'USD'}${trip.localCurrency && trip.localCurrency !== trip.homeCurrency ? ' ↔ ' + trip.localCurrency : ''}`}
           fieldKey="currency">
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {window.isRTL ? 'العملة الرئيسية' : 'Home currency'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setHomeCur(c)} style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 500,
              background: homeCur === c ? 'var(--ink)' : 'var(--cream)',
              color: homeCur === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)',
            }}>{c}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 6 }}>
          {window.isRTL ? 'العملة المحلية' : 'Local currency'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setLocalCur(c)} style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 500,
              background: localCur === c ? 'var(--ink)' : 'var(--cream)',
              color: localCur === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)',
            }}>{c}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 6 }}>
          {window.isRTL ? `سعر USD → ${homeCur} (افتراضي ${window.FX_RATES[homeCur] || 1})` : `USD → ${homeCur} rate (default ${window.FX_RATES[homeCur] || 1})`}
        </div>
        <input type="number" inputMode="decimal" value={fx} onChange={(e) => setFx(e.target.value)} placeholder={String(window.FX_RATES[homeCur] || 1)} style={inputStyle} />
        <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
          {window.isRTL ? `1 ${localCur} = ${(1 / (window.FX_RATES[localCur] || 1)).toFixed(3)} USD (مرجعي)` : `1 ${localCur} = ${(1 / (window.FX_RATES[localCur] || 1)).toFixed(3)} USD (reference)`}
        </div>
        <div style={{
          marginTop: 8, padding: '8px 10px', borderRadius: 8,
          background: 'var(--cream)', border: '0.5px dashed var(--hairline-2)',
          fontSize: 10.5, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.04em',
        }}>
          ⓘ {window.isRTL ? `أسعار مرجعية حدّثت في ${window.FX_RATES_UPDATED}. عدّل الحقل أعلاه إذا كان السعر غير صحيح.` : `Reference rates updated ${window.FX_RATES_UPDATED}. Override above if your rate differs.`}
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ home_currency: homeCur, local_currency: localCur, fx_rate: parseFloat(fx) || window.FX_RATES[homeCur] || 1 })} onCancel={() => setEditing(null)} />
      </Row>

      {/* Cover style */}
      <Row icon={<IconSun size={16} stroke="var(--ink)" />} label={t('coverStyle')}
           value={trip.cover || 'kyoto'} fieldKey="cover" last>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {COVERS.map((c) => (
            <button key={c} onClick={() => setCover(c)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: cover === c ? 'var(--ink)' : 'var(--cream)',
              color: cover === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)',
            }}>{c}</button>
          ))}
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ cover_style: cover })} onCancel={() => setEditing(null)} />
      </Row>

      {err && (
        <div style={{ padding: '10px 14px', background: 'oklch(0.62 0.13 35 / 0.10)', fontSize: 12, color: 'var(--clay-deep)' }}>
          {err}
        </div>
      )}
    </div>
  );
}

function SaveCancelBar({ saving, onSave, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4, flexDirection: 'row' }}>
      <button disabled={saving} onClick={onSave} style={{
        flex: 1, padding: '10px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
        background: saving ? 'var(--ink-mute)' : 'var(--ink)', color: 'var(--cream)',
      }}>{saving ? '…' : (window.isRTL ? 'حفظ' : 'Save')}</button>
      <button disabled={saving} onClick={onCancel} style={{
        padding: '10px 16px', borderRadius: 10, fontSize: 12.5,
        background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
      }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
    </div>
  );
}

Object.assign(window, { ScreenSettings, ParamGroup, ActionRow, Toggle, RoleSelect, EditableTripParams });
