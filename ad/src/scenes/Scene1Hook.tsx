import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, Vignette, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme } from '../theme';

// SCENE 1 — Hook (0–4s, 120 frames).
// Starts extreme-close on a dusk gradient. Continuous parallax bg +
// drifting particles. A camera-zoom-out reveals the full surface,
// then the headline wipes in character-by-character with a light
// streak passing across.
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // CAMERA: zoom OUT from 1.45 -> 1.00 over the first 1.5s, then a
  // very slow continued drift outward.
  const camZoom = interpolate(frame, [0, fps * 1.5, durationInFrames], [1.45, 1.00, 0.96], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Small pan as well so it feels like real camera motion
  const camPanX = interpolate(frame, [0, durationInFrames], [-30, 30]);

  // End vignette pulls in for the cut
  const exitDim = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [0, 0.6], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Headline spring on the wrapper for a final settle
  const headlineSpring = spring({
    frame: frame - fps * 0.8, fps,
    config: { damping: 16, mass: 0.8, stiffness: 140 },
  });
  const headlineScale = interpolate(headlineSpring, [0, 1], [0.86, 1]);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{
        transform: `scale(${camZoom}) translateX(${camPanX}px)`,
      }}>
        <AmbientBg tone="dusk" intensity={1.1} />
        <Particles count={55} color="rgba(255,200,140,0.55)" size={5} speed={0.9} opacity={0.85} />
      </AbsoluteFill>

      <Vignette strength={0.40} />

      {/* Headline */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
        transform: `scale(${headlineScale})`,
      }}>
        <KineticText size={160} weight={700} color="#fff" delay={fps * 0.7} staggerFrames={2}>
          كل رحلة،
        </KineticText>
        <div style={{ height: 14 }} />
        <KineticText size={160} weight={700} color={theme.honey} delay={fps * 1.5} staggerFrames={1.8} italic serif>
          قصة.
        </KineticText>
      </AbsoluteFill>

      <LightStreak delay={fps * 2.0} angle={20} />

      {/* Exit dim */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${exitDim})`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
