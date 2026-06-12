"use client";

import { useSearchParams } from "next/navigation";

export default function CertificateVerifyPage() {
  const searchParams = useSearchParams();

  const level = searchParams.get("level") || "A1";
  const name = searchParams.get("name") || "Almanca Okulum Öğrencisi";
  const no = searchParams.get("no") || "AO-000000";
  const date = searchParams.get("date") || new Date().toLocaleDateString("tr-TR");

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
          ✅
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-widest text-emerald-600">
          Geçerli Sertifika
        </p>

        <h1 className="mt-3 text-3xl font-black text-slate-900">
          Goethe {level} Kelime Şampiyonu
        </h1>

        <div className="mt-8 rounded-3xl border bg-slate-50 p-6 text-left">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Öğrenci
          </p>
          <p className="mt-1 text-xl font-black text-slate-900">{name}</p>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">
            Sertifika No
          </p>
          <p className="mt-1 text-sm font-black text-slate-800">{no}</p>

          <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-400">
            Veriliş Tarihi
          </p>
          <p className="mt-1 text-sm font-black text-slate-800">{date}</p>
        </div>

        <p className="mt-8 text-sm leading-6 text-slate-600">
          Bu sertifika, Almanca Okulum Kelime Arenasında ilgili seviyedeki
          12 temanın tamamlandığını gösteren dijital başarı belgesidir.
        </p>

        <p className="mt-6 text-sm font-black text-blue-600">
          www.almancaokulum.com
        </p>
      </section>
    </main>
  );
}