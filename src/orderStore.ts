import { getProducts } from "@/catalogStore";
import { Product } from "@/data/products";
import { UiOrderStatus } from "@/lib/dbSync";
import { addOrder, makeOrderId } from "@/manageStore";
import { useSyncExternalStore } from "react";

type State = {
  selectedId: string | null;
  qty: Record<string, number>;
  submitting: boolean;
};

export type CartLine = {
  id: string;
  name: string;
  category: string;
  qty: number;
  price: number;
  old: number;
  color: string;
};

let state: State = { selectedId: null, qty: {}, submitting: false };
const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

export function selectProduct(id: string) {
  set({ ...state, selectedId: id });
}

export function closeProduct() {
  set({ ...state, selectedId: null });
}

export function setQty(id: string, n: number) {
  const product = getProducts().find((p) => p.id === id);
  const max = product ? product.stock : 0;
  const next = Math.min(Math.max(0, n), max);
  const qty = { ...state.qty };
  if (next === 0) delete qty[id];
  else qty[id] = next;
  set({ ...state, qty });
}

export function changeQty(id: string, delta: number) {
  setQty(id, (state.qty[id] ?? 0) + delta);
}

export function clearCart() {
  set({ ...state, qty: {} });
}

export function buildCart(
  qty: Record<string, number>,
  products: Product[],
): CartLine[] {
  return products
    .filter((p) => (qty[p.id] ?? 0) > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      qty: qty[p.id],
      price: p.price,
      old: p.old,
      color: p.color,
    }));
}

export async function submitOrder(params?: {
  employeeId?: string | null;
  customerId?: string | null;
  mode?: string;
  status?: UiOrderStatus;
}) {
  const products = getProducts();
  const cart = buildCart(state.qty, products);
  if (cart.length === 0 || state.submitting) return null;

  set({ ...state, submitting: true });

  const id = makeOrderId();
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  await addOrder({
    id,
    total,
    mode: params?.mode ?? "Dine In",
    color: cart[0]?.color ?? "#F4A3B3",
    items: cart.map((line) => ({
      id: line.id,
      name: line.name,
      qty: line.qty,
      price: line.price,
    })),
    employeeId: params?.employeeId ?? null,
    customerId: params?.customerId ?? null,
  });

  set({ ...state, qty: {}, selectedId: null, submitting: false });
  return { id };
}

export function useOrderState() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
