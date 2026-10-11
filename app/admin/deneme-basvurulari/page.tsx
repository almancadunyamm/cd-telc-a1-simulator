"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  source: string | null;
  status: string;
  admin_note: string | null;
};

const STATUSES: { value: string; label: string; className: string }[] = [
  { value: "yeni", label: "Yeni", className: "bg-blue-100 text-blue-700" },
  { value: "arandi", label: "Arandı", className: "bg-amber-100 text-amber-700" },
  { value: "kayit_oldu", label: "Kayıt oldu", className: "bg-emerald-100 text-emerald-700" },
  { value: "ilgilenmiyor", label: "İlgilenmiyor", className: "bg-slate-200 text-slate-600" },
];

function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "90" + digits.slice(1);
  else if (digits.length === 10 && digits.startsWith("5")) digits = "90" + digits;
  return digits;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return value;
  }
}

export default function AdminTrialLeadsPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mock_logged_user");
      const user = raw ? JSON.parse(raw) : null;
      if (!user || user.role !== "admin") {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  useEffect(() => {
    if (!allowed) return;
    async function load() {
      const { data, error: loadError } = await supabase
        .from("trial_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (loadError) {
        setError(
          "Başvurular okunamadı. trial_leads tablosu henüz oluşturulmamış olabilir (docs/sql/2026-10-11-deneme-dersi.sql). Hata: " +
            loadError.message
        );
      } else {
        setLeads((data || []) as Lead[]);
      }
      setLoading(false);
    }
    load();
  }, [allowed]);

  const counts = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: leads.length,
      today: leads.filter((lead) => new Date(lead.created_at).toDateString() === today).length,
      fresh: leads.filter((lead) => lead.status === "yeni").length,
      enrolled: leads.filter((lead) => lead.status === "kayit_oldu").length,
    };
  }, [leads]);

  const visibleLeads = filter === "all" ? leads : leads.filter((lead) => lead.status === filter);

  async function updateLead(id: string, patch: Partial<Pick<Lead, "status" | "admin_note">>) {
    const previous = leads;
    setLeads((list) => list.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
    const { error: updateError } = await supabase.from("trial_leads").update(patch).eq("id", id);
    if (updateError) {
      setLeads(previous);
      alert("Güncellenemedi: " + updateError.message);
    }
  }

  if (!allowed) {
    return <main className="min-h-screen bg-slate-100 p-6 text-slate-900">Yetki kontrol ediliyor...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="text-sm font-bold text-blue-700 hover:underline">
          ← Admin Paneli
        </a>
        <div className="mt-3 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Ücretsiz Deneme Dersi</p>
          <h1 className="mt-1 text-3xl font-black">Deneme Başvuruları</h1>
          <p className="mt-2 text-sm text-slate-600">
            /deneme-dersi sayfasında adını ve telefonunu bırakanlar. Reklam linkine{" "}
            <code className="rounded bg-slate-100 px-1">?utm_source=instagram</code> eklerseniz kaynak sütununda görünür.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Toplam", counts.total],
              ["Bugün", counts.today],
              ["Aranmadı", counts.fresh],
              ["Kayıt oldu", counts.enrolled],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs font-bold text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[{ value: "all", label: "Tümü" }, ...STATUSES].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  filter === item.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 rounded-2xl bg-amber-100 p-4 text-sm font-bold text-amber-900">{error}</p>}

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">Yükleniyor...</p>
          ) : visibleLeads.length === 0 && !error ? (
            <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">Bu filtrede başvuru yok.</p>
          ) : (
            visibleLeads.map((lead) => {
              const wa = whatsappNumber(lead.phone);
              const message = encodeURIComponent(
                `Merhaba ${lead.name.split(" ")[0]}, Almanca Okulum'dan yazıyorum. Ücretsiz deneme dersimizi incelediniz, canlı kursla ilgili sorularınızı yanıtlamak isterim.`
              );
              return (
                <div key={lead.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black">{lead.name}</p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {lead.phone} · {formatDate(lead.created_at)}
                        {lead.source ? ` · ${lead.source}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:+${wa}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                      >
                        📞 Ara
                      </a>
                      <a
                        href={`https://wa.me/${wa}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-white hover:bg-emerald-600"
                      >
                        WhatsApp
                      </a>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                        className={`rounded-xl px-3 py-2 text-xs font-black ${
                          STATUSES.find((item) => item.value === lead.status)?.className || "bg-slate-100"
                        }`}
                      >
                        {STATUSES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <input
                    defaultValue={lead.admin_note || ""}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value !== (lead.admin_note || "")) updateLead(lead.id, { admin_note: value });
                    }}
                    placeholder="Not ekle (örn. A1 akşam grubunu soruyor)"
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
