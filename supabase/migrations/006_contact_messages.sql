-- Contact messages submitted from /contact form.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

comment on table public.contact_messages is 'Inbound contact form submissions from the storefront.';
