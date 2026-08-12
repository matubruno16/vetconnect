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
  responsible_name text,
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
alter table veterinarians add column if not exists responsible_name text;

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

-- Mascotas perdidas: mural público, cualquiera puede publicar sin login.
create table if not exists lost_pets (
  id uuid primary key default gen_random_uuid(),
  pet_name text not null,
  species text not null,
  breed text,
  color text,
  description text,
  last_seen_location text not null,
  last_seen_date date,
  city_id uuid references cities (id) on delete set null,
  latitude double precision,
  longitude double precision,
  image_url text,
  contact_name text not null,
  contact_phone text not null,
  contact_whatsapp text,
  status text not null default 'lost' check (status in ('lost', 'found')),
  created_at timestamptz not null default now()
);

-- Token secreto para que quien reportó la mascota pueda marcarla como
-- encontrada sin necesitar login. Va en una tabla separada (no en
-- lost_pets) para que nunca quede expuesto por la policy de lectura
-- pública de lost_pets — nadie puede leer esta tabla directo por la API,
-- solo la función mark_lost_pet_found() (más abajo) puede consultarla.
create table if not exists lost_pet_tokens (
  lost_pet_id uuid primary key references lost_pets (id) on delete cascade,
  token uuid not null default gen_random_uuid()
);

insert into storage.buckets (id, name, public)
values ('lost-pets', 'lost-pets', true)
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

-- Mascotas perdidas: mural público. Cualquiera puede publicar y leer; solo
-- un admin logueado puede editar (marcar "encontrada") o borrar (moderar
-- spam/duplicados).
alter table lost_pets enable row level security;

drop policy if exists "lost_pets_select_all" on lost_pets;
create policy "lost_pets_select_all" on lost_pets
  for select to anon, authenticated using (true);

drop policy if exists "lost_pets_insert_public" on lost_pets;
create policy "lost_pets_insert_public" on lost_pets
  for insert to anon, authenticated with check (true);

drop policy if exists "lost_pets_update_admin" on lost_pets;
create policy "lost_pets_update_admin" on lost_pets
  for update to authenticated using (true) with check (true);

drop policy if exists "lost_pets_delete_admin" on lost_pets;
create policy "lost_pets_delete_admin" on lost_pets
  for delete to authenticated using (true);

drop policy if exists "lost_pets_images_select_all" on storage.objects;
create policy "lost_pets_images_select_all" on storage.objects
  for select to anon, authenticated using (bucket_id = 'lost-pets');

drop policy if exists "lost_pets_images_insert_public" on storage.objects;
create policy "lost_pets_images_insert_public" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'lost-pets');

drop policy if exists "lost_pets_images_write_admin" on storage.objects;
create policy "lost_pets_images_write_admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'lost-pets')
  with check (bucket_id = 'lost-pets');

-- lost_pet_tokens: sin ninguna policy de select, a propósito. Nadie puede
-- leer el token directo por la API (ni con la anon key), solo insertarlo
-- (al crear el aviso). La única forma de "usarlo" es a través de la
-- función mark_lost_pet_found(), que corre con permisos elevados
-- (security definer) y compara el token ahí adentro.
alter table lost_pet_tokens enable row level security;

drop policy if exists "lost_pet_tokens_insert_public" on lost_pet_tokens;
create policy "lost_pet_tokens_insert_public" on lost_pet_tokens
  for insert to anon, authenticated with check (true);

-- Marca una mascota como encontrada solo si el token coincide con el que
-- se generó al crear el aviso. security definer = corre saltando RLS, así
-- puede leer lost_pet_tokens (que nadie más puede leer) para comparar.
create or replace function mark_lost_pet_found(p_id uuid, p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated boolean;
begin
  update lost_pets
  set status = 'found'
  where id = p_id
    and status = 'lost'
    and exists (
      select 1 from lost_pet_tokens t
      where t.lost_pet_id = p_id and t.token = p_token
    );

  v_updated := found;
  return v_updated;
end;
$$;

grant execute on function mark_lost_pet_found(uuid, uuid) to anon, authenticated;

-- Aviso público: para cuando quien encontró la mascota (o el dueño, si
-- perdió su link con token) no tiene forma de marcarla como encontrada
-- directamente. Esto NO cambia el estado — solo prende una bandera para
-- que el admin lo vea en /admin/lost-pets y lo confirme él mismo. Por eso
-- puede ser anon sin ningún token: lo peor que puede pasar es una bandera
-- falsa que el admin ignora, nunca se pierde ni se altera información.
alter table lost_pets add column if not exists found_reported_at timestamptz;

create or replace function report_lost_pet_found_tip(p_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated boolean;
begin
  update lost_pets
  set found_reported_at = now()
  where id = p_id and status = 'lost';

  v_updated := found;
  return v_updated;
end;
$$;

grant execute on function report_lost_pet_found_tip(uuid) to anon, authenticated;

-- Configuración institucional: una sola fila (id fijo en 1) con los datos
-- de contacto/redes del colegio, para no hardcodearlos en el footer.
create table if not exists site_settings (
  id smallint primary key default 1 check (id = 1),
  org_name text,
  contact_email text,
  contact_phone text,
  contact_whatsapp text,
  address text,
  instagram text,
  facebook text,
  footer_text text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

drop policy if exists "site_settings_select_all" on site_settings;
create policy "site_settings_select_all" on site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings_write_admin" on site_settings;
create policy "site_settings_write_admin" on site_settings
  for all to authenticated using (true) with check (true);
