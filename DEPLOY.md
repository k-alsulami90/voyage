# Voyage — Deployment Guide

## Pre-flight security checklist

- [x] **No `service_role` keys in client code** — only the public `anon` key is embedded, gated by RLS
- [x] **No `dangerouslySetInnerHTML`, `eval()`, `document.write`, or `innerHTML` assignments** in source
- [x] **All Supabase writes have RLS policies** — see `supabase/schema.sql` + `supabase/migrations/002_phase1_rls.sql`
- [x] **Storage `documents` bucket** — RLS-gated by trip membership (Phase 1.1)
- [x] **Audit log** — INSERT policy added (Phase 1.2)
- [x] **`.gitignore`** excludes `.env*`, `.vercel/`, `node_modules/`, agent state
- [x] **CSP, HSTS, X-Frame-Options, Referrer-Policy** all set in `vercel.json`
- [x] **Service worker never caches Supabase API/Storage** (token leakage prevention)

## 1. Push to GitHub

From the project root:

```bash
git init
git add .
git status   # double-check no .env or secrets sneaked in
git commit -m "Initial commit — Voyage v1 (Phase 2 complete)"

# Create the repo on github.com first, then:
git remote add origin https://github.com/<your-username>/voyage.git
git branch -M main
git push -u origin main
```

## 2. Deploy on Vercel

1. **vercel.com → New Project → Import Git Repository**
2. Pick the `voyage` repo
3. **Framework Preset:** `Other` (no build step — we serve static files)
4. **Build Command:** leave empty
5. **Output Directory:** `.` (root)
6. **Install Command:** leave empty
7. **Environment Variables:** none needed (Supabase anon key is in-code, public by design)
8. Click **Deploy**

You'll get a URL like `voyage-xxxx.vercel.app`. Copy it.

## 3. Update Supabase with the production URL

Supabase needs to whitelist your Vercel URL for auth redirects, otherwise password reset emails will fail.

1. **Supabase Dashboard → Authentication → URL Configuration**
2. **Site URL** — change to `https://voyage-xxxx.vercel.app`
3. **Redirect URLs** → add:
   ```
   https://voyage-xxxx.vercel.app
   https://voyage-xxxx.vercel.app/**
   ```
   Keep `http://localhost:3000/**` for local dev.
4. Save

## 4. Update CORS for Storage (if needed)

Supabase Storage usually accepts cross-origin reads from any HTTPS origin, but if you see CORS errors on PDFs:

1. **Supabase Dashboard → Storage → Configuration → CORS**
2. Add your Vercel URL to allowed origins.

## 5. Custom domain (optional)

Once you buy a domain (`voyage.app`, etc.):

1. **Vercel project → Settings → Domains → Add** → enter your domain
2. Add the DNS records Vercel shows you (CNAME or A records) at your registrar
3. Wait for DNS propagation (~5 min)
4. **Supabase → URL Configuration** → add the new domain to Site URL + Redirect URLs (`https://voyage.app/**`)
5. Update sender domain in **Resend → Domains** if you want emails from `noreply@voyage.app`

## 6. Post-deploy smoke test

In an incognito window on the live URL:

- [ ] App loads, no console errors
- [ ] DevTools → Application → **Service Workers** → `sw.js` is "activated and running"
- [ ] DevTools → Application → **Manifest** → no errors
- [ ] Sign-up flow works
- [ ] Sign-in works
- [ ] Forgot password → email lands → reset → sign in
- [ ] Create trip → add expense → upload doc to vault → all writes succeed
- [ ] Open trip on second device → real-time updates work
- [ ] Toggle dark mode → palette switches
- [ ] Toggle Arabic → layout flips RTL, fonts render correctly

## Known tech debt (won't block launch)

- Babel compiles JSX in the browser → slow first paint on phones (~2-3s). Vite migration is in the Tier 4 plan; not blocking publish.
- FX_RATES is a static table (last updated 2025-11-15). Manual override per trip is wired. Auto-refresh via Edge Function is a Phase 4 task.
- No error tracking yet — wire up Sentry in Phase 4.

## Rollback

If something breaks after deploy:

1. **Vercel Dashboard → Deployments → previous good deploy → "Promote to Production"** — instant rollback
2. Or `git revert <bad-commit> && git push` — triggers a fresh deploy with the revert
