import { getProducts } from "@/catalogStore";
import { Product } from "@/data/products";
import { useSyncExternalStore } from "react";

type State = {
  selectedId: string | null;
  qty: Record<string, number>;
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

let state: State = { selectedId: null, qty: {} };
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
