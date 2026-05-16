-- ============================================================
-- Phase F — Multi-country support per trip
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (uses IF NOT EXISTS).
-- ============================================================

-- A trip can span multiple countries (e.g. Europe trip across CH, PT, GB, NL).
-- We keep the legacy single-letter country_code for back-compat but the
-- canonical list lives in `countries` as free-text labels.
alter table public.trips
  add column if not exists countries text[] default '{}';

-- Backfill from country_code where the array is empty
update public.trips
   set countries = array[country_code]
 where (countries is null or array_length(countries, 1) is null)
   and country_code is not null
   and length(trim(country_code)) > 0;

-- Index for the lifetime-stats "distinct countries" computation
create index if not exists trips_countries_gin on public.trips using gin (countries);
