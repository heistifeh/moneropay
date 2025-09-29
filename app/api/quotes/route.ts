import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

// Map coin symbols to deposit addresses from ENV
const DEPOSIT_ADDRS: Record<string, string | undefined> = {
  BTC: process.env.DEPOSIT_ADDR_BTC,
  ETH: process.env.DEPOSIT_ADDR_ETH,
  SOL: process.env.DEPOSIT_ADDR_SOL,
  USDT: process.env.DEPOSIT_ADDR_USDT,
  USDC: process.env.DEPOSIT_ADDR_USDC,
  // add more as needed
};

// how long cached prices are valid (ms)
const CACHE_TTL = 60_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base_symbol, quote_symbol, chain, amount_in } = body;

    if (!base_symbol || !quote_symbol || !chain || !amount_in) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // look up deposit address
    const deposit_address = DEPOSIT_ADDRS[base_symbol];
    if (!deposit_address) {
      return NextResponse.json(
        { error: `No deposit address configured for ${base_symbol}` },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();

    // 1. Try get latest price cache
    const { data: cache, error: cacheErr } = await sb
      .from("price_cache")
      .select("*")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (cacheErr) {
      console.error("Failed to read price_cache:", cacheErr);
    }

    let payload: Record<string, number> | null = null;

    if (cache && cache.payload) {
      const age = Date.now() - new Date(cache.fetched_at).getTime();
      if (age < CACHE_TTL) {
        payload = cache.payload as Record<string, number>;
      }
    }

    // 2. If cache is stale, fetch from CoinGecko
    if (!payload) {
      const ids = ["bitcoin", "ethereum", "solana", "tether", "usd-coin"]; // expand as needed
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
        ","
      )}&vs_currencies=usd`;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch prices from CoinGecko");
      const fresh = await resp.json();

      payload = Object.fromEntries(
        Object.entries(fresh).map(([id, val]) => [id, (val as any).usd])
      );

      // save to cache
      await sb.from("price_cache").insert([
        {
          payload,
          source: "coingecko",
          fetched_at: new Date().toISOString(),
        },
      ]);
    }

    // 3. Map symbols to ids
    const SYMBOL_TO_ID: Record<string, string> = {
      BTC: "bitcoin",
      ETH: "ethereum",
      SOL: "solana",
      USDT: "tether",
      USDC: "usd-coin",
    };

    const baseId = SYMBOL_TO_ID[base_symbol];
    const quoteId = SYMBOL_TO_ID[quote_symbol];

    const basePrice = payload?.[baseId];
    const quotePrice = payload?.[quoteId];

    if (!basePrice || !quotePrice) {
      return NextResponse.json({ error: "Unsupported asset" }, { status: 400 });
    }

    // 4. Lock the rate
    const rate = basePrice / quotePrice;
    const amount_out = Number(amount_in) * rate;
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 5. Save quote
    const { data, error } = await sb
      .from("quotes")
      .insert([
        {
          base_symbol,
          quote_symbol,
          chain,
          amount_in,
          rate,
          amount_out,
          deposit_address,
          expires_at,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    console.error("Quote creation error:", e);
    return NextResponse.json(
      { error: e.message ?? "Server error" },
      { status: 500 }
    );
  }
}
