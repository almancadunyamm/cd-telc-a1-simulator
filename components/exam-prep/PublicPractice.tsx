"use client";

// Herkese açık /sinav-hazirlik/[seviye]/[sinav]/[bolum] sayfasındaki alıştırma alanı.
// Her bölümün 1. alıştırması kayıtsız çözülür; diğer alıştırmalar için ücretsiz kayıt daveti gösterilir.

import { useEffect, useRef, useState } from "react";
import { PracticeShell, TipsBox } from "./ExamPrepTab";
import { EXAMS_BY_LEVEL, type Level } from "./exams-config";

type Props = { level: Level; examKey: string; teilIndex: number };

export default function PublicPractice({ level, examKey, teilIndex }: Props) {
  const exam = EXAMS_BY_LEVEL[level].find((e) => e.key === examKey)!;
  const teil = exam.teile[teilIndex];
  const sets = teil.sets as { id: string; title: string }[];
  const [loggedIn, setLoggedIn] = useState(false);
  const [gateFor, setGateFor] = useState<string | null>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setLoggedIn(!!window.localStorage.getItem("mock_logged_user"));
    } catch {
      /* depolama yoksa misafir say */
    }
  }, []);

  const openGate = (title: string) => {
    setGateFor(title);
    setTimeout(() => gateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const registerHref = `/register?level=${level}&package=starter&free=true`;
  const remaining = sets.length - 1;

  const Gate = ({ compact = false }: { compact?: boolean }) => (
    <div className={`rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 ${compact ? "mt-4 p-4" : "p-6"} shadow-sm`}>
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">🎁 Ücretsiz üyelikle devam et</p>
      <h3 className="mt-1 text-lg font-black text-slate-900">
        {loggedIn
          ? `${exam.name} ${level} alıştırmalarının tamamı panelinde`
          : `Bu bölümde ${remaining} alıştırma daha var`}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {loggedIn
          ? "Öğrenci panelinde Sınav Hazırlık menüsünden bütün alıştırmaları çözebilir, ilerlemeni takip edebilirsin."
          : `Ücretsiz ${level} Başlangıç üyeliğiyle telc, Goethe ve ÖSD formatındaki tüm ${level} alıştırmalarını çöz; video dersler, çalışma sayfaları ve Kelime Arenası da hediye. Kredi kartı gerekmez.`}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {loggedIn ? (
          <a href="/dashboard" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow hover:bg-blue-700">
            Panelde devam et →
          </a>
        ) : (
          <>
            <a href={registerHref} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow hover:bg-blue-700">
              Ücretsiz Kayıt Ol ({level})
            </a>
            <a href="/login" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
              Giriş Yap
            </a>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <PracticeShell
        exam={exam}
        teil={teil}
        setIndex={0}
        onBack={() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        backLabel="↓ Diğer alıştırmalar"
        onNext={() => openGate(sets[1]?.title || "")}
        onScore={() => {}}
        afterCheck={<Gate compact />}
      />

      <div ref={listRef} className="mt-10 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {exam.name} {level} · {teil.title}: tüm alıştırmalar
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {sets.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => (i === 0 ? window.scrollTo({ top: 0, behavior: "smooth" }) : openGate(s.title))}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Alıştırma {i + 1}</p>
                  <p lang="de" className="mt-1 font-black text-slate-900">{s.title}</p>
                </div>
                {i === 0 ? (
                  <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">Ücretsiz</span>
                ) : (
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">🔒 Üyelikle</span>
                )}
              </button>
            ))}
          </div>
          <div ref={gateRef} className="mt-4">
            {gateFor !== null && <Gate />}
          </div>
        </div>
        <TipsBox teil={teil} />
      </div>
    </div>
  );
}
