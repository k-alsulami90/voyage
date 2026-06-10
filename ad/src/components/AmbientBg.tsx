import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

// Always-moving background. Three radial blobs drift on overlapping
// sine cycles so the gradient never sits still. Hue/lightness can be
// tinted per-scene via the `tone` prop. Adds a low-opacity grain
// layer that scrolls 1px per frame so the eye picks up the motion
// even when the scene is quiet.
//
// This is the "anti-PPT" layer: most scenes get this behind their
// content so the canvas is alive even before anything happens.

type Tone = 'cream' | 'dusk' | 'clay' | 'moss' | 'indigo';

const TONES: Record<Tone, { base: string; a: string; b: string; c: string }> = {
  cream: {
    base: theme.cream,
    a: theme.honey,
    b: theme.clay,
    c: theme.cream2,
  },
  dusk: {
    base: 'oklch(0.30 0.07 270)',
    a: theme.honey,
    b: theme.clayDeep,
    c: theme.indigo,
  },
  clay: {
    base: 'oklch(0.36 0.10 32)',
    a: theme.clay,
    b: theme.clayDeep,
    c: theme.honey,
  },
  moss: {
    base: 'oklch(0.34 0.07 155)',
    a: theme.moss,
    b: theme.mossDeep,
    c: theme.honey,
  },
  indigo: {
    base: 'oklch(0.26 0.06 270)',
    a: theme.indigo,
    b: theme.mossDeep,
    c: theme.honey,
  },
};

export const AmbientBg: React.FC<{ tone?: Tone; intensity?: number }> = ({
  tone = 'cream', intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // seconds, local to the Sequence
  const c = TONES[tone];

  // Three blobs orbiting on phase-shifted sine waves
  const blob = (phase: number, speed: number, radius: number) => ({
    x: 50 + radius * Math.cos((t * speed + phase) * Math.PI * 0.4),
    y: 50 + radius * Math.sin((t * speed + phase) * Math.PI * 0.5),
  });
  const b1 = blob(0.0, 0.9, 28);
  const b2 = blob(1.3, 1.1, 22);
  const b3 = blob(2.5, 0.7, 30);

  // Camera-like slow zoom that loops, keeps the canvas alive
  const drift = 1 + 0.03 * Math.sin(t * 0.6);

  // Subtle scrolling grain
  const grainOffset = frame * 0.6;

  return (
    <AbsoluteFill style={{ background: c.base, overflow: 'hidden' }}>
      <AbsoluteFill style={{
        transform: `scale(${drift})`,
        background: `
          radial-gradient(45% 35% at ${b1.x}% ${b1.y}%, ${c.a} 0%, transparent 60%),
          radial-gradient(50% 40% at ${b2.x}% ${b2.y}%, ${c.b} 0%, transparent 65%),
          radial-gradient(55% 45% at ${b3.x}% ${b3.y}%, ${c.c} 0%, transparent 60%)
        `,
        opacity: 0.85 * intensity,
        filter: 'blur(0.5px)',
      }} />
      {/* Grain overlay */}
      <AbsoluteFill style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.5px)',
        backgroundSize: '3px 3px',
        backgroundPosition: `${grainOffset}px ${grainOffset * 0.7}px`,
        mixBlendMode: 'overlay',
      }} />
    </AbsoluteFill>
  );
};

// Subtle vignette that pulses, can sit on top of any scene to focus
// the eye on the centre.
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.35 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + 0.06 * Math.sin((frame / fps) * Math.PI * 0.8);
  return (
    <AbsoluteFill style={{
      background:
        `radial-gradient(80% 60% at 50% 50%, transparent 50%, rgba(0,0,0,${strength * pulse}) 100%)`,
      pointerEvents: 'none',
    }} />
  );
};

// Diagonal light streak that sweeps across the scene -- great for
// transitions and CTA hits.
export const LightStreak: React.FC<{ delay?: number; angle?: number }> = ({
  delay = 0, angle = 25,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const x = interpolate(local, [0, fps * 0.8], [-130, 130], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(local, [0, fps * 0.15, fps * 0.65, fps * 0.8], [0, 0.9, 0.9, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill style={{
      transform: `rotate(${angle}deg) translateX(${x}%)`,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', top: '-50%', height: '200%',
        left: '50%', width: 12,
        background:
          'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
        filter: 'blur(8px)',
        opacity,
      }} />
    </AbsoluteFill>
  );
};
