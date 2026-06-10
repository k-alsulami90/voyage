import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { ArabicText } from '../components/ArabicText';
import { theme, fonts } from '../theme';

// SCENE 5 — Vault (24–30s).
// Four document cards stagger in from below into a 2x2 grid. Each
// card carries one of the real categories from the app (تذاكر،
// تأشيرات، حجوزات، إيجارات). Headline at top reads "كل وثائقك في
// مكان واحد."
const DOCS = [
  { label: 'تذاكر الطيران',   emoji: '✈️', tint: theme.indigo },
  { label: 'حجوزات السكن',     emoji: '🏨', tint: theme.honey },
  { label: 'التأشيرات',        emoji: '📘', tint: theme.moss },
  { label: 'وسائل النقل',      emoji: '🚆', tint: theme.clay },
];

export const Scene5Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: theme.cream,
      padding: '120px 70px 60px',
      direction: 'rtl',
    }}>
      <ArabicText size={68} weight={700} color={theme.ink} delay={0} align="center" lineHeight={1.3}>
        كل وثائقك
      </ArabicText>
      <ArabicText size={68} weight={500} color={theme.inkSoft} delay={fps * 0.25} align="center" lineHeight={1.3}>
        في مكان واحد.
      </ArabicText>

      {/* 2x2 doc grid */}
      <div style={{
        marginTop: 90,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {DOCS.map((d, i) => {
          const start = fps * (0.9 + i * 0.18);
          const opacity = interpolate(frame, [start, start + fps * 0.5], [0, 1], {
            extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
          });
          const lift = interpolate(frame, [start, start + fps * 0.5], [40, 0], {
            extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div key={d.label} style={{
              opacity, transform: `translateY(${lift}px)`,
              background: theme.cream2,
              borderRadius: 24,
              padding: '28px 24px',
              border: '0.5px solid rgba(0,0,0,0.06)',
              boxShadow: '0 20px 40px -24px rgba(0,0,0,0.20)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div style={{
                width: 70, height: 70, borderRadius: 18,
                background: `${d.tint}`,
                display: 'grid', placeItems: 'center',
                fontSize: 38, lineHeight: 1,
              }}>{d.emoji}</div>
              <div style={{
                fontFamily: fonts.arDisplay, fontSize: 28, fontWeight: 600,
                color: theme.ink, lineHeight: 1.2,
              }}>{d.label}</div>
              {/* Status pill — "محفوظ" */}
              <div style={{
                display: 'inline-flex', alignSelf: 'flex-start',
                padding: '5px 11px', borderRadius: 999,
                background: 'oklch(0.50 0.08 155 / 0.15)',
                color: theme.mossDeep,
                fontFamily: fonts.mono, fontSize: 12, fontWeight: 600,
              }}>محفوظ</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
