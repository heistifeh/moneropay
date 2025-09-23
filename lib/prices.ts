// src/lib/prices.ts
import { PriceMap } from "./priceTypes";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export async function fetchPrices(ids: string[]): Promise<PriceMap> {
  if (ids.length === 0) return {};

  const url = `${COINGECKO_API}/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch prices: ${res.status}`);
  }

  const data = await res.json();

  // Normalize to { [id]: price }
  const prices: PriceMap = {};
  for (const id of ids) {
    if (data[id] && data[id].usd) {
      prices[id] = data[id].usd;
    }
  }

  return prices;
}
