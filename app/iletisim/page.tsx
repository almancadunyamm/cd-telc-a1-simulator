import CorporateShell from "@/app/components/CorporateShell";

export default function IletisimPage() {
  return (
    <CorporateShell>
      <article className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white shadow-xl p-8 sm:p-10">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            İletişim
          </h1>
        </div>

        <div className="space-y-5 text-slate-600">
          <p className="text-lg font-bold text-slate-950">
            Almanca Okulum
            <br />
            <span className="text-sm font-normal text-slate-600">
              Online Almanca Eğitim Platformu
            </span>
          </p>

          <div className="space-y-2 text-sm leading-6">
            <p>
              <span className="font-semibold text-slate-950">Adres:</span>{" "}
              Alaaddin Topuz Caddesi No: 13, Sultangazi / İstanbul
            </p>
            <p>
              <span className="font-semibold text-slate-950">Telefon:</span>{" "}
              <a href="tel:+905426954419" className="hover:text-orange-600">
                0542 695 44 19
              </a>
            </p>
            <p>
              <span className="font-semibold text-slate-950">E-posta:</span>{" "}
              <a
                href="mailto:almancaokulum.info@gmail.com"
                className="hover:text-orange-600"
              >
                almancaokulum.info@gmail.com
              </a>
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Almanca Okulum eğitimlerini tamamen online olarak sunmaktadır.
            Yukarıdaki adres işletmenin resmî iletişim adresidir; bu adreste
            yüz yüze eğitim verilmemektedir.
          </p>
        </div>
      </article>
    </CorporateShell>
  );
}