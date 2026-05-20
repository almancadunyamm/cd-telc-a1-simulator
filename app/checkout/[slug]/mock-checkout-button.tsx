"use client";

import { useRouter } from "next/navigation";
import {
  createPendingOrder,
  markOrderPaidWaitingActivation,
} from "@/lib/billing/orders";

type MockCheckoutButtonProps = {
  slug: string;
};

function getLevelFromSlug(slug: string): "A1" | "A2" | "B1" {
  const normalizedSlug = slug.toLowerCase();

  if (normalizedSlug.startsWith("a1-")) return "A1";
  if (normalizedSlug.startsWith("a2-")) return "A2";
  return "B1";
}

export default function MockCheckoutButton({ slug }: MockCheckoutButtonProps) {
  const router = useRouter();

  function handleCheckout() {
    const rawUser = localStorage.getItem("mock_logged_user");

    if (!rawUser) {
      alert("Satın alma için önce giriş yapmalısınız.");
      router.push("/login");
      return;
    }

    const user = JSON.parse(rawUser) as {
      username: string;
      role: string;
      label: string;
    };

    const order = createPendingOrder({
  username: user.username,
  productSlug: slug,
  level: getLevelFromSlug(slug),
});

markOrderPaidWaitingActivation(order.id);

    alert("Sipariş oluşturuldu. Admin onayı bekleniyor.");

    router.push("/dashboard");
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
    >
      Shopier ile Öde
    </button>
  );
}