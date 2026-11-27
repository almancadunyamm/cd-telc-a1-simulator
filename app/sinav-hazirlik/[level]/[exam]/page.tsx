import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicShell, { SITE_URL } from "@/components/exam-prep/PublicShell";
import { findPublicExam, teilSlug } from "@/components/exam-prep/exams-config";

type Params = Promise<{ level: string; exam: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { level, exam } = await params;
  const found = findPublicExam(level, exam);
  if (!found) return {};
  const e = found.exam;
  const url = `${SITE_URL}/sinav-hazirlik/${level.toLowerCase()}/${e.key}`;
  return {
    title: `${e.full} Lesen – Übungen mit Lösungen | Almanca Okulum`,
    description: `${e.full} sınavının Lesen bölümü için ücretsiz online alıştırmalar: ${e.teile
      .map((t) => t.title)
      .join(", ")}. Gerçek sınav formatında, Türkçe açıklamalı.`,
    alternates: { canonical: url },
    openGraph: { title: `${e.full} Lesen Übungen`, url, type: "website" },
  };
}

export default async function ExamPage({ params }: { params: Params }) {
  const { level: levelSlug, exam: examSlug } = await params;
  const found = findPublicExam(levelSlug, examSlug);
  if (!found) notFound();
  const { level, exam } = found;
  const base = `/sinav-hazirlik/${level.toLowerCase()}/${exam.key}`;

  return (
    <PublicShell crumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Sınav Hazırlık", href: "/sinav-hazirlik" }, { label: exam.full }]}>
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-lg">
        <div className={`bg-gradient-to-r ${exam.color} px-6 py-8 text-white sm:px-10`}>
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Sınav Hazırlık · {level}</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">{exam.full} · Lesen Übungen</h1>
          <p className="mt-2 text-sm font-semibold opacity-90">{exam.header}</p>
        </div>
        <p className="px-6 py-6 text-base leading-7 text-slate-700 sm:px-10">{exam.intro}</p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exam.teile.map((t) => (
          <a
            key={t.no}
            href={`${base}/${teilSlug(t)}`}
            className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
          >
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">{exam.name} {level}</p>
            <h2 lang="de" className="mt-1 break-words text-lg font-black text-slate-900 [hyphens:auto]">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
            {t.points && <p className="mt-1 text-xs font-bold text-slate-400">Sınavda: {t.points}</p>}
            <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
              {t.tips.slice(0, 2).map((tip) => (
                <li key={tip}>💡 {tip}</li>
              ))}
            </ul>
            <span className="mt-auto pt-4 text-sm font-black text-blue-600">Ücretsiz alıştırmayı çöz →</span>
          </a>
        ))}
      </div>
      {exam.hoeren && exam.hoeren.length > 0 && (
        <a
          href={`${base}/hoeren`}
          className="mt-6 block rounded-3xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm transition hover:shadow-lg"
        >
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Yeni · Hören</p>
          <h2 className="mt-1 text-xl font-black text-slate-900">🎧 {exam.name} {level} Hören – resmî sınav kaydıyla</h2>
          <p className="mt-1 text-sm text-slate-600">Kaydı burada dinle, Teil 1–4 sorularını çöz, puanını ve Türkçe açıklamaları anında gör.</p>
          <span className="mt-3 inline-block rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">▶ Dinle ve çöz</span>
        </a>
      )}
    </PublicShell>
  );
}
