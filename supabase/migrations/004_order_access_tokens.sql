create extension if not exists "pgcrypto";

create table if not exists public.order_access_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists order_access_tokens_order_id_idx
  on public.order_access_tokens (order_id);

create index if not exists order_access_tokens_expires_idx
  on public.order_access_tokens (expires_at);

alter table public.order_access_tokens enable row level security;

comment on table public.order_access_tokens is 'Long-lived purchase access tokens; stores only SHA-256 hashes, never raw tokens.';
