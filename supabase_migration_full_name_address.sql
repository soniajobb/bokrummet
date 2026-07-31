-- Kör i Supabase Dashboard -> SQL Editor -> New query -> Run
-- Lägger till "fullständigt namn" och sparad adress på profiler,
-- så att kassan kan förifyllas med kundens uppgifter.

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists address text;

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
