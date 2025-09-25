// The only shape the UI cares about (comes from backend)
export type QuoteStatus =
  | 'awaiting_payment'
  | 'awaiting_review'
  | 'confirming'
  | 'success'
  | 'failed'
  | 'expired';

export type Quote = {
  publicId: string;        // unique public id of the quote
  baseSymbol: string;      // e.g., 'BTC' (what user sends)
  quoteSymbol: string;     // e.g., 'USDT' (what user receives)
  chain: string | null;    // e.g., 'ethereum'
  amountIn: string;        // decimal string (server-calculated/frozen)
  rate: string;            // server-calculated
  amountOut: string;       // server-calculated
  depositAddress: string;  // where the user must send funds
  payoutAddress?: string | null; // user's receive address (optional until set)
  status: QuoteStatus;     // lifecycle
  expiresAt: string;       // ISO timestamp (server)
  txInHash?: string | null;
  txOutHash?: string | null;
  createdAt: string;       // ISO
};
