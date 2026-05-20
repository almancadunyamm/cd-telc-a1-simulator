import type { PackageTier, ProductType } from "../../types/product";

const PACKAGE_TIER_LABELS: Record<PackageTier, string> = {
  STARTER: "Starter",
  PRACTICE: "Practice",
  MASTER: "Master",
};

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  LEVEL_PACKAGE: "Seviye Paketi",
  LEVEL_UPSELL: "Seviye Açma Paketi",
  FULL_BUNDLE: "Tüm Seviyeler Paketi",
};

export function getPackageTierLabel(tier: PackageTier | null): string {
  if (!tier) {
    return "Bundle";
  }

  return PACKAGE_TIER_LABELS[tier] ?? tier;
}

export function getProductTypeLabel(productType: ProductType): string {
  return PRODUCT_TYPE_LABELS[productType] ?? productType;
}