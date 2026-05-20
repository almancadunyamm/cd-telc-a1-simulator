import AdminExamSimulatorWrapper from "../../../components/exam/AdminExamSimulatorWrapper";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamByIdPage({ params }: PageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="mx-auto max-w-6xl">
        <AdminExamSimulatorWrapper examId={examId} forcedExamId={examId} />
      </div>
    </main>
  );
}