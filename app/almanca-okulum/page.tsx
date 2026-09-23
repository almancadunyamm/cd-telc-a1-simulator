const features = [
  {
    title: "Dijital Paketler",
    desc: "Seviyene uygun video dersler, PDF materyaller ve alıştırmalarla kendi hızında ilerle.",
  },
  {
    title: "Canlı Akademi",
    desc: "Eğitmen eşliğinde düzenli canlı derslerle sınav formatına ve konuşma pratiğine hazırlan.",
  },
  {
    title: "Konuşma Kulübü",
    desc: "Seviyene uygun konuşma partnerleriyle düzenli pratik yaparak konuşma özgüvenini geliştir.",
  },
  {
    title: "TELC Deneme Sistemi",
    desc: "Gerçek sınav formatına uygun dijital deneme sınavlarıyla seviyeni ölç, eksiklerini gör.",
  },
  {
    title: "Kelime Arenası",
    desc: "Oyunlaştırılmış kelime pratikleriyle kelime dağarcığını eğlenerek genişlet.",
  },
  {
    title: "İlerleme Takibi",
    desc: "Ders, ödev ve sınav performansını tek panelden takip et, gelişimini rozetlerle gör.",
  },
];

export default function AlmancaOkulumPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Platform
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Almanca Okulum Nedir?
          </h1>

          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            TELC, Goethe ve ÖSD sınavlarına hazırlık için geliştirdiğimiz,
            canlı ders ve dijital içeriği bir arada sunan öğrenme platformu.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h2 className="text-lg font-bold text-white">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-sm text-slate-200 sm:text-base">
          Platformu incelemek ve seviyene uygun paketi görmek için{" "}
          <a href="/register" className="font-bold text-blue-300 hover:text-white">
            hemen kayıt ol
          </a>{" "}
          veya{" "}
          <a
            href="/almanca-seviye-tespit-sinavi"
            className="font-bold text-blue-300 hover:text-white"
          >
            ücretsiz seviye tespit sınavına
          </a>{" "}
          göz at.
        </div>
      </article>
    </main>
  );
}