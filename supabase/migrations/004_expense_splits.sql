-- ============================================================
-- Phase 1 — Shared trips: expense splits
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (IF NOT EXISTS guards).
-- ============================================================

-- An expense can now be shared with a set of trip members. The payer
-- (created_by) is implicitly included in the share. If split_with is
-- empty, the expense is treated as personal (payer covered it, no share).
alter table public.expenses
  add column if not exists split_with uuid[] default '{}';

-- GIN index so 'expenses where user_id = ANY(split_with)' is fast
create index if not exists expenses_split_with_gin
  on public.expenses using gin (split_with);

-- Backfill existing expenses: assume they were split equally with all
-- current trip members (typical default for already-logged data).
-- Safe: only updates rows where split_with is still the empty default.
update public.expenses e
   set split_with = (
     select coalesce(array_agg(tm.user_id), '{}')
       from public.trip_members tm
      where tm.trip_id = e.trip_id
        and tm.user_id <> e.created_by
   )
 where (e.split_with is null or array_length(e.split_with, 1) is null);
