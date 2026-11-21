import CorporateShell from "@/app/components/CorporateShell";
import { DIGITAL_SIMULATOR_VISIBLE, LIVE_ACADEMY_VISIBLE } from "@/lib/site-flags";

const resources = [
  {
    title: "Ücretsiz Seviye Tespit Sınavı",
    desc: "Almanca seviyeni ölç, sana uygun hazırlık paketini keşfet.",
    href: "/almanca-seviye-tespit-sinavi",
  },
  LIVE_ACADEMY_VISIBLE
    ? {
        title: "Canlı Akademi",
        desc: "Eğitmen eşliğinde canlı ders programımızı incele.",
        href: "/academy-live",
      }
    : {
        title: "Ücretsiz Sınav Hazırlık",
        desc: "telc, Goethe ve ÖSD Lesen alıştırmalarını kayıt olmadan gerçek sınav formatında çöz.",
        href: "/sinav-hazirlik",
      },
  DIGITAL_SIMULATOR_VISIBLE
    ? {
        title: "Dijital Simülasyon",
        desc: "Gerçek sınav formatına uygun dijital deneme sistemini keşfet.",
        href: "/digital-simulation",
      }
    : {
        title: "Ücretsiz Deneme Dersi",
        desc: "Kayıt olmadan örnek canlı dersi izle, öğrenci panelini keşfet.",
        href: "/deneme-dersi",
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
          {LIVE_ACADEMY_VISIBLE ? (
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
          ) : (
          <div>
            <p className="font-bold text-slate-950">Sınav formatını tanımak istiyorum</p>
            <p className="mt-1 text-slate-600">
              telc, Goethe ve ÖSD Lesen bölümlerini gerçek formatta denemek için{" "}
              <a
                href="/sinav-hazirlik"
                className="font-bold text-orange-600 hover:text-orange-600"
              >
                ücretsiz sınav alıştırmalarını çöz
              </a>
              .
            </p>
          </div>
          )}

          {DIGITAL_SIMULATOR_VISIBLE ? (
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
          ) : (
          <div>
            <p className="font-bold text-slate-950">Önce denemek istiyorum</p>
            <p className="mt-1 text-slate-600">
              Kayıt olmadan örnek dersi izlemek ve öğrenci panelini görmek için{" "}
              <a
                href="/deneme-dersi"
                className="font-bold text-orange-600 hover:text-orange-600"
              >
                ücretsiz deneme dersine başla
              </a>
              .
            </p>
          </div>
          )}
        </div>
      </article>
    </CorporateShell>
  );
}