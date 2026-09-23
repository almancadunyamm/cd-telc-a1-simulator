import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildCallbackHash, getPaytrCredentials } from "@/lib/billing/paytr";
import { grantOrderAccess } from "@/lib/billing/grant-access";

export const runtime = "nodejs";

// PayTR'nin panelde "Bildirim Adresi (URL)" olarak tanımlayacağı endpoint.
// PayTR ödeme sonucunu buraya server-to-server POST eder; PayTR'ye ancak
// hash doğrulanıp sipariş işlendikten sonra düz metin "OK" döneriz — aksi
// halde PayTR aynı bildirimi periyodik olarak tekrar gönderir (bu bizim için
// güvenlik ağıdır, hatayı biz düzeltene kadar bildirim kaybolmaz).
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const merchantOid = String(form.get("merchant_oid") || "");
  const status = String(form.get("status") || "");
  const totalAmount = String(form.get("total_amount") || "");
  const hash = String(form.get("hash") || "");

  if (!merchantOid || !status || !hash) {
    console.error("[paytr/callback] eksik alan", { merchantOid, status, hash });
    return new Response("PAYTR notification failed: missing fields", { status: 400 });
  }

  let merchantKey: string, merchantSalt: string;
  try {
    ({ merchantKey, merchantSalt } = getPaytrCredentials());
  } catch (err: any) {
    console.error("[paytr/callback]", err);
    return new Response("PAYTR notification failed: server misconfigured", { status: 500 });
  }

  const expectedHash = buildCallbackHash({
    merchantOid,
    merchantSalt,
    status,
    totalAmount,
    merchantKey,
  });

  if (expectedHash !== hash) {
    console.error("[paytr/callback] hash uyuşmuyor", { merchantOid });
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("*")
    .eq("merchant_oid", merchantOid)
    .maybeSingle();

  if (findError || !order) {
    console.error("[paytr/callback] sipariş bulunamadı", { merchantOid, findError });
    // "OK" DÖNMÜYORUZ — PayTR bildirimi tekrar göndersin, biz arada düzeltelim.
    return new Response("PAYTR notification failed: order not found", { status: 404 });
  }

  // İdempotency: aynı bildirim birden fazla gelirse ikinci kez işlemeyelim.
  if (order.status === "completed" || order.status === "cancelled") {
    return new Response("OK");
  }

  if (status === "success") {
    try {
      await grantOrderAccess({ username: order.username, productSlug: order.product_slug });
    } catch (err: any) {
      console.error("[paytr/callback] grantOrderAccess hata", err);
      return new Response("PAYTR notification failed: could not grant access", { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed", is_activated: true })
      .eq("id", order.id);

    if (updateError) {
      console.error("[paytr/callback] sipariş güncellenemedi", updateError);
      return new Response("PAYTR notification failed: could not update order", { status: 500 });
    }
  } else {
    await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
  }

  return new Response("OK");
}