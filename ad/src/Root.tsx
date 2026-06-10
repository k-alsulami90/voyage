import './index.css';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

// 1080×1920 (9:16 vertical), 60fps, 26s total.
// Three cinematic scenes -- see Composition.tsx for the cadence.
// Render:  npx remotion render VoyageAd out/voyage-ad.mp4
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VoyageAd"
        component={MyComposition}
        durationInFrames={1560}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
