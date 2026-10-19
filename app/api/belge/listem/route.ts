import { NextRequest, NextResponse } from "next/server";
import {
  NOT_CONFIGURED_MESSAGE,
  getClientIp,
  getServiceSupabase,
  isDocumentSystemConfigured,
  normalizeUsername,
  publicDocumentSummary,
  verifyStudentPassword,
} from "@/lib/documents/server";
import { clearAttempts, recordFailedAttempt, tooManyAttempts } from "@/lib/documents/render";

export const runtime = "nodejs";

// Öğrencinin kendi belgeleri (hesap şifresi ile).
export async function POST(req: NextRequest) {
  try {
    if (!isDocumentSystemConfigured()) {
      return NextResponse.json({ status: "error", reason: NOT_CONFIGURED_MESSAGE }, { status: 503 });
    }
    const body = await req.json().catch(() => ({}));
    const username = normalizeUsername(body?.username);
    const password = String(body?.password || "");
    const key = `${getClientIp(req.headers)}|${username}`;

    if (tooManyAttempts(key)) {
      return NextResponse.json({ status: "error", reason: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." }, { status: 429 });
    }
    if (!(await verifyStudentPassword(username, password))) {
      recordFailedAttempt(key);
      return NextResponse.json({ status: "error", reason: "Hesap şifreniz hatalı." }, { status: 401 });
    }
    clearAttempts(key);

    const { data, error } = await getServiceSupabase()
      .from("student_documents")
      .select("*")
      .eq("username", username)
      .in("status", ["issued", "revoked", "pending_payment"])
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;

    // Bir saatten eski "ödeme bekliyor" kayıtları (yarıda bırakılan ödemeler) gösterilmez.
    const cutoff = Date.now() - 60 * 60 * 1000;
    const docs = (data || []).filter(
      (r: any) => r.status !== "pending_payment" || new Date(r.created_at).getTime() > cutoff
    );
    return NextResponse.json({ status: "success", documents: docs.map(publicDocumentSummary) });
  } catch (err: any) {
    console.error("[belge/listem]", err);
    return NextResponse.json({ status: "error", reason: "Belgeler alınamadı." }, { status: 500 });
  }
}
