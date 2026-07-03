-- Lowveld Agricultural Show & Trade Fair 2026
-- Core schema, RLS, and storage setup for the exhibitor portal

begin;

create extension if not exists "pgcrypto";

do $$
begin
  create type public.verification_status as enum (
    'pending_payment',
    'pending_verification',
    'verified',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.exhibitor_category as enum (
    'corporate',
    'farmers_association',
    'parastatal',
    'school',
    'government',
    'sme'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  company_name text not null,
  category public.exhibitor_category not null default 'corporate',
  phone text not null,

  additional_vehicle_passes integer not null default 0,
  additional_multi_tickets integer not null default 0,
  additional_single_tickets integer not null default 0,
  dinner_tickets_qty integer not null default 0,
  wants_advertising boolean not null default false,
  selected_sponsorships text[] not null default '{}'::text[],
  payment_method text not null default 'USD',
  calculated_total_usd numeric(10, 2) not null default 0,
  is_early_bird boolean not null default false,
  payment_reference text,

  verification_status public.verification_status not null default 'pending_payment',
  pop_url text,
  pop_file_name text,
  pop_uploaded_at timestamptz,
  rejection_reason text,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null unique,
  last_active timestamptz not null default timezone('utc', now()),
  device_info text,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.active_sessions enable row level security;

create index if not exists profiles_verification_status_idx on public.profiles (verification_status);
create index if not exists profiles_category_idx on public.profiles (category);
create index if not exists active_sessions_user_id_idx on public.active_sessions (user_id);
create index if not exists active_sessions_session_id_idx on public.active_sessions (session_id);

-- Optional helper for admin checks.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid()
      or a.email = coalesce((auth.jwt() ->> 'email'), '')
  );
$$;

-- Profiles
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Verified profiles are publicly readable" on public.profiles;
create policy "Verified profiles are publicly readable"
on public.profiles
for select
using (verification_status = 'verified' or auth.uid() = id or public.is_admin_user());

drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
on public.profiles
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- Active sessions
drop policy if exists "Users can manage their own sessions" on public.active_sessions;
create policy "Users can manage their own sessions"
on public.active_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Admin users
drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list"
on public.admin_users
for select
using (public.is_admin_user());

drop policy if exists "Admins can manage admin list" on public.admin_users;
create policy "Admins can manage admin list"
on public.admin_users
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- Storage bucket for POP uploads
insert into storage.buckets (id, name, public)
values ('pop-uploads', 'pop-uploads', false)
on conflict (id) do update
set public = excluded.public;

create policy "Users can upload their own POP"
on storage.objects
for insert
with check (
  bucket_id = 'pop-uploads'
  and auth.uid() is not null
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Users can read their own POP"
on storage.objects
for select
using (
  bucket_id = 'pop-uploads'
  and auth.uid() is not null
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Users can update their own POP"
on storage.objects
for update
using (
  bucket_id = 'pop-uploads'
  and auth.uid() is not null
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'pop-uploads'
  and auth.uid() is not null
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Users can delete their own POP"
on storage.objects
for delete
using (
  bucket_id = 'pop-uploads'
  and auth.uid() is not null
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "Admins can manage all POP files"
on storage.objects
for all
using (bucket_id = 'pop-uploads' and public.is_admin_user())
with check (bucket_id = 'pop-uploads' and public.is_admin_user());

commit;
