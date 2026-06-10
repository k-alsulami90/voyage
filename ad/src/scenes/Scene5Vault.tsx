import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { theme, fonts } from '../theme';

// SCENE 5 — Vault (22–27s, 150 frames).
// Four document cards FLY in from off-screen corners with rotation,
// land in a 2x2 grid, then SHIMMER (subtle continuous tilt + glow
// pass). Document tiles are physically tilted in 3D so the grid has
// depth, not flat slides. Headline runs across the top with kinetic
// per-character reveal.
const DOCS: Array<{
  label: string; emoji: string; tint: string;
  origin: { x: number; y: number; rot: number };
}> = [
  { label: 'تذاكر الطيران', emoji: '✈️', tint: 'oklch(0.42 0.10 285)',
    origin: { x: -800,  y: -600, rot: -25 } },
  { label: 'حجوزات السكن',  emoji: '🏨', tint: 'oklch(0.78 0.13 75)',
    origin: { x:  800,  y: -600, rot:  20 } },
  { label: 'التأشيرات',     emoji: '📘', tint: 'oklch(0.50 0.08 155)',
    origin: { x: -800,  y:  600, rot:  25 } },
  { label: 'وسائل النقل',    emoji: '🚆', tint: 'oklch(0.62 0.13 35)',
    origin: { x:  800,  y:  600, rot: -20 } },
];

export const Scene5Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous gentle camera pan for the whole grid
  const gridTilt = 2 * Math.sin((frame / fps) * Math.PI * 0.5);

  return (
    <AbsoluteFill style={{
      background: theme.cream,
      padding: '120px 70px 60px',
      direction: 'rtl',
    }}>
      <AmbientBg tone="cream" intensity={0.6} />

      <KineticText size={78} weight={700} color={theme.ink} delay={0} staggerFrames={1.4} align="center" lineHeight={1.25}>
        كل وثائقك
      </KineticText>
      <div style={{ height: 8 }} />
      <KineticText size={78} weight={500} color={theme.inkSoft} delay={fps * 0.35} staggerFrames={1.4} align="center" lineHeight={1.25}>
        في مكان واحد.
      </KineticText>

      {/* 2x2 grid with 3D tilt */}
      <div style={{
        marginTop: 90,
        perspective: '1500px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${gridTilt}deg) rotateY(${gridTilt * 0.6}deg)`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>
          {DOCS.map((d, i) => {
            const start = fps * (0.8 + i * 0.14);
            const sp = spring({
              frame: frame - start, fps,
              config: { damping: 13, mass: 1.0, stiffness: 90 },
            });
            const x = interpolate(sp, [0, 1], [d.origin.x, 0]);
            const y = interpolate(sp, [0, 1], [d.origin.y, 0]);
            const rot = interpolate(sp, [0, 1], [d.origin.rot, 0]);
            const sc = interpolate(sp, [0, 1], [0.55, 1]);

            // Continuous breathing per tile after settle
            const breath = 1 + 0.012 * Math.sin((frame / fps) * Math.PI * (1.2 + i * 0.3));

            return (
              <div key={d.label} style={{
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${sc * breath})`,
                opacity: sp,
              }}>
                <div style={{
                  background: theme.cream2,
                  borderRadius: 24,
                  padding: '28px 24px',
                  border: '0.5px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 24px 48px -22px rgba(0,0,0,0.28)',
                  display: 'flex', flexDirection: 'column', gap: 18,
                  transformStyle: 'preserve-3d',
                }}>
                  <div style={{
                    width: 70, height: 70, borderRadius: 18,
                    background: d.tint,
                    display: 'grid', placeItems: 'center',
                    fontSize: 38, lineHeight: 1,
                  }}>{d.emoji}</div>
                  <div style={{
                    fontFamily: fonts.arDisplay, fontSize: 28, fontWeight: 600,
                    color: theme.ink, lineHeight: 1.2,
                  }}>{d.label}</div>
                  <div style={{
                    display: 'inline-flex', alignSelf: 'flex-start',
                    padding: '5px 11px', borderRadius: 999,
                    background: 'oklch(0.50 0.08 155 / 0.15)',
                    color: theme.mossDeep,
                    fontFamily: fonts.mono, fontSize: 12, fontWeight: 600,
                  }}>محفوظ</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LightStreak delay={fps * 3.6} angle={-12} />
    </AbsoluteFill>
  );
};
