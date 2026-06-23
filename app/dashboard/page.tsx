"use client";
import { supabase } from "@/lib/supabase";
import { getShopierLink } from "@/lib/billing/shopier-links";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const KelimeOyunu = dynamic(() => import("@/components/KelimeOyunu"), { ssr: false });
import ClassLeagueTab from "@/components/ClassLeagueTab";
import {
  createPendingOrder,
  getActiveOrderForUserAndLevel,
  getOrders,
  getPendingOrders,
} from "@/lib/billing/orders";
import {
  getRemainingDays,
  isAccessExpired,
} from "../../lib/access/access-control";
import {
  Rocket,
  Crown,
  Target,
  Lock,
  GraduationCap,
  FileText,
  MessageCircle,
} from "lucide-react";
import { theme1Questions } from "@/app/data/mastery/theme1";
import { theme2Questions } from "@/app/data/mastery/theme2";
import { theme3Questions } from "@/app/data/mastery/theme3";
import { theme4Questions } from "@/app/data/mastery/theme4";
import { theme5Questions } from "@/app/data/mastery/theme5";
import { theme6Questions } from "@/app/data/mastery/theme6";
import { theme7Questions } from "@/app/data/mastery/theme7";
import { theme8Questions } from "@/app/data/mastery/theme8";
import { theme9Questions } from "@/app/data/mastery/theme9";
import { theme10Questions } from "@/app/data/mastery/theme10";
import { theme11Questions } from "@/app/data/mastery/theme11";
import { theme12Questions } from "@/app/data/mastery/theme12";
import { a2Theme1Questions } from "@/app/data/mastery-a2/theme1";
import { a2Theme2Questions } from "@/app/data/mastery-a2/theme2";
import { a2Theme3Questions } from "@/app/data/mastery-a2/theme3";
import { a2Theme4Questions } from "@/app/data/mastery-a2/theme4";
import { a2Theme5Questions } from "@/app/data/mastery-a2/theme5";
import { a2Theme6Questions } from "@/app/data/mastery-a2/theme6";
import { a2Theme7Questions } from "@/app/data/mastery-a2/theme7";
import { a2Theme8Questions } from "@/app/data/mastery-a2/theme8";
import { a2Theme9Questions } from "@/app/data/mastery-a2/theme9";
import { a2Tema4Questions } from "@/app/data/mastery-a2/tema4";
import { a2Tema5Questions } from "@/app/data/mastery-a2/tema5";
import { a2Tema6Questions } from "@/app/data/mastery-a2/tema6";
import { a2Tema7Questions } from "@/app/data/mastery-a2/tema7";
import { a2Tema8Questions } from "@/app/data/mastery-a2/tema8";
import { a2Tema9Questions } from "@/app/data/mastery-a2/tema9";
import { a2Tema10Questions } from "@/app/data/mastery-a2/tema10";
import { a2Tema11Questions } from "@/app/data/mastery-a2/tema11";
import { a2Tema12Questions } from "@/app/data/mastery-a2/tema12";
import { speakingPatterns } from "@/app/data/speaking_patterns";

type Level = "A1" | "A2" | "B1";
type PackageType = "starter" | "practice" | "master";

type LoggedUser = {
  username: string;
  role: string;
  label: string;
  name?: string;
};

type AdminClass = {
  id: string;
  name: string;
  level: Level;
  teacherName: string;
  teacherId: string;
  isDefaultSalesClass?: boolean;
  classType?: "live" | "digital";
};

type TeacherLesson = {
  id?: string;
  title: string;
  contentType?: "liveClass" | "digitalPackage";
  pdfVisibility?: "classOnly" | "digitalPackage";
  videoUrl: string;
  packageType?: PackageType;

  pdfTitle?: string;
  pdfUrl?: string;

  homework?: string;

  // 🔥 YENİ EKLEDİKLERİMİZ
  worksheetTitle?: string;
  worksheetUrl?: string;
  worksheetPackageType?: PackageType;
  worksheets?: {
  id: string;
  title: string;
  url: string;
  packageType: PackageType;
}[];

  classId?: string;
  level?: Level;
};

type StudentClassAccess = {
  username: string;
  mainClassId: string;
  extraClassAccess: string[];
};

const LEVELS: Level[] = ["A1", "A2", "B1"];

function getEmbedUrl(url: string) {
  if (!url) return "";

  const params =
    "rel=0&modestbranding=1&playsinline=1&fs=1";

  if (url.includes("youtube.com/embed/")) {
    return `${url}${url.includes("?") ? "&" : "?"}${params}`;
  }

  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1]?.split("&")[0];

    return videoId
      ? `https://www.youtube.com/embed/${videoId}?${params}`
      : "";
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];

    return videoId
      ? `https://www.youtube.com/embed/${videoId}?${params}`
      : "";
  }

  return url;
}

function getPackageLabel(packageType?: string) {
  if (packageType === "master") return "Zirve";
  if (packageType === "practice") return "Gelişim";
  if (packageType === "starter") return "Başlangıç";

  return "Paket yok";
}

function getPackageValue(packageType?: PackageType) {
  if (packageType === "master") return 3;
  if (packageType === "practice") return 2;
  if (packageType === "starter") return 1;
  return 0;
}

function canAccessLessonPackage(
  userPackage?: PackageType,
  lessonPackage?: PackageType
) {
  return getPackageValue(userPackage) >= getPackageValue(lessonPackage || "starter");
}

function getUpgradeOffers(packageType?: PackageType) {
  if (packageType === "starter") {
    return [
      {
        type: "practice" as PackageType,
        title: "Gelişim’e geç",
        text: "5 TELC deneme, 36 ders offline anlatım ve daha fazla PDF içerik açılır.",
      },
      {
        type: "master" as PackageType,
        title: "Zirve’ye geç",
        text: "10 TELC deneme, 12 ay offline ders ve tam hazırlık sistemi açılır.",
      },
    ];
  }

  if (packageType === "practice") {
    return [
      {
        type: "master" as PackageType,
        title: "Zirve’ye geç",
        text: "10 TELC deneme, 12 ay offline ders ve tam hazırlık sistemi açılır.",
      },
    ];
  }

  return [];
}

function getLevelFromSlug(slug: string): Level {
  const normalized = slug.toLowerCase();

  if (normalized.includes("a1")) return "A1";
  if (normalized.includes("a2")) return "A2";
  return "B1";
}
function getLevelsFromSlug(slug?: string): Level[] {
  const value = String(slug || "").toLowerCase();

  if (
    value.includes("a1-a2-b1") ||
    value.includes("a1a2b1") ||
    value.includes("triple") ||
    value.includes("uclu")
  ) {
    return ["A1", "A2", "B1"];
  }

  if (
    value.includes("a1-a2") ||
    value.includes("a1a2") ||
    value.includes("double") ||
    value.includes("ikili")
  ) {
    return ["A1", "A2"];
  }

  if (value.includes("a2-b1") || value.includes("a2b1")) {
    return ["A2", "B1"];
  }

  if (value.includes("a1")) return ["A1"];
  if (value.includes("a2")) return ["A2"];
  if (value.includes("b1")) return ["B1"];

  return ["A1"];
}

function isLiveCourseSlug(slug?: string) {
  return String(slug || "").startsWith("live-");
}

const speakingTasksA1 = [
  "Kendini tanıt: adın, yaşın, nerede yaşadığın ve nereden geldiğin.",
  "Aileni anlat: annen, baban, kardeşlerin kimler?",
  "En yakın arkadaşını anlat.",
  "Mesleğini veya olmak istediğin mesleği anlat.",
  "Günlük rutinini anlat: sabah ne yaparsın?",
  "Sevdiğin yemekleri ve içecekleri anlat.",
  "Markette alışveriş yaptığını hayal ederek konuş.",
  "Evinin odalarını ve yaşadığın yeri anlat.",
  "Boş zamanında ne yaparsın?",
  "Bir yere nasıl gideceğini tarif et.",
  "Hasta olduğunda ne yaparsın?",
  "Bir tatil planını anlat.",
];
const speakingTasksB1 = [
  {
    week: 1,
    theme: "Aile ve İnsan İlişkileri",
    title: "Aileni ve ilişkilerini anlat",
    task: "Aileni tanıt. Aile içinde kiminle daha yakın olduğunu, birlikte neler yaptığınızı ve aile içi ilişkilerin senin için neden önemli olduğunu anlat.",
    grammar: "Präsens / Perfekt / weil-denn-deshalb",
  },
  {
    week: 1,
    theme: "Günlük Hayat ve Rutinler",
    title: "Günlük yaşamını anlat",
    task: "Bir gününü baştan sona anlat. Sabah rutinin, iş/okul düzenin, boş zamanın ve zaman planlaman hakkında konuş.",
    grammar: "Trennbare Verben / Modalverben / Uhrzeit",
  },
  {
    week: 1,
    theme: "Okul ve Eğitim",
    title: "Eğitim hayatını değerlendir",
    task: "Okul hayatını veya eğitim sürecini anlat. Hangi dersleri sevdiğini, nasıl ders çalıştığını ve eğitimde yaşanan problemler hakkındaki düşüncelerini açıkla.",
    grammar: "Dativ / Akkusativ-Dativ / obwohl-trotzdem",
  },
  {
    week: 2,
    theme: "Meslek ve İş Hayatı",
    title: "Meslek hedefini anlat",
    task: "Yapmak istediğin mesleği anlat. Bu mesleği neden seçtiğini, iş hayatında hangi özelliklerin önemli olduğunu ve gelecekte nerede çalışmak istediğini açıkla.",
    grammar: "werden / Konjunktiv II höflich",
  },
  {
    week: 2,
    theme: "İş Başvurusu",
    title: "Bir işe başvurduğunu anlat",
    task: "Bir işe başvurduğunu düşün. Kendini tanıt, neden bu işe uygun olduğunu söyle ve işverenden nazikçe bilgi iste.",
    grammar: "Nebensätze / formelle Ausdrücke",
  },
  {
    week: 2,
    theme: "Boş Zaman ve Hobiler",
    title: "Hobilerini ve planlarını anlat",
    task: "Boş zamanlarında neler yaptığını anlat. Sevdiğin hobileri, spor aktivitelerini ve hafta sonu için yapmak istediğin bir planı açıkla.",
    grammar: "Modalverben / Vergleich als-wie / Vorschläge machen",
  },
  {
    week: 3,
    theme: "Tatil ve Seyahat",
    title: "Tatil planını anlat",
    task: "Bir tatil planı yap. Nereye gitmek istediğini, nasıl gideceğini, nerede kalacağını ve tatilde ne yapmak istediğini anlat.",
    grammar: "Futur I / Wechselpräpositionen",
  },
  {
    week: 3,
    theme: "Ulaşım ve Trafik",
    title: "Bir yolculuğu anlat",
    task: "Toplu taşıma veya özel araçla yaptığın bir yolculuğu anlat. Yol tarifi ver ve trafikte yaşanabilecek sorunlara çözüm öner.",
    grammar: "Präpositionen / Imperativ / Wegbeschreibung",
  },
  {
    week: 3,
    theme: "Ev ve Yaşam",
    title: "Yaşadığın evi anlat",
    task: "Evinin bölümlerini anlat. Evinin nasıl olduğunu, taşınma düşüncen olup olmadığını ve evde hangi kuralların önemli olduğunu açıkla.",
    grammar: "Adjektivdeklination / Relativsatz / dürfen-müssen",
  },
  {
    week: 4,
    theme: "Alışveriş",
    title: "Alışveriş deneyimini anlat",
    task: "Bir ürün satın alma deneyimini anlat. Ürünleri karşılaştır, hangisini tercih ettiğini söyle ve gerekirse bir şikâyet durumunu açıkla.",
    grammar: "Artikel / Komparativ-Superlativ / formelle Beschwerde",
  },
  {
    week: 4,
    theme: "Yemek ve Beslenme",
    title: "Beslenme alışkanlıklarını anlat",
    task: "Ne yemeyi sevdiğini, sağlıklı beslenme hakkında ne düşündüğünü ve restoranda sipariş verirken nelere dikkat ettiğini anlat.",
    grammar: "Rezept erzählen / müssen-sollen / Empfehlungen",
  },
  {
    week: 4,
    theme: "Sağlık ve Hastalık",
    title: "Sağlık hakkında konuş",
    task: "Bir sağlık problemi yaşadığını düşün. Şikâyetlerini doktora anlat, tavsiye iste ve sağlıklı yaşamak için neler yapılması gerektiğini açıkla.",
    grammar: "Reflexive Verben / wenn-Sätze / Konjunktiv II",
  },
];
export default function DashboardPage() {
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  const [speakingTab, setSpeakingTab] = useState<"durum" | "gorev" | "partner" | "talep">("durum");
const [speakingProgress, setSpeakingProgress] = useState<any>(null);
const [speakingProgressLoading, setSpeakingProgressLoading] = useState(true);
const [speakingGorevBildiriliyor, setSpeakingGorevBildiriliyor] = useState(false);
const [bildirimUyariModal, setBildirimUyariModal] = useState(false);
const [speakingTeşvikMesaj, setSpeakingTeşvikMesaj] = useState<{icon: string, baslik: string, mesaj: string, renk: string} | null>(null);
const [speakingBildirimGonderildi, setSpeakingBildirimGonderildi] = useState(false);
const [speakingRol, setSpeakingRol] = useState<"konusan" | "dinleyen">("konusan");
const [speakingTemaId, setSpeakingTemaId] = useState(1);
const [speakingCinsiyet, setSpeakingCinsiyet] = useState("fark_etmez");
const [speakingMusait, setSpeakingMusait] = useState("");
const [speakingTelefon, setSpeakingTelefon] = useState("");
const [speakingGonderildi, setSpeakingGonderildi] = useState(false);
const [teacherWhatsapp, setTeacherWhatsapp] = useState<string>("905013434419");
const [speakingEslesmeler, setSpeakingEslesmeler] = useState<any[]>([]);
const [speakingYukleniyor, setSpeakingYukleniyor] = useState(false);
const [partnerTelefon, setPartnerTelefon] = useState<string>("");
const [pwaGoster, setPwaGoster] = useState(false);

useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault();
    setPwaPrompt(e);
    setPwaGoster(true);
  };
  window.addEventListener("beforeinstallprompt", handler);
  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);

const pwaYukle = async () => {
  if (!pwaPrompt) return;
  pwaPrompt.prompt();
  const result = await pwaPrompt.userChoice;
  if (result.outcome === "accepted") setPwaGoster(false);
};
  const [streak, setStreak] = useState(0);
  const [inactiveDays, setInactiveDays] = useState(0);
const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  type DailyTaskKey = "lesson" | "pdf" | "speaking";

const dailyTasks: {
  key: DailyTaskKey;
  title: string;
  desc: string;
}[] = [
  {
    key: "lesson",
    title: "Ustalık Testi çöz",
    desc: "Bugün en az bir tema testini tamamla.",
  },
  {
    key: "pdf",
    title: "Kelime Arenasında oyna",
    desc: "En az 1 tur kelime pratiği yap.",
  },
  {
    key: "speaking",
    title: "Konuşma görevi gönder",
    desc: "Partnerinle görüş veya WhatsApp'tan gönder.",
  },
];

const todayKey = new Date().toISOString().slice(0, 10);
useEffect(() => {
  if (!lastActiveDate) return;

  const today = new Date();
  const lastDate = new Date(lastActiveDate);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  setInactiveDays(diffDays);
}, [lastActiveDate]);
const loggedUser = JSON.parse(localStorage.getItem("mock_logged_user") || "{}");
const currentUsername = loggedUser?.username || "guest";
const studentKey = String(currentUsername || "")
  .trim()
  .toLowerCase();
useEffect(() => {
  const interval = setInterval(async () => {
    const rawLoggedUser = localStorage.getItem("mock_logged_user");

if (!rawLoggedUser) return;

const logged = JSON.parse(rawLoggedUser);
const normalizedUsername = String(logged.username || "")
  .trim()
  .toLowerCase();

const { data: activeUsers } = await supabase
  .from("users")
  .select("is_active")
  .eq("email", normalizedUsername)
  .limit(1);

const latestUser = activeUsers?.[0];

if (latestUser?.is_active === true) {
      const autoReloadKey = `auto_reload_after_activation_${logged.username}`;

if (!localStorage.getItem(autoReloadKey)) {
  localStorage.setItem(autoReloadKey, "true");
  window.location.reload();
  return;
}
  const todayLessonKey = `today_lesson_${logged.username}_${todayKey}`;

  localStorage.removeItem(todayLessonKey);

  const rawOrders = localStorage.getItem("billing_orders");
const orders = rawOrders ? JSON.parse(rawOrders) : [];

const hasWaitingPayment = orders.some(
  (order: any) =>
    String(order.username || "").trim().toLowerCase() ===
      String(logged.username || "").trim().toLowerCase() &&
    order.status === "pending_payment"
);

setIsStudentActive(true);

if (!hasWaitingPayment) {
  setHidePendingOrderNotice(true);
  setPendingPaymentSlug("");
}

setDashboardRefreshKey((prev) => prev + 1);
}

    const { data: classesFromDb } = await supabase
  .from("classes")
  .select("*");

const { data: lessonsFromDb } = await supabase
  .from("teacher_lessons")
  .select("*")
  .order("lesson_order", { ascending: true, nullsFirst: false })
.order("created_at", { ascending: true });
    const rawAccess = localStorage.getItem("student_class_access");

    setClasses(
  (classesFromDb || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    teacherId: item.teacher_id,
    teacherName: item.teacher_name,
    isDefaultSalesClass: item.is_default_sales_class,
    classType: item.class_type || "live",
  }))
);

setLessons(
  (lessonsFromDb || []).map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.video_url,
    packageType: lesson.package_type,
    contentType: lesson.content_type,
    pdfTitle: lesson.pdf_title,
    pdfUrl: lesson.pdf_url,
    pdfVisibility: lesson.pdf_visibility,
    homework: lesson.homework,
    worksheets: lesson.worksheets || [],
    classId: lesson.class_id,
    level: lesson.level,
  }))
);

    const { data: accessFromDb } = await supabase
  .from("student_class_access")
  .select("*")
  .eq("username", normalizedUsername);

const allAccessIds = (accessFromDb || []).map((item: any) => item.main_class_id).filter(Boolean);

setStudentAccess(
  allAccessIds.length > 0
    ? {
        username: normalizedUsername,
        mainClassId: allAccessIds[0],
        extraClassAccess: allAccessIds.slice(1),
      }
    : null
);
  }, 2000);

  return () => clearInterval(interval);
}, []);

const taskStorageKey = `dashboard_daily_tasks_${currentUsername}_${todayKey}`;

const [completedTasks, setCompletedTasks] = useState<Record<DailyTaskKey, boolean>>({
  lesson: false,
  pdf: false,
  speaking: false,
});
const [lastLesson, setLastLesson] = useState<any>(null);
const [showResetConfirm, setShowResetConfirm] = useState(false);
const [todayLesson, setTodayLesson] = useState<any>(null);
const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
useEffect(() => {
  const savedStreak = localStorage.getItem("user_streak");
  const savedDate = localStorage.getItem("last_active_date");

  if (savedStreak) setStreak(Number(savedStreak));
  if (savedDate) setLastActiveDate(savedDate);
}, []);

useEffect(() => {
  const saved = localStorage.getItem(taskStorageKey);

  if (saved) {
    setCompletedTasks(JSON.parse(saved));
  }
}, [taskStorageKey]);
useEffect(() => {
  const saved = localStorage.getItem("last_selected_lesson");

if (saved) {
  setLastLesson(JSON.parse(saved));
}
}, []);


function handleRestoreStudyData(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string);

      if (!parsed.data) {
        alert("Geçersiz yedek dosyası");
        return;
      }

      Object.entries(parsed.data).forEach(([key, value]) => {
        localStorage.setItem(key, String(value));
      });

      alert("Çalışma verileri başarıyla geri yüklendi.");
      window.location.reload();
    } catch (error) {
      alert("Yedek dosyası okunamadı.");
    }
  };

  reader.readAsText(file);
}
const toggleTask = (key: DailyTaskKey) => {
  setCompletedTasks((prev) => {
    const updated = {
      ...prev,
      [key]: !prev[key],
    };

    localStorage.setItem(taskStorageKey, JSON.stringify(updated));
    return updated;
  });
};
const completeDailyTask = (key: DailyTaskKey) => {

  setCompletedTasks((prev) => {
    const updated = {
      ...prev,
      [key]: true,
    };

    localStorage.setItem(taskStorageKey, JSON.stringify(updated));
    return updated;
  });
};
const completeSpeakingTask = () => {
  setCompletedTasks((prev) => {
    const updated = {
      ...prev,
      speaking: true,
    };

    localStorage.setItem(taskStorageKey, JSON.stringify(updated));
    return updated;
  });
};

const completedCount = Object.values(completedTasks).filter(Boolean).length;
const progressPercent = Math.round(
  (completedCount / dailyTasks.length) * 100
);
const getWeekIndex = () => {
  const start = new Date("2026-01-01");
  const now = new Date();

  const diff = now.getTime() - start.getTime();
  const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

  return week % 12;
};
const earnedBadges = [
  {
    key: "firstLesson",
    title: "İlk Ders",
    desc: "Bir ders açtın.",
    earned: completedTasks.lesson,
  },
  {
    key: "pdfWorker",
    title: "PDF Çalışanı",
    desc: "Bir PDF materyali açtın.",
    earned: completedTasks.pdf,
  },
  {
    key: "speakingCourage",
    title: "Konuşma Cesareti",
    desc: "Konuşma görevine başladın.",
    earned: completedTasks.speaking,
  },
  {
    key: "threeDayStreak",
    title: "3 Günlük Seri",
    desc: "3 günlük çalışma serisine ulaştın.",
    earned: streak >= 3,
  },
];
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);
  const [isStudentActive, setIsStudentActive] = useState(false);
  const [pendingPaymentSlug, setPendingPaymentSlug] = useState("");
  const [hidePendingOrderNotice, setHidePendingOrderNotice] = useState(false);
  const [paymentNoticeRefreshKey, setPaymentNoticeRefreshKey] = useState(0);
  const [dbPendingOrders, setDbPendingOrders] = useState<any[]>([]);
  const [dbActiveOrders, setDbActiveOrders] = useState<any[]>([]);
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [studentAccess, setStudentAccess] = useState<StudentClassAccess | null>(
    null
  );

  const [selectedLevel, setSelectedLevel] = useState<Level>("A1");
  const [activeDashboardTab, setActiveDashboardTab] = useState("home");
  type MasteryQuestion = {
  id: number;
  themeId: number;
  themeTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  tr: string;
  de: string;
  options: string[];
  difficulty?: "easy" | "medium" | "hard";
};
const a2MasteryThemes = [
  {
    id: 1,
    title: "Kişisel Bilgiler & Tanışma",
    germanTitle: "Persönliche Informationen",
    lessons: [
      { number: 1, title: "Kendini Daha Detaylı Tanıtma" },
      { number: 2, title: "Geçmiş Hayatımı Anlatıyorum" },
      { number: 3, title: "Sebep Söyleme – weil" },
    ],
  },
  {
    id: 2,
    title: "Günlük Hayat & Zaman",
    germanTitle: "Alltag & Zeit",
    lessons: [
      { number: 4, title: "Günlük Rutin – Dativ" },
      { number: 5, title: "Öneriler – könnte & würde" },
      { number: 6, title: "Planlar & Şartlar – wenn" },
    ],
  },
  {
    id: 3,
    title: "Yemek & Sağlık",
    germanTitle: "Essen & Gesundheit",
    lessons: [
      { number: 7, title: "Yemekleri Karşılaştırma – Komparativ" },
      { number: 8, title: "En Sevdiğim Yemekler – Superlativ" },
      { number: 9, title: "Doktorda – müssen & Imperativ" },
    ],
  },
  {
    id: 4,
    title: "Ev & Taşınma",
    germanTitle: "Wohnen & Umzug",
    lessons: [
      { number: 10, title: "Ev Tanıtımı – Es gibt – Mobilyalar" },
      { number: 11, title: "Wo? Wohin? – Yer Edatları" },
      { number: 12, title: "Relativsatz" },
    ],
  },
{
    id: 5,
    title: "Alışveriş & Hizmetler",
    germanTitle: "Einkaufen & Dienstleistungen",
    lessons: [
      { number: 13, title: "Preisvergleich – dieser/diese/dieses" },
      { number: 14, title: "darüber – daran – darauf – dagegen" },
      { number: 15, title: "Könnten Sie – Konjunktiv II" },
    ],
  },
   {
    id: 6,
    title: "Ulaşım & Yolculuk",
    germanTitle: "Verkehr & Reisen",
    lessons: [
      { number: 16, title: "Geçmiş Yolculuk – Perfekt – Modal" },
      { number: 17, title: "Seyahat Planları – Futur I – damit" },
      { number: 18, title: "Yolculuk Problemleri – wenn/falls – dass" },
    ],
  },
  {
    id: 7,
    title: "İş Hayatı & Meslekler",
    germanTitle: "Berufsleben",
    lessons: [
      { number: 19, title: "N-Deklination – Genitiv – İş Başvurusu" },
      { number: 20, title: "weil/da – dass-Satz – Meslek Seçimi" },
      { number: 21, title: "Resmî E-posta – Konjunktiv II – Indirekte Fragen" },
    ],
  },
  {
    id: 8,
    title: "Boş Zaman & Kültür",
    germanTitle: "Freizeit & Kultur",
    lessons: [
      { number: 22, title: "Hobiler – sich interessieren für – Präpositionalobjekte" },
      { number: 23, title: "Geçen Hafta Sonu – Präteritum" },
      { number: 24, title: "Etkinlik Anlatımı – nachdem – bevor – als" },
    ],
  },
  {
    id: 9,
    title: "Hava Durumu & Çevre",
    germanTitle: "Wetter & Umwelt",
    lessons: [
      { number: 25, title: "Hava Durumu – sonnig/regnerisch/windig" },
      { number: 26, title: "Gelecekte Hava – Futur I" },
      { number: 27, title: "Çevreyi Koruma – wenn + könnte/würde" },
    ],
  },
  {
    id: 10,
    title: "Aile & Sosyal İlişkiler",
    germanTitle: "Familie & Soziales",
    lessons: [
      { number: 28, title: "Reflexive Verben – sich freuen/ärgern/erinnern" },
      { number: 29, title: "Davetler & Kutlamalar – einladen/gratulieren" },
      { number: 30, title: "Kibar İstekler – Konjunktiv II" },
    ],
  },
  {
    id: 11,
    title: "Medya & Güncel Bilgi",
    germanTitle: "Medien & Aktuelles",
    lessons: [
      { number: 31, title: "İnternet & Sosyal Medya – dieser/welcher" },
      { number: 32, title: "Haberler – ob – Indirekte Fragen" },
      { number: 33, title: "Passiv – werden + Partizip II" },
    ],
  },
  {
    id: 12,
    title: "TELC/Goethe A2 Sınav Hazırlık",
    germanTitle: "Prüfungsvorbereitung A2",
    lessons: [
      { number: 34, title: "Schreiben – E-posta – Mesaj – Davet" },
      { number: 35, title: "Sprachbausteine – Relativsatz – weil – dass – wenn" },
      { number: 36, title: "Sprechen – Planlama – Ortak Karar Verme" },
    ],
  },
];
const masteryThemes = [
  {
    id: 1,
    title: "Kendini Tanıtma",
    germanTitle: "Sich vorstellen",
    lessons: [
      { number: 1, title: "Tanışma + sein fiili" },
      { number: 2, title: "Kişi zamirleri + cümle kurma" },
      { number: 3, title: "Soru cümleleri (W-Fragen)" },
    ],
  },
  {
    id: 2,
    title: "Aile ve Arkadaşlar",
    germanTitle: "Familie & Freunde",
    lessons: [
      { number: 4, title: "Aile bireyleri + haben" },
      { number: 5, title: "İyelik: mein / dein" },
      { number: 6, title: "Basit sıfatlar + cümle kurma" },
    ],
  },
  {
    id: 3,
    title: "Meslek",
    germanTitle: "Beruf",
    lessons: [
      { number: 7, title: "Meslekler + arbeiten" },
      { number: 8, title: "Artikel: der / die / das" },
      { number: 9, title: "Çoğul: Plural" },
    ],
  },
  {
    id: 4,
    title: "Günlük Hayat",
    germanTitle: "Tagesablauf",
    lessons: [
      { number: 10, title: "Günlük fiiller + Sayılar" },
      { number: 11, title: "Saatler" },
      { number: 12, title: "Fiil çekimi: Präsens" },
    ],
  },
  {
    id: 5,
    title: "Yemek & İçecek",
    germanTitle: "Essen & Trinken",
    lessons: [
      { number: 13, title: "Yiyecekler + Saatler" },
      { number: 14, title: "mögen + gern" },
      { number: 15, title: "Akkusativ" },
    ],
  },
  {
    id: 6,
    title: "Alışveriş",
    germanTitle: "Einkaufen",
    lessons: [
      { number: 16, title: "Fiyat sorma" },
      { number: 17, title: "möchten" },
      { number: 18, title: "haben fiili" },
    ],
  },
  {
    id: 7,
    title: "Ev & Yaşam",
    germanTitle: "Wohnen",
    lessons: [
      { number: 19, title: "Ev bölümleri" },
      { number: 20, title: "es gibt" },
      { number: 21, title: "Yer edatları" },
    ],
  },
  {
    id: 8,
    title: "Boş Zaman",
    germanTitle: "Freizeit",
    lessons: [
      { number: 22, title: "Hobiler ve aktiviteler" },
      { number: 23, title: "können" },
      { number: 24, title: "Cümle genişletme" },
    ],
  },
  {
    id: 9,
    title: "Ulaşım & Yol Tarifi",
    germanTitle: "Verkehr & Wegbeschreibung",
    lessons: [
      { number: 25, title: "Genel konuşma kalıpları" },
      { number: 26, title: "Ulaşım araçları + Emir cümlesi" },
      { number: 27, title: "Yönler" },
    ],
  },
  {
    id: 10,
    title: "Sağlık",
    germanTitle: "Gesundheit",
    lessons: [
      { number: 28, title: "Vücut" },
      { number: 29, title: "müssen" },
      { number: 30, title: "Basit tavsiye cümleleri" },
    ],
  },
  {
    id: 11,
    title: "Tatil",
    germanTitle: "Urlaub & Otel & Farben",
    lessons: [
      { number: 31, title: "Tatil-Aylar-Havadurumu" },
      { number: 32, title: "Perfekt tanıtım" },
      { number: 33, title: "Otel+Günler+Renkler" },
    ],
  },
  {
    id: 12,
    title: "Schreiben ( Mektup & Form)",
    germanTitle: "Termin & Kommunikation",
    lessons: [
      { number: 34, title: "Form doldurma + Mektup" },
      { number: 35, title: "Örnek mektup kalıpları" },
      { number: 36, title: "Genel tekrar" },
    ],
  },
];

const masteryQuestions: MasteryQuestion[] = [
  ...theme1Questions.map((question: any) => ({
    ...question,
    options: [...question.options],
  })),

  ...theme2Questions.map((question: any) => ({
    ...question,
    options: [...question.options],
  })),
  ...theme3Questions.map((question) => ({
  ...question,
  options: [...question.options],
})),
...theme4Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme5Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme6Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme7Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme8Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme9Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme10Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme11Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
...theme12Questions.map((question: any) => ({
  ...question,
  options: [...question.options],
})),
];

const a2MasteryQuestions: MasteryQuestion[] = [
  ...a2Theme1Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 1, lessonNumber: 1 })),
  ...a2Theme2Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 1, lessonNumber: 2 })),
  ...a2Theme3Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 1, lessonNumber: 3 })),
  ...a2Theme4Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 2, lessonNumber: 4 })),
  ...a2Theme5Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 2, lessonNumber: 5 })),
  ...a2Theme6Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 2, lessonNumber: 6 })),
  ...a2Theme7Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 3, lessonNumber: 7 })),
  ...a2Theme8Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 3, lessonNumber: 8 })),
  ...a2Theme9Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 3, lessonNumber: 9 })),
  ...a2Tema4Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 4, lessonNumber: q.lessonNumber })),
  ...a2Tema5Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 5, lessonNumber: q.lessonNumber })),
  ...a2Tema6Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 6, lessonNumber: q.lessonNumber })),
  ...a2Tema7Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 7, lessonNumber: q.lessonNumber })),
  ...a2Tema8Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 8, lessonNumber: q.lessonNumber })),
  ...a2Tema9Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 9, lessonNumber: q.lessonNumber })),
  ...a2Tema10Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 10, lessonNumber: q.lessonNumber })),
  ...a2Tema11Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 11, lessonNumber: q.lessonNumber })),
  ...a2Tema12Questions.map((q: any) => ({ ...q, options: [...q.options], themeId: 12, lessonNumber: q.lessonNumber })),
];
const [selectedMasteryLevel, setSelectedMasteryLevel] = useState<"A1" | "A2" | "B1">("A1");
const [selectedMasteryThemeId, setSelectedMasteryThemeId] = useState(1);
const [masteryIndex, setMasteryIndex] = useState(0);
const [masteryLives, setMasteryLives] = useState(3);
const [masteryAnswers, setMasteryAnswers] = useState<MasteryQuestion[]>([]);
const [activeMasteryQuestions, setActiveMasteryQuestions] = useState<MasteryQuestion[]>([]);
const [masteryFinished, setMasteryFinished] = useState(false);
const [masteryFeedback, setMasteryFeedback] = useState<"correct" | "wrong" | null>(null);
const [completedMasteryThemes, setCompletedMasteryThemes] = useState<number[]>([]);
const completedThemeCount = completedMasteryThemes.length;
const isTelcChampion = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].every((id) =>
  completedMasteryThemes.includes(id)
);
const [masteryLockModal, setMasteryLockModal] = useState<{
  type: "premium" | "sequence";
  themeId: number;
} | null>(null);

const masteryBadgeTitle =
  completedThemeCount >= 12
    ? "TELC Şampiyonu"
    : completedThemeCount >= 9
    ? "Süper Usta"
    : completedThemeCount >= 6
    ? "Kelime Ustası"
    : completedThemeCount >= 3
    ? "Tema Avcısı"
    : "Başlangıç Yolcusu";
const fallbackMasteryLeaders = [
  { name: "Ahmet Çelik", badge: "TELC Şampiyonu", type: "Canlı Sınıf", themes: 12 },
  { name: "Ayfer Kılıç", badge: "Süper Usta", type: "Canlı Sınıf", themes: 9 },
  { name: "Mehmet Yılmaz", badge: "Kelime Ustası", type: "Dijital", themes: 6 },
  { name: "Zeynep Demir", badge: "Tema Avcısı", type: "Canlı Sınıf", themes: 3 },
  { name: "Elif Kaya", badge: "Tema Avcısı", type: "Dijital", themes: 3 },
  { name: "Hasan Aydın", badge: "Başlangıç Yolcusu", type: "Dijital", themes: 2 },
  { name: "Merve Şahin", badge: "Başlangıç Yolcusu", type: "Canlı Sınıf", themes: 1 },
  { name: "Yusuf Arslan", badge: "Başlangıç Yolcusu", type: "Dijital", themes: 1 },
];

const [realMasteryLeaders, setRealMasteryLeaders] = useState<
  { name: string; badge: string; type: string; themes: number }[]
>([]);

const masteryLeaders = [
  ...realMasteryLeaders,
  ...fallbackMasteryLeaders,
].slice(0, 8);
const getMasteryBadgeByThemeCount = (themeCount: number) => {
  if (themeCount >= 12) return "TELC Şampiyonu";
  if (themeCount >= 9) return "Süper Usta";
  if (themeCount >= 6) return "Kelime Ustası";
  if (themeCount >= 3) return "Tema Avcısı";
  return "Başlangıç Yolcusu";
};

const nextBadgeTarget =
  completedThemeCount >= 12
    ? 12
    : completedThemeCount >= 9
    ? 12
    : completedThemeCount >= 6
    ? 9
    : completedThemeCount >= 3
    ? 6
    : 3;

const remainingThemesForBadge = Math.max(
  0,
  nextBadgeTarget - completedThemeCount
);

useEffect(() => {
  async function loadRealMasteryLeaders() {
    const { data, error } = await supabase
      .from("mastery_progress")
      .select("username, theme_id, level, status")
      .eq("level", selectedMasteryLevel)
.eq("status", "completed");

    if (error) {
      console.log("Ustalık liderleri yüklenemedi:", error);
      return;
    }

    const grouped: Record<string, Set<number>> = {};

    (data || []).forEach((item: any) => {
      const key = String(item.username || "")
        .trim()
        .toLowerCase();

      if (!key || key === "guest") return;

      if (!grouped[key]) {
        grouped[key] = new Set<number>();
      }

      grouped[key].add(Number(item.theme_id));
    });

    const studentKeys = Object.keys(grouped);

    const { data: usersForLeaders } = await supabase
      .from("users")
      .select("email, name")
      .in("email", studentKeys);

    const userNameMap: Record<string, string> = {};

    (usersForLeaders || []).forEach((user: any) => {
      const emailKey = String(user.email || "").trim().toLowerCase();
      const fullName = String(user.name || "").trim();

      if (emailKey) userNameMap[emailKey] = fullName;
    });

    const leaders = Object.entries(grouped)
      .map(([key, themeSet]) => {
        const themeCount = themeSet.size;

        const displayName =
          userNameMap[key] && userNameMap[key].length > 0 && !userNameMap[key].includes("@")
            ? userNameMap[key]
            : key; // isim bulunamazsa student_key'i göster, debug içingit add .

        return {
          name: displayName,
          themes: themeCount,
          badge: getMasteryBadgeByThemeCount(themeCount),
          type: themeCount >= 7 ? "Canlı Sınıf" : "Dijital",
        };
      })
      .sort((a, b) => b.themes - a.themes)
      .slice(0, 8);

    setRealMasteryLeaders(leaders);
  }

  loadRealMasteryLeaders();
}, [selectedMasteryLevel]);
useEffect(() => {
  async function loadMasteryProgress() {
    const username = String(currentUser?.username || currentUsername || "")
  .trim()
  .toLowerCase();

    if (!username || username === "guest") return;

    const { data, error } = await supabase
      .from("mastery_progress")
      .select("theme_id")
      .eq("student_key", studentKey)
      .eq("level", selectedMasteryLevel)
      .eq("status", "completed");

    if (error) {
      console.log("Mastery progress yüklenemedi:", error);
      return;
    }

    setCompletedMasteryThemes(
      (data || []).map((item: any) => item.theme_id)
    );
  }

  loadMasteryProgress();
}, [currentUser, currentUsername, studentKey, selectedMasteryLevel]);

const firstIncompleteThemeId =
  selectedMasteryLevel === "A2"
    ? a2MasteryThemes.find((theme) => !completedMasteryThemes.includes(theme.id))?.id || 1
    : masteryThemes.find((theme) => !completedMasteryThemes.includes(theme.id))?.id || 1;
const selectedMasteryTheme = selectedMasteryLevel === "A2"
  ? a2MasteryThemes.find((theme) => theme.id === selectedMasteryThemeId)
  : masteryThemes.find((theme) => theme.id === selectedMasteryThemeId);
const getRandomMasteryQuestions = (themeId: number) => {

  const theme = masteryThemes.find((item) => item.id === themeId);



  if (!theme) return [];



  return theme.lessons.flatMap((lesson) => {

    const lessonQuestions = masteryQuestions.filter(

      (question) =>

        question.themeId === themeId &&

        question.lessonNumber === lesson.number

    );



    return [...lessonQuestions]
  .sort(() => Math.random() - 0.5)
  .slice(0, 5)
  .map((question) => ({
    ...question,
    options: [...question.options].sort(() => Math.random() - 0.5),
  }));

  });

};
const getRandomA2MasteryQuestions = (themeId: number) => {
  if (themeId > 12) return [];
  const a2Theme = a2MasteryThemes.find((item) => item.id === themeId);
  if (!a2Theme) return [];
  const allThemeQuestions = a2MasteryQuestions.filter(
    (q) => q.themeId === themeId
  );
  return [...allThemeQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 15)
    .map((question) => ({
      ...question,
      options: [...question.options].sort(() => Math.random() - 0.5),
    }));
};
const selectedMasteryQuestions =
  activeMasteryQuestions.length > 0
    ? activeMasteryQuestions
    : selectedMasteryLevel === "A2"
      ? getRandomA2MasteryQuestions(selectedMasteryThemeId)
      : getRandomMasteryQuestions(selectedMasteryThemeId);
const currentMasteryQuestion = selectedMasteryQuestions[masteryIndex];

const getLessonScore = (lessonNumber: number) => {
  return masteryAnswers.filter(
    (answer) => answer.lessonNumber === lessonNumber
  ).length;
};

const isThemePassed = selectedMasteryLevel === "A2"
  ? masteryAnswers.length >= 13
  : selectedMasteryTheme
    ? selectedMasteryTheme.lessons.every((lesson) => getLessonScore(lesson.number) >= 3)
    : false;
  const getThemeProgressPercent = (themeId: number) => {
  if (completedMasteryThemes.includes(themeId)) return 100;
  if (themeId !== selectedMasteryThemeId) return 0;

  return Math.min(
    100,
    Math.round((masteryAnswers.length / 15) * 100)
  );
};


const resetMasteryTest = (themeId = selectedMasteryThemeId) => {
  setSelectedMasteryThemeId(themeId);
  if (selectedMasteryLevel === "A2") {
    setActiveMasteryQuestions(getRandomA2MasteryQuestions(themeId));
  } else {
    setActiveMasteryQuestions(getRandomMasteryQuestions(themeId));
  }
  setMasteryIndex(0);
  setMasteryLives(3);
  setMasteryAnswers([]);
  setMasteryFinished(false);
  setMasteryFeedback(null);
};
useEffect(() => {
  if (activeDashboardTab === "vocabulary" && activeMasteryQuestions.length === 0) {
    if (selectedMasteryLevel === "A2") {
      setActiveMasteryQuestions(getRandomA2MasteryQuestions(selectedMasteryThemeId));
    } else {
      setActiveMasteryQuestions(getRandomMasteryQuestions(selectedMasteryThemeId));
    }
  }
}, [activeDashboardTab, activeMasteryQuestions.length, selectedMasteryThemeId, selectedMasteryLevel]);

const handleMasteryAnswer = (answer: string) => {
  if (!currentMasteryQuestion || masteryFeedback) return;

  if (answer === currentMasteryQuestion.de) {
    setMasteryFeedback("correct");

    setTimeout(async () => {
      const nextIndex = masteryIndex + 1;

      setMasteryAnswers((prev) => [...prev, currentMasteryQuestion]);
      completeDailyTask("lesson");
      setMasteryFeedback(null);

      if (nextIndex >= selectedMasteryQuestions.length) {
  setMasteryFinished(true);

  const updatedAnswers = [...masteryAnswers, currentMasteryQuestion];
  const passedAllLessons = selectedMasteryTheme
    ? selectedMasteryTheme.lessons.every(
        (lesson) =>
          updatedAnswers.filter(
            (answer) => answer.lessonNumber === lesson.number
          ).length >= 3
      )
    : false;

  if (passedAllLessons) {
    setCompletedMasteryThemes((prev) =>
  prev.includes(selectedMasteryThemeId)
    ? prev
    : [...prev, selectedMasteryThemeId]
);

const masteryUsername = String(currentUser?.username || currentUsername || "")
  .trim()
  .toLowerCase();

const { data: existingMastery } = await supabase
  .from("mastery_progress")
  .select("id")
  .eq("student_key", studentKey)
  .eq("level", selectedMasteryLevel)
  .eq("theme_id", selectedMasteryThemeId)
  .maybeSingle();

if (!existingMastery) {
  const { error: masterySaveError } = await supabase
    .from("mastery_progress")
    .insert({
      student_key: studentKey,
      username: currentUser?.name || profileName || studentKey,
      level: selectedMasteryLevel,
      theme_id: selectedMasteryThemeId,
      status: "completed",
    });

  if (masterySaveError) {
    alert("Ustalık ilerlemesi kaydedilemedi: " + masterySaveError.message);
  }
}
  }
} else {
  setMasteryIndex(nextIndex);
}
    }, 1200);

    return;
  }

  setMasteryFeedback("wrong");

  setTimeout(() => {
    setMasteryFeedback(null);

    if (masteryLives <= 1) {
      setMasteryFinished(true);
      return;
    }

    setMasteryLives((prev) => prev - 1);
  }, 3600);
};
  
  const openedLessonCount = Number(
  localStorage.getItem(`opened_lesson_count_${currentUsername}`) || "0"
);
const level = Math.floor(openedLessonCount / 5) + 1;
const [lastSeenLevel, setLastSeenLevel] = useState(level);
const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
const [prevLevel, setPrevLevel] = useState(level);
const [showLevelUp, setShowLevelUp] = useState(false);

const levelLabel =
  level === 1
    ? "Başlangıç"
    : level === 2
    ? "Isınıyorsun"
    : level === 3
    ? "İlerliyorsun"
    : "Hazırsın";
useEffect(() => {
  const savedLevel = Number(localStorage.getItem(`last_seen_level_${currentUsername}`) || level);

  if (level > savedLevel) {
    setShowLevelUpPopup(true);
    setLastSeenLevel(level);
    localStorage.setItem(`last_seen_level_${currentUsername}`, String(level));

    setTimeout(() => {
      setShowLevelUpPopup(false);
    }, 3000);
  }
}, [level, currentUsername]);
const currentThemeIndex = Math.min(
  Math.floor(openedLessonCount / 3),
  11
);
const currentB1Week = Math.min(4, Math.floor(currentThemeIndex / 3) + 1);

const currentB1Tasks = speakingTasksB1.filter(
  (task) => task.week === currentB1Week
);

const currentB1Task =
  currentB1Tasks[currentThemeIndex % 3] || currentB1Tasks[0];

  const speakingTask =
  selectedLevel === "A1"
    ? speakingTasksA1[currentThemeIndex]
    : selectedLevel === "B1"
    ? currentB1Task?.task || "B1 konuşma görevi hazırlanıyor..."
    : "Konuşma görevi hazırlanıyor...";
  
  const [selectedLesson, setSelectedLesson] = useState<TeacherLesson | null>(
    null
  );
  useEffect(() => {
  if (!selectedLesson) return;

  setTimeout(() => {
    const player = document.getElementById("lesson-player");

    if (!player) return;

    player.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 500);
}, [selectedLesson]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellPackage, setUpsellPackage] = useState<PackageType>("practice");
  const [showExamNotice, setShowExamNotice] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [profileName, setProfileName] = useState("");
const [profileEmail, setProfileEmail] = useState("");
const [profilePassword, setProfilePassword] = useState("");

  useEffect(() => {
  const rawPaymentAttempt = localStorage.getItem("last_payment_attempt");

  if (!rawPaymentAttempt) return;

  try {
    const paymentAttempt = JSON.parse(rawPaymentAttempt);

    const isRecent =
  Date.now() - Number(paymentAttempt.time || 0) < 1000 * 60 * 15;
  if (!isRecent) {
  localStorage.removeItem("last_payment_attempt");
}
    if (isRecent && paymentAttempt.slug) {
      setPendingPaymentSlug(paymentAttempt.slug);
    }
  } catch {
    localStorage.removeItem("last_payment_attempt");
  }
}, []);
  useEffect(() => {
  async function loadDashboardData() {
    const rawUser = localStorage.getItem("mock_logged_user");

    if (!rawUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(rawUser) as LoggedUser;
    setCurrentUser(parsedUser);
    setProfileName(parsedUser.name || "");
setProfileEmail(parsedUser.username || "");
    const savedPendingSlug =
  localStorage.getItem("pending_payment_slug") ||
  localStorage.getItem("selected_product_slug") ||
  localStorage.getItem("selectedProductSlug") ||
  "";

setPendingPaymentSlug(savedPendingSlug);
    if (parsedUser.role !== "student") {
  router.push("/login");
  return;
}

const normalizedUsername = String(parsedUser.username || "")
  .trim()
  .toLowerCase();

const { data: activeUsers } = await supabase
  .from("users")
  .select("*")
  .eq("email", normalizedUsername)
  .limit(1);

const activeStudent = activeUsers?.[0];

if (!activeStudent || activeStudent.is_active !== true) {
  setIsStudentActive(false);

  const { data: pendingOrdersFromDb } = await supabase
    .from("orders")
    .select("*")
    .eq("username", normalizedUsername)
    .in("status", ["pending_payment", "paid_waiting_activation"])
    .order("created_at", { ascending: false })
    .limit(1);

  const latestPendingOrder = pendingOrdersFromDb?.[0];
  setDbPendingOrders(pendingOrdersFromDb || []);

  if (latestPendingOrder?.product_slug) {
    setPendingPaymentSlug(latestPendingOrder.product_slug);
  }
} else {
  setIsStudentActive(true);

  const { data: activeOrdersFromDb } = await supabase
    .from("orders")
    .select("*")
    .eq("username", normalizedUsername)
    .in("status", ["pending_payment", "paid_waiting_activation", "completed"])
    .order("created_at", { ascending: false });
    setDbActiveOrders(activeOrdersFromDb || []);

  const latestLiveOrder = activeOrdersFromDb?.find((order: any) =>
    String(order.product_slug || "").includes("live")
  );

  if (latestLiveOrder?.product_slug) {
    localStorage.setItem("selected_product_slug", latestLiveOrder.product_slug);
  }

  localStorage.removeItem("pending_payment_slug");
  localStorage.removeItem("selectedProductSlug");
}

    const { data: classesFromDb } = await supabase
  .from("classes")
  .select("*");
  const { data: teachersFromDb } = await supabase
  .from("users")
  .select("*")
  .eq("role", "teacher");

setTeachers(teachersFromDb || []);

setClasses(
  (classesFromDb || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    teacherId: item.teacher_id,
    teacherName: item.teacher_name,
    isDefaultSalesClass: item.is_default_sales_class,
    classType: item.class_type || "live",
  }))
);

const { data: lessonsFromDb } = await supabase
  .from("teacher_lessons")
  .select("*")
  .order("lesson_order", { ascending: true, nullsFirst: false })
.order("created_at", { ascending: true });

setLessons(
  (lessonsFromDb || []).map((lesson: any) => ({
    id: lesson.id,
    title: lesson.title,
    videoUrl: lesson.video_url,
    packageType: lesson.package_type,
    contentType: lesson.content_type,
    pdfTitle: lesson.pdf_title,
    pdfUrl: lesson.pdf_url,
    pdfVisibility: lesson.pdf_visibility,
    homework: lesson.homework,
    worksheets: lesson.worksheets || [],
    classId: lesson.class_id,
    level: lesson.level,
  }))
);

    const { data: accessFromDb } = await supabase
  .from("student_class_access")
  .select("*")
  .eq("username", normalizedUsername);

const allAccess = accessFromDb || [];

// Tüm sınıf ID'lerini topla
const allClassIds = allAccess.map((item: any) => item.main_class_id).filter(Boolean);

setStudentAccess(
  allClassIds.length > 0
    ? {
        username: normalizedUsername,
        mainClassId: allClassIds[0],
        extraClassAccess: allClassIds.slice(1),
      }
    : null
);
if (allClassIds.length > 0) {
  const { data: classData } = await supabase
    .from("classes")
    .select("teacher_id")
    .eq("id", allClassIds[0])
    .maybeSingle();
  if (classData?.teacher_id) {
    const { data: teacherData } = await supabase
      .from("users")
      .select("whatsapp")
      .eq("email", classData.teacher_id)
      .maybeSingle();
    if (teacherData?.whatsapp) {
      setTeacherWhatsapp(teacherData.whatsapp);
    }
  }
}
  }

  loadDashboardData();
}, [router]);

  const accessibleClassIds = useMemo(() => {
  if (!studentAccess) return [];
  // Tüm class ID'leri: mainClass + extraClassAccess
  const allIds = [
    studentAccess.mainClassId,
    ...(studentAccess.extraClassAccess || []),
  ].filter(Boolean);

  // Eğer hiç class yoksa, aynı level'daki varsayılan sınıfları da ekle
  if (allIds.length === 0) return [];

  return allIds;
}, [studentAccess]);

  const userClasses = useMemo(() => {
    return classes.filter((item) => accessibleClassIds.includes(item.id));
  }, [classes, accessibleClassIds]);
  const activeTeacherWhatsapp = useMemo(() => {
  const defaultWhatsapp = "905013434419";

  if (!studentAccess) return defaultWhatsapp;

  const studentClassIds = [
    studentAccess.mainClassId,
    ...(studentAccess.extraClassAccess || []),
  ].filter(Boolean);

  const activeClass = classes.find(
    (classItem) =>
      studentClassIds.includes(classItem.id) &&
      classItem.level === selectedLevel
  );

  if (!activeClass) return defaultWhatsapp;

  if (activeClass.isDefaultSalesClass) return defaultWhatsapp;

  const activeTeacherKeys = [
    activeClass.teacherId,
    activeClass.teacherName,
  ]
    .map((item) => String(item || "").trim().toLowerCase())
    .filter(Boolean);

  const matchedTeacher = teachers.find((teacher: any) => {
    const teacherKeys = [
      teacher.teacher_id,
      teacher.teacherId,
      teacher.name,
      teacher.full_name,
      teacher.email,
    ]
      .map((item) => String(item || "").trim().toLowerCase())
      .filter(Boolean);

    return teacherKeys.some((key) => activeTeacherKeys.includes(key));
  });

  return matchedTeacher?.whatsapp || defaultWhatsapp;
}, [studentAccess, classes, selectedLevel, teachers]);
const isInDefaultClassForSelectedLevel = useMemo(() => {
  if (!studentAccess) return false;

  const studentClassIds = [
    studentAccess.mainClassId,
    ...(studentAccess.extraClassAccess || []),
  ].filter(Boolean);

  const activeClass = classes.find(
    (classItem) =>
      studentClassIds.includes(classItem.id) &&
      classItem.level === selectedLevel
  );

  return !!activeClass?.isDefaultSalesClass;
}, [studentAccess, classes, selectedLevel]);

  const selectedLevelClasses = useMemo(() => {
    return classes.filter((item) => item.level === selectedLevel);
  }, [classes, selectedLevel]);

  const activeDigitalOrder = useMemo(() => {
  if (!currentUser) return undefined;

  const activeOrders = dbActiveOrders
    .map((order: any) => ({
      ...order,
      productSlug: order.product_slug || order.productSlug,
      packageType: order.package_type || order.packageType,
    }))
    .filter(
      (order: any) =>
        String(order.username || "").trim().toLowerCase() ===
          String(currentUser.username || "").trim().toLowerCase() &&
        ["completed", "active"].includes(order.status) &&
        !isLiveCourseSlug(order.productSlug) &&
        getLevelsFromSlug(order.productSlug).includes(selectedLevel)
    );

  function getOrderPackageValue(order: any) {
    const slug = String(order.productSlug || "").toLowerCase();

    if (slug.includes("master")) return 3;
    if (slug.includes("zirve")) return 3;
    if (slug.includes("practice")) return 2;
    if (slug.includes("gelisim")) return 2;
    if (slug.includes("starter")) return 1;

    return getPackageValue(order.packageType as PackageType);
  }

  return activeOrders.sort(
    (a, b) => getOrderPackageValue(b) - getOrderPackageValue(a)
  )[0];
}, [currentUser, selectedLevel, dbActiveOrders, dashboardRefreshKey]);

  const activeLiveCourseLevels = useMemo(() => {
  if (!currentUser) return [];

  const liveOrders = getOrders().filter(
    (order) =>
      order.username === currentUser.username &&
      order.status === "active" &&
      isLiveCourseSlug(order.productSlug)
  );

  return Array.from(
    new Set(liveOrders.flatMap((order) => getLevelsFromSlug(order.productSlug)))
  );
}, [currentUser]);

const firstActiveLiveLevel = LEVELS.find((level) =>
  activeLiveCourseLevels.includes(level)
);

const isFutureLiveCourseLevel =
  activeLiveCourseLevels.includes(selectedLevel) &&
  firstActiveLiveLevel !== selectedLevel;
      const activeLiveOrder = useMemo(() => {
  if (!currentUser || !firstActiveLiveLevel) return undefined;

  return getOrders().find((order) => {
    if (
      order.username !== currentUser.username ||
      order.status !== "active" ||
      !isLiveCourseSlug(order.productSlug)
    ) {
      return false;
    }

    const orderLevels = getLevelsFromSlug(order.productSlug);

    return (
      selectedLevel === firstActiveLiveLevel &&
      orderLevels.includes(selectedLevel)
    );
  });
}, [currentUser, selectedLevel, firstActiveLiveLevel]);
  const activeAccessLevels: string[] = useMemo(() => {
  if (!currentUser) return [selectedLevel];

  const completedOrders = dbActiveOrders.filter(
    (order: any) =>
      String(order.username || "").trim().toLowerCase() ===
        String(currentUser.username || "").trim().toLowerCase() &&
      ["completed", "active"].includes(order.status)
  );

  const levelsFromOrders = completedOrders.flatMap((order: any) =>
    getLevelsFromSlug(order.product_slug || order.productSlug || "")
  );

  const levelsFromAccess = accessibleClassIds
    .map((classId) => classes.find((c) => c.id === classId)?.level)
    .filter(Boolean) as string[];

  const allLevels = Array.from(new Set([...levelsFromOrders, ...levelsFromAccess]));

  return allLevels.length > 0 ? allLevels : [selectedLevel];
}, [currentUser, selectedLevel, dbActiveOrders, accessibleClassIds, classes]);

  const effectivePackageType: PackageType | undefined =
  activeDigitalOrder?.productSlug?.includes("master")
    ? "master"
    : activeDigitalOrder?.productSlug?.includes("practice")
    ? "practice"
    : activeDigitalOrder?.productSlug?.includes("starter")
    ? "starter"
    : (activeDigitalOrder?.packageType as PackageType | undefined) ||
      (activeLiveOrder || isStudentActive ? "starter" : undefined);
      const hasAnyLiveCourseOrder =
  userClasses.some((classItem) => classItem.classType === "live") ||
  activeLiveCourseLevels.length > 0 ||
  localStorage.getItem("selected_product_slug")?.includes("live") ||
  localStorage.getItem("pending_payment_slug")?.includes("live");
  const profileLevel = activeAccessLevels[0] || selectedLevel;
    const packageStudentLabel =
  hasAnyLiveCourseOrder
    ? `${profileLevel} Canlı Kurs Öğrencisi`
    : effectivePackageType === "starter"
    ? `${profileLevel} Başlangıç Öğrencisi`
    : effectivePackageType === "practice"
    ? `${profileLevel} Gelişim Öğrencisi`
    : effectivePackageType === "master"
    ? `${profileLevel} Zirve Öğrencisi`
    : `${profileLevel} Öğrencisi`;
    const isDigitalStarterStudent =
  effectivePackageType === "starter" && !hasAnyLiveCourseOrder;
  const activeAccessEndDate =
  effectivePackageType === "practice" || effectivePackageType === "master"
    ? activeDigitalOrder?.accessEndDate || activeLiveOrder?.accessEndDate || null
    : activeLiveOrder?.accessEndDate || activeDigitalOrder?.accessEndDate || null;

const packageDefaultDays =
  effectivePackageType === "master"
    ? 365
    : effectivePackageType === "practice"
    ? 180
    : 90;

const remainingDays =
  activeAccessEndDate
    ? getRemainingDays(activeAccessEndDate)
    : packageDefaultDays;

const accessExpired =
  activeAccessEndDate ? isAccessExpired(activeAccessEndDate) : false;

paymentNoticeRefreshKey;  
const pendingOrders =
  currentUser !== null
    ? dbPendingOrders.map((order: any) => ({
        id: order.id,
        username: order.username,
        productSlug: order.product_slug,
        level: order.level,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.created_at,
        packageType: "starter",
      }))
    : [];

  const isWaitingPaymentOrActivation = pendingOrders.length > 0;
  const hasPendingOrder = pendingOrders.length > 0;
  useEffect(() => {
  if (!currentUser) return;

  const activeOrder = getOrders().find(
    (order) =>
      order.username === currentUser.username &&
      order.status === "active"
  );

  if (!activeOrder) return;

  const orderLevel = getLevelFromSlug(activeOrder.productSlug);

  setSelectedLevel(orderLevel);
}, [currentUser]);

  const selectedLevelLessons = useMemo(() => {
  return lessons.filter((lesson) => {
    if (lesson.level !== selectedLevel) return false;

    const isLiveLesson = lesson.contentType === "liveClass";
    const isDigitalLesson = lesson.contentType === "digitalPackage";

    const hasClassAccess = lesson.classId
      ? accessibleClassIds.includes(lesson.classId)
      : false;

    if (hasAnyLiveCourseOrder) {
  const lessonPackage = lesson.packageType || "starter";
  const isDigitalStarterLesson = isDigitalLesson && lessonPackage === "starter";
  const isAccessibleLiveLessonAnyPackage = isLiveLesson && hasClassAccess;
  return isDigitalStarterLesson || isAccessibleLiveLessonAnyPackage;
}

    if (isDigitalLesson) {
      return true;
    }

    return false;
  });
}, [
  lessons,
  selectedLevel,
  accessibleClassIds,
  hasAnyLiveCourseOrder,
]);

  const visibleLessons = useMemo(() => {
  return [...selectedLevelLessons].sort((a, b) => {
    const aNum = Number(String(a.title).match(/^(\d+)/)?.[1] || 999);
    const bNum = Number(String(b.title).match(/^(\d+)/)?.[1] || 999);

    return aNum - bNum;
  });
}, [selectedLevelLessons]);
  const selectedLevelHasAccess = isStudentActive;
  const selectedLevelIsUnlocked =
  activeAccessLevels.includes(selectedLevel);
  const upsellTitle = selectedLevelHasAccess
  ? `${getPackageLabel(upsellPackage)} paketiyle daha hızlı hazırlan`
  : `🚀 ${selectedLevel} Premium Arşivi`;

const upsellDescription = selectedLevelHasAccess
  ? `Bu içerik ${getPackageLabel(
      upsellPackage
    )} paketinde açık. Daha fazla ders, deneme ve materyalle gerçek sınava daha güvenli hazırlanabilirsin.`
  : `${selectedLevel} offline ders kayıtları Gelişim paketiyle açılır. 6 ay erişim, TELC tarzı denemeler, PDF materyalleri ve premium çalışma sistemi seni bekliyor.`;

const upsellBadgeText = selectedLevelHasAccess
  ? "Bir üst seviyeye geç"
  : `${selectedLevel} seviyesi kilitli`;

const lessonsForList = selectedLevelHasAccess
  ? visibleLessons
  : selectedLevelLessons;
  const sortedLessonsForList = [...lessonsForList].sort((a, b) => {
  const aNum = Number(String(a.title).match(/^(\d+)/)?.[1] || 999);
  const bNum = Number(String(b.title).match(/^(\d+)/)?.[1] || 999);

  return aNum - bNum;
});
  const pdfMaterials = useMemo(() => {
  return selectedLevelLessons.flatMap((lesson) => {
    const isDigitalPackagePdf =
      lesson.pdfVisibility === "digitalPackage";

    const hasClassAccess = lesson.classId
      ? accessibleClassIds.includes(lesson.classId)
      : false;

    const canShowLessonPdf =
      hasClassAccess || isDigitalPackagePdf;

    if (!canShowLessonPdf) return [];

    const materials: {
      id: string;
      title: string;
      url: string;
      packageType: PackageType;
      lessonTitle: string;
      type: "pdf" | "worksheet";
      source: "class" | "digital";
    }[] = [];

    if (lesson.pdfUrl) {
      materials.push({
        id: `${lesson.id || lesson.title}-main-pdf`,
        title: lesson.pdfTitle || "PDF Materyali",
        url: lesson.pdfUrl,
        packageType: lesson.packageType || "starter",
        lessonTitle: lesson.title,
        type: "pdf",
        source: isDigitalPackagePdf ? "digital" : "class",
      });
    }

    const worksheets =
      lesson.worksheets && lesson.worksheets.length > 0
        ? lesson.worksheets
        : lesson.worksheetUrl
        ? [
            {
              id: "legacy-worksheet",
              title: lesson.worksheetTitle || "Ek çalışma sayfası",
              url: lesson.worksheetUrl,
              packageType: lesson.worksheetPackageType || "practice",
            },
          ]
        : [];

    worksheets.forEach((worksheet) => {
      materials.push({
        id: `${lesson.id || lesson.title}-${worksheet.id}`,
        title: worksheet.title,
        url: worksheet.url,
        packageType: worksheet.packageType,
        lessonTitle: lesson.title,
        type: "worksheet",
        source: isDigitalPackagePdf ? "digital" : "class",
      });
    });

    return materials;
  });
}, [selectedLevelLessons, accessibleClassIds]);
  useEffect(() => {
  if (visibleLessons.length === 0) return;

  const todayLessonKey = `today_lesson_${currentUsername}_${todayKey}`;
  const lessonProgressKey = `lesson_progress_${currentUsername}`;
const savedLessonProgress = Number(localStorage.getItem(lessonProgressKey) || "0");
  const savedTodayLessonId = localStorage.getItem(todayLessonKey);

  const savedLesson = visibleLessons.find((lesson) => {
  if (lesson.id !== savedTodayLessonId) return false;

  if (activeLiveOrder && lesson.contentType === "digitalPackage") {
    return false;
  }

  if (!activeLiveOrder && lesson.contentType === "liveClass") {
    return false;
  }

  return true;
});

if (savedLesson) {
  setTodayLesson(savedLesson);
  return;
}

localStorage.removeItem(todayLessonKey);

  const firstLesson =
  visibleLessons.find((lesson) =>
    activeLiveOrder
      ? lesson.contentType === "liveClass"
      : lesson.contentType === "digitalPackage"
  ) || visibleLessons[0];

if (!firstLesson?.id) {
  return;
}

setTodayLesson(firstLesson);
localStorage.setItem(todayLessonKey, firstLesson.id);
}, [visibleLessons, currentUsername, todayKey]);
useEffect(() => {
  if (!currentUser) return;
  async function loadEslesmeler() {
    const { data } = await supabase
      .from("speaking_matches")
      .select("*")
      .or(`konusan_email.eq.${currentUser?.username},dinleyen_email.eq.${currentUser?.username}`)
      .order("created_at", { ascending: false });
    if (data) setSpeakingEslesmeler(data);
  }
  loadEslesmeler();
}, [currentUser]);
useEffect(() => {
  if (!currentUser) return;
  async function loadSpeakingProgress() {
    setSpeakingProgressLoading(true);
    const { data } = await supabase
      .from("speaking_progress")
      .select("*")
      .eq("username", currentUser!.username)
      .eq("level", "A1")
      .maybeSingle();
if (data) {
      // current_gorev 4+ ise otomatik düzelt
      if (data.current_gorev > 3) {
        const yeniTema = data.current_tema % 3 === 0 ? data.current_tema : data.current_tema + 1;
        const sinav = data.current_tema % 3 === 0;
        const duzeltilmis = {
          ...data,
          current_tema: sinav ? data.current_tema : yeniTema,
          current_gorev: 1,
          sinav_bekleniyor: sinav,
        };
        await supabase.from("speaking_progress")
          .update({
            current_tema: duzeltilmis.current_tema,
            current_gorev: 1,
            sinav_bekleniyor: sinav,
          })
          .eq("id", data.id);
        setSpeakingProgress(duzeltilmis);
      } else {
        setSpeakingProgress(data);
      }
    } else {
      setSpeakingProgress(null);
    }

    // Partner telefon numarasını çek
    if (data?.partner_email) {
      const { data: partnerReq } = await supabase
        .from("speaking_requests")
        .select("telefon, user_name")
        .eq("user_email", data.partner_email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setPartnerTelefon(partnerReq?.telefon || "");
    }

    setSpeakingProgressLoading(false);
  }

  loadSpeakingProgress();
}, [currentUser, speakingBildirimGonderildi]);

  const activePackageCount = userClasses.length;
  const upgradeOffers = getUpgradeOffers(effectivePackageType);

  async function handleUpdateProfile() {
  if (!currentUser) return;

  const oldEmail = String(currentUser.username || "")
    .trim()
    .toLowerCase();

  const newEmail = profileEmail.trim().toLowerCase();
  const newName = profileName.trim();
  const newPassword = profilePassword.trim();

  const oldStudentKey = String(currentUsername || "")
  .trim()
  .toLowerCase();

const newStudentKey = String(profileEmail || currentUsername || "")
  .trim()
  .toLowerCase();

const newDisplayName = String(profileName || "").trim();

  if (!newEmail || !newName) {
    alert("Ad soyad ve email boş bırakılamaz.");
    return;
  }

  const updateData: any = {
    email: newEmail,
    name: newName,
  };

  if (newPassword) {
    updateData.password = newPassword;
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("email", oldEmail);

  if (error) {
    alert("Profil güncellenemedi: " + error.message);
    return;
  }

  if (oldEmail !== newEmail) {
  await supabase
    .from("orders")
    .update({ username: newEmail })
    .eq("username", oldEmail);

  await supabase
    .from("student_class_access")
    .update({ username: newEmail })
    .eq("username", oldEmail);

  await supabase
    .from("mastery_progress")
    .update({
      student_key: newEmail,
      username: newName,
    })
    .or(`student_key.eq.${oldEmail},username.eq.${oldEmail}`);
} else {
  await supabase
    .from("mastery_progress")
    .update({
      username: newName,
    })
    .eq("student_key", oldEmail);
}

  const updatedUser = {
    ...currentUser,
    username: newEmail,
    name: newName,
  };

  localStorage.setItem("mock_logged_user", JSON.stringify(updatedUser));
  setCurrentUser(updatedUser);
  setProfilePassword("");

  alert("Profil bilgileri güncellendi.");
}
  function handleLogout() {
    localStorage.removeItem("mock_logged_user");
    router.push("/");
  }

  function getClassName(classId?: string) {
    if (!classId) return "Sınıf bilgisi yok";

    return (
      classes.find((item) => item.id === classId)?.name || "Sınıf bulunamadı"
    );
  }

  function handleBackupStudyData() {
  const backupData: Record<string, string> = {};

  Object.keys(localStorage).forEach((key) => {
    if (
      key.includes(currentUsername) ||
      key === "user_streak" ||
      key === "last_active_date" ||
      key === "last_selected_lesson"
    ) {
      const value = localStorage.getItem(key);

      if (value !== null) {
        backupData[key] = value;
      }
    }
  });

  const fileContent = JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      username: currentUsername,
      data: backupData,
    },
    null,
    2
  );

  const blob = new Blob([fileContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `almanca-okulum-yedek-${currentUsername}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

  function handleLessonClick(lesson: TeacherLesson) {
  setSelectedLesson(lesson);
  setShowUpsell(false);

  localStorage.setItem("last_selected_lesson", JSON.stringify(lesson));
}

  async function handleUpgrade(packageType: PackageType) {
  if (!currentUser) return;

  const finalPackageType: PackageType = selectedLevelHasAccess
  ? packageType
  : "practice";
  const slug = `${selectedLevel.toLowerCase()}-${finalPackageType}`;
  const link = getShopierLink(slug);

  if (!link) {
    alert("Bu paket için Shopier linki eklenmemiş.");
    return;
  }

  localStorage.setItem(
    "last_payment_attempt",
    JSON.stringify({
      username: currentUser.username,
      slug,
      time: Date.now(),
    })
  );
  setPendingPaymentSlug(slug);
  setHidePendingOrderNotice(false);

  createPendingOrder({
    username: currentUser.username,
    productSlug: slug,
    level: selectedLevel,
  });
  const normalizedUsername = String(currentUser.username || "")
  .trim()
  .toLowerCase();

await supabase.from("orders").insert({
  username: normalizedUsername,
  product_slug: slug,
  level: selectedLevel,
  status: "paid_waiting_activation",
});

  setShowUpsell(false);
  setHidePendingOrderNotice(false);
  setPendingPaymentSlug(slug);
setHidePendingOrderNotice(false);
setPaymentNoticeRefreshKey((prev) => prev + 1);

setDbPendingOrders([
  {
    id: crypto.randomUUID(),
    username: currentUser.username,
    product_slug: slug,
    level: selectedLevel,
    status: "paid_waiting_activation",
    created_at: new Date().toISOString(),
  },
]);

setHidePendingOrderNotice(false);
window.open(link, "_blank");
}

  async function handleStartPendingPayment() {
  if (!currentUser || !pendingPaymentSlug) return;

  const link = getShopierLink(pendingPaymentSlug);

  if (!link) {
    alert("Bu ürün için Shopier linki henüz eklenmemiş.");
    return;
  }

  const normalizedUsername = String(currentUser.username || "")
  .trim()
  .toLowerCase();

const { data: existingOrders, error: findOrderError } = await supabase
  .from("orders")
  .select("*")
  .eq("username", normalizedUsername)
  .eq("product_slug", pendingPaymentSlug)
  .in("status", ["pending_payment", "paid_waiting_activation"])
  .limit(1);

if (findOrderError) {
  alert("Sipariş kontrol edilemedi: " + findOrderError.message);
  return;
}

if (existingOrders && existingOrders.length > 0) {
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "paid_waiting_activation" })
    .eq("id", existingOrders[0].id);

  if (updateError) {
    alert("Sipariş güncellenemedi: " + updateError.message);
    return;
  }
} else {
  const { error: insertError } = await supabase.from("orders").insert({
    username: normalizedUsername,
    product_slug: pendingPaymentSlug,
    level: getLevelFromSlug(pendingPaymentSlug),
    status: "paid_waiting_activation",
  });

  if (insertError) {
    alert("Sipariş oluşturulamadı: " + insertError.message);
    return;
  }
}

setPendingPaymentSlug("");
setHidePendingOrderNotice(false);
setPaymentNoticeRefreshKey((prev) => prev + 1);

  localStorage.removeItem("selected_product_slug");
  localStorage.removeItem("selectedProductSlug");

  window.open(link, "_blank");
}
  function handleContinuePayment() {
    const pendingOrder = pendingOrders[0];
    const link = pendingOrder ? getShopierLink(pendingOrder.productSlug) : "";

    if (!link) {
      alert("Bu paket için ödeme linki bulunamadı.");
      return;
    }

    window.open(link, "_blank");
  }

  function getSpeakingUnlockedThemeCount(masteryCompletedCount: number): number {
  return Math.min(12, masteryCompletedCount + 1);
}
function getSpeakingRozet(temaNo: number, sinavaGecildi: boolean): string {
  if (temaNo >= 12 && sinavaGecildi) return "🏆 Konuşma Şampiyonu";
  if (temaNo >= 9 && sinavaGecildi) return "🥇 Altın Konuşmacı";
  if (temaNo >= 6 && sinavaGecildi) return "🥈 Gümüş Konuşmacı";
  if (temaNo >= 3 && sinavaGecildi) return "🥉 Bronz Konuşmacı";
  return "🎤 Aday";
}

function getSinavSuresi(temaNo: number): number {
  return (temaNo / 3) * 180; // Her 3 temada 180 saniye (3 dk)
}

function getSinavSuresiLabel(temaNo: number): string {
  const dakika = (temaNo / 3) * 3;
  return dakika + " dakika";
}

async function handleSpeakingBildirim() {
  if (!currentUser || !speakingProgress) return;
  setSpeakingGorevBildiriliyor(true);

  const now = new Date().toISOString();
  const bugun = now.slice(0, 10);
  const benimEmail = currentUser.username;
  const partnerEmail = speakingProgress.partner_email || "";
  const currentTema = speakingProgress.current_tema;
  const currentGorev = speakingProgress.current_gorev;

  // Sınav bekliyorsa bildirim atılamaz
  if (speakingProgress.sinav_bekleniyor) {
    setSpeakingGorevBildiriliyor(false);
    setSpeakingTeşvikMesaj({
      icon: "🎓",
      baslik: "Önce Sınavını Geç!",
      mesaj: "Bu temayı tamamladın. Bir sonraki temaya geçmek için sınav hocası talep et ve sınavını tamamla.",
      renk: "from-yellow-400 to-orange-400",
    });
    return;
  }

  // Bu tema+görev için mevcut session'ı bul
  const { data: sessions } = await supabase
    .from("speaking_sessions")
    .select("*")
    .eq("tema_no", currentTema)
    .eq("gorev_no", currentGorev)
    .eq("level", "A1")
    .eq("onaylandi", false);

  const session = sessions?.find(s => {
    const emailler = [
      s.kullanici1_email, s.kullanici2_email,
      s.konusan_email, s.dinleyen_email
    ].filter(Boolean);
    return emailler.includes(benimEmail) || emailler.includes(partnerEmail);
  });

  if (session) {
    // Ben zaten bildirdim mi?
    const benBildirdim =
      (session.kullanici1_email === benimEmail && session.kullanici1_bildirdi) ||
      (session.kullanici2_email === benimEmail && session.kullanici2_bildirdi) ||
      (session.konusan_email === benimEmail && session.konusan_bildirdi) ||
      (session.dinleyen_email === benimEmail && session.dinleyen_bildirdi);

    if (benBildirdim) {
      setSpeakingGorevBildiriliyor(false);
      setBildirimUyariModal(true);
      return;
    }

    // Bugün zaten bildirim attım mı?
    if (speakingProgress.son_bildirim_tarihi === bugun) {
      setSpeakingGorevBildiriliyor(false);
      setBildirimUyariModal(true);
      return;
    }

    const benim1mi = session.kullanici1_email === benimEmail || session.konusan_email === benimEmail;
    const updateData: any = benim1mi
      ? { kullanici1_bildirdi: true, konusan_bildirdi: true }
      : { kullanici2_bildirdi: true, dinleyen_bildirdi: true };

    const digerBildirdi =
      (session.kullanici1_email === partnerEmail && session.kullanici1_bildirdi) ||
      (session.kullanici2_email === partnerEmail && session.kullanici2_bildirdi) ||
      (session.konusan_email === partnerEmail && session.konusan_bildirdi) ||
      (session.dinleyen_email === partnerEmail && session.dinleyen_bildirdi);

    if (digerBildirdi) {
      updateData.onaylandi = true;
      updateData.onay_tarihi = now;
    }

    await supabase.from("speaking_sessions").update(updateData).eq("id", session.id);

    if (digerBildirdi) {
      const yeniGorev = currentGorev + 1;
      let yeniTema = currentTema;
      let sinav_bekleniyor = false;

      if (yeniGorev > 3) {
        if (currentTema % 3 === 0) {
          sinav_bekleniyor = true;
        } else {
          yeniTema = currentTema + 1;
        }
      }

      const progressUpdate: any = {
        son_bildirim_tarihi: bugun,
        gorev_tarihleri: [...(speakingProgress.gorev_tarihleri || []), bugun],
      };

      if (sinav_bekleniyor) {
        progressUpdate.sinav_bekleniyor = true;
      } else if (yeniGorev > 3) {
        progressUpdate.current_tema = yeniTema;
        progressUpdate.current_gorev = 1;
        progressUpdate.sinav_bekleniyor = false;
      } else {
        progressUpdate.current_gorev = yeniGorev;
        progressUpdate.sinav_bekleniyor = false;
      }

      await supabase.from("speaking_progress")
        .update(progressUpdate)
        .eq("id", speakingProgress.id);

      const { data: partnerProg } = await supabase
        .from("speaking_progress")
        .select("*")
        .eq("username", partnerEmail)
        .eq("level", "A1")
        .maybeSingle();

      if (partnerProg) {
        await supabase.from("speaking_progress")
          .update(progressUpdate)
          .eq("id", partnerProg.id);
      }

      const { data: yeniData } = await supabase
        .from("speaking_progress")
        .select("*")
        .eq("id", speakingProgress.id)
        .single();
      if (yeniData) setSpeakingProgress(yeniData);

      // Teşvik mesajı
      if (sinav_bekleniyor) {
        setSpeakingTeşvikMesaj({
          icon: "🎓",
          baslik: "Tebrikler! 3 Tema Tamamlandı!",
          mesaj: `Harika iş çıkardınız! Tema ${currentTema} bitti. Şimdi sınav hocası talep ederek sınavını tamamla ve bir sonraki temaya geç!`,
          renk: "from-yellow-400 to-orange-400",
        });
      } else if (yeniGorev > 3) {
        setSpeakingTeşvikMesaj({
          icon: "🎊",
          baslik: "Tema Tamamlandı!",
          mesaj: `Bravo! Tema ${currentTema} başarıyla bitti. Tema ${yeniTema} şimdi açıldı, devam edin!`,
          renk: "from-emerald-500 to-teal-500",
        });
      } else if (yeniGorev === 3) {
        setSpeakingTeşvikMesaj({
          icon: "🔥",
          baslik: "Son Görev Kaldı!",
          mesaj: `Bu temayı bitirmek için son göreviniz kaldı. Hadi son hamle! İkisi de bildirim atınca tema tamamlanacak.`,
          renk: "from-blue-500 to-indigo-500",
        });
      } else {
        setSpeakingTeşvikMesaj({
          icon: "✅",
          baslik: `${currentGorev}. Görevi Tamamladınız!`,
          mesaj: `Aynı görevi ${3 - currentGorev} kere daha yapmalısınız. Şu an ${yeniGorev}. günün görevindeydiniz.`,
          renk: "from-emerald-500 to-blue-500",
        });
      }

    } else {
      // Sadece ben bildirdim — partner bekleniyor
      await supabase.from("speaking_progress")
        .update({ son_bildirim_tarihi: bugun })
        .eq("id", speakingProgress.id);

      setSpeakingTeşvikMesaj({
        icon: "⏳",
        baslik: "Bildirimin Alındı!",
        mesaj: "Partnerinin de bildirim atması bekleniyor. İkisi de atınca görev onaylanacak.",
        renk: "from-slate-500 to-slate-700",
      });
    }

  } else {
    // Bugün zaten bildirim attım mı?
    if (speakingProgress.son_bildirim_tarihi === bugun) {
      setSpeakingGorevBildiriliyor(false);
      setBildirimUyariModal(true);
      return;
    }

    // İlk bildirim — yeni session oluştur
    await supabase.from("speaking_sessions").insert({
      kullanici1_email: benimEmail,
      kullanici2_email: partnerEmail,
      konusan_email: benimEmail,
      dinleyen_email: partnerEmail,
      level: "A1",
      tema_no: currentTema,
      gorev_no: currentGorev,
      kullanici1_bildirdi: true,
      kullanici2_bildirdi: false,
      konusan_bildirdi: true,
      dinleyen_bildirdi: false,
      onaylandi: false,
    });

    await supabase.from("speaking_progress")
      .update({ son_bildirim_tarihi: bugun })
      .eq("id", speakingProgress.id);

    setSpeakingTeşvikMesaj({
      icon: "⏳",
      baslik: "Bildirimin Alındı!",
      mesaj: "Partnerinin de bildirim atması bekleniyor. İkisi de atınca görev onaylanacak.",
      renk: "from-slate-500 to-slate-700",
    });
  }

  setSpeakingGorevBildiriliyor(false);
  setSpeakingBildirimGonderildi(true);
  completeSpeakingTask();
  setTimeout(() => setSpeakingBildirimGonderildi(false), 4000);
}

if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        Yükleniyor...
      </main>
    );
  }
  if (!isStudentActive) {
  return (
    <main className="relative min-h-screen bg-slate-100">
      
      {/* 🔹 ARKA DASHBOARD BLUR */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-100">
  <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
    <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold text-blue-600">
          Almanca Okulum
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          TELC Hazırlık Paneli
        </p>
      </div>

      <nav className="space-y-2 text-sm font-semibold">
        {[
          "🏠 Ana Sayfa",
          "🎬 Dersler",
          "🎤 Pratik",
          "📚 Ustalık",
          "🎮 Kelime Arenası",
          "📊 İlerleme",
          "🏆 Rozetler",
        ].map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl px-4 py-3 ${
              index === 0
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "bg-slate-50 text-slate-500"
            }`}
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>

    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          TELC hazırlık panelin hazır 👋
        </h1>

        <p className="mt-2 text-sm opacity-90">
          Dersler, PDF materyalleri, konuşma görevleri ve ilerleme takibi bu panelde.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["Video Dersler", "PDF Materyaller", "TELC Denemeler"].map((item) => (
            <div key={item} className="rounded-2xl bg-white/20 p-4 backdrop-blur">
              <p className="text-xs opacity-80">{item}</p>
              <p className="mt-2 text-2xl font-bold">🔒</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Kaldığın Ders", "İlk dersini aç ve hazırlığa başla"],
          ["Günlük Görevler", "Her gün küçük adımlarla ilerle"],
          ["Konuşma Pratiği", "WhatsApp ile konuşma görevi gönder"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-3xl bg-white p-5 shadow-lg">
            <p className="text-sm font-semibold text-blue-600">{title}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {desc}
            </h2>
            <div className="mt-5 h-3 rounded-full bg-slate-100">
              <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            </div>
          </div>
        ))}
      </section>
    </div>
  </div>
</div>

      {/* 🔹 MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 px-4 backdrop-blur-[2px]">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
            🔒
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Devam etmek için erişimi aç
          </h1>

          {hasPendingOrder ? (
  <>
    <p className="mt-3 text-sm leading-6 text-slate-600">
      Siparişiniz oluşturuldu. Ödeme yaptıysanız erişiminiz admin onayından
      sonra açılacaktır.
    </p>

    <a
      href={`https://wa.me/905013434419?text=${encodeURIComponent(
        `Merhaba, ödeme dekontumu göndermek istiyorum. Kullanıcı: ${currentUser.username}`
      )}`}
      target="_blank"
      className="mt-6 block w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
    >
      📩 Dekontu WhatsApp’tan Gönder
    </a>

    <button
      type="button"
      onClick={handleContinuePayment}
      className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100"
    >
      Ödeme Sayfasını Tekrar Aç
    </button>
  </>
) : pendingPaymentSlug ? (
  <>
    <p className="mt-3 text-sm leading-6 text-slate-600">
      Seçtiğiniz paket hazır. Devam etmek için ödeme adımını tamamlayın.
      Ödeme sonrası erişiminiz admin tarafından açılır.
    </p>

    <button
      type="button"
      onClick={handleStartPendingPayment}
      className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-700 hover:to-indigo-600"
    >
      💳 Shopier ile Ödeme Yap
    </button>
  </>
) : (
  <p className="mt-3 text-sm leading-6 text-slate-600">
    Henüz bir paket seçmediniz. Ana sayfadan paket seçerek devam edin.
  </p>
)}

          <p className="mt-4 text-xs text-slate-500">
            Ödeme yaptıktan sonra erişiminiz kısa sürede aktif edilir.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 block w-full rounded-xl border px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-100 text-slate-900">
      {pwaGoster && (
  <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#0f172a", color: "#fff", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 -4px 24px rgba(0,0,0,0.3)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img src="/images/icon-192.png" style={{ width: 44, height: 44, borderRadius: 10 }} alt="ikon" />
      <div>
        <div style={{ fontWeight: 900, fontSize: 14 }}>Almanca Okulum</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Ana ekrana ekle, uygulamayı kullan</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={pwaYukle}
        style={{ background: "#059669", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 13 }}>
        Yükle
      </button>
      <button onClick={() => setPwaGoster(false)}
        style={{ background: "transparent", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}>
        ✕
      </button>
    </div>
  </div>
)}
      {showUpsell && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
          🚀
        </div>

        <p className="mt-5 text-sm font-black uppercase tracking-widest text-yellow-600">
  {upsellBadgeText}
</p>

<h2 className="mt-2 text-3xl font-black text-slate-900">
  {upsellTitle}
</h2>

<p className="mt-3 text-sm leading-6 text-slate-600">
  {upsellDescription}
</p>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-700 text-left">

  <div>
    <p className="font-bold text-slate-900">
      ✓ Daha fazla video ders
    </p>
    <p className="text-xs text-slate-500">
      Önemli konuları ve tüyoları öğren, sınava daha hazır ol.
    </p>
  </div>

  <div>
    <p className="font-bold text-slate-900">
      ✓ Daha uzun erişim
    </p>
    <p className="text-xs text-slate-500">
      Ders kayıtlarına 3 ay yerine 6 ay erişim hakkı kazan.
    </p>
  </div>

  <div>
    <p className="font-bold text-slate-900">
      ✓ Daha fazla deneme
    </p>
    <p className="text-xs text-slate-500">
      Gerçek sınavla birebir uyumlu 5 dijital deneme hakkı kazan.
    </p>
  </div>

  <div>
    <p className="font-bold text-slate-900">
      ✓ Ekstra materyaller
    </p>
    <p className="text-xs text-slate-500">
      Gelişim öğrencilerine özel çalışma sayfaları ve kamp içeriklerine eriş.
    </p>
  </div>
</div>

      <button
        type="button"
        onClick={() => handleUpgrade(upsellPackage)}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-4 text-sm font-black text-slate-950 shadow-lg hover:from-yellow-300 hover:to-orange-300"
      >
        {selectedLevelHasAccess
  ? `🚀 ${getPackageLabel(upsellPackage)} Paketine Yükselt`
  : `🚀 ${selectedLevel} Gelişim Paketini Aç`}
      </button>

      <button
        type="button"
        onClick={() => setShowUpsell(false)}
        className="mt-3 w-full rounded-2xl border px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
      >
        Şimdilik devam et
      </button>
    </div>
  </div>
)}
      {hasPendingOrder && !hidePendingOrderNotice && (
  <div className="mx-auto max-w-7xl px-4 pt-6">
    <section className="relative rounded-3xl border border-blue-200 bg-blue-50 p-6 text-slate-900 shadow-lg">
      <button
  onClick={() => {
  localStorage.removeItem("last_payment_attempt");
  setPendingPaymentSlug("");
  setHidePendingOrderNotice(true);
}}
  className="absolute right-4 top-4 text-sm font-bold text-slate-400 hover:text-slate-700"
>
  ✕
</button>
      <p className="text-sm font-black uppercase tracking-widest text-blue-700">
        Siparişin onay bekliyor ⏳
      </p>

      <h2 className="mt-2 text-xl font-black">
        Ödeme yaptıysan dekontunu gönder
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Siparişin admin paneline düştü. Dekontu WhatsApp’tan gönderirsen
        erişimin daha hızlı aktif edilir.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://wa.me/905013434419?text=${encodeURIComponent(
            `Merhaba, ödeme yaptım. Dekont göndermek istiyorum. Kullanıcı: ${currentUser.username}`
          )}`}
          target="_blank"
          className="rounded-2xl bg-green-600 px-5 py-3 text-center text-sm font-black text-white hover:bg-green-700"
        >
          📩 Dekontu WhatsApp’tan Gönder
        </a>

        <button
          type="button"
          onClick={handleContinuePayment}
          className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-yellow-300"
        >
          💳 Ödeme Sayfasını Tekrar Aç
        </button>
      </div>
    </section>
  </div>
)}
      {showLevelUpPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-4xl">
        🎉
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900">
        Level Atladın!
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Artık Level {level} – {levelLabel}
      </p>

      <button
        type="button"
        onClick={() => setShowLevelUpPopup(false)}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
      >
        Harika, devam edelim
      </button>
    </div>
  </div>
)}
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-3xl bg-white p-5 shadow-lg lg:block">
  <div className="mb-8">
    <h2 className="text-xl font-extrabold text-blue-600">
      Almanca Okulum
    </h2>
    <p className="mt-1 text-xs text-slate-500">
      TELC Hazırlık Paneli
    </p>
  </div>
  <nav className="space-y-2 text-sm font-semibold">
  {[
  { key: "home", label: "Ana Sayfa", icon: "🏠" },
  { key: "lessons", label: "Dersler", icon: "🎬" },
  { key: "materials", label: "Çalışma Sayfaları", icon: "📄" },
  { key: "vocabulary", label: "Ustalık", icon: "📚" },
  { key: "wordgame", label: "Kelime Arenası", icon: "🎮" },
  { key: "speaking", label: "Konuşma Klübü", icon: "🎙️" },
  ...(hasAnyLiveCourseOrder ? [{ key: "classleague", label: "Sınıf Ligi ⚡", icon: "🏆" }] : []),
  { key: "exams", label: "Deneme Sınavları", icon: "📝" },
  { key: "progress", label: "İlerleme", icon: "📊" },
  { key: "badges", label: "Rozetler", icon: "🏆" },
  { key: "settings", label: "Ayarlar", icon: "⚙️" },
].map((item) => (
    <button
      key={item.key}
      type="button"
      onClick={() => {
  setActiveDashboardTab(item.key);
  if (item.key === "wordgame") completeDailyTask("pdf");
}}
      className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
        activeDashboardTab === item.key
  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="mr-2">{item.icon}</span>
{item.label}
    </button>
  ))}
</nav>

  <div className="mt-10 rounded-3xl bg-slate-50 p-4">
  <div className="flex items-center gap-3">
    <img
  src="/images/icon.png"
  alt="Almanca Okulum"
  className="h-12 w-auto"
/>

    <div>
      <p className="text-sm font-bold text-slate-900">
        Öğrenci
      </p>
      <p className="text-xs text-slate-500">
        {packageStudentLabel}
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={handleLogout}
    className="mt-4 w-full rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
  >
    Çıkış Yap
  </button>
</div>
</aside>
<div className="relative mb-4 block w-full max-w-full overflow-hidden lg:hidden">
  <div className="w-full overflow-x-auto rounded-2xl bg-white p-3 shadow">
    <div className="flex max-w-full gap-2 overflow-x-auto pr-20">
      {[
  { key: "home", label: "Ana Sayfa", icon: "🏠" },
  { key: "lessons", label: "Dersler", icon: "🎬" },
   { key: "materials", label: "Çalışma Sayfaları", icon: "📄" },
  { key: "vocabulary", label: "Ustalık", icon: "📚" },
  { key: "wordgame", label: "Kelime Arenası", icon: "🎮" },
  { key: "speaking", label: "Konuşma Klübü", icon: "🎙️" },
  ...(hasAnyLiveCourseOrder ? [{ key: "classleague", label: "Sınıf Ligi ⚡", icon: "🏆" }] : []),
  { key: "exams", label: "Deneme Sınavları", icon: "📝" },
  { key: "progress", label: "İlerleme", icon: "📊" },
  { key: "badges", label: "Rozetler", icon: "🏆" },
  { key: "settings", label: "Ayarlar", icon: "⚙️" },
].map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => {
  setActiveDashboardTab(item.key);
  if (item.key === "wordgame") completeDailyTask("pdf");
}}
          className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold whitespace-nowrap ${
            activeDashboardTab === item.key
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow"
              : "bg-slate-50 text-slate-600"
          }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  </div>

<div className="pointer-events-none absolute right-0 top-0 h-full w-20 rounded-r-2xl bg-gradient-to-l from-white via-white/80 to-transparent" />
</div>
<div className="w-full min-w-0 overflow-hidden">
<section
  className={`grid gap-6 lg:grid-cols-[1.6fr_0.9fr] ${
    activeDashboardTab === "lessons" ? "block" : "hidden"
  }`}
>
  <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-lg transition hover:scale-[1.02] hover:shadow-xl">
    <h2 className="mb-4 text-xl font-bold text-slate-900">
      {selectedLevel} Ders İzleme Alanı
    </h2>

            {selectedLesson ? (
  <div id="lesson-watch-area">
    
    <div
  id="lesson-player"
  className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-black/10"
>
  <iframe
    src={getEmbedUrl(selectedLesson.videoUrl)}
    title={selectedLesson.title}
    className="h-full w-full"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  />
</div>
{todayLesson?.id === selectedLesson.id && !completedTasks.lesson && (
  <button
    type="button"
    onClick={() => {
      completeDailyTask("lesson");

      const openedLessonKey = `opened_lesson_${currentUsername}_${selectedLesson.id}`;
      localStorage.setItem(openedLessonKey, "true");

      const lessonProgressKey = `lesson_progress_${currentUsername}`;
      const currentProgress = Number(
        localStorage.getItem(lessonProgressKey) || "0"
      );

      localStorage.setItem(lessonProgressKey, String(currentProgress + 1));

      const todayLessonKey = `today_lesson_${currentUsername}_${todayKey}`;
      localStorage.removeItem(todayLessonKey);
    }}
    className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
  >
    ✅ Dersi izledim, görevimi tamamla
  </button>
)}

                <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                  {selectedLesson.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {getClassName(selectedLesson.classId)}
                </p>

                <p className="mt-1 text-sm text-emerald-600 font-semibold">
                  Ders Paketi: {getPackageLabel(selectedLesson.packageType)}
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {selectedLesson.pdfUrl && (
  <a
    href={selectedLesson.pdfUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => {
      e.preventDefault();

      const openedPdfKey = `opened_pdf_${currentUsername}_${selectedLesson.id}_main`;
      const isTodayLesson = todayLesson?.id === selectedLesson.id;
      const alreadyOpened = localStorage.getItem(openedPdfKey);

      window.open(selectedLesson.pdfUrl, "_blank", "noopener,noreferrer");

      if (!alreadyOpened && isTodayLesson) {
  completeDailyTask("pdf");

  setCompletedTasks((prev) => ({
    ...prev,
    pdf: true,
  }));

  localStorage.setItem(openedPdfKey, "true");
}
    }}
    className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-700 hover:bg-blue-100"
  >
    <p className="font-bold">
      📄 {selectedLesson.pdfTitle || "PDF Materyali"}
    </p>
    <p className="mt-1 text-xs text-blue-600">
      Bu materyal paketinizde açık.
    </p>
  </a>
)}

  {(selectedLesson.worksheets && selectedLesson.worksheets.length > 0
    ? selectedLesson.worksheets
    : selectedLesson.worksheetUrl
      ? [
          {
            id: "legacy-worksheet",
            title: selectedLesson.worksheetTitle || "Ek çalışma sayfası",
            url: selectedLesson.worksheetUrl,
            packageType:
              selectedLesson.worksheetPackageType || "practice",
          },
        ]
      : []
  ).map((worksheet) => {
    const canAccessWorksheet = canAccessLessonPackage(
      effectivePackageType,
      worksheet.packageType
    );

    return (
      <button
        key={worksheet.id}
        type="button"
        onClick={() => {
          if (!canAccessWorksheet) {
            setUpsellPackage(worksheet.packageType);
            setShowUpsell(true);
            return;
          }

         const openedPdfKey = `opened_pdf_${currentUsername}_${worksheet.id}`;
         const isTodayLesson = todayLesson?.id === selectedLesson.id;
const alreadyOpened = localStorage.getItem(openedPdfKey);

if (!alreadyOpened && isTodayLesson) {
  completeDailyTask("pdf");

  setCompletedTasks((prev) => ({
    ...prev,
    pdf: true,
  }));

  localStorage.setItem(openedPdfKey, "true");
}

window.open(worksheet.url, "_blank");
        }}
        className={`rounded-2xl border p-4 text-left text-sm font-semibold transition ${
          canAccessWorksheet
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-yellow-300 hover:bg-yellow-50"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold">📝 {worksheet.title}</p>

          {!canAccessWorksheet && (
            <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
              🔒 Kilitli
            </span>
          )}
        </div>

        <p className="mt-1 text-xs">
          {canAccessWorksheet
            ? "Bu materyal paketinizde açık."
            : `${getPackageLabel(worksheet.packageType)} paketinde açılır.`}
        </p>
      </button>
    );
  })}
</div>

                {selectedLesson.homework && (
  <div className="mt-5 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
        ✍️
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
          Öğretmen Görevi
        </p>

        <h4 className="text-lg font-black text-slate-900">
          Ders Sonrası Çalışma
        </h4>
      </div>
    </div>

    <div className="mt-4 rounded-2xl bg-white/80 p-4">
      <p className="text-sm leading-7 text-slate-700">
        {selectedLesson.homework}
      </p>
    </div>

    <div className="mt-4 rounded-2xl border border-amber-100 bg-white px-4 py-3">
      <p className="text-xs font-semibold leading-6 text-slate-500">
        Görevi tamamladıktan sonra konuşma kaydı veya yazılı çalışmanı
        öğretmenine gönderebilirsin.
      </p>
    </div>
  </div>
)}
              </div>
            ) : lessonsForList.length > 0 ? (
            <div
  className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 shadow-sm"
>
  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />

  <div className="relative flex min-h-[340px] flex-col items-center justify-center text-center">
    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg shadow-blue-100 ring-1 ring-blue-100">
      <span className="text-5xl">▶️</span>
    </div>

    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
      Ders izleme alanı
    </p>

    <h3 className="mt-3 max-w-xl text-2xl font-black tracking-tight text-slate-900">
      Ders içeriklerini izlemeye hazır mısın?
    </h3>

    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
      Ders listesinden bir ders seçerek videoyu burada izleyebilir, notlarını alabilir
      ve TELC hazırlık sürecinde ilerlemeye devam edebilirsin.
    </p>

    <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-purple-100 bg-white/80 px-5 py-3 text-sm font-bold text-purple-700 shadow-sm">
      <span>💡</span>
      <span>Düzenli çalış, istikrarlı ilerle, hedeflerine ulaş!</span>
    </div>
  </div>
</div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
  <p className="text-xs font-black uppercase tracking-widest text-blue-700">
    Ders alanı hazırlanıyor
  </p>

  <h3 className="mt-2 text-xl font-black text-slate-900">
    Bu seviyedeki içerikler yakında burada görünecek
  </h3>

  <p className="mt-3 text-sm leading-7 text-slate-600">
    Ders kayıtları ve materyaller öğretmeniniz tarafından sisteme eklendikçe
    bu alanda otomatik olarak yayınlanır.
  </p>
</div>
            )}
          </div>

          <aside
  id="lesson-list"
  className="rounded-3xl bg-white p-6 text-slate-900 shadow-lg"
>
  <h2 className="mb-4 text-xl font-bold text-slate-900">
    {selectedLevel} Ders Kayıtları
  </h2>
  <div className="mb-6 flex flex-wrap gap-2">
  {(["A1", "A2", "B1"] as const).map((levelItem) => {
    const hasAccess = activeAccessLevels.includes(levelItem);

    return (
      <button
        key={levelItem}
        onClick={() => {
  const hasAccess = activeAccessLevels.includes(levelItem);

  if (!hasAccess) {
  setSelectedLevel(levelItem);
  setSelectedLesson(null);
  setShowUpsell(false);
  return;
}

  setSelectedLevel(levelItem);
  setSelectedLesson(null);
}}
        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
          hasAccess
            ? selectedLevel === levelItem
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            : "cursor-not-allowed bg-slate-100 text-slate-400"
        }`}
      >
        {hasAccess ? "✓" : "🔒"} {levelItem}
      </button>
    );
  })}
</div>
{!activeAccessLevels.includes(selectedLevel) && (
  <div className="mb-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-xl text-white shadow-md">
        🔒
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
          Premium seviye kilitli
        </p>

        <h3 className="mt-1 text-lg font-black text-slate-900">
          {selectedLevel} ders kayıtları seni bekliyor
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bu seviyedeki canlı ders kayıtları ve offline premium arşiv şu anda
          hesabında açık değil. Paketi yükselterek ya da {selectedLevel} canlı
          kursuna katılarak bu alandaki derslere erişebilirsin.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
  type="button"
  onClick={() => {
    setUpsellPackage("practice");
    setShowUpsell(true);
  }}
  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
>
  🚀 Paketi Yükselt
</button>

          <button
  type="button"
  onClick={() => {
    const slug = `live-${selectedLevel.toLowerCase()}`;

    const link = getShopierLink(slug);

    if (!link) {
      alert(`${selectedLevel} canlı kurs Shopier linki henüz eklenmemiş.`);
      return;
    }

    window.open(link, "_blank");
  }}
  className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-700 hover:bg-amber-50"
>
  🎓 {selectedLevel} Canlı Kursunu İncele
</button>
        </div>
      </div>
    </div>
  </div>
)}

  {selectedLevelClasses.length === 0 && (
    <p className="mb-4 text-sm text-slate-400">
      Bu seviye için henüz sınıf oluşturulmamış.
    </p>
  )}

  {isFutureLiveCourseLevel && (
  <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
    <p className="text-xs font-black uppercase tracking-widest text-blue-700">
      Kurs sürecinde açılacak
    </p>

    <h3 className="mt-2 text-lg font-black text-slate-900">
      {selectedLevel} ders kayıtları daha sonra yayınlanacak
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
      Bu seviyedeki ders kayıtları kurs sürecinde burada yayınlanacaktır.
    </p>
  </div>
)}
  {activeAccessLevels.includes(selectedLevel) && !isFutureLiveCourseLevel && (
  <div className="grid gap-4">

    {(["starter", "practice", "master"] as PackageType[])
  .filter((packageGroup) => {
  const currentValue = getPackageValue(effectivePackageType);

  // Canlı kurs öğrencisi:
  // Başlangıç açık, Gelişim kilitli teaser olarak görünsün.
  // Zirve şimdilik görünmesin.
  if (hasAnyLiveCourseOrder) {
    return packageGroup === "starter" || packageGroup === "practice";
  }

  // Dijital Başlangıç:
  // Başlangıç açık, Gelişim kilitli teaser olarak görünsün.
  if (currentValue <= 1) {
    return packageGroup === "starter" || packageGroup === "practice";
  }

  // Dijital Gelişim:
  // Başlangıç + Gelişim açık, Zirve kilitli teaser olarak görünsün.
  if (currentValue === 2) {
    return (
      packageGroup === "starter" ||
      packageGroup === "practice" ||
      packageGroup === "master"
    );
  }

  return true;
})
  .map((packageGroup) => {
    
    const groupLessons = selectedLevelLessons.filter((lesson) => {
  const isDigitalPackage = lesson.contentType === "digitalPackage";
  const isLiveClassLesson = lesson.contentType === "liveClass";

  const hasClassAccess = lesson.classId
    ? accessibleClassIds.includes(lesson.classId)
    : false;

  if (packageGroup === "starter") {
  const lessonNumber = Number(
    String(lesson.title)
      .trim()
      .match(/^(\d+)/)?.[1] || 999
  );

  const isStarterLesson =
    (lesson.packageType || "starter") === "starter";

  if (!isStarterLesson) return false;

  // Canlı kurs öğrencisi:
  // 1) Ortak dijital başlangıç havuzundaki tüm resmi dersleri görür.
  // 2) Varsa kendi canlı sınıfına yüklenen başlangıç kayıtlarını da görür.
  if (hasAnyLiveCourseOrder) {
    if (isDigitalPackage) return true;

    if (isLiveClassLesson && hasClassAccess) return true;

    return false;
  }

  // Dijital Başlangıç öğrencisi:
  // Sadece ilk 18 resmi başlangıç dersini görür.
  if (effectivePackageType === "starter") {
    return isDigitalPackage && lessonNumber <= 18;
  }

  // Dijital Gelişim / Zirve öğrencisi:
  // Başlangıç havuzundaki tüm resmi dersleri görür.
  return isDigitalPackage;
}
if (packageGroup === "practice") {
  if (hasAnyLiveCourseOrder) {
    return (
      isLiveClassLesson &&
      hasClassAccess &&
      (lesson.packageType || "starter") === "practice"
    );
  }

  return (
    isDigitalPackage &&
    (lesson.packageType || "starter") === "practice"
  );
}

  if (packageGroup === "master") {
    return (
      isDigitalPackage &&
      (lesson.packageType || "starter") === "master"
    );
  }

  return false;
});

    if (groupLessons.length === 0) return null;

const sortedGroupLessons = [...groupLessons].sort((a, b) => {
  const aNum = Number(String(a.title).trim().match(/^(\d+)/)?.[1] || 999);
  const bNum = Number(String(b.title).trim().match(/^(\d+)/)?.[1] || 999);

  return aNum - bNum;
});

const packageIsOpen =
  hasAnyLiveCourseOrder && packageGroup === "starter"
    ? true
    : canAccessLessonPackage(effectivePackageType, packageGroup);

    return (
      <div
        key={packageGroup}
        className="flex h-[420px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              {getPackageLabel(packageGroup)} İçerikleri
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {groupLessons.length} ders içerir
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              packageIsOpen
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            {packageIsOpen ? "Açık" : "Premium"}
          </span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {sortedGroupLessons.map((lesson, index) => {
            const hasPackageAccess =
  hasAnyLiveCourseOrder && packageGroup === "starter"
    ? true
    : canAccessLessonPackage(
        effectivePackageType,
        lesson.packageType || "starter"
      );

const isOpen =
  !!effectivePackageType && hasPackageAccess && !accessExpired;

            return (
              <button
                key={`${lesson.title}-${index}`}
                type="button"
                onClick={() => {
                  if (!isOpen) {
                    setUpsellPackage(packageGroup);
                    setShowUpsell(true);
                    return;
                  }

                  handleLessonClick(lesson);
                }}
                className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition ${
                  isOpen
                    ? "border-emerald-200 bg-white hover:bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-yellow-300 hover:bg-yellow-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    {lesson.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      isOpen
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isOpen ? (
  "Açık"
) : (
  <span className="flex items-center gap-1">
    <Lock className="h-3.5 w-3.5" />
    Kilitli
  </span>
)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {getClassName(lesson.classId)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Paket: {getPackageLabel(lesson.packageType)}
                </p>
              </button>
            );
          })}
        </div>

        {activeAccessLevels.includes(selectedLevel) && !packageIsOpen && (
          <button
            type="button"
            onClick={() => {
              setUpsellPackage(packageGroup);
              setShowUpsell(true);
            }}
            className="mt-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-3 text-sm font-black text-slate-950 shadow hover:from-yellow-300 hover:to-orange-300"
          >
            {getPackageLabel(packageGroup)} avantajlarını aç
          </button>
        )}
      </div>
    );
  })}

{selectedLevelLessons.length === 0 && (
  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
    Bu seviye için henüz ders eklenmemiş.
  </p>
)}
</div>
)}
</aside>
</section>

{activeDashboardTab === "home" && (
  <>
    <section className="mb-5 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">
        Almanca Okulum
      </p>
      <h2 className="mt-1 text-xl font-black text-slate-900">
        {Object.values(completedTasks).filter(Boolean).length === 0
          ? "Bugün seni bekleyen görevler var 👇"
          : Object.values(completedTasks).filter(Boolean).length === dailyTasks.length
          ? "Bugün tüm görevleri tamamladın 🎉"
          : `${Object.values(completedTasks).filter(Boolean).length}/${dailyTasks.length} görev tamamlandı`}
      </h2>
    </div>
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-sm">
      {Object.values(completedTasks).filter(Boolean).length === dailyTasks.length ? "🏆" : `${Object.values(completedTasks).filter(Boolean).length}/${dailyTasks.length}`}
    </div>
  </div>

  <div className="mt-4 grid gap-2 md:grid-cols-4">
    {[
      {
        icon: "🏆",
        title: "Ustalık Testi Çöz",
        desc: completedMasteryThemes.length > 0 ? `${completedMasteryThemes.length}/12 tema bitti` : "Henüz başlanmadı",
        color: "bg-yellow-50 border-yellow-200",
        iconBg: "bg-yellow-100",
        action: () => setActiveDashboardTab("vocabulary"),
        badge: completedMasteryThemes.length > 0 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500",
        badgeText: completedMasteryThemes.length > 0 ? `${completedMasteryThemes.length} tema` : "Başla",
      },
      {
        icon: "🎮",
        title: "Kelime Arenası",
        desc: "Kelime bilgini test et",
        color: "bg-purple-50 border-purple-200",
        iconBg: "bg-purple-100",
        action: () => setActiveDashboardTab("wordgame"),
        badge: "bg-purple-100 text-purple-700",
        badgeText: "Oyna",
      },
      {
        icon: "🎙️",
        title: "Konuşma Kulübü",
        desc: speakingProgress
          ? `Tema ${speakingProgress.current_tema} — Görev ${speakingProgress.current_gorev}`
          : completedMasteryThemes.length >= 3 ? "Başlat" : `${completedMasteryThemes.length}/3 tema gerek`,
        color: "bg-emerald-50 border-emerald-200",
        iconBg: "bg-emerald-100",
        action: () => setActiveDashboardTab("speaking"),
        badge: speakingProgress ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
        badgeText: speakingProgress ? "Aktif" : "Kilitli",
      },
      {
        icon: "📝",
        title: "Deneme Sınavı",
        desc: "TELC & Goethe formatında",
        color: "bg-blue-50 border-blue-200",
        iconBg: "bg-blue-100",
        action: () => setActiveDashboardTab("exams"),
        badge: "bg-blue-100 text-blue-700",
        badgeText: "Gör",
      },
    ].map((item) => (
      <button
        key={item.title}
        type="button"
        onClick={item.action}
        className={`rounded-2xl border p-3 text-left transition hover:scale-[1.02] hover:shadow-md ${item.color}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${item.iconBg}`}>
            {item.icon}
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-black ${item.badge}`}>
            {item.badgeText}
          </span>
        </div>
        <p className="text-xs font-black text-slate-800">{item.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
      </button>
    ))}
  </div>
</section>
    <section className="mb-8 max-w-full overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 text-white shadow-xl sm:p-6">
  <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_340px] lg:items-start">

    {/* SOL */}
    <div>
      <h1 className="text-2xl font-bold md:text-3xl">
        Guten Morgen, {currentUser.name || currentUser.label || currentUser.username} 👋
      </h1>

      <p className="mt-2 text-sm opacity-90">
  {activeLiveOrder
    ? "Canlı dersler, mentor destekli görevler ve premium çalışma sistemiyle TELC sürecine devam ediyorsun."
    : "PDF materyaller, TELC denemeleri ve dijital çalışma sistemiyle Almanca gelişimini sürdürebilirsin."}
</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
          <p className="text-xs opacity-80">🔥 Günlük Seri</p>
          <p className="text-2xl font-bold">{streak}</p>
        </div>

        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
          <p className="text-xs opacity-80">Öğrenci Profili</p>

<p className="text-lg font-bold leading-6">
  {packageStudentLabel}
</p>
        </div>

        <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
          <p className="text-xs opacity-80">
  {JSON.stringify(activeLiveOrder)}
</p>
          <div
  className={`mt-2 inline-flex items-center rounded-full px-4 py-2 text-sm font-black shadow-lg ${
    effectivePackageType === "master"
      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
      : effectivePackageType === "practice"
      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
      : "bg-white text-slate-900"
  }`}
>
  {effectivePackageType === "master" ? (
  <>
    <Crown className="h-4 w-4" />
    Zirve Paket
  </>
) : effectivePackageType === "practice" ? (
  <>
    <Rocket className="h-4 w-4" />
    Gelişim Paket
  </>
) : (
  <>
    <Target className="h-4 w-4" />
    Başlangıç Paket
  </>
)}
</div>
          
        </div>
      </div>
    </div>

    {/* SAĞ */}
<div className="self-start rounded-3xl bg-white/20 p-5 backdrop-blur">
      <p className="text-sm opacity-80">⏱ Kalan Süre</p>

      <p className="mt-2 text-3xl font-extrabold">
        {accessExpired ? "Süre doldu" : `${remainingDays} gün`}
      </p>

      <div className="mt-4 h-2 rounded-full bg-white/20">
        <div
          className="h-2 rounded-full bg-white transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-2 text-xs opacity-80">
        Günlük ilerleme: %{progressPercent}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
  {(["A1", "A2", "B1"] as const).map((levelItem) => {
    const hasLevelAccess = activeAccessLevels.includes(levelItem);

    return (
      <button
        key={levelItem}
        type="button"
        disabled={!hasLevelAccess}
        onClick={() => {
          setSelectedLevel(levelItem);
          setSelectedLesson(null);
        }}
        className={`rounded-full px-4 py-2 text-xs font-black transition ${
          selectedLevel === levelItem
            ? "bg-white text-blue-700 shadow-lg"
            : hasLevelAccess
            ? "bg-white/20 text-white hover:bg-white/30"
            : "cursor-not-allowed bg-white/10 text-white/50"
        }`}
      >
        {hasLevelAccess ? "✓" : "🔒"} {levelItem}
      </button>
    );
  })}
</div>

      <button
        type="button"
        onClick={() => setActiveDashboardTab("lessons")}
        className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
      >
        ▶ Derse Devam Et
      </button>
    </div>

  </div>
</section>

    <section className="mb-8 grid min-w-0 gap-6 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <p className="text-sm font-semibold text-blue-600">Bugünkü Önerilen Ders</p>

        <h2 className="mt-2 text-xl font-bold">
          {todayLesson?.title ||
  (activeLiveOrder
    ? "Canlı ders kayıtların burada görünecek"
    : "Bugün için ders hazırlanıyor")}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {todayLesson
  ? getClassName(todayLesson.classId)
  : activeLiveOrder
  ? "Canlı dersler işlendikçe kayıtlarınız bu alana eklenecektir."
  : "Ders listen hazırlanıyor."}
        </p>

        <button
          type="button"
          disabled={!todayLesson}
          onClick={() => {
            if (!todayLesson) return;
setSelectedLesson(todayLesson);
setShowUpsell(false);
setActiveDashboardTab("lessons");

localStorage.setItem("last_selected_lesson", JSON.stringify(todayLesson));
          }}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          ▶ Devam Et
        </button>
      </div>

      
      <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-600">
            {isDigitalStarterStudent ? "🔒 Günlük Koçluk Görevleri" : "Günlük Görevler"}
          </p>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {isDigitalStarterStudent ? "Premium" : `${completedCount}/${dailyTasks.length}`}
          </span>
        </div>

        {isDigitalStarterStudent ? (
  <div className="space-y-3">
    {[
  "Kişisel günlük çalışma planı",
  "PDF ve çalışma kağıdı erişimi",
  "TELC deneme sınavları",
  "İlerleme takibi ve görev sistemi",
].map((item) => (
      <div
        key={item}
        className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
      >
        <span className="text-sm font-medium text-slate-500">
          {item}
        </span>

        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">
          🔒 Premium
        </span>
      </div>
    ))}

    <button
      type="button"
      onClick={() => {
        setUpsellPackage("practice");
        setShowUpsell(true);
      }}
      className="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
    >
      🚀 Gelişim Paketini İncele
    </button>
  </div>
) : (
  <div className="space-y-3">
    {dailyTasks.map((task) => (
      <div
        key={task.key}
        className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100"
      >
        <span className="text-sm font-medium text-slate-700">
          {task.title}
        </span>

        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
            completedTasks[task.key]
              ? "bg-emerald-500 text-white"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          {completedTasks[task.key] ? "✓" : "○"}
        </span>
      </div>
    ))}
  </div>
)}
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 p-5 text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
        {isDigitalStarterStudent ? (
  <>
    <p className="text-sm font-semibold text-purple-600">
  🔒 Mentor Destekli Konuşma Akademisi
</p>

    <p className="mt-3 text-sm leading-6 text-slate-600">
  Kurs süreciniz boyunca eğitmen tarafından yönlendirilen konuşma çalışmaları,
  düzenli görev sistemi ve kişisel geri bildirimlerle kontrollü bir gelişim
  deneyimi yaşayın.
</p>

    <div className="mt-4 rounded-2xl bg-white/70 p-3 text-sm text-slate-600">
  ✓ Kişisel konuşma gelişim takibi<br />
  ✓ Eğitmen geri bildirimli görev sistemi<br />
  ✓ Haftalık yönlendirme ve çalışma planı<br />
  ✓ Gerçek sınav odaklı konuşma pratiği<br />
  ✓ Öncelikli öğrenci destek hattı
</div>

    {!hasAnyLiveCourseOrder && (
    <button
      type="button"
      onClick={() => {
        const slug = `live-${selectedLevel.toLowerCase()}`;
        const link = getShopierLink(slug);

        if (!link) {
          alert(`${selectedLevel} canlı kurs Shopier linki henüz eklenmemiş.`);
          return;
        }

        setPendingPaymentSlug(slug);
setHidePendingOrderNotice(false);
setPaymentNoticeRefreshKey((prev) => prev + 1);

createPendingOrder({
  username: currentUser.username,
  productSlug: slug,
  level: selectedLevel,
});
        window.open(link, "_blank");
      }}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-bold text-white hover:from-purple-700 hover:to-blue-700"
    >
      🎓 {selectedLevel} Canlı Programını Keşfet
    </button>
    )}
  </>
) : (
  <>
    
    <p className="text-sm font-semibold text-purple-600">
      Öğretmene Soru Sor
    </p>

    <h2 className="mt-2 text-xl font-bold">
      Aklında takılan bir konu mu var?
    </h2>

    

    <p className="mt-3 text-sm leading-6 text-slate-600">
      Gramer soruların, kelime merakların veya sınava dair aklındaki her şeyi öğretmenine iletebilirsin.
    </p>

    <button
      type="button"
      onClick={() => {
        const message = `Merhaba, bir sorum var. Kullanıcı: ${
          JSON.parse(localStorage.getItem("mock_logged_user") || "{}")?.username ||
          "Öğrenci"
        }`;
        window.open(
          `https://wa.me/${teacherWhatsapp}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      }}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-sm font-bold text-white hover:from-purple-600 hover:to-blue-600"
    >
      💬 Öğretmene Sor
    </button>
  </>
)}
      </div>
    </section>
  </>
)}
{activeDashboardTab === "settings" && (
  <section className="mb-8 grid gap-6 lg:grid-cols-2">
    {/* PROFİL */}
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-sm font-semibold text-slate-500">
        Profil Bilgileri
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {currentUser.username}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Level {level} – {levelLabel}
      </p>

      <div className="mt-6 space-y-3">
  <input
    value={profileName}
    onChange={(e) => setProfileName(e.target.value)}
    placeholder="Ad Soyad"
    className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-blue-300"
  />

  <input
    value={profileEmail}
    onChange={(e) => setProfileEmail(e.target.value)}
    placeholder="Email"
    className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-blue-300"
  />

  <input
    type="password"
    value={profilePassword}
    onChange={(e) => setProfilePassword(e.target.value)}
    placeholder="Yeni şifre boş bırakılırsa değişmez"
    className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-blue-300"
  />

  <button
    type="button"
    onClick={handleUpdateProfile}
    className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg hover:bg-blue-700"
  >
    Profil Bilgilerini Güncelle
  </button>

  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
    Aktif paket: {getPackageLabel(effectivePackageType)}
  </div>
</div>
    </div>

    {/* AKSİYONLAR */}
    <div className="rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-lg">
      <p className="text-sm font-semibold text-red-500">
        Hesap İşlemleri
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Kontrol Paneli
      </h2>

      <div className="mt-6 space-y-3">
        <button
  onClick={handleBackupStudyData}
  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700"
>
  Çalışma Verilerimi Yedekle
</button>

<label className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700">
  Yedekten Geri Yükle

  <input
    type="file"
    accept=".json"
    onChange={handleRestoreStudyData}
    className="hidden"
  />
</label>

        <button
          onClick={handleLogout}
          className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-600"
        >
          Çıkış Yap
        </button>

        <button
  onClick={() => setShowResetConfirm(true)}
  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-black hover:shadow-xl active:scale-[0.98]"
>
  Çalışma Verilerimi Sıfırla
</button>
      </div>
    </div>
    {showResetConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <span className="text-3xl">⚠️</span>
      </div>

      <h2 className="mt-4 text-center text-2xl font-black text-slate-900">
        Çalışma Verileri Silinsin mi?
      </h2>

      <p className="mt-3 text-center text-sm leading-6 text-slate-500">
        Günlük görevleriniz, ders ilerlemeniz ve çalışma kayıtlarınız sıfırlanacaktır.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowResetConfirm(false)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Vazgeç
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("last_selected_lesson");
            localStorage.removeItem(`opened_lesson_count_${currentUsername}`);
            localStorage.removeItem(`last_seen_level_${currentUsername}`);
            localStorage.removeItem(taskStorageKey);
            localStorage.removeItem("user_streak");
            localStorage.removeItem("last_active_date");
            localStorage.removeItem(`lesson_progress_${currentUsername}`);
            localStorage.removeItem(`today_lesson_${currentUsername}_${todayKey}`);

            Object.keys(localStorage).forEach((key) => {
              if (
                key.startsWith(`opened_pdf_${currentUsername}_`) ||
                key.startsWith(`opened_lesson_${currentUsername}_`)
              ) {
                localStorage.removeItem(key);
              }
            });

            setLastLesson(null);
            setSelectedLesson(null);

            setCompletedTasks({
              lesson: false,
              pdf: false,
              speaking: false,
            });

            setStreak(0);
            setLastActiveDate(null);

            setShowResetConfirm(false);
          }}
          className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-600 hover:shadow-xl active:scale-[0.98]"
        >
          Evet, Sıfırla
        </button>
      </div>
    </div>
  </div>
)}
  </section>
)}
{activeDashboardTab === "speaking" && (
  <section className="mb-8">
  {bildirimUyariModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">
        ⏳
      </div>
      <h2 className="text-xl font-black text-slate-900">Partnerini Bekliyorsun</h2>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        Bu görev için bildirimi zaten gönderdin.<br />
        Partnerinin de bildirim atması bekleniyor.<br />
        İkisi de atınca görev otomatik onaylanacak.
      </p>
      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-600">
        💡 Partnerini WhatsApp'tan haberdar et
      </div>
      <button
        type="button"
        onClick={() => setBildirimUyariModal(false)}
        className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-4 py-4 text-sm font-black text-white hover:opacity-90"
      >
        Anladım
      </button>
    </div>
  </div>
)}
{speakingTeşvikMesaj && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl text-center">
      <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${speakingTeşvikMesaj.renk} text-4xl`}>
        {speakingTeşvikMesaj.icon}
      </div>
      <h2 className="text-xl font-black text-slate-900">{speakingTeşvikMesaj.baslik}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-500">{speakingTeşvikMesaj.mesaj}</p>
      <button
        type="button"
        onClick={() => setSpeakingTeşvikMesaj(null)}
        className={`mt-6 w-full rounded-2xl bg-gradient-to-r ${speakingTeşvikMesaj.renk} px-4 py-4 text-sm font-black text-white hover:opacity-90`}
      >
        Harika! 💪
      </button>
    </div>
  </div>
)}
    {/* A2 / B1 seviye kilidi */}
    {selectedLevel !== "A1" ? (
      <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center shadow-sm border border-amber-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">🔒</div>
        <h2 className="mt-5 text-2xl font-black text-slate-900">{selectedLevel} Konuşma Kulübü</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 max-w-md mx-auto">
          {selectedLevel} Konuşma Kulübü şu an sadece <strong>A1 öğrencilerine</strong> açıktır.
          A2 ve B1 seviyeleri yakında eklenecektir.
        </p>
        <button
          type="button"
          onClick={() => setSelectedLevel("A1")}
          className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
        >
          A1 Konuşma Kulübüne Geç
        </button>
      </div>
    ) : (
      <div className="rounded-[2rem] bg-gradient-to-br from-emerald-50 via-teal-50 to-white">

        {/* BAŞLIK */}
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">A1 Konuşma Kulübü</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Her Gün Konuş, Her Gün Geliş</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 max-w-2xl">
            Partner bulur, her gün arayıp kısa konuşma yaparsın. Dinleyici Türkçe söyler → Sen Almancasını söylersin.
            Görev tamamlanınca <strong>ikisi de bildirim</strong> atar. Bildirimlere göre seviye açılır.
          </p>
        </div>

        {/* NASIL ÇALIŞIR — kutu */}
        <div className="mx-6 mb-4 rounded-2xl bg-white/80 border border-emerald-100 p-4 shadow-sm">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3">Sistemin Mantığı</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-xs text-slate-700">
            {[
              ["🔓", "Ustalık Testi 3. temayı bitir", "Konuşma Kulübü Tema 1 açılır"],
              ["📅", "Her gün ara, bildirim gönder", "2 gün boş kalırsan tema düşer"],
              ["🔁", "Kümülatif tekrar sistemi", "Tema 2'de önceki temalar da sorulur"],
              ["🤝", "Sabit partner", "Memnun olmazsan değiştirirsin"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="rounded-xl bg-slate-50 p-3">
                <div className="text-lg mb-1">{icon}</div>
                <p className="font-black text-slate-800">{title}</p>
                <p className="text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TAB MENÜ */}
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {([
            ["durum", "📊 Durumum"],
            ["gorev", "🎯 Görev"],
            ["partner", "🤝 Partner"],
            ["sinav", "🎓 Sınav" + (speakingProgress?.sinav_bekleniyor ? " 🔴" : "")],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSpeakingTab(key as any)}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                (speakingTab as string) === key
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">

          {/* ── DURUM TABI ─────────────────────────────────────── */}
          {(speakingTab as string) === "durum" && (
            <div className="grid gap-4 lg:grid-cols-2">

              {/* Sol: İlerleme durumu */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {speakingProgressLoading ? (
                  <p className="text-sm text-slate-500">Yükleniyor...</p>
                ) : !speakingProgress ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="font-black text-slate-900">Konuşma Kulübüne Başla</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      Ustalık Testi'nde <strong>3. temayı</strong> tamamladıktan sonra
                      Konuşma Kulübü Tema 1 senin için açılır.
                    </p>
                    {/* Ustalık testi ilerleme göster */}
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Ustalık Testi İlerlemen</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.min(100, (completedMasteryThemes.length / 3) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-slate-700">{completedMasteryThemes.length}/3</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {completedMasteryThemes.length >= 3
                          ? "✅ Konuşma Kulübü açılabilir! Partner talep et."
                          : `${3 - completedMasteryThemes.length} tema daha tamamla`}
                      </p>
                    </div>
                    {completedMasteryThemes.length >= 3 && (
                      <button
                        type="button"
                        onClick={async () => {
  if (!currentUser) return;
  // Önce var mı kontrol et
  const { data: existing } = await supabase
    .from("speaking_progress")
    .select("*")
    .eq("username", currentUser.username)
    .eq("level", "A1")
    .maybeSingle();

  if (existing) {
    setSpeakingProgress(existing);
    return;
  }

  const { data, error } = await supabase
    .from("speaking_progress")
    .insert({
      username: currentUser.username,
      level: "A1",
      current_tema: 1,
      current_gorev: 1,
      gorev_tarihleri: [],
    })
    .select()
    .single();

  if (data) {
    setSpeakingProgress(data);
  } else {
    alert("Hata: " + error?.message);
  }
}}
                        className="mt-4 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
                      >
                        🎙️ Konuşma Kulübünü Başlat
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-4">Mevcut Durumun</p>

                    {/* Tema / Görev */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                        <p className="text-3xl font-black text-emerald-700">{speakingProgress.current_tema}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">Aktif Tema</p>
                      </div>
                      <div className="rounded-2xl bg-blue-50 p-4 text-center">
                        <p className="text-3xl font-black text-blue-700">{speakingProgress.current_gorev}/3</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">Bugünkü Görev</p>
                      </div>
                    </div>

                    {/* Bu görevdeki toplam soru sayısı */}
                    <div className="rounded-2xl bg-slate-50 p-4 mb-4">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Bu Görevde Sorulacak</p>
                      <p className="text-2xl font-black text-slate-900">
                        {speakingProgress.current_tema * 15} soru
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {speakingProgress.current_tema > 1 && (
                          <span>
                            {(speakingProgress.current_tema - 1) * 15} eski +{" "}
                            15 yeni (Tema {speakingProgress.current_tema})
                          </span>
                        )}
                        {speakingProgress.current_tema === 1 && "Tema 1 soruları"}
                      </p>
                    </div>

                    {/* Sınav uyarısı */}
{speakingProgress.sinav_bekleniyor && (
  <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 p-4 mb-4">
    <p className="text-sm font-black text-slate-900">
      {"🎓 SINAV ZAMANI! Tema " + speakingProgress.current_tema + " tamamlandı!"}
    </p>
    <p className="text-xs text-slate-800 mt-1">
      {"Toplam " + (speakingProgress.current_tema * 15) + " soru · " + getSinavSuresiLabel(speakingProgress.current_tema) + " · Görüntülü arama ile sınav yap"}
    </p>
    <button
      type="button"
      onClick={() => setSpeakingTab("sinav" as any)}
      className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
    >
      {"📋 Sınav Detaylarına Git"}
    </button>
  </div>
)}
                    {/* Küme düşme uyarısı */}
                    {speakingProgress.son_bildirim_tarihi && (() => {
                      const son = new Date(speakingProgress.son_bildirim_tarihi);
                      const bugun = new Date();
                      const fark = Math.floor((bugun.getTime() - son.getTime()) / (1000 * 60 * 60 * 24));
                      return fark >= 1 ? (
                        <div className={`rounded-2xl p-4 mb-4 border ${fark >= 2 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                          <p className={`text-sm font-black ${fark >= 2 ? "text-red-700" : "text-amber-700"}`}>
                            {fark >= 2
                              ? `⚠️ ${fark} gündür bildirim yok! Küme düşme riski!`
                              : `⏰ ${fark} gün oldu. Bugün ara!`}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {fark >= 2
                              ? "2 gün üst üste bildirim olmadığında bir tema geri düşersin."
                              : "Her gün konuşman seviyeni korumanı sağlar."}
                          </p>
                        </div>
                      ) : null;
                    })()}

                    {/* Tema ilerleme çubuğu */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Tema {speakingProgress.current_tema} İlerlemesi</span>
                        <span>{speakingProgress.current_gorev - 1}/3 görev tamamlandı · {speakingProgress.current_gorev}. görev devam ediyor</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${((speakingProgress.current_gorev - 1) / 3) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Partner */}
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Partnerim</p>
                      {speakingProgress.partner_email ? (
                        <p className="text-sm font-bold text-slate-900">{speakingProgress.partner_email}</p>
                      ) : (
                        <p className="text-sm text-slate-500">Henüz eşleşme yok. Admin eşleştirecek.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sağ: Tema haritası */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Tema Haritası</p>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((temaNo) => {
                    const speakingUnlocked = getSpeakingUnlockedThemeCount(completedMasteryThemes.length);
                    const isStarterTheme = temaNo <= 6;
                    const hasDevelopmentAccess =
                      effectivePackageType === "practice" ||
                      effectivePackageType === "master" ||
                      hasAnyLiveCourseOrder;
                    const hasPackageAccess = isStarterTheme || hasDevelopmentAccess;
                    const isUnlocked = temaNo <= speakingUnlocked && hasPackageAccess;
                    const isCurrent = speakingProgress?.current_tema === temaNo;
                    const isCompleted = speakingProgress && speakingProgress.current_tema > temaNo;

                    return (
                      <div
                        key={temaNo}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                          isCurrent
                            ? "bg-emerald-100 border border-emerald-300"
                            : isCompleted
                            ? "bg-slate-50 border border-slate-200"
                            : "bg-slate-50 border border-slate-100 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                            isCompleted ? "bg-emerald-500 text-white" :
                            isCurrent ? "bg-emerald-200 text-emerald-800" :
                            "bg-slate-200 text-slate-500"
                          }`}>
                            {isCompleted ? "✓" : temaNo}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">
                              {masteryThemes.find(t => t.id === temaNo)?.title || `Tema ${temaNo}`}
                            </p>
                            <p className="text-xs text-slate-500">{temaNo * 15} soru</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-black ${
                          isCompleted ? "bg-emerald-100 text-emerald-700" :
                          isCurrent ? "bg-blue-100 text-blue-700" :
                          !hasPackageAccess ? "bg-amber-100 text-amber-700" :
                          "bg-slate-200 text-slate-500"
                        }`}>
                          {isCompleted ? "Bitti" :
                           isCurrent ? "Aktif" :
                           !hasPackageAccess ? "Gelişim" :
                           !isUnlocked ? "Kilitli" : "Açık"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── GÖREV TABI ─────────────────────────────────────── */}
          {(speakingTab as string) === "gorev" && (
            <div className="grid gap-4 lg:grid-cols-2">

              {/* Sol: Aktif görev */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {!speakingProgress ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm">Önce Konuşma Kulübünü başlat.</p>
                    <button type="button" onClick={() => setSpeakingTab("durum" as any)}
                      className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white">
                      Duruma Git
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div>
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">Aktif Görev</p>
                        <h3 className="mt-1 text-xl font-black text-slate-900">
                          Tema {speakingProgress.current_tema} — Görev {speakingProgress.current_gorev}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Toplam {speakingProgress.current_tema * 15} soru sorulacak
                        </p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center">
                        <p className="text-2xl font-black text-emerald-700">{speakingProgress.current_tema * 15}</p>
                        <p className="text-xs font-bold text-slate-500">Soru</p>
                      </div>
                    </div>

                    {/* Soru dağılımı */}
                    <div className="rounded-2xl bg-slate-50 p-4 mb-5">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Görev İçeriği</p>
                      <div className="space-y-2">
                        {Array.from({ length: speakingProgress.current_tema }, (_, i) => i + 1).map((t) => (
                          <div key={t} className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              Tema {t} — {masteryThemes.find(m => m.id === t)?.title}
                            </span>
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                              t < speakingProgress.current_tema
                                ? "bg-slate-200 text-slate-600"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {t < speakingProgress.current_tema ? "15 hızlı" : "15 yeni"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mb-5">
  <p className="text-xs font-black uppercase tracking-wider mb-2 text-emerald-700">
    🎤 Bu Görevde İkili Çalışma
  </p>
  <p className="text-sm font-bold text-slate-800 mb-3">
    İkisi de hem konuşucu hem dinleyici rolünü yapacak
  </p>
  <div className="space-y-2 text-sm text-slate-600">
    <p>1. Partnerini ara</p>
    <p>2. Önce sen Türkçesini söyle, partner Almancasını söylesin</p>
    <p>3. Sonra roller değişsin, partner Türkçesini söylesin sen Almancaya çevir</p>
    <p>4. Görev bitince ikiniz de buradan bildirim atmalısınız</p>
  </div>
</div>

                    {/* Bildirim butonu */}
                    {speakingProgress.partner_email ? (
                      <div>
                        <button
                          type="button"
                          disabled={speakingGorevBildiriliyor}
                          onClick={handleSpeakingBildirim}
                          className="w-full rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-black text-white shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {speakingGorevBildiriliyor ? "Kaydediliyor..." : "✅ Görevi Tamamladım — Bildirim Gönder"}
                        </button>
                        {speakingBildirimGonderildi && (
                          <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm font-bold text-emerald-700 text-center">
                            ✅ Bildirimin alındı! Partner de gönderince görev onaylanır.
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          İkisi de bildirim atınca görev otomatik onaylanır.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 text-center">
                        <p className="font-black">Partner bekleniyor</p>
                        <p className="mt-1 text-xs">Admin seni eşleştirince bildirim gönderebilirsin.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sağ: Konuşma kalıpları */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">
                  Tema {speakingProgress?.current_tema || 1} Konuşma Kalıpları
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Dinleyici Türkçe söyler → Sen Almancasını söylersin
                </p>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {Array.from({ length: speakingProgress?.current_tema || 1 }, (_, i) => i + 1).map((temaNo) => {
                    const pattern = speakingPatterns.find(t => t.temaId === temaNo);
                    if (!pattern) return null;
                    return (
                      <div key={temaNo}>
                        <div className={`rounded-xl px-3 py-2 mb-2 ${temaNo === (speakingProgress?.current_tema || 1) ? "bg-emerald-100" : "bg-slate-100"}`}>
                          <p className={`text-xs font-black uppercase tracking-wider ${temaNo === (speakingProgress?.current_tema || 1) ? "text-emerald-700" : "text-slate-500"}`}>
                            {temaNo === (speakingProgress?.current_tema || 1) ? `🆕 Tema ${temaNo} — Yeni Sorular` : `🔁 Tema ${temaNo} — Tekrar`}
                          </p>
                        </div>
                        {pattern.cumleler.map((c, i) => (
                          <div key={i} className="rounded-2xl bg-slate-50 p-3 mb-2">
                            <div className="text-xs font-bold text-slate-500">👂 {c.tr}</div>
                            <div className="text-sm font-black text-emerald-700 mt-1">🎤 {c.de}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PARTNER TABI ────────────────────────────────────── */}
          {(speakingTab as string) === "partner" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-4">Partnerim</p>
                {speakingProgress?.partner_email ? (
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
                        {speakingProgress.partner_email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{speakingProgress.partner_email}</p>
                        <p className="text-xs text-slate-500 mt-1">Sabit partnerim</p>
                        {partnerTelefon ? (
                          <a
                            href={"https://wa.me/" + partnerTelefon + "?text=" + encodeURIComponent(
  "Merhaba! Ben " + (currentUser?.name || currentUser?.username) + ". Almanca Okulum Konuşma Kulübü'nde eşleştik 🎙️\n\n" +
  "Tema " + (speakingProgress?.current_tema || 1) + ", Görev " + (speakingProgress?.current_gorev || 1) + " üzerindeyiz.\n\n" +
  "Bu görevde toplam " + ((speakingProgress?.current_tema || 1) * 15) + " soru var.\n\n" +
  "Bu görevde ikimiz de hem konuşucu hem dinleyici rolünü yapacağız." +
  "\n\nUygun bir zaman ayarlayalım mı? 😊"
)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-black text-green-700 hover:bg-green-100"
                          >
                            {"📞 WhatsApp: " + partnerTelefon}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 mt-2">Telefon bilgisi yükleniyor...</p>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 mb-4 text-sm text-slate-700 space-y-2">
                      <p>{"✅ Partnerinle her gün arayıp görevi tamamla"}</p>
                      <p>{"✅ Görev sonrası ikisi de buradan bildirim gönder"}</p>
                      <p>{"✅ Bildirimler eşleşince seviye ilerler"}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                      <p className="text-xs font-black text-amber-700 mb-2">Partner Değişikliği</p>
                      <p className="text-sm text-slate-600 mb-3">
                        Partnerinden memnun değilsen yeni partner talebinde bulunabilirsin.
                        Admin onayıyla değiştirilebilir.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!currentUser) return;
                          await supabase.from("speaking_partner_requests").insert({
                            username: currentUser.username,
                            level: "A1",
                            mevcut_partner: speakingProgress.partner_email,
                            sebep: "diger",
                            durum: "bekliyor",
                          });
                          alert("Yeni partner talebiniz alındı. Admin en kısa sürede değerlendirecek.");
                        }}
                        className="w-full rounded-2xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-700 hover:bg-amber-50"
                      >
                        {"🔄 Yeni Partner Talep Et"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">🤝</div>
                    <h3 className="font-black text-slate-900">Henüz eşleşme yok</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-6 max-w-xs mx-auto">
                      Admin uygun bir partnerle seni eşleştirecek.
                      Eşleşme sonrası burada görünecek.
                    </p>
                    {!speakingProgress && (
                      <p className="text-xs text-slate-400 mt-3">
                        Önce Konuşma Kulübünü başlatman gerekiyor.
                      </p>
                    )}
                    {speakingProgress && !speakingProgress.partner_email && (
                      <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-left">
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3">Partner Talep Et</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">Müsait Olduğun Saat</p>
                            <input
                              value={speakingMusait}
                              onChange={e => setSpeakingMusait(e.target.value)}
                              placeholder="Örn: 20:00-22:00 arası"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">WhatsApp Numaranız</p>
                            <input
                              value={speakingTelefon}
                              onChange={e => setSpeakingTelefon(e.target.value)}
                              placeholder="905xxxxxxxxx"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">Partner Tercihi</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[["fark_etmez", "Fark Etmez"], ["kadin", "Kadın"], ["erkek", "Erkek"]].map(([val, label]) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setSpeakingCinsiyet(val)}
                                  className={"rounded-2xl border py-2 text-xs font-black transition " + (speakingCinsiyet === val ? "border-emerald-400 bg-emerald-100 text-emerald-700" : "border-slate-200 bg-white text-slate-600")}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={speakingYukleniyor || !speakingMusait || !speakingTelefon}
                            onClick={async () => {
                              if (!currentUser || !speakingMusait || !speakingTelefon) return;
                              setSpeakingYukleniyor(true);
                              await supabase.from("speaking_requests").insert({
                                user_email: currentUser.username,
                                user_name: currentUser.name || currentUser.username,
                                tema_id: speakingProgress.current_tema,
                                rol: "konusan",
                                cinsiyet_tercihi: speakingCinsiyet,
                                musait_saat: speakingMusait,
                                telefon: speakingTelefon,
                                durum: "bekliyor",
                              });
                              setSpeakingYukleniyor(false);
                              setSpeakingGonderildi(true);
                            }}
                            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {speakingYukleniyor ? "Gönderiliyor..." : "🎙️ Partner Talep Et"}
                          </button>
                          {speakingGonderildi && (
                            <div className="rounded-2xl bg-white border border-emerald-200 p-3 text-sm font-bold text-emerald-700 text-center">
                              {"✅ Talebiniz alındı! Admin en kısa sürede eşleştirecek."}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
                    {/* ── SINAV TABI ──────────────────────────────────────── */}
          {(speakingTab as string) === "sinav" && (
            <div className="grid gap-4 lg:grid-cols-2">

              {/* Sol: Sınav bilgisi */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {!speakingProgress ? (
                  <p className="text-sm text-slate-500">Önce Konuşma Kulübünü başlat.</p>
                ) : !speakingProgress.sinav_bekleniyor ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">{"📚"}</div>
                    <h3 className="font-black text-slate-900">Sınav henüz yok</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      {"Her 3 temayı tamamladığında sınav açılır. Şu an Tema " + speakingProgress.current_tema + " üzerindesin."}
                    </p>
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left space-y-2 text-sm text-slate-600">
                      <p>{"🥉 Tema 3 → Bronz Konuşmacı"}</p>
                      <p>{"🥈 Tema 6 → Gümüş Konuşmacı"}</p>
                      <p>{"🥇 Tema 9 → Altın Konuşmacı"}</p>
                      <p>{"🏆 Tema 12 → Konuşma Şampiyonu"}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 p-5 mb-5 text-center">
                      <p className="text-2xl font-black text-slate-900">{"🎓 SINAV ZAMANI!"}</p>
                      <p className="text-sm font-bold text-slate-800 mt-1">
                        {"Tema " + speakingProgress.current_tema + " Genel Sınavı"}
                      </p>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-600">Toplam Soru</span>
                        <span className="text-sm font-black text-slate-900">{speakingProgress.current_tema * 15 + " soru"}</span>
                      </div>
                      <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-600">Süre</span>
                        <span className="text-sm font-black text-slate-900">{getSinavSuresiLabel(speakingProgress.current_tema)}</span>
                      </div>
                      <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-600">Kazanılacak Rozet</span>
                        <span className="text-sm font-black text-slate-900">
                          {speakingProgress.current_tema >= 12
                            ? "🏆 Konuşma Şampiyonu"
                            : speakingProgress.current_tema >= 9
                            ? "🥇 Altın Konuşmacı"
                            : speakingProgress.current_tema >= 6
                            ? "🥈 Gümüş Konuşmacı"
                            : "🥉 Bronz Konuşmacı"}
                        </span>
                      </div>
                      <div className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-slate-600">Format</span>
                        <span className="text-sm font-black text-slate-900">Görüntülü arama</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-5">
                      <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">Sınav Kuralları</p>
                      <div className="space-y-1 text-sm text-slate-700">
                        <p>{"1. Partnerinle görüntülü arama başlat"}</p>
                        <p>{"2. Dinleyici Türkçe soruları sırayla sorar"}</p>
                        <p>{"3. Sen kameraya bakarak Almancasını söylersin"}</p>
                        <p>{"4. Süre dolmadan " + (speakingProgress.current_tema * 15) + " soruyu bitirirsen geçersin"}</p>
                        <p>{"5. Sınav sonrası dinleyici buradan sonucu bildirir"}</p>
                      </div>
                    </div>

                    <SinavHocasiPanel
                      currentUser={currentUser}
                      speakingProgress={speakingProgress}
                      setSpeakingTeşvikMesaj={setSpeakingTeşvikMesaj}
                      temaHakkiVar={speakingProgress.current_tema % 3 === 0}
                    />
                  </div>
                )}
              </div>

              {/* Sağ: Rozet ve Liderlik */}
              <div className="space-y-4">

                <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Mevcut Rozetim</p>
                  <div className="text-5xl mb-3">
                    {speakingProgress?.rozet?.startsWith("🏆")
                      ? "🏆"
                      : speakingProgress?.rozet?.startsWith("🥇")
                      ? "🥇"
                      : speakingProgress?.rozet?.startsWith("🥈")
                      ? "🥈"
                      : speakingProgress?.rozet?.startsWith("🥉")
                      ? "🥉"
                      : "🎤"}
                  </div>
                  <p className="text-lg font-black text-slate-900">
                    {speakingProgress?.rozet || "🎤 Aday"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {"Tema " + (speakingProgress?.current_tema || 1) + " üzerinde"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Rozet Yolu</p>
                  <div className="space-y-3">
                    {[
                      { tema: 3, rozet: "🥉 Bronz Konuşmacı" },
                      { tema: 6, rozet: "🥈 Gümüş Konuşmacı" },
                      { tema: 9, rozet: "🥇 Altın Konuşmacı" },
                      { tema: 12, rozet: "🏆 Konuşma Şampiyonu" },
                    ].map((item) => {
                      const kazanildi = (speakingProgress?.son_sinav_tema || 0) >= item.tema;
                      const aktif = speakingProgress?.current_tema === item.tema && speakingProgress?.sinav_bekleniyor;
                      return (
                        <div
                          key={item.tema}
                          className={
                            "flex items-center justify-between rounded-2xl px-4 py-3 " +
                            (kazanildi
                              ? "bg-emerald-50 border border-emerald-200"
                              : aktif
                              ? "bg-yellow-50 border border-yellow-300"
                              : "bg-slate-50 border border-slate-100 opacity-50")
                          }
                        >
                          <div>
                            <p className="text-sm font-black text-slate-900">{item.rozet}</p>
                            <p className="text-xs text-slate-500">{"Tema " + item.tema + " sınavını geç"}</p>
                          </div>
                          <span className={"text-lg " + (kazanildi || aktif ? "" : "grayscale")}>
                            {kazanildi ? "✅" : aktif ? "🎯" : "🔒"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                

              </div>
            </div>
          )}

          


        </div>
      </div>
    )}
  </section>
)}
{activeDashboardTab === "classleague" && (
  <ClassLeagueTab
    currentUsername={currentUser?.username || ""}
    currentUserName={currentUser?.name || ""}
    mainClassId={studentAccess?.mainClassId || ""}
    classes={classes}
    hasAnyLiveCourseOrder={!!hasAnyLiveCourseOrder}
  />
)}
{activeDashboardTab === "wordgame" && (
  <section className="mb-8">
    <KelimeOyunu
  effectivePackageType={effectivePackageType}
  hasAnyLiveCourseOrder={hasAnyLiveCourseOrder}
  currentUserEmail={currentUser?.username || currentUsername || ""}
  currentUserName={currentUser?.name || ""}
  activeAccessLevels={activeAccessLevels}
  onUpsell={() => { setUpsellPackage("practice"); setShowUpsell(true); }}
  onB1Live={() => { const link = getShopierLink("live-b1"); if (link) window.open(link, "_blank"); }}
/>
  </section>
)}
{activeDashboardTab === "vocabulary" && (
  <section className="mb-8">
    <div className="rounded-[2rem] bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 px-3 py-6 sm:px-6">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
          Kelime & Ustalık Testleri
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-900">
  🏆 {selectedMasteryLevel} Ustalık Yolculuğu
</h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Bir sonraki temanın kilidini açmak için Ustalık Testini geç! Her dersten 5 soru gelir.
          İlerlemek için her bölümde en az 3 doğru cevap vermelisin.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
  {(["A1", "A2", "B1"] as const).map((levelItem) => {
    const hasAccess = activeAccessLevels.includes(levelItem);
    const isActive = selectedMasteryLevel === levelItem;

    return (
      <button
        key={levelItem}
        type="button"
        onClick={() => {
          setSelectedMasteryLevel(levelItem);

          if (!hasAccess) {
            return;
          }

          setSelectedMasteryThemeId(1);
          resetMasteryTest(1);
        }}
        className={`rounded-full px-4 py-2 text-sm font-black transition ${
          hasAccess
            ? isActive
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            : isActive
            ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {hasAccess ? "✓" : "🔒"} {levelItem}
      </button>
    );
  })}
</div>
{!activeAccessLevels.includes(selectedMasteryLevel) && (
  <div className="mt-5 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
    <p className="text-xs font-black uppercase tracking-widest text-amber-700">
      Premium seviye kilitli
    </p>

    <h3 className="mt-2 text-xl font-black text-slate-900">
      {selectedMasteryLevel} Ustalık Testleri seni bekliyor
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-600">
  Bu seviyedeki Ustalık Testleri şu anda hesabında açık değil.
  {selectedMasteryLevel} dijital paketine geçerek bu seviyedeki tema
  testlerini ve öğrenme yolculuğunu başlatabilirsin.
</p>

<div className="mt-4 flex flex-col gap-2 sm:flex-row">
  <button
    type="button"
    onClick={() => {
      setUpsellPackage("practice");
      setShowUpsell(true);
    }}
    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
  >
    🚀 Paketi Yükselt
  </button>

  <button
    type="button"
    onClick={() => {
      const slug = `live-${selectedMasteryLevel.toLowerCase()}`;

      const link = getShopierLink(slug);

      if (!link) {
        alert(
          `${selectedMasteryLevel} canlı kurs Shopier linki henüz eklenmemiş.`
        );
        return;
      }

      window.open(link, "_blank");
    }}
    className="rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-700 hover:bg-amber-50"
  >
    🎓 {selectedMasteryLevel} Canlı Kursunu İncele
  </button>
</div>
  </div>
)}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
 {activeAccessLevels.includes(selectedMasteryLevel) &&
  selectedMasteryLevel === "A1" && (
  <>
    <button
      type="button"
      onClick={() => {
        resetMasteryTest(firstIncompleteThemeId);
        setTimeout(() => {
          document
            .getElementById("mastery-test-area")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }}
      className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
    >
      🏆 Hemen Ustalık Testine Başla
    </button>

    <button
      type="button"
      onClick={() => {
        document
          .getElementById("mastery-theme-cards")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50"
    >
      📚 Temaları İncele
    </button>
  </>
)}
{activeAccessLevels.includes(selectedMasteryLevel) &&
  selectedMasteryLevel === "A2" && (
  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      onClick={async () => {
  setSelectedMasteryLevel("A2");
  const { data } = await supabase
    .from("mastery_progress")
    .select("theme_id")
    .eq("student_key", studentKey)
    .eq("level", "A2")
    .eq("status", "completed");
  const completedA2 = (data || []).map((item: any) => item.theme_id);
  setCompletedMasteryThemes(completedA2);
  const startTheme = a2MasteryThemes.find((theme) => !completedA2.includes(theme.id))?.id || 1;
  const questions = getRandomA2MasteryQuestions(startTheme);
  setActiveMasteryQuestions(questions);
  setSelectedMasteryThemeId(startTheme);
  setMasteryIndex(0);
  setMasteryLives(3);
  setMasteryAnswers([]);
  setMasteryFinished(false);
  setMasteryFeedback(null);
  setTimeout(() => {
    document
      .getElementById("mastery-test-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}}
      className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
    >
      🏆 Hemen A2 Ustalık Testine Başla
    </button>
    <button
      type="button"
      onClick={() => {
        document
          .getElementById("mastery-theme-cards")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50"
    >
      📚 Temaları İncele
    </button>
  </div>
)}
</div>
      </div>
{activeAccessLevels.includes(selectedMasteryLevel) &&
  selectedMasteryLevel === "B1" && (
    <div className="mt-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-blue-700">
        Yakında aktif olacak
      </p>

      <h3 className="mt-2 text-2xl font-black text-slate-900">
        {selectedMasteryLevel} Ustalık Testleri hazırlanıyor
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Bu seviyenin Ustalık Testleri şu anda içerik hazırlık aşamasında.
        Şimdilik ders kayıtları ve PDF materyalleriyle çalışmaya devam
        edebilirsin.
      </p>
    </div>
  )}
      {activeAccessLevels.includes(selectedMasteryLevel) &&
  (selectedMasteryLevel === "A1" || selectedMasteryLevel === "A2") && (
      <>
  {isTelcChampion && (
  <div className="mt-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 p-6 shadow-lg">
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
        🏆
      </div>

      <h2 className="mt-4 text-3xl font-black text-slate-900">
        TELC Şampiyonu!
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        Tebrikler! 12 temayı ve 36 dersi başarıyla tamamladın.
        Artık A1 temel hazırlık sürecini bitirdin.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-black text-emerald-600">12</p>
          <p className="text-xs font-bold text-slate-500">Tema Tamamlandı</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-black text-blue-600">36</p>
          <p className="text-xs font-bold text-slate-500">Ders Bitirildi</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-2xl font-black text-yellow-600">A1</p>
          <p className="text-xs font-bold text-slate-500">Hazırlık Tamam</p>
        </div>
      </div>

      <p className="mt-5 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-lg">
        🎓 Almanca Okulum A1 Ustalık Yolculuğu Tamamlandı
      </p>
    </div>
  </div>
)}
  <div className="mt-6 rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-emerald-50 p-5 shadow-sm">
    <p className="text-xs font-black uppercase tracking-widest text-yellow-700">
      🎖 Mevcut Ünvan
    </p>

    <h3 className="mt-2 text-2xl font-black text-slate-900">
      {masteryBadgeTitle}
    </h3>

    <p className="mt-2 text-sm font-bold text-slate-600">
      {completedThemeCount >= 12
        ? "Tebrikler! En yüksek ünvanı kazandın."
        : `Bir sonraki ünvana ${remainingThemesForBadge} tema kaldı.`}
    </p>
  </div>
  <div className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur">
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
        🏆 Ustalık Liderleri
      </p>
      <h3 className="mt-1 text-xl font-black text-slate-900">
        Bu Haftanın Öne Çıkanları
      </h3>
    </div>

    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
      Canlı
    </span>
  </div>

  <div className="mt-5 space-y-3">
    {masteryLeaders.map((leader, index) => (
      <div
        key={`${leader.name}-${index}`}
        className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-emerald-100 text-sm font-black text-slate-700">
            {index + 1}
          </div>

          <div>
            <p className="max-w-[170px] truncate text-sm font-black text-slate-900 sm:max-w-none">
  {leader.name}
</p>
            <p className="text-xs font-bold text-slate-500">
              {leader.badge} · {leader.type}
{!realMasteryLeaders.some((real) => real.name === leader.name) && " · Örnek"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-black text-emerald-600">
            {leader.themes}/12
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Tema
          </p>
        </div>
      </div>
    ))}
  </div>

  <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 p-4 text-white">
    <p className="text-sm font-black">
      🚀 Canlı sınıf öğrencileri bu hafta daha hızlı ilerliyor.
    </p>
    <p className="mt-1 text-xs font-semibold text-white/80">
      Ustalık testlerini tamamla, sen de liderler arasında görün.
    </p>
  </div>
</div>

  <div
    id="mastery-theme-cards"
    className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
  >
    {(selectedMasteryLevel === "A2" ? a2MasteryThemes : masteryThemes).map((theme) => {
      const isActive = theme.id === selectedMasteryThemeId;
      const isStarterTheme = theme.id <= 6;
const isDevelopmentTheme = theme.id >= 7 && theme.id <= 12;

const hasDevelopmentAccess =
  effectivePackageType === "practice" ||
  effectivePackageType === "master" ||
  hasAnyLiveCourseOrder;

const hasPackageAccess =
  isStarterTheme || (isDevelopmentTheme && hasDevelopmentAccess);

const isPreviousThemeCompleted =
  theme.id === 1 || completedMasteryThemes.includes(theme.id - 1);

const isUnlocked = hasPackageAccess && isPreviousThemeCompleted;
      const isCompleted = completedMasteryThemes.includes(theme.id);
      const progressPercent = getThemeProgressPercent(theme.id);

      return (
        <button
          key={theme.id}
          type="button"
          onClick={() => {
  if (!hasPackageAccess) {
  setMasteryLockModal({
    type: "premium",
    themeId: theme.id,
  });
  return;
}

if (!isPreviousThemeCompleted) {
  setMasteryLockModal({
    type: "sequence",
    themeId: theme.id,
  });
  return;
}

  resetMasteryTest(theme.id);
  setTimeout(() => {
    document
      .getElementById("mastery-test-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}}
          className={`rounded-3xl border p-5 text-left shadow-sm transition ${
            isActive
              ? "border-emerald-300 bg-white ring-4 ring-emerald-100"
              : "border-white/70 bg-white/70 hover:bg-white"
          } ${!isUnlocked ? "cursor-not-allowed opacity-60 grayscale" : ""}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Tema {theme.id}
              </p>

              <h3 className="mt-2 text-lg font-black text-slate-900">
                {theme.title}
              </h3>

              <p className="mt-1 text-xs font-bold text-slate-500">
                {theme.germanTitle}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                isUnlocked
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isCompleted
  ? "Tamamlandı"
  : !hasPackageAccess
  ? "Gelişim Paketi"
  : !isPreviousThemeCompleted
  ? "Kilitli"
  : isStarterTheme
  ? "Başlangıç Paketi"
  : "Gelişim Paketi"}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-black text-slate-500">
              <span>İlerleme</span>
              <span>{progressPercent}%</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {theme.lessons.map((lesson) => (
              <div
                key={lesson.number}
                className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
              >
                Ders {lesson.number}: {lesson.title}
              </div>
            ))}
          </div>
        </button>
      );
    })}
  </div>
  {masteryLockModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 text-4xl shadow-inner">
        {masteryLockModal.type === "premium" ? "🚀" : "🔒"}
      </div>

      <h2 className="mt-5 text-center text-2xl font-black text-slate-900">
        {masteryLockModal.type === "premium"
          ? "Gelişim Paketi ile Devam Et"
          : "Sıradaki Tema Henüz Kilitli"}
      </h2>

      <p className="mt-3 text-center text-sm font-semibold leading-6 text-slate-600">
        {masteryLockModal.type === "premium"
          ? "Başlangıç Paketi ilk 6 temayı kapsar. Tema 7’den itibaren premium ustalık yolculuğu Gelişim Paketi ile açılır."
          : `Tema ${masteryLockModal.themeId} için önce Tema ${
              masteryLockModal.themeId - 1
            } başarıyla tamamlanmalıdır.`}
      </p>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        {masteryLockModal.type === "premium" ? (
          <div className="space-y-2 text-sm font-bold text-slate-700">
            <p>✓ Tema 7-12 arası premium ustalık testleri</p>
            <p>✓ TELC A1 final tekrar havuzu</p>
            <p>✓ Sağlık, Tatil ve Schreiben temaları</p>
            <p>✓ Şampiyonluk rozetine giden yol</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm font-bold text-slate-700">
            <p>✓ Ustalık yolu sırayla ilerler</p>
            <p>✓ Her tema bir öncekinin üzerine kurulur</p>
            <p>✓ Bu sistem bilgiyi kalıcı hale getirir</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {masteryLockModal.type === "premium" && (
          <button
            type="button"
            onClick={() => {
              setActiveDashboardTab("packages");
              setMasteryLockModal(null);
            }}
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Gelişim Paketlerini İncele
          </button>
        )}

        <button
          type="button"
          onClick={() => setMasteryLockModal(null)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Tamam, Anladım
        </button>
      </div>
    </div>
  </div>
)}
</>
)}
      {activeAccessLevels.includes(selectedMasteryLevel) &&
  (selectedMasteryLevel === "A1" || selectedMasteryLevel === "A2") &&
  selectedMasteryTheme && (
  <div
  id="mastery-test-area"
  className="-mx-1 mt-8 scroll-mt-6 rounded-[2rem] bg-white px-2 py-6 shadow-sm sm:mx-0 sm:px-6"
>
          {!masteryFinished ? (
            <>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-purple-600">
                    🏆 Ustalık Testi
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Tema {selectedMasteryTheme.id}: {selectedMasteryTheme.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    15 soru · 3 ders · Her dersten en az 3 doğru
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Can
                  </p>
                  <p className="mt-1 text-2xl">
                    {"❤️".repeat(masteryLives)}
                    {"🤍".repeat(3 - masteryLives)}
                  </p>
                </div>
              </div>

              {currentMasteryQuestion ? (
                <div className="mt-6">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-2 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                        Soru {masteryIndex + 1} / {selectedMasteryQuestions.length}
                      </p>

                      <p className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                        Ders {currentMasteryQuestion.lessonNumber}
                      </p>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                        style={{
                          width: `${((masteryIndex + 1) / selectedMasteryQuestions.length) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="mt-5 rounded-3xl bg-white p-4 text-center shadow-sm sm:mt-8 sm:p-6">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Türkçe
                      </p>

                      <h3 className="mt-3 text-lg font-black leading-tight text-slate-900 sm:text-2xl">
  {currentMasteryQuestion.tr}
</h3>

                      <p className="mt-3 text-sm font-bold text-slate-500">
                        {currentMasteryQuestion.lessonTitle}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {currentMasteryQuestion.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleMasteryAnswer(option)}
                          disabled={!!masteryFeedback}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-80 sm:py-4"
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {masteryFeedback === "correct" && (
                      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-700">
                        ✅ Harika! Doğru cevap.
                      </div>
                    )}

                    {masteryFeedback === "wrong" && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-black text-red-700">
                        ❌ Bu konu Ders {currentMasteryQuestion.lessonNumber} ile ilgili.
                        Dersi tekrar izleyip yeniden denemeni öneriyoruz.
                      </div>
                    )}
                    <button
  type="button"
  onClick={() => resetMasteryTest(selectedMasteryTheme.id)}
  className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
>
  🔄 Testi Sıfırla
</button>
                  </div>

                  
                </div>
              ) : (
                <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center">
                  <p className="text-lg font-black text-slate-900">
                    Bu tema için sorular hazırlanıyor.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-5xl">
                {isThemePassed ? "🎉" : "🔍"}
              </div>

              <h3 className="mt-5 text-3xl font-black text-slate-900">
                {isThemePassed ? "Ustalık Testi Başarılı!" : "Tekrar Çalışma Zamanı"}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {isThemePassed
                  ? `Tema ${selectedMasteryTheme.id} başarıyla tamamlandı. Bir sonraki temaya geçebilirsin.`
                  : "Bazı derslerde eksiklerin görünüyor. En az 3/5 başarı gereken dersleri tekrar izlemeni öneriyoruz."}
              </p>

              <div className="mx-auto mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
                {selectedMasteryTheme.lessons.map((lesson) => {
                  const score = getLessonScore(lesson.number);
                  const passed = score >= 3;

                  return (
                    <div
                      key={lesson.number}
                      className={`rounded-2xl p-4 ${
                        passed ? "bg-emerald-50" : "bg-red-50"
                      }`}
                    >
                      <p
                        className={`text-xs font-black uppercase tracking-widest ${
                          passed ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        Ders {lesson.number}
                      </p>

                      <p className="mt-1 text-2xl font-black text-slate-900">
                        {score}/5
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {lesson.title}
                      </p>

                      {!passed && (
                        <button
                          type="button"
                          onClick={() => setActiveDashboardTab("lessons")}
                          className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-xs font-black text-red-700 shadow-sm hover:bg-red-100"
                        >
                          📺 Dersi Tekrar İzle
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {isThemePassed && selectedMasteryTheme.id === 6 && !hasAnyLiveCourseOrder && effectivePackageType !== "practice" && effectivePackageType !== "master" && (
  <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-left shadow-sm">
    <p className="text-xs font-black uppercase tracking-widest text-amber-700">
      🎉 Başlangıç Paketi Tamamlandı
    </p>

    <h3 className="mt-3 text-2xl font-black text-slate-900">
      Almanca yolculuğuna Gelişim Paketi ile devam et
    </h3>

    <p className="mt-3 text-sm leading-6 text-slate-600">
      İlk 6 temayı başarıyla tamamladın. Tema 7’den itibaren Ev & Yaşam,
      Boş Zaman, Ulaşım, Sağlık, Tatil ve TELC hazırlık konuları seni bekliyor.
    </p>

    <button
      type="button"
      onClick={() => {
        setUpsellPackage("practice");
        setShowUpsell(true);
      }}
      className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
    >
      🚀 Gelişim Paketine Geç
    </button>
  </div>
)}
              {isThemePassed && selectedMasteryTheme.id < masteryThemes.length && (
  <button
    type="button"
    onClick={() => {
      const nextThemeId = selectedMasteryTheme.id + 1;
      setSelectedMasteryThemeId(nextThemeId);
      resetMasteryTest(nextThemeId);

      setTimeout(() => {
        document
          .getElementById("mastery-test-area")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }}
    className="mt-8 mr-3 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white hover:bg-emerald-700"
  >
    Sonraki Temaya Geç
  </button>
)}
              <button
                type="button"
                onClick={() => resetMasteryTest(selectedMasteryTheme.id)}
                className="mt-8 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                Yeniden Dene
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </section>
)}
{activeDashboardTab === "materials" && (
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          PDF Materyal Merkezi
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          {selectedLevel} çalışma materyalleri
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ders PDF’leri, çalışma sayfaları ve premium materyalleri tek yerden
          görüntüleyebilirsiniz.
        </p>
        
      </div>

      <div className="flex flex-wrap gap-2">
        {(["A1", "A2", "B1"] as const).map((levelItem) => {
          const hasAccess = activeAccessLevels.includes(levelItem);

          return (
            <button
              key={levelItem}
              type="button"
              onClick={() => {
                setSelectedLevel(levelItem);
                setSelectedLesson(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                selectedLevel === levelItem
                  ? "bg-blue-600 text-white shadow-lg"
                  : hasAccess
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {hasAccess ? "✓" : "🔒"} {levelItem}
            </button>
          );
        })}
      </div>
    </div>

    {isFutureLiveCourseLevel && (
      <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-700">
          Kurs sürecinde açılacak
        </p>

        <h3 className="mt-2 text-lg font-black text-slate-900">
          {selectedLevel} materyalleri daha sonra yayınlanacak
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bu seviyedeki PDF materyalleri kurs sürecinde burada yayınlanacaktır.
        </p>
      </div>
    )}

    {!activeAccessLevels.includes(selectedLevel) && (
  <div className="mt-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-xl text-white shadow-md">
        🔒
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">
          Premium seviye kilitli
        </p>

        <h3 className="mt-1 text-lg font-black text-slate-900">
          {selectedLevel} PDF materyalleri seni bekliyor
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bu seviyedeki PDF materyalleri ve çalışma sayfaları şu anda hesabında
          açık değil. Paketi yükselterek ya da {selectedLevel} canlı kursuna
          katılarak bu alandaki materyallere erişebilirsin.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setUpsellPackage("practice");
              setShowUpsell(true);
            }}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
          >
            🚀 Paketi Yükselt
          </button>

          <button
  type="button"
  onClick={() => {
    const slug = `live-${selectedLevel.toLowerCase()}`;

    const link = getShopierLink(slug);

    if (!link) {
      alert(`${selectedLevel} canlı kurs Shopier linki henüz eklenmemiş.`);
      return;
    }

    setPendingPaymentSlug(slug);
    setHidePendingOrderNotice(false);
    setPaymentNoticeRefreshKey((prev) => prev + 1);

    createPendingOrder({
      username: currentUser.username,
      productSlug: slug,
      level: selectedLevel,
    });

    window.open(link, "_blank");
  }}
  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-bold text-white hover:from-purple-700 hover:to-blue-700"
>
  🎓 {selectedLevel} Canlı Programını Keşfet
</button>
        </div>
      </div>
    </div>
  </div>
)}
    {activeAccessLevels.includes(selectedLevel) &&
  !isFutureLiveCourseLevel &&
  pdfMaterials.length === 0 && (
      <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
        Bu seviye için henüz PDF materyali eklenmemiş.
      </div>
    )}

    {activeAccessLevels.includes(selectedLevel) &&
  !isFutureLiveCourseLevel &&
  pdfMaterials.length > 0 && (
  <div className="mt-6 grid gap-4 lg:grid-cols-2">
    {(["starter", "practice", "master"] as PackageType[])
      .filter((packageGroup) => {
  if (effectivePackageType === "starter") {
    return packageGroup !== "master";
  }

  if (effectivePackageType === "practice") {
    return true;
  }

  if (effectivePackageType === "master") {
    return true;
  }

  return packageGroup === "starter";
})
      .map((packageGroup) => {
        const groupMaterials = pdfMaterials.filter(
          (material) => material.packageType === packageGroup
        );
        const sortedGroupMaterials = [...groupMaterials].sort((a, b) => {
  const aNum = Number(
    String(a.lessonTitle || a.title)
      .trim()
      .match(/^(\d+)/)?.[1] || 999
  );

  const bNum = Number(
    String(b.lessonTitle || b.title)
      .trim()
      .match(/^(\d+)/)?.[1] || 999
  );

  return aNum - bNum;
});

        if (groupMaterials.length === 0) return null;

        const packageIsOpen =
  hasAnyLiveCourseOrder && packageGroup === "starter"
    ? true
    : canAccessLessonPackage(effectivePackageType, packageGroup);

        return (
          <div
            key={packageGroup}
            className="flex h-[420px] flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {getPackageLabel(packageGroup)} PDF Materyalleri
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {groupMaterials.length} materyal içerir
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  packageIsOpen
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-50 text-indigo-700"
                }`}
              >
                {packageIsOpen ? "Açık" : "Premium"}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {sortedGroupMaterials.map((material) => {
                const canOpen =
  activeAccessLevels.includes(selectedLevel) &&
  canAccessLessonPackage(
                    effectivePackageType,
                    material.packageType
                  ) &&
                  !accessExpired;

                return (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => {
                      if (!canOpen) {
                        setUpsellPackage(material.packageType);
                        setShowUpsell(true);
                        return;
                      }

                      completeDailyTask("pdf");
                      window.open(material.url, "_blank");
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      canOpen
                        ? "border-emerald-200 bg-white hover:bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-yellow-300 hover:bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="line-clamp-1 text-sm font-black text-slate-900">
                        {material.type === "pdf" ? "📄" : "📝"} {material.title}
                      </h4>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                          canOpen
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {canOpen ? "Açık" : "Kilitli"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                      Ders: {material.lessonTitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {!packageIsOpen && (
              <button
                type="button"
                onClick={() => {
                  setUpsellPackage(packageGroup);
                  setShowUpsell(true);
                }}
                className="mt-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-3 text-sm font-black text-slate-950 shadow hover:from-yellow-300 hover:to-orange-300"
              >
                {getPackageLabel(packageGroup)} paketini incele
              </button>
            )}
          </div>
        );
      })}
  </div>
)}
  </section>
)}
{activeDashboardTab === "exams" && (
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
    <p className="text-sm font-black uppercase tracking-widest text-blue-600">
      Goethe ve TELC Deneme Merkezi
    </p>

    <h2 className="mt-2 text-3xl font-black text-slate-900">
      Gerçek sınav formatına hazırlık alanı
    </h2>

    <p className="mt-3 text-sm leading-6 text-slate-600">
      Gerçek dijital sınavla uyumlu Goethe ve TELC denemeleri ile pratik yap.
    </p>

    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {[
  {
    title: "Başlangıç Denemeleri",
    count: "2 deneme",
    tier: "starter" as PackageType,
    desc: "Goethe ve TELC formatında örnek A1 sınavları.",
    href: `/exams/${selectedLevel.toLowerCase()}/list?tier=starter`,
  },
  {
    title: "Premium Denemeleri",
    count: "10 deneme",
    tier: "master" as PackageType,
    desc: "Gerçek sınav formatıyla birebir aynı ileri seviye denemeler.",
    href: `/exams/${selectedLevel.toLowerCase()}/list?tier=premium`,
  },
].map((examGroup) => {
  const isOpen =
    selectedLevelHasAccess &&
    canAccessLessonPackage(effectivePackageType, examGroup.tier) &&
    !accessExpired;

  return (
    <div
      key={examGroup.title}
      className={`rounded-3xl border p-5 shadow-sm ${
        isOpen ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            {selectedLevel} TELC
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-900">{examGroup.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${
          isOpen ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
        }`}>
          {isOpen ? "Açık" : "🔒 Kilitli"}
        </span>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-700">{examGroup.count}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{examGroup.desc}</p>
      <button
        type="button"
        onClick={() => {
  if (isOpen) {
    router.push(examGroup.href);
  } else if (examGroup.tier === "master") {
    setShowUpgradeModal(true);
  } else {
    setShowExamNotice(true);
  }
}}
        className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-black ${
          isOpen
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-950"
        }`}
      >
        {isOpen ? "Denemeleri Gör" : "Paketi İncele"}
      </button>
    </div>
  );
})}
  </div>

    <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
      <h3 className="text-lg font-black text-slate-900">
        Denemeler kurs sürecinde açılacak
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Okuma, dinleme, yazma ve konuşma bölümlerinden oluşan TELC deneme
        sınavları, eğitim ilerledikçe bu merkezden erişilebilir hale gelecektir.
      </p>
    </div>

    {showExamNotice && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
            TELC Deneme Merkezi
          </div>

          <h3 className="mt-5 text-3xl font-black text-slate-900">
            Deneme sınavların kurs sürecinde açılacak
          </h3>

          <p className="mt-4 text-base leading-7 text-slate-600">
            TELC formatına uygun dijital deneme sınavları, eğitim sürecinizin
            uygun aşamasında hesabınıza tanımlanacaktır.
          </p>

          <button
            type="button"
            onClick={() => setShowExamNotice(false)}
            className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-4 text-lg font-black text-white hover:bg-blue-700"
          >
            Tamam
          </button>
        </div>
      </div>
    )}
    {showUpgradeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-2xl">
      <div className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
        A1 Zirve Paketi
      </div>
      <h3 className="mt-5 text-3xl font-black text-slate-900">
        Gerçek sınav deneyimi için hazır mısın?
      </h3>
      <p className="mt-4 text-base leading-7 text-slate-600">
        10 adet tam sınav denemesi, gerçek sınav formatıyla birebir aynı sorular ve detaylı performans analizi seni bekliyor.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li>✓ 10 TELC dijital deneme sınavı</li>
        <li>✓ Tüm video ders arşivi</li>
        <li>✓ Zirve materyal sistemi</li>
        <li>✓ 12 ay erişim</li>
      </ul>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => setShowUpgradeModal(false)}
          className="flex-1 rounded-2xl border-2 border-slate-200 py-4 text-sm font-black text-slate-600 hover:bg-slate-50"
        >
          Vazgeç
        </button>
        <a
          href={`https://www.shopier.com/almanca_okulum/46635118`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-2xl bg-purple-600 py-4 text-center text-sm font-black text-white hover:bg-purple-700"
        >
          Zirve'ye Geç →
        </a>
      </div>
    </div>
  </div>
)}
  </section>
)}
{activeDashboardTab === "progress" && (
  <>
  {/* ÜST KPI KARTLARI */}
  <section className="mb-8 grid gap-6 lg:grid-cols-3">
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-sm text-slate-500">Toplam Ders</p>
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
        {openedLessonCount}
      </h2>
    </div>

    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-sm text-slate-500">Tamamlanan Görev</p>
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
        {completedCount}
      </h2>
    </div>

    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <p className="text-sm text-slate-500">Günlük Seri</p>
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
        {streak} 🔥
      </h2>
    </div>
  </section>

  {/* GRAFİK */}
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
    <h2 className="text-xl font-bold text-slate-900">
      Haftalık İlerleme
    </h2>

    <div className="mt-6 flex items-end gap-3 h-40">
      {[20, 40, 60, 30, 70, 50, progressPercent].map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div
            className="w-full rounded-xl bg-gradient-to-t from-blue-500 to-indigo-400 transition-all duration-500"
            style={{ height: `${val}%` }}
          />
          <p className="mt-2 text-xs text-slate-400">
            {["Pzt","Sal","Çar","Per","Cum","Cts","Paz"][i]}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* GENEL İLERLEME */}
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
    <h2 className="mb-4 text-xl font-bold text-slate-900">
      Genel İlerleme
    </h2>

    <div className="h-4 w-full rounded-full bg-slate-200">
      <div
        className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
        style={{ width: `${progressPercent}%` }}
      />
    </div>

    <p className="mt-3 text-sm text-slate-500">
      %{progressPercent} tamamlandı
    </p>
  </section>
</>
)}

{activeDashboardTab === "badges" && (
  <section className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
    <h2 className="text-xl font-bold text-slate-900">
      Başarı Rozetlerin
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Görevleri tamamladıkça rozetlerin açılır.
    </p>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {earnedBadges.map((badge) => (
        <div
          key={badge.key}
          className={`rounded-2xl border p-4 ${
            badge.earned
              ? "border-yellow-300 bg-yellow-50"
              : "border-slate-200 bg-slate-50 opacity-60"
          }`}
        >
          <div className="mb-3 text-3xl">
            {badge.earned ? "🏆" : "🔒"}
          </div>

          <h3 className="font-bold text-slate-900">{badge.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{badge.desc}</p>

          <p className="mt-3 text-xs font-semibold">
            {badge.earned ? "Kazanıldı" : "Kilitli"}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
    </div>

    <div className="hidden">
      <div>
        <p className="text-2xl font-bold">{streak}</p>
        <p className="text-xs opacity-80">Günlük Seri 🔥</p>
        <div className="mt-4">
  <p className="text-sm opacity-80">Seviye</p>
  <p className="text-xl font-bold">
    Level {level} – {levelLabel}
  </p>
<header className="mb-6 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-400 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
  Guten Morgen, {currentUser.name || currentUser.label || currentUser.username} 👋
</h1>

<p className="mt-1 text-sm opacity-90">
  Almanca öğrenme yolculuğuna devam edelim.
</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:inline-flex"
            >
              Çıkış Yap
            </button>
          </div>
        </header>
        <div className="mb-4 flex justify-end sm:hidden">
  <button
    type="button"
    onClick={handleLogout}
    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
  >
    Çıkış Yap
  </button>
</div>
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white shadow-xl">
  <p className="text-sm font-bold uppercase tracking-widest text-white/80">
  {activeLiveOrder ? "CANLI PROGRAM AKTİF" : "DİJİTAL PAKET AKTİF"}
</p>

<h2 className="mt-2 text-2xl font-black">
  {activeLiveOrder
    ? `${selectedLevel} Canlı Programın Devam Ediyor`
    : `${selectedLevel} ${getPackageLabel(
        effectivePackageType
      )} Paketin Aktif`}
</h2>

<p className="mt-2 text-sm text-white/90">
  {activeLiveOrder
    ? "Canlı dersler, öğretmen destekli görevler ve premium çalışma sistemiyle TELC sürecine devam ediyorsun."
    : "PDF materyaller, TELC denemeleri ve dijital çalışma sistemiyle Almanca gelişimini sürdürebilirsin."}
</p>

  <div className="mt-4 flex gap-3">
    <button className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-900">
      ▶ Devam Et
    </button>

    <button className="rounded-xl border border-white/40 px-4 py-2 text-sm font-black">
      📊 İlerlememi Gör
    </button>
  </div>
  <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
  <p className="text-sm font-bold text-slate-500">
    Genel İlerleme
  </p>

  <div className="mt-3 h-3 w-full rounded-full bg-slate-800">
    <div className="h-3 w-[45%] rounded-full bg-emerald-500"></div>
  </div>

  <p className="mt-2 text-xs text-slate-400">
    %45 tamamlandı
  </p>
</div>
</div>

        <section className="mb-6 grid gap-3 md:grid-cols-3">
          {LEVELS.map((level) => {
            const hasClass = userClasses.some((item) => item.level === level);
            const isSelected = selectedLevel === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  setSelectedLevel(level);
                  setSelectedLesson(null);
                  setShowUpsell(false);
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black">{level}</h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      hasClass
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-slate-700 text-slate-500"
                    }`}
                  >
                    {hasClass ? "Açık" : "Kilitli"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {hasClass
                    ? "Bu seviyedeki sınıf derslerinize erişebilirsiniz."
                    : "Bu seviye için henüz erişiminiz yok."}
                </p>
              </button>
            );
          })}
        </section>

        {isWaitingPaymentOrActivation && (
  <section className="mb-6 rounded-3xl border border-blue-400/30 bg-blue-400/10 p-6 text-blue-50 shadow-xl">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-blue-200">
          Ödeme alındı
        </p>

        <h2 className="mt-2 text-xl font-black">
          Siparişin onay bekliyor ⏳
        </h2>

        <p className="mt-2 text-sm text-blue-100">
          Ödemeni yaptıysan dekontunu WhatsApp’tan gönder.  
          Admin onayından sonra erişimin otomatik olarak açılacak.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        
        <a
          href={`https://wa.me/905013434419?text=${encodeURIComponent(
            `Merhaba, ödeme yaptım. Kullanıcı: ${currentUser.username}`
          )}`}
          target="_blank"
          className="rounded-2xl bg-green-500 px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-green-600"
        >
          📩 Dekont Gönder
        </a>

        <button
          type="button"
          onClick={handleContinuePayment}
          className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-yellow-300"
        >
          💳 Ödemeyi Tekrar Aç
        </button>
      </div>
    </div>
  </section>
)}

        {!studentAccess && !isWaitingPaymentOrActivation && (
          <section className="mb-6 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-50">
            <h2 className="text-lg font-black">
              Henüz bir sınıfa atanmadınız
            </h2>

            <p className="mt-2 text-sm text-yellow-100">
              Satın alma sonrası erişiminiz admin tarafından aktif edilince ders
              kayıtlarınız burada görünecektir.
            </p>
          </section>
        )}
        <section className="mb-8 rounded-3xl border bg-white p-5 shadow-sm">
  <div className="mb-5">
    <h2 className="text-xl font-bold text-slate-900">
      Ders Paneli
    </h2>
  </div>

  <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">Günlük Devam Serin</p>
        <p className="text-2xl font-bold">{streak} gün 🔥</p>
      </div>

      <div className="text-right text-sm">
        {streak === 1 && "Başlangıç yaptın"}
        {streak >= 2 && streak < 5 && "Devam et"}
        {streak >= 5 && "Harika gidiyorsun"}
      </div>
    </div>
  </div>

  {inactiveDays >= 2 && (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Dikkat!</p>
          <p className="text-lg font-bold">
            {inactiveDays} gündür çalışmadın
          </p>
        </div>
      </div>
    </div>
  )}
  </section>
  <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">
          {inactiveDays} gündür çalışmadın
        </p>
        <p className="text-lg font-bold">
          TELC hedefinden uzaklaşıyorsun ⚠️
        </p>
      </div>

      <button
        onClick={() => {
  localStorage.removeItem("last_selected_lesson");
  localStorage.removeItem(`opened_lesson_count_${currentUsername}`);

  localStorage.removeItem(taskStorageKey);

  localStorage.removeItem("user_streak");
  localStorage.removeItem("last_active_date");

  setLastLesson(null);
  setSelectedLesson(null);
  setCompletedTasks({
    lesson: false,
    pdf: false,
    speaking: false,
  });
  setStreak(0);
  setLastActiveDate(null);

}}
        className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-600"
      >
        Tekrar Başla
      </button>
    </div>
  </div>


        {effectivePackageType &&
          upgradeOffers.length > 0 &&
          !isWaitingPaymentOrActivation && (
            <section
              id="upgrade-box"
              className="mb-6 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-50 shadow-xl"
            >
              <p className="text-sm font-black uppercase tracking-widest text-yellow-200">
                Daha fazla içerik aç
              </p>

              <h2 className="mt-2 text-xl font-black">
                🚀 {selectedLevel} paketini yükselt
              </h2>

              <p className="mt-2 text-sm text-yellow-100">
                Şu anda {getPackageLabel(effectivePackageType)} paketindesiniz.
                Daha fazla TELC denemesi, offline ders ve çalışma materyali
                için paketinizi yükseltebilirsiniz.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {upgradeOffers.map((offer) => (
                  <div
                    key={offer.type}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <h3 className="text-lg font-black text-white">
                      {offer.title}
                    </h3>

                    <p className="mt-2 text-sm text-yellow-100">
                      {offer.text}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleUpgrade(offer.type)}
                      className="mt-4 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300"
                    >
                      {offer.title}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

        {showUpsell && (
  <section
    id="upgrade-box"
    className="mb-6 rounded-3xl border border-yellow-300 bg-yellow-50 p-6 text-slate-900 shadow-xl"
  >
    <p className="text-sm font-black uppercase tracking-widest text-yellow-600">
      🔒 Bu içerik {getPackageLabel(upsellPackage)} paketinde
    </p>

    <h2 className="mt-2 text-2xl font-black">
      {getPackageLabel(upsellPackage)} paketine geçerek daha fazla içeriği aç
    </h2>

    <p className="mt-3 text-sm leading-6 text-slate-600">
      Bu pakette daha fazla TELC denemesi, offline video dersler, PDF materyaller
      ve daha güçlü bir çalışma planı seni bekliyor.
    </p>

    <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        ✓ Daha fazla ders kaydı
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        ✓ Daha fazla TELC deneme sınavı
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        ✓ PDF + ödev destekli hazırlık
      </div>
    </div>

    <button
      type="button"
      onClick={() => handleUpgrade(upsellPackage)}
      className="mt-6 w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-4 text-sm font-black text-slate-950 shadow-lg hover:from-yellow-300 hover:to-orange-300"
    >
      {selectedLevelHasAccess
  ? `🚀 ${getPackageLabel(upsellPackage)} Paketine Yükselt`
  : `🚀 ${selectedLevel} Gelişim Paketini Aç`}
    </button>
  </section>
)}       
</div>
</div>
</div>
</div>
</main>
  );
}
function SinavHocasiPanel({ currentUser, speakingProgress, setSpeakingTeşvikMesaj, temaHakkiVar }: any) {
  const [talepGonderildi, setTalepGonderildi] = React.useState(false);
  const [atananHoca, setAtananHoca] = React.useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = React.useState(false);
  const [hocaOlarakAtananlar, setHocaOlarakAtananlar] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!currentUser) return;

    // Kendi sınav talebini kontrol et
    supabase
      .from("speaking_sinav_talepleri")
      .select("*")
      .eq("username", currentUser.username)
      .eq("sinav_tema_no", speakingProgress.current_tema)
      .eq("level", "A1")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTalepGonderildi(true);
          if (data.atanan_hoca) setAtananHoca(data.atanan_hoca);
        }
      });

    // Hoca olarak atandığın talepleri kontrol et
    supabase
      .from("speaking_sinav_talepleri")
      .select("*")
      .eq("atanan_hoca", currentUser.username)
      .eq("durum", "bekliyor")
      .then(({ data }) => {
        if (data && data.length > 0) setHocaOlarakAtananlar(data);
      });
  }, []);

  return (
    <div className="space-y-4">

      {/* Hoca olarak atandığın sınavlar */}
      {hocaOlarakAtananlar.length > 0 && (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-5">
          <p className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-3">
            🎓 Sınav Yapacağın Öğrenciler
          </p>
          {hocaOlarakAtananlar.map((talep) => (
            <div key={talep.id} className="rounded-2xl bg-white border border-yellow-100 p-4 mb-3">
              <p className="font-black text-slate-900 mb-1">👤 {talep.username}</p>
              <p className="text-xs text-slate-500 mb-3">Tema {talep.sinav_tema_no} sınavı</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const ogrenci = talep.username;
                    const rozet =
                      talep.sinav_tema_no >= 12 ? "🏆 Konuşma Şampiyonu"
                      : talep.sinav_tema_no >= 9 ? "🥇 Altın Konuşmacı"
                      : talep.sinav_tema_no >= 6 ? "🥈 Gümüş Konuşmacı"
                      : "🥉 Bronz Konuşmacı";

                    const { data: ogrenciProg } = await supabase
                      .from("speaking_progress")
                      .select("*")
                      .eq("username", ogrenci)
                      .eq("level", "A1")
                      .maybeSingle();

                    if (ogrenciProg) {
                      await supabase.from("speaking_progress")
                        .update({
                          current_tema: talep.sinav_tema_no + 1,
                          current_gorev: 1,
                          sinav_bekleniyor: false,
                          son_sinav_tema: talep.sinav_tema_no,
                          rozet,
                        })
                        .eq("id", ogrenciProg.id);
                    }

                    await supabase.from("speaking_sinav_talepleri")
                      .update({ durum: "tamamlandi", sonuc: "gecti" })
                      .eq("id", talep.id);

                    await supabase.from("speaking_exams").insert({
                      username: ogrenci,
                      level: "A1",
                      sinav_tema_no: talep.sinav_tema_no,
                      gecti: true,
                    });

                    setHocaOlarakAtananlar(prev => prev.filter(t => t.id !== talep.id));
                    setSpeakingTeşvikMesaj({
                      icon: "🎉",
                      baslik: "Sınav Kaydedildi!",
                      mesaj: `${ogrenci} geçti olarak işaretlendi. Rozet: ${rozet}`,
                      renk: "from-emerald-500 to-teal-500",
                    });
                  }}
                  className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
                >
                  ✅ Geçti
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ogrenci = talep.username;

                    await supabase.from("speaking_sinav_talepleri")
                      .update({ durum: "tamamlandi", sonuc: "kaldi" })
                      .eq("id", talep.id);

                    await supabase.from("speaking_exams").insert({
                      username: ogrenci,
                      level: "A1",
                      sinav_tema_no: talep.sinav_tema_no,
                      gecti: false,
                    });

                    setHocaOlarakAtananlar(prev => prev.filter(t => t.id !== talep.id));
                    setSpeakingTeşvikMesaj({
                      icon: "📚",
                      baslik: "Sınav Kaydedildi",
                      mesaj: `${ogrenci} kaldı olarak işaretlendi.`,
                      renk: "from-red-500 to-orange-500",
                    });
                  }}
                  className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white hover:bg-red-600"
                >
                  ❌ Kaldı
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kendi sınav talebi */}
      {atananHoca ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
          <div className="text-3xl mb-3">🎓</div>
          <p className="font-black text-emerald-800">Sınav Hocan Atandı!</p>
          <p className="text-sm text-slate-600 mt-2">{atananHoca}</p>
          <p className="text-xs text-slate-500 mt-2">Sınav hocan seninle iletişime geçecek.</p>
        </div>
      ) : talepGonderildi ? (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 text-center">
          <div className="text-3xl mb-3">⏳</div>
          <p className="font-black text-blue-800">Sınav Hocası Bekleniyor</p>
          <p className="text-sm text-slate-500 mt-2">Talebini aldık. Admin en kısa sürede bir sınav hocası atayacak.</p>
        </div>
      ) : !temaHakkiVar ? (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <p className="font-black text-slate-700">Sınav Hocası Talebi Kilitli</p>
          <p className="text-sm text-slate-500 mt-2">Her 3 temayı tamamladığında sınav hocası talep edebilirsin.</p>
        </div>
      ) : (
        <button
          type="button"
          disabled={yukleniyor}
          onClick={async () => {
            if (!currentUser) return;
            setYukleniyor(true);
            const { error } = await supabase.from("speaking_sinav_talepleri").insert({
              username: currentUser.username,
              level: "A1",
              sinav_tema_no: speakingProgress.current_tema,
              durum: "bekliyor",
            });
            if (error) {
              alert("Hata: " + error.message);
              setYukleniyor(false);
              return;
            }
            setYukleniyor(false);
            setTalepGonderildi(true);
          }}
          className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-4 text-sm font-black text-slate-900 hover:opacity-90 disabled:opacity-50"
        >
          {yukleniyor ? "Gönderiliyor..." : "🎓 Sınav Hocası Talep Et"}
        </button>
      )}
    </div>
  );
}