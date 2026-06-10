"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  currentUsername: string;
  currentUserName: string;
  mainClassId: string;
  classes: { id: string; name: string; teacherName: string }[];
  hasAnyLiveCourseOrder: boolean;
};

type StudentRow = {
  username: string;
  name: string;
  masteryThemes: number;
  speakingTema: number;
  score: number;
  masteryBadge: string;
  speakingBadge: string;
  isMe: boolean;
};

function getMasteryBadge(themes: number) {
  if (themes >= 12) return "🏆 TELC Şampiyonu";
  if (themes >= 9) return "⭐ Süper Usta";
  if (themes >= 6) return "💪 Kelime Ustası";
  if (themes >= 3) return "🎯 Tema Avcısı";
  if (themes >= 1) return "🚀 Başlangıç";
  return "😴 Başlamadı";
}

function getSpeakingBadge(tema: number) {
  if (tema >= 12) return "🏆 Konuşma Şampiyonu";
  if (tema >= 9) return "🥇 Altın";
  if (tema >= 6) return "🥈 Gümüş";
  if (tema >= 3) return "🥉 Bronz";
  if (tema >= 1) return "🎤 Aday";
  return "—";
}

export default function ClassLeagueTab({
  currentUsername,
  currentUserName,
  mainClassId,
  classes,
  hasAnyLiveCourseOrder,
}: Props) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const myClass = classes.find((c) => c.id === mainClassId);

  useEffect(() => {
    if (!mainClassId) return;
    loadLeague();
  }, [mainClassId]);

  async function loadLeague() {
    setLoading(true);

    // 1. Aynı sınıftaki tüm öğrencileri getir
    const { data: classmates } = await supabase
      .from("student_class_access")
      .select("username")
      .eq("main_class_id", mainClassId);

    if (!classmates || classmates.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const usernames = classmates.map((c: any) =>
      String(c.username || "").trim().toLowerCase()
    );

    // 2. İsimleri getir
    const { data: usersData } = await supabase
      .from("users")
      .select("email, name")
      .in("email", usernames);

    const nameMap: Record<string, string> = {};
    (usersData || []).forEach((u: any) => {
      nameMap[u.email?.toLowerCase()] = u.name || u.email;
    });

    // 3. Ustalık verisi
    const { data: masteryData } = await supabase
      .from("mastery_progress")
      .select("username, theme_id")
      .in("username", usernames)
      .eq("level", "A1")
      .eq("status", "completed");

    const masteryMap: Record<string, Set<number>> = {};
    (masteryData || []).forEach((m: any) => {
      const key = String(m.username || "").toLowerCase();
      if (!masteryMap[key]) masteryMap[key] = new Set();
      masteryMap[key].add(m.theme_id);
    });

    // 4. Konuşma verisi
    const { data: speakingData } = await supabase
      .from("speaking_progress")
      .select("username, current_tema")
      .in("username", usernames)
      .eq("level", "A1");

    const speakingMap: Record<string, number> = {};
    (speakingData || []).forEach((s: any) => {
      speakingMap[String(s.username || "").toLowerCase()] = s.current_tema || 0;
    });

    // 5. Birleştir ve skorla
    const rows: StudentRow[] = usernames.map((username) => {
      const masteryThemes = masteryMap[username]?.size || 0;
      const speakingTema = speakingMap[username] || 0;
      const score = masteryThemes * 10 + speakingTema * 8;

      return {
        username,
        name: nameMap[username] || username.split("@")[0],
        masteryThemes,
        speakingTema,
        score,
        masteryBadge: getMasteryBadge(masteryThemes),
        speakingBadge: getSpeakingBadge(speakingTema),
        isMe: username === currentUsername?.toLowerCase(),
      };
    });

    // 6. Sırala
    rows.sort((a, b) => b.score - a.score);

    setStudents(rows);
    setLastUpdated(new Date());
    setLoading(false);
  }

  if (!hasAnyLiveCourseOrder) return null;

  const maxScore = students[0]?.score || 1;
  const myRank = students.findIndex((s) => s.isMe) + 1;
  const myData = students.find((s) => s.isMe);

  return (
    <section className="mb-8">
      {/* Başlık */}
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/80">
              Sınıf Ligi ⚡
            </p>
            <h2 className="mt-1 text-2xl font-black">
              {myClass?.name || "Sınıfım"}
            </h2>
            {myClass?.teacherName && (
              <p className="mt-1 text-sm text-white/80">
                👨‍🏫 {myClass.teacherName}
              </p>
            )}
          </div>
          {myData && (
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur">
              <p className="text-3xl font-black">#{myRank}</p>
              <p className="text-xs font-bold text-white/80">Sıran</p>
            </div>
          )}
        </div>

        {myData && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xl font-black">{myData.score}</p>
              <p className="text-xs text-white/80">Puan</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xl font-black">{myData.masteryThemes}/12</p>
              <p className="text-xs text-white/80">Ustalık</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xl font-black">{myData.speakingTema}</p>
              <p className="text-xs text-white/80">Konuşma</p>
            </div>
          </div>
        )}
      </div>

      {/* Liste */}
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">
            {students.length} Öğrenci
          </h3>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-xs text-slate-400">
                {lastUpdated.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} güncellendi
              </p>
            )}
            <button
              onClick={loadLeague}
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-200 transition-all"
            >
              🔄 Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
          </div>
        ) : students.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            Sınıf verileri yükleniyor...
          </p>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => {
              const pct = maxScore > 0 ? Math.round((student.score / maxScore) * 100) : 0;
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
              const isInactive = student.score === 0;

              return (
                <div
                  key={student.username}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    student.isMe
                      ? "border-orange-300 bg-orange-50 shadow-md"
                      : isInactive
                      ? "border-slate-100 bg-slate-50 opacity-60"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Sıra */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      index < 3
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {medal || (index + 1)}
                    </div>

                    {/* İsim + rozetler */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-black truncate ${student.isMe ? "text-orange-700" : "text-slate-900"}`}>
                          {student.isMe ? `${student.name} (Sen)` : student.name}
                        </p>
                        {isInactive && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-600">
                            😴 Başlamadı
                          </span>
                        )}
                      </div>

                      {/* İlerleme çubuğu */}
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            student.isMe
                              ? "bg-gradient-to-r from-orange-400 to-red-400"
                              : isInactive
                              ? "bg-slate-300"
                              : "bg-gradient-to-r from-yellow-400 to-orange-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Rozetler */}
                      {!isInactive && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                            {student.masteryBadge}
                          </span>
                          {student.speakingTema > 0 && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                              {student.speakingBadge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Puan */}
                    <div className="shrink-0 text-right">
                      <p className={`text-lg font-black ${student.isMe ? "text-orange-600" : "text-slate-700"}`}>
                        {student.score}
                      </p>
                      <p className="text-xs text-slate-400">puan</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Puan açıklaması */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Puan Sistemi</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>🏆 Ustalık Testi: tema × 10 puan</div>
            <div>🎙️ Konuşma Kulübü: tema × 8 puan</div>
          </div>
        </div>
      </div>
    </section>
  );
}