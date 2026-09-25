import CorporateShell from "@/app/components/CorporateShell";

const resources = [
  {
    title: "Ücretsiz Seviye Tespit Sınavı",
    desc: "Almanca seviyeni ölç, sana uygun hazırlık paketini keşfet.",
    href: "/almanca-seviye-tespit-sinavi",
  },
  {
    title: "Canlı Akademi",
    desc: "Eğitmen eşliğinde canlı ders programımızı incele.",
    href: "/academy-live",
  },
  {
    title: "Dijital Simülasyon",
    desc: "Gerçek sınav formatına uygun dijital deneme sistemini keşfet.",
    href: "/digital-simulation",
  },
  {
    title: "Konuşma Kulübü",
    desc: "Sadece konuşma pratiği yapmak istiyorsan, ayrı paketleri incele.",
    href: "/konusma-kulubu",
  },
];

export default function KaynaklarPage() {
  return (
    <CorporateShell>
      <article className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white shadow-xl p-8 sm:p-10">
        <div className="mb-10 border-b border-slate-200 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Kaynaklar
          </h1>

          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Almanca öğrenme yolculuğuna başlamak için ücretsiz kaynaklarımıza
            göz at. Video dersler, PDF materyaller ve deneme sınavlarının
            tamamına ise kayıt olduktan sonra öğrenci panelinden ulaşabilirsin.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <h2 className="text-lg font-bold text-slate-950">
                {resource.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {resource.desc}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-6 text-sm text-slate-700 sm:grid-cols-2 sm:text-base">
          <div>
            <p className="font-bold text-slate-950">Canlı ders almak istiyorum</p>
            <p className="mt-1 text-slate-600">
              Öğretmen eşliğinde canlı ders ve konuşma kulübü için{" "}
              <a
                href="/academy-live"
                className="font-bold text-orange-600 hover:text-orange-600"
              >
                Canlı Akademi'yi incele
              </a>
              .
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-950">Kendi hızımda çalışmak istiyorum</p>
            <p className="mt-1 text-slate-600">
              Video dersler, PDF materyaller ve TELC denemeleri için{" "}
              <a
                href="/digital-simulation#paketler"
                className="font-bold text-orange-600 hover:text-orange-600"
              >
                ücretsiz dijital başlangıç paketini incele
              </a>
              .
            </p>
          </div>
        </div>
      </article>
    </CorporateShell>
  );
}