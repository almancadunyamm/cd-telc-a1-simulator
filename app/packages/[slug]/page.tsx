import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getFeatureLabel } from "../../../lib/catalog/feature-labels";
import {
  getPackageTierLabel,
  getProductTypeLabel,
} from "../../../lib/catalog/package-labels";
import { getProductBySlug } from "../../../lib/catalog/product-catalog";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getPurchasedSlugsFromCookie(
  rawCookieValue: string | undefined
): string[] {
  if (!rawCookieValue) {
    return [];
  }

  try {
    const decoded = decodeURIComponent(rawCookieValue);
    const parsed = JSON.parse(decoded) as Record<string, boolean>;

    return Object.keys(parsed).filter((key) => parsed[key]);
  } catch {
    return [];
  }
}

export default async function PackageDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const cookieStore = await cookies();
  const rawPurchasesCookie = cookieStore.get("mock_purchases")?.value;
  const purchasedSlugs = getPurchasedSlugsFromCookie(rawPurchasesCookie);
  const isAlreadyPurchased = purchasedSlugs.includes(product.slug);

  return (
    <main className="min-h-screen bg-slate-200 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Dashboard’a Dön
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>

          {product.badge ? (
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-slate-600">{product.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Ürün Kodu</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {getPackageTierLabel(product.tier)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Seviye</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {product.level ?? "Tüm seviyeler"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Paket Tipi</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {getPackageTierLabel(product.tier)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
            <p className="text-sm text-slate-500">Ürün Türü</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {getProductTypeLabel(product.productType)}
            </p>

            <div className="mt-4">
              <p className="text-sm text-slate-500">Fiyat</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {product.price.amount} {product.price.currency}
              </p>
              {product.price.compareAtAmount ? (
                <p className="mt-1 text-sm text-slate-500 line-through">
                  {product.price.compareAtAmount} {product.price.currency}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-900">İçerikler</h2>

          <div className="mt-4 space-y-3">
            {product.features.map((feature) => (
              <div
                key={feature.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {getFeatureLabel(feature.key)}
                  </p>

                  {feature.value !== undefined && feature.value !== null ? (
                    <p className="mt-1 text-sm text-slate-600">
                      Değer:{" "}
                      {Array.isArray(feature.value)
                        ? feature.value.join(", ")
                        : String(feature.value)}
                    </p>
                  ) : null}
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    feature.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {feature.enabled ? "Açık" : "Kapalı"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {isAlreadyPurchased ? (
            <button
              type="button"
              disabled
              className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white opacity-80"
            >
              Zaten Satın Alındı
            </button>
          ) : (
            <Link
              href={`/checkout/${resolvedParams.slug}`}
              className="inline-flex rounded-xl bg-[#173b8f] px-5 py-3 font-semibold text-white hover:bg-[#122f71]"
            >
              Satın Al
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}