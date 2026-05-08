drop policy if exists "Service role can upload enrollment pdfs" on storage.objects;
create policy "Only service role uploads enrollment pdfs"
on storage.objects for insert
to service_role
with check (bucket_id = 'enrollment-pdfs');