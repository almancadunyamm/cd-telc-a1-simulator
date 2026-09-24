"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PartnerDegisiklikTalebi = {
  id: string;
  username: string;
  level: string;
  mevcut_partner: string;
  sebep: string;
  randevuya_uymama_sayisi: number;
  iletisim_yok: boolean;
  durum: string;
  admin_notu: string;
  created_at: string;
  current_tema: number;
  current_gorev: number;
  toplam_ihlal: number;
  aski_bitis_tarihi: string;
};

type Talep = {
  id: string;
  user_email: string;
  user_name: string;
  tema_id: number;
  rol: string;
  cinsiyet_tercihi: string;
  musait_saat: string;
  telefon: string;
  durum: string;
  created_at: string;
  konusma_temasi?: number;
  konusma_gorevi?: number;
  mevcut_partner?: string;
};

export default function SpeakingMatchesPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [talepler, setTalepler] = useState<Talep[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [secilenA, setSecilenA] = useState<Talep | null>(null);
  const [secilenB, setSecilenB] = useState<Talep | null>(null);
  const [eslestiriliyor, setEslestiriliyor] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [aktifTab, setAktifTab] = useState<"bekleyen" | "eslesmis" | "degisiklik">("bekleyen");
  const [degisiklikTalepleri, setDegisiklikTalepleri] = useState<PartnerDegisiklikTalebi[]>([]);
  const [eslesmeler, setEslesmeler] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }
    setAllowed(true);
    loadData();
  }, [router]);

  async function loadData() {
    setYukleniyor(true);

    const { data: talepData } = await supabase
      .from("speaking_requests")
      .select("*")
      .eq("durum", "bekliyor")
      .order("created_at", { ascending: true });

    const { data: progressData } = await supabase
      .from("speaking_progress")
      .select("*");

    const birlesik = (talepData || []).map((t: any) => {
      const prog = (progressData || []).find(
        (p: any) => p.username === t.user_email && p.level === "A1"
      );
      return {
        ...t,
        konusma_temasi: prog?.current_tema || null,
        konusma_gorevi: prog?.current_gorev || null,
        mevcut_partner: prog?.partner_email || null,
      };
    });

    setTalepler(birlesik);

    const { data: eslesmisData } = await supabase
      .from("speaking_progress")
      .select("*")
      .not("partner_email", "is", null)
      .order("updated_at", { ascending: false });

    setEslesmeler(eslesmisData || []);

    const { data: degisiklikData } = await supabase
      .from("v_partner_degisiklik_talepleri")
      .select("*")
      .order("created_at", { ascending: false });

    setDegisiklikTalepleri(degisiklikData || []);
    setYukleniyor(false);
  }

  async function handleEslestir() {
    if (!secilenA || !secilenB) return;
    setEslestiriliyor(true);
    setMesaj("");

    try {
      const { data: progA } = await supabase
        .from("speaking_progress")
        .select("*")
        .eq("username", secilenA.user_email)
        .eq("level", "A1")
        .maybeSingle();

      const { data: progB } = await supabase
        .from("speaking_progress")
        .select("*")
        .eq("username", secilenB.user_email)
        .eq("level", "A1")
        .maybeSingle();

      if (!progA) {
        await supabase.from("speaking_progress").insert({
          username: secilenA.user_email,
          level: "A1",
          current_tema: 1,
          current_gorev: 1,
          partner_email: secilenB.user_email,
          gorev_tarihleri: [],
          esleme_tarihi: new Date().toISOString().slice(0, 10),
        });
      } else {
        await supabase
          .from("speaking_progress")
          .update({
            partner_email: secilenB.user_email,
            esleme_tarihi: new Date().toISOString().slice(0, 10),
          })
          .eq("id", progA.id);
      }

      if (!progB) {
        await supabase.from("speaking_progress").insert({
          username: secilenB.user_email,
          level: "A1",
          current_tema: 1,
          current_gorev: 1,
          partner_email: secilenA.user_email,
          gorev_tarihleri: [],
          esleme_tarihi: new Date().toISOString().slice(0, 10),
        });
      } else {
        await supabase
          .from("speaking_progress")
          .update({
            partner_email: secilenA.user_email,
            esleme_tarihi: new Date().toISOString().slice(0, 10),
          })
          .eq("id", progB.id);
      }

      await supabase.from("speaking_matches").insert({
        konusan_email: secilenA.user_email,
        dinleyen_email: secilenB.user_email,
        tema_id: secilenA.tema_id || 1,
        durum: "bekliyor",
      });

      await supabase
        .from("speaking_requests")
        .update({ durum: "eslesti" })
        .in("id", [secilenA.id, secilenB.id]);

      setMesaj("✅ " + secilenA.user_name + " ↔ " + secilenB.user_name + " başarıyla eşleştirildi!");
      setSecilenA(null);
      setSecilenB(null);
      await loadData();
    } catch (err: any) {
      setMesaj("❌ Hata: " + err.message);
    }

    setEslestiriliyor(false);
  }

  async function handleEslesmeyiKaldir(username: string) {
    if (!confirm(username + " kişisinin partneri kaldırılsın mı?")) return;
    await supabase
      .from("speaking_progress")
      .update({ partner_email: null })
      .eq("username", username);
    await loadData();
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
        Yetki kontrol ediliyor...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* BAŞLIK */}
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={() => router.push("/admin")}
            className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-900"
          >
            {"← Admin Paneline Dön"}
          </button>
          <p className="text-xs font-black uppercase tracking-widest text-teal-600">
            Konuşma Kulübü
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Eşleştirme Merkezi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Partner talep eden öğrencileri eşleştir. Eşleşme sonrası her iki öğrencinin panelinde partner bilgisi görünür.
          </p>
        </header>

        {/* MESAJ */}
        {mesaj && (
          <div className={
            "mb-6 rounded-2xl p-4 text-sm font-bold " +
            (mesaj.startsWith("✅")
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "bg-red-50 text-red-700 border border-red-200")
          }>
            {mesaj}
          </div>
        )}

        {/* TAB MENÜ */}
        <div className="mb-6 flex flex-wrap gap-3">
          {([
            ["bekleyen", "⏳ Bekleyen Talepler"],
            ["eslesmis", "🤝 Mevcut Eşleşmeler"],
            ["degisiklik", "🔄 Partner Değişiklik"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setAktifTab(key)}
              className={
                "rounded-full px-5 py-2 text-sm font-black transition " +
                (aktifTab === key
                  ? "bg-teal-500 text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50")
              }
            >
              {label}
              {key === "bekleyen" && talepler.length > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {talepler.length}
                </span>
              )}
              {key === "degisiklik" && degisiklikTalepleri.filter(t => t.durum === "bekliyor").length > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                  {degisiklikTalepleri.filter(t => t.durum === "bekliyor").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {yukleniyor ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            Yükleniyor...
          </div>
        ) : (
          <div>

            {/* ── BEKLEYEN TALEPLEr ──────────────────────────── */}
            {aktifTab === "bekleyen" && (
              <div>
                {(secilenA || secilenB) && (
                  <div className="mb-6 rounded-3xl border border-teal-200 bg-teal-50 p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-teal-600 mb-4">
                      Eşleştirme Önizleme
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className={"rounded-2xl p-4 " + (secilenA ? "bg-white" : "border-2 border-dashed border-slate-300")}>
                        {secilenA ? (
                          <>
                            <p className="font-black text-slate-900">{secilenA.user_name}</p>
                            <p className="text-xs text-slate-500 mt-1">{secilenA.user_email}</p>
                            <p className="text-xs text-teal-600 mt-1">{"📞 " + secilenA.telefon}</p>
                            <p className="text-xs text-slate-500">{"⏰ " + secilenA.musait_saat}</p>
                            <button onClick={() => setSecilenA(null)} className="mt-3 text-xs text-red-600 hover:text-red-700">
                              Kaldır ✕
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 text-center py-4">1. kişiyi seç</p>
                        )}
                      </div>
                      <div className={"rounded-2xl p-4 " + (secilenB ? "bg-white" : "border-2 border-dashed border-slate-300")}>
                        {secilenB ? (
                          <>
                            <p className="font-black text-slate-900">{secilenB.user_name}</p>
                            <p className="text-xs text-slate-500 mt-1">{secilenB.user_email}</p>
                            <p className="text-xs text-teal-600 mt-1">{"📞 " + secilenB.telefon}</p>
                            <p className="text-xs text-slate-500">{"⏰ " + secilenB.musait_saat}</p>
                            <button onClick={() => setSecilenB(null)} className="mt-3 text-xs text-red-600 hover:text-red-700">
                              Kaldır ✕
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 text-center py-4">2. kişiyi seç</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!secilenA || !secilenB || eslestiriliyor}
                      onClick={handleEslestir}
                      className="mt-5 w-full rounded-2xl bg-teal-500 px-5 py-4 text-sm font-black text-white hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {eslestiriliyor ? "Eşleştiriliyor..." : "🤝 Bu İki Kişiyi Eşleştir"}
                    </button>
                  </div>
                )}

                {talepler.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-4xl mb-4">🎙️</p>
                    <p className="font-black text-slate-900">Bekleyen talep yok</p>
                    <p className="text-sm text-slate-500 mt-2">Öğrenciler partner talep ettiğinde burada görünür.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {talepler.map((talep) => {
                      const isSecilenA = secilenA?.id === talep.id;
                      const isSecilenB = secilenB?.id === talep.id;
                      const isSecili = isSecilenA || isSecilenB;
                      return (
                        <div
                          key={talep.id}
                          className={
                            "rounded-3xl border p-5 shadow-sm transition " +
                            (isSecili ? "border-teal-400 bg-teal-50" : "border-slate-200 bg-white hover:bg-slate-50")
                          }
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <p className="font-black text-slate-900">{talep.user_name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{talep.user_email}</p>
                            </div>
                            <span className={
                              "rounded-full px-2 py-1 text-xs font-black " +
                              (talep.rol === "konusan" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")
                            }>
                              {talep.rol === "konusan" ? "🎤 Konuşan" : "👂 Dinleyici"}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-slate-500 mb-4">
                            <p>{"📞 " + talep.telefon}</p>
                            <p>{"⏰ " + talep.musait_saat}</p>
                            <p>{"🎯 Tema " + talep.tema_id}</p>
                            <p>{"👥 Tercih: " + (talep.cinsiyet_tercihi === "fark_etmez" ? "Fark etmez" : talep.cinsiyet_tercihi)}</p>
                            {talep.konusma_temasi && (
                              <p className="text-teal-600 font-bold">
                                {"📊 K.Kulübü: Tema " + talep.konusma_temasi + ", Görev " + talep.konusma_gorevi}
                              </p>
                            )}
                            {talep.mevcut_partner && (
                              <p className="text-amber-600 font-bold">{"🤝 Mevcut partner: " + talep.mevcut_partner}</p>
                            )}
                            <p className="text-slate-500">{new Date(talep.created_at).toLocaleDateString("tr-TR")}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (isSecilenA) { setSecilenA(null); return; }
                              if (isSecilenB) { setSecilenB(null); return; }
                              if (!secilenA) { setSecilenA(talep); return; }
                              if (!secilenB) { setSecilenB(talep); return; }
                            }}
                            className={
                              "w-full rounded-2xl py-2 text-sm font-black transition " +
                              (isSecili ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                            }
                          >
                            {isSecilenA ? "✓ 1. Kişi Seçildi" :
                             isSecilenB ? "✓ 2. Kişi Seçildi" :
                             !secilenA ? "1. Kişi Olarak Seç" : "2. Kişi Olarak Seç"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── MEVCUT EŞLEŞMELEr ─────────────────────────── */}
            {aktifTab === "eslesmis" && (
              <div>
                {eslesmeler.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-4xl mb-4">🤝</p>
                    <p className="font-black text-slate-900">Henüz eşleşme yok</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {eslesmeler.map((prog: any, i: number) => (
                      <div key={i} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-black text-slate-900 text-sm">{prog.username}</p>
                            <p className="text-xs text-teal-600 mt-1">{"↔ " + prog.partner_email}</p>
                          </div>
                          <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-black text-teal-700">
                            Eşleşti
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-500 mb-4">
                          <p>{"📊 Tema " + prog.current_tema + ", Görev " + prog.current_gorev}</p>
                          {prog.son_bildirim_tarihi && (
                            <p>{"📅 Son bildirim: " + new Date(prog.son_bildirim_tarihi).toLocaleDateString("tr-TR")}</p>
                          )}
                          {prog.randevuya_uymama_sayisi > 0 && (
                            <p className="text-red-600 font-bold">{"🚫 Uymama: " + prog.randevuya_uymama_sayisi + " kez"}</p>
                          )}
                          {prog.aski_bitis_tarihi && (
                            <p className="text-red-600 font-bold">{"⛔ Askı: " + prog.aski_bitis_tarihi + " kadar"}</p>
                          )}
                          <p className="text-slate-500">{(prog.gorev_tarihleri?.length || 0) + " görev tamamlandı"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEslesmeyiKaldir(prog.username)}
                          className="w-full rounded-2xl border border-red-200 bg-red-50 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                        >
                          Eşleşmeyi Kaldır
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PARTNER DEĞİŞİKLİK TALEPLERİ ────────────── */}
            {aktifTab === "degisiklik" && (
              <div>
                {degisiklikTalepleri.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-4xl mb-4">🔄</p>
                    <p className="font-black text-slate-900">Partner değişiklik talebi yok</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Öğrenciler koşulları sağladığında otomatik talep oluşur.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {degisiklikTalepleri.map((talep) => (
                      <div
                        key={talep.id}
                        className={
                          "rounded-3xl border p-5 " +
                          (talep.durum === "bekliyor"
                            ? "border-amber-200 bg-amber-50"
                            : "border-slate-200 bg-white opacity-70 shadow-sm")
                        }
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="font-black text-slate-900">{talep.username}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{"Mevcut partner: " + talep.mevcut_partner}</p>
                          </div>
                          <span className={
                            "rounded-full px-3 py-1 text-xs font-black " +
                            (talep.durum === "bekliyor"
                              ? "bg-amber-100 text-amber-700"
                              : talep.durum === "onaylandi"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600")
                          }>
                            {talep.durum === "bekliyor" ? "⏳ Bekliyor" :
                             talep.durum === "onaylandi" ? "✅ Onaylandı" : "❌ Reddedildi"}
                          </span>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 mb-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Sebep:</span>
                            <span className={
                              "font-black " +
                              (talep.sebep === "randevuya_uymama" ? "text-red-600" :
                               talep.sebep === "iletisim_yok" ? "text-orange-600" : "text-slate-600")
                            }>
                              {talep.sebep === "randevuya_uymama" ? "🚫 3x Randevuya Uymama" :
                               talep.sebep === "iletisim_yok" ? "📵 3 Gün İletişimsizlik" : talep.sebep}
                            </span>
                          </div>
                          {talep.randevuya_uymama_sayisi > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">İhlal sayısı:</span>
                              <span className="font-black text-red-600">{talep.randevuya_uymama_sayisi + " kez"}</span>
                            </div>
                          )}
                          {talep.iletisim_yok && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">İletişim:</span>
                              <span className="font-black text-orange-600">Hiç iletişim kurmadı</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Tema/Görev:</span>
                            <span className="font-black text-slate-900">
                              {"Tema " + (talep.current_tema || "-") + ", Görev " + (talep.current_gorev || "-")}
                            </span>
                          </div>
                          {talep.aski_bitis_tarihi && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">Askı bitiş:</span>
                              <span className="font-black text-red-600">{talep.aski_bitis_tarihi}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Tarih:</span>
                            <span className="text-slate-600">{new Date(talep.created_at).toLocaleDateString("tr-TR")}</span>
                          </div>
                        </div>

                        <textarea
                          placeholder="Admin notu ekle..."
                          defaultValue={talep.admin_notu || ""}
                          onBlur={async (e) => {
                            await supabase
                              .from("speaking_partner_requests")
                              .update({ admin_notu: e.target.value })
                              .eq("id", talep.id);
                          }}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 mb-4 resize-none"
                          rows={2}
                        />

                        {talep.durum === "bekliyor" && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm(talep.username + " kişisinin partner değişikliği onaylansın mı?")) return;

                                await supabase
                                  .from("speaking_partner_requests")
                                  .update({ durum: "onaylandi", updated_at: new Date().toISOString() })
                                  .eq("id", talep.id);

                                await supabase
                                  .from("speaking_progress")
                                  .update({
                                    partner_email: null,
                                    partner_degisiklik_hakki: false,
                                    randevuya_uymama_sayisi: 0,
                                  })
                                  .eq("username", talep.username)
                                  .eq("level", talep.level);

                                await supabase
                                  .from("speaking_progress")
                                  .update({ partner_email: null })
                                  .eq("username", talep.mevcut_partner)
                                  .eq("level", talep.level);

                                setMesaj("✅ Partner değişikliği onaylandı. Her iki öğrencinin partneri kaldırıldı.");
                                await loadData();
                              }}
                              className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
                            >
                              {"✅ Onayla"}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await supabase
                                  .from("speaking_partner_requests")
                                  .update({ durum: "reddedildi", updated_at: new Date().toISOString() })
                                  .eq("id", talep.id);

                                setMesaj("❌ Talep reddedildi.");
                                await loadData();
                              }}
                              className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-100"
                            >
                              {"❌ Reddet"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}