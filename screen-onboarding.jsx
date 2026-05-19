// First-run onboarding — 3-step flow shown to new sign-ups.
// Step 1: Welcome + feature highlights
// Step 2: Name + home base + default currency (Gulf-smart defaults)
// Step 3: Create-first-trip CTA or skip → trips list

function ScreenOnboarding({ onComplete, onCreateTrip }) {
  const [step, setStep]   = React.useState(1);
  const [name, setName]   = React.useState('');
  const [home, setHome]   = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [saving, setSaving] = React.useState(false);
  const TOTAL = 3;

  // Smart defaults: detect Gulf timezone → suggest SAR + Makkah
  React.useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const gulfTz = /Riyadh|Mecca|Makkah|Dubai|Doha|Kuwait|Bahrain|Muscat|Abu_Dhabi/i;
      if (gulfTz.test(tz)) {
        setCurrency('SAR');
        if (tz.includes('Riyadh') || tz.includes('Mecca') || tz.includes('Makkah')) setHome('Makkah');
        else if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) { setHome('Dubai'); setCurrency('AED'); }
        else if (tz.includes('Kuwait')) { setHome('Kuwait City'); setCurrency('KWD'); }
        else if (tz.includes('Doha')) { setHome('Doha'); setCurrency('USD'); }
        else if (tz.includes('Muscat')) { setHome('Muscat'); setCurrency('USD'); }
      }
    } catch (_) {}
    // Try to grab the user's name from auth meta or profile
    if (window.sb && window.currentUserId) {
      window.sb.auth.getUser().then(({ data }) => {
        const meta = data?.user?.user_metadata;
        if (meta?.name && !name) setName(meta.name);
      }).catch(() => {});
    }
  }, []);

  const persistAndFinish = async (alsoCreateTrip = false) => {
    setSaving(true);
    try {
      if (window.sb && window.currentUserId) {
        const updates = { default_currency: currency };
        if (name.trim()) {
          updates.name = name.trim();
          updates.initials = name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'V';
        }
        if (home.trim()) updates.home_base = home.trim();
        await window.sb.from('profiles').update(updates).eq('id', window.currentUserId);
      }
      try { localStorage.setItem('voyage:onboarded', '1'); } catch (_) {}
      window.toast?.(window.isRTL ? 'مرحباً بك' : 'Welcome aboard', 'success');
      onComplete?.(alsoCreateTrip);
    } catch (err) {
      window.toast?.(err.message || 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const CURRENCIES = ['USD','SAR','EUR','GBP','JPY','AED','EGP','MAD','TRY','INR','CHF','KWD','BHD'];

  return (
    <div data-screen-label="Onboarding" style={{
      position: 'relative', minHeight: '100%',
      background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Aurora-tinted top half for visual richness without animation cost */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360,
        background:
          'radial-gradient(ellipse 70% 60% at 25% 30%, rgba(255,138,92,0.18) 0%, transparent 60%),' +
          'radial-gradient(ellipse 50% 40% at 80% 10%, rgba(107,123,255,0.15) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Top bar — step indicator + skip */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.14em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', fontWeight: 500,
        }}>
          {t('obStep').replace('{a}', step).replace('{b}', TOTAL)}
        </div>
        {step < TOTAL && (
          <button onClick={() => persistAndFinish(false)} style={{
            fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500,
            padding: '6px 12px', borderRadius: 999,
          }}>{t('obSkip')}</button>
        )}
      </div>

      {/* Step body — flex-1 so content stays centered, button stays at bottom */}
      <div style={{
        flex: 1, position: 'relative', zIndex: 2,
        padding: '12px 24px 0',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      }}>
        {step === 1 && <StepWelcome />}
        {step === 2 && <StepBasics name={name} setName={setName} home={home} setHome={setHome} currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} />}
        {step === 3 && <StepDone name={name} home={home} currency={currency} />}
      </div>

      {/* Pagination dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '12px 0 4px',
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 999,
            background: i === step ? 'var(--ink)' : 'var(--sand-deep)',
            transition: 'all 280ms cubic-bezier(.32,.72,0,1)',
          }} />
        ))}
      </div>

      {/* Bottom action area */}
      <div style={{
        padding: '12px 22px calc(28px + env(safe-area-inset-bottom))',
        display: 'flex', gap: 10,
      }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} disabled={saving} style={{
            padding: '15px 22px', borderRadius: 16,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline-2)',
            color: 'var(--ink-soft)', fontSize: 13.5, fontWeight: 500,
          }}>{t('obBack')}</button>
        )}
        {step === 1 && (
          <button onClick={() => setStep(2)} style={{
            flex: 1, padding: '15px', borderRadius: 16,
            background: 'var(--ink)', color: 'var(--cream)',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 8px 20px rgba(34,28,22,0.3)',
          }}>{t('obGetStarted')}</button>
        )}
        {step === 2 && (
          <button onClick={() => setStep(3)} disabled={saving} style={{
            flex: 1, padding: '15px', borderRadius: 16,
            background: 'var(--ink)', color: 'var(--cream)',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 8px 20px rgba(34,28,22,0.3)',
          }}>{t('obContinue')}</button>
        )}
        {step === 3 && (
          <>
            <button onClick={() => persistAndFinish(false)} disabled={saving} style={{
              flex: 1, padding: '15px', borderRadius: 16,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline-2)',
              color: 'var(--ink)', fontSize: 13, fontWeight: 500,
            }}>{t('obExplore')}</button>
            <button onClick={() => persistAndFinish(true)} disabled={saving} style={{
              flex: 1.4, padding: '15px', borderRadius: 16,
              background: 'var(--clay)', color: '#fff',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IconPlus size={14} stroke="#fff" /> {t('obCreateTrip')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Welcome ─────────────────────────────────────────
function StepWelcome() {
  const features = [
    { icon: <IconSwap size={20} stroke="#fff" />,    tint: 'var(--clay)',   title: t('obFeature1Title'),  sub: t('obFeature1Sub') },
    { icon: <IconUsers size={20} stroke="#fff" />,   tint: 'var(--moss)',   title: t('obFeature2Title'),  sub: t('obFeature2Sub') },
    { icon: <IconSparkle size={20} stroke="#fff" />, tint: 'var(--indigo)', title: t('obFeature3Title'),  sub: t('obFeature3Sub') },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
      <div>
        <div className="serif-italic" style={{
          fontSize: 46, lineHeight: 1.02, letterSpacing: '-0.02em',
          color: 'var(--ink)', whiteSpace: 'pre-line',
        }}>{t('obWelcomeTitle')}</div>
        <div style={{
          fontSize: 14, color: 'var(--ink-soft)', marginTop: 10, maxWidth: 320, lineHeight: 1.55,
        }}>{t('obWelcomeSub')}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', borderRadius: 16,
            background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: f.tint, display: 'grid', placeItems: 'center',
              flexShrink: 0, boxShadow: 'var(--shadow-sm)',
            }}>{f.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{f.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2, lineHeight: 1.45 }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Basics ──────────────────────────────────────────
function StepBasics({ name, setName, home, setHome, currency, setCurrency, currencies }) {
  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 14,
    border: '0.5px solid var(--hairline-2)', background: 'var(--cream-2)',
    color: 'var(--ink)', fontSize: 16, outline: 'none',
    textAlign: 'start',
  };
  const labelStyle = {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
    color: 'var(--ink-mute)', marginBottom: 6, display: 'block',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 16 }}>
      <div>
        <div className="serif-italic" style={{ fontSize: 36, lineHeight: 1.05, color: 'var(--ink)' }}>
          {t('obBasicsTitle')}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>{t('obBasicsSub')}</div>
      </div>
      <div>
        <label style={labelStyle}>{t('obNameLabel')}</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder={t('obNamePlaceholder')} style={inputStyle} autoFocus />
      </div>
      <div>
        <label style={labelStyle}>{t('obHomeLabel')}</label>
        <input value={home} onChange={(e) => setHome(e.target.value)}
          placeholder={t('obHomePlaceholder')} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>{t('obCurrencyLabel')}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {currencies.map((c) => (
            <button key={c} onClick={() => setCurrency(c)} style={{
              padding: '8px 13px', borderRadius: 10, fontSize: 12, fontWeight: 500,
              background: currency === c ? 'var(--ink)' : 'var(--cream-2)',
              color: currency === c ? 'var(--cream)' : 'var(--ink-soft)',
              border: '0.5px solid var(--hairline)',
            }}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Done ────────────────────────────────────────────
function StepDone({ name, home, currency }) {
  const first = (name || '').trim().split(' ')[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 30 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, margin: '0 auto 16px', borderRadius: 24,
          background: 'linear-gradient(140deg, var(--clay) 0%, var(--clay-deep) 100%)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 14px 32px oklch(0.62 0.13 35 / 0.45)',
        }}>
          <IconCheck size={36} stroke="#fff" />
        </div>
        <div className="serif-italic" style={{
          fontSize: 42, lineHeight: 1.05, color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>
          {first ? `${first}, ${t('obDoneTitle').toLowerCase()}` : t('obDoneTitle')}
        </div>
        <div style={{
          fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 8, maxWidth: 280, marginInline: 'auto', lineHeight: 1.55,
        }}>{t('obDoneSub')}</div>
      </div>
      {/* Recap card */}
      <div style={{
        background: 'var(--cream-2)', border: '0.5px solid var(--hairline)',
        borderRadius: 18, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {[
          { label: window.isRTL ? 'الاسم' : 'Name',     value: name || '—' },
          { label: t('homeBase'),                       value: home || '—' },
          { label: t('defaultCurrency'),                value: currency },
        ].map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            borderTop: i ? '0.5px solid var(--hairline)' : 'none',
            paddingTop: i ? 10 : 0,
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--ink-mute)', textTransform: 'uppercase',
            }}>{row.label}</span>
            <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ScreenOnboarding = ScreenOnboarding;
