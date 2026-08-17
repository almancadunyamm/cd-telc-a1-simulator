"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { scoreLevelTest, type ScoredAnswer, type CefrLevel } from "@/lib/level-test/scoring";

type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  cefr_level: CefrLevel;
  weight: number;
  passage_id: string | null;
  passage_text?: string | null;
  passage_title?: string | null;
};

type Stage = "intro" | "quiz" | "lead" | "result";

const WHATSAPP_NUMBER = "905013434419";

const LEVEL_TARGETS: Record<CefrLevel, number> = {
  A1: 8,
  A2: 10,
  B1: 12,
  B2: 10,
};

const LEVEL_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LevelTestPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "a" | "b" | "c" | "d">>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  const [scoring, setScoring] = useState<ReturnType<typeof scoreLevelTest> | null>(null);

  async function startTest() {
    setLoading(true);

    const { data, error } = await supabase
      .from("level_test_questions")
      .select(
        "id, question_text, option_a, option_b, option_c, option_d, correct_answer, cefr_level, weight, passage_id, level_test_passages(title, passage_text)"
      )
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      alert("Sınav soruları yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      setLoading(false);
      return;
    }

    const normalized: Question[] = (data as any[]).map((q) => ({
      ...q,
      passage_title: q.level_test_passages?.title ?? null,
      passage_text: q.level_test_passages?.passage_text ?? null,
    }));

    let selected: Question[] = [];
    for (const level of LEVEL_ORDER) {
      const pool = shuffle(normalized.filter((q) => q.cefr_level === level));
      const target = LEVEL_TARGETS[level];
      selected = selected.concat(pool.slice(0, target));
    }

    if (selected.length === 0) {
      alert("Sınav soruları yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      setLoading(false);
      return;
    }

    const { data: attempt, error: attemptError } = await supabase
      .from("level_test_attempts")
      .insert({
        status: "in_progress",
        question_ids: selected.map((q) => q.id),
      })
      .select("id")
      .single();

    if (attemptError || !attempt) {
      console.error("Deneme kaydı oluşturulamadı:", attemptError);
    } else {
      setAttemptId(attempt.id);
    }

    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setStage("quiz");
    setLoading(false);
  }

  function selectAnswer(option: "a" | "b" | "c" | "d") {
    const q = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  }

  async function goNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      await finishQuiz();
    }
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  async function finishQuiz() {
    setLoading(true);

    const scoredAnswers: ScoredAnswer[] = questions.map((q) => {
      const selected = answers[q.id];
      return {
        cefr_level: q.cefr_level,
        is_correct: selected === q.correct_answer,
        weight: q.weight,
      };
    });

    const result = scoreLevelTest(scoredAnswers);
    setScoring(result);

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    if (attemptId) {
      const answerRows = questions.map((q) => ({
        attempt_id: attemptId,
        question_id: q.id,
        selected_answer: answers[q.id] || null,
        is_correct: answers[q.id] === q.correct_answer,
      }));

      await supabase.from("level_test_answers").insert(answerRows);

      await supabase
        .from("level_test_attempts")
        .update({
          status: "completed",
          result_level: result.resultLevel,
          result_sublevel: result.resultSublevel,
          a1_percent: result.percentages.A1,
          a2_percent: result.percentages.A2,
          b1_percent: result.percentages.B1,
          b2_percent: result.percentages.B2,
          total_weighted_score: result.totalWeightedScore,
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        })
        .eq("id", attemptId);
    }

    setLoading(false);
    setStage("lead");
  }

  async function saveLead() {
    if (!attemptId) {
      setStage("result");
      return;
    }

    if (name.trim() || phone.trim() || email.trim()) {
      await supabase
        .from("level_test_attempts")
        .update({
          name: name.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          wants_contact: wantsContact,
        })
        .eq("id", attemptId);
      setLeadSaved(true);
    }

    setStage("result");
  }

  function skipLead() {
    setStage("result");
  }

  async function handleCourseClick() {
    if (attemptId) {
      await supabase
        .from("level_test_attempts")
        .update({ clicked_course_button: true })
        .eq("id", attemptId);
    }

    const level = scoring?.resultLevel || "A1";
    const targetLevel = level === "B2" ? "B1" : level;

    window.location.href = `/academy-live?level=${targetLevel}#kayit`;
  }

  async function handleWhatsappClick() {
    if (attemptId) {
      await supabase
        .from("level_test_attempts")
        .update({ clicked_whatsapp_button: true })
        .eq("id", attemptId);
    }

    const level = scoring?.resultSublevel || "";
    const text = encodeURIComponent(
      `Merhaba, Almanca seviye tespit sınavını tamamladım. Sonucum: ${level}. Kurslar hakkında bilgi almak istiyorum.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  }

  // ─────────────────────────────────────────────────────────
  // INTRO
  // ─────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Ücretsiz · Üyelik gerektirmez
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Almanca Seviyenizi Öğrenin 🇩🇪
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
            Almanca seviyenizi A1–B2 arasında ölçmek için hazırlanan ücretsiz seviye
            tespit sınavına katılın. Sorular ilerledikçe zorlaşacaktır. Sınav
            sonucunda mevcut seviyeniz ve size önerilen eğitim seviyesi gösterilecektir.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 text-sm font-bold text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">📝 40 Soru</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">⏱️ 15–20 Dakika</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">🎯 A1 – A2 – B1 – B2</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">🆓 Ücretsiz</div>
          </div>

          <button
            type="button"
            onClick={startTest}
            disabled={loading}
            className="mt-9 rounded-full bg-blue-600 px-10 py-4 text-base font-black text-white shadow-xl shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Yükleniyor..." : "Sınava Başla"}
          </button>

          <p className="mx-auto mt-6 max-w-md text-xs leading-5 text-slate-400">
            Bu sınav resmî Goethe, TELC veya ÖSD sınavı değildir. Sonuçlar mevcut
            Almanca seviyenizi tahmini olarak belirlemek amacıyla hazırlanmıştır.
          </p>
        </div>

        <SeoSection />
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────
  // QUIZ
  // ─────────────────────────────────────────────────────────
  if (stage === "quiz") {
    const q = questions[currentIndex];
    const selected = answers[q.id];
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

    const options: Array<{ key: "a" | "b" | "c" | "d"; text: string }> = [
      { key: "a", text: q.option_a },
      { key: "b", text: q.option_b },
      { key: "c", text: q.option_c },
      { key: "d", text: q.option_d },
    ];

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm font-bold text-slate-500">
              <span>Soru {currentIndex + 1} / {questions.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {q.passage_text && (
            <div className="mb-4 rounded-3xl border border-blue-100 bg-blue-50 p-6">
              {q.passage_title && (
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-blue-700">
                  {q.passage_title}
                </p>
              )}
              <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
                {q.passage_text}
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
            <h2 className="text-xl font-black leading-relaxed text-slate-950">
              {q.question_text}
            </h2>

            <div className="mt-6 grid gap-3">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => selectAnswer(opt.key)}
                  className={`rounded-2xl border-2 px-5 py-4 text-left text-sm font-bold transition ${
                    selected === opt.key
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-2 font-black uppercase text-slate-400">{opt.key})</span>
                  {opt.text}
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                ← Geri
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!selected || loading}
                className="rounded-full bg-blue-600 px-7 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-40"
              >
                {loading
                  ? "Hesaplanıyor..."
                  : currentIndex + 1 === questions.length
                  ? "Sınavı Bitir"
                  : "İleri →"}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────
  // LEAD CAPTURE
  // ─────────────────────────────────────────────────────────
  if (stage === "lead") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-950">
            Sonucunuzu kaydetmek ister misiniz?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Bu adım isteğe bağlıdır. Bilgilerinizi bırakırsanız eğitim danışmanımız
            sizinle iletişime geçebilir.
          </p>

          <div className="mt-6 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefon"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />

            <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-slate-500">
              <input
                type="checkbox"
                checked={wantsContact}
                onChange={(e) => setWantsContact(e.target.checked)}
                className="mt-0.5"
              />
              Eğitim danışmanımızın benimle iletişime geçmesini istiyorum. Bilgilerimin
              bu amaçla işlenmesini kabul ediyorum.
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={saveLead}
              className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white hover:bg-blue-700"
            >
              Kaydet ve Sonucu Gör
            </button>
            <button
              type="button"
              onClick={skipLead}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-600 hover:bg-slate-50"
            >
              Geç, sadece sonucu göster
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RESULT
  // ─────────────────────────────────────────────────────────
  if (stage === "result" && scoring) {
    const pct = scoring.percentages;

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
              🇩🇪 Almanca Seviye Tespit Sonucunuz
            </p>
            <h2 className="mt-3 text-6xl font-black text-blue-700">{scoring.resultSublevel}</h2>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Tahmini mevcut seviyeniz: {scoring.resultLevel}
            </p>

            <div className="mx-auto mt-7 grid max-w-sm gap-2 text-left">
              {(["A1", "A2", "B1", "B2"] as CefrLevel[]).map((lvl) => {
                const val = pct[lvl];
                if (val === null) return null;
                return (
                  <div key={lvl}>
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{lvl} yeterliliği</span>
                      <span>%{val}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mx-auto mt-7 max-w-lg text-sm leading-6 text-slate-600">
              {scoring.explanation}
            </p>

            {leadSaved && (
              <p className="mt-4 text-xs font-bold text-emerald-600">
                ✓ Bilgileriniz kaydedildi, danışmanımız sizinle iletişime geçecek.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {scoring.resultLevel !== "B2" && (
                <button
                  type="button"
                  onClick={handleCourseClick}
                  className="rounded-full bg-blue-600 px-7 py-4 text-sm font-black text-white shadow-lg hover:bg-blue-700"
                >
                  {scoring.resultLevel} Kursunu İncele
                </button>
              )}
              <button
                type="button"
                onClick={handleWhatsappClick}
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800 hover:bg-slate-50"
              >
                💬 WhatsApp'tan Bilgi Al
              </button>
            </div>
          </div>
        </div>

        <SeoSection />
      </main>
    );
  }

  return null;
}

function SeoSection() {
  return (
    <div className="mx-auto mt-16 max-w-3xl px-2 text-left">
      <h2 className="text-2xl font-black text-slate-900">Almanca seviyeleri nelerdir?</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Almanca dil seviyeleri Avrupa Ortak Diller Çerçevesi'ne (CEFR) göre A1, A2, B1,
        B2, C1 ve C2 olarak sınıflandırılır. A1 ve A2 temel seviyeleri, B1 ve B2 orta
        seviyeleri, C1 ve C2 ise ileri seviyeleri ifade eder.
      </p>

      <h3 className="mt-6 text-lg font-black text-slate-900">A1 ile A2 arasındaki fark nedir?</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        A1 seviyesinde temel selamlaşma, tanışma ve günlük ihtiyaçları ifade edebilecek
        düzeyde Almanca kullanılır. A2 seviyesinde ise günlük hayatta sık karşılaşılan
        konularda daha akıcı iletişim kurulabilir.
      </p>

      <h3 className="mt-6 text-lg font-black text-slate-900">B1 Almanca seviyesi ne anlama gelir?</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        B1 seviyesi, günlük yaşamda ve iş ortamında bağımsız iletişim kurabilme
        yeteneğini ifade eder. Bu seviyedeki kişiler karmaşık olmayan metinleri
        anlayabilir ve görüşlerini ifade edebilir.
      </p>

      <h3 className="mt-6 text-lg font-black text-slate-900">B2 Almanca seviyesi ne anlama gelir?</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        B2 seviyesi orta-ileri düzeyi ifade eder. Bu seviyedeki kişiler karmaşık
        metinleri anlayabilir, soyut konularda akıcı şekilde tartışabilir ve ileri
        düzey dil yapılarını kullanabilir.
      </p>
    </div>
  );
}