-- Deneme Dersi (Instagram reklamı) — 11 Ekim 2026
-- Supabase → SQL Editor'da bir kez çalıştırın. Tekrar çalıştırmak güvenlidir.

-- 1) Deneme dersi başvuruları (ad + telefon)
create table if not exists public.trial_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  source text,                       -- örn. utm_source=instagram
  status text not null default 'yeni', -- yeni | arandi | kayit_oldu | ilgilenmiyor
  admin_note text
);

alter table public.trial_leads enable row level security;

-- Site, diğer tablolarda olduğu gibi anon anahtarla çalışıyor.
drop policy if exists "trial_leads_insert" on public.trial_leads;
create policy "trial_leads_insert" on public.trial_leads
  for insert to anon, authenticated with check (true);

drop policy if exists "trial_leads_select" on public.trial_leads;
create policy "trial_leads_select" on public.trial_leads
  for select to anon, authenticated using (true);

drop policy if exists "trial_leads_update" on public.trial_leads;
create policy "trial_leads_update" on public.trial_leads
  for update to anon, authenticated using (true) with check (true);

-- 2) "Deneme Sınıfı" (class_type = 'trial')
-- Uzman öğretmene (users.teacher_type = 'expertTeacher') bağlanır; öğretmen
-- panelinde bu sınıfı seçip örnek dersi yükler. Öğretmeni daha sonra
-- Admin → Sınıf Yönetimi'nden değiştirebilirsiniz.
insert into public.classes (name, level, teacher_id, teacher_name, is_default_sales_class, class_type)
select 'Deneme Sınıfı', 'A1', lower(trim(u.email)), u.name, false, 'trial'
from public.users u
where u.role = 'teacher'
  and u.teacher_type = 'expertTeacher'
  and not exists (select 1 from public.classes c where c.class_type = 'trial')
order by u.email
limit 1;

-- Kontrol:
select id, name, level, teacher_id, teacher_name, class_type from public.classes where class_type = 'trial';
