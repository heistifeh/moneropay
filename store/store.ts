// src/store/store.ts
import { create } from "zustand";

import { ASSET_BY_ID } from "@/lib/constants";
// ---- Types ----
export type Step = "quote" | "address" | "summary";
export type TxStatus =
  | "idle"
  | "quoting"
  | "awaiting_payment"
  | "confirming"
  | "success"
  | "expired"
  | "failed";

export type Quote = {
  id: string; // local id (or backend id)
  fromId: string; // CoinGecko id (e.g., "tether")
  toId: string; // CoinGecko id (e.g., "solana")
  fromSymbol: string; // snapshot at quote time (e.g., "USDT")
  toSymbol: string; // snapshot at quote time (e.g., "SOL")
  fromName: string; // 👈 add this
  toName: string; // 👈 add this
  amountIn: number; // user entered amount (FROM token)
  rate: number; // TO per 1 FROM at lock time
  amountOut: number; // amountIn * rate
  pricesSnapshot: Record<string, number>; // usd snapshot used for this quote
  createdAt: number; // ms
  expiresAt: number; // ms (createdAt + 10min by default)
};

type FlowState = {
  // Wizard
  step: Step;

  // Selections
  fromSymbol: string; // e.g., "USDT"
  toSymbol: string; // e.g., "SOL"
  amountIn: string; // keep as string for friendly typing

  // Addresses
  userReceiveAddress?: string; // where user will receive TO token
  sellerDepositAddress?: string; // where user must send FROM token

  // Quote + tx
  quote?: Quote;
  status: TxStatus;
  txHash?: string;

  // Actions
  setFromSymbol: (s: string) => void;
  setToSymbol: (s: string) => void;
  setAmountIn: (v: string) => void;

  next: () => void;
  prev: () => void;

  createQuote: (args: {
    prices: Record<string, number>;
    fromId: string;
    toId: string;
    amountInNum: number;
    ttlMs?: number; // default 10 min
  }) => void;

  setUserReceiveAddress: (addr: string) => void;
  setSellerDepositAddress: (addr: string) => void;

  markAwaitingPayment: () => void;
  markConfirming: (txHash?: string) => void;
  markSuccess: (txHash: string) => void;
  markFailed: () => void;

  expireQuote: () => void;
  reset: () => void;
};

// ---- Store ----
export const useFlow = create<FlowState>((set, get) => ({
  // initial state
  step: "quote",
  fromSymbol: "USDT",
  toSymbol: "SOL",
  amountIn: "",
  status: "idle",

  // selections
  setFromSymbol: (s) => set({ fromSymbol: s }),
  setToSymbol: (s) => set({ toSymbol: s }),
  setAmountIn: (v) => set({ amountIn: v }),

  // wizard nav
  next: () => {
    const order: Step[] = ["quote", "address", "summary"];
    const i = order.indexOf(get().step);
    if (i < order.length - 1) set({ step: order[i + 1] });
  },
  prev: () => {
    const order: Step[] = ["quote", "address", "summary"];
    const i = order.indexOf(get().step);
    if (i > 0) set({ step: order[i - 1] });
  },

  // --- implementation ---
  createQuote: ({
    prices,
    fromId,
    toId,
    amountInNum,
    ttlMs = 10 * 60 * 1000,
  }) => {
    const fromUsd = prices[fromId];
    const toUsd = prices[toId];
    if (!fromUsd || !toUsd)
      throw new Error("Missing prices for selected assets");

    // derive names/symbols from your registry
    const fromMeta = ASSET_BY_ID[fromId];
    const toMeta = ASSET_BY_ID[toId];
    if (!fromMeta || !toMeta) throw new Error("Unknown asset id(s) for quote");

    const rate = fromUsd / toUsd; // TO units per 1 FROM
    const amountOut = amountInNum * rate;
    const now = Date.now();

    const q: Quote = {
      id: `q_${now}`,
      fromId,
      toId,
      fromSymbol: fromMeta.symbol,
      toSymbol: toMeta.symbol,
      fromName: fromMeta.name,
      toName: toMeta.name,
      amountIn: amountInNum,
      rate,
      amountOut,
      pricesSnapshot: prices,
      createdAt: now,
      expiresAt: now + ttlMs,
    };

    set({ quote: q, status: "quoting" });
  },

  // addresses
  setUserReceiveAddress: (addr) => set({ userReceiveAddress: addr }),
  setSellerDepositAddress: (addr) => set({ sellerDepositAddress: addr }),

  // tx status flow
  markAwaitingPayment: () => set({ status: "awaiting_payment" }),
  markConfirming: (txHash) => set({ status: "confirming", txHash }),
  markSuccess: (txHash) => set({ status: "success", txHash }),
  markFailed: () => set({ status: "failed" }),

  // expiry
  expireQuote: () => set({ status: "expired" }),

  // reset everything
  reset: () =>
    set({
      step: "quote",
      fromSymbol: "USDT",
      toSymbol: "SOL",
      amountIn: "",
      userReceiveAddress: undefined,
      sellerDepositAddress: undefined,
      quote: undefined,
      status: "idle",
      txHash: undefined,
    }),
}));
