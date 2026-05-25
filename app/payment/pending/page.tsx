"use client";

import { useRouter } from "next/navigation";

export default function PaymentPendingPage() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("mock_logged_user");
    router.push("/");
  }

  function handlePayment() {
    const links = JSON.parse(localStorage.getItem("shopier_links") || "{}");
    const slug =
      localStorage.getItem("pending_payment_slug") ||
      localStorage.getItem("selected_product_slug") ||
      "";

    const link = links[slug];

    if (!link) {
      alert("Bu paket için ödeme linki henüz eklenmemiş.");
      return;
    }

    window.open(link, "_blank");
  }

  return (
    <main className="relative min-h-screen bg-slate-100">
      <div className="pointer-events-none absolute inset-0 blur-sm opacity-60">
        <div className="mx-auto max-w-6xl p-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h1 className="text-3xl font-black">TELC hazırlık panelin hazır 👋</h1>
            <p className="mt-3">Dersler, PDF materyalleri ve çalışma planın burada.</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Devam etmek için ödeme adımını tamamla
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Hesabın oluşturuldu. Derslere erişim için ödeme adımını tamamladıktan sonra dekontunu WhatsApp’tan gönderebilirsin.
          </p>

          <button
            type="button"
            onClick={handlePayment}
            className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-700"
          >
            💳 Shopier ile Ödeme Yap
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </main>
  );
}