"use client";

import { useState } from "react";
export default function LiveAcademyPage() {
  const [selectedSingleLevel, setSelectedSingleLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [selectedDoubleLevel, setSelectedDoubleLevel] = useState<"A1+A2" | "A2+B1">("A1+A2");

  const liveStats = {
  nextStartDate: "12 Mayıs Pazartesi",
  totalSeats: 15,
  filledSeats: 11,
  last24Hours: 5,
  lessonDays: "Pazartesi • Çarşamba • Cuma",
  lessonTime: "20:00 - 22:00",
};
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.20),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(250,204,21,0.18),transparent_28%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img
  src="/images/icon.png"
  alt="Almanca Okulum"
  className="h-16 w-auto"
/>
            <div>
              <p className="text-lg font-black">Almanca Okulum</p>
              <p className="text-xs text-slate-500">Live Academy</p>
            </div>
          </a>

          <a
            href="/login"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Giriş Yap
          </a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pb-16 pt-14 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              Canlı Almanca Akademisi
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              Öğretmenle canlı ilerle,
              <span className="block text-orange-500">
                TELC hedefini tamamla.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Canlı Zoom dersleri, speaking çalışmaları, ödev takibi ve ders
              kayıtlarıyla A1’den B1’e planlı şekilde ilerle.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#kayit"
                className="rounded-full bg-yellow-400 px-7 py-4 text-center text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/30 hover:bg-yellow-300"
              >
                Canlı Kursları İncele
              </a>

              <a
                href="#sss"
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center text-sm font-black text-slate-800 hover:bg-slate-50"
              >
                Soruların Cevapları
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-orange-400/20 blur-3xl" />
            <img
              src="/images/live-academy-hero.png"
              alt="Canlı Almanca kursu"
              className="relative h-[420px] w-full rounded-[40px] object-cover shadow-2xl"
            />
            <div className="absolute left-6 bottom-6 z-20 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur">
  <div className="flex -space-x-3">
    <img
  src="/images/student1.png"
  alt="Canlı kurs öğrencisi"
  className="h-10 w-10 rounded-full border-2 border-white object-cover"
/>
<img
  src="/images/student2.png"
  alt="Canlı kurs öğrencisi"
  className="h-10 w-10 rounded-full border-2 border-white object-cover"
/>

    <img
  src="/images/student3.png"
  alt="Canlı kurs öğrencisi"
  className="h-10 w-10 rounded-full border-2 border-white object-cover"
/>
  </div>

  <div>
    <p className="text-sm font-black text-slate-950">
      Bu hafta 18 öğrenci katıldı
    </p>

    <p className="text-xs text-slate-500">
      Yeni canlı sınıf kayıtları devam ediyor
    </p>
  </div>
</div>

            <div className="absolute -right-4 top-8 rounded-3xl border border-white bg-slate-950/90 backdrop-blur-xl p-5 text-white shadow-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-yellow-300">
                Kontenjan
              </p>
              <p className="mt-1 text-2xl font-black">Sınırlı</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["01", "Seviyeni seç", "A1, A2 veya B1 seviyesine uygun canlı programa katıl."],
            ["02", "Canlı derslere gir", "Zoom dersleri, ödevler ve öğretmen takibiyle ilerle."],
            ["03", "Kayıtları tekrar izle", "Ders kayıtlarına erişerek kaçırdığın konuları tekrar et."],
          ].map(([step, title, desc]) => (
            <div
              key={step}
              className="group rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-black tracking-[0.25em] text-orange-600">
                {step}
              </p>
              <h3 className="mt-3 text-xl font-black transition duration-300 group-hover:text-orange-500">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
              Neden Live Academy?
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Sadece ders değil, takipli öğrenme sistemi.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Canlı Zoom dersleri",
              "Ders kayıtlarına erişim",
              "Öğretmen geri bildirimi",
              "Speaking club ve pratik",
              "PDF + ödev sistemi",
              "A1 → A2 → B1 yol haritası",
            ].map((item) => (
              <div
                key={item}
                className="group rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-400/30 hover:bg-white/[0.09]"
              >
                <p className="text-lg font-black transition duration-300 group-hover:text-yellow-300">
  ✓ {item}
</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-4 py-24">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.10),transparent_30%)]" />

  <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
        Öğretmen destekli sistem
      </p>

      <h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
        Sadece derse girmezsin,
        <span className="block text-orange-500">
          takip edilirsin.
        </span>
      </h2>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
        Canlı derslerde konuları öğrenir, ödevlerle pekiştirir, speaking
        çalışmalarıyla pratik yapar ve öğretmen yönlendirmesiyle düzenli
        ilerlersin.
      </p>

      <div className="mt-8 grid gap-3">
        {[
          "Canlı ders sonrası kayıt tekrar izleme",
          "Speaking görevleriyle konuşma pratiği",
          "Ödev ve materyal takibi",
          "Seviye seviye A1 → A2 → B1 ilerleme",
        ].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-bold text-slate-800"
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </div>

    <div className="relative">
      <div className="absolute -inset-6 rounded-[3rem] bg-orange-300/20 blur-3xl" />

      <img
        src="/images/live-mini-ui.png"
        alt="Canlı ders ve öğretmen takibi"
        className="relative h-[460px] w-full rounded-[40px] object-cover shadow-2xl"
      />

      <div className="absolute -left-6 top-8 rounded-3xl border border-white bg-white/90 p-5 shadow-2xl backdrop-blur">
        <p className="text-xs font-black uppercase tracking-widest text-orange-600">
          Speaking
        </p>
        <p className="mt-1 text-3xl font-black text-slate-950">
          Haftalık
        </p>
      </div>

      <div className="absolute -bottom-6 right-4 rounded-3xl bg-slate-950 p-5 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-yellow-300">
          Ders Kaydı
        </p>
        <p className="mt-1 text-3xl font-black">
          Tekrar İzle
        </p>
      </div>
    </div>
  </div>
</section>
      <section className="bg-orange-50 px-4 py-24">
  <div className="mx-auto max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
        Haftalık canlı program
      </p>

      <h2 className="mt-3 text-3xl font-black md:text-5xl">
        Düzenli ders, düzenli tekrar, düzenli gelişim.
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
  Akşam grupları Pazartesi, Çarşamba ve Cuma günleri 20:00 - 22:00 arasında yapılır.
  Sabah grupları hafta içi her gün 14:00 - 16:00 arasında yapılır.
</p>
    </div>

    <div className="mt-12 grid gap-5 lg:grid-cols-4">
      {[
        {
  day: "Pazartesi",
  type: "20:00 - 22:00",
  title: "Canlı konu anlatımı",
  desc: "Yeni konu işlenir ve örneklerle pekiştirilir.",
},
        {
  day: "Çarşamba",
  type: "20:00 - 22:00",
  title: "Alıştırma ve pratik",
  desc: "Ders içeriği örnek sorularla uygulanır.",
},
        {
  day: "Cuma",
  type: "20:00 - 22:00",
  title: "Tekrar ve speaking",
  desc: "Haftalık tekrar yapılır, konuşma pratiği desteklenir.",
},
        {
          day: "Hafta Sonu",
          type: "Panel",
          title: "Kayıt + ödev",
          desc: "Ders kayıtları izlenir, PDF ve ödevler tamamlanır.",
        },
      ].map((item) => (
        <div
          key={item.day}
          className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
            {item.day}
          </p>

          <div className="mt-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-black text-orange-700">
            {item.type}
          </div>

          <h3 className="mt-5 text-2xl font-black text-slate-950">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
      <section id="kayit" className="relative overflow-hidden bg-white px-4 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              Canlı kurs paketleri
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              Sana uygun canlı kurs yolunu seç.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Tek seviye ile başlayabilir veya A1’den B1’e kadar planlı bir
              hazırlık yolculuğuna katılabilirsin.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
  name: "Tek Seviye",
  price: "₺7.000",
  badge: selectedSingleLevel,
  slug: `live-${selectedSingleLevel.toLowerCase()}`,
  isSingleLevel: true,
  features: [
                  "Haftada 3 gün, 36 ders",
                  "+ 20 ders sınav hazırlık",
                  "Ders kayıtlarına erişim",
                  "Konuşma klübü",
                  "Ödev ve geri bildirim",
                ],
              },
              {
  name: "Hızlandırılmış",
  price: "₺11.000",
  badge: selectedDoubleLevel,
  slug:
    selectedDoubleLevel === "A1+A2"
      ? "live-a1-a2"
      : "live-a2-b1",
  isDoubleLevel: true,
  highlight: true,
                features: [
                  "İki seviye canlı program",
                  "Haftada 3 gün, 72 ders",
                  "+20 ders sınav hazırlık",
                  "Konuşma klübü",
                  "Ödev ve geri bildirim",
                ],
              },
              {
  name: "Tam Hazırlık",
  price: "₺16.000",
  badge: "A1 + A2 + B1",
  slug: "live-a1-a2-b1",
  features: [
                  "Üç seviye canlı program",
                  "Haftada 3 gün, 108 ders",
                  "+20 ders sınav hazırlık",
                  "Konuşma klübü",
                  "Ödev ve geri bildirim",,
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-[40px] border p-7 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.highlight
                    ? "border-orange-300 bg-slate-950 text-white ring-4 ring-orange-100"
                    : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2 text-xs font-black text-white shadow-lg">
                    En Çok Tercih Edilen
                  </div>
                )}

                <p
                  className={`text-xs font-black uppercase tracking-[0.2em] ${
                    plan.highlight ? "text-yellow-300" : "text-orange-600"
                  }`}
                >
                  {plan.badge}
                </p>

                <h3 className="mt-4 text-3xl font-black">{plan.name}</h3>

                <p
                  className={`mt-5 text-5xl font-black ${
                    plan.highlight ? "text-white" : "text-orange-500"
                  }`}
                >
                  {plan.price}
                </p>

                {plan.isSingleLevel && (
  <div className="mt-5 grid grid-cols-3 gap-2">
    {(["A1", "A2", "B1"] as const).map((level) => (
      <button
        key={level}
        type="button"
        onClick={() => setSelectedSingleLevel(level)}
        className={`rounded-full px-4 py-3 text-sm font-black transition ${
          selectedSingleLevel === level
            ? "bg-orange-500 text-white shadow-lg"
            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
        }`}
      >
        {level}
      </button>
    ))}
  </div>
)}
{plan.isDoubleLevel && (
  <div className="mt-5 grid grid-cols-2 gap-2">
    {(["A1+A2", "A2+B1"] as const).map((level) => (
      <button
        key={level}
        type="button"
        onClick={() => setSelectedDoubleLevel(level)}
        className={`rounded-full px-4 py-3 text-sm font-black transition ${
          selectedDoubleLevel === level
            ? "bg-orange-500 text-white shadow-lg"
            : plan.highlight
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
        }`}
      >
        {level}
      </button>
    ))}
  </div>
)}
                <ul className="mt-6 space-y-3 text-sm font-semibold">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <a
  href="/register"
  onClick={() => {
    localStorage.setItem("selected_product_slug", plan.slug);
    localStorage.setItem("selectedProductSlug", plan.slug);
    localStorage.setItem("pending_payment_slug", plan.slug);
  }}
  className={`mt-8 inline-flex w-full justify-center rounded-full px-6 py-4 text-sm font-black transition ${
                    plan.highlight
                      ? "bg-orange-500 text-white hover:bg-orange-400"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  Paketi Seç
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-50 px-4 py-20">
  <div className="mx-auto max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
        Canlı kurs hakkında merak edilenler
      </p>

      <h2 className="mt-3 text-3xl font-black md:text-5xl">
        Öğrencilerimizin en çok merak ettiği sorular.
      </h2>

      <p className="mt-4 text-base leading-7 text-slate-600">
        Canlı ders sistemi, kayıt süreci, kontenjan yapısı ve öğrenci deneyimi hakkında en sık sorulan konuları burada bulabilirsiniz.
      </p>
    </div>

    <div className="mt-10 grid gap-5 lg:grid-cols-3">
  <div className="rounded-[32px] border border-orange-200 bg-white p-6 shadow-xl">
    <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
      Yeni dönem
    </p>

    <h3 className="mt-3 text-3xl font-black text-slate-950">
      {liveStats.nextStartDate}
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
      Yeni canlı sınıf başlangıç tarihi.
    </p>
  </div>

  <div className="rounded-[32px] border border-yellow-200 bg-white p-6 shadow-xl">
    <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-600">
      Kontenjan durumu
    </p>

    <h3 className="mt-3 text-3xl font-black text-slate-950">
      {liveStats.filledSeats}/{liveStats.totalSeats}
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
      Hedef sınıf doluluk oranı. Canlı katılım genelde daha küçük gruplarla ilerler.
    </p>

    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-yellow-400"
        style={{
          width: `${
            (liveStats.filledSeats / liveStats.totalSeats) * 100
          }%`,
        }}
      />
    </div>
  </div>

  <div className="rounded-[32px] border border-emerald-200 bg-white p-6 shadow-xl">
    <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">
      Son 24 saat
    </p>

    <h3 className="mt-3 text-3xl font-black text-slate-950">
      +{liveStats.last24Hours} yeni kayıt
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
      Öğrenciler canlı sınıflara katılmaya devam ediyor.
    </p>
  </div>
</div>
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[
  {
    image: "/images/live-start-date-card.png",
    title: "Ne zaman başlıyor?",
    desc: "Yeni dönem tarihi ve kontenjan bilgisi kayıt ekranında gösterilir.",
  },

  {
    image: "/images/live-recordings-card.png",
    title: "Kayıt izlenir mi?",
    desc: "Evet. Canlı ders kayıtları öğrenci paneline yüklenir.",
  },

  {
    image: "/images/live-capacity-card.png",
    title: "Sınıf kaç kişi?",
    desc: "Kaliteli takip için kontenjan sınırlı tutulur.",
  },

  {
    image: "/images/live-payment-card.png",
    title: "Nasıl kayıt olurum?",
    desc: "Paketini seçip ödeme adımını tamamlayabilirsin.",
  },
].map((item) => (
  <div
    key={item.title}
    className="group relative overflow-hidden rounded-[36px] border border-white/60 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_80px_rgba(15,23,42,0.14)]"
  >
    <div className="relative overflow-hidden rounded-t-[36px]">
      <img
        src={item.image}
        alt={item.title}
        className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
    </div>

    <div className="relative p-7">
      <h3 className="text-[28px] leading-tight font-black tracking-tight text-slate-950">
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {item.desc}
      </p>
    </div>
  </div>
))}
    </div>
  </div>
</section>
      <section id="sss" className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              Sık sorulan sorular
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              WhatsApp’ta en çok sorulanlar
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {[
              ["Dersler hangi gün ve saatlerde oluyor?", "Akşam grupları Pazartesi, Çarşamba ve Cuma günleri 20:00 - 22:00 arasında yapılır. Sabah grupları hafta içi her gün 14:00 - 16:00 arasında yapılır."],
              ["Dersler canlı mı?", "Evet. Dersler Zoom üzerinden canlı yapılır ve kayıtları daha sonra öğrenci paneline yüklenir."],
              ["Ders kaydını izleyebilir miyim?", "Evet. Canlı kurs öğrencileri ders kayıtlarına panelden erişebilir."],
              ["Başlangıç dijital paket dahil mi?", "Evet. Canlı kurs öğrencilerine Başlangıç dijital paket hediye edilir."],
              ["Kontenjan var mı?", "Evet. Canlı sınıflarda kaliteyi korumak için kontenjan sınırlıdır."],
            ].map(([q, a]) => (
              <details
                key={q}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer text-lg font-black">
                  {q}
                </summary>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.25),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(250,204,21,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
            Yeni dönem kontenjanları sınırlı
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            Canlı sınıfta yerini ayır,
            <span className="block text-yellow-300">
              Almanca hedefini erteleme.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300">
            En yakın dönem, kontenjan durumu ve ödeme seçenekleri için kayıt
            adımına geçebilirsin.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#kayit"
              className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/30 hover:bg-yellow-300"
            >
              Canlı Kursları İncele
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