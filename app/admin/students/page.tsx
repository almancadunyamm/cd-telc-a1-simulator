"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ClassItem = {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1";
  teacherId: string;
  teacherName: string;
};

type StudentAccess = {
  username: string;
  mainClassId: string;
  extraClassAccess: string[];
};

export default function AdminStudentsPage() {
    const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [username, setUsername] = useState("ogrenci");
  const [mainClassId, setMainClassId] = useState("");
  const [studentAccessList, setStudentAccessList] = useState<StudentAccess[]>([]);

  useEffect(() => {
  async function loadData() {
    const { data: classesFromDb, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Sınıflar yüklenemedi: " + error.message);
      return;
    }

    const mappedClasses = (classesFromDb || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      level: item.level,
      teacherId: item.teacher_id,
      teacherName: item.teacher_name,
    }));

    setClasses(mappedClasses);

    if (mappedClasses.length > 0) {
      setMainClassId(mappedClasses[0].id);
    }

    const savedAccess = localStorage.getItem("student_class_access");
    if (savedAccess) {
      setStudentAccessList(JSON.parse(savedAccess));
    }
  }

  loadData();
}, []);
    useEffect(() => {
    const raw = localStorage.getItem("mock_logged_user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Yetki kontrol ediliyor...
      </main>
    );
  }

  function handleSaveAccess() {
    if (!username || !mainClassId) {
      alert("Öğrenci kullanıcı adı ve sınıf seçimi zorunlu.");
      return;
    }

    const updatedList = [
      ...studentAccessList.filter((item) => item.username !== username),
      {
        username,
        mainClassId,
        extraClassAccess: [],
      },
    ];

    setStudentAccessList(updatedList);
    localStorage.setItem("student_class_access", JSON.stringify(updatedList));

    alert("Öğrenci sınıfa atandı.");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">Admin Paneli</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Öğrenci Sınıf Atama
          </h1>

          <p className="mt-3 text-slate-600">
            Öğrenciyi hangi sınıfa atarsan, öğrenci panelinde sadece o sınıfın
            dersleri açık görünür.
          </p>

          {classes.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              Önce <strong>/admin/classes</strong> sayfasından sınıf oluşturmalısın.
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Öğrenci kullanıcı adı örn: ogrenci"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <select
                value={mainClassId}
                onChange={(e) => setMainClassId(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              >
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} — {classItem.teacherName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSaveAccess}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Öğrenciyi Sınıfa Ata
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Atanan Öğrenciler
          </h2>

          {studentAccessList.length === 0 ? (
            <p className="mt-4 text-slate-600">Henüz öğrenci atanmadı.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {studentAccessList.map((item) => {
                const classInfo = classes.find(
                  (classItem) => classItem.id === item.mainClassId
                );

                return (
                  <div
                    key={item.username}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="font-bold text-slate-900">
                      Kullanıcı: {item.username}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Sınıf: {classInfo?.name ?? item.mainClassId}
                    </p>
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