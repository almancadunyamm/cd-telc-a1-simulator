"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ActivateOrderButton from "./activate-order-button";
import { supabase } from "@/lib/supabase";
import type { BillingOrder } from "@/lib/billing/orders";

export default function ActivateOrdersPage() {
  const [orders, setOrders] = useState<BillingOrder[]>([]);

  useEffect(() => {
  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending_payment", "paid_waiting_activation"])
      .order("created_at", { ascending: false });

    if (error) {
      alert("Siparişler yüklenemedi: " + error.message);
      return;
    }

    setOrders(
      (data || []).map((order: any) => ({
        id: order.id,
        username: order.username,
        productSlug: order.product_slug,
        level: order.level,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.created_at,
        packageType: "starter",
      }))
    );
  }

  loadOrders();
}, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/classes"
          className="text-sm text-slate-300 hover:text-white"
        >
          ← Sınıf yönetimine dön
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">Sipariş Aktivasyon Paneli</h1>

          <p className="mt-2 text-sm text-slate-300">
            Bekleyen siparişleri buradan ilgili kullanıcının sınıf erişimine
            dönüştürebilirsiniz.
          </p>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-sm text-slate-300">
              Bekleyen sipariş bulunmuyor.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h2 className="text-lg font-bold">
                        {order.productSlug}
                      </h2>

                      <div className="mt-2 space-y-1 text-sm text-slate-300">
                        <p>
                          Kullanıcı:{" "}
                          <span className="font-semibold text-white">
                            {order.username || "Kullanıcı yok"}
                          </span>
                        </p>

                        <p>
                          Seviye:{" "}
                          <span className="font-semibold text-white">
                            {order.level}
                          </span>
                        </p>

                        <p>
                          Durum:{" "}
                          <span className="font-semibold text-yellow-300">
                            {order.status}
                          </span>
                        </p>

                        <p className="text-xs text-slate-500">
                          Sipariş ID: {order.id}
                        </p>
                      </div>
                    </div>

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