-- 1. Pin team access to a real account, not just a phone number.
-- Sign-up does not send an SMS, so someone could register a team member's number
-- before they do. An admin row now also names the account it belongs to.
alter table agritrust.admin_phones add column if not exists user_id uuid references auth.users (id) on delete cascade;

create or replace function agritrust.is_admin() returns boolean
language sql stable security definer set search_path = agritrust as $$
  select exists (
    select 1
    from agritrust.admin_phones a
    join agritrust.profile_private pp on pp.id = a.user_id and pp.phone = a.phone
    join auth.users u on u.id = a.user_id
    where a.user_id = (select auth.uid())
      and lower(u.email) = a.phone || '@phone.agritrusthub.com'
  );
$$;

-- 2. Slow down sign-up abuse: at most 10 sign-up attempts per hour from one connection.
create table if not exists agritrust.signup_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists signup_attempts_ip_time_idx on agritrust.signup_attempts (ip_hash, created_at);
alter table agritrust.signup_attempts enable row level security;
comment on table agritrust.signup_attempts is 'Written only by the agritrust-signup function with the service key. No policies on purpose.';

-- 3. Slow down spam on the public forms (contact, agent call, buyer request).
create or replace function agritrust.form_throttle() returns trigger
language plpgsql security definer set search_path = agritrust as $$
declare n int;
begin
  execute format('select count(*) from agritrust.%I where created_at > now() - interval ''10 minutes''', tg_table_name) into n;
  if n >= 40 then raise exception 'We are getting a lot of messages right now. Please try again in a few minutes.'; end if;
  return new;
end $$;
revoke execute on function agritrust.form_throttle() from public, anon, authenticated;

create trigger form_throttle before insert on agritrust.contact_messages for each row execute function agritrust.form_throttle();
create trigger form_throttle before insert on agritrust.agent_requests for each row execute function agritrust.form_throttle();
create trigger form_throttle before insert on agritrust.buyer_requests for each row execute function agritrust.form_throttle();

-- Keep each message a sensible size.
alter table agritrust.contact_messages add constraint contact_messages_size check (char_length(message) <= 4000 and char_length(name) <= 120) not valid;
alter table agritrust.messages add constraint messages_size check (char_length(body) <= 4000) not valid;
alter table agritrust.post_replies add constraint post_replies_size check (char_length(body) <= 4000) not valid;
alter table agritrust.posts add constraint posts_size check (char_length(body) <= 8000 and char_length(title) <= 200) not valid;

-- The sign-up function uses the service key, which needs these rights in the agritrust schema.
grant select, insert on agritrust.signup_attempts to service_role;
grant usage, select on all sequences in schema agritrust to service_role;
