export type LevelCode = "A1" | "A2" | "B1";

export type PackageTier = "STARTER" | "PRACTICE" | "MASTER";

export type ProductType = "LEVEL_PACKAGE" | "LEVEL_UPSELL" | "FULL_BUNDLE";

export type FeatureKey =
  | "level_access"
  | "exam_access"
  | "basic_results"
  | "pdf_materials"
  | "study_plan"
  | "video_course"
  | "smart_guidance";

export type CurrencyCode = "TRY" | "EUR" | "USD";

export type UserRecommendationKey =
  | "KEEP_PRACTICING"
  | "REVIEW_WEAK_AREAS"
  | "UPGRADE_PACKAGE"
  | "UNLOCK_NEXT_LEVEL"
  | "BUY_FULL_BUNDLE";

export type ProductFeature = {
  key: FeatureKey;
  enabled: boolean;
  value?: string | number | boolean | string[] | null;
};

export type ProductPrice = {
  currency: CurrencyCode;
  amount: number;
  compareAtAmount?: number | null;
  active: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: LevelCode | null;
  tier: PackageTier | null;
  productType: ProductType;
  active: boolean;
  features: ProductFeature[];
  price: ProductPrice;
  badge?: string;
  shopierUrl?: string;
};

export type UserEntitlement = {
  userId: string;
  level: LevelCode | null;
  feature: FeatureKey;
  active: boolean;
  sourceProductSlug: string;
  value?: string | number | boolean | string[] | null;
};

export type UserPackage = {
  userId: string;
  productSlug: string;
  level: LevelCode | null;
  tier: PackageTier | null;
  purchasedAt: string;
  active: boolean;
};

export type UserLevelProgress = {
  level: LevelCode;
  completionPercent: number;
  examsCompleted: number;
  averageScorePercent: number;
  weakAreas: string[];
  recommendedNextStep: UserRecommendationKey | null;
};

export type AccessCheckInput = {
  userId: string;
  level: LevelCode;
  feature: FeatureKey;
};

export type AccessCheckResult = {
  allowed: boolean;
  reason?:
    | "LEVEL_LOCKED"
    | "FEATURE_NOT_INCLUDED"
    | "NO_ACTIVE_PRODUCT"
    | "UNKNOWN";
  upsellTargetSlug?: string;
};

export type UpsellOfferType =
  | "LEVEL_UNLOCK"
  | "PACKAGE_UPGRADE"
  | "FULL_BUNDLE";

export type UpsellOffer = {
  type: UpsellOfferType;
  title: string;
  description: string;
  targetProductSlug: string;
  ctaLabel: string;
};

export type LevelCardViewModel = {
  level: LevelCode;
  title: string;
  locked: boolean;
  currentPackageTitle?: string;
  completionPercent: number;
  examsCompleted: number;
  averageScorePercent: number;
  weakAreas: string[];
  recommendedNextStep: UserRecommendationKey | null;
  primaryActionLabel: string;
  upsellOffer?: UpsellOffer;
};