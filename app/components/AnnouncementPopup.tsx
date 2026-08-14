"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Announcement = {
  id: number;
  title: string;
  description: string;
  type: string;
  show_frequency: string;
  button_text: string;
  button_url: string;
  show_countdown: boolean;
  is_active: boolean;
  ends_at: string | null;
};

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Süre doldu"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")} Saat ${String(m).padStart(2, "0")} Dakika ${String(s).padStart(2, "0")} Saniye`);
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className="mt-3 rounded-xl bg-red-600/20 border border-red-400/30 px-4 py-3 text-center">
      <p className="text-xs font-black text-red-400 uppercase tracking-wider mb-1">Kalan Süre</p>
      <p className="text-lg font-black text-white">{timeLeft}</p>
    </div>
  );
}

const typeIcons: Record<string, string> = {
  info: "📢",
  campaign: "🎯",
  warning: "⚠️",
  new_course: "🆕",
  system: "🔧",
};

const typeColors: Record<string, string> = {
  info: "from-blue-600 to-blue-800",
  campaign: "from-orange-500 to-red-600",
  warning: "from-yellow-500 to-orange-600",
  new_course: "from-emerald-500 to-teal-600",
  system: "from-slate-600 to-slate-800",
};

export default function AnnouncementPopup({ userEmail }: { userEmail: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    loadAnnouncements();
  }, [userEmail]);

  async function loadAnnouncements() {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) return;

    const { data: views } = await supabase
      .from("announcement_views")
      .select("announcement_id")
      .eq("user_email", userEmail);

    const viewedIds = new Set((views || []).map((v: any) => v.announcement_id));

    const toShow = data.filter((ann: Announcement) => {
      if (ann.show_frequency === "every_login") return true;
      if (ann.show_frequency === "once" && viewedIds.has(ann.id)) return false;
      if (ann.show_frequency === "until_closed" && viewedIds.has(ann.id)) return false;
      return true;
    });

    if (toShow.length === 0) return;
    setAnnouncements(toShow);
    setCurrentIndex(0);
    setVisible(true);
  }

  async function handleClose() {
    const ann = announcements[currentIndex];
    if (ann && ann.show_frequency !== "every_login") {
      await supabase.from("announcement_views").upsert({
        announcement_id: ann.id,
        user_email: userEmail,
      }, { onConflict: "announcement_id,user_email" });
    }
    if (currentIndex + 1 < announcements.length) {
      setCurrentIndex(i => i + 1);
    } else {
      setVisible(false);
    }
  }

  if (!visible || announcements.length === 0) return null;

  const ann = announcements[currentIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className={`bg-gradient-to-br ${typeColors[ann.type] || typeColors.info} px-6 py-5`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeIcons[ann.type] || "📢"}</span>
              <p className="text-xs font-black uppercase tracking-widest text-white/70">
                {ann.type === "campaign" ? "Kampanya" : ann.type === "warning" ? "Uyarı" : ann.type === "new_course" ? "Yeni Kurs" : ann.type === "system" ? "Sistem" : "Duyuru"}
              </p>
            </div>
            <button onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 font-black text-lg">
              ✕
            </button>
          </div>
          <h2 className="mt-3 text-xl font-black text-white leading-tight">{ann.title}</h2>
          {ann.show_countdown && ann.ends_at && <Countdown endsAt={ann.ends_at} />}
        </div>

        <div className="bg-white px-6 py-5">
          {ann.description && (
            <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">{ann.description}</p>
          )}

          <div className="mt-5 flex flex-col gap-3">
            {ann.button_text && ann.button_url && (
              <a href={ann.button_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-black text-white shadow-lg hover:opacity-90">
                {ann.button_text}
              </a>
            )}
            <button onClick={handleClose}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
              Kapat
            </button>
          </div>

          {announcements.length > 1 && (
            <p className="mt-3 text-center text-xs text-slate-400">{currentIndex + 1} / {announcements.length}</p>
          )}
        </div>
      </div>
    </div>
  );
}