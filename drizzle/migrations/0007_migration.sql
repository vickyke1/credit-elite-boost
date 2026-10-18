create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  key text not null,
  action text not null,
  identifier text not null,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_key_created_idx on public.rate_limits (key, created_at desc);

alter table public.rate_limits enable row level security;

revoke all on public.rate_limits from anon, authenticated;

comment on table public.rate_limits is 'Server-side rate limit attempts; accessed only via service role from edge functions.';