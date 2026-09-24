// ── PayTR ödemesi alınan ürünlerin TEK ve GERÇEK fiyat kaynağı ──────────────
// Kullanıcıdan gelen hiçbir tutara güvenilmez; her ödeme isteğinde tutar
// burada tanımlı slug'a göre SUNUCU tarafında hesaplanır.
//
// amountKurus: TL * 100 (PayTR kuruş cinsinden tutar bekliyor)

export type PricedProduct = {
  slug: string;
  label: string;
  amountKurus: number; // 0 = ücretsiz, ödeme akışına hiç girmez
};

const TL = (lira: number) => Math.round(lira * 100);

export const PRICING_CATALOG: Record<string, PricedProduct> = {
  // ── Dijital paketler ──────────────────────────────────────────────
  "a1-starter": { slug: "a1-starter", label: "A1 Başlangıç (Dijital)", amountKurus: 0 },
  "a2-starter": { slug: "a2-starter", label: "A2 Başlangıç (Dijital)", amountKurus: 0 },
  "b1-starter": { slug: "b1-starter", label: "B1 Başlangıç (Dijital)", amountKurus: 0 },

  "a1-practice": { slug: "a1-practice", label: "A1 Gelişim (Dijital)", amountKurus: TL(1890) },
  "a2-practice": { slug: "a2-practice", label: "A2 Gelişim (Dijital)", amountKurus: TL(1890) },
  "b1-practice": { slug: "b1-practice", label: "B1 Gelişim (Dijital)", amountKurus: TL(1890) },

  "a1-master": { slug: "a1-master", label: "A1 Zirve (Dijital)", amountKurus: TL(2490) },
  "a2-master": { slug: "a2-master", label: "A2 Zirve (Dijital)", amountKurus: TL(2490) },
  "b1-master": { slug: "b1-master", label: "B1 Zirve (Dijital)", amountKurus: TL(2490) },

  // ── Canlı kurs ────────────────────────────────────────────────────
  "live-a1": { slug: "live-a1", label: "A1 Canlı Kurs", amountKurus: TL(9900) },
  "live-a2": { slug: "live-a2", label: "A2 Canlı Kurs", amountKurus: TL(9900) },
  "live-b1": { slug: "live-b1", label: "B1 Canlı Kurs", amountKurus: TL(9900) },
  "live-a1-a2": { slug: "live-a1-a2", label: "A1 + A2 Canlı Kurs (Hızlandırılmış)", amountKurus: TL(14900) },
  "live-a2-b1": { slug: "live-a2-b1", label: "A2 + B1 Canlı Kurs (Hızlandırılmış)", amountKurus: TL(14900) },
  "live-a1-a2-b1": { slug: "live-a1-a2-b1", label: "A1 + A2 + B1 Canlı Kurs (Tam Hazırlık)", amountKurus: TL(22500) },

  // ── Konuşma Kulübü ────────────────────────────────────────────────
  "konusma-a1": { slug: "konusma-a1", label: "A1 Konuşma Kulübü", amountKurus: TL(5000) },
  "konusma-a2": { slug: "konusma-a2", label: "A2 Konuşma Kulübü", amountKurus: TL(5000) },
  "konusma-b1": { slug: "konusma-b1", label: "B1 Konuşma Kulübü", amountKurus: TL(5000) },
  "konusma-a1-a2": { slug: "konusma-a1-a2", label: "A1 + A2 Konuşma Kulübü", amountKurus: TL(9000) },
  "konusma-a2-b1": { slug: "konusma-a2-b1", label: "A2 + B1 Konuşma Kulübü", amountKurus: TL(9000) },
  "konusma-a1-a2-b1": { slug: "konusma-a1-a2-b1", label: "A1 + A2 + B1 Konuşma Kulübü", amountKurus: TL(12000) },

  // ── Özel test ürünü (herhangi bir yerde listelenmez/linklenmez) ────
  // Sadece PayTR canlı ödeme akışını gerçek küçük bir tutarla doğrulamak için.
  "ozel-test-100": { slug: "ozel-test-100", label: "Test Ödemesi", amountKurus: TL(100) },
};

export function getPricedProduct(slug: string): PricedProduct | null {
  return PRICING_CATALOG[slug] || null;
}

export function isFreeProduct(slug: string): boolean {
  const product = getPricedProduct(slug);
  return !!product && product.amountKurus === 0;
}