import type { Metadata } from "next";
import Link from "next/link";
import { formatDateDot, formatVerifyCode, normalizeVerifyCode } from "@/lib/documents/config";
import { getServiceSupabase, isDocumentSystemConfigured, toIstanbulDate } from "@/lib/documents/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Belge Doğrulama | Almanca Okulum",
  robots: { index: false, follow: false },
};

type Row = {
  document_no: string;
  full_name: string;
  birth_date: string;
  language: string;
  level: string;
  course_type: string;
  course_start: string;
  course_end: string;
  status: string;
  issued_at: string | null;
  revoked_at: string | null;
};

async function findDocument(code: string): Promise<Row | null | "unavailable"> {
  if (!isDocumentSystemConfigured()) return "unavailable";
  if (code.length !== 12) return null;
  const { data, error } = await getServiceSupabase()
    .from("student_documents")
    .select("document_no, full_name, birth_date, language, level, course_type, course_start, course_end, status, issued_at, revoked_at")
    .eq("verify_code", code)
    .in("status", ["issued", "revoked"])
    .maybeSingle();
  if (error) {
    console.error("[belge-dogrula]", error);
    return "unavailable";
  }
  return (data as Row) || null;
}

// Doğum tarihi KVKK gereği kısmen gizlenir: **.**.1995
function maskBirthDate(iso: string) {
  return `**.**.${String(iso).slice(0, 4)}`;
}

function Detail({ tr, de, value }: { tr: string; de: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {tr} <span className="font-semibold normal-case tracking-normal text-slate-400">/ {de}</span>
      </dt>
      <dd className="text-[15px] font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export default async function BelgeDogrulaPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const code = normalizeVerifyCode(decodeURIComponent(kod || ""));
  const result = await findDocument(code);
  const checkedAt = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const doc = result && result !== "unavailable" ? result : null;
  const valid = doc?.status === "issued";
  const revoked = doc?.status === "revoked";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-2xl">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <p className="text-2xl font-black tracking-tight text-[#0F274E]">
              ALMANCA <span className="text-[#058D9E]">OKULUM</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Çevrim içi Almanca kursları
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">Belge Doğrulama</p>
            <p className="text-xs font-semibold text-slate-500">Dokumentenprüfung</p>
          </div>
        </header>

        {result === "unavailable" && (
          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-lg font-black text-amber-900">Doğrulama şu an yapılamıyor</p>
            <p className="mt-1 text-sm text-amber-800">Lütfen biraz sonra tekrar deneyin. / Bitte versuchen Sie es später erneut.</p>
          </div>
        )}

        {result === null && (
          <div className="mt-8 rounded-3xl border border-slate-300 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">?</div>
            <h1 className="mt-4 text-xl font-black text-slate-900">Belge bulunamadı</h1>
            <p className="text-sm font-semibold text-slate-500">Dokument nicht gefunden</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">
              <span className="font-mono font-bold">{formatVerifyCode(code) || "—"}</span> koduyla düzenlenmiş geçerli bir
              belge kaydı yok. Kodu kontrol edin; belge üzerindeki bilgiler bu kayıtla doğrulanamıyorsa belge geçerli kabul
              edilmemelidir.
            </p>
            <Link href="/belge-dogrula" className="mt-6 inline-block rounded-2xl bg-[#0F274E] px-5 py-2.5 text-sm font-black text-white">
              Başka kod dene
            </Link>
          </div>
        )}

        {doc && (
          <>
            <div
              className={`mt-8 flex items-center gap-4 rounded-3xl border p-6 ${
                valid ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
              }`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-black text-white ${
                  valid ? "bg-emerald-600" : "bg-red-600"
                }`}
                aria-hidden
              >
                {valid ? "✓" : "✕"}
              </div>
              <div>
                <h1 className={`text-xl font-black ${valid ? "text-emerald-900" : "text-red-900"}`}>
                  {valid ? "Bu belge geçerlidir" : "Bu belge iptal edilmiştir"}
                </h1>
                <p className={`text-sm font-semibold ${valid ? "text-emerald-800" : "text-red-800"}`}>
                  {valid ? "Dieses Dokument ist gültig und wurde von Almanca Okulum ausgestellt." : "Dieses Dokument wurde widerrufen und ist ungültig."}
                </p>
                {revoked && doc.revoked_at && (
                  <p className="mt-1 text-xs text-red-700">İptal tarihi / Widerrufen am: {formatDateDot(toIstanbulDate(doc.revoked_at))}</p>
                )}
              </div>
            </div>

            <dl className="mt-6 rounded-3xl border border-slate-200 bg-white px-6 py-2 shadow-sm">
              <Detail tr="Belge türü" de="Dokumentart" value="Kursiyer Belgesi / Kursbescheinigung" />
              <Detail tr="Belge no" de="Dokumentnummer" value={doc.document_no} />
              <Detail tr="Adı soyadı" de="Name" value={doc.full_name} />
              <Detail tr="Doğum tarihi" de="Geburtsdatum" value={maskBirthDate(doc.birth_date)} />
              <Detail tr="Kurs" de="Kurs" value="Genel Almanca / Allgemeiner Deutschkurs" />
              <Detail tr="Seviye" de="Niveau" value={doc.level} />
              <Detail
                tr="Eğitim şekli"
                de="Unterrichtsform"
                value={doc.course_type === "live" ? "Canlı çevrim içi ders / Live-Online-Unterricht" : "Çevrim içi dijital kurs / Digitaler Online-Kurs"}
              />
              <Detail
                tr="Kurs dönemi"
                de="Kurszeitraum"
                value={`${formatDateDot(doc.course_start)} – ${formatDateDot(doc.course_end)}`}
              />
              <Detail
                tr="Düzenlenme tarihi"
                de="Ausstellungsdatum"
                value={doc.issued_at ? formatDateDot(toIstanbulDate(doc.issued_at)) : "—"}
              />
              <Detail tr="Doğrulama kodu" de="Prüfcode" value={formatVerifyCode(code)} />
            </dl>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 text-xs leading-5 text-slate-600">
              <p>
                Belge üzerindeki bilgiler bu sayfadakilerle birebir aynı olmalıdır. Adres çubuğunda{" "}
                <strong>almancaokulum.com</strong> yazdığından emin olun. Bu belge bir dil yeterlilik veya sınav başarı
                belgesi değildir.
              </p>
              <p className="mt-2 text-slate-500">
                Die Angaben auf dem Dokument müssen mit dieser Seite übereinstimmen. Kein Sprachzertifikat und kein
                Prüfungsnachweis.
              </p>
            </div>
          </>
        )}

        <footer className="mt-8 text-center text-xs text-slate-500">
          <p>Sorgulama zamanı / Abfragezeit: {checkedAt}</p>
          <p className="mt-1">
            Almanca Okulum · info@almancaokulum.com · +90 542 695 44 19
          </p>
        </footer>
      </section>
    </main>
  );
}
