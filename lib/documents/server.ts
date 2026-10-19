import crypto from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getLevelsFromProductSlug } from "@/lib/billing/levels";
import {
  DOCUMENT_COURSE_MONTHS,
  DOCUMENT_MERCHANT_OID_PREFIX,
  type DocumentCourseType,
  type DocumentLevel,
} from "@/lib/documents/config";

// ── Gizli anahtarla çalışan Supabase istemcisi ────────────────────────────
// student_documents tablosunda RLS açık ve policy yok; yalnızca service_role
// anahtarı erişebilir. Anahtar sadece sunucuda (Vercel env) bulunur, tarayıcıya
// asla gönderilmez (NEXT_PUBLIC_ öneki YOK).
let cachedAdmin: SupabaseClient | null = null;

export function isDocumentSystemConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Belge sistemi yapılandırılmamış (SUPABASE_SERVICE_ROLE_KEY eksik).");
  }
  if (!cachedAdmin) {
    cachedAdmin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return cachedAdmin;
}

export const NOT_CONFIGURED_MESSAGE =
  "Öğrenci belgesi sistemi şu an hazırlanıyor. Lütfen daha sonra tekrar deneyin.";

// ── Yardımcılar ───────────────────────────────────────────────────────────
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function normalizeUsername(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

// Admin işlemleri için sunucuda kontrol edilen ayrı şifre (Vercel env: ADMIN_DOCUMENT_SECRET).
// Admin girişinin kendisi tarayıcıda yapıldığı için ona güvenilemez.
export function checkAdminSecret(secret: unknown): boolean {
  const expected = process.env.ADMIN_DOCUMENT_SECRET || "";
  if (expected.length < 8) return false;
  return safeEqual(String(secret || ""), expected);
}

// Öğrencinin kendi belgesine erişimi için hesap şifresini sunucuda doğrularız.
// (Sitede oturum bilgisi yalnızca tarayıcıda tutulduğundan kullanıcı adına tek
// başına güvenilemez; belgede doğum tarihi/yeri gibi kişisel veriler var.)
export async function verifyStudentPassword(username: string, password: string): Promise<boolean> {
  if (!username || !password) return false;
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("users")
    .select("email, password")
    .eq("email", username)
    .maybeSingle();
  if (error || !data) return false;
  return safeEqual(String(data.password || "").trim(), String(password).trim());
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // karışan 0/O/1/I yok
export function generateVerifyCode(length = 12): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

export function generateDocumentMerchantOid(): string {
  return `${DOCUMENT_MERCHANT_OID_PREFIX}${Date.now()}${crypto.randomBytes(5).toString("hex")}`.toUpperCase();
}

// Tarihleri İstanbul saatine göre "YYYY-MM-DD" olarak üretir.
export function toIstanbulDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function addMonthsIso(iso: string, months: number): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

// ── Uygunluk ──────────────────────────────────────────────────────────────
// Belge alabilenler: ücretli dijital paket (Gelişim/Zirve) veya canlı kurs
// siparişi tamamlanmış ve o seviyedeki erişim süresi dolmamış öğrenciler.
// Başlangıç (ücretsiz) paketi, Konuşma Kulübü ve test siparişleri sayılmaz.
function orderKind(slug: string): { type: DocumentCourseType; months: number } | null {
  const s = slug.toLowerCase();
  if (s.startsWith("live-")) return { type: "live", months: 6 };
  if (s.endsWith("-master")) return { type: "digital", months: 12 };
  if (s.endsWith("-practice")) return { type: "digital", months: 6 };
  return null;
}

export type LevelEligibility = {
  level: DocumentLevel;
  courseType: DocumentCourseType;
  courseStart: string; // YYYY-MM-DD
  courseEnd: string; // courseStart + 3 ay
  accessEnd: string;
  active: boolean;
};

export type EligibilityResult = {
  eligible: boolean;
  reason: "ok" | "starter_only" | "expired" | "no_package" | "user_not_found";
  levels: LevelEligibility[];
};

export async function getEligibility(username: string): Promise<EligibilityResult> {
  const db = getServiceSupabase();

  const { data: user } = await db.from("users").select("email").eq("email", username).maybeSingle();
  if (!user) return { eligible: false, reason: "user_not_found", levels: [] };

  const { data: orders, error } = await db
    .from("orders")
    .select("product_slug, status, created_at")
    .eq("username", username)
    .eq("status", "completed");
  if (error) throw new Error("Siparişler okunamadı: " + error.message);

  const today = toIstanbulDate(new Date());
  const byLevel = new Map<DocumentLevel, { latest: string; accessEnd: string; live: boolean }>();
  let hasStarter = false;

  for (const o of orders || []) {
    const slug = String(o.product_slug || "");
    if (slug.toLowerCase().endsWith("-starter")) hasStarter = true;
    const kind = orderKind(slug);
    if (!kind || !o.created_at) continue;
    const start = toIstanbulDate(o.created_at);
    const end = addMonthsIso(start, kind.months);
    for (const level of getLevelsFromProductSlug(slug) as DocumentLevel[]) {
      const prev = byLevel.get(level);
      byLevel.set(level, {
        latest: !prev || start > prev.latest ? start : prev.latest,
        accessEnd: !prev || end > prev.accessEnd ? end : prev.accessEnd,
        live: Boolean(prev?.live) || kind.type === "live",
      });
    }
  }

  const levels: LevelEligibility[] = (["A1", "A2", "B1"] as DocumentLevel[])
    .filter((l) => byLevel.has(l))
    .map((level) => {
      const info = byLevel.get(level)!;
      return {
        level,
        courseType: info.live ? "live" : "digital",
        courseStart: info.latest,
        courseEnd: addMonthsIso(info.latest, DOCUMENT_COURSE_MONTHS),
        accessEnd: info.accessEnd,
        active: info.accessEnd >= today,
      };
    });

  if (levels.some((l) => l.active)) return { eligible: true, reason: "ok", levels };
  if (levels.length > 0) return { eligible: false, reason: "expired", levels };
  if (hasStarter) return { eligible: false, reason: "starter_only", levels };
  return { eligible: false, reason: "no_package", levels };
}

// ── Form doğrulama ────────────────────────────────────────────────────────
export type PersonalInput = {
  fullName: string;
  birthDate: string;
  birthPlace: string;
  language: "tr" | "de";
};

export function validatePersonal(body: any): { ok: true; value: PersonalInput } | { ok: false; reason: string } {
  const fullName = String(body?.fullName || "").replace(/\s+/g, " ").trim();
  const birthPlace = String(body?.birthPlace || "").replace(/\s+/g, " ").trim();
  const birthDate = String(body?.birthDate || "").trim();
  const language = body?.language === "de" ? "de" : body?.language === "tr" ? "tr" : null;

  if (fullName.length < 3 || fullName.length > 80 || !fullName.includes(" "))
    return { ok: false, reason: "Lütfen adınızı ve soyadınızı eksiksiz yazın." };
  if (birthPlace.length < 2 || birthPlace.length > 60)
    return { ok: false, reason: "Lütfen doğum yerinizi yazın." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return { ok: false, reason: "Lütfen geçerli bir doğum tarihi girin." };
  const year = Number(birthDate.slice(0, 4));
  const now = new Date().getFullYear();
  if (Number.isNaN(Date.parse(birthDate)) || year < now - 100 || year > now - 5)
    return { ok: false, reason: "Lütfen geçerli bir doğum tarihi girin." };
  if (!language) return { ok: false, reason: "Lütfen belge dilini seçin." };

  return { ok: true, value: { fullName, birthDate, birthPlace, language } };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

// Öğrenciye/admin'e dönülen belge özeti (doğrulama kodu hariç kişisel olmayan alanlar + id)
export function publicDocumentSummary(row: any) {
  return {
    id: row.id,
    documentNo: row.document_no,
    level: row.level,
    language: row.language,
    courseType: row.course_type,
    status: row.status,
    issuedAt: row.issued_at,
    createdAt: row.created_at,
  };
}
