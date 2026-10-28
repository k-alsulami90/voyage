-- 023 — Cash (الكاش) as part of the trip money
--
-- Next to the cards, the group can carry one pot of cash brought from home.
-- The amount lives with the cards in trips.wallets:
--   { "enabled": true,
--     "cards": [ { "user_id": "<uuid>", "amount_usd": 2600 }, ... ],
--     "cash":  { "amount": 20000, "currency": "TRY", "amount_usd": 415.3 } }
-- and an expense paid from it says so here. Cash left = the cash amount −
-- the expenses paid in cash; the cards no longer count those.
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run.

alter table public.expenses
  add column if not exists paid_with text;

alter table public.expenses
  drop constraint if exists expenses_paid_with_check;
alter table public.expenses
  add constraint expenses_paid_with_check check (paid_with is null or paid_with in ('card', 'cash'));
