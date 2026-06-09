"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ExamListContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const level = String(params?.level ?? "").toUpperCase();
  const tier = searchParams.get("tier") ?? "starter";

  const starterExams = [
    {
      id: "goethe-a1-set-1",
      title: "Goethe-Zertifikat A1",
      subtitle: "Start Deutsch 1 — Modellsatz",
      badge: "Goethe Institut",
      badgeColor: "bg-blue-100 text-blue-700",
      duration: "~65 Dakika",
      parts: ["Hören · 15 soru", "Lesen · 15 soru", "Schreiben · 2 Teil"],
      desc: "Goethe Institut'un resmi örnek sınavı. Gerçek sınav formatıyla birebir aynı.",
      href: `/exams/${level.toLowerCase()}`,
      available: true,
    },
    {
      id: "telc-a1-set-1",
      title: "TELC Deutsch A1",
      subtitle: "Örnek Sınav — Modellsatz",
      badge: "TELC",
      badgeColor: "bg-emerald-100 text-emerald-700",
      duration: "~65 Dakika",
      parts: ["Hören · 20 soru", "Lesen · 20 soru", "Schreiben · 2 Teil"],
      desc: "TELC'in resmi örnek sınavı. Sınav öncesi kendinizi test edin.",
      href: `/exams/${level.toLowerCase()}/telc-set-1`,
      available: false,
    },
  ];

  const premiumExams = [
    {
      id: "premium-1",
      title: "Premium Deneme 1",
      subtitle: "Yakında",
      badge: "Premium",
      badgeColor: "bg-purple-100 text-purple-700",
      duration: "~65 Dakika",
      parts: ["Hören", "Lesen", "Schreiben"],
      desc: "Hazırlanıyor...",
      href: "#",
      available: false,
    },
  ];

  const exams = tier === "premium" ? premiumExams : starterExams;
  const tierTitle = tier === "premium" ? "Premium Denemeler" : "Başlangıç Denemeler";
  const tierDesc = tier === "premium"
    ? "Gerçek sınav formatıyla birebir aynı ileri seviye denemeler."
    : "Goethe ve TELC formatında resmi örnek sınavlar.";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Geri
          </button>
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            {level} · {tier === "premium" ? "Premium" : "Başlangıç"}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">{tierTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{tierDesc}</p>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {exams.map((exam, i) => (
          <div
            key={exam.id}
            className={`rounded-2xl border-2 bg-white p-6 transition ${
              exam.available
                ? "border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
                : "border-slate-100 opacity-60"
            }`}
            onClick={() => exam.available && router.push(exam.href)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${exam.badgeColor}`}>
                    {exam.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {exam.available ? "✓ Hazır" : "⏳ Yakında"}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{exam.title}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{exam.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{exam.desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {exam.parts.map((part) => (
                    <span
                      key={part}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {part}
                    </span>
                  ))}
                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    ⏱ {exam.duration}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-2xl">{i + 1 === 1 ? "📝" : "📋"}</div>
            </div>

            {exam.available && (
              <button
                onClick={(e) => { e.stopPropagation(); router.push(exam.href); }}
                className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 transition"
              >
                Sınava Başla →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExamListPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <ExamListContent />
    </Suspense>
  );
}