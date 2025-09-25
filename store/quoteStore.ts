'use client';

import { create } from 'zustand';
import type { Quote } from '@/types/quote';

type QuoteStore = {
  // the single source of truth for UI
  current?: Quote;

  // basic UX flags
  loading: boolean;
  error?: string;

  // actions (to be implemented in Phase 2)
  getQuote: (args: { fromSymbol: string; toSymbol: string; amountIn: string; chain?: string }) => Promise<void>;
  attachPayout: (payoutAddress: string) => Promise<void>;
  markUserPaid: (txInHash: string) => Promise<void>;
  subscribeToQuote: (publicId: string) => () => void;
  clear: () => void;
};

export const useQuoteStore = create<QuoteStore>(() => ({
  current: undefined,
  loading: false,
  error: undefined,

  // Phase 1 stubs (no local calculations, no mocks)
  async getQuote() {
    console.warn('getQuote() not implemented yet — Phase 2 will call backend and set `current`.');
  },

  async attachPayout() {
    console.warn('attachPayout() not implemented yet — Phase 2 will call backend and update `current`.');
  },

  async markUserPaid() {
    console.warn('markUserPaid() not implemented yet — Phase 2 will call backend and update `current`.');
  },

  subscribeToQuote() {
    console.warn('subscribeToQuote() not implemented yet — Phase 2 will open realtime and keep `current` fresh.');
    return () => {};
  },

  clear() {
    // keep simple — just reset
    return { current: undefined, loading: false, error: undefined };
  },
}));
