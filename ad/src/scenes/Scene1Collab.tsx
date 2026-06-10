import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { AmbientBg } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { KineticText } from '../components/KineticText';
import { theme, fonts } from '../theme';

// SCENE 1 — Collaboration & Smart Budgeting (9.5s @ 60fps = 570f).
//
// Beat 1  (0.0 – 1.5s)  Trip card materialises in 3D and slowly orbits
// Beat 2  (1.0 – 3.2s)  Four friend avatars spring in around the card
// Beat 3  (3.0 – 4.6s)  Expense receipt floats in showing ¥25,000
// Beat 4  (4.4 – 5.4s)  Glowing morph: ¥25,000 → SR 627
// Beat 5  (5.2 – 7.6s)  SR amount BURSTS apart into 4 category sub-cards
//                       that fly outward, the camera zooms out to track them
// Beat 6  (7.4 – 9.5s)  Camera rapid zoom-out + dim to black for the cut
//
// Everything floats free in 3D space. No phone frame anywhere. Each
// element has its own perspective, rotateX / rotateY, and spring entry.

const CATEGORIES = [
  { key: 'food',    label: 'مطاعم',   share: 0.32, color: theme.clay,   emoji: '🍜', target: { x: -380, y: -180 } },
  { key: 'stay',    label: 'إقامة',   share: 0.40, color: theme.honey,  emoji: '🏨', target: { x:  380, y: -180 } },
  { key: 'transit', label: 'تنقل',    share: 0.18, color: theme.moss,   emoji: '🚄', target: { x: -380, y:  220 } },
  { key: 'culture', label: 'ثقافة',   share: 0.10, color: theme.indigo, emoji: '🎌', target: { x:  380, y:  220 } },
];

// Money helpers
const SR = (n: number) => `${Math.round(n).toLocaleString('en')} SR`;
const JPY = (n: number) => `¥${Math.round(n).toLocaleString('en')}`;

export const Scene1Collab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ─── CAMERA ──────────────────────────────────────────────────
  // Slow continuous push during the first half, then a rapid zoom-out
  // at the end to transition to scene 2.
  const cam1 = spring({
    frame, fps,
    config: { damping: 26, mass: 2.0, stiffness: 60 },
  });
  const earlyZoom = interpolate(cam1, [0, 1], [0.78, 1.04]);
  const exitZoom = interpolate(frame, [durationInFrames - fps * 1.4, durationInFrames], [1, 0.42], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
  const camScale = earlyZoom * exitZoom;
  const camRotY = 3 * Math.sin((frame / fps) * 0.6);
  const camRotX = 1.5 * Math.cos((frame / fps) * 0.5);

  // ─── TRIP CARD ───────────────────────────────────────────────
  const cardSpring = spring({
    frame: frame - fps * 0.0, fps,
    config: { damping: 14, mass: 1.1, stiffness: 95 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.50, 1]);
  const cardOpacity = cardSpring;
  const cardRotX = interpolate(cardSpring, [0, 1], [40, 0]);
  // Continuous gentle Y-axis orbit so the card breathes
  const cardLiveRotY = 4 * Math.sin((frame / fps) * 0.8);
  const cardLiveBob = 6 * Math.sin((frame / fps) * 0.7);

  // Card recedes during the split burst so the sub-cards have room
  const cardRetreat = interpolate(frame, [fps * 5.2, fps * 6.6], [0, -180], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardRetreatScale = interpolate(frame, [fps * 5.2, fps * 6.6], [1, 0.55], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cardRetreatOpacity = interpolate(frame, [fps * 5.6, fps * 7.0], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // ─── FRIENDS ─────────────────────────────────────────────────
  const friends = [
    { initial: 'ك', hue: 35,  name: 'كريم',  orbit: { x: -260, y: -140 }, delay: 1.0 },
    { initial: 'م', hue: 155, name: 'محمد',  orbit: { x:  260, y: -140 }, delay: 1.25 },
    { initial: 'أ', hue: 250, name: 'أحمد',  orbit: { x: -260, y:  240 }, delay: 1.5 },
    { initial: 'ع', hue: 80,  name: 'علي',   orbit: { x:  260, y:  240 }, delay: 1.75 },
  ];

  // Friends fade out as the split begins so they don't compete
  const friendsExit = interpolate(frame, [fps * 5.0, fps * 5.8], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // ─── EXPENSE RECEIPT ─────────────────────────────────────────
  const receiptSpring = spring({
    frame: frame - fps * 3.0, fps,
    config: { damping: 11, mass: 1.0, stiffness: 130 },
  });
  const receiptScale = interpolate(receiptSpring, [0, 1], [0.4, 1]);
  const receiptRotX = interpolate(receiptSpring, [0, 1], [-25, 0]);
  const receiptOpacity = receiptSpring;

  // Receipt exits when the split happens
  const receiptExit = interpolate(frame, [fps * 5.4, fps * 6.2], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // ─── CURRENCY CONVERSION GLOW ────────────────────────────────
  // Morph happens at ~4.4-5.4s. Use mask-style cross-fade with a
  // bright flash + blur as the amount swaps.
  const conv = interpolate(frame, [fps * 4.4, fps * 5.0], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const jpyOpacity = 1 - conv;
  const srOpacity = conv;
  const conversionFlash = interpolate(frame, [fps * 4.4, fps * 4.65, fps * 5.0], [0, 1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const jpyBlur = interpolate(conv, [0, 1], [0, 14]);
  const srBlur = interpolate(conv, [0, 1], [14, 0]);

  // Numbers for display
  const JPY_AMT = 25000;
  const SR_AMT = 627; // 25000 ¥ × 0.0067 USD × 3.75 SAR

  // ─── SPLIT BURST CATEGORY CARDS ──────────────────────────────
  // Cards burst outward from the center of the receipt at ~5.4s
  // and ride a spring trajectory to their target positions.

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.8} />
      <Particles count={42} color="rgba(170,140,90,0.35)" size={4} speed={0.9} opacity={0.6} />

      {/* Headline up top — kinetic */}
      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0,
        padding: '0 70px',
      }}>
        <KineticText size={70} weight={700} color={theme.ink} delay={0} align="center" lineHeight={1.2}>
          رحلة واحدة.
        </KineticText>
        <div style={{ height: 6 }} />
        <KineticText size={70} weight={700} color={theme.clayDeep} delay={fps * 0.3} align="center" lineHeight={1.2}>
          ميزانية ذكية.
        </KineticText>
      </div>

      {/* CAMERA stage — all 3D elements live here */}
      <AbsoluteFill style={{
        perspective: '2400px',
        transformStyle: 'preserve-3d',
      }}>
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'center',
          transform: `scale(${camScale}) rotateY(${camRotY}deg) rotateX(${camRotX}deg)`,
          transformStyle: 'preserve-3d',
        }}>

          {/* TRIP CARD — floating in space */}
          <div style={{
            position: 'absolute',
            transform: `
              translateY(${cardLiveBob + cardRetreat}px)
              scale(${cardScale * cardRetreatScale})
              rotateX(${cardRotX}deg)
              rotateY(${cardLiveRotY}deg)
            `,
            opacity: cardOpacity * cardRetreatOpacity,
            transformStyle: 'preserve-3d',
            filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.35))`,
          }}>
            <TripCard />
          </div>

          {/* FRIENDS ORBITING */}
          {friends.map((f) => {
            const sp = spring({
              frame: frame - fps * f.delay, fps,
              config: { damping: 9, mass: 0.7, stiffness: 170 },
            });
            const scale = interpolate(sp, [0, 1], [0, 1]);
            const x = interpolate(sp, [0, 1], [0, f.orbit.x]);
            const y = interpolate(sp, [0, 1], [0, f.orbit.y]);
            // Continuous orbit bob unique per friend
            const bob = 6 * Math.sin((frame / fps) * 0.9 + f.delay * 2);
            return (
              <div key={f.name} style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y + bob}px) scale(${scale})`,
                opacity: sp * friendsExit,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  background: `oklch(0.58 0.12 ${f.hue})`,
                  display: 'grid', placeItems: 'center',
                  fontFamily: fonts.arDisplay, fontSize: 50, fontWeight: 700,
                  color: '#fff',
                  border: '4px solid #fff',
                  boxShadow: '0 16px 32px -10px rgba(0,0,0,0.40)',
                }}>{f.initial}</div>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 16, fontWeight: 600,
                  color: theme.inkSoft,
                }}>{f.name}</div>
              </div>
            );
          })}

          {/* EXPENSE RECEIPT FLOATING */}
          <div style={{
            position: 'absolute',
            transform: `
              translateY(${interpolate(receiptSpring, [0, 1], [200, 0])}px)
              scale(${receiptScale})
              rotateX(${receiptRotX}deg)
              rotateY(${-6 * Math.sin((frame / fps) * 0.8)}deg)
            `,
            opacity: receiptOpacity * receiptExit,
            transformStyle: 'preserve-3d',
            filter: `drop-shadow(0 30px 50px rgba(0,0,0,0.35))`,
          }}>
            <ReceiptCard
              jpyValue={JPY(JPY_AMT)}
              srValue={SR(SR_AMT)}
              jpyOpacity={jpyOpacity}
              srOpacity={srOpacity}
              jpyBlur={jpyBlur}
              srBlur={srBlur}
              flash={conversionFlash}
            />
          </div>

          {/* CATEGORY SUB-CARDS — burst out and land */}
          {CATEGORIES.map((c, i) => {
            const sp = spring({
              frame: frame - fps * (5.2 + i * 0.08), fps,
              config: { damping: 10, mass: 0.8, stiffness: 130 },
            });
            const x = interpolate(sp, [0, 1], [0, c.target.x]);
            const y = interpolate(sp, [0, 1], [0, c.target.y]);
            const scale = interpolate(sp, [0, 1], [0.1, 1]);
            const rotZ = interpolate(sp, [0, 1], [180, 0]);
            // Settle bob
            const bob = 5 * Math.sin((frame / fps) * 1.0 + i * 1.4);
            return (
              <div key={c.key} style={{
                position: 'absolute',
                transform: `
                  translate(${x}px, ${y + bob}px)
                  scale(${scale})
                  rotate(${rotZ}deg)
                  rotateY(${5 * Math.sin((frame / fps) * 0.7 + i)}deg)
                `,
                opacity: sp,
                transformStyle: 'preserve-3d',
                filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.25))`,
              }}>
                <CategoryCard
                  label={c.label}
                  amount={SR(SR_AMT * c.share)}
                  color={c.color}
                  emoji={c.emoji}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Conversion flash overlay — full-screen white pop */}
      <AbsoluteFill style={{
        background: '#fff',
        opacity: conversionFlash * 0.55,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

const TripCard: React.FC = () => (
  <div style={{
    width: 560, height: 720,
    borderRadius: 36, overflow: 'hidden',
    background: `linear-gradient(135deg, ${theme.clayDeep} 0%, ${theme.indigo} 100%)`,
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.10)',
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background:
        `radial-gradient(70% 60% at 30% 25%, ${theme.honey} 0%, transparent 65%),
         radial-gradient(80% 60% at 75% 85%, ${theme.clayDeep} 0%, transparent 60%)`,
      opacity: 0.85,
    }} />
    {/* Grain */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 3px 3px',
      mixBlendMode: 'overlay',
    }} />
    {/* Date pill */}
    <div style={{
      position: 'absolute', top: 36, right: 32,
      padding: '8px 16px', borderRadius: 999,
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(10px)',
      fontFamily: fonts.mono, fontSize: 17,
      color: 'rgba(255,255,255,0.95)',
      letterSpacing: '0.04em',
    }}>15 – 22 NOV</div>
    {/* Title */}
    <div style={{
      position: 'absolute', bottom: 60, right: 36, left: 36,
      direction: 'rtl',
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>JAPAN · KYOTO</div>
      <div style={{
        fontFamily: fonts.serif, fontStyle: 'italic',
        fontSize: 92, color: '#fff', lineHeight: 1.0,
        letterSpacing: '-0.02em',
      }}>كيوتو</div>
    </div>
  </div>
);

type ReceiptProps = {
  jpyValue: string; srValue: string;
  jpyOpacity: number; srOpacity: number;
  jpyBlur: number; srBlur: number;
  flash: number;
};
const ReceiptCard: React.FC<ReceiptProps> = ({
  jpyValue, srValue, jpyOpacity, srOpacity, jpyBlur, srBlur, flash,
}) => (
  <div style={{
    width: 480, padding: '28px 30px 26px',
    borderRadius: 24,
    background: theme.cream2,
    border: '0.5px solid rgba(0,0,0,0.06)',
    direction: 'rtl',
    boxShadow: `0 0 ${40 + flash * 80}px ${flash > 0 ? theme.honey : 'transparent'}`,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        background: theme.clay,
        display: 'grid', placeItems: 'center',
        fontSize: 26,
      }}>🍜</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: fonts.arSans, fontSize: 22, fontWeight: 700,
          color: theme.ink, marginBottom: 2,
        }}>عشاء في كيوتو</div>
        <div style={{
          fontFamily: fonts.arSans, fontSize: 13,
          color: theme.inkMute, fontWeight: 500,
        }}>اليوم · 19:42</div>
      </div>
    </div>

    {/* Amount row — JPY and SR overlap, opacity-cross-faded */}
    <div style={{
      marginTop: 22, height: 64, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: jpyOpacity,
        filter: `blur(${jpyBlur}px)`,
        fontFamily: fonts.mono, fontSize: 52, fontWeight: 700,
        color: theme.ink, letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'center',
      }}>{jpyValue}</div>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: srOpacity,
        filter: `blur(${srBlur}px)`,
        fontFamily: fonts.mono, fontSize: 52, fontWeight: 700,
        color: theme.clayDeep, letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'center',
        textShadow: srOpacity > 0.3 ? `0 0 ${24 * srOpacity}px ${theme.honey}` : 'none',
      }}>{srValue}</div>
    </div>
    <div style={{
      marginTop: 6,
      fontFamily: fonts.arSans, fontSize: 14,
      color: theme.inkMute,
    }}>
      {flash > 0.05 ? 'تحويل تلقائي إلى الريال السعودي' : 'مسجل بالين الياباني'}
    </div>
  </div>
);

type CategoryProps = {
  label: string; amount: string; color: string; emoji: string;
};
const CategoryCard: React.FC<CategoryProps> = ({ label, amount, color, emoji }) => (
  <div style={{
    width: 240, padding: '20px 22px',
    borderRadius: 22,
    background: theme.cream2,
    border: '0.5px solid rgba(0,0,0,0.06)',
    direction: 'rtl',
  }}>
    <div style={{
      width: 50, height: 50, borderRadius: 14,
      background: color,
      display: 'grid', placeItems: 'center',
      fontSize: 26, marginBottom: 12,
    }}>{emoji}</div>
    <div style={{
      fontFamily: fonts.arSans, fontSize: 16, fontWeight: 600,
      color: theme.inkSoft, marginBottom: 4,
    }}>{label}</div>
    <div style={{
      fontFamily: fonts.mono, fontSize: 28, fontWeight: 700,
      color: theme.ink, letterSpacing: '-0.01em',
    }}>{amount}</div>
  </div>
);
