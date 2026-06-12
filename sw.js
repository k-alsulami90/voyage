// Voyage service worker — minimal, hand-rolled (no Workbox dep).
// Strategy:
//   - HTML (navigation): network-first, fall back to cache, fall back to /offline.html
//   - Local static assets (.jsx, .css, .svg, /icons/*): cache-first, refresh in background
//   - Supabase API / Storage: ALWAYS network, never cached (auth tokens + RLS)
//   - Google Fonts: cache-first (rarely change)

// Bump this on every deploy that changes shell behaviour. Vercel deploys
// rebuild the file from git so the string itself is enough — no build step needed.
const VERSION = 'v119-phase2-optimistic';
const SHELL_CACHE  = `voyage-shell-${VERSION}`;
const STATIC_CACHE = `voyage-static-${VERSION}`;
const FONT_CACHE   = `voyage-fonts-${VERSION}`;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/tokens.css',
  // lib
  '/src/lib/i18n.jsx',
  '/src/lib/ios-frame.jsx',
  '/src/lib/tweaks-panel.jsx',
  '/src/lib/data.jsx',
  '/src/lib/docs-schema.jsx',
  // ui
  '/src/ui/icons.jsx',
  '/src/ui/ui.jsx',
  // supabase
  '/src/supabase/client.jsx',
  // screens
  '/src/screens/screen-auth.jsx',
  '/src/screens/screen-onboarding.jsx',
  '/src/screens/screen-trips.jsx',
  '/src/screens/screen-insights.jsx',
  '/src/screens/screen-app-settings.jsx',
  '/src/screens/screen-hub.jsx',
  '/src/screens/screen-budget.jsx',
  '/src/screens/screen-analytics.jsx',
  '/src/screens/screen-docs.jsx',
  '/src/screens/screen-doc-detail.jsx',
  '/src/screens/screen-add-doc.jsx',
  '/src/screens/screen-settle-up.jsx',
  '/src/screens/screen-plan.jsx',
  '/src/screens/screen-trip-search.jsx',
  '/src/screens/screen-settings.jsx',
  // app entry
  '/src/app.jsx',
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

  // Never cache the live FX endpoint — always hit network so rates are fresh.
  if (url.hostname.endsWith('open.er-api.com')) {
    return; // browser default (network)
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
