import { cookies } from "next/headers";
import AdminExamSimulatorWrapper from "../../../components/exam/AdminExamSimulatorWrapper";
import { requireAccessOrRedirect } from "../../../lib/access/route-guard";
import {
  getDefaultMockUserId,
  getMockUserStorageKey,
} from "../../../lib/access/mock-session";
import type { LevelCode } from "../../../types/product";

type PageProps = {
  params: Promise<{
    level: string;
  }>;
};

function normalizeLevel(value: string): LevelCode | null {
  const upper = value.toUpperCase();

  if (upper === "A1" || upper === "A2" || upper === "B1") {
    return upper;
  }

  return null;
}

export default async function LevelExamPage({ params }: PageProps) {
  const resolvedParams = await params;
  const normalizedLevel = normalizeLevel(resolvedParams.level);

  if (!normalizedLevel) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Geçersiz seviye</h1>
        <p className="mt-4 text-gray-600">
          URL içindeki seviye değeri geçerli değil.
        </p>
      </main>
    );
  }

  const cookieStore = await cookies();
  const userId =
    cookieStore.get(getMockUserStorageKey())?.value ??
    getDefaultMockUserId();

  await requireAccessOrRedirect({
    userId,
    level: normalizedLevel,
    feature: "exam_access",
  });

  if (normalizedLevel === "A1") {
  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="mx-auto max-w-6xl">
        <AdminExamSimulatorWrapper
  examId="a1-set-1"
  forcedExamId="a1-set-1"
/>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          Erişim doğrulandı
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          {normalizedLevel} sınav alanı hazır
        </h1>

        <p className="mt-4 text-slate-600">
          Bu kullanıcı bu seviyeye erişebiliyor. Gerçek {normalizedLevel} sınav
          içeriğini sonraki adımda bağlayacağız.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Aktif test kullanıcısı</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{userId}</p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Açılan seviye</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {normalizedLevel}
          </p>
        </div>
      </div>
    </main>
  );
}