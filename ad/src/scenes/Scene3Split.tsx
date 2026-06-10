import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { theme, fonts } from '../theme';

// SCENE 3 — Split & settle (12–18s).
// Headline at top, then three avatars connect with ledger lines.
// A balance row reads "يترتب على كريم لك 200 ر.س" — a checkmark
// sweeps in and the row dims with "تمت التسوية". Reinforces the
// split logic the user spent v97/v98 nailing down.
export const Scene3Split: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineLift = interpolate(frame, [0, fps * 0.7], [30, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Avatars enter staggered
  const avatarOpacities = [0, 1, 2].map((i) =>
    interpolate(frame, [fps * (0.8 + i * 0.15), fps * (1.4 + i * 0.15)], [0, 1], {
      extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    })
  );

  // Ledger row appears
  const rowOpacity = interpolate(frame, [fps * 1.8, fps * 2.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Settle animation — at ~4.2s, check appears, row dims
  const settleProgress = interpolate(frame, [fps * 4.0, fps * 4.8], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{
      background: theme.cream,
      padding: '120px 60px 60px',
      direction: 'rtl',
    }}>
      <div style={{ transform: `translateY(${headlineLift}px)` }}>
        <ArabicText size={68} weight={700} color={theme.ink} delay={0} align="center">
          اقسم الحساب بوضوح.
        </ArabicText>
        <div style={{ height: 12 }} />
        <ArabicText size={68} weight={500} color={theme.inkSoft} delay={fps * 0.3} align="center">
          سوِّها بنقرة.
        </ArabicText>
      </div>

      {/* Avatars row */}
      <div style={{
        marginTop: 80,
        display: 'flex', justifyContent: 'center', gap: 36,
      }}>
        {[
          { initial: 'ك', hue: 35,  name: 'كريم' },
          { initial: 'م', hue: 155, name: 'محمد' },
          { initial: 'ع', hue: 250, name: 'علي' },
        ].map((a, i) => (
          <div key={a.name} style={{
            opacity: avatarOpacities[i],
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: `oklch(0.55 0.10 ${a.hue})`,
              display: 'grid', placeItems: 'center',
              fontFamily: fonts.arDisplay, fontSize: 52, fontWeight: 700,
              color: '#fff',
              border: '4px solid #fff',
              boxShadow: '0 10px 24px -10px rgba(0,0,0,0.30)',
            }}>{a.initial}</div>
            <div style={{
              fontFamily: fonts.arSans, fontSize: 18,
              color: theme.inkSoft, fontWeight: 500,
            }}>{a.name}</div>
          </div>
        ))}
      </div>

      {/* Ledger row */}
      <div style={{
        marginTop: 72,
        background: theme.cream2,
        borderRadius: 22, padding: '20px 24px',
        border: '0.5px solid rgba(0,0,0,0.06)',
        boxShadow: '0 18px 36px -22px rgba(0,0,0,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        // Single opacity expression: row enters, then dims as the
        // settlement check completes so it reads as resolved.
        opacity: rowOpacity * interpolate(settleProgress, [0, 1], [1, 0.55]),
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
        {/* Check pill */}
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: `oklch(0.45 0.10 155 / ${settleProgress})`,
          display: 'grid', placeItems: 'center',
          transform: `scale(${0.6 + 0.4 * settleProgress})`,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="#fff" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points={`20 6 9 17 4 12`} style={{
              strokeDasharray: 30,
              strokeDashoffset: 30 - 30 * settleProgress,
            }} />
          </svg>
        </div>
      </div>

      {/* "تمت التسوية" label appears after settle */}
      <div style={{
        marginTop: 18, textAlign: 'center',
        opacity: settleProgress,
        fontFamily: fonts.arDisplay, fontSize: 26, fontWeight: 600,
        color: theme.moss, letterSpacing: '-0.01em',
      }}>
        تمت التسوية ✓
      </div>
    </AbsoluteFill>
  );
};
