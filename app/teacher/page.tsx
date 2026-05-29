"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PackageType = "starter" | "practice" | "master";
type ContentType = "liveClass" | "digitalPackage";
type Level = "A1" | "A2" | "B1";

type LoggedUser = {
  username?: string;
  role?: string;
  teacherId?: string;
  name?: string;
};

type ClassItem = {
  id: string;
  name: string;
  level: Level;
  teacherId?: string;
  teacherName?: string;
  teacher_id?: string;
  teacher_name?: string;
};

type LessonItem = {
  id: string;
  level: Level;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  title: string;
  videoUrl: string;
  packageType: PackageType;
  contentType: ContentType;
  pdfTitle: string;
  pdfUrl: string;
  pdfVisibility?: "classOnly" | "digitalPackage";
  homework: string;
  worksheets?: {
  id: string;
  title: string;
  url: string;
  packageType: PackageType;
}[];

worksheetTitle?: string;
worksheetUrl?: string;
worksheetPackageType?: PackageType;
};

function normalizeId(value?: string) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getPackageLabel(packageType: PackageType) {
  if (packageType === "master") return "Zirve";
  if (packageType === "practice") return "Gelişim";
  return "Başlangıç";
}

function getContentTypeLabel(contentType: ContentType) {
  if (contentType === "digitalPackage") return "Dijital paket içeriği";
  return "Canlı sınıf dersi";
}

export default function TeacherPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [activeClassFilter, setActiveClassFilter] = useState("all");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [packageType, setPackageType] = useState<PackageType>("starter");
  const [pdfVisibility, setPdfVisibility] = useState<
  "classOnly" | "digitalPackage"
>("classOnly");
  const [contentType, setContentType] = useState<ContentType>("liveClass");
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [homework, setHomework] = useState("");
  const [worksheetTitle, setWorksheetTitle] = useState("");
const [worksheetUrl, setWorksheetUrl] = useState("");
const [worksheetPackageType, setWorksheetPackageType] =
  useState<PackageType>("practice");
  const [worksheets, setWorksheets] = useState<
  {
    id: string;
    title: string;
    url: string;
    packageType: PackageType;
  }[]
>([]);

  const [currentTeacherId, setCurrentTeacherId] = useState("");
  const [currentTeacherName, setCurrentTeacherName] = useState("");
  const [isExpertTeacher, setIsExpertTeacher] = useState(false);
  const [teacherMatchValues, setTeacherMatchValues] = useState<string[]>([]);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("mock_logged_user");

    if (!rawUser) {
      router.push("/login");
      return;
    }

    let loggedUser: LoggedUser | null = null;

    try {
      loggedUser = JSON.parse(rawUser) as LoggedUser;
    } catch {
      localStorage.removeItem("mock_logged_user");
      router.push("/login");
      return;
    }

    if (loggedUser?.role !== "teacher") {
      router.push("/login");
      return;
    }

    const teacherIdFromLogin = normalizeId(
      loggedUser.teacherId || loggedUser.username
    );
    const teacherMatchValues = [
  loggedUser.teacherId,
  loggedUser.username,
  loggedUser.name,
]
  .map((item) => normalizeId(item))
  .filter(Boolean);

    if (!teacherIdFromLogin) {
      alert("Öğretmen hesabında teacherId bulunamadı.");
      router.push("/login");
      return;
    }

    setCurrentTeacherId(teacherIdFromLogin);
    setCurrentTeacherName(loggedUser.name || loggedUser.username || "Öğretmen");
    async function loadTeacherType() {
  const { data, error } = await supabase
    .from("users")
    .select("teacher_type")
    .eq("email", loggedUser?.username?.trim().toLowerCase())
    .limit(1);

  if (error) {
    console.log(error);
    setIsExpertTeacher(false);
    return;
  }

  setIsExpertTeacher(data?.[0]?.teacher_type === "expertTeacher");
}

loadTeacherType();

    let teacherClasses: ClassItem[] = [];

async function loadTeacherClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("*");

  if (error) {
    console.log(error);
    setClasses([]);
    return;
  }

  teacherClasses = (data || [])
    .map((classItem: any) => ({
      id: classItem.id,
      name: classItem.name,
      level: classItem.level,
      teacherId: classItem.teacher_id,
      teacherName: classItem.teacher_name,
      teacher_id: classItem.teacher_id,
      teacher_name: classItem.teacher_name,
      isDefaultSalesClass: classItem.is_default_sales_class,
      classType: classItem.class_type,
    }))
    .filter((classItem) => {
      const classTeacherValues = [
        classItem.teacherId,
        classItem.teacherName,
        classItem.teacher_id,
        classItem.teacher_name,
      ]
        .map((item) => normalizeId(item))
        .filter(Boolean);

      return classTeacherValues.some((value) =>
        teacherMatchValues.includes(value)
      );
    });

  setClasses(teacherClasses);

  if (teacherClasses.length > 0) {
    setSelectedClassId(teacherClasses[0].id);
  }
}

loadTeacherClasses();

async function loadTeacherLessons() {
  const { data, error } = await supabase
    .from("teacher_lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    setLessons([]);
    return;
  }

  const teacherClassIds = teacherClasses.map((classItem) => classItem.id);

  const mappedLessons = (data || []).map((lesson: any) => ({
    id: lesson.id,
    level: lesson.level,
    classId: lesson.class_id,
    className: lesson.class_name,
    teacherId: lesson.teacher_id,
    teacherName: lesson.teacher_name,
    title: lesson.title,
    videoUrl: lesson.video_url,
    packageType: lesson.package_type || "starter",
    contentType: lesson.content_type || "liveClass",
    pdfTitle: lesson.pdf_title || "",
    pdfUrl: lesson.pdf_url || "",
    pdfVisibility: lesson.pdf_visibility || "classOnly",
    homework: lesson.homework || "",
    worksheets: lesson.worksheets || [],
    worksheetTitle: lesson.worksheet_title || "",
    worksheetUrl: lesson.worksheet_url || "",
    worksheetPackageType: lesson.worksheet_package_type || "practice",
  }));

  setLessons(
    mappedLessons.filter((lesson) =>
      teacherClassIds.includes(lesson.classId)
    )
  );
}

loadTeacherLessons();
  }, [router]);

  const filteredLessons =
  activeClassFilter === "all"
    ? lessons
    : lessons.filter(
        (lesson) => lesson.classId === activeClassFilter
      );
  function handleLogout() {
    localStorage.removeItem("mock_logged_user");
    router.push("/login");
  }

  function resetForm() {
    setTitle("");
    setVideoUrl("");
    setPackageType("starter");
    setPdfVisibility("classOnly");
    setContentType("liveClass");
    setPdfTitle("");
    setPdfUrl("");
    setHomework("");
    setWorksheetTitle("");
setWorksheetUrl("");
setWorksheetPackageType("practice");
setWorksheets([]);
    setEditingLessonId(null);
  }

  async function handleSaveLesson() {
    if (!currentTeacherId) {
      alert("Öğretmen girişi bulunamadı. Lütfen tekrar giriş yapın.");
      router.push("/login");
      return;
    }

    if (!selectedClassId) {
      alert("Önce bir sınıf seçmelisin.");
      return;
    }

    if (!title.trim() || !videoUrl.trim()) {
      alert("Ders başlığı ve video linki zorunlu.");
      return;
    }

    const selectedClass = classes.find(
      (classItem) => classItem.id === selectedClassId
    );

    if (!selectedClass) {
      alert("Seçilen sınıf bulunamadı.");
      return;
    }

    let allLessons: LessonItem[] = [];

const { data: existingLessons } = await supabase
  .from("teacher_lessons")
  .select("*");

allLessons =
  existingLessons?.map((lesson: any) => ({
    id: lesson.id,
    level: lesson.level,
    classId: lesson.class_id,
    className: lesson.class_name,
    teacherId: lesson.teacher_id,
    teacherName: lesson.teacher_name,
    title: lesson.title,
    videoUrl: lesson.video_url,
    packageType: lesson.package_type,
    contentType: lesson.content_type,
    pdfTitle: lesson.pdf_title,
    pdfUrl: lesson.pdf_url,
    pdfVisibility: lesson.pdf_visibility,
    homework: lesson.homework,
    worksheets: lesson.worksheets || [],
  })) || [];

    const lessonData: LessonItem = {
      id: editingLessonId || crypto.randomUUID(),
      level: selectedClass.level,
      classId:
  packageType === "practice" || packageType === "master"
    ? ""
    : selectedClass.id,
      className: selectedClass.name,
      teacherId: selectedClass.teacherId || currentTeacherId,
      teacherName: selectedClass.teacherName || currentTeacherName,
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      packageType: isExpertTeacher ? packageType : "starter",
      pdfVisibility: isExpertTeacher ? pdfVisibility : "classOnly",
      contentType:
  packageType === "practice" || packageType === "master"
    ? "digitalPackage"
    : contentType,
      pdfTitle: pdfTitle.trim(),
      pdfUrl: pdfUrl.trim(),
      homework: homework.trim(),
      worksheets,
worksheetTitle: worksheetTitle.trim(),
worksheetUrl: worksheetUrl.trim(),
worksheetPackageType: isExpertTeacher ? worksheetPackageType : "starter",
    };

    const updatedAllLessons = editingLessonId
      ? allLessons.map((lesson) =>
          lesson.id === editingLessonId ? lessonData : lesson
        )
      : [...allLessons, lessonData];

    const lessonToSave = {
  id: lessonData.id,
  level: lessonData.level,
  class_id: lessonData.classId || null,
  class_name: lessonData.className,
  teacher_id: lessonData.teacherId,
  teacher_name: lessonData.teacherName,
  title: lessonData.title,
  video_url: lessonData.videoUrl,
  package_type: lessonData.packageType,
  content_type: lessonData.contentType,
  pdf_title: lessonData.pdfTitle,
  pdf_url: lessonData.pdfUrl,
  pdf_visibility: lessonData.pdfVisibility,
  homework: lessonData.homework,
  worksheets: lessonData.worksheets || [],
};

const { error } = await supabase
  .from("teacher_lessons")
  .upsert([lessonToSave]);

if (error) {
  alert("Supabase kayıt hatası.");
  console.log(error);
  return;
}

    const { data: refreshedLessons } = await supabase
  .from("teacher_lessons")
  .select("*")
  .order("created_at", { ascending: false });

const teacherClassIds = classes.map((classItem) => classItem.id);

const mappedLessons = (refreshedLessons || []).map((lesson: any) => ({
  id: lesson.id,
  level: lesson.level,
  classId: lesson.class_id,
  className: lesson.class_name,
  teacherId: lesson.teacher_id,
  teacherName: lesson.teacher_name,
  title: lesson.title,
  videoUrl: lesson.video_url,
  packageType: lesson.package_type,
  contentType: lesson.content_type,
  pdfTitle: lesson.pdf_title,
  pdfUrl: lesson.pdf_url,
  pdfVisibility: lesson.pdf_visibility,
  homework: lesson.homework,
  worksheets: lesson.worksheets || [],
}));

setLessons(
  mappedLessons.filter((lesson) =>
    teacherClassIds.includes(lesson.classId)
  )
);

alert(editingLessonId ? "Ders güncellendi." : "Ders içeriği eklendi.");

    resetForm();
  }

  function handleEditLesson(lesson: LessonItem) {

    setEditingLessonId(lesson.id);
    setSelectedClassId(lesson.classId);
    setTitle(lesson.title);
    setVideoUrl(lesson.videoUrl);
    setPackageType(lesson.packageType);
    setContentType(lesson.contentType);
    setPdfTitle(lesson.pdfTitle);
    setPdfUrl(lesson.pdfUrl);
    setHomework(lesson.homework);
    setWorksheetTitle(lesson.worksheetTitle || "");
setWorksheetUrl(lesson.worksheetUrl || "");
setWorksheetPackageType(lesson.worksheetPackageType || "practice");
setWorksheets(
  lesson.worksheets ||
    (lesson.worksheetTitle && lesson.worksheetUrl
      ? [
          {
            id: crypto.randomUUID(),
            title: lesson.worksheetTitle,
            url: lesson.worksheetUrl,
            packageType: lesson.worksheetPackageType || "practice",
          },
        ]
      : [])
);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteLesson(lessonId: string) {
    const savedLessons = localStorage.getItem("teacher_lessons");
    const allLessons: LessonItem[] = savedLessons ? JSON.parse(savedLessons) : [];

    const targetLesson = allLessons.find((lesson) => lesson.id === lessonId);

    if (!targetLesson) {
      alert("Ders bulunamadı.");
      return;
    }

    const updatedAllLessons = allLessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    localStorage.setItem("teacher_lessons", JSON.stringify(updatedAllLessons));

    const teacherClassIds = classes.map((classItem) => classItem.id);

setLessons(
  updatedAllLessons.filter((lesson) =>
    teacherClassIds.includes(lesson.classId)
  )
);
    if (editingLessonId === lessonId) {
      resetForm();
    }
  }
  function convertPracticeLessonsToDigitalPackage() {
  const savedLessons = localStorage.getItem("teacher_lessons");
  const allLessons: LessonItem[] = savedLessons ? JSON.parse(savedLessons) : [];

  const updatedLessons = allLessons.map((lesson) => {
    if (lesson.level === "A1" && lesson.packageType === "practice") {
      return {
        ...lesson,
        contentType: "digitalPackage" as ContentType,
      };
    }

    return lesson;
  });

  localStorage.setItem("teacher_lessons", JSON.stringify(updatedLessons));

  const teacherClassIds = classes.map((classItem) => classItem.id);

  setLessons(
    updatedLessons.filter((lesson) =>
      teacherClassIds.includes(lesson.classId)
    )
  );

  alert("A1 Gelişim dersleri dijital paket içeriğine dönüştürüldü.");
}

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">
            Öğretmen Paneli
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Ders ve Materyal Yönetimi
          </h1>

          <p className="mt-3 text-slate-600">
            Sadece size atanmış sınıflara ders kaydı, PDF materyali ve ödev
            ekleyebilirsiniz.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Aktif öğretmen ID:{" "}
            <span className="font-bold text-slate-900">{currentTeacherId}</span>
            <p className="mt-2 text-sm font-bold text-purple-700">
  Öğretmen tipi: {isExpertTeacher ? "Uzman Öğretmen" : "Normal Öğretmen"}
</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Çıkış Yap
          </button>

          {classes.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              Size atanmış sınıf bulunmuyor. Admin panelinde sınıf oluştururken
              öğretmen ID şu değerle aynı olmalı:{" "}
              <span className="font-bold">{currentTeacherId}</span>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {editingLessonId && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
                  Düzenleme modundasınız. Değişiklikleri yaptıktan sonra “Dersi
                  Güncelle” butonuna basın.
                </div>
              )}

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
  <p className="text-xs font-black uppercase tracking-widest text-blue-700">
    1. Ders Bilgileri
  </p>
  <h2 className="mt-1 text-xl font-black text-slate-900">
    Video dersi oluştur
  </h2>
  <p className="mt-2 text-sm text-slate-600">
    Önce dersin sınıfını, başlığını, video linkini ve hangi pakete ait olduğunu seçin.
  </p>

  <div className="mt-5 grid gap-4">
    <select
      value={selectedClassId}
      onChange={(e) => setSelectedClassId(e.target.value)}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    >
      {classes.map((classItem) => (
        <option key={classItem.id} value={classItem.id}>
          {classItem.name} — {classItem.teacherName}
        </option>
      ))}
    </select>

    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Ders başlığı örn: 1. Ders - Tanışma ve Alfabe"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />

    <input
      value={videoUrl}
      onChange={(e) => setVideoUrl(e.target.value)}
      placeholder="YouTube ders kayıt linki"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />

    <select
      value={contentType}
      onChange={(e) => setContentType(e.target.value as ContentType)}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    >
      <option value="liveClass">Canlı sınıf dersi</option>
      <option value="digitalPackage">Dijital paket içeriği</option>
    </select>

    <select
      value={packageType}
      onChange={(e) => setPackageType(e.target.value as PackageType)}
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    >
      <option value="starter">Başlangıç paket dersi</option>
      <option value="practice">Gelişim paket dersi</option>
      <option value="master">Zirve paket dersi</option>
    </select>
    
  </div>
</div>

<div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
    2. Ana PDF Materyali
  </p>
  <h2 className="mt-1 text-xl font-black text-slate-900">
    Bu derse ait ana PDF
  </h2>
  <p className="mt-2 text-sm text-slate-600">
    Bu PDF, dersin temel notu olarak videonun altında açık şekilde gösterilir.
  </p>

  <div className="mt-5 grid gap-4">
    <input
      value={pdfTitle}
      onChange={(e) => setPdfTitle(e.target.value)}
      placeholder="PDF başlığı örn: A1 Ders Notları"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />

    <input
      value={pdfUrl}
      onChange={(e) => setPdfUrl(e.target.value)}
      placeholder="PDF linki"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />
    {isExpertTeacher && (
  <div className="rounded-2xl border border-emerald-200 bg-white p-4">
    <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
      PDF görünürlüğü
    </p>

    <p className="mt-2 text-sm text-slate-600">
      Bu PDF sadece canlı sınıf öğrencilerine mi görünsün, yoksa dijital paket
      materyali olarak da açılsın mı?
    </p>

    <div className="mt-4 grid gap-2 md:grid-cols-2">
      <button
        type="button"
        onClick={() => setPdfVisibility("classOnly")}
        className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
          pdfVisibility === "classOnly"
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Sadece bu canlı sınıfta göster
      </button>

      <button
        type="button"
        onClick={() => setPdfVisibility("digitalPackage")}
        className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
          pdfVisibility === "digitalPackage"
            ? "bg-emerald-600 text-white shadow-lg"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        Dijital paket materyali olarak da göster
      </button>
    </div>
  </div>
)}
  </div>
</div>

<div className="mt-4 rounded-3xl border border-orange-100 bg-orange-50 p-5">
  <p className="text-xs font-black uppercase tracking-widest text-orange-700">
    3. Ek Çalışma Sayfaları
  </p>
  <h2 className="mt-1 text-xl font-black text-slate-900">
    Bu derse ek materyal ekle
  </h2>
  <p className="mt-2 text-sm text-slate-600">
    Buraya birden fazla çalışma sayfası ekleyebilirsiniz. Başlangıç öğrencisi açık materyali görür,
    Gelişim materyalini ise kilitli görür.
  </p>

  <div className="mt-5 grid gap-4">
    <select
  value={worksheetPackageType}
  onChange={(e) => setWorksheetPackageType(e.target.value as PackageType)}
  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
>
  <option value="starter">Başlangıç çalışma sayfası</option>

  {isExpertTeacher && (
    <>
      <option value="practice">Gelişim çalışma sayfası</option>
      <option value="master">Zirve çalışma sayfası</option>
    </>
  )}
</select>

    <input
      value={worksheetTitle}
      onChange={(e) => setWorksheetTitle(e.target.value)}
      placeholder="Çalışma sayfası başlığı örn: A1 Ek Alıştırmalar"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />

    <input
      value={worksheetUrl}
      onChange={(e) => setWorksheetUrl(e.target.value)}
      placeholder="Çalışma sayfası PDF linki"
      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
    />

    <button
      type="button"
      onClick={() => {
        if (!worksheetTitle.trim() || !worksheetUrl.trim()) {
          alert("Çalışma sayfası başlığı ve linki gerekli.");
          return;
        }

        setWorksheets((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            title: worksheetTitle.trim(),
            url: worksheetUrl.trim(),
            packageType: worksheetPackageType,
          },
        ]);

        setWorksheetTitle("");
        setWorksheetUrl("");
        setWorksheetPackageType("practice");
      }}
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
    >
      + Çalışma Sayfasını Listeye Ekle
    </button>

    {worksheets.length > 0 && (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-bold text-slate-900">
          Eklenen Çalışma Sayfaları
        </p>

        <div className="mt-3 grid gap-2">
          {worksheets.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">
                  Paket: {getPackageLabel(item.packageType)}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setWorksheets((prev) =>
                    prev.filter((worksheet) => worksheet.id !== item.id)
                  )
                }
                className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

<div className="mt-4 rounded-3xl border border-purple-100 bg-purple-50 p-5">
  <p className="text-xs font-black uppercase tracking-widest text-purple-700">
    4. Ödev
  </p>
  <h2 className="mt-1 text-xl font-black text-slate-900">
    Öğrenciye görev ver
  </h2>
  <p className="mt-2 text-sm text-slate-600">
    Bu alana ders sonrası yapılacak ödevi yazın.
  </p>
</div>
              <textarea
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                placeholder="Ödev açıklaması"
                rows={4}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="button"
                  onClick={handleSaveLesson}
                  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  {editingLessonId ? "Dersi Güncelle" : "Dersi Kaydet"}
                </button>

                {editingLessonId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Düzenlemeyi İptal Et
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="mt-6 flex flex-wrap gap-3">
  <button
    type="button"
    onClick={() => setActiveClassFilter("all")}
    className={`rounded-full px-5 py-2 text-sm font-bold transition ${
      activeClassFilter === "all"
        ? "bg-blue-700 text-white"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
    }`}
  >
    Tüm Sınıflar
  </button>

  {classes.map((classItem) => (
    <button
      key={classItem.id}
      type="button"
      onClick={() => setActiveClassFilter(classItem.id)}
      className={`rounded-full px-5 py-2 text-sm font-bold transition ${
        activeClassFilter === classItem.id
          ? "bg-blue-700 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {classItem.name}
    </button>
  ))}
</div>
          <h2 className="text-2xl font-bold text-slate-900">
            Eklediğiniz Dersler
          </h2>

          {filteredLessons.length === 0 ? (
  <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-600">
    Bu sınıfta henüz ders içeriği yok.
  </p>
) : (
  <div className="mt-6 grid gap-6 lg:grid-cols-3">
    {(["starter", "practice", "master"] as PackageType[]).map((packageGroup) => {
      const packageLessons = filteredLessons.filter(
        (lesson) => lesson.packageType === packageGroup
      );

      return (
        <div
          key={packageGroup}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-700">
              {getPackageLabel(packageGroup)}
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-900">
              {packageLessons.length} ders
            </h3>
          </div>

          {packageLessons.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">
              Bu pakette henüz ders yok.
            </p>
          ) : (
            <div className="grid gap-4">
              {packageLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold text-blue-700">
                    {lesson.className} • {lesson.teacherName}
                  </p>

                  <h4 className="mt-2 font-bold text-slate-900">
                    {lesson.title}
                  </h4>

                  <p className="mt-2 text-sm font-semibold text-purple-700">
                    İçerik Türü: {getContentTypeLabel(lesson.contentType)}
                  </p>

                  <p className="mt-2 break-all text-sm text-slate-600">
                    Video: {lesson.videoUrl}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    PDF: {lesson.pdfTitle || "PDF eklenmedi"}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Ödev: {lesson.homework || "Ödev eklenmedi"}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Çalışma Sayfası:{" "}
                    {lesson.worksheetTitle || "Ek çalışma sayfası eklenmedi"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-orange-700">
                    Çalışma Sayfası Paketi:{" "}
                    {getPackageLabel(lesson.worksheetPackageType || "practice")}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditLesson(lesson)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Düzelt
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}
        </div>
      </div>
    </main>
  );
}