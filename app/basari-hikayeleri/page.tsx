const approachPoints = [
  {
    title: "Seviyene uygun hazırlık",
    desc: "A1'den B1'e kadar her seviyede, sınavın gerçek formatına uygun içeriklerle çalışırsın.",
  },
  {
    title: "Düzenli konuşma pratiği",
    desc: "Konuşma kulübü ve canlı derslerle sınavın en çok zorlandığın bölümü olan konuşmaya düzenli pratik yaparsın.",
  },
  {
    title: "Ölçülebilir ilerleme",
    desc: "Deneme sınavları ve ilerleme takibiyle nerede olduğunu ve neye odaklanman gerektiğini her zaman görürsün.",
  },
  {
    title: "İstediğin an destek",
    desc: "Takıldığın noktalarda eğitmen desteği ve WhatsApp üzerinden hızlı iletişim imkânı bulursun.",
  },
];

export default function BasariHikayeleriPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Başarı Yaklaşımımız
          </h1>

          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Öğrencilerimizin TELC, Goethe ve ÖSD sınavlarında başarılı olmasını
            sağlayan çalışma yaklaşımımız.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {approachPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h2 className="text-lg font-bold text-white">{point.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm leading-6 text-slate-400">
          Sınav sonuçlarına ve öğrenci deneyimlerine dair paylaşımlarımızı
          önümüzdeki dönemde bu sayfada güncelleyeceğiz.
        </p>
      </article>
    </main>
  );
}