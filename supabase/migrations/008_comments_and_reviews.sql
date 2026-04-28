-- Product comments + site reviews with admin reply/moderation.
create table if not exists public.product_comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  email text not null,
  message text not null,
  admin_reply text,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_reviews (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  rating int not null check (rating between 1 and 5),
  message text not null,
  admin_reply text,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_comments_product_id_idx on public.product_comments (product_id, created_at desc);
create index if not exists site_reviews_created_at_idx on public.site_reviews (created_at desc);

alter table public.product_comments enable row level security;
alter table public.site_reviews enable row level security;

comment on table public.product_comments is 'Storefront product comments submitted by users with optional admin replies.';
comment on table public.site_reviews is 'Storefront website reviews (1-5 stars) with optional admin replies.';
