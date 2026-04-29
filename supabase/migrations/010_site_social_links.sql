-- Social profile links managed from the admin panel (replaces NEXT_PUBLIC_SOCIAL_* env vars).
create table if not exists public.site_social_links (
  key text primary key,
  href text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_social_links enable row level security;

create policy "Public read active site social links"
  on public.site_social_links
  for select
  to anon, authenticated
  using (is_active = true and length(btrim(href)) > 0);

comment on table public.site_social_links is
  'Social profile links rendered in the storefront footer. Managed via Admin → Social links.';
