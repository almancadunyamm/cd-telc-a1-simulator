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
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <a href="/" className="flex items-center gap-3">
          <img src="/images/icon.png" alt="Almanca Okulum" className="h-12 w-auto" />
          <div>
            <p className="text-base font-black text-white">Almanca Okulum</p>
            <p className="text-xs text-slate-400">Konuşma Kulübü</p>
          </div>
        </a>
        <a
          href="/login"
          className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200"
        >
          Giriş Yap
        </a>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.15),transparent_30%)]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-4xl">
            🎙️
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
            Sadece Konuşma Kulübü
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
            Almanca Konuşmayı Gerçekten Öğren
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            Dijital Kurs veya Canlı Akademi'ye kayıt olmana gerek yok. Konuşma
            Kulübü, sadece konuşma pratiği yapmak isteyenler için ayrı bir
            programdır. Kayıt olduğunda sana bir{" "}
            <strong className="text-white">konuşma partneri</strong> atanır;
            öğretmen rehberliğinde, basit cümlelerden başlayıp adım adım
            gelişmiş cümlelere ilerlersin.
          </p>
          <a
            href="#paketler"
            className="mt-8 inline-flex rounded-full bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-400"
          >
            Paketleri İncele
          </a>
        </div>
      </section>

      {/* ── PAKETLER ─────────────────────────────────────────────── */}
      <section id="paketler" className="border-t border-white/10 bg-white/[0.02] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black md:text-4xl">
              Sana uygun Konuşma Kulübü paketini seç
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Tek seviye ile başlayabilir veya A1'den B1'e kadar birlikte
              kayıt olarak avantajlı fiyattan yararlanabilirsin.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {SPEAKING_CLUB_PACKAGES.map((pkg) => (
              <div
                key={pkg.slug}
                className={`relative rounded-3xl border p-6 text-left ${
                  pkg.featured
                    ? "border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/10"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">
                    En Çok Tercih Edilen
                  </span>
                )}
                <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  {pkg.levels}
                </p>
                <p className="mt-1 text-lg font-black text-white">{pkg.label}</p>
                <p className="mt-3 text-3xl font-black text-white">{pkg.priceLabel}</p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  onClick={() => selectSpeakingPackage(pkg.slug)}
                  className={`mt-6 flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-black transition ${
                    pkg.featured
                      ? "bg-emerald-500 text-white hover:bg-emerald-400"
                      : "bg-white text-slate-950 hover:bg-slate-200"
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
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black md:text-3xl">Nasıl çalışır?</h2>
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
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <div className="text-3xl">{step.icon}</div>
                <p className="mt-3 text-sm font-black text-white">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}