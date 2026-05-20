export type OrderStatus =
  | "pending_payment"
  | "paid_waiting_activation"
  | "active"
  | "cancelled";

export type BillingLevel = "A1" | "A2" | "B1";

export type PackageType = "starter" | "practice" | "master";

export type BillingOrder = {
  id: string;
  username: string;
  productSlug: string;
  level: BillingLevel;
  packageType: PackageType;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  
  accessEndDate?: string | null;
contentType?: "liveClass" | "digitalPackage";
};

const ORDERS_KEY = "billing_orders";

function getPackageTypeFromSlug(slug: string): PackageType {
  const normalizedSlug = slug.toLowerCase();

  if (normalizedSlug.includes("master")) return "master";
  if (normalizedSlug.includes("practice")) return "practice";

  return "starter";
}

export function getBillingOrders(): BillingOrder[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];

  try {
    const orders = JSON.parse(raw) as BillingOrder[];

    return orders.map((order) => ({
      ...order,
      packageType: order.packageType || getPackageTypeFromSlug(order.productSlug),
    }));
  } catch {
    return [];
  }
}

export function saveBillingOrders(orders: BillingOrder[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createPendingOrder(params: {
  username: string;
  productSlug: string;
  level: BillingLevel;
}) {
  const now = new Date().toISOString();

  const order: BillingOrder = {
    id: crypto.randomUUID(),
    username: params.username,
    productSlug: params.productSlug,
    level: params.level,
    packageType: getPackageTypeFromSlug(params.productSlug),
    status: "pending_payment",
    createdAt: now,
    updatedAt: now,
  };

  const orders = getBillingOrders();
  saveBillingOrders([order, ...orders]);

  return order;
}

export function markOrderPaidWaitingActivation(orderId: string) {
  const orders = getBillingOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "paid_waiting_activation" as OrderStatus,
          updatedAt: new Date().toISOString(),
        }
      : order
  );

  saveBillingOrders(updatedOrders);
}

export function activateBillingOrder(orderId: string) {
  const orders = getBillingOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "active" as OrderStatus,
          updatedAt: new Date().toISOString(),
        }
      : order
  );

  saveBillingOrders(updatedOrders);
}

export function cancelBillingOrder(orderId: string) {
  const orders = getBillingOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          status: "cancelled" as OrderStatus,
          updatedAt: new Date().toISOString(),
        }
      : order
  );

  saveBillingOrders(updatedOrders);
}

export function hasPendingOrderForLevel(params: {
  username: string;
  level: BillingLevel;
}) {
  const orders = getBillingOrders();

  return orders.some(
    (order) =>
      order.username === params.username &&
      order.level === params.level &&
      order.status !== "active" &&
      order.status !== "cancelled"
  );
}

export function getActiveOrdersForUser(username: string) {
  const orders = getBillingOrders();

  return orders.filter(
    (order) => order.username === username && order.status === "active"
  );
}

export function getActiveOrderForUserAndLevel(params: {
  username: string;
  level: BillingLevel;
}) {
  const orders = getBillingOrders();

  return orders.find(
    (order) =>
      order.username === params.username &&
      order.level === params.level &&
      order.status === "active"
  );
}

export function getOrders() {
  return getBillingOrders();
}

export function getPendingOrders() {
  const orders = getBillingOrders();

  return orders.filter(
    (order) =>
      order.status === "pending_payment" ||
      order.status === "paid_waiting_activation"
  );
}