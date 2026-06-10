import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { PhoneFrame } from '../components/PhoneFrame';
import { theme, fonts } from '../theme';

// SCENE 2 — Trip overview (4–10s, 180 frames).
// Phone enters from below with a 3D tilt and rotates to flat as it
// lands (spring-based, not lerp). Camera then dollies IN on the
// budget card (scales 1.0 -> 1.18 over scene mid). Numbers tick up
// continuously, the stacked bar fills from left to right. Headline
// is kinetic per character with two-line offset.
export const Scene2Hub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phone spring entry — settles with a tiny overshoot
  const phoneSpring = spring({
    frame: frame - fps * 0.2, fps,
    config: { damping: 12, mass: 1.2, stiffness: 95 },
  });
  const phoneY    = interpolate(phoneSpring, [0, 1], [800, 0]);
  const phoneTilt = interpolate(phoneSpring, [0, 1], [-14, 0]);    // deg
  const phoneRotY = interpolate(phoneSpring, [0, 1], [22, 0]);    // 3D yaw

  // Camera dolly: zoom in on the phone during seconds 3–5
  const dollyZoom = interpolate(frame, [fps * 2.5, fps * 4.5], [1.0, 1.14], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const dollyY = interpolate(frame, [fps * 2.5, fps * 4.5], [0, -60], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Continuous gentle phone bob — so the phone keeps breathing
  const bob = 4 * Math.sin((frame / fps) * Math.PI * 0.9);

  // Spent number counts smoothly
  const spentReveal = interpolate(frame, [fps * 1.6, fps * 4.0], [0, 29248], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const plannedFade = interpolate(frame, [fps * 2.8, fps * 3.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const remainingFade = interpolate(frame, [fps * 3.8, fps * 4.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Stacked bar fills L->R
  const barFill = interpolate(frame, [fps * 2.4, fps * 4.2], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Exit: phone tilts away
  const exitTilt = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [0, -8], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const exitY = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [0, 60], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  const fmt = (n: number) => Math.round(n).toLocaleString('en');

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.7} />

      {/* Headline at top, two lines */}
      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0,
        padding: '0 80px',
      }}>
        <KineticText size={92} weight={700} color={theme.ink} delay={0} staggerFrames={1.6}>
          خطّط.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={92} weight={700} color={theme.clayDeep} delay={fps * 0.35} staggerFrames={1.6}>
          أنفق.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={92} weight={700} color={theme.mossDeep} delay={fps * 0.70} staggerFrames={1.6}>
          شارك.
        </KineticText>
      </div>

      {/* Phone */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'flex-end',
        paddingBottom: 100,
        transform: `translateY(${dollyY}px) scale(${dollyZoom})`,
        perspective: '2000px',
      }}>
        <div style={{
          transform: `
            translateY(${phoneY + bob + exitY}px)
            rotate(${phoneTilt + exitTilt}deg)
            rotateY(${phoneRotY}deg)
          `,
          transformStyle: 'preserve-3d',
        }}>
          <PhoneFrame width={620}>
            {/* Hero cover with subtle continuous gradient drift */}
            <div style={{
              position: 'relative', height: 360,
              background: `linear-gradient(135deg, ${theme.clayDeep} 0%, ${theme.indigo} 100%)`,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background:
                  `radial-gradient(60% 50% at ${30 + 10 * Math.sin(frame / fps)}% 30%, ${theme.honey} 0%, transparent 70%)`,
                opacity: 0.65,
              }} />
              {/* Dates pill */}
              <div style={{
                position: 'absolute', top: 64, right: 22,
                padding: '6px 14px', borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                fontFamily: fonts.mono, fontSize: 14,
                color: 'rgba(255,255,255,0.95)',
              }}>15 – 22 NOV</div>
              <div style={{
                position: 'absolute', bottom: 28, right: 24,
                direction: 'rtl',
                fontFamily: fonts.serif, fontStyle: 'italic',
                fontSize: 56, color: '#fff', lineHeight: 1.05,
              }}>كيوتو</div>
            </div>

            {/* Budget card */}
            <div style={{ padding: '24px 18px 0' }}>
              <div style={{
                background: theme.cream2,
                borderRadius: 28,
                padding: '24px 22px',
                boxShadow: '0 24px 48px -24px rgba(0,0,0,0.18)',
                border: '0.5px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  direction: 'rtl',
                  fontFamily: fonts.arSans,
                  fontSize: 22, lineHeight: 1.5,
                  color: theme.inkSoft, fontWeight: 400,
                }}>
                  <span>أنفقت </span>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '1.18em', fontWeight: 700,
                    color: 'oklch(0.18 0.020 250)',
                  }}>{fmt(spentReveal)} ر.س</span>
                  <span style={{ opacity: plannedFade }}>
                    <span> من أصل </span>
                    <span style={{
                      fontFamily: fonts.mono,
                      fontSize: '1.18em', fontWeight: 500,
                      color: 'oklch(0.40 0.020 248)',
                    }}>32,000 ر.س</span>
                  </span>
                  <span>.</span>
                </div>

                <div style={{
                  opacity: remainingFade,
                  marginTop: 14,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  direction: 'rtl',
                  fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
                  color: theme.moss,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 999,
                    background: theme.moss, display: 'inline-block',
                  }} />
                  2,752 ر.س متبقي · في المسار
                </div>

                {/* Stacked bar — fills from L->R via clipping */}
                <div style={{
                  marginTop: 18,
                  display: 'flex', height: 18, borderRadius: 12, overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{ flex: 4, background: theme.clay }} />
                  <div style={{ flex: 3, background: theme.honey }} />
                  <div style={{ flex: 2, background: theme.moss }} />
                  <div style={{ flex: 1, background: theme.indigo }} />
                  {/* Mask covers the bar from right, retreats left */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: theme.cream2,
                    clipPath: `inset(0 0 0 ${barFill * 100}%)`,
                  }} />
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 4.6} angle={18} />
    </AbsoluteFill>
  );
};
