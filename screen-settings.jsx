// Trip-level Settings — now includes Crew (Members) inline.

// One source for sub-labels inside EditableTripParams' expanded edit
// drawers (Currency / Amount / Home currency / Local currency / FX rate).
// Was the same uppercase-mono-tracked pattern duplicated inline 5 times;
// centralising it kills the eyebrow shape and makes future tweaks land
// in one place.
const paramLabelStyle = {
  fontSize: 12, fontWeight: 600,
  color: 'var(--ink)', marginBottom: 2,
};

function ScreenSettings({ go, openSheet }) {
  const trip    = window.TRIP;
  const [members,    setMembers]    = React.useState(window.MEMBERS || []);
  const [coverUrl,   setCoverUrl]   = React.useState(trip?.coverUrl || trip?.coverImageUrl || null);
  const [uploading,  setUploading]  = React.useState(false);
  const coverInputRef = React.useRef(null);
  const counts = members.reduce((acc, m) => { acc[m.role] = (acc[m.role] || 0) + 1; return acc; }, {});

  const handleCoverUpload = async (file) => {
    if (!file || !trip?.id) return;
    setUploading(true);
    try {
      const url = await window.uploadTripCover(trip.id, file);
      setCoverUrl(url);
      // uploadTripCover updates the DB but doesn't refetch trip detail,
      // so window.TRIP.coverImageUrl is still the old value. Reload the
      // trip so Hub + Trips home cover photos pick up the new image
      // without needing a manual refresh.
      await window.loadTripDetail?.(trip.id);
      window.notifyDataChange?.();
    } catch (err) { window.toast?.(err.message || 'Action failed', 'error'); }
    finally { setUploading(false); }
  };

  if (!trip) {
    return (
      <div style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 100 }}>
        <Header title={t('settings')} onBack={() => go('hub')} />
        <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--ink-mute)' }}>
          <div className="serif" style={{ fontSize: 18 }}>
            {window.isRTL ? 'يرجى تحديد وفتح رحلة أولاً' : 'Open a trip first'}
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
            {uploading ? (window.isRTL ? 'جاري رفع الصورة الآن...' : 'Uploading...') : t('editCover')}
          </button>
        </div>
      </div>

      {/* CREW SECTION — embedded, replaces standalone Members tab */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel action={t('invite')} onAction={() => openSheet('share')}>{t('crewSection')} · {members.length}</SectionLabel>

        {/* Crew header strip. Was a dark statement card with uppercase
           mono eyebrow + 20px serif "{N} travelers" hero-metric + a
           3-cell identical-tile role tally grid. Same pattern removed
           from 6+ other screens. Now: avatars + invite-plus, with the
           role counts as one inline sentence in cream-2 below. The
           per-member role is already visible on every member row, so
           the tally is just orientation, not a hero metric. */}
        <div style={{ padding: '0 8px' }}>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 16,
            border: '0.5px solid var(--hairline)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
            flexDirection: 'row',
          }}>
            <AvatarStack members={members} size={36} />
            <button onClick={() => openSheet('share')}
              aria-label={t('invite')} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--ink)', color: 'var(--cream)',
              marginInlineStart: -14, zIndex: 5,
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 0 2px var(--cream-2), 0 4px 8px rgba(34,28,22,0.18)',
              flexShrink: 0,
            }}><IconPlus size={18} stroke="currentColor" /></button>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: 'var(--ink)' }}>
              <div style={{ fontWeight: 600 }}>
                {members.length} {t('travelers')}
              </div>
              <div style={{
                fontSize: 12, color: 'var(--ink-mute)', marginTop: 2,
              }}>
                {[
                  counts.Admin > 0 && (window.isRTL
                    ? window.arPlural(counts.Admin, { one: 'مشرف واحد', two: 'مشرفان', few: `${counts.Admin} مشرفين`, many: `${counts.Admin} مشرفاً`, other: `${counts.Admin} مشرف` })
                    : `${counts.Admin} ${counts.Admin === 1 ? t('admin') : 'admins'}`),
                  counts.Editor > 0 && (window.isRTL
                    ? window.arPlural(counts.Editor, { one: 'محرر واحد', two: 'محرران', few: `${counts.Editor} محررين`, many: `${counts.Editor} محرراً`, other: `${counts.Editor} محرر` })
                    : `${counts.Editor} ${counts.Editor === 1 ? t('editor') : 'editors'}`),
                  counts.Viewer > 0 && (window.isRTL
                    ? window.arPlural(counts.Viewer, { one: 'قارئ واحد', two: 'قارئان', few: `${counts.Viewer} قراء ومستكشفون`, many: `${counts.Viewer} قارئاً`, other: `${counts.Viewer} قارئ` })
                    : `${counts.Viewer} ${counts.Viewer === 1 ? t('viewer') : 'viewers'}`),
                ].filter(Boolean).join(' · ')}
              </div>
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
                if (key !== 'remove' || m.id === window.currentUserId) return;
                if (!confirm(window.isRTL ? `هل تريد إزالة ${m.name} واستبعاده من هذه الرحلة؟` : `Remove ${m.name} from the trip?`)) return;
                try {
                  await window.removeMember(trip.id, m.id);
                  setMembers(members.filter((x) => x.id !== m.id));
                  window.toast?.(window.isRTL ? 'تم استبعاد العضو بنجاح' : 'Removed', 'success');
                } catch (err) { window.toast?.(err.message || 'Action failed', 'error'); }
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
                    {m.id === window.currentUserId ? (window.isRTL ? 'أنت · مالك السجل' : 'you · owner') : (window.isRTL ? 'صديق في الرحلة' : 'trip member')}
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
              { perm: window.isRTL ? 'استعراض وتصفح تفاصيل الرحلة ومستنداتها' : 'View trip & docs',    a: true,  e: true,  v: true  },
              { perm: window.isRTL ? 'إضافة بنود مصروفات أو مستندات جديدة' : 'Add expenses & docs', a: true,  e: true,  v: false },
              { perm: window.isRTL ? 'إرسال روابط دعوة لأصدقاء جدد' : 'Invite members',                  a: true,  e: false, v: false },
              { perm: window.isRTL ? 'تعديل المعطيات والإعدادات العامة للرحلة' : 'Edit trip settings',    a: true,  e: false, v: false },
              { perm: window.isRTL ? 'أرشفة الرحلة أو حذف سجلها بالكامل' : 'Archive or delete',             a: true,  e: false, v: false },
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
            {/* Column labels were uppercase mono 0.1em. Now sentence-case
               sans, smaller weight, same column width. The grid above
               still reads as a permission matrix. */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 30px 30px 30px',
              padding: '8px 0 4px', borderTop: '0.5px solid var(--hairline)',
              fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 500,
            }}>
              <div></div>
              <div style={{ textAlign: 'center' }}>{window.isRTL ? 'مدير' : 'Adm'}</div>
              <div style={{ textAlign: 'center' }}>{window.isRTL ? 'محرر' : 'Edit'}</div>
              <div style={{ textAlign: 'center' }}>{window.isRTL ? 'مشاهد' : 'View'}</div>
            </div>
          </div>
        </details>

        {/* Active invites */}
        <InvitesList tripId={trip.id} />
      </div>

      {/* Parameters — now fully editable */}
      <div style={{ padding: '24px 14px 0' }}>
        <SectionLabel>{t('tripParameters')}</SectionLabel>
        <EditableTripParams trip={trip} />
      </div>

      {/* Lifecycle */}
      <LifecycleActions />

      {/* Footer imprint. Trip ID was full UUID rendered as uppercase
         mono with 0.16em tracking -- spanned the footer like a barcode.
         Now: short last-8 of the UUID (still uniquely identifies in
         practice for support reference) in plain mono without tracking
         or explicit uppercase. */}
      <div style={{ textAlign: 'center', padding: '32px 0 20px', color: 'var(--ink-mute)' }}>
        <div className="serif-italic" style={{ fontSize: 18 }}>voyage</div>
        <div className="mono" style={{ fontSize: 10.5, marginTop: 6 }}>
          {window.isRTL ? 'معرف الرحلة' : 'Trip ID'} · {(trip.id || '—').slice(-8)}
        </div>
      </div>
    </div>
  );
}

function InvitesList({ tripId }) {
  const [invites, setInvites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [copied,  setCopied]  = React.useState(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try { setInvites(await window.loadTripInvites(tripId)); }
    finally { setLoading(false); }
  }, [tripId]);

  React.useEffect(() => { refresh(); }, [refresh]);

  const handleCopy = async (token) => {
    const link = window.inviteLink(token);
    try { await navigator.clipboard.writeText(link); } catch (_) {}
    setCopied(token);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleRevoke = async (token) => {
    if (!confirm(window.isRTL ? 'هل تريد إلغاء صلاحية هذا الرابط نهائياً؟' : 'Revoke this invite link?')) return;
    try {
      await window.revokeInvite(token);
      await refresh();
      window.toast?.(t('inviteRevoked') || 'Invite revoked', 'success');
    } catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
  };

  const active = invites.filter((i) => !i.revoked_at && (!i.expires_at || new Date(i.expires_at) > new Date()));
  const inactive = invites.filter((i) => !active.includes(i));

  if (loading) return null;
  if (invites.length === 0) return null;

  return (
    <div style={{ marginTop: 18, padding: '0 8px' }}>
      {/* Was uppercase mono tracked 0.14em — same eyebrow pattern as
         elsewhere. Now sentence-case sans semibold ink-soft, matching
         the SectionLabel feel without using the component (we're nested
         under Crew's SectionLabel already, so this is sub-level). */}
      <div style={{
        fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)',
        margin: '0 6px 8px',
      }}>{t('activeInvites') || 'Active invites'}</div>
      <div style={{
        background: 'var(--cream-2)', borderRadius: 16,
        border: '0.5px solid var(--hairline)', overflow: 'hidden',
      }}>
        {active.map((inv, i) => {
          const exp = inv.expires_at ? new Date(inv.expires_at) : null;
          const days = exp ? Math.max(0, Math.round((exp - new Date()) / 86400000)) : null;
          return (
            <div key={inv.token} style={{
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              flexDirection: 'row',
              borderTop: i ? '0.5px solid var(--hairline)' : 'none',
            }}>
              <RoleBadge role={inv.role} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{
                  fontSize: 11.5, color: 'var(--ink-soft)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{inv.token}</div>
                {days !== null && (
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>
                    {window.isRTL
                      ? `تنتهي صلاحية الرابط خلال ${window.arPlural(days, { one: 'يوم واحد', two: 'يومين', few: `${days} أيام`, many: `${days} يوماً`, other: `${days} يوماً` })}`
                      : `expires in ${days}d`}
                  </div>
                )}
              </div>
              <button onClick={() => handleCopy(inv.token)} style={{
                padding: '6px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                background: copied === inv.token ? 'var(--moss)' : 'var(--ink)',
                color: 'var(--cream)',
              }}>{copied === inv.token ? '✓' : t('copy')}</button>
              <button onClick={() => handleRevoke(inv.token)} style={{
                padding: '6px 8px', borderRadius: 999,
                background: 'transparent', color: 'var(--clay-deep)',
                border: '0.5px solid var(--hairline)',
              }}>
                <IconTrash size={12} stroke="currentColor" />
              </button>
            </div>
          );
        })}
        {active.length === 0 && (
          <div style={{
            padding: '14px', fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center',
          }}>{window.isRTL ? 'لا توجد روابط دعوة نشطة حالياً' : 'No active invites'}</div>
        )}
      </div>
      {inactive.length > 0 && (
        <div style={{
          marginTop: 8, padding: '0 6px',
          fontSize: 10.5, color: 'var(--ink-mute)',
        }}>
          {window.isRTL
            ? `${window.arPlural(inactive.length, { one: 'رابط واحد', two: 'رابطان', few: `${inactive.length} روابط`, many: `${inactive.length} رابطاً`, other: `${inactive.length} رابط` })} منتهية الصلاحية أو الملغاة`
            : `${inactive.length} expired or revoked`}
        </div>
      )}
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

  const doDelete = async () => {
    const tripId = window.TRIP?.id;
    if (!tripId) return;
    try {
      await window.sb.from('trips').delete().eq('id', tripId);
      window.toast?.(window.isRTL ? 'تم حذف الرحلة وسجلها بالكامل' : 'Trip deleted', 'success');
      window.clearAllMockData();
      window.location.reload();
    } catch (err) {
      window.toast?.(err.message || 'Could not delete', 'error');
    }
  };

  const promptDelete = () => {
    window.actionSheet({
      title: t('deleteTrip'),
      message: t('areYouSure'),
      actions: [
        { label: t('delete'), destructive: true, onPress: doDelete },
      ],
    });
  };

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
          icon={<IconTrash size={17} stroke="var(--clay-deep)" />}
          label={t('deleteTrip')} labelColor="var(--clay-deep)"
          sub={t('deleteSub')} last
          onClick={promptDelete} />
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
  const [countries, setCountries] = React.useState((trip.countries || []).join(', '));

  // Sync the form state whenever ANY relevant trip field changes
  // (was previously missing title / subtitle / startDate / endDate /
  // cover from the deps, so e.g. saving new dates didn't refresh the
  // form fields and the user saw their old dates still in the inputs).
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
    setCountries((trip.countries || []).join(', '));
  }, [
    trip.id, trip.title, trip.subtitle, trip.startDate, trip.endDate,
    trip.budget?.plannedUSD, trip.homeCurrency, trip.localCurrency,
    trip.fx, trip.cover, trip.countries?.length,
  ]);

  const CURRENCIES = ['USD','SAR','EUR','GBP','JPY','AED','EGP','MAD','TRY','INR','CHF'];
  const COVERS = ['kyoto','lisbon','oaxaca','lofoten','patagon'];

  const save = async (fields) => {
    setSaving(true); setErr(null);
    try {
      const { error } = await window.sb.from('trips').update(fields).eq('id', trip.id);
      if (error) throw error;
      // loadTripDetail is wrapped to call notifyDataChange automatically,
      // but we also fire it explicitly below so every screen reading
      // window.TRIP picks up the new values on the very next render
      // (Hub's date pill, day-of-trip count, currency-aware budget bar,
      // etc.). Belt-and-suspenders because the wrapper has historically
      // missed corner cases on slower devices.
      await window.loadTripDetail(trip.id);
      window.notifyDataChange?.();
      setEditing(null);
      setTick((n) => n + 1);
      window.toast?.(window.isRTL ? 'تم حفظ التعديلات بنجاح' : 'Saved', 'success');
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

  // Row is a stable component defined OUTSIDE this scope (see bottom of file).
  // We pass it open-state + setter via props so React keeps inputs mounted
  // across keystrokes (defining components inside parents causes remount).

  return (
    <div style={{
      background: 'var(--cream-2)', borderRadius: 22, margin: '0 8px',
      border: '0.5px solid var(--hairline)', overflow: 'hidden',
    }}>
      {/* Destination (title + subtitle) */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconCompass size={16} stroke="var(--ink)" />} label={t('destination')}
           value={trip.subtitle || trip.title || '—'} fieldKey="title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={window.isRTL ? 'اكتب اسماً مميزاً للرحلة' : 'Trip title'} style={inputStyle} />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={window.isRTL ? 'اكتب وصفاً مختصراً للرحلة' : 'Subtitle'} style={inputStyle} />
        <SaveCancelBar saving={saving} onSave={() => save({ title: title.trim(), subtitle: subtitle.trim() || null })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Countries (comma-separated list — supports multi-country trips) */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconPin size={16} stroke="var(--ink)" />}
           label={window.isRTL ? 'الدول المشمولة' : 'Countries'}
           value={(trip.countries || []).length > 0 ? trip.countries.join(' · ') : (window.isRTL ? 'لم تُحدد دول بعد' : 'Not set')}
           fieldKey="countries">
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>
          {window.isRTL ? 'افصل بفاصلة — مثال: سويسرا, البرتغال, اسكتلندا' : 'Comma-separated — e.g. Switzerland, Portugal, Scotland'}
        </div>
        <input value={countries} onChange={(e) => setCountries(e.target.value)}
          placeholder={window.isRTL ? 'الدول التي زرتها' : 'Countries you visited'}
          style={inputStyle} />
        {/* Live preview pills */}
        {countries.trim() && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {countries.split(',').map((c) => c.trim()).filter(Boolean).map((c, i) => (
              <span key={i} style={{
                padding: '4px 9px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                background: 'var(--sand)', color: 'var(--ink-soft)',
              }}>{c}</span>
            ))}
          </div>
        )}
        <SaveCancelBar saving={saving} onSave={() => {
          const list = countries.split(',').map((s) => s.trim()).filter(Boolean);
          return save({ countries: list, country_code: list[0]?.slice(0, 2)?.toUpperCase() || null });
        }} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Dates */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconClock size={16} stroke="var(--ink)" />} label={t('dates')}
           value={trip.dates || '—'} fieldKey="dates">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={inputStyle} />
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ start_date: start, end_date: end })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Budget — pick currency AND amount; we convert to USD on save */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconWallet size={16} stroke="var(--ink)" />} label={t('budgetCap')}
           value={trip.budget?.plannedUSD ? window.fmtMoney(trip.budget.plannedUSD, { in: 'home' }) : '—'}
           fieldKey="budget">
        <div style={paramLabelStyle}>
          {window.isRTL ? 'عملة الحساب' : 'Currency'}
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
        <div style={{ ...paramLabelStyle, marginTop: 6 }}>
          {window.isRTL ? `المبلغ الإجمالي (${budgetCur})` : `Amount (${budgetCur})`}
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
      </EditRow>

      {/* Currencies (home + local + fx) */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconSwap size={16} stroke="var(--ink)" />} label={t('currencies')}
           value={`${trip.homeCurrency || 'USD'}${trip.localCurrency && trip.localCurrency !== trip.homeCurrency ? ' ↔ ' + trip.localCurrency : ''}`}
           fieldKey="currency">
        <div style={paramLabelStyle}>
          {window.isRTL ? 'عملتك الرئيسية (في بلدك)' : 'Home currency'}
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
        <div style={{ ...paramLabelStyle, marginTop: 8 }}>
          {window.isRTL ? 'العملة المحلية لوجهة السفر' : 'Local currency'}
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
        <div style={{ ...paramLabelStyle, marginTop: 8 }}>
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
      </EditRow>

      {/* Cover style */}
      <EditRow editing={editing} setEditing={setEditing} icon={<IconSun size={16} stroke="var(--ink)" />} label={t('coverStyle')}
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
      </EditRow>

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
      }}>{saving ? '…' : (window.isRTL ? 'حفظ التغييرات' : 'Save')}</button>
      <button disabled={saving} onClick={onCancel} style={{
        padding: '10px 16px', borderRadius: 10, fontSize: 12.5,
        background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
      }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
    </div>
  );
}

// Stable module-scope component — must NOT be defined inside EditableTripParams,
// otherwise inputs unmount on every keystroke.
function EditRow({ editing, setEditing, icon, label, value, fieldKey, children, last }) {
  const isOpen = editing === fieldKey;
  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
    padding: '13px 16px', width: '100%', textAlign: 'start',
  };
  const iconBox = {
    width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
    background: 'var(--cream)', border: '0.5px solid var(--hairline)',
  };
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
}

Object.assign(window, { ScreenSettings, ParamGroup, ActionRow, Toggle, RoleSelect, EditableTripParams, EditRow, InvitesList });
