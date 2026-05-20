import Link from "next/link";

export default function PaymentPendingPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Ödeme bildiriminiz alındı
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Siparişiniz kontrol sürecine alındı. Ödemeniz doğrulandıktan sonra
          satın aldığınız paket hesabınıza tanımlanacaktır.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-700">
          <p className="font-medium text-slate-800">Sonraki adım</p>
          <p className="mt-2">
            Erişiminiz kısa süre içinde açılacaktır. Kontrol tamamlandıktan
            sonra dashboard üzerinden ilgili seviyeye erişebilirsiniz.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-900">
          <p className="font-medium">Önemli</p>
          <p className="mt-2">
            Eğer ödeme yaptıktan sonra erişiminiz açılmazsa, ödeme bilginizle
            birlikte destek ekibiyle iletişime geçin.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-[#173b8f] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Dashboard’a dön
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}