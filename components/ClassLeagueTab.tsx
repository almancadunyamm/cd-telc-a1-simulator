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
  return null;
}

function getSpeakingBadge(tema: number) {
  if (tema >= 12) return "🏆 Konuşma Şampiyonu";
  if (tema >= 9) return "🥇 Altın";
  if (tema >= 6) return "🥈 Gümüş";
  if (tema >= 3) return "🥉 Bronz";
  if (tema >= 1) return "🎤 Aday";
  return null;
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

    const { data: usersData } = await supabase
      .from("users")
      .select("email, name")
      .in("email", usernames);

    const nameMap: Record<string, string> = {};
    (usersData || []).forEach((u: any) => {
      nameMap[u.email?.toLowerCase()] = u.name || u.email;
    });

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

    const { data: speakingData } = await supabase
      .from("speaking_progress")
      .select("username, current_tema")
      .in("username", usernames)
      .eq("level", "A1");

    const speakingMap: Record<string, number> = {};
    (speakingData || []).forEach((s: any) => {
      speakingMap[String(s.username || "").toLowerCase()] = s.current_tema || 0;
    });

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
        masteryBadge: getMasteryBadge(masteryThemes) || "",
        speakingBadge: getSpeakingBadge(speakingTema) || "",
        isMe: username === currentUsername?.toLowerCase(),
      };
    });

    rows.sort((a, b) => b.score - a.score);
    setStudents(rows);
    setLastUpdated(new Date());
    setLoading(false);
  }

  if (!hasAnyLiveCourseOrder) return null;

  const activeStudents = students.filter((s) => s.score > 0);
  const inactiveStudents = students.filter((s) => s.score === 0);
  const maxScore = activeStudents[0]?.score || 1;
  const myRank = activeStudents.findIndex((s) => s.isMe) + 1;
  const myData = students.find((s) => s.isMe);
  const myIsInactive = myData?.score === 0;

  return (
    <section className="mb-8 space-y-5">

      {/* BAŞLIK KARTI */}
      <div className="rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/70">Sınıf Ligi ⚡</p>
            <h2 className="mt-1 text-2xl font-black">{myClass?.name || "Sınıfım"}</h2>
            {myClass?.teacherName && (
              <p className="mt-1 text-sm text-white/80">👨‍🏫 {myClass.teacherName}</p>
            )}
          </div>
          {myData && !myIsInactive && (
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur">
              <p className="text-3xl font-black">#{myRank}</p>
              <p className="text-xs font-bold text-white/80">Sıran</p>
            </div>
          )}
          {myIsInactive && (
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center backdrop-blur">
              <p className="text-2xl">😴</p>
              <p className="text-xs font-bold text-white/80">Henüz başlamadın</p>
            </div>
          )}
        </div>

        {myData && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xl font-black">{myData.score}</p>
              <p className="text-xs text-white/80">Puanım</p>
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

        {/* Puan sistemi açıklaması */}
        <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-black text-white/70 uppercase tracking-wider mb-2">⚡ Nasıl puan kazanırsın?</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏆</span>
              <span>Ustalık Testi: <strong>tema × 10 puan</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎙️</span>
              <span>Konuşma Kulübü: <strong>tema × 8 puan</strong></span>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/60">
            Ne kadar çok tema tamamlarsan o kadar yukarı çıkarsın. Her gün aktif ol, sıranı koru!
          </p>
        </div>
      </div>

      {/* AKTİF ÖĞRENCİLER */}
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              🔥 Aktif Öğrenciler
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{activeStudents.length} öğrenci sıralamada</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-xs text-slate-400">
                {lastUpdated.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
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
        ) : activeStudents.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-2xl mb-2">😴</p>
            <p className="text-sm text-slate-500">Henüz hiç aktif öğrenci yok. İlk sen başla!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeStudents.map((student, index) => {
              const pct = Math.round((student.score / maxScore) * 100);
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

              return (
                <div
                  key={student.username}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    student.isMe
                      ? "border-orange-300 bg-orange-50 shadow-md"
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

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-black truncate ${student.isMe ? "text-orange-700" : "text-slate-900"}`}>
                          {student.isMe ? `${student.name} (Sen)` : student.name}
                        </p>
                      </div>

                      {/* Bar */}
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            student.isMe
                              ? "bg-gradient-to-r from-orange-400 to-red-400"
                              : "bg-gradient-to-r from-yellow-400 to-orange-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Rozetler */}
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {student.masteryBadge && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                            {student.masteryBadge}
                          </span>
                        )}
                        {student.speakingBadge && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                            {student.speakingBadge}
                          </span>
                        )}
                      </div>
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
      </div>

      {/* HAREKETSİZ ÖĞRENCİLER */}
      {inactiveStudents.length > 0 && (
        <div className="rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl">
              😴
            </div>
            <div>
              <h3 className="font-black text-slate-700">Henüz Başlamayanlar</h3>
              <p className="text-xs text-slate-500">{inactiveStudents.length} öğrenci — sıralamada yer almıyor</p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveStudents.map((student) => (
              <div
                key={student.username}
                className={`rounded-2xl border p-3 ${
                  student.isMe
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className={`text-sm font-black truncate ${student.isMe ? "text-orange-600" : "text-slate-500"}`}>
                  {student.isMe ? `${student.name} (Sen)` : student.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.isMe ? "Ustalık Testini başlatarak listeye gir!" : "Henüz başlamadı"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4">
            <p className="text-xs text-slate-500 text-center">
              💡 Ustalık Testi'nde ilk temayı tamamla → hemen sıralamaya gir!
            </p>
          </div>
        </div>
      )}

    </section>
  );
}