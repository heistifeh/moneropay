"use client";

import { create } from "zustand";

// --- Types ---
export type Quote = {
  public_id: string;
  base_symbol: string;
  quote_symbol: string;
  chain: string;
  amount_in: number;
  rate: number;
  amount_out: number;
  deposit_address: string;
  payout_address?: string | null;
  status: string;              // backend status
  expires_at: string;
  created_at: string;
  updated_at: string;
};

export type Step = "quote" | "address" | "summary";

// --- Store definition ---
type FlowStore = {
  step: Step;
  next: () => void;
  prev: () => void;
  reset: () => void;

  // Quote state
  quote: Quote | null;
  createQuote: (payload: {
    base_symbol: string;
    quote_symbol: string;
    chain: string;
    amount_in: number;
  }) => Promise<void>;
  attachPayout: (publicId: string, payoutAddress: string) => Promise<void>;
  refreshQuote: (publicId: string) => Promise<void>;

  // Client-only state
  txHash: string | null;
  setTxHash: (hash: string) => void;

  sellerDepositAddress: string | null;
  setSellerDepositAddress: (addr: string) => void;

  userReceiveAddress: string | null;
  setUserReceiveAddress: (addr: string) => void;

  // UI helpers
  markAwaitingPayment: () => void;
  markConfirming: (hash: string) => void;
  expireQuote: () => void;
};

export const useFlow = create<FlowStore>((set) => ({
  step: "quote",

  next: () =>
    set((s) => ({
      step:
        s.step === "quote"
          ? "address"
          : s.step === "address"
          ? "summary"
          : "quote",
    })),
  prev: () =>
    set((s) => ({
      step:
        s.step === "summary"
          ? "address"
          : s.step === "address"
          ? "quote"
          : "quote",
    })),
  reset: () =>
    set({
      step: "quote",
      quote: null,
      txHash: null,
      sellerDepositAddress: null,
      userReceiveAddress: null,
    }),

  quote: null,

  // --- API actions ---
  createQuote: async (payload) => {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create quote");
    const data: Quote = await res.json();
    set({ quote: data });
  },

  attachPayout: async (publicId, payoutAddress) => {
    const res = await fetch(`/api/quotes/${publicId}/payout`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payout_address: payoutAddress }),
    });
    if (!res.ok) throw new Error("Failed to attach payout address");
    const data: Quote = await res.json();
    set({ quote: data });
  },

  refreshQuote: async (publicId) => {
    const res = await fetch(`/api/quotes/${publicId}`);
    if (!res.ok) throw new Error("Failed to fetch quote");
    const data: Quote = await res.json();
    set({ quote: data });
  },

  // --- client-only setters ---
  txHash: null,
  setTxHash: (hash) => set({ txHash: hash }),

  sellerDepositAddress: null,
  setSellerDepositAddress: (addr) => set({ sellerDepositAddress: addr }),

  userReceiveAddress: null,
  setUserReceiveAddress: (addr) => set({ userReceiveAddress: addr }),

  // --- UI helpers ---
  markAwaitingPayment: () =>
    set((s) =>
      s.quote ? { quote: { ...s.quote, status: "awaiting_payment" } } : s
    ),

  markConfirming: (hash) =>
    set((s) =>
      s.quote
        ? { quote: { ...s.quote, status: "confirming" }, txHash: hash }
        : s
    ),

  expireQuote: () =>
    set((s) =>
      s.quote ? { quote: { ...s.quote, status: "expired" } } : s
    ),
}));
