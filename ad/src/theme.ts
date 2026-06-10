// Voyage design tokens, pulled from travel_app/tokens.css so the ad
// reads as the same product. OKLCH values match the light-mode
// palette since the ad is meant to feel warm + editorial like the
// app's primary surface.
export const theme = {
  cream:     'oklch(0.93  0.018 78)',
  cream2:    'oklch(0.975 0.010 80)',
  sand:      'oklch(0.88  0.020 82)',
  sandDeep:  'oklch(0.82  0.022 82)',
  ink:       'oklch(0.22 0.025 250)',
  inkSoft:   'oklch(0.36 0.025 250)',
  inkMute:   'oklch(0.46 0.020 248)',
  clay:      'oklch(0.62 0.13 35)',
  clayDeep:  'oklch(0.46 0.12 32)',
  moss:      'oklch(0.50 0.08 155)',
  mossDeep:  'oklch(0.32 0.09 155)',
  indigo:    'oklch(0.42 0.10 285)',
  honey:     'oklch(0.78 0.13 75)',
  // Statement-card paint (dark editorial surface)
  statement:   'oklch(0.22 0.025 250)',
  statementFg: 'oklch(0.965 0.012 80)',
  statementSub:'oklch(0.78 0.010 75)',
};

// Fonts. The app uses IBM Plex Sans Arabic (body) and Tajawal (display)
// for AR; the ad uses the same so the voice carries. Instrument Serif
// for the rare Latin display moments (logo lockup).
export const fonts = {
  arSans: '"IBM Plex Sans Arabic", system-ui, sans-serif',
  arDisplay: '"Tajawal", "IBM Plex Sans Arabic", system-ui, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};
