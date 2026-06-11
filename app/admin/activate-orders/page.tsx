"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ActivateOrderButton from "./activate-order-button";
import { supabase } from "@/lib/supabase";
import type { BillingOrder } from "@/lib/billing/orders";

type EnrichedOrder = BillingOrder & {
  studentName?: string;
  existingClasses?: { level: string; className: string }[];
  isNewStudent?: boolean;
  orderType?: "live" | "digital";
  packageLabel?: string;
  levelLabel?: string;
  createdAtFormatted?: string;
};

function getOrderType(slug: string): "live" | "digital" {
  return String(slug || "").startsWith("live-") ? "live" : "digital";
}

function getPackageLabel(slug: string): string {
  const s = String(slug || "").toLowerCase();
  if (s.includes("master") || s.includes("zirve")) return "Zirve";
  if (s.includes("practice") || s.includes("gelisim")) return "Gelişim";
  if (s.includes("starter") || s.includes("baslangic")) return "Başlangıç";
  if (s.startsWith("live-")) {
    if (s.includes("a1-a2-b1") || s.includes("full")) return "Üçlü Paket (A1+A2+B1)";
    if (s.includes("a1-a2")) return "İkili Paket (A1+A2)";
    if (s.includes("a2-b1")) return "İkili Paket (A2+B1)";
    return "Canlı Kurs";
  }
  return slug;
}

function getLevelLabel(slug: string): string {
  const s = String(slug || "").toLowerCase();
  if (s.includes("a1-a2-b1") || s.includes("full")) return "A1 + A2 + B1";
  if (s.includes("a1-a2")) return "A1 + A2";
  if (s.includes("a2-b1")) return "A2 + B1";
  if (s.includes("a1")) return "A1";
  if (s.includes("a2")) return "A2";
  if (s.includes("b1")) return "B1";
  return "—";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString("tr-TR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ActivateOrdersPage() {
  const [orders, setOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending_payment", "paid_waiting_activation"])
      .eq("is_activated", false)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Siparişler yüklenemedi: " + error.message);
      setLoading(false);
      return;
    }

    const rawOrders = data || [];

    // Tüm kullanıcı adlarını topla
    const usernames = [...new Set(rawOrders.map((o: any) => String(o.username || "").toLowerCase()))];

    // Kullanıcı isimlerini çek
    const { data: usersData } = await supabase
      .from("users")
      .select("email, name")
      .in("email", usernames);

    const nameMap: Record<string, string> = {};
    (usersData || []).forEach((u: any) => {
      nameMap[u.email?.toLowerCase()] = u.name || u.email;
    });

    // Mevcut sınıf erişimlerini çek
    const { data: accessData } = await supabase
      .from("student_class_access")
      .select("username, main_class_id")
      .in("username", usernames);

    const { data: classesData } = await supabase
      .from("classes")
      .select("id, name, level");

    const classMap: Record<string, { name: string; level: string }> = {};
    (classesData || []).forEach((c: any) => {
      classMap[c.id] = { name: c.name, level: c.level };
    });

    const accessMap: Record<string, { level: string; className: string }[]> = {};
    (accessData || []).forEach((a: any) => {
      const key = String(a.username || "").toLowerCase();
      if (!accessMap[key]) accessMap[key] = [];
      const cls = classMap[a.main_class_id];
      if (cls) accessMap[key].push({ level: cls.level, className: cls.name });
    });

    const enriched: EnrichedOrder[] = rawOrders.map((order: any) => {
      const username = String(order.username || "").toLowerCase();
      const slug = String(order.product_slug || "");
      return {
        id: order.id,
        username: order.username,
        productSlug: slug,
        level: order.level,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.created_at,
        packageType: "starter",
        studentName: nameMap[username] || order.username,
        existingClasses: accessMap[username] || [],
        isNewStudent: (accessMap[username] || []).length === 0,
        orderType: getOrderType(slug),
        packageLabel: getPackageLabel(slug),
        levelLabel: getLevelLabel(slug),
        createdAtFormatted: formatDate(order.created_at),
      };
    });

    setOrders(enriched);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/classes" className="text-sm text-slate-400 hover:text-white">
          ← Sınıf yönetimine dön
        </Link>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">Sipariş Aktivasyon Paneli</h1>
              <p className="mt-1 text-sm text-slate-400">
                {orders.length} bekleyen sipariş
              </p>
            </div>
            <button
              onClick={loadOrders}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              🔄 Yenile
            </button>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-center text-slate-400">
              ✅ Bekleyen sipariş bulunmuyor.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  {/* Üst başlık */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
                        order.orderType === "live"
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}>
                        {order.orderType === "live" ? "🎓 CANLI KURS" : "💻 DİJİTAL"}
                      </div>
                      <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
                        order.isNewStudent
                          ? "bg-yellow-500 text-slate-900"
                          : "bg-slate-700 text-slate-200"
                      }`}>
                        {order.isNewStudent ? "🆕 YENİ ÖĞRENCİ" : "✅ Mevcut Öğrenci"}
                      </div>
                      <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
                        order.status === "paid_waiting_activation"
                          ? "bg-green-700 text-white"
                          : "bg-orange-700 text-white"
                      }`}>
                        {order.status === "paid_waiting_activation" ? "💳 Ödendi" : "⏳ Ödeme Bekliyor"}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">{order.createdAtFormatted}</p>
                  </div>

                  {/* Öğrenci bilgisi */}
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-800 p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                        Öğrenci
                      </p>
                      <p className="text-base font-black text-white">{order.studentName}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{order.username}</p>

                      {/* Mevcut sınıflar */}
                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-500 mb-1">Mevcut Sınıflar:</p>
                        {(order.existingClasses || []).length === 0 ? (
                          <p className="text-xs text-yellow-400">⚠️ Henüz hiç sınıfı yok</p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {order.existingClasses!.map((cls, i) => (
                              <span key={i} className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-bold text-slate-300">
                                {cls.level} — {cls.className}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sipariş detayı */}
                    <div className="rounded-xl bg-slate-800 p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                        Talep Edilen Paket
                      </p>
                      <p className="text-base font-black text-white">{order.packageLabel}</p>
                      <p className="text-sm text-slate-400 mt-0.5">Seviye: <span className="font-bold text-white">{order.levelLabel}</span></p>
                      <p className="text-xs text-slate-500 mt-2">Slug: {order.productSlug}</p>
                      <p className="text-xs text-slate-600 mt-0.5">ID: {order.id}</p>

                      {/* Aktivasyon sonucu önizleme */}
                      <div className="mt-3 rounded-lg bg-slate-700 p-2">
                        <p className="text-xs font-bold text-emerald-400">
                          ✓ Aktif Et → Ne Olacak?
                        </p>
                        <p className="text-xs text-slate-300 mt-1">
                          {order.orderType === "live"
                            ? `${order.levelLabel} varsayılan canlı sınıfına atanacak`
                            : `${order.levelLabel} dijital ${order.packageLabel} paketi açılacak`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aksiyon */}
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <ActivateOrderButton order={order} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}