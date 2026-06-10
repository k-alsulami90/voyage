import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { KineticText } from '../components/KineticText';
import { theme, fonts } from '../theme';

// SCENE 2 — Document Hub + Smart Assistant (8.0s @ 60fps = 480f).
//
// Beat 1 (0.0 – 1.2s)   Camera pans DOWNWARDS into the document
//                       hub (translateY from -800 -> 0 across the
//                       full scene container)
// Beat 2 (0.4 – 2.8s)   3 documents fly in from off-screen edges
//                       and STACK with rotational lock-in (boarding
//                       pass on top, hotel under, visa beneath)
// Beat 3 (2.8 – 4.4s)   A scanning light beam sweeps top-to-bottom
//                       across the boarding pass
// Beat 4 (4.2 – 5.4s)   "Upcoming Trip" smart-track notification
//                       card SPRINGS in from above with a 3D pop
// Beat 5 (5.2 – 7.0s)   3 action buttons stagger in (Boarding /
//                       Hotel / Maps); Maps button has a continuous
//                       pulse + glow
// Beat 6 (7.0 – 8.0s)   Camera zooms out slightly for the cut

export const Scene2Docs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ─── CAMERA: vertical pan + push ────────────────────────────
  // The "pan down" is achieved by translating the inner stage from
  // above the viewport into place during the first 1.2s, then a
  // continuous drift to keep the canvas alive.
  const panSpring = spring({
    frame, fps,
    config: { damping: 22, mass: 1.8, stiffness: 80 },
  });
  const panY = interpolate(panSpring, [0, 1], [-820, 0]);
  const liveDrift = 18 * Math.sin((frame / fps) * 0.45);
  const exitScale = interpolate(frame, [durationInFrames - fps * 0.8, durationInFrames], [1, 0.95], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });

  // ─── DOCUMENTS ──────────────────────────────────────────────
  // Each document defines its FROM (off-screen origin) and TO (final
  // stacked position with a small rotation lock-in).
  const docs = [
    {
      key: 'visa',     emoji: '📘', tint: theme.indigo, label: 'تأشيرة اليابان',
      from: { x: -1200, y:  400, rot: -40 },
      to:   { x:  -25,  y:   65, rot:  -5 },
      delay: 0.45,
    },
    {
      key: 'hotel',    emoji: '🏨', tint: theme.honey, label: 'فندق نيكو طوكيو',
      from: { x:  1200, y:  500, rot:  35 },
      to:   { x:   20,  y:   30, rot:   4 },
      delay: 0.65,
    },
    {
      key: 'flight',   emoji: '✈️', tint: theme.clay, label: 'SV777 · الرياض → طوكيو',
      from: { x: -200,  y: -1100, rot:  20 },
      to:   { x:    0,  y:    0,  rot:  -1 },
      delay: 0.85,
    },
  ];

  // ─── SCAN LIGHT ─────────────────────────────────────────────
  const scanProgress = interpolate(frame, [fps * 2.8, fps * 4.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  // ─── NOTIFICATION CARD ──────────────────────────────────────
  const notifSpring = spring({
    frame: frame - fps * 4.2, fps,
    config: { damping: 11, mass: 1.0, stiffness: 130 },
  });
  const notifY = interpolate(notifSpring, [0, 1], [-450, 0]);
  const notifRotX = interpolate(notifSpring, [0, 1], [-35, 0]);
  const notifBob = 4 * Math.sin((frame / fps) * 0.8);

  // ─── ACTION BUTTONS ─────────────────────────────────────────
  const actionBaseDelay = 5.2;
  const actions = [
    { label: 'بطاقة الصعود', emoji: '🛂', isPrimary: true,  pulse: false },
    { label: 'حجز الفندق',    emoji: '🏨', isPrimary: false, pulse: false },
    { label: 'خرائط Google', emoji: '📍', isPrimary: false, pulse: true  },
  ];

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.7} />
      <Particles count={32} color="rgba(170,140,90,0.30)" size={3} speed={0.7} opacity={0.55} />

      {/* Headline */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        padding: '0 70px', zIndex: 5,
      }}>
        <KineticText size={68} weight={700} color={theme.ink} delay={0} align="center" lineHeight={1.2}>
          كل وثيقة، في مكانها.
        </KineticText>
      </div>

      {/* CAMERA STAGE */}
      <AbsoluteFill style={{
        perspective: '2400px',
        transform: `translateY(${panY + liveDrift}px) scale(${exitScale})`,
        transformStyle: 'preserve-3d',
      }}>
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}>

          {/* DOCUMENT STACK (bottom to top: visa, hotel, boarding) */}
          {docs.map((d, i) => {
            const sp = spring({
              frame: frame - fps * d.delay, fps,
              config: { damping: 13, mass: 1.1, stiffness: 95 },
            });
            const x = interpolate(sp, [0, 1], [d.from.x, d.to.x]);
            const y = interpolate(sp, [0, 1], [d.from.y, d.to.y]);
            const rot = interpolate(sp, [0, 1], [d.from.rot, d.to.rot]);
            const scale = interpolate(sp, [0, 1], [0.55, 1]);

            // After landing, gentle bob
            const settled = Math.max(0, sp - 0.9) * 10;
            const bob = settled > 0 ? 3 * Math.sin((frame / fps) * 0.6 + i) : 0;
            // 3D parallax tilt
            const tilt = 4 * Math.sin((frame / fps) * 0.7 + i * 1.2);

            // Top card (flight) gets the scan light
            const isTopCard = d.key === 'flight';

            return (
              <div key={d.key} style={{
                position: 'absolute',
                transform: `
                  translate(${x}px, ${y + bob}px)
                  scale(${scale})
                  rotate(${rot}deg)
                  rotateY(${tilt}deg)
                `,
                opacity: sp,
                zIndex: 10 + i,
                transformStyle: 'preserve-3d',
                filter: `drop-shadow(0 ${20 + i * 8}px ${30 + i * 10}px rgba(0,0,0,0.${28 + i * 4}))`,
              }}>
                <DocumentCard
                  label={d.label}
                  emoji={d.emoji}
                  tint={d.tint}
                  showScan={isTopCard && scanProgress > 0 && scanProgress < 1}
                  scanProgress={scanProgress}
                />
              </div>
            );
          })}

          {/* NOTIFICATION CARD */}
          <div style={{
            position: 'absolute',
            top: 1180,
            transform: `
              translateY(${notifY + notifBob}px)
              rotateX(${notifRotX}deg)
              rotateY(${3 * Math.sin((frame / fps) * 0.6)}deg)
            `,
            opacity: notifSpring,
            zIndex: 20,
            transformStyle: 'preserve-3d',
            filter: `drop-shadow(0 36px 50px rgba(0,0,0,0.40))`,
          }}>
            <NotificationCard actions={actions} actionBaseDelay={actionBaseDelay} frame={frame} fps={fps} />
          </div>

        </AbsoluteFill>
      </AbsoluteFill>

      <LightStreak delay={fps * 7.0} angle={20} />
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

type DocProps = {
  label: string; emoji: string; tint: string;
  showScan: boolean; scanProgress: number;
};
const DocumentCard: React.FC<DocProps> = ({ label, emoji, tint, showScan, scanProgress }) => (
  <div style={{
    width: 560, height: 230,
    borderRadius: 24, overflow: 'hidden',
    background: theme.cream2,
    border: '0.5px solid rgba(0,0,0,0.08)',
    position: 'relative',
    direction: 'rtl',
    padding: '26px 28px',
    display: 'flex', alignItems: 'center', gap: 22,
  }}>
    <div style={{
      width: 100, height: 100, borderRadius: 22,
      background: tint,
      display: 'grid', placeItems: 'center',
      fontSize: 50, lineHeight: 1,
      flexShrink: 0,
      boxShadow: '0 12px 24px -8px rgba(0,0,0,0.30)',
    }}>{emoji}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 14, fontWeight: 500,
        color: theme.inkMute, letterSpacing: '0.16em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>VOYAGE · VAULT</div>
      <div style={{
        fontFamily: fonts.arDisplay, fontSize: 30, fontWeight: 700,
        color: theme.ink, lineHeight: 1.15,
      }}>{label}</div>
      <div style={{
        marginTop: 10, display: 'inline-flex',
        padding: '4px 11px', borderRadius: 999,
        background: 'oklch(0.50 0.08 155 / 0.16)',
        color: theme.mossDeep,
        fontFamily: fonts.mono, fontSize: 12, fontWeight: 600,
      }}>محفوظ ✓</div>
    </div>

    {/* SCAN LIGHT — top-to-bottom sweep */}
    {showScan && (
      <>
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: `${scanProgress * 100}%`,
          height: 6,
          background: `linear-gradient(90deg, transparent 0%, ${theme.honey} 50%, transparent 100%)`,
          boxShadow: `0 0 24px ${theme.honey}`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg,
            transparent 0%,
            transparent ${Math.max(0, scanProgress * 100 - 8)}%,
            rgba(255,200,140,0.18) ${scanProgress * 100}%,
            transparent ${Math.min(100, scanProgress * 100 + 8)}%,
            transparent 100%)`,
          pointerEvents: 'none',
        }} />
      </>
    )}
  </div>
);

type NotifProps = {
  actions: { label: string; emoji: string; isPrimary: boolean; pulse: boolean }[];
  actionBaseDelay: number;
  frame: number; fps: number;
};
const NotificationCard: React.FC<NotifProps> = ({ actions, actionBaseDelay, frame, fps }) => {
  // Live ticking countdown displayed in the header pill
  return (
    <div style={{
      width: 640,
      borderRadius: 28, overflow: 'hidden',
      background: `linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)`,
      color: '#fff',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(85% 60% at 100% 0%, ${theme.honey} 0%, transparent 60%)`,
        opacity: 0.30,
      }} />
      <div style={{ position: 'relative', padding: '24px 26px 22px' }}>
        {/* Pulsing status pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          padding: '7px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.22)',
          border: '0.5px solid rgba(255,255,255,0.30)',
          fontFamily: fonts.mono, fontSize: 16, fontWeight: 700,
          direction: 'rtl',
          transform: `scale(${1 + 0.04 * Math.sin((frame / fps) * 2.2)})`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: 999,
            background: '#fff', boxShadow: '0 0 14px #fff',
          }} />
          خلال 23 ساعة
        </div>

        {/* Title row */}
        <div style={{
          marginTop: 16,
          display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(255,255,255,0.18)',
            border: '0.5px solid rgba(255,255,255,0.30)',
            display: 'grid', placeItems: 'center',
            fontSize: 32,
          }}>✈️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: fonts.serif, fontStyle: 'italic',
              fontSize: 32, lineHeight: 1.0, color: '#fff',
            }}>SV777 · الرياض ← طوكيو</div>
            <div style={{
              marginTop: 6,
              fontFamily: fonts.mono, fontSize: 16,
              color: 'rgba(255,255,255,0.86)', letterSpacing: '0.04em',
            }}>RUH → HND · T2</div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{
          marginTop: 22,
          display: 'flex', gap: 10,
          flexWrap: 'wrap', direction: 'rtl',
        }}>
          {actions.map((a, i) => {
            const sp = spring({
              frame: frame - fps * (actionBaseDelay + i * 0.18), fps,
              config: { damping: 9, mass: 0.7, stiffness: 170 },
            });
            const scale = interpolate(sp, [0, 1], [0.4, 1]);
            const y = interpolate(sp, [0, 1], [20, 0]);
            // Pulse for Maps
            const pulseScale = a.pulse
              ? 1 + 0.06 * Math.sin((frame / fps) * 3.8)
              : 1;
            const pulseGlow = a.pulse
              ? 16 + 14 * Math.abs(Math.sin((frame / fps) * 3.8))
              : 0;

            return (
              <div key={a.label} style={{
                transform: `translateY(${y}px) scale(${scale * pulseScale})`,
                opacity: sp,
              }}>
                <div style={{
                  padding: '12px 16px', borderRadius: 999,
                  background: a.isPrimary ? '#fff' : 'rgba(255,255,255,0.10)',
                  color: a.isPrimary ? 'oklch(0.22 0.025 250)' : 'rgba(255,255,255,0.94)',
                  border: a.isPrimary ? 'none' : '0.5px solid rgba(255,255,255,0.30)',
                  fontFamily: fonts.arSans, fontSize: 16, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: a.pulse
                    ? `0 0 ${pulseGlow}px ${theme.honey}`
                    : 'none',
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
  );
};
