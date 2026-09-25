export default function DestekPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <article className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">Destek</h1>

          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Hesabın, ödemen veya derslerinle ilgili bir sorun mu var? Sana en
            hızlı şekilde yardımcı olalım.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://wa.me/905426954419"
            target="_blank"
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 transition hover:bg-emerald-500/20"
          >
            <p className="text-lg font-bold text-emerald-300">WhatsApp</p>
            <p className="mt-2 text-sm text-slate-300">
              0542 695 44 19 — hızlı yanıt için tercih edebilirsin.
            </p>
          </a>

          <a
            href="mailto:almancaokulum.info@gmail.com"
            className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 transition hover:bg-blue-500/20"
          >
            <p className="text-lg font-bold text-blue-300">E-posta</p>
            <p className="mt-2 text-sm text-slate-300">
              almancaokulum.info@gmail.com
            </p>
          </a>
        </div>

        <div className="mt-8 space-y-4 text-sm leading-6 text-slate-400">
          <p>
            <span className="font-bold text-white">Ödeme ile ilgili sorunlar:</span>{" "}
            Ödeme yaptığın halde erişimin açılmadıysa, işlem numaranla
            birlikte bize WhatsApp veya e-posta üzerinden ulaşabilirsin.
          </p>
          <p>
            <span className="font-bold text-white">Ders ve içerik soruları:</span>{" "}
            Panelindeki derslerle ilgili sorularını eğitmenlerimize iletmek
            için de aynı kanalları kullanabilirsin.
          </p>
          <p>
            <span className="font-bold text-white">İptal ve iade talepleri:</span>{" "}
            Koşullar için{" "}
            <a href="/mesafeli-satis" className="text-blue-400 hover:text-white">
              Mesafeli Satış Sözleşmesi
            </a>{" "}
            sayfamıza göz atabilir, talebini yine yukarıdaki kanallardan
            iletebilirsin.
          </p>
        </div>
      </article>
    </main>
  );
}