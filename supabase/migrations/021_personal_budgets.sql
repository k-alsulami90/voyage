-- 021 — Personal budget limit per trip ("ميزانيتي")
--
-- Each traveler can set a private cap for their own personal spending on a
-- trip (e.g. 2,000 for shopping). Only the owner can read or change it.
-- Safe to re-run.

create table if not exists public.personal_budgets (
  trip_id     text          not null references public.trips(id) on delete cascade,
  user_id     uuid          not null default auth.uid() references public.profiles(id) on delete cascade,
  amount_usd  numeric(12,2) not null check (amount_usd >= 0),
  updated_at  timestamptz   not null default now(),
  primary key (trip_id, user_id)
);

alter table public.personal_budgets enable row level security;

drop policy if exists "personal_budgets: own read"  on public.personal_budgets;
drop policy if exists "personal_budgets: own write" on public.personal_budgets;

create policy "personal_budgets: own read"
  on public.personal_budgets for select
  using (user_id = auth.uid());

create policy "personal_budgets: own write"
  on public.personal_budgets for all
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.trip_members tm
                where tm.trip_id = personal_budgets.trip_id and tm.user_id = auth.uid())
  );
