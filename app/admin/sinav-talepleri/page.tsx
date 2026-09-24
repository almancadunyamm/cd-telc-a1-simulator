"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SinavTalepleriPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [talepler, setTalepler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [atanacakHoca, setAtanacakHoca] = useState<Record<number, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }
    setAllowed(true);
    loadTalepler();
  }, []);

  async function loadTalepler() {
    setYukleniyor(true);
    const { data } = await supabase
      .from("speaking_sinav_talepleri")
      .select("*")
      .eq("durum", "bekliyor")
      .order("created_at", { ascending: true });
    setTalepler(data || []);
    setYukleniyor(false);
  }

  async function hocaAta(talepId: number, ogrenciEmail: string, hocaEmail: string) {
    if (!hocaEmail.trim()) {
      alert("Hoca emaili boş olamaz.");
      return;
    }

    // Hocanın telefonunu speaking_requests'ten çek
    const { data: hocaReq } = await supabase
      .from("speaking_requests")
      .select("telefon")
      .eq("user_email", hocaEmail.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    await supabase
      .from("speaking_sinav_talepleri")
      .update({ 
        atanan_hoca: hocaEmail.trim(),
        hoca_telefon: hocaReq?.telefon || "",
      })
      .eq("id", talepId);

    alert(`${ogrenciEmail} için sınav hocası atandı: ${hocaEmail}`);
    loadTalepler();
  }

  if (!allowed) return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <a
          href="/admin"
          className="mb-4 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          ← Admin Paneline Dön
        </a>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">Sınav Talepleri</h1>
            <p className="mt-1 text-sm text-slate-500">Sınav hocası talep eden öğrenciler</p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            ← Geri
          </button>
        </div>

        {yukleniyor ? (
          <div className="text-center py-20 text-slate-500">Yükleniyor...</div>
        ) : talepler.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-4xl mb-4">🎓</div>
            <p className="font-black text-slate-900">Bekleyen sınav talebi yok</p>
            <p className="text-sm text-slate-500 mt-2">Öğrenciler sınav talep ettiğinde burada görünecek.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {talepler.map((talep) => (
              <div key={talep.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-black text-slate-900">👤 {talep.username}</p>
                    <p className="text-sm text-yellow-600 mt-1">Tema {talep.sinav_tema_no} Sınavı</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Talep tarihi: {new Date(talep.created_at).toLocaleDateString("tr-TR")}
                    </p>
                    {talep.atanan_hoca && (
                      <p className="text-xs text-emerald-600 mt-1">✅ Atanan hoca: {talep.atanan_hoca}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
                    Bekliyor
                  </span>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Hoca email adresi"
                    value={atanacakHoca[talep.id] || ""}
                    onChange={(e) => setAtanacakHoca(prev => ({ ...prev, [talep.id]: e.target.value }))}
                    className="flex-1 rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={() => hocaAta(talep.id, talep.username, atanacakHoca[talep.id] || "")}
                    className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-black text-slate-900 hover:bg-yellow-400"
                  >
                    Hoca Ata
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}