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
  }

  loadStudents();
}, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-6 text-3xl font-black">
          🎓 Öğrenci Yönetimi
        </h1>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">Kullanıcı</th>
                <th className="p-4 text-left">Ad Soyad</th>
                <th className="p-4 text-left">Durum</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
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
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>
    </main>
  );
}