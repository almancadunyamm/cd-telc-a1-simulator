import { supabase } from "@/lib/supabase";
import { getLevelsFromProductSlug, isLiveCourseSlug } from "@/lib/billing/levels";

// Bir sipariş "completed" olduğunda öğrenciye gerçek erişimi veren ortak mantık.
// Hem PayTR callback'i hem admin'in elle "Aktif Et" butonu bunu kullanır,
// böylece iki yerde ayrı ayrı (ve birbirinden farklı) mantık olmaz.
export async function grantOrderAccess(params: {
  username: string;
  productSlug: string;
}) {
  const normalizedUsername = String(params.username || "").trim().toLowerCase();
  const slug = String(params.productSlug || "").toLowerCase();

  // Kullanıcıyı aktif işaretle
  await supabase
    .from("users")
    .update({ is_active: true })
    .eq("email", normalizedUsername);

  // Sadece canlı kurs siparişleri sınıf ataması gerektirir.
  // Dijital paket ve Konuşma Kulübü siparişleri, sipariş "completed" olduğu
  // anda dashboard tarafında zaten otomatik okunuyor (ekstra bir şey gerekmiyor).
  if (!isLiveCourseSlug(slug)) {
    return { assignedClasses: [] as string[] };
  }

  const levels = getLevelsFromProductSlug(slug);
  const assignedClasses: string[] = [];

  const { data: classesFromDb, error: classesError } = await supabase
    .from("classes")
    .select("*");

  if (classesError) {
    throw new Error("Sınıflar yüklenemedi: " + classesError.message);
  }

  for (const level of levels) {
    const defaultClass = (classesFromDb || []).find(
      (item: any) =>
        item.level === level &&
        item.is_default_sales_class === true &&
        (item.class_type || "live") === "live"
    );

    if (!defaultClass) {
      // Sınıf tanımlı değilse siparişi durdurmayalım (para zaten alındı) —
      // ama açıkça loglayalım ki admin panelden elle tamamlansın.
      console.error(
        `[grantOrderAccess] ${level} seviyesi için varsayılan canlı satış sınıfı yok (slug: ${slug}, kullanıcı: ${normalizedUsername})`
      );
      continue;
    }

    const { data: existingAccess } = await supabase
      .from("student_class_access")
      .select("id")
      .eq("username", normalizedUsername)
      .eq("main_class_id", defaultClass.id)
      .maybeSingle();

    if (!existingAccess) {
      const { error: accessInsertError } = await supabase
        .from("student_class_access")
        .insert({
          username: normalizedUsername,
          main_class_id: defaultClass.id,
          extra_class_access: [],
        });

      if (accessInsertError) {
        console.error(
          `[grantOrderAccess] Sınıf ataması başarısız: ${accessInsertError.message}`
        );
        continue;
      }
    }

    assignedClasses.push(defaultClass.id);
  }

  return { assignedClasses };
}