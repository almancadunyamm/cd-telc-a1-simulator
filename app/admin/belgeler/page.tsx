"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatVerifyCode } from "@/lib/documents/config";

type Doc = {
  id: string;
  document_no: string;
  verify_code: string;
  username: string;
  full_name: string;
  level: string;
  language: string;
  course_type: string;
  status: string;
  source: string;
  amount: number;
  issued_at: string | null;
  created_at: string;
  revoke_reason: string | null;
};

const SECRET_KEY = "admin_document_secret";
const inputCls =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#058D9E] focus:ring-2 focus:ring-[#058D9E]/20";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  issued: { text: "Geçerli", cls: "bg-emerald-100 text-emerald-800" },
  revoked: { text: "İptal", cls: "bg-red-100 text-red-700" },
  pending_payment: { text: "Ödeme bekliyor", cls: "bg-amber-100 text-amber-800" },
};

export default function AdminBelgelerPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [secret, setSecret] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("");

  // form
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [language, setLanguage] = useState<"tr" | "de">("tr");
  const [level, setLevel] = useState("A1");
  const [courseType, setCourseType] = useState<"live" | "digital">("live");
  const [courseStart, setCourseStart] = useState("");
  const [busy, setBusy] = useState(false);
  const [lookupInfo, setLookupInfo] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("mock_logged_user") || "null");
      if (!user || user.role !== "admin") {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }
    try {
      const saved = sessionStorage.getItem(SECRET_KEY);
      if (saved) setSecret(saved);
    } catch {}
    setReady(true);
  }, [router]);

  async function call(action: string, extra: Record<string, unknown> = {}, useSecret = secret) {
    const res = await fetch("/api/admin/belge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminSecret: useSecret, action, ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setSecret("");
      try {
        sessionStorage.removeItem(SECRET_KEY);
      } catch {}
    }
    return data;
  }

  async function loadList(useSecret = secret) {
    setError("");
    const data = await call("list", {}, useSecret);
    if (data.status === "success") setDocs(data.documents);
    else setError(data.reason || "Liste alınamadı.");
    return data.status === "success";
  }

  useEffect(() => {
    if (ready && secret) loadList(secret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, secret]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    const ok = await loadList(secretInput);
    if (ok) {
      setSecret(secretInput);
      try {
        sessionStorage.setItem(SECRET_KEY, secretInput);
      } catch {}
    }
  }

  async function lookup() {
    setLookupInfo("");
    setError("");
    if (!username.trim()) return;
    const data = await call("lookup", { username });
    if (data.status !== "success") {
      setLookupInfo(data.reason || "Öğrenci bulunamadı.");
      return;
    }
    if (data.user?.name && !fullName) setFullName(data.user.name);
    const levels = data.eligibility?.levels || [];
    const first = levels.find((l: any) => l.active) || levels[0];
    if (first) {
      setLevel(first.level);
      setCourseType(first.courseType);
      setCourseStart(first.courseStart);
      setLookupInfo(
        `Bulundu: ${levels.map((l: any) => `${l.level} ${l.courseType === "live" ? "canlı" : "dijital"} (başlangıç ${l.courseStart}${l.active ? "" : ", süresi dolmuş"})`).join(" · ")}`
      );
    } else {
      setLookupInfo("Öğrenci bulundu ama ücretli/canlı kurs siparişi yok. Kurs bilgilerini elle girin.");
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const data = await call("create", { username, fullName, birthDate, birthPlace, language, level, courseType, courseStart });
    setBusy(false);
    if (data.status !== "success") {
      setError(data.reason || "Belge oluşturulamadı.");
      return;
    }
    setNotice(`${data.document.document_no} oluşturuldu.`);
    await download(data.document.id);
    setFullName("");
    setBirthDate("");
    setBirthPlace("");
    setUsername("");
    setLookupInfo("");
    loadList();
  }

  async function download(id: string) {
    const res = await fetch("/api/belge/indir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminSecret: secret, id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.reason || "İndirilemedi.");
      return;
    }
    const blob = await res.blob();
    const name = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] || "belge.pdf";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function revoke(d: Doc) {
    const reason = window.prompt(`${d.document_no} (${d.full_name}) iptal edilsin mi? İptal nedeni (isteğe bağlı):`, "");
    if (reason === null) return;
    const data = await call("revoke", { id: d.id, reason });
    if (data.status === "success") {
      setNotice(`${d.document_no} iptal edildi. Karekod artık "iptal edilmiş" gösterecek.`);
      loadList();
    } else setError(data.reason || "İptal edilemedi.");
  }

  if (!ready) return null;

  if (!secret) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <form onSubmit={unlock} className="mx-auto max-w-sm rounded-3xl bg-white p-6 shadow">
          <Link href="/admin" className="text-xs font-bold text-slate-500">← Admin paneli</Link>
          <h1 className="mt-3 text-xl font-black text-slate-900">Öğrenci Belgeleri</h1>
          <p className="mt-1 text-sm text-slate-500">Güvenlik için Vercel'de tanımlı admin belge şifresini girin.</p>
          <input type="password" className={inputCls} value={secretInput} onChange={(e) => setSecretInput(e.target.value)} required autoFocus />
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <button type="submit" className="mt-4 w-full rounded-2xl bg-[#0F274E] py-3 text-sm font-black text-white">Giriş</button>
        </form>
      </main>
    );
  }

  const q = filter.trim().toLowerCase();
  const shown = (docs || []).filter(
    (d) => !q || [d.document_no, d.full_name, d.username, d.verify_code].some((v) => String(v || "").toLowerCase().includes(q))
  );
  const paidCount = (docs || []).filter((d) => d.source === "paid" && d.status !== "pending_payment").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-xs font-bold text-slate-500">← Admin paneli</Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Öğrenci Belgeleri</h1>
            <p className="text-sm text-slate-500">
              Toplam {docs?.length ?? 0} kayıt · ücretli {paidCount}
            </p>
          </div>
          <Link href="/belge-dogrula" target="_blank" className="text-sm font-bold text-[#058D9E]">Doğrulama sayfası ↗</Link>
        </div>

        {notice && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <form onSubmit={create} className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">Ücretsiz belge oluştur</h2>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-slate-700">Öğrenci e-postası</span>
              <div className="flex gap-2">
                <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ogrenci@mail.com (isteğe bağlı)" />
                <button type="button" onClick={lookup} className="mt-1 shrink-0 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 hover:bg-slate-200">Getir</button>
              </div>
              <span className="mt-1 block text-xs text-slate-400">Yazarsanız belge öğrencinin panelinde de görünür ve kurs bilgileri otomatik dolar.</span>
              {lookupInfo && <span className="mt-1 block text-xs font-semibold text-slate-600">{lookupInfo}</span>}
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-bold text-slate-700">Adı Soyadı</span>
              <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Doğum Tarihi</span>
                <input type="date" className={inputCls} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Doğum Yeri</span>
                <input className={inputCls} value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} required />
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Dil</span>
                <select className={inputCls} value={language} onChange={(e) => setLanguage(e.target.value as "tr" | "de")}>
                  <option value="tr">Türkçe</option>
                  <option value="de">Almanca</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Seviye</span>
                <select className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option>A1</option>
                  <option>A2</option>
                  <option>B1</option>
                </select>
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Eğitim şekli</span>
                <select className={inputCls} value={courseType} onChange={(e) => setCourseType(e.target.value as "live" | "digital")}>
                  <option value="live">Canlı (haftalık 9 saat)</option>
                  <option value="digital">Dijital</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Kurs başlangıcı</span>
                <input type="date" className={inputCls} value={courseStart} onChange={(e) => setCourseStart(e.target.value)} required />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-400">Bitiş tarihi otomatik: başlangıç + 3 ay.</p>
            <button type="submit" disabled={busy} className="mt-4 w-full rounded-2xl bg-[#0F274E] py-3 text-sm font-black text-white disabled:opacity-60">
              {busy ? "Oluşturuluyor…" : "Belgeyi Oluştur ve İndir"}
            </button>
          </form>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <input className={inputCls} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Ara: belge no, ad, e-posta, kod" />
            {docs === null ? (
              <p className="mt-4 text-sm text-slate-500">Yükleniyor…</p>
            ) : shown.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">Kayıt yok.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-2">Belge</th>
                      <th>Öğrenci</th>
                      <th>Kurs</th>
                      <th>Kaynak</th>
                      <th>Durum</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shown.map((d) => {
                      const st = STATUS_LABEL[d.status] || { text: d.status, cls: "bg-slate-100 text-slate-600" };
                      return (
                        <tr key={d.id} className="align-top">
                          <td className="py-3">
                            <p className="font-black text-slate-900">{d.document_no}</p>
                            <p className="font-mono text-[11px] text-slate-400">{formatVerifyCode(d.verify_code)}</p>
                            <p className="text-[11px] text-slate-400">{new Date(d.issued_at || d.created_at).toLocaleDateString("tr-TR")}</p>
                          </td>
                          <td className="py-3">
                            <p className="font-semibold text-slate-800">{d.full_name}</p>
                            <p className="text-xs text-slate-500">{d.username || "—"}</p>
                          </td>
                          <td className="py-3 text-xs text-slate-600">
                            {d.level} · {d.course_type === "live" ? "Canlı" : "Dijital"} · {d.language === "de" ? "DE" : "TR"}
                          </td>
                          <td className="py-3 text-xs text-slate-600">{d.source === "admin" ? "Admin (ücretsiz)" : `Ücretli ${(d.amount / 100).toLocaleString("tr-TR")} TL`}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${st.cls}`}>{st.text}</span>
                            {d.revoke_reason && <p className="mt-1 text-[11px] text-slate-400">{d.revoke_reason}</p>}
                          </td>
                          <td className="py-3 text-right">
                            {(d.status === "issued" || d.status === "revoked") && (
                              <button type="button" onClick={() => download(d.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-200">
                                PDF
                              </button>
                            )}
                            {d.status === "issued" && (
                              <button type="button" onClick={() => revoke(d)} className="ml-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-black text-red-700 hover:bg-red-100">
                                İptal
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
