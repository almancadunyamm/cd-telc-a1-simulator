export type ShopierLinkMap = Record<string, string>;

const STORAGE_KEY = "shopier_links";

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
  "live-full": "https://www.shopier.com/almanca_okulum/45617654",
};

export function getShopierLinks(): ShopierLinkMap {
  if (typeof window === "undefined") return DEFAULT_SHOPIER_LINKS;

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return DEFAULT_SHOPIER_LINKS;

  try {
    return {
      ...DEFAULT_SHOPIER_LINKS,
      ...(JSON.parse(raw) as ShopierLinkMap),
    };
  } catch {
    return DEFAULT_SHOPIER_LINKS;
  }
}

export function saveShopierLinks(links: ShopierLinkMap) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function getShopierLink(slug: string): string | null {
  const links = getShopierLinks();

  return links[slug] || null;
}