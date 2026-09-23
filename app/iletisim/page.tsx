export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            İletişim
          </h1>
        </div>

        <div className="space-y-5 text-slate-300">
          <p className="text-lg font-bold text-white">
            Almanca Okulum
            <br />
            <span className="text-sm font-normal text-slate-400">
              Online Almanca Eğitim Platformu
            </span>
          </p>

          <div className="space-y-2 text-sm leading-6">
            <p>
              <span className="font-semibold text-white">Adres:</span>{" "}
              Alaaddin Topuz Caddesi No: 13, Gaziosmanpaşa / İstanbul
            </p>
            <p>
              <span className="font-semibold text-white">Telefon:</span>{" "}
              <a href="tel:+905426954419" className="hover:text-white">
                0542 695 44 19
              </a>
            </p>
            <p>
              <span className="font-semibold text-white">E-posta:</span>{" "}
              <a
                href="mailto:almancaokulum.info@gmail.com"
                className="hover:text-white"
              >
                almancaokulum.info@gmail.com
              </a>
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-400">
            Almanca Okulum eğitimlerini tamamen online olarak sunmaktadır.
            Yukarıdaki adres işletmenin resmî iletişim adresidir; bu adreste
            yüz yüze eğitim verilmemektedir.
          </p>
        </div>
      </article>
    </main>
  );
}