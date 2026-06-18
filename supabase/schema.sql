-- ENCC Requirements Hub — run once in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists section_reviews (
  module_id text not null,
  section_id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (module_id, section_id)
);

create table if not exists evidence_items (
  id text primary key,
  module_id text not null,
  section_id text not null,
  title text not null,
  description text,
  filename text not null,
  uploaded_at timestamptz not null default now()
);

create index if not exists evidence_items_module_section_idx
  on evidence_items (module_id, section_id);

-- Storage bucket for uploaded evidence files (public read)
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
