import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, Vignette, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme } from '../theme';

// SCENE 1 — Hook (3.5s @ 60fps = 210f). Fast, punchy open.
// Camera zooms OUT of a dusk gradient while particles drift; the
// two-line Arabic hook lands with spring overshoot; a light streak
// sweeps right before the cut.
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const camZoom = interpolate(frame, [0, fps * 1.2, durationInFrames], [1.55, 1.02, 0.97], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camPanX = interpolate(frame, [0, durationInFrames], [-26, 26]);

  const headSpring = spring({
    frame: frame - fps * 0.45, fps,
    config: { damping: 13, mass: 0.8, stiffness: 150 },
  });
  const headScale = interpolate(headSpring, [0, 1], [0.84, 1]);

  const exitDim = interpolate(frame, [durationInFrames - fps * 0.35, durationInFrames], [0, 0.6], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${camZoom}) translateX(${camPanX}px)` }}>
        <AmbientBg tone="dusk" intensity={1.1} />
        <Particles count={52} color="rgba(255,200,140,0.55)" size={5} speed={1.1} opacity={0.85} />
      </AbsoluteFill>

      <Vignette strength={0.42} />

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center', padding: '0 70px',
        transform: `scale(${headScale})`,
      }}>
        <KineticText size={150} weight={700} color="#fff" delay={fps * 0.4} duration={fps * 0.5}>
          كل رحلة،
        </KineticText>
        <div style={{ height: 10 }} />
        <KineticText size={150} weight={700} color={theme.honey} delay={fps * 0.95} duration={fps * 0.45} italic serif>
          قصة.
        </KineticText>
      </AbsoluteFill>

      <LightStreak delay={fps * 1.9} angle={20} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${exitDim})`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
