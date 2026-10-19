import { NextRequest, NextResponse } from "next/server";
import {
  NOT_CONFIGURED_MESSAGE,
  generateDocumentMerchantOid,
  generateVerifyCode,
  getClientIp,
  getEligibility,
  getServiceSupabase,
  isDocumentSystemConfigured,
  normalizeUsername,
  validatePersonal,
  verifyStudentPassword,
} from "@/lib/documents/server";
import { clearAttempts, recordFailedAttempt, tooManyAttempts } from "@/lib/documents/render";
import { LIVE_WEEKLY_HOURS, STUDENT_DOCUMENT_PRICE_KURUS } from "@/lib/documents/config";
import { buildGetTokenHash, callPaytrGetToken, getPaytrCredentials } from "@/lib/billing/paytr";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://almancaokulum.com";

// Öğrenci belge talebi: bilgiler + hesap şifresi sunucuda doğrulanır, bekleyen
// belge kaydı açılır ve PayTR ödeme token'ı döner. Belge ancak PayTR'nin
// imzalı (hash doğrulanmış) "success" bildirimi gelince geçerli hale gelir.
export async function POST(req: NextRequest) {
  try {
    if (!isDocumentSystemConfigured()) {
      return NextResponse.json({ status: "error", reason: NOT_CONFIGURED_MESSAGE }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const username = normalizeUsername(body?.username);
    const password = String(body?.password || "");
    const level = String(body?.level || "").toUpperCase();
    const ip = getClientIp(req.headers);
    const attemptKey = `${ip}|${username}`;

    if (!username) return NextResponse.json({ status: "error", reason: "Lütfen tekrar giriş yapın." }, { status: 400 });
    if (tooManyAttempts(attemptKey)) {
      return NextResponse.json({ status: "error", reason: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." }, { status: 429 });
    }
    if (!(await verifyStudentPassword(username, password))) {
      recordFailedAttempt(attemptKey);
      return NextResponse.json({ status: "error", reason: "Hesap şifreniz hatalı." }, { status: 401 });
    }
    clearAttempts(attemptKey);

    const personal = validatePersonal(body);
    if (!personal.ok) return NextResponse.json({ status: "error", reason: personal.reason }, { status: 400 });

    const eligibility = await getEligibility(username);
    const levelInfo = eligibility.levels.find((l) => l.level === level && l.active);
    if (!levelInfo) {
      const reason =
        eligibility.reason === "starter_only"
          ? "Öğrenci belgesi Başlangıç paketinde verilmiyor. Belge almak için Gelişim, Zirve veya Canlı Kurs paketine geçebilirsiniz."
          : "Bu seviye için aktif bir kurs kaydınız bulunamadı.";
      return NextResponse.json({ status: "error", reason, code: eligibility.reason }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { data: userRow } = await db.from("users").select("email, name").eq("email", username).maybeSingle();
    if (!userRow) return NextResponse.json({ status: "error", reason: "Kullanıcı bulunamadı." }, { status: 400 });

    const merchantOid = generateDocumentMerchantOid();
    const verifyCode = generateVerifyCode();

    const { error: insertError } = await db.from("student_documents").insert({
      verify_code: verifyCode,
      username,
      full_name: personal.value.fullName,
      birth_date: personal.value.birthDate,
      birth_place: personal.value.birthPlace,
      language: personal.value.language,
      level: levelInfo.level,
      course_type: levelInfo.courseType,
      course_start: levelInfo.courseStart,
      course_end: levelInfo.courseEnd,
      weekly_hours: levelInfo.courseType === "live" ? LIVE_WEEKLY_HOURS : null,
      status: "pending_payment",
      source: "paid",
      merchant_oid: merchantOid,
      amount: STUDENT_DOCUMENT_PRICE_KURUS,
    });
    if (insertError) {
      console.error("[belge/talep] insert", insertError);
      return NextResponse.json({ status: "error", reason: "Belge talebi kaydedilemedi." }, { status: 500 });
    }

    const { merchantId, merchantKey, merchantSalt } = getPaytrCredentials();
    const label = `Öğrenci Belgesi (${levelInfo.level})`;
    const userBasketBase64 = Buffer.from(
      JSON.stringify([[label, (STUDENT_DOCUMENT_PRICE_KURUS / 100).toFixed(2), 1]])
    ).toString("base64");
    const currency = "TL";
    const testMode = process.env.PAYTR_TEST_MODE === "1" ? 1 : 0;

    const paytrToken = buildGetTokenHash({
      merchantId,
      userIp: ip,
      merchantOid,
      email: userRow.email,
      paymentAmount: STUDENT_DOCUMENT_PRICE_KURUS,
      userBasketBase64,
      noInstallment: 0,
      maxInstallment: 0,
      currency,
      testMode,
      merchantSalt,
      merchantKey,
    });

    const paytrRes = await callPaytrGetToken({
      merchant_id: merchantId,
      user_ip: ip,
      merchant_oid: merchantOid,
      email: userRow.email,
      payment_amount: String(STUDENT_DOCUMENT_PRICE_KURUS),
      paytr_token: paytrToken,
      user_basket: userBasketBase64,
      debug_on: "0",
      no_installment: "0",
      max_installment: "0",
      user_name: userRow.name || personal.value.fullName,
      user_address: "Türkiye",
      user_phone: "05000000000",
      merchant_ok_url: `${SITE_URL}/odeme/basarili?oid=${merchantOid}`,
      merchant_fail_url: `${SITE_URL}/odeme/basarisiz?oid=${merchantOid}`,
      timeout_limit: "30",
      currency,
      test_mode: String(testMode),
      lang: "tr",
    });

    if (paytrRes.status !== "success") {
      await db.from("student_documents").update({ status: "cancelled" }).eq("merchant_oid", merchantOid);
      return NextResponse.json(
        { status: "error", reason: (paytrRes as any).reason || "Ödeme başlatılamadı." },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "success", token: (paytrRes as any).token, merchantOid });
  } catch (err: any) {
    console.error("[belge/talep]", err);
    return NextResponse.json({ status: "error", reason: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
