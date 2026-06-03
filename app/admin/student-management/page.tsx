"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
};

export default function StudentManagementPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
const [studentFilter, setStudentFilter] = useState<
  "all" | "live" | "digital" | "passive"
>("all");
const [newStudentName, setNewStudentName] = useState("");
const [newStudentEmail, setNewStudentEmail] = useState("");
const [newStudentLevels, setNewStudentLevels] = useState<("A1" | "A2" | "B1")[]>(["A1"]);

  useEffect(() => {
  async function loadStudents() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert("Öğrenciler yüklenemedi.");
      return;
    }

    setStudents(data || []);
    const { data: orderData } = await supabase
  .from("orders")
  .select("*");

setOrders(orderData || []);
  }

  loadStudents();
}, []);

  const getStudentOrders = (student: User) => {
  const email = String(student.email || student.username || "")
    .trim()
    .toLowerCase();

  return orders.filter(
    (order) =>
      String(order.username || "")
        .trim()
        .toLowerCase() === email
  );
};

const getStudentType = (student: User) => {
  const studentOrders = getStudentOrders(student);

  if (studentOrders.some((order) => String(order.product_slug || "").startsWith("live-"))) {
    return "Canlı";
  }

  if (studentOrders.length > 0) {
    return "Dijital";
  }

  return "Belirsiz";
};

const filteredStudents = students.filter((student) => {
  if (studentFilter === "all") return true;
  if (studentFilter === "passive") return !student.is_active;

  const type = getStudentType(student);

  if (studentFilter === "live") return type === "Canlı";
  if (studentFilter === "digital") return type === "Dijital";

  return true;
});
async function handleAddLiveStudent() {
  const email = newStudentEmail.trim().toLowerCase();
  const name = newStudentName.trim();

  if (!email || !name) {
    alert("Ad soyad ve email zorunlu.");
    return;
  }

  if (newStudentLevels.length === 0) {
    alert("En az bir seviye seçmelisin.");
    return;
  }

  const { data: existingUsers } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (existingUsers && existingUsers.length > 0) {
    await supabase
      .from("users")
      .update({
        name,
        role: "student",
        is_active: true,
      })
      .eq("email", email);
  } else {
    const { error: userError } = await supabase.from("users").insert({
      name,
      email,
      password: "123456",
      role: "student",
      is_active: true,
    });

    if (userError) {
      alert("Öğrenci oluşturulamadı.");
      console.log(userError);
      return;
    }
  }

  for (const level of newStudentLevels) {
    const slug = `live-${level.toLowerCase()}`;

    const { data: existingOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("username", email)
      .eq("product_slug", slug)
      .limit(1);

    if (!existingOrders || existingOrders.length === 0) {
      const { error: orderError } = await supabase.from("orders").insert({
        username: email,
        product_slug: slug,
        level,
        status: "completed",
        is_activated: true,
      });

      if (orderError) {
        alert(`${level} siparişi oluşturulamadı.`);
        console.log(orderError);
        return;
      }
    }
  }

  alert("Canlı öğrenci başarıyla eklendi.");
  window.location.reload();
}
return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-6 text-3xl font-black">
  🎓 Öğrenci Yönetimi
</h1>

<div className="mb-6 grid gap-4 md:grid-cols-4">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <p className="text-sm font-black text-slate-400">Toplam Öğrenci</p>
    <p className="mt-2 text-3xl font-black text-white">{students.length}</p>
  </div>

  <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
    <p className="text-sm font-black text-emerald-200">Canlı Öğrenci</p>
    <p className="mt-2 text-3xl font-black text-emerald-100">
      {students.filter((student) => getStudentType(student) === "Canlı").length}
    </p>
  </div>

  <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-5">
    <p className="text-sm font-black text-blue-200">Dijital Öğrenci</p>
    <p className="mt-2 text-3xl font-black text-blue-100">
      {students.filter((student) => getStudentType(student) === "Dijital").length}
    </p>
  </div>

  <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
    <p className="text-sm font-black text-red-200">Pasif Öğrenci</p>
    <p className="mt-2 text-3xl font-black text-red-100">
      {students.filter((student) => !student.is_active).length}
    </p>
  </div>
</div>
        <div className="mb-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
  <h2 className="text-xl font-black text-white">
    ➕ Canlı Öğrenci Ekle
  </h2>

  <div className="mt-4 grid gap-3 md:grid-cols-3">
    <input
      value={newStudentName}
      onChange={(e) => setNewStudentName(e.target.value)}
      placeholder="Ad Soyad"
      className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900"
    />

    <input
      value={newStudentEmail}
      onChange={(e) => setNewStudentEmail(e.target.value)}
      placeholder="Email"
      className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900"
    />

    <button
      type="button"
      onClick={handleAddLiveStudent}
      className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-white hover:bg-emerald-600"
    >
      Öğrenciyi Ekle
    </button>
  </div>

  <div className="mt-4 flex flex-wrap gap-3">
    {(["A1", "A2", "B1"] as const).map((level) => (
      <button
        key={level}
        type="button"
        onClick={() => {
          setNewStudentLevels((prev) =>
            prev.includes(level)
              ? prev.filter((item) => item !== level)
              : [...prev, level]
          );
        }}
        className={`rounded-full px-5 py-2 text-sm font-black transition ${
          newStudentLevels.includes(level)
            ? "bg-yellow-400 text-slate-950"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {newStudentLevels.includes(level) ? "✓" : "＋"} {level}
      </button>
    ))}
  </div>

  <p className="mt-3 text-xs text-emerald-100">
    Geçici şifre: <span className="font-black">123456</span>
  </p>
</div>
        <div className="mb-5 flex flex-wrap gap-3">
  {[
    { key: "all", label: "Tüm Öğrenciler" },
    { key: "live", label: "Canlı Öğrenciler" },
    { key: "digital", label: "Dijital Öğrenciler" },
    { key: "passive", label: "Pasifler" },
  ].map((item) => (
    <button
      key={item.key}
      type="button"
      onClick={() => setStudentFilter(item.key as any)}
      className={`rounded-full px-5 py-2 text-sm font-black transition ${
        studentFilter === item.key
          ? "bg-yellow-400 text-slate-950"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {item.label}
    </button>
  ))}
</div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">Kullanıcı</th>
                <th className="p-4 text-left">Ad Soyad</th>
                <th className="p-4 text-left">Durum</th>
                <th className="p-4 text-left">Tip</th>
                <th className="p-4 text-left">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id || student.email || student.username}
                  className="border-t border-white/10"
                >
                  <td className="p-4">
  {student.email || student.username || "-"}
</td>

                  <td className="p-4">
  {student.name || student.full_name || "-"}
</td>

                  <td className="p-4">
                    {student.is_active ? (
                      <span className="text-emerald-400">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-red-400">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="p-4">
  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
    {getStudentType(student)}
  </span>
</td>
<td className="p-4">
  <button
    type="button"
    onClick={async () => {
  const studentEmail = String(student.email || "")
    .trim()
    .toLowerCase();

  if (!student.id) {
    alert("Bu öğrencinin ID bilgisi yok. Silinemiyor.");
    return;
  }

  const confirmed = window.confirm(
    `${studentEmail || student.name} hesabını kalıcı olarak silmek istediğinizden emin misiniz?`
  );

  if (!confirmed) return;

  await supabase
    .from("orders")
    .delete()
    .eq("username", studentEmail);

  await supabase
  .from("users")
  .update({ is_active: true })
  .eq("id", student.id);
    const { data: deletedUsers, error: userError } = await supabase
    .from("users")
    .delete()
    .eq("id", student.id)
    .select();

  if (userError) {
    alert(JSON.stringify(userError, null, 2));
    return;
  }
  setStudents((prev) =>
    prev.filter((item) => item.id !== student.id)
  );

  setOrders((prev) =>
    prev.filter(
      (order) =>
        String(order.username || "").trim().toLowerCase() !== studentEmail
    )
  );

  alert("Öğrenci kalıcı olarak silindi.");
}}
    className="rounded-xl bg-red-500/15 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/25"
  >
    Sil
  </button>
</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </main>
  );
}