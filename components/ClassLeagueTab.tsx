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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
  // max ustalık puanı = 12*10=120, max konuşma = 12*8=96, toplam max = 216
  const chartMax = Math.max(maxScore, 20);
  const myRank = activeStudents.findIndex((s) => s.isMe) + 1;
  const myData = students.find((s) => s.isMe);
  const myIsInactive = myData?.score === 0;

  return (
    <section className="mb-8 space-y-5">

      {/* BAŞLIK KARTI */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-200">Sınıf Ligi ⚡</p>
              <h2 className="mt-1 text-xl font-black text-white">{myClass?.name || "Sınıfım"}</h2>
              {myClass?.teacherName && (
                <p className="mt-0.5 text-sm text-blue-200">👨‍🏫 {myClass.teacherName}</p>
              )}
            </div>
            <div className="rounded-2xl bg-white/20 px-5 py-3 text-center">
              {myIsInactive ? (
                <><p className="text-2xl">😴</p><p className="text-xs font-bold text-white/80 mt-0.5">Başlamadın</p></>
              ) : myRank > 0 ? (
                <><p className="text-3xl font-black text-white">#{myRank}</p><p className="text-xs font-bold text-white/80">Sıran</p></>
              ) : null}
            </div>
          </div>
        </div>

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

        {/* Legend + puan sistemi */}
        <div className="px-6 py-4 bg-slate-50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded-sm bg-blue-500" />
            <span className="text-xs font-bold text-slate-600">Ustalık (×10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded-sm bg-emerald-500" />
            <span className="text-xs font-bold text-slate-600">Konuşma (×8)</span>
          </div>
          <p className="text-xs text-slate-400 ml-auto">
            {lastUpdated && lastUpdated.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} güncellendi
          </p>
          <button
            onClick={loadLeague}
            className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-100 transition-all"
          >
            🔄
          </button>
        </div>
      </div>

      {/* SÜTUN GRAFİĞİ */}
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-black text-slate-900 mb-1">🔥 Sıralama</h3>
        <p className="text-xs text-slate-500 mb-6">{activeStudents.length} öğrenci aktif · Çubuğa tıklayarak detay görebilirsin</p>

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
          <>
            {/* GRAFİK ALANI */}
            <div className="relative">
              {/* Y ekseni çizgileri */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-10">
                {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                  <div key={ratio} className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 w-6 text-right shrink-0">
                      {Math.round(ratio * chartMax)}
                    </span>
                    <div className="flex-1 border-t border-slate-100" />
                  </div>
                ))}
              </div>

              {/* Sütunlar — scroll edilebilir */}
              <div className="overflow-x-auto pb-2">
                <div
                  className="flex items-end gap-2 pl-8"
                  style={{ minWidth: `${activeStudents.length * 64}px`, height: "220px" }}
                >
                  {activeStudents.map((student, index) => {
                    const masteryPt = student.masteryThemes * 10;
                    const speakingPt = student.speakingTema * 8;
                    const masteryH = (masteryPt / chartMax) * 160;
                    const speakingH = (speakingPt / chartMax) * 160;
                    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
                    const isHovered = hoveredIndex === index;

                    return (
                      <div
                        key={student.username}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ width: "56px", flexShrink: 0 }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute z-10 mb-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap"
                            style={{ transform: "translateY(-100%) translateY(-8px)" }}>
                            <p className="font-black">{student.name}</p>
                            <p>🏆 Ustalık: {student.masteryThemes} tema ({masteryPt} pt)</p>
                            <p>🎙️ Konuşma: {student.speakingTema} tema ({speakingPt} pt)</p>
                            <p className="font-black text-yellow-300 mt-1">Toplam: {student.score} puan</p>
                          </div>
                        )}

                        {/* Puan etiketi */}
                        <div className={`mb-1 text-xs font-black transition-all ${
                          student.isMe ? "text-blue-600" : "text-slate-500"
                        }`}>
                          {student.score}
                        </div>

                        {/* Sütun */}
                        <div className="flex flex-col-reverse w-full rounded-t-xl overflow-hidden" style={{ height: "160px" }}>
                          {/* Ustalık (alt, mavi) */}
                          <div
                            className={`w-full transition-all duration-700 ${
                              student.isMe ? "bg-blue-600" : "bg-blue-400"
                            } ${isHovered ? "brightness-110" : ""}`}
                            style={{ height: `${masteryH}px`, minHeight: masteryH > 0 ? "4px" : "0" }}
                          />
                          {/* Konuşma (üst, yeşil) */}
                          {speakingH > 0 && (
                            <div
                              className={`w-full transition-all duration-700 ${
                                student.isMe ? "bg-emerald-500" : "bg-emerald-400"
                              } ${isHovered ? "brightness-110" : ""}`}
                              style={{ height: `${speakingH}px`, minHeight: "4px" }}
                            />
                          )}
                        </div>

                        {/* İsim + madalya */}
                        <div className="mt-2 text-center" style={{ height: "36px" }}>
                          {medal && <div className="text-sm leading-none">{medal}</div>}
                          <p className={`text-xs font-bold truncate w-full text-center ${
                            student.isMe ? "text-blue-600" : "text-slate-600"
                          }`}>
                            {student.name.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detay listesi (kompakt) */}
            <div className="mt-6 space-y-2">
              {activeStudents.map((student, index) => (
                <div
                  key={student.username}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 ${
                    student.isMe
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-black text-slate-400 w-5 text-center">{index + 1}</span>
                  <p className={`flex-1 text-sm font-black truncate ${student.isMe ? "text-blue-700" : "text-slate-800"}`}>
                    {student.isMe ? `${student.name} ✦` : student.name}
                  </p>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {student.masteryBadge && (
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {student.masteryBadge}
                      </span>
                    )}
                    {student.speakingBadge && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        {student.speakingBadge}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-black w-12 text-right ${student.isMe ? "text-blue-600" : "text-slate-600"}`}>
                    {student.score} pt
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* HAREKETSİZ ÖĞRENCİLER */}
      {inactiveStudents.length > 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl">😴</div>
            <div>
              <h3 className="font-black text-slate-600">Henüz Başlamayanlar</h3>
              <p className="text-xs text-slate-400">{inactiveStudents.length} öğrenci — sıralamada yer almıyor</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveStudents.map((student) => (
              <div
                key={student.username}
                className={`rounded-2xl border p-3 ${
                  student.isMe ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <p className={`text-sm font-black truncate ${student.isMe ? "text-blue-600" : "text-slate-400"}`}>
                  {student.isMe ? `${student.name} (Sen)` : student.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student.isMe ? "Ustalık Testini başlatarak listeye gir! 🚀" : "Henüz başlamadı"}
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