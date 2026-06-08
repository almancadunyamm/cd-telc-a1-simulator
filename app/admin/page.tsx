"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const adminCards = [
  {
    title: "Sipariş Aktivasyonu",
    description:
      "Dijital paket ve canlı kurs ödemelerinden sonra öğrencilerin erişimini aktif et.",
    href: "/admin/activate-orders",
    icon: "✅",
    color: "bg-emerald-500",
  },
  {
    title: "Sınıf Yönetimi",
    description:
      "A1, A2, B1 sınıfları oluştur, öğretmen ata ve varsayılan satış sınıfını belirle.",
    href: "/admin/classes",
    icon: "🏫",
    color: "bg-blue-500",
  },
  {
  title: "Konuşma Kulübü Eşleştirme",
  description:
    "Partner talep eden öğrencileri görüntüle, uygun kişileri tek tıkla eşleştir.",
  href: "/admin/speaking-matches",
  icon: "🎙️",
  color: "bg-teal-500",
},
  {
  title: "SSS Yönetimi",
  description:
    "Ana sayfadaki sık sorulan soruları ekle, düzenle veya sil.",
  href: "/admin/faqs",
  icon: "❓",
  color: "bg-pink-500",
},
{
  title: "Öğrenci Yönetimi",
  description:
    "Tüm dijital ve canlı öğrencileri görüntüle, durumlarını takip et ve sahte test hesaplarını temizle.",
  href: "/admin/student-management",
  icon: "🎓",
  color: "bg-purple-500",
},
  {
    title: "Öğrenci Sınıf Atama",
    description:
      "Öğrencileri manuel olarak canlı kurs veya dijital sınıflara ata.",
    href: "/admin/students",
    icon: "👤",
    color: "bg-violet-500",
  },
  {
    title: "Shopier Link Yönetimi",
    description:
      "Dijital paketler ve canlı kurslar için ödeme linklerini güncelle.",
    href: "/admin/shopier-links",
    icon: "💳",
    color: "bg-yellow-400",
  },
  {
    title: "Öğretmen Paneli",
    description:
      "Ders kayıtları, PDF materyaller ve ödev içeriklerini sınıflara ekle.",
    href: "/teacher",
    icon: "🎥",
    color: "bg-red-500",
  },
  {
    title: "TELC Simülasyon Yönetimi",
    description:
      "TELC dijital deneme sınavlarını, soru setlerini ve seviye içeriklerini yönet.",
    href: "/admin/telc",
    icon: "📝",
    color: "bg-cyan-500",
    soon: true,
  },
  {
  title: "Öğretmen Yönetimi",
  description:
    "Öğretmen hesaplarını oluştur, öğretmen ID ve giriş bilgilerini yönet.",
  href: "/admin/teachers",
  icon: "👨‍🏫",
  color: "bg-orange-500",
},
{
  title: "Footer SEO Yönetimi",
  description:
    "Footer alanındaki SEO başlıklarını, açıklamaları ve bağlantıları düzenle.",
  href: "/admin/footer",
  icon: "🧠",
  color: "bg-indigo-500",
},
];

export default function AdminHomePage() {
  const router = useRouter();
const [allowed, setAllowed] = useState(false);

useEffect(() => {
  const raw = localStorage.getItem("mock_logged_user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user || user.role !== "admin") {
    router.replace("/login");
    return;
  }

  setAllowed(true);
}, [router]);

if (!allowed) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      Yetki kontrol ediliyor...
    </main>
  );
}
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
            Almanca Okulum
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Admin Yönetim Merkezi
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Sipariş, sınıf, öğrenci, Shopier linkleri, ders içerikleri ve TELC
            simülasyon sistemini tek merkezden yönetin.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-200">
              Sipariş aktivasyonu
            </span>
            <span className="rounded-full bg-blue-500/15 px-4 py-2 text-blue-200">
              Sınıf yönetimi
            </span>
            <span className="rounded-full bg-yellow-400/15 px-4 py-2 text-yellow-200">
              Shopier linkleri
            </span>
            <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-cyan-200">
              TELC simülasyon
            </span>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color} text-2xl shadow-lg`}
              >
                {card.icon}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <h2 className="text-xl font-black">{card.title}</h2>

                {card.soon && (
                  <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-black text-slate-950">
                    Yakında
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {card.description}
              </p>

              <p className="mt-5 text-sm font-black text-yellow-300 group-hover:text-yellow-200">
                Panele Git →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-black text-slate-400">Bugünkü Öncelik</p>
            <h3 className="mt-2 text-2xl font-black">
              Canlı kurs öğrencilerini sisteme bağla
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Canlı kurs öğrencileri ödeme sonrası sınıfa atanmalı ve öğrenci
              panelinden ders kayıtlarına erişebilmelidir.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-black text-slate-400">Satış Fırsatı</p>
            <h3 className="mt-2 text-2xl font-black">
              Başlangıç → Gelişim → Zirve
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Canlı kurs öğrencilerine Başlangıç erişimi verilip daha fazla
              TELC denemesi ve materyal için yükseltme teklifleri gösterilebilir.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-black text-slate-400">Acil Ürün Vaadi</p>
            <h3 className="mt-2 text-2xl font-black">TELC Simülasyon MVP</h3>
            <p className="mt-3 text-sm text-slate-300">
              Ana sayfadaki TELC dijital sınav vaadi için ilk çalışan deneme
              ekranı hızlıca aktif edilmelidir.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}