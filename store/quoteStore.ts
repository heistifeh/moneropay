'use client';

import { create } from 'zustand';
import type { Quote } from '@/types/quote';
import { supabase } from '@/lib/supabase/client';
import { mapDbQuote } from '@/lib/caseMap';

type QuoteStore = {
  current?: Quote;
  loading: boolean;
  error?: string;
  _unsubscribe?: () => void;

  getQuote: (args: { fromSymbol: string; toSymbol: string; amountIn: string; chain?: string }) => Promise<void>;
  attachPayout: (payoutAddress: string) => Promise<void>;
  markUserPaid: (txInHash: string) => Promise<void>;
  subscribeToQuote: (publicId: string) => () => void;
  clear: () => void;
};

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  current: undefined,
  loading: false,
  error: undefined,
  _unsubscribe: undefined,

  // 1) Create Quote (calls Edge Function)
  async getQuote({ fromSymbol, toSymbol, amountIn, chain }) {
    set({ loading: true, error: undefined });
    try {
      const { data, error } = await supabase.functions.invoke('create-quote', {
        body: { fromSymbol, toSymbol, amountIn, chain },
      });
      if (error) throw error;

      const quote = mapDbQuote(data);
      set({ current: quote });

      // (Re)subscribe realtime for this quote
      const prev = get()._unsubscribe; if (prev) { try { prev(); } catch {} }
      const unsub = get().subscribeToQuote(quote.publicId);
      set({ _unsubscribe: unsub });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to create quote' });
    } finally {
      set({ loading: false });
    }
  },

  // 2) Attach payout address
  async attachPayout(payoutAddress) {
    const pubId = get().current?.publicId;
    if (!pubId) { set({ error: 'No active quote' }); return; }
    set({ loading: true, error: undefined });
    try {
      const { data, error } = await supabase.functions.invoke('attach-payout-address', {
        body: { publicId: pubId, payoutAddress },
      });
      if (error) throw error;
      set({ current: mapDbQuote(data) });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to attach payout address' });
    } finally {
      set({ loading: false });
    }
  },

  // 3) Mark user paid
  async markUserPaid(txInHash) {
    const pubId = get().current?.publicId;
    if (!pubId) { set({ error: 'No active quote' }); return; }
    set({ loading: true, error: undefined });
    try {
      const { data, error } = await supabase.functions.invoke('user-paid', {
        body: { publicId: pubId, txInHash },
      });
      if (error) throw error;
      set({ current: mapDbQuote(data) });
      // status will progress later via worker → realtime
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to submit payment' });
    } finally {
      set({ loading: false });
    }
  },

  // 4) Realtime subscription (keeps `current` fresh)
  subscribeToQuote(publicId) {
    const channel = supabase
      .channel(`quote:${publicId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'quote', filter: `public_id=eq.${publicId}` },
        (payload) => set({ current: mapDbQuote((payload as any).new) })
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  },

  // 5) Clear
  clear() {
    try { get()._unsubscribe?.(); } catch {}
    set({ _unsubscribe: undefined, current: undefined, error: undefined, loading: false });
  },
}));
