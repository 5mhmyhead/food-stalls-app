import { Product, products as seed } from "@/data/products";
import { useSyncExternalStore } from "react";

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};
export type Screen = null | "categories" | "products" | "item" | "category";

type State = {
  products: Product[];
  categories: Category[];
  screen: Screen;
  editingId: string | null;
};

const palette = [
  "#9DBE8A",
  "#8B6B58",
  "#B8504F",
  "#D9A441",
  "#B7A8DA",
  "#D98A3D",
];
const tints = ["#F4A5A8", "#EE8CA5", "#F2A9C0", "#B7A8DA"];

let state: State = {
  products: seed,
  categories: [
    {
      id: "all",
      name: "All Meals",
      icon: "restaurant-outline",
      color: "#F4A5A8",
    },
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny-outline",
      color: "#EE8CA5",
    },
    { id: "drinks", name: "Drinks", icon: "cafe-outline", color: "#F2A9C0" },
  ],
  screen: null,
  editingId: null,
};

const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
};

export function getProducts() {
  return state.products;
}

export function adjustStockMany(changes: { id: string; delta: number }[]) {
  const map = new Map(changes.map((c) => [c.id, c.delta]));
  set({
    ...state,
    products: state.products.map((p) => {
      const delta = map.get(p.id);
      if (delta === undefined) return p;
      const stock = Math.max(0, p.stock + delta);
      return { ...p, stock, available: stock > 0 };
    }),
  });
}

export function openScreen(screen: Screen, editingId: string | null = null) {
  set({ ...state, screen, editingId });
}

export function goBack() {
  if (state.screen === "item")
    set({ ...state, screen: "products", editingId: null });
  else if (state.screen === "category")
    set({ ...state, screen: "categories", editingId: null });
  else set({ ...state, screen: null, editingId: null });
}

export function itemCount(products: Product[], category: Category) {
  if (category.id === "all") return products.length;
  return products.filter((p) => p.category === category.name).length;
}

type ProductInput = {
  id: string | null;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

export function saveProduct(input: ProductInput) {
  const existing = state.products.find((p) => p.id === input.id);

  if (existing) {
    const discount =
      existing.old > input.price
        ? `${Math.round(((existing.old - input.price) / existing.old) * 100)}%`
        : "0%";
    const updated: Product = {
      ...existing,
      name: input.name,
      description: input.description,
      category: input.category,
      price: input.price,
      stock: input.stock,
      available: input.stock > 0,
      discount,
    };
    set({
      ...state,
      products: state.products.map((p) => (p.id === existing.id ? updated : p)),
    });
    return;
  }

  const created: Product = {
    id: `p${Date.now()}`,
    name: input.name,
    description: input.description,
    category: input.category,
    price: input.price,
    old: 0,
    stock: input.stock,
    discount: "0%",
    available: input.stock > 0,
    color: palette[state.products.length % palette.length],
  };
  set({ ...state, products: [...state.products, created] });
}

export function deleteProduct(id: string) {
  set({ ...state, products: state.products.filter((p) => p.id !== id) });
}

export function saveCategory(id: string | null, name: string) {
  const existing = state.categories.find((c) => c.id === id);

  if (existing) {
    set({
      ...state,
      categories: state.categories.map((c) =>
        c.id === existing.id ? { ...c, name } : c,
      ),
      products: state.products.map((p) =>
        p.category === existing.name ? { ...p, category: name } : p,
      ),
    });
    return;
  }

  const created: Category = {
    id: `c${Date.now()}`,
    name,
    icon: "pricetag-outline",
    color: tints[state.categories.length % tints.length],
  };
  set({ ...state, categories: [...state.categories, created] });
}

export function deleteCategory(id: string) {
  set({ ...state, categories: state.categories.filter((c) => c.id !== id) });
}

export function useCatalog() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
