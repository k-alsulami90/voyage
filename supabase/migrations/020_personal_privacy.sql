-- 020 — Personal documents & personal expenses are private
--
-- Rules (enforced HERE, in the database — not just hidden in the UI):
--   * A document with owner_user_id set is visible ONLY to that person.
--     Each traveler adds their own boarding pass / ticket / visa.
--     owner_user_id null = shared with the whole trip.
--   * An expense with is_personal = true is visible ONLY to whoever logged
--     it (created_by). It never counts in the group's numbers.
--   * Files in the private `documents` bucket follow the same rule, so a
--     personal file can't be listed or signed by another member either.
--
-- Safe to re-run.

-- ── 1. Personal expenses flag ─────────────────────────────────────────
alter table public.expenses
  add column if not exists is_personal boolean not null default false;

-- ── 2. documents: replace every policy with owner-aware ones ──────────
-- (Dropping all existing policies on the table so no older permissive
--  policy — e.g. an editor "for all" policy, which also grants SELECT —
--  can keep exposing personal documents.)
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'documents' loop
    execute format('drop policy %I on public.documents', p.policyname);
  end loop;
end $$;

create policy "documents: read shared or own"
  on public.documents for select
  using (
    exists (select 1 from public.trip_members tm
            where tm.trip_id = documents.trip_id and tm.user_id = auth.uid())
    and (owner_user_id is null or owner_user_id = auth.uid())
  );

-- Shared docs: Admin/Editor. Own personal docs: any member (Viewers too —
-- everyone adds their own boarding pass).
create policy "documents: insert"
  on public.documents for insert
  with check (
    (owner_user_id is null and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or
    (owner_user_id = auth.uid() and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()))
  );

create policy "documents: update"
  on public.documents for update
  using (
    (owner_user_id is null and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or owner_user_id = auth.uid()
  )
  with check (
    (owner_user_id is null and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or (owner_user_id = auth.uid() and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()))
  );

create policy "documents: delete"
  on public.documents for delete
  using (
    (owner_user_id is null and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = documents.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or owner_user_id = auth.uid()
  );

-- ── 3. expenses: same treatment ───────────────────────────────────────
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'expenses' loop
    execute format('drop policy %I on public.expenses', p.policyname);
  end loop;
end $$;

create policy "expenses: read group or own personal"
  on public.expenses for select
  using (
    exists (select 1 from public.trip_members tm
            where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid())
    and (not is_personal or created_by = auth.uid())
  );

create policy "expenses: insert"
  on public.expenses for insert
  with check (
    (not is_personal and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or
    (is_personal and created_by = auth.uid() and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid()))
  );

create policy "expenses: update"
  on public.expenses for update
  using (
    (not is_personal and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or (is_personal and created_by = auth.uid())
  )
  with check (
    (not is_personal and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or (is_personal and created_by = auth.uid())
  );

create policy "expenses: delete"
  on public.expenses for delete
  using (
    (not is_personal and exists (
       select 1 from public.trip_members tm
       where tm.trip_id = expenses.trip_id and tm.user_id = auth.uid()
         and tm.role in ('Admin', 'Editor')))
    or (is_personal and created_by = auth.uid())
  );

-- ── 4. Storage: personal files are readable only by their owner ───────
-- Runs as definer so it can see rows the caller's RLS hides (that's the
-- point: "is this path someone ELSE's private file?").
create or replace function public.is_others_private_file(object_name text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
      select 1 from public.documents d
      where d.owner_user_id is not null
        and d.owner_user_id <> auth.uid()
        and object_name in (d.file_path, d.secondary_file_path, d.cover_path)
    )
    or exists (
      select 1 from public.expenses e
      where e.is_personal
        and e.created_by <> auth.uid()
        and e.receipt_path = object_name
    );
$$;
revoke all on function public.is_others_private_file(text) from public;
grant execute on function public.is_others_private_file(text) to authenticated;

drop policy if exists "documents bucket: member read" on storage.objects;
create policy "documents bucket: member read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = (storage.foldername(name))[1]
        and tm.user_id = auth.uid()
    )
    and not public.is_others_private_file(name)
  );
