"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Level = "A1" | "A2" | "B1";

type AdminClass = {
  id: string;
  name: string;
  level: Level;
  isDefaultSalesClass?: boolean;
  classType?: "live" | "digital";
};

type StudentClassAccess = {
  username: string;
  mainClassId: string;
  extraClassAccess: string[];
};

const USERS_KEY = "users";
const ORDERS_KEY = "billing_orders";
const CLASSES_KEY = "admin_classes";
const ACCESS_KEY = "student_class_access";

const products = [
  { slug: "live-a1", label: "A1 Canlı Kurs" },
  { slug: "live-a1-a2", label: "A1 + A2 Canlı Kurs" },
  { slug: "live-a1-a2-b1", label: "A1 + A2 + B1 Canlı Kurs" },
  { slug: "live-a2", label: "A2 Canlı Kurs" },
  { slug: "live-a2-b1", label: "A2 + B1 Canlı Kurs" },
  { slug: "live-b1", label: "B1 Canlı Kurs" },
];

function getLevelsFromSlug(slug: string): Level[] {
  const normalized = slug.toLowerCase();
  const levels: Level[] = [];

  if (normalized.includes("a1")) levels.push("A1");
  if (normalized.includes("a2")) levels.push("A2");
  if (normalized.includes("b1")) levels.push("B1");

  return levels;
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export default function ManualActivatePage() {
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

if (!allowed) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      Yetki kontrol ediliyor...
    </main>
  );
}
  const [email, setEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [productSlug, setProductSlug] = useState("live-a1");
  const [message, setMessage] = useState("");

  function giveClassAccess(username: string, classId: string) {
    const rawAccess = localStorage.getItem(ACCESS_KEY);
    const accessList: StudentClassAccess[] = rawAccess
      ? JSON.parse(rawAccess)
      : [];

    const existingAccess = accessList.find((item) => item.username === username);

    let updatedAccessList: StudentClassAccess[];

    if (existingAccess) {
      updatedAccessList = accessList.map((item) => {
        if (item.username !== username) return item;

        const extraClassAccess = item.extraClassAccess || [];
        const alreadyHasClass =
          item.mainClassId === classId || extraClassAccess.includes(classId);

        return {
          ...item,
          mainClassId: item.mainClassId || classId,
          extraClassAccess: alreadyHasClass
            ? extraClassAccess
            : [...extraClassAccess, classId],
        };
      });
    } else {
      updatedAccessList = [
        ...accessList,
        {
          username,
          mainClassId: classId,
          extraClassAccess: [],
        },
      ];
    }

    localStorage.setItem(ACCESS_KEY, JSON.stringify(updatedAccessList));
  }

  function activateUser(username: string, name: string) {
  const rawUsers = localStorage.getItem(USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];

  const normalizedUsername = username.trim().toLowerCase();
  const cleanName = name.trim();

  const exists = users.some(
    (user: any) =>
      String(user.email || user.username || "").trim().toLowerCase() ===
      normalizedUsername
  );

  const updatedUsers = exists
    ? users.map((user: any) => {
        const userEmail = String(user.email || user.username || "")
          .trim()
          .toLowerCase();

        if (userEmail !== normalizedUsername) return user;

        return {
          ...user,
          email: normalizedUsername,
          username: normalizedUsername,
          password: user.password || "123456",
          role: "admin",
          label: cleanName,
          name: cleanName,
          isActive: true,
        };
      })
    : [
        ...users,
        {
          id: crypto.randomUUID(),
          email: normalizedUsername,
          username: normalizedUsername,
          password: "123456",
          role: "student",
          label: cleanName,
          name: cleanName,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}

  function handleActivate() {
    const username = email.trim().toLowerCase();

    if (!studentName.trim() || !username) {
  alert("Öğrenci adı soyadı ve email adresi gerekli.");
  return;
}

    const rawClasses = localStorage.getItem(CLASSES_KEY);
    const classes: AdminClass[] = rawClasses ? JSON.parse(rawClasses) : [];

    const levels = getLevelsFromSlug(productSlug);

    if (levels.length === 0) {
      alert("Paket seviyesi bulunamadı.");
      return;
    }

    for (const level of levels) {
      const defaultClass =
        classes.find(
          (item) =>
            item.level === level &&
            item.isDefaultSalesClass === true &&
            item.classType === "live"
        ) ||
        classes.find(
          (item) => item.level === level && item.isDefaultSalesClass === true
        );

      if (!defaultClass) {
        console.log("Varsayılan canlı sınıf yok, sınıf erişimi atlanıyor.");
      } else {
        giveClassAccess(username, defaultClass.id);
      }
    }

    activateUser(username, studentName);

    const rawOrders = localStorage.getItem(ORDERS_KEY);
    const orders = rawOrders ? JSON.parse(rawOrders) : [];

    const alreadyExists = orders.some(
      (order: any) =>
        order.username === username &&
        order.productSlug === productSlug &&
        order.status === "active"
    );

    const updatedOrders = alreadyExists
      ? orders
      : [
          ...orders,
          {
            id: crypto.randomUUID(),
            username,
            productSlug,
            status: "active",
            packageType: "starter",
            accessEndDate: addDays(90),
            createdAt: new Date().toISOString(),
            activatedAt: new Date().toISOString(),
            source: "manual_activate",
          },
        ];

    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));

    setMessage(`${studentName} için ${productSlug} aktif edildi. Giriş şifresi: 123456`);
setStudentName("");
setEmail("");    setEmail("");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Admin Paneli
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Manuel Canlı Kurs Aktivasyonu
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ödemesi daha önce alınmış öğrencileri tekrar ödeme ekranına
          göndermeden canlı kursa ekleyebilirsin.
        </p>

        <div className="mt-8 grid gap-4">
          <label className="text-sm font-bold text-slate-700">
  Öğrenci adı soyadı
</label>

<input
  value={studentName}
  onChange={(e) => setStudentName(e.target.value)}
  placeholder="Örn: Ahmet Yılmaz"
  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
/>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Öğrenci email adresi"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
          />

          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm"
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleActivate}
            className="rounded-2xl bg-blue-700 px-5 py-4 text-sm font-black text-white hover:bg-blue-800"
          >
            Öğrenciyi Aktifleştir
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}