import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

// Drifting particle field. Each particle has its own orbit + speed
// derived from its index so the field looks organic but is
// deterministic (so renders match every time).

type Props = {
  count?: number;
  color?: string;
  size?: number;        // base px
  speed?: number;       // 1 = default
  opacity?: number;
};

export const Particles: React.FC<Props> = ({
  count = 40, color = 'rgba(255,255,255,0.5)', size = 4, speed = 1, opacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = (frame / fps) * speed;

  // Deterministic pseudo-random from index — avoids hydration mismatch
  const rnd = (i: number, seed: number) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {Array.from({ length: count }, (_, i) => {
        const baseX  = rnd(i, 1) * width;
        const baseY  = rnd(i, 2) * height;
        const r      = 30 + rnd(i, 3) * 80;
        const ang    = (t * (0.3 + rnd(i, 4) * 0.4) + rnd(i, 5) * 6.28);
        const sz     = size * (0.5 + rnd(i, 6) * 1.5);
        const pulse  = 0.5 + 0.5 * Math.sin(t * (0.8 + rnd(i, 7) * 0.6) + i);
        return (
          <div key={i} style={{
            position: 'absolute',
            left:  baseX + r * Math.cos(ang) - sz / 2,
            top:   baseY + r * Math.sin(ang) - sz / 2,
            width: sz, height: sz, borderRadius: '50%',
            background: color,
            opacity: pulse,
            filter: 'blur(0.5px)',
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
