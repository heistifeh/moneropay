// src/lib/constants.ts

export type Asset = {
  symbol: string;   
  name: string;     
  id: string;       
};


export const ASSETS: Asset[] = [
  { symbol: "BTC",  name: "Bitcoin",     id: "bitcoin" },
  { symbol: "ETH",  name: "Ethereum",    id: "ethereum" },
  { symbol: "SOL",  name: "Solana",      id: "solana" },
  { symbol: "USDT", name: "Tether",      id: "tether" },
  { symbol: "USDC", name: "USD Coin",    id: "usd-coin" },
];

// ✅ Quick lookup by symbol (so you can do ASSET_BY_SYMBOL["BTC"].id)
export const ASSET_BY_SYMBOL: Record<string, Asset> = ASSETS.reduce(
  (acc, a) => {
    acc[a.symbol] = a;
    return acc;
  },
  {} as Record<string, Asset>
);

// ✅ All CoinGecko IDs in one array (for price queries)
export const ALL_CG_IDS = ASSETS.map(a => a.id);
