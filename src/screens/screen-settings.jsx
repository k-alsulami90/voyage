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
  const [permsOpen, setPermsOpen] = React.useState(false);

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

  const ar = window.isRTL;
  const span = (trip.startDate && trip.endDate && window.tripDays) ? window.tripDays(trip.startDate, trip.endDate).daysTotal : 0;
  const daysWord = (n) => ar
    ? window.arPlural(n, { one: 'يوم واحد', two: 'يومان', few: `${n} أيام`, many: `${n} يوماً`, other: `${n} يوم` })
    : `${n} ${n === 1 ? 'day' : 'days'}`;

  return (
    <div data-screen-label="05 Trip Settings" style={{ background: 'var(--cream)', minHeight: '100%', paddingBottom: 110 }}>
      <Header title={ar ? 'إعدادات الرحلة' : 'Trip settings'} onBack={() => go('hub')} />

      {/* Trip cover — tap the pill to change the photo */}
      <div style={{ padding: '0 14px' }}>
        <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
        <div className="v-flip-in" style={{
          borderRadius: 28, overflow: 'hidden', position: 'relative',
          boxShadow: 'var(--shadow-card)', height: 180,
        }}>
          <window.CoverArt kind={trip.cover || 'kyoto'} imageUrl={coverUrl} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#fff' }}>
            <div className="serif-italic" style={{ fontSize: 32, lineHeight: 1.05 }}>{trip.title || (ar ? 'رحلة' : 'Trip')}</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {[trip.dates, span ? daysWord(span) : null, (trip.countries || []).join(' · ') || null].filter(Boolean).map((x, i) => (
                <React.Fragment key={i}>{i > 0 && <span style={{ opacity: 0.6 }}>·</span>}<span>{x}</span></React.Fragment>
              ))}
            </div>
          </div>
          <button onClick={() => coverInputRef.current?.click()} className="glass" style={{
            position: 'absolute', top: 14, insetInlineEnd: 14,
            minHeight: 34, padding: '0 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#fff',
            background: uploading ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.32)', border: '0.5px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {uploading ? (
              <span style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'expspin 0.7s linear infinite' }} />
            ) : <IconCamera size={14} stroke="#fff" />}
            {uploading ? (ar ? 'جاري الرفع…' : 'Uploading…') : (ar ? 'تغيير الصورة' : 'Change photo')}
          </button>
        </div>
      </div>

      {/* TRIP DETAILS — tap a row to edit it in place */}
      <SetGroup title={ar ? 'تفاصيل الرحلة' : 'Trip details'}>
        <EditableTripParams trip={trip} />
      </SetGroup>

      {/* TRAVELERS — one list: roles, invite, permissions */}
      <SetGroup title={ar ? `المسافرون · ${members.length}` : `Travelers · ${members.length}`}
        footer={members.length > 1 ? (ar ? 'اضغط على الدور لتغييره، واسحب على الاسم لإزالته من الرحلة.' : 'Tap a role to change it; swipe a name to remove it.') : null}>
        {members.map((m) => {
          const me = m.id === window.currentUserId;
          return (
            <SwipeRow key={m.id}
              actions={me ? [] : [{ key: 'remove', bg: 'var(--clay)', icon: <IconTrash size={18} stroke="#fff" /> }]}
              onAction={async (key) => {
                if (key !== 'remove' || me) return;
                if (!confirm(ar ? `هل تريد إزالة ${m.name} من هذه الرحلة؟` : `Remove ${m.name} from the trip?`)) return;
                try {
                  await window.removeMember(trip.id, m.id);
                  setMembers(members.filter((x) => x.id !== m.id));
                  window.toast?.(ar ? 'تمت الإزالة' : 'Removed', 'success');
                } catch (err) { window.toast?.(err.message || 'Action failed', 'error'); }
              }}>
              <div style={{ background: 'var(--cream-2)' }}>
                <SetRow lead={<Avatar m={m} size={32} />} label={m.name}
                  sub={me ? (ar ? 'أنت' : 'You') : null}
                  right={<RoleSelect role={m.role} onChange={async (r) => {
                    setMembers(members.map((x) => x.id === m.id ? { ...x, role: r } : x));
                    try { await window.updateMemberRole(trip.id, m.id, r); } catch (err) { console.error(err); }
                  }} />} />
              </div>
            </SwipeRow>
          );
        })}
        <SetRow icon={<IconPlus size={16} stroke="#fff" />} tint={SET_TINT.clay}
          label={ar ? 'دعوة مسافر' : 'Invite a traveler'} labelColor="var(--clay-deep)" onClick={() => openSheet('share')} />
        <SetRow icon={<IconShield size={16} stroke="#fff" />} tint={SET_TINT.gray}
          label={ar ? 'صلاحيات الأدوار' : 'What each role can do'} open={permsOpen} onClick={() => setPermsOpen((v) => !v)}>
          <div style={{ background: 'var(--cream)', borderRadius: 14, padding: '4px 12px' }}>
            {[
              { perm: ar ? 'تشوف الرحلة ومستنداتها' : 'View trip & docs',            a: true, e: true,  v: true  },
              { perm: ar ? 'تضيف مصاريف ومستندات' : 'Add expenses & docs',           a: true, e: true,  v: false },
              { perm: ar ? 'تدعو أشخاص جدد' : 'Invite members',                       a: true, e: false, v: false },
              { perm: ar ? 'تعدّل إعدادات الرحلة' : 'Edit trip settings',              a: true, e: false, v: false },
              { perm: ar ? 'تحذف الرحلة' : 'Delete the trip',                         a: true, e: false, v: false },
            ].map((row, i) => (
              <div key={row.perm} style={{
                display: 'grid', gridTemplateColumns: '1fr 38px 38px 38px', padding: '9px 0', alignItems: 'center',
                borderTop: i ? '0.5px solid var(--hairline)' : 'none',
              }}>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{row.perm}</div>
                {['a', 'e', 'v'].map((k) => (
                  <div key={k} style={{ display: 'grid', placeItems: 'center' }}>
                    {row[k] ? (
                      <span style={{ width: 18, height: 18, borderRadius: 6, background: 'var(--moss)', display: 'grid', placeItems: 'center' }}><IconCheck size={11} stroke="#fff" /></span>
                    ) : (
                      <span style={{ width: 18, height: 18, borderRadius: 6, border: '1.5px dashed var(--hairline-2)' }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 38px 38px 38px', padding: '8px 0 6px',
              borderTop: '0.5px solid var(--hairline)', fontSize: 11, color: 'var(--ink-mute)', fontWeight: 600,
            }}>
              <div />
              <div style={{ textAlign: 'center' }}>{ar ? 'مدير' : 'Admin'}</div>
              <div style={{ textAlign: 'center' }}>{ar ? 'محرر' : 'Editor'}</div>
              <div style={{ textAlign: 'center' }}>{ar ? 'مشاهد' : 'Viewer'}</div>
            </div>
          </div>
        </SetRow>
      </SetGroup>

      {/* Active invite links */}
      <InvitesList tripId={trip.id} />

      {/* CARDS — whose card carries the trip money and how much */}
      <window.WalletsSetup key={trip.id} />

      {/* Delete */}
      <LifecycleActions />

      {/* Footer imprint */}
      <div style={{ textAlign: 'center', padding: '32px 0 20px', color: 'var(--ink-mute)' }}>
        <div className="serif-italic" style={{ fontSize: 18 }}>voyage</div>
        <div className="mono" style={{ fontSize: 10.5, marginTop: 6 }}>
          {ar ? 'معرف الرحلة' : 'Trip ID'} · {(trip.id || '—').slice(-8)}
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

  const ar = window.isRTL;
  return (
    <SetGroup title={ar ? 'روابط الدعوة' : (t('activeInvites') || 'Invite links')}
      footer={inactive.length > 0 ? (ar
        ? `${window.arPlural(inactive.length, { one: 'رابط واحد', two: 'رابطان', few: `${inactive.length} روابط`, many: `${inactive.length} رابطاً`, other: `${inactive.length} رابط` })} منتهية أو ملغاة`
        : `${inactive.length} expired or revoked`) : null}>
      {active.map((inv) => {
        const exp = inv.expires_at ? new Date(inv.expires_at) : null;
        const days = exp ? Math.max(0, Math.round((exp - new Date()) / 86400000)) : null;
        return (
          <SetRow key={inv.token} icon={<IconLink size={16} stroke="#fff" />} tint={SET_TINT.blue}
            label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><RoleBadge role={inv.role} /></span>}
            sub={days !== null
              ? (ar ? `ينتهي خلال ${window.arPlural(days, { one: 'يوم واحد', two: 'يومين', few: `${days} أيام`, many: `${days} يوماً`, other: `${days} يوماً` })}` : `expires in ${days}d`)
              : null}
            right={(
              <span style={{ display: 'inline-flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => handleCopy(inv.token)} style={{
                  minHeight: 34, padding: '0 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                  background: copied === inv.token ? 'var(--moss)' : 'var(--sel)', color: copied === inv.token ? '#fff' : 'var(--sel-fg)',
                }}>{copied === inv.token ? '✓' : (ar ? 'نسخ' : t('copy'))}</button>
                <button onClick={() => handleRevoke(inv.token)} aria-label={ar ? 'إلغاء الرابط' : 'Revoke'} style={{
                  width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center',
                  background: 'transparent', color: 'var(--clay-deep)', border: '0.5px solid var(--hairline-2)',
                }}><IconTrash size={14} stroke="currentColor" /></button>
              </span>
            )} />
        );
      })}
      {active.length === 0 && (
        <div style={{ padding: '14px 16px', fontSize: 12.5, color: 'var(--ink-mute)', textAlign: 'center' }}>
          {ar ? 'ما فيه روابط دعوة شغّالة حالياً' : 'No active invites'}
        </div>
      )}
    </SetGroup>
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
      background: on ? 'var(--switch-on)' : 'var(--sand-deep)',
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
  const doDelete = async () => {
    const tripId = window.TRIP?.id;
    if (!tripId) return;
    try {
      await window.sb.from('trips').delete().eq('id', tripId);
      // Tear down the deleted trip's context, then LEAVE its scope before
      // anything tries to re-load it. The old code reloaded the page, but
      // the route is persisted in sessionStorage, so the reload restored
      // the (now-deleted) trip route and stranded the user on a blank,
      // loading trip screen.
      window.TRIP = null;
      if (window.currentUserId) {
        try { await window.loadTrips(window.currentUserId); } catch (_) {}
      }
      if (typeof window.navigateRoute === 'function') {
        window.navigateRoute({ scope: 'app', name: 'trips' });
        window.notifyDataChange?.();
      } else {
        // Fallback: clear the saved route so a reload can't land back on
        // the deleted trip, then reload.
        try { sessionStorage.setItem('voyage:route', JSON.stringify({ scope: 'app', name: 'trips' })); } catch (_) {}
        window.location.reload();
      }
      window.toast?.(window.isRTL ? 'تم حذف الرحلة وسجلها بالكامل' : 'Trip deleted', 'success');
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

  const ar = window.isRTL;
  return (
    <SetGroup title={ar ? 'إدارة الرحلة' : 'Manage'}
      footer={ar ? 'الحذف نهائي: يمسح الرحلة بمصاريفها ومستنداتها لكل المسافرين.' : 'Deleting is permanent: the trip, its expenses and documents go for everyone.'}>
      <SetRow icon={<IconTrash size={16} stroke="#fff" />} tint={SET_TINT.red}
        label={ar ? 'حذف الرحلة' : 'Delete trip'} danger onClick={promptDelete} />
    </SetGroup>
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

  const CURRENCIES = window.CURRENCIES;
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

  const inputStyle = {
    width: '100%', padding: '11px 12px', borderRadius: 12,
    border: '0.5px solid var(--hairline-2)', background: 'var(--cream)',
    color: 'var(--ink)', fontSize: 16, outline: 'none',
    textAlign: 'start',
  };
  const ar = window.isRTL;
  const COVER_NAMES = {
    kyoto: ar ? 'جبال وزهر' : 'Blossom peaks', lisbon: ar ? 'بلاط' : 'Tiles', oaxaca: ar ? 'شمس' : 'Sun',
    lofoten: ar ? 'شفق' : 'Aurora', patagon: ar ? 'قمم' : 'Peaks',
  };
  const span = (trip.startDate && trip.endDate && window.tripDays) ? window.tripDays(trip.startDate, trip.endDate).daysTotal : 0;
  const chip = (on) => ({
    minHeight: 34, padding: '0 11px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
    background: on ? 'var(--sel)' : 'var(--cream)', color: on ? 'var(--sel-fg)' : 'var(--ink-soft)',
    border: '0.5px solid var(--hairline)',
  });

  // Row is a stable component defined OUTSIDE this scope (see bottom of file).
  // We pass it open-state + setter via props so React keeps inputs mounted
  // across keystrokes (defining components inside parents causes remount).

  return (
    <>
      {/* Name (title + subtitle) */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="title"
        icon={<IconEdit size={16} stroke="#fff" />} tint={SET_TINT.indigo}
        label={ar ? 'اسم الرحلة' : 'Trip name'} value={trip.title || '—'} sub={trip.subtitle || null}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={ar ? 'اسم الرحلة' : 'Trip name'} style={inputStyle} />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder={ar ? 'وصف قصير (اختياري)' : 'Short description (optional)'} style={inputStyle} />
        <SaveCancelBar saving={saving} onSave={() => save({ title: title.trim(), subtitle: subtitle.trim() || null })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Countries (comma-separated list — supports multi-country trips) */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="countries"
        icon={<IconGlobe size={16} stroke="#fff" />} tint={SET_TINT.sky}
        label={ar ? 'الدول' : 'Countries'}
        value={(trip.countries || []).length > 0 ? trip.countries.join(' · ') : (ar ? 'غير محددة' : 'Not set')}>
        <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>
          {ar ? 'افصل بينها بفاصلة — مثال: تركيا, اليونان' : 'Separate with commas — e.g. Turkey, Greece'}
        </div>
        <input value={countries} onChange={(e) => setCountries(e.target.value)}
          placeholder={ar ? 'الدول في هذه الرحلة' : 'Countries on this trip'} style={inputStyle} />
        {countries.trim() && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {countries.split(',').map((c) => c.trim()).filter(Boolean).map((c, i) => (
              <span key={i} style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'var(--sand)', color: 'var(--ink-soft)' }}>{c}</span>
            ))}
          </div>
        )}
        <SaveCancelBar saving={saving} onSave={() => {
          const list = countries.split(',').map((x) => x.trim()).filter(Boolean);
          return save({ countries: list, country_code: list[0]?.slice(0, 2)?.toUpperCase() || null });
        }} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Dates */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="dates"
        icon={<IconCalendar size={16} stroke="#fff" />} tint={SET_TINT.red}
        label={ar ? 'التواريخ' : 'Dates'} value={trip.dates || '—'}
        sub={span ? (ar ? window.arPlural(span, { one: 'يوم واحد', two: 'يومان', few: `${span} أيام`, many: `${span} يوماً`, other: `${span} يوم` }) : `${span} days`) : null}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <label style={{ display: 'grid', gap: 4, fontSize: 12, color: 'var(--ink-mute)' }}>{ar ? 'من' : 'From'}
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 4, fontSize: 12, color: 'var(--ink-mute)' }}>{ar ? 'إلى' : 'To'}
            <input type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} style={inputStyle} /></label>
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ start_date: start, end_date: end })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Budget — pick currency AND amount; we convert to USD on save */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="budget"
        icon={<IconWallet size={16} stroke="#fff" />} tint={SET_TINT.green}
        label={ar ? 'الميزانية' : 'Budget'}
        value={trip.budget?.plannedUSD ? window.fmtMoney(trip.budget.plannedUSD, { in: 'home' }) : (ar ? 'بدون' : 'None')}>
        <div style={paramLabelStyle}>{ar ? 'العملة' : 'Currency'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => {
              // Convert the visible amount when switching currency, so the value stays the same
              const n = parseFloat(budgetAmt) || 0;
              if (n > 0) {
                const usd = n / window.fxRate(budgetCur);
                setBudgetAmt(Math.round(usd * window.fxRate(c) * 100) / 100);
              }
              setBudgetCur(c);
            }} style={chip(budgetCur === c)}>{c}</button>
          ))}
        </div>
        <div style={{ ...paramLabelStyle, marginTop: 6 }}>{ar ? `المبلغ (${budgetCur})` : `Amount (${budgetCur})`}</div>
        <input type="number" inputMode="decimal" value={budgetAmt} onChange={(e) => setBudgetAmt(e.target.value)} placeholder="0" style={inputStyle} />
        {parseFloat(budgetAmt) > 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {budgetCur !== 'USD' && <span>= {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'USD' })}</span>}
            {budgetCur !== homeCur && <span>≈ {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'home' })}</span>}
            {budgetCur !== localCur && localCur !== homeCur && <span>≈ {window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: 'local' })}</span>}
          </div>
        )}
        <SaveCancelBar saving={saving} onSave={() => save({
          budget_planned_usd: budgetAmt ? window.toUSD(budgetAmt, budgetCur) : null,
        })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Destination currency. Home currency lives in Account; rates are automatic. */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="currency"
        icon={<IconSwap size={16} stroke="#fff" />} tint={SET_TINT.orange}
        label={ar ? 'عملة الوجهة' : 'Destination currency'}
        value={`${trip.localCurrency || homeCur}${(trip.localCurrency && trip.localCurrency !== homeCur) ? '  ·  ' + (1 / (window.FX_RATES[trip.localCurrency] || 1) * (window.FX_RATES[homeCur] || 1)).toFixed(2) + ' ' + homeCur : ''}`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CURRENCIES.map((c) => (
            <button key={c} onClick={() => setLocalCur(c)} style={chip(localCur === c)}>{c}</button>
          ))}
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--cream)', fontSize: 12.5, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>
          {localCur === homeCur
            ? (ar ? 'نفس عملتك الرئيسية' : 'Same as your home currency')
            : `1 ${localCur} ≈ ${(window.FX_RATES[homeCur] / (window.FX_RATES[localCur] || 1)).toFixed(3)} ${homeCur}`}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
          {ar
            ? `سعر الصرف يتحدّث تلقائياً (آخر تحديث ${window.FX_RATES_UPDATED}). عملتك الرئيسية ${homeCur} تتغير من صفحة الحساب.`
            : `Rates update automatically (last ${window.FX_RATES_UPDATED}). Your home currency ${homeCur} is set in Account.`}
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ local_currency: localCur, fx_rate: window.FX_RATES[homeCur] || 1 })} onCancel={() => setEditing(null)} />
      </EditRow>

      {/* Cover style — pick by looking at it */}
      <EditRow editing={editing} setEditing={setEditing} fieldKey="cover"
        icon={<IconPalette size={16} stroke="#fff" />} tint={SET_TINT.purple}
        label={ar ? 'شكل الغلاف' : 'Cover style'} value={COVER_NAMES[trip.cover || 'kyoto'] || trip.cover}
        sub={(trip.coverUrl || trip.coverImageUrl) ? (ar ? 'يظهر لما ما يكون فيه صورة' : 'Shown when there is no photo') : null}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}>
          {COVERS.map((c) => (
            <button key={c} onClick={() => setCover(c)} aria-label={COVER_NAMES[c]} style={{ display: 'grid', gap: 5, justifyItems: 'center', background: 'transparent' }}>
              <span style={{
                position: 'relative', width: '100%', aspectRatio: '1 / 1.15', borderRadius: 12, overflow: 'hidden',
                boxShadow: cover === c ? '0 0 0 2px var(--cream-2), 0 0 0 4px var(--clay)' : '0 0 0 0.5px var(--hairline-2)',
                transition: 'box-shadow 160ms',
              }}><window.CoverArt kind={c} /></span>
              <span style={{ fontSize: 11, fontWeight: cover === c ? 700 : 500, color: cover === c ? 'var(--ink)' : 'var(--ink-mute)', whiteSpace: 'nowrap' }}>{COVER_NAMES[c]}</span>
            </button>
          ))}
        </div>
        <SaveCancelBar saving={saving} onSave={() => save({ cover_style: cover })} onCancel={() => setEditing(null)} />
      </EditRow>

      {err && (
        <div style={{ padding: '10px 14px', background: 'oklch(0.62 0.13 35 / 0.10)', fontSize: 12.5, color: 'var(--clay-deep)' }}>
          {err}
        </div>
      )}
    </>
  );
}

function SaveCancelBar({ saving, onSave, onCancel }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 4, flexDirection: 'row' }}>
      <button disabled={saving} onClick={onSave} style={{
        flex: 1, minHeight: 44, borderRadius: 12, fontSize: 14, fontWeight: 600,
        background: 'var(--ink)', color: 'var(--cream)', opacity: saving ? 0.6 : 1,
      }}>{saving ? '…' : (window.isRTL ? 'حفظ' : 'Save')}</button>
      <button disabled={saving} onClick={onCancel} style={{
        minHeight: 44, padding: '0 18px', borderRadius: 12, fontSize: 14,
        background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
      }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
    </div>
  );
}

// Stable module-scope component — must NOT be defined inside EditableTripParams,
// otherwise inputs unmount on every keystroke. A settings row that opens an
// inline editor under itself.
function EditRow({ editing, setEditing, icon, tint, label, value, sub, fieldKey, children }) {
  const isOpen = editing === fieldKey;
  return (
    <SetRow icon={icon} tint={tint} label={label} value={value} sub={sub}
      open={isOpen} onClick={() => setEditing(isOpen ? null : fieldKey)}>
      {children}
    </SetRow>
  );
}

Object.assign(window, { ScreenSettings, ParamGroup, ActionRow, Toggle, RoleSelect, EditableTripParams, EditRow, InvitesList });
