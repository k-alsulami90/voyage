import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { PhoneFrame } from '../components/PhoneFrame';
import { theme, fonts } from '../theme';

// SCENE 4 — Smart Track (18–24s). The killer feature.
// Phone fades up with a dimmed Hub backdrop. Smart Track card
// slides in from below with a soft glow + pulse on the "Open
// boarding pass" pill. Headline: "بطاقة الصعود تظهر قبل رحلتك بـ
// 24 ساعة." This is the surface the user just unblocked in v100
// after the loadTripData mirror fix.
export const Scene4SmartTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSlide = interpolate(frame, [fps * 0.8, fps * 1.8], [200, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardOpacity = interpolate(frame, [fps * 0.8, fps * 1.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const pillPulse = 1 + 0.06 * Math.sin((frame - fps * 2.4) / fps * Math.PI * 2);

  return (
    <AbsoluteFill style={{
      background: theme.cream, padding: 0,
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: 100,
    }}>
      {/* Headline */}
      <div style={{ padding: '0 80px', textAlign: 'center', marginBottom: 50 }}>
        <ArabicText size={64} weight={700} color={theme.ink} delay={0} lineHeight={1.3}>
          بطاقة الصعود تظهر
        </ArabicText>
        <ArabicText size={64} weight={700} color={theme.clay} delay={fps * 0.25} lineHeight={1.3}>
          قبل رحلتك بـ 24 ساعة.
        </ArabicText>
      </div>

      {/* Phone with Smart Track card */}
      <PhoneFrame width={620}>
        {/* Faint Hub backdrop */}
        <div style={{ position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${theme.cream} 0%, ${theme.cream2} 100%)`,
        }} />

        {/* Smart Track card */}
        <div style={{
          position: 'absolute',
          top: 280, left: 18, right: 18,
          transform: `translateY(${cardSlide}px)`,
          opacity: cardOpacity,
          borderRadius: 28, overflow: 'hidden',
          background: `linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)`,
          color: '#fff',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)',
        }}>
          {/* Glow corner */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(85% 60% at 100% 0%, ${theme.honey} 0%, transparent 60%)`,
            opacity: 0.30, pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', padding: '22px 22px 20px' }}>
            {/* Status pill — pulsing now */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              border: '0.5px solid rgba(255,255,255,0.30)',
              fontFamily: fonts.mono, fontSize: 14, fontWeight: 600,
              transform: `scale(${pillPulse})`,
              direction: 'rtl',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: 999, background: '#fff',
                boxShadow: '0 0 10px #fff',
              }} />
              خلال 23 ساعة
            </div>

            {/* Title row */}
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 14,
              direction: 'rtl',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(255,255,255,0.18)',
                border: '0.5px solid rgba(255,255,255,0.30)',
                display: 'grid', placeItems: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3" />
                  <path d="M2 2l20 20" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: fonts.serif, fontStyle: 'italic',
                  fontSize: 30, lineHeight: 1.1, color: '#fff',
                }}>SV777 · الرياض ← طوكيو</div>
                <div style={{
                  marginTop: 6,
                  fontFamily: fonts.mono, fontSize: 15,
                  color: 'rgba(255,255,255,0.86)', letterSpacing: '0.02em',
                }}>RUH → HND · T2</div>
              </div>
            </div>

            {/* Action pills */}
            <div style={{
              marginTop: 18, display: 'flex', gap: 10,
              flexWrap: 'wrap', direction: 'rtl',
            }}>
              <div style={{
                padding: '10px 14px', borderRadius: 999,
                background: '#fff',
                color: 'oklch(0.22 0.025 250)',
                fontFamily: fonts.arSans, fontSize: 15, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                بطاقة الصعود
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 999,
                background: 'transparent', color: 'rgba(255,255,255,0.92)',
                border: '0.5px solid rgba(255,255,255,0.25)',
                fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
              }}>
                التذكرة الإلكترونية
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 999,
                background: 'transparent', color: 'rgba(255,255,255,0.92)',
                border: '0.5px solid rgba(255,255,255,0.25)',
                fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
              }}>
                الموقع
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </AbsoluteFill>
  );
};
