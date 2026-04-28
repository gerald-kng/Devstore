create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'expired')),
  payment_provider text not null default 'nowpayments',
  provider_payment_id text,
  invoice_id text,
  amount numeric(12, 2) not null,
  currency text not null default 'usd',
  product_id text not null default 'orion-app',
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_invoice_id_idx on public.orders (invoice_id);
create index if not exists orders_provider_payment_id_idx
  on public.orders (provider_payment_id);

alter table public.orders enable row level security;

comment on table public.orders is 'Orders table: RLS enabled with no policies so anon/authenticated cannot read or write. Use the service role from server-side API routes only.';
