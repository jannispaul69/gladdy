-- ============================================================================
-- GLADDY – Supabase Schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- Table: bookings  — incoming booking requests from the website form
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  organizer   text,
  event_date  date not null,
  event_type  text not null,
  guest_count integer,
  location    text not null,
  message     text,
  email       text not null,
  phone       text,
  status      text not null default 'new'
              check (status in ('new', 'contacted', 'confirmed', 'declined'))
);

alter table public.bookings enable row level security;

-- The public website (anon key) may only INSERT new requests.
-- Reading is restricted to the service role / authenticated dashboard users.
drop policy if exists "anon can insert bookings" on public.bookings;
create policy "anon can insert bookings"
  on public.bookings
  for insert
  to anon
  with check (true);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);


-- ──────────────────────────────────────────────────────────────────────────
-- Table: events  — upcoming (and past) live appearances
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  date        date not null,
  city        text not null,
  venue       text not null,
  ticket_url  text,
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'soldout', 'cancelled'))
);

alter table public.events enable row level security;

-- Events are public — anyone may read them.
drop policy if exists "anon can read events" on public.events;
create policy "anon can read events"
  on public.events
  for select
  to anon
  using (true);

create index if not exists events_date_idx on public.events (date);


-- ──────────────────────────────────────────────────────────────────────────
-- Optional: seed a few example events (remove or edit as needed)
-- ──────────────────────────────────────────────────────────────────────────
-- insert into public.events (date, city, venue, ticket_url, status) values
--   ('2026-06-20', 'Mülheim a. d. Ruhr', 'Ruhrpott Strandbar', 'https://tickets.example.com/ruhrpott', 'scheduled'),
--   ('2026-07-11', 'Hamburg',            'Hafen-Festival',      'https://tickets.example.com/hamburg',  'soldout'),
--   ('2026-08-30', 'Köln',               'Open-Air am Rhein',   'https://tickets.example.com/koeln',    'scheduled');
