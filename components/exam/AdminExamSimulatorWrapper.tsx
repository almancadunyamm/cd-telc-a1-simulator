"use client";

import { useEffect, useState } from "react";
import ExamSimulator from "./ExamSimulator";
import { getExamById } from "@/src/lib/content-storage";
import type { ExamDefinition } from "@/src/types/content";

type Props = {
  examId: string;
  forcedExamId?: string;
};

export default function AdminExamSimulatorWrapper({
  examId,
  forcedExamId,
}: Props) {
  const [adminExam, setAdminExam] = useState<ExamDefinition | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const found = getExamById(examId);
    setAdminExam(found);
    setIsLoaded(true);
  }, [examId]);

  if (!isLoaded) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Yükleniyor...
      </div>
    );
  }

  if (!adminExam && (forcedExamId === "a1-set-1" || examId === "a1-set-1")) {
  return (
    <ExamSimulator
      mode="direct"
      forcedExamId="a1-set-1"
      adminExam={null}
    />
  );
}

if (!adminExam) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-red-600">Sınav bulunamadı</h1>
      <p className="mt-3 text-gray-600">
        Bu ID ile eşleşen bir sınav bulunamadı.
      </p>
    </div>
  );
}

  return (
    <ExamSimulator
      mode="direct"
      forcedExamId={forcedExamId}
      adminExam={adminExam}
    />
  );
}