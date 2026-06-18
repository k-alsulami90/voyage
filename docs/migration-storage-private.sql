-- ============================================================
-- Security hardening — Wave 2 (private documents bucket)
-- Run once in the Supabase SQL editor, AFTER flipping the
-- `documents` bucket to private (Dashboard → Storage → documents
-- → uncheck "Public"). Safe to re-run.
--
-- Finding 1 (HIGH): the `documents` bucket was public, so every
-- uploaded PDF, passport, visa, boarding pass and receipt was
-- readable by anyone who had (or guessed) the URL — no login.
--
-- With the bucket private, files are reachable only via short-lived
-- SIGNED urls, which the client now generates (see loadDocuments /
-- loadExpenses). createSignedUrl checks that the requester has SELECT
-- on the object, so we add a membership-gated SELECT policy below.
-- Without it, signing would fail and files wouldn't load.
--
-- The matching INSERT/UPDATE policies already exist (migration 002).
-- The `covers` bucket is separate and stays public — cover thumbnails
-- aren't sensitive.
-- ============================================================

-- Trip members may READ files under their trip's folder. The path is
-- "{tripId}/...", so the first segment is the trip id — same convention
-- the existing upload policy checks. Any role (incl. Viewer) can read.
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
  );

-- Admins/Editors may DELETE their trip's files (remove a doc's file,
-- delete a receipt, replace a cover). Without this, the app's
-- storage.remove() calls silently no-op.
drop policy if exists "documents bucket: editor delete" on storage.objects;
create policy "documents bucket: editor delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.trip_members tm
      where tm.trip_id = (storage.foldername(name))[1]
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  );
