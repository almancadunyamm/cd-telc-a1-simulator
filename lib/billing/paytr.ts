import crypto from "crypto";

// PayTR iFrame API — resmi entegrasyon dokümanının (dev.paytr.com/en/iframe-api)
// PHP/C#/Node.js örneklerinde birebir aynı şekilde geçen formüller.
// BURADAKİ ALGORİTMAYI DEĞİŞTİRMEDEN ÖNCE PayTR panelindeki resmi dokümanla
// karşılaştır — ödeme güvenliği doğrudan buna bağlı.

const GET_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Eksik environment variable: ${name}`);
  }
  return value;
}

export function getPaytrCredentials() {
  return {
    merchantId: requireEnv("PAYTR_MERCHANT_ID"),
    merchantKey: requireEnv("PAYTR_MERCHANT_KEY"),
    merchantSalt: requireEnv("PAYTR_MERCHANT_SALT"),
  };
}

export function buildGetTokenHash(params: {
  merchantId: string;
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number;
  userBasketBase64: string;
  noInstallment: number;
  maxInstallment: number;
  currency: string;
  testMode: number;
  merchantSalt: string;
  merchantKey: string;
}): string {
  const hashStr =
    String(params.merchantId) +
    String(params.userIp) +
    String(params.merchantOid) +
    String(params.email) +
    String(params.paymentAmount) +
    String(params.userBasketBase64) +
    String(params.noInstallment) +
    String(params.maxInstallment) +
    String(params.currency) +
    String(params.testMode) +
    String(params.merchantSalt);

  return crypto
    .createHmac("sha256", params.merchantKey)
    .update(hashStr)
    .digest("base64");
}

export function buildCallbackHash(params: {
  merchantOid: string;
  merchantSalt: string;
  status: string;
  totalAmount: string;
  merchantKey: string;
}): string {
  const hashStr =
    String(params.merchantOid) +
    String(params.merchantSalt) +
    String(params.status) +
    String(params.totalAmount);

  return crypto
    .createHmac("sha256", params.merchantKey)
    .update(hashStr)
    .digest("base64");
}

// merchant_oid: PayTR'nin gereksinimi "her işlemde benzersiz" olması —
// güvenli tarafta kalmak için sadece harf/rakam kullanıyoruz.
export function generateMerchantOid(): string {
  const random = crypto.randomBytes(6).toString("hex");
  return `AO${Date.now()}${random}`.toUpperCase();
}

export async function callPaytrGetToken(formFields: Record<string, string>) {
  const body = new URLSearchParams(formFields).toString();

  const res = await fetch(GET_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as
    | { status: "success"; token: string }
    | { status: string; reason?: string };

  return json;
}