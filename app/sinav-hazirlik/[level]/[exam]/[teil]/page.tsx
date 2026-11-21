import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicShell, { SITE_URL } from "@/components/exam-prep/PublicShell";
import PublicPractice from "@/components/exam-prep/PublicPractice";
import { findPublicExam, teilSlug } from "@/components/exam-prep/exams-config";

type Params = Promise<{ level: string; exam: string; teil: string }>;

async function resolve(params: Params) {
  const { level, exam, teil } = await params;
  const found = findPublicExam(level, exam);
  if (!found) return null;
  const teilIndex = found.exam.teile.findIndex((t) => teilSlug(t) === teil);
  if (teilIndex < 0) return null;
  return { ...found, teilIndex, teil: found.exam.teile[teilIndex] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const { exam, teil, level } = r;
  const url = `${SITE_URL}/sinav-hazirlik/${level.toLowerCase()}/${exam.key}/${teilSlug(teil)}`;
  const short = `${exam.name} ${level} ${teil.title.replace(",", "")}`;
  return {
    title: `${exam.full} ${teil.title} – Übung mit Lösungen | Almanca Okulum`,
    description: `${short} ücretsiz online alıştırma: ${teil.desc}. Gerçek sınav formatında, Türkçe açıklamalı çözümler ve strateji ipuçları.`,
    alternates: { canonical: url },
    openGraph: { title: `${short} – Übung mit Lösungen`, url, type: "article" },
  };
}

export default async function TeilPage({ params }: { params: Params }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { level, exam, teil, teilIndex } = r;
  const examHref = `/sinav-hazirlik/${level.toLowerCase()}/${exam.key}`;
  const others = exam.teile.filter((_, i) => i !== teilIndex);

  return (
    <PublicShell
      crumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Sınav Hazırlık", href: "/sinav-hazirlik" },
        { label: exam.full, href: examHref },
        { label: teil.title },
      ]}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-3xl">
          {exam.full} · <span lang="de">{teil.title}</span>
          <span className="block text-base font-bold text-slate-500 md:text-lg">Übung mit Lösungen · Türkçe açıklamalı ücretsiz alıştırma</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {teil.desc}
          {teil.points ? ` · Sınavda: ${teil.points}` : ""}
        </p>
      </header>

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm leading-6 text-slate-700">
        <span className="text-xl leading-6">💻</span>
        <p>
          <b>Gerçek sınav deneyimi için bilgisayardan çözmeni tavsiye ederiz.</b> Dijital sınavda metin ve sorular yan yana görünür.
        </p>
      </div>

      <PublicPractice level={level} examKey={exam.key} teilIndex={teilIndex} />

      <section className="mt-10">
        <h2 className="text-lg font-black text-slate-900">{exam.full}: diğer bölümler</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((t) => (
            <a
              key={t.no}
              lang="de"
              href={`${examHref}/${teilSlug(t)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"
            >
              {t.title}
            </a>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
