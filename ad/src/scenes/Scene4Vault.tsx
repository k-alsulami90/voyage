import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme, fonts } from '../theme';

// SCENE 4 — Vault + Smart Track (7s @ 60fps = 420f).
//
// Beat 1 (0.0–1.1s)  Camera PANS DOWN into the vault (stage drops in
//                    on a heavy spring).
// Beat 2 (0.6–2.2s)  Three documents fly in from off-screen corners
//                    and STACK with rotational lock-in.
// Beat 3 (2.2–3.3s)  Scan beam sweeps the flight doc.
// Beat 4 (3.3–4.5s)  Smart Track card springs down from above with a
//                    3D pop — the 24h-before-flight state.
// Beat 5 (4.4–5.6s)  Three action pills stagger in; the white boarding
//                    pass pill gets a flare ring; الموقع pulses.
// Beat 6 (6.3–7.0s)  Exit scale for the cut.

const DOCS = [
  { key: 'visa',   emoji: '📘', tint: theme.indigo, label: 'تأشيرة اليابان',
    from: { x: -1100, y:  420, rot: -38 }, to: { x: -22, y: 56, rot: -5 }, delay: 0.6 },
  { key: 'hotel',  emoji: '🏨', tint: theme.honey, label: 'فندق نيكو طوكيو',
    from: { x:  1100, y:  520, rot:  34 }, to: { x:  18, y: 26, rot:  4 }, delay: 0.82 },
  { key: 'flight', emoji: '✈️', tint: theme.clay, label: 'SV777 · الرياض → طوكيو',
    from: { x: -180,  y: -1000, rot: 18 }, to: { x:   0, y:  0, rot: -1 }, delay: 1.04 },
];

export const Scene4Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Camera pan-down
  const pan = spring({
    frame, fps,
    config: { damping: 20, mass: 1.6, stiffness: 85 },
  });
  const panY = interpolate(pan, [0, 1], [-760, 0]);
  const drift = 14 * Math.sin((frame / fps) * 0.45);
  const exitScale = interpolate(frame, [durationInFrames - fps * 0.7, durationInFrames], [1, 0.94], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Scan beam
  const scan = interpolate(frame, [fps * 2.2, fps * 3.3], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  // Smart Track card
  const stSpring = spring({
    frame: frame - fps * 3.3, fps,
    config: { damping: 11, mass: 1.0, stiffness: 125 },
  });
  const stY = interpolate(stSpring, [0, 1], [-420, 0]);
  const stRotX = interpolate(stSpring, [0, 1], [-32, 0]);
  const stBob = 4 * Math.sin((frame / fps) * 0.8);

  // Action pills + effects
  const pillFlareT = interpolate(frame, [fps * 5.0, fps * 6.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const mapsPulse = 1 + 0.06 * Math.sin((frame / fps) * 3.6);
  const mapsGlow = 12 + 12 * Math.abs(Math.sin((frame / fps) * 3.6));

  const ACTIONS = [
    { label: 'بطاقة الصعود', emoji: '🛂', primary: true,  delay: 4.4 },
    { label: 'حجز الفندق',    emoji: '🏨', primary: false, delay: 4.6 },
    { label: 'الموقع',        emoji: '📍', primary: false, delay: 4.8, pulse: true },
  ];

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.65} />
      <Particles count={28} color="rgba(170,140,90,0.30)" size={3} speed={0.7} opacity={0.5} />

      {/* Headline */}
      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, padding: '0 70px', zIndex: 5 }}>
        <KineticText size={76} weight={700} color={theme.ink} delay={0} duration={fps * 0.45} align="center">
          وثائقك، حاضرة.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={40} weight={500} color={theme.clayDeep} delay={fps * 0.4} duration={fps * 0.45} align="center">
          بطاقة الصعود تظهر قبل رحلتك بـ 24 ساعة.
        </KineticText>
      </div>

      <AbsoluteFill style={{
        perspective: '2400px',
        transform: `translateY(${panY + drift}px) scale(${exitScale})`,
        transformStyle: 'preserve-3d',
      }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}>

          {/* DOC STACK */}
          {DOCS.map((d, i) => {
            const sp = spring({
              frame: frame - fps * d.delay, fps,
              config: { damping: 13, mass: 1.1, stiffness: 95 },
            });
            const x = interpolate(sp, [0, 1], [d.from.x, d.to.x]);
            const y = interpolate(sp, [0, 1], [d.from.y, d.to.y]);
            const rot = interpolate(sp, [0, 1], [d.from.rot, d.to.rot]);
            const tilt = 4 * Math.sin((frame / fps) * 0.7 + i * 1.2);
            const isTop = d.key === 'flight';
            return (
              <div key={d.key} style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y - 170}px) scale(${interpolate(sp, [0, 1], [0.55, 1])}) rotate(${rot}deg) rotateY(${tilt}deg)`,
                opacity: sp,
                zIndex: 10 + i,
                transformStyle: 'preserve-3d',
                filter: `drop-shadow(0 ${20 + i * 8}px ${30 + i * 10}px rgba(0,0,0,0.30))`,
              }}>
                <div style={{
                  width: 560, height: 200, borderRadius: 24, overflow: 'hidden',
                  background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.08)',
                  position: 'relative', direction: 'rtl',
                  padding: '24px 26px', display: 'flex', alignItems: 'center', gap: 20,
                }}>
                  <div style={{
                    width: 92, height: 92, borderRadius: 20, background: d.tint,
                    display: 'grid', placeItems: 'center', fontSize: 46, flexShrink: 0,
                    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.28)',
                  }}>{d.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.mono, fontSize: 13, fontWeight: 500,
                      color: theme.inkMute, letterSpacing: '0.16em',
                      textTransform: 'uppercase', marginBottom: 8,
                    }}>VOYAGE · VAULT</div>
                    <div style={{
                      fontFamily: fonts.arDisplay, fontSize: 27, fontWeight: 700,
                      color: theme.ink, lineHeight: 1.15,
                    }}>{d.label}</div>
                    <div style={{
                      marginTop: 9, display: 'inline-flex',
                      padding: '4px 11px', borderRadius: 999,
                      background: 'oklch(0.50 0.08 155 / 0.16)', color: theme.mossDeep,
                      fontFamily: fonts.mono, fontSize: 12, fontWeight: 600,
                    }}>محفوظ ✓</div>
                  </div>

                  {/* Scan beam on the flight doc */}
                  {isTop && scan > 0 && scan < 1 && (
                    <>
                      <div style={{
                        position: 'absolute', left: 0, right: 0,
                        top: `${scan * 100}%`, height: 6,
                        background: `linear-gradient(90deg, transparent 0%, ${theme.honey} 50%, transparent 100%)`,
                        boxShadow: `0 0 24px ${theme.honey}`,
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(180deg, transparent ${Math.max(0, scan * 100 - 9)}%, rgba(255,200,140,0.20) ${scan * 100}%, transparent ${Math.min(100, scan * 100 + 9)}%)`,
                      }} />
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* SMART TRACK CARD */}
          <div style={{
            position: 'absolute',
            transform: `translateY(${stY + stBob + 330}px) rotateX(${stRotX}deg) rotateY(${3 * Math.sin((frame / fps) * 0.6)}deg)`,
            opacity: stSpring,
            zIndex: 30,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 36px 56px rgba(0,0,0,0.42))',
          }}>
            <div style={{
              width: 640, borderRadius: 28, overflow: 'hidden',
              background: 'linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)',
              color: '#fff', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(85% 60% at 100% 0%, ${theme.honey} 0%, transparent 60%)`,
                opacity: 0.30,
              }} />
              <div style={{ position: 'relative', padding: '24px 26px 22px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '7px 14px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.22)', border: '0.5px solid rgba(255,255,255,0.30)',
                  fontFamily: fonts.mono, fontSize: 16, fontWeight: 700, direction: 'rtl',
                  transform: `scale(${1 + 0.04 * Math.sin((frame / fps) * 2.4)})`,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', boxShadow: '0 0 14px #fff' }} />
                  خلال 23 ساعة
                </div>

                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl' }}>
                  <div style={{
                    width: 62, height: 62, borderRadius: 16,
                    background: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.30)',
                    display: 'grid', placeItems: 'center', fontSize: 30,
                  }}>✈️</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.serif, fontStyle: 'italic',
                      fontSize: 31, lineHeight: 1.05, color: '#fff',
                    }}>SV777 · الرياض ← طوكيو</div>
                    <div style={{
                      marginTop: 6, fontFamily: fonts.mono, fontSize: 16,
                      color: 'rgba(255,255,255,0.86)', letterSpacing: '0.04em',
                    }}>RUH → HND · T2</div>
                  </div>
                </div>

                {/* Action pills */}
                <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap', direction: 'rtl' }}>
                  {ACTIONS.map((a) => {
                    const sp = spring({
                      frame: frame - fps * a.delay, fps,
                      config: { damping: 9, mass: 0.7, stiffness: 175 },
                    });
                    return (
                      <div key={a.label} style={{
                        position: 'relative',
                        transform: `translateY(${interpolate(sp, [0, 1], [22, 0])}px) scale(${interpolate(sp, [0, 1], [0.4, 1]) * (a.pulse ? mapsPulse : 1)})`,
                        opacity: sp,
                      }}>
                        {a.primary && (
                          <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: `translate(-50%, -50%) scale(${1 + pillFlareT * 2.2})`,
                            width: '100%', height: '100%', borderRadius: 999,
                            border: '2px solid #fff',
                            opacity: interpolate(pillFlareT, [0, 0.5, 1], [0.7, 0.3, 0]),
                          }} />
                        )}
                        <div style={{
                          position: 'relative',
                          padding: '12px 17px', borderRadius: 999,
                          background: a.primary ? '#fff' : 'rgba(255,255,255,0.10)',
                          color: a.primary ? 'oklch(0.22 0.025 250)' : 'rgba(255,255,255,0.94)',
                          border: a.primary ? 'none' : '0.5px solid rgba(255,255,255,0.30)',
                          fontFamily: fonts.arSans, fontSize: 16, fontWeight: 600,
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          boxShadow: a.pulse ? `0 0 ${mapsGlow}px ${theme.honey}` : 'none',
                        }}>
                          <span style={{ fontSize: 18 }}>{a.emoji}</span>
                          {a.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <LightStreak delay={fps * 6.2} angle={22} />
    </AbsoluteFill>
  );
};
