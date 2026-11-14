export type CurrencyInfo = {
  code: string;
  symbol: string;
  rate: number;
  decimals: number;
};

export const CURRENCY_TABLE: CurrencyInfo[] = [
  { code: "PHP", symbol: "₱", rate: 1, decimals: 2 },
  { code: "USD", symbol: "$", rate: 0.0172, decimals: 2 },
  { code: "EUR", symbol: "€", rate: 0.0159, decimals: 2 },
  { code: "JPY", symbol: "¥", rate: 2.6, decimals: 0 },
];

let current: CurrencyInfo = CURRENCY_TABLE[0];

export function setCurrency(code: string) {
  const found = CURRENCY_TABLE.find((c) => c.code === code);
  if (found) current = found;
}

export function formatPrice(amountInPesos: number) {
  const converted = amountInPesos * current.rate;
  return `${current.symbol}${converted.toFixed(current.decimals)}`;
}
