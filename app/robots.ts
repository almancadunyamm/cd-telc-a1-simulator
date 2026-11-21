import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/exam-prep/PublicShell";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/teacher", "/api/", "/payment", "/pay", "/checkout", "/odeme", "/ozel-test-odeme-r7k2", "/zz-"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
