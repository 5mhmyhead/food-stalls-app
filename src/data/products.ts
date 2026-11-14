import { formatPrice } from "@/currency";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  old: number;
  stock: number;
  discount: string;
  available: boolean;
  description: string;
  color: string;
};

export const products: Product[] = [];

export const peso = (n: number) => formatPrice(n);
