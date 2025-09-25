import type { Quote } from '@/types/quote';

type DbQuote = {
  public_id: string;
  base_symbol: string;
  quote_symbol: string;
  chain: string | null;
  amount_in: string;
  rate: string;
  amount_out: string;
  deposit_address: string;
  payout_address: string | null;
  status: string;
  expires_at: string;
  tx_in_hash: string | null;
  tx_out_hash: string | null;
  created_at: string;
};

export function mapDbQuote(q: DbQuote): Quote {
  return {
    publicId: q.public_id,
    baseSymbol: q.base_symbol,
    quoteSymbol: q.quote_symbol,
    chain: q.chain,
    amountIn: String(q.amount_in),
    rate: String(q.rate),
    amountOut: String(q.amount_out),
    depositAddress: q.deposit_address,
    payoutAddress: q.payout_address,
    status: q.status as Quote['status'],
    expiresAt: q.expires_at,
    txInHash: q.tx_in_hash,
    txOutHash: q.tx_out_hash,
    createdAt: q.created_at,
  };
}
