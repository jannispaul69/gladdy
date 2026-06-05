-- ============================================================
-- GLADDY – Supabase Schema
-- Run once in the Supabase SQL Editor or via CLI
-- ============================================================

-- ── bookings ─────────────────────────────────────────────────
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  anrede              text not null,
  vorname             text not null,
  nachname            text not null,
  email               text not null,
  mobil               text not null,
  strasse             text not null,
  plz                 text not null,
  wohnort             text not null,
  veranstaltungsname  text not null,
  veranstaltungsort   text not null,
  veranstaltungsdatum date not null,
  besucherzahl        integer,
  stagetime           text not null,
  nachricht           text,
  status              text not null default 'neu'
    check (status in ('neu', 'in_bearbeitung', 'bestaetigt', 'abgelehnt', 'abgeschlossen'))
);

create index if not exists bookings_datum_idx   on public.bookings (veranstaltungsdatum);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

alter table public.bookings enable row level security;

create policy "anon insert bookings"
  on public.bookings for insert to anon with check (true);

create policy "auth read bookings"
  on public.bookings for select to authenticated using (true);

create policy "auth update bookings"
  on public.bookings for update to authenticated using (true) with check (true);


-- ── events ───────────────────────────────────────────────────
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

create index if not exists events_date_idx on public.events (date asc);

alter table public.events enable row level security;

create policy "public read events"
  on public.events for select to anon using (true);

create policy "auth manage events"
  on public.events for all to authenticated using (true) with check (true);


-- ── songs ─────────────────────────────────────────────────────
create table if not exists public.songs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  title         text not null,
  feat          text,
  cover_url     text,
  spotify_id    text,
  youtube_id    text,
  release_date  date,
  sort_order    integer not null default 0,
  is_featured   boolean not null default false
);

create index if not exists songs_sort_idx on public.songs (sort_order asc);

alter table public.songs enable row level security;

create policy "public read songs"
  on public.songs for select to anon using (true);

create policy "auth manage songs"
  on public.songs for all to authenticated using (true) with check (true);


-- ── products ──────────────────────────────────────────────────
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  title           text not null,
  description     text,
  price_cents     integer not null default 0,
  category        text not null default 'other',
  image_url       text,
  status          text not null default 'draft'
    check (status in ('active', 'draft', 'archived')),
  stock_quantity  integer not null default 0
);

alter table public.products enable row level security;

create policy "public read active products"
  on public.products for select to anon using (status = 'active');

create policy "auth manage products"
  on public.products for all to authenticated using (true) with check (true);


-- ── orders ────────────────────────────────────────────────────
create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  customer_email            text not null,
  customer_name             text not null,
  total_cents               integer not null default 0,
  status                    text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'refunded', 'cancelled')),
  stripe_payment_intent_id  text,
  items                     jsonb not null default '[]'
);

create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_stripe_idx  on public.orders (stripe_payment_intent_id);

alter table public.orders enable row level security;

create policy "auth manage orders"
  on public.orders for all to authenticated using (true) with check (true);
