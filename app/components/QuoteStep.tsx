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
import { ASSET_BY_SYMBOL } from "@/lib/constants";
import { AssetSelect } from "./ui/assetSelect";
import { useFlow } from "@/store/store";

export function QuoteStep() {
  // live prices (only for reference display)
  const { prices, lastUpdated, error: priceError, reload } = usePrices({
    refreshMs: 25_000,
  });

  // zustand actions
  const { next, createQuote } = useFlow();

  // local UI state
  const [fromSymbol, setFromSymbol] = useState("USDT");
  const [toSymbol, setToSymbol] = useState("SOL");
  const [amountIn, setAmountIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derived ids + prices (for UI only)
  const fromId = ASSET_BY_SYMBOL[fromSymbol].id;
  const toId = ASSET_BY_SYMBOL[toSymbol].id;
  const priceA = prices?.[fromId];
  const priceB = prices?.[toId];

  // validation
  const sameAsset = fromSymbol === toSymbol;
  const invalidAmount =
    !amountIn ||
    Number.isNaN(parseFloat(amountIn)) ||
    parseFloat(amountIn) <= 0;
  const canExchange = !invalidAmount && !sameAsset;

  // swap helper
  const onSwap = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  // call backend
  const onExchange = async () => {
    if (!canExchange) return;
    setError(null);
    setLoading(true);

    try {
      await createQuote({
        base_symbol: fromSymbol,
        quote_symbol: toSymbol,
        chain: "EVM", // TODO: detect by asset
        amount_in: parseFloat(amountIn),
      });
      next(); // advance to Address step
    } catch (err) {
      console.error("Failed to create quote", err);
      setError("Could not create quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // hydration-safe timestamp
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
        className="space-y-5"
      >
        {/* HEADER */}
        <m.header
          variants={listItem}
          className="flex items-center justify-between"
        >
          <h3 className="text-xl font-semibold">Exchange</h3>
          <m.span
            variants={reveal}
            className={`px-3 py-1 rounded-full text-sm ${
              priceError
                ? "bg-rose-50 text-rose-700"
                : "bg-pumpkin-50 text-pumpkin-700"
            }`}
          >
            {priceError ? "Feed error" : "Live pricing"}
          </m.span>
        </m.header>

        {/* YOU SEND */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-2xl border border-zinc-200 p-4 bg-white"
        >
          <label className="text-sm text-zinc-500">You send</label>
          <div className="mt-2 flex items-center gap-3">
            <m.input
              variants={reveal}
              inputMode="decimal"
              placeholder="0.00"
              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-300"
              value={amountIn}
              onChange={(e) =>
                setAmountIn(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />
            <m.div variants={reveal}>
              <AssetSelect value={fromSymbol} onChange={setFromSymbol} />
            </m.div>
          </div>
        </m.section>

        {/* SWAP */}
        <m.div variants={listItem} className="flex justify-center">
          <m.button
            onClick={onSwap}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm bg-white hover:bg-zinc-50"
            whileHover={{ rotate: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={layoutSpring}
          >
            ⇅ Swap
          </m.button>
        </m.div>

        {/* YOU GET (reference only, backend gives final) */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-2xl border border-zinc-200 p-4 bg-white"
        >
          <label className="text-sm text-zinc-500">You get (est.)</label>
          <div className="mt-2 flex items-center gap-3">
            <m.output
              variants={reveal}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-lg"
            >
              {amountIn && priceA && priceB
                ? (
                    (parseFloat(amountIn) * (priceA / priceB)) || 0
                  ).toLocaleString(undefined, { maximumFractionDigits: 8 })
                : "—"}
            </m.output>
            <m.div variants={reveal}>
              <AssetSelect value={toSymbol} onChange={setToSymbol} />
            </m.div>
          </div>

          {priceA && priceB && (
            <m.div variants={reveal} className="mt-2 text-xs text-zinc-500">
              Market: 1 {fromSymbol} ≈ {(priceA / priceB).toFixed(8)} {toSymbol}
              <span className="ml-2">
                (${priceA.toLocaleString()} → ${priceB.toLocaleString()})
              </span>
            </m.div>
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

        {/* ERROR + TIMESTAMP */}
        <AnimatePresence>
          {error && (
            <m.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>

        <m.div variants={listItem} className="text-xs text-zinc-500">
          {updatedAtLabel && <>Updated {updatedAtLabel} · auto-refreshing</>}
        </m.div>

        {/* CTA */}
        <m.div variants={listItem}>
          <m.button
            disabled={!canExchange || loading}
            onClick={onExchange}
            className={`w-full rounded-2xl px-4 py-3 text-lg font-semibold text-white transition ${
              !canExchange || loading
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-black/90"
            }`}
            {...press}
          >
            {loading ? "Creating quote…" : "Exchange"}
          </m.button>
        </m.div>

        <m.p variants={listItem} className="text-center text-xs text-zinc-500">
          Next step: paste your receive address. Quote locks for 10 minutes.
        </m.p>
      </m.div>
    </LayoutGroup>
  );
}
