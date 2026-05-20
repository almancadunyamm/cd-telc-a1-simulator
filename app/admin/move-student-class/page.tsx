"use client";

import { useEffect, useMemo, useState } from "react";

type Level = "A1" | "A2" | "B1";

type AdminClass = {
  id: string;
  name: string;
  level: Level;
  teacherName: string;
  teacherId: string;
};

type StudentClassAccess = {
  username: string;
  mainClassId: string;
  extraClassAccess: string[];
};

export default function MoveStudentClassPage() {
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [accessList, setAccessList] = useState<StudentClassAccess[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rawClasses = localStorage.getItem("admin_classes");
    const rawAccess = localStorage.getItem("student_class_access");

    setClasses(rawClasses ? JSON.parse(rawClasses) : []);
    setAccessList(rawAccess ? JSON.parse(rawAccess) : []);
  }, []);

  const selectedAccess = useMemo(() => {
    return accessList.find((item) => item.username === selectedUsername);
  }, [accessList, selectedUsername]);

  const currentMainClass = classes.find(
    (item) => item.id === selectedAccess?.mainClassId
  );

  function handleMoveStudent() {
    if (!selectedUsername || !selectedClassId) {
      setMessage("Lütfen öğrenci ve yeni sınıf seçin.");
      return;
    }

    const updatedAccessList = accessList.map((access) => {
      if (access.username !== selectedUsername) return access;

      const oldMainClassId = access.mainClassId;

      const extraClassAccess = Array.from(
        new Set([
          ...(access.extraClassAccess || []),
          oldMainClassId,
        ].filter((id) => id && id !== selectedClassId))
      );

      return {
        ...access,
        mainClassId: selectedClassId,
        extraClassAccess,
      };
    });

    localStorage.setItem(
      "student_class_access",
      JSON.stringify(updatedAccessList)
    );

    setAccessList(updatedAccessList);
    setMessage("Öğrenci yeni aktif canlı sınıfa taşındı.");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Admin İşlemi
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Öğrenciyi Aktif Canlı Sınıfa Taşı
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          A1 kuru biten öğrenciyi A2 aktif sınıfına, A2 kuru biten öğrenciyi B1
          aktif sınıfına taşıyabilirsiniz. Eski ana sınıf otomatik olarak arşiv
          erişimine eklenir.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700">
              Öğrenci
            </label>

            <select
              value={selectedUsername}
              onChange={(e) => {
                setSelectedUsername(e.target.value);
                setMessage("");
              }}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Öğrenci seçin</option>

              {accessList.map((access) => (
                <option key={access.username} value={access.username}>
                  {access.username}
                </option>
              ))}
            </select>
          </div>

          {selectedAccess && (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                Mevcut aktif sınıf:{" "}
                <span className="font-black">
                  {currentMainClass?.name || "Sınıf bulunamadı"}
                </span>
              </p>

              <p className="mt-1">
                Arşiv sınıf sayısı:{" "}
                <span className="font-black">
                  {selectedAccess.extraClassAccess?.length || 0}
                </span>
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-slate-700">
              Yeni aktif canlı sınıf
            </label>

            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setMessage("");
              }}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Yeni sınıf seçin</option>

              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.level} - {classItem.name} / {classItem.teacherName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleMoveStudent}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-4 text-sm font-black text-white shadow-lg hover:from-blue-700 hover:to-indigo-600"
          >
            Öğrenciyi Yeni Sınıfa Taşı
          </button>

          {message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}