// app/api/quotes/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { ASSET_BY_SYMBOL, ALL_CG_IDS } from "@/lib/constants";

// --- error helper ---
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Server error";
}

// --- deposit addresses you actually support ---
const DEPOSIT_ADDRS: Record<string, string | undefined> = {
  BTC: process.env.DEPOSIT_ADDR_BTC,
  ETH: process.env.DEPOSIT_ADDR_ETH,
  "USDT-ETH": process.env.DEPOSIT_ADDR_USDT_ETH,
  "USDT-TRON": process.env.DEPOSIT_ADDR_USDT_TRON,
  "USDT-SOL": process.env.DEPOSIT_ADDR_USDT_SOL,
  XRP: process.env.DEPOSIT_ADDR_XRP,
  // add more when ready
};

// cache TTL
const CACHE_TTL = 60_000; // 1 min

// --- API handler ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base_symbol, quote_symbol, chain, amount_in } = body as {
      base_symbol?: string;
      quote_symbol?: string;
      chain?: string;
      amount_in?: number | string;
    };

    if (!base_symbol || !quote_symbol || !chain || amount_in == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // amount_in validation
    const amtIn = typeof amount_in === "number" ? amount_in : Number(amount_in);
    if (!Number.isFinite(amtIn) || amtIn <= 0) {
      return NextResponse.json({ error: "Invalid amount_in" }, { status: 400 });
    }

    // ensure deposit address is configured
    const deposit_address = DEPOSIT_ADDRS[base_symbol];
    if (!deposit_address) {
      return NextResponse.json(
        { error: `No deposit address configured for ${base_symbol}` },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();

    // 1. Try cached price
    const { data: cache, error: cacheErr } = await sb
      .from("price_cache")
      .select("*")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (cacheErr) console.warn("price_cache read failed:", cacheErr);

    let payload: Record<string, number> | null = null;

    if (cache && cache.payload) {
      const age = Date.now() - new Date(cache.fetched_at).getTime();
      if (age < CACHE_TTL) {
        payload = cache.payload as Record<string, number>;
      }
    }

    // 2. If stale, fetch fresh from CG
    if (!payload) {
      const ids = Array.from(new Set(ALL_CG_IDS)); // dedupe!
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
        ","
      )}&vs_currencies=usd`;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch prices from CoinGecko");

      const fresh = (await resp.json()) as Record<string, { usd: number }>;
      payload = Object.fromEntries(
        Object.entries(fresh).map(([id, val]) => [id, val.usd])
      );

      // store cache
      await sb.from("price_cache").insert([
        {
          payload,
          source: "coingecko",
          fetched_at: new Date().toISOString(),
        },
      ]);
    }

    // 3. Resolve IDs from constants
    const baseId = ASSET_BY_SYMBOL[base_symbol]?.id;
    const quoteId = ASSET_BY_SYMBOL[quote_symbol]?.id;

    const basePrice = baseId ? payload?.[baseId] : null;
    const quotePrice = quoteId ? payload?.[quoteId] : null;

    if (basePrice == null || quotePrice == null) {
      return NextResponse.json({ error: "Unsupported asset" }, { status: 400 });
    }

    // 4. Compute rate + output
    const rate = basePrice / quotePrice;
    const amount_out = amtIn * rate;
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 5. Save quote to DB
    const { data, error } = await sb
      .from("quotes")
      .insert([
        {
          base_symbol,
          quote_symbol,
          chain,
          amount_in: amtIn,
          rate,
          amount_out,
          deposit_address,
          expires_at,
          status: "processing",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    console.error("Quote creation error:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
