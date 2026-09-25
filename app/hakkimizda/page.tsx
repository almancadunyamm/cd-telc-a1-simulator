import CorporateShell from "@/app/components/CorporateShell";

const stats = [
  { value: "7500+", label: "Öğrenci" },
  { value: "15+ Yıl", label: "Online Eğitim Deneyimi" },
  { value: "%92", label: "TELC / Goethe / ÖSD Başarısı" },
  { value: "3.500+ Saat", label: "Canlı Ders" },
];

export default function HakkimizdaPage() {
  return (
    <CorporateShell>
      <article className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white shadow-xl p-8 sm:p-10">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Hakkımızda
          </h1>
        </div>

        <div className="space-y-5 text-sm leading-7 text-slate-600 sm:text-base">
          <p>
            Almanca Okulum, TELC, Goethe ve ÖSD sınavlarına hazırlanan
            öğrencilere yönelik, tamamen dijital bir Almanca öğrenme
            platformudur. Amacımız; canlı ders, dijital deneme sınavları,
            yazma-konuşma pratiği ve düzenli performans takibini tek bir
            sistemde birleştirerek Almanca öğrenme sürecini daha planlı,
            ölçülebilir ve güven veren bir hale getirmek.
          </p>

          <p>
            Yıllar içinde edindiğimiz sınav hazırlık deneyimini modern bir
            dijital altyapıyla birleştirerek; öğrencilerimizin kendi hızlarında
            ilerleyebildiği, ihtiyaç duyduklarında canlı ders desteği alabildiği
            ve gerçek sınav formatında pratik yapabildiği bir öğrenme ortamı
            sunuyoruz.
          </p>

          <p>
            Platformumuzda dijital paketler, canlı akademi dersleri, konuşma
            kulübü, kelime pratiği oyunları ve TELC formatına uygun deneme
            sınavları bir arada yer alır. Her öğrencinin seviyesine ve hedefine
            uygun bir hazırlık yolu sunmaya devam ediyoruz.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center"
            >
              <p className="text-2xl font-black text-orange-500 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Yukarıdaki rakamlar platformumuzun genel işleyişine ilişkin
          tahmini/özet bilgilerdir.
        </p>
      </article>
    </CorporateShell>
  );
}