// Öğrenci Belgesi — hem istemci hem sunucuda kullanılabilen sabitler.
// Fiyat BURADA tanımlıdır ve yalnızca sunucuda okunarak PayTR'ye gönderilir;
// istemciden gelen hiçbir tutara güvenilmez. Bu ürün bilerek PRICING_CATALOG'a
// eklenmedi: genel /api/paytr/get-token akışından satın alınamaz, `orders`
// tablosuna yazılmaz ve erişim süresi / paket hesaplarını hiç etkilemez.

export const STUDENT_DOCUMENT_PRICE_TL = 1000;
export const STUDENT_DOCUMENT_PRICE_KURUS = STUDENT_DOCUMENT_PRICE_TL * 100;

// Belgede yazan kurs süresi: başlangıçtan itibaren 3 ay (kullanıcı kararı, 19.10.2026)
export const DOCUMENT_COURSE_MONTHS = 3;
// Canlı kursta haftalık ders saati (1 ders saati = 45 dk). Dijitalde yazılmaz.
export const LIVE_WEEKLY_HOURS = 9;

// PayTR sipariş numarası bu önekle başlarsa callback onu belge siparişi olarak işler.
export const DOCUMENT_MERCHANT_OID_PREFIX = "BLG";

export type DocumentLanguage = "tr" | "de";
export type DocumentLevel = "A1" | "A2" | "B1";
export type DocumentCourseType = "live" | "digital";

export function formatVerifyCode(code: string): string {
  const c = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.match(/.{1,4}/g)?.join("-") || c;
}

export function normalizeVerifyCode(input: string): string {
  return String(input || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// "2026-10-19" → "19.10.2026"
export function formatDateDot(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  if (!y || !m || !d) return String(iso);
  return `${d}.${m}.${y}`;
}
