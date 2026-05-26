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
  isDefaultSalesClass: boolean;
  classType?: "live" | "digital";
};

export default function AdminClassesPage() {
  const router = useRouter();
const [allowed, setAllowed] = useState(false);

useEffect(() => {
  const raw = localStorage.getItem("mock_logged_user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user || user.role !== "admin") {
    router.replace("/login");
    return;
  }

  setAllowed(true);
}, [router]);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [isDefaultSalesClass, setIsDefaultSalesClass] = useState(false);
  const [classType, setClassType] = useState<"live" | "digital">("live");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  

  useEffect(() => {
  async function loadClasses() {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setClasses(
  (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    teacherId: item.teacher_id,
    teacherName: item.teacher_name,
    isDefaultSalesClass: item.is_default_sales_class,
    classType: item.class_type || "live",
  }))
);
  }

  loadClasses();
}, []);
  if (!allowed) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      Yetki kontrol ediliyor...
    </main>
  );
}

  const liveClasses = classes.filter(
  (classItem) => (classItem.classType || "live") === "live"
);

const digitalClasses = classes.filter(
  (classItem) => classItem.classType === "digital"
);
  async function handleAddClass() {
    if (!name || !teacherName || !teacherId) {
      alert("Sınıf adı, öğretmen adı ve öğretmen ID zorunlu.");
      return;
    }

    let updatedClasses = [...classes];

    if (isDefaultSalesClass) {
      updatedClasses = updatedClasses.map((classItem) => {
        if (
  classItem.level === level &&
  classItem.classType === classType
) {
          return {
            ...classItem,
            isDefaultSalesClass: false,
          };
        }

        return classItem;
      });
    }

    const newClass: ClassItem = {
      id: editingClassId || `${level.toLowerCase()}-${Date.now()}`,
      name,
      level,
      teacherName,
      teacherId,
      isDefaultSalesClass,
      classType,
    };

    updatedClasses = editingClassId
  ? updatedClasses.map((classItem) =>
      classItem.id === editingClassId ? newClass : classItem
    )
  : [...updatedClasses, newClass];

    setClasses(updatedClasses);
    if (editingClassId) {
  const { error } = await supabase
    .from("classes")
    .update({
      name,
      level,
      teacher_id: teacherId,
      teacher_name: teacherName,
      is_default_sales_class: isDefaultSalesClass,
      class_type: classType,
    })
    .eq("id", editingClassId);

  if (error) {
    alert("Sınıf güncellenemedi.");
    return;
  }
} else {
  const { error } = await supabase.from("classes").insert({
    name,
    level,
    teacher_id: teacherId,
    teacher_name: teacherName,
    is_default_sales_class: isDefaultSalesClass,
    class_type: classType,
  });

  if (error) {
    alert("Sınıf oluşturulamadı.");
    return;
  }
}

const { data } = await supabase
  .from("classes")
  .select("*")
  .order("created_at", { ascending: false });

setClasses(
  (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    teacherId: item.teacher_id,
    teacherName: item.teacher_name,
    isDefaultSalesClass: item.is_default_sales_class,
    classType: item.class_type || "live",
  }))
);

    setName("");
    setLevel("A1");
    setTeacherName("");
    setTeacherId("");
    setIsDefaultSalesClass(false);
    setClassType("live");
setEditingClassId(null);

    alert("Sınıf oluşturuldu.");
  }

  function handleEditClass(classItem: ClassItem) {
  setEditingClassId(classItem.id);
  setName(classItem.name);
  setLevel(classItem.level);
  setTeacherName(classItem.teacherName);
  setTeacherId(classItem.teacherId);
  setIsDefaultSalesClass(classItem.isDefaultSalesClass);
  setClassType(classItem.classType || "live");

  window.scrollTo({ top: 0, behavior: "smooth" });
}
  async function handleDeleteClass(id: string) {
  const confirmed = confirm("Bu sınıfı silmek istediğinizden emin misiniz?");
  if (!confirmed) return;

  const { data, error } = await supabase
    .from("classes")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    alert("Sınıf silinemedi: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("Silinecek sınıf bulunamadı. ID eşleşmedi.");
    return;
  }

  const { data: freshClasses, error: loadError } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: false });

  if (loadError) {
    alert("Sınıflar yeniden yüklenemedi: " + loadError.message);
    return;
  }

  setClasses(freshClasses || []);
  alert("Sınıf veritabanından silindi.");
}

  async function handleMakeDefault(id: string) {
  const targetClass = classes.find((item) => item.id === id);

  if (!targetClass) return;

  const { error: resetError } = await supabase
    .from("classes")
    .update({ is_default_sales_class: false })
    .eq("level", targetClass.level)
    .eq("class_type", targetClass.classType || "live");

  if (resetError) {
    alert("Varsayılan sınıflar sıfırlanamadı.");
    return;
  }

  const { error: updateError } = await supabase
    .from("classes")
    .update({ is_default_sales_class: true })
    .eq("id", id);

  if (updateError) {
    alert("Varsayılan sınıf güncellenemedi.");
    return;
  }

  const { data } = await supabase
    .from("classes")
    .select("*")
    .order("created_at", { ascending: false });

  setClasses(
  (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    teacherId: item.teacher_id,
    teacherName: item.teacher_name,
    isDefaultSalesClass: item.is_default_sales_class,
    classType: item.class_type || "live",
  }))
);

  alert(`${targetClass.level} için varsayılan satış sınıfı güncellendi.`);
}

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">Admin Paneli</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Sınıf Yönetimi
          </h1>

          <p className="mt-3 text-slate-600">
            Buradan seviye bazlı sınıf oluşturabilir, öğretmen atayabilir ve
            satış sonrası öğrencinin otomatik düşeceği varsayılan sınıfı
            belirleyebilirsin.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sınıf adı örn: A1 Akşam Grubu - Ahmet Hoca"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as "A1" | "A2" | "B1")}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
            <select
  value={classType}
  onChange={(e) => setClassType(e.target.value as "live" | "digital")}
  className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
>
  <option value="live">Canlı kurs sınıfı</option>
  <option value="digital">Dijital paket sınıfı</option>
</select>

            <input
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Öğretmen adı örn: Ahmet Hoca"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />

            <input
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="Öğretmen ID örn: teacher-ahmet"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />

            <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                checked={isDefaultSalesClass}
                onChange={(e) => setIsDefaultSalesClass(e.target.checked)}
              />
              <span>
                Bu sınıfı bu seviyenin varsayılan satış sınıfı yap
              </span>
            </label>

            <button
              onClick={handleAddClass}
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 md:col-span-2"
            >
              {editingClassId ? "Sınıfı Güncelle" : "Sınıf Oluştur"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Oluşturulan Sınıflar
          </h2>

          {classes.length === 0 ? (
  <p className="mt-4 text-slate-600">
    Henüz sınıf oluşturulmadı.
  </p>
) : (
  <div className="mt-6 grid gap-6 lg:grid-cols-2">
    <ClassColumn
      title="Canlı Kurs Sınıfları"
      desc="Canlı ders ve kayıt izleme süreci için kullanılan sınıflar."
      classes={liveClasses}
      emptyText="Henüz canlı kurs sınıfı yok."
      onEdit={handleEditClass}
      onDelete={handleDeleteClass}
      onMakeDefault={handleMakeDefault}
    />

    <ClassColumn
      title="Dijital Paket Sınıfları"
      desc="Başlangıç, Gelişim ve Zirve dijital içerikleri için kullanılan sınıflar."
      classes={digitalClasses}
      emptyText="Henüz dijital paket sınıfı yok."
      onEdit={handleEditClass}
      onDelete={handleDeleteClass}
      onMakeDefault={handleMakeDefault}
    />
  </div>
)}
        </div>
      </div>
    </main>
  );
}
function ClassColumn({
  title,
  desc,
  classes,
  emptyText,
  onEdit,
  onDelete,
  onMakeDefault,
}: {
  title: string;
  desc: string;
  classes: ClassItem[];
  emptyText: string;
  onEdit: (classItem: ClassItem) => void;
  onDelete: (id: string) => void;
  onMakeDefault: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-xl font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>

      {classes.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-5 grid gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-blue-700">
                  {classItem.level}
                </p>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                    classItem.classType === "digital"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {classItem.classType === "digital" ? "DİJİTAL" : "CANLI"}
                </span>

                {classItem.isDefaultSalesClass && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Varsayılan satış sınıfı
                  </span>
                )}
              </div>

              <h4 className="mt-3 font-bold text-slate-900">
                {classItem.name}
              </h4>

              <p className="mt-1 text-sm text-slate-600">
                Öğretmen: {classItem.teacherName} — ID: {classItem.teacherId}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => onEdit(classItem)}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Düzenle
                </button>

                <button
                  onClick={() => onMakeDefault(classItem.id)}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Varsayılan Yap
                </button>

                <button
                  onClick={() => onDelete(classItem.id)}
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
}