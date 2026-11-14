import { adjustStockMany } from "@/catalogStore";
import { useSyncExternalStore } from "react";

export type OrderStatus = "Pending" | "Complete" | "Cancelled";

export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

export type ManagedOrder = {
  id: string;
  price: number;
  date: string;
  status: OrderStatus;
  color: string;
  mode?: string;
  items?: OrderItem[];
};

export type NoticeScope = "auth" | "app";

export type Notice = { text: string; id: number; scope: NoticeScope };

type State = {
  open: boolean;
  orders: ManagedOrder[];
  notice: Notice | null;
};

let state: State = {
  open: false,
  orders: [],
  notice: null,
};

const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

export function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function makeOrderId() {
  let id = "";
  do {
    id = String(Math.floor(10000 + Math.random() * 89999));
  } while (state.orders.some((o) => o.id === id));
  return id;
}

export function openManage() {
  set({ ...state, open: true });
}

export function closeManage() {
  set({ ...state, open: false });
}

export function showNotice(text: string, scope: NoticeScope = "app") {
  set({ ...state, notice: { text, id: Date.now(), scope } });
}

export function clearNotice() {
  set({ ...state, notice: null });
}

export function addOrder(input: {
  id: string;
  total: number;
  mode: string;
  color: string;
  items: OrderItem[];
}) {
  adjustStockMany(input.items.map((i) => ({ id: i.id, delta: -i.qty })));
  const order: ManagedOrder = {
    id: input.id,
    price: input.total,
    date: todayLabel(),
    status: "Pending",
    color: input.color,
    mode: input.mode,
    items: input.items,
  };
  set({
    ...state,
    orders: [order, ...state.orders],
    notice: {
      text: `Order #${input.id}\nPlaced!`,
      id: Date.now(),
      scope: "app",
    },
  });
}

export function setOrderStatus(id: string, status: OrderStatus) {
  const current = state.orders.find((o) => o.id === id);
  if (!current || current.status === status) return;

  if (status === "Cancelled" && current.items && current.items.length > 0) {
    adjustStockMany(current.items.map((i) => ({ id: i.id, delta: i.qty })));
  }

  set({
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
  });
}

export function useManageState() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
