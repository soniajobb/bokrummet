-- Kör i Supabase Dashboard -> SQL Editor -> New query -> Run
-- Detta lägger till konton (inloggning/registrering) ovanpå böckerna.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  phone text,
  email text,
  full_name text,
  address text,
  is_seller boolean not null default false,
  cart jsonb not null default '[]'::jsonb,
  liked jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Läs sin egen profil" on public.profiles
  for select using (auth.uid() = id);

create policy "Uppdatera sin egen profil" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and is_seller = (select p.is_seller from public.profiles p where p.id = profiles.id)
  );

-- Skapar automatiskt en profilrad när någon registrerar sig
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, phone, email, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'phone',
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- När du (Sonia) har registrerat dig, kör raden nedan med DIN e-post
-- för att markera ditt konto som säljare:
-- update public.profiles set is_seller = true where email = 'din@epost.se';
