import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { theme } from '../theme';

// SCENE 1 — Hook (0–6s, 180 frames @ 30fps).
// Cover photo fills the frame with a slow Ken Burns zoom from 1.00 -> 1.08
// over the full 6s, locked to a warm gradient overlay so the headline
// reads on any photo. Arabic headline fades in at 0.8s. We don't render
// a real photo here -- we render an oklch gradient that evokes the
// Kyoto cover (warm sunset over slate horizon). Swap with a real
// staticFile() image later if you want a literal destination shot.
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slow zoom on the painted backdrop
  const zoom = interpolate(frame, [0, durationInFrames], [1.00, 1.10], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Vignette darkens at the end so the next scene can cross-cut clean
  const vignette = interpolate(frame, [durationInFrames - fps, durationInFrames], [0, 0.5], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Painted "Kyoto" backdrop — warm sun + indigo dusk */}
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(70% 60% at 50% 30%, ${theme.honey} 0%, transparent 65%),
            radial-gradient(80% 70% at 50% 80%, ${theme.clayDeep} 0%, transparent 60%),
            linear-gradient(180deg, oklch(0.55 0.10 285) 0%, oklch(0.28 0.08 270) 100%)
          `,
        }} />
        {/* Subtle film grain via repeating dots */}
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 3px 3px',
          mixBlendMode: 'overlay',
        }} />
      </AbsoluteFill>

      {/* End-of-scene vignette */}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${vignette})` }} />

      {/* Headline */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        padding: '0 80px',
      }}>
        <ArabicText size={140} weight={700} color="#fff" delay={fps * 0.8}>
          كل رحلة، قصة.
        </ArabicText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
