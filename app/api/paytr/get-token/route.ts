import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getPricedProduct, isFreeProduct } from "@/lib/billing/pricing";
import { getLevelsFromProductSlug } from "@/lib/billing/levels";
import {
  buildGetTokenHash,
  callPaytrGetToken,
  generateMerchantOid,
  getPaytrCredentials,
} from "@/lib/billing/paytr";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://almancaokulum.com";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").toLowerCase().trim();
    const username = String(body?.username || "").trim().toLowerCase();

    if (!slug || !username) {
      return NextResponse.json(
        { status: "error", reason: "slug ve username zorunludur." },
        { status: 400 }
      );
    }

    const product = getPricedProduct(slug);

    if (!product) {
      return NextResponse.json(
        { status: "error", reason: `Tanımsız ürün: ${slug}` },
        { status: 400 }
      );
    }

    if (isFreeProduct(slug)) {
      return NextResponse.json(
        { status: "error", reason: "Bu ürün ücretsiz, ödeme akışı gerekmez." },
        { status: 400 }
      );
    }

    // Kullanıcıyı doğrula — var olmayan/emin olunmayan bir kullanıcı adına
    // sipariş açılmasın.
    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("email, name")
      .eq("email", username)
      .maybeSingle();

    if (userError || !userRow) {
      return NextResponse.json(
        { status: "error", reason: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın." },
        { status: 400 }
      );
    }

    const { merchantId, merchantKey, merchantSalt } = getPaytrCredentials();

    const merchantOid = generateMerchantOid();
    const userIp = getClientIp(req);
    const userBasket = [[product.label, (product.amountKurus / 100).toFixed(2), 1]];
    const userBasketBase64 = Buffer.from(JSON.stringify(userBasket)).toString("base64");
    const currency = "TL";
    const testMode = process.env.PAYTR_TEST_MODE === "1" ? 1 : 0;
    const noInstallment = 0;
    const maxInstallment = 0;

    const paytrToken = buildGetTokenHash({
      merchantId,
      userIp,
      merchantOid,
      email: userRow.email,
      paymentAmount: product.amountKurus,
      userBasketBase64,
      noInstallment,
      maxInstallment,
      currency,
      testMode,
      merchantSalt,
      merchantKey,
    });

    const paytrRes = await callPaytrGetToken({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userRow.email,
      payment_amount: String(product.amountKurus),
      paytr_token: paytrToken,
      user_basket: userBasketBase64,
      debug_on: "0",
      no_installment: String(noInstallment),
      max_installment: String(maxInstallment),
      user_name: userRow.name || userRow.email,
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
      return NextResponse.json(
        { status: "error", reason: (paytrRes as any).reason || "PayTR token alınamadı." },
        { status: 400 }
      );
    }

    const levels = getLevelsFromProductSlug(slug);

    const { error: insertError } = await supabase.from("orders").insert({
      username,
      product_slug: slug,
      level: levels[0] || null,
      status: "pending_payment",
      merchant_oid: merchantOid,
      amount: product.amountKurus,
      currency,
    });

    if (insertError) {
      return NextResponse.json(
        { status: "error", reason: "Sipariş kaydedilemedi: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success", token: (paytrRes as any).token, merchantOid });
  } catch (err: any) {
    console.error("[paytr/get-token]", err);
    return NextResponse.json(
      { status: "error", reason: err?.message || "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}