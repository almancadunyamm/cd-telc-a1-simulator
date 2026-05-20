"use client";

import { useMemo, useRef, useState } from "react";
import { a1Set1 as questions } from "../../app/data/exams/a1-set-1";
import { Question, SectionType } from "../../app/data/questions";
import type { ExamDefinition } from "@/src/types/content";

const HOEREN_DURATION_SECONDS = 20 * 60;

const AUDIO_BY_PART: Record<string, string> = {
  "Teil 1": "/audio/a1-set-1/hoeren-teil-1.mp3",
  "Teil 2": "/audio/a1-set-1/hoeren-teil-2.mp3",
  "Teil 3": "/audio/a1-set-1/hoeren-teil-3.mp3",
};

type ExamOption = {
  id: string;
  title: string;
  description: string;
  available: boolean;
};

type ExamSimulatorProps = {
  mode?: "selection" | "direct";
  forcedExamId?: string;
  adminExam?: ExamDefinition | null;
};

const EXAM_OPTIONS: ExamOption[] = [
  {
    id: "a1-set-1",
    title: "TELC A1 Set 1",
    description: "Hazır olan ilk tam deneme sınavı",
    available: true,
  },
];

export default function ExamSimulator({
  mode = "selection",
  forcedExamId,
  adminExam = null,
}: ExamSimulatorProps) {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(
    mode === "direct" ? forcedExamId ?? "a1-set-1" : null
  );
  const [examStarted, setExamStarted] = useState(mode === "direct");
  const [activeSection, setActiveSection] = useState<SectionType>("Hören");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [_timeLeft] = useState(HOEREN_DURATION_SECONDS);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedExam = useMemo(() => {
    return EXAM_OPTIONS.find((exam) => exam.id === selectedExamId) || null;
  }, [selectedExamId]);

  const simulatorTitle =
    adminExam?.title || selectedExam?.title || "TELC A1 Deneme Sınavı";

  const adminHoerenQuestionCount = adminExam
    ? adminExam.content.hoeren.reduce((sum, part) => sum + part.questions.length, 0)
    : 0;

  const adminHoerenFlatQuestions = useMemo(() => {
    if (!adminExam) return [];

    return adminExam.content.hoeren.flatMap((part) =>
      part.questions.map((question) => ({
        ...question,
        partTitle: part.title,
      }))
    );
  }, [adminExam]);

  const adminLesenTeil1Parts = useMemo(() => {
    if (!adminExam) return [];
    return adminExam.content.lesen.filter((part) => part.format === "teil_1");
  }, [adminExam]);

  const adminLesenTeil2Parts = useMemo(() => {
    if (!adminExam) return [];
    return adminExam.content.lesen.filter((part) => part.format === "teil_2");
  }, [adminExam]);
    const adminLesenTeil3Parts = useMemo(() => {
    if (!adminExam) return [];
    return adminExam.content.lesen.filter((part) => part.format === "teil_3");
  }, [adminExam]);

  const adminLesenTeil1FlatQuestions = useMemo(() => {
    if (!adminExam) return [];

    return adminLesenTeil1Parts.flatMap((part) =>
      (part.teil1Blocks ?? []).flatMap((block) =>
        block.questions.map((question) => ({
          ...question,
          partTitle: part.title,
          blockTitle: block.title ?? "",
          blockText: block.text,
        }))
      )
    );
  }, [adminExam, adminLesenTeil1Parts]);

  const adminLesenTeil2FlatQuestions = useMemo(() => {
    if (!adminExam) return [];

    return adminLesenTeil2Parts.flatMap((part) =>
      (part.teil2Items ?? []).map((item) => ({
        ...item,
        partTitle: part.title,
      }))
    );
  }, [adminExam, adminLesenTeil2Parts]);
    const adminLesenTeil3FlatQuestions = useMemo(() => {
    if (!adminExam) return [];

    return adminLesenTeil3Parts.flatMap((part) =>
      (part.teil3Items ?? []).map((item) => ({
        ...item,
        partTitle: part.title,
      }))
    );
  }, [adminExam, adminLesenTeil3Parts]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => q.section === activeSection);
  }, [activeSection]);

  const currentQuestion = filteredQuestions[currentQuestionIndex] ?? null;
  const currentPartName = currentQuestion?.part ?? "";
  const isHoeren = activeSection === "Hören";
  const isLesen = activeSection === "Lesen";

  const currentPartQuestions = useMemo(() => {
    return filteredQuestions.filter((q) => q.part === currentPartName);
  }, [filteredQuestions, currentPartName]);

  const currentAudioSrc =
    !adminExam && isHoeren ? AUDIO_BY_PART[currentPartName] || "" : "";

  const adminHoerenCorrectCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminHoerenFlatQuestions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  }, [adminExam, adminHoerenFlatQuestions, answers]);

  const adminHoerenAnsweredCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminHoerenFlatQuestions.reduce((total, question) => {
      return total + (answers[question.id] ? 1 : 0);
    }, 0);
  }, [adminExam, adminHoerenFlatQuestions, answers]);

  const adminHoerenPercent = useMemo(() => {
    if (!adminExam || adminHoerenFlatQuestions.length === 0) return 0;

    return Math.round(
      (adminHoerenCorrectCount / adminHoerenFlatQuestions.length) * 100
    );
  }, [adminExam, adminHoerenCorrectCount, adminHoerenFlatQuestions]);

  const adminLesenTeil1CorrectCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil1FlatQuestions.reduce((total, question) => {
      return total + (answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil1FlatQuestions, answers]);

  const adminLesenTeil1AnsweredCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil1FlatQuestions.reduce((total, question) => {
      return total + (answers[question.id] ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil1FlatQuestions, answers]);

  const adminLesenTeil1Percent = useMemo(() => {
    if (!adminExam || adminLesenTeil1FlatQuestions.length === 0) return 0;

    return Math.round(
      (adminLesenTeil1CorrectCount / adminLesenTeil1FlatQuestions.length) * 100
    );
  }, [adminExam, adminLesenTeil1CorrectCount, adminLesenTeil1FlatQuestions]);

  const adminLesenTeil2CorrectCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil2FlatQuestions.reduce((total, item) => {
      return total + (answers[item.id] === item.correctOptionId ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil2FlatQuestions, answers]);

  const adminLesenTeil2AnsweredCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil2FlatQuestions.reduce((total, item) => {
      return total + (answers[item.id] ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil2FlatQuestions, answers]);

  const adminLesenTeil2Percent = useMemo(() => {
    if (!adminExam || adminLesenTeil2FlatQuestions.length === 0) return 0;

    return Math.round(
      (adminLesenTeil2CorrectCount / adminLesenTeil2FlatQuestions.length) * 100
    );
  }, [adminExam, adminLesenTeil2CorrectCount, adminLesenTeil2FlatQuestions]);
    const adminLesenTeil3CorrectCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil3FlatQuestions.reduce((total, item) => {
      return total + (answers[item.id] === item.correctOptionId ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil3FlatQuestions, answers]);

  const adminLesenTeil3AnsweredCount = useMemo(() => {
    if (!adminExam) return 0;

    return adminLesenTeil3FlatQuestions.reduce((total, item) => {
      return total + (answers[item.id] ? 1 : 0);
    }, 0);
  }, [adminExam, adminLesenTeil3FlatQuestions, answers]);

  const adminLesenTeil3Percent = useMemo(() => {
    if (!adminExam || adminLesenTeil3FlatQuestions.length === 0) return 0;

    return Math.round(
      (adminLesenTeil3CorrectCount / adminLesenTeil3FlatQuestions.length) * 100
    );
  }, [adminExam, adminLesenTeil3CorrectCount, adminLesenTeil3FlatQuestions]);

    const totalAutoCorrectCount = adminExam
    ? adminHoerenFlatQuestions.length +
      adminLesenTeil1FlatQuestions.length +
      adminLesenTeil2FlatQuestions.length +
      adminLesenTeil3FlatQuestions.length
    : 0;

    const totalAutoCorrectSuccess = adminExam
    ? adminHoerenCorrectCount +
      adminLesenTeil1CorrectCount +
      adminLesenTeil2CorrectCount +
      adminLesenTeil3CorrectCount
    : 0;

  const totalAutoCorrectPercent =
    totalAutoCorrectCount > 0
      ? Math.round((totalAutoCorrectSuccess / totalAutoCorrectCount) * 100)
      : 0;

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
    const adminLesenTotalQuestionCount =
    adminLesenTeil1FlatQuestions.length +
    adminLesenTeil2FlatQuestions.length +
    adminLesenTeil3FlatQuestions.length;

  const adminLesenTotalCorrectCount =
    adminLesenTeil1CorrectCount +
    adminLesenTeil2CorrectCount +
    adminLesenTeil3CorrectCount;

  const adminLesenTotalAnsweredCount =
    adminLesenTeil1AnsweredCount +
    adminLesenTeil2AnsweredCount +
    adminLesenTeil3AnsweredCount;

  const adminLesenTotalPercent =
    adminLesenTotalQuestionCount > 0
      ? Math.round(
          (adminLesenTotalCorrectCount / adminLesenTotalQuestionCount) * 100
        )
      : 0;
    
        const adminHoerenPartSummaries = useMemo(() => {
    if (!adminExam) return [];

    return adminExam.content.hoeren.map((part) => {
      const total = part.questions.length;
      const answered = part.questions.filter((question) => answers[question.id]).length;
      const correct = part.questions.filter(
        (question) => answers[question.id] === question.correctOptionId
      ).length;

      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        id: part.id,
        title: part.title,
        total,
        answered,
        correct,
        percent,
      };
    });
  }, [adminExam, answers]);

  const adminLesenPartSummaries = useMemo(() => {
    if (!adminExam) return [];

    return adminExam.content.lesen.map((part) => {
      let total = 0;
      let answered = 0;
      let correct = 0;

      if (part.format === "teil_1") {
        const questions = (part.teil1Blocks ?? []).flatMap((block) => block.questions);
        total = questions.length;
        answered = questions.filter((question) => answers[question.id]).length;
        correct = questions.filter(
          (question) => answers[question.id] === question.correctOptionId
        ).length;
      }

      if (part.format === "teil_2") {
        const items = part.teil2Items ?? [];
        total = items.length;
        answered = items.filter((item) => answers[item.id]).length;
        correct = items.filter(
          (item) => answers[item.id] === item.correctOptionId
        ).length;
      }

      if (part.format === "teil_3") {
        const items = part.teil3Items ?? [];
        total = items.length;
        answered = items.filter((item) => answers[item.id]).length;
        correct = items.filter(
          (item) => answers[item.id] === item.correctOptionId
        ).length;
      }

      const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        id: part.id,
        title: part.title,
        format: part.format,
        total,
        answered,
        correct,
        percent,
      };
    });
  }, [adminExam, answers]);

  const handleNext = () => {
    if (isHoeren && adminExam) {
      setActiveSection("Lesen");
      setCurrentQuestionIndex(0);
      return;
    }

    if (isLesen && adminExam) {
      setShowResult(true);
      return;
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    if (activeSection === "Hören") {
      setActiveSection("Lesen");
      setCurrentQuestionIndex(0);
      return;
    }

    if (activeSection === "Lesen") {
      setActiveSection("Schreiben");
      setCurrentQuestionIndex(0);
      return;
    }

    setShowResult(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setShowResult(false);
    setActiveSection("Hören");
    setCurrentQuestionIndex(0);
    setExamStarted(true);
  };

  const renderQuestion = (question: Question, index: number) => {
    const answerKey = String(question.id);
    const value = answers[answerKey] || "";

    return (
      <div key={question.id} className="mb-6 rounded-xl border p-5">
        <h3 className="mb-3 font-semibold">
          {index + 1}. {question.title}
        </h3>

        {question.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleSelect(answerKey, opt)}
            className={`mb-2 block w-full rounded-lg border p-3 text-left ${
              value === opt ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  if (!examStarted) {
    return (
      <div className="p-10">
        <button
          onClick={() => {
            setSelectedExamId(forcedExamId ?? "a1-set-1");
            setExamStarted(true);
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Sınava Başla
        </button>
      </div>
    );
  }

  if (showResult) {
    return (
      <main className="min-h-screen bg-slate-200 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
          <h1 className="mb-4 text-2xl font-bold">{simulatorTitle}</h1>
          <div className="mb-6 flex flex-wrap gap-2">
  {[
    { key: "Hören", active: true },
    { key: "Lesen", active: true },
    { key: "Schreiben", active: false },
    { key: "Sprechen", active: false },
  ].map((item) => {
    const isActive = activeSection === item.key;

    return (
      <div
        key={item.key}
        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
          isActive
            ? "bg-blue-600 text-white"
            : item.active
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {item.key}
        {!item.active && (
          <span className="ml-2 text-xs">(yakında)</span>
        )}
      </div>
    );
  })}
</div>

          {adminExam ? (
            <>
                            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Hören
                  </h2>

                  <div className="space-y-3">
                    {adminHoerenPartSummaries.length === 0 ? (
                      <div className="rounded-lg bg-white p-3 text-sm text-slate-500">
                        Hören part sonucu yok.
                      </div>
                    ) : (
                      adminHoerenPartSummaries.map((part, index) => (
                        <div key={part.id} className="rounded-lg bg-white p-4">
                          <div className="font-semibold text-slate-900">
                            Teil {index + 1}: {part.title}
                          </div>

                          <div className="mt-2 space-y-1 text-sm text-slate-700">
                            <div>
                              Toplam soru: <strong>{part.total}</strong>
                            </div>
                            <div>
                              Cevaplanan: <strong>{part.answered}</strong>
                            </div>
                            <div>
                              Doğru: <strong>{part.correct}</strong>
                            </div>
                            <div>
                              Yüzde: <strong>%{part.percent}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    Lesen
                  </h2>

                  <div className="space-y-3">
                    {adminLesenPartSummaries.length === 0 ? (
                      <div className="rounded-lg bg-white p-3 text-sm text-slate-500">
                        Lesen part sonucu yok.
                      </div>
                    ) : (
                      adminLesenPartSummaries.map((part, index) => (
                        <div key={part.id} className="rounded-lg bg-white p-4">
                          <div className="font-semibold text-slate-900">
                            Teil {index + 1}: {part.title}
                          </div>

                          <div className="mt-2 space-y-1 text-sm text-slate-700">
                            <div>
                              Toplam soru: <strong>{part.total}</strong>
                            </div>
                            <div>
                              Cevaplanan: <strong>{part.answered}</strong>
                            </div>
                            <div>
                              Doğru: <strong>{part.correct}</strong>
                            </div>
                            <div>
                              Yüzde: <strong>%{part.percent}</strong>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Toplam
                </h2>

                <div className="space-y-2 text-sm text-slate-700">
                  <div>
                    Toplam otomatik soru: <strong>{totalAutoCorrectCount}</strong>
                  </div>
                  <div>
                    Toplam doğru: <strong>{totalAutoCorrectSuccess}</strong>
                  </div>
                  <div>
                    Hören toplam yüzde: <strong>%{adminHoerenPercent}</strong>
                  </div>
                  <div>
                    Lesen toplam yüzde: <strong>%{adminLesenTotalPercent}</strong>
                  </div>
                  <div>
                    Genel başarı: <strong>%{totalAutoCorrectPercent}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="font-semibold text-slate-900">Genel yorum</div>
                <div className="mt-2 text-sm text-slate-700">
                  {totalAutoCorrectPercent >= 70
                    ? "Güzel gidiyorsun. Otomatik puanlanan bölümlerde iyi bir sonuç aldın."
                    : "Daha fazla pratik yapman faydalı olur. Özellikle yanlış yaptığın sorulara tekrar bak."}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border p-4">
              Bu sonuç ekranı şu an admin içerikleri için hazır.
            </div>
          )}
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
  <h2 className="mb-3 text-lg font-semibold text-slate-900">
    Lesen Teil 3
  </h2>
  <div className="space-y-2 text-sm text-slate-700">
    <div>Toplam soru: <strong>{adminLesenTeil3FlatQuestions.length}</strong></div>
    <div>Cevaplanan: <strong>{adminLesenTeil3AnsweredCount}</strong></div>
    <div>Doğru: <strong>{adminLesenTeil3CorrectCount}</strong></div>
    <div>Yüzde: <strong>%{adminLesenTeil3Percent}</strong></div>
  </div>
</div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRestart}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Tekrar Çöz
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-200 p-6">

      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">
  <div className="border-b border-slate-200 bg-slate-950 p-6 text-white">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
          TELC Dijital Sınav Simülatörü
        </p>

        <h1 className="mt-2 text-2xl font-black md:text-3xl">
          {simulatorTitle}
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Gerçek sınav akışına uygun dijital deneme deneyimi
        </p>
      </div>

      <div className="rounded-2xl bg-white/10 px-5 py-4 text-right backdrop-blur">
        <p className="text-xs text-slate-300">Aktif bölüm</p>
        <p className="text-xl font-black">{activeSection}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 md:grid-cols-4">
      {["Hören", "Lesen", "Schreiben", "Sprechen"].map((section) => (
        <div
          key={section}
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            activeSection === section
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-white/10 text-slate-300"
          }`}
        >
          {section}
        </div>
      ))}
    </div>
  </div>

  <div className="p-6"></div>

        {!adminExam && currentAudioSrc && (
          <audio ref={audioRef} controls className="mb-4 w-full">
            <source src={currentAudioSrc} />
          </audio>
        )}

        {adminExam && isHoeren ? (
          <div className="space-y-6">
            {adminExam.content.hoeren.map((part) => (
              <div
                key={part.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
              >
                <div className="mb-2 text-lg font-semibold text-slate-900">
                  {part.sortOrder}. {part.title}
                </div>

                {part.instructions ? (
                  <div className="mb-2 text-sm text-slate-600">
                    {part.instructions}
                  </div>
                ) : null}

                <div className="mb-4 text-xs text-slate-500">
                  Audio: {part.audioUrl}
                </div>

                {part.questions.length === 0 ? (
                  <div className="rounded-lg border bg-white p-4 text-sm text-slate-500">
                    Bu part içinde henüz soru yok.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {part.questions.map((question, questionIndex) => {
                      const answerKey = question.id;
                      const selectedValue = answers[answerKey] || "";

                      return (
                        <div
                          key={question.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <h3 className="mb-3 text-lg font-semibold text-slate-900">
                            {questionIndex + 1}. {question.prompt}
                          </h3>

                          <div className="space-y-3">
                            {question.options.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(answerKey, option.id)}
                                className={`block w-full rounded-xl border p-4 text-left font-medium transition ${
                                  selectedValue === option.id
                                    ? "border-[#4b6fd3] bg-[#4b6fd3] text-white"
                                    : "bg-white text-slate-900 hover:bg-slate-100"
                                }`}
                              >
                                {option.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : adminExam && isLesen ? (
          <div className="space-y-8">
            {adminLesenTeil1Parts.length === 0 &&
 adminLesenTeil2Parts.length === 0 &&
 adminLesenTeil3Parts.length === 0 ? (
              <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-500">
                Bu sınavda henüz Lesen içeriği yok.
              </div>
            ) : (
              <>
                {adminLesenTeil1Parts.map((part) => (
                  <div key={part.id} className="rounded-xl border p-4">
                    <div className="mb-2 text-lg font-semibold text-slate-900">
                      {part.sortOrder}. {part.title}
                    </div>

                    {part.instructions ? (
                      <div className="mb-3 text-sm text-slate-600">
                        {part.instructions}
                      </div>
                    ) : null}

                    {part.exampleQuestion ? (
                      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-amber-900">
                          Örnek soru
                        </div>

                        <div className="mb-3 text-sm text-slate-800">
                          {part.exampleQuestion.prompt}
                        </div>

                        <div className="space-y-2">
                          {part.exampleQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className={`rounded border p-3 text-sm ${
                                option.id === part.exampleQuestion?.correctOptionId
                                  ? "border-green-300 bg-green-100 text-green-800"
                                  : "bg-white text-slate-700"
                              }`}
                            >
                              {option.text}
                            </div>
                          ))}
                        </div>

                        {part.exampleQuestion.explanation ? (
                          <div className="mt-3 text-xs text-slate-500">
                            {part.exampleQuestion.explanation}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="space-y-6">
                      {(part.teil1Blocks ?? []).map((block) => (
                        <div key={block.id} className="rounded-xl border bg-slate-50 p-4">
                          {block.title ? (
                            <div className="mb-2 font-medium text-slate-900">
                              {block.title}
                            </div>
                          ) : null}

                          <div className="mb-4 whitespace-pre-line rounded-lg bg-white p-4 text-sm leading-7 text-slate-800">
                            {block.text}
                          </div>

                          <div className="space-y-4">
                            {block.questions.map((question, questionIndex) => {
                              const answerKey = question.id;
                              const selectedValue = answers[answerKey] || "";

                              return (
                                <div
                                  key={question.id}
                                  className="rounded-xl border bg-white p-4"
                                >
                                  <div className="mb-3 font-medium text-slate-900">
                                    {questionIndex + 1}. {question.prompt}
                                  </div>

                                  <div className="space-y-2">
                                    {question.options.map((option) => (
                                      <button
                                        key={option.id}
                                        type="button"
                                        onClick={() =>
                                          handleSelect(answerKey, option.id)
                                        }
                                        className={`block w-full rounded-lg border p-3 text-left text-sm ${
                                          selectedValue === option.id
                                            ? "border-[#4b6fd3] bg-[#4b6fd3] text-white"
                                            : "bg-white text-slate-900 hover:bg-slate-100"
                                        }`}
                                      >
                                        {option.text}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {adminLesenTeil2Parts.map((part) => (
                  <div key={part.id} className="rounded-xl border p-4">
                    <div className="mb-2 text-lg font-semibold text-slate-900">
                      {part.sortOrder}. {part.title}
                    </div>

                    {part.instructions ? (
                      <div className="mb-3 text-sm text-slate-600">
                        {part.instructions}
                      </div>
                    ) : null}

                    {part.exampleQuestion ? (
                      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-amber-900">
                          Örnek soru
                        </div>

                        <div className="mb-3 text-sm text-slate-800">
                          {part.exampleQuestion.prompt}
                        </div>

                        <div className="space-y-2">
                          {part.exampleQuestion.options.map((option) => (
                            <div
                              key={option.id}
                              className={`rounded border p-3 text-sm ${
                                option.id === part.exampleQuestion?.correctOptionId
                                  ? "border-green-300 bg-green-100 text-green-800"
                                  : "bg-white text-slate-700"
                              }`}
                            >
                              {option.text}
                            </div>
                          ))}
                        </div>

                        {part.exampleQuestion.explanation ? (
                          <div className="mt-3 text-xs text-slate-500">
                            {part.exampleQuestion.explanation}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="space-y-4">
                      {(part.teil2Items ?? []).map((item) => {
                        const answerKey = item.id;
                        const selectedValue = answers[answerKey] || "";

                        return (
                          <div key={item.id} className="rounded-xl border bg-slate-50 p-4">
                            <div className="mb-3 font-medium text-slate-900">
                              {item.sortOrder}. {item.prompt}
                            </div>

                            <div className="mb-4 grid gap-4 md:grid-cols-2">
                              <div className="rounded-xl border bg-white p-4">
                                <div className="mb-2 font-semibold text-slate-900">
                                  {item.optionALabel}
                                </div>
                                <div className="whitespace-pre-line text-sm text-slate-700">
                                  {item.optionAText}
                                </div>
                              </div>

                              <div className="rounded-xl border bg-white p-4">
                                <div className="mb-2 font-semibold text-slate-900">
                                  {item.optionBLabel}
                                </div>
                                <div className="whitespace-pre-line text-sm text-slate-700">
                                  {item.optionBText}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => handleSelect(answerKey, "opt-0")}
                                className={`block w-full rounded-lg border p-3 text-left text-sm ${
                                  selectedValue === "opt-0"
                                    ? "border-[#4b6fd3] bg-[#4b6fd3] text-white"
                                    : "bg-white text-slate-900 hover:bg-slate-100"
                                }`}
                              >
                                a
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelect(answerKey, "opt-1")}
                                className={`block w-full rounded-lg border p-3 text-left text-sm ${
                                  selectedValue === "opt-1"
                                    ? "border-[#4b6fd3] bg-[#4b6fd3] text-white"
                                    : "bg-white text-slate-900 hover:bg-slate-100"
                                }`}
                              >
                                b
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {adminLesenTeil3Parts.map((part) => (
  <div key={part.id} className="rounded-xl border p-4">
    <div className="mb-2 text-lg font-semibold text-slate-900">
      {part.sortOrder}. {part.title}
    </div>

    {part.instructions ? (
      <div className="mb-3 text-sm text-slate-600">
        {part.instructions}
      </div>
    ) : null}

    {part.exampleQuestion ? (
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 text-sm font-semibold text-amber-900">
          Örnek soru
        </div>

        <div className="mb-3 text-sm text-slate-800">
          {part.exampleQuestion.prompt}
        </div>

        <div className="space-y-2">
          {part.exampleQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`rounded border p-3 text-sm ${
                option.id === part.exampleQuestion?.correctOptionId
                  ? "border-green-300 bg-green-100 text-green-800"
                  : "bg-white text-slate-700"
              }`}
            >
              {option.text}
            </div>
          ))}
        </div>

        {part.exampleQuestion.explanation ? (
          <div className="mt-3 text-xs text-slate-500">
            {part.exampleQuestion.explanation}
          </div>
        ) : null}
      </div>
    ) : null}

    <div className="space-y-4">
      {(part.teil3Items ?? []).map((item) => {
        const answerKey = item.id;
        const selectedValue = answers[answerKey] || "";

        return (
          <div key={item.id} className="rounded-xl border bg-slate-50 p-4">
            {item.promptTitle ? (
              <div className="mb-2 font-medium text-slate-900">
                {item.promptTitle}
              </div>
            ) : null}

            <div className="mb-4 whitespace-pre-line rounded-xl border bg-white p-4 text-sm text-slate-700">
              {item.noticeText}
            </div>

            <div className="mb-4 text-sm font-medium text-slate-900">
              {item.statement}
            </div>

            <div className="space-y-2">
              {item.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(answerKey, option.id)}
                  className={`block w-full rounded-lg border p-3 text-left text-sm ${
                    selectedValue === option.id
                      ? "border-[#4b6fd3] bg-[#4b6fd3] text-white"
                      : "bg-white text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
))}
              </>
            )}
          </div>
        ) : isHoeren ? (
          <div>
            {currentPartQuestions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>
        ) : currentQuestion ? (
          <div>{renderQuestion(currentQuestion, currentQuestionIndex)}</div>
        ) : (
          <div className="rounded border bg-slate-50 p-4">
            Bu bölümde soru bulunamadı.
          </div>
        )}

        <button
          onClick={handleNext}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-white"
        >
          {adminExam && isHoeren
            ? "Lesen Bölümüne Geç"
            : adminExam && isLesen
            ? "Sonucu Gör"
            : "Sonraki"}
        </button>
        </div>
    </main>
  );
}