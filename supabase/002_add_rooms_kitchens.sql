-- Add simple room counters to existing 2S properties table.
alter table public.properties add column if not exists rooms integer not null default 0;
alter table public.properties add column if not exists kitchens integer not null default 0;
