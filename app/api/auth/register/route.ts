import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase, isDocumentSystemConfigured, normalizeUsername } from "@/lib/documents/server";
import { hashPassword } from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Yeni öğrenci kaydı: şifre sunucuda scrypt ile özetlenip saklanır.
export async function POST(req: NextRequest) {
  if (!isDocumentSystemConfigured()) {
    return NextResponse.json({ status: "fallback" }, { status: 503 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim();
    const email = normalizeUsername(body?.email);
    const password = String(body?.password || "").trim();
    const isActive = body?.isActive === true;

    if (!name || !email || !password) {
      return NextResponse.json({ status: "error", reason: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ status: "error", reason: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }
    if (name.length > 120 || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ status: "error", reason: "Lütfen geçerli bir ad ve email girin." }, { status: 400 });
    }

    const db = getServiceSupabase();
    const { data: existing, error: exErr } = await db.from("users").select("id").eq("email", email).limit(1);
    if (exErr) throw exErr;
    if (existing && existing.length > 0) {
      return NextResponse.json({ status: "error", reason: "Bu email ile daha önce kayıt yapılmış." }, { status: 409 });
    }

    const { error: insErr } = await db.from("users").insert({
      name,
      email,
      password: hashPassword(password),
      role: "student",
      is_active: isActive,
    });
    if (insErr) throw insErr;

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("[auth/register]", err?.message || err);
    return NextResponse.json({ status: "error", reason: "Kayıt oluşturulamadı." }, { status: 500 });
  }
}
