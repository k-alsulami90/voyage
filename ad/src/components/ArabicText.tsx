import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { fonts, theme } from '../theme';

// Kinetic Arabic display text. Fades + lifts in over ~0.5s using an
// exponential ease so the motion settles fast and reads as composed
// rather than playful. RTL is forced via `dir="rtl"` on the span so
// punctuation lands correctly regardless of browser locale.
type Props = {
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  align?: 'start' | 'center' | 'end';
  delay?: number;        // frames before the animation begins
  lineHeight?: number;
};

export const ArabicText: React.FC<Props> = ({
  children, size = 88, weight = 700, color = theme.ink,
  align = 'center', delay = 0, lineHeight = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const opacity = interpolate(local, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const lift = interpolate(local, [0, fps * 0.5], [22, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: fonts.arDisplay,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing: '-0.02em',
        textAlign: align,
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      {children}
    </div>
  );
};
