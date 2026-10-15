-- Security review, 15 October 2026.
-- Members may only change the columns the app actually edits, so nobody can,
-- for example, change their phone number to an admin's, give their own listing
-- a grade, rewrite someone else's chat message or mark a deal signed alone.

-- 1. Profiles: the phone number decides admin access, so members cannot edit it.
revoke update on agritrust.profile_private from authenticated;
grant update (channels, currency, language, notify, updated_at) on agritrust.profile_private to authenticated;

revoke update on agritrust.profiles from authenticated;
grant update (avatar_url, full_name, region, roles) on agritrust.profiles to authenticated;

-- Admin access needs the phone on the team list AND the phone the account signs in with.
create or replace function agritrust.is_admin() returns boolean
language sql stable security definer set search_path = agritrust as $$
  select exists (
    select 1
    from agritrust.profile_private pp
    join agritrust.admin_phones a on a.phone = pp.phone
    join auth.users u on u.id = pp.id
    where pp.id = auth.uid()
      and lower(u.email) = a.phone || '@phone.agritrusthub.com'
  );
$$;

-- 2. Listings: the grade comes from QualityScan, not from the seller.
revoke insert, update on agritrust.listings from authenticated;
grant insert (name, cat, region, price, unit, qty, img, owner) on agritrust.listings to authenticated;
grant update (name, cat, region, price, unit, qty, img, status) on agritrust.listings to authenticated;

-- 3. Chat: members can only mark messages as read, and threads are opened by open_thread().
revoke update on agritrust.messages from authenticated;
grant update (read_at) on agritrust.messages to authenticated;
revoke update on agritrust.threads from authenticated;
revoke insert on agritrust.messages from authenticated;
grant insert (thread_id, body) on agritrust.messages to authenticated;

-- 4. Notifications: only the read flag can change.
revoke update on agritrust.notifications from authenticated;
grant update (read) on agritrust.notifications to authenticated;

-- 5. Offers: only price, quantity, status and each side's own signature.
revoke update on agritrust.offers from authenticated;
grant update (price, qty, status, buyer_signed, seller_signed) on agritrust.offers to authenticated;
revoke insert on agritrust.offers from authenticated;
grant insert (listing_id, seller, price, qty) on agritrust.offers to authenticated;

create or replace function agritrust.offers_before() returns trigger
language plpgsql security definer set search_path = agritrust as $$
begin
  if tg_op = 'INSERT' then
    select owner into new.seller from agritrust.listings where id = new.listing_id and status = 'active';
    if new.seller is null then raise exception 'This listing is no longer available'; end if;
    new.buyer := auth.uid();
    if new.seller = new.buyer then raise exception 'You cannot make an offer on your own listing'; end if;
    if new.price <= 0 or new.qty <= 0 then raise exception 'Please enter a price and quantity above zero'; end if;
    new.last_by := auth.uid(); new.status := 'pending'; new.buyer_signed := false; new.seller_signed := false;
  else
    if old.status = 'signed' then raise exception 'This deal is signed and cannot be changed'; end if;
    new.listing_id := old.listing_id; new.buyer := old.buyer; new.seller := old.seller;
    if new.status not in ('pending', 'countered', 'agreed', 'declined', 'withdrawn', 'signed') then new.status := old.status; end if;
    if new.status = 'withdrawn' and auth.uid() <> old.buyer then new.status := old.status; end if;
    if new.status = 'declined' and auth.uid() <> old.seller and auth.uid() <> old.buyer then new.status := old.status; end if;
    if new.price <> old.price or new.qty <> old.qty then
      if new.price <= 0 or new.qty <= 0 then raise exception 'Please enter a price and quantity above zero'; end if;
      new.last_by := auth.uid(); new.buyer_signed := false; new.seller_signed := false;
    end if;
    if auth.uid() = old.buyer then new.seller_signed := old.seller_signed; end if;
    if auth.uid() = old.seller then new.buyer_signed := old.buyer_signed; end if;
    -- A deal is only signed when both sides have signed.
    if new.buyer_signed and new.seller_signed then new.status := 'signed';
    elsif new.status = 'signed' then new.status := old.status; end if;
    new.updated_at := now();
  end if;
  return new;
end $$;

-- 6. Owners cannot hand their posts to someone else.
alter policy "barters own update" on agritrust.barters using (owner = auth.uid()) with check (owner = auth.uid());
alter policy "lands own update" on agritrust.lands using (owner = auth.uid()) with check (owner = auth.uid());
alter policy "alerts own update" on agritrust.theft_alerts using (owner = auth.uid()) with check (owner = auth.uid());
revoke update on agritrust.barters, agritrust.lands, agritrust.theft_alerts from authenticated;
grant update (have, want, region, status) on agritrust.barters to authenticated;
grant update (place, ha, features, terms, img, status) on agritrust.lands to authenticated;
grant update (what, place, details, status) on agritrust.theft_alerts to authenticated;
revoke update on agritrust.posts from authenticated;
grant update (tag, title, body) on agritrust.posts to authenticated;

-- 7. Trigger functions are not meant to be called through the API.
revoke execute on function
  agritrust.alert_after(), agritrust.barter_offer_after(), agritrust.land_request_after(),
  agritrust.member_update(), agritrust.messages_after(), agritrust.offers_after(),
  agritrust.offers_before(), agritrust.reply_after(), agritrust.sighting_after(), agritrust.team_alert()
from public, anon, authenticated;

-- The team list is read only through is_admin(); nobody reads it directly.
comment on table agritrust.admin_phones is 'Phone numbers allowed to open the team admin page. No policies on purpose: read only by security definer functions.';
