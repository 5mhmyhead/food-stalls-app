import { adjustStockMany } from "@/catalogStore";
import { setCurrency } from "@/currency";
import { closeManage } from "@/manageStore";
import { useSyncExternalStore } from "react";

export type SettingsScreen = null | "account" | "security" | "preferences";
export type Role = "employee" | "admin";

export const CURRENCIES = [
  { code: "PHP", label: "Philippine Peso (₱)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
];

type State = {
  screen: SettingsScreen;
  role: Role;
  username: string;
  email: string;
  password: string | null;
  accessCode: string;
  currency: string;
  threshold: number;
};

const initial: State = {
  screen: null,
  role: "admin",
  username: "Dave",
  email: "",
  password: null,
  accessCode: "admin123",
  currency: "PHP",
  threshold: 10,
};

let state: State = initial;
const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

export function openSettings(screen: Exclude<SettingsScreen, null>) {
  set({ ...state, screen });
}

export function closeSettings() {
  set({ ...state, screen: null });
}

export function updateProfile(username: string, email: string): string | null {
  const name = username.trim();
  const mail = email.trim();
  if (!name) return "Username can't be empty.";
  if (mail && !/^\S+@\S+\.\S+$/.test(mail))
    return "Enter a valid email address.";
  set({ ...state, username: name, email: mail });
  return null;
}

export function upgradeWithCode(code: string): boolean {
  if (code.trim() !== state.accessCode) return false;
  set({ ...state, role: "admin" });
  return true;
}

export function changePassword(current: string, next: string): string | null {
  if (!current) return "Enter your current password.";
  if (state.password !== null && current !== state.password) {
    return "Current password is incorrect.";
  }
  if (next.length < 8 || !/[A-Z]/.test(next) || !/[0-9]/.test(next)) {
    return "New password needs 8 characters, a capital letter and a number.";
  }
  set({ ...state, password: next });
  return null;
}

export function setAccessCode(code: string): string | null {
  const value = code.trim();
  if (value.length < 4) return "Access code needs at least 4 characters.";
  set({ ...state, accessCode: value });
  return null;
}

export function deleteAccount() {
  set({
    ...state,
    screen: null,
    role: "employee",
    username: initial.username,
    email: "",
    password: null,
  });
}

export function saveCurrency(code: string) {
  const found = CURRENCIES.find((c) => c.code === code);
  if (!found) return;
  setCurrency(found.code);
  set({ ...state, currency: found.code });
  adjustStockMany([]);
  closeManage();
}

export function saveThreshold(value: number): string | null {
  if (!Number.isInteger(value) || value < 0)
    return "Enter a whole number, 0 or higher.";
  set({ ...state, threshold: value });
  return null;
}

export function useSettings() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
