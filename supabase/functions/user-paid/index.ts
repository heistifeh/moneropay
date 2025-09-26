// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { publicId, txInHash } = await req.json();
    if (!publicId || !txInHash) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const upd = await supabase
      .from("quote")
      .update({
        status: "awaiting_review",
        tx_in_hash: String(txInHash).trim(),
      })
      .eq("public_id", publicId)
      .select("*")
      .single();
    if (upd.error) throw upd.error;

    await supabase.from("quote_event").insert({
      quote_id: upd.data.id,
      type: "USER_PAID",
      payload: { tx_in_hash: upd.data.tx_in_hash },
    });

    return new Response(JSON.stringify(upd.data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), { status: 400 });
  }
});
