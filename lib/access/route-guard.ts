import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { LevelCode, FeatureKey } from "../../types/product";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getExamCountForSlug(productSlug: string): number {
  const slug = productSlug.toLowerCase();
  // Zirve / master → 10 deneme
  if (slug.includes("zirve") || slug.includes("master")) return 10;
  // Gelişim / practice → 5 deneme
  if (slug.includes("gelisim") || slug.includes("practice")) return 5;
  // Başlangıç / starter / live → 2 deneme
  if (slug.includes("starter") || slug.includes("live") || slug.includes("baslangic")) return 2;
  return 0;
}

function levelMatchesSlug(level: LevelCode, productSlug: string): boolean {
  const slug = productSlug.toLowerCase();
  // Tüm seviyeleri kapsayan paketler
  if (slug.includes("a1-a2-b1") || slug.includes("full") || slug.includes("live-full")) return true;
  // A1+A2 paketleri
  if ((slug.includes("a1-a2") || slug.includes("a1a2")) && (level === "A1" || level === "A2")) return true;
  // Seviyeye özel
  if (slug.startsWith(level.toLowerCase() + "-")) return true;
  if (slug.includes("-" + level.toLowerCase() + "-")) return true;
  if (slug.endsWith("-" + level.toLowerCase())) return true;
  if (slug.includes(level.toLowerCase())) return true;
  return false;
}

export async function requireAccessOrRedirect(params: {
  userId: string;
  level: LevelCode;
  feature: FeatureKey;
}) {
  // userId aslında email (username) olarak kullanılıyor
  const username = params.userId;

  if (!username || username === "default-mock-user") {
    redirect("/dashboard");
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Kullanıcının aktif completed orderlarını çek
    const { data: orders, error } = await supabase
      .from("orders")
      .select("product_slug, status, is_activated")
      .eq("username", username.toLowerCase())
      .eq("status", "completed");

    if (error) {
      console.error("Route guard Supabase error:", error);
      redirect("/dashboard");
    }

    if (!orders || orders.length === 0) {
      redirect("/dashboard");
    }

    // Bu seviye için geçerli bir order var mı?
    const hasAccess = orders.some((order: any) => {
      const slug = String(order.product_slug || "");
      if (!levelMatchesSlug(params.level, slug)) return false;
      
      if (params.feature === "exam_access") {
        return getExamCountForSlug(slug) > 0;
      }
      return true;
    });

    if (!hasAccess) {
      redirect("/dashboard");
    }
  } catch (err) {
    // redirect() bir exception fırlatır, onu yeniden throw et
    throw err;
  }
}