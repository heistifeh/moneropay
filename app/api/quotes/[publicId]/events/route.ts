import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function GET(
  req: Request,
  context: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await context.params;

  const { data, error } = await supabase
    .from("quote_events")
    .select("*")
    .eq("quote_public_id", publicId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
