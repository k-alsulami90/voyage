import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import './fonts';

import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Create } from './scenes/Scene2Create';
import { Scene3Money } from './scenes/Scene3Money';
import { Scene4Vault } from './scenes/Scene4Vault';
import { Scene5Plan } from './scenes/Scene5Plan';
import { Scene6Analytics } from './scenes/Scene6Analytics';
import { Scene7CTA } from './scenes/Scene7CTA';

// Seven-scene cut covering the full feature set, 60fps vertical.
//
//   1  Hook                      3.5s   210f
//   2  Create trip + crew        6.0s   360f
//   3  Money: FX + split+settle  7.5s   450f
//   4  Vault + Smart Track       7.0s   420f
//   5  Plan (itinerary + logged) 4.5s   270f
//   6  Analytics                 5.5s   330f
//   7  CTA                       4.0s   240f
//   ---------------------------------------
//   Total                       38.0s  2280f
//
// Each scene owns its camera; entries are spring-driven inside the
// scene, so the wrap only fades the OUTGOING scene (12 frames).

const FPS = 60;

const SCENES = [
  { Component: Scene1Hook,      durationInFrames: Math.round(FPS * 3.5) },
  { Component: Scene2Create,    durationInFrames: FPS * 6 },
  { Component: Scene3Money,     durationInFrames: Math.round(FPS * 7.5) },
  { Component: Scene4Vault,     durationInFrames: FPS * 7 },
  { Component: Scene5Plan,      durationInFrames: Math.round(FPS * 4.5) },
  { Component: Scene6Analytics, durationInFrames: Math.round(FPS * 5.5) },
  { Component: Scene7CTA,       durationInFrames: FPS * 4 },
];

export const TOTAL_FRAMES = SCENES.reduce((acc, s) => acc + s.durationInFrames, 0);

const SceneWrap: React.FC<{ children: React.ReactNode; total: number }> = ({
  children, total,
}) => {
  const sceneFrame = useCurrentFrame();
  const fadeOut = interpolate(sceneFrame, [total - 12, total], [1, 0], {
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

      {/* Audio: drop a track at ad/public/music.mp3 then add
          import {Audio, staticFile} from 'remotion';
          <Audio src={staticFile('music.mp3')} volume={0.6} />  */}
    </AbsoluteFill>
  );
};
