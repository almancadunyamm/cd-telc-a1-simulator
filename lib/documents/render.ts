import { renderStudentDocumentPdf } from "@/lib/documents/pdf";
import { toIstanbulDate } from "@/lib/documents/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://almancaokulum.com").replace(/\/+$/, "");

export function buildVerifyUrl(code: string): string {
  return `${SITE_URL}/belge-dogrula/${code}`;
}

export async function renderDocumentRow(row: any): Promise<Uint8Array> {
  return renderStudentDocumentPdf({
    documentNo: row.document_no,
    verifyCode: row.verify_code,
    issuedAt: toIstanbulDate(row.issued_at || row.created_at),
    fullName: row.full_name,
    birthDate: row.birth_date,
    birthPlace: row.birth_place,
    language: row.language === "de" ? "de" : "tr",
    level: row.level,
    courseType: row.course_type === "live" ? "live" : "digital",
    courseStart: row.course_start,
    courseEnd: row.course_end,
    weeklyHours: row.weekly_hours ?? null,
    verifyUrl: buildVerifyUrl(row.verify_code),
    revoked: row.status === "revoked",
  });
}

export function pdfResponse(bytes: Uint8Array, row: any): Response {
  const name = `${row.language === "de" ? "Kursbescheinigung" : "Kursiyer-Belgesi"}-${row.document_no}.pdf`;
  return new Response(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}

// Basit, en iyi çaba deneme sınırı (yanlış şifre denemelerini yavaşlatır).
const attempts = new Map<string, { count: number; until: number }>();
export function tooManyAttempts(key: string): boolean {
  const a = attempts.get(key);
  return Boolean(a && a.count >= 8 && a.until > Date.now());
}
export function recordFailedAttempt(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.until < now) attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  else a.count += 1;
}
export function clearAttempts(key: string) {
  attempts.delete(key);
}
