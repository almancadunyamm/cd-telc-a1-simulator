import crypto from "crypto";

// Şifre saklama: scrypt (Node yerleşik, ek paket yok) + kullanıcıya özel rastgele tuz.
// Biçim: scrypt$N$r$p$<tuz base64>$<özet base64>
// Eski kayıtlarda şifre açık metin duruyor; girişte doğrulanınca otomatik olarak
// özete çevrilir (needsRehash). Bu dosya yalnızca sunucuda kullanılır.

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
const PREFIX = "scrypt$";

export function isHashed(stored: unknown): boolean {
  return typeof stored === "string" && stored.startsWith(PREFIX);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 });
  return `${PREFIX}${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Girilen şifreyi saklanan değerle karşılaştırır (özet veya eski açık metin). */
export function verifyPassword(password: string, stored: unknown): boolean {
  if (!password || typeof stored !== "string" || !stored) return false;
  if (isHashed(stored)) {
    const parts = stored.split("$");
    if (parts.length !== 6) return false;
    const [, n, r, p, saltB64, hashB64] = parts;
    const expected = Buffer.from(hashB64, "base64");
    const actual = crypto.scryptSync(password, Buffer.from(saltB64, "base64"), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });
    return safeEqual(actual, expected);
  }
  // Eski açık metin kayıt (kayıt sırasında trim ediliyordu)
  const a = Buffer.from(stored.trim());
  return safeEqual(Buffer.from(password), a) || safeEqual(Buffer.from(password.trim()), a);
}

// Basit, en iyi çaba deneme sınırı (sunucu örneği başına; yanlış şifre denemelerini yavaşlatır).
const attempts = new Map<string, { count: number; until: number }>();
export function tooManyLoginAttempts(key: string): boolean {
  const a = attempts.get(key);
  return Boolean(a && a.count >= 10 && a.until > Date.now());
}
export function recordFailedLogin(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.until < now) attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  else a.count += 1;
}
export function clearLoginAttempts(key: string) {
  attempts.delete(key);
}
