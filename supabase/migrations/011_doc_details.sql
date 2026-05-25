-- ============================================================
-- Phase 8 — Per-category document details
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- Until now every document carried a generic title/subtitle/file. The
-- different categories actually need very different fields:
--
--   flights   → airline, dep/arr airports + terminals + timestamps,
--               location_url, plus TWO files (e-ticket + boarding pass)
--   lodging   → check-in / check-out timestamps, address + location_url,
--               reservation file
--   transport → pickup / dropoff timestamps, vendor, location_url,
--               rental file
--   visas     → issue / expiry dates (kept simple)
--
-- Rather than add ~15 nullable columns we store the category-specific
-- shape in a single `details` jsonb. The keys per category are:
--   flights:   { airline, dep_airport, dep_terminal, dep_at, arr_airport,
--                arr_terminal, arr_at, location_url }
--   lodging:   { check_in_at, check_out_at, address, location_url }
--   transport: { vendor, pickup_at, dropoff_at, location_url }
--   visas:     { visa_type, issued_on, expires_on }
--
-- timestamps are ISO strings (text in JSON, parsed in the client).

alter table public.documents
  add column if not exists details jsonb not null default '{}'::jsonb,
  add column if not exists cost_usd numeric(10,2),
  add column if not exists cost_local numeric(12,2),
  add column if not exists cost_currency char(3),
  add column if not exists linked_expense_id uuid references public.expenses(id) on delete set null,
  add column if not exists secondary_file_path text,
  add column if not exists secondary_file_size bigint;

create index if not exists documents_linked_expense_idx
  on public.documents (linked_expense_id);
