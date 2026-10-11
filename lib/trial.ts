// Ücretsiz deneme dersi (/deneme-dersi) ortak sabitleri.

// Deneme Sınıfı, classes tablosunda bu class_type ile tutulur. Bu sınıfa
// yüklenen dersler yalnızca deneme panelinde görünür; gerçek öğrenci
// panelinde hiçbir öğrenciye gösterilmez.
export const TRIAL_CLASS_TYPE = "trial";

export function isTrialClass(classItem: { class_type?: string | null; classType?: string | null }) {
  return (classItem.class_type ?? classItem.classType) === TRIAL_CLASS_TYPE;
}

// Supabase classes satırlarından deneme sınıfı id'leri.
export function getTrialClassIds(rows: { id: string; class_type?: string | null }[] | null | undefined) {
  return new Set((rows || []).filter((row) => row.class_type === TRIAL_CLASS_TYPE).map((row) => row.id));
}

// Deneme panelindeki sınırlar
export const TRIAL_WORD_THEME_LIMIT = 3; // Kelime Arenası: ilk 3 tema
export const TRIAL_WORKSHEET_THEME_LIMIT = 3; // Çalışma sayfaları: ilk 3 tema (1–9. dersler)
export const LESSONS_PER_THEME = 3;

// Deneme başvurusu tarayıcıda saklanır; geri gelen ziyaretçi formu tekrar doldurmaz.
export const TRIAL_LEAD_STORAGE_KEY = "trial_lead";

// Canlı kurs paket seçimi → kayıt → PayTR (mevcut akış)
export const TRIAL_SIGNUP_URL = "/academy-live#kayit";
