"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getShopierLink } from "@/lib/billing/shopier-links";

export default function PaymentPendingPage() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("mock_logged_user");
    router.push("/");
  }

  async function handlePayment() {
  const rawUser = localStorage.getItem("mock_logged_user");

  if (!rawUser) {
    router.push("/login");
    return;
  }

  const user = JSON.parse(rawUser);

  const slug =
    localStorage.getItem("pending_payment_slug") ||
    localStorage.getItem("selected_product_slug") ||
    localStorage.getItem("selectedProductSlug") ||
    "";

  if (!slug) {
    alert("Seçilen paket bulunamadı. Lütfen paketi tekrar seçin.");
    return;
  }

  const link = getShopierLink(slug);

  if (!link) {
    alert("Bu paket için Shopier linki eklenmemiş.");
    return;
  }

  const normalizedUsername = String(user.username || "")
    .trim()
    .toLowerCase();

  const level = slug.toLowerCase().includes("b1")
    ? "B1"
    : slug.toLowerCase().includes("a2")
    ? "A2"
    : "A1";

  const { data: existingOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("username", normalizedUsername)
    .eq("product_slug", slug)
    .in("status", ["pending_payment", "paid_waiting_activation"])
    .limit(1);

  if (existingOrders && existingOrders.length > 0) {
    await supabase
      .from("orders")
      .update({ status: "paid_waiting_activation" })
      .eq("id", existingOrders[0].id);
  } else {
    await supabase.from("orders").insert({
      username: normalizedUsername,
      product_slug: slug,
      level,
      status: "paid_waiting_activation",
    });
  }

  localStorage.setItem("pending_payment_slug", slug);
  window.open(link, "_blank");
  router.push("/dashboard");
}

  return (
    <main className="relative min-h-screen bg-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-100 blur-sm opacity-70">
  <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8">
    <aside className="w-64 rounded-3xl bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-black text-blue-700">Almanca Okulum</h2>
      <p className="mt-1 text-sm text-slate-500">TELC Hazırlık Paneli</p>

      <div className="mt-10 space-y-4 text-sm font-bold text-slate-600">
        <div className="rounded-2xl bg-blue-600 px-4 py-3 text-white">🏠 Ana Sayfa</div>
        <div>🎬 Dersler</div>
        <div>📚 PDF Merkezi</div>
        <div>📝 Deneme Sınavları</div>
        <div>🎤 Pratik</div>
        <div>📊 İlerleme</div>
      </div>
    </aside>

    <section className="flex-1">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black">TELC hazırlık panelin hazır 👋</h1>
        <p className="mt-3 text-white/90">
          Dersler, PDF materyalleri, konuşma görevleri ve kelime takibi burada.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/20 p-5">
            <p className="text-sm">Video Dersler</p>
            <p className="mt-3 text-3xl font-black">🔒</p>
          </div>

          <div className="rounded-2xl bg-white/20 p-5">
            <p className="text-sm">PDF Materyalleri</p>
            <p className="mt-3 text-3xl font-black">🔒</p>
          </div>

          <div className="rounded-2xl bg-white/20 p-5">
            <p className="text-sm">TELC Denemeleri</p>
            <p className="mt-3 text-3xl font-black">🔒</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h3 className="text-xl font-black">Bugünkü Önerilen Ders</h3>
          <p className="mt-4 text-slate-500">İlk dersine ödeme sonrası başla.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h3 className="text-xl font-black">Günlük Koçluk Görevleri</h3>
          <p className="mt-4 text-slate-500">Premium görevlerin burada açılır.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h3 className="text-xl font-black">Konuşma Pratiği</h3>
          <p className="mt-4 text-slate-500">Öğretmen desteği burada görünür.</p>
        </div>
      </div>
    </section>
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
            Hesabın oluşturuldu. Ödeme adımını tamamladıktan sonra derslere erişim sağlayabileceksin.
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