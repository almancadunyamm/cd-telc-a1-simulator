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

      {/* BAŞLIK KARTI — sitenin ana renk paleti */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden">
        {/* Üst şerit */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-200">
                Sınıf Ligi ⚡
              </p>
              <h2 className="mt-1 text-xl font-black text-white">
                {myClass?.name || "Sınıfım"}
              </h2>
              {myClass?.teacherName && (
                <p className="mt-0.5 text-sm text-blue-200">
                  👨‍🏫 {myClass.teacherName}
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center">
              {myIsInactive ? (
                <>
                  <p className="text-2xl">😴</p>
                  <p className="text-xs font-bold text-white/80 mt-0.5">Başlamadın</p>
                </>
              ) : myRank > 0 ? (
                <>
                  <p className="text-3xl font-black text-white">#{myRank}</p>
                  <p className="text-xs font-bold text-white/80">Sıran</p>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Benim istatistiklerim */}
        {myData && (
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
            {[
              { label: "Puanım", value: myData.score },
              { label: "Ustalık", value: `${myData.masteryThemes}/12` },
              { label: "Konuşma", value: myData.speakingTema },
            ].map((item) => (
              <div key={item.label} className="py-4 text-center">
                <p className="text-xl font-black text-slate-900">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Puan sistemi */}
        <div className="px-6 py-4 bg-slate-50">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            ⚡ Puan Sistemi
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>🏆</span>
              <span>Ustalık Testi: <strong className="text-slate-800">tema × 10 puan</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🎙️</span>
              <span>Konuşma Kulübü: <strong className="text-slate-800">tema × 8 puan</strong></span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Ne kadar çok tema tamamlarsan o kadar yukarı çıkarsın. Her gün aktif ol!
          </p>
        </div>
      </div>

      {/* AKTİF ÖĞRENCİLER — GRID */}
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">🔥 Sıralama</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeStudents.length} öğrenci aktif
            </p>
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : activeStudents.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-center">
            <p className="text-2xl mb-2">😴</p>
            <p className="text-sm text-slate-500">Henüz aktif öğrenci yok. İlk sen başla!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeStudents.map((student, index) => {
              const pct = Math.round((student.score / maxScore) * 100);
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

              return (
                <div
                  key={student.username}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    student.isMe
                      ? "border-blue-300 bg-blue-50 shadow-md"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                  }`}
                >
                  {/* Üst satır: sıra + isim + puan */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      index < 3
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {medal || (index + 1)}
                    </div>
                    <p className={`flex-1 text-sm font-black truncate ${
                      student.isMe ? "text-blue-700" : "text-slate-900"
                    }`}>
                      {student.isMe ? `${student.name} ✦` : student.name}
                    </p>
                    <p className={`text-base font-black shrink-0 ${
                      student.isMe ? "text-blue-600" : "text-slate-700"
                    }`}>
                      {student.score}
                    </p>
                  </div>

                  {/* İlerleme barı */}
                  <div className="h-1.5 w-full rounded-full bg-slate-100 mb-2">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        student.isMe
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Rozetler */}
                  <div className="flex flex-wrap gap-1">
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
              );
            })}
          </div>
        )}
      </div>

      {/* HAREKETSİZ ÖĞRENCİLER */}
      {inactiveStudents.length > 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl">
              😴
            </div>
            <div>
              <h3 className="font-black text-slate-600">Henüz Başlamayanlar</h3>
              <p className="text-xs text-slate-400">
                {inactiveStudents.length} öğrenci — sıralamada yer almıyor
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveStudents.map((student) => (
              <div
                key={student.username}
                className={`rounded-2xl border p-3 ${
                  student.isMe
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className={`text-sm font-black truncate ${
                  student.isMe ? "text-blue-600" : "text-slate-400"
                }`}>
                  {student.isMe ? `${student.name} (Sen)` : student.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.isMe
                    ? "Ustalık Testini başlatarak listeye gir! 🚀"
                    : "Henüz başlamadı"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-3 text-center">
            <p className="text-xs text-slate-500">
              💡 Ustalık Testi'nde ilk temayı tamamla → hemen sıralamaya gir!
            </p>
          </div>
        </div>
      )}

    </section>
  );
}