/**
 * Run this in Supabase SQL Editor if actions fail with RLS / "Action failed".
 * (Also included at the bottom of schema.sql for new setups.)
 */

-- Allow the publishable (anon) key to read/write review data
alter table section_reviews enable row level security;

drop policy if exists "section_reviews anon all" on section_reviews;
create policy "section_reviews anon all"
  on section_reviews for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

alter table evidence_items enable row level security;

drop policy if exists "evidence_items anon all" on evidence_items;
create policy "evidence_items anon all"
  on evidence_items for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

-- Storage bucket policies (required for direct browser uploads)
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do update set public = true;

drop policy if exists "evidence public read" on storage.objects;
drop policy if exists "evidence insert" on storage.objects;
drop policy if exists "evidence update" on storage.objects;
drop policy if exists "evidence delete" on storage.objects;

create policy "evidence public read"
  on storage.objects for select
  using (bucket_id = 'evidence');

create policy "evidence insert"
  on storage.objects for insert
  with check (bucket_id = 'evidence');

create policy "evidence update"
  on storage.objects for update
  using (bucket_id = 'evidence');

create policy "evidence delete"
  on storage.objects for delete
  using (bucket_id = 'evidence');
