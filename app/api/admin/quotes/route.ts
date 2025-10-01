// app/api/admin/quotes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --- error helper ---
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Server error";
}

// --- status union (optional, tighten if you have fixed states) ---
// type QuoteStatus = "pending" | "success" | "failed" | "expired";

// --- request body + guard ---
type PatchQuoteBody = {
  id: string | number;
  status: string; // or QuoteStatus
};

function isPatchQuoteBody(x: unknown): x is PatchQuoteBody {
  if (typeof x !== "object" || x === null) return false;
  const obj = x as Record<string, unknown>;
  const id = obj.id;
  const status = obj.status;

  const idOk =
    (typeof id === "string" && id.trim().length > 0) ||
    (typeof id === "number" && Number.isFinite(id));

  return idOk && typeof status === "string" && status.trim().length > 0;
}

// GET /api/admin/quotes -> latest 50 quotes
export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

// PATCH /api/admin/quotes -> update a quote's status
export async function PATCH(req: NextRequest) {
  try {
    const raw: unknown = await req.json();
    if (!isPatchQuoteBody(raw)) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const { id, status } = raw;

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("quotes")
      .update({ status }) // cast to { status: QuoteStatus } if you tightened the union
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (e: unknown) {
    console.error("Admin quotes error:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
