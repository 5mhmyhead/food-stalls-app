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

export const products: Product[] = [
  {
    id: "matcha",
    name: "Matcha Tea",
    category: "Drinks",
    price: 210,
    old: 250,
    stock: 64,
    discount: "16%",
    available: true,
    description:
      "a smooth ceremonial-grade matcha whisked with milk, with a fresh grassy aroma and a gently sweet finish.",
    color: "#9DBE8A",
  },
  {
    id: "espresso",
    name: "Light Espresso",
    category: "Drinks",
    price: 200,
    old: 250,
    stock: 112,
    discount: "20%",
    available: true,
    description:
      "a concentrated shot brewed from coffee beans roasted just past the first crack, highlighting bright fruit, floral aromas, and crisp acidity rather than heavy chocolate or roasty bitterness.",
    color: "#8B6B58",
  },
  {
    id: "choco",
    name: "Hot Chocolate",
    category: "Drinks",
    price: 210,
    old: 250,
    stock: 48,
    discount: "16%",
    available: true,
    description:
      "rich cocoa melted into steamed milk and topped with whipped cream, warm, creamy and comforting.",
    color: "#B8504F",
  },
  {
    id: "breakfast",
    name: "Breakfast Plate",
    category: "Breakfast",
    price: 210,
    old: 0,
    stock: 30,
    discount: "0%",
    available: true,
    description:
      "eggs, bacon and toast served with hash browns and fresh fruit, a full plate to start the day.",
    color: "#D9A441",
  },
];

export const peso = (n: number) => formatPrice(n);
