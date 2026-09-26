import CorporateShell from "@/app/components/CorporateShell";

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
    <CorporateShell>
      <article className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white shadow-xl p-8 sm:p-10">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Başarı Yaklaşımımız
          </h1>

          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Öğrencilerimizin TELC, Goethe ve ÖSD sınavlarında başarılı olmasını
            sağlayan çalışma yaklaşımımız.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {approachPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h2 className="text-lg font-bold text-slate-950">{point.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </article>
    </CorporateShell>
  );
}