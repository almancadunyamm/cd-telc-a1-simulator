export type FooterLinkItem = {
  title: string;
  description: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLinkItem[];
};

export const defaultFooterColumns: FooterColumn[] = [
  {
    title: "TELC Dijital Sistem",
    links: [
      {
        title: "TELC Dijital Sınav",
        description:
          "TELC sınav formatına uygun dijital denemelerle seviyeni ölç.",
        href: "/telc-dijital-sinav",
      },
      {
        title: "Online TELC Denemeleri",
        description:
          "A1, A2 ve B1 seviyelerine uygun online TELC deneme sınavları.",
        href: "/online-telc-denemeleri",
      },
      {
        title: "Gerçek Sınav Simülasyonu",
        description:
          "Gerçek sınav atmosferine yakın dijital TELC hazırlık deneyimi.",
        href: "/gercek-sinav-simulasyonu",
      },
    ],
  },
  {
    title: "TELC Hazırlık",
    links: [
      {
        title: "TELC A1 Hazırlık",
        description:
          "TELC A1 sınavına yazma, konuşma, dinleme ve okuma çalışmalarıyla hazırlan.",
        href: "/telc-a1-hazirlik",
      },
      {
        title: "TELC A2 Hazırlık",
        description:
          "TELC A2 sınavı için dijital deneme ve performans takip sistemi.",
        href: "/telc-a2-hazirlik",
      },
      {
        title: "TELC B1 Hazırlık",
        description:
          "TELC B1 sınavına yönelik kapsamlı online hazırlık içerikleri.",
        href: "/telc-b1-hazirlik",
      },
    ],
  },
  {
    title: "Almanca Öğren",
    links: [
      {
        title: "Online Almanca Kursu",
        description:
          "Canlı ders ve dijital içeriklerle Almanca öğrenme sürecini planla.",
        href: "/online-almanca-kursu",
      },
      {
        title: "Almanca Konuşma",
        description:
          "Almanca konuşma pratiğiyle sınav ve günlük iletişim becerini geliştir.",
        href: "/almanca-konusma",
      },
      {
        title: "Almanca Kelime Oyunu",
        description:
          "A1, A2 ve B1 kelimelerini oyunlaştırılmış sistemle tekrar et.",
        href: "/almanca-kelime-oyunu",
      },
    ],
  },
];