import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { fonts, theme } from '../theme';

// Kinetic typography for Arabic. CRITICAL: Arabic glyphs join based
// on position (initial/medial/final/isolated). If we split a string
// into per-character <span>s, every glyph renders in its ISOLATED
// form and digits flip via BIDI ("24 ساعة" became "42 ساعة"). So we
// keep the full shaped string in ONE span and animate a clip-path
// wipe across it from the trailing edge.
//
// Direction-aware wipe:
//   rtl  → reveal from the RIGHT (where Arabic reads from)
//   ltr  → reveal from the LEFT
//
// Layered with a spring-driven Y lift + slight scale so it doesn't
// feel like a static curtain. After the wipe completes the line
// keeps a subtle continuous breath so it never sits truly still.
type Props = {
  children: string;
  size?: number;
  weight?: number;
  color?: string;
  align?: 'start' | 'center' | 'end';
  delay?: number;             // frames before the animation begins
  duration?: number;          // frames for the wipe (defaults to ~12)
  lineHeight?: number;
  italic?: boolean;
  serif?: boolean;
  direction?: 'rtl' | 'ltr';
  // staggerFrames is accepted for API parity with v1 but ignored --
  // per-char staggering breaks Arabic shaping. We treat it as a hint
  // for how much LONGER the wipe should be relative to the default.
  staggerFrames?: number;
};

export const KineticText: React.FC<Props> = ({
  children, size = 88, weight = 700, color = theme.ink,
  align = 'center', delay = 0, duration,
  lineHeight = 1.15, italic = false, serif = false,
  direction = 'rtl', staggerFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - delay);

  // Wipe duration scales with string length so longer phrases get
  // a slightly longer reveal. Caller can override via `duration`,
  // or hint at speed via the legacy `staggerFrames` prop.
  const charCount = Array.from(children).length;
  const wipeFrames = duration ?? Math.max(
    Math.round(fps * 0.30),
    Math.round(charCount * (staggerFrames ?? 1.3)),
  );

  // Spring lift — line eases up while it wipes in
  const sp = spring({
    frame: local, fps,
    config: { damping: 16, mass: 0.9, stiffness: 130 },
  });
  const lift = interpolate(sp, [0, 1], [26, 0]);
  const initialScale = interpolate(sp, [0, 1], [0.96, 1]);

  // Wipe percentage 0..100
  const wipe = interpolate(local, [0, wipeFrames], [0, 100], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // For RTL we want the right side to appear first.
  // `clip-path: inset(top right bottom left)` -- to hide the LEFT
  // first and reveal the right, set `left` to a large value and
  // shrink it to 0. For LTR, do the opposite.
  const clip = direction === 'rtl'
    ? `inset(0% 0% 0% ${100 - wipe}%)`
    : `inset(0% ${100 - wipe}% 0% 0%)`;

  // Breathing after the wipe is done
  const settledFrame = Math.max(0, local - wipeFrames);
  const breath = 1 + 0.004 * Math.sin((settledFrame / fps) * Math.PI * 1.4);

  return (
    <div
      dir={direction}
      style={{
        fontFamily: serif ? fonts.serif : fonts.arDisplay,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing: '-0.02em',
        textAlign: align,
        fontStyle: italic ? 'italic' : 'normal',
        transform: `translateY(${lift}px) scale(${initialScale * breath})`,
        transformOrigin: align === 'start' ? 'left center'
                       : align === 'end'   ? 'right center'
                       : 'center center',
        clipPath: clip,
      }}
    >
      {children}
    </div>
  );
};
