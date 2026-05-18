create table if not exists public.clubs (
  id bigserial primary key,
  title text not null,
  summary text,
  profile_image text,
  source_url text default 'https://terplink.umd.edu/organizations',
  created_at timestamptz default now()
);

create table if not exists public.search_logs (
  id bigserial primary key,
  query text not null,
  matched_count integer default 0,
  created_at timestamptz default now()
);
