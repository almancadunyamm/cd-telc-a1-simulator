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
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Yetki kontrol ediliyor...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* BAŞLIK */}
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <button
            onClick={() => router.push("/admin")}
            className="mb-4 text-sm font-bold text-slate-400 hover:text-white"
          >
            {"← Admin Paneline Dön"}
          </button>
          <p className="text-xs font-black uppercase tracking-widest text-teal-400">
            Konuşma Kulübü
          </p>
          <h1 className="mt-2 text-3xl font-black">Eşleştirme Merkezi</h1>
          <p className="mt-2 text-sm text-slate-400">
            Partner talep eden öğrencileri eşleştir. Eşleşme sonrası her iki öğrencinin panelinde partner bilgisi görünür.
          </p>
        </header>

        {/* MESAJ */}
        {mesaj && (
          <div className={
            "mb-6 rounded-2xl p-4 text-sm font-bold " +
            (mesaj.startsWith("✅")
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30")
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
                  : "border border-white/20 text-slate-400 hover:text-white")
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-400">
            Yükleniyor...
          </div>
        ) : (
          <div>

            {/* ── BEKLEYEN TALEPLEr ──────────────────────────── */}
            {aktifTab === "bekleyen" && (
              <div>
                {(secilenA || secilenB) && (
                  <div className="mb-6 rounded-3xl border border-teal-500/30 bg-teal-500/10 p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-teal-400 mb-4">
                      Eşleştirme Önizleme
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className={"rounded-2xl p-4 " + (secilenA ? "bg-white/10" : "border-2 border-dashed border-white/20")}>
                        {secilenA ? (
                          <>
                            <p className="font-black text-white">{secilenA.user_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{secilenA.user_email}</p>
                            <p className="text-xs text-teal-400 mt-1">{"📞 " + secilenA.telefon}</p>
                            <p className="text-xs text-slate-400">{"⏰ " + secilenA.musait_saat}</p>
                            <button onClick={() => setSecilenA(null)} className="mt-3 text-xs text-red-400 hover:text-red-300">
                              Kaldır ✕
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500 text-center py-4">1. kişiyi seç</p>
                        )}
                      </div>
                      <div className={"rounded-2xl p-4 " + (secilenB ? "bg-white/10" : "border-2 border-dashed border-white/20")}>
                        {secilenB ? (
                          <>
                            <p className="font-black text-white">{secilenB.user_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{secilenB.user_email}</p>
                            <p className="text-xs text-teal-400 mt-1">{"📞 " + secilenB.telefon}</p>
                            <p className="text-xs text-slate-400">{"⏰ " + secilenB.musait_saat}</p>
                            <button onClick={() => setSecilenB(null)} className="mt-3 text-xs text-red-400 hover:text-red-300">
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
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-4xl mb-4">🎙️</p>
                    <p className="font-black text-white">Bekleyen talep yok</p>
                    <p className="text-sm text-slate-400 mt-2">Öğrenciler partner talep ettiğinde burada görünür.</p>
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
                            "rounded-3xl border p-5 transition " +
                            (isSecili ? "border-teal-400 bg-teal-500/15" : "border-white/10 bg-white/5 hover:bg-white/10")
                          }
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <p className="font-black text-white">{talep.user_name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{talep.user_email}</p>
                            </div>
                            <span className={
                              "rounded-full px-2 py-1 text-xs font-black " +
                              (talep.rol === "konusan" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400")
                            }>
                              {talep.rol === "konusan" ? "🎤 Konuşan" : "👂 Dinleyici"}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs text-slate-400 mb-4">
                            <p>{"📞 " + talep.telefon}</p>
                            <p>{"⏰ " + talep.musait_saat}</p>
                            <p>{"🎯 Tema " + talep.tema_id}</p>
                            <p>{"👥 Tercih: " + (talep.cinsiyet_tercihi === "fark_etmez" ? "Fark etmez" : talep.cinsiyet_tercihi)}</p>
                            {talep.konusma_temasi && (
                              <p className="text-teal-400 font-bold">
                                {"📊 K.Kulübü: Tema " + talep.konusma_temasi + ", Görev " + talep.konusma_gorevi}
                              </p>
                            )}
                            {talep.mevcut_partner && (
                              <p className="text-amber-400 font-bold">{"🤝 Mevcut partner: " + talep.mevcut_partner}</p>
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
                              (isSecili ? "bg-teal-500 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20")
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
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-4xl mb-4">🤝</p>
                    <p className="font-black text-white">Henüz eşleşme yok</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {eslesmeler.map((prog: any, i: number) => (
                      <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-black text-white text-sm">{prog.username}</p>
                            <p className="text-xs text-teal-400 mt-1">{"↔ " + prog.partner_email}</p>
                          </div>
                          <span className="rounded-full bg-teal-500/20 px-2 py-1 text-xs font-black text-teal-400">
                            Eşleşti
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-400 mb-4">
                          <p>{"📊 Tema " + prog.current_tema + ", Görev " + prog.current_gorev}</p>
                          {prog.son_bildirim_tarihi && (
                            <p>{"📅 Son bildirim: " + new Date(prog.son_bildirim_tarihi).toLocaleDateString("tr-TR")}</p>
                          )}
                          {prog.randevuya_uymama_sayisi > 0 && (
                            <p className="text-red-400 font-bold">{"🚫 Uymama: " + prog.randevuya_uymama_sayisi + " kez"}</p>
                          )}
                          {prog.aski_bitis_tarihi && (
                            <p className="text-red-400 font-bold">{"⛔ Askı: " + prog.aski_bitis_tarihi + " kadar"}</p>
                          )}
                          <p className="text-slate-500">{(prog.gorev_tarihleri?.length || 0) + " görev tamamlandı"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEslesmeyiKaldir(prog.username)}
                          className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-black text-red-400 hover:bg-red-500/20"
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
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-4xl mb-4">🔄</p>
                    <p className="font-black text-white">Partner değişiklik talebi yok</p>
                    <p className="text-sm text-slate-400 mt-2">
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
                            ? "border-amber-500/30 bg-amber-500/10"
                            : "border-white/10 bg-white/5 opacity-60")
                        }
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="font-black text-white">{talep.username}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{"Mevcut partner: " + talep.mevcut_partner}</p>
                          </div>
                          <span className={
                            "rounded-full px-3 py-1 text-xs font-black " +
                            (talep.durum === "bekliyor"
                              ? "bg-amber-500/20 text-amber-300"
                              : talep.durum === "onaylandi"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-slate-500/20 text-slate-300")
                          }>
                            {talep.durum === "bekliyor" ? "⏳ Bekliyor" :
                             talep.durum === "onaylandi" ? "✅ Onaylandı" : "❌ Reddedildi"}
                          </span>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-4 mb-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Sebep:</span>
                            <span className={
                              "font-black " +
                              (talep.sebep === "randevuya_uymama" ? "text-red-400" :
                               talep.sebep === "iletisim_yok" ? "text-orange-400" : "text-slate-300")
                            }>
                              {talep.sebep === "randevuya_uymama" ? "🚫 3x Randevuya Uymama" :
                               talep.sebep === "iletisim_yok" ? "📵 3 Gün İletişimsizlik" : talep.sebep}
                            </span>
                          </div>
                          {talep.randevuya_uymama_sayisi > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">İhlal sayısı:</span>
                              <span className="font-black text-red-400">{talep.randevuya_uymama_sayisi + " kez"}</span>
                            </div>
                          )}
                          {talep.iletisim_yok && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">İletişim:</span>
                              <span className="font-black text-orange-400">Hiç iletişim kurmadı</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Tema/Görev:</span>
                            <span className="font-black text-white">
                              {"Tema " + (talep.current_tema || "-") + ", Görev " + (talep.current_gorev || "-")}
                            </span>
                          </div>
                          {talep.aski_bitis_tarihi && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Askı bitiş:</span>
                              <span className="font-black text-red-400">{talep.aski_bitis_tarihi}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Tarih:</span>
                            <span className="text-slate-300">{new Date(talep.created_at).toLocaleDateString("tr-TR")}</span>
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
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-white/30 mb-4 resize-none"
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
                              className="rounded-2xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm font-black text-red-400 hover:bg-red-500/30"
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