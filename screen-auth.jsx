// Auth — Sign in & Sign up screens.
// Layered overflow style: cover art bleeds behind a frosted card.

function ScreenAuth({ go, mode: initMode = 'signin' }) {
  const [mode, setMode]       = React.useState(initMode);  // signin | signup | forgot | reset
  const [email, setEmail]     = React.useState('');
  const [password, setPass]   = React.useState('');
  const [confirmPw, setConfirmPw] = React.useState('');
  const [name, setName]       = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError]     = React.useState(null);

  const [checkEmail, setCheckEmail] = React.useState(false);
  const [resetSent,  setResetSent]  = React.useState(false);

  // If the user lands on the page with a recovery session, switch to reset mode
  React.useEffect(() => {
    if (window.location.hash === '#reset' || window._authRecoveryActive) {
      setMode('reset');
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        if (!email || !password) throw new Error(window.isRTL ? 'أكمل الحقول' : 'Fill all fields');
        const { data } = await window.sbSignUp(email, password, name || email.split('@')[0]);
        if (!data?.session) {
          setCheckEmail(true);
          setLoading(false);
          return;
        }
      } else if (mode === 'signin') {
        if (!email || !password) throw new Error(window.isRTL ? 'أكمل الحقول' : 'Fill all fields');
        await window.sbSignIn(email, password);
      } else if (mode === 'forgot') {
        if (!email) throw new Error(window.isRTL ? 'أدخل بريدك' : 'Enter your email');
        await window.sbResetPassword(email);
        setResetSent(true);
        window.toast?.(window.isRTL ? 'تم إرسال رابط التعيين' : 'Reset link sent', 'success');
        setLoading(false);
        return;
      } else if (mode === 'reset') {
        if (!password || password.length < 6) throw new Error(window.isRTL ? '٦ أحرف على الأقل' : 'Min 6 characters');
        if (password !== confirmPw) throw new Error(window.isRTL ? 'كلمتا المرور غير متطابقتين' : "Passwords don't match");
        await window.sbUpdatePassword(password);
        window.toast?.(window.isRTL ? 'تم تحديث كلمة المرور' : 'Password updated', 'success');
        window.location.hash = '';
        setMode('signin');
        setPass(''); setConfirmPw('');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message);
      window.toast?.(err.message, 'error');
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await window.sbResendConfirmation(email);
      window.toast?.(window.isRTL ? 'تم إعادة الإرسال' : 'Confirmation resent', 'success');
    } catch (err) { window.toast?.(err.message, 'error'); }
  };
  return (
    <div data-screen-label={mode === 'signup' ? '00 Sign up' : '00 Sign in'} style={{
      minHeight: '100%', position: 'relative', overflow: 'hidden',
      background: 'var(--cream)',
    }}>
      {/* AURORA BACKDROP — full-bleed cover */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(170deg, oklch(0.36 0.06 30) 0%, oklch(0.22 0.04 280) 60%, oklch(0.18 0.03 280) 100%)',
        }} />
        {/* Sun */}
        <div style={{
          position: 'absolute', top: '14%', right: '-10%', width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(0.94 0.10 70) 0%, oklch(0.74 0.16 35) 60%, transparent 100%)',
          filter: 'blur(1px)',
        }} />
        {/* Mountains */}
        <svg viewBox="0 0 400 600" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <polygon points="0,420 90,290 180,360 260,260 340,340 400,310 400,600 0,600" fill="oklch(0.30 0.04 280 / 0.6)" />
          <polygon points="0,470 80,380 170,420 250,360 330,400 400,380 400,600 0,600" fill="oklch(0.22 0.03 275 / 0.85)" />
        </svg>
        {/* Blossom dots */}
        {[[35,80,8],[70,60,10],[110,90,7],[170,50,9],[210,80,11],[260,55,8],[310,95,9],[350,70,7]].map(([x,y,r],i) => (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: r*2, height: r*2, borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.96 0.05 25) 0%, oklch(0.78 0.14 18) 100%)',
            boxShadow: '0 1px 2px rgba(60,30,30,0.18)',
          }} />
        ))}
        {/* vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 60% at 50% 100%, transparent 30%, rgba(20,10,20,0.5) 100%)' }} />
      </div>

      {/* WORDMARK — bleeds over the hero */}
      <div style={{ position: 'relative', padding: 'max(70px, calc(env(safe-area-inset-top) + 20px)) 32px 0', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: window.isRTL ? 'row-reverse' : 'row' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--cream)', display: 'grid', placeItems: 'center',
            transform: 'rotate(-4deg)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}><IconCompass size={18} stroke="var(--ink)" /></div>
          <div className="serif-italic" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>voyage</div>
        </div>

        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', opacity: 0.75 }}>
            {t('tagline')}
          </div>
          <div className="serif-italic" style={{ fontSize: 54, lineHeight: 0.95, marginTop: 8, letterSpacing: '-0.02em' }}>
            {mode === 'signup'
              ? t('startLedger').split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)
              : t('welcomeBack').split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)
            }
          </div>
        </div>
      </div>

      {/* FROSTED FORM CARD — overlaps lower portion of hero */}
      <div style={{
        position: 'relative', margin: '60px 14px 0',
        borderRadius: 28, padding: '22px 22px 18px',
        background: 'rgba(255, 251, 244, 0.88)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '0.5px solid rgba(255,255,255,0.6)',
        boxShadow: '0 40px 60px -20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}>
        {/* Mode toggle — pill (hidden in forgot/reset modes) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div style={{
            display: 'inline-flex', padding: 3, background: 'var(--sand)', borderRadius: 999,
            marginBottom: 16, flexDirection: window.isRTL ? 'row-reverse' : 'row',
          }}>
            {['signin', 'signup'].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                background: mode === m ? 'var(--ink)' : 'transparent',
                color: mode === m ? 'var(--cream)' : 'var(--ink-soft)',
                transition: 'all 200ms',
              }}>{m === 'signin' ? t('signIn') : t('signUp')}</button>
            ))}
          </div>
        )}

        {/* Forgot / reset mode header */}
        {mode === 'forgot' && (
          <div style={{ marginBottom: 14 }}>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>
              {window.isRTL ? 'استعادة كلمة المرور' : 'Reset your password'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', marginTop: 4 }}>
              {window.isRTL ? 'سنرسل رابطاً لبريدك' : "We'll email you a reset link"}
            </div>
          </div>
        )}
        {mode === 'reset' && (
          <div style={{ marginBottom: 14 }}>
            <div className="serif" style={{ fontSize: 22, lineHeight: 1.1 }}>
              {window.isRTL ? 'كلمة مرور جديدة' : 'Choose a new password'}
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mode === 'signup' && (
            <Field label={t('fullName')} placeholder="Mira Kawasaki"
              value={name} onChange={setName}
              icon={<IconUsers size={14} stroke="var(--ink-mute)" />} />
          )}
          {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
            <Field label={t('email')} placeholder="mira@voyage.app" type="email"
              value={email} onChange={setEmail}
              icon={<IconLink size={14} stroke="var(--ink-mute)" />} />
          )}
          {(mode === 'signin' || mode === 'signup' || mode === 'reset') && (
            <Field label={mode === 'reset' ? (window.isRTL ? 'كلمة مرور جديدة' : 'New password') : t('password')}
              placeholder="••••••••" type="password"
              value={password} onChange={setPass}
              icon={<IconGear size={14} stroke="var(--ink-mute)" />}
              action={mode === 'signin' && t('forgotPassword')}
              onAction={mode === 'signin' ? () => { setMode('forgot'); setError(null); } : null} />
          )}
          {mode === 'reset' && (
            <Field label={window.isRTL ? 'تأكيد كلمة المرور' : 'Confirm password'}
              placeholder="••••••••" type="password"
              value={confirmPw} onChange={setConfirmPw}
              icon={<IconGear size={14} stroke="var(--ink-mute)" />} />
          )}

          {/* Check email notice for signup */}
          {checkEmail && (
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'oklch(0.50 0.08 155 / 0.10)',
              border: '0.5px solid oklch(0.50 0.08 155 / 0.35)',
              fontSize: 12.5, color: 'oklch(0.30 0.07 155)', lineHeight: 1.5,
            }}>
              ✉️ {window.isRTL ? 'تحقق من بريدك الإلكتروني واضغط على رابط التأكيد، ثم عُد وسجّل الدخول' : 'Check your email and click the confirmation link, then come back and sign in.'}
              <button onClick={handleResendConfirmation} style={{
                display: 'block', marginTop: 8, color: 'oklch(0.30 0.07 155)', fontWeight: 600, fontSize: 12,
                textDecoration: 'underline',
              }}>{window.isRTL ? 'إعادة الإرسال' : 'Resend confirmation'}</button>
            </div>
          )}

          {/* Reset link sent notice */}
          {resetSent && mode === 'forgot' && (
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'oklch(0.50 0.08 155 / 0.10)',
              border: '0.5px solid oklch(0.50 0.08 155 / 0.35)',
              fontSize: 12.5, color: 'oklch(0.30 0.07 155)', lineHeight: 1.5,
            }}>
              ✉️ {window.isRTL ? 'تحقق من بريدك واضغط على رابط التعيين' : 'Check your inbox and click the reset link.'}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 12,
              background: 'oklch(0.62 0.13 35 / 0.10)',
              border: '0.5px solid oklch(0.62 0.13 35 / 0.3)',
              fontSize: 12.5, color: 'var(--clay-deep)', lineHeight: 1.4,
            }}>{error}</div>
          )}
          {mode === 'signup' && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              flexDirection: window.isRTL ? 'row-reverse' : 'row',
              padding: '10px 12px', borderRadius: 14, background: 'var(--sand)',
              marginTop: 2,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 6, background: 'var(--ink)',
                display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1,
              }}>
                <IconCheck size={11} stroke="#fff" />
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.4, textAlign: window.isRTL ? 'right' : 'left' }}>
                {t('agreeTerms')}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', marginTop: 14, padding: 15,
          borderRadius: 16,
          background: loading ? 'var(--ink-soft)' : 'var(--ink)',
          color: 'var(--cream)', fontSize: 14, fontWeight: 600,
          letterSpacing: '-0.005em', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
          boxShadow: '0 10px 22px rgba(34,28,22,0.3)',
        }}>
          {loading ? (
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.35)',
              borderTopColor: '#fff',
              display: 'inline-block',
              animation: 'authspin 0.7s linear infinite',
            }} />
          ) : (
            <>
              {mode === 'signup' ? t('createLedger')
                : mode === 'forgot' ? (window.isRTL ? 'إرسال رابط التعيين' : 'Send reset link')
                : mode === 'reset' ? (window.isRTL ? 'تحديث كلمة المرور' : 'Update password')
                : t('continue')}
              <IconChevron size={14} stroke="currentColor" />
            </>
          )}
        </button>
        <style>{`@keyframes authspin { to { transform: rotate(360deg) } }`}</style>

        {/* Back to sign in (in forgot/reset modes) */}
        {(mode === 'forgot' || mode === 'reset') && (
          <button onClick={() => { setMode('signin'); setError(null); setResetSent(false); window.location.hash = ''; }} style={{
            display: 'block', margin: '12px auto 0',
            fontSize: 12, color: 'var(--ink-soft)', textDecoration: 'underline',
          }}>
            {window.isRTL ? '← العودة لتسجيل الدخول' : '← Back to sign in'}
          </button>
        )}

        {/* OR divider — only in signin/signup */}
        {(mode === 'signin' || mode === 'signup') && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, margin: '14px 4px 12px',
          flexDirection: window.isRTL ? 'row-reverse' : 'row',
        }}>
          <div style={{ flex: 1, height: 0.5, background: 'var(--hairline-2)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--ink-mute)' }}>
            {t('orContinueWith')}
          </span>
          <div style={{ flex: 1, height: 0.5, background: 'var(--hairline-2)' }} />
        </div>
        )}

        {(mode === 'signin' || mode === 'signup') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { name: t('apple'), glyph: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.02-2.16 1.77-3.2 1.85-3.25-1.01-1.48-2.58-1.68-3.14-1.7-1.34-.13-2.61.78-3.29.78-.68 0-1.73-.76-2.84-.74-1.46.02-2.81.85-3.56 2.16-1.52 2.63-.39 6.51 1.09 8.65.73 1.05 1.59 2.22 2.72 2.18 1.09-.04 1.5-.7 2.82-.7 1.32 0 1.7.7 2.85.68 1.18-.02 1.92-1.06 2.64-2.11.83-1.21 1.17-2.39 1.19-2.46-.03-.01-2.28-.88-2.3-3.49M14.78 5.69c.6-.73 1-1.74.89-2.74-.86.04-1.9.57-2.51 1.29-.55.64-1.04 1.66-.91 2.64.96.08 1.93-.49 2.53-1.19z"/></svg> },
            { name: t('google'), glyph: <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A11 11 0 001 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg> },
            { name: t('passkey'), glyph: <IconCheck size={14} stroke="var(--ink)" /> },
          ].map((p) => (
            <button key={p.name} style={{
              padding: '11px 8px', borderRadius: 14,
              background: 'rgba(255,255,255,0.7)',
              border: '0.5px solid var(--hairline)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: 10.5, fontWeight: 500, color: 'var(--ink-soft)',
            }}>
              {p.glyph}
              {p.name}
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Footer */}
      {(mode === 'signin' || mode === 'signup') && (
      <div style={{
        textAlign: 'center', padding: '20px 0 28px',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em',
        color: 'var(--ink-mute)',
      }}>
        {mode === 'signup' ? t('alreadyHaveAccount') : t('newToVoyage')}
        <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} style={{
          marginLeft: 6, color: 'var(--clay-deep)', fontWeight: 600, letterSpacing: '0.16em',
        }}>{mode === 'signup' ? t('signinLink') : t('createOne')}</button>
      </div>
      )}
    </div>
  );
}

function Field({ label, placeholder, type = 'text', icon, action, onAction, value, onChange }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
        fontSize: 10.5, fontFamily: 'var(--mono)', letterSpacing: '0.14em',
        color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 5, padding: '0 4px',
      }}>
        <span>{label}</span>
        {action && <button onClick={onAction || undefined} style={{ color: 'var(--clay-deep)' }}>{action}</button>}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: window.isRTL ? 'row-reverse' : 'row',
        padding: '12px 14px', borderRadius: 14,
        background: 'rgba(255,255,255,0.7)',
        border: '0.5px solid var(--hairline)',
      }}>
        {icon}
        <input type={type} placeholder={placeholder}
          value={value !== undefined ? value : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          style={{
          flex: 1, border: 0, outline: 0, background: 'transparent',
          fontSize: 14, fontFamily: 'var(--sans)', color: 'var(--ink)',
          textAlign: window.isRTL ? 'right' : 'left',
        }} />
      </div>
    </div>
  );
}

window.ScreenAuth = ScreenAuth;
