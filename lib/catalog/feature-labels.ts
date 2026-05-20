import type { FeatureKey } from "../../types/product";

const FEATURE_LABELS: Record<FeatureKey, string> = {
  level_access: "Seviye erişimi",
  exam_access: "Deneme sınavı erişimi",
  basic_results: "Temel sonuç ekranı",
  pdf_materials: "PDF çalışma materyalleri",
  study_plan: "Çalışma planı",
  video_course: "Offline video kurs",
  smart_guidance: "Akıllı yönlendirme",
};

export function getFeatureLabel(featureKey: FeatureKey): string {
  return FEATURE_LABELS[featureKey] ?? featureKey;
}