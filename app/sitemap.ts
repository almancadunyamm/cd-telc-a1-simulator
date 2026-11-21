import type { MetadataRoute } from "next";
import { EXAMS_BY_LEVEL, teilSlug, type Level } from "@/components/exam-prep/exams-config";
import { SITE_URL } from "@/components/exam-prep/PublicShell";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    { path: "", priority: 1 },
    { path: "/sinav-hazirlik", priority: 0.9 },
    { path: "/digital-simulation", priority: 0.8 },
    { path: "/almanca-seviye-tespit-sinavi", priority: 0.8 },
    { path: "/konusma-kulubu", priority: 0.6 },
    { path: "/kaynaklar", priority: 0.5 },
    { path: "/almanca-okulum", priority: 0.5 },
    { path: "/hakkimizda", priority: 0.4 },
    { path: "/basari-hikayeleri", priority: 0.4 },
    { path: "/iletisim", priority: 0.4 },
  ].map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, priority: p.priority }));

  const examPages: MetadataRoute.Sitemap = [];
  for (const level of ["A2", "B1"] as Level[]) {
    for (const exam of EXAMS_BY_LEVEL[level].filter((e) => e.ready)) {
      const base = `${SITE_URL}/sinav-hazirlik/${level.toLowerCase()}/${exam.key}`;
      examPages.push({ url: base, lastModified: now, priority: 0.8 });
      for (const t of exam.teile) examPages.push({ url: `${base}/${teilSlug(t)}`, lastModified: now, priority: 0.7 });
    }
  }
  return [...staticPages, ...examPages];
}
