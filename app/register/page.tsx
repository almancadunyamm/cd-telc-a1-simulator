"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserItem = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student";
  isActive: boolean;
  createdAt: string;
};

const USERS_KEY = "users";

function getProductLabel(slug: string) {
  switch (slug) {
    case "live-a1":
      return "Canlı Akademi · A1";
    case "live-a2":
      return "Canlı Akademi · A2";
    case "live-b1":
      return "Canlı Akademi · B1";
    case "live-a1-a2":
      return "Canlı Akademi · A1 + A2";
    case "live-a2-b1":
      return "Canlı Akademi · A2 + B1";
    case "live-a1-a2-b1":
      return "Canlı Akademi · Tam Hazırlık";
    case "a1-starter":
      return "Dijital Simülasyon · A1 Başlangıç";
    case "a2-starter":
      return "Dijital Simülasyon · A2 Başlangıç";
    case "b1-starter":
      return "Dijital Simülasyon · B1 Başlangıç";
    case "a1-practice":
      return "Dijital Simülasyon · A1 Gelişim";
    case "a2-practice":
      return "Dijital Simülasyon · A2 Gelişim";
    case "b1-practice":
      return "Dijital Simülasyon · B1 Gelişim";
    case "a1-master":
      return "Dijital Simülasyon · A1 Zirve";
    case "a2-master":
      return "Dijital Simülasyon · A2 Zirve";
    case "b1-master":
      return "Dijital Simülasyon · B1 Zirve";
    default:
      return slug;
  }
}

function getLevelFromSlug(slug: string) {
  if (slug.includes("a2")) return "A2";
  if (slug.includes("b1")) return "B1";
  return "A1";
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const selectedProduct =
    typeof window !== "undefined"
      ? localStorage.getItem("selected_product_slug") || ""
      : "";

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (password.trim().length < 6) {
      alert("Şifre en az 6 karakter olmalı.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: existingUsers, error: existingError } = await supabase
  .from("users")
  .select("*")
  .eq("email", normalizedEmail);

if (existingError) {
  alert("Kullanıcı kontrolü yapılamadı.");
  return;
}

if (existingUsers && existingUsers.length > 0) {
  alert("Bu email ile daha önce kayıt yapılmış.");
  return;
}

    const { error: insertError } = await supabase.from("users").insert({
  name: name.trim(),
  email: normalizedEmail,
  password: password.trim(),
  role: "student",
  is_active: false,
});

if (insertError) {
  alert("Kayıt oluşturulamadı.");
  return;
}

    const selectedSlug =
      localStorage.getItem("selected_product_slug") ||
      localStorage.getItem("selectedProductSlug") ||
      localStorage.getItem("pending_payment_slug") ||
      "";

    localStorage.setItem(
      "mock_logged_user",
      JSON.stringify({
        username: normalizedEmail,
        role: "student",
        label: name.trim(),
        name: name.trim(),
      })
    );

    if (selectedSlug) {
      localStorage.setItem("pending_payment_slug", selectedSlug);

      localStorage.setItem(
        "last_payment_attempt",
        JSON.stringify({
          username: normalizedEmail,
          slug: selectedSlug,
          time: Date.now(),
        })
      );

      
    }

    router.push("/dashboard");
  }
return (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-8">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1fr_0.95fr]">
        {/* SOL GÖRSEL ALAN */}
        <section className="hidden bg-slate-50 lg:block">
          <div className="flex h-full flex-col">
            <div className="relative h-[45%] overflow-hidden">
              <img
                src="/images/login-students.png"
                alt="TELC öğrencileri"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="flex flex-1 flex-col justify-center p-10">
              <p className="inline-flex w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                Yeni öğrenci hesabı
              </p>

              <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950">
                Almanca hazırlık sürecini bugün başlat.
              </h1>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Hesabını oluştur, seçtiğin pakete eriş ve TELC hazırlık sistemine
                düzenli bir başlangıç yap.
              </p>

              <div className="mt-8 flex items-center gap-2">
                {[
                  {
                    title: "%100 TELC Uyumlu",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="m9 12 2 2 4-5" />
                      </svg>
                    ),
                  },
                  {
                    title: "Akıllı Takip",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19V5" />
                        <path d="M9 19V9" />
                        <path d="M14 19V3" />
                        <path d="M19 19v-7" />
                      </svg>
                    ),
                  },
                  {
                    title: "Uzman Eğitmen",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm"
                  >
                    <div className="text-blue-600">{item.icon}</div>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SAĞ KAYIT FORMU */}
        <section className="p-6 sm:p-10">
          <div className="mb-8 flex justify-center lg:hidden">
            <a href="/">
              <img
                src="/images/logo.png"
                alt="Almanca Okulum"
                className="h-16 w-auto object-contain"
              />
            </a>
          </div>

          <div className="mx-auto max-w-md">
            <div className="text-center lg:text-left">
              <p className="text-sm font-bold text-blue-600">
                Öğrenci Kaydı
              </p>

              <div className="mt-2 flex items-center justify-center gap-3 lg:justify-start">
                <h1 className="text-4xl font-black tracking-tight text-slate-950">
                  Kayıt Ol
                </h1>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                  </svg>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Hesabını oluştur; derslerine, TELC denemelerine ve öğrenci
                paneline erişmeye başla.
              </p>
            </div>

            {selectedProduct && (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Seçilen paket
                </p>
                <p className="mt-1 text-base font-black text-slate-900">
                  {getProductLabel(selectedProduct)}
                </p>
              </div>
            )}

            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Ad Soyad
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız ve soyadınız"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Şifre
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={handleRegister}
                className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Kayıt Ol
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Zaten hesabım var
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
);
}