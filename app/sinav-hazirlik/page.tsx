import type { Metadata } from "next";
import PublicShell, { SITE_URL } from "@/components/exam-prep/PublicShell";
import { EXAMS_BY_LEVEL, teilSlug, type Level } from "@/components/exam-prep/exams-config";
import OfficialResources from "@/components/exam-prep/OfficialResources";

export const metadata: Metadata = {
  title: "telc, Goethe ve ÖSD Lesen Alıştırmaları (A2 · B1) – Ücretsiz Online | Almanca Okulum",
  description:
    "telc Deutsch, Goethe-Zertifikat ve ÖSD sınavlarının Lesen ve Sprachbausteine bölümlerini gerçek sınav formatında ücretsiz çöz. A2 ve B1 için Türkçe açıklamalı online Übungen mit Lösungen.",
  alternates: { canonical: `${SITE_URL}/sinav-hazirlik` },
  openGraph: {
    title: "telc, Goethe ve ÖSD Lesen Alıştırmaları – Almanca Okulum",
    description: "Gerçek sınav formatında, Türkçe açıklamalı ücretsiz Almanca sınav alıştırmaları.",
    url: `${SITE_URL}/sinav-hazirlik`,
    type: "website",
  },
};

const LEVELS: Level[] = ["A2", "B1"];

export default function SinavHazirlikHub() {
  return (
    <PublicShell crumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Sınav Hazırlık" }]}>
      <section className="rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">Ücretsiz · Kayıt gerekmez</p>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
          telc, Goethe ve ÖSD <span className="text-blue-700">Lesen alıştırmaları</span>
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Gireceğin sınavı ve bölümü seç, gerçek sınavdaki görevlerle birebir aynı formatta hazırlanmış alıştırmayı hemen
          çöz. Her sorunun altında Türkçe açıklama, her bölümde strateji ipuçları var. Her bölümün ilk alıştırması herkese
          açık; tamamı için ücretsiz üye olman yeterli.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-black">
          {["✓ Gerçek sınav formatı", "✓ Türkçe açıklamalı çözümler", "✓ Anında puan", "✓ Bilgisayar ve telefonda"].map((t) => (
            <span key={t} className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700 ring-1 ring-blue-100">{t}</span>
          ))}
        </div>
      </section>

      {LEVELS.map((level) => (
        <section key={level} id={level.toLowerCase()} className="mt-8">
          <h2 className="text-2xl font-black text-slate-900">{level} sınavları</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {EXAMS_BY_LEVEL[level].filter((e) => e.ready).map((exam) => {
              const href = `/sinav-hazirlik/${level.toLowerCase()}/${exam.key}`;
              return (
                <div key={exam.key} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <a href={href} className={`block bg-gradient-to-r ${exam.color} px-5 py-4 text-white`}>
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">{level}</p>
                    <h3 className="text-2xl font-black">{exam.name}</h3>
                    <p className="text-sm font-semibold opacity-90">{exam.full}</p>
                  </a>
                  <ul className="divide-y divide-slate-100">
                    {exam.teile.map((t) => (
                      <li key={t.no}>
                        <a href={`${href}/${teilSlug(t)}`} className="flex items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-blue-50">
                          <span lang="de" className="font-bold text-slate-800">{t.title}</span>
                          <span className="shrink-0 text-xs font-black text-blue-600">Çöz →</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <OfficialResources level={level} />
        </section>
      ))}

      <section className="mt-10 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <h2 className="text-2xl font-black">Tüm alıştırmalar ücretsiz üyelikte</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Ücretsiz Başlangıç üyeliğiyle seviyendeki bütün sınav hazırlık alıştırmalarını çözebilir, ilerlemeni takip edebilir;
          video dersler, çalışma sayfaları ve Kelime Arenası&apos;na da erişebilirsin. Kredi kartı gerekmez.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["A1", "A2", "B1"] as const).map((lvl) => (
            <a key={lvl} href={`/register?level=${lvl}&package=starter&free=true`} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black hover:bg-blue-500">
              {lvl} ile ücretsiz başla
            </a>
          ))}
          <a href="/almanca-seviye-tespit-sinavi" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-black hover:bg-white/10">
            Seviyemi bilmiyorum
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
