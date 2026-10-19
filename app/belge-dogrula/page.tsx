import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { normalizeVerifyCode } from "@/lib/documents/config";

export const metadata: Metadata = {
  title: "Belge Doğrulama | Almanca Okulum",
  description: "Almanca Okulum tarafından düzenlenen kursiyer belgelerinin doğruluğunu kontrol edin.",
  robots: { index: false, follow: false },
};

export default async function BelgeDogrulaFormPage({
  searchParams,
}: {
  searchParams: Promise<{ kod?: string; hata?: string }>;
}) {
  const { kod, hata } = await searchParams;
  const code = normalizeVerifyCode(kod || "");
  if (code.length === 12) redirect(`/belge-dogrula/${code}`);
  const showError = Boolean(kod) || hata === "1";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="text-2xl font-black tracking-tight text-[#0F274E]">
            ALMANCA <span className="text-[#058D9E]">OKULUM</span>
          </p>
          <h1 className="mt-6 text-2xl font-black text-slate-900">Belge Doğrulama</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Dokumentenprüfung</p>
        </div>

        <form method="GET" action="/belge-dogrula" className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="kod" className="block text-sm font-bold text-slate-700">
            Doğrulama kodu <span className="font-normal text-slate-400">/ Prüfcode</span>
          </label>
          <input
            id="kod"
            name="kod"
            required
            autoComplete="off"
            placeholder="XXXX-XXXX-XXXX"
            defaultValue={kod || ""}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-center font-mono text-lg font-bold uppercase tracking-widest text-slate-900 outline-none focus:border-[#058D9E] focus:ring-2 focus:ring-[#058D9E]/20"
          />
          {showError && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              Kod 12 karakter olmalıdır (ör. K7MP-4QX9-TR2H).
            </p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-[#0F274E] px-6 py-3 text-sm font-black text-white hover:bg-[#16366b]"
          >
            Doğrula / Prüfen
          </button>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Kod, belgenin sağ alt köşesindeki karekodun altında yazar. Karekodu telefonunuzla okutarak da bu sayfaya
            ulaşabilirsiniz.
          </p>
        </form>
      </section>
    </main>
  );
}
