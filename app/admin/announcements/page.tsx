"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Announcement = {
  id?: number;
  title: string;
  description: string;
  type: string;
  show_frequency: string;
  button_text: string;
  button_url: string;
  show_countdown: boolean;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
};

const emptyForm: Announcement = {
  title: "",
  description: "",
  type: "info",
  show_frequency: "once",
  button_text: "",
  button_url: "",
  show_countdown: false,
  is_active: true,
  starts_at: new Date().toISOString().slice(0, 16),
  ends_at: "",
};

export default function AnnouncementsAdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState<Announcement>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }
    setAllowed(true);
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setAnnouncements(data || []);
  }

  async function handleSave() {
    if (!form.title.trim()) { alert("Başlık zorunludur."); return; }
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      show_frequency: form.show_frequency,
      button_text: form.button_text,
      button_url: form.button_url,
      show_countdown: form.show_countdown,
      is_active: form.is_active,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    };
    if (editingId) {
      await supabase.from("announcements").update(payload).eq("id", editingId);
    } else {
      await supabase.from("announcements").insert(payload);
    }
    setSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadAnnouncements();
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu duyuruyu silmek istiyor musunuz?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    loadAnnouncements();
  }

  async function toggleActive(ann: Announcement) {
    await supabase.from("announcements").update({ is_active: !ann.is_active }).eq("id", ann.id!);
    loadAnnouncements();
  }

  function startEdit(ann: Announcement) {
    setForm({
      ...ann,
      starts_at: ann.starts_at ? new Date(ann.starts_at).toISOString().slice(0, 16) : "",
      ends_at: ann.ends_at ? new Date(ann.ends_at).toISOString().slice(0, 16) : "",
    });
    setEditingId(ann.id!);
    setShowForm(true);
  }

  const typeLabels: Record<string, string> = {
    info: "📢 Bilgilendirme",
    campaign: "🎯 Kampanya",
    warning: "⚠️ Uyarı",
    new_course: "🆕 Yeni Kurs",
    system: "🔧 Sistem Duyurusu",
  };

  if (!allowed) return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-yellow-400">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-black">Duyuru Yönetimi</h1>
            <p className="mt-1 text-sm text-slate-400">Tüm kullanıcılara gösterilecek duyuruları yönetin</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/admin")}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black hover:bg-white/10">
              ← Geri
            </button>
            <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
              className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-slate-900 hover:bg-yellow-300">
              + Yeni Duyuru
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-5 text-xl font-black">{editingId ? "Duyuruyu Düzenle" : "Yeni Duyuru Oluştur"}</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-black text-slate-400">BAŞLIK *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Duyuru başlığı" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-black text-slate-400">AÇIKLAMA</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4} className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Duyuru içeriği..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">DUYURU TÜRÜ</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="info">📢 Bilgilendirme</option>
                    <option value="campaign">🎯 Kampanya</option>
                    <option value="warning">⚠️ Uyarı</option>
                    <option value="new_course">🆕 Yeni Kurs</option>
                    <option value="system">🔧 Sistem Duyurusu</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">GÖSTERİM SIKLIĞI</label>
                  <select value={form.show_frequency} onChange={e => setForm(p => ({ ...p, show_frequency: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="once">Yalnızca bir kez göster</option>
                    <option value="every_login">Her girişte göster</option>
                    <option value="until_closed">Kapatana kadar her girişte göster</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">BUTON METNİ (opsiyonel)</label>
                  <input value={form.button_text} onChange={e => setForm(p => ({ ...p, button_text: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Eski Fiyatlardan Kayıt Ol" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">BUTON BAĞLANTISI (opsiyonel)</label>
                  <input value={form.button_url} onChange={e => setForm(p => ({ ...p, button_url: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="https://..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">BAŞLANGIÇ TARİHİ</label>
                  <input type="datetime-local" value={form.starts_at} onChange={e => setForm(p => ({ ...p, starts_at: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black text-slate-400">BİTİŞ TARİHİ</label>
                  <input type="datetime-local" value={form.ends_at} onChange={e => setForm(p => ({ ...p, ends_at: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.show_countdown} onChange={e => setForm(p => ({ ...p, show_countdown: e.target.checked }))}
                    className="h-4 w-4 rounded" />
                  <span className="text-sm font-bold">Geri sayım sayacı göster</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded" />
                  <span className="text-sm font-bold">Aktif</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="rounded-2xl bg-yellow-400 px-6 py-3 text-sm font-black text-slate-900 hover:bg-yellow-300 disabled:opacity-50">
                  {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Oluştur"}
                </button>
                <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}
                  className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-black hover:bg-white/5">
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-slate-400">Henüz duyuru oluşturulmamış.</p>
            </div>
          ) : announcements.map((ann: any) => (
            <div key={ann.id} className={`rounded-2xl border p-5 ${ann.is_active ? "border-yellow-400/30 bg-yellow-400/5" : "border-white/10 bg-white/5 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-yellow-400">{typeLabels[ann.type] || ann.type}</span>
                    {ann.is_active ? <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-400">Aktif</span>
                      : <span className="rounded-full bg-slate-500/20 px-2 py-0.5 text-xs font-black text-slate-400">Pasif</span>}
                    {ann.show_countdown && <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-black text-blue-400">⏱ Geri sayım</span>}
                  </div>
                  <p className="font-black text-white">{ann.title}</p>
                  {ann.description && <p className="mt-1 text-sm text-slate-400 line-clamp-2">{ann.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    {ann.ends_at && <span>Bitiş: {new Date(ann.ends_at).toLocaleString("tr-TR")}</span>}
                    <span>Sıklık: {ann.show_frequency === "once" ? "Bir kez" : ann.show_frequency === "every_login" ? "Her girişte" : "Kapatana kadar"}</span>
                    {ann.button_text && <span>Buton: {ann.button_text}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(ann)}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${ann.is_active ? "bg-slate-700 hover:bg-slate-600" : "bg-emerald-600 hover:bg-emerald-500"}`}>
                    {ann.is_active ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                  <button onClick={() => startEdit(ann)}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black hover:bg-blue-500">Düzenle</button>
                  <button onClick={() => handleDelete(ann.id)}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black hover:bg-red-500">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}