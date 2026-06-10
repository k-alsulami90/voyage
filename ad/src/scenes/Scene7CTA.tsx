import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme, fonts } from '../theme';

// SCENE 7 — CTA (4s @ 60fps = 240f).
// Voyage wordmark springs in letter-by-letter with blur unfocus, the
// divider draws with a glowing dot riding it, the tagline kinetics in,
// and a slow camera push holds to the end (SceneWrap fades out).
export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const LOGO = Array.from('Voyage');

  const camScale = interpolate(frame, [0, durationInFrames], [0.94, 1.06]);

  const dividerProgress = interpolate(frame, [fps * 1.1, fps * 1.9], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const dividerWidth = 230 * dividerProgress;

  const tagSpring = spring({
    frame: frame - fps * 1.9, fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.55} />
      <Particles count={26} color="rgba(170,130,90,0.35)" size={3} speed={0.7} opacity={0.6} />

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 28,
        transform: `scale(${camScale})`,
      }}>
        <div style={{
          display: 'flex',
          fontFamily: fonts.serif, fontStyle: 'italic',
          fontSize: 215, color: theme.ink,
          letterSpacing: '-0.045em', lineHeight: 1,
        }}>
          {LOGO.map((ch, i) => {
            const sp = spring({
              frame: frame - fps * (0.15 + i * 0.09), fps,
              config: { damping: 14, mass: 0.8, stiffness: 145 },
            });
            return (
              <span key={i} style={{
                display: 'inline-block',
                transform: `translateY(${interpolate(sp, [0, 1], [46, 0])}px)`,
                opacity: sp,
                filter: `blur(${interpolate(sp, [0, 1], [9, 0])}px)`,
              }}>{ch}</span>
            );
          })}
        </div>

        {/* Divider with glowing dot */}
        <div style={{ position: 'relative', height: 18, width: 250 }}>
          <div style={{
            position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
            width: dividerWidth, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${theme.clay} 50%, transparent 100%)`,
          }} />
          <div style={{
            position: 'absolute', top: 4, left: '50%',
            transform: `translateX(${(dividerProgress - 0.5) * dividerWidth}px)`,
            width: 12, height: 12, borderRadius: '50%',
            background: theme.honey, boxShadow: `0 0 24px ${theme.clay}`,
            opacity: dividerProgress > 0.05 && dividerProgress < 0.95 ? 1 : 0,
          }} />
        </div>

        <div style={{
          opacity: tagSpring,
          transform: `translateY(${interpolate(tagSpring, [0, 1], [20, 0])}px)`,
        }}>
          <KineticText size={50} weight={500} color={theme.inkSoft} delay={fps * 1.9} duration={fps * 0.5} align="center">
            لعشاق الترحال والاستكشاف.
          </KineticText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
