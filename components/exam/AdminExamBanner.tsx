"use client";

import { useEffect, useMemo, useState } from "react";
import { getExams } from "@/src/lib/content-storage";
import type { ExamDefinition } from "@/src/types/content";
import type { LevelCode } from "@/types/product";

type Props = {
  level: LevelCode;
};

export default function AdminExamBanner({ level }: Props) {
  const [exam, setExam] = useState<ExamDefinition | null>(null);

  useEffect(() => {
    const exams = getExams();

    const found =
      exams.find((item) => item.level.toUpperCase() === level) ?? null;

    setExam(found);
  }, [level]);

  const totalHoerenQuestions = useMemo(() => {
    if (!exam) return 0;

    return exam.content.hoeren.reduce((sum, part) => {
      return sum + part.questions.length;
    }, 0);
  }, [exam]);

  if (!exam) {
    return null;
  }

  return (
    <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-100 p-4 text-sm text-yellow-900">
      <div>
        ✅ Admin panelden gelen sınav bulundu: <strong>{exam.title}</strong>
      </div>

      <div className="mt-2 text-xs text-yellow-800">
        Hören part: {exam.content.hoeren.length} • Hören soru: {totalHoerenQuestions} •
        Lesen part: {exam.content.lesen.length} • Schreiben görev: {exam.content.schreiben.length}
      </div>
    </div>
  );
}