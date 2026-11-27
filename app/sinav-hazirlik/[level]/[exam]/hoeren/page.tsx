import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicShell, { SITE_URL } from "@/components/exam-prep/PublicShell";
import PublicHoeren from "@/components/exam-prep/PublicHoeren";
import { findPublicExam } from "@/components/exam-prep/exams-config";

type Params = Promise<{ level: string; exam: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { level, exam } = await params;
  const f = findPublicExam(level, exam);
  if (!f || !f.exam.hoeren?.length) return {};
  const url = `${SITE_URL}/sinav-hazirlik/${level.toLowerCase()}/${f.exam.key}/hoeren`;
  return {
    title: `${f.exam.full} Hören – Übung mit Lösungen | Almanca Okulum`,
    description: `${f.exam.full} Hören (dinleme) online alıştırma: resmî sınav kaydını dinle, Teil 1–4 sorularını çöz, puanını ve Türkçe açıklamaları anında gör.`,
    alternates: { canonical: url },
  };
}

export default async function HoerenPage({ params }: { params: Params }) {
  const { level: l, exam: e } = await params;
  const f = findPublicExam(l, e);
  if (!f || !f.exam.hoeren?.length) notFound();
  const { level, exam } = f;
  const examHref = `/sinav-hazirlik/${level.toLowerCase()}/${exam.key}`;
  return (
    <PublicShell
      crumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Sınav Hazırlık", href: "/sinav-hazirlik" },
        { label: exam.full, href: examHref },
        { label: "Hören" },
      ]}
    >
      <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
        {exam.full} · Hören
        <span className="block text-base font-bold text-slate-500">Resmî sınav kaydıyla dinleme alıştırması · Türkçe açıklamalı</span>
      </h1>
      <PublicHoeren level={level} examKey={exam.key} />
    </PublicShell>
  );
}
