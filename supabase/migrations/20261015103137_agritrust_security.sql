grant select, insert, update, delete on all tables in schema agritrust to authenticated;
grant select on agritrust.profiles, agritrust.listings, agritrust.posts, agritrust.post_likes, agritrust.barters, agritrust.lands to anon;
grant insert on agritrust.contact_messages, agritrust.agent_requests, agritrust.buyer_requests to anon;
grant all on all tables in schema agritrust to service_role;
grant usage, select on all sequences in schema agritrust to anon, authenticated, service_role;

do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname='agritrust' loop
    execute format('alter table agritrust.%I enable row level security', t);
  end loop;
end $$;

-- profiles
create policy "profiles readable" on agritrust.profiles for select to anon, authenticated using (true);
create policy "profile own update" on agritrust.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "private own read" on agritrust.profile_private for select to authenticated using (id = auth.uid());
create policy "private own update" on agritrust.profile_private for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- listings
create policy "listings readable" on agritrust.listings for select to anon, authenticated using (status = 'active' or owner = auth.uid());
create policy "listings own insert" on agritrust.listings for insert to authenticated with check (owner = auth.uid());
create policy "listings own update" on agritrust.listings for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
create policy "listings own delete" on agritrust.listings for delete to authenticated using (owner = auth.uid());
create policy "saved own" on agritrust.saved_listings for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- offers
create policy "offers parties read" on agritrust.offers for select to authenticated using (auth.uid() in (buyer, seller));
create policy "offers buyer insert" on agritrust.offers for insert to authenticated with check (buyer = auth.uid() and seller <> auth.uid());
create policy "offers parties update" on agritrust.offers for update to authenticated using (auth.uid() in (buyer, seller)) with check (auth.uid() in (buyer, seller));

-- threads and messages
create policy "threads parties read" on agritrust.threads for select to authenticated using (auth.uid() in (a, b));
create policy "threads parties insert" on agritrust.threads for insert to authenticated with check (auth.uid() in (a, b));
create policy "threads parties update" on agritrust.threads for update to authenticated using (auth.uid() in (a, b));
create policy "messages parties read" on agritrust.messages for select to authenticated
  using (exists (select 1 from agritrust.threads t where t.id = thread_id and auth.uid() in (t.a, t.b)));
create policy "messages parties insert" on agritrust.messages for insert to authenticated
  with check (sender = auth.uid() and exists (select 1 from agritrust.threads t where t.id = thread_id and auth.uid() in (t.a, t.b)));
create policy "messages mark read" on agritrust.messages for update to authenticated
  using (exists (select 1 from agritrust.threads t where t.id = thread_id and auth.uid() in (t.a, t.b)));

-- notifications
create policy "notif own read" on agritrust.notifications for select to authenticated using (user_id = auth.uid());
create policy "notif own update" on agritrust.notifications for update to authenticated using (user_id = auth.uid());

-- community
create policy "posts readable" on agritrust.posts for select to anon, authenticated using (true);
create policy "posts own insert" on agritrust.posts for insert to authenticated with check (author = auth.uid());
create policy "posts own delete" on agritrust.posts for delete to authenticated using (author = auth.uid());
create policy "likes readable" on agritrust.post_likes for select to anon, authenticated using (true);
create policy "likes own insert" on agritrust.post_likes for insert to authenticated with check (user_id = auth.uid());
create policy "likes own delete" on agritrust.post_likes for delete to authenticated using (user_id = auth.uid());

-- barter
create policy "barters readable" on agritrust.barters for select to anon, authenticated using (true);
create policy "barters own insert" on agritrust.barters for insert to authenticated with check (owner = auth.uid());
create policy "barters own update" on agritrust.barters for update to authenticated using (owner = auth.uid());
create policy "barters own delete" on agritrust.barters for delete to authenticated using (owner = auth.uid());
create policy "barter offers read" on agritrust.barter_offers for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from agritrust.barters b where b.id = barter_id and b.owner = auth.uid()));
create policy "barter offers own insert" on agritrust.barter_offers for insert to authenticated with check (user_id = auth.uid());
create policy "barter offers own delete" on agritrust.barter_offers for delete to authenticated using (user_id = auth.uid());

-- land
create policy "lands readable" on agritrust.lands for select to anon, authenticated using (true);
create policy "lands own insert" on agritrust.lands for insert to authenticated with check (owner = auth.uid());
create policy "lands own update" on agritrust.lands for update to authenticated using (owner = auth.uid());
create policy "lands own delete" on agritrust.lands for delete to authenticated using (owner = auth.uid());
create policy "land req read" on agritrust.land_requests for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from agritrust.lands l where l.id = land_id and l.owner = auth.uid()));
create policy "land req own insert" on agritrust.land_requests for insert to authenticated with check (user_id = auth.uid());
create policy "land req own delete" on agritrust.land_requests for delete to authenticated using (user_id = auth.uid());

-- theft
create policy "alerts members read" on agritrust.theft_alerts for select to authenticated using (true);
create policy "alerts own insert" on agritrust.theft_alerts for insert to authenticated with check (owner = auth.uid());
create policy "alerts own update" on agritrust.theft_alerts for update to authenticated using (owner = auth.uid());
create policy "sightings read" on agritrust.theft_sightings for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from agritrust.theft_alerts a where a.id = alert_id and a.owner = auth.uid()));
create policy "sightings own insert" on agritrust.theft_sightings for insert to authenticated with check (user_id = auth.uid());
create policy "sightings own delete" on agritrust.theft_sightings for delete to authenticated using (user_id = auth.uid());

-- private records
do $$ declare t text; begin
  foreach t in array array['disputes','loan_applications','haul_requests','entries','scan_requests'] loop
    execute format('create policy "own read" on agritrust.%I for select to authenticated using (owner = auth.uid())', t);
    execute format('create policy "own insert" on agritrust.%I for insert to authenticated with check (owner = auth.uid())', t);
  end loop;
end $$;
create policy "entries own delete" on agritrust.entries for delete to authenticated using (owner = auth.uid());
create policy "interest own" on agritrust.course_interest for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- website forms (anyone can send, the team reads them in the Supabase dashboard)
create policy "contact anyone insert" on agritrust.contact_messages for insert to anon, authenticated with check (true);
create policy "agent anyone insert" on agritrust.agent_requests for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
create policy "buyer req anyone insert" on agritrust.buyer_requests for insert to anon, authenticated with check (true);
create policy "buyer req members read" on agritrust.buyer_requests for select to authenticated using (true);

-- helpers
create or replace function agritrust.notify(p_user uuid, p_kind text, p_title text, p_body text, p_go text)
returns void language sql security definer set search_path = agritrust as $$
  insert into agritrust.notifications (user_id, kind, title, body, go) values (p_user, p_kind, p_title, p_body, p_go);
$$;
revoke all on function agritrust.notify(uuid,text,text,text,text) from public, anon, authenticated;

create or replace function agritrust.who(p uuid) returns text language sql stable security definer set search_path = agritrust as $$
  select coalesce(nullif(full_name,''), 'A member') from agritrust.profiles where id = p;
$$;
revoke all on function agritrust.who(uuid) from public, anon, authenticated;

create or replace function agritrust.offers_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare v_name text; v_other uuid;
begin
  select name into v_name from agritrust.listings where id = new.listing_id;
  v_other := case when auth.uid() = new.buyer then new.seller else new.buyer end;
  if tg_op = 'INSERT' then
    perform agritrust.notify(new.seller, 'offer', 'New offer', agritrust.who(new.buyer) || ' made an offer on ' || v_name || '.', 'deal');
  elsif new.status <> old.status or new.price <> old.price then
    perform agritrust.notify(v_other, 'offer', 'Offer update',
      agritrust.who(auth.uid()) || case new.status
        when 'countered' then ' sent a counter-offer on '
        when 'agreed' then ' agreed terms on '
        when 'declined' then ' declined the offer on '
        when 'withdrawn' then ' withdrew the offer on '
        when 'signed' then ' signed the agreement for '
        else ' updated the offer on ' end || v_name || '.', 'deal');
  end if;
  return new;
end $$;
create trigger offers_after after insert or update on agritrust.offers for each row execute function agritrust.offers_after();

create or replace function agritrust.messages_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare t agritrust.threads;
begin
  update agritrust.threads set last_at = now() where id = new.thread_id returning * into t;
  perform agritrust.notify(case when new.sender = t.a then t.b else t.a end, 'message', 'New message',
    agritrust.who(new.sender) || ': ' || left(new.body, 120), 'messages');
  return new;
end $$;
create trigger messages_after after insert on agritrust.messages for each row execute function agritrust.messages_after();

create or replace function agritrust.barter_offer_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare b agritrust.barters;
begin
  select * into b from agritrust.barters where id = new.barter_id;
  if b.owner <> new.user_id then
    perform agritrust.notify(b.owner, 'barter', 'Swap offer', agritrust.who(new.user_id) || ' wants to swap for ' || b.have || '.', 'barter');
  end if;
  return new;
end $$;
create trigger barter_offer_after after insert on agritrust.barter_offers for each row execute function agritrust.barter_offer_after();

create or replace function agritrust.land_request_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare l agritrust.lands;
begin
  select * into l from agritrust.lands where id = new.land_id;
  if l.owner <> new.user_id then
    perform agritrust.notify(l.owner, 'land', 'Request to farm', agritrust.who(new.user_id) || ' asked to farm your land at ' || l.place || '.', 'land');
  end if;
  return new;
end $$;
create trigger land_request_after after insert on agritrust.land_requests for each row execute function agritrust.land_request_after();

create or replace function agritrust.sighting_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare a agritrust.theft_alerts;
begin
  select * into a from agritrust.theft_alerts where id = new.alert_id;
  if a.owner <> new.user_id then
    perform agritrust.notify(a.owner, 'theft', 'Possible sighting', agritrust.who(new.user_id) || ' says they have seen: ' || a.what || '.', 'theft');
  end if;
  return new;
end $$;
create trigger sighting_after after insert on agritrust.theft_sightings for each row execute function agritrust.sighting_after();

create or replace function agritrust.alert_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
begin
  insert into agritrust.notifications (user_id, kind, title, body, go)
  select p.id, 'theft', 'Theft alert', new.what || ', ' || new.place || '.', 'theft'
  from agritrust.profiles p join agritrust.profiles o on o.id = new.owner
  where p.id <> new.owner and p.region = o.region;
  return new;
end $$;
create trigger alert_after after insert on agritrust.theft_alerts for each row execute function agritrust.alert_after();

-- start or reuse a chat between the signed-in user and someone else
create or replace function agritrust.open_thread(p_other uuid, p_topic text default 'chat')
returns bigint language plpgsql security definer set search_path = agritrust as $$
declare v_id bigint; v_me uuid := auth.uid();
begin
  if v_me is null or p_other is null or v_me = p_other then raise exception 'Cannot open this chat'; end if;
  select id into v_id from agritrust.threads where least(a,b) = least(v_me,p_other) and greatest(a,b) = greatest(v_me,p_other);
  if v_id is null then
    insert into agritrust.threads (a, b, topic) values (v_me, p_other, coalesce(p_topic,'chat')) returning id into v_id;
  else
    update agritrust.threads set topic = coalesce(p_topic, topic) where id = v_id;
  end if;
  return v_id;
end $$;
revoke all on function agritrust.open_thread(uuid,text) from public, anon;
grant execute on function agritrust.open_thread(uuid,text) to authenticated;

-- public counts that RLS would otherwise hide
create or replace function agritrust.public_stats(p_users uuid[])
returns table (id uuid, trades bigint) language sql stable security definer set search_path = agritrust as $$
  select u, (select count(*) from agritrust.offers o where o.status = 'signed' and u in (o.buyer, o.seller))
  from unnest(p_users) u;
$$;
grant execute on function agritrust.public_stats(uuid[]) to anon, authenticated;

create or replace function agritrust.counts()
returns table (kind text, ref bigint, n bigint) language sql stable security definer set search_path = agritrust as $$
  select 'like', post_id, count(*) from agritrust.post_likes group by post_id
  union all select 'sighting', alert_id, count(*) from agritrust.theft_sightings group by alert_id
  union all select 'barter', barter_id, count(*) from agritrust.barter_offers group by barter_id
  union all select 'land', land_id, count(*) from agritrust.land_requests group by land_id;
$$;
grant execute on function agritrust.counts() to anon, authenticated;
