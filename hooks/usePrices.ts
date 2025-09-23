// src/hooks/usePrices.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { PriceMap } from "@/lib/priceTypes";
import { fetchPrices } from "@/lib/prices";
import { ALL_CG_IDS } from "@/lib/constants";

type UsePricesOpts = {
  refreshMs?: number; // e.g., 25_000
  ids?: string[]; // default: ALL_CG_IDS
  maxBackoffMs?: number; // cap for exponential backoff (e.g., 60_000)
};

export function usePrices({
  refreshMs = 30_000,
  ids = ALL_CG_IDS,
  maxBackoffMs = 60_000,
}: UsePricesOpts = {}) {
  const [prices, setPrices] = useState<PriceMap>({});
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // holds the current retry delay (ms) when errors happen
  const backoffRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const p = await fetchPrices(ids);
      setPrices(p);
      setLastUpdated(Date.now());
      backoffRef.current = 0; // reset on success
    } catch (e: any) {
      const msg = e?.message ?? "Failed to fetch prices";
      setError(msg);

      // exponential backoff: 1s → 2s → 4s … (capped)
      backoffRef.current = Math.min(
        (backoffRef.current || 1000) * 2,
        maxBackoffMs
      );

      // one-off retry after backoff delay
      setTimeout(() => {
        load().catch(() => {});
      }, backoffRef.current);
    }
  }, [ids, maxBackoffMs]);

  useEffect(() => {
    // initial fetch immediately
    load();

    // steady refresh while things are healthy
    intervalRef.current = setInterval(() => {
      load();
    }, refreshMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load, refreshMs]);

  return { prices, lastUpdated, error, reload: load };
}
