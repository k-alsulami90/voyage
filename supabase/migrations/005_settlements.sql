-- ============================================================
-- Phase 2 — Settlements (Settle Up)
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (uses IF NOT EXISTS where possible).
-- ============================================================

-- Each row records a real-world money transfer between two trip members.
-- These zero out (or reduce) the running balance produced by expense splits.
create table if not exists public.settlements (
  id           uuid        primary key default uuid_generate_v4(),
  trip_id      text        not null references public.trips(id) on delete cascade,
  from_user    uuid        not null references public.profiles(id),
  to_user      uuid        not null references public.profiles(id),
  amount_usd   numeric(10,2) not null,
  note         text,
  created_at   timestamptz not null default now(),
  created_by   uuid        references public.profiles(id),
  -- Prevent self-payments
  constraint settlements_distinct_users check (from_user <> to_user)
);

create index if not exists settlements_trip_id_idx on public.settlements(trip_id);
create index if not exists settlements_users_idx   on public.settlements(from_user, to_user);

alter table public.settlements enable row level security;

-- Trip members can read all settlements for trips they belong to
drop policy if exists "settlements: member read" on public.settlements;
create policy "settlements: member read"
  on public.settlements for select
  using (
    exists (
      select 1 from public.trip_members tm
      where tm.trip_id = settlements.trip_id
        and tm.user_id = auth.uid()
    )
  );

-- Admins and Editors can record settlements
drop policy if exists "settlements: editor write" on public.settlements;
create policy "settlements: editor write"
  on public.settlements for insert
  with check (
    exists (
      select 1 from public.trip_members tm
      where tm.trip_id = settlements.trip_id
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  );

-- Allow the recorder to delete their own mistakes
drop policy if exists "settlements: editor delete" on public.settlements;
create policy "settlements: editor delete"
  on public.settlements for delete
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.trip_members tm
      where tm.trip_id = settlements.trip_id
        and tm.user_id = auth.uid()
        and tm.role = 'Admin'
    )
  );
