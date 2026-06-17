-- ============================================================
-- GLADDY – Migration: products v2
-- Run once in Supabase SQL Editor
-- ============================================================

alter table public.products
  add column if not exists images                 jsonb    not null default '[]',
  add column if not exists compare_at_price_cents integer,
  add column if not exists material               text,
  add column if not exists care_instructions      text,
  add column if not exists delivery_days_min      integer  not null default 3,
  add column if not exists delivery_days_max      integer  not null default 7,
  add column if not exists weight_grams           integer,
  add column if not exists sku                    text,
  add column if not exists sort_order             integer  not null default 0,
  add column if not exists featured               boolean  not null default false,
  add column if not exists sizes                  jsonb    not null default '[]',
  add column if not exists tags                   text[]   not null default '{}';

create index if not exists products_sort_idx     on public.products (sort_order asc);
create index if not exists products_featured_idx on public.products (featured) where featured = true;

create table if not exists public.shop_waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null,
  source     text not null default 'website',
  constraint shop_waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_idx on public.shop_waitlist (created_at desc);
alter table public.shop_waitlist enable row level security;
