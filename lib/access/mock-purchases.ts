export type ExamLevel = "A1" | "A2" | "B1";

export type MockPurchases = Record<string, boolean>;

const MOCK_PURCHASES_KEY = "mock_purchases";

export function getMockPurchases(): MockPurchases {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(MOCK_PURCHASES_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as MockPurchases;
  } catch (error) {
    console.error("Failed to read mock purchases:", error);
    return {};
  }
}

export function getUnlockedLevelsFromPurchases(
  purchases: MockPurchases
): ExamLevel[] {
  const unlockedLevels = new Set<ExamLevel>();

  for (const [slug, isPurchased] of Object.entries(purchases)) {
    if (!isPurchased) {
      continue;
    }

    const normalizedSlug = slug.toLowerCase();

    if (normalizedSlug.startsWith("a1-")) {
      unlockedLevels.add("A1");
    }

    if (normalizedSlug.startsWith("a2-")) {
      unlockedLevels.add("A2");
    }

    if (normalizedSlug.startsWith("b1-")) {
      unlockedLevels.add("B1");
    }
  }

  return Array.from(unlockedLevels);
}

export function isLevelUnlockedFromPurchases(level: ExamLevel): boolean {
  const purchases = getMockPurchases();
  const unlockedLevels = getUnlockedLevelsFromPurchases(purchases);

  return unlockedLevels.includes(level);
}
export function addMockPurchase(input: {
  packageSlug: string;
  level: "a1" | "a2" | "b1";
}) {
  if (typeof window === "undefined") {
    return;
  }

  const currentPurchases = getMockPurchases();

  const nextPurchases: MockPurchases = {
    ...currentPurchases,
    [input.packageSlug]: true,
  };

  window.localStorage.setItem(
    MOCK_PURCHASES_KEY,
    JSON.stringify(nextPurchases)
  );

  document.cookie = `${MOCK_PURCHASES_KEY}=${encodeURIComponent(
    JSON.stringify(nextPurchases)
  )}; path=/`;
}