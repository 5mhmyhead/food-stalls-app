import { adjustStockMany } from "@/catalogStore";
import {
  createOrderInDb,
  fetchOrders,
  updateOrderStatusInDb,
} from "@/lib/dbSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";

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
  loading: boolean;
};

const ORDERS_STORAGE_KEY = "pos_local_orders_v1";

const canUseStorage = () =>
  Platform.OS !== "web" || typeof window !== "undefined";

async function readStoredOrders(): Promise<ManagedOrder[]> {
  if (!canUseStorage()) return [];
  try {
    const raw = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ManagedOrder[]) : [];
  } catch {
    return [];
  }
}

async function writeStoredOrders(orders: ManagedOrder[]): Promise<void> {
  if (!canUseStorage()) return;
  try {
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {}
}

let state: State = {
  open: false,
  orders: [],
  notice: null,
  loading: false,
};

const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
  void writeStoredOrders(next.orders);
};

function formatDateLabel(raw?: string) {
  if (!raw) return todayLabel();
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function hydrateOrders() {
  set({ ...state, loading: true });

  const [storedOrders, dbOrders] = await Promise.all([
    readStoredOrders(),
    fetchOrders(),
  ]);

  const mappedDb: ManagedOrder[] = dbOrders.map((o: any) => ({
    id: String(o.id),
    price: Number(o.price ?? 0),
    date: formatDateLabel(o.date),
    status: o.status as OrderStatus,
    color: o.color ?? "#F4A3B3",
    mode: o.mode,
    items: (o.items ?? []).map((item: any) => ({
      id: String(item.id),
      name: item.name,
      qty: Number(item.qty ?? 1),
      price: Number(item.price ?? 0),
    })),
  }));

  const cached = storedOrders.length > 0 ? storedOrders : state.orders;
  const merged: ManagedOrder[] = [
    ...mappedDb,
    ...cached.filter((loc) => !mappedDb.some((db) => db.id === loc.id)),
  ];

  set({ ...state, orders: merged, loading: false });
}

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

export async function addOrder(input: {
  id: string;
  total: number;
  mode: string;
  color: string;
  items: OrderItem[];
  employeeId?: string | null;
  customerId?: string | null;
}) {
  await adjustStockMany(input.items.map((i) => ({ id: i.id, delta: -i.qty })));

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

  const dbItems = input.items
    .filter((i) => !Number.isNaN(Number(i.id)))
    .map((i) => ({
      productId: i.id,
      quantity: i.qty,
      unitPrice: i.price,
    }));

  if (dbItems.length === 0) return;

  const dbRow = await createOrderInDb({
    employeeId: input.employeeId ?? null,
    customerId: input.customerId ?? null,
    mode: input.mode,
    status: "Pending",
    items: dbItems,
  });

  if (dbRow?.id) {
    const realId = String(dbRow.id);
    set({
      ...state,
      orders: state.orders.map((o) =>
        o.id === input.id ? { ...o, id: realId } : o,
      ),
      notice: {
        text: `Order #${realId}\nPlaced!`,
        id: Date.now(),
        scope: "app",
      },
    });
  }
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const current = state.orders.find((o) => o.id === id);
  if (!current || current.status === status) return;

  if (status === "Cancelled" && current.items && current.items.length > 0) {
    await adjustStockMany(
      current.items.map((i) => ({ id: i.id, delta: i.qty })),
    );
  }

  set({
    ...state,
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
  });

  await updateOrderStatusInDb(id, status);
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
