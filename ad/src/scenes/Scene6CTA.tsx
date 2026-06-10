import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { theme, fonts } from '../theme';

// SCENE 6 — CTA (30–36s).
// Voyage logo lockup, the tagline the user kept in v99
// ("لعشاق الترحال والاستكشاف"), and a hairline divider that draws
// in left-to-right. Background eases from cream to a deeper warm
// surface so the logo lifts off the page.
export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgWarm = interpolate(frame, [0, fps * 2.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoLift = interpolate(frame, [0, fps * 0.8], [40, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const dividerWidth = interpolate(frame, [fps * 1.2, fps * 2.4], [0, 220], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg,
        ${theme.cream} 0%,
        oklch(0.88 0.022 78 / ${bgWarm}) 100%)`,
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 30,
    }}>
      {/* Logo wordmark */}
      <div style={{
        opacity: logoOpacity,
        transform: `translateY(${logoLift}px)`,
        fontFamily: fonts.serif, fontStyle: 'italic',
        fontSize: 200, color: theme.ink,
        letterSpacing: '-0.04em', lineHeight: 1,
      }}>
        Voyage
      </div>

      {/* Hairline divider */}
      <div style={{
        width: dividerWidth, height: 1.5,
        background: theme.moss,
      }} />

      {/* Tagline */}
      <ArabicText size={48} weight={500} color={theme.inkSoft} delay={fps * 1.5} align="center">
        لعشاق الترحال والاستكشاف.
      </ArabicText>
    </AbsoluteFill>
  );
};
