import { NextRequest, NextResponse } from "next/server";
import {
  NOT_CONFIGURED_MESSAGE,
  addMonthsIso,
  checkAdminSecret,
  generateVerifyCode,
  getClientIp,
  getEligibility,
  getServiceSupabase,
  isDocumentSystemConfigured,
  normalizeUsername,
  validatePersonal,
} from "@/lib/documents/server";
import { recordFailedAttempt, tooManyAttempts, clearAttempts } from "@/lib/documents/render";
import { DOCUMENT_COURSE_MONTHS, LIVE_WEEKLY_HOURS } from "@/lib/documents/config";

export const runtime = "nodejs";

// Admin belge işlemleri. Her istekte sunucuda kontrol edilen ADMIN_DOCUMENT_SECRET gerekir
// (admin paneli girişi tarayıcıda yapıldığı için tek başına yeterli değil).
export async function POST(req: NextRequest) {
  try {
    if (!isDocumentSystemConfigured()) {
      return NextResponse.json({ status: "error", reason: NOT_CONFIGURED_MESSAGE }, { status: 503 });
    }
    if (!process.env.ADMIN_DOCUMENT_SECRET || process.env.ADMIN_DOCUMENT_SECRET.length < 8) {
      return NextResponse.json(
        { status: "error", reason: "Vercel'de ADMIN_DOCUMENT_SECRET (en az 8 karakter) tanımlı değil." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const key = `${getClientIp(req.headers)}|admin`;
    if (tooManyAttempts(key)) {
      return NextResponse.json({ status: "error", reason: "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin." }, { status: 429 });
    }
    if (!checkAdminSecret(body?.adminSecret)) {
      recordFailedAttempt(key);
      return NextResponse.json({ status: "error", reason: "Admin belge şifresi hatalı." }, { status: 401 });
    }
    clearAttempts(key);

    const db = getServiceSupabase();
    const action = String(body?.action || "list");

    if (action === "list") {
      const { data, error } = await db
        .from("student_documents")
        .select("id, document_no, verify_code, username, full_name, level, language, course_type, status, source, amount, issued_at, created_at, revoke_reason")
        .neq("status", "cancelled")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return NextResponse.json({ status: "success", documents: data || [] });
    }

    if (action === "lookup") {
      const username = normalizeUsername(body?.username);
      const { data: user } = await db.from("users").select("email, name").eq("email", username).maybeSingle();
      if (!user) return NextResponse.json({ status: "error", reason: "Bu e-posta ile kayıtlı öğrenci yok." }, { status: 404 });
      const eligibility = await getEligibility(username);
      return NextResponse.json({ status: "success", user, eligibility });
    }

    if (action === "create") {
      const personal = validatePersonal(body);
      if (!personal.ok) return NextResponse.json({ status: "error", reason: personal.reason }, { status: 400 });

      const username = normalizeUsername(body?.username);
      if (username) {
        const { data: user } = await db.from("users").select("email").eq("email", username).maybeSingle();
        if (!user) return NextResponse.json({ status: "error", reason: "Bu e-posta ile kayıtlı öğrenci yok." }, { status: 400 });
      }
      const level = String(body?.level || "").toUpperCase();
      if (!["A1", "A2", "B1"].includes(level)) return NextResponse.json({ status: "error", reason: "Seviye seçin." }, { status: 400 });
      const courseType = body?.courseType === "live" ? "live" : body?.courseType === "digital" ? "digital" : null;
      if (!courseType) return NextResponse.json({ status: "error", reason: "Eğitim şeklini seçin." }, { status: 400 });
      const courseStart = String(body?.courseStart || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(courseStart) || Number.isNaN(Date.parse(courseStart))) {
        return NextResponse.json({ status: "error", reason: "Kurs başlangıç tarihini girin." }, { status: 400 });
      }

      const { data: row, error } = await db
        .from("student_documents")
        .insert({
          verify_code: generateVerifyCode(),
          username: username || "",
          full_name: personal.value.fullName,
          birth_date: personal.value.birthDate,
          birth_place: personal.value.birthPlace,
          language: personal.value.language,
          level,
          course_type: courseType,
          course_start: courseStart,
          course_end: addMonthsIso(courseStart, DOCUMENT_COURSE_MONTHS),
          weekly_hours: courseType === "live" ? LIVE_WEEKLY_HOURS : null,
          status: "issued",
          source: "admin",
          amount: 0,
          issued_at: new Date().toISOString(),
        })
        .select("id, document_no")
        .single();
      if (error) throw error;
      return NextResponse.json({ status: "success", document: row });
    }

    if (action === "revoke") {
      const id = String(body?.id || "");
      const reason = String(body?.reason || "").trim().slice(0, 200) || null;
      const { error } = await db
        .from("student_documents")
        .update({ status: "revoked", revoked_at: new Date().toISOString(), revoke_reason: reason })
        .eq("id", id)
        .eq("status", "issued");
      if (error) throw error;
      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: "error", reason: "Bilinmeyen işlem." }, { status: 400 });
  } catch (err: any) {
    console.error("[admin/belge]", err);
    return NextResponse.json({ status: "error", reason: "İşlem yapılamadı." }, { status: 500 });
  }
}
