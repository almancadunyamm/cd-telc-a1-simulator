"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getExams, saveExam } from "@/src/lib/content-storage";
import type { ExamDefinition, LevelCode } from "@/src/types/content";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getExamPublicPath(examId: string) {
  return `/exam/${examId}`;
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExamDefinition[]>([]);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<LevelCode>("a1");
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);

  useEffect(() => {
    setExams(getExams());
  }, []);

  const handleCreate = () => {
    if (!title.trim()) {
      alert("Sınav başlığı gir.");
      return;
    }

    const now = new Date().toISOString();

    const newExam: ExamDefinition = {
      id: generateId(),
      slug: createSlug(title),
      title: title.trim(),
      description: "",
      level,
      examNumber: exams.length + 1,
      status: "draft",
      content: {
        hoeren: [],
        lesen: [],
        schreiben: [],
      },
      createdAt: now,
      updatedAt: now,
    };

    saveExam(newExam);
    setExams(getExams());
    setTitle("");
    setLevel("a1");
  };

  const handleCopyLink = async (examId: string) => {
    const path = getExamPublicPath(examId);
    const fullUrl = `${window.location.origin}${path}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedExamId(examId);

      setTimeout(() => {
        setCopiedExamId((current) => (current === examId ? null : current));
      }, 2000);
    } catch {
      alert("Link kopyalanamadı.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin - Sınav Yönetimi</h1>

      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Yeni Sınav Oluştur</h2>

        <input
          className="mb-3 w-full rounded border p-2"
          placeholder="Örn: A1 Deneme 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="mb-3 w-full rounded border p-2"
          value={level}
          onChange={(e) => setLevel(e.target.value as LevelCode)}
        >
          <option value="a1">A1</option>
          <option value="a2">A2</option>
          <option value="b1">B1</option>
        </select>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Oluştur
        </button>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Sınavlar</h2>

        {exams.length === 0 ? (
          <p>Henüz sınav yok.</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => {
              const publicPath = getExamPublicPath(exam.id);

              return (
                <div key={exam.id} className="rounded border p-3">
                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="block rounded hover:bg-gray-50"
                  >
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-gray-500">
                      {exam.level.toUpperCase()} • {exam.status}
                    </div>
                  </Link>

                  <div className="mt-3 rounded bg-slate-50 p-3 text-xs text-slate-600">
                    Public link: {publicPath}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/exams/${exam.id}`}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      Düzenle
                    </Link>

                    <Link
                      href={publicPath}
                      className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                    >
                      Sınavı Aç
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(exam.id)}
                      className="rounded bg-slate-800 px-3 py-2 text-sm text-white"
                    >
                      {copiedExamId === exam.id ? "Kopyalandı" : "Linki Kopyala"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}