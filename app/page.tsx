"use client";

import { useEffect, useState } from "react";
import Footer from "./components/Footer";

type LevelSlug = "a1" | "a2" | "b1";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const packageTemplates = [
  {
    type: "starter",
    name: "Başlangıç",
    price: "₺990",
    oldPrice: "₺1.500",
    examCount: "2 TELC Dijital Deneme",
    badge: "Risksiz başlangıç",
    features: [
      "TELC dijital sınav formatını tanı",
      "100 çalışma sayfası",
      "15 günlük kamp materyali",
      "Sınava girmeden önce seviyeni gör",
    ],
  },
  {
    type: "practice",
    name: "Gelişim",
    price: "₺1.490",
    oldPrice: "₺2.250",
    examCount: "5 TELC Dijital Deneme",
    badge: "En çok tercih edilen",
    highlighted: true,
    features: [
      "Başlangıç paketindeki her şey",
      "36 ders offline video",
      "6 ay erişim",
      "PDF + ödev destekli hazırlık",
    ],
  },
  {
    type: "master",
    name: "Zirve",
    price: "₺1.990",
    oldPrice: "₺3.000",
    examCount: "10 TELC Dijital Deneme",
    badge: "Tam hazırlık",
    features: [
      "Gelişim paketindeki her şey",
      "12 ay erişim",
      "Tam hazırlık planı",
      "En kapsamlı TELC hazırlık paketi",
    ],
  },
];

const defaultFaqs: FaqItem[] = [
  {
    id: "1",
    question: "TELC dijital sınav simülasyonu nedir?",
    answer:
      "Sınavına girmeden önce gerçek TELC sınavıyla uyumlu sınav pratiği yapmanı sağlayan hazırlık sistemidir.",
  },
  {
    id: "2",
    question: "Neden önce dijital deneme almalıyım?",
    answer:
      "TELC sınav ücreti yüksek olduğu için sınava hazır olup olmadığını önceden görmek maddi riskini azaltır.",
  },
  {
    id: "3",
    question: "Canlı kurs öğrencileri dijital paket alır mı?",
    answer:
      "Canlı kurs öğrencilerine Başlangıç dijital paket hediye edilir. Ancak isterlerse üyeliklerini Gelişim veya Zirve paketlerine yükseltebilirler.",
  },
  {
    id: "4",
    question: "Dijital paket alan öğrenciler canlı kursa katılabilir mi?",
    answer:
      "Dijital paket alan öğrenciler offline ders kayıtlarını izleyebilirler. Canlı derslere katılamazlar.",
  },
];

const levelTheme = {
  a1: {
    tab: "bg-yellow-400 text-slate-950 shadow-lg",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    ring: "ring-yellow-100",
    text: "text-yellow-700",
    soft: "bg-yellow-100",
    button: "bg-yellow-400 text-slate-950 hover:bg-yellow-300",
  },
  a2: {
    tab: "bg-emerald-600 text-white shadow-lg",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    ring: "ring-emerald-100",
    text: "text-emerald-700",
    soft: "bg-emerald-100",
    button: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  b1: {
    tab: "bg-purple-600 text-white shadow-lg",
    bg: "bg-purple-50",
    border: "border-purple-300",
    ring: "ring-purple-100",
    text: "text-purple-700",
    soft: "bg-purple-100",
    button: "bg-purple-600 text-white hover:bg-purple-700",
  },
};

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState<LevelSlug>("a1");
  const [singleLiveLevel, setSingleLiveLevel] = useState<LevelSlug>("a1");
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);

  const theme = levelTheme[selectedLevel];

  useEffect(() => {
    const rawFaqs = localStorage.getItem("homepage_faqs");

    if (rawFaqs) {
      try {
        setFaqs(JSON.parse(rawFaqs));
      } catch {
        setFaqs(defaultFaqs);
      }
    }
  }, []);

  function goToPay(slug: string) {
  localStorage.setItem("pending_payment_slug", slug);
  localStorage.setItem("selected_product_slug", slug);

  const rawUser = localStorage.getItem("mock_logged_user");

  if (!rawUser) {
    window.location.href = "/register";
    return;
  }

  window.location.href = "/dashboard";
}

  const singleLiveSlug = `live-${singleLiveLevel}`;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white pb-28 text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-yellow-50 text-slate-950">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(250,204,21,0.25),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.18),transparent_30%)]" />

 <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <div className="flex items-center gap-3">
      <img
  src="/images/logo.png"
  alt="Almanca Okulum"
  className="h-26 w-auto object-contain"
/>
    </div>

    <a
      href="/login"
      className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
    >
      Giriş Yap
    </a>
  </header>

  <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-2">
    <div className="mx-auto -mt-2 max-w-4xl text-center">

      <h1 className="text-4xl font-black leading-none tracking-tight md:text-5xl">
  Almanca öğrenmenin{" "}
  <span className="text-blue-700">
    en güçlü yolu.
  </span>
</h1>
    </div>

    <div className="relative mt-4 grid gap-6 lg:grid-cols-2 lg:items-stretch">
  <div className="group relative overflow-hidden rounded-[40px] border border-blue-200/70 bg-white/80 p-4 shadow-[0_30px_90px_-28px_rgba(37,99,235,0.55)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-[0_45px_120px_-32px_rgba(37,99,235,0.75)]">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-90" />
    <div className="absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

    <div className="relative z-10 flex h-full flex-col">
      <img
        src="/images/digital-mini-ui.png"
        alt="TELC Dijital Simülasyon"
        className="h-52 w-full rounded-[30px] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.03]"
      />

      <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
        <span className="h-2 w-2 rounded-full bg-blue-600" />
        Dijital Simulator
      </div>

      <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">
        Kendi hızında
        <span className="block text-blue-600">dijital hazırlan</span>
      </h2>

      <p className="mt-2 text-sm leading-5 text-slate-600">
        Gerçek TELC dijital sınav sistemini önceden deneyimle. Deneme çöz,
        analizleri gör ve görev sistemiyle hazırlığını takip et.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
  "✓ TELC dijital deneme",
  "✓ Konuşma klübü",
  "✓ Video ders sistemi",
  "✓ Analiz ve yönlendirme",
].map((item) => (
          <div
            key={item}
            className="rounded-full bg-blue-50/90 px-4 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100"
          >
            {item}
          </div>
        ))}
      </div>

      <a
        href="/digital-simulation"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-blue-700"
      >
        Dijital Sistemi İncele
      </a>
    </div>
  </div>

  <div className="group relative overflow-hidden rounded-[40px] border border-orange-200/70 bg-white/80 p-4 shadow-[0_30px_90px_-28px_rgba(249,115,22,0.5)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-300 hover:shadow-[0_45px_120px_-32px_rgba(249,115,22,0.7)]">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50 opacity-90" />
    <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />

    <div className="relative z-10 flex h-full flex-col">
      <img
        src="/images/live-mini-ui.png"
        alt="Canlı Almanca Akademisi"
        className="h-52 w-full rounded-[30px] object-cover shadow-2xl transition duration-500 group-hover:scale-[1.03]"
      />

      <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-700">
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        Live Academy
      </div>

      <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">
        Öğretmenle
        <span className="block text-orange-500">canlı hazırlan</span>
      </h2>

      <p className="mt-2 text-sm leading-5 text-slate-600">
        Canlı Zoom derslerine katıl, öğretmen geri bildirimi al, speaking club
        ve ödev sistemiyle disiplinli ilerle.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
  "✓ Canlı Zoom",
  "✓ Konuşma klübü",
  "✓ Mentor takip",
  "✓ Ödev sistemi",
].map((item) => (
          <div
            key={item}
            className="rounded-full bg-orange-50/90 px-4 py-2 text-xs font-black text-orange-700 ring-1 ring-orange-100"
          >
            {item}
          </div>
        ))}
      </div>

      <a
        href="/academy-live"
       className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-yellow-300"
      >
        Canlı Akademiyi İncele
      </a>
    </div>
  </div>
</div>

    <div className="mt-8 grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur md:grid-cols-2 xl:grid-cols-4">
  {[
    {
      title: "%100 TELC Uyumlu",
      desc: "Resmi formata uygun içerik",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      ),
    },
    {
      title: "Akıllı İlerleme Takibi",
      desc: "Performansını anlık gör",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19V5" />
          <path d="M9 19V9" />
          <path d="M14 19V3" />
          <path d="M19 19v-7" />
        </svg>
      ),
    },
    {
      title: "Uzman Eğitmen Kadrosu",
      desc: "Deneyimli ve sertifikalı",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
          <circle cx="12" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Güvenli & Sertifikalı",
      desc: "Verilerin güvende, eğitim kaliteli",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      ),
    },
  ].map((item) => (
    <div
      key={item.title}
      className="flex items-center gap-4 border-b border-slate-200 p-5 last:border-b-0 md:border-r md:last:border-r-0 xl:border-b-0"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {item.icon}
      </div>

      <div>
        <h3 className="text-base font-black text-slate-950">
          {item.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {item.desc}
        </p>
      </div>
    </div>
  ))}
</div>
    <div className="mt-5 grid gap-4 rounded-[28px] bg-slate-950 p-5 text-white shadow-2xl md:grid-cols-4">
      <div>
        <p className="text-2xl font-black">12.500+</p>
        <p className="text-xs text-slate-400">Başarılı öğrenci</p>
      </div>

      <div>
        <p className="text-2xl font-black">98%</p>
        <p className="text-xs text-slate-400">Memnuniyet oranı</p>
      </div>

      <div>
        <p className="text-2xl font-black">50.000+</p>
        <p className="text-xs text-slate-400">Çözülen deneme</p>
      </div>

      <div>
  <div className="flex items-center gap-2">
    <p className="text-2xl font-black">4.9/5</p>

    <div className="flex text-yellow-400">
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
    </div>
  </div>

  <p className="mt-1 text-xs text-slate-400">
    Öğrenci puanı
  </p>
</div>
    </div>
  </div>
</section>
<Footer />
    </main>
  );
}