// Trip activity push — Supabase Edge Function (Deno).
//
// When someone adds expenses or documents to a SHARED trip, notify the
// OTHER members. Runs on the same ~15 min schedule as smart-track-push
// and BATCHES: all of one person's recent adds to one trip collapse into a
// single digest per recipient ("Sarah added 2 expenses and a document"),
// so a busy afternoon of logging doesn't become a stream of buzzes.
//
// Recipients are the trip members minus the actor, who (a) haven't opted
// out (profiles.notify_activity) and (b) have a live push subscription.
// Solo trips have no other members, so nothing is sent.
//
// Run it on a schedule (every ~15 min) via pg_cron — see docs/PUSH_SETUP.md.
//
// Secrets required (same as smart-track-push):
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

// audit_log.action values we treat as "activity": 'added' = an expense,
// 'uploaded' = a document. Edits/removals are intentionally not pushed.
const EXPENSE_ACTION = "added";
const DOCUMENT_ACTION = "uploaded";

// Look back a little further than the cron interval so nothing slips
// through a boundary; the ledger dedupes the overlap.
const WINDOW_MIN = 30;

function firstName(name: string | null | undefined): string {
  return (name ?? "Someone").trim().split(/\s+/)[0] || "Someone";
}

// One human sentence for the digest body. Names the item when it's the
// only thing; otherwise counts ("2 expenses and a document").
function digestBody(actor: string, exp: any[], doc: any[]): string {
  const parts: string[] = [];
  if (exp.length) parts.push(exp.length === 1 ? "an expense" : `${exp.length} expenses`);
  if (doc.length) parts.push(doc.length === 1 ? "a document" : `${doc.length} documents`);
  const what = parts.join(" and ");
  if (exp.length + doc.length === 1) {
    const only = exp[0] ?? doc[0];
    const kind = exp.length ? "an expense" : "a document";
    return only?.target ? `${actor} added ${kind}: ${only.target}` : `${actor} added ${kind}`;
  }
  return `${actor} added ${what}`;
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
    const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
    const { data: rows, error } = await admin
      .from("audit_log")
      .select("id, trip_id, user_id, action, target, created_at")
      .in("action", [EXPENSE_ACTION, DOCUMENT_ACTION])
      .gte("created_at", since)
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!rows || rows.length === 0) return ok(0);

    // Group recent activity by trip + actor.
    const groups = new Map<string, { trip_id: string; actor: string; rows: any[] }>();
    for (const r of rows) {
      const key = `${r.trip_id}::${r.user_id}`;
      if (!groups.has(key)) groups.set(key, { trip_id: r.trip_id, actor: r.user_id, rows: [] });
      groups.get(key)!.rows.push(r);
    }

    // Small caches so we don't re-query the same trip/profile repeatedly.
    const membersOf = new Map<string, string[]>();
    const titleOf = new Map<string, string>();
    const nameOf = new Map<string, string>();
    const prefOf = new Map<string, boolean>();
    let prefColumnMissing = false;

    const activityOn = async (userId: string): Promise<boolean> => {
      if (prefColumnMissing) return true; // pre-migration → default on
      if (prefOf.has(userId)) return prefOf.get(userId)!;
      const { data, error: e } = await admin
        .from("profiles").select("notify_activity").eq("id", userId).maybeSingle();
      if (e) { prefColumnMissing = true; return true; }
      const on = data?.notify_activity !== false;
      prefOf.set(userId, on);
      return on;
    };

    for (const g of groups.values()) {
      // Recipients = other members of the trip.
      let members = membersOf.get(g.trip_id);
      if (!members) {
        const { data } = await admin.from("trip_members").select("user_id").eq("trip_id", g.trip_id);
        members = (data ?? []).map((m: any) => m.user_id);
        membersOf.set(g.trip_id, members);
      }
      const recipients = members.filter((u) => u !== g.actor);
      if (recipients.length === 0) continue; // solo trip — nobody to tell

      // Trip title (the notification heading).
      let title = titleOf.get(g.trip_id);
      if (title === undefined) {
        const { data } = await admin.from("trips").select("title").eq("id", g.trip_id).maybeSingle();
        title = data?.title ?? "Your trip";
        titleOf.set(g.trip_id, title);
      }
      // Actor's first name.
      let actor = nameOf.get(g.actor);
      if (actor === undefined) {
        const { data } = await admin.from("profiles").select("name").eq("id", g.actor).maybeSingle();
        actor = firstName(data?.name);
        nameOf.set(g.actor, actor);
      }

      for (const userId of recipients) {
        if (!(await activityOn(userId))) continue;

        // Which of this group's rows are new for THIS recipient?
        const ids = g.rows.map((r) => r.id);
        const { data: already } = await admin
          .from("push_activity_sent")
          .select("audit_id")
          .eq("user_id", userId)
          .in("audit_id", ids);
        const seen = new Set((already ?? []).map((x: any) => x.audit_id));
        const fresh = g.rows.filter((r) => !seen.has(r.id));
        if (fresh.length === 0) continue;

        const exp = fresh.filter((r) => r.action === EXPENSE_ACTION);
        const doc = fresh.filter((r) => r.action === DOCUMENT_ACTION);

        const ok = await sendToUser(userId, {
          title,
          body: digestBody(actor, exp, doc),
          url: "/",
          tag: `activity-${g.trip_id}`, // device collapses repeats per trip
        });

        // Record every included row so the next tick won't resend, even if
        // the push itself failed (no live subscription) — a future add will
        // still notify.
        await admin.from("push_activity_sent").insert(
          fresh.map((r) => ({ audit_id: r.id, user_id: userId })),
        );
        if (ok) sent++;
      }
    }
  } catch (err) {
    console.error("trip-activity-push error", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500, headers: { "content-type": "application/json" },
    });
  }
  return ok(sent);
});

function ok(sent: number): Response {
  return new Response(JSON.stringify({ ok: true, sent }), {
    headers: { "content-type": "application/json" },
  });
}
