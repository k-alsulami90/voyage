-- ============================================================
-- Hotfix — redeem_trip_invite "column reference is ambiguous"
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- The original function (migration 007) declared its RETURNS TABLE
-- output columns as (trip_id text, role member_role). Inside the
-- function body those names clashed with the trip_id column on the
-- trip_members table during the INSERT, causing:
--   ERROR:  column reference "trip_id" is ambiguous
--
-- Fix: rename the OUT columns to out_trip_id / out_role so the
-- table columns and v_invite.* fields are the only things in scope
-- with the unsuffixed names.

-- Drop the old signature first — Postgres treats a different return
-- type as a different function.
drop function if exists public.redeem_trip_invite(text);

create or replace function public.redeem_trip_invite(p_token text)
returns table (out_trip_id text, out_role member_role)
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

  out_trip_id := v_invite.trip_id;
  out_role    := v_invite.role;
  return next;
end;
$$;

grant execute on function public.redeem_trip_invite(text) to authenticated;
