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

  // Smart defaults — Saudi-first audience: every Gulf timezone defaults
  // currency to SAR. Home-base city is detected from the timezone.
  React.useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const gulfTz = /Riyadh|Mecca|Makkah|Dubai|Doha|Kuwait|Bahrain|Muscat|Abu_Dhabi|Qatar|Manama/i;
      if (gulfTz.test(tz)) {
        setCurrency('SAR');
        if      (tz.includes('Riyadh') || tz.includes('Mecca') || tz.includes('Makkah')) setHome('Makkah');
        else if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) setHome('Dubai');
        else if (tz.includes('Kuwait'))                            setHome('Kuwait City');
        else if (tz.includes('Doha') || tz.includes('Qatar'))      setHome('Doha');
        else if (tz.includes('Muscat'))                            setHome('Muscat');
        else if (tz.includes('Bahrain') || tz.includes('Manama'))  setHome('Manama');
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
        // Prime the global preference cache so the very next render of
        // Trips home / Insights formats money in the chosen currency
        // instead of USD. Onboarding hands the user off to those views
        // directly via onComplete.
        window.USER_DEFAULT_CURRENCY = (updates.default_currency || 'USD').trim().toUpperCase();
      }
      try { localStorage.setItem('voyage:onboarded', '1'); } catch (_) {}
      window.toast?.(window.isRTL ? 'أهلاً بك في Voyage!' : 'Welcome aboard', 'success');
      onComplete?.(alsoCreateTrip);
    } catch (err) {
      window.toast?.(err.message || 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const CURRENCIES = window.CURRENCIES;

  return (
    <div data-screen-label="Onboarding" style={{
      position: 'relative', minHeight: '100%',
      background: 'var(--cream)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Atmospheric warm wash for the onboarding entrance. Was a dual-
         radial (clay + indigo) -- the "dual-aurora SaaS gradient" PRODUCT.md
         flags. Now a single, slightly larger clay-toned radial centered
         high-right, keeping the brand-moment richness without the
         saturated AI shape. The first impression of the app deserves
         atmosphere; it doesn't need two competing chromas. */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 360,
        background:
          'radial-gradient(ellipse 85% 70% at 50% 18%, rgba(255,138,92,0.20) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Top bar — step indicator + skip */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: 'max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {/* Step indicator was uppercase mono 0.14em tracked. The numbers
           are load-bearing for the flow but the eyebrow shape isn't —
           now sans semibold sentence-case. */}
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: 'var(--ink-soft)',
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

      {/* Bottom action area — on the last step the main action is "create
         a trip"; exploring first is a quieter text button under it. */}
      <div style={{
        padding: '12px 22px calc(22px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} disabled={saving} style={{
              minHeight: 52, padding: '0 22px', borderRadius: 16,
              background: 'var(--cream-2)', border: '0.5px solid var(--hairline-2)',
              color: 'var(--ink-soft)', fontSize: 14, fontWeight: 500,
            }}>{t('obBack')}</button>
          )}
          {step < TOTAL ? (
            <button onClick={() => setStep(step + 1)} disabled={saving} style={{
              flex: 1, minHeight: 52, borderRadius: 16,
              background: 'var(--ink)', color: 'var(--cream)',
              fontSize: 15, fontWeight: 600,
              boxShadow: '0 8px 20px rgba(34,28,22,0.3)',
            }}>{step === 1 ? t('obGetStarted') : t('obContinue')}</button>
          ) : (
            <button onClick={() => persistAndFinish(true)} disabled={saving} style={{
              flex: 1, minHeight: 52, borderRadius: 16,
              background: 'var(--clay)', color: '#fff',
              fontSize: 15, fontWeight: 700,
              boxShadow: '0 8px 20px oklch(0.62 0.13 35 / 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IconPlus size={14} stroke="#fff" /> {t('obCreateTrip')}
            </button>
          )}
        </div>
        {step === TOTAL && (
          <button onClick={() => persistAndFinish(false)} disabled={saving} style={{
            minHeight: 44, background: 'transparent', color: 'var(--ink-soft)', fontSize: 14, fontWeight: 600,
          }}>{t('obExplore')}</button>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Welcome — what the app does for the group ─────────
// Each feature wears the colour it has in the app: the card, the pass,
// the plan.
function StepWelcome() {
  const features = [
    { glyph: '💳', bg: 'linear-gradient(135deg, #d9ae55 0%, #8a6420 100%)', title: t('obFeature1Title'), sub: t('obFeature1Sub') },
    { glyph: '✈️', bg: (window.DOC_PASS_BG || {}).flights || 'linear-gradient(135deg, #2b4a8f 0%, #172447 100%)', title: t('obFeature2Title'), sub: t('obFeature2Sub') },
    { glyph: '🗓️', bg: 'linear-gradient(135deg, oklch(0.66 0.13 35) 0%, oklch(0.46 0.12 32) 100%)', title: t('obFeature3Title'), sub: t('obFeature3Sub') },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16 }}>
      <div>
        <div className="serif-italic" style={{
          fontSize: 46, lineHeight: 1.02, letterSpacing: '-0.02em',
          color: 'var(--ink)', whiteSpace: 'pre-line',
        }}>{t('obWelcomeTitle')}</div>
        <div style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginTop: 10, maxWidth: 320, lineHeight: 1.55 }}>{t('obWelcomeSub')}</div>
      </div>
      <div className="v-list" style={_obCard}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingInlineStart: 14 }}>
            <span aria-hidden="true" style={{
              width: 44, height: 44, borderRadius: 13, background: f.bg, flexShrink: 0,
              display: 'grid', placeItems: 'center', fontSize: 21, lineHeight: 1,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 14px -8px rgba(0,0,0,0.5)',
            }}>{f.glyph}</span>
            <span style={{
              flex: 1, minWidth: 0, paddingTop: 14, paddingBottom: 14, paddingInlineEnd: 14,
              borderTop: i ? '0.5px solid var(--hairline)' : 'none',
            }}>
              <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{f.title}</span>
              <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 3, lineHeight: 1.5 }}>{f.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const _obCard = {
  background: 'var(--cream-2)', borderRadius: 22, border: '0.5px solid var(--hairline)',
  boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
};

// A row in the settings look: icon tile · label · the field at the end.
function ObRow({ icon, tint, label, htmlFor, first, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingInlineStart: 14 }}>
      {window.SetIcon ? <window.SetIcon tint={tint}>{icon}</window.SetIcon> : null}
      <div style={{
        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10,
        minHeight: 54, paddingTop: 8, paddingBottom: 8, paddingInlineEnd: 14,
        borderTop: first ? 'none' : '0.5px solid var(--hairline)',
      }}>
        <label htmlFor={htmlFor} style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', flexShrink: 0, whiteSpace: 'nowrap' }}>{label}</label>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Step 2: Basics — name, city, currency ───────────────────
function StepBasics({ name, setName, home, setHome, currency, setCurrency, currencies }) {
  const ar = window.isRTL;
  const S = window.SET_TINT || {};
  const endInput = {
    width: '100%', minWidth: 0, border: 'none', background: 'transparent', color: 'var(--ink)',
    fontSize: 16, outline: 'none', textAlign: 'end', padding: 0, fontFamily: 'var(--sans)',
  };
  const curName = (c) => { try { return new Intl.DisplayNames([ar ? 'ar' : 'en'], { type: 'currency' }).of(c); } catch (_) { return ''; } };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 16 }}>
      <div>
        <div className="serif-italic" style={{ fontSize: 36, lineHeight: 1.05, color: 'var(--ink)' }}>{t('obBasicsTitle')}</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 6 }}>{t('obBasicsSub')}</div>
      </div>
      <div style={_obCard}>
        <ObRow first icon={<IconUser size={16} stroke="#fff" />} tint={S.indigo} label={t('obNameLabel')} htmlFor="ob-name">
          <input id="ob-name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('obNamePlaceholder')} style={endInput} autoFocus />
        </ObRow>
        <ObRow icon={<IconHome size={16} stroke="#fff" />} tint={S.teal} label={t('obHomeLabel')} htmlFor="ob-home">
          <input id="ob-home" value={home} onChange={(e) => setHome(e.target.value)}
            placeholder={t('obHomePlaceholder')} style={endInput} />
        </ObRow>
        <ObRow icon={<IconSwap size={16} stroke="#fff" />} tint={S.orange} label={t('obCurrencyLabel')} htmlFor="ob-cur">
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0, maxWidth: '100%' }}>
            <span style={{ fontSize: 14.5, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{currency}</span>
              {curName(currency) ? ` · ${curName(currency)}` : ''}
            </span>
            <span style={{ display: 'inline-flex', transform: 'rotate(90deg)', flexShrink: 0 }}><IconChevron size={12} stroke="var(--ink-mute)" /></span>
            <select id="ob-cur" value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label={t('obCurrencyLabel')}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, fontSize: 16 }}>
              {currencies.map((c) => <option key={c} value={c}>{c}{curName(c) ? ` — ${curName(c)}` : ''}</option>)}
            </select>
          </span>
        </ObRow>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-mute)', padding: '0 6px', lineHeight: 1.55, marginTop: -8 }}>
        {ar ? 'الميزانيات والمبالغ تطلع لك بهالعملة، وتقدر تغيّرها بعدين من صفحة الحساب.' : 'Budgets and amounts show in this currency — change it any time in Account.'}
      </div>
    </div>
  );
}

// ── Step 3: Done — a recap and where to go next ─────────────
function StepDone({ name, home, currency }) {
  const ar = window.isRTL;
  const first = (name || '').trim().split(' ')[0];
  const rows = [
    { label: t('obNameLabel'), value: name || '—' },
    { label: t('obHomeLabel'), value: home || '—' },
    { label: t('obCurrencyLabel'), value: currency },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 30 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, margin: '0 auto 16px', borderRadius: 24,
          background: 'linear-gradient(140deg, var(--clay) 0%, var(--clay-deep) 100%)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 14px 32px oklch(0.62 0.13 35 / 0.45)',
        }}>
          <IconCheck size={36} stroke="#fff" />
        </div>
        <div className="serif-italic" style={{ fontSize: 40, lineHeight: 1.08, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          {first ? (ar ? `جاهز يا ${first}!` : `${first}, you're ready`) : t('obDoneTitle')}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 8, maxWidth: 300, marginInline: 'auto', lineHeight: 1.6 }}>{t('obDoneSub')}</div>
      </div>
      <div style={_obCard}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            margin: '0 16px', minHeight: 48, borderTop: i ? '0.5px solid var(--hairline)' : 'none',
          }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink-mute)' }}>{row.label}</span>
            <span style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 600, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ScreenOnboarding = ScreenOnboarding;
