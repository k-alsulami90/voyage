// Voyage service worker — minimal, hand-rolled (no Workbox dep).
// Strategy:
//   - HTML (navigation): network-first with a short timeout, then the kept
//     shell — so the app opens at once with no (or weak) signal
//   - App shell (bundle, css): precached per deploy
//   - CDN libraries (React, Supabase), Google Fonts, pdf.js: kept ACROSS
//     deploys (fetched once at install), so an update never leaves the app
//     unable to open offline
//   - Trip files (/__files/…): written by the page (src/lib/offline.jsx),
//     answered from the phone
//   - Trip cover photos (public storage): kept copy first, refreshed behind
//   - Supabase API / private Storage / Auth: ALWAYS network, never cached
//   - FX rates: always network (the page keeps the last ones itself)

// Bump this on every deploy that changes shell behaviour. Vercel deploys
// rebuild the file from git so the string itself is enough — no build step needed.
const VERSION = 'v148-fx';
const SHELL_CACHE  = `voyage-shell-${VERSION}`;
const STATIC_CACHE = `voyage-static-${VERSION}`;
// Kept across deploys (their URLs carry a version, or the content is stable):
const CDN_CACHE    = 'voyage-cdn-v1';
const FONT_CACHE   = 'voyage-fonts-v1';
const VENDOR_CACHE = 'voyage-vendor-v1';
const FILES_CACHE  = 'voyage-files-v1';   // tickets, boarding passes, visas, receipts
const IMG_CACHE    = 'voyage-img-v1';     // public cover photos
const KEEP = [SHELL_CACHE, STATIC_CACHE, CDN_CACHE, FONT_CACHE, VENDOR_CACHE, FILES_CACHE, IMG_CACHE];

const SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/tokens.css',
  // lib
  '/src/lib/i18n.jsx',
  '/src/lib/offline.jsx',
  '/src/lib/push.jsx',
  '/src/lib/ios-frame.jsx',
  '/src/lib/tweaks-panel.jsx',
  '/src/lib/data.jsx',
  '/src/lib/docs-schema.jsx',
  // ui
  '/src/ui/icons.jsx',
  '/src/ui/ui.jsx',
  '/src/lib/motion.jsx',
  '/src/lib/depth.jsx',
  '/src/screens/screen-analysis.jsx',
  '/src/lib/wallets.jsx',
  '/src/lib/files.jsx',
  '/src/lib/fx.jsx',
  // supabase
  '/src/supabase/client.jsx',
  // screens
  '/src/screens/screen-auth.jsx',
  '/src/screens/screen-onboarding.jsx',
  '/src/screens/screen-trips.jsx',
  '/src/screens/screen-app-settings.jsx',
  '/src/screens/screen-hub.jsx',
  '/src/screens/screen-budget.jsx',
  '/src/screens/screen-docs.jsx',
  '/src/screens/screen-doc-detail.jsx',
  '/src/screens/screen-add-doc.jsx',
  '/src/screens/screen-settle-up.jsx',
  '/src/screens/screen-plan.jsx',
  '/src/screens/screen-trip-search.jsx',
  '/src/screens/screen-settings.jsx',
  '/src/screens/screen-recap.jsx',
  // app entry
  '/src/app.jsx',
];

// Libraries index.html loads from CDNs — fetched at install, kept across
// deploys, so the app opens with no signal even right after an update.
const CDN_FILES = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
];
// The PDF viewer (src/lib/files.jsx) — ready before the first PDF is opened.
const VENDOR_FILES = [
  '/vendor/pdfjs-4.10.38/pdf.min.mjs',
  '/vendor/pdfjs-4.10.38/pdf.worker.min.mjs',
];

// Put what's missing into a kept cache (a failure just leaves it for the
// runtime fetch to fill later).
async function fill(cacheName, urls) {
  try {
    const cache = await caches.open(cacheName);
    await Promise.all(urls.map(async (u) => {
      try {
        if (await cache.match(u)) return;
        const res = await fetch(new Request(u, { mode: 'cors', credentials: 'omit' }));
        if (res && res.ok) await cache.put(u, res);
      } catch (_) {}
    }));
  } catch (_) {}
}

// ── Install: prime the shell + the kept libraries ───────────
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    // One at a time-ish: a single 404 in dev must not leave the shell empty.
    await Promise.all(SHELL_FILES.map((u) => shell.add(u).catch((err) => console.warn('[sw] precache', u, err))));
    await Promise.all([fill(CDN_CACHE, CDN_FILES), fill(VENDOR_CACHE, VENDOR_FILES)]);
  })());
  self.skipWaiting();
});

// ── Activate: drop old versions (the kept caches stay) ──────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('voyage-') && !KEEP.includes(k))
                       .map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Listen for SKIP_WAITING from the page ───────────────────
// When the app detects a new SW is waiting, it posts this message so
// the new version activates immediately instead of waiting for all tabs to close.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Push notifications ──────────────────────────────────────
// The Smart Track reminder ("boarding pass in 24h") is sent server-side
// by the smart-track-push Edge Function. Payload shape:
//   { title, body, url, tag }
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { data = { title: 'Voyage', body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'Voyage';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'voyage',
    data: { url: data.url || '/' },
    dir: 'auto',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if ('focus' in c) { try { await c.navigate(url); } catch (_) {} return c.focus(); }
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});

// ── Fetch ───────────────────────────────────────────────────
const isSupabase = (url) => url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in');

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Never cache POST/PUT/DELETE
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Trip files the page keeps on the phone (tickets, passes, receipts…)
  if (url.origin === self.location.origin && url.pathname.startsWith('/__files/')) {
    event.respondWith(fromFiles(req));
    return;
  }

  // Public cover photos: the kept copy at once, refreshed behind it.
  if (isSupabase(url) && url.pathname.startsWith('/storage/v1/object/public/')) {
    event.respondWith(staleWhileRevalidate(req, IMG_CACHE));
    return;
  }

  // Never intercept Supabase API / private Storage / Auth
  if (isSupabase(url)) return; // browser default

  // Never cache the live FX endpoint — always hit network so rates are fresh.
  if (url.hostname.endsWith('open.er-api.com')) {
    return; // browser default (network)
  }

  // Google Fonts: kept across deploys
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(req, FONT_CACHE, true));
    return;
  }

  // HTML navigations: network-first (briefly), else the kept shell
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(navigation(req));
    return;
  }

  if (url.origin === self.location.origin) {
    // pdf.js: versioned path, kept across deploys
    if (url.pathname.startsWith('/vendor/')) { event.respondWith(cacheFirst(req, VENDOR_CACHE)); return; }
    // Other same-origin static files: cache-first with background refresh
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }
  // External CDN scripts (React, Supabase): kept across deploys
  event.respondWith(cacheFirst(req, CDN_CACHE));
});

async function cacheFirst(req, cacheName, corsFetch) {
  // Any cache: the precached shell, the kept libraries…
  const cached = await caches.match(req);
  const get = () => (corsFetch ? fetch(req.url, { mode: 'cors', credentials: 'omit' }) : fetch(req));
  if (cached) {
    // Refresh in background so the next load is fresh
    get().then(async (res) => { if (res && res.ok) (await caches.open(cacheName)).put(req, res.clone()); }).catch(() => {});
    return cached;
  }
  try {
    const res = await get();
    if (res && res.ok) (await caches.open(cacheName)).put(req, res.clone());
    return res;
  } catch (err) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const net = fetch(req.url, { mode: 'cors', credentials: 'omit' })
    .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  if (hit) return hit;
  return (await net) || new Response('', { status: 504, statusText: 'Offline' });
}

async function fromFiles(req) {
  const cache = await caches.open(FILES_CACHE);
  // This version, or (no signal) an older copy of the same file
  const hit = (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true }));
  return hit || new Response('', { status: 404, statusText: 'Not on this device' });
}

async function navigation(req) {
  const cache = await caches.open(SHELL_CACHE);
  const kept = (await cache.match('/index.html')) || (await cache.match('/'));
  const network = fetch(req).then((res) => {
    if (res && res.ok) cache.put('/index.html', res.clone());
    return res;
  });
  if (!kept) {
    try { return await network; }
    catch (err) {
      const offline = await cache.match('/offline.html');
      return offline || new Response('Offline', { status: 503 });
    }
  }
  // Fresh when the network answers quickly; the kept shell otherwise (it
  // updates itself in the background for next time).
  try {
    const res = await Promise.race([network, new Promise((r) => setTimeout(() => r(null), 2500))]);
    if (res && res.ok) return res;
  } catch (_) {}
  network.catch(() => {});
  return kept;
}
