-- Kör i Supabase Dashboard -> SQL Editor -> New query -> Run
-- Detta lägger till konton (inloggning/registrering) ovanpå böckerna.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
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
  for update using (auth.uid() = id);

-- Skapar automatiskt en profilrad när någon registrerar sig
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, phone, email, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
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

-- Slår upp e-post från användarnamn så man kan logga in med användarnamn + lösenord
create or replace function public.get_email_by_username(uname text)
returns text
language sql
security definer set search_path = public
stable
as $$
  select email from public.profiles where username = uname limit 1;
$$;

grant execute on function public.get_email_by_username(text) to anon, authenticated;

-- När du (Sonia) har registrerat dig, kör raden nedan med DITT användarnamn
-- för att markera ditt konto som säljare:
-- update public.profiles set is_seller = true where username = 'ditt-användarnamn';
