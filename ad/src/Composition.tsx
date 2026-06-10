import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import './fonts';

import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Hub } from './scenes/Scene2Hub';
import { Scene3Split } from './scenes/Scene3Split';
import { Scene4SmartTrack } from './scenes/Scene4SmartTrack';
import { Scene5Vault } from './scenes/Scene5Vault';
import { Scene6CTA } from './scenes/Scene6CTA';

// Six 6-second scenes at 30fps = 180 frames each, 1080 frames total.
// Each scene wraps in a `<Sequence>` with `layout="none"` so the
// scenes' own AbsoluteFill backgrounds aren't double-wrapped.
const SCENE = 180;  // 6s @ 30fps

// Cross-fade between scenes — fades out the last 8 frames of every
// scene so cuts breathe instead of hard-snapping. `useCurrentFrame()`
// returns the LOCAL frame within the enclosing `<Sequence>` (Remotion
// rebases time per-sequence), so we read it directly -- no need to
// subtract index*SCENE. Subtracting it caused negative frames and a
// blacked-out render.
const CrossFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sceneFrame = useCurrentFrame();
  const fadeInOpacity = interpolate(sceneFrame, [0, 6], [0, 1], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  const fadeOutOpacity = interpolate(sceneFrame, [SCENE - 8, SCENE], [1, 0], {
    extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
  });
  return (
    <div style={{
      opacity: Math.min(fadeInOpacity, fadeOutOpacity),
      width: '100%', height: '100%',
    }}>
      {children}
    </div>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence from={SCENE * 0} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene1Hook /></CrossFade>
      </Sequence>
      <Sequence from={SCENE * 1} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene2Hub /></CrossFade>
      </Sequence>
      <Sequence from={SCENE * 2} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene3Split /></CrossFade>
      </Sequence>
      <Sequence from={SCENE * 3} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene4SmartTrack /></CrossFade>
      </Sequence>
      <Sequence from={SCENE * 4} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene5Vault /></CrossFade>
      </Sequence>
      <Sequence from={SCENE * 5} durationInFrames={SCENE} layout="none">
        <CrossFade><Scene6CTA /></CrossFade>
      </Sequence>

      {/* Audio: drop a `public/music.mp3` track and uncomment the
          import + Audio tag below. Kept commented for now so the
          project builds before you source a licence-free track.

      import {Audio, staticFile} from 'remotion';
      <Audio src={staticFile('music.mp3')} volume={0.6} />
      */}
    </AbsoluteFill>
  );
};
