export type LevelSlug = "a1" | "a2" | "b1";
export type PackageTier = "starter" | "practice" | "master";

export type PackageSlug =
  | "a1-starter"
  | "a1-practice"
  | "a1-master"
  | "a2-starter"
  | "a2-practice"
  | "a2-master"
  | "b1-starter"
  | "b1-practice"
  | "b1-master";

export type ProductPackage = {
  slug: PackageSlug;
  level: LevelSlug;
  tier: PackageTier;
  title: string;
  price: number;
  currency: "TRY";
  features: string[];
  shopierUrl?: string;
};

export const PRODUCT_CATALOG: Record<PackageSlug, ProductPackage> = {
  "a1-starter": {
  slug: "a1-starter",
  level: "a1",
  tier: "starter",
  title: "TELC A1 Starter",
  price: 299,
  currency: "TRY",
  features: ["1 sınav", "Basic sonuç"],
  shopierUrl: "https://www.shopier.com/s/shipping/almanca_okulum",
},
  "a1-practice": {
    slug: "a1-practice",
    level: "a1",
    tier: "practice",
    title: "TELC A1 Practice",
    price: 599,
    currency: "TRY",
    features: ["3 sınav", "PDF", "Plan"],
    shopierUrl: "/dashboard",
  },
  "a1-master": {
    slug: "a1-master",
    level: "a1",
    tier: "master",
    title: "TELC A1 Master",
    price: 999,
    currency: "TRY",
    features: ["Tüm içerik", "Video kurs", "Akıllı yönlendirme"],
    shopierUrl: "",
  },

  "a2-starter": {
    slug: "a2-starter",
    level: "a2",
    tier: "starter",
    title: "TELC A2 Starter",
    price: 349,
    currency: "TRY",
    features: ["1 sınav", "Basic sonuç"],
    shopierUrl: "",
  },
  "a2-practice": {
    slug: "a2-practice",
    level: "a2",
    tier: "practice",
    title: "TELC A2 Practice",
    price: 649,
    currency: "TRY",
    features: ["3 sınav", "PDF", "Plan"],
    shopierUrl: "",
  },
  "a2-master": {
    slug: "a2-master",
    level: "a2",
    tier: "master",
    title: "TELC A2 Master",
    price: 1099,
    currency: "TRY",
    features: ["Tüm içerik", "Video kurs", "Akıllı yönlendirme"],
    shopierUrl: "",
  },

  "b1-starter": {
    slug: "b1-starter",
    level: "b1",
    tier: "starter",
    title: "TELC B1 Starter",
    price: 399,
    currency: "TRY",
    features: ["1 sınav", "Basic sonuç"],
    shopierUrl: "",
  },
  "b1-practice": {
    slug: "b1-practice",
    level: "b1",
    tier: "practice",
    title: "TELC B1 Practice",
    price: 699,
    currency: "TRY",
    features: ["3 sınav", "PDF", "Plan"],
    shopierUrl: "",
  },
  "b1-master": {
    slug: "b1-master",
    level: "b1",
    tier: "master",
    title: "TELC B1 Master",
    price: 1199,
    currency: "TRY",
    features: ["Tüm içerik", "Video kurs", "Akıllı yönlendirme"],
    shopierUrl: "",
  },
};

export function getProductBySlug(slug: string) {
  return PRODUCT_CATALOG[slug as PackageSlug] ?? null;
}