"use client";

const SPEAKING_CLUB_PACKAGES: {
  slug: string;
  label: string;
  levels: string;
  priceLabel: string;
  featured?: boolean;
  features: string[];
}[] = [
  {
    slug: "konusma-a1",
    label: "Tek Seviye",
    levels: "A1",
    priceLabel: "₺5.000",
    features: [
      "2 ay süren eğitim (A1)",
      "Kişisel konuşma partneri eşleşmesi",
      "Öğretmen rehberliğinde haftalık görevler",
      "İstediğin zaman üst seviyeye geçiş imkanı",
    ],
  },
  {
    slug: "konusma-a1-a2",
    label: "Hızlandırılmış",
    levels: "A1 + A2",
    priceLabel: "₺9.000",
    featured: true,
    features: [
      "4 ay süren eğitim (A1 + A2)",
      "Kişisel konuşma partneri eşleşmesi",
      "Öğretmen rehberliğinde haftalık görevler",
      "B1'e geçtiğinde tek seviye fiyatına devam etme",
    ],
  },
  {
    slug: "konusma-a1-a2-b1",
    label: "Tam Konuşma Programı",
    levels: "A1 + A2 + B1",
    priceLabel: "₺12.000",
    features: [
      "6 ay süren eğitim (A1 + A2 + B1)",
      "Her seviyede kişisel konuşma partneri",
      "Öğretmen rehberliğinde haftalık görevler",
      "Tüm seviyelerde ilerleme ve bildirim takibi",
    ],
  },
];

function selectSpeakingPackage(slug: string) {
  localStorage.setItem("selected_product_slug", slug);
  localStorage.setItem("selectedProductSlug", slug);
  localStorage.setItem("pending_payment_slug", slug);
  localStorage.setItem("product_selected_at", String(Date.now()));
}

export default function KonusmaKulubuPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* ── HEADER + HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.20),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(250,204,21,0.18),transparent_28%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/images/icon.png" alt="Almanca Okulum" className="h-12 w-auto" />
            <div>
              <p className="text-base font-black text-slate-950">Almanca Okulum</p>
              <p className="text-xs text-slate-500">Konuşma Kulübü</p>
            </div>
          </a>
          <a
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Giriş Yap
          </a>
        </header>

        <div className="relative z-10 mx-auto max-w-3xl pb-14 pt-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl shadow-lg shadow-orange-200/60">
            🎙️
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-orange-600">
            Sadece Konuşma Kulübü
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
            Almanca Konuşmayı <span className="text-orange-500">Gerçekten Öğren</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
            Dijital Kurs veya Canlı Akademi'ye kayıt olmana gerek yok. Konuşma
            Kulübü, sadece konuşma pratiği yapmak isteyenler için ayrı bir
            programdır. Kayıt olduğunda sana bir{" "}
            <strong className="text-slate-950">konuşma partneri</strong> atanır;
            öğretmen rehberliğinde, basit cümlelerden başlayıp adım adım
            gelişmiş cümlelere ilerlersin.
          </p>
          <a
            href="#paketler"
            className="mt-8 inline-flex rounded-full bg-yellow-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/30 hover:bg-yellow-300"
          >
            Paketleri İncele
          </a>
        </div>
      </section>

      {/* ── PAKETLER ─────────────────────────────────────────────── */}
      <section id="paketler" className="relative overflow-hidden bg-white px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              Paketler
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Sana uygun Konuşma Kulübü paketini seç
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Tek seviye ile başlayabilir veya A1'den B1'e kadar birlikte
              kayıt olarak avantajlı fiyattan yararlanabilirsin.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {SPEAKING_CLUB_PACKAGES.map((pkg) => (
              <div
                key={pkg.slug}
                className={`relative rounded-[32px] border p-6 text-left shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.featured
                    ? "border-orange-300 bg-slate-950 text-white ring-4 ring-orange-100"
                    : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange-500 px-4 py-1 text-xs font-black text-white shadow-lg">
                    En Çok Tercih Edilen
                  </span>
                )}
                <p
                  className={`text-xs font-black uppercase tracking-widest ${
                    pkg.featured ? "text-yellow-300" : "text-orange-600"
                  }`}
                >
                  {pkg.levels}
                </p>
                <p className="mt-1 text-lg font-black">{pkg.label}</p>
                <p
                  className={`mt-3 text-4xl font-black ${
                    pkg.featured ? "text-white" : "text-orange-500"
                  }`}
                >
                  {pkg.priceLabel}
                </p>
                <ul
                  className={`mt-5 space-y-2 text-sm font-semibold leading-6 ${
                    pkg.featured ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className={pkg.featured ? "text-orange-400" : "text-orange-500"}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  onClick={() => selectSpeakingPackage(pkg.slug)}
                  className={`mt-6 flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-black transition ${
                    pkg.featured
                      ? "bg-orange-500 text-white hover:bg-orange-400"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  Paketi Seç
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Kredi kartıyla güvenli ödeme · Ödeme onaylandıktan sonra öğrenci
            panelin ve konuşma partnerin otomatik olarak açılır
          </p>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              3 Adımda Başla
            </p>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">Nasıl çalışır?</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "1️⃣",
                title: "Paketini seç, kaydını oluştur",
                desc: "Seviyene uygun paketi seç, birkaç dakikada hesabını oluştur ve ödemeni güvenle tamamla.",
              },
              {
                icon: "2️⃣",
                title: "Konuşma partnerin atanır",
                desc: "Sistem sana seviyene uygun bir konuşma partneri eşleştirir; öğretmen rehberliğinde ilerlersiniz.",
              },
              {
                icon: "3️⃣",
                title: "Düzenli pratik yap",
                desc: "Haftalık görevlerle bol tekrar esasıyla akıcı konuşmaya adım adım yaklaşırsın.",
              },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl">{step.icon}</div>
                <p className="mt-3 text-sm font-black text-slate-950">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
            >
              ← Ana Sayfa
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
