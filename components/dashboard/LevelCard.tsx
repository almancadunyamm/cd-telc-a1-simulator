type UpsellOffer = {
  title: string;
  description: string;
  ctaLabel: string;
};

type LevelCardProps = {
  title: string;
  locked: boolean;
  currentPackageTitle?: string;
  completionPercent: number;
  examsCompleted: number;
  averageScorePercent: number;
  weakAreas: string[];
  primaryActionLabel: string;
  upsellOffer?: UpsellOffer;
  onPrimaryAction?: () => void;
  onUpsellAction?: () => void;
};

export default function LevelCard({
  title,
  locked,
  currentPackageTitle,
  completionPercent,
  examsCompleted,
  averageScorePercent,
  weakAreas,
  primaryActionLabel,
  upsellOffer,
  onPrimaryAction,
  onUpsellAction,
}: LevelCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition ${
        locked
          ? "border-gray-200 bg-gray-50"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {locked ? "Bu seviye üst pakette seni bekliyor." : "Bu seviye erişime açık."}
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            locked
              ? "bg-amber-100 text-amber-800"
              : "bg-green-100 text-green-700"
          }`}
        >
          {locked ? "Üst Paket" : "Aktif"}
        </div>
      </div>

      <div className={locked ? "opacity-75" : ""}>
        <div className="mb-4 rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Mevcut Paket</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {currentPackageTitle ?? "Henüz aktif paket yok"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">İlerleme</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              %{completionPercent}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Tamamlanan Sınav</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {examsCompleted}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Ortalama Başarı</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              %{averageScorePercent}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700">Zayıf Alanlar</p>

          {weakAreas.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {weakAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                >
                  {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Şu an belirgin bir zayıf alan görünmüyor.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onPrimaryAction}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
            locked
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {primaryActionLabel}
        </button>
      </div>

      {upsellOffer ? (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">
            {upsellOffer.title}
          </p>
          <p className="mt-1 text-sm text-blue-800">
            {upsellOffer.description}
          </p>

          <button
            type="button"
            onClick={onUpsellAction}
            className="mt-3 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {upsellOffer.ctaLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}