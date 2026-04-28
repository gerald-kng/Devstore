-- Product-specific ratings/reviews with optional admin replies.
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  email text not null,
  rating int not null check (rating between 1 and 5),
  message text not null,
  admin_reply text,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx
  on public.product_reviews (product_id, created_at desc);

alter table public.product_reviews enable row level security;

comment on table public.product_reviews is 'Per-product public reviews (1-5 stars) with optional admin replies.';
