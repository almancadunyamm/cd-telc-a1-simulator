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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="text-sm font-bold text-slate-300 hover:text-white"
        >
          ← Admin merkeze dön
        </a>

        <header className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
            Ana Sayfa Yönetimi
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Sık Sorulan Sorular
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Buradan eklediğiniz soru-cevaplar ana sayfadaki SSS bölümünde
            otomatik görünür.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              {editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
            </h2>

            <div className="mt-6 grid gap-4">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Soru örn: TELC dijital sınav simülasyonu nedir?"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Cevap"
                rows={6}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="button"
                  onClick={handleSaveFaq}
                  className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
                >
                  {editingId ? "Soruyu Güncelle" : "Soruyu Ekle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Kayıtlı Sorular</h2>

            {faqs.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                Henüz soru eklenmedi. Ana sayfada varsayılan sorular görünür.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                  >
                    <h3 className="font-black text-white">{faq.question}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {faq.answer}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditFaq(faq)}
                        className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200 hover:bg-blue-500/20"
                      >
                        Düzelt
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20"
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