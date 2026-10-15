-- Weekly backup of all AgriTRUST records, 15 October 2026.
-- Every Sunday at 03:00 Windhoek time (01:00 UTC) a full copy of the agritrust
-- tables is saved. Copies are small, so all are kept; the admin page lists the newest 12. Team admins can download any copy
-- from the admin page and keep it somewhere else, such as Google Drive.
-- Photos stay in the agritrust storage bucket and are not part of the copy.

create extension if not exists pg_cron;

create table if not exists agritrust.backups (
  id bigint generated always as identity primary key,
  taken_at timestamptz not null default now(),
  counts jsonb not null,
  bytes integer not null,
  data jsonb not null
);
alter table agritrust.backups enable row level security;
revoke all on agritrust.backups from anon, authenticated;
comment on table agritrust.backups is 'Weekly copies of the agritrust tables. No policies on purpose: read only through backup_list() and backup_get() by team admins.';

create or replace function agritrust.take_backup() returns bigint
language plpgsql security definer set search_path = agritrust as $$
declare t record; v jsonb; v_data jsonb := '{}'; v_counts jsonb := '{}'; v_id bigint;
begin
  for t in
    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'agritrust' and c.relkind = 'r' and c.relname not in ('backups', 'signup_attempts')
    order by c.relname
  loop
    execute format('select coalesce(jsonb_agg(to_jsonb(x)), ''[]''::jsonb) from agritrust.%I x', t.relname) into v;
    v_data := v_data || jsonb_build_object(t.relname, v);
    v_counts := v_counts || jsonb_build_object(t.relname, jsonb_array_length(v));
  end loop;
  -- Who can sign in (no passwords), so accounts can be rebuilt if ever needed.
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'email', email, 'created_at', created_at)), '[]'::jsonb)
    into v from auth.users where email like '%@phone.agritrusthub.com';
  v_data := v_data || jsonb_build_object('accounts', v);
  v_counts := v_counts || jsonb_build_object('accounts', jsonb_array_length(v));

  insert into agritrust.backups (counts, bytes, data)
  values (v_counts, octet_length(v_data::text), jsonb_build_object('version', 1, 'taken_at', now(), 'schema', 'agritrust', 'tables', v_data))
  returning id into v_id;

  return v_id;
end $$;
revoke execute on function agritrust.take_backup() from public, anon, authenticated;

create or replace function agritrust.backup_list() returns table (id bigint, taken_at timestamptz, counts jsonb, bytes integer)
language sql stable security definer set search_path = agritrust as $$
  select b.id, b.taken_at, b.counts, b.bytes from agritrust.backups b
  where (select agritrust.is_admin()) order by b.taken_at desc limit 12;
$$;
revoke execute on function agritrust.backup_list() from public, anon;
grant execute on function agritrust.backup_list() to authenticated;

create or replace function agritrust.backup_get(p_id bigint) returns jsonb
language sql stable security definer set search_path = agritrust as $$
  select b.data from agritrust.backups b where b.id = p_id and (select agritrust.is_admin());
$$;
revoke execute on function agritrust.backup_get(bigint) from public, anon;
grant execute on function agritrust.backup_get(bigint) to authenticated;

-- Team admins can also take a copy straight away from the admin page.
create or replace function agritrust.backup_now() returns bigint
language plpgsql security definer set search_path = agritrust as $$
begin
  if not (select agritrust.is_admin()) then raise exception 'Only the AgriTRUST team can do this.'; end if;
  return agritrust.take_backup();
end $$;
revoke execute on function agritrust.backup_now() from public, anon;
grant execute on function agritrust.backup_now() to authenticated;

select cron.schedule('agritrust-weekly-backup', '0 1 * * 0', 'select agritrust.take_backup()');
select agritrust.take_backup();
