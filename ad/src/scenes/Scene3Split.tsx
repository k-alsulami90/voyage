import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { theme, fonts } from '../theme';

// SCENE 3 — Split & settle (10–15s, 150 frames).
// Avatars BOUNCE in with spring physics, ONE flow-line draws between
// kareem and the user with a moving dot ("money in transit"), the
// ledger row slides in connected to that line, check sweeps with a
// flash, "تمت التسوية" stamps in with a small scale-up.
export const Scene3Split: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Three avatars enter on staggered springs
  const avatarSpring = (i: number) => spring({
    frame: frame - fps * (0.4 + i * 0.18), fps,
    config: { damping: 9, mass: 0.9, stiffness: 130 },
  });

  // Flow line: 0->1 progress along the path from kareem (right) to user (left)
  const flowDraw = interpolate(frame, [fps * 1.4, fps * 2.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Moving "coin" dot along the same path
  const coinT = interpolate(frame, [fps * 1.6, fps * 2.8], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  // Ledger row spring
  const rowSpring = spring({
    frame: frame - fps * 2.6, fps,
    config: { damping: 13, mass: 0.9, stiffness: 110 },
  });
  const rowY = interpolate(rowSpring, [0, 1], [60, 0]);
  const rowOpacity = interpolate(rowSpring, [0, 0.5, 1], [0, 0.6, 1]);

  // Settle progress
  const settle = interpolate(frame, [fps * 3.4, fps * 4.2], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Flash on settle
  const flashOpacity = interpolate(frame, [fps * 3.4, fps * 3.55, fps * 3.75], [0, 0.4, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  // "تمت التسوية" enters with scale
  const confirmSpring = spring({
    frame: frame - fps * 3.7, fps,
    config: { damping: 10, mass: 0.7, stiffness: 180 },
  });

  // Geometry for the flow line — relative positions in the avatar row
  // Three avatars centered, gap 36, width 110 each. The line connects
  // avatar #1 (kareem, rightmost in RTL, leftmost in container) to
  // avatar #3 (user, leftmost in RTL, rightmost in container).
  // We'll just draw an SVG over the row.
  const rightX = 0.16;
  const leftX = 0.84;
  const lineY = 0.50; // relative to the SVG box

  return (
    <AbsoluteFill style={{
      background: theme.cream,
      padding: '120px 60px 60px',
      direction: 'rtl',
    }}>
      <AmbientBg tone="cream" intensity={0.55} />

      {/* Headline */}
      <div style={{ marginBottom: 14 }}>
        <KineticText size={78} weight={700} color={theme.ink} delay={0} staggerFrames={1.4} align="center">
          اقسم الحساب بوضوح.
        </KineticText>
      </div>
      <KineticText size={78} weight={500} color={theme.inkSoft} delay={fps * 0.35} staggerFrames={1.4} align="center">
        سوِّها بنقرة.
      </KineticText>

      {/* Avatars row with overlaid flow line */}
      <div style={{
        position: 'relative',
        marginTop: 70,
        height: 180,
      }}>
        {/* SVG flow line */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 100 100" preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.clay} stopOpacity="0.8" />
              <stop offset="100%" stopColor={theme.moss} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${rightX * 100} ${lineY * 100} Q 50 ${lineY * 100 - 15} ${leftX * 100} ${lineY * 100}`}
            stroke="url(#flowGrad)" strokeWidth="0.6" fill="none"
            strokeLinecap="round" strokeDasharray="100"
            strokeDashoffset={100 - flowDraw * 100}
            pathLength={100}
          />
        </svg>

        {/* The moving coin */}
        <div style={{
          position: 'absolute',
          left: `${(rightX + (leftX - rightX) * coinT) * 100}%`,
          top: `${(lineY - 0.07 * Math.sin(coinT * Math.PI)) * 100}%`,
          width: 28, height: 28, borderRadius: '50%',
          background: theme.honey,
          boxShadow: `0 0 30px ${theme.clay}`,
          transform: 'translate(-50%, -50%)',
          opacity: flowDraw > 0.05 && coinT < 0.99 ? 1 : 0,
        }} />

        {/* Avatars */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 0',
        }}>
          {[
            { initial: 'ك', hue: 35,  name: 'كريم' },
            { initial: 'م', hue: 155, name: 'محمد' },
            { initial: 'أ', hue: 250, name: 'أنا' },
          ].map((a, i) => {
            const sp = avatarSpring(i);
            const scale = interpolate(sp, [0, 1], [0.4, 1]);
            const opacity = sp;
            return (
              <div key={a.name} style={{
                transform: `scale(${scale})`, opacity,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <div style={{
                  width: 120, height: 120, borderRadius: '50%',
                  background: `oklch(0.55 0.10 ${a.hue})`,
                  display: 'grid', placeItems: 'center',
                  fontFamily: fonts.arDisplay, fontSize: 56, fontWeight: 700,
                  color: '#fff',
                  border: '4px solid #fff',
                  boxShadow: '0 14px 30px -10px rgba(0,0,0,0.35)',
                }}>{a.initial}</div>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 18,
                  color: theme.inkSoft, fontWeight: 500,
                }}>{a.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ledger row */}
      <div style={{
        marginTop: 60,
        transform: `translateY(${rowY}px)`,
        opacity: rowOpacity * interpolate(settle, [0, 1], [1, 0.62]),
        background: theme.cream2,
        borderRadius: 22, padding: '20px 24px',
        border: '0.5px solid rgba(0,0,0,0.06)',
        boxShadow: '0 20px 40px -22px rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: fonts.arSans, fontSize: 26,
          color: theme.ink, fontWeight: 500,
        }}>
          يترتب على <strong>كريم</strong> لك مبلغ{' '}
          <span style={{
            fontFamily: fonts.mono, fontWeight: 700,
            color: 'oklch(0.18 0.020 250)',
          }}>200 ر.س</span>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: `oklch(0.45 0.10 155 / ${settle})`,
          display: 'grid', placeItems: 'center',
          transform: `scale(${0.5 + 0.5 * settle})`,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="#fff" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" style={{
              strokeDasharray: 30,
              strokeDashoffset: 30 - 30 * settle,
            }} />
          </svg>
        </div>
      </div>

      <div style={{
        marginTop: 18, textAlign: 'center',
        opacity: confirmSpring,
        transform: `scale(${interpolate(confirmSpring, [0, 1], [0.7, 1])})`,
        fontFamily: fonts.arDisplay, fontSize: 30, fontWeight: 700,
        color: theme.mossDeep, letterSpacing: '-0.01em',
      }}>
        تمت التسوية ✓
      </div>

      {/* Settle flash */}
      <AbsoluteFill style={{ background: '#fff', opacity: flashOpacity, pointerEvents: 'none' }} />

      <LightStreak delay={fps * 4.4} angle={-15} />
    </AbsoluteFill>
  );
};
