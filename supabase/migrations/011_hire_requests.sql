-- Hire-a-developer leads submitted from the public /hire page.
create table if not exists public.hire_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null,
  company text not null default '',
  project_type text not null default 'other',
  description text not null,
  goals text not null default '',
  tech_stack text not null default '',
  budget_range text not null default 'discuss',
  timeline text not null default 'flexible',
  start_date text not null default '',
  reference_links text not null default '',
  nda_required boolean not null default false,
  contact_method text not null default 'email',
  is_handled boolean not null default false,
  admin_notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists hire_requests_created_at_idx
  on public.hire_requests (created_at desc);
create index if not exists hire_requests_is_handled_idx
  on public.hire_requests (is_handled, created_at desc);

alter table public.hire_requests enable row level security;

comment on table public.hire_requests is
  'Hire-a-developer enquiries submitted from the public /hire page; admin manages from /admin/hire.';
