-- ============================================================
-- Phase 6 — Trip cover photos
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run.
-- ============================================================

-- Each trip can optionally have a cover photo shown on the trip card
-- and inside the trip hub hero. We store both:
--   cover_path — Supabase Storage path (used for revoke + delete)
--   cover_url  — cached public URL (single column read on the card)
-- Reuses the existing 'documents' bucket with path '{tripId}/cover.{ext}'
-- so bucket RLS (member-of-trip via storage.foldername(name)[1]) keeps
-- working without new storage policies.
alter table public.trips
  add column if not exists cover_path text,
  add column if not exists cover_url  text;
