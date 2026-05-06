
-- Storage bucket for quote uploads (private)
insert into storage.buckets (id, name, public)
values ('quote-uploads', 'quote-uploads', false)
on conflict (id) do nothing;

-- Allow anonymous public uploads (insert) only; no read/list/delete from clients
create policy "Anyone can upload quote files"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'quote-uploads');

-- Quote requests table (audit/log)
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  company text,
  zip text not null,
  details text,
  insurance_types jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

-- Anyone can submit a quote request
create policy "Anyone can insert quote requests"
on public.quote_requests for insert
to anon, authenticated
with check (true);
-- No SELECT policy: rows readable only via service role (edge function / admin)
