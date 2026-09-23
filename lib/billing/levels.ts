export type BillingLevel = "A1" | "A2" | "B1";

// Bir ürün slug'ının kapsadığı seviyeleri döner (örn. "live-a1-a2-b1" -> ["A1","A2","B1"])
export function getLevelsFromProductSlug(slug: string): BillingLevel[] {
  const s = String(slug || "").toLowerCase();
  const levels: BillingLevel[] = [];
  if (s.includes("a1")) levels.push("A1");
  if (s.includes("a2")) levels.push("A2");
  if (s.includes("b1")) levels.push("B1");
  return levels;
}

export function isLiveCourseSlug(slug: string): boolean {
  return String(slug || "").startsWith("live-");
}

export function isSpeakingClubSlug(slug: string): boolean {
  return String(slug || "").startsWith("konusma-");
}