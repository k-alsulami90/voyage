-- Plan ↔ Budget linkage.
-- Lets a plan (itinerary) activity remember the expense it created, so the
-- Plan can show a "logged" indicator and clear it when the expense is deleted.
--
-- ON DELETE SET NULL: deleting the expense automatically clears the pointer
-- (the app also clears it explicitly as a belt-and-suspenders).
--
-- Run once in the Supabase SQL editor. Safe to re-run (IF NOT EXISTS).

alter table itinerary_items
  add column if not exists linked_expense_id uuid
  references expenses(id) on delete set null;

-- Documents already have linked_expense_id. If for any reason its FK is not
-- ON DELETE SET NULL, this makes deletes clear the pointer instead of erroring.
-- (No-op if the constraint is already correct.)
--   alter table documents
--     drop constraint if exists documents_linked_expense_id_fkey,
--     add constraint documents_linked_expense_id_fkey
--       foreign key (linked_expense_id) references expenses(id) on delete set null;
