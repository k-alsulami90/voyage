-- 022 — Two more expense categories: shopping and spa & care.
-- ('culture' stays as-is in the database; the app now shows it as
--  "فعاليات وترفيه" / activities & fun, so old expenses move over by
--  themselves.)  Safe to re-run.
alter type public.expense_category add value if not exists 'shopping';
alter type public.expense_category add value if not exists 'wellness';
