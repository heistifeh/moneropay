// @ts-nocheck

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

const round = (n: number, d = 8) => Number(n.toFixed(d));
const ttl = (min = 10) => new Date(Date.now() + min * 60_000).toISOString();

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const { fromSymbol, toSymbol, amountIn, chain } = await req.json();
    if (!fromSymbol || !toSymbol || !amountIn) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    const from = String(fromSymbol).toUpperCase().trim();
    const to = String(toSymbol).toUpperCase().trim();
    const amountInNum = Number(amountIn);
    if (!Number.isFinite(amountInNum) || amountInNum <= 0) return new Response(JSON.stringify({ error: "Invalid amountIn" }), { status: 400 });

    // 1) Load prices
    const [pf, pt] = await Promise.all([
      supabase.from("price_cache").select("price_usd").eq("symbol_id", from).maybeSingle(),
      supabase.from("price_cache").select("price_usd").eq("symbol_id", to).maybeSingle(),
    ]);
    if (pf.error || !pf.data) throw pf.error ?? new Error("Missing FROM price");
    if (pt.error || !pt.data) throw pt.error ?? new Error("Missing TO price");

    // 2) Compute amounts (server-side)
    const rate = Number(pf.data.price_usd) / Number(pt.data.price_usd);
    const amountOut = amountInNum * rate;

    // 3) Allocate deposit address (stub: replace with wallet/allocator)
    const depositAddress = `alloc_${(crypto.randomUUID()).slice(0,8)}`;

    // 4) Insert quote
    const row = {
      public_id: `q_${crypto.randomUUID()}`,
      base_symbol: from,
      quote_symbol: to,
      chain: chain ?? null,
      amount_in: round(amountInNum, 8),
      rate: round(rate, 10),
      amount_out: round(amountOut, 8),
      deposit_address: depositAddress,
      payout_address: null,
      status: "awaiting_payment",
      expires_at: ttl(10),
    };
    const ins = await supabase.from("quote").insert(row).select("*").single();
    if (ins.error) throw ins.error;

    await supabase.from("quote_event").insert({
      quote_id: ins.data.id,
      type: "CREATED",
      payload: { rate: ins.data.rate, amount_out: ins.data.amount_out, chain: ins.data.chain },
    });

    return new Response(JSON.stringify(ins.data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), { status: 400 });
  }
});
