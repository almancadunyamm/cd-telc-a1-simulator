"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const adminCards = [
  {
    title: "Sipariş Aktivasyonu",
    description: "Ödeme yapan öğrencilerin erişimini tek tıkla aç.",
    href: "/admin/activate-orders",
    icon: "✅",
    accent: "#10b981",
    tag: "Öncelikli",
  },
  {
    title: "Sınıf Yönetimi",
    description: "Sınıf oluştur, öğretmen ata, varsayılanı belirle.",
    href: "/admin/classes",
    icon: "🏫",
    accent: "#3b82f6",
  },
  {
    title: "Öğrenci Sınıf Atama",
    description: "Öğrencileri canlı kurs veya dijital sınıflara ata.",
    href: "/admin/students",
    icon: "👤",
    accent: "#8b5cf6",
  },
  {
    title: "Öğrenci Yönetimi",
    description: "Tüm öğrencileri görüntüle, durumları takip et.",
    href: "/admin/student-management",
    icon: "🎓",
    accent: "#a855f7",
  },
  {
    title: "Konuşma Kulübü",
    description: "Partner talep eden öğrencileri eşleştir.",
    href: "/admin/speaking-matches",
    icon: "🎙️",
    accent: "#14b8a6",
  },
  {
    title: "Öğretmen Yönetimi",
    description: "Öğretmen hesapları ve giriş bilgilerini yönet.",
    href: "/admin/teachers",
    icon: "👨‍🏫",
    accent: "#f97316",
  },
  {
    title: "Öğretmen Paneli",
    description: "Ders kayıtları, PDF ve ödev içerikleri ekle.",
    href: "/teacher",
    icon: "🎥",
    accent: "#ef4444",
  },
  {
    title: "Shopier Linkleri",
    description: "Paket ve kurs ödeme linklerini güncelle.",
    href: "/admin/shopier-links",
    icon: "💳",
    accent: "#eab308",
  },
  {
    title: "SSS Yönetimi",
    description: "Ana sayfadaki sık sorulan soruları düzenle.",
    href: "/admin/faqs",
    icon: "❓",
    accent: "#ec4899",
  },
  {
    title: "Footer SEO",
    description: "Footer başlıkları, açıklamalar ve bağlantılar.",
    href: "/admin/footer",
    icon: "🧠",
    accent: "#6366f1",
  },
  {
    title: "TELC Simülasyon",
    description: "Deneme sınavı soru setlerini ve içerikleri yönet.",
    href: "/admin/telc",
    icon: "📝",
    accent: "#06b6d4",
    soon: true,
  },
];

export default function AdminHomePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }
    setAllowed(true);

    const tick = () => setTime(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, [router]);

  if (!allowed) return (
    <main className="min-h-screen bg-slate-950 p-6 text-white flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                Almanca Okulum — Admin
              </span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Yönetim<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                Merkezi
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 max-w-md">
              Sipariş, sınıf, öğrenci ve içerik yönetimi tek panelde.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-right">
              <p className="text-xs text-slate-500">Şu an</p>
              <p className="text-2xl font-black tabular-nums">{time}</p>
            </div>
            <Link
              href="/admin/activate-orders"
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-400 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              ✅ Siparişler
            </Link>
          </div>
        </div>

        {/* KARTLAR */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {adminCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/15 hover:bg-white/8 hover:shadow-xl"
              style={{ "--accent": card.accent } as React.CSSProperties}
            >
              {/* Accent glow */}
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: card.accent }}
              />

              <div className="relative">
                {/* İkon + rozet */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-lg"
                    style={{ backgroundColor: card.accent + "22", border: `1px solid ${card.accent}44` }}
                  >
                    {card.icon}
                  </div>
                  {card.tag && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-400">
                      {card.tag}
                    </span>
                  )}
                  {card.soon && (
                    <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-black text-yellow-400">
                      Yakında
                    </span>
                  )}
                </div>

                <h2 className="text-sm font-black text-white leading-snug">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {card.description}
                </p>

                <div
                  className="mt-4 flex items-center gap-1 text-xs font-black opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: card.accent }}
                >
                  Panele Git
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ALT BİLGİ ÇUBUĞU */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Hızlı Erişim
            </p>
            <div className="space-y-2">
              {[
                { label: "Bekleyen siparişler", href: "/admin/activate-orders" },
                { label: "Öğrenci sınıf ata", href: "/admin/students" },
                { label: "Yeni sınıf oluştur", href: "/admin/classes" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  {item.label}
                  <span className="text-slate-600">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Sistem Durumu
            </p>
            {[
              { label: "Supabase DB", status: "Aktif" },
              { label: "Vercel Deploy", status: "Canlı" },
              { label: "Shopier Ödeme", status: "Açık" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-xs text-slate-400">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-blue-400 mb-2">
              Öncelikli İşlem
            </p>
            <h3 className="text-base font-black text-white leading-snug">
              Canlı kurs öğrencilerini sisteme bağla
            </h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Ödeme yapan öğrenciler aktivasyon panelinden onaylandıktan sonra ders kayıtlarına erişebilir.
            </p>
            <Link
              href="/admin/activate-orders"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500/20 px-4 py-2 text-xs font-black text-blue-300 hover:bg-blue-500/30 transition-all"
            >
              Aktivasyon Paneline Git →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}