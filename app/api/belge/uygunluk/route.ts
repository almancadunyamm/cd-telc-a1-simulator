import { NextRequest, NextResponse } from "next/server";
import {
  NOT_CONFIGURED_MESSAGE,
  getEligibility,
  isDocumentSystemConfigured,
  normalizeUsername,
} from "@/lib/documents/server";
import { STUDENT_DOCUMENT_PRICE_TL } from "@/lib/documents/config";

export const runtime = "nodejs";

// Öğrencinin belge alıp alamayacağını döner. Kişisel veri içermez.
export async function POST(req: NextRequest) {
  try {
    if (!isDocumentSystemConfigured()) {
      return NextResponse.json({ status: "unavailable", reason: NOT_CONFIGURED_MESSAGE });
    }
    const body = await req.json().catch(() => ({}));
    const username = normalizeUsername(body?.username);
    if (!username) return NextResponse.json({ status: "error", reason: "Kullanıcı bulunamadı." }, { status: 400 });

    const result = await getEligibility(username);
    return NextResponse.json({
      status: "success",
      price: STUDENT_DOCUMENT_PRICE_TL,
      eligible: result.eligible,
      reason: result.reason,
      levels: result.levels.map((l) => ({
        level: l.level,
        courseType: l.courseType,
        courseStart: l.courseStart,
        courseEnd: l.courseEnd,
        active: l.active,
      })),
    });
  } catch (err: any) {
    console.error("[belge/uygunluk]", err);
    return NextResponse.json({ status: "error", reason: "Belge bilgisi alınamadı." }, { status: 500 });
  }
}
