// App-level Settings — profile, preferences, account, danger zone.
// Top-level page, accessed from the app nav.

function AppToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange?.(!on)} style={{
      width: 40, height: 24, borderRadius: 999,
      background: on ? 'var(--ink)' : 'var(--sand-deep)',
      padding: 2, transition: 'background 200ms', position: 'relative', flexShrink: 0,
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

function MotionRow() {
  const ar = window.isRTL;
  const sysReduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [full, setFull] = React.useState(() => document.documentElement.classList.contains('motion-full'));
  const toggle = (v) => {
    setFull(v);
    document.documentElement.classList.toggle('motion-full', v);
    try { if (v) localStorage.setItem('voyage:motion', 'full'); else localStorage.removeItem('voyage:motion'); } catch (_) {}
    window.haptic?.();
    window.toast?.(v ? (ar ? 'الحركة والمؤثرات شغّالة ✨' : 'Motion on ✨') : (ar ? 'رجعنا لإعداد الجهاز' : 'Following the device setting'), 'success');
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row', padding: '13px 16px', borderTop: '0.5px solid var(--hairline)' }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--cream)', border: '0.5px solid var(--hairline)', fontSize: 15 }}>✨</div>
      <div style={{ flex: 1, textAlign: 'start' }}>
        <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>{ar ? 'الحركة والمؤثرات دائماً' : 'Always animate'}</div>
        <div style={{ fontSize: 11.5, color: sysReduce ? 'var(--clay-deep)' : 'var(--ink-mute)', marginTop: 2, lineHeight: 1.45 }}>
          {sysReduce
            ? (ar ? '«تقليل الحركة» مفعّل في جهازك، وهو اللي موقف المؤثرات. فعّل هذا لتشتغل في التطبيق.' : 'Reduce Motion is on in your device — turn this on to keep the app’s motion.')
            : (ar ? 'المؤثرات شغّالة حسب إعداد جهازك.' : 'Motion follows your device setting.')}
        </div>
      </div>
      <AppToggle on={full} onChange={toggle} />
    </div>
  );
}

function ScreenAppSettings({ go, onSignOut, dark = false, lang = 'en', onDarkToggle, onLangChange }) {
  // Seed from the global account cache (primed at hydrate, refreshed on
  // every visit) so a return to this screen paints the real name / email
  // instantly instead of flashing 'Loading…' while it refetches.
  const [profile, setProfile] = React.useState(window.ACCOUNT?.profile || null);
  const [email,   setEmail]   = React.useState(window.ACCOUNT?.email || '');
  const [stats,   setStats]   = React.useState(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG || null);
  // Trip activity digests (someone added expenses/docs to a shared trip).
  // Defaults on; the profile fetch below refreshes it. Cached so it doesn't
  // flicker on revisit.
  const [activityOn, setActivityOn] = React.useState(window.ACCOUNT?.activity !== false);

  // Push reminders — only surfaced when push is configured + supported.
  const pushAvailable = !!window.pushSupported?.();
  const [pushState, setPushState] = React.useState(window.ACCOUNT?.pushState || 'off'); // off | on | denied | busy
  React.useEffect(() => {
    if (!pushAvailable) return;
    window.pushStatus?.().then((s) => {
      setPushState(s);
      window.ACCOUNT = { ...(window.ACCOUNT || {}), pushState: s };
    }).catch(() => {});
  }, [pushAvailable]);
  const togglePush = async () => {
    if (pushState === 'busy') return;
    const goingOn = pushState !== 'on';
    setPushState('busy');
    try {
      const next = goingOn ? await window.pushSubscribe() : await window.pushUnsubscribe();
      setPushState(next);
      window.ACCOUNT = { ...(window.ACCOUNT || {}), pushState: next };
      if (goingOn) window.toast?.(window.isRTL ? 'تم تفعيل تذكيرات الرحلة' : 'Trip reminders on', 'success');
    } catch (e) {
      setPushState(await (window.pushStatus?.() || 'off'));
      window.toast?.(e.message || 'Could not change reminders', 'error');
    }
  };

  // Trip activity digest opt-out (profiles.notify_activity). Optimistic;
  // reverts + toasts on failure. Degrades silently if the column doesn't
  // exist yet (pre-migration) — the update just no-ops server-side.
  const toggleActivity = async () => {
    const next = !activityOn;
    setActivityOn(next);
    window.ACCOUNT = { ...(window.ACCOUNT || {}), activity: next };
    try {
      const { error } = await window.sb.from('profiles')
        .update({ notify_activity: next }).eq('id', window.currentUserId);
      if (error) throw error;
    } catch (e) {
      setActivityOn(!next);
      window.ACCOUNT = { ...(window.ACCOUNT || {}), activity: !next };
      window.toast?.(e.message || 'Could not change setting', 'error');
    }
  };

  React.useEffect(() => {
    const uid = window.currentUserId;
    if (!uid || !window.sb) return;
    // Profile name + initials
    window.sb.from('profiles').select('*').eq('id', uid).single()
      .then(({ data }) => {
        if (!data) return;
        const p = { id: data.id, name: data.name, initials: data.initials, hue: data.avatar_hue || 35 };
        setProfile(p);
        // notify_activity may be absent pre-migration → treat as on.
        const act = data.notify_activity !== false;
        setActivityOn(act);
        window.ACCOUNT = { ...(window.ACCOUNT || {}), profile: p, activity: act };
      })
      .catch(() => {});
    // Real email from auth session
    window.sb.auth.getUser()
      .then(({ data }) => {
        if (!data?.user?.email) return;
        setEmail(data.user.email);
        window.ACCOUNT = { ...(window.ACCOUNT || {}), email: data.user.email };
      })
      .catch(() => {});
    // Lifetime stats — fetch if not already cached
    if (!window.LIFETIME_STATS) {
      window.loadLifetimeStats?.().then((s) => setStats(s || null)).catch(() => {});
    }
  }, []);

  const me    = profile || { id: window.currentUserId || 'me', name: 'You', initials: 'ME', hue: 35 };
  const stat  = stats || { totalTrips: 0, totalDays: 0, countries: 0 };

  return (
    <div data-screen-label="App Settings" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* iOS Large Title */}
      <LargeTitleHeader title={t('account')} />

      {/* PROFILE — your traveller passport: data page, flip for stamps */}
      <window.PassportCard me={me} email={email} stats={stat} />

      {/* INSTALL APP — only shows if installable or iOS Safari (manual nudge) */}
      <InstallCard />

      {/* PREFERENCES */}
      <div style={{ padding: '12px 14px 0' }}>
        <SectionLabel>{t('preferences')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22,
          margin: '0 8px', overflow: 'hidden',
          border: '0.5px solid var(--hairline)',
        }}>
          {/* Dark mode row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
            padding: '13px 16px',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
            }}><IconSun size={16} stroke="var(--ink)" /></div>
            <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textAlign: 'start' }}>
              {t('appearance')}
            </div>
            <AppToggle on={dark} onChange={onDarkToggle} />
          </div>

          {/* Motion row — overrides iOS "Reduce Motion" for this app */}
          <MotionRow />

          {/* Language row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
            padding: '13px 16px',
            borderTop: '0.5px solid var(--hairline)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
              fontSize: 13, fontWeight: 600, color: 'var(--ink)',
            }}>Aع</div>
            <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textAlign: 'start' }}>
              {window.isRTL ? 'لغة الواجهة' : 'Language'}
            </div>
            <div style={{
              display: 'inline-flex', padding: 3, background: 'var(--sand)', borderRadius: 999,
              flexDirection: 'row',
            }}>
              {['en', 'ar'].map((l) => (
                <button key={l} onClick={() => onLangChange?.(l)} style={{
                  minHeight: 38, minWidth: 52, padding: '0 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600,
                  background: lang === l ? 'var(--ink)' : 'transparent',
                  color: lang === l ? 'var(--cream)' : 'var(--ink-soft)',
                  transition: 'all 180ms',
                }}>{l === 'en' ? 'English' : 'عربي'}</button>
              ))}
            </div>
          </div>

          {/* Trip reminders (push) — only when configured + supported */}
          {pushAvailable && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              flexDirection: 'row', padding: '13px 16px',
              borderTop: '0.5px solid var(--hairline)',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
                background: 'var(--cream)', border: '0.5px solid var(--hairline)',
              }}><IconBell size={16} stroke="var(--ink)" /></div>
              <div style={{ flex: 1, textAlign: 'start' }}>
                <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                  {window.isRTL ? 'تذكيرات الرحلة' : 'Trip reminders'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>
                  {pushState === 'denied'
                    ? (window.isRTL ? 'الإشعارات محظورة في إعدادات النظام' : 'Notifications blocked in system settings')
                    : (window.isRTL ? 'بطاقة الصعود وتسجيل الدخول قبل موعدها بـ 24 ساعة' : 'Boarding pass & check-in 24h before')}
                </div>
              </div>
              <AppToggle on={pushState === 'on'} onChange={togglePush} />
            </div>
          )}

          {/* Trip activity digest — only meaningful once push is on, so it
             tucks under the reminders toggle as a sub-channel. */}
          {pushAvailable && pushState === 'on' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              flexDirection: 'row', padding: '13px 16px',
              borderTop: '0.5px solid var(--hairline)',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
                background: 'var(--cream)', border: '0.5px solid var(--hairline)',
              }}><IconUsers size={16} stroke="var(--ink)" /></div>
              <div style={{ flex: 1, textAlign: 'start' }}>
                <div style={{ fontSize: 13.5, color: 'var(--ink)' }}>
                  {window.isRTL ? 'نشاط الرحلة' : 'Trip activity'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 1 }}>
                  {window.isRTL
                    ? 'عند إضافة الرفاق مصاريف أو مستندات لرحلة مشتركة'
                    : 'When crew add expenses or documents to a shared trip'}
                </div>
              </div>
              <AppToggle on={activityOn} onChange={toggleActivity} />
            </div>
          )}

          {/* Static rows */}
          <ProfileEditRows me={me} />
        </div>
      </div>

      {/* MY DETAILS — name + password, editable */}
      <MyDetailsSection me={me} email={email} onProfile={(p) => {
        setProfile(p);
        window.ACCOUNT = { ...(window.ACCOUNT || {}), profile: p };
      }} />

      {/* PRIVACY — explainer card only (no stub settings) */}
      <div style={{ padding: '18px 14px 0' }}>
        <SectionLabel>{t('privacy')}</SectionLabel>
        <div style={{
          background: 'oklch(0.50 0.08 155 / 0.08)', borderRadius: 22,
          margin: '0 8px', padding: '14px 16px',
          border: '0.5px dashed oklch(0.50 0.08 155 / 0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexDirection: 'row' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, background: 'var(--moss)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}><IconUsers size={16} stroke="#fff" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--moss)' }}>
                {t('tripScopedCollab')}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.45, textAlign: 'start' }}>
                {t('tripScopedSub')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DANGER */}
      <div style={{ padding: '18px 14px 0' }}>
        <SectionLabel>{t('account')}</SectionLabel>
        <div style={{
          background: 'var(--cream-2)', borderRadius: 22,
          margin: '0 8px', overflow: 'hidden',
          border: '0.5px solid var(--hairline)',
        }}>
          <ActionRow onClick={() => {
            window.actionSheet?.({
              title: window.isRTL ? 'إعادة تعيين وإصلاح التطبيق' : 'Reset app cache',
              message: window.isRTL ? 'بياناتك المخزنة في السحابة بأمان تام. سيُعاد تحميل التطبيق فقط لإصلاح أي مشاكل ظاهرية.' : 'Your cloud data is safe. The app will reload.',
              actions: [
                { label: window.isRTL ? 'متابعة وإعادة التعيين' : 'Reset', destructive: true, onPress: async () => {
                  try {
                    if ('caches' in window) {
                      const names = await caches.keys();
                      await Promise.all(names.map((n) => caches.delete(n)));
                    }
                    if ('serviceWorker' in navigator) {
                      const regs = await navigator.serviceWorker.getRegistrations();
                      await Promise.all(regs.map((r) => r.unregister()));
                    }
                    try { sessionStorage.clear(); } catch (_) {}
                  } finally { location.reload(); }
                }},
              ],
            });
          }} icon={<IconGear size={17} stroke="var(--ink)" />} label={window.isRTL ? 'إعادة تعيين وإصلاح التطبيق' : 'Reset app cache'} sub={window.isRTL ? 'استخدم هذا الإجراء إذا واجهت أي مشاكل في الواجهة أو الأداء' : 'Clear cache & reload if something looks broken'} />
          <ActionRow onClick={() => {
            window.actionSheet?.({
              title: t('signOut'),
              message: window.isRTL ? 'سيتم تسجيل خروجك من الحساب. يمكنك العودة وتسجيل الدخول في أي وقت.' : "You'll be signed out. You can sign back in anytime.",
              actions: [
                { label: t('signOut'), destructive: true, onPress: () => onSignOut?.() },
              ],
            });
          }} icon={<span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span>} label={t('signOut')} sub={email ? `${me.name.split(' ')[0]} · ${email}` : me.name.split(' ')[0]} />
          <ActionRow icon={<IconTrash size={17} stroke="var(--clay-deep)" />} labelColor="var(--clay-deep)" label={t('deleteAccount')} sub={t('deleteAccountSub')} last />
        </div>
      </div>

      {/* Footer imprint. The "Built in Makkah" sentiment is a real
         brand moment for a Gulf-region app and stays. What goes is the
         uppercase mono 0.16em tracking that rendered it as a barcode;
         now plain mono (matches the v-number naturally), sentence-case,
         no tracking. */}
      <div style={{ textAlign: 'center', padding: '32px 0 20px', color: 'var(--ink-mute)' }}>
        <div className="serif-italic" style={{ fontSize: 18 }}>voyage</div>
        <div className="mono" style={{ fontSize: 10.5, marginTop: 6 }}>
          {window.isRTL ? 'الإصدار 1.0.0 · صُنع بكل حب في مكة' : 'v 1.0.0 · Built in Makkah'}
        </div>
      </div>
    </div>
  );
}

// ── Install Voyage card ─────────────────────────────────────
function InstallCard() {
  const [canInstall, setCanInstall] = React.useState(!!window._deferredInstallPrompt);
  const [showIOSHelp, setShowIOSHelp] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setCanInstall(true);
    window.addEventListener('voyage:install-available', handler);
    return () => window.removeEventListener('voyage:install-available', handler);
  }, []);

  // Already installed? Don't show.
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.isIOSStandalone?.();
  if (standalone) return null;

  // No prompt + not iOS = nothing to show (e.g., desktop user who already dismissed)
  const onIOS = window.isIOS?.();
  if (!canInstall && !onIOS) return null;

  const handleInstall = async () => {
    if (window._deferredInstallPrompt) {
      window._deferredInstallPrompt.prompt();
      const { outcome } = await window._deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') window._deferredInstallPrompt = null;
      setCanInstall(false);
    } else if (onIOS) {
      setShowIOSHelp(true);
    }
  };

  return (
    <div style={{ padding: '12px 14px 0' }}>
      <div style={{
        margin: '0 8px', borderRadius: 22, padding: '14px 16px',
        background: 'linear-gradient(135deg, var(--clay) 0%, var(--clay-deep) 100%)',
        color: '#fff', boxShadow: 'var(--shadow-md)',
        display: 'flex', alignItems: 'center', gap: 12,
        flexDirection: 'row',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', fontSize: 20,
        }}>✦</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>
            {window.isRTL ? 'ثبّت تطبيق Voyage على شاشتك الرئيسية' : 'Install Voyage on your home screen'}
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.88, marginTop: 2 }}>
            {window.isRTL ? 'وصول أسرع وعمل كامل بدون اتصال بالإنترنت' : 'Faster access · works offline'}
          </div>
        </div>
        <button onClick={handleInstall} style={{
          padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
          background: '#fff', color: 'var(--clay-deep)', flexShrink: 0,
        }}>{window.isRTL ? 'تثبيت التطبيق الآن' : 'Install'}</button>
      </div>

      {/* iOS Safari instructions */}
      {showIOSHelp && (
        <div style={{
          margin: '8px 8px 0', padding: '12px 14px', borderRadius: 14,
          background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          {window.isRTL
            ? <>على iOS: اضغط زر المشاركة <b>⎙</b> في Safari ثم اختر <b>«إضافة إلى الشاشة الرئيسية»</b>.</>
            : <>On iOS: tap the Share button <b>⎙</b> in Safari, then choose <b>"Add to Home Screen"</b>.</>}
          <button onClick={() => setShowIOSHelp(false)} style={{
            display: 'block', marginTop: 8, color: 'var(--clay-deep)', fontWeight: 600, fontSize: 11.5,
          }}>{window.isRTL ? 'حسناً، فهمت' : 'Got it'}</button>
        </div>
      )}
    </div>
  );
}

// Inline emphasis for the lifetime-totals sentence inside the dark
// profile card. Mono for tabular alignment, slightly heavier weight,
// cream so the numbers carry weight without size escalation against
// the dark card surface.
function ProfileNum({ children }) {
  return (
    <span className="mono" style={{
      fontWeight: 700, color: '#fff',
      letterSpacing: '-0.005em',
    }}>{children}</span>
  );
}

// Editable profile preferences — default currency + home city.
// Saves to public.profiles. Component lives at module scope so inputs don't
// remount on every keystroke (React anti-pattern when defined inside parent).
function ProfileEditRows({ me }) {
  const [editing, setEditing] = React.useState(null);  // 'currency' | 'home' | null
  // Seed from the account cache so the chosen currency + home base show
  // immediately on every revisit (no 'USD' / 'Not set' flash before the
  // refetch lands).
  const [currency, setCurrency] = React.useState(window.ACCOUNT?.currency || window.USER_DEFAULT_CURRENCY || 'USD');
  const [home,     setHome]     = React.useState(window.ACCOUNT?.home || '');
  const [saving,   setSaving]   = React.useState(false);

  // Hydrate from server (stale-while-revalidate over the cached seed).
  React.useEffect(() => {
    if (!window.sb || !window.currentUserId) return;
    window.sb.from('profiles').select('default_currency, home_base').eq('id', window.currentUserId).single()
      .then(({ data }) => {
        if (!data) return;
        const cur = (data.default_currency || 'USD').trim();
        const hb  = data.home_base || '';
        setCurrency(cur);
        setHome(hb);
        window.ACCOUNT = { ...(window.ACCOUNT || {}), currency: cur, home: hb };
      }).catch(() => {});
  }, []);

  const save = async (fields) => {
    setSaving(true);
    try {
      const { error } = await window.sb.from('profiles').update(fields).eq('id', window.currentUserId);
      if (error) throw error;
      // Mirror the change into the global preference cache so fmtMoney
      // picks up the new default_currency without waiting for a reload.
      // (Without this, the user changes their default currency and the
      // Trips home / Insights keep formatting in the old currency until
      // they reload the app.)
      if (fields.default_currency) {
        window.USER_DEFAULT_CURRENCY = fields.default_currency.trim().toUpperCase();
      }
      // Keep the account cache in lockstep so navigating away and back
      // shows the saved value, not the pre-save one.
      window.ACCOUNT = {
        ...(window.ACCOUNT || {}),
        ...(fields.default_currency != null ? { currency: fields.default_currency.trim() } : {}),
        ...('home_base' in fields ? { home: fields.home_base || '' } : {}),
      };
      // Tell every screen reading the profile (Trips home aggregate,
      // Insights, profile card here) to re-render with the new values.
      window.notifyDataChange?.();
      window.toast?.(window.isRTL ? 'تم حفظ التعديلات بنجاح' : 'Saved', 'success');
      setEditing(null);
    } catch (err) {
      window.toast?.(err.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const CURRENCIES = window.CURRENCIES;
  const rowStyle = {
    display: 'flex', alignItems: 'center', gap: 12, flexDirection: 'row',
    padding: '13px 16px', width: '100%', textAlign: 'start',
    borderTop: '0.5px solid var(--hairline)',
  };
  const iconBox = {
    width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
    background: 'var(--cream)', border: '0.5px solid var(--hairline)',
  };
  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '0.5px solid var(--hairline-2)', background: 'var(--cream)',
    color: 'var(--ink)', fontSize: 14, outline: 'none', textAlign: 'start',
  };

  return (
    <>
      {/* Default currency — picker */}
      <div>
        <button onClick={() => setEditing(editing === 'currency' ? null : 'currency')} style={rowStyle}>
          <div style={iconBox}><IconWallet size={16} stroke="var(--ink)" /></div>
          <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{t('defaultCurrency')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{currency}</span>
            <span style={{ transform: editing === 'currency' ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', display: 'inline-block' }}>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </span>
          </div>
        </button>
        {editing === 'currency' && (
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CURRENCIES.map((c) => (
                <button key={c} onClick={() => setCurrency(c)} style={{
                  padding: '6px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 500,
                  background: currency === c ? 'var(--ink)' : 'var(--cream)',
                  color: currency === c ? 'var(--cream)' : 'var(--ink-soft)',
                  border: '0.5px solid var(--hairline)',
                }}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <button disabled={saving} onClick={() => save({ default_currency: currency })} style={{
                flex: 1, padding: '10px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                background: saving ? 'var(--ink-mute)' : 'var(--ink)', color: 'var(--cream)',
              }}>{saving ? '…' : (window.isRTL ? 'حفظ' : 'Save')}</button>
              <button disabled={saving} onClick={() => setEditing(null)} style={{
                padding: '10px 16px', borderRadius: 10, fontSize: 12.5,
                background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
              }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Home base — free text */}
      <div>
        <button onClick={() => setEditing(editing === 'home' ? null : 'home')} style={rowStyle}>
          <div style={iconBox}><IconCompass size={16} stroke="var(--ink)" /></div>
          <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)' }}>{t('homeBase')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>{home || (window.isRTL ? 'لم تُحدد بعد' : 'Not set')}</span>
            <span style={{ transform: editing === 'home' ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', display: 'inline-block' }}>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </span>
          </div>
        </button>
        {editing === 'home' && (
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={home} onChange={(e) => setHome(e.target.value)}
              placeholder={window.isRTL ? 'مثلاً: مكة، الرياض، جدة' : 'e.g. Makkah, Riyadh, Dubai'}
              style={inputStyle} />
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <button disabled={saving} onClick={() => save({ home_base: home.trim() || null })} style={{
                flex: 1, padding: '10px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                background: saving ? 'var(--ink-mute)' : 'var(--ink)', color: 'var(--cream)',
              }}>{saving ? '…' : (window.isRTL ? 'حفظ' : 'Save')}</button>
              <button disabled={saving} onClick={() => setEditing(null)} style={{
                padding: '10px 16px', borderRadius: 10, fontSize: 12.5,
                background: 'var(--cream)', border: '0.5px solid var(--hairline-2)', color: 'var(--ink-soft)',
              }}>{window.isRTL ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Object.assign(window, { ScreenAppSettings, InstallCard, ProfileEditRows });


// ── My details: change name, change password ──────────────────────────
// Name updates the profile (initials follow). Password asks for the
// CURRENT one first and re-checks it with Supabase before setting the new
// one, so a borrowed unlocked phone can't silently take over the account.
function MyDetailsSection({ me, email, onProfile }) {
  const ar = window.isRTL;
  const [open, setOpen] = React.useState(null); // 'name' | 'password' | null
  const shell = document.getElementById('app-shell') || document.body;
  return (
    <div style={{ padding: '18px 14px 0' }}>
      <SectionLabel>{ar ? 'بياناتي' : 'My details'}</SectionLabel>
      <div style={{ background: 'var(--cream-2)', borderRadius: 22, margin: '0 8px', overflow: 'hidden', border: '0.5px solid var(--hairline)' }}>
        <ActionRow last={false} onClick={() => setOpen('name')}
          icon={<IconUsers size={16} stroke="var(--ink)" />}
          label={ar ? 'الاسم' : 'Name'} sub={me.name} />
        <ActionRow onClick={() => setOpen('password')}
          icon={<span style={{ fontSize: 15 }}>🔑</span>}
          label={ar ? 'كلمة المرور' : 'Password'} sub={ar ? 'تغيير كلمة المرور' : 'Change your password'} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: '0.5px solid var(--hairline)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--cream)', border: '0.5px solid var(--hairline)', fontSize: 15 }}>@</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{ar ? 'البريد الإلكتروني' : 'Email'}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 1 }}>{email || '—'}</div>
          </div>
        </div>
      </div>
      {open && ReactDOM.createPortal(
        <Sheet open onClose={() => setOpen(null)} height={open === 'password' ? 0.72 : 0.5}
          title={open === 'name' ? (ar ? 'تعديل الاسم' : 'Edit name') : (ar ? 'تغيير كلمة المرور' : 'Change password')}>
          {open === 'name'
            ? <EditNameForm me={me} onDone={(p) => { if (p) onProfile(p); setOpen(null); }} />
            : <ChangePasswordForm email={email} onDone={() => setOpen(null)} />}
        </Sheet>, shell)}
    </div>
  );
}

const detailField = {
  width: '100%', padding: '13px 14px', borderRadius: 14, fontSize: 16,
  border: '0.5px solid var(--hairline-2)', background: 'var(--cream-2)', color: 'var(--ink)',
  outline: 'none', fontFamily: 'var(--sans)', textAlign: 'start', boxSizing: 'border-box',
};
const detailLabel = { fontSize: 13, color: 'var(--ink-mute)', margin: '14px 2px 6px' };
const detailBtn = (busy) => ({
  marginTop: 20, width: '100%', minHeight: 50, borderRadius: 16,
  background: 'var(--ink)', color: 'var(--cream)', fontSize: 15, fontWeight: 600, opacity: busy ? 0.6 : 1,
});

function EditNameForm({ me, onDone }) {
  const ar = window.isRTL;
  const [name, setName] = React.useState(me.name === 'You' ? '' : (me.name || ''));
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const save = async () => {
    const clean = name.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) { setErr(ar ? 'اكتب اسمك' : 'Enter your name'); return; }
    setBusy(true); setErr(null);
    const initials = clean.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    try {
      const { error } = await window.sb.from('profiles').update({ name: clean, initials }).eq('id', window.currentUserId);
      if (error) throw error;
      // Keep every list that shows this member in step.
      (window.MEMBERS || []).forEach((m) => { if (m.id === window.currentUserId) { m.name = clean; m.initials = initials; } });
      window.notifyDataChange?.();
      window.toast?.(ar ? 'تم تحديث الاسم' : 'Name updated', 'success');
      onDone({ ...me, name: clean, initials });
    } catch (e) { setErr(e.message || 'Failed'); setBusy(false); }
  };
  return (
    <div style={{ padding: '4px 22px 28px' }}>
      <div style={detailLabel}>{ar ? 'الاسم الذي يظهر لأصحابك في الرحلات' : 'The name your trip mates see'}</div>
      <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" style={detailField} />
      {err && <div style={{ color: 'var(--clay-deep)', fontSize: 13, marginTop: 10 }}>{err}</div>}
      <button disabled={busy} onClick={save} style={detailBtn(busy)}>{busy ? '…' : (ar ? 'حفظ' : 'Save')}</button>
    </div>
  );
}

function ChangePasswordForm({ email, onDone }) {
  const ar = window.isRTL;
  const [cur, setCur] = React.useState('');
  const [next, setNext] = React.useState('');
  const [again, setAgain] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const save = async () => {
    setErr(null);
    if (!cur) { setErr(ar ? 'اكتب كلمة المرور الحالية' : 'Enter your current password'); return; }
    if (next.length < 8) { setErr(ar ? 'كلمة المرور الجديدة لازم تكون 8 أحرف على الأقل' : 'New password needs at least 8 characters'); return; }
    if (next !== again) { setErr(ar ? 'كلمتا المرور الجديدتان غير متطابقتين' : "The new passwords don't match"); return; }
    if (next === cur) { setErr(ar ? 'كلمة المرور الجديدة نفس الحالية' : 'New password is the same as the current one'); return; }
    setBusy(true);
    try {
      // 1) Prove the current password (re-authenticates this same user).
      const { error: authErr } = await window.sb.auth.signInWithPassword({ email, password: cur });
      if (authErr) { setErr(ar ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is incorrect'); setBusy(false); return; }
      // 2) Set the new one.
      const { error } = await window.sb.auth.updateUser({ password: next });
      if (error) throw error;
      window.toast?.(ar ? 'تم تغيير كلمة المرور' : 'Password changed', 'success');
      onDone();
    } catch (e) { setErr(e.message || 'Failed'); setBusy(false); }
  };
  const type = show ? 'text' : 'password';
  return (
    <div style={{ padding: '4px 22px 28px' }}>
      <div style={detailLabel}>{ar ? 'كلمة المرور الحالية' : 'Current password'}</div>
      <input type={type} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" style={detailField} />
      <div style={detailLabel}>{ar ? 'كلمة المرور الجديدة (8 أحرف على الأقل)' : 'New password (8+ characters)'}</div>
      <input type={type} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" style={detailField} />
      <div style={detailLabel}>{ar ? 'أعد كتابة الجديدة' : 'Repeat the new password'}</div>
      <input type={type} value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" style={detailField} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: 'var(--ink-soft)', minHeight: 36 }}>
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} style={{ width: 18, height: 18 }} />
        {ar ? 'إظهار كلمات المرور' : 'Show passwords'}
      </label>
      {err && <div style={{ color: 'var(--clay-deep)', fontSize: 13, marginTop: 10 }}>{err}</div>}
      <button disabled={busy} onClick={save} style={detailBtn(busy)}>{busy ? '…' : (ar ? 'تغيير كلمة المرور' : 'Change password')}</button>
    </div>
  );
}
