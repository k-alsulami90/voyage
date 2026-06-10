import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import './fonts';

import { Scene1Collab } from './scenes/Scene1Collab';
import { Scene2Docs } from './scenes/Scene2Docs';
import { Scene3Analytics } from './scenes/Scene3Analytics';

// Three-scene cinematic cut at 60fps.
//
//   Scene 1  Collab + Smart Budgeting    9.5s   570f
//   Scene 2  Document Hub + Smart Assist 8.0s   480f
//   Scene 3  Analytics + Settle + Logo   8.5s   510f
//   ----------------------------------------------
//   Total                                26.0s  1560f
//
// Each scene owns its own camera (no global camera wrapper). Cuts
// pass via an 18-frame fade-out on the outgoing scene; entries are
// driven by each scene's own spring physics.

const FPS = 60;

const SCENES = [
  { Component: Scene1Collab,    durationInFrames: Math.round(FPS * 9.5) },
  { Component: Scene2Docs,      durationInFrames: FPS * 8 },
  { Component: Scene3Analytics, durationInFrames: Math.round(FPS * 8.5) },
];

const SceneWrap: React.FC<{ children: React.ReactNode; total: number }> = ({
  children, total,
}) => {
  const sceneFrame = useCurrentFrame();
  const fadeOut = interpolate(sceneFrame, [total - 18, total], [1, 0], {
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
    </AbsoluteFill>
  );
};
