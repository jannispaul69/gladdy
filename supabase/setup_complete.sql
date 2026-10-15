-- ============================================================
-- GLADDY – Vollständiges Datenbank-Setup
-- Legt alle Tabellen, Funktionen, Storage und RLS-Regeln an,
-- die der Code nutzt. Ersetzt schema.sql + migration_products_v2.sql.
-- Kann gefahrlos mehrfach ausgeführt werden.
--
-- Zugriff: Der Admin-Bereich und alle Server-Routen nutzen den
-- service_role-Key (umgeht RLS). Der anon-Key darf nur das, was
-- die öffentliche Website braucht.
-- ============================================================

-- ── bookings ─────────────────────────────────────────────────
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz,
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
  notes               text,
  status              text not null default 'neu'
    check (status in ('neu', 'in_bearbeitung', 'bestaetigt', 'abgelehnt', 'abgeschlossen'))
);
create index if not exists bookings_datum_idx   on public.bookings (veranstaltungsdatum);
create index if not exists bookings_created_idx on public.bookings (created_at desc);
alter table public.bookings enable row level security;
drop policy if exists "anon insert bookings" on public.bookings;
create policy "anon insert bookings" on public.bookings for insert to anon with check (true);

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
drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events for select to anon using (true);

-- ── songs ────────────────────────────────────────────────────
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
drop policy if exists "public read songs" on public.songs;
create policy "public read songs" on public.songs for select to anon using (true);

-- ── products ─────────────────────────────────────────────────
create table if not exists public.products (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  title                  text not null,
  description            text,
  price_cents            integer not null default 0,
  compare_at_price_cents integer,
  category               text not null default 'other',
  image_url              text,
  images                 jsonb   not null default '[]',
  status                 text    not null default 'draft'
    check (status in ('active', 'draft', 'archived')),
  stock_quantity         integer not null default 0,
  sizes                  jsonb   not null default '[]',
  material               text,
  care_instructions      text,
  delivery_days_min      integer not null default 3,
  delivery_days_max      integer not null default 7,
  weight_grams           integer,
  sku                    text,
  sort_order             integer not null default 0,
  featured               boolean not null default false,
  tags                   text[]  not null default '{}',
  updated_at             timestamptz not null default now()
);
create index if not exists products_sort_idx     on public.products (sort_order asc);
create index if not exists products_featured_idx on public.products (featured) where featured = true;
alter table public.products enable row level security;
drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select to anon using (status = 'active');

-- ── orders ───────────────────────────────────────────────────
create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz,
  customer_email            text not null,
  customer_name             text not null,
  total_cents               integer not null default 0,
  status                    text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'refunded', 'cancelled')),
  stripe_payment_intent_id  text,
  items                     jsonb not null default '[]',
  shipping_address          jsonb,
  shipping_rate             text,
  shipping_carrier          text,
  tracking_number           text,
  notes                     text,
  source                    text not null default 'shop',
  archived                  boolean not null default false,
  invoice_number            text unique,
  invoice_url               text,
  invoice_sent_at           timestamptz,
  packing_slip_url          text
);
create index if not exists orders_created_idx on public.orders (created_at desc);
-- Idempotenz: eine Zahlung erzeugt höchstens eine Bestellung
create unique index if not exists orders_payment_unique
  on public.orders (stripe_payment_intent_id) where stripe_payment_intent_id is not null;
alter table public.orders enable row level security;

-- Fortlaufende Rechnungsnummern für Shop-Bestellungen, z. B. SHOP-2026-0001
create sequence if not exists public.order_invoice_seq;
create or replace function public.next_invoice_number()
returns text
language sql
security definer
set search_path = public
as $$
  select 'SHOP-' || to_char(now() at time zone 'Europe/Berlin', 'YYYY') || '-'
         || lpad(nextval('public.order_invoice_seq')::text, 4, '0');
$$;
revoke all on function public.next_invoice_number() from public, anon, authenticated;
grant execute on function public.next_invoice_number() to service_role;

-- ── documents (Angebote / Rechnungen an Veranstalter) ────────
create table if not exists public.documents (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz,
  type                  text not null
    check (type in ('angebot', 'abschlagsrechnung', 'schlussrechnung', 'gutschrift')),
  number                text unique,
  token                 text not null unique default encode(extensions.gen_random_bytes(24), 'hex'),
  booking_id            uuid references public.bookings (id) on delete set null,
  customer_name         text not null default '',
  customer_email        text not null default '',
  customer_company      text,
  customer_address      text,
  line_items            jsonb   not null default '[]',
  tax_rate              numeric not null default 0,
  subtotal_cents        integer not null default 0,
  tax_cents             integer not null default 0,
  total_cents           integer not null default 0,
  paid_deposits_cents   integer not null default 0,
  issued_date           date,
  valid_until           date,
  due_date              date,
  notes                 text,
  status                text not null default 'draft'
    check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined', 'paid', 'cancelled')),
  sent_at               timestamptz,
  paid_at               timestamptz,
  customer_comment      text,
  customer_responded_at timestamptz
);
create index if not exists documents_created_idx on public.documents (created_at desc);
create index if not exists documents_booking_idx on public.documents (booking_id);
alter table public.documents enable row level security;

-- Dokumentnummer automatisch je Typ, z. B. AN-2026-0001 / RE-2026-0001
create sequence if not exists public.document_angebot_seq;
create sequence if not exists public.document_rechnung_seq;
create sequence if not exists public.document_gutschrift_seq;
create or replace function public.set_document_number()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  prefix text;
  n      bigint;
begin
  if new.number is not null then
    return new;
  end if;
  if new.type = 'angebot' then
    prefix := 'AN'; n := nextval('public.document_angebot_seq');
  elsif new.type = 'gutschrift' then
    prefix := 'GS'; n := nextval('public.document_gutschrift_seq');
  else
    prefix := 'RE'; n := nextval('public.document_rechnung_seq');
  end if;
  new.number := prefix || '-' || to_char(now() at time zone 'Europe/Berlin', 'YYYY') || '-' || lpad(n::text, 4, '0');
  return new;
end;
$$;
drop trigger if exists documents_set_number on public.documents;
create trigger documents_set_number
  before insert on public.documents
  for each row execute function public.set_document_number();

-- ── settings (Shop-Schalter, Firmendaten für Rechnungen) ─────
create table if not exists public.settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

insert into public.settings (key, value) values
  ('shop_enabled',     'true'),
  ('test_mode',        'false'),
  ('company_name',     'Schwietz Holding UG (haftungsbeschränkt)'),
  ('company_email',    'info@gladdy-offiziell.de'),
  ('company_address',  'Grambkermoorer Landstraße 22G, 28719 Bremen'),
  ('company_iban',     ''),
  ('company_bic',      ''),
  ('default_tax_rate', '19')
on conflict (key) do nothing;

-- ── shop_waitlist ────────────────────────────────────────────
create table if not exists public.shop_waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null,
  source     text not null default 'website',
  constraint shop_waitlist_email_unique unique (email)
);
create index if not exists waitlist_created_idx on public.shop_waitlist (created_at desc);
alter table public.shop_waitlist enable row level security;
drop policy if exists "anon insert waitlist" on public.shop_waitlist;
create policy "anon insert waitlist" on public.shop_waitlist for insert to anon with check (true);

-- ── fan_emails (Fan-Community Newsletter) ─────────────────────
create table if not exists public.fan_emails (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null unique,
  source     text not null default 'website'
);
alter table public.fan_emails enable row level security;

-- ── Storage: öffentlicher Bucket für Bilder, Pressekit, PDFs ─
insert into storage.buckets (id, name, public)
values ('gladdy-uploads', 'gladdy-uploads', true)
on conflict (id) do update set public = true;
