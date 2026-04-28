-- Newsletter subscribers from footer form.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

comment on table public.newsletter_subscribers is 'Newsletter signups collected from storefront footer.';
