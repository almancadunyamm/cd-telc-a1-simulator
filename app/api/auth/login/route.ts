import { NextRequest, NextResponse } from "next/server";
import { getClientIp, getServiceSupabase, isDocumentSystemConfigured, normalizeUsername } from "@/lib/documents/server";
import {
  clearLoginAttempts,
  hashPassword,
  isHashed,
  recordFailedLogin,
  tooManyLoginAttempts,
  verifyPassword,
} from "@/lib/auth/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Öğrenci / öğretmen girişi. Şifre sunucuda doğrulanır; tarayıcıya şifre (özet dahil) asla dönmez.
// Eski açık metin şifreler doğru girildiğinde otomatik olarak scrypt özetine çevrilir.
export async function POST(req: NextRequest) {
  if (!isDocumentSystemConfigured()) {
    // Sunucu anahtarı yoksa istemci eski yönteme düşer.
    return NextResponse.json({ status: "fallback" }, { status: 503 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeUsername(body?.email);
    const password = String(body?.password || "");
    if (!email || !password) {
      return NextResponse.json({ status: "error", reason: "Email ve şifre zorunlu." }, { status: 400 });
    }

    const key = `${getClientIp(req.headers)}|${email}`;
    if (tooManyLoginAttempts(key)) {
      return NextResponse.json(
        { status: "error", reason: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    // Sabit yönetici hesapları (önceden tarayıcı kodunda açıkça duruyordu; artık yalnızca sunucuda).
    const LEGACY_ADMINS: Record<string, { username: string; label: string; name?: string }> = {
      "admin@test.com": { username: "admin", label: "Admin" },
      "almancadunyamm@gmail.com": { username: "almancadunyamm@gmail.com", label: "Almanca Dünyam Admin", name: "Almanca Dünyam" },
    };
    const legacyAdmin = LEGACY_ADMINS[email];
    if (legacyAdmin && password.trim() === "123456") {
      clearLoginAttempts(key);
      return NextResponse.json({ status: "success", admin: legacyAdmin });
    }

    const db = getServiceSupabase();
    const { data: user, error } = await db
      .from("users")
      .select("id, email, name, role, password")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (error) throw error;

    if (!user || !verifyPassword(password, user.password)) {
      recordFailedLogin(key);
      return NextResponse.json(
        { status: "error", reason: "Kayıt bulunamadı. Lütfen önce kayıt olun veya bilgilerinizi kontrol edin." },
        { status: 401 }
      );
    }
    clearLoginAttempts(key);

    if (!isHashed(user.password)) {
      const { error: upErr } = await db.from("users").update({ password: hashPassword(password.trim()) }).eq("id", user.id);
      if (upErr) console.error("[auth/login] rehash", upErr.message);
    }

    return NextResponse.json({
      status: "success",
      user: { email: user.email, name: user.name, role: user.role || "student" },
    });
  } catch (err: any) {
    console.error("[auth/login]", err?.message || err);
    return NextResponse.json({ status: "error", reason: "Giriş kontrolü yapılamadı." }, { status: 500 });
  }
}
