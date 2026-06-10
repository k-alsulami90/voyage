import './index.css';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

// 1080×1920 (9:16 vertical), 30fps, 36s total (180 frames × 6 scenes).
// Render command: `npx remotion render VoyageAd out/voyage-ad.mp4`
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VoyageAd"
        component={MyComposition}
        durationInFrames={1080}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
