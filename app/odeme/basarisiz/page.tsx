"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OdemeBasarisizPage() {
  const params = useSearchParams();
  const oid = params.get("oid") || "";

  useEffect(() => {
    try {
      window.parent.postMessage({ type: "paytr-payment-result", status: "fail", oid }, "*");
    } catch {}
  }, [oid]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 px-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
        <h1 className="text-xl font-black text-slate-900">Ödeme tamamlanamadı</h1>
        <p className="mt-2 text-sm text-slate-600">Kartından herhangi bir tutar çekilmedi. Tekrar deneyebilirsin.</p>
      </div>
    </main>
  );
}
