// src/lib/constants.ts

export type Asset = {
  symbol: string;
  name: string;
  id: string;
  chain?: string;
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
    chain: "ethereum",
    contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "USDT-TRON",
    name: "Tether (Tron)",
    id: "tether",
    chain: "tron",
    contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  },
  {
    symbol: "USDT-SOL",
    name: "Tether (Solana)",
    id: "tether",
    chain: "solana",
    contract: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  { symbol: "USDC", name: "USD Coin", id: "usd-coin" },
];

// --- quote assets (can be much larger) ---
export const QUOTE_ASSETS: Asset[] = [
  // core L1s
  { symbol: "BTC", name: "Bitcoin", id: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", id: "ethereum" },
  { symbol: "SOL", name: "Solana", id: "solana" },

  // stablecoins across chains
  {
    symbol: "USDT-ETH",
    name: "Tether (Ethereum)",
    id: "tether",
    chain: "ethereum",
    contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "USDT-TRON",
    name: "Tether (Tron)",
    id: "tether",
    chain: "tron",
    contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  },
  {
    symbol: "USDT-SOL",
    name: "Tether (Solana)",
    id: "tether",
    chain: "solana",
    contract: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  {
    symbol: "USDC-ETH",
    name: "USD Coin (Ethereum)",
    id: "usd-coin",
    chain: "ethereum",
    contract: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    symbol: "USDC-SOL",
    name: "USD Coin (Solana)",
    id: "usd-coin",
    chain: "solana",
    contract: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },

  // expand with more assets later
  { symbol: "BNB", name: "BNB", id: "binancecoin" },
  { symbol: "MATIC", name: "Polygon", id: "matic-network" },
  { symbol: "AVAX", name: "Avalanche", id: "avalanche-2" },
  { symbol: "ADA", name: "Cardano", id: "cardano" },
  { symbol: "DOGE", name: "Dogecoin", id: "dogecoin" },
  { symbol: "XRP", name: "XRP", id: "ripple" },
];

// Combine both lists
const ALL_ASSETS = [...ASSETS, ...QUOTE_ASSETS];

// ✅ Quick lookup by symbol
export const ASSET_BY_SYMBOL: Record<string, Asset> = ALL_ASSETS.reduce(
  (acc, a) => {
    acc[a.symbol] = a;
    return acc;
  },
  {} as Record<string, Asset>
);

// ✅ id → asset (for createQuote lookups by CoinGecko id)
export const ASSET_BY_ID: Record<string, Asset> = ALL_ASSETS.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, Asset>
);

// ✅ All CoinGecko IDs in one array (for price queries)
export const ALL_CG_IDS = ALL_ASSETS.map((a) => a.id);
