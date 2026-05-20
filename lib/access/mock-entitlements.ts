import type {
  FeatureKey,
  LevelCode,
  PackageTier,
  UserEntitlement,
  UserLevelProgress,
  UserPackage,
} from "../../types/product";

type MockUserSeed = {
  userId: string;
  packages: UserPackage[];
  entitlements: UserEntitlement[];
  progress: UserLevelProgress[];
};

function createLevelPackageEntitlements(params: {
  userId: string;
  productSlug: string;
  level: LevelCode;
  features: Array<{
    feature: FeatureKey;
    value?: string | number | boolean | string[] | null;
  }>;
}): UserEntitlement[] {
  return params.features.map((item) => ({
    userId: params.userId,
    level: params.level,
    feature: item.feature,
    active: true,
    sourceProductSlug: params.productSlug,
    value: item.value ?? null,
  }));
}

function createPurchasedPackage(params: {
  userId: string;
  productSlug: string;
  level: LevelCode | null;
  tier: PackageTier | null;
  purchasedAt: string;
}): UserPackage {
  return {
    userId: params.userId,
    productSlug: params.productSlug,
    level: params.level,
    tier: params.tier,
    purchasedAt: params.purchasedAt,
    active: true,
  };
}

const userA1Master: MockUserSeed = {
  userId: "user-a1-master",
  packages: [
    createPurchasedPackage({
      userId: "user-a1-master",
      productSlug: "a1-master",
      level: "A1",
      tier: "MASTER",
      purchasedAt: "2026-04-04T10:00:00.000Z",
    }),
  ],
  entitlements: createLevelPackageEntitlements({
    userId: "user-a1-master",
    productSlug: "a1-master",
    level: "A1",
    features: [
      { feature: "level_access" },
      { feature: "exam_access", value: 5 },
      { feature: "basic_results" },
      { feature: "pdf_materials" },
      { feature: "study_plan" },
      { feature: "video_course" },
      { feature: "smart_guidance" },
    ],
  }),
  progress: [
    {
      level: "A1",
      completionPercent: 68,
      examsCompleted: 2,
      averageScorePercent: 74,
      weakAreas: ["Hören Teil 2", "Schreiben"],
      recommendedNextStep: "UNLOCK_NEXT_LEVEL",
    },
    {
      level: "A2",
      completionPercent: 0,
      examsCompleted: 0,
      averageScorePercent: 0,
      weakAreas: [],
      recommendedNextStep: null,
    },
    {
      level: "B1",
      completionPercent: 0,
      examsCompleted: 0,
      averageScorePercent: 0,
      weakAreas: [],
      recommendedNextStep: null,
    },
  ],
};

const userA1Starter: MockUserSeed = {
  userId: "user-a1-starter",
  packages: [
    createPurchasedPackage({
      userId: "user-a1-starter",
      productSlug: "a1-starter",
      level: "A1",
      tier: "STARTER",
      purchasedAt: "2026-04-03T09:30:00.000Z",
    }),
  ],
  entitlements: createLevelPackageEntitlements({
    userId: "user-a1-starter",
    productSlug: "a1-starter",
    level: "A1",
    features: [
      { feature: "level_access" },
      { feature: "exam_access", value: 1 },
      { feature: "basic_results" },
    ],
  }),
  progress: [
    {
      level: "A1",
      completionPercent: 20,
      examsCompleted: 1,
      averageScorePercent: 58,
      weakAreas: ["Hören", "Lesen"],
      recommendedNextStep: "UPGRADE_PACKAGE",
    },
    {
      level: "A2",
      completionPercent: 0,
      examsCompleted: 0,
      averageScorePercent: 0,
      weakAreas: [],
      recommendedNextStep: null,
    },
    {
      level: "B1",
      completionPercent: 0,
      examsCompleted: 0,
      averageScorePercent: 0,
      weakAreas: [],
      recommendedNextStep: null,
    },
  ],
};

const userFullBundle: MockUserSeed = {
  userId: "user-full-bundle",
  packages: [
    createPurchasedPackage({
      userId: "user-full-bundle",
      productSlug: "full-bundle",
      level: null,
      tier: null,
      purchasedAt: "2026-04-02T08:00:00.000Z",
    }),
  ],
  entitlements: [
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "level_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "exam_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: 5,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "basic_results",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "pdf_materials",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "study_plan",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "video_course",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A1",
      feature: "smart_guidance",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },

    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "level_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "exam_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: 5,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "basic_results",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "pdf_materials",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "study_plan",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "video_course",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "A2",
      feature: "smart_guidance",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },

    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "level_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "exam_access",
      active: true,
      sourceProductSlug: "full-bundle",
      value: 5,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "basic_results",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "pdf_materials",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "study_plan",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "video_course",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
    {
      userId: "user-full-bundle",
      level: "B1",
      feature: "smart_guidance",
      active: true,
      sourceProductSlug: "full-bundle",
      value: null,
    },
  ],
  progress: [
    {
      level: "A1",
      completionPercent: 100,
      examsCompleted: 5,
      averageScorePercent: 84,
      weakAreas: [],
      recommendedNextStep: "UNLOCK_NEXT_LEVEL",
    },
    {
      level: "A2",
      completionPercent: 52,
      examsCompleted: 2,
      averageScorePercent: 71,
      weakAreas: ["Schreiben"],
      recommendedNextStep: "KEEP_PRACTICING",
    },
    {
      level: "B1",
      completionPercent: 10,
      examsCompleted: 0,
      averageScorePercent: 0,
      weakAreas: [],
      recommendedNextStep: "KEEP_PRACTICING",
    },
  ],
};

export const MOCK_USER_SEEDS: MockUserSeed[] = [
  userA1Master,
  userA1Starter,
  userFullBundle,
];

export function getMockUserSeed(userId: string): MockUserSeed | undefined {
  return MOCK_USER_SEEDS.find((item) => item.userId === userId);
}

export function getMockUserPackages(userId: string): UserPackage[] {
  return getMockUserSeed(userId)?.packages ?? [];
}

export function getMockUserEntitlements(userId: string): UserEntitlement[] {
  return getMockUserSeed(userId)?.entitlements ?? [];
}

export function getMockUserProgress(userId: string): UserLevelProgress[] {
  return getMockUserSeed(userId)?.progress ?? [];
}