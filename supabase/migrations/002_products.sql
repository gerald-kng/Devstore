-- Catalog: each product has its own price and storage paths for app + install video.
-- Optional demo_video_url: HTTPS URL for an embedded demo (e.g. YouTube embed link).

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null default '',
  price_amount numeric(12, 2) not null,
  price_currency text not null default 'usd',
  app_storage_path text not null,
  video_storage_path text not null,
  demo_video_url text,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx
  on public.products (is_active, sort_order);

alter table public.products enable row level security;

create policy "Public can view active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.products (
  slug,
  name,
  summary,
  price_amount,
  price_currency,
  app_storage_path,
  video_storage_path,
  demo_video_url,
  features,
  sort_order
) values
  (
    'orion-app',
    'Orion toolkit',
    'Signed macOS build, checksums, and a guided installation video.',
    29.00,
    'usd',
    'apps/orion-release.zip',
    'videos/orion-install.mp4',
    null,
    '[
      {"title": "Signed binaries", "body": "Notarized build plus release notes."},
      {"title": "Install video", "body": "Step-by-step setup walkthrough."},
      {"title": "Server-side delivery", "body": "Links minted only after payment is verified."}
    ]'::jsonb,
    0
  ),
  (
    'orion-desk',
    'Orion Desk',
    'Desktop automation suite with matching install tutorial.',
    49.00,
    'usd',
    'apps/orion-desk.zip',
    'videos/orion-desk-install.mp4',
    null,
    '[
      {"title": "Desk workflows", "body": "Automations and shortcuts for daily ops."},
      {"title": "Desk install video", "body": "Product-specific setup — different from Orion toolkit."},
      {"title": "Crypto checkout", "body": "Same secure NOWPayments flow per product."}
    ]'::jsonb,
    1
  ),
  (
    'mini-tools',
    'Mini tools pack',
    'Lightweight utilities bundle at a lower price point.',
    9.00,
    'usd',
    'apps/mini-tools.zip',
    'videos/mini-tools-walkthrough.mp4',
    null,
    '[
      {"title": "Small footprint", "body": "Quick download, ideal for edge cases."},
      {"title": "Walkthrough video", "body": "Separate video asset for this SKU."}
    ]'::jsonb,
    2
  )
on conflict (slug) do nothing;

-- Point legacy text product_id values at catalog rows by slug, then switch to UUID FK.
alter table public.orders
  add column if not exists product_id_uuid uuid references public.products (id);

update public.orders o
set product_id_uuid = p.id
from public.products p
where o.product_id_uuid is null
  and p.slug = o.product_id::text;

update public.orders o
set product_id_uuid = (
    select id from public.products where slug = 'orion-app' limit 1
  )
where o.product_id_uuid is null;

alter table public.orders drop column if exists product_id;

alter table public.orders rename column product_id_uuid to product_id;

alter table public.orders
  alter column product_id set not null;

create index if not exists orders_product_id_idx on public.orders (product_id);

comment on table public.products is 'Store catalog; edit rows for real prices, paths, and demo URLs. Active products are readable by anon for optional future client-side catalog.';
