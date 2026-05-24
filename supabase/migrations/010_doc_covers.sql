-- ============================================================
-- Phase 7 — Per-document cover photo
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- Each document (flight, hotel booking, visa, ticket, etc.) can carry
-- a small representative photo — airline logo, hotel front, ticket
-- artwork — shown as the thumbnail in the list/grid in place of the
-- generic kind-icon.
--
--   cover_path — Supabase Storage path
--   cover_url  — cached public URL (single column read on the row)
--
-- Reuses the 'documents' bucket at {tripId}/doc-covers/{docId}.{ext}
-- so RLS (member-of-trip via storage.foldername(name)[1]) keeps
-- working without new policies.
alter table public.documents
  add column if not exists cover_path text,
  add column if not exists cover_url  text;
