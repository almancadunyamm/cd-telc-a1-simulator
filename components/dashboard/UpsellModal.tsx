type UpsellModalProps = {
  open: boolean;
  title: string;
  description: string;
  targetProductSlug: string;
  onClose: () => void;
  onConfirm?: () => void;
};

export default function UpsellModal({
  open,
  title,
  description,
  targetProductSlug,
  onClose,
  onConfirm,
}: UpsellModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Paket Önerisi</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Kapat
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-700">{description}</p>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Hedef Ürün</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {targetProductSlug}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Paketi İncele
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}