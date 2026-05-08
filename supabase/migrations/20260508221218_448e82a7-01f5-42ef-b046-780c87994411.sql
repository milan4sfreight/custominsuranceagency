insert into storage.buckets (id, name, public) values ('enrollment-pdfs', 'enrollment-pdfs', true) on conflict (id) do nothing;

create policy "Public read enrollment pdfs"
on storage.objects for select
using (bucket_id = 'enrollment-pdfs');

create policy "Service role can upload enrollment pdfs"
on storage.objects for insert
with check (bucket_id = 'enrollment-pdfs');