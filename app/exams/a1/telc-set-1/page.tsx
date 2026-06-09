"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const TelcA1Simulator = dynamic(
  () => import("@/components/exam/TelcA1Simulator"),
  { ssr: false }
);

export default function TelcA1Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const stored = localStorage.getItem("mock_logged_user");
        if (!stored) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(stored);
        setUserName(user.name || user.username);

        // Admin her zaman erişebilir
        if (user.role === "admin") {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Supabase'den orders kontrolü
        const { data: orders } = await supabase
          .from("orders")
          .select("product_slug, status")
          .eq("username", user.username)
          .eq("status", "completed");

        if (orders && orders.length > 0) {
          const hasValidOrder = orders.some((order: { product_slug: string }) => {
            const slug = order.product_slug?.toLowerCase() || "";
            return (
              slug.includes("starter") ||
              slug.includes("practice") ||
              slug.includes("master") ||
              slug.includes("live") ||
              slug.includes("baslangic") ||
              slug.includes("gelisim") ||
              slug.includes("zirve")
            );
          });
          setHasAccess(hasValidOrder);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error("Access check error:", err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erişim Yok</h2>
          <p className="text-gray-500 text-sm mb-6">
            Bu deneme sınavına erişmek için bir paket satın almanız gerekiyor.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all"
          >
            Paketleri İncele
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Üst nav barı — GoetheA1Simulator ile aynı */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between text-sm">
        <button
          onClick={() => router.push("/exams/a1/list?tier=starter")}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 font-medium transition-colors"
        >
          ← Deneme Listesi
        </button>
        <span className="text-gray-600 font-semibold text-xs tracking-wide uppercase">
          A1 · TELC SİMÜLATÖR
        </span>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 font-medium transition-colors"
        >
          🏠 Panel
        </button>
      </div>

      <TelcA1Simulator />
    </div>
  );
}