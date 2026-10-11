"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import {
  getTrialClassIds,
  LESSONS_PER_THEME,
  TRIAL_SIGNUP_URL,
  TRIAL_WORD_THEME_LIMIT,
  TRIAL_LEAD_STORAGE_KEY,
  TRIAL_WORKSHEET_THEME_LIMIT,
} from "@/lib/trial";
import { A1_SYLLABUS } from "./syllabus";
import type { TrialLead } from "./TrialLeadForm";

const KelimeOyunu = dynamic(() => import("@/components/KelimeOyunu"), { ssr: false });

type TabKey =
  | "home"
  | "lessons"
  | "materials"
  | "vocabulary"
  | "wordgame"
  | "speaking"
  | "exams"
  | "progress";

type Access = "open" | "partial" | "locked";

const TABS: { key: TabKey; label: string; icon: string; access: Access }[] = [
  { key: "home", label: "Ana Sayfa", icon: "🏠", access: "open" },
  { key: "lessons", label: "Dersler", icon: "🎬", access: "partial" },
  { key: "materials", label: "Çalışma Sayfaları", icon: "📄", access: "partial" },
  { key: "vocabulary", label: "Ustalık", icon: "📚", access: "locked" },
  { key: "wordgame", label: "Kelime Arenası", icon: "🎮", access: "partial" },
  { key: "speaking", label: "Konuşma Klübü", icon: "🎙️", access: "locked" },
  { key: "exams", label: "Deneme Sınavları", icon: "📝", access: "locked" },
  { key: "progress", label: "İlerleme", icon: "📊", access: "locked" },
];

type LessonRow = {
  id: string;
  title: string | null;
  video_url: string | null;
  class_id: string | null;
  level: string | null;
  content_type: string | null;
  pdf_title: string | null;
  pdf_url: string | null;
  worksheets: { id?: string; title?: string; url?: string }[] | null;
  worksheet_title: string | null;
  worksheet_url: string | null;
};

type Material = { key: string; title: string; url: string; kind: "pdf" | "worksheet"; lessonNo: number; lessonTitle: string };

type LockInfo = { title: string; desc?: string };

function getEmbedUrl(url: string) {
  if (!url) return "";
  const params = "rel=0&modestbranding=1&playsinline=1&fs=1";
  if (url.includes("youtube.com/embed/")) return `${url}${url.includes("?") ? "&" : "?"}${params}`;
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1]?.split("&")[0];
    return id ? `https://www.youtube.com/embed/${id}?${params}` : "";
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}?${params}` : "";
  }
  return url;
}

function lessonNumber(title?: string | null) {
  const match = String(title || "").trim().match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

function lessonMaterials(lesson: LessonRow, lessonNo: number): Material[] {
  const list: Material[] = [];
  const lessonTitle = String(lesson.title || "");
  if (lesson.pdf_url) {
    list.push({ key: `${lesson.id}-pdf`, title: lesson.pdf_title || "PDF Materyali", url: lesson.pdf_url, kind: "pdf", lessonNo, lessonTitle });
  }
  const worksheets =
    lesson.worksheets && lesson.worksheets.length > 0
      ? lesson.worksheets
      : lesson.worksheet_url
      ? [{ id: "legacy", title: lesson.worksheet_title || "Çalışma sayfası", url: lesson.worksheet_url }]
      : [];
  worksheets.forEach((ws, index) => {
    if (!ws.url) return;
    list.push({ key: `${lesson.id}-${ws.id || index}`, title: ws.title || "Çalışma sayfası", url: ws.url, kind: "worksheet", lessonNo, lessonTitle });
  });
  return list;
}

export default function TrialPanel({ lead }: { lead: TrialLead }) {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [lockInfo, setLockInfo] = useState<LockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sampleLessons, setSampleLessons] = useState<LessonRow[]>([]);
  const [sampleTeacher, setSampleTeacher] = useState("");
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [worksheetLessons, setWorksheetLessons] = useState<LessonRow[]>([]);
  const [openTheme, setOpenTheme] = useState<number | null>(1);
  const [recordingLevel, setRecordingLevel] = useState<"A1" | "A2" | "B1">("A1");

  const firstName = lead.name.split(" ")[0] || lead.name;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Öğrenci paneliyle aynı şekilde "*" ile okunur: belirli sütun adı
      // istemek, tabloda olmayan bir sütun yüzünden tüm sorguyu düşürüyordu.
      const [{ data: classRows, error: classError }, { data: lessonRows, error: lessonError }] = await Promise.all([
        supabase.from("classes").select("*"),
        supabase
          .from("teacher_lessons")
          .select("*")
          .order("lesson_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      if (classError) console.warn("[deneme-dersi] sınıflar okunamadı", classError);
      if (lessonError) console.warn("[deneme-dersi] dersler okunamadı", lessonError);

      const trialIds = getTrialClassIds(classRows as { id: string; class_type?: string | null }[] | null);
      const rows = (lessonRows || []) as LessonRow[];

      const samples = rows.filter((row) => row.class_id && trialIds.has(row.class_id) && row.video_url);
      setSampleLessons(samples);
      setSelectedSampleId(samples[0]?.id ?? null);
      const trialClass = (classRows || []).find((c: { id: string }) => trialIds.has(c.id)) as
        | { teacher_name?: string | null }
        | undefined;
      setSampleTeacher(trialClass?.teacher_name || "");

      setWorksheetLessons(
        rows.filter(
          (row) =>
            row.level === "A1" &&
            row.content_type === "digitalPackage" &&
            !(row.class_id && trialIds.has(row.class_id))
        )
      );
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Çalışma sayfaları tema bazlı (tema = 3 ders)
  const materialsByTheme = useMemo(() => {
    const map = new Map<number, Material[]>();
    worksheetLessons.forEach((lesson) => {
      const no = lessonNumber(lesson.title);
      if (!no) return;
      const theme = Math.ceil(no / LESSONS_PER_THEME);
      const list = map.get(theme) || [];
      list.push(...lessonMaterials(lesson, no));
      map.set(theme, list);
    });
    map.forEach((list) => list.sort((a, b) => a.lessonNo - b.lessonNo));
    return map;
  }, [worksheetLessons]);

  const selectedSample = sampleLessons.find((lesson) => lesson.id === selectedSampleId) || null;
  const selectedSampleMaterials = selectedSample ? lessonMaterials(selectedSample, lessonNumber(selectedSample.title) || 0) : [];

  function lock(title: string, desc?: string) {
    setLockInfo({ title, desc });
  }

  function handleExit() {
    try {
      localStorage.removeItem(TRIAL_LEAD_STORAGE_KEY);
    } catch {}
    window.location.href = "/";
  }

  function goTab(tab: TabKey) {
    setActiveTab(tab);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-28 text-slate-950">
      {/* Üst bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" className="shrink-0">
              <img src="/images/logo.png" alt="Almanca Okulum" className="h-10 w-auto object-contain" />
            </a>
            <span className="hidden rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-yellow-800 sm:inline-flex">
              Deneme Paneli
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={TRIAL_SIGNUP_URL}
              className="rounded-xl bg-orange-500 px-3 py-2.5 text-sm font-black text-white shadow-md shadow-orange-500/30 hover:bg-orange-400 sm:px-4"
            >
              <span className="sm:hidden">Kayıt Ol</span>
              <span className="hidden sm:inline">Canlı Kursa Kayıt Ol</span>
            </a>
            <button
              type="button"
              onClick={handleExit}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Panel menüsü">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => goTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black transition ${
                activeTab === tab.key ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.access === "locked" && <span aria-label="kilitli">🔒</span>}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[250px_1fr]">
        {/* Masaüstü menü */}
        <aside className="hidden h-fit rounded-3xl bg-white p-5 shadow-lg lg:sticky lg:top-24 lg:block">
          <p className="text-lg font-extrabold text-blue-600">Almanca Okulum</p>
          <p className="mt-1 text-xs text-slate-500">TELC Hazırlık Paneli · Deneme</p>
          <nav className="mt-6 space-y-1.5 text-sm font-semibold" aria-label="Panel menüsü">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => goTab(tab.key)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>
                  {tab.icon} {tab.label}
                </span>
                {tab.access === "locked" && <span className="text-xs">🔒</span>}
                {tab.access === "partial" && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      activeTab === tab.key ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    Deneme
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-orange-50 p-4 text-xs leading-5 text-orange-900">
            <p className="font-black">Tüm bölümleri aç</p>
            <p className="mt-1">Canlı kursa kayıt olduğunda bu paneldeki tüm bölümler açılır.</p>
            <a href={TRIAL_SIGNUP_URL} className="mt-3 inline-flex font-black text-orange-600 underline">
              Paketleri gör →
            </a>
          </div>
          <button
            type="button"
            onClick={handleExit}
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            🚪 Çıkış Yap
          </button>
        </aside>

        <div className="min-w-0 space-y-6">
          {activeTab === "home" && (
            <HomeTab firstName={firstName} goTab={goTab} lock={lock} hasSample={sampleLessons.length > 0} />
          )}

          {activeTab === "lessons" && (
            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <p className="text-xs font-black uppercase tracking-widest text-orange-600">Örnek Ders</p>
                <h2 className="mt-1 text-2xl font-black">Canlı dersimizden bir örnek</h2>
                {sampleTeacher && <p className="mt-1 text-sm text-slate-500">Öğretmen: {sampleTeacher}</p>}

                {loading ? (
                  <div className="mt-5 aspect-video animate-pulse rounded-3xl bg-slate-200" />
                ) : selectedSample ? (
                  <>
                    {sampleLessons.length > 1 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {sampleLessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => setSelectedSampleId(lesson.id)}
                            className={`rounded-full px-4 py-2 text-xs font-black ${
                              lesson.id === selectedSampleId ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lesson.title}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-black/10">
                      <iframe
                        src={getEmbedUrl(selectedSample.video_url || "")}
                        title={selectedSample.title || "Örnek ders"}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold">{selectedSample.title}</h3>
                    {selectedSampleMaterials.length > 0 && (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {selectedSampleMaterials.map((material) => (
                          <a
                            key={material.key}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-100"
                          >
                            {material.kind === "pdf" ? "📄" : "📝"} {material.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-4xl">🎬</p>
                    <p className="mt-3 font-black">Örnek ders çok yakında burada</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Bu sırada Kelime Arenası&apos;nı ve çalışma sayfalarını deneyebilirsin.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">Canlı Ders Kayıtları</p>
                    <h2 className="mt-1 text-2xl font-black">Sınıfının ders kayıtları</h2>
                  </div>
                  <div className="flex gap-2" role="tablist" aria-label="Seviye">
                    {(["A1", "A2", "B1"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        role="tab"
                        aria-selected={recordingLevel === level}
                        onClick={() => setRecordingLevel(level)}
                        className={`rounded-full px-4 py-2 text-sm font-black transition ${
                          recordingLevel === level ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                  🎥 Öğretmenimizle canlı Zoom derslerimiz işlendikçe, her dersin kaydı ve materyalleri burada
                  listelenir. Kaçırdığın dersi buradan tekrar izleyebilirsin.
                </div>

                <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-4xl">📭</p>
                  <p className="mt-3 font-black text-slate-800">{recordingLevel} sınıfında henüz ders kaydı yok</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Canlı kursa kayıt olduğunda sınıfının ders kayıtları burada görünür.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "materials" && (
            <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">PDF Materyal Merkezi</p>
              <h2 className="mt-1 text-2xl font-black">A1 çalışma sayfaları</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Deneme panelinde ilk {TRIAL_WORKSHEET_THEME_LIMIT} temanın (1–{TRIAL_WORKSHEET_THEME_LIMIT * LESSONS_PER_THEME}. dersler)
                çalışma sayfaları açık. Diğer temalar canlı kursa kayıt olduğunda açılır.
              </p>

              {loading ? (
                <div className="mt-6 h-40 animate-pulse rounded-3xl bg-slate-100" />
              ) : (
                <div className="mt-6 space-y-3">
                  {A1_SYLLABUS.map((theme) => {
                    const isOpen = theme.id <= TRIAL_WORKSHEET_THEME_LIMIT;
                    const materials = materialsByTheme.get(theme.id) || [];
                    const expanded = openTheme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        className={`rounded-2xl border ${isOpen ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50"}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (!isOpen) {
                              lock(`Tema ${theme.id}: ${theme.title}`, "Bu temanın çalışma sayfaları");
                              return;
                            }
                            setOpenTheme(expanded ? null : theme.id);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                          aria-expanded={isOpen ? expanded : undefined}
                        >
                          <div>
                            <p className={`text-xs font-black ${isOpen ? "text-emerald-700" : "text-slate-500"}`}>
                              TEMA {theme.id} · {theme.lessons[0].number}–{theme.lessons[theme.lessons.length - 1].number}. dersler
                            </p>
                            <p className="mt-0.5 font-black text-slate-900">{theme.title}</p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                              isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isOpen ? (expanded ? "Açık ▲" : "Açık ▼") : "🔒 Kilitli"}
                          </span>
                        </button>

                        {isOpen && expanded && (
                          <div className="space-y-2 px-4 pb-4">
                            {materials.length === 0 ? (
                              <p className="rounded-xl bg-white p-3 text-sm text-slate-500">Bu tema için henüz materyal eklenmemiş.</p>
                            ) : (
                              materials.map((material) => (
                                <a
                                  key={material.key}
                                  href={material.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 hover:bg-emerald-50"
                                >
                                  <span className="min-w-0">
                                    <span className="line-clamp-1 text-sm font-black text-slate-900">
                                      {material.kind === "pdf" ? "📄" : "📝"} {material.title}
                                    </span>
                                    <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500">Ders: {material.lessonTitle}</span>
                                  </span>
                                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">Aç</span>
                                </a>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === "wordgame" && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                🎮 Deneme panelinde A1 Kelime Arenası&apos;nın ilk {TRIAL_WORD_THEME_LIMIT} teması açık. Diğer temalar ve
                ilerlemenin kaydedilmesi canlı kursa kayıt olduğunda açılır.
              </div>
              <KelimeOyunu
                effectivePackageType="starter"
                hasAnyLiveCourseOrder={false}
                currentUserEmail=""
                currentUserName={lead.name}
                activeAccessLevels={["A1"]}
                trialThemeLimit={TRIAL_WORD_THEME_LIMIT}
                onTrialLocked={() => lock("Bu Kelime Arenası teması", "Kelime Arenası'nın 12 teması ve liderlik tablosu")}
                onLevelLocked={(level) => lock(`${level} Kelime Arenası`, `${level} seviyesi kelime temaları`)}
              />
            </section>
          )}

          {activeTab === "vocabulary" && (
            <LockedSection title="Ustalık Testleri" desc="Her temada 15 soruluk, 3 canlı ustalık testleri" onSignup={() => lock("Ustalık Testleri")}>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {A1_SYLLABUS.map((theme) => (
                  <div key={theme.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black text-emerald-700">TEMA {theme.id}</p>
                    <p className="mt-1 font-black">{theme.title}</p>
                    <p className="mt-2 text-xs text-slate-500">15 soru · 3 can · 11 doğru ile geç</p>
                  </div>
                ))}
              </div>
            </LockedSection>
          )}

          {activeTab === "speaking" && (
            <LockedSection
              title="Konuşma Kulübü"
              desc="Canlı kurs öğrencileri Konuşma Kulübü'ne otomatik üye olur"
              onSignup={() => lock("Konuşma Kulübü")}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["🤝", "Partner eşleştirme", "Seviyene uygun bir partnerle düzenli konuşma pratiği."],
                  ["🗣️", "Tema görevleri", "Her temada hazır konuşma kalıplarıyla görevler."],
                  ["🎓", "Öğretmenle sınav", "Tema sonunda öğretmenle görüntülü konuşma sınavı."],
                ].map(([icon, title, text]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-2xl">{icon}</p>
                    <p className="mt-2 font-black">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </LockedSection>
          )}

          {activeTab === "exams" && (
            <LockedSection
              title="TELC Dijital Deneme Sınavları"
              desc="Gerçek TELC dijital sınav formatında denemeler ve sonuç analizi"
              onSignup={() => lock("Deneme Sınavları")}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {["Lesen", "Hören", "Schreiben", "Sprechen"].map((part, index) => (
                  <div key={part} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="text-xs font-black text-blue-700">TELC A1 · Bölüm {index + 1}</p>
                      <p className="mt-1 font-black">{part}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Süreli</span>
                  </div>
                ))}
              </div>
            </LockedSection>
          )}

          {activeTab === "progress" && (
            <LockedSection title="İlerleme Takibi" desc="Genel ilerleme, günlük seri ve son 7 gün çalışma grafiğin" onSignup={() => lock("İlerleme Takibi")}>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-black">Genel İlerleme · A1</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-emerald-500 to-blue-600" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Ustalık", "5/12"],
                    ["Kelime", "4/12"],
                    ["Konuşma", "3/12"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-lg font-black">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex h-28 items-end gap-2">
                  {[30, 55, 20, 70, 45, 80, 60].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-lg bg-blue-200" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </LockedSection>
          )}
        </div>
      </div>

      {lockInfo && <LockModal info={lockInfo} onClose={() => setLockInfo(null)} />}
    </main>
  );
}

function HomeTab({
  firstName,
  goTab,
  lock,
  hasSample,
}: {
  firstName: string;
  goTab: (tab: TabKey) => void;
  lock: (title: string, desc?: string) => void;
  hasSample: boolean;
}) {
  return (
    <>
      <section className="rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Ücretsiz Deneme</p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Merhaba {firstName}, deneme panelin hazır 👋</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">
          Canlı kurs öğrencilerimizin kullandığı panelin aynısı. Örnek dersi izle, Kelime Arenası&apos;nda oyna ve ilk
          temaların çalışma sayfalarını indir. Kilitli bölümler kayıt olduğunda açılır.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: "🎬",
            title: "Örnek dersi izle",
            text: hasSample ? "Öğretmenimizin canlı dersinden bir örnek." : "Örnek ders çok yakında.",
            tab: "lessons" as TabKey,
          },
          { icon: "🎮", title: "Kelime Arenası", text: `İlk ${TRIAL_WORD_THEME_LIMIT} tema açık. Hemen oyna!`, tab: "wordgame" as TabKey },
          {
            icon: "📄",
            title: "Çalışma sayfaları",
            text: `İlk ${TRIAL_WORKSHEET_THEME_LIMIT} temanın PDF'leri açık.`,
            tab: "materials" as TabKey,
          },
        ].map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => goTab(card.tab)}
            className="rounded-3xl border border-emerald-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{card.icon}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">AÇIK</span>
            </div>
            <p className="mt-3 text-lg font-black">{card.title}</p>
            <p className="mt-1 text-sm text-slate-500">{card.text}</p>
            <p className="mt-3 text-sm font-black text-blue-600">Başla →</p>
          </button>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-lg sm:p-6">
        <h2 className="text-xl font-black">Canlı kursta seni bekleyenler</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: "📚", title: "Ustalık Testleri", tab: "vocabulary" as TabKey },
            { icon: "🎙️", title: "Konuşma Kulübü", tab: "speaking" as TabKey },
            { icon: "📝", title: "TELC Denemeleri", tab: "exams" as TabKey },
            { icon: "📊", title: "İlerleme Takibi", tab: "progress" as TabKey },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTab(item.tab)}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:border-yellow-300 hover:bg-yellow-50"
            >
              <span className="font-black">
                {item.icon} {item.title}
              </span>
              <span>🔒</span>
            </button>
          ))}
        </div>
      </section>

      <SignupCard />
    </>
  );
}

function SignupCard() {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">Canlı Akademi</p>
      <h2 className="mt-2 text-2xl font-black md:text-3xl">Öğretmenle canlı hazırlan</h2>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {[
          "✓ Canlı Zoom dersleri",
          "✓ Tüm ders kayıtları ve PDF'ler",
          "✓ Konuşma Kulübü üyeliği",
          "✓ Öğretmen takibi ve ödev sistemi",
        ].map((item) => (
          <p key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold">
            {item}
          </p>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={TRIAL_SIGNUP_URL}
          className="inline-flex justify-center rounded-full bg-yellow-400 px-7 py-4 text-sm font-black text-slate-950 hover:bg-yellow-300"
        >
          Canlı Kursa Kayıt Ol
        </a>
        <a
          href="/academy-live"
          className="inline-flex justify-center rounded-full border border-white/20 px-7 py-4 text-sm font-black text-white hover:bg-white/10"
        >
          Programı ve fiyatları incele
        </a>
      </div>
    </section>
  );
}

function LockedSection({
  title,
  desc,
  children,
  onSignup,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  onSignup: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-lg sm:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-blue-600">{title}</p>
      <h2 className="mt-1 text-2xl font-black">{desc}</h2>
      <div className="relative mt-5">
        <div className="pointer-events-none select-none opacity-60 blur-[2px]" aria-hidden="true">
          {children}
        </div>
        <div className="absolute inset-0 flex items-start justify-center pt-6 sm:items-center sm:pt-0">
          <div className="mx-2 max-w-md rounded-3xl border border-yellow-200 bg-white/95 p-6 text-center shadow-2xl">
            <p className="text-4xl">🔒</p>
            <p className="mt-3 text-lg font-black">Bu bölüm canlı kursa kayıt olduğunuzda açılır</p>
            <p className="mt-2 text-sm text-slate-500">{title} canlı kurs öğrencilerimize açıktır.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={TRIAL_SIGNUP_URL}
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-400"
              >
                Canlı Kursa Kayıt Ol
              </a>
              <button type="button" onClick={onSignup} className="text-xs font-bold text-slate-500 underline">
                Neler açılacak?
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LockModal({ info, onClose }: { info: LockInfo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-lock-title"
      onClick={onClose}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-5xl">🔒</p>
        <p className="mt-3 text-xs font-black uppercase tracking-widest text-orange-600">{info.title}</p>
        <h2 id="trial-lock-title" className="mt-2 text-xl font-black text-slate-900">
          Bu bölüm canlı kursa kayıt olduğunuzda açılır
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {info.desc ? `${info.desc} canlı kurs öğrencilerimize açıktır. ` : ""}
          Kaydını şimdi online tamamlayabilir, ödemeyi güvenle yapıp hemen başlayabilirsin.
        </p>
        <a
          href={TRIAL_SIGNUP_URL}
          className="mt-6 block rounded-2xl bg-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400"
        >
          Canlı Kursa Kayıt Ol
        </a>
        <button type="button" onClick={onClose} className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">
          Denemeye devam et
        </button>
      </div>
    </div>
  );
}
