import { useSyncExternalStore } from "react";

type OrderDetailsState = {
  open: boolean;
  orderId: string | number | null;
};

let state: OrderDetailsState = {
  open: false,
  orderId: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function openOrderDetails(orderId: string | number) {
  state = { open: true, orderId };
  emit();
}

export function closeOrderDetails() {
  state = { open: false, orderId: null };
  emit();
}

export function useOrderDetailsState() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}
