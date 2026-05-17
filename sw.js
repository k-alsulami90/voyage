// Voyage service worker — minimal, hand-rolled (no Workbox dep).
// Strategy:
//   - HTML (navigation): network-first, fall back to cache, fall back to /offline.html
//   - Local static assets (.jsx, .css, .svg, /icons/*): cache-first, refresh in background
//   - Supabase API / Storage: ALWAYS network, never cached (auth tokens + RLS)
//   - Google Fonts: cache-first (rarely change)

// Bump this on every deploy that changes shell behaviour. Vercel deploys
// rebuild the file from git so the string itself is enough — no build step needed.
const VERSION = 'v14-splash-cinematic';
const SHELL_CACHE  = `voyage-shell-${VERSION}`;
const STATIC_CACHE = `voyage-static-${VERSION}`;
const FONT_CACHE   = `voyage-fonts-${VERSION}`;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/tokens.css',
  '/i18n.jsx',
  '/icons.jsx',
  '/ui.jsx',
  '/ios-frame.jsx',
  '/tweaks-panel.jsx',
  '/data.jsx',
  '/supabase/client.jsx',
  '/screen-auth.jsx',
  '/screen-trips.jsx',
  '/screen-insights.jsx',
  '/screen-app-settings.jsx',
  '/screen-hub.jsx',
  '/screen-budget.jsx',
  '/screen-analytics.jsx',
  '/screen-docs.jsx',
  '/screen-doc-detail.jsx',
  '/screen-add-doc.jsx',
  '/screen-settings.jsx',
  '/app.jsx',
];

// ── Install: prime the shell cache ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_FILES).catch((err) => {
        // Don't fail install if one file 404s in dev
        console.warn('[sw] addAll partial failure', err);
      })
    )
  );
  self.skipWaiting();
});

// ── Activate: nuke old versions ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![SHELL_CACHE, STATIC_CACHE, FONT_CACHE].includes(k))
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

// ── Fetch ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache POST/PUT/DELETE
  if (req.method !== 'GET') return;

  // Never intercept Supabase API / Storage / Auth
  if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in')) {
    return; // browser default
  }

  // Cache-first for Google Fonts
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(req, FONT_CACHE));
    return;
  }

  // HTML navigations: network-first, fall back to cache, fall back to offline
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirstNavigation(req));
    return;
  }

  // Other same-origin static files: cache-first with background refresh
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }
  // External CDN scripts (React, Babel, Supabase): cache-first
  event.respondWith(cacheFirst(req, STATIC_CACHE));
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) {
    // Refresh in background so the next load is fresh
    fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); }).catch(() => {});
    return cached;
  }
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function networkFirstNavigation(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(SHELL_CACHE);
    cache.put('/index.html', res.clone());
    return res;
  } catch (err) {
    const cache = await caches.open(SHELL_CACHE);
    const cached = await cache.match('/index.html') || await cache.match(req);
    if (cached) return cached;
    const offline = await cache.match('/offline.html');
    if (offline) return offline;
    return new Response('Offline', { status: 503 });
  }
}
