-- Trip activity notifications: preference flag + a per-row "sent" ledger.
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- This powers the trip-activity-push Edge Function, which notifies the
-- OTHER members of a shared trip when someone adds expenses or documents
-- (batched into one digest per actor per tick — see docs/PUSH_SETUP.md).

-- Per-user opt-out. Defaults ON so existing users keep getting activity
-- digests; the App Settings "Trip activity" toggle flips this. Distinct
-- from the Smart Track boarding-pass reminder, which is governed only by
-- whether the user has a push subscription.
alter table profiles
  add column if not exists notify_activity boolean not null default true;

-- Dedupe ledger: one row per (audit_log entry, recipient) that has been
-- included in a digest, so a given add is never re-sent on the next cron
-- tick. (audit_id, user_id) is the natural key.
create table if not exists push_activity_sent (
  audit_id uuid not null,
  user_id  uuid not null,
  sent_at  timestamptz default now(),
  primary key (audit_id, user_id)
);

alter table push_activity_sent enable row level security;
-- No client policies: only the service-role Edge Function touches this.

-- Keep the ledger from growing forever — it only needs ~the cron window.
-- (Optional housekeeping; the function tolerates a large table fine.)
create index if not exists push_activity_sent_sent_at_idx
  on push_activity_sent (sent_at);
