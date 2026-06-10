import './index.css';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

// 1080×1920 (9:16 vertical), 30fps, 32s total (varied scene durations
// to break the 6s metronome — see Composition.tsx for the cadence).
// Render command: `npx remotion render VoyageAd out/voyage-ad.mp4`
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VoyageAd"
        component={MyComposition}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
