"use client";
import { useState } from "react";
export default function DigitalSimulationPage() {
    const [starterLevel, setStarterLevel] = useState<"A1" | "A2" | "B1">("A1");
const [practiceLevel, setPracticeLevel] = useState<"A1" | "A2" | "B1">("A1");
const [masterLevel, setMasterLevel] = useState<"A1" | "A2" | "B1">("A1");
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white px-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.14),transparent_28%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img
  src="/images/icon.png"
  alt="Almanca Okulum"
  className="h-16 w-auto"
/>
            <div>
              <p className="text-lg font-black">Almanca Okulum</p>
              <p className="text-xs text-slate-500">TELC Digital Simulator</p>
            </div>
          </a>

          <a
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Giriş Yap
          </a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-14 pt-14 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
              TELC Dijital Simülasyon
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              Gerçek TELC sınavını
              <span className="block text-blue-700">önceden deneyimle.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Dijital denemeler, ders anlatım videoları, konuşma pratiği ve performans
              analiziyle sınava daha güvenli hazırlan.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#paketler"
                className="rounded-full bg-blue-600 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
              >
                Paketleri İncele
              </a>

              <a
                href="/"
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center text-sm font-black text-slate-800 hover:bg-slate-50"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-400/20 blur-3xl" />
            <img
              src="/images/digital-telc-a1-hero.png"
              alt="TELC A1 dijital sınav simülasyonu"
              className="relative h-[420px] w-full rounded-[40px] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["01", "Deneme çöz", "TELC formatına uygun dijital sınav pratiği yap."],
              ["02", "Eksiklerini gör", "Performansını analiz ederek güçlü ve zayıf yönlerini fark et."],
              ["03", "Sınava hazır gir", "Gerçek sınav ekranına ve süre baskısına önceden alış."],
            ].map(([step, title, desc]) => (
              <div
                key={step}
                className="rounded-[32px] border border-slate-200 bg-slate-50 p-6"
              >
                <p className="text-sm font-black tracking-[0.25em] text-blue-700">
                  {step}
                </p>
                <h3 className="mt-3 text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-white px-4 py-24">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.10),transparent_28%)]" />

  <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
        Premium dijital deneyim
      </p>

      <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
        Sadece ders izlemezsin.
        <span className="block text-blue-700">
          Sistemin içinde ilerlersin.
        </span>
      </h2>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
        TELC sınavına görev sistemi, konuşma çalışmaları,
        analiz ekranları, offline videolar ve dijital denemelerle
        adım adım hazırlan.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          "Offline video dersler",
          "Konuşma klübü",
          "Kelime çalışma alanı",
          "PDF materyal merkezi",
          "TELC deneme simülasyonu",
          "Başarı analiz ekranı",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800"
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </div>

    <div className="relative">
      <div className="absolute -inset-6 rounded-[3rem] bg-blue-500/15 blur-3xl" />

      <img
        src="/images/digital-dashboard-preview.png"
        alt="TELC dashboard preview"
        className="relative rounded-[36px] border border-slate-200 shadow-2xl"
      />

      <div className="absolute -left-6 top-10 rounded-3xl border border-white bg-white/90 p-4 shadow-2xl backdrop-blur">
        <p className="text-xs font-black uppercase tracking-widest text-blue-700">
          Konuşma Gelişimi
        </p>

        <p className="mt-2 text-3xl font-black text-slate-950">
          %82
        </p>
      </div>

      <div className="absolute -bottom-6 right-0 rounded-3xl border border-white bg-slate-950 p-5 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-blue-300">
          Aktif Görevler
        </p>

        <p className="mt-2 text-3xl font-black">
          14 Görev
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
              Sistem özellikleri
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Sadece video değil, sınav hazırlık sistemi.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "TELC dijital sınav simülasyonu",
              "Video ders sistemi",
              "Konuşma klübü ve pratikler",
              "PDF materyal merkezi",
              "Kelime çalışma sistemi",
              "Performans ve gelişim analizi",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <p className="text-lg font-black">✓ {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-4 py-24">
  <div className="mx-auto max-w-7xl">
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
        Gerçek kullanım deneyimi
      </p>

      <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
        TELC öğrencisinin
        <span className="block text-blue-700">
          bir günü nasıl geçiyor?
        </span>
      </h2>
    </div>

    <div className="mt-14 grid gap-6 lg:grid-cols-3">
      {[
        {
          time: "09:00",
          title: "Offline video ders",
          desc: "Öğrenci günlük video dersini izleyerek konu tekrarını tamamlar.",
        },
        {
          time: "13:30",
          title: "Speaking görevi",
          desc: "TELC speaking pratiği yapar ve görev sistemini tamamlar.",
        },
        {
          time: "20:00",
          title: "Dijital TELC denemesi",
          desc: "Gerçek sınav formatında dijital simülasyon çözer.",
        },
      ].map((item) => (
        <div
          key={item.time}
          className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-xl"
        >
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
            {item.time}
          </div>

          <h3 className="mt-5 text-2xl font-black text-slate-950">
            {item.title}
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section id="paketler" className="relative overflow-hidden bg-white px-4 py-24">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.10),transparent_35%)]" />

  <div className="relative mx-auto max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
        Dijital paketler
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
        TELC hazırlığını seviyene göre başlat.
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
        Başlangıç ile sınav sistemini tanı, Gelişim ile video ders ve materyalleri aç,
        Zirve ile tam hazırlık sistemine geç.
      </p>
    </div>

    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {[
        {
          name: "Başlangıç",
          slug: `${starterLevel.toLowerCase()}-starter`,
          price: "Ücretsiz",
          badge: `${starterLevel} Başlangıç`,
          highlight: false,
          features: [
            "A1 Temalaları",
            "18 ders erişimi",
            "Ustalık Testleri",
            "Çalışma sayfaları",
            "Temel TELC hazırlık alanı"
          ],
        },
        {
          name: "Gelişim",
          slug: `${practiceLevel.toLowerCase()}-practice`,
          price: "₺1.490",
          badge: `${practiceLevel} Gelişim`,
          highlight: true,
          features: [
            "5 TELC dijital deneme",
            "Offline video dersler",
            "Gelişim PDF ve çalışma sayfaları",
            "6 ay erişim",
          ],
        },
        {
          name: "Zirve",
          slug: `${masterLevel.toLowerCase()}-master`,
          price: "₺1.990",
          badge: `${masterLevel} Zirve`,
          highlight: false,
          features: [
            "10 TELC dijital deneme",
            "Tüm video ders arşivi",
            "Zirve materyal sistemi",
            "12 ay erişim",
          ],
        },
      ].map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-[40px] border p-7 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            plan.highlight
              ? "border-blue-300 bg-slate-950 text-white ring-4 ring-blue-100"
              : "border-slate-200 bg-white text-slate-950"
          }`}
        >
          {plan.highlight && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-2 text-xs font-black text-white shadow-lg">
              En Popüler
            </div>
          )}

          <p
            className={`text-xs font-black uppercase tracking-[0.2em] ${
              plan.highlight ? "text-blue-300" : "text-blue-700"
            }`}
          >
            {plan.badge}
          </p>

          <h3 className="mt-4 text-3xl font-black">{plan.name}</h3>

          <p
            className={`mt-5 text-5xl font-black ${
              plan.highlight ? "text-white" : "text-blue-700"
            }`}
          >
            {plan.price}
          </p>

          <div
            className={`mt-6 rounded-3xl p-5 ${
              plan.highlight ? "bg-white/10" : "bg-blue-50"
            }`}
          >
            <p className="text-sm font-black">
              {plan.name === "Başlangıç"
                ? "A1 dijital başlangıç ücretsiz"
                : plan.name === "Gelişim"
                ? "Video ders + deneme sistemi"
                : "Tam dijital hazırlık"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
  {(["A1", "A2", "B1"] as const).map((level) => {
    const isStarter = plan.name === "Başlangıç";
    const isPractice = plan.name === "Gelişim";

    const activeLevel = isStarter
      ? starterLevel
      : isPractice
      ? practiceLevel
      : masterLevel;

    return (
      <button
        key={level}
        type="button"
        onClick={() => {
          if (isStarter) setStarterLevel(level);
          else if (isPractice) setPracticeLevel(level);
          else setMasterLevel(level);
        }}
        className={`rounded-full px-4 py-3 text-sm font-black transition ${
          activeLevel === level
            ? "bg-orange-500 text-white shadow-lg"
            : plan.highlight
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
        }`}
      >
        {level}
      </button>
    );
  })}
</div>
          <ul className="mt-6 space-y-3 text-sm font-semibold">
            {plan.features.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>

          <a
  href={
  plan.name === "Başlangıç"
    ? `/register?level=${starterLevel}&package=starter&free=true`
    : "/register"
}
  onClick={() => {
    localStorage.setItem("selected_product_slug", plan.slug);
    localStorage.setItem("selectedProductSlug", plan.slug);
    localStorage.setItem("pending_payment_slug", plan.slug);
  }}
  className={`mt-8 inline-flex w-full justify-center rounded-full px-6 py-4 text-sm font-black transition ${
    plan.highlight
      ? "bg-blue-600 text-white hover:bg-blue-500"
      : "bg-slate-950 text-white hover:bg-slate-800"
  }`}
>
  {plan.name === "Başlangıç" ? "Ücretsiz Başla" : "Paketi Seç"}
</a>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(14,165,233,0.18),transparent_30%)]" />

  <div className="relative mx-auto max-w-5xl text-center">
    <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
      Sınava girmeden önce kendini gör
    </p>

    <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
      TELC sınav ücretini riske atmadan önce
      <span className="block text-blue-300">
        dijital hazırlığını tamamla.
      </span>
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300">
      Deneme çöz, video derslerle konuları pekiştir, speaking görevleriyle
      pratiğini artır ve sınava daha güvenli gir.
    </p>

    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <a
        href="#paketler"
        className="rounded-full bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500"
      >
        Dijital Paketleri İncele
      </a>

      <a
        href="/"
        className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur hover:bg-white/15"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  </div>
</section>
    </main>
  );
}