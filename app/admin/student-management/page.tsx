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
return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-6 text-3xl font-black">
          🎓 Öğrenci Yönetimi
        </h1>

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
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </main>
  );
}