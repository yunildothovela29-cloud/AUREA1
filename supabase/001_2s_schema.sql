-- 2S Imobiliária & Serviços
-- Run this script once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  operation text not null check (operation in ('venda', 'arrendamento')),
  type text not null,
  location text not null,
  neighborhood text,
  city text not null default 'Maputo',
  address text not null,
  price numeric not null default 0,
  price_display text not null,
  price_period text,
  currency text not null default 'MT',
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  suites integer not null default 0,
  area numeric not null default 0,
  parking integer not null default 0,
  year_built integer,
  featured boolean not null default false,
  tag text,
  description text not null default '',
  long_description text[] not null default '{}',
  highlights text[] not null default '{}',
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  agent jsonb not null default '{}'::jsonb,
  status text not null default 'Disponível'
    check (status in ('Disponível', 'Reservado', 'Em Negociação', 'Arquivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_operation_idx on public.properties(operation);
create index if not exists properties_location_idx on public.properties(location);
create index if not exists properties_status_idx on public.properties(status);
create index if not exists properties_featured_idx on public.properties(featured);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  property_title text not null,
  property_location text,
  client_name text not null,
  client_phone text not null,
  client_email text not null,
  preferred_date date not null,
  preferred_time text not null,
  message text,
  status text not null default 'pendente'
    check (status in ('pendente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now()
);

create index if not exists visits_created_at_idx on public.visits(created_at desc);
create index if not exists visits_property_id_idx on public.visits(property_id);

alter table public.properties enable row level security;
alter table public.visits enable row level security;

drop policy if exists "Public can view active properties" on public.properties;
create policy "Public can view active properties"
  on public.properties
  for select
  to anon, authenticated
  using (status <> 'Arquivado');

drop policy if exists "Admin can manage properties" on public.properties;
create policy "Admin can manage properties"
  on public.properties
  for all
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com');

drop policy if exists "Anyone can create visits" on public.visits;
create policy "Anyone can create visits"
  on public.visits
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admin can view visits" on public.visits;
create policy "Admin can view visits"
  on public.visits
  for select
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com');

drop policy if exists "Admin can update visits" on public.visits;
create policy "Admin can update visits"
  on public.visits
  for update
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com')
  with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com');

drop policy if exists "Admin can delete visits" on public.visits;
create policy "Admin can delete visits"
  on public.visits
  for delete
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com');

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view property images" on storage.objects;
create policy "Public can view property images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Admin can upload property images" on storage.objects;
create policy "Admin can upload property images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'property-images' and
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com'
  );

drop policy if exists "Admin can update property images" on storage.objects;
create policy "Admin can update property images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'property-images' and
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com'
  )
  with check (
    bucket_id = 'property-images' and
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com'
  );

drop policy if exists "Admin can delete property images" on storage.objects;
create policy "Admin can delete property images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'property-images' and
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'sergio.sulemane@gmail.com'
  );
