import { getProductBySlug } from "../catalog/product-catalog";
import {
  getMockUserEntitlements,
  getMockUserPackages,
  getMockUserProgress,
} from "./mock-entitlements";
import type {
  AccessCheckInput,
  AccessCheckResult,
  FeatureKey,
  LevelCardViewModel,
  LevelCode,
  PackageTier,
  UpsellOffer,
  UserEntitlement,
  UserLevelProgress,
  UserPackage,
} from "../../types/product";

const LEVELS: LevelCode[] = ["A1", "A2", "B1"];

function normalizeLevel(value: string | undefined | null): LevelCode | null {
  if (!value) {
    return null;
  }

  const upper = value.toUpperCase();

  if (upper === "A1" || upper === "A2" || upper === "B1") {
    return upper;
  }

  return null;
}

function getLevelTitle(level: LevelCode): string {
  return level;
}

function getSafeEntitlements(userId: string): UserEntitlement[] {
  return getMockUserEntitlements(userId).filter(
    (item: UserEntitlement) => item.active
  );
}

function getSafePackages(userId: string): UserPackage[] {
  return getMockUserPackages(userId).filter(
    (item: UserPackage) => item.active
  );
}

function getSafeProgress(userId: string): UserLevelProgress[] {
  return getMockUserProgress(userId);
}

function findLevelProgress(
  userId: string,
  level: LevelCode
): UserLevelProgress | undefined {
  return getSafeProgress(userId).find(
    (item: UserLevelProgress) => item.level === level
  );
}

function findHighestPackageForLevel(
  userId: string,
  level: LevelCode
): UserPackage | undefined {
  const packages = getSafePackages(userId).filter(
    (item: UserPackage) => item.level === level
  );

  const tierRank: Record<PackageTier, number> = {
    STARTER: 1,
    PRACTICE: 2,
    MASTER: 3,
  };

  return packages.sort((a: UserPackage, b: UserPackage) => {
    const aRank = a.tier ? tierRank[a.tier] : 0;
    const bRank = b.tier ? tierRank[b.tier] : 0;
    return bRank - aRank;
  })[0];
}

function hasEntitlement(
  userId: string,
  level: LevelCode,
  feature: FeatureKey
): boolean {
  const entitlements = getSafeEntitlements(userId);

  return entitlements.some(
    (item: UserEntitlement) =>
      item.level === level && item.feature === feature && item.active
  );
}

function getEntitlementValue(
  userId: string,
  level: LevelCode,
  feature: FeatureKey
): string | number | boolean | string[] | null | undefined {
  const entitlements = getSafeEntitlements(userId);

  return entitlements.find(
    (item: UserEntitlement) =>
      item.level === level && item.feature === feature && item.active
  )?.value;
}

function getCurrentPackageTitle(
  userId: string,
  level: LevelCode
): string | undefined {
  const highestPackage = findHighestPackageForLevel(userId, level);

  if (!highestPackage) {
    return undefined;
  }

  return getProductBySlug(highestPackage.productSlug)?.title;
}

function getNextLevel(level: LevelCode): LevelCode | null {
  if (level === "A1") {
    return "A2";
  }

  if (level === "A2") {
    return "B1";
  }

  return null;
}

function buildLockedLevelUpsell(level: LevelCode): UpsellOffer {
  return {
    type: "LEVEL_UNLOCK",
    title: `${level} seviyesinin kilidini aç`,
    description: `${level} dijital deneme sınavlarına ve seviye içeriklerine eriş.`,
    targetProductSlug: `${level.toLowerCase()}-starter`,
    ctaLabel: "Kilidi Aç",
  };
}

function buildPackageUpgradeUpsell(level: LevelCode): UpsellOffer {
  return {
    type: "PACKAGE_UPGRADE",
    title: `${level} Practice paketine yükselt`,
    description:
      "Daha fazla deneme sınavı, PDF materyaller ve çalışma planı açılır.",
    targetProductSlug: `${level.toLowerCase()}-practice`,
    ctaLabel: "Yükselt",
  };
}

function buildFullBundleUpsell(): UpsellOffer {
  return {
    type: "FULL_BUNDLE",
    title: "Tüm seviyeleri aç",
    description:
      "A1, A2 ve B1 seviyelerinin tamamını indirimli paketle aç.",
    targetProductSlug: "full-bundle",
    ctaLabel: "Tümünü Aç",
  };
}

export function canAccessFeature(
  input: AccessCheckInput
): AccessCheckResult {
  const safeLevel = normalizeLevel(input.level);

  if (!safeLevel) {
    return {
      allowed: false,
      reason: "UNKNOWN",
    };
  }

  const hasLevelAccess = hasEntitlement(
    input.userId,
    safeLevel,
    "level_access"
  );

  if (!hasLevelAccess) {
    return {
      allowed: false,
      reason: "LEVEL_LOCKED",
      upsellTargetSlug: `${safeLevel.toLowerCase()}-starter`,
    };
  }

  const hasRequestedFeature = hasEntitlement(
    input.userId,
    safeLevel,
    input.feature
  );

  if (!hasRequestedFeature) {
    return {
      allowed: false,
      reason: "FEATURE_NOT_INCLUDED",
      upsellTargetSlug: `${safeLevel.toLowerCase()}-practice`,
    };
  }

  return {
    allowed: true,
  };
}

export function canAccessLevel(
  userId: string,
  level: LevelCode
): AccessCheckResult {
  return canAccessFeature({
    userId,
    level,
    feature: "level_access",
  });
}

export function getLevelAccessMap(userId: string): Record<LevelCode, boolean> {
  return {
    A1: canAccessLevel(userId, "A1").allowed,
    A2: canAccessLevel(userId, "A2").allowed,
    B1: canAccessLevel(userId, "B1").allowed,
  };
}

export function getFeatureAccessMap(
  userId: string,
  level: LevelCode
): Record<FeatureKey, boolean> {
  return {
    level_access: canAccessFeature({
      userId,
      level,
      feature: "level_access",
    }).allowed,
    exam_access: canAccessFeature({
      userId,
      level,
      feature: "exam_access",
    }).allowed,
    basic_results: canAccessFeature({
      userId,
      level,
      feature: "basic_results",
    }).allowed,
    pdf_materials: canAccessFeature({
      userId,
      level,
      feature: "pdf_materials",
    }).allowed,
    study_plan: canAccessFeature({
      userId,
      level,
      feature: "study_plan",
    }).allowed,
    video_course: canAccessFeature({
      userId,
      level,
      feature: "video_course",
    }).allowed,
    smart_guidance: canAccessFeature({
      userId,
      level,
      feature: "smart_guidance",
    }).allowed,
  };
}

export function getExamAccessCount(userId: string, level: LevelCode): number {
  const value = getEntitlementValue(userId, level, "exam_access");

  if (typeof value === "number") {
    return value;
  }

  return 0;
}

export function getPrimaryActionLabel(
  userId: string,
  level: LevelCode
): string {
  const access = canAccessLevel(userId, level);

  if (!access.allowed) {
    return "Kilidi Aç";
  }

  const progress = findLevelProgress(userId, level);

  if (!progress || progress.examsCompleted === 0) {
    return "Sınavı Başlat";
  }

  if (progress.completionPercent >= 100) {
    return "Sonuçları Gör";
  }

  return "Devam Et";
}

export function getRecommendedUpsell(
  userId: string,
  level: LevelCode
): UpsellOffer | undefined {
  const levelAccess = canAccessLevel(userId, level);

  if (!levelAccess.allowed) {
    return buildLockedLevelUpsell(level);
  }

  const highestPackage = findHighestPackageForLevel(userId, level);

  if (highestPackage?.tier === "STARTER") {
    return buildPackageUpgradeUpsell(level);
  }

  const nextLevel = getNextLevel(level);

  if (nextLevel) {
    const progress = findLevelProgress(userId, level);

    if (progress && progress.averageScorePercent >= 70) {
      return buildLockedLevelUpsell(nextLevel);
    }
  }

  if (level === "B1") {
    return buildFullBundleUpsell();
  }

  return undefined;
}

export function buildLevelCardViewModel(
  userId: string,
  level: LevelCode
): LevelCardViewModel {
  const levelAccess = canAccessLevel(userId, level);
  const progress = findLevelProgress(userId, level);

  return {
    level,
    title: getLevelTitle(level),
    locked: !levelAccess.allowed,
    currentPackageTitle: getCurrentPackageTitle(userId, level),
    completionPercent: progress?.completionPercent ?? 0,
    examsCompleted: progress?.examsCompleted ?? 0,
    averageScorePercent: progress?.averageScorePercent ?? 0,
    weakAreas: progress?.weakAreas ?? [],
    recommendedNextStep: progress?.recommendedNextStep ?? null,
    primaryActionLabel: getPrimaryActionLabel(userId, level),
    upsellOffer: getRecommendedUpsell(userId, level),
  };
}

export function buildAllLevelCardViewModels(
  userId: string
): LevelCardViewModel[] {
  return LEVELS.map((level: LevelCode) => buildLevelCardViewModel(userId, level));
}

export function getUserAccessSummary(userId: string) {
  return {
    packages: getSafePackages(userId),
    entitlements: getSafeEntitlements(userId),
    progress: getSafeProgress(userId),
    levelAccess: getLevelAccessMap(userId),
  };
}
export type ContentType = "liveClass" | "digitalPackage";

export function addMonthsToDate(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

export function getAccessEndDateByProduct(productType: string) {
  if (productType === "liveCourse") {
    return addMonthsToDate(3);
  }

  if (productType === "practice") {
    return addMonthsToDate(6);
  }

  if (productType === "master") {
    return addMonthsToDate(12);
  }

  return null;
}

export function isAccessExpired(accessEndDate?: string | null) {
  if (!accessEndDate) return false;

  return new Date() > new Date(accessEndDate);
}

export function getRemainingDays(accessEndDate?: string | null) {
  if (!accessEndDate) return null;

  const diff = new Date(accessEndDate).getTime() - new Date().getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}