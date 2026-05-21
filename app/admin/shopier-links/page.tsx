"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getShopierLinks,
  saveShopierLinks,
  type ShopierLinkMap,
} from "@/lib/billing/shopier-links";

const products = [
  { slug: "a1-starter", label: "A1 Başlangıç Dijital Paket" },
  { slug: "a1-practice", label: "A1 Gelişim Dijital Paket" },
  { slug: "a1-master", label: "A1 Zirve Dijital Paket" },

  { slug: "a2-starter", label: "A2 Başlangıç Dijital Paket" },
  { slug: "a2-practice", label: "A2 Gelişim Dijital Paket" },
  { slug: "a2-master", label: "A2 Zirve Dijital Paket" },

  { slug: "b1-starter", label: "B1 Başlangıç Dijital Paket" },
  { slug: "b1-practice", label: "B1 Gelişim Dijital Paket" },
  { slug: "b1-master", label: "B1 Zirve Dijital Paket" },

  { slug: "live-a1", label: "A1 Canlı Kurs" },
  { slug: "live-a2", label: "A2 Canlı Kurs" },
  { slug: "live-b1", label: "B1 Canlı Kurs" },
  { slug: "live-a1-a2", label: "A1 + A2 Canlı Kurs" },
  { slug: "live-full", label: "A1 + A2 + B1 Canlı Kurs" },
];

export default function ShopierLinksPage() {
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

if (!allowed) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      Yetki kontrol ediliyor...
    </main>
  );
}
  const [links, setLinks] = useState<ShopierLinkMap>({});

  useEffect(() => {
    setLinks(getShopierLinks());
  }, []);
  
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
  function handleChange(slug: string, value: string) {
    setLinks((prev) => ({
      ...prev,
      [slug]: value,
    }));
  }

  function handleSave() {
    saveShopierLinks(links);
    alert("Shopier linkleri kaydedildi.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Shopier Link Yönetimi</h1>

        <p className="mt-3 text-slate-300">
          Dijital paketler ve canlı kurslar için ödeme linklerini buradan
          güncelleyebilirsiniz.
        </p>

        <div className="mt-8 grid gap-4">
          {products.map((product) => (
            <div
              key={product.slug}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <label className="text-sm font-bold text-slate-200">
                {product.label}
              </label>

              <p className="mt-1 text-xs text-slate-500">{product.slug}</p>

              <input
                value={links[product.slug] || ""}
                onChange={(e) => handleChange(product.slug, e.target.value)}
                placeholder="https://www.shopier.com/..."
                className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-8 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
        >
          Linkleri Kaydet
        </button>
      </div>
    </main>
  );
}