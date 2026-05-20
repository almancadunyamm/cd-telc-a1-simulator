"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createPendingOrder, type BillingLevel } from "../../../lib/billing/orders";

type ProductInfo = {
  title: string;
  subtitle: string;
  price?: string;
  type: "digital" | "live";
  level: BillingLevel;
};

function getLevelFromSlug(slug: string): BillingLevel {
  if (slug.includes("a1")) return "A1";
  if (slug.includes("a2")) return "A2";
  return "B1";
}

function getProductInfo(slug: string): ProductInfo {
  const level = getLevelFromSlug(slug);

  if (slug.startsWith("live-")) {
    const map: Record<string, ProductInfo> = {
      "live-a1": {
        title: "A1 Canlı Kurs",
        subtitle: "Canlı dersler, ders kayıtları ve materyal desteği",
        price: "₺6.000",
        type: "live",
        level: "A1",
      },
      "live-a2": {
        title: "A2 Canlı Kurs",
        subtitle: "Canlı dersler, ders kayıtları ve materyal desteği",
        price: "₺6.000",
        type: "live",
        level: "A2",
      },
      "live-b1": {
        title: "B1 Canlı Kurs",
        subtitle: "TELC odaklı canlı ders ve sınav hazırlığı",
        price: "₺7.000",
        type: "live",
        level: "B1",
      },
      "live-a1-a2": {
        title: "A1 + A2 Canlı Kurs",
        subtitle: "Avantajlı iki seviye canlı kurs paketi",
        price: "₺10.000",
        type: "live",
        level: "A1",
      },
      "live-full": {
        title: "A1 + A2 + B1 Canlı Kurs",
        subtitle: "A1’den B1’e tam hazırlık canlı kurs paketi",
        price: "₺15.200",
        type: "live",
        level: "A1",
      },
    };

    return map[slug] || {
      title: "Canlı Kurs",
      subtitle: "Canlı ders ve materyal desteği",
      type: "live",
      level,
    };
  }

  const packageType = slug.includes("master")
    ? "Zirve"
    : slug.includes("practice")
    ? "Gelişim"
    : "Başlangıç";

  const price = slug.includes("master")
    ? "₺1.990"
    : slug.includes("practice")
    ? "₺1.490"
    : "₺990";

  return {
    title: `${level} ${packageType} Dijital Paket`,
    subtitle: "TELC dijital sınav simülasyonu ve sistemli hazırlık paketi",
    price,
    type: "digital",
    level,
  };
}

export default function PayPage() {
  const params = useParams();
  const router = useRouter();
  const hasCreatedOrder = useRef(false);

  const slug = String(params.slug || "");
  const product = useMemo(() => getProductInfo(slug), [slug]);

  const [shopierUrl, setShopierUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("mock_logged_user");

    if (!rawUser) {
      router.push(`/register?next=/pay/${slug}`);
      return;
    }

    const rawLinks = localStorage.getItem("shopier_links");
    const links = rawLinks ? JSON.parse(rawLinks) : {};
    const link = links[slug];

    if (!link) {
      setError("Bu ürün için Shopier ödeme linki henüz eklenmemiş.");
      return;
    }

    setShopierUrl(link);

    if (!hasCreatedOrder.current) {
      hasCreatedOrder.current = true;

      const user = JSON.parse(rawUser) as {
        username: string;
        role: string;
        label: string;
      };

      createPendingOrder({
        username: user.username,
        productSlug: slug,
        level: product.level,
      });
    }
  }, [product.level, router, slug]);

  function handleGoToPayment() {
    if (!shopierUrl) {
      alert("Ödeme linki bulunamadı.");
      return;
    }

    window.location.href = shopierUrl;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 text-sm font-bold text-slate-300 hover:text-white"
        >
          ← Ana sayfaya dön
        </button>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 md:p-10">
              <p className="inline-flex rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950">
                Kayıt neredeyse tamam
              </p>

              <h1 className="mt-6 text-3xl font-black md:text-5xl">
                {product.title}
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-300">
                {product.subtitle}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-400">Seçilen seviye</p>
                  <p className="mt-1 text-xl font-black">{product.level}</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-400">Ürün tipi</p>
                  <p className="mt-1 text-xl font-black">
                    {product.type === "live" ? "Canlı Kurs" : "Dijital Paket"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-slate-400">Tutar</p>
                  <p className="mt-1 text-xl font-black">
                    {product.price || "Belirlenecek"}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5">
                <h2 className="text-xl font-black text-yellow-200">
                  ⚠️ Önemli bilgi
                </h2>

                <p className="mt-3 text-sm leading-6 text-yellow-50">
                  Bu aşamada hesabınız oluşturuldu ve ödeme süreci başlatıldı.
                  Kurs veya paket erişiminizin aktif olması için Shopier ödeme
                  adımını tamamlamanız gerekir.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <h3 className="font-black text-emerald-200">
                    Ödeme sonrası ne olur?
                  </h3>
                  <p className="mt-2 text-sm text-emerald-50">
                    Admin kontrolünden sonra sınıf ve paket erişiminiz öğrenci
                    panelinizde aktif edilir.
                  </p>
                </div>

                <div className="rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                  <h3 className="font-black text-blue-200">
                    Paneliniz hazır
                  </h3>
                  <p className="mt-2 text-sm text-blue-50">
                    Ödeme sonrası ders kayıtları, PDF materyaller ve TELC
                    içerikleri panelinizde görünecektir.
                  </p>
                </div>
              </div>
            </div>

            <aside className="border-t border-white/10 bg-slate-900/80 p-7 md:p-10 lg:border-l lg:border-t-0">
              <div className="rounded-3xl bg-white p-6 text-slate-950 shadow-2xl">
                <p className="text-sm font-black text-blue-700">
                  Ödeme Özeti
                </p>

                <h2 className="mt-2 text-2xl font-black">{product.title}</h2>

                <p className="mt-2 text-sm text-slate-600">
                  {product.subtitle}
                </p>

                <div className="mt-6 rounded-2xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">Ödenecek tutar</p>
                  <p className="mt-1 text-4xl font-black">
                    {product.price || "—"}
                  </p>
                </div>

                {error ? (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleGoToPayment}
                  className="mt-6 w-full rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
                >
                  Ödemeyi Tamamla
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="mt-3 w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Öğrenci Panelime Git
                </button>

                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  <p>✓ Güvenli Shopier ödeme altyapısı</p>
                  <p>✓ Ödeme sonrası admin aktivasyonu</p>
                  <p>✓ Ders ve materyal erişimi öğrenci panelinde</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-black text-yellow-200">
  Kontenjan hatırlatması
</p>
<p className="mt-2 text-sm text-slate-300">
  Sınıflar sınırlı kontenjanla açılır. Yerinizin ayrılması ve avantajlı
  dönem fiyatından yararlanmak için ödemenizi tamamlayınız.
</p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}