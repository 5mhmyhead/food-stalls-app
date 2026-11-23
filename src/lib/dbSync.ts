import { supabase } from "./supabase";

const palette = [
  "#9DBE8A",
  "#8B6B58",
  "#B8504F",
  "#D9A441",
  "#B7A8DA",
  "#D98A3D",
];

const tints = ["#F4A5A8", "#EE8CA5", "#F2A9C0", "#B7A8DA"];

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, created_by, name, icon")
    .order("id", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map((row, idx) => ({
    id: String(row.id),
    name: row.name,
    icon: row.icon || "utensils",
    color: tints[(idx + 1) % tints.length],
  }));
}

export async function createOrUpdateCategory(cat: {
  id?: string | null;
  name: string;
  icon: string;
  createdBy?: string;
}) {
  const numericId =
    cat.id && !Number.isNaN(Number(cat.id)) ? Number(cat.id) : undefined;

  if (numericId) {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: cat.name, icon: cat.icon })
      .eq("id", numericId)
      .select()
      .single();

    return { data, error: error?.message ?? null };
  }

  let creatorId = cat.createdBy;
  if (!creatorId) {
    const { data: userData } = await supabase.auth.getUser();
    creatorId = userData.user?.id;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: cat.name,
      icon: cat.icon,
      ...(creatorId ? { created_by: creatorId } : {}),
    })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}

export async function deleteCategoryById(id: string) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", numericId);

  return error?.message ?? null;
}

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      category_id,
      name,
      description,
      price,
      stock,
      discount,
      availability,
      image_url,
      is_archived,
      categories ( id, name )
    `,
    )
    .eq("is_archived", false)
    .order("id", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []).map((row: any, idx: number) => {
    const basePrice = Number(row.price ?? 0);
    const discountAmount = Number(row.discount ?? 0);
    const finalPrice =
      discountAmount > 0 ? Math.max(0, basePrice - discountAmount) : basePrice;
    const discountPct =
      discountAmount > 0 && basePrice > 0
        ? `${Math.round((discountAmount / basePrice) * 100)}%`
        : "0%";
    const stock = Number(row.stock ?? 0);

    return {
      id: String(row.id),
      name: row.name,
      description: row.description ?? "",
      category: row.categories?.name ?? "Uncategorized",
      price: finalPrice,
      old: discountAmount > 0 ? basePrice : 0,
      stock,
      discount: discountPct,
      available: Boolean(row.availability) && stock > 0,
      color: palette[idx % palette.length],
      image: row.image_url ?? undefined,
    };
  });
}

export async function saveProductToDb(product: {
  id?: string | null;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  old?: number;
  stock: number;
  image?: string;
}) {
  const hasDiscount = (product.old ?? 0) > product.price;
  const payload = {
    category_id: product.categoryId,
    name: product.name,
    description: product.description || null,
    price: hasDiscount ? product.old! : product.price,
    discount: hasDiscount ? product.old! - product.price : 0,
    stock: product.stock,
    availability: product.stock > 0,
    image_url: product.image || null,
    is_archived: false,
  };

  const numericId =
    product.id && !Number.isNaN(Number(product.id))
      ? Number(product.id)
      : undefined;

  if (numericId) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", numericId)
      .select()
      .single();

    if (error) return null;
    return data;
  }

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function updateProductStockInDb(id: string, stock: number) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return;

  await supabase
    .from("products")
    .update({ stock, availability: stock > 0 })
    .eq("id", numericId);
}

export async function archiveProductById(id: string) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return;

  await supabase
    .from("products")
    .update({ is_archived: true, availability: false })
    .eq("id", numericId);
}

type DbOrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type UiOrderStatus = "Pending" | "Complete" | "Cancelled";

function toUiStatus(status: string): UiOrderStatus {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "Complete";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
}

function toDbStatus(status: string): DbOrderStatus {
  switch (status?.toLowerCase()) {
    case "complete":
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "CANCELLED";
    default:
      return "PENDING";
  }
}

function toUiOrderType(orderType?: string | null): string {
  if (!orderType) return "Dine In";
  return orderType === "TAKE_OUT" ? "Take Out" : "Dine In";
}

function toDbOrderType(mode?: string): "DINE_IN" | "TAKE_OUT" {
  return mode?.toLowerCase().includes("take") ? "TAKE_OUT" : "DINE_IN";
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      employee_id,
      customer_id,
      status,
      ordered_at,
      order_type,
      order_items (
        id,
        product_id,
        quantity,
        unit_price,
        products (
          id,
          name,
          image_url,
          category_id
        )
      )
    `,
    )
    .order("ordered_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data ?? []).map((row: any) => {
    const items = (row.order_items ?? []).map((item: any, idx: number) => ({
      id: String(item.product_id),
      orderItemId: String(item.id),
      name: item.products?.name ?? `Product #${item.product_id}`,
      qty: Number(item.quantity ?? 1),
      price: Number(item.unit_price ?? 0),
      image: item.products?.image_url ?? undefined,
      color: palette[(item.products?.category_id ?? idx) % palette.length],
    }));

    const totalPrice = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0,
    );

    return {
      id: String(row.id),
      employeeId: row.employee_id,
      customerId: row.customer_id,
      date: row.ordered_at,
      status: toUiStatus(row.status),
      price: totalPrice,
      mode: toUiOrderType(row.order_type),
      color: "#F4A3B3",
      items,
    };
  });
}

export async function createOrderInDb(params: {
  employeeId?: string | null;
  customerId?: string | null;
  mode?: string;
  status?: UiOrderStatus;
  items: { productId: string; quantity: number; unitPrice: number }[];
}) {
  let empId = params.employeeId ?? null;
  if (!empId) {
    const { data: userData } = await supabase.auth.getUser();
    empId = userData.user?.id ?? null;
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      employee_id: empId,
      customer_id: params.customerId ?? null,
      status: toDbStatus(params.status ?? "Pending"),
      order_type: toDbOrderType(params.mode),
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    return null;
  }

  if (params.items.length > 0) {
    const lineItems = params.items.map((item) => ({
      order_id: orderRow.id,
      product_id: Number(item.productId),
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    await supabase.from("order_items").insert(lineItems);
  }

  return orderRow;
}

export async function updateOrderStatusInDb(id: string, status: UiOrderStatus) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return;

  await supabase
    .from("orders")
    .update({ status: toDbStatus(status) })
    .eq("id", numericId);
}

export async function fetchShopSettings() {
  const { data, error } = await supabase
    .from("shop_settings")
    .select("id, low_stock_threshold, updated_by, updated_at")
    .eq("id", 1)
    .single();

  if (error) {
    return { lowStockThreshold: 5 };
  }

  return {
    lowStockThreshold: Number(data?.low_stock_threshold ?? 5),
    updatedBy: data?.updated_by,
    updatedAt: data?.updated_at,
  };
}

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, account_type, email, created_at")
    .order("username", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}
