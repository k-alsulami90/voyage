-- 019 — Trip cards (البطاقات) + today's budget
--
-- The group's trip money sits on a few people's cards. The trip stores
-- whose card and how much is on it; every expense's payer (created_by)
-- is the card it was paid from. Card balance = amount − expenses paid by
-- that card from the trip's start date. Nothing else changes.

alter table public.trips
  add column if not exists wallets jsonb;
-- Shape: { "enabled": true,
--          "cards": [ { "user_id": "<uuid>", "amount_usd": 2600 }, ... ] }
