import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { PhoneFrame } from '../components/PhoneFrame';
import { theme, fonts } from '../theme';

// SCENE 2 — Trip overview (6–12s).
// The line "خطّط. أنفق. شارك." lands at the top of the frame, then a
// phone mockup slides up showing a faithful build of the Hub: hero
// cover photo, day-of-trip pill, then the Budget Workspace card with
// "أنفقت 29,248 من 32,000" assembling in sequence. The amounts use
// the HubBudgetNum colour ramp the user just shipped (oklch 0.18 for
// the bold spent number, 0.40 for the dim planned number).
//
// You can swap the phone interior with a real screenshot later by
// dropping a PNG into public/ and replacing the inner block with
// <Img src={staticFile('hub-screenshot.png')} style={{ width: '100%' }} />.

export const Scene2Hub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone enters from below
  const phoneY = interpolate(frame, [fps * 0.6, fps * 1.6], [400, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const phoneOpacity = interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Budget card builds: spent number counts from 0 -> 29248
  const spentReveal = interpolate(frame, [fps * 2.0, fps * 4.0], [0, 29248], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const plannedOpacity = interpolate(frame, [fps * 3.0, fps * 4.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const remainingOpacity = interpolate(frame, [fps * 4.2, fps * 5.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  const fmt = (n: number) => Math.round(n).toLocaleString('en');

  return (
    <AbsoluteFill style={{
      background: theme.cream,
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: 120,
    }}>
      {/* Headline at top */}
      <div style={{ marginBottom: 60 }}>
        <ArabicText size={84} weight={700} color={theme.ink} delay={0}>
          خطّط. أنفق. شارك.
        </ArabicText>
      </div>

      {/* Phone mockup */}
      <div style={{
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
      }}>
        <PhoneFrame width={620}>
          {/* Hero cover */}
          <div style={{
            position: 'relative', height: 360,
            background: `linear-gradient(135deg, ${theme.clayDeep} 0%, ${theme.indigo} 100%)`,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background:
                `radial-gradient(60% 50% at 30% 30%, ${theme.honey} 0%, transparent 70%)`,
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
            {/* Hero title */}
            <div style={{
              position: 'absolute', bottom: 28, right: 24,
              direction: 'rtl',
              fontFamily: fonts.serif, fontStyle: 'italic',
              fontSize: 56, color: '#fff', lineHeight: 1.05,
            }}>كيوتو</div>
          </div>

          {/* Budget Workspace card */}
          <div style={{ padding: '24px 18px 0' }}>
            <div style={{
              background: theme.cream2,
              borderRadius: 28,
              padding: '24px 22px',
              boxShadow: '0 24px 48px -24px rgba(0,0,0,0.18)',
              border: '0.5px solid rgba(0,0,0,0.06)',
            }}>
              {/* Editorial sentence */}
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
                <span style={{ opacity: plannedOpacity }}>
                  <span> من أصل </span>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: '1.18em', fontWeight: 500,
                    color: 'oklch(0.40 0.020 248)',
                  }}>32,000 ر.س</span>
                </span>
                <span>.</span>
              </div>

              {/* Remaining pill */}
              <div style={{
                opacity: remainingOpacity,
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

              {/* Stacked bar */}
              <div style={{
                marginTop: 18,
                display: 'flex', height: 18, borderRadius: 12, overflow: 'hidden',
              }}>
                <div style={{ flex: 4, background: theme.clay }} />
                <div style={{ flex: 3, background: theme.honey }} />
                <div style={{ flex: 2, background: theme.moss }} />
                <div style={{ flex: 1, background: theme.indigo }} />
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
