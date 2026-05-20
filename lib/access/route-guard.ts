import { redirect } from "next/navigation";
import { canAccessFeature } from "./access-control";
import type { LevelCode, FeatureKey } from "../../types/product";

function getUnlockedLevelsFromCookie(rawCookie: string | undefined): string[] {
  if (!rawCookie) {
    return [];
  }

  try {
    const decoded = decodeURIComponent(rawCookie);
    const parsed = JSON.parse(decoded) as Record<string, boolean>;

    const unlockedLevels = new Set<string>();

    for (const [slug, isPurchased] of Object.entries(parsed)) {
      if (!isPurchased) continue;

      const normalized = slug.toLowerCase();

      if (normalized.startsWith("a1-")) unlockedLevels.add("A1");
      if (normalized.startsWith("a2-")) unlockedLevels.add("A2");
      if (normalized.startsWith("b1-")) unlockedLevels.add("B1");
    }

    return Array.from(unlockedLevels);
  } catch {
    return [];
  }
}

function getMockPurchasesFromDocumentCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    if (cookie.startsWith("mock_purchases=")) {
      return cookie.split("=")[1];
    }
  }

  return undefined;
}

export async function requireAccessOrRedirect(params: {
  userId: string;
  level: LevelCode;
  feature: FeatureKey;
}) {
  const result = canAccessFeature({
    userId: params.userId,
    level: params.level,
    feature: params.feature,
  });

  // 🔥 MOCK PURCHASE KONTROLÜ
  const rawCookie = getMockPurchasesFromDocumentCookie();
  const unlockedLevels = getUnlockedLevelsFromCookie(rawCookie);

  const hasPurchaseAccess = unlockedLevels.includes(params.level);

  const hasAccess = result.allowed || hasPurchaseAccess;

  if (!hasAccess) {
    redirect("/dashboard");
  }
}