-- Kör i Supabase Dashboard -> SQL Editor -> New query -> Run
-- Tar bort kravet på användarnamn - inloggning sker nu med e-post + lösenord.

alter table public.profiles alter column username drop not null;

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
