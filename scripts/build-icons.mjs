// Generates all PWA icon sizes from icons/icon.svg.
// Run with:  node scripts/build-icons.mjs
//
// Outputs:
//   icons/icon-192.png            (Android home-screen)
//   icons/icon-512.png            (Splash + high-res)
//   icons/icon-maskable-512.png   (Android adaptive — 80% safe zone)
//   icons/apple-touch-icon.png    (iOS home-screen, 180×180)
//   icons/favicon-32.png          (Browser tab)
//   icons/favicon-16.png          (Tab small)
//   favicon.ico                   (Legacy multi-size)

import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'icons', 'icon.svg');
const ICONS_DIR = path.join(root, 'icons');

if (!existsSync(SRC)) {
  console.error(`Missing source: ${SRC}`);
  process.exit(1);
}
if (!existsSync(ICONS_DIR)) await mkdir(ICONS_DIR, { recursive: true });

const svg = await readFile(SRC);

// Standard square outputs — full-bleed
const sizes = [
  { name: 'icon-192.png',          size: 192 },
  { name: 'icon-512.png',          size: 512 },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'favicon-32.png',        size: 32  },
  { name: 'favicon-16.png',        size: 16  },
];

for (const { name, size } of sizes) {
  const out = path.join(ICONS_DIR, name);
  await sharp(svg, { density: 384 })  // high density → crisp at any size
    .resize(size, size, { fit: 'contain', background: { r: 243, g: 238, b: 216, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${name}  ${size}×${size}`);
}

// Maskable: Android crops to a circle/squircle; content must fit the inner 80%.
// We scale the SVG to ~80% and pad with solid background.
{
  const target = 512;
  const inner = Math.round(target * 0.78);
  const pad = Math.round((target - inner) / 2);
  const bg = { r: 243, g: 238, b: 216, alpha: 1 };
  const out = path.join(ICONS_DIR, 'icon-maskable-512.png');

  const innerPng = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: target, height: target, channels: 4, background: bg },
  })
    .composite([{ input: innerPng, top: pad, left: pad }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ icon-maskable-512.png  ${target}×${target} (78% safe zone)`);
}

// favicon.ico — multi-size container with 16, 32, 48
{
  const out = path.join(root, 'favicon.ico');
  const sizes = [16, 32, 48];
  const png48 = await sharp(svg, { density: 192 })
    .resize(48, 48, { fit: 'contain', background: { r: 243, g: 238, b: 216, alpha: 1 } })
    .png()
    .toBuffer();
  // sharp doesn't write .ico, but most browsers accept a single PNG renamed.
  // For a true multi-size .ico we'd need png-to-ico; PNG-as-ICO works on
  // Chrome/Edge/Safari/Firefox in 2025.
  await writeFile(out, png48);
  console.log(`✓ favicon.ico  (48×48 PNG)`);
}

console.log('\nAll icons generated. Commit + push:');
console.log('  git add icons/ favicon.ico');
console.log('  git commit -m "Generate PWA icon set"');
console.log('  git push');
