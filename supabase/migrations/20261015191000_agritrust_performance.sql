-- Performance tidy-up from the Supabase advisor, 15 October 2026.

-- 1. Work out who is signed in once per query instead of once per row.
do $$
declare p record; v_using text; v_check text; v_sql text;
begin
  for p in select * from pg_policies where schemaname = 'agritrust' loop
    v_using := replace(replace(p.qual, 'auth.uid()', '( SELECT auth.uid() AS uid)'), 'agritrust.is_admin()', '( SELECT agritrust.is_admin() AS is_admin)');
    v_check := replace(replace(p.with_check, 'auth.uid()', '( SELECT auth.uid() AS uid)'), 'agritrust.is_admin()', '( SELECT agritrust.is_admin() AS is_admin)');
    if v_using is not distinct from p.qual and v_check is not distinct from p.with_check then continue; end if;
    v_sql := format('alter policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    if v_using is not null then v_sql := v_sql || ' using (' || v_using || ')'; end if;
    if v_check is not null then v_sql := v_sql || ' with check (' || v_check || ')'; end if;
    execute v_sql;
  end loop;
end $$;

-- 2. Indexes for the columns we look people's records up by.
create index if not exists barter_offers_user_id_idx on agritrust.barter_offers (user_id);
create index if not exists barters_owner_idx on agritrust.barters (owner);
create index if not exists disputes_owner_idx on agritrust.disputes (owner);
create index if not exists entries_owner_idx on agritrust.entries (owner);
create index if not exists haul_requests_owner_idx on agritrust.haul_requests (owner);
create index if not exists land_requests_user_id_idx on agritrust.land_requests (user_id);
create index if not exists lands_owner_idx on agritrust.lands (owner);
create index if not exists listings_owner_idx on agritrust.listings (owner);
create index if not exists loan_applications_owner_idx on agritrust.loan_applications (owner);
create index if not exists messages_sender_idx on agritrust.messages (sender);
create index if not exists offers_listing_id_idx on agritrust.offers (listing_id);
create index if not exists post_likes_user_id_idx on agritrust.post_likes (user_id);
create index if not exists post_replies_author_idx on agritrust.post_replies (author);
create index if not exists posts_author_idx on agritrust.posts (author);
create index if not exists saved_listings_listing_id_idx on agritrust.saved_listings (listing_id);
create index if not exists scan_requests_owner_idx on agritrust.scan_requests (owner);
create index if not exists theft_alerts_owner_idx on agritrust.theft_alerts (owner);
create index if not exists theft_sightings_user_id_idx on agritrust.theft_sightings (user_id);
create index if not exists threads_a_idx on agritrust.threads (a);
create index if not exists threads_b_idx on agritrust.threads (b);
