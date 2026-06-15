# Push notifications setup (Phase 5)

The Smart Track 24h reminder ("boarding pass in 24h") is delivered by Web
Push. The app code is already wired; it stays **dormant** until you do the
five steps below. Nothing breaks while push is unconfigured — the Settings
toggle simply hides itself.

## What's already in the repo
- `src/lib/push.jsx` — client subscribe/unsubscribe + a `PUSH_VAPID_PUBLIC` slot.
- `sw.js` — `push` + `notificationclick` handlers.
- App Settings → **Trip reminders** toggle (appears once a VAPID key is set).
- `docs/migration-push.sql` — `push_subscriptions` + `push_sent` tables.
- `supabase/functions/smart-track-push/index.ts` — the sender (Deno).

## 1. Generate VAPID keys
```bash
npx web-push generate-vapid-keys
```
Copy the **Public Key** and **Private Key**.

## 2. Put the PUBLIC key in the client
Edit `src/lib/push.jsx`:
```js
window.PUSH_VAPID_PUBLIC = 'PASTE_PUBLIC_KEY_HERE';
```
Bump the service-worker `VERSION` in `sw.js` and deploy. The toggle now
appears in App Settings.

## 3. Run the migration
Paste `docs/migration-push.sql` into the Supabase SQL editor and run it.

## 4. Deploy the Edge Function + set secrets
```bash
supabase functions deploy smart-track-push --no-verify-jwt

supabase secrets set \
  VAPID_PUBLIC_KEY='PASTE_PUBLIC_KEY' \
  VAPID_PRIVATE_KEY='PASTE_PRIVATE_KEY' \
  VAPID_SUBJECT='mailto:you@yourdomain.com'
```
(`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.)

Smoke-test it once:
```bash
curl -X POST 'https://<PROJECT_REF>.functions.supabase.co/smart-track-push' \
  -H "Authorization: Bearer <ANON_OR_SERVICE_KEY>"
# -> {"ok":true,"sent":N}
```

## 5. Schedule it (every ~15 min)
In the Supabase SQL editor (pg_cron + pg_net), replacing the placeholders:
```sql
select cron.schedule(
  'smart-track-push',
  '*/15 * * * *',
  $$
  select net.http_post(
    url     => 'https://<PROJECT_REF>.functions.supabase.co/smart-track-push',
    headers => '{"Authorization":"Bearer <SERVICE_ROLE_KEY>","Content-Type":"application/json"}'::jsonb
  );
  $$
);
```

## Trip activity digests (second function)

A sibling function, `trip-activity-push`, notifies the **other** members of
a shared trip when someone adds expenses or documents. It's **batched**:
each person's recent adds to a trip collapse into one digest per recipient
("Sarah added 2 expenses and a document"), so logging spend during a trip
doesn't spam the crew.

Setup is the same shape as Smart Track:

```bash
# 1. Migration (preference column + dedupe ledger)
#    Paste docs/migration-activity-push.sql into the SQL editor and run it.

# 2. Deploy the function (reuses the SAME VAPID secrets — no new secrets)
supabase functions deploy trip-activity-push --no-verify-jwt

# 3. Schedule it on the same ~15 min cadence
```
```sql
select cron.schedule(
  'trip-activity-push',
  '*/15 * * * *',
  $$
  select net.http_post(
    url     => 'https://<PROJECT_REF>.functions.supabase.co/trip-activity-push',
    headers => '{"Authorization":"Bearer <SERVICE_ROLE_KEY>","Content-Type":"application/json"}'::jsonb
  );
  $$
);
```

- Excludes the actor; solo trips (no other members) send nothing.
- Per-user opt-out lives in **Settings → Trip activity** (appears once push
  is on). It writes `profiles.notify_activity`; the function skips anyone
  who turned it off.
- Reads `audit_log` (`added` = expense, `uploaded` = document) over a 30-min
  look-back; the `push_activity_sent` ledger keys on `(audit_id, user_id)`
  so nothing is sent twice across ticks.

## How recipients are chosen
- Doc assigned to a traveler (`owner_user_id`) → only that traveler is reminded.
- Shared doc (`owner_user_id` null) → everyone on the trip.

This is why per-traveler document ownership matters: in a group trip each
person gets pinged about **their own** boarding pass, not everyone's.

## iOS requirements (important)
- Web Push works only in an **installed** PWA (Add to Home Screen), not a Safari tab.
- iOS **16.4+**.
- The first `subscribe` must come from a tap — our Settings toggle satisfies that.

## Testing the round-trip
1. Install the PWA, open **Settings → Trip reminders**, turn it **on** (allow the prompt).
2. Add a flight doc with `dep_at` set ~2 hours from now, owned by you.
3. Invoke the function (the curl above) — you should get the notification.
4. Re-invoking won't double-send (the `push_sent` ledger dedupes).
