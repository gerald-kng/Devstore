-- Admin catalog: categories, long descriptions, main image, image gallery, structured videos, CMS pages.
-- Storage buckets: create in Dashboard if insert fails; product-images = public; downloads stays private.

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  is_published boolean not null default false,
  nav_label text,
  show_in_header boolean not null default false,
  show_in_footer boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_videos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  kind text not null check (kind in ('demo', 'install', 'other')),
  title text not null default '',
  storage_path text,
  external_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Products: link to category + rich text + cover image
alter table public.products
  add column if not exists category_id uuid references public.product_categories (id);

alter table public.products
  add column if not exists description text not null default '';

alter table public.products
  add column if not exists main_image_path text;

create index if not exists products_category_id_idx on public.products (category_id);

-- Seed a default category and attach existing products
insert into public.product_categories (name, slug, description, sort_order, is_active)
values ('General', 'general', 'All products', 0, true)
on conflict (slug) do nothing;

update public.products p
set category_id = coalesce(
  p.category_id,
  (select id from public.product_categories where slug = 'general' limit 1)
);

-- Promote old demo + install into product_videos when rows do not already exist
insert into public.product_videos (product_id, kind, title, storage_path, external_url, sort_order)
select
  p.id,
  'demo',
  'Demo',
  null,
  nullif(trim(p.demo_video_url), ''),
  0
from public.products p
where not exists (
  select 1 from public.product_videos v where v.product_id = p.id and v.kind = 'demo'
)
and p.demo_video_url is not null
and btrim(p.demo_video_url) <> '';

insert into public.product_videos (product_id, kind, title, storage_path, external_url, sort_order)
select
  p.id,
  'install',
  'Install walkthrough',
  p.video_storage_path,
  null,
  0
from public.products p
where not exists (
  select 1 from public.product_videos v where v.product_id = p.id and v.kind = 'install'
)
and p.video_storage_path is not null
and btrim(p.video_storage_path) <> '';

-- RLS: lock down; app uses service role for storefront where needed, admin via server
alter table public.product_categories enable row level security;
alter table public.static_pages enable row level security;
alter table public.product_images enable row level security;
alter table public.product_videos enable row level security;

-- Public read: active categories, published static pages, product child rows (optional via API only with service)
create policy "Public read active categories"
  on public.product_categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Public read product images for storefront"
  on public.product_images
  for select
  to anon, authenticated
  using (true);

create policy "Public read product videos for storefront"
  on public.product_videos
  for select
  to anon, authenticated
  using (true);

create policy "Public read published pages"
  on public.static_pages
  for select
  to anon, authenticated
  using (is_published = true);

-- Optional sample CMS page
insert into public.static_pages (slug, title, body, is_published, nav_label, show_in_header, show_in_footer, sort_order)
values
  ('about', 'About', 'Edit this in **Admin → Site pages** — supports plain text; add Markdown in the app later if you like.', true, 'About', true, true, 0)
on conflict (slug) do nothing;

-- Storage: public image bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 52428800, null)
on conflict (id) do update
set public = true;

-- Anyone can read files in public bucket; uploads use service role from admin API
create policy "Public read product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

comment on table public.product_categories is 'Storefront categories; used for grouping products.';
comment on table public.product_images is 'Product gallery; paths live in the product-images bucket unless using external URL elsewhere.';
comment on table public.product_videos is 'demo: external or storage; install: post-purchase video path in private downloads bucket.';
