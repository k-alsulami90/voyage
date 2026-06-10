import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { theme, fonts } from '../theme';

// SCENE 5 — Plan (4.5s @ 60fps = 270f).
// Day-by-day itinerary rows cascade in with their times; one of them
// pops a moss "مُسجّل ✓" pill — the plan ↔ budget link in one beat.
const ROWS = [
  { time: '09:00', title: 'معبد كيوميزو',     emoji: '🎌', tint: theme.moss,   delay: 0.7 },
  { time: '12:30', title: 'غداء في غيون',     emoji: '🍜', tint: theme.clay,   delay: 0.95, logged: true },
  { time: '15:00', title: 'غابة الخيزران',    emoji: '🌿', tint: theme.indigo, delay: 1.2 },
  { time: '19:00', title: 'سوق نيشيكي',       emoji: '🛍️', tint: theme.honey,  delay: 1.45 },
];

export const Scene5Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Whole-stage drift + exit
  const drift = 8 * Math.sin((frame / fps) * 0.5);
  const exitScale = interpolate(frame, [durationInFrames - fps * 0.6, durationInFrames], [1, 0.94], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // "مُسجّل" pill pops late, after its row settles
  const loggedSpring = spring({
    frame: frame - fps * 2.6, fps,
    config: { damping: 8, mass: 0.6, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.6} />

      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, padding: '0 70px' }}>
        <KineticText size={80} weight={700} color={theme.ink} delay={0} duration={fps * 0.4} align="center">
          خطة كل يوم.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={40} weight={500} color={theme.inkSoft} delay={fps * 0.35} duration={fps * 0.4} align="center">
          أنشطة، أوقات — ومصاريفها مرتبطة بالميزانية.
        </KineticText>
      </div>

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${drift + 40}px) scale(${exitScale})`,
      }}>
        <div style={{
          width: 720, borderRadius: 28, overflow: 'hidden',
          background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.06)',
          boxShadow: '0 30px 60px -28px rgba(0,0,0,0.30)',
        }}>
          {/* Day header */}
          <div style={{
            padding: '18px 26px',
            borderBottom: '0.5px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            direction: 'rtl',
          }}>
            <div style={{
              fontFamily: fonts.serif, fontStyle: 'italic',
              fontSize: 30, color: theme.ink,
            }}>اليوم ٣ · كيوتو</div>
            <div style={{
              fontFamily: fonts.mono, fontSize: 15, color: theme.inkMute,
            }}>17 NOV</div>
          </div>

          {ROWS.map((r, i) => {
            const sp = spring({
              frame: frame - fps * r.delay, fps,
              config: { damping: 12, mass: 0.9, stiffness: 130 },
            });
            const x = interpolate(sp, [0, 1], [140, 0]);
            return (
              <div key={r.title} style={{
                transform: `translateX(${x}px)`,
                opacity: sp,
                padding: '17px 26px',
                borderBottom: i === ROWS.length - 1 ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl',
              }}>
                <span style={{
                  fontFamily: fonts.mono, fontSize: 16, fontWeight: 600,
                  color: theme.inkMute, minWidth: 64, direction: 'ltr', textAlign: 'left',
                }}>{r.time}</span>
                <div style={{
                  width: 48, height: 48, borderRadius: 13, background: r.tint,
                  display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0,
                }}>{r.emoji}</div>
                <div style={{
                  flex: 1, fontFamily: fonts.arSans, fontSize: 21, fontWeight: 600,
                  color: theme.ink,
                }}>{r.title}</div>
                {r.logged && (
                  <span style={{
                    transform: `scale(${loggedSpring})`,
                    opacity: loggedSpring,
                    padding: '6px 13px', borderRadius: 999,
                    background: 'oklch(0.50 0.08 155 / 0.15)',
                    border: '0.5px solid oklch(0.50 0.08 155 / 0.32)',
                    color: theme.mossDeep,
                    fontFamily: fonts.arSans, fontSize: 14, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    whiteSpace: 'nowrap',
                  }}>مُسجّل ✓</span>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 3.6} angle={-14} />
    </AbsoluteFill>
  );
};
