// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// TODO: replace with real chain-specific validation
function isPayoutValid(addr: string) {
  return typeof addr === "string" && addr.trim().length >= 6;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { publicId, payoutAddress } = await req.json();
    if (!publicId || !payoutAddress) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }
    const addr = String(payoutAddress).trim();
    if (!isPayoutValid(addr)) {
      return new Response(JSON.stringify({ error: "Invalid payout address" }), { status: 400 });
    }

    // read quote (to get chain if you want chain-aware validation)
    const found = await supabase.from("quote").select("id, chain, payout_address").eq("public_id", publicId).single();
    if (found.error) throw found.error;

    // idempotent: if already set, keep the original
    const finalAddr = found.data.payout_address ?? addr;

    const upd = await supabase
      .from("quote")
      .update({ payout_address: finalAddr })
      .eq("public_id", publicId)
      .select("*")
      .single();
    if (upd.error) throw upd.error;

    await supabase.from("quote_event").insert({
      quote_id: upd.data.id,
      type: "PAYOUT_ATTACHED",
      payload: { payout_address: upd.data.payout_address },
    });

    return new Response(JSON.stringify(upd.data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), { status: 400 });
  }
});
