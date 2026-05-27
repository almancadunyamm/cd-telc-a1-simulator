"use client";

import { activateBillingOrder, type BillingOrder } from "@/lib/billing/orders";
import { supabase } from "@/lib/supabase";
import { getAccessEndDateByProduct } from "../../../lib/access/access-control";
type Level = "A1" | "A2" | "B1";

type AdminClass = {
  id: string;
  name: string;
  level: Level;
  teacherName: string;
  teacherId: string;
  isDefaultSalesClass?: boolean;
  classType?: "live" | "digital";
};

type StudentClassAccess = {
  username: string;
  mainClassId: string;
  extraClassAccess: string[];
};

type ActivateOrderButtonProps = {
  order: BillingOrder;
};

const ADMIN_CLASSES_KEY = "admin_classes";
const STUDENT_CLASS_ACCESS_KEY = "student_class_access";
const BILLING_ORDERS_KEY = "billing_orders";
const USERS_KEY = "users";

function getLevelsFromProductSlug(productSlug: string): Level[] {
  const slug = productSlug.toLowerCase();

  if (slug === "live-full") return ["A1", "A2", "B1"];
  if (slug === "live-a1-a2") return ["A1", "A2"];
  if (slug.includes("a1")) return ["A1"];
  if (slug.includes("a2")) return ["A2"];

  return ["B1"];
}

function getLevelFromOrder(order: BillingOrder): Level {
  return getLevelsFromProductSlug(String(order.productSlug || ""))[0];
}

function giveClassAccess(
  username: string,
  classId: string,
  options?: { makeMainClass?: boolean }
) {
  const rawAccess = localStorage.getItem(STUDENT_CLASS_ACCESS_KEY);
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
        mainClassId: options?.makeMainClass ? classId : item.mainClassId || classId,
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

  localStorage.setItem(
    STUDENT_CLASS_ACCESS_KEY,
    JSON.stringify(updatedAccessList)
  );
}
function activateStudentUser(username: string) {
  const rawUsers = localStorage.getItem(USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];

  const updatedUsers = users.map((user: any) => {
    const userEmail = String(user.email || user.username || "")
      .trim()
      .toLowerCase();

    const orderUsername = String(username || "")
      .trim()
      .toLowerCase();

    if (userEmail !== orderUsername) return user;

    return {
      ...user,
      isActive: true,
      activatedAt: new Date().toISOString(),
    };
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
}
function activateStarterDigitalPackage(username: string, level: Level) {
  const rawOrders = localStorage.getItem(BILLING_ORDERS_KEY);
  const orders = rawOrders ? JSON.parse(rawOrders) : [];

  const slug = `${level.toLowerCase()}-starter`;

  const alreadyExists = orders.some(
    (item: any) =>
      item.username === username &&
      item.productSlug === slug &&
      item.status === "active"
  );

  if (alreadyExists) return;

  const newOrder = {
    id: crypto.randomUUID(),
    username,
    productSlug: slug,
    level,
    packageType: "starter",
    contentType: "digitalPackage",
    status: "active",
    createdAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),

    // Canlı kurs hediyesi olan Starter paket süresiz gibi çalışsın.
    // Canlı ders kayıt süresi ayrıca liveCourse order üzerinden kontrol edilecek.
    accessEndDate: null,
  };

  localStorage.setItem(
    BILLING_ORDERS_KEY,
    JSON.stringify([...orders, newOrder])
  );
}

export default function ActivateOrderButton({ order }: ActivateOrderButtonProps) {
  async function handleActivateOrder() {
    const username = String(order.username || "").trim();
    const productSlug = String(order.productSlug || "").toLowerCase();
    const isLiveCourse = productSlug.includes("live");

    if (!username) {
      alert("Bu siparişte kullanıcı emaili yok. Siparişi yeniden oluşturun.");
      return;
    }

    const { data: classesFromDb, error: classesError } = await supabase
  .from("classes")
  .select("*");

if (classesError) {
  alert("Sınıflar yüklenemedi: " + classesError.message);
  return;
}

const classes: AdminClass[] = (classesFromDb || []).map((item: any) => ({
  id: item.id,
  name: item.name,
  level: item.level,
  teacherName: item.teacher_name,
  teacherId: item.teacher_id,
  isDefaultSalesClass: item.is_default_sales_class,
  classType: item.class_type || "live",
}));

    const levelsToActivate = isLiveCourse
      ? getLevelsFromProductSlug(productSlug)
      : [getLevelFromOrder(order)];

    activateStudentUser(username);
    await supabase
  .from("users")
  .update({ is_active: true })
  .eq("email", username.toLowerCase());
      for (const level of levelsToActivate) {
      const defaultClass = classes.find(
  (item) =>
    item.level === level &&
    item.isDefaultSalesClass === true &&
    item.classType === (isLiveCourse ? "live" : "digital")
);
console.log("DEFAULT CLASS", defaultClass);
console.log("ALL CLASSES", classes);

      if (!defaultClass) {
        alert(
          `${level} seviyesi için varsayılan satış sınıfı yok. Önce /admin/classes sayfasından ${level} sınıfını varsayılan yapın.`
        );
        return;
      }

      giveClassAccess(username, defaultClass.id, {
  makeMainClass: isLiveCourse,
});

      if (isLiveCourse) {
        activateStarterDigitalPackage(username, level);
      }
    }

    const rawOrders = localStorage.getItem(BILLING_ORDERS_KEY);
const orders = rawOrders ? JSON.parse(rawOrders) : [];

const accessEndDate = isLiveCourse
  ? getAccessEndDateByProduct("liveCourse")
  : getAccessEndDateByProduct(
      order.packageType || order.productSlug || ""
    );

const updatedOrders = orders.map((item: any) => {
  if (item.id !== order.id) return item;

  return {
    ...item,
    contentType: isLiveCourse ? "liveClass" : "digitalPackage",
    accessEndDate,
  };
});

localStorage.setItem(BILLING_ORDERS_KEY, JSON.stringify(updatedOrders));
    const { data: updatedOrderRows, error: orderUpdateError } =
  await supabase
    .from("orders")
    .update({
      status: "completed",
    })
    .eq("username", username.toLowerCase())
    .in("status", ["pending_payment", "paid_waiting_activation"])
    .select();

console.log("UPDATED ORDERS", updatedOrderRows);

if (orderUpdateError) {
  alert("Sipariş durumu güncellenemedi: " + orderUpdateError.message);
  return;
}

if (!updatedOrderRows || updatedOrderRows.length === 0) {
  alert("Sipariş güncellenemedi. Hiçbir kayıt eşleşmedi.");
  return;
}

    
  alert(
      isLiveCourse
        ? `${username} kullanıcısına canlı kurs sınıf erişimi ve Başlangıç dijital paketi açıldı.`
        : `${username} kullanıcısına erişim açıldı.`
    );
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleActivateOrder}
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
      Aktif Et
    </button>
  );
}