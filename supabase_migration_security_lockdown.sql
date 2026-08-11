-- Kör i Supabase Dashboard -> SQL Editor -> New query -> Run
-- KRITISK SÄKERHETSFIX
--
-- Just nu tillåter reglerna på "books" att VEM SOM HELST, utan inloggning,
-- lägger till/ändrar/tar bort böcker direkt mot databasen (bekräftat med
-- ett live-test). Och reglerna på "profiles" tillåter en inloggad kund att
-- ge sig själv säljarrättigheter. Den här filen låser båda.

-- 1) Bara säljare (is_seller = true) får lägga till, ändra eller ta bort böcker.
drop policy if exists "Alla kan lägga till böcker" on public.books;
drop policy if exists "Alla kan uppdatera böcker" on public.books;
drop policy if exists "Alla kan ta bort böcker" on public.books;

create policy "Saljare kan lagga till bocker" on public.books
  for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_seller = true)
  );

create policy "Saljare kan uppdatera bocker" on public.books
  for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_seller = true)
  );

create policy "Saljare kan ta bort bocker" on public.books
  for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_seller = true)
  );

-- 2) Inloggade kunder ska fortfarande kunna markera EN bok som såld när de
--    genomför ett köp, utan att vara säljare. En snäv funktion som bara får
--    sätta sold = true (inget annat) löser det säkert.
create or replace function public.mark_book_sold(p_slot_b text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Inte inloggad';
  end if;
  update public.books set sold = true where slot_b = p_slot_b;
end;
$$;

grant execute on function public.mark_book_sold(text) to authenticated;

-- 3) Förhindra att en inloggad kund kan ge sig själv säljarstatus genom att
--    skriva direkt till sin egen profilrad.
drop policy if exists "Uppdatera sin egen profil" on public.profiles;

create policy "Uppdatera sin egen profil" on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and is_seller = (select p.is_seller from public.profiles p where p.id = profiles.id)
  );
