"use client";

import { useSearchParams } from "next/navigation";

export default function CertificatePage() {
  const searchParams = useSearchParams();

  const level = searchParams.get("level") || "A1";
  const name = searchParams.get("name") || "Almanca Okulum Öğrencisi";

  const today = new Date().toLocaleDateString("tr-TR");
  const certificateNo = `AO-${level}-${Date.now().toString().slice(-6)}`;

  const verifyUrl = `https://almancaokulum.com/certificate?level=${encodeURIComponent(
    level
  )}&name=${encodeURIComponent(name)}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    verifyUrl
  )}`;

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border-[10px] border-yellow-400 bg-white px-10 py-8 text-center shadow-2xl">
        <div className="absolute inset-4 rounded-[24px] border border-yellow-200" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6">
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
                Almanca Okulum
              </p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                TELC • Goethe • ÖSD Hazırlık Platformu
              </p>
              <p className="mt-1 text-sm font-black text-slate-900">
                www.almancaokulum.com
              </p>
            </div>

            <div className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-black text-slate-900 shadow-lg">
              🏆 ŞAMPİYON
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">
              Başarı Sertifikası
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-950">
              Goethe {level} Kelime Şampiyonu
            </h1>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Bu sertifika
            </p>

            <h2 className="mt-2 text-5xl font-black tracking-tight text-yellow-600">
              {name}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-700">
              isimli öğrencinin Almanca Okulum {level} Kelime Arenasındaki
              12 temanın tamamını başarıyla tamamlayarak Goethe {level} Kelime
              Şampiyonu unvanını almaya hak kazandığını belgelemek amacıyla
              verilmiştir.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm font-bold leading-6 text-slate-700">
              Başarı, disiplinli çalışmanın sonucudur. Bu sertifika, Almanca
              Okulum Kelime Arenasında gösterilen azim ve kararlılığın bir
              göstergesidir.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 items-end gap-6">
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Sertifika No
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {certificateNo}
              </p>

              <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Tarih
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">{today}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-px w-52 bg-slate-300" />
              <p className="mt-2 text-sm font-black text-slate-900">
                Almanca Okulum
              </p>
              <p className="text-xs font-bold text-slate-500">
                Dijital Başarı Onayı
              </p>
            </div>

            <div className="flex flex-col items-end">
              <img
                src={qrUrl}
                alt="Sertifika doğrulama QR kodu"
                className="h-[110px] w-[110px] rounded-xl border bg-white p-2"
              />
              <p className="mt-2 text-right text-[11px] font-bold leading-4 text-slate-500">
                QR kodu okutarak
                <br />
                sertifikayı doğrula
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="relative z-10 mt-6 flex justify-center gap-3 print:hidden">
  <button
    type="button"
    onClick={() => window.print()}
    className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-slate-800"
  >
    📥 PDF Olarak İndir
  </button>
</div>
    </main>
  );
}