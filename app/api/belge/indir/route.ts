import { NextRequest, NextResponse } from "next/server";
import {
  NOT_CONFIGURED_MESSAGE,
  checkAdminSecret,
  getClientIp,
  getServiceSupabase,
  isDocumentSystemConfigured,
  normalizeUsername,
  verifyStudentPassword,
} from "@/lib/documents/server";
import { clearAttempts, pdfResponse, recordFailedAttempt, renderDocumentRow, tooManyAttempts } from "@/lib/documents/render";

export const runtime = "nodejs";

// Belge PDF'i: öğrenci (kendi hesabı + şifresi) veya admin (admin belge şifresi).
export async function POST(req: NextRequest) {
  try {
    if (!isDocumentSystemConfigured()) {
      return NextResponse.json({ status: "error", reason: NOT_CONFIGURED_MESSAGE }, { status: 503 });
    }
    const body = await req.json().catch(() => ({}));
    const id = String(body?.id || "");
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ status: "error", reason: "Belge bulunamadı." }, { status: 400 });
    }

    const isAdmin = body?.adminSecret ? checkAdminSecret(body.adminSecret) : false;
    const username = normalizeUsername(body?.username);
    const key = `${getClientIp(req.headers)}|${isAdmin ? "admin" : username}`;

    if (!isAdmin) {
      if (body?.adminSecret) {
        return NextResponse.json({ status: "error", reason: "Admin belge şifresi hatalı." }, { status: 401 });
      }
      if (tooManyAttempts(key)) {
        return NextResponse.json({ status: "error", reason: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." }, { status: 429 });
      }
      if (!(await verifyStudentPassword(username, String(body?.password || "")))) {
        recordFailedAttempt(key);
        return NextResponse.json({ status: "error", reason: "Hesap şifreniz hatalı." }, { status: 401 });
      }
      clearAttempts(key);
    }

    const { data: row, error } = await getServiceSupabase()
      .from("student_documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!row || (!isAdmin && row.username !== username)) {
      return NextResponse.json({ status: "error", reason: "Belge bulunamadı." }, { status: 404 });
    }
    if (row.status !== "issued" && !(isAdmin && row.status === "revoked")) {
      return NextResponse.json(
        { status: "error", reason: row.status === "pending_payment" ? "Ödeme onayı bekleniyor." : "Bu belge geçerli değil." },
        { status: 400 }
      );
    }

    const bytes = await renderDocumentRow(row);
    return pdfResponse(bytes, row);
  } catch (err: any) {
    console.error("[belge/indir]", err);
    return NextResponse.json({ status: "error", reason: "Belge oluşturulamadı." }, { status: 500 });
  }
}
