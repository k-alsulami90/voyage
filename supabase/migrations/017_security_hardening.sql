-- ============================================================
-- Security hardening — Wave 1 (RLS fixes, no client changes needed)
-- Run once in the Supabase SQL editor. Safe to re-run.
--
-- Closes two findings from the RLS audit:
--   Finding 2 (HIGH): any authenticated user could read EVERY trip's
--                     invite token and join any trip.
--   Finding 3 (FUNC): co-travelers showed as "Unknown / ?" because the
--                     only profiles policy was own-row.
-- The storage/private-bucket fix (Finding 1) is a separate change.
-- ============================================================

-- ── Finding 2: lock down invite tokens ──────────────────────
-- The old policy was `for select to authenticated using (true)`, which
-- lets ANY logged-in user `select * from trip_invites` and harvest every
-- token, then redeem one to join any trip. RLS can't enforce "only the
-- token you already know" — a SELECT with no filter returns all rows.
--
-- Dropping it is safe:
--   * Admins still SELECT/INSERT/DELETE invites via the existing
--     "invites: admin write" (FOR ALL) policy — that's all the app's
--     direct invite reads (getOrCreateInvite / loadTripInvites) need.
--   * Joining goes through redeem_trip_invite(), a SECURITY DEFINER
--     function that bypasses RLS, so a joiner never needs table SELECT.
drop policy if exists "invites: read by token" on public.trip_invites;

-- ── Finding 3: let co-travelers see each other's basic identity ──
-- A SECURITY DEFINER helper answers "do I share a trip with this person?"
-- It runs as the function owner, so it bypasses RLS on trip_members —
-- which both avoids recursion and lets it see the membership rows needed
-- to decide. STABLE = safe to cache within a statement.
create or replace function public.shares_trip_with(p_other uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.trip_members me
    join public.trip_members them on them.trip_id = me.trip_id
    where me.user_id = auth.uid()
      and them.user_id = p_other
  );
$$;

-- Don't leave it callable by anon / public; only logged-in users.
revoke all on function public.shares_trip_with(uuid) from public;
revoke all on function public.shares_trip_with(uuid) from anon;
grant execute on function public.shares_trip_with(uuid) to authenticated;

-- New SELECT policy on profiles: your own row, OR anyone you share a trip
-- with. Permissive policies OR together, so this widens reads from
-- own-only to own + co-members, while the existing "profiles: own row"
-- (FOR ALL) still governs INSERT/UPDATE/DELETE.
--
-- NOTE: RLS is row-level, not column-level, so this exposes a co-member's
-- full profile row (name, initials, avatar_hue, home_base, default_currency,
-- lang, dark_mode) to people on the same trip — not just the three columns
-- the UI uses. For co-travelers that's low-sensitivity, but if you want to
-- expose ONLY name/initials/avatar, say so and we'll switch loadMembers to
-- a SECURITY DEFINER function that returns just those columns instead.
drop policy if exists "profiles: co-member read" on public.profiles;
create policy "profiles: co-member read"
  on public.profiles for select
  to authenticated
  using ( id = auth.uid() or public.shares_trip_with(id) );
