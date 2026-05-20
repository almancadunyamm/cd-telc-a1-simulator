"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExamById, updateExam } from "@/src/lib/content-storage";
import type {
  ExamDefinition,
  HoerenPart,
  SchreibenTask,
} from "@/src/types/content";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params?.id as string;

  const [exam, setExam] = useState<ExamDefinition | null>(null);
  const [copied, setCopied] = useState(false);

  // HÖREN
  const [partTitle, setPartTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // LESEN
  const [lesenTitle, setLesenTitle] = useState("");
  const [lesenText, setLesenText] = useState("");
  const [lesenFormat, setLesenFormat] = useState<"teil_1" | "teil_2" | "teil_3">("teil_1");

  // SCHREIBEN
  const [schreibenTitle, setSchreibenTitle] = useState("");
  const [schreibenInstructions, setSchreibenInstructions] = useState("");
  const [minWords, setMinWords] = useState("");
  const [maxWords, setMaxWords] = useState("");

  useEffect(() => {
    if (!examId) return;
    const found = getExamById(examId);
    setExam(found);
  }, [examId]);

  const publicPath = exam ? `/exam/${exam.id}` : "";

  const handleCopyLink = async () => {
    if (!exam) return;

    const fullUrl = `${window.location.origin}/exam/${exam.id}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Link kopyalanamadı.");
    }
  };

  const handleAddHoerenPart = () => {
    if (!exam) return;

    if (!partTitle.trim()) {
      alert("Hören başlığı gir.");
      return;
    }

    if (!audioUrl.trim()) {
      alert("Audio URL gir.");
      return;
    }

    const newPart: HoerenPart = {
      id: generateId(),
      title: partTitle.trim(),
      instructions: instructions.trim(),
      audioUrl: audioUrl.trim(),
      transcript: "",
      questions: [],
      sortOrder: exam.content.hoeren.length + 1,
    };

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        hoeren: [...exam.content.hoeren, newPart],
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    setExam(updatedExam);

    setPartTitle("");
    setInstructions("");
    setAudioUrl("");
  };

  const handleAddLesenPart = () => {
    if (!exam) return;

    if (!lesenTitle.trim()) {
      alert("Lesen başlığı gir");
      return;
    }

    if (!lesenText.trim()) {
      alert("Metin gir");
      return;
    }

    const newPart: ExamDefinition["content"]["lesen"][number] = {
  id: generateId(),
  title: lesenTitle.trim(),
  instructions: "",
  text: lesenText.trim(),
  questions: [],
  sortOrder: exam.content.lesen.length + 1,
  format: lesenFormat,
  answerMode: lesenFormat === "teil_2" ? "a_b" : "true_false",
  exampleQuestion: undefined,
  teil1Blocks: [],
  teil2Items: [],
  teil3Items: [],
};

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: [...exam.content.lesen, newPart],
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    setExam(updatedExam);

    setLesenTitle("");
    setLesenText("");
  };

  const handleAddSchreibenTask = () => {
    if (!exam) return;

    if (!schreibenTitle.trim()) {
      alert("Schreiben başlığı gir");
      return;
    }

    if (!schreibenInstructions.trim()) {
      alert("Görev açıklaması gir");
      return;
    }

    const newTask: SchreibenTask = {
      id: generateId(),
      title: schreibenTitle.trim(),
      instructions: schreibenInstructions.trim(),
      placeholder: "",
      minWords: minWords ? Number(minWords) : undefined,
      maxWords: maxWords ? Number(maxWords) : undefined,
      sortOrder: exam.content.schreiben.length + 1,
    };

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        schreiben: [...exam.content.schreiben, newTask],
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    setExam(updatedExam);

    setSchreibenTitle("");
    setSchreibenInstructions("");
    setMinWords("");
    setMaxWords("");
  };

  if (!exam) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-2xl font-bold">{exam.title}</h1>

      <div className="mb-3 text-sm text-gray-600">
        Seviye: {exam.level.toUpperCase()}
      </div>

      <div className="mb-6 rounded-lg border bg-slate-50 p-4">
        <div className="mb-2 text-sm font-semibold text-slate-700">
          Public sınav linki
        </div>

        <div className="break-all rounded bg-white p-3 text-sm text-slate-600">
          {publicPath}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.open(publicPath, "_blank")}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Sınavı Aç
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white"
          >
            {copied ? "Kopyalandı" : "Linki Kopyala"}
          </button>
        </div>
      </div>

      {/* HÖREN FORM */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-4 font-semibold">Hören Part Ekle</h2>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Hören başlığı"
          value={partTitle}
          onChange={(e) => setPartTitle(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          placeholder="Yönerge"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Audio URL"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
        />

        <button
          onClick={handleAddHoerenPart}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Hören ekle
        </button>
      </div>

      {/* HÖREN LİSTE + SORU EKLE */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-3 font-semibold">Hören İçeriği</h2>

        {exam.content.hoeren.length === 0 ? (
          <p>Henüz Hören yok</p>
        ) : (
          <div className="space-y-4">
            {exam.content.hoeren.map((part) => (
              <div key={part.id} className="rounded border p-4">
                <div className="font-medium">
                  {part.sortOrder}. {part.title}
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  {part.instructions}
                </div>

                <div className="mt-1 text-xs text-blue-600">
                  {part.audioUrl}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Soru: {part.questions.length}
                </div>

                <AddHoerenQuestionForm
                  exam={exam}
                  partId={part.id}
                  onExamUpdated={(updatedExam) => setExam(updatedExam)}
                />

                {part.questions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {part.questions.map((question, questionIndex) => (
                      <div
                        key={question.id}
                        className="rounded border bg-slate-50 p-3"
                      >
                        <div className="font-medium">
                          {questionIndex + 1}. {question.prompt}
                        </div>

                        <div className="mt-2 space-y-1 text-sm">
                          {question.options.map((option) => (
                            <div key={option.id}>
                              {option.text}
                              {option.id === question.correctOptionId ? " ✅" : ""}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LESEN FORM */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-4 font-semibold">Lesen Part Ekle</h2>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Lesen başlığı"
          value={lesenTitle}
          onChange={(e) => setLesenTitle(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          placeholder="Metin"
          value={lesenText}
          onChange={(e) => setLesenText(e.target.value)}
        />

        <button
          onClick={handleAddLesenPart}
          className="rounded bg-purple-600 px-4 py-2 text-white"
        >
          Lesen ekle
        </button>
      </div>
      <div className="mb-3">
  <label className="block text-sm font-medium mb-1">
    Teil Formatı
  </label>

  <select
    value={lesenFormat}
    onChange={(e) => setLesenFormat(e.target.value as any)}
    className="w-full border rounded p-2"
  >
    <option value="teil_1">Teil 1 (Metin + richtig/falsch)</option>
    <option value="teil_2">Teil 2 (İlan seçimi a/b)</option>
    <option value="teil_3">Teil 3 (Tabela + richtig/falsch)</option>
  </select>
</div>

      {/* LESEN LİSTE + SORU EKLE */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-3 font-semibold">Lesen İçeriği</h2>

        {exam.content.lesen.length === 0 ? (
          <p>Henüz Lesen yok</p>
        ) : (
          <div className="space-y-4">
            {exam.content.lesen.map((part) => (
              <div key={part.id} className="rounded border p-4">
                <div className="font-medium">
                  {part.sortOrder}. {part.title}
                </div>

                <div className="mt-2 whitespace-pre-line text-sm">
                  {part.text}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Soru: {part.questions.length}
                </div>

                {part.format === "teil_1" ? (
  <LesenTeil1Builder
    exam={exam}
    partId={part.id}
    onExamUpdated={(updatedExam) => setExam(updatedExam)}
  />
) : part.format === "teil_2" ? (
  <LesenTeil2Builder
    exam={exam}
    partId={part.id}
    onExamUpdated={(updatedExam) => setExam(updatedExam)}
  />
) : (
  <LesenTeil3Builder
    exam={exam}
    partId={part.id}
    onExamUpdated={(updatedExam) => setExam(updatedExam)}
  />
)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCHREIBEN FORM */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-4 font-semibold">Schreiben Görevi Ekle</h2>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Örn: Schreiben Teil 1"
          value={schreibenTitle}
          onChange={(e) => setSchreibenTitle(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          placeholder="Görev açıklaması"
          rows={4}
          value={schreibenInstructions}
          onChange={(e) => setSchreibenInstructions(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Minimum kelime (opsiyonel)"
          value={minWords}
          onChange={(e) => setMinWords(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Maksimum kelime (opsiyonel)"
          value={maxWords}
          onChange={(e) => setMaxWords(e.target.value)}
        />

        <button
          onClick={handleAddSchreibenTask}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Schreiben ekle
        </button>
      </div>

      {/* SCHREIBEN LİSTE */}
      <div className="rounded border p-4">
        <h2 className="mb-3 font-semibold">Schreiben İçeriği</h2>

        {exam.content.schreiben.length === 0 ? (
          <p>Henüz Schreiben yok</p>
        ) : (
          exam.content.schreiben.map((task) => (
            <div key={task.id} className="mb-2 rounded border p-3">
              <div className="font-medium">
                {task.sortOrder}. {task.title}
              </div>

              <div className="mt-1 whitespace-pre-line text-sm">
                {task.instructions}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Min: {task.minWords ?? "-"} • Max: {task.maxWords ?? "-"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AddHoerenQuestionForm({
  exam,
  partId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  const handleAddQuestion = () => {
    if (!prompt.trim()) {
      alert("Soru metni gir");
      return;
    }

    if (
      !option1.trim() ||
      !option2.trim() ||
      !option3.trim() ||
      !option4.trim()
    ) {
      alert("Tüm seçenekleri doldur");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        hoeren: exam.content.hoeren.map((part) => {
          if (part.id !== partId) return part;

          return {
            ...part,
            questions: [
              ...part.questions,
              {
                id: generateId(),
                type: "multiple_choice",
                prompt: prompt.trim(),
                options: [
                  { id: "opt-0", text: option1.trim() },
                  { id: "opt-1", text: option2.trim() },
                  { id: "opt-2", text: option3.trim() },
                  { id: "opt-3", text: option4.trim() },
                ],
                correctOptionId: `opt-${correctIndex}`,
                points: 1,
              },
            ],
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setPrompt("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectIndex("0");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-2 font-medium">Bu Hören partına soru ekle</div>

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="Soru metni"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="1. seçenek"
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="2. seçenek"
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="3. seçenek"
        value={option3}
        onChange={(e) => setOption3(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="4. seçenek"
        value={option4}
        onChange={(e) => setOption4(e.target.value)}
      />

      <select
        className="mb-2 w-full rounded border p-2"
        value={correctIndex}
        onChange={(e) => setCorrectIndex(e.target.value)}
      >
        <option value="0">1. seçenek doğru</option>
        <option value="1">2. seçenek doğru</option>
        <option value="2">3. seçenek doğru</option>
        <option value="3">4. seçenek doğru</option>
      </select>

      <button
        onClick={handleAddQuestion}
        className="rounded bg-slate-800 px-4 py-2 text-white"
      >
        Soruyu ekle
      </button>
    </div>
  );
}

function AddLesenQuestionForm({
  exam,
  partId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  const handleAddQuestion = () => {
    if (!prompt.trim()) {
      alert("Soru metni gir");
      return;
    }

    if (
      !option1.trim() ||
      !option2.trim() ||
      !option3.trim() ||
      !option4.trim()
    ) {
      alert("Tüm seçenekleri doldur");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((part) => {
          if (part.id !== partId) return part;

          return {
            ...part,
            questions: [
              ...part.questions,
              {
                id: generateId(),
                type: "multiple_choice",
                prompt: prompt.trim(),
                options: [
                  { id: "opt-0", text: option1.trim() },
                  { id: "opt-1", text: option2.trim() },
                  { id: "opt-2", text: option3.trim() },
                  { id: "opt-3", text: option4.trim() },
                ],
                correctOptionId: `opt-${correctIndex}`,
                points: 1,
              },
            ],
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setPrompt("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectIndex("0");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-2 font-medium">Bu Lesen partına soru ekle</div>

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="Soru metni"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="1. seçenek"
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="2. seçenek"
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="3. seçenek"
        value={option3}
        onChange={(e) => setOption3(e.target.value)}
      />

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="4. seçenek"
        value={option4}
        onChange={(e) => setOption4(e.target.value)}
      />

      <select
        className="mb-2 w-full rounded border p-2"
        value={correctIndex}
        onChange={(e) => setCorrectIndex(e.target.value)}
      >
        <option value="0">1. seçenek doğru</option>
        <option value="1">2. seçenek doğru</option>
        <option value="2">3. seçenek doğru</option>
        <option value="3">4. seçenek doğru</option>
      </select>

      <button
        onClick={handleAddQuestion}
        className="rounded bg-slate-800 px-4 py-2 text-white"
      >
        Soruyu ekle
      </button>
    </div>
  );
}
function LesenTeil1Builder({
  exam,
  partId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const part = exam.content.lesen.find((item) => item.id === partId);

  const [examplePrompt, setExamplePrompt] = useState("");
  const [exampleCorrectIndex, setExampleCorrectIndex] = useState("0");
  const [exampleExplanation, setExampleExplanation] = useState("");

  const [blockTitle, setBlockTitle] = useState("");
  const [blockText, setBlockText] = useState("");

  if (!part) {
    return null;
  }

  const totalTeil1Questions =
    part.teil1Blocks?.reduce((sum, block) => sum + block.questions.length, 0) ?? 0;

  const handleSaveExample = () => {
    if (!examplePrompt.trim()) {
      alert("Örnek soru metni gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            exampleQuestion: {
              id: item.exampleQuestion?.id ?? generateId(),
              prompt: examplePrompt.trim(),
              options: [
                { id: "opt-0", text: "richtig" },
                { id: "opt-1", text: "falsch" },
              ],
              correctOptionId: `opt-${exampleCorrectIndex}`,
              explanation: exampleExplanation.trim(),
            },
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setExamplePrompt("");
    setExampleCorrectIndex("0");
    setExampleExplanation("");
  };

  const handleAddBlock = () => {
    if (!blockText.trim()) {
      alert("Metin gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            teil1Blocks: [
              ...(item.teil1Blocks ?? []),
              {
                id: generateId(),
                title: blockTitle.trim(),
                text: blockText.trim(),
                questions: [],
                sortOrder: (item.teil1Blocks?.length ?? 0) + 1,
              },
            ],
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setBlockTitle("");
    setBlockText("");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-3 font-semibold">Teil 1 Builder</div>

      <div className="mb-4 rounded border bg-slate-50 p-3 text-xs text-slate-600">
        Bu Teil toplam 5 soru olmalı. Şu an kayıtlı soru sayısı:{" "}
        <strong>{totalTeil1Questions}</strong>
      </div>

      {/* ÖRNEK SORU */}
      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Örnek soru ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Örn: Lis Zug kommt nach halb eins an."
          value={examplePrompt}
          onChange={(e) => setExamplePrompt(e.target.value)}
        />

        <select
          className="mb-2 w-full rounded border p-2"
          value={exampleCorrectIndex}
          onChange={(e) => setExampleCorrectIndex(e.target.value)}
        >
          <option value="0">Doğru cevap: richtig</option>
          <option value="1">Doğru cevap: falsch</option>
        </select>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Açıklama (opsiyonel)"
          value={exampleExplanation}
          onChange={(e) => setExampleExplanation(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSaveExample}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Örnek soruyu kaydet
        </button>

        {part.exampleQuestion && (
          <div className="mt-3 rounded border bg-white p-3 text-sm">
            <div className="font-medium">Kayıtlı örnek soru</div>
            <div className="mt-1">{part.exampleQuestion.prompt}</div>
            <div className="mt-1 text-xs text-slate-500">
              Doğru cevap:{" "}
              {
                part.exampleQuestion.options.find(
                  (opt) => opt.id === part.exampleQuestion?.correctOptionId
                )?.text
              }
            </div>
            {part.exampleQuestion.explanation ? (
              <div className="mt-1 text-xs text-slate-500">
                Açıklama: {part.exampleQuestion.explanation}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* METİN BLOĞU EKLE */}
      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Metin bloğu ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Blok başlığı (opsiyonel)"
          value={blockTitle}
          onChange={(e) => setBlockTitle(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          rows={6}
          placeholder="Metin içeriği"
          value={blockText}
          onChange={(e) => setBlockText(e.target.value)}
        />

        <button
          type="button"
          onClick={handleAddBlock}
          className="rounded bg-purple-600 px-4 py-2 text-white"
        >
          Metin bloğu ekle
        </button>
      </div>

      {/* BLOKLAR */}
      <div className="space-y-4">
        {(part.teil1Blocks ?? []).length === 0 ? (
          <div className="rounded border bg-slate-50 p-3 text-sm text-slate-500">
            Henüz metin bloğu yok.
          </div>
        ) : (
          (part.teil1Blocks ?? []).map((block) => (
            <div key={block.id} className="rounded border p-3">
              <div className="font-medium">
                Blok {block.sortOrder}
                {block.title ? ` - ${block.title}` : ""}
              </div>

              <div className="mt-2 whitespace-pre-line rounded bg-slate-50 p-3 text-sm">
                {block.text}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Bu bloktaki soru sayısı: {block.questions.length}
              </div>

              <LesenTeil1BlockQuestionForm
                exam={exam}
                partId={partId}
                blockId={block.id}
                onExamUpdated={onExamUpdated}
              />

              {block.questions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {block.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded border bg-slate-50 p-3 text-sm"
                    >
                      <div className="font-medium">
                        {index + 1}. {question.prompt}
                      </div>

                      <div className="mt-1 space-y-1">
                        {question.options.map((option) => (
                          <div key={option.id}>
                            {option.text}
                            {option.id === question.correctOptionId ? " ✅" : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LesenTeil1BlockQuestionForm({
  exam,
  partId,
  blockId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  blockId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  const handleAddQuestion = () => {
    if (!prompt.trim()) {
      alert("Soru metni gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((part) => {
          if (part.id !== partId) return part;

          return {
            ...part,
            teil1Blocks: (part.teil1Blocks ?? []).map((block) => {
              if (block.id !== blockId) return block;

              return {
                ...block,
                questions: [
                  ...block.questions,
                  {
                    id: generateId(),
                    prompt: prompt.trim(),
                    options: [
                      { id: "opt-0", text: "richtig" },
                      { id: "opt-1", text: "falsch" },
                    ],
                    correctOptionId: `opt-${correctIndex}`,
                    points: 1,
                  },
                ],
              };
            }),
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setPrompt("");
    setCorrectIndex("0");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-2 font-medium">Bu bloğa soru ekle</div>

      <input
        className="mb-2 w-full rounded border p-2"
        placeholder="Örn: Karin wartet den ganzen Vormittag vor der Auskunft."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <select
        className="mb-2 w-full rounded border p-2"
        value={correctIndex}
        onChange={(e) => setCorrectIndex(e.target.value)}
      >
        <option value="0">Doğru cevap: richtig</option>
        <option value="1">Doğru cevap: falsch</option>
      </select>

      <button
        type="button"
        onClick={handleAddQuestion}
        className="rounded bg-slate-800 px-4 py-2 text-white"
      >
        Soruyu ekle
      </button>
    </div>
  );
}
function LesenTeil2Builder({
  exam,
  partId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const part = exam.content.lesen.find((item) => item.id === partId);

  const [examplePrompt, setExamplePrompt] = useState("");
  const [exampleCorrectIndex, setExampleCorrectIndex] = useState("0");
  const [exampleExplanation, setExampleExplanation] = useState("");

  const [prompt, setPrompt] = useState("");
  const [optionALabel, setOptionALabel] = useState("A");
  const [optionAText, setOptionAText] = useState("");
  const [optionBLabel, setOptionBLabel] = useState("B");
  const [optionBText, setOptionBText] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  if (!part) {
    return null;
  }

  const handleSaveExample = () => {
    if (!examplePrompt.trim()) {
      alert("Örnek soru metni gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            exampleQuestion: {
              id: item.exampleQuestion?.id ?? generateId(),
              prompt: examplePrompt.trim(),
              options: [
                { id: "opt-0", text: "a" },
                { id: "opt-1", text: "b" },
              ],
              correctOptionId: `opt-${exampleCorrectIndex}`,
              explanation: exampleExplanation.trim(),
            },
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setExamplePrompt("");
    setExampleCorrectIndex("0");
    setExampleExplanation("");
  };

  const handleAddItem = () => {
    if (!prompt.trim()) {
      alert("Soru metni gir");
      return;
    }

    if (!optionAText.trim() || !optionBText.trim()) {
      alert("A ve B ilan metnini doldur");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            teil2Items: [
              ...(item.teil2Items ?? []),
              {
                id: generateId(),
                prompt: prompt.trim(),
                optionALabel: optionALabel.trim() || "A",
                optionAText: optionAText.trim(),
                optionBLabel: optionBLabel.trim() || "B",
                optionBText: optionBText.trim(),
                correctOptionId: `opt-${correctIndex}`,
                points: 1,
                sortOrder: (item.teil2Items?.length ?? 0) + 1,
              },
            ],
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setPrompt("");
    setOptionALabel("A");
    setOptionAText("");
    setOptionBLabel("B");
    setOptionBText("");
    setCorrectIndex("0");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-3 font-semibold">Teil 2 Builder</div>

      <div className="mb-4 rounded border bg-slate-50 p-3 text-xs text-slate-600">
        Bu Teil toplam 5 soru olmalı. Şu an kayıtlı soru sayısı:{" "}
        <strong>{part.teil2Items?.length ?? 0}</strong>
      </div>

      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Örnek soru ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Örnek soru metni"
          value={examplePrompt}
          onChange={(e) => setExamplePrompt(e.target.value)}
        />

        <select
          className="mb-2 w-full rounded border p-2"
          value={exampleCorrectIndex}
          onChange={(e) => setExampleCorrectIndex(e.target.value)}
        >
          <option value="0">Doğru cevap: a</option>
          <option value="1">Doğru cevap: b</option>
        </select>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Açıklama (opsiyonel)"
          value={exampleExplanation}
          onChange={(e) => setExampleExplanation(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSaveExample}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Örnek soruyu kaydet
        </button>

        {part.exampleQuestion && (
          <div className="mt-3 rounded border bg-white p-3 text-sm">
            <div className="font-medium">Kayıtlı örnek soru</div>
            <div className="mt-1">{part.exampleQuestion.prompt}</div>
            <div className="mt-1 text-xs text-slate-500">
              Doğru cevap:{" "}
              {
                part.exampleQuestion.options.find(
                  (opt) => opt.id === part.exampleQuestion?.correctOptionId
                )?.text
              }
            </div>
            {part.exampleQuestion.explanation ? (
              <div className="mt-1 text-xs text-slate-500">
                Açıklama: {part.exampleQuestion.explanation}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Teil 2 sorusu ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Soru metni"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="A etiketi (örn: A)"
          value={optionALabel}
          onChange={(e) => setOptionALabel(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          rows={4}
          placeholder="A ilan metni"
          value={optionAText}
          onChange={(e) => setOptionAText(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="B etiketi (örn: B)"
          value={optionBLabel}
          onChange={(e) => setOptionBLabel(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          rows={4}
          placeholder="B ilan metni"
          value={optionBText}
          onChange={(e) => setOptionBText(e.target.value)}
        />

        <select
          className="mb-2 w-full rounded border p-2"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
        >
          <option value="0">Doğru cevap: a</option>
          <option value="1">Doğru cevap: b</option>
        </select>

        <button
          type="button"
          onClick={handleAddItem}
          className="rounded bg-slate-800 px-4 py-2 text-white"
        >
          Soruyu ekle
        </button>
      </div>

      <div className="space-y-4">
        {(part.teil2Items ?? []).length === 0 ? (
          <div className="rounded border bg-slate-50 p-3 text-sm text-slate-500">
            Henüz Teil 2 sorusu yok.
          </div>
        ) : (
          (part.teil2Items ?? []).map((item) => (
            <div key={item.id} className="rounded border p-3">
              <div className="font-medium">
                {item.sortOrder}. {item.prompt}
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded border bg-slate-50 p-3">
                  <div className="mb-2 font-semibold">{item.optionALabel}</div>
                  <div className="whitespace-pre-line text-sm">{item.optionAText}</div>
                </div>

                <div className="rounded border bg-slate-50 p-3">
                  <div className="mb-2 font-semibold">{item.optionBLabel}</div>
                  <div className="whitespace-pre-line text-sm">{item.optionBText}</div>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Doğru cevap: {item.correctOptionId === "opt-0" ? "a" : "b"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function LesenTeil3Builder({
  exam,
  partId,
  onExamUpdated,
}: {
  exam: ExamDefinition;
  partId: string;
  onExamUpdated: (updatedExam: ExamDefinition) => void;
}) {
  const part = exam.content.lesen.find((item) => item.id === partId);

  const [examplePrompt, setExamplePrompt] = useState("");
  const [exampleCorrectIndex, setExampleCorrectIndex] = useState("0");
  const [exampleExplanation, setExampleExplanation] = useState("");

  const [promptTitle, setPromptTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [statement, setStatement] = useState("");
  const [correctIndex, setCorrectIndex] = useState("0");

  if (!part) {
    return null;
  }

  const handleSaveExample = () => {
    if (!examplePrompt.trim()) {
      alert("Örnek soru metni gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            exampleQuestion: {
              id: item.exampleQuestion?.id ?? generateId(),
              prompt: examplePrompt.trim(),
              options: [
                { id: "opt-0", text: "richtig" },
                { id: "opt-1", text: "falsch" },
              ],
              correctOptionId: `opt-${exampleCorrectIndex}`,
              explanation: exampleExplanation.trim(),
            },
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setExamplePrompt("");
    setExampleCorrectIndex("0");
    setExampleExplanation("");
  };

  const handleAddItem = () => {
    if (!noticeText.trim()) {
      alert("Tabela / notice metni gir");
      return;
    }

    if (!statement.trim()) {
      alert("İfade cümlesi gir");
      return;
    }

    const updatedExam: ExamDefinition = {
      ...exam,
      content: {
        ...exam.content,
        lesen: exam.content.lesen.map((item) => {
          if (item.id !== partId) return item;

          return {
            ...item,
            teil3Items: [
              ...(item.teil3Items ?? []),
              {
                id: generateId(),
                promptTitle: promptTitle.trim(),
                noticeText: noticeText.trim(),
                statement: statement.trim(),
                options: [
                  { id: "opt-0", text: "richtig" },
                  { id: "opt-1", text: "falsch" },
                ],
                correctOptionId: `opt-${correctIndex}`,
                points: 1,
                sortOrder: (item.teil3Items?.length ?? 0) + 1,
              },
            ],
          };
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    updateExam(updatedExam);
    onExamUpdated(updatedExam);

    setPromptTitle("");
    setNoticeText("");
    setStatement("");
    setCorrectIndex("0");
  };

  return (
    <div className="mt-4 rounded border-t pt-4">
      <div className="mb-3 font-semibold">Teil 3 Builder</div>

      <div className="mb-4 rounded border bg-slate-50 p-3 text-xs text-slate-600">
        Bu Teil toplam 5 soru olmalı. Şu an kayıtlı soru sayısı:{" "}
        <strong>{part.teil3Items?.length ?? 0}</strong>
      </div>

      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Örnek soru ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Örnek soru metni"
          value={examplePrompt}
          onChange={(e) => setExamplePrompt(e.target.value)}
        />

        <select
          className="mb-2 w-full rounded border p-2"
          value={exampleCorrectIndex}
          onChange={(e) => setExampleCorrectIndex(e.target.value)}
        >
          <option value="0">Doğru cevap: richtig</option>
          <option value="1">Doğru cevap: falsch</option>
        </select>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Açıklama (opsiyonel)"
          value={exampleExplanation}
          onChange={(e) => setExampleExplanation(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSaveExample}
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Örnek soruyu kaydet
        </button>

        {part.exampleQuestion && (
          <div className="mt-3 rounded border bg-white p-3 text-sm">
            <div className="font-medium">Kayıtlı örnek soru</div>
            <div className="mt-1">{part.exampleQuestion.prompt}</div>
            <div className="mt-1 text-xs text-slate-500">
              Doğru cevap:{" "}
              {
                part.exampleQuestion.options.find(
                  (opt) => opt.id === part.exampleQuestion?.correctOptionId
                )?.text
              }
            </div>
            {part.exampleQuestion.explanation ? (
              <div className="mt-1 text-xs text-slate-500">
                Açıklama: {part.exampleQuestion.explanation}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="mb-4 rounded border p-3">
        <div className="mb-2 font-medium">Teil 3 sorusu ekle</div>

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="Başlık (opsiyonel)"
          value={promptTitle}
          onChange={(e) => setPromptTitle(e.target.value)}
        />

        <textarea
          className="mb-2 w-full rounded border p-2"
          rows={4}
          placeholder="Tabela / notice metni"
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
        />

        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="İfade cümlesi"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
        />

        <select
          className="mb-2 w-full rounded border p-2"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
        >
          <option value="0">Doğru cevap: richtig</option>
          <option value="1">Doğru cevap: falsch</option>
        </select>

        <button
          type="button"
          onClick={handleAddItem}
          className="rounded bg-slate-800 px-4 py-2 text-white"
        >
          Soruyu ekle
        </button>
      </div>

      <div className="space-y-4">
        {(part.teil3Items ?? []).length === 0 ? (
          <div className="rounded border bg-slate-50 p-3 text-sm text-slate-500">
            Henüz Teil 3 sorusu yok.
          </div>
        ) : (
          (part.teil3Items ?? []).map((item) => (
            <div key={item.id} className="rounded border p-3">
              {item.promptTitle ? (
                <div className="font-medium">{item.promptTitle}</div>
              ) : null}

              <div className="mt-3 rounded border bg-slate-50 p-3 whitespace-pre-line text-sm">
                {item.noticeText}
              </div>

              <div className="mt-3 text-sm">
                <strong>İfade:</strong> {item.statement}
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Doğru cevap:{" "}
                {
                  item.options.find((opt) => opt.id === item.correctOptionId)?.text
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}