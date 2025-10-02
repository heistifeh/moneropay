"use client";

import { useEffect, useState } from "react";
import { motion as m, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  VIEWPORT,
  reveal,
  inViewStagger,
  listItem,
  press,
  layoutSpring,
} from "@/utils/animation";
import { usePrices } from "@/hooks/usePrices";
import { ASSET_BY_SYMBOL, ASSETS, QUOTE_ASSETS } from "@/lib/constants";
import { AssetSelect } from "./ui/assetSelect";
import { useFlow } from "@/store/store";

const toNumber = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

export function QuoteStep() {
  const {
    prices,
    lastUpdated,
    error: priceError,
    reload,
  } = usePrices({
    refreshMs: 25_000,
  });

  const { next, createQuote } = useFlow();

  const [fromSymbol, setFromSymbol] = useState("USDT");
  const [toSymbol, setToSymbol] = useState("SOL");
  const [amountIn, setAmountIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromId = ASSET_BY_SYMBOL[fromSymbol]?.id;
  const toId = ASSET_BY_SYMBOL[toSymbol]?.id;
  const priceA = fromId ? prices?.[fromId] : undefined;
  const priceB = toId ? prices?.[toId] : undefined;

  const sameAsset = fromSymbol === toSymbol;
  const amountNum = toNumber(amountIn);
  const invalidAmount = !amountIn || Number.isNaN(amountNum) || amountNum <= 0;
  const canExchange = !invalidAmount && !sameAsset && !loading;

  const onSwap = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  const onExchange = async () => {
    if (!canExchange) return;
    setError(null);
    setLoading(true);

    try {
      await createQuote({
        base_symbol: fromSymbol,
        quote_symbol: toSymbol,
        chain:
          ASSET_BY_SYMBOL[toSymbol]?.chain ??
          ASSET_BY_SYMBOL[fromSymbol]?.chain ??
          "unknown",
        amount_in: amountNum,
      });
      next();
    } catch (err) {
      console.error("Failed to create quote", err);
      setError("Could not create quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [updatedAtLabel, setUpdatedAtLabel] = useState<string>("");
  useEffect(() => {
    if (!lastUpdated) return;
    setUpdatedAtLabel(new Date(lastUpdated).toLocaleTimeString());
  }, [lastUpdated]);

  return (
    <LayoutGroup>
      <m.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="space-y-6"
      >
        {/* HEADER */}
        <m.header
          variants={listItem}
          className="flex items-center justify-between"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">
            Exchange
          </h3>
          <m.span
            variants={reveal}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm ${
              priceError
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                priceError ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
            {priceError ? "Feed error" : "Live pricing"}
            {priceError && (
              <button
                onClick={reload}
                className="ml-2 rounded-md border border-rose-200 bg-white px-2 py-0.5 text-xs text-rose-700 hover:bg-rose-50"
              >
                Retry
              </button>
            )}
          </m.span>
        </m.header>

        {/* YOU SEND */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <label htmlFor="amount-in" className="text-xs text-zinc-500">
            You send
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
            <m.input
              id="amount-in"
              inputMode="decimal"
              placeholder="0.00"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-zinc-300"
              value={amountIn}
              onChange={(e) =>
                setAmountIn(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
            <AssetSelect
              value={fromSymbol}
              onChange={setFromSymbol}
              assets={ASSETS}
            />
          </div>
        </m.section>

        {/* SWAP */}
        <m.div variants={listItem} className="flex justify-center">
          <m.button
            type="button"
            onClick={onSwap}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-zinc-50"
            whileTap={{ scale: 0.97 }}
          >
            ⇅ Swap
          </m.button>
        </m.div>

        {/* YOU GET */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <label htmlFor="amount-out" className="text-xs text-zinc-500">
            You get (est.)
          </label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
            <m.output
              id="amount-out"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-base sm:text-lg tabular-nums"
            >
              {amountIn && priceA && priceB
                ? (
                    parseFloat(amountIn) * (priceA / priceB) || 0
                  ).toLocaleString(undefined, { maximumFractionDigits: 8 })
                : "—"}
            </m.output>
            <AssetSelect
              value={toSymbol}
              onChange={setToSymbol}
              assets={QUOTE_ASSETS}
            />
          </div>
          {priceA && priceB && (
            <div className="mt-2 text-xs text-zinc-500">
              1 {fromSymbol} ≈ {(priceA / priceB).toFixed(6)} {toSymbol}
            </div>
          )}
          <AnimatePresence>
            {sameAsset && (
              <m.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2 text-xs text-rose-600"
              >
                Choose two different assets.
              </m.div>
            )}
          </AnimatePresence>
        </m.section>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <m.div
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs sm:text-sm text-rose-700"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>

        {/* LAST UPDATED */}
        {updatedAtLabel && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Updated {updatedAtLabel}
          </div>
        )}

        {/* CTA */}
        <m.div variants={listItem}>
          <m.button
            type="button"
            disabled={!canExchange}
            onClick={onExchange}
            className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white transition ${
              !canExchange
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-black/90"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Creating quote…" : "Exchange"}
          </m.button>
        </m.div>
      </m.div>
    </LayoutGroup>
  );
}
