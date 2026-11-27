"use client";

import { useState } from "react";
import HoerenPractice from "./HoerenPractice";
import { EXAMS_BY_LEVEL, type Level } from "./exams-config";

export default function PublicHoeren({ level, examKey }: { level: Level; examKey: string }) {
  const exam = EXAMS_BY_LEVEL[level].find((e) => e.key === examKey)!;
  const sets = exam.hoeren || [];
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  return (
    <div>
      {sets.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {sets.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`rounded-full px-4 py-2 text-sm font-black ${i === idx ? "bg-emerald-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}
      <HoerenPractice key={sets[idx].id} set={sets[idx]} onBack={() => window.scrollTo({ top: 0, behavior: "smooth" })} onScore={() => setDone(true)} />
      {done && (
        <div className="mt-6 rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-blue-700">🎁 Ücretsiz üyelikle devam et</p>
          <h3 className="mt-1 text-lg font-black text-slate-900">Tüm {level} Lesen ve Hören alıştırmaları panelinde</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Ücretsiz {level} Başlangıç üyeliğiyle telc, Goethe ve ÖSD formatındaki bütün alıştırmaları çöz ve ilerlemeni kaydet. Kredi kartı gerekmez.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/register?level=${level}&package=starter&free=true`} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow hover:bg-blue-700">
              Ücretsiz Üye Ol ({level})
            </a>
            <a href="/login" className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
              Giriş Yap
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
