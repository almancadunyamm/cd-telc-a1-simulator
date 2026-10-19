-- Öğrenci Belgesi (Kursiyer Belgesi / Kursbescheinigung) — 19 Ekim 2026
-- Supabase → SQL Editor'da BİR KEZ çalıştırın.
--
-- GÜVENLİK: Tabloda RLS açık ve HİÇBİR policy yok. Yani sitenin herkese açık
-- anon anahtarıyla bu tablo okunamaz, yazılamaz, değiştirilemez. Belgeyi
-- yalnızca sunucu (Vercel'deki gizli SUPABASE_SERVICE_ROLE_KEY ile) oluşturur,
-- okur ve iptal eder. Böylece kimse tarayıcıdan sahte "geçerli" belge yazamaz.

create sequence if not exists public.student_document_no_seq start 1;

create table if not exists public.student_documents (
  id               uuid primary key default gen_random_uuid(),
  document_no      text unique not null
                   default ('AO-' || to_char(now() at time zone 'Europe/Istanbul', 'YYYY') || '-'
                            || lpad(nextval('public.student_document_no_seq')::text, 5, '0')),
  verify_code      text unique not null,          -- karekoddaki tahmin edilemez kod
  username         text not null,                 -- öğrencinin e-postası (users.email)
  full_name        text not null,
  birth_date       date not null,
  birth_place      text not null,
  language         text not null check (language in ('tr', 'de')),
  level            text not null check (level in ('A1', 'A2', 'B1')),
  course_type      text not null check (course_type in ('live', 'digital')),
  course_start     date not null,
  course_end       date not null,
  weekly_hours     integer,                       -- canlıda 9, dijitalde boş
  status           text not null default 'pending_payment'
                   check (status in ('pending_payment', 'issued', 'revoked', 'cancelled')),
  source           text not null check (source in ('paid', 'admin')),
  merchant_oid     text unique,                   -- PayTR sipariş no (ücretli belgelerde)
  amount           integer not null default 0,    -- kuruş
  issued_at        timestamptz,
  revoked_at       timestamptz,
  revoke_reason    text,
  created_at       timestamptz not null default now()
);

create index if not exists student_documents_username_idx on public.student_documents (username);

alter table public.student_documents enable row level security;
-- Bilerek policy eklenmiyor (anon / authenticated erişimi tamamen kapalı).
revoke all on public.student_documents from anon, authenticated;
revoke all on sequence public.student_document_no_seq from anon, authenticated;
