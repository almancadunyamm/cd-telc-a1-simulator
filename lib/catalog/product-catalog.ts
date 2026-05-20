import type { Product } from "@/types/product";

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "prod_a1_starter",
    slug: "a1-starter",
    title: "A1 Starter",
    description: "1 dijital deneme sınavı ve temel sonuç ekranı.",
    level: "A1",
    tier: "STARTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Başlangıç",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 1 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: false },
      { key: "study_plan", enabled: false },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 990,
      compareAtAmount: null,
      active: true,
    },
  },
  {
    id: "prod_a1_practice",
    slug: "a1-practice",
    title: "A1 Practice",
    description:
      "3 dijital deneme sınavı, PDF çalışma materyalleri ve 15 günlük çalışma planı.",
    level: "A1",
    tier: "PRACTICE",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "En Çok Tercih Edilen",
    shopierUrl: "/dashboard",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 3 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 2490,
      compareAtAmount: 2990,
      active: true,
    },
  },
  {
    id: "prod_a1_master",
    slug: "a1-master",
    title: "A1 Master",
    description:
      "3-5 dijital deneme sınavı, tüm A1 PDF materyalleri, offline video kurs, çalışma planı ve akıllı yönlendirme.",
    level: "A1",
    tier: "MASTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Tam Paket",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 5 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: true },
      { key: "smart_guidance", enabled: true },
    ],
    price: {
      currency: "TRY",
      amount: 3990,
      compareAtAmount: 4990,
      active: true,
    },
  },
  {
    id: "prod_a2_starter",
    slug: "a2-starter",
    title: "A2 Starter",
    description: "1 dijital deneme sınavı ve temel sonuç ekranı.",
    level: "A2",
    tier: "STARTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Sonraki Seviye",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 1 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: false },
      { key: "study_plan", enabled: false },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 1490,
      compareAtAmount: null,
      active: true,
    },
  },
  {
    id: "prod_a2_practice",
    slug: "a2-practice",
    title: "A2 Practice",
    description:
      "3 dijital deneme sınavı, PDF çalışma materyalleri ve 15 günlük çalışma planı.",
    level: "A2",
    tier: "PRACTICE",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Gelişim Paketi",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 3 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 2990,
      compareAtAmount: 3490,
      active: true,
    },
  },
  {
    id: "prod_a2_master",
    slug: "a2-master",
    title: "A2 Master",
    description:
      "3-5 dijital deneme sınavı, tüm A2 PDF materyalleri, offline video kurs, çalışma planı ve akıllı yönlendirme.",
    level: "A2",
    tier: "MASTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Tam Paket",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 5 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: true },
      { key: "smart_guidance", enabled: true },
    ],
    price: {
      currency: "TRY",
      amount: 4490,
      compareAtAmount: 5490,
      active: true,
    },
  },
  {
    id: "prod_b1_starter",
    slug: "b1-starter",
    title: "B1 Starter",
    description: "1 dijital deneme sınavı ve temel sonuç ekranı.",
    level: "B1",
    tier: "STARTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "İleri Seviye Başlangıç",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 1 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: false },
      { key: "study_plan", enabled: false },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 1990,
      compareAtAmount: null,
      active: true,
    },
  },
  {
    id: "prod_b1_practice",
    slug: "b1-practice",
    title: "B1 Practice",
    description:
      "3 dijital deneme sınavı, PDF çalışma materyalleri ve 15 günlük çalışma planı.",
    level: "B1",
    tier: "PRACTICE",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Gelişim Paketi",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 3 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: false },
      { key: "smart_guidance", enabled: false },
    ],
    price: {
      currency: "TRY",
      amount: 3490,
      compareAtAmount: 3990,
      active: true,
    },
  },
  {
    id: "prod_b1_master",
    slug: "b1-master",
    title: "B1 Master",
    description:
      "3-5 dijital deneme sınavı, tüm B1 PDF materyalleri, offline video kurs, çalışma planı ve akıllı yönlendirme.",
    level: "B1",
    tier: "MASTER",
    productType: "LEVEL_PACKAGE",
    active: true,
    badge: "Tam Paket",
    features: [
      { key: "level_access", enabled: true },
      { key: "exam_access", enabled: true, value: 5 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: true },
      { key: "smart_guidance", enabled: true },
    ],
    price: {
      currency: "TRY",
      amount: 5490,
      compareAtAmount: 6490,
      active: true,
    },
  },
  {
    id: "prod_full_bundle",
    slug: "full-bundle",
    title: "Tüm Seviyeler Paketi",
    description:
      "A1, A2 ve B1 seviyelerinin tamamını indirimli olarak açan özel paket.",
    level: null,
    tier: null,
    productType: "FULL_BUNDLE",
    active: true,
    badge: "En Yüksek İndirim",
    features: [
      { key: "level_access", enabled: true, value: ["A1", "A2", "B1"] },
      { key: "exam_access", enabled: true, value: 15 },
      { key: "basic_results", enabled: true },
      { key: "pdf_materials", enabled: true },
      { key: "study_plan", enabled: true },
      { key: "video_course", enabled: true },
      { key: "smart_guidance", enabled: true },
    ],
    price: {
      currency: "TRY",
      amount: 9990,
      compareAtAmount: 12990,
      active: true,
    },
  },
];

export function getAllProducts(): Product[] {
  return PRODUCT_CATALOG;
}

export function getActiveProducts(): Product[] {
  return PRODUCT_CATALOG.filter((product) => product.active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}

export function getProductsByLevel(level: "A1" | "A2" | "B1"): Product[] {
  return PRODUCT_CATALOG.filter(
    (product) => product.level === level && product.active
  );
}

export function getPackageProductsByLevel(
  level: "A1" | "A2" | "B1"
): Product[] {
  return PRODUCT_CATALOG.filter(
    (product) =>
      product.level === level &&
      product.productType === "LEVEL_PACKAGE" &&
      product.active
  );
}

export function getBundleProducts(): Product[] {
  return PRODUCT_CATALOG.filter(
    (product) => product.productType === "FULL_BUNDLE" && product.active
  );
}