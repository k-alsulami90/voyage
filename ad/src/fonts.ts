// Load IBM Plex Sans Arabic + Tajawal at module scope. Remotion picks
// them up automatically once the css() promise resolves and ensures
// the fonts are ready before the first frame renders.
import { loadFont as loadIBMPlexArabic } from '@remotion/google-fonts/IBMPlexSansArabic';
import { loadFont as loadTajawal } from '@remotion/google-fonts/Tajawal';
import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';

// @remotion/google-fonts types the subset arg per-family; for these
// three "normal" is the right key on the IBM Plex / Tajawal builds
// even though the script is Arabic. The font files themselves still
// include the Arabic glyph range.
loadIBMPlexArabic('normal', { weights: ['300', '400', '500', '600', '700'] });
loadTajawal('normal', { weights: ['400', '500', '700', '800'] });
loadInstrumentSerif();
