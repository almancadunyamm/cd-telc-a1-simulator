"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!email || !password) {
      alert("Email ve şifre zorunlu.");
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ADMIN
    if (normalizedEmail === "admin@test.com" && password === "123456") {
      localStorage.setItem(
        "mock_logged_user",
        JSON.stringify({
          username: "admin",
          role: "admin",
          label: "Admin",
        })
      );

      router.push("/admin");
      return;
    }

    // TEACHER
    const rawTeachers = localStorage.getItem("admin_teachers");
    const teachers = rawTeachers ? JSON.parse(rawTeachers) : [];

    const teacher = teachers.find((t: any) => {
  const teacherEmail = String(t.email || "")
    .trim()
    .toLowerCase();

  const teacherPassword = String(t.password || "").trim();

  return teacherEmail === normalizedEmail && teacherPassword === password.trim();
});

    if (teacher) {
      localStorage.setItem(
        "mock_logged_user",
        JSON.stringify({
          username: teacher.email,
          role: "teacher",
          label: teacher.name,
          name: teacher.name,
          teacherId: String(teacher.teacherId || teacher.email || "")
  .trim()
  .toLowerCase(),
        })
      );

      router.push("/teacher");
      return;
    }

    // STUDENT - sadece kayıtlı öğrenci girebilir
    const rawUsers = localStorage.getItem("users");
const users = rawUsers ? JSON.parse(rawUsers) : [];

const foundStudent = users.find(
  (u: any) =>
    (u.email?.toLowerCase() === normalizedEmail ||
      u.username?.toLowerCase() === normalizedEmail) &&
    u.password === password.trim()
);

    if (!foundStudent) {
      alert("Kayıt bulunamadı. Lütfen önce kayıt olun veya bilgilerinizi kontrol edin.");
      return;
    }

    const isAdminEmail = normalizedEmail === "almancadunyamm@gmail.com";

localStorage.setItem(
  "mock_logged_user",
  JSON.stringify({
    username: foundStudent.email || foundStudent.username || normalizedEmail,
    role: isAdminEmail ? "admin" : foundStudent.role || "student",
    label: foundStudent.name || foundStudent.email || normalizedEmail,
    name: foundStudent.name,
  })
);

    const pendingSlug =
      localStorage.getItem("pending_payment_slug") ||
      localStorage.getItem("selected_product_slug") ||
      localStorage.getItem("selectedProductSlug");

    if (pendingSlug) {
  localStorage.setItem("pending_payment_slug", pendingSlug);
}

router.push("/dashboard");
  }
return (
  <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 px-4 py-8">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1fr_0.95fr]">
        {/* SOL SOFT MARKA ALANI */}
        <section className="hidden bg-slate-50 lg:block">
  <div className="flex h-full flex-col">
    
    {/* ÜST GÖRSEL */}
    <div className="relative h-[45%] overflow-hidden">
      <img
        src="/images/login-students.png"
        alt="TELC öğrencileri"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>

    {/* ALT İÇERİK */}
    <div className="flex flex-1 flex-col justify-between p-10">
      <div>
        <p className="inline-flex rounded-full bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700">
          Premium TELC Hazırlık Platformu
        </p>

        <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950">
          TELC sınavına profesyonel şekilde hazırlan.
        </h1>

        <p className="mt-5 text-base leading-8 text-slate-600">
          Dijital denemeler, canlı dersler, performans analizi ve modern
          çalışma sistemiyle Almanca öğrenme sürecini daha düzenli ve verimli hale getir.
        </p>

      </div>

      {/* ALT İSTATİSTİK */}
      <div className="mt-8 flex items-center gap-2">
  {[
    {
      title: "%100 TELC Uyumlu",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      ),
    },

    {
      title: "Akıllı Takip",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
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
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
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
      <div className="text-blue-600">
        {item.icon}
      </div>

      <span>{item.title}</span>
    </div>
  ))}
</div>
    </div>
  </div>
</section>

        {/* SAĞ GİRİŞ FORMU */}
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
                Öğrenci Paneli
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                <div className="flex items-center gap-3">
  <h1 className="text-4xl font-black tracking-tight text-slate-950">
    Tekrar hoş geldin
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
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Hesabına giriş yaparak derslerine, sınavlarına ve çalışma
                planına ulaşabilirsin.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Email
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">
                  Şifre
                </label>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Giriş Yap
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
  <p className="font-bold text-slate-900">
    Henüz öğrenci hesabın yok mu?
  </p>

  <p className="mt-1 text-slate-600">
    Sana uygun paketi seçerek hemen kayıt oluşturabilirsin.
  </p>

  <a
    href="/"
    className="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
  >
    Paketleri İncele
  </a>
</div>
            <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-black">Bugün ne yapabilirsin?</p>
              <p className="mt-1 leading-6">
                Yeni bir konu öğren, bir deneme çöz veya konuşma ödevini öğretmenine gönder.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-500 lg:justify-start">
              <span>Güvenli giriş</span>
              <span>•</span>
              <span>Canlı ders</span>
              <span>•</span>
              <span>Dijital TELC hazırlık</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
);
}