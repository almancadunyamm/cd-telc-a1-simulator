import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ücretsiz Deneme Dersi | Almanca Okulum",
  description:
    "Almanca Okulum canlı kursunu ücretsiz deneyin: örnek ders, Kelime Arenası ve çalışma sayfalarıyla öğrenci panelini keşfedin.",
};

export default function DenemeDersiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
