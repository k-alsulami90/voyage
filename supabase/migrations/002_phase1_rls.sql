-- ============================================================
-- Phase 1 — RLS hardening
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to run multiple times (uses DROP IF EXISTS + recreate).
-- ============================================================

-- ── 1.1  Storage INSERT must check trip membership ───────────
-- Files are uploaded to path "{tripId}/{docId}.{ext}".
-- The first folder of the path is the tripId; the uploader must be Admin or Editor on it.

drop policy if exists "documents bucket: editor upload" on storage.objects;

create policy "documents bucket: editor upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = (storage.foldername(name))[1]
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  );

-- Same for UPDATE (re-upload / replace existing file)
drop policy if exists "documents bucket: editor update" on storage.objects;

create policy "documents bucket: editor update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = (storage.foldername(name))[1]
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  )
  with check (
    bucket_id = 'documents'
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = (storage.foldername(name))[1]
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  );

-- ── 1.2  Audit log: trip members can insert their own actions ─

drop policy if exists "audit_log: member insert" on public.audit_log;

create policy "audit_log: member insert"
  on public.audit_log for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = audit_log.trip_id
        and tm.user_id = auth.uid()
    )
  );
