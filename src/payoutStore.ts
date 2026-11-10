import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function openPayout() {
  open = true;
  emit();
}

export function closePayout() {
  open = false;
  emit();
}

export function usePayoutOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
