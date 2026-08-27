-- Push notifications: subscriptions + a per-doc "sent" ledger.
-- Run once in the Supabase SQL editor.

-- One row per browser/device push endpoint. The client upserts on
-- subscribe and deletes on unsubscribe. The Edge Function (service role)
-- reads these to know where to deliver.
create table if not exists push_subscriptions (
  endpoint   text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz default now()
);

alter table push_subscriptions enable row level security;

-- Each user manages only their own subscriptions. The Edge Function uses
-- the service-role key, which bypasses RLS, so it can read everyone's.
drop policy if exists "own push subscriptions" on push_subscriptions;
create policy "own push subscriptions" on push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Dedupe ledger so a given reminder fires once per recipient, not on
-- every cron tick. (doc_id, kind, user_id) is the natural key:
--   kind = 'flight-24h' | 'checkin-24h' | ...
create table if not exists push_sent (
  doc_id  uuid not null,
  kind    text not null,
  user_id uuid not null,
  sent_at timestamptz default now(),
  primary key (doc_id, kind, user_id)
);

alter table push_sent enable row level security;
-- No client policies: only the service-role Edge Function touches this.
