export type ShopierLinkMap = Record<string, string>;

const STORAGE_KEY = "shopier_links";

export function getShopierLinks(): ShopierLinkMap {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return {};

  try {
    return JSON.parse(raw) as ShopierLinkMap;
  } catch {
    return {};
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