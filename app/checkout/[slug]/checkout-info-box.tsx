export default function CheckoutInfoBox() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Satın alma süreci
      </h2>

      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">1. Shopier ödeme</p>
          <p className="mt-1">
            “Shopier ile Öde” butonuna tıkladığınızda güvenli ödeme sayfasına
            yönlendirilirsiniz.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">2. Ödeme sonrası kontrol</p>
          <p className="mt-1">
            Ödemeniz tamamlandıktan sonra siparişiniz kontrol edilir ve erişim
            süreci başlatılır.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">3. Erişim açılması</p>
          <p className="mt-1">
            Satın aldığınız seviyenin erişimi kısa süre içinde hesabınıza
            tanımlanır.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Not: Ödeme sonrası erişim otomatik değil, kısa bir kontrol sonrasında
        açılır.
      </div>
    </div>
  );
}