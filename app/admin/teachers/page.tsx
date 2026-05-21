"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type TeacherItem = {
  teacherType?: "teacher" | "expertTeacher";
  id: string;
  name: string;
  email: string;
  teacherId: string;
  password: string;
  whatsapp?: string;
};

const TEACHERS_KEY = "admin_teachers";

export default function AdminTeachersPage() {
    const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teacherType, setTeacherType] = useState<
  "teacher" | "expertTeacher"
>("teacher");
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const rawTeachers = localStorage.getItem(TEACHERS_KEY);
    setTeachers(rawTeachers ? JSON.parse(rawTeachers) : []);
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
  function handleAddTeacher() {
    if (!name || !email || !teacherId || !password || !whatsapp) {
  alert("Tüm alanları doldurun.");
  return;
}

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı.");
      return;
    }

    const alreadyExists = teachers.some(
  (teacher) =>
    teacher.id !== editingTeacherId &&
    (
      teacher.email.trim().toLowerCase() ===
        email.trim().toLowerCase() ||
      teacher.teacherId.trim().toLowerCase() ===
        teacherId.trim().toLowerCase()
    )
);

    if (alreadyExists) {
      alert("Bu email veya öğretmen ID zaten kayıtlı.");
      return;
    }

    if (editingTeacherId) {
  const updatedTeachers = teachers.map((teacher) =>
    teacher.id === editingTeacherId
      ? {
    ...teacher,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    teacherType,
    teacherId: teacherId.trim().toLowerCase(),
    password: password.trim(),
    whatsapp: whatsapp.trim(),
  }
      : teacher
  );

  setTeachers(updatedTeachers);
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(updatedTeachers));

  setEditingTeacherId(null);

  setName("");
  setEmail("");
  setTeacherId("");
  setPassword("");
  setWhatsapp("");
  setTeacherType("teacher");

  alert("Öğretmen güncellendi.");
  return;
}
    const newTeacher: TeacherItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      teacherType,
      teacherId: teacherId.trim().toLowerCase(),
password: password.trim(),
whatsapp: whatsapp.trim(),
    };

    const updatedTeachers = [...teachers, newTeacher];

    setTeachers(updatedTeachers);
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(updatedTeachers));

    setName("");
    setEmail("");
    setTeacherId("");
    setPassword("");
    setWhatsapp("");

    alert("Öğretmen eklendi.");
  }

  function handleEditTeacher(teacher: TeacherItem) {
  setEditingTeacherId(teacher.id);

  setName(teacher.name);
  setEmail(teacher.email);
  setTeacherType(teacher.teacherType || "teacher");
  setTeacherId(teacher.teacherId);
  setPassword(teacher.password);
  setWhatsapp(teacher.whatsapp || "");
}
  function handleDeleteTeacher(id: string) {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);

    setTeachers(updatedTeachers);
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(updatedTeachers));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/admin"
          className="text-sm font-bold text-slate-300 hover:text-white"
        >
          ← Admin merkeze dön
        </a>

        <header className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-widest text-yellow-300">
            Öğretmen Yönetimi
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Öğretmen Hesapları
          </h1>

          <p className="mt-4 max-w-3xl text-slate-300">
            Öğretmenleri burada tanımlayın. Buradaki öğretmen ID ile sınıf
            oluştururken yazılan öğretmen ID aynı olmalıdır.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Yeni Öğretmen Ekle</h2>

            <div className="mt-6 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad Soyad örn: Ahmet Hoca"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email örn: ahmet@test.com"
                type="email"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />
              <select
  value={teacherType}
  onChange={(e) =>
    setTeacherType(e.target.value as "teacher" | "expertTeacher")
  }
  className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
>
  <option value="teacher">
    Normal Öğretmen
  </option>

  <option value="expertTeacher">
    Uzman Öğretmen
  </option>
</select>

              <input
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Öğretmen ID örn: ahmet-hoca"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre en az 6 karakter"
                type="password"
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
              />
              <input
  value={whatsapp}
  onChange={(e) => setWhatsapp(e.target.value)}
  placeholder="WhatsApp numarası örn: 905013434419"
  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400"
/>

              <button
                type="button"
                onClick={handleAddTeacher}
                className="rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
              >
                {editingTeacherId ? "Öğretmeni Güncelle" : "Öğretmen Ekle"}
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-sm text-blue-100">
              Önemli: Sınıf oluştururken yazdığınız öğretmen ID ile buradaki
              öğretmen ID aynı olmalı.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Kayıtlı Öğretmenler</h2>

            {teachers.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                Henüz öğretmen eklenmedi.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-black">{teacher.name}</h3>

                        <p className="mt-1 text-sm text-slate-300">
                          Email: {teacher.email}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
  {teacher.teacherType === "expertTeacher"
    ? "Uzman Öğretmen"
    : "Normal Öğretmen"}
</span>

                        <p className="mt-1 text-sm text-slate-300">
                          Öğretmen ID: {teacher.teacherId}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Şifre: {teacher.password}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
  WhatsApp: {teacher.whatsapp || "Eklenmedi"}
</p>
                      </div>

                      <button
  type="button"
  onClick={() => handleEditTeacher(teacher)}
  className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200 hover:bg-blue-500/20"
>
  Düzenle
</button>
                      <div className="flex gap-2">
  <button
    type="button"
    onClick={() => handleEditTeacher(teacher)}
    className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200 hover:bg-blue-500/20"
  >
    Düzenle
  </button>

  <button
    type="button"
    onClick={() => handleDeleteTeacher(teacher.id)}
    className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20"
  >
    Sil
  </button>
</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}