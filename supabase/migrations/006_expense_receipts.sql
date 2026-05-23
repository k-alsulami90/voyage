-- ============================================================
-- Phase 3 — Receipt photos per expense
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- Each expense can optionally attach a receipt photo. We store both:
--   receipt_path — Supabase Storage path (used to construct signed/public URL)
--   receipt_url  — cached public URL (faster reads, single DB column)
-- Reuses the existing 'documents' bucket with prefix '{tripId}/receipts/...'
-- so the bucket's RLS (member-of-trip check via storage.foldername(name)[1])
-- still works without additional storage policies.
alter table public.expenses
  add column if not exists receipt_path text,
  add column if not exists receipt_url  text;
