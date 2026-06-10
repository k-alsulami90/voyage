import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { theme, fonts } from '../theme';

// SCENE 2 — Create a trip + the crew joins (6s @ 60fps = 360f).
//
// Beat 1 (0.0–1.0s)  Trip card pops into 3D space (spring scale +
//                    rotateX/rotateY settle), floating with a bob.
// Beat 2 (1.0–3.5s)  The cover art CYCLES through the app's five real
//                    cover presets (the exact oklch gradients from
//                    CoverArt in screen-trips.jsx) — kyoto → lisbon →
//                    oaxaca → lofoten → patagon — title swapping with
//                    each, with a tiny scale pulse on every swap.
// Beat 3 (3.4–5.3s)  Four friend avatars spring in around the card
//                    with role chips (مشرف / محرر / قارئ) — the
//                    trip-scoped collaboration story in one beat.
// Beat 4 (5.3–6.0s)  Camera zooms out for the cut.

// Real cover gradients from the app's CoverArt presets.
const COVERS = [
  { key: 'kyoto',   title: 'كيوتو',     from: 'oklch(0.74 0.07 30)',  to: 'oklch(0.36 0.05 285)' },
  { key: 'lisbon',  title: 'لشبونة',    from: 'oklch(0.78 0.09 70)',  to: 'oklch(0.50 0.10 35)' },
  { key: 'oaxaca',  title: 'واهاكا',    from: 'oklch(0.74 0.13 60)',  to: 'oklch(0.42 0.13 30)' },
  { key: 'lofoten', title: 'لوفوتن',    from: 'oklch(0.58 0.10 260)', to: 'oklch(0.22 0.06 270)' },
  { key: 'patagon', title: 'باتاغونيا', from: 'oklch(0.70 0.07 200)', to: 'oklch(0.34 0.07 250)' },
];

// Avatar orbit positions clear the 540px-wide card (±270 + half-avatar
// 54 ≈ 324 minimum) so faces are never hidden behind it.
const FRIENDS = [
  { initial: 'ك', hue: 35,  name: 'كريم',  role: 'مشرف',  pos: { x: -368, y: -250 }, delay: 3.4 },
  { initial: 'م', hue: 155, name: 'محمد',  role: 'محرر',  pos: { x:  368, y: -250 }, delay: 3.62 },
  { initial: 'ع', hue: 250, name: 'علي',   role: 'محرر',  pos: { x: -368, y:  300 }, delay: 3.84 },
  { initial: 'أ', hue: 80,  name: 'أحمد',  role: 'قارئ',  pos: { x:  368, y:  300 }, delay: 4.06 },
];

export const Scene2Create: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Card entry spring
  const cardSpring = spring({
    frame, fps,
    config: { damping: 12, mass: 1.1, stiffness: 110 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.45, 1]);
  const cardRotX = interpolate(cardSpring, [0, 1], [38, 0]);
  const liveRotY = 4 * Math.sin((frame / fps) * 0.85);
  const bob = 7 * Math.sin((frame / fps) * 0.7);

  // Cover cycle: starts at 1.0s, 0.5s per cover, clamps on the last.
  const CYCLE_START = fps * 1.0;
  const SLOT = fps * 0.5;
  const rawIdx = Math.floor((frame - CYCLE_START) / SLOT);
  const idx = Math.min(Math.max(rawIdx, 0), COVERS.length - 1);
  const slotFrame = frame - CYCLE_START - idx * SLOT;
  // Incoming cover wipes down over the previous one in 9 frames
  const wipe = idx === 0 ? 1 : interpolate(slotFrame, [0, 9], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Scale pulse on each swap
  const pulse = idx > 0 ? 0.018 * Math.max(0, 1 - slotFrame / 12) : 0;
  const prev = COVERS[Math.max(0, idx - 1)];
  const cur = COVERS[idx];

  // Exit zoom
  const exitZoom = interpolate(frame, [durationInFrames - fps * 0.7, durationInFrames], [1, 0.55], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });
  const camRotY = 2.5 * Math.sin((frame / fps) * 0.5);

  return (
    <AbsoluteFill style={{ background: theme.cream }}>
      <AmbientBg tone="cream" intensity={0.7} />
      <Particles count={34} color="rgba(170,140,90,0.32)" size={4} speed={0.8} opacity={0.6} />

      {/* Headline */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, padding: '0 70px' }}>
        <KineticText size={86} weight={700} color={theme.ink} delay={fps * 0.1} duration={fps * 0.45} align="center">
          اصنع رحلتك.
        </KineticText>
        <div style={{ height: 8 }} />
        <KineticText size={42} weight={500} color={theme.inkSoft} delay={fps * 0.5} duration={fps * 0.4} align="center">
          غلاف، تواريخ، ميزانية — في لحظات.
        </KineticText>
      </div>

      {/* 3D stage */}
      <AbsoluteFill style={{ perspective: '2400px', transformStyle: 'preserve-3d' }}>
        <AbsoluteFill style={{
          alignItems: 'center', justifyContent: 'center',
          transform: `scale(${exitZoom}) rotateY(${camRotY}deg)`,
          transformStyle: 'preserve-3d',
        }}>
          {/* TRIP CARD */}
          <div style={{
            position: 'absolute',
            transform: `
              translateY(${bob + 40}px)
              scale(${cardScale + pulse})
              rotateX(${cardRotX}deg)
              rotateY(${liveRotY}deg)
            `,
            opacity: cardSpring,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 44px 64px rgba(0,0,0,0.36))',
          }}>
            <div style={{
              width: 540, height: 700, borderRadius: 36, overflow: 'hidden',
              position: 'relative', border: '1px solid rgba(255,255,255,0.10)',
            }}>
              {/* Previous cover (base layer) */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(160deg, ${prev.from} 0%, ${prev.to} 100%)`,
              }} />
              {/* Incoming cover wipes down */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(160deg, ${cur.from} 0%, ${cur.to} 100%)`,
                clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
              }} />
              {/* App's bottom vignette, same as CoverArt */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(120% 60% at 50% 100%, transparent 50%, rgba(20,10,20,0.4) 100%)',
              }} />
              {/* Grain */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 3px 3px',
                mixBlendMode: 'overlay',
              }} />
              {/* Dates pill */}
              <div style={{
                position: 'absolute', top: 32, right: 30,
                padding: '8px 16px', borderRadius: 999,
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
                fontFamily: fonts.mono, fontSize: 16,
                color: 'rgba(255,255,255,0.95)', letterSpacing: '0.04em',
              }}>15 – 22 NOV</div>
              {/* Status chip */}
              <div style={{
                position: 'absolute', top: 32, left: 30,
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 999,
                background: 'rgba(20,15,10,0.35)', backdropFilter: 'blur(10px)',
                fontFamily: fonts.arSans, fontSize: 14, fontWeight: 600, color: '#fff',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: theme.honey }} />
                قادمة
              </div>
              {/* Title — swaps with the cover */}
              <div style={{
                position: 'absolute', bottom: 52, right: 34, left: 34,
                direction: 'rtl',
              }}>
                <div style={{
                  fontFamily: fonts.mono, fontSize: 13,
                  color: 'rgba(255,255,255,0.70)', letterSpacing: '0.18em',
                  textTransform: 'uppercase', marginBottom: 10,
                }}>VOYAGE · TRIP</div>
                <div key={cur.key} style={{
                  fontFamily: fonts.serif, fontStyle: 'italic',
                  fontSize: 86, color: '#fff', lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                  clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
                }}>{cur.title}</div>
              </div>
            </div>
          </div>

          {/* FRIENDS + ROLES */}
          {FRIENDS.map((f) => {
            const sp = spring({
              frame: frame - fps * f.delay, fps,
              config: { damping: 9, mass: 0.7, stiffness: 175 },
            });
            const x = interpolate(sp, [0, 1], [0, f.pos.x]);
            const y = interpolate(sp, [0, 1], [0, f.pos.y]);
            const fb = 6 * Math.sin((frame / fps) * 0.95 + f.delay * 2);
            return (
              <div key={f.name} style={{
                position: 'absolute', zIndex: 5,
                transform: `translate(${x}px, ${y + fb + 40}px) scale(${interpolate(sp, [0, 1], [0, 1])})`,
                opacity: sp,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              }}>
                <div style={{
                  width: 108, height: 108, borderRadius: '50%',
                  background: `oklch(0.58 0.12 ${f.hue})`,
                  display: 'grid', placeItems: 'center',
                  fontFamily: fonts.arDisplay, fontSize: 48, fontWeight: 700, color: '#fff',
                  border: '4px solid #fff',
                  boxShadow: '0 16px 32px -10px rgba(0,0,0,0.40)',
                }}>{f.initial}</div>
                <div style={{
                  fontFamily: fonts.arSans, fontSize: 17, fontWeight: 600, color: theme.ink,
                }}>{f.name}</div>
                <div style={{
                  padding: '3px 10px', borderRadius: 999,
                  background: theme.cream2, border: '0.5px solid rgba(0,0,0,0.08)',
                  fontFamily: fonts.arSans, fontSize: 12, fontWeight: 600,
                  color: theme.inkMute,
                }}>{f.role}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      <LightStreak delay={fps * 5.0} angle={18} />
    </AbsoluteFill>
  );
};
