import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion';
import { KineticText } from '../components/KineticText';
import { AmbientBg, LightStreak, Vignette } from '../components/AmbientBg';
import { Particles } from '../components/Particles';
import { PhoneFrame } from '../components/PhoneFrame';
import { theme, fonts } from '../theme';

// SCENE 4 — Smart Track (15–22s, 210 frames). The killer feature
// gets the longest scene. Starts darker (radar/night-flight feel)
// with concentric ping waves emanating from the centre and a flight
// path (dashed curve) drawing across. Phone arrives with a 3D pop;
// Smart Track card slides up with a glow. The white "بطاقة الصعود"
// pill pulses + a haptic-style ring flares once.
export const Scene4SmartTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Radar pings emanate every ~1s
  const pingTime = (frame / fps) % 1.2;
  const pingScale = interpolate(pingTime, [0, 1.2], [0.2, 3.0]);
  const pingOpacity = interpolate(pingTime, [0, 0.4, 1.2], [0.6, 0.3, 0]);
  const pingTime2 = ((frame + fps * 0.6) / fps) % 1.2;
  const pingScale2 = interpolate(pingTime2, [0, 1.2], [0.2, 3.0]);
  const pingOpacity2 = interpolate(pingTime2, [0, 0.4, 1.2], [0.6, 0.3, 0]);

  // Flight path draws over the first 1.5s
  const pathDraw = interpolate(frame, [fps * 0.3, fps * 1.8], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  // Plane moves along path
  const planeT = interpolate(frame, [fps * 0.5, fps * 1.8], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Phone enters with 3D pop after radar
  const phoneSpring = spring({
    frame: frame - fps * 2.2, fps,
    config: { damping: 14, mass: 1.0, stiffness: 110 },
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.55, 1]);
  const phoneRotX = interpolate(phoneSpring, [0, 1], [-30, 0]);

  // Smart Track card slides up inside phone, with a flare ring
  const cardSpring = spring({
    frame: frame - fps * 3.0, fps,
    config: { damping: 12, mass: 0.9, stiffness: 100 },
  });
  const cardSlide = interpolate(cardSpring, [0, 1], [220, 0]);
  const cardOpacity = cardSpring;

  // Pill pulse + flare
  const pillPulse = 1 + 0.05 * Math.sin(((frame - fps * 4.2) / fps) * Math.PI * 2.4);
  const flareT = interpolate(frame, [fps * 4.4, fps * 5.4], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const flareScale = interpolate(flareT, [0, 1], [1, 3]);
  const flareOpacity = interpolate(flareT, [0, 0.5, 1], [0.7, 0.3, 0]);

  // Background: a deep dusk gradient + particles
  const bgZoom = interpolate(frame, [0, durationInFrames], [1, 1.06]);

  // Flight path geometry — from bottom-left to top-right
  const ax = 0.18, ay = 0.78;
  const bx = 0.82, by = 0.22;
  const cx = 0.55, cy = 0.30; // control
  const t = planeT;
  const planeX = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
  const planeY = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;
  // Angle of tangent for plane rotation
  const dx = 2 * (1 - t) * (cx - ax) + 2 * t * (bx - cx);
  const dy = 2 * (1 - t) * (cy - ay) + 2 * t * (by - cy);
  const planeAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* Background ambient */}
      <AbsoluteFill style={{ transform: `scale(${bgZoom})` }}>
        <AmbientBg tone="dusk" intensity={0.9} />
        <Particles count={50} color="rgba(255,200,140,0.45)" size={4} speed={1.1} />
      </AbsoluteFill>

      {/* Radar pings — only during first 3s */}
      {frame < fps * 3.2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            width: 240, height: 240, borderRadius: '50%',
            border: '2px solid rgba(255,200,140,0.8)',
            transform: `scale(${pingScale})`,
            opacity: pingOpacity,
          }} />
          <div style={{
            position: 'absolute',
            width: 240, height: 240, borderRadius: '50%',
            border: '2px solid rgba(255,200,140,0.8)',
            transform: `scale(${pingScale2})`,
            opacity: pingOpacity2,
          }} />
        </AbsoluteFill>
      )}

      {/* Flight path */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <path
          d={`M ${ax * width} ${ay * height} Q ${cx * width} ${cy * height} ${bx * width} ${by * height}`}
          stroke={theme.honey} strokeWidth="2.5" fill="none"
          strokeDasharray="14 14"
          strokeDashoffset={500 - pathDraw * 500}
          pathLength="500"
          strokeLinecap="round"
          opacity={frame < fps * 3.2 ? 0.85 : interpolate(frame, [fps * 3.2, fps * 4.0], [0.85, 0])}
        />
        {/* Plane glyph */}
        {planeT > 0.02 && planeT < 0.99 && (
          <g transform={`translate(${planeX * width} ${planeY * height}) rotate(${planeAngle})`}
             opacity={frame < fps * 3.2 ? 1 : interpolate(frame, [fps * 3.2, fps * 4.0], [1, 0])}>
            <circle r="14" fill={theme.honey} />
            <path d="M -10 0 L 14 0 M 0 -7 L 14 0 L 0 7"
              stroke="#000" strokeWidth="2" fill="none" />
          </g>
        )}
      </svg>

      {/* Headline at top — fades in after the radar opening */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        padding: '0 70px', textAlign: 'center',
        opacity: interpolate(frame, [fps * 1.4, fps * 2.0], [0, 1], {
          extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
        }),
      }}>
        <KineticText size={72} weight={700} color="#fff" delay={fps * 1.4} staggerFrames={1.2} lineHeight={1.2}>
          بطاقة الصعود تظهر
        </KineticText>
        <div style={{ height: 6 }} />
        <KineticText size={72} weight={700} color={theme.honey} delay={fps * 1.9} staggerFrames={1.2} lineHeight={1.2}>
          قبل رحلتك بـ 24 ساعة.
        </KineticText>
      </div>

      {/* Phone */}
      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'flex-end',
        paddingBottom: 100,
        perspective: '2000px',
      }}>
        <div style={{
          transform: `scale(${phoneScale}) rotateX(${phoneRotX}deg)`,
          transformStyle: 'preserve-3d',
          opacity: phoneSpring,
        }}>
          <PhoneFrame width={620}>
            {/* Subtle Hub backdrop */}
            <div style={{ position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, ${theme.cream} 0%, ${theme.cream2} 100%)`,
            }} />

            {/* Smart Track card */}
            <div style={{
              position: 'absolute',
              top: 260, left: 18, right: 18,
              transform: `translateY(${cardSlide}px)`,
              opacity: cardOpacity,
              borderRadius: 28, overflow: 'hidden',
              background: `linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)`,
              color: '#fff',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.55)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(85% 60% at 100% 0%, ${theme.honey} 0%, transparent 60%)`,
                opacity: 0.35,
              }} />

              <div style={{ position: 'relative', padding: '22px 22px 20px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.22)',
                  border: '0.5px solid rgba(255,255,255,0.30)',
                  fontFamily: fonts.mono, fontSize: 14, fontWeight: 600,
                  transform: `scale(${pillPulse})`,
                  direction: 'rtl',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: 999, background: '#fff',
                    boxShadow: '0 0 14px #fff',
                  }} />
                  خلال 23 ساعة
                </div>

                <div style={{
                  marginTop: 16,
                  display: 'flex', alignItems: 'center', gap: 14,
                  direction: 'rtl',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'rgba(255,255,255,0.18)',
                    border: '0.5px solid rgba(255,255,255,0.30)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16v-2a4 4 0 0 0-2-3.5L13 7V3a1 1 0 0 0-2 0v4L5 10.5A4 4 0 0 0 3 14v2l8-2v5l-2 1v1h6v-1l-2-1v-5l8 2z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: fonts.serif, fontStyle: 'italic',
                      fontSize: 30, lineHeight: 1.1, color: '#fff',
                    }}>SV777 · الرياض ← طوكيو</div>
                    <div style={{
                      marginTop: 6,
                      fontFamily: fonts.mono, fontSize: 15,
                      color: 'rgba(255,255,255,0.86)', letterSpacing: '0.02em',
                    }}>RUH → HND · T2</div>
                  </div>
                </div>

                {/* Action pills with flare on the primary */}
                <div style={{
                  marginTop: 18, display: 'flex', gap: 10,
                  flexWrap: 'wrap', direction: 'rtl', position: 'relative',
                }}>
                  <div style={{ position: 'relative' }}>
                    {/* Flare ring */}
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: `translate(-50%, -50%) scale(${flareScale})`,
                      width: '100%', height: '100%',
                      borderRadius: 999,
                      border: '2px solid #fff',
                      opacity: flareOpacity,
                    }} />
                    <div style={{
                      position: 'relative',
                      padding: '10px 14px', borderRadius: 999,
                      background: '#fff',
                      color: 'oklch(0.22 0.025 250)',
                      fontFamily: fonts.arSans, fontSize: 15, fontWeight: 600,
                      transform: `scale(${pillPulse})`,
                    }}>
                      بطاقة الصعود
                    </div>
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: 999,
                    background: 'transparent', color: 'rgba(255,255,255,0.92)',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
                  }}>
                    التذكرة الإلكترونية
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: 999,
                    background: 'transparent', color: 'rgba(255,255,255,0.92)',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    fontFamily: fonts.arSans, fontSize: 15, fontWeight: 500,
                  }}>
                    الموقع
                  </div>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.30} />
      <LightStreak delay={fps * 6.2} angle={22} />
    </AbsoluteFill>
  );
};
