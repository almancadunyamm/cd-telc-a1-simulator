"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GoetheA1Simulator from "../../../components/exam/GoetheA1Simulator";
import { supabase } from "@/lib/supabase";

type LevelCode = "A1" | "A2" | "B1";

function normalizeLevel(value: string): LevelCode | null {
  const upper = value.toUpperCase();
  if (upper === "A1" || upper === "A2" || upper === "B1") return upper as LevelCode;
  return null;
}

function hasExamAccess(productSlug: string): boolean {
  const slug = productSlug.toLowerCase();
  return (
    slug.includes("starter") ||
    slug.includes("practice") ||
    slug.includes("master") ||
    slug.includes("live") ||
    slug.includes("gelisim") ||
    slug.includes("zirve") ||
    slug.includes("baslangic")
  );
}

function levelMatchesSlug(level: LevelCode, productSlug: string): boolean {
  const slug = productSlug.toLowerCase();
  if (slug.includes("full") || slug.includes("a1-a2-b1")) return true;
  if ((slug.includes("a1-a2") || slug.includes("a1a2")) && (level === "A1" || level === "A2")) return true;
  if (slug.includes(level.toLowerCase())) return true;
  return false;
}

export default function LevelExamPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  const normalizedLevel = normalizeLevel(String(params?.level ?? ""));

  useEffect(() => {
    if (!normalizedLevel) {
      router.replace("/dashboard");
      return;
    }

    async function checkAccess() {
      try {
        // localStorage'dan kullanıcıyı al
        const rawUser = localStorage.getItem("mock_logged_user");
        if (!rawUser) {
          router.replace("/dashboard");
          return;
        }

        const user = JSON.parse(rawUser);
        const username = String(user.username || "").trim().toLowerCase();

        if (!username || username === "admin") {
          // Admin her şeye erişebilir
          if (username === "admin" || user.role === "admin") {
            setStatus("allowed");
            return;
          }
          router.replace("/dashboard");
          return;
        }

        // Admin rolü kontrolü
        if (user.role === "admin") {
          setStatus("allowed");
          return;
        }

        // Supabase'den order kontrolü
        const { data: orders, error } = await supabase
          .from("orders")
          .select("product_slug, status")
          .eq("username", username)
          .eq("status", "completed");

        if (error || !orders || orders.length === 0) {
          router.replace("/dashboard");
          return;
        }

        const hasAccess = orders.some((order: any) => {
          const slug = String(order.product_slug || "");
          return levelMatchesSlug(normalizedLevel!, slug) && hasExamAccess(slug);
        });

        if (hasAccess) {
          setStatus("allowed");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/dashboard");
      }
    }

    checkAccess();
  }, [normalizedLevel, router]);

  if (!normalizedLevel) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Geçersiz seviye</h1>
      </main>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Erişim kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return null;
  }

  const topBar = (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-2 shadow-sm">
      <button
        onClick={() => router.push(`/exams/${normalizedLevel!.toLowerCase()}/list?tier=starter`)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Deneme Listesi
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-widest text-blue-600">{normalizedLevel} · Dijital Simülatör</span>
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Panel
      </button>
    </div>
  );

  if (normalizedLevel === "A1") {
    return (
      <>
        {topBar}
        <div className="pt-12">
          <GoetheA1Simulator />
        </div>
      </>
    );
  }

  return (
    <>
      {topBar}
      <main className="min-h-screen bg-slate-200 p-6 pt-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">{normalizedLevel} sınav alanı yakında</h1>
          <p className="mt-4 text-slate-600">Bu seviye için sınav içeriği hazırlanıyor.</p>
        </div>
      </main>
    </>
  );
}