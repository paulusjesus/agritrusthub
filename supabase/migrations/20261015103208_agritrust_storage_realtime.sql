-- Offers: the seller always comes from the listing, counters reset signatures,
-- and each side can only sign for themselves.
create or replace function agritrust.offers_before() returns trigger language plpgsql security definer set search_path = agritrust as $$
begin
  if tg_op = 'INSERT' then
    select owner into new.seller from agritrust.listings where id = new.listing_id and status = 'active';
    if new.seller is null then raise exception 'This listing is no longer available'; end if;
    if new.seller = new.buyer then raise exception 'You cannot make an offer on your own listing'; end if;
    new.last_by := auth.uid(); new.status := 'pending'; new.buyer_signed := false; new.seller_signed := false;
  else
    new.listing_id := old.listing_id; new.buyer := old.buyer; new.seller := old.seller;
    if new.price <> old.price or new.qty <> old.qty then
      new.last_by := auth.uid(); new.buyer_signed := false; new.seller_signed := false;
    end if;
    if auth.uid() = old.buyer then new.seller_signed := old.seller_signed; end if;
    if auth.uid() = old.seller then new.buyer_signed := old.buyer_signed; end if;
    if new.buyer_signed and new.seller_signed then new.status := 'signed'; end if;
    new.updated_at := now();
  end if;
  return new;
end $$;
create trigger offers_before before insert or update on agritrust.offers for each row execute function agritrust.offers_before();

-- Photos for listings, profiles and QualityScan samples. Users write only to their own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('agritrust', 'agritrust', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy "agritrust images public read" on storage.objects for select to anon, authenticated using (bucket_id = 'agritrust');
create policy "agritrust own upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'agritrust' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "agritrust own update" on storage.objects for update to authenticated
  using (bucket_id = 'agritrust' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "agritrust own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'agritrust' and (storage.foldername(name))[1] = auth.uid()::text);

-- Live updates for chat, notifications and offers
alter publication supabase_realtime add table agritrust.messages, agritrust.notifications, agritrust.offers;

-- After applying: Supabase dashboard > Integrations > Data API > Settings > Exposed schemas, add "agritrust".
