"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// basarili/page.tsx ile aynı gerekçe: PayTR bazı akışlarda bu sayfayı iframe'den
// çıkarıp tüm sekmede açabiliyor, bu yüzden framed değilsek panele dönüş sunuyoruz.
export default function OdemeBasarisizPage() {
  const params = useSearchParams();
  const router = useRouter();
  const oid = params.get("oid") || "";
  const [isTopLevel, setIsTopLevel] = useState(false);

  useEffect(() => {
    const framed = typeof window !== "undefined" && window.top !== window.self;

    if (framed) {
      try {
        window.parent.postMessage({ type: "paytr-payment-result", status: "fail", oid }, "*");
      } catch {}
      return;
    }

    setIsTopLevel(true);
  }, [oid]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 px-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
        <h1 className="text-xl font-black text-slate-900">Ödeme tamamlanamadı</h1>
        <p className="mt-2 text-sm text-slate-600">Kartından herhangi bir tutar çekilmedi. Tekrar deneyebilirsin.</p>
        {isTopLevel && (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            Panele Dön
          </button>
        )}
      </div>
    </main>
  );
}