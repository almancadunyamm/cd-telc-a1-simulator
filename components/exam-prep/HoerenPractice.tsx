"use client";

// Hören alıştırması: resmî kayıt (kurumun kendi sunucusundan) + Almanca Okulum'un özgün soruları.
import React, { useMemo, useState } from "react";
import type { HoerenQuestion, HoerenSet } from "@/app/data/exam-prep/goethe_b1_hoeren";

type Props = {
  set: HoerenSet;
  onBack: () => void;
  onScore: (setId: string, score: number) => void;
};

export default function HoerenPractice({ set, onBack, onScore }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const scored = useMemo(() => set.teile.flatMap((t) => t.questions.filter((q) => !q.example)), [set]);
  const total = scored.length;
  const correct = scored.filter((q) => answers[String(q.id)] === q.answer).length;
  const answered = scored.filter((q) => answers[String(q.id)] !== undefined).length;

  const choose = (q: HoerenQuestion, v: string) => {
    if (checked || q.example) return;
    setAnswers((a) => ({ ...a, [String(q.id)]: v }));
  };

  const check = () => {
    setChecked(true);
    onScore(set.id, correct);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  return (
    <div className="mt-4">
      {/* Ses oynatıcı – yapışkan */}
      <div className="sticky top-0 z-20 -mx-1 rounded-3xl border-2 border-emerald-700 bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p lang="de" className="text-xs font-black uppercase tracking-widest opacity-80">🎧 Goethe-Zertifikat B1 · Hören · ca. {set.minutes} Minuten</p>
            <p className="text-lg font-black">{set.title}</p>
          </div>
          {checked && (
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-black text-emerald-800">
              {correct} / {total} doğru
            </span>
          )}
        </div>
        <audio
          controls
          preload="none"
          src={set.audioUrl}
          onError={() => setAudioError(true)}
          className="mt-3 w-full"
          controlsList="nodownload"
        >
          Tarayıcın ses oynatmayı desteklemiyor.
        </audio>
        {audioError && (
          <p className="mt-2 rounded-xl bg-white/15 px-3 py-2 text-xs">
            Ses şu an yüklenemedi. Kaydı{" "}
            <a href={set.sourcePage} target="_blank" rel="noopener noreferrer" className="font-black underline">
              Goethe-Institut sayfasından
            </a>{" "}
            açıp aynı anda bu sayfadaki soruları çözebilirsin.
          </p>
        )}
        <p className="mt-2 text-[11px] leading-4 opacity-80">
          Ses: {set.sourceLabel}. © Goethe-Institut / ÖSD. Kayıt Goethe-Institut&apos;un resmî sunucusundan oynatılır.{" "}
          <a href={set.sourcePage} target="_blank" rel="noopener noreferrer" className="underline">
            Kaynak
          </a>
          . Sorular ve Türkçe açıklamalar Almanca Okulum&apos;a aittir.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        <b>Gerçek sınav gibi çöz:</b>{" "}Kaydı başlat ve durdurmadan sonuna kadar dinle. Kayıt sana her bölümde soruları okuman
        için süre verir (Teil 1&apos;de her metin <b>iki kez</b>, Teil 2 ve 3 <b>bir kez</b>, Teil 4 <b>iki kez</b>{" "}çalınır).
        Bitince &quot;Cevapları Kontrol Et&quot;e bas. Sınavda kayıt geri sarılamaz!
      </div>

      {set.teile.map((t) => (
        <section key={t.no} className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 lang="de" className="text-lg font-black text-slate-900">{t.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${t.plays === 1 ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"}`}>
              {t.plays === 1 ? "🔊 1 kez dinlenir" : "🔊 2 kez dinlenir"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t.instruction}</p>
          {t.context && (
            <p lang="de" className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold italic text-slate-700">
              {t.context}
            </p>
          )}
          {t.speakers && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
              {t.speakers.map((s) => (
                <span key={s.key} className="rounded-full bg-slate-900 px-3 py-1 text-white">
                  {s.key} = {s.text}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 space-y-3">
            {t.questions.map((q) => (
              <React.Fragment key={String(q.id)}>
                {t.textLabels?.[String(q.id)] && (
                  <p lang="de" className="pt-2 text-xs font-black uppercase tracking-widest text-emerald-700">{t.textLabels[String(q.id)]}</p>
                )}
                <QuestionRow q={q} value={q.example ? q.answer : answers[String(q.id)]} checked={checked} onChoose={(v) => choose(q, v)} speakers={t.speakers} />
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
          ← Geri
        </button>
        {!checked ? (
          <button
            type="button"
            onClick={check}
            disabled={answered === 0}
            className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            Cevapları Kontrol Et ({answered}/{total})
          </button>
        ) : (
          <>
            <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
              Sonuç: {correct}/{total} · {Math.round((correct / total) * 100)} puan (geçme sınırı 60)
            </span>
            <button type="button" onClick={reset} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-700">
              Tekrar Çöz
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionRow({
  q,
  value,
  checked,
  onChoose,
  speakers,
}: {
  q: HoerenQuestion;
  value?: string;
  checked: boolean;
  onChoose: (v: string) => void;
  speakers?: { key: string; text: string }[];
}) {
  const opts =
    q.kind === "rf"
      ? [
          { key: "r", text: "Richtig" },
          { key: "f", text: "Falsch" },
        ]
      : q.kind === "who"
      ? speakers || []
      : q.options || [];
  const reveal = checked || q.example;
  const isRight = value === q.answer;

  return (
    <div className={`rounded-2xl border p-3 ${q.example ? "border-dashed border-slate-300 bg-slate-50" : reveal ? (isRight ? "border-emerald-300 bg-emerald-50/50" : "border-rose-300 bg-rose-50/50") : "border-slate-200"}`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <p lang="de" className="text-sm font-semibold text-slate-800 md:max-w-[55%]">
          <span className="mr-2 inline-block min-w-[1.8rem] rounded-md bg-slate-800 px-1.5 text-center text-xs font-black text-white">{q.id}</span>
          {q.example && <span className="mr-1 text-xs font-black uppercase text-slate-400">Beispiel ·</span>}
          {q.text}
        </p>
        <div className={`flex gap-2 ${q.kind === "mc" ? "flex-col md:min-w-[42%]" : "flex-wrap"}`}>
          {opts.map((o) => {
            const sel = value === o.key;
            const good = reveal && o.key === q.answer;
            const bad = reveal && sel && o.key !== q.answer;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => onChoose(o.key)}
                className={`rounded-xl border px-3 py-1.5 text-left text-sm font-bold transition ${
                  good
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : bad
                    ? "border-rose-500 bg-rose-500 text-white"
                    : sel
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
                }`}
              >
                {q.kind !== "rf" && <span className="mr-1.5 font-black opacity-70">{o.key}</span>}
                {q.kind === "who" ? o.text.split(" ")[0] : o.text}
              </button>
            );
          })}
        </div>
      </div>
      {reveal && !q.example && (
        <p className="mt-2 text-xs leading-5 text-slate-600">
          <b>{isRight ? "✓ Doğru." : value ? "✗ Yanlış." : "– Boş."}</b> {q.explanation}
        </p>
      )}
    </div>
  );
}
