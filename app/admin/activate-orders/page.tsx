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
  trashAt?: string | null;
  cancelledAt?: string | null;
};

type ActiveTab = "pending" | "trash";

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

function getDaysAgo(dateStr: string): number {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export default function ActivateOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState<EnrichedOrder[]>([]);
  const [trashOrders, setTrashOrders] = useState<EnrichedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pending");

  useEffect(() => {
    autoTrashOldOrders().then(() => loadOrders());
  }, []);

  async function autoTrashOldOrders() {
    await supabase.rpc("auto_trash_old_orders");
    await supabase.rpc("auto_delete_trashed_orders");
  }

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
    const usernames = [...new Set(rawOrders.map((o: any) => String(o.username || "").toLowerCase()))];

    const { data: usersData } = await supabase
      .from("users")
      .select("email, name")
      .in("email", usernames);

    const nameMap: Record<string, string> = {};
    (usersData || []).forEach((u: any) => {
      nameMap[u.email?.toLowerCase()] = u.name || u.email;
    });

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

    const enrich = (order: any): EnrichedOrder => {
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
        trashAt: order.trash_at || null,
        cancelledAt: order.cancelled_at || null,
      };
    };

    const active = rawOrders.filter((o: any) => !o.trash_at && !o.cancelled_at).map(enrich);
    const trash = rawOrders.filter((o: any) => o.trash_at || o.cancelled_at).map(enrich);

    setPendingOrders(active);
    setTrashOrders(trash);
    setLoading(false);
  }

  async function handleCancel(orderId: string) {
    const confirmed = window.confirm("Bu siparişi iptal etmek istediğinizden emin misiniz?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("orders")
      .update({ cancelled_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      alert("İptal edilemedi: " + error.message);
      return;
    }

    loadOrders();
  }

  async function handleRestore(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ trash_at: null, cancelled_at: null })
      .eq("id", orderId);

    if (error) {
      alert("Geri alınamadı: " + error.message);
      return;
    }

    loadOrders();
  }

  async function handleDeletePermanently(orderId: string) {
    const confirmed = window.confirm("Bu sipariş kalıcı olarak silinecek. Emin misiniz?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      alert("Silinemedi: " + error.message);
      return;
    }

    loadOrders();
  }

  const OrderCard = ({ order, isTrash = false }: { order: EnrichedOrder; isTrash?: boolean }) => (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      {/* Üst rozetler */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
            order.orderType === "live" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
          }`}>
            {order.orderType === "live" ? "🎓 CANLI KURS" : "💻 DİJİTAL"}
          </div>
          <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
            order.isNewStudent ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-slate-200"
          }`}>
            {order.isNewStudent ? "🆕 YENİ ÖĞRENCİ" : "✅ Mevcut Öğrenci"}
          </div>
          <div className={`rounded-xl px-3 py-1.5 text-xs font-black ${
            order.status === "paid_waiting_activation" ? "bg-green-700 text-white" : "bg-orange-700 text-white"
          }`}>
            {order.status === "paid_waiting_activation" ? "💳 Ödendi" : "⏳ Ödeme Bekliyor"}
          </div>
          {isTrash && order.cancelledAt && (
            <div className="rounded-xl bg-red-800 px-3 py-1.5 text-xs font-black text-white">
              🚫 İptal Edildi
            </div>
          )}
          {isTrash && order.trashAt && !order.cancelledAt && (
            <div className="rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-black text-slate-300">
              🗑️ Otomatik Çöp
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">{order.createdAtFormatted}</p>
      </div>

      {/* Bilgi kartları */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Öğrenci</p>
          <p className="text-base font-black text-white">{order.studentName}</p>
          <p className="text-sm text-slate-400 mt-0.5">{order.username}</p>
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

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Talep Edilen Paket</p>
          <p className="text-base font-black text-white">{order.packageLabel}</p>
          <p className="text-sm text-slate-400 mt-0.5">Seviye: <span className="font-bold text-white">{order.levelLabel}</span></p>
          <p className="text-xs text-slate-500 mt-2">Slug: {order.productSlug}</p>

          {!isTrash && (
            <div className="mt-3 rounded-lg bg-slate-700 p-2">
              <p className="text-xs font-bold text-emerald-400">✓ Aktif Et → Ne Olacak?</p>
              <p className="text-xs text-slate-300 mt-1">
                {order.orderType === "live"
                  ? `${order.levelLabel} varsayılan canlı sınıfına atanacak`
                  : `${order.levelLabel} dijital ${order.packageLabel} paketi açılacak`}
              </p>
            </div>
          )}

          {isTrash && (
            <div className="mt-3 rounded-lg bg-slate-700 p-2">
              <p className="text-xs font-bold text-slate-400">
                {order.cancelledAt
                  ? `İptal tarihi: ${formatDate(order.cancelledAt)}`
                  : order.trashAt
                  ? `Çöpe düşme: ${formatDate(order.trashAt)} · ${60 - getDaysAgo(order.trashAt)} gün sonra silinir`
                  : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Aksiyon butonları */}
      <div className="mt-4 flex items-center justify-end gap-3">
        {!isTrash ? (
          <>
            <button
              onClick={() => handleCancel(order.id)}
              className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-900/60"
            >
              🚫 İptal Et
            </button>
            <ActivateOrderButton order={order} />
          </>
        ) : (
          <>
            <button
              onClick={() => handleDeletePermanently(order.id)}
              className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-900/60"
            >
              🗑️ Kalıcı Sil
            </button>
            <button
              onClick={() => handleRestore(order.id)}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              ↩️ Geri Al
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/classes" className="text-sm text-slate-400 hover:text-white">
          ← Sınıf yönetimine dön
        </Link>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black">Sipariş Aktivasyon Paneli</h1>
            <button
              onClick={loadOrders}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              🔄 Yenile
            </button>
          </div>

          {/* Tab menü */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setActiveTab("pending")}
              className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${
                activeTab === "pending"
                  ? "bg-white text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              📋 Bekleyen
              {pendingOrders.length > 0 && (
                <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-black text-slate-900">
                  {pendingOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("trash")}
              className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${
                activeTab === "trash"
                  ? "bg-white text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              🗑️ Çöp Kutusu
              {trashOrders.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-600 px-2 py-0.5 text-xs font-black text-white">
                  {trashOrders.length}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : activeTab === "pending" ? (
            pendingOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-center text-slate-400">
                ✅ Bekleyen sipariş bulunmuyor.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {pendingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )
          ) : (
            trashOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-center text-slate-400">
                🗑️ Çöp kutusu boş.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-xs text-slate-500">
                  Çöp kutusundaki siparişler 60 gün sonra otomatik silinir. Geri alabilir veya kalıcı olarak silebilirsiniz.
                </p>
                {trashOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isTrash />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}