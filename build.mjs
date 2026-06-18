// Voyage build — pre-compile the app instead of transpiling in the browser.
//
// The app is written as ~26 classic (non-module) scripts that share one
// global scope (window.* + top-level function/const). This script:
//   1. concatenates them IN THE SAME ORDER index.html loads them,
//   2. transpiles JSX -> JS once (esbuild), NO bundling / NO IIFE wrap, so
//      the global-scope semantics are byte-for-byte what the browser did
//      with the separate <script> tags — just without Babel-in-browser,
//   3. writes dist/app.js (one pre-compiled file),
//   4. regenerates built.html from index.html (Babel + the 26 script tags
//      swapped for the single bundle) so we can A/B test before flipping.
//
// Run:  node build.mjs
// Edit source under src/**, then rerun this before committing.

import fs from 'fs';
import { execSync } from 'child_process';

// MUST match the load order in index.html. app.jsx is last (it mounts React).
const FILES = [
  'src/lib/i18n.jsx',
  'src/lib/offline.jsx',
  'src/supabase/client.jsx',
  'src/lib/push.jsx',
  'src/lib/ios-frame.jsx',
  'src/lib/tweaks-panel.jsx',
  'src/lib/data.jsx',
  'src/ui/icons.jsx',
  'src/ui/ui.jsx',
  'src/screens/screen-auth.jsx',
  'src/screens/screen-onboarding.jsx',
  'src/screens/screen-trips.jsx',
  'src/screens/screen-insights.jsx',
  'src/screens/screen-app-settings.jsx',
  'src/screens/screen-hub.jsx',
  'src/screens/screen-budget.jsx',
  'src/screens/screen-analytics.jsx',
  'src/screens/screen-docs.jsx',
  'src/screens/screen-doc-detail.jsx',
  'src/screens/screen-add-doc.jsx',
  'src/screens/screen-settle-up.jsx',
  'src/screens/screen-plan.jsx',
  'src/screens/screen-trip-search.jsx',
  'src/lib/docs-schema.jsx',
  'src/screens/screen-settings.jsx',
  'src/app.jsx',
];

// Output goes to assets/ (TRACKED by git so Vercel serves it as a static
// file). The temp concat goes to dist/ (gitignored) so a failed build never
// leaves a stray file staged.
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('assets', { recursive: true });

const banner = '/* Voyage — generated bundle. DO NOT EDIT. Edit src/**.jsx then run: node build.mjs */\n';
const concat = banner + FILES.map((f) => {
  if (!fs.existsSync(f)) throw new Error('Missing source file: ' + f);
  return `\n/* ===== ${f} ===== */\n` + fs.readFileSync(f, 'utf8');
}).join('\n');

const tmp = 'dist/_concat.jsx';
fs.writeFileSync(tmp, concat);

// Transpile only (no --bundle, no --format) → stays a classic script.
// charset=utf8 keeps Arabic strings readable instead of \u-escaped.
execSync(
  `npx --yes esbuild@0.24.0 "${tmp}" --loader:.jsx=jsx ` +
  `--jsx-factory=React.createElement --jsx-fragment=React.Fragment ` +
  `--target=es2019 --charset=utf8 --outfile=assets/app.js`,
  { stdio: 'inherit' }
);
fs.unlinkSync(tmp);

// ── Regenerate built.html from index.html ──────────────────
let html = fs.readFileSync('index.html', 'utf8');
// Drop the Babel standalone <script> (no longer needed).
html = html.replace(/[ \t]*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^\n]*\n/, '');
// Drop every <script type="text/babel" ...></script> line.
html = html.replace(/[ \t]*<script type="text\/babel"[^\n]*\n/g, '');
// Insert the single pre-compiled bundle right before the PWA SW block.
html = html.replace(
  /([ \t]*)<!-- ── PWA: service worker/,
  '$1<script src="/assets/app.js"></script>\n\n$1<!-- ── PWA: service worker'
);
fs.writeFileSync('built.html', html);

const kb = (fs.statSync('assets/app.js').size / 1024).toFixed(1);
console.log(`\n✓ assets/app.js  (${kb} kb)\n✓ built.html     (test page — live index.html untouched)`);
