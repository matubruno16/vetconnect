-- VetConnect — esquema de referencia + RLS
-- Correr manualmente en el SQL Editor del proyecto Supabase (Project > SQL Editor).
-- Los "create table if not exists" son idempotentes: si las tablas ya existen
-- con esta forma, no rompen nada; solo documentan el esquema que hoy vive
-- únicamente "en vivo" en el proyecto.

create extension if not exists "pgcrypto";

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text,
  country text default 'Argentina',
  created_at timestamptz not null default now()
);

create table if not exists specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists veterinarians (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  license_number text,
  description text,
  phone text,
  whatsapp text,
  email text,
  website text,
  instagram text,
  address text,
  city_id uuid references cities (id) on delete set null,
  is_active boolean not null default true,
  is_24h boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists veterinarian_specialties (
  veterinarian_id uuid not null references veterinarians (id) on delete cascade,
  specialty_id uuid not null references specialties (id) on delete cascade,
  primary key (veterinarian_id, specialty_id)
);

alter table veterinarians add column if not exists latitude double precision;
alter table veterinarians add column if not exists longitude double precision;

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  veterinarian_id uuid not null references veterinarians (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default true,
  unique (veterinarian_id, day_of_week)
);

-- La tabla puede haber sido creada antes sin este constraint (necesario para
-- que el upsert de horarios sepa qué fila reemplazar). Lo agregamos si falta,
-- primero eliminando duplicados por veterinaria+día para que el constraint
-- se pueda crear sin error.
delete from schedules a
using schedules b
where a.veterinarian_id = b.veterinarian_id
  and a.day_of_week = b.day_of_week
  and a.id < b.id;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'schedules'::regclass
      and contype = 'u'
  ) then
    alter table schedules
      add constraint schedules_veterinarian_id_day_of_week_key
      unique (veterinarian_id, day_of_week);
  end if;
end $$;

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  veterinarian_id uuid not null references veterinarians (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Bucket de Storage para las fotos de las veterinarias (lectura pública).
insert into storage.buckets (id, name, public)
values ('vet-images', 'vet-images', true)
on conflict (id) do nothing;

-- Row Level Security
-- Hoy la app llama a Supabase con la anon/publishable key (pública, va en el
-- bundle del navegador). Sin RLS, cualquiera con esa key puede leer y
-- escribir directo en las tablas. Estas políticas: lectura pública de datos
-- no sensibles y de veterinarias activas; escritura solo para usuarios
-- autenticados (los admins que loguean en /admin/login).

alter table cities enable row level security;
alter table specialties enable row level security;
alter table veterinarians enable row level security;
alter table veterinarian_specialties enable row level security;
alter table schedules enable row level security;
alter table gallery_images enable row level security;

drop policy if exists "cities_select_all" on cities;
create policy "cities_select_all" on cities
  for select to anon, authenticated using (true);

drop policy if exists "cities_write_admin" on cities;
create policy "cities_write_admin" on cities
  for all to authenticated using (true) with check (true);

drop policy if exists "specialties_select_all" on specialties;
create policy "specialties_select_all" on specialties
  for select to anon, authenticated using (true);

drop policy if exists "specialties_write_admin" on specialties;
create policy "specialties_write_admin" on specialties
  for all to authenticated using (true) with check (true);

drop policy if exists "veterinarians_select_active" on veterinarians;
create policy "veterinarians_select_active" on veterinarians
  for select to anon using (is_active = true);

drop policy if exists "veterinarians_select_admin" on veterinarians;
create policy "veterinarians_select_admin" on veterinarians
  for select to authenticated using (true);

drop policy if exists "veterinarians_write_admin" on veterinarians;
create policy "veterinarians_write_admin" on veterinarians
  for insert to authenticated with check (true);

drop policy if exists "veterinarians_update_admin" on veterinarians;
create policy "veterinarians_update_admin" on veterinarians
  for update to authenticated using (true) with check (true);

drop policy if exists "veterinarians_delete_admin" on veterinarians;
create policy "veterinarians_delete_admin" on veterinarians
  for delete to authenticated using (true);

-- Registro self-service: cualquiera puede insertar una veterinaria nueva,
-- pero solo en estado inactivo/no destacado. La aprobación (activarla) la
-- hace un admin desde /admin/veterinarians.
drop policy if exists "veterinarians_public_register" on veterinarians;
create policy "veterinarians_public_register" on veterinarians
  for insert to anon
  with check (is_active = false and is_featured = false);

drop policy if exists "vet_specialties_select_all" on veterinarian_specialties;
create policy "vet_specialties_select_all" on veterinarian_specialties
  for select to anon, authenticated using (true);

drop policy if exists "vet_specialties_write_admin" on veterinarian_specialties;
create policy "vet_specialties_write_admin" on veterinarian_specialties
  for all to authenticated using (true) with check (true);

-- El formulario de registro self-service también deja elegir especialidades,
-- horarios y una foto. Se permite insertarlos solo mientras la veterinaria
-- todavía está pendiente de aprobación (is_active = false) — una vez
-- aprobada, sólo el admin puede seguir editándolos.
drop policy if exists "vet_specialties_public_register" on veterinarian_specialties;
create policy "vet_specialties_public_register" on veterinarian_specialties
  for insert to anon
  with check (
    exists (
      select 1 from veterinarians v
      where v.id = veterinarian_id and v.is_active = false
    )
  );

drop policy if exists "schedules_select_all" on schedules;
create policy "schedules_select_all" on schedules
  for select to anon, authenticated using (true);

drop policy if exists "schedules_write_admin" on schedules;
create policy "schedules_write_admin" on schedules
  for all to authenticated using (true) with check (true);

drop policy if exists "schedules_public_register" on schedules;
create policy "schedules_public_register" on schedules
  for insert to anon
  with check (
    exists (
      select 1 from veterinarians v
      where v.id = veterinarian_id and v.is_active = false
    )
  );

drop policy if exists "gallery_images_select_all" on gallery_images;
create policy "gallery_images_select_all" on gallery_images
  for select to anon, authenticated using (true);

drop policy if exists "gallery_images_write_admin" on gallery_images;
create policy "gallery_images_write_admin" on gallery_images
  for all to authenticated using (true) with check (true);

drop policy if exists "gallery_images_public_register" on gallery_images;
create policy "gallery_images_public_register" on gallery_images
  for insert to anon
  with check (
    exists (
      select 1 from veterinarians v
      where v.id = veterinarian_id and v.is_active = false
    )
  );

-- Storage: lectura pública de las fotos, escritura para admins logueados y
-- para el registro self-service (sube la foto antes de que exista sesión).
drop policy if exists "vet_images_select_all" on storage.objects;
create policy "vet_images_select_all" on storage.objects
  for select to anon, authenticated using (bucket_id = 'vet-images');

drop policy if exists "vet_images_public_register" on storage.objects;
create policy "vet_images_public_register" on storage.objects
  for insert to anon
  with check (bucket_id = 'vet-images');

drop policy if exists "vet_images_write_admin" on storage.objects;
create policy "vet_images_write_admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'vet-images')
  with check (bucket_id = 'vet-images');
