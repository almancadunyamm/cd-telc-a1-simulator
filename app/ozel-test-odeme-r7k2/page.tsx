"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaytrCheckoutModal from "@/components/PaytrCheckoutModal";

// Bu sayfa hiçbir menüde, footer'da veya başka bir sayfada linklenmiyor.
// Sadece PayTR canlı (gerçek) ödeme akışını küçük bir tutarla (100 TL)
// doğrulamak için elle bu adrese gidilerek kullanılır.
export default function OzelTestOdemePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user || !user.username) {
      setUsername(null);
      return;
    }

    setUsername(String(user.username).trim().toLowerCase());
  }, []);

  if (username === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div>
          <h1 className="text-xl font-black">Önce giriş yapmalısın</h1>
          <p className="mt-3 text-sm text-slate-400">
            Bu test ödemesini yapabilmek için, hesabına giriş yapılı olarak bu sayfayı açman gerekiyor.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-950 hover:bg-slate-200"
          >
            Giriş Yap
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-3xl">🧪</div>
        <h1 className="mt-5 text-2xl font-black">100 TL Test Ödemesi</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Bu sayfa sadece kredi kartıyla canlı ödeme akışının gerçekten
          çalıştığını doğrulamak için var. Hiçbir yerde linklenmiyor, sadece
          bu adrese sahip olan sen görebilirsin.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Giriş yapılı hesap: <span className="font-bold text-slate-300">{username}</span>
        </p>
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="mt-8 w-full rounded-2xl bg-amber-500 px-6 py-4 text-sm font-black text-slate-950 hover:bg-amber-400"
        >
          100 TL Öde
        </button>
      </div>

      <PaytrCheckoutModal
        open={checkoutOpen}
        slug="ozel-test-100"
        username={username}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          router.push("/dashboard");
        }}
      />
    </main>
  );
}