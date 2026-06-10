import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { theme, fonts } from '../theme';

// SCENE 3 — Money: auto-FX, split, settle (7.5s @ 60fps = 450f).
// The load-bearing job of the app, so it gets the longest scene.
//
// Beat 1 (0.2–1.5s)  Receipt floats in: عشاء في كيوتو · ¥25,000
// Beat 2 (1.6–2.3s)  GLOW MORPH: ¥25,000 → SR 627 (auto-FX), white
//                    flash + blur crossfade + honey bloom.
// Beat 3 (2.6–4.0s)  SPLIT BURST: four category cards explode out of
//                    the receipt, rotating 180° in flight.
// Beat 4 (4.2–5.4s)  Categories recede; the BALANCE row springs in:
//                    "يترتب على كريم لك مبلغ 200 SR" + زر تسوية.
// Beat 5 (5.5–6.5s)  SETTLE: white splash, 14-particle coin ring,
//                    "تمت التسوية ✓" badge with overshoot.
// Beat 6 (6.8–7.5s)  Rapid zoom-out to cut.

const CATS = [
  { label: 'مطاعم', share: 0.32, color: theme.clay,   emoji: '🍜', tx: -350, ty: -360 },
  { label: 'إقامة', share: 0.40, color: theme.honey,  emoji: '🏨', tx:  350, ty: -360 },
  { label: 'تنقل',  share: 0.18, color: theme.moss,   emoji: '🚄', tx: -350, ty:  330 },
  { label: 'ثقافة', share: 0.10, color: theme.indigo, emoji: '🎌', tx:  350, ty:  330 },
];

export const Scene3Money: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Receipt entry
  const rcptSpring = spring({
    frame: frame - fps * 0.2, fps,
    config: { damping: 11, mass: 1.0, stiffness: 130 },
  });

  // FX morph
  const conv = interpolate(frame, [fps * 1.6, fps * 2.3], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const flash = interpolate(frame, [fps * 1.6, fps * 1.82, fps * 2.2], [0, 1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // Split burst
  const burstStart = 2.6;
  // Receipt recedes during burst
  const rcptRecede = interpolate(frame, [fps * burstStart, fps * (burstStart + 1.2)], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rcptOpacity = rcptSpring * interpolate(rcptRecede, [0, 1], [1, 0]);

  // Categories recede before the balance row
  const catsExit = interpolate(frame, [fps * 4.2, fps * 4.9], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const catsExitY = interpolate(frame, [fps * 4.2, fps * 4.9], [0, -120], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.5, 0, 0.75, 0),
  });

  // Balance row
  const balSpring = spring({
    frame: frame - fps * 4.4, fps,
    config: { damping: 11, mass: 0.9, stiffness: 130 },
  });
  const balY = interpolate(balSpring, [0, 1], [120, 0]);

  // Settle
  const settle = interpolate(frame, [fps * 5.5, fps * 6.1], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const settleFlash = interpolate(frame, [fps * 5.5, fps * 5.65, fps * 5.95], [0, 0.55, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const badgeSpring = spring({
    frame: frame - fps * 5.62, fps,
    config: { damping: 8, mass: 0.6, stiffness: 210 },
  });
  const ringT = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Camera
  const camPush = interpolate(frame, [0, fps * 5], [1.0, 1.06], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const exitZoom = interpolate(frame, [durationInFrames - fps * 0.7, durationInFrames], [1, 0.5], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.7} />

      {/* Headline */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, padding: '0 70px' }}>
        <KineticText size={80} weight={700} color={theme.ink} delay={0} duration={fps * 0.45} align="center">
          أي عملة. قسمة عادلة.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={40} weight={500} color={theme.inkSoft} delay={fps * 0.4} duration={fps * 0.4} align="center">
          تحويل تلقائي — وتسوية بنقرة.
        </KineticText>
      </div>

      <AbsoluteFill style={{
        perspective: '2400px', transformStyle: 'preserve-3d',
        alignItems: 'center', justifyContent: 'center',
        transform: `scale(${camPush * exitZoom})`,
      }}>
        {/* RECEIPT */}
        <div style={{
          position: 'absolute',
          transform: `
            translateY(${interpolate(rcptSpring, [0, 1], [240, 20]) - rcptRecede * 140}px)
            scale(${interpolate(rcptSpring, [0, 1], [0.4, 1]) * (1 - rcptRecede * 0.4)})
            rotateX(${interpolate(rcptSpring, [0, 1], [-28, 0])}deg)
            rotateY(${-5 * Math.sin((frame / fps) * 0.8)}deg)
          `,
          opacity: rcptOpacity,
          filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.30))',
        }}>
          <div style={{
            width: 520, padding: '30px 32px 28px', borderRadius: 26,
            background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.06)',
            direction: 'rtl',
            boxShadow: `0 0 ${40 + flash * 90}px ${flash > 0 ? theme.honey : 'transparent'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: theme.clay,
                display: 'grid', placeItems: 'center', fontSize: 28,
              }}>🍜</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 24, fontWeight: 700, color: theme.ink,
                }}>عشاء في كيوتو</div>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 14, color: theme.inkMute, marginTop: 3,
                }}>دفعها كريم · مقسومة على ٤</div>
              </div>
            </div>
            {/* Amount morph */}
            <div style={{ marginTop: 24, height: 66, position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                opacity: 1 - conv, filter: `blur(${conv * 14}px)`,
                fontFamily: fonts.mono, fontSize: 54, fontWeight: 700,
                color: theme.ink, letterSpacing: '-0.02em',
              }}>¥25,000</div>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                opacity: conv, filter: `blur(${(1 - conv) * 14}px)`,
                fontFamily: fonts.mono, fontSize: 54, fontWeight: 700,
                color: theme.clayDeep, letterSpacing: '-0.02em',
                textShadow: conv > 0.3 ? `0 0 ${26 * conv}px ${theme.honey}` : 'none',
              }}>SR 627</div>
            </div>
            <div style={{
              marginTop: 6, fontFamily: fonts.arSans, fontSize: 15, color: theme.inkMute,
            }}>
              {conv > 0.4 ? 'تحويل تلقائي إلى عملتك — بسعر الصرف المحدّث' : 'مسجل بالين الياباني'}
            </div>
          </div>
        </div>

        {/* SPLIT BURST CATEGORY CARDS */}
        {CATS.map((c, i) => {
          const sp = spring({
            frame: frame - fps * (burstStart + i * 0.07), fps,
            config: { damping: 10, mass: 0.8, stiffness: 135 },
          });
          const x = interpolate(sp, [0, 1], [0, c.tx]);
          const y = interpolate(sp, [0, 1], [0, c.ty]);
          const rot = interpolate(sp, [0, 1], [180, 0]);
          const cb = 5 * Math.sin((frame / fps) * 1.0 + i * 1.4);
          return (
            <div key={c.label} style={{
              position: 'absolute',
              transform: `
                translate(${x}px, ${y + cb + 20 + catsExitY}px)
                scale(${interpolate(sp, [0, 1], [0.1, 1])})
                rotate(${rot}deg)
              `,
              opacity: sp * catsExit,
              filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.22))',
            }}>
              <div style={{
                width: 250, padding: '20px 22px', borderRadius: 22,
                background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.06)',
                direction: 'rtl',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: c.color,
                  display: 'grid', placeItems: 'center', fontSize: 26, marginBottom: 12,
                }}>{c.emoji}</div>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 17, fontWeight: 600,
                  color: theme.inkSoft, marginBottom: 4,
                }}>{c.label}</div>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 30, fontWeight: 700,
                  color: theme.ink, letterSpacing: '-0.01em',
                }}>SR {Math.round(627 * c.share)}</div>
              </div>
            </div>
          );
        })}

        {/* BALANCE ROW + SETTLE */}
        <div style={{
          position: 'absolute',
          transform: `translateY(${balY + 40}px)`,
          opacity: balSpring,
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 620, padding: '24px 28px', borderRadius: 24,
              background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.06)',
              boxShadow: '0 26px 50px -24px rgba(0,0,0,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              direction: 'rtl',
              opacity: interpolate(settle, [0, 1], [1, 0.55]),
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 58, height: 58, borderRadius: '50%',
                  background: 'oklch(0.58 0.12 35)', color: '#fff',
                  fontFamily: fonts.arDisplay, fontSize: 27, fontWeight: 700,
                  display: 'grid', placeItems: 'center', border: '3px solid #fff',
                }}>ك</div>
                <div>
                  <div style={{
                    fontFamily: fonts.arSans, fontSize: 21, fontWeight: 600, color: theme.ink,
                  }}>يترتب على كريم لك مبلغ</div>
                  <div style={{
                    fontFamily: fonts.mono, fontSize: 30, fontWeight: 700,
                    color: theme.clayDeep, marginTop: 4, letterSpacing: '-0.02em',
                  }}>SR 200</div>
                </div>
              </div>
              <div style={{
                padding: '13px 22px', borderRadius: 999,
                background: theme.ink, color: theme.cream,
                fontFamily: fonts.arSans, fontSize: 17, fontWeight: 600,
              }}>تسوية</div>
            </div>

            {/* Splash flash behind the row */}
            <div style={{
              position: 'absolute', inset: -40, borderRadius: 30,
              background: '#fff', opacity: settleFlash, filter: 'blur(22px)',
              pointerEvents: 'none',
            }} />

            {/* Coin particle ring */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              {Array.from({ length: 14 }, (_, i) => {
                const ang = (i / 14) * Math.PI * 2;
                const dist = ringT * 300;
                const color = i % 3 === 0 ? theme.honey : i % 3 === 1 ? theme.moss : theme.clay;
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(${interpolate(ringT, [0, 0.5, 1], [0.3, 1, 0.5])})`,
                    opacity: interpolate(ringT, [0, 0.3, 1], [ringT > 0 ? 1 : 0, 1, 0]),
                    width: 15, height: 15, borderRadius: '50%',
                    background: color, boxShadow: `0 0 16px ${color}`,
                  }} />
                );
              })}
            </div>

            {/* Settled badge */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: `translate(-50%, -50%) scale(${badgeSpring})`,
              opacity: badgeSpring,
              padding: '15px 30px', borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.moss} 0%, ${theme.mossDeep} 100%)`,
              color: '#fff', fontFamily: fonts.arDisplay, fontSize: 30, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 12,
              boxShadow: '0 20px 40px -10px oklch(0.40 0.08 155 / 0.55)',
              direction: 'rtl', whiteSpace: 'nowrap',
            }}>
              <span>تمت التسوية</span>
              <span style={{ fontSize: 27 }}>✓</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <LightStreak delay={fps * 6.6} angle={-16} />
    </AbsoluteFill>
  );
};
