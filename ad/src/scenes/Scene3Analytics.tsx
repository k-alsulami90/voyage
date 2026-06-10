import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { KineticText } from '../components/KineticText';
import { theme, fonts } from '../theme';

// SCENE 3 — Analytics & Debt Settlement (8.5s @ 60fps = 510f).
//
// Beat 1 (0.0 – 1.8s)  Camera reveals the analytics dashboard via a
//                      rapid ZOOM-OUT from 1.8x -> 1.0x with a small
//                      Y rotation -- like landing onto the page.
// Beat 2 (0.6 – 3.4s)  Donut chart strokes draw in segment by segment
//                      KPI numbers count up from 0
//                      Vertical bar chart fills bar by bar
// Beat 3 (2.6 – 4.8s)  Debt tracker card springs in from the right,
//                      showing "كريم يدين لك 200 SR"
// Beat 4 (4.6 – 5.8s)  "Settle Debt" press -> WHITE SPLASH +
//                      coin/particle burst -> "تمت التسوية" badge
//                      springs in with overshoot
// Beat 5 (5.6 – 7.0s)  Smooth ZOOM-IN into the Voyage logo as the
//                      dashboard recedes
// Beat 6 (7.0 – 8.5s)  Cinematic logo hold + tagline + premium fade

export const Scene3Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ─── CAMERA ─────────────────────────────────────────────────
  const introZoom = spring({
    frame, fps,
    config: { damping: 22, mass: 1.6, stiffness: 70 },
  });
  const camScale = interpolate(introZoom, [0, 1], [1.85, 1.0]);
  const camRotY = interpolate(introZoom, [0, 1], [-10, 0]);

  // Push-in to logo at ~5.6s -- dashboard scales DOWN as we move past
  const logoPushT = interpolate(frame, [fps * 5.6, fps * 7.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dashScale = camScale * interpolate(logoPushT, [0, 1], [1, 0.55]);
  const dashOpacity = interpolate(logoPushT, [0, 1], [1, 0]);

  // ─── KPI NUMBERS ────────────────────────────────────────────
  const kpiTrips     = Math.round(interpolate(frame, [fps * 0.7, fps * 2.5], [0, 12], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }));
  const kpiCountries = Math.round(interpolate(frame, [fps * 0.9, fps * 2.7], [0, 7], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }));
  const kpiSpent     = Math.round(interpolate(frame, [fps * 1.1, fps * 3.2], [0, 28432], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }));

  // ─── DONUT SEGMENTS ─────────────────────────────────────────
  const donutCats = [
    { color: theme.clay,   share: 0.32 },
    { color: theme.honey,  share: 0.40 },
    { color: theme.moss,   share: 0.18 },
    { color: theme.indigo, share: 0.10 },
  ];

  // ─── BAR CHART ──────────────────────────────────────────────
  const barValues = [0.45, 0.72, 0.58, 0.83, 0.62];

  // ─── DEBT CARD ──────────────────────────────────────────────
  const debtSpring = spring({
    frame: frame - fps * 2.6, fps,
    config: { damping: 11, mass: 1.0, stiffness: 130 },
  });
  const debtX = interpolate(debtSpring, [0, 1], [560, 0]);
  const debtRotY = interpolate(debtSpring, [0, 1], [30, 0]);

  // ─── SETTLE BURST ───────────────────────────────────────────
  // Splash flash at ~4.6s, settle particles burst, badge springs in
  const splashT = interpolate(frame, [fps * 4.6, fps * 5.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const splashFlash = interpolate(splashT, [0, 0.4, 1], [0, 1, 0]);
  const settledBadge = spring({
    frame: frame - fps * 4.7, fps,
    config: { damping: 8, mass: 0.6, stiffness: 200 },
  });
  const debtFade = interpolate(frame, [fps * 4.6, fps * 5.2], [1, 0.35], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Settle particle ring -- 12 dots flying outward
  const settleBurstT = interpolate(frame, [fps * 4.6, fps * 5.6], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const burstParticles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist = settleBurstT * 280;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: interpolate(settleBurstT, [0, 0.3, 1], [1, 1, 0]),
      scale: interpolate(settleBurstT, [0, 0.5, 1], [0.3, 1, 0.5]),
      color: i % 3 === 0 ? theme.honey : i % 3 === 1 ? theme.moss : theme.clay,
    };
  });

  // ─── LOGO ───────────────────────────────────────────────────
  const logoSpring = spring({
    frame: frame - fps * 6.0, fps,
    config: { damping: 16, mass: 1.0, stiffness: 110 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.45, 1]);
  const logoBlur = interpolate(logoSpring, [0, 1], [14, 0]);
  // Per-letter spring offset
  const logoLetters = Array.from('Voyage');

  const taglineSpring = spring({
    frame: frame - fps * 7.0, fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  // Final fade-out of the whole scene
  const finalFade = interpolate(frame, [durationInFrames - fps * 0.6, durationInFrames], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.cream, opacity: finalFade }}>
      <AmbientBg tone="cream" intensity={0.65} />
      <Particles count={32} color="rgba(170,140,90,0.32)" size={3} speed={0.7} opacity={0.5} />

      {/* DASHBOARD — recedes when logo takes over */}
      <AbsoluteFill style={{
        perspective: '2400px',
        transformStyle: 'preserve-3d',
        opacity: dashOpacity,
      }}>
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'flex-start',
          paddingTop: 140,
          transform: `scale(${dashScale}) rotateY(${camRotY}deg)`,
          transformStyle: 'preserve-3d',
        }}>
          {/* Headline */}
          <div style={{ marginBottom: 30 }}>
            <KineticText size={62} weight={700} color={theme.ink} delay={0} align="center" lineHeight={1.2}>
              كل رحلاتك. كل أرقامك.
            </KineticText>
          </div>

          {/* KPI Row */}
          <div style={{
            display: 'flex', gap: 18, marginBottom: 30,
            direction: 'rtl',
          }}>
            <KpiTile label="رحلاتي" value={kpiTrips.toString()} accent={theme.clay} />
            <KpiTile label="دولة" value={kpiCountries.toString()} accent={theme.moss} />
            <KpiTile label="SR" value={kpiSpent.toLocaleString('en')} accent={theme.indigo} valueSize={32} />
          </div>

          {/* Donut + Bars row */}
          <div style={{
            display: 'flex', gap: 24,
            alignItems: 'center', marginBottom: 30,
          }}>
            <DonutChart frame={frame} fps={fps} cats={donutCats} />
            <BarChart frame={frame} fps={fps} values={barValues} />
          </div>

          {/* Debt card */}
          <div style={{
            transform: `translateX(${debtX}px) rotateY(${debtRotY}deg)`,
            opacity: debtSpring,
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}>
            <div style={{ opacity: debtFade }}>
              <DebtCard />
            </div>

            {/* Splash flash */}
            <div style={{
              position: 'absolute', inset: -40, borderRadius: 28,
              background: '#fff',
              opacity: splashFlash * 0.6,
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />

            {/* Settle particles */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              {burstParticles.map((p, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                  opacity: p.opacity,
                  width: 14, height: 14, borderRadius: '50%',
                  background: p.color,
                  boxShadow: `0 0 16px ${p.color}`,
                }} />
              ))}
            </div>

            {/* Settled badge */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%) scale(${settledBadge})`,
              opacity: settledBadge,
              padding: '14px 28px', borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.moss} 0%, ${theme.mossDeep} 100%)`,
              color: '#fff',
              fontFamily: fonts.arDisplay, fontSize: 28, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 18px 36px -10px oklch(0.40 0.08 155 / 0.55)',
              direction: 'rtl',
            }}>
              <span>تمت التسوية</span>
              <span style={{ fontSize: 26 }}>✓</span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* LOGO LOCKUP */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        opacity: logoPushT,
        transformStyle: 'preserve-3d',
        flexDirection: 'column', gap: 26,
      }}>
        <div style={{
          display: 'flex',
          transform: `scale(${logoScale})`,
          filter: `blur(${logoBlur}px)`,
          fontFamily: fonts.serif, fontStyle: 'italic',
          fontSize: 240, color: theme.ink,
          letterSpacing: '-0.045em', lineHeight: 1,
        }}>
          {logoLetters.map((ch, i) => {
            const sp = spring({
              frame: frame - fps * (6.0 + i * 0.10), fps,
              config: { damping: 14, mass: 0.8, stiffness: 140 },
            });
            const y = interpolate(sp, [0, 1], [50, 0]);
            return (
              <span key={i} style={{
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                opacity: sp,
              }}>{ch}</span>
            );
          })}
        </div>
        <div style={{
          height: 2, width: 240 * Math.min(1, Math.max(0, (frame - fps * 6.6) / (fps * 0.8))),
          background: `linear-gradient(90deg, transparent 0%, ${theme.clay} 50%, transparent 100%)`,
        }} />
        <div style={{
          opacity: taglineSpring,
          transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
        }}>
          <KineticText size={48} weight={500} color={theme.inkSoft} delay={fps * 7.0} align="center">
            لعشاق الترحال والاستكشاف.
          </KineticText>
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 1.4} angle={-20} />
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

const KpiTile: React.FC<{ label: string; value: string; accent: string; valueSize?: number }> = ({
  label, value, accent, valueSize = 44,
}) => (
  <div style={{
    background: theme.cream2,
    borderRadius: 22, padding: '18px 22px',
    border: '0.5px solid rgba(0,0,0,0.06)',
    boxShadow: '0 16px 32px -16px rgba(0,0,0,0.20)',
    minWidth: 180, textAlign: 'center', direction: 'rtl',
  }}>
    <div style={{
      width: 32, height: 4, borderRadius: 2,
      background: accent, margin: '0 auto 10px',
    }} />
    <div style={{
      fontFamily: fonts.mono, fontSize: valueSize, fontWeight: 700,
      color: theme.ink, letterSpacing: '-0.02em', lineHeight: 1.0,
    }}>{value}</div>
    <div style={{
      marginTop: 6,
      fontFamily: fonts.arSans, fontSize: 14, fontWeight: 500,
      color: theme.inkMute,
    }}>{label}</div>
  </div>
);

const DonutChart: React.FC<{
  frame: number; fps: number;
  cats: { color: string; share: number }[];
}> = ({ frame, fps, cats }) => {
  const R = 90;
  const C = 2 * Math.PI * R;
  let offset = 0;
  // Draw progress 0..1 across all segments
  const drawProgress = interpolate(frame, [fps * 0.6, fps * 2.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div style={{
      position: 'relative', width: 260, height: 260,
      display: 'grid', placeItems: 'center',
      background: theme.cream2,
      borderRadius: 200, padding: 12,
      boxShadow: '0 24px 48px -22px rgba(0,0,0,0.25)',
      border: '0.5px solid rgba(0,0,0,0.06)',
    }}>
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="120" cy="120" r={R} fill="none"
          stroke="oklch(0.85 0.018 78)" strokeWidth="22" />
        {cats.map((c, i) => {
          const len = c.share * C * drawProgress;
          const el = (
            <circle key={i} cx="120" cy="120" r={R}
              fill="none" stroke={c.color} strokeWidth="22"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt" />
          );
          offset += c.share * C + 3;
          return el;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: fonts.mono, fontSize: 46, fontWeight: 700,
          color: theme.ink, lineHeight: 1.0, letterSpacing: '-0.02em',
        }}>{Math.round(drawProgress * 87)}<span style={{ fontSize: 22, opacity: 0.6 }}>%</span></div>
        <div style={{
          fontFamily: fonts.arSans, fontSize: 13, fontWeight: 500,
          color: theme.inkMute, marginTop: 4,
        }}>المُستخدم</div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{
  frame: number; fps: number;
  values: number[];
}> = ({ frame, fps, values }) => {
  return (
    <div style={{
      background: theme.cream2,
      borderRadius: 22, padding: '22px 22px',
      border: '0.5px solid rgba(0,0,0,0.06)',
      boxShadow: '0 16px 32px -16px rgba(0,0,0,0.20)',
      width: 260, height: 260,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      direction: 'rtl', gap: 12,
    }}>
      {values.map((v, i) => {
        const fillStart = fps * (0.8 + i * 0.18);
        const fillEnd = fillStart + fps * 0.9;
        const fill = interpolate(frame, [fillStart, fillEnd], [0, v], {
          extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div key={i} style={{
            flex: 1, height: `${fill * 100}%`,
            background: i % 2 === 0 ? theme.clay : theme.moss,
            borderRadius: 8,
            minHeight: 8,
          }} />
        );
      })}
    </div>
  );
};

const DebtCard: React.FC = () => (
  <div style={{
    width: 600, padding: '22px 26px',
    borderRadius: 22,
    background: theme.cream2,
    border: '0.5px solid rgba(0,0,0,0.06)',
    boxShadow: '0 24px 48px -22px rgba(0,0,0,0.30)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    direction: 'rtl',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'oklch(0.58 0.12 35)',
        color: '#fff',
        fontFamily: fonts.arDisplay, fontSize: 26, fontWeight: 700,
        display: 'grid', placeItems: 'center',
        border: '3px solid #fff',
      }}>ك</div>
      <div>
        <div style={{
          fontFamily: fonts.arSans, fontSize: 19, fontWeight: 600,
          color: theme.ink,
        }}>كريم يدين لك</div>
        <div style={{
          fontFamily: fonts.mono, fontSize: 28, fontWeight: 700,
          color: theme.clayDeep, marginTop: 4,
          letterSpacing: '-0.02em',
        }}>200 SR</div>
      </div>
    </div>
    <div style={{
      padding: '12px 20px', borderRadius: 999,
      background: theme.ink, color: theme.cream,
      fontFamily: fonts.arSans, fontSize: 16, fontWeight: 600,
    }}>تسوية</div>
  </div>
);
