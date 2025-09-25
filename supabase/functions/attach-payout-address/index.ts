// @ts-nocheck


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const { publicId, payoutAddress } = await req.json();
    if (!publicId || !payoutAddress) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    // (optional) read chain to validate format more strictly
    const q = await supabase.from("quote").select("id,chain,payout_address").eq("public_id", publicId).single();
    if (q.error) throw q.error;

    const finalAddr = q.data.payout_address ?? String(payoutAddress).trim(); // idempotent

    const upd = await supabase.from("quote")
      .update({ payout_address: finalAddr })
      .eq("public_id", publicId)
      .select("*").single();
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
