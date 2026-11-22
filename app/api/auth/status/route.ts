import { NextResponse } from "next/server";
import { isDocumentSystemConfigured } from "@/lib/documents/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sunucu tarafı giriş/kayıt sisteminin hazır olup olmadığını söyler (gizli bilgi döndürmez).
export async function GET() {
  return NextResponse.json({ serverAuth: isDocumentSystemConfigured() });
}
