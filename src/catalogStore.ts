import { getCurrentUserId } from "@/auth";
import { Product } from "@/data/products";
import {
  archiveProductById,
  createOrUpdateCategory,
  deleteCategoryById,
  fetchCategories,
  fetchProducts,
  saveProductToDb,
  updateProductStockInDb,
} from "@/lib/dbSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { Platform } from "react-native";

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
  loading: boolean;
};

const STORAGE_KEYS = {
  categories: "pos_local_categories_v1",
  products: "pos_local_products_v1",
};

const canUseStorage = () =>
  Platform.OS !== "web" || typeof window !== "undefined";

async function readStorage<T>(key: string): Promise<T | null> {
  if (!canUseStorage()) return null;
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function writeStorage(key: string, value: unknown): Promise<void> {
  if (!canUseStorage()) return;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const palette = [
  "#9DBE8A",
  "#8B6B58",
  "#B8504F",
  "#D9A441",
  "#B7A8DA",
  "#D98A3D",
];
const tints = ["#F4A5A8", "#EE8CA5", "#F2A9C0", "#B7A8DA"];

const ALL_MEALS_CATEGORY: Category = {
  id: "all",
  name: "All Meals",
  icon: "utensils",
  color: "#F4A5A8",
};

let state: State = {
  products: [],
  categories: [ALL_MEALS_CATEGORY],
  screen: null,
  editingId: null,
  loading: false,
};

const listeners = new Set<() => void>();

const set = (next: State) => {
  state = next;
  listeners.forEach((l) => l());
  void writeStorage(
    STORAGE_KEYS.categories,
    next.categories.filter((c) => c.id !== "all"),
  );
  void writeStorage(STORAGE_KEYS.products, next.products);
};

export async function hydrateCatalog() {
  set({ ...state, loading: true });

  const [savedCats, savedProds, dbCategories, dbProducts] = await Promise.all([
    readStorage<Category[]>(STORAGE_KEYS.categories),
    readStorage<Product[]>(STORAGE_KEYS.products),
    fetchCategories(),
    fetchProducts(),
  ]);

  const cachedCategories =
    savedCats ?? state.categories.filter((c) => c.id !== "all");
  const mergedCategories: Category[] = [
    ALL_MEALS_CATEGORY,
    ...dbCategories,
    ...cachedCategories.filter(
      (loc) =>
        loc.id !== "all" &&
        !dbCategories.some(
          (db) =>
            db.id === loc.id ||
            db.name.toLowerCase() === loc.name.toLowerCase(),
        ),
    ),
  ];

  const cachedProducts = savedProds ?? state.products;
  const mergedProducts: Product[] = [
    ...dbProducts,
    ...cachedProducts.filter(
      (loc) =>
        !dbProducts.some(
          (db) =>
            db.id === loc.id ||
            db.name.toLowerCase() === loc.name.toLowerCase(),
        ),
    ),
  ];

  set({
    ...state,
    categories: mergedCategories,
    products: mergedProducts,
    loading: false,
  });
}

export function getProducts() {
  return state.products;
}

export async function adjustStockMany(
  changes: { id: string; delta: number }[],
) {
  const map = new Map(changes.map((c) => [c.id, c.delta]));
  const updatedList = state.products.map((p) => {
    const delta = map.get(p.id);
    if (delta === undefined) return p;
    const stock = Math.max(0, p.stock + delta);
    return { ...p, stock, available: stock > 0 };
  });

  set({
    ...state,
    products: updatedList,
  });

  await Promise.all(
    changes.map(async (change) => {
      const target = updatedList.find((p) => p.id === change.id);
      if (target) {
        await updateProductStockInDb(target.id, target.stock);
      }
    }),
  );
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

export function closeCatalog() {
  set({ ...state, screen: null, editingId: null });
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
  image?: string;
};

export async function saveProduct(input: ProductInput) {
  const existing = state.products.find((p) => p.id === input.id);
  const matchedCat = state.categories.find(
    (c) =>
      c.id !== "all" && c.name.toLowerCase() === input.category.toLowerCase(),
  );
  const categoryId =
    matchedCat && !Number.isNaN(Number(matchedCat.id))
      ? Number(matchedCat.id)
      : 1;

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
      image: input.image,
    };
    set({
      ...state,
      products: state.products.map((p) => (p.id === existing.id ? updated : p)),
      screen: "products",
      editingId: null,
    });

    await saveProductToDb({
      id: existing.id,
      categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      old: existing.old,
      stock: input.stock,
      image: input.image,
    });
    return;
  }

  const tempId = `p${Date.now()}`;
  const created: Product = {
    id: tempId,
    name: input.name,
    description: input.description,
    category: input.category,
    price: input.price,
    old: 0,
    stock: input.stock,
    discount: "0%",
    available: input.stock > 0,
    color: palette[state.products.length % palette.length],
    image: input.image,
  };
  set({
    ...state,
    products: [...state.products, created],
    screen: "products",
    editingId: null,
  });

  const dbRow = await saveProductToDb({
    categoryId,
    name: input.name,
    description: input.description,
    price: input.price,
    stock: input.stock,
    image: input.image,
  });

  if (dbRow?.id) {
    set({
      ...state,
      products: state.products.map((p) =>
        p.id === tempId ? { ...p, id: String(dbRow.id) } : p,
      ),
    });
  }
}

export async function deleteProduct(id: string) {
  set({ ...state, products: state.products.filter((p) => p.id !== id) });
  await archiveProductById(id);
}

export async function saveCategory(
  id: string | null,
  name: string,
  icon: string,
): Promise<string | null> {
  const clean = name.trim();
  if (!clean) return "Enter a category name.";

  const taken = state.categories.some(
    (c) => c.id !== id && c.name.toLowerCase() === clean.toLowerCase(),
  );
  if (taken) return "A category with that name already exists.";

  const existing = state.categories.find((c) => c.id === id);

  if (existing) {
    set({
      ...state,
      categories: state.categories.map((c) =>
        c.id === existing.id ? { ...c, name: clean, icon } : c,
      ),
      products: state.products.map((p) =>
        p.category === existing.name ? { ...p, category: clean } : p,
      ),
      screen: "categories",
      editingId: null,
    });

    await createOrUpdateCategory({
      id: existing.id,
      name: clean,
      icon,
    });
    return null;
  }

  const { data: dbRow } = await createOrUpdateCategory({
    name: clean,
    icon,
    createdBy: getCurrentUserId() ?? undefined,
  });

  const created: Category = {
    id: dbRow?.id ? String(dbRow.id) : `c${Date.now()}`,
    name: clean,
    icon,
    color: tints[state.categories.length % tints.length],
  };
  set({
    ...state,
    categories: [...state.categories, created],
    screen: "categories",
    editingId: null,
  });
  return null;
}

export async function deleteCategory(id: string) {
  if (id === "all") return;
  set({ ...state, categories: state.categories.filter((c) => c.id !== id) });
  await deleteCategoryById(id);
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
