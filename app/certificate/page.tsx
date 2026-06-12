"use client";

import { useSearchParams } from "next/navigation";

export default function CertificatePage() {
  const searchParams = useSearchParams();

  const level = searchParams.get("level") || "A1";
  const name = searchParams.get("name") || "Almanca Okulum Öğrencisi";
  const today = new Date().toLocaleDateString("tr-TR");
const certificateNo = `AO-${level}-${Date.now().toString().slice(-6)}`;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border-8 border-yellow-400 bg-white p-10 text-center shadow-2xl">
        <div className="absolute right-8 top-8 rounded-full bg-yellow-400 px-5 py-3 text-sm font-black text-slate-900 shadow-lg">
  🏆 ŞAMPİYON
</div>

<div className="absolute left-8 top-8 text-left">
  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
    Sertifika No
  </p>
  <p className="text-sm font-black text-slate-700">{certificateNo}</p>
</div>
        <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">
          Almanca Okulum
        </p>

        <h1 className="mt-6 text-4xl font-black text-slate-900">
          Goethe {level} Kelime Şampiyonu
        </h1>

        <p className="mt-8 text-lg text-slate-500">
          Bu sertifika,
        </p>

        <h2 className="mt-4 text-5xl font-black text-yellow-600">
          {name}
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-700">
          isimli öğrencinin Almanca Okulum {level} Kelime Arenasındaki
          12 temanın tamamını başarıyla tamamlayarak Goethe {level} Kelime
          Şampiyonu unvanını almaya hak kazandığını belgelemek amacıyla
          verilmiştir.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl bg-slate-50 p-8 text-slate-700 border">
  <p className="text-lg font-semibold leading-8">
    Başarı, disiplinli çalışmanın sonucudur.
  </p>

  <p className="mt-4 text-base leading-8">
    Bu sertifika, Almanca Okulum Kelime Arenasında gösterilen
    azim ve kararlılığın bir göstergesidir.
  </p>
</div>

        <div className="mt-10 flex items-center justify-center gap-10 text-sm font-bold text-slate-500">
  <div>
    <p className="text-xs uppercase tracking-widest">Tarih</p>
    <p className="mt-1 text-slate-800">{today}</p>
  </div>

  <div>
    <p className="text-xs uppercase tracking-widest">Seviye</p>
    <p className="mt-1 text-slate-800">Goethe {level}</p>
  </div>
</div>
        <div className="mt-10 border-t pt-6">
          <p className="text-lg font-black text-slate-900">
            www.almancaokulum.com
          </p>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-500">
            TELC • Goethe • ÖSD Hazırlık Platformu
          </p>
        </div>
      </section>
    </main>
  );
}