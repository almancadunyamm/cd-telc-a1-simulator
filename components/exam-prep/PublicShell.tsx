import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";

export const SITE_URL = "https://almancaokulum.com";

export type Crumb = { label: string; href?: string };

// Herkese açık Sınav Hazırlık sayfalarının ortak çerçevesi (başlık, menü, breadcrumb, footer).
export default function PublicShell({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <img src="/images/icon.png" alt="Almanca Okulum" className="h-12 w-auto" />
          <div className="hidden sm:block">
            <p className="text-base font-black">Almanca Okulum</p>
            <p className="text-xs text-slate-500">telc · Goethe · ÖSD Sınav Hazırlık</p>
          </div>
        </a>
        <nav className="flex items-center gap-2">
          <a href="/sinav-hazirlik" className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 md:inline-flex">
            Sınav Hazırlık
          </a>
          <a href="/register?adim=secim" className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-50">
            Ücretsiz Başla
          </a>
          <a href="/login" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Giriş Yap
          </a>
        </nav>
      </header>
      <div className="mx-auto max-w-7xl px-4 pb-10">
        <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs font-bold text-slate-500">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="px-1 text-slate-300">›</span>}
              {c.href ? (
                <a href={c.href} className="hover:text-blue-600">{c.label}</a>
              ) : (
                <span className="text-slate-800">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        {children}
      </div>
      <Footer />
    </main>
  );
}
