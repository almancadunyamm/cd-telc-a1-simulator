"use client";

import { useState } from "react";

export default function LiveAcademyPage() {
  const [selectedSingleLevel, setSelectedSingleLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [selectedDoubleLevel, setSelectedDoubleLevel] = useState<"A1+A2" | "A2+B1">("A1+A2");

  return (
    <main className="min-h-screen bg-white text-slate-950">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.20),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(250,204,21,0.18),transparent_28%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/images/icon.png" alt="Almanca Okulum" className="h-16 w-auto" />
            <div>
              <p className="text-lg font-black">Almanca Okulum</p>
              <p className="text-xs text-slate-500">Live Academy</p>
            </div>
          </a>
          <a href="/login" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
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
              <span className="block text-orange-500">TELC hedefini tamamla.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Canlı Zoom dersleri, speaking çalışmaları, ödev takibi ve ders
              kayıtlarıyla A1'den B1'e planlı şekilde ilerle.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#kayit" className="rounded-full bg-yellow-400 px-7 py-4 text-center text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/30 hover:bg-yellow-300">
                Canlı Kursları İncele
              </a>
              <a href="#sss" className="rounded-full border border-slate-200 bg-white px-7 py-4 text-center text-sm font-black text-slate-800 hover:bg-slate-50">
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
                <img src="/images/student1.png" alt="Öğrenci" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                <img src="/images/student2.png" alt="Öğrenci" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
                <img src="/images/student3.png" alt="Öğrenci" className="h-10 w-10 rounded-full border-2 border-white object-cover" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-950">Bu hafta 18 öğrenci katıldı</p>
                <p className="text-xs text-slate-500">Yeni canlı sınıf kayıtları devam ediyor</p>
              </div>
            </div>
            <div className="absolute -right-4 top-8 rounded-3xl border border-white bg-slate-950/90 backdrop-blur-xl p-5 text-white shadow-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-yellow-300">Kontenjan</p>
              <p className="mt-1 text-2xl font-black">Sınırlı</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAKET KARTLARI ───────────────────────────────────────── */}
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
              Tek seviye ile başlayabilir veya A1'den B1'e kadar planlı bir
              hazırlık yolculuğuna katılabilirsin.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Tek Seviye",
                price: "₺7.900",
                badge: selectedSingleLevel,
                slug: `live-${selectedSingleLevel.toLowerCase()}`,
                isSingleLevel: true,
                highlight: false,
                features: [
                  "36 canlı Zoom dersi",
                  "20 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Toplam 56 ders kapsamlı eğitim",
                  "Tüm ders kayıtlarına sınırsız erişim",
                  "Dijital öğrenci paneli (PDF, ustalık testleri, kelime oyunu)",
                  "Speaking klübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                  "Başlangıç dijital paketi hediye",
                ],
              },
              {
                name: "Hızlandırılmış",
                price: "₺12.000",
                badge: selectedDoubleLevel,
                slug: selectedDoubleLevel === "A1+A2" ? "live-a1-a2" : "live-a2-b1",
                isDoubleLevel: true,
                highlight: true,
                features: [
                  "72 canlı Zoom dersi (2 seviye)",
                  "40 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Toplam 112 ders kapsamlı eğitim",
                  "Tüm ders kayıtlarına sınırsız erişim",
                  "Dijital öğrenci paneli (PDF, ustalık testleri, kelime oyunu)",
                  "Speaking klübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                  "Başlangıç dijital paketi hediye",
                ],
              },
              {
                name: "Tam Hazırlık",
                price: "₺18.000",
                badge: "A1 + A2 + B1",
                slug: "live-a1-a2-b1",
                highlight: false,
                features: [
                  "108 canlı Zoom dersi (3 seviye)",
                  "60 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Toplam 168 ders kapsamlı eğitim",
                  "Tüm ders kayıtlarına sınırsız erişim",
                  "Dijital öğrenci paneli (PDF, ustalık testleri, kelime oyunu)",
                  "Speaking klübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                  "Başlangıç dijital paketi hediye",
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

                <p className={`text-xs font-black uppercase tracking-[0.2em] ${plan.highlight ? "text-yellow-300" : "text-orange-600"}`}>
                  {plan.badge}
                </p>
                <h3 className="mt-4 text-3xl font-black">{plan.name}</h3>
                <p className={`mt-5 text-5xl font-black ${plan.highlight ? "text-white" : "text-orange-500"}`}>
                  {plan.price}
                </p>

                {"isSingleLevel" in plan && plan.isSingleLevel && (
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

                {"isDoubleLevel" in plan && plan.isDoubleLevel && (
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
                    <li key={feature} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 ${plan.highlight ? "text-orange-400" : "text-orange-500"}`}>✓</span>
                      {feature}
                    </li>
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

      {/* ── SSS ──────────────────────────────────────────────────── */}
      <section id="sss" className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              Sık sorulan sorular
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              WhatsApp'ta en çok sorulanlar
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {[
              ["Kaç yaşından itibaren eğitimlere katılım sağlayabilirim?", "Eğitimlerimiz +11 yaş ve üzeri için uygulanmaktadır."],
              ["Bir kur kaç ay sürüyor?", "Her seviye yaklaşık 2 aylık bir eğitimi kapsıyor. A1'den B1'e kadar tam hazırlık programı yaklaşık 6 aydır."],
              ["Dersler hangi gün ve saatlerde oluyor?", "Akşam grupları Pazartesi, Çarşamba ve Cuma günleri 20:00 - 22:00 arasında yapılır. Sabah grupları hafta içi her gün 14:00 - 16:00 arasında yapılır."],
              ["Dersler canlı mı?", "Evet. Dersler Zoom üzerinden canlı yapılır ve kayıtları daha sonra öğrenci paneline yüklenir."],
              ["Ders kaydını izleyebilir miyim?", "Evet. Canlı kurs öğrencileri ders kayıtlarına panelden erişebilir."],
              ["Konuşma kulübü var mı?", "Evet. Eğitim başladıktan 10 gün sonra sistem size konuşma partneri tanımlar. Öğretmen eşliğinde konuşma kulüplerine katılırsınız."],
              ["Dijital öğrenci paneli ne içeriyor?", "Panel üzerinden ders kayıtlarına, PDF materyallerine, ustalık testlerine, kelime oyununa ve konuşma kulübü görevlerine erişebilirsiniz."],
              ["Sınav hazırlık dersleri nedir?", "Öğretmen rehberliğinde yapılan GOETHE ve TELC sınavlarını geçmeye yönelik sınav çalışma dersleridir. İlgili kur bittiğinde öğretmen rehberliğinde +20 ders sınav hazırlık dersi tanımlanır."],
              ["Başlangıç dijital paket dahil mi?", "Evet. Canlı kurs öğrencilerine Başlangıç dijital paket hediye edilir."],
              ["Sertifika veriyor musunuz?", "Evet. Kursu başarıyla bitiren her öğrencimize QR kodlu doğrulanabilir sertifika veriyoruz."],
              ["Kredi kartı ile ödeme yapabiliyor muyuz?", "Evet. Kredi kartı veya banka havalesi seçeneklerinden biriyle kaydınızı gerçekleştirebilirsiniz."],
              ["Kontenjan var mı?", "Canlı sınıflarda kaliteyi korumak için kontenjanlarımız sınırlıdır. Mevcut kontenjan durumu için bizimle iletişime geçebilirsiniz."],
            ].map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer text-lg font-black">{q}</summary>
                <p className="mt-4 text-[15px] leading-7 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.25),transparent_30%),radial-gradient(circle_at_85%_40%,rgba(250,204,21,0.18),transparent_30%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
            Yeni dönem kontenjanları sınırlı
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            Canlı sınıfta yerini ayır,
            <span className="block text-yellow-300">Almanca hedefini erteleme.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300">
            En yakın dönem, kontenjan durumu ve ödeme seçenekleri için kayıt
            adımına geçebilirsin.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#kayit" className="rounded-full bg-yellow-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-yellow-400/30 hover:bg-yellow-300">
              Canlı Kursları İncele
            </a>
            <a href="/" className="rounded-full border border-white/15 bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur hover:bg-white/15">
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
