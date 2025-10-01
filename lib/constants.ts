// src/lib/constants.ts

export type Asset = {
  symbol: string;   
  name: string;     
  id: string;  
  platform?: string; 
  contract?: string;     
};


export const ASSETS: Asset[] = [
  { symbol: "BTC", name: "Bitcoin", id: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", id: "ethereum" },
  { symbol: "SOL", name: "Solana", id: "solana" },
  {
    symbol: "USDT-ETH",
    name: "Tether (Ethereum)",
    id: "tether",
    platform: "ethereum",
    contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "USDT-TRON",
    name: "Tether (Tron)",
    id: "tether",
    platform: "tron",
    contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  },
  {
    symbol: "USDT-SOL",
    name: "Tether (Solana)",
    id: "tether",
    platform: "solana",
    contract: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  { symbol: "USDC", name: "USD Coin", id: "usd-coin" },
];


// ✅ Quick lookup by symbol (so you can do ASSET_BY_SYMBOL["BTC"].id)
export const ASSET_BY_SYMBOL: Record<string, Asset> = ASSETS.reduce(
  (acc, a) => {
    acc[a.symbol] = a;
    return acc;
  },
  {} as Record<string, Asset>
);

// ✅ id → asset (for createQuote lookups by CoinGecko id)
export const ASSET_BY_ID: Record<string, Asset> = ASSETS.reduce(
  (acc, a) => ((acc[a.id] = a), acc),
  {} as Record<string, Asset>
);

// ✅ All CoinGecko IDs in one array (for price queries)
export const ALL_CG_IDS = ASSETS.map(a => a.id);
