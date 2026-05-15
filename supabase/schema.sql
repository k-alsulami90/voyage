-- ============================================================
-- Voyage Travel App — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────
create type trip_status      as enum ('upcoming', 'active', 'past');
create type member_role      as enum ('Admin', 'Editor', 'Viewer');
create type expense_category as enum ('lodging', 'food', 'transit', 'culture', 'misc');
create type doc_category     as enum ('flights', 'lodging', 'visas', 'transport');
create type doc_kind         as enum ('pdf', 'img');
create type doc_tint         as enum ('indigo', 'clay', 'moss', 'honey');
create type audit_action     as enum ('added', 'edited', 'uploaded', 'invited', 'removed');

-- ── profiles (extends Supabase auth.users) ──────────────────
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text        not null,
  initials        text        not null,          -- e.g. "MK"
  avatar_hue      integer     not null default 35, -- oklch hue for generated avatar
  home_base       text,                          -- "Amsterdam"
  default_currency char(3)    not null default 'USD',
  lang            char(2)     not null default 'en',
  dark_mode       boolean     not null default false,
  created_at      timestamptz not null default now()
);

-- ── trips ────────────────────────────────────────────────────
create table trips (
  id                  text        primary key,  -- slug, e.g. "kyoto-26"
  owner_id            uuid        not null references profiles(id) on delete cascade,
  title               text        not null,
  subtitle            text,
  start_date          date        not null,
  end_date            date        not null,
  country_code        char(2),                  -- ISO 3166-1 alpha-2
  home_currency       char(3)     not null default 'USD',
  local_currency      char(3),                  -- e.g. "JPY"
  fx_rate             numeric(10,4),            -- 1 home = fx_rate local
  budget_planned_usd  numeric(10,2),
  cover_style         text        not null default 'kyoto',
  status              trip_status not null default 'upcoming',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── trip_members (crew) ──────────────────────────────────────
create table trip_members (
  id         uuid        primary key default uuid_generate_v4(),
  trip_id    text        not null references trips(id) on delete cascade,
  user_id    uuid        not null references profiles(id) on delete cascade,
  role       member_role not null default 'Viewer',
  joined_at  timestamptz not null default now(),
  unique (trip_id, user_id)
);

-- ── expenses ─────────────────────────────────────────────────
create table expenses (
  id             uuid             primary key default uuid_generate_v4(),
  trip_id        text             not null references trips(id) on delete cascade,
  created_by     uuid             not null references profiles(id),
  title          text             not null,
  category       expense_category not null default 'misc',
  amount_local   numeric(12,2),             -- in local currency (e.g. JPY)
  amount_usd     numeric(10,2)    not null,
  local_currency char(3),
  note           text,
  created_at     timestamptz      not null default now()
);

-- ── documents (Vault) ────────────────────────────────────────
create table documents (
  id            uuid         primary key default uuid_generate_v4(),
  trip_id       text         not null references trips(id) on delete cascade,
  uploaded_by   uuid         not null references profiles(id),
  title         text         not null,
  subtitle      text,                       -- "Apr 03 · 11:40", confirmation #, etc.
  category      doc_category not null,
  kind          doc_kind     not null,
  file_path     text,                       -- Supabase Storage path (nullable = link-only doc)
  file_size_bytes bigint,
  link_url      text,                       -- optional external URL
  link_label    text,                       -- "Google Maps", "Online check-in"
  tint          doc_tint     not null default 'clay',
  created_at    timestamptz  not null default now()
);

-- ── document_photos ──────────────────────────────────────────
create table document_photos (
  id            uuid        primary key default uuid_generate_v4(),
  document_id   uuid        not null references documents(id) on delete cascade,
  storage_path  text        not null,       -- Supabase Storage path
  created_at    timestamptz not null default now()
);

-- ── audit_log ────────────────────────────────────────────────
create table audit_log (
  id         uuid         primary key default uuid_generate_v4(),
  trip_id    text         not null references trips(id) on delete cascade,
  user_id    uuid         not null references profiles(id),
  action     audit_action not null,
  target     text         not null,         -- human-readable description
  created_at timestamptz  not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index on trips        (owner_id);
create index on trips        (status);
create index on trip_members (trip_id);
create index on trip_members (user_id);
create index on expenses     (trip_id, created_at desc);
create index on expenses     (trip_id, category);
create index on documents    (trip_id, category);
create index on audit_log    (trip_id, created_at desc);

-- ── updated_at auto-trigger ──────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_updated_at
  before update on trips
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────
alter table profiles         enable row level security;
alter table trips            enable row level security;
alter table trip_members     enable row level security;
alter table expenses         enable row level security;
alter table documents        enable row level security;
alter table document_photos  enable row level security;
alter table audit_log        enable row level security;

-- profiles: users can only see and edit their own profile
create policy "profiles: own row"
  on profiles for all
  using  (id = auth.uid())
  with check (id = auth.uid());

-- trips: visible to owner + any trip_member
create policy "trips: member access"
  on trips for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from trip_members
      where trip_members.trip_id = trips.id
        and trip_members.user_id = auth.uid()
    )
  );

-- owner has full access (FOR ALL covers SELECT + INSERT + UPDATE + DELETE)
create policy "trips: owner write"
  on trips for all
  using  (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- trip_members: members can see the crew of their trips
create policy "trip_members: member read"
  on trip_members for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from trip_members tm2
      where tm2.trip_id = trip_members.trip_id
        and tm2.user_id = auth.uid()
    )
  );

-- Only trip Admins (or the owner) can add/remove members
create policy "trip_members: admin insert"
  on trip_members for insert
  with check (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
        and trips.owner_id = auth.uid()
    )
    or exists (
      select 1 from trip_members tm
      where tm.trip_id = trip_members.trip_id
        and tm.user_id = auth.uid()
        and tm.role = 'Admin'
    )
  );

create policy "trip_members: admin update"
  on trip_members for update
  using (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
        and trips.owner_id = auth.uid()
    )
    or exists (
      select 1 from trip_members tm
      where tm.trip_id = trip_members.trip_id
        and tm.user_id = auth.uid()
        and tm.role = 'Admin'
    )
  );

create policy "trip_members: admin delete"
  on trip_members for delete
  using (
    exists (
      select 1 from trips
      where trips.id = trip_members.trip_id
        and trips.owner_id = auth.uid()
    )
    or exists (
      select 1 from trip_members tm
      where tm.trip_id = trip_members.trip_id
        and tm.user_id = auth.uid()
        and tm.role = 'Admin'
    )
  );

-- expenses: readable by all trip members; writable by Admin/Editor
create policy "expenses: member read"
  on expenses for select
  using (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = expenses.trip_id
        and trip_members.user_id = auth.uid()
    )
  );

create policy "expenses: editor write"
  on expenses for all
  using (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = expenses.trip_id
        and trip_members.user_id = auth.uid()
        and trip_members.role in ('Admin', 'Editor')
    )
  )
  with check (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = expenses.trip_id
        and trip_members.user_id = auth.uid()
        and trip_members.role in ('Admin', 'Editor')
    )
  );

-- documents: same pattern as expenses
create policy "documents: member read"
  on documents for select
  using (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = documents.trip_id
        and trip_members.user_id = auth.uid()
    )
  );

create policy "documents: editor write"
  on documents for all
  using (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = documents.trip_id
        and trip_members.user_id = auth.uid()
        and trip_members.role in ('Admin', 'Editor')
    )
  )
  with check (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = documents.trip_id
        and trip_members.user_id = auth.uid()
        and trip_members.role in ('Admin', 'Editor')
    )
  );

-- document_photos: inherit from parent document's trip membership
create policy "document_photos: member read"
  on document_photos for select
  using (
    exists (
      select 1 from documents d
      join trip_members tm on tm.trip_id = d.trip_id
      where d.id = document_photos.document_id
        and tm.user_id = auth.uid()
    )
  );

create policy "document_photos: editor write"
  on document_photos for all
  using (
    exists (
      select 1 from documents d
      join trip_members tm on tm.trip_id = d.trip_id
      where d.id = document_photos.document_id
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  )
  with check (
    exists (
      select 1 from documents d
      join trip_members tm on tm.trip_id = d.trip_id
      where d.id = document_photos.document_id
        and tm.user_id = auth.uid()
        and tm.role in ('Admin', 'Editor')
    )
  );

-- audit_log: all trip members can read; system inserts only
create policy "audit_log: member read"
  on audit_log for select
  using (
    exists (
      select 1 from trip_members
      where trip_members.trip_id = audit_log.trip_id
        and trip_members.user_id = auth.uid()
    )
  );

-- ── Storage buckets ──────────────────────────────────────────
-- Run these separately in the Supabase Dashboard → Storage
-- or via the Storage API after schema is applied.
--
-- insert into storage.buckets (id, name, public) values
--   ('documents', 'documents', false),
--   ('photos',    'photos',    false);
