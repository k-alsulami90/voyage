// Smart Track push reminders — Supabase Edge Function (Deno).
//
// Finds documents whose departure / check-in is within the next 24h and
// hasn't been reminded yet, and sends a Web Push to the right traveler(s):
//   - owner_user_id set  -> just that traveler (their own boarding pass)
//   - owner_user_id null -> everyone on the trip (shared booking)
//
// Run it on a schedule (every ~15 min) via pg_cron or a Supabase
// scheduled function — see docs/PUSH_SETUP.md.
//
// Secrets required (supabase secrets set ...):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@x.com)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@voyage.app";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

// Which document categories carry a time-sensitive event, the JSONB key
// that holds the ISO timestamp, and the reminder's dedupe `kind`.
const TRIGGERS: { category: string; key: string; kind: string; label: string }[] = [
  { category: "flights",   key: "dep_at",       kind: "flight-24h",   label: "Boarding pass" },
  { category: "lodging",   key: "check_in_at",  kind: "checkin-24h",  label: "Check-in" },
  { category: "transport", key: "pickup_at",    kind: "pickup-24h",   label: "Pick-up" },
];

function hoursUntil(iso: string): number {
  return (new Date(iso).getTime() - Date.now()) / 3_600_000;
}

async function recipientsFor(doc: any): Promise<string[]> {
  if (doc.owner_user_id) return [doc.owner_user_id];
  const { data } = await admin
    .from("trip_members")
    .select("user_id")
    .eq("trip_id", doc.trip_id);
  return (data ?? []).map((m: any) => m.user_id);
}

async function sendToUser(userId: string, payload: object): Promise<boolean> {
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);
  if (!subs || subs.length === 0) return false;
  let anySent = false;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
      );
      anySent = true;
    } catch (err: any) {
      // 404/410 → the subscription is dead; clean it up.
      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      } else {
        console.error("push send failed", err?.statusCode, err?.body ?? err?.message);
      }
    }
  }
  return anySent;
}

Deno.serve(async () => {
  let sent = 0;
  try {
    // Pull all docs in the trigger categories that have details; filter in JS.
    const { data: docs, error } = await admin
      .from("documents")
      .select("id, trip_id, title, category, details, owner_user_id")
      .in("category", TRIGGERS.map((t) => t.category));
    if (error) throw error;

    for (const doc of docs ?? []) {
      const trig = TRIGGERS.find((t) => t.category === doc.category)!;
      const iso = doc.details?.[trig.key];
      if (!iso) continue;
      const h = hoursUntil(iso);
      // Inside the next 24h and not already passed (small grace).
      if (!(h > -0.25 && h <= 24)) continue;

      const recipients = await recipientsFor(doc);
      for (const userId of recipients) {
        // Dedupe: skip if we've already sent this doc+kind to this user.
        const { data: already } = await admin
          .from("push_sent")
          .select("doc_id")
          .eq("doc_id", doc.id).eq("kind", trig.kind).eq("user_id", userId)
          .maybeSingle();
        if (already) continue;

        const whenLabel = h < 1 ? "soon" : `in ${Math.round(h)}h`;
        const ok = await sendToUser(userId, {
          title: `${trig.label} ${whenLabel}`,
          body: doc.title || "Open your trip in Voyage",
          url: "/",
          tag: `${trig.kind}-${doc.id}`,
        });
        // Mark as sent even if the user had no live subscription, so we
        // don't re-scan them forever; a fresh subscribe will still work
        // for future docs.
        await admin.from("push_sent").insert({
          doc_id: doc.id, kind: trig.kind, user_id: userId,
        });
        if (ok) sent++;
      }
    }
  } catch (err) {
    console.error("smart-track-push error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { "content-type": "application/json" },
  });
});
