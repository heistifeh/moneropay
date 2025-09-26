import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function PATCH(
  req: Request,
  context: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await context.params;
  const body = await req.json();
  const { payout_address } = body;

  if (!payout_address) {
    return NextResponse.json({ error: "Missing payout address" }, { status: 400 });
  }

  // update quote
  const { data, error } = await supabase
    .from("quotes")
    .update({ payout_address, status: "awaiting_review" })
    .eq("public_id", publicId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // insert into quote_events
  await supabase.from("quote_events").insert({
    quote_public_id: publicId,
    actor: "user",
    event: "payout_attached",
    details: { payout_address },
  });

  return NextResponse.json(data);
}
