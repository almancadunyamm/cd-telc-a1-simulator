import {
  MessageCircle,
  ShieldCheck,
  GraduationCap,
  BarChart3,
} from "lucide-react";

const footerColumns = [
  {
    title: "TELC Dijital Sistem",
    links: [
      "TELC Dijital Sınav",
      "Online TELC Denemeleri",
      "Gerçek Sınav Simülasyonu",
      "TELC Yazma Pratiği",
      "TELC Konuşma Hazırlığı",
      "TELC Seviye Analizi",
      "Sınav Performans Takibi",
    ],
  },
  {
    title: "TELC Hazırlık",
    links: [
      "TELC A1 Hazırlık",
      "TELC A2 Hazırlık",
      "TELC B1 Hazırlık",
      "TELC Schreiben",
      "TELC Sprechen",
      "TELC Lesen",
      "TELC Hören",
    ],
  },
  {
    title: "Almanca Öğren",
    links: [
      "Online Almanca Kursu",
      "Almanca Konuşma",
      "Almanca Kelime Oyunu",
      "Almanca PDF Kaynakları",
      "A1 Almanca",
      "A2 Almanca",
      "B1 Almanca",
    ],
  },
  {
    title: "Öğrenci Merkezi",
    links: [
      "Dijital Paketler",
      "Canlı Akademi",
      "Öğrenci Paneli",
      "Sınav Takibi",
      "Başarı Raporları",
      "Ders Kayıtları",
    ],
  },
  {
    title: "Kurumsal",
    links: [
      "Hakkımızda",
      "Almanca Okulum",
      "Başarı Hikayeleri",
      "İletişim",
      "Destek",
      "Kaynaklar",
    ],
  },
];

const legalLinks = [
  {
    label: "Gizlilik Politikası",
    href: "/gizlilik",
  },
  {
    label: "KVKK",
    href: "/kvkk",
  },
  {
    label: "Mesafeli Satış Sözleşmesi",
    href: "/mesafeli-satis",
  },
  {
    label: "Kullanım Şartları",
    href: "/kullanim-sartlari",
  },
  {
    label: "Çerez Politikası",
    href: "/cerez-politikasi",
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* ÜST PREMIUM MARKA ALANI */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-6">
          <div className="grid gap-8 lg:grid-cols-1 lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <img
  src="/images/icon.png"
  className="h-28 w-auto object-contain"
/>
              </div>

              <h2 className="mt-6 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                TELC, Goethe ve ÖSD sınavlarına modern dijital sistemle
                hazırlanın.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Canlı ders, dijital deneme, yazma-konuşma pratiği ve performans
                takibiyle Almanca öğrenme sürecinizi daha düzenli, ölçülebilir
                ve güven veren bir yapıya taşıyoruz.
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  Güvenli öğrenme sistemi
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">
                  <GraduationCap className="h-4 w-4 text-blue-400" />
                  TELC odaklı eğitim
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  Performans takibi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Almanca öğrenme ve sınav hazırlığında dijital, canlı ve ölçülebilir
              premium eğitim deneyimi.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Instagram"
              >
                <span className="text-sm font-bold">IG</span>
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="YouTube"
              >
                <span className="text-sm font-bold">YT</span>
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* ALT SEO VE NAVİGASYON ALANI */}
        <div className="grid gap-8 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-5">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">
                {column.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
  <li key={link}>
    <a
      href="#"
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* YASAL ALAN */}
        <div className="flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Almanca Okulum. Tüm hakları saklıdır.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
  <a
    key={link.label}
    href={link.href}
    className="text-sm text-slate-500 transition hover:text-white"
  >
    {link.label}
  </a>
))}
          </div>
        </div>
      </div>
    </footer>
  );
}