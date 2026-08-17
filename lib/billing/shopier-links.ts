import { supabase } from "@/lib/supabase";

export type ShopierLinkMap = Record<string, string>;

const DEFAULT_SHOPIER_LINKS: ShopierLinkMap = {
  "a1-starter": "https://www.shopier.com/almanca_okulum/46634818",
  "a1-practice": "https://www.shopier.com/almanca_okulum/46634959",
  "a1-master": "https://www.shopier.com/almanca_okulum/46635118",

  "a2-starter": "https://www.shopier.com/almanca_okulum/46636342",
  "a2-practice": "https://www.shopier.com/almanca_okulum/46636525",
  "a2-master": "https://www.shopier.com/almanca_okulum/46636601",

  "b1-starter": "https://www.shopier.com/almanca_okulum/46636699",
  "b1-practice": "https://www.shopier.com/almanca_okulum/46638147",
  "b1-master": "https://www.shopier.com/almanca_okulum/46638179",

  "live-a1": "https://www.shopier.com/almanca_okulum/45617141",
  "live-a2": "https://www.shopier.com/almanca_okulum/45617228",
  "live-b1": "https://www.shopier.com/almanca_okulum/45617308",
  "live-a1-a2": "https://www.shopier.com/almanca_okulum/45617507",
  "live-a2-b1": "https://www.shopier.com/almanca_okulum/45617507",
  "live-a1-a2-b1": "https://www.shopier.com/almanca_okulum/45617654",
};

let cachedLinks: ShopierLinkMap = { ...DEFAULT_SHOPIER_LINKS };

// Supabase'den taze veriyi çekip önbelleği günceller
export async function refreshShopierLinks(): Promise<ShopierLinkMap> {
  const { data, error } = await supabase
    .from("shopier_links")
    .select("slug, url");

  if (error || !data) {
    console.error("Shopier linkleri alınamadı:", error);
    return cachedLinks;
  }

  const dbLinks: ShopierLinkMap = {};
  for (const row of data) {
    dbLinks[row.slug] = row.url;
  }

  cachedLinks = { ...DEFAULT_SHOPIER_LINKS, ...dbLinks };
  return cachedLinks;
}

// Admin panel için: async, her zaman taze veri döner
export async function getShopierLinks(): Promise<ShopierLinkMap> {
  return refreshShopierLinks();
}

export async function saveShopierLinks(links: ShopierLinkMap): Promise<boolean> {
  const rows = Object.entries(links)
    .filter(([, url]) => url && url.trim() !== "")
    .map(([slug, url]) => ({ slug, url: url.trim() }));

  const { error } = await supabase
    .from("shopier_links")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Shopier linkleri kaydedilemedi:", error);
    return false;
  }

  await refreshShopierLinks();
  return true;
}

// Dashboard gibi senkron kullanım gereken yerler için: önbellekten okur
export function getShopierLink(slug: string): string | null {
  return cachedLinks[slug] || null;
}