-- Team access: anyone whose sign-in phone is on this list is an AgriTRUST admin.
-- Add a team member with: insert into agritrust.admin_phones (phone, note) values ('264811234567', 'Name');
create table if not exists agritrust.admin_phones (phone text primary key, note text, created_at timestamptz not null default now());
alter table agritrust.admin_phones enable row level security;
revoke all on agritrust.admin_phones from anon, authenticated;

create or replace function agritrust.is_admin() returns boolean language sql stable security definer set search_path = agritrust as $$
  select exists (select 1 from agritrust.profile_private pp join agritrust.admin_phones a on a.phone = pp.phone where pp.id = auth.uid());
$$;
revoke all on function agritrust.is_admin() from public, anon;
grant execute on function agritrust.is_admin() to authenticated;

alter table agritrust.contact_messages add column if not exists status text not null default 'New';
alter table agritrust.agent_requests add column if not exists status text not null default 'New';
alter table agritrust.buyer_requests add column if not exists status text not null default 'Open';
alter table agritrust.contact_messages add column if not exists team_note text;
alter table agritrust.agent_requests add column if not exists team_note text;
alter table agritrust.loan_applications add column if not exists team_note text;
alter table agritrust.haul_requests add column if not exists team_note text;

do $$ declare t text; begin
  foreach t in array array['contact_messages','agent_requests','buyer_requests','loan_applications','haul_requests','scan_requests','disputes','theft_alerts','listings','posts'] loop
    execute format('create policy "admin read" on agritrust.%I for select to authenticated using (agritrust.is_admin())', t);
    execute format('create policy "admin update" on agritrust.%I for update to authenticated using (agritrust.is_admin()) with check (agritrust.is_admin())', t);
  end loop;
end $$;
create policy "admin delete posts" on agritrust.posts for delete to authenticated using (agritrust.is_admin());
create policy "admin read private" on agritrust.profile_private for select to authenticated using (agritrust.is_admin());
grant select, update on agritrust.contact_messages, agritrust.agent_requests, agritrust.buyer_requests to authenticated;

create or replace function agritrust.notify_admins(p_kind text, p_title text, p_body text) returns void language sql security definer set search_path = agritrust as $$
  insert into agritrust.notifications (user_id, kind, title, body, go)
  select pp.id, p_kind, p_title, p_body, 'admin' from agritrust.profile_private pp join agritrust.admin_phones a on a.phone = pp.phone;
$$;
revoke all on function agritrust.notify_admins(text,text,text) from public, anon, authenticated;

create or replace function agritrust.team_alert() returns trigger language plpgsql security definer set search_path = agritrust as $$
begin
  perform agritrust.notify_admins('team', 'Team: ' || case tg_table_name
      when 'contact_messages' then 'new contact message' when 'agent_requests' then 'agent call request'
      when 'buyer_requests' then 'new buyer request' when 'loan_applications' then 'loan application'
      when 'haul_requests' then 'truck request' when 'scan_requests' then 'QualityScan photo to grade'
      when 'disputes' then 'new dispute' when 'theft_alerts' then 'theft report' else tg_table_name end,
    'Open the admin page to handle it.');
  return new;
end $$;
do $$ declare t text; begin
  foreach t in array array['contact_messages','agent_requests','buyer_requests','loan_applications','haul_requests','scan_requests','disputes','theft_alerts'] loop
    execute format('create trigger team_alert after insert on agritrust.%I for each row execute function agritrust.team_alert()', t);
  end loop;
end $$;

create or replace function agritrust.member_update() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare v_title text; v_body text; v_go text;
begin
  if tg_table_name = 'scan_requests' and (new.status is distinct from old.status or new.result is distinct from old.result) then
    v_title := 'QualityScan result'; v_body := new.crop || ': ' || coalesce(new.result, new.status); v_go := 'scan';
  elsif tg_table_name = 'disputes' and (new.status is distinct from old.status or new.note is distinct from old.note) then
    v_title := 'Dispute ' || new.ref; v_body := new.status || '. ' || new.note; v_go := 'disputes';
  elsif tg_table_name = 'loan_applications' and (new.status is distinct from old.status or new.team_note is distinct from old.team_note) then
    v_title := 'Harvest Finance'; v_body := 'Your application is ' || lower(new.status) || coalesce('. ' || new.team_note, '.'); v_go := 'finance';
  elsif tg_table_name = 'haul_requests' and (new.status is distinct from old.status or new.team_note is distinct from old.team_note) then
    v_title := 'Truck request ' || new.ref; v_body := new.status || coalesce('. ' || new.team_note, '.'); v_go := 'haul';
  else return new; end if;
  if new.owner <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) then
    insert into agritrust.notifications (user_id, kind, title, body, go) values (new.owner, 'team', v_title, v_body, v_go);
  end if;
  return new;
end $$;
do $$ declare t text; begin
  foreach t in array array['scan_requests','disputes','loan_applications','haul_requests'] loop
    execute format('create trigger member_update after update on agritrust.%I for each row execute function agritrust.member_update()', t);
  end loop;
end $$;

-- Community replies
create table if not exists agritrust.post_replies (
  id bigint generated always as identity primary key,
  post_id bigint not null references agritrust.posts(id) on delete cascade,
  author uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on agritrust.post_replies (post_id, created_at);
alter table agritrust.post_replies enable row level security;
grant select on agritrust.post_replies to anon, authenticated;
grant insert, delete on agritrust.post_replies to authenticated;
grant usage, select on all sequences in schema agritrust to anon, authenticated;
create policy "replies readable" on agritrust.post_replies for select to anon, authenticated using (true);
create policy "replies own insert" on agritrust.post_replies for insert to authenticated with check (author = auth.uid());
create policy "replies own delete" on agritrust.post_replies for delete to authenticated using (author = auth.uid() or agritrust.is_admin());
create or replace function agritrust.reply_after() returns trigger language plpgsql security definer set search_path = agritrust as $$
declare p agritrust.posts;
begin
  select * into p from agritrust.posts where id = new.post_id;
  if p.author <> new.author then
    perform agritrust.notify(p.author, 'reply', 'New reply', agritrust.who(new.author) || ' replied to "' || left(p.title, 60) || '".', 'community');
  end if;
  return new;
end $$;
create trigger reply_after after insert on agritrust.post_replies for each row execute function agritrust.reply_after();

create or replace function agritrust.counts()
returns table (kind text, ref bigint, n bigint) language sql stable security definer set search_path = agritrust as $$
  select 'like', post_id, count(*) from agritrust.post_likes group by post_id
  union all select 'reply', post_id, count(*) from agritrust.post_replies group by post_id
  union all select 'sighting', alert_id, count(*) from agritrust.theft_sightings group by alert_id
  union all select 'barter', barter_id, count(*) from agritrust.barter_offers group by barter_id
  union all select 'land', land_id, count(*) from agritrust.land_requests group by land_id;
$$;
grant execute on function agritrust.counts() to anon, authenticated;

create or replace function agritrust.admin_members()
returns table (id uuid, full_name text, region text, roles text, phone text, created_at timestamptz)
language sql stable security definer set search_path = agritrust as $$
  select p.id, p.full_name, p.region, p.roles, pp.phone, p.created_at
  from agritrust.profiles p join agritrust.profile_private pp using (id)
  where agritrust.is_admin() order by p.created_at desc;
$$;
revoke all on function agritrust.admin_members() from public, anon;
grant execute on function agritrust.admin_members() to authenticated;
