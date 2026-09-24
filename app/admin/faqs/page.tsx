"use client";

import { useEffect, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS_KEY = "homepage_faqs";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const rawFaqs = localStorage.getItem(FAQS_KEY);
    setFaqs(rawFaqs ? JSON.parse(rawFaqs) : []);
  }, []);

  function saveFaqs(updatedFaqs: FaqItem[]) {
    setFaqs(updatedFaqs);
    localStorage.setItem(FAQS_KEY, JSON.stringify(updatedFaqs));
  }

  function resetForm() {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  }

  function handleSaveFaq() {
    if (!question.trim() || !answer.trim()) {
      alert("Soru ve cevap alanlarını doldurun.");
      return;
    }

    if (editingId) {
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editingId
          ? {
              ...faq,
              question: question.trim(),
              answer: answer.trim(),
            }
          : faq
      );

      saveFaqs(updatedFaqs);
      resetForm();
      alert("Soru güncellendi.");
      return;
    }

    const newFaq: FaqItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      answer: answer.trim(),
    };

    saveFaqs([...faqs, newFaq]);
    resetForm();
    alert("Soru eklendi.");
  }

  function handleEditFaq(faq: FaqItem) {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteFaq(id: string) {
    const confirmed = confirm("Bu soruyu silmek istiyor musunuz?");
    if (!confirmed) return;

    const updatedFaqs = faqs.filter((faq) => faq.id !== id);
    saveFaqs(updatedFaqs);

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          ← Admin merkeze dön
        </a>

        <header className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">
            Ana Sayfa Yönetimi
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">
            Sık Sorulan Sorular
          </h1>

          <p className="mt-4 max-w-3xl text-slate-600">
            Buradan eklediğiniz soru-cevaplar ana sayfadaki SSS bölümünde
            otomatik görünür.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">
              {editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
            </h2>

            <div className="mt-6 grid gap-4">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Soru örn: TELC dijital sınav simülasyonu nedir?"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-yellow-400"
              />

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Cevap"
                rows={6}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-yellow-400"
              />

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="button"
                  onClick={handleSaveFaq}
                  className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-slate-900 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
                >
                  {editingId ? "Soruyu Güncelle" : "Soruyu Ekle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Kayıtlı Sorular</h2>

            {faqs.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Henüz soru eklenmedi. Ana sayfada varsayılan sorular görünür.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <h3 className="font-black text-slate-900">{faq.question}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {faq.answer}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditFaq(faq)}
                        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                      >
                        Düzelt
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}