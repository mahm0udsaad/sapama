create extension if not exists pgcrypto with schema extensions;

create sequence if not exists public.quotation_number_seq
  as integer
  start with 1168
  increment by 1
  minvalue 1168;

create table if not exists public.app_users (
  id uuid primary key,
  username text not null,
  password_hash text not null,
  display_name text not null,
  role text not null check (role in ('admin', 'sales')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists app_users_username_lower_idx
  on public.app_users (lower(username));

create table if not exists public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  description text not null check (char_length(btrim(description)) between 2 and 500),
  origin text,
  unit_price numeric(14,2) not null check (unit_price >= 0),
  vat_rate smallint not null check (vat_rate in (0, 15)),
  image_data_url text,
  usage_count integer not null default 1 check (usage_count >= 0),
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists products_description_lower_idx
  on public.products (lower(btrim(description)));
create index if not exists products_usage_description_idx
  on public.products (usage_count desc, description);

create table if not exists public.customers (
  id uuid primary key,
  name text not null,
  address text not null default '',
  district text,
  street text,
  postal_code text,
  additional_number text,
  building_number text,
  commercial_registration text,
  tax_number text,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_name_idx on public.customers (name);

create table if not exists public.customer_contacts (
  id uuid primary key,
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  phone text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customer_contacts_customer_name_idx
  on public.customer_contacts (customer_id, name);

create table if not exists public.quotations (
  id uuid primary key,
  quotation_number integer not null unique,
  status text not null check (status in ('processing', 'issued', 'cancelled', 'failed')),
  offer_status text not null check (offer_status in ('temporary', 'approved', 'in_progress', 'sent', 'expired')),
  issue_date date not null,
  payload jsonb not null,
  total numeric(14,2) not null check (total >= 0),
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  issued_at timestamptz,
  cancelled_at timestamptz,
  pdf_path text,
  pdf_sha256 text,
  template_version text not null
);

create index if not exists quotations_number_desc_idx
  on public.quotations (quotation_number desc);
create index if not exists quotations_customer_name_idx
  on public.quotations ((payload ->> 'customerName'));

create table if not exists public.quotation_audit_events (
  id uuid primary key,
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  action text not null,
  actor text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quotation_audit_events_quotation_created_idx
  on public.quotation_audit_events (quotation_id, created_at);

create or replace function public.next_quotation_number()
returns integer
language sql
volatile
security invoker
set search_path = ''
as $$
  select nextval('public.quotation_number_seq')::integer;
$$;

create or replace function public.peek_quotation_number_seq()
returns integer
language sql
stable
security invoker
set search_path = ''
as $$
  select (case when is_called then last_value + 1 else last_value end)::integer
  from public.quotation_number_seq;
$$;

alter table public.app_users enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.customer_contacts enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_audit_events enable row level security;

revoke all on table public.app_users from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.customers from anon, authenticated;
revoke all on table public.customer_contacts from anon, authenticated;
revoke all on table public.quotations from anon, authenticated;
revoke all on table public.quotation_audit_events from anon, authenticated;
revoke all on sequence public.quotation_number_seq from public, anon, authenticated;
revoke all on function public.next_quotation_number() from public, anon, authenticated;
revoke all on function public.peek_quotation_number_seq() from public, anon, authenticated;

grant usage on schema public to service_role;
grant all on table public.app_users to service_role;
grant all on table public.products to service_role;
grant all on table public.customers to service_role;
grant all on table public.customer_contacts to service_role;
grant all on table public.quotations to service_role;
grant all on table public.quotation_audit_events to service_role;
grant usage, select, update on sequence public.quotation_number_seq to service_role;
grant execute on function public.next_quotation_number() to service_role;
grant execute on function public.peek_quotation_number_seq() to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quotation-pdfs', 'quotation-pdfs', false, 20000000, array['application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
