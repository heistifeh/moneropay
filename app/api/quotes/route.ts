import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { base_symbol, quote_symbol, chain, amount_in } = body;

    if (!base_symbol || !quote_symbol || !chain || !amount_in) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: fetch latest price from price_cache
    const rate = 1; // placeholder for now
    const amount_out = Number(amount_in) * rate;

    const deposit_address = 'demo_' + Math.random().toString(36).slice(2, 10);
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from('quotes')
      .insert([{
        base_symbol,
        quote_symbol,
        chain,
        amount_in,
        rate,
        amount_out,
        deposit_address,
        expires_at,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Server error' }, { status: 500 });
  }
}
