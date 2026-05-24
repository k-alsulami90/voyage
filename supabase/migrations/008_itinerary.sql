-- ============================================================
-- Phase 5 — Day-by-day itinerary / plan
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- One row per planned activity. Activities belong to a calendar day
-- (day_date). start_time is optional — items without a time sort by
-- sort_order at the end of the day.
create table if not exists public.itinerary_items (
  id          uuid        primary key default uuid_generate_v4(),
  trip_id     text        not null references public.trips(id) on delete cascade,
  day_date    date        not null,
  start_time  time,
  title       text        not null,
  category    text        not null default 'misc'
                check (category in ('food','sight','transport','lodging','misc')),
  location    text,
  sort_order  int         not null default 0,
  created_by  uuid        not null references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists itinerary_items_trip_day_idx
  on public.itinerary_items (trip_id, day_date, start_time nulls last, sort_order);

alter table public.itinerary_items enable row level security;

-- Members of the trip can read the itinerary
drop policy if exists "itinerary: members read" on public.itinerary_items;
create policy "itinerary: members read"
  on public.itinerary_items for select
  to authenticated
  using (exists (
    select 1 from public.trip_members tm
    where tm.trip_id = itinerary_items.trip_id
      and tm.user_id = auth.uid()
  ));

-- Admin + Editor can insert / update / delete
drop policy if exists "itinerary: editors write" on public.itinerary_items;
create policy "itinerary: editors write"
  on public.itinerary_items for all
  to authenticated
  using (exists (
    select 1 from public.trip_members tm
    where tm.trip_id = itinerary_items.trip_id
      and tm.user_id = auth.uid()
      and tm.role in ('Admin','Editor')
  ))
  with check (exists (
    select 1 from public.trip_members tm
    where tm.trip_id = itinerary_items.trip_id
      and tm.user_id = auth.uid()
      and tm.role in ('Admin','Editor')
  ));
