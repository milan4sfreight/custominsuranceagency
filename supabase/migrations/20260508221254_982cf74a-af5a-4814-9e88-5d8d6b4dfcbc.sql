update storage.buckets set public = false where id = 'enrollment-pdfs';
drop policy if exists "Public read enrollment pdfs" on storage.objects;