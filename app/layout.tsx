export const dynamic = "force-dynamic";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almanca Okulum",
  description: "Almanca öğrenme ve TELC hazırlık platformu",
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon-192.png",
  },
  manifest: "/manifest.json",
  themeColor: "#059669",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Almanca Okulum",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}