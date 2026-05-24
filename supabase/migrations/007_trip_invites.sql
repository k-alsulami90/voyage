-- ============================================================
-- Phase 4 — Trip invite links
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- One row per (trip, role). Token is short and shareable.
-- Redemption happens via a SECURITY DEFINER function below so we
-- don't have to relax RLS on trip_members.
create table if not exists public.trip_invites (
  token        text        primary key,
  trip_id      text        not null references public.trips(id) on delete cascade,
  role         member_role not null default 'Editor',
  created_by   uuid        not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz,
  revoked_at   timestamptz,
  unique (trip_id, role)
);

create index if not exists trip_invites_trip_idx on public.trip_invites (trip_id);

alter table public.trip_invites enable row level security;

-- Anyone authenticated may SELECT an invite by token (needed to preview
-- the trip before joining). The token itself is the bearer credential.
drop policy if exists "invites: read by token" on public.trip_invites;
create policy "invites: read by token"
  on public.trip_invites for select
  to authenticated
  using (true);

-- Only the trip's Admins may create or revoke invites.
drop policy if exists "invites: admin write" on public.trip_invites;
create policy "invites: admin write"
  on public.trip_invites for all
  to authenticated
  using (exists (
    select 1 from public.trip_members tm
    where tm.trip_id = trip_invites.trip_id
      and tm.user_id = auth.uid()
      and tm.role = 'Admin'
  ))
  with check (exists (
    select 1 from public.trip_members tm
    where tm.trip_id = trip_invites.trip_id
      and tm.user_id = auth.uid()
      and tm.role = 'Admin'
  ));

-- ── Redeem function ─────────────────────────────────────────
-- SECURITY DEFINER so the joining user can insert into trip_members
-- using the invite token as proof — no RLS gymnastics needed.
create or replace function public.redeem_trip_invite(p_token text)
returns table (trip_id text, role member_role)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.trip_invites;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_invite from public.trip_invites where token = p_token;
  if not found then
    raise exception 'invite not found';
  end if;
  if v_invite.revoked_at is not null then
    raise exception 'invite revoked';
  end if;
  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    raise exception 'invite expired';
  end if;

  insert into public.trip_members (trip_id, user_id, role)
    values (v_invite.trip_id, v_uid, v_invite.role)
    on conflict (trip_id, user_id) do nothing;

  trip_id := v_invite.trip_id;
  role    := v_invite.role;
  return next;
end;
$$;

grant execute on function public.redeem_trip_invite(text) to authenticated;
