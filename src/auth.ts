import { useSyncExternalStore } from "react";

let loggedIn = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const session = {
  signIn() {
    loggedIn = true;
    emit();
  },
  signOut() {
    loggedIn = false;
    emit();
  },
};

export function useLoggedIn() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => loggedIn,
    () => false,
  );
}
