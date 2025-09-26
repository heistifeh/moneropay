// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

Deno.serve(async () => {
  const now = new Date().toISOString();

  const { data: rows, error } = await supabase
    .from("quote")
    .select("id")
    .lt("expires_at", now)
    .in("status", ["awaiting_payment", "awaiting_review", "confirming"]);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  if (!rows?.length) return new Response(JSON.stringify({ updated: 0 }), { status: 200 });

  const ids = rows.map((r: any) => r.id);

  const upd = await supabase.from("quote").update({ status: "expired" }).in("id", ids).select("id");
  if (upd.error) return new Response(JSON.stringify({ error: upd.error.message }), { status: 500 });

  await supabase.from("quote_event").insert(ids.map((id: string) => ({ quote_id: id, type: "EXPIRED", payload: {} })));

  return new Response(JSON.stringify({ updated: ids.length }), { status: 200 });
});
