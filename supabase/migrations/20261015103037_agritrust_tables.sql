create schema if not exists agritrust;
grant usage on schema agritrust to anon, authenticated, service_role;

create table agritrust.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  region text not null default 'Khomas',
  roles text not null default 'Farmer',
  avatar_url text,
  created_at timestamptz not null default now()
);
create table agritrust.profile_private (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null unique,
  language text not null default 'English',
  currency text,
  notify jsonb not null default '{"offers":true,"pay":true,"theft":true,"tips":false}',
  channels jsonb not null default '{"sms":true,"wa":true,"email":false}',
  updated_at timestamptz not null default now()
);
create table agritrust.listings (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  cat text not null,
  region text not null,
  price numeric(14,2) not null check (price > 0),
  unit text not null,
  qty numeric(14,2) not null check (qty > 0),
  grade text not null default 'Not scanned',
  img text,
  status text not null default 'active' check (status in ('active','sold','removed')),
  created_at timestamptz not null default now()
);
create index on agritrust.listings (status, created_at desc);
create table agritrust.saved_listings (
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  listing_id bigint not null references agritrust.listings(id) on delete cascade,
  primary key (user_id, listing_id)
);
create table agritrust.offers (
  id bigint generated always as identity primary key,
  listing_id bigint not null references agritrust.listings(id) on delete cascade,
  buyer uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  seller uuid not null references agritrust.profiles(id) on delete cascade,
  price numeric(14,2) not null check (price > 0),
  qty numeric(14,2) not null check (qty > 0),
  last_by uuid not null default auth.uid(),
  status text not null default 'pending' check (status in ('pending','countered','agreed','declined','withdrawn','signed')),
  buyer_signed boolean not null default false,
  seller_signed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on agritrust.offers (seller);
create index on agritrust.offers (buyer);
create table agritrust.threads (
  id bigint generated always as identity primary key,
  a uuid not null references agritrust.profiles(id) on delete cascade,
  b uuid not null references agritrust.profiles(id) on delete cascade,
  topic text not null default 'chat',
  created_at timestamptz not null default now(),
  last_at timestamptz not null default now(),
  check (a <> b)
);
create unique index threads_pair on agritrust.threads (least(a,b), greatest(a,b));
create table agritrust.messages (
  id bigint generated always as identity primary key,
  thread_id bigint not null references agritrust.threads(id) on delete cascade,
  sender uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on agritrust.messages (thread_id, created_at);
create table agritrust.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references agritrust.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  go text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on agritrust.notifications (user_id, created_at desc);
create table agritrust.posts (
  id bigint generated always as identity primary key,
  author uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  tag text not null,
  title text not null check (char_length(title) between 2 and 160),
  body text not null check (char_length(body) between 2 and 5000),
  created_at timestamptz not null default now()
);
create table agritrust.post_likes (
  post_id bigint not null references agritrust.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);
create table agritrust.barters (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  region text not null,
  have text not null,
  want text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create table agritrust.barter_offers (
  barter_id bigint not null references agritrust.barters(id) on delete cascade,
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (barter_id, user_id)
);
create table agritrust.lands (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  place text not null,
  ha numeric(10,2) not null check (ha > 0),
  features text,
  terms text not null,
  img text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create table agritrust.land_requests (
  land_id bigint not null references agritrust.lands(id) on delete cascade,
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (land_id, user_id)
);
create table agritrust.theft_alerts (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  what text not null,
  place text not null,
  details text,
  status text not null default 'Open',
  created_at timestamptz not null default now()
);
create table agritrust.theft_sightings (
  alert_id bigint not null references agritrust.theft_alerts(id) on delete cascade,
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (alert_id, user_id)
);
create table agritrust.disputes (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  ref text not null,
  deal text not null,
  reason text not null,
  description text not null,
  status text not null default 'Under review',
  note text not null default 'We will reply within two working days.',
  created_at timestamptz not null default now()
);
create table agritrust.loan_applications (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  repay numeric(14,2) not null,
  harvest text not null,
  status text not null default 'Received',
  created_at timestamptz not null default now()
);
create table agritrust.haul_requests (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  ref text not null,
  origin text not null,
  destination text not null,
  load_kg numeric(12,2) not null check (load_kg > 0),
  pickup text not null,
  estimate numeric(14,2),
  status text not null default 'Requested',
  created_at timestamptz not null default now()
);
create table agritrust.entries (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  type text not null check (type in ('in','out')),
  description text not null,
  amount numeric(14,2) not null check (amount > 0),
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);
create table agritrust.scan_requests (
  id bigint generated always as identity primary key,
  owner uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  crop text not null,
  img text not null,
  status text not null default 'Waiting for review',
  result text,
  created_at timestamptz not null default now()
);
create table agritrust.course_interest (
  user_id uuid not null default auth.uid() references agritrust.profiles(id) on delete cascade,
  course_id int not null,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
create table agritrust.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 120),
  phone text check (char_length(phone) <= 40),
  region text,
  message text not null check (char_length(message) <= 4000),
  created_at timestamptz not null default now()
);
create table agritrust.agent_requests (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) <= 120),
  phone text not null check (char_length(phone) <= 40),
  region text,
  user_id uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create table agritrust.buyer_requests (
  id bigint generated always as identity primary key,
  product text not null check (char_length(product) <= 160),
  qty text not null check (char_length(qty) <= 120),
  region text,
  company text check (char_length(company) <= 160),
  contact text not null check (char_length(contact) <= 160),
  created_at timestamptz not null default now()
);
