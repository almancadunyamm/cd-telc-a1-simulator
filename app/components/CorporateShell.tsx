import type { ReactNode } from "react";

// Kurumsal sayfalar (Hakkımızda, İletişim, Destek vb.) için
// Canlı Akademi renk temasına uygun ortak açık zemin ve başlık.
export default function CorporateShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 pb-16 pt-8 text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(251,146,60,0.18),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(250,204,21,0.16),transparent_28%)]" />

      <header className="relative z-10 mx-auto mb-10 flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/images/icon.png" alt="Almanca Okulum" className="h-12 w-auto" />
          <div>
            <p className="text-base font-black text-slate-950">Almanca Okulum</p>
            <p className="text-xs text-slate-500">Online Almanca Eğitim Platformu</p>
          </div>
        </a>
        <a
          href="/login"
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Giriş Yap
        </a>
      </header>

      <div className="relative z-10">{children}</div>

      <div className="relative z-10 mx-auto mt-8 flex max-w-4xl justify-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
        >
          ← Ana Sayfaya Dön
        </a>
      </div>
    </main>
  );
}
