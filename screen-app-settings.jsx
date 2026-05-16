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

function ScreenAppSettings({ go, onSignOut, dark = false, lang = 'en', onDarkToggle, onLangChange }) {
  const [profile, setProfile] = React.useState(window.MEMBERS?.[0] || null);

  React.useEffect(() => {
    // Load the current user's own profile directly
    const uid = window.currentUserId;
    if (!uid || !window.sb) return;
    window.sb.from('profiles').select('*').eq('id', uid).single()
      .then(({ data }) => { if (data) setProfile({ id: data.id, name: data.name, initials: data.initials, hue: data.avatar_hue || 35 }); })
      .catch(() => {});
  }, []);

  const me = profile || { id: window.currentUserId || 'me', name: 'You', initials: 'ME', hue: 35 };
  const g  = window.GLOBAL || {
    countries: 0, continents: 0, days: 0, lifetimeUSD: 0,
    longestTrip: { name: '--', days: 0 },
    topCategory: { name: '--', usd: 0, pct: 0 },
    byContinent: [], yearly: [],
  };

  return (
    <div data-screen-label="App Settings" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      {/* HEADER */}
      <div style={{
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
        <div className="serif-italic" style={{ fontSize: 32 }}>{t('account')}</div>
        <button style={{
          width: 36, height: 36, borderRadius: 999, background: 'var(--cream-2)',
          border: '0.5px solid var(--hairline)', display: 'grid', placeItems: 'center',
        }}><IconSearch size={15} stroke="var(--ink-soft)" /></button>
      </div>

      {/* PROFILE CARD — overflow avatar + dark backdrop */}
      <div style={{ padding: '0 14px 14px' }}>
        <div style={{
          position: 'relative', borderRadius: 28,
          padding: window.isRTL ? '22px 100px 20px 22px' : '22px 22px 20px 100px',
          background: 'linear-gradient(140deg, oklch(0.32 0.04 30) 0%, oklch(0.20 0.04 280) 100%)',
          color: '#fff', boxShadow: 'var(--shadow-card)', overflow: 'visible',
        }}>
          {/* Overflowing avatar — bleeds off left (or right in RTL) */}
          <div style={{
            position: 'absolute', top: '50%',
            insetInlineStart: -10,
            transform: 'translateY(-50%) rotate(-4deg)',
            width: 86, height: 86, borderRadius: 22, overflow: 'hidden',
            background: `linear-gradient(140deg, oklch(0.78 0.09 ${me.hue}) 0%, oklch(0.50 0.13 ${me.hue}) 100%)`,
            display: 'grid', placeItems: 'center',
            color: '#fff', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 32,
            boxShadow: '0 10px 22px rgba(0,0,0,0.4)',
            border: '4px solid var(--cream)',
          }}>{me.initials}</div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.72 }}>
              {t('proTraveler')}
            </div>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.05, marginTop: 2 }}>{me.name}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>mira@voyage.app</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexDirection: 'row' }}>
              <span style={{
                padding: '3px 9px', borderRadius: 999,
                background: 'rgba(255,255,255,0.08)', fontSize: 10.5, fontWeight: 500,
                fontFamily: 'var(--mono)', letterSpacing: '0.1em',
              }}>{g.countries} CTRY</span>
              <span style={{
                padding: '3px 9px', borderRadius: 999,
                background: 'rgba(255,255,255,0.08)', fontSize: 10.5, fontWeight: 500,
                fontFamily: 'var(--mono)', letterSpacing: '0.1em',
              }}>{g.days}D</span>
              <span style={{
                padding: '3px 9px', borderRadius: 999,
                background: 'rgba(255,255,255,0.08)', fontSize: 10.5, fontWeight: 500,
                fontFamily: 'var(--mono)', letterSpacing: '0.1em',
              }}>{window.TRIPS.length} TRIPS</span>
            </div>
          </div>
        </div>
      </div>

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
              {window.isRTL ? 'اللغة' : 'Language'}
            </div>
            <div style={{
              display: 'inline-flex', padding: 3, background: 'var(--sand)', borderRadius: 999,
              flexDirection: 'row',
            }}>
              {['en', 'ar'].map((l) => (
                <button key={l} onClick={() => onLangChange?.(l)} style={{
                  padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                  background: lang === l ? 'var(--ink)' : 'transparent',
                  color: lang === l ? 'var(--cream)' : 'var(--ink-soft)',
                  transition: 'all 180ms',
                }}>{l === 'en' ? 'EN' : 'عر'}</button>
              ))}
            </div>
          </div>

          {/* Static rows */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
            padding: '13px 16px', borderTop: '0.5px solid var(--hairline)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
            }}><IconWallet size={16} stroke="var(--ink)" /></div>
            <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textAlign: 'start' }}>
              {t('defaultCurrency')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>USD</span>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            flexDirection: 'row',
            padding: '13px 16px', borderTop: '0.5px solid var(--hairline)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
              background: 'var(--cream)', border: '0.5px solid var(--hairline)',
            }}><IconCompass size={16} stroke="var(--ink)" /></div>
            <div style={{ flex: 1, fontSize: 13.5, color: 'var(--ink)', textAlign: 'start' }}>
              {t('homeBase')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row' }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>Amsterdam</span>
              <IconChevron size={13} stroke="var(--ink-mute)" />
            </div>
          </div>
        </div>
      </div>

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
          <ActionRow onClick={async () => {
            if (!confirm(window.isRTL ? 'مسح ذاكرة التخزين المؤقت وإعادة التحميل؟ بياناتك في السحابة آمنة.' : 'Clear cache and reload? Your cloud data is safe.')) return;
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
          }} icon={<IconGear size={17} stroke="var(--ink)" />} label={window.isRTL ? 'إعادة تعيين التطبيق' : 'Reset app cache'} sub={window.isRTL ? 'مسح والتحميل من جديد إذا حدث خلل' : 'Clear cache & reload if something looks broken'} />
          <ActionRow onClick={onSignOut} icon={<span className="icon-flip"><IconBack size={17} stroke="var(--ink)" /></span>} label={t('signOut')}  sub={`Last seen ${me.name.split(' ')[0]} · Amsterdam`} />
          <ActionRow icon={<IconTrash size={17} stroke="var(--clay-deep)" />} labelColor="var(--clay-deep)" label={t('deleteAccount')} sub={t('deleteAccountSub')} last />
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '32px 0 20px', color: 'var(--ink-mute)' }}>
        <div className="serif-italic" style={{ fontSize: 18 }}>voyage</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', marginTop: 4 }}>
          v 2.4.1 · BUILT IN AMSTERDAM
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
            {window.isRTL ? 'ثبّت Voyage على شاشتك الرئيسية' : 'Install Voyage on your home screen'}
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.88, marginTop: 2 }}>
            {window.isRTL ? 'وصول أسرع وعمل بدون إنترنت' : 'Faster access · works offline'}
          </div>
        </div>
        <button onClick={handleInstall} style={{
          padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
          background: '#fff', color: 'var(--clay-deep)', flexShrink: 0,
        }}>{window.isRTL ? 'تثبيت' : 'Install'}</button>
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
          }}>{window.isRTL ? 'تم' : 'Got it'}</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ScreenAppSettings, InstallCard });
