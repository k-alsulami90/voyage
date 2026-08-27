-- Per-traveler document ownership.
-- In a group trip every file is visible to everyone (no privacy), but
-- some documents belong to ONE traveler — a boarding pass, an individual
-- flight ticket, a visa/passport, a personal activity ticket. Smart Track
-- (the 24h boarding-pass / check-in reminder) must only nudge a traveler
-- about THEIR own documents, plus anything shared with the whole group.
--
-- owner_user_id semantics:
--   NULL            -> shared with everyone (hotel, car rental, group tour).
--                      Smart Track reminds every member.
--   <a user's id>   -> belongs to that traveler. Smart Track reminds only
--                      them. The owner is CHOSEN explicitly when the doc is
--                      added/edited — it is NOT inferred from who uploaded
--                      (one person often uploads on behalf of the others).
--
-- Everyone can still SEE every doc (shared trip = nothing private); this
-- column only drives reminders + a "for: <name>" tag, not visibility.
--
-- Run once in the Supabase SQL editor. Safe to re-run (IF NOT EXISTS).

alter table documents
  add column if not exists owner_user_id uuid
  references auth.users(id) on delete set null;

-- Optional index: Smart Track / vault filter by owner within a trip.
create index if not exists documents_owner_idx
  on documents (trip_id, owner_user_id);
