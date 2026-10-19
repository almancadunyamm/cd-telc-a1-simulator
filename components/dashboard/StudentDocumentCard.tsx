"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STUDENT_DOCUMENT_PRICE_TL, formatDateDot } from "@/lib/documents/config";

type LevelInfo = { level: "A1" | "A2" | "B1"; courseType: "live" | "digital"; courseStart: string; courseEnd: string; active: boolean };
type Eligibility = {
  status: "success" | "unavailable" | "error";
  eligible?: boolean;
  reason?: string;
  levels?: LevelInfo[];
  price?: number;
};
type DocSummary = { id: string; documentNo: string; level: string; language: string; status: string; issuedAt: string | null; createdAt: string };

type Props = {
  username: string;
  onUpgrade: () => void;
};

type Phase = "form" | "paying" | "waiting" | "done" | "fail";

async function downloadPdf(body: Record<string, unknown>): Promise<string | null> {
  const res = await fetch("/api/belge/indir", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return data.reason || "Belge indirilemedi.";
  }
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const name = disposition.match(/filename="([^"]+)"/)?.[1] || "ogrenci-belgesi.pdf";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return null;
}

export default function StudentDocumentCard({ username, onUpgrade }: Props) {
  const [elig, setElig] = useState<Eligibility | null>(null);
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    fetch("/api/belge/uygunluk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((r) => r.json())
      .then((d) => !cancelled && setElig(d))
      .catch(() => !cancelled && setElig({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Sistem henüz yapılandırılmadıysa (veya hata varsa) kart hiç görünmez.
  if (!elig || elig.status !== "success") return null;

  const price = (elig.price || STUDENT_DOCUMENT_PRICE_TL).toLocaleString("tr-TR");
  const activeLevels = (elig.levels || []).filter((l) => l.active);

  return (
    <div className="mt-6 rounded-3xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F274E] text-2xl">📄</div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Öğrenci Belgesi</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Kursa kayıtlı olduğunu ve derslere devam ettiğini gösteren, karekodla doğrulanabilir resmi belge.
              Türkçe veya Almanca alabilirsin.
            </p>
            {elig.eligible ? (
              <p className="mt-1 text-xs font-bold text-slate-500">Ücret: {price} TL · Ödeme sonrası hemen PDF olarak indirilir.</p>
            ) : elig.reason === "starter_only" || elig.reason === "no_package" ? (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                Öğrenci belgesi Başlangıç paketinde verilmiyor. Gelişim, Zirve veya Canlı Kurs paketine geçerek belge
                alabilirsin.
              </p>
            ) : (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                Erişim süren sona erdiği için şu an belge alınamıyor. Yardım için bizimle iletişime geç.
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {elig.eligible ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-2xl bg-[#0F274E] px-5 py-3 text-sm font-black text-white hover:bg-[#16366b]"
            >
              Öğrenci Belgesi Al
            </button>
          ) : elig.reason === "starter_only" || elig.reason === "no_package" ? (
            <button
              type="button"
              onClick={onUpgrade}
              className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400"
            >
              Paketleri İncele
            </button>
          ) : null}
          {(elig.levels || []).length > 0 && (
            <button
              type="button"
              onClick={() => setListOpen(true)}
              className="text-xs font-bold text-[#058D9E] underline-offset-2 hover:underline"
            >
              Aldığım belgeler
            </button>
          )}
        </div>
      </div>

      {open && <RequestModal username={username} levels={activeLevels} price={price} onClose={() => setOpen(false)} />}
      {listOpen && <MyDocumentsModal username={username} onClose={() => setListOpen(false)} />}
    </div>
  );
}

function ModalShell({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className={`relative w-full ${wide ? "max-w-lg" : "max-w-md"} overflow-hidden rounded-[2rem] bg-white shadow-2xl`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          aria-label="Kapat"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#058D9E] focus:ring-2 focus:ring-[#058D9E]/20";

function RequestModal({ username, levels, price, onClose }: { username: string; levels: LevelInfo[]; price: string; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("form");
  const [level, setLevel] = useState(levels[0]?.level || "A1");
  const [language, setLanguage] = useState<"tr" | "de">("tr");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [merchantOid, setMerchantOid] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = levels.find((l) => l.level === level);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!confirm) {
      setError("Lütfen bilgilerin doğru olduğunu onaylayın.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/belge/talep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, level, language, fullName, birthDate, birthPlace }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.status === "success" && data.token) {
        setToken(data.token);
        setMerchantOid(data.merchantOid);
        setPhase("paying");
      } else {
        setError(data.reason || "Ödeme başlatılamadı.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  }

  // Ödeme onayını (PayTR bildirimi) bekle, belge hazır olunca indir.
  const waitForDocument = useCallback(
    (attempt = 0) => {
      fetch("/api/belge/listem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((r) => r.json())
        .then(async (data) => {
          const docs: DocSummary[] = data.documents || [];
          const ready = docs.find((d) => d.status === "issued" && d.level === level && d.language === language && Date.now() - new Date(d.createdAt).getTime() < 60 * 60 * 1000);
          if (ready) {
            setDocId(ready.id);
            setPhase("done");
            const err = await downloadPdf({ username, password, id: ready.id });
            if (err) setError(err);
            return;
          }
          if (attempt < 20) pollRef.current = setTimeout(() => waitForDocument(attempt + 1), 3000);
          else setError("Ödemen alındı ancak onay biraz gecikti. Birkaç dakika sonra \"Aldığım belgeler\" bölümünden indirebilirsin.");
        })
        .catch(() => {
          if (attempt < 20) pollRef.current = setTimeout(() => waitForDocument(attempt + 1), 3000);
        });
    },
    [username, password, level, language]
  );

  useEffect(() => {
    if (phase !== "paying") return;
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "paytr-payment-result") return;
      if (merchantOid && e.data.oid && e.data.oid !== merchantOid) return;
      if (e.data.status === "success") {
        setPhase("waiting");
        waitForDocument(0);
      } else {
        setPhase("fail");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [phase, merchantOid, waitForDocument]);

  useEffect(() => () => {
    if (pollRef.current) clearTimeout(pollRef.current);
  }, []);

  if (phase === "paying" && token) {
    return (
      <ModalShell onClose={onClose} wide>
        <iframe src={`https://www.paytr.com/odeme/guvenli/${token}`} className="h-[600px] w-full border-0" title="PayTR Ödeme" />
      </ModalShell>
    );
  }

  if (phase === "waiting" || phase === "done") {
    return (
      <ModalShell onClose={onClose}>
        <div className="px-8 py-14 text-center">
          {phase === "waiting" ? (
            <>
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <h2 className="mt-5 text-lg font-black text-slate-900">Ödemen alındı</h2>
              <p className="mt-2 text-sm text-slate-600">Belgen hazırlanıyor, birkaç saniye içinde inecek…</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
              <h2 className="mt-4 text-lg font-black text-slate-900">Belgen hazır</h2>
              <p className="mt-2 text-sm text-slate-600">PDF indirildi. Tekrar indirmek için aşağıdaki butonu kullanabilirsin.</p>
              {docId && (
                <button
                  type="button"
                  onClick={async () => setError((await downloadPdf({ username, password, id: docId })) || "")}
                  className="mt-5 rounded-2xl bg-[#0F274E] px-6 py-3 text-sm font-black text-white hover:bg-[#16366b]"
                >
                  PDF'i Tekrar İndir
                </button>
              )}
            </>
          )}
          {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
        </div>
      </ModalShell>
    );
  }

  if (phase === "fail") {
    return (
      <ModalShell onClose={onClose}>
        <div className="px-8 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
          <h2 className="mt-4 text-lg font-black text-slate-900">Ödeme tamamlanamadı</h2>
          <p className="mt-2 text-sm text-slate-600">Kartından tutar çekilmedi. Tekrar deneyebilirsin.</p>
          <button type="button" onClick={() => setPhase("form")} className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white">
            Tekrar Dene
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose} wide>
      <form onSubmit={submit} className="px-6 pb-6 pt-7 sm:px-8">
        <h2 className="pr-10 text-xl font-black text-slate-900">Öğrenci Belgesi Talebi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Bilgilerini kimlik belgendeki gibi yaz. Ödemeden sonra değiştirilemez.
        </p>

        <div className="mt-5 grid gap-4">
          {levels.length > 1 && (
            <div>
              <span className="text-sm font-bold text-slate-700">Seviye</span>
              <div className="mt-1 flex gap-2">
                {levels.map((l) => (
                  <button
                    key={l.level}
                    type="button"
                    onClick={() => setLevel(l.level)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-black ${level === l.level ? "border-[#0F274E] bg-[#0F274E] text-white" : "border-slate-300 text-slate-700"}`}
                  >
                    {l.level}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-sm font-bold text-slate-700">Belge dili</span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {([
                ["tr", "Türkçe", "Kursiyer Belgesi"],
                ["de", "Almanca", "Kursbescheinigung"],
              ] as const).map(([code, label, sub]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`rounded-xl border px-3 py-2 text-left ${language === code ? "border-[#058D9E] bg-[#058D9E]/10 ring-2 ring-[#058D9E]/30" : "border-slate-300"}`}
                >
                  <span className="block text-sm font-black text-slate-900">{label}</span>
                  <span className="block text-xs text-slate-500">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Adı Soyadı</span>
            <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80} autoComplete="name" />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Doğum Tarihi</span>
              <input type="date" className={inputCls} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Doğum Yeri</span>
              <input className={inputCls} value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} required maxLength={60} placeholder="ör. İstanbul" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Hesap şifren</span>
            <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            <span className="mt-1 block text-xs text-slate-400">Belgen kişisel bilgiler içerdiği için güvenlik amacıyla istenir.</span>
          </label>

          {selected && (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              <strong className="text-slate-800">Belgede yazacak kurs bilgisi:</strong> {selected.level} ·{" "}
              {selected.courseType === "live" ? "Canlı çevrim içi ders (haftalık 9 ders saati)" : "Çevrim içi dijital kurs"} ·{" "}
              {formatDateDot(selected.courseStart)} – {formatDateDot(selected.courseEnd)}
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
            <span>Bilgilerimin doğru olduğunu, ödeme sonrası değiştirilemeyeceğini ve her yeni belgenin ayrıca ücretlendirildiğini kabul ediyorum.</span>
          </label>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-2xl bg-[#0F274E] px-6 py-3.5 text-sm font-black text-white hover:bg-[#16366b] disabled:opacity-60"
        >
          {busy ? "Hazırlanıyor…" : `Ödemeye Geç · ${price} TL`}
        </button>
      </form>
    </ModalShell>
  );
}

function MyDocumentsModal({ username, onClose }: { username: string; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [docs, setDocs] = useState<DocSummary[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/belge/listem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.status === "success") setDocs(data.documents || []);
      else setError(data.reason || "Belgeler alınamadı.");
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell onClose={onClose} wide>
      <div className="px-6 pb-6 pt-7 sm:px-8">
        <h2 className="pr-10 text-xl font-black text-slate-900">Aldığım Belgeler</h2>
        {docs === null ? (
          <form onSubmit={load} className="mt-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Hesap şifren</span>
              <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </label>
            <button type="submit" disabled={busy} className="mt-4 w-full rounded-2xl bg-[#0F274E] px-6 py-3 text-sm font-black text-white disabled:opacity-60">
              {busy ? "Yükleniyor…" : "Belgelerimi Göster"}
            </button>
          </form>
        ) : docs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Henüz belgen yok.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-black text-slate-900">
                    {d.documentNo} · {d.level} · {d.language === "de" ? "Almanca" : "Türkçe"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {d.status === "issued" && d.issuedAt ? `Düzenlenme: ${new Date(d.issuedAt).toLocaleDateString("tr-TR")}` : null}
                    {d.status === "pending_payment" ? "Ödeme onayı bekleniyor" : null}
                    {d.status === "revoked" ? "İptal edildi" : null}
                  </p>
                </div>
                {d.status === "issued" && (
                  <button
                    type="button"
                    onClick={async () => setError((await downloadPdf({ username, password, id: d.id })) || "")}
                    className="shrink-0 rounded-xl bg-[#058D9E] px-4 py-2 text-xs font-black text-white hover:bg-[#047a89]"
                  >
                    PDF İndir
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
      </div>
    </ModalShell>
  );
}
