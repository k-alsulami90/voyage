import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme, fonts } from '../theme';

// SCENE 6 — CTA (27–32s, 150 frames).
// Camera-like push-in on the wordmark, characters of "Voyage" stamp
// in one by one (Latin so we don't reuse the Arabic kinetic), the
// divider draws with a glowing dot riding along it, then the tagline
// kinetics in. Final hold has a continuous slow zoom and particle
// drift so the screen never freezes.
export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const LOGO = Array.from('Voyage');

  // Camera push-in across the whole scene
  const camScale = interpolate(frame, [0, durationInFrames], [0.94, 1.05]);

  // Divider draws between logo and tagline
  const dividerProgress = interpolate(frame, [fps * 1.4, fps * 2.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dividerWidth = 220 * dividerProgress;
  const glowX = interpolate(dividerProgress, [0, 1], [0, dividerWidth]);

  // Tagline emerges
  const taglineSpring = spring({
    frame: frame - fps * 2.3, fps,
    config: { damping: 14, mass: 0.9, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.55} />
      <Particles count={30} color="rgba(170,130,90,0.35)" size={3} speed={0.7} opacity={0.65} />

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 26,
        transform: `scale(${camScale})`,
      }}>
        {/* Voyage wordmark — char by char with spring */}
        <div style={{
          display: 'flex',
          fontFamily: fonts.serif, fontStyle: 'italic',
          fontSize: 220, color: theme.ink,
          letterSpacing: '-0.045em', lineHeight: 1,
        }}>
          {LOGO.map((ch, i) => {
            const sp = spring({
              frame: frame - fps * (0.15 + i * 0.10), fps,
              config: { damping: 14, mass: 0.8, stiffness: 140 },
            });
            const y = interpolate(sp, [0, 1], [40, 0]);
            const blur = interpolate(sp, [0, 1], [8, 0]);
            return (
              <span key={i} style={{
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                opacity: sp,
                filter: `blur(${blur}px)`,
              }}>{ch}</span>
            );
          })}
        </div>

        {/* Divider with glowing dot */}
        <div style={{ position: 'relative', height: 18, width: 240 }}>
          <div style={{
            position: 'absolute', top: 8, left: '50%',
            transform: `translateX(-50%)`,
            width: dividerWidth, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${theme.clay} 50%, transparent 100%)`,
          }} />
          <div style={{
            position: 'absolute', top: 4, left: '50%',
            transform: `translate(calc(-50% + ${glowX - dividerWidth / 2}px), 0)`,
            width: 12, height: 12, borderRadius: '50%',
            background: theme.honey,
            boxShadow: `0 0 24px ${theme.clay}`,
            opacity: dividerProgress > 0.05 && dividerProgress < 0.95 ? 1 : 0,
          }} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: taglineSpring,
          transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
        }}>
          <KineticText size={52} weight={500} color={theme.inkSoft} delay={fps * 2.3} staggerFrames={1.4} align="center">
            لعشاق الترحال والاستكشاف.
          </KineticText>
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 3.8} angle={25} />
    </AbsoluteFill>
  );
};
