const resources = [
  {
    title: "Ücretsiz Seviye Tespit Sınavı",
    desc: "Almanca seviyeni ölç, sana uygun hazırlık paketini keşfet.",
    href: "/almanca-seviye-tespit-sinavi",
  },
  {
    title: "Kelime Arenası",
    desc: "Oyunlaştırılmış alıştırmalarla kelime dağarcığını geliştir.",
    href: "/Kelime",
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
];

export default function KaynaklarPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <article className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Almanca Okulum
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Kaynaklar
          </h1>

          <p className="mt-4 text-sm text-slate-400 sm:text-base">
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
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-400/40 hover:bg-white/[0.06]"
            >
              <h2 className="text-lg font-bold text-white">
                {resource.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {resource.desc}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-sm text-slate-200 sm:text-base">
          Video dersler, PDF materyaller, TELC denemeleri ve konuşma pratiği
          gibi tüm içeriklere erişmek için{" "}
          <a href="/register" className="font-bold text-blue-300 hover:text-white">
            ücretsiz hesap oluştur
          </a>
          .
        </div>
      </article>
    </main>
  );
}