-- Kör hela detta i Supabase Dashboard -> SQL Editor -> New query -> Run
-- OBS: pa ett FRISKT projekt maste supabase_setup_auth.sql koras FORE denna
-- fil, eftersom bocker-reglerna nedan slar upp is_seller i public.profiles.

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slot_b text unique not null,
  title text not null,
  author text not null default 'Okänd',
  tag text not null default 'Barnbok',
  price text not null,
  cover text not null default '',
  description text not null default '',
  condition text not null default 'Bra skick',
  sold boolean not null default false,
  custom boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Alla kan läsa böcker" on public.books
  for select using (true);

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

-- Inloggade kunder far markera EN bok som sald (t.ex. vid kop) utan att
-- vara saljare, via denna snava funktion som bara satter sold = true.
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

alter publication supabase_realtime add table public.books;

insert into public.books (slot_b, title, author, tag, price, cover, description, condition) values
('coverB-1', 'Evies magiska armband: Den förtrollade hundvalpen', 'Jessica Ennis-Hill', 'Barnbok · 7–10 år', '59 kr', '/covers/evie-1-hundvalpen.jpg', 'Evie upptäcker att hennes armband är magiskt – när hon gör en god gärning tänds pärlorna. I den första boken hjälper Evie och kusinen Layla en liten hundvalp med hjälp av armbandets magi. Rikt illustrerad. Inbunden.', 'Bra skick'),
('coverB-2', 'En hemlig drake', 'Moa Mansén', 'Barnbok · Fantasy', '55 kr', '/covers/2-en-hemlig-drake.jpg', 'När en liten drake plötsligt dyker upp i vardagen måste den hållas hemlig. En varmhjärtad fantasyberättelse om vänskap, mod och att våga tro på det magiska. Inbunden.', 'Bra skick'),
('coverB-3', 'Drömhäxan', 'Allan Stratton', 'Barnbok · Äventyr', '55 kr', '/covers/3-dromhaxan.jpg', 'Dröm och verklighet flätas samman i ett fantasifullt äventyr där två barn ger sig ut bortom det vanliga. Fint illustrerad och spännande från första sidan. Inbunden.', 'Bra skick'),
('coverB-4', 'Level up!', 'Tom Nicoll', 'Barnbok · Humor', '59 kr', '/covers/4-level-up.jpg', 'Vad händer när tv-spelets figurer kliver rakt ut i verkligheten? En rolig, actionfylld berättelse för unga gamers, rikt illustrerad av Anjan Sarkar. Inbunden.', 'Bra skick'),
('coverB-5', 'Ingenting är omöjligt', 'Robin Stevenson', 'Barnbok', '55 kr', '/covers/5-ingenting-ar-omojligt.jpg', 'En berättelse om att tro på sig själv när allt känns omöjligt – om vänskap, drömmar och att aldrig ge upp. Inbunden.', 'Bra skick'),
('coverB-6', 'I drömmarnas värld', 'Judi Curtin & Roisin Meaney', 'Barnbok · 9–12 år', '59 kr', '/covers/6-drommarnas-varld.jpg', 'Saskia och Luke byter oväntat liv med varandra och upptäcker att gräset inte alltid är grönare på andra sidan. En varm och rolig berättelse om vänskap och att se sig själv i ett nytt ljus. Inbunden.', 'Bra skick'),
('coverB-7', 'Evies magiska armband: Silverenhörningen', 'Jessica Ennis-Hill', 'Barnbok · 7–10 år', '59 kr', '/covers/7-evie-silverenhorningen.jpg', 'Ännu ett äventyr med Evie och det magiska armbandet – den här gången med en silverenhörning inblandad. Om vänskap, djur och små magiska ögonblick. Rikt illustrerad. Inbunden.', 'Bra skick'),
('coverB-8', 'De övergivna', 'Carlie Sorosiak', 'Ungdom', '69 kr', '/covers/8-de-overgivna.jpg', 'En stämningsfull berättelse om två unga och en sommar som förändrar allt, mot en bakgrund av hav och solnedgångar. Om saknad, hopp och att hitta sin plats. Inbunden.', 'Bra skick'),
('coverB-9', 'Emily Sparkes och tävlingskatastrofen', 'Ruth Fitzgerald', 'Barnbok · Humor', '55 kr', '/covers/9-emily-sparkes.jpg', 'Emily Sparkes drömmer om att bli populär – men det mesta går fel på det roligaste sättet. En fartfylld och skrattframkallande berättelse för mellanåldern. Inbunden.', 'Bra skick'),
('coverB-10', 'Åtta prinsessor och en magisk spegel', 'Natasha Farrant', 'Barnbok · Sagor', '79 kr', '/covers/10-atta-prinsessor.jpg', 'Åtta moderna sagoprinsessor som gör saker på sitt eget vis, vackert illustrerade av Lydia Corry. En påkostad, gulddekorerad presentbok att återvända till. Inbunden.', 'Bra skick')
on conflict (slot_b) do nothing;
