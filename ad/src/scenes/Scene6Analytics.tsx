import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { theme, fonts } from '../theme';

// SCENE 6 — Analytics & lifetime insights (5.5s @ 60fps = 330f).
// Spring zoom-out reveal; KPIs count up; donut draws segment by
// segment; bars stagger-fill. Exit zoom toward the CTA.
export const Scene6Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({
    frame, fps,
    config: { damping: 20, mass: 1.5, stiffness: 75 },
  });
  const camScale = interpolate(intro, [0, 1], [1.8, 1.0]);
  const camRotY = interpolate(intro, [0, 1], [-9, 0]);
  const exitZoom = interpolate(frame, [durationInFrames - fps * 0.7, durationInFrames], [1, 1.18], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.5, 0, 0.75, 0),
  });

  const count = (start: number, end: number, target: number) =>
    Math.round(interpolate(frame, [fps * start, fps * end], [0, target], {
      extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }));

  const kpis = [
    { label: 'رحلة',  value: count(0.5, 2.0, 12).toString(),                 accent: theme.clay },
    { label: 'دولة',  value: count(0.7, 2.2, 7).toString(),                  accent: theme.moss },
    { label: 'SR',    value: count(0.9, 2.8, 28432).toLocaleString('en'),    accent: theme.indigo, small: true },
  ];

  const donutCats = [
    { color: theme.clay,   share: 0.32 },
    { color: theme.honey,  share: 0.40 },
    { color: theme.moss,   share: 0.18 },
    { color: theme.indigo, share: 0.10 },
  ];
  const R = 88, C = 2 * Math.PI * R;
  const donutDraw = interpolate(frame, [fps * 0.8, fps * 2.6], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const bars = [0.45, 0.72, 0.58, 0.83, 0.62];
  let donutOffset = 0;

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.6} />

      <AbsoluteFill style={{
        perspective: '2400px',
        alignItems: 'center', justifyContent: 'center',
        transform: `scale(${camScale * exitZoom}) rotateY(${camRotY}deg)`,
        transformStyle: 'preserve-3d',
      }}>
        <KineticText size={78} weight={700} color={theme.ink} delay={fps * 0.1} duration={fps * 0.45} align="center">
          أرقامك. بوضوح.
        </KineticText>

        {/* KPI tiles */}
        <div style={{ display: 'flex', gap: 18, marginTop: 50, direction: 'rtl' }}>
          {kpis.map((k, i) => {
            const sp = spring({
              frame: frame - fps * (0.4 + i * 0.14), fps,
              config: { damping: 11, mass: 0.8, stiffness: 140 },
            });
            return (
              <div key={k.label} style={{
                transform: `translateY(${interpolate(sp, [0, 1], [60, 0])}px) scale(${interpolate(sp, [0, 1], [0.7, 1])})`,
                opacity: sp,
                background: theme.cream2, borderRadius: 22, padding: '20px 24px',
                border: '0.5px solid rgba(0,0,0,0.06)',
                boxShadow: '0 16px 32px -16px rgba(0,0,0,0.20)',
                minWidth: 175, textAlign: 'center',
              }}>
                <div style={{ width: 32, height: 4, borderRadius: 2, background: k.accent, margin: '0 auto 12px' }} />
                <div style={{
                  fontFamily: fonts.mono, fontSize: k.small ? 33 : 46, fontWeight: 700,
                  color: theme.ink, letterSpacing: '-0.02em', lineHeight: 1.0,
                }}>{k.value}</div>
                <div style={{
                  marginTop: 7, fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
                  color: theme.inkMute,
                }}>{k.label}</div>
              </div>
            );
          })}
        </div>

        {/* Donut + bars */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 30 }}>
          <div style={{
            position: 'relative', width: 280, height: 280,
            display: 'grid', placeItems: 'center',
            background: theme.cream2, borderRadius: 200, padding: 12,
            boxShadow: '0 24px 48px -22px rgba(0,0,0,0.25)',
            border: '0.5px solid rgba(0,0,0,0.06)',
          }}>
            <svg width="252" height="252" viewBox="0 0 252 252" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="126" cy="126" r={R} fill="none" stroke="oklch(0.85 0.018 78)" strokeWidth="24" />
              {donutCats.map((c, i) => {
                const len = c.share * C * donutDraw;
                const el = (
                  <circle key={i} cx="126" cy="126" r={R} fill="none"
                    stroke={c.color} strokeWidth="24"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={-donutOffset} strokeLinecap="butt" />
                );
                donutOffset += c.share * C + 3;
                return el;
              })}
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 50, fontWeight: 700,
                color: theme.ink, lineHeight: 1.0, letterSpacing: '-0.02em',
              }}>{Math.round(donutDraw * 87)}<span style={{ fontSize: 24, opacity: 0.6 }}>%</span></div>
              <div style={{
                fontFamily: fonts.arSans, fontSize: 14, fontWeight: 500,
                color: theme.inkMute, marginTop: 5,
              }}>من الميزانية</div>
            </div>
          </div>

          <div style={{
            background: theme.cream2, borderRadius: 22, padding: 24,
            border: '0.5px solid rgba(0,0,0,0.06)',
            boxShadow: '0 16px 32px -16px rgba(0,0,0,0.20)',
            width: 280, height: 280,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            direction: 'rtl', gap: 13,
          }}>
            {bars.map((v, i) => {
              const fill = interpolate(frame, [fps * (1.0 + i * 0.16), fps * (1.9 + i * 0.16)], [0, v], {
                extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              return (
                <div key={i} style={{
                  flex: 1, height: `${fill * 100}%`,
                  background: i % 2 === 0 ? theme.clay : theme.moss,
                  borderRadius: 9, minHeight: 8,
                }} />
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 1.2} angle={-20} />
    </AbsoluteFill>
  );
};
