create table if not exists public.telegram_channel_post (
  id boolean primary key default true check (id),
  message_id bigint,
  updated_at timestamptz not null default now()
);

alter table public.telegram_channel_post enable row level security;

revoke all on public.telegram_channel_post from anon, authenticated;