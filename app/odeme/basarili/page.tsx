"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// PayTR ödeme iframe'i başarılı sonuçta bu sayfaya (merchant_ok_url) yönlendirir.
// Normalde bu sayfa PayTR iframe'inin İÇİNDE ama bizim kendi alan adımızda çalışır,
// bu yüzden üst pencereye (dashboard'daki modal) postMessage ile haber verebiliriz.
//
// Ancak PayTR bazı akışlarda (ör. 3D Secure sonrası) bu sayfayı iframe'den çıkarıp
// tarayıcının tüm sekmesinde açabiliyor. Bu durumda postMessage'i dinleyen kimse
// kalmıyor, bu yüzden kendimizi iframe içinde bulamazsak kullanıcıyı otomatik
// olarak panele geri yönlendiriyoruz.
export default function OdemeBasariliPage() {
  const params = useSearchParams();
  const router = useRouter();
  const oid = params.get("oid") || "";
  const [isTopLevel, setIsTopLevel] = useState(false);

  useEffect(() => {
    const framed = typeof window !== "undefined" && window.top !== window.self;

    if (framed) {
      try {
        window.parent.postMessage({ type: "paytr-payment-result", status: "success", oid }, "*");
      } catch {}
      return;
    }

    setIsTopLevel(true);
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2200);
    return () => clearTimeout(timer);
  }, [oid, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
        <h1 className="text-xl font-black text-slate-900">Ödemen alındı</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isTopLevel
            ? "Panele yönlendiriliyorsun..."
            : "Erişimin birazdan otomatik olarak açılacak."}
        </p>
        {isTopLevel && (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700"
          >
            Panele Git
          </button>
        )}
      </div>
    </main>
  );
}
