import './index.css';
import { Composition } from 'remotion';
import { MyComposition, TOTAL_FRAMES } from './Composition';

// 1080×1920 (9:16 vertical for TikTok / Reels / Shorts), 60fps, 38s.
// Render:  npx remotion render VoyageAd out/voyage-ad.mp4
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VoyageAd"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
