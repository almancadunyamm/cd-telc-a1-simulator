import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almanca Okulum",
  description: "Almanca öğrenme ve TELC hazırlık platformu",
  icons: {
  icon: "/icon.png",
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