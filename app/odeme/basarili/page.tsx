"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// PayTR ödeme iframe'i başarılı sonuçta bu sayfaya (merchant_ok_url) yönlendirir.
// Bu sayfa PayTR iframe'inin İÇİNDE ama bizim kendi alan adımızda çalışır,
// bu yüzden üst pencereye (dashboard'daki modal) postMessage ile haber verebiliriz.
export default function OdemeBasariliPage() {
  const params = useSearchParams();
  const oid = params.get("oid") || "";

  useEffect(() => {
    try {
      window.parent.postMessage({ type: "paytr-payment-result", status: "success", oid }, "*");
    } catch {}
  }, [oid]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
        <h1 className="text-xl font-black text-slate-900">Ödemen alındı</h1>
        <p className="mt-2 text-sm text-slate-600">Erişimin birazdan otomatik olarak açılacak.</p>
      </div>
    </main>
  );
}
