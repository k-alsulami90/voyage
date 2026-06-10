import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import './fonts';

import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Hub } from './scenes/Scene2Hub';
import { Scene3Split } from './scenes/Scene3Split';
import { Scene4SmartTrack } from './scenes/Scene4SmartTrack';
import { Scene5Vault } from './scenes/Scene5Vault';
import { Scene6CTA } from './scenes/Scene6CTA';

// Varied scene durations — the v1 metronome of six identical 6s
// blocks felt like PPT slides. The new cadence emphasises the killer
// feature (Smart Track) with the longest beat, gives the Hook a
// quick teaser-length punch, and lets the CTA breathe.
//
//   Hook        4.0s   120f   teaser
//   Hub         6.0s   180f
//   Split       5.0s   150f
//   Smart Track 7.0s   210f   hero beat
//   Vault       5.0s   150f
//   CTA         5.0s   150f
//
// Total: 32.0s   960 frames @ 30 fps

const FPS = 30;
const SCENES = [
  { Component: Scene1Hook,        durationInFrames: FPS * 4 },
  { Component: Scene2Hub,         durationInFrames: FPS * 6 },
  { Component: Scene3Split,       durationInFrames: FPS * 5 },
  { Component: Scene4SmartTrack,  durationInFrames: FPS * 7 },
  { Component: Scene5Vault,       durationInFrames: FPS * 5 },
  { Component: Scene6CTA,         durationInFrames: FPS * 5 },
];

// Cross-fade. useCurrentFrame() inside a `<Sequence>` is LOCAL to
// the sequence (Remotion rebases time), so we read it directly. The
// fade-in is intentionally 0 frames -- each scene already animates
// its own entry, so cross-fading on top mutes that motion. We just
// fade out the last 10 frames so the visual baton passes cleanly.
const SceneWrap: React.FC<{ children: React.ReactNode; total: number }> = ({
  children, total,
}) => {
  const sceneFrame = useCurrentFrame();
  const fadeOut = interpolate(sceneFrame, [total - 10, total], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  return (
    <div style={{ opacity: fadeOut, width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export const MyComposition: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SCENES.map((s, i) => {
        const Comp = s.Component;
        const node = (
          <Sequence key={i} from={from} durationInFrames={s.durationInFrames} layout="none">
            <SceneWrap total={s.durationInFrames}><Comp /></SceneWrap>
          </Sequence>
        );
        from += s.durationInFrames;
        return node;
      })}

      {/* Audio: drop `public/music.mp3` and uncomment.
          import {Audio, staticFile} from 'remotion';
          <Audio src={staticFile('music.mp3')} volume={0.6} />
      */}
    </AbsoluteFill>
  );
};

export const COMPOSITION_FPS = FPS;
export const COMPOSITION_DURATION = SCENES.reduce((acc, s) => acc + s.durationInFrames, 0);
