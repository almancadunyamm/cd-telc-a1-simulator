import CheckoutInfoBox from "./checkout-info-box";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../lib/catalog/product-catalog";
import MockCheckoutButton from "./mock-checkout-button";

type CheckoutPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/packages/${slug}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-black"
        >
          ← Paket sayfasına dön
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600">Test Checkout</p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Satın Alma Özeti
            </h1>

            <p className="mt-2 text-gray-600">
              Bu aşamada gerçek ödeme yok. Sipariş oluşturulacak ve admin onayı
              bekleyecek.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.title}
            </h2>

            <p className="mt-2 text-gray-600">{product.description}</p>

            <div className="mt-4 text-2xl font-bold text-gray-900">
              {product.price.amount} {product.price.currency}
            </div>

            {product.price.compareAtAmount ? (
              <p className="mt-1 text-sm text-gray-500 line-through">
                {product.price.compareAtAmount} {product.price.currency}
              </p>
            ) : null}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-4">
            <p className="text-sm text-gray-700">Bu adımda yapılacak işlem:</p>
            <p className="mt-2 text-sm text-gray-600">
              Butona basıldığında bu kullanıcı adına sipariş oluşturulur.
              Admin aktif edince ilgili sınıf erişimi açılır.
            </p>
          </div>

          <MockCheckoutButton slug={slug} />

          <div className="mt-6">
            <CheckoutInfoBox />
          </div>
        </div>
      </div>
    </main>
  );
}