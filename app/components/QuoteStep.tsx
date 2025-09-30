"use client";

import { useEffect, useMemo, useState } from "react";
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

/** Helpers */
const sanitizeAmount = (raw: string) => {
  // allow digits + single dot
  let v = raw.replace(/[^\d.]/g, "");
  const parts = v.split(".");
  if (parts.length > 2) v = `${parts[0]}.${parts.slice(1).join("")}`;
  return v;
};

const toNumber = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

export function QuoteStep() {
  // live prices (only for reference display)
  const {
    prices,
    lastUpdated,
    error: priceError,
    reload,
  } = usePrices({
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
  const fromId = ASSET_BY_SYMBOL[fromSymbol]?.id;
  const toId = ASSET_BY_SYMBOL[toSymbol]?.id;
  const priceA = fromId ? prices?.[fromId] : undefined;
  const priceB = toId ? prices?.[toId] : undefined;

  // validation
  const sameAsset = fromSymbol === toSymbol;
  const amountNum = toNumber(amountIn);
  const invalidAmount = !amountIn || Number.isNaN(amountNum) || amountNum <= 0;
  const canExchange = !invalidAmount && !sameAsset && !loading;

  // computed refs (display only)
  const rate = useMemo(() => {
    if (!priceA || !priceB) return null;
    return priceA / priceB;
  }, [priceA, priceB]);

  const estimatedOut = useMemo(() => {
    if (!rate || Number.isNaN(amountNum)) return null;
    return amountNum * rate;
  }, [rate, amountNum]);

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
        amount_in: amountNum,
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

  // a11y ids
  const sendLabelId = "send-label";
  const getLabelId = "get-label";
  const errorId = "quote-error";

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
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              priceError
                ? "bg-rose-50 text-rose-700"
                : "bg-pumpkin-50 text-pumpkin-700"
            }`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                priceError ? "bg-rose-500" : "bg-emerald-500"
              }`}
              aria-hidden
            />
            {priceError ? "Feed error" : "Live pricing"}
            {priceError && (
              <button
                type="button"
                onClick={reload}
                className="ml-2 inline-flex items-center rounded-md border border-rose-200 bg-white px-2 py-0.5 text-xs text-rose-700 hover:bg-rose-50"
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
          className="rounded-2xl border border-zinc-200 p-4 bg-white"
        >
          <label htmlFor="amount-in" className="text-sm text-zinc-500">
            You send
          </label>

          {/* Stack on mobile, row on small+ */}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
            <m.input
              id="amount-in"
              name="amount-in"
              variants={reveal}
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={invalidAmount ? "true" : "false"}
              aria-describedby="amount-help"
              // Smaller, tighter input on mobile; expands on larger screens
              className="w-full min-w-0 rounded-xl border border-zinc-200 px-3 py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-zinc-300"
              value={amountIn}
              onChange={(e) =>
                setAmountIn(e.target.value.replace(/[^0-9.]/g, ""))
              }
            />

            <m.div variants={reveal} className="sm:justify-self-end">
              {/* Full width on mobile so it doesn’t cramp; auto on larger screens */}
              <div className="w-full sm:w-auto">
                <AssetSelect value={fromSymbol} onChange={setFromSymbol} />
              </div>
            </m.div>
          </div>

          <div id="amount-help" className="mt-2 text-xs text-zinc-500">
            Up to 8 decimal places supported.
          </div>
        </m.section>

        {/* SWAP */}
        <m.div variants={listItem} className="flex justify-center">
          <m.button
            type="button"
            aria-label="Swap send and receive assets"
            onClick={onSwap}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
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
          <label className="text-sm text-zinc-500" htmlFor="amount-out">
            You get (est.)
          </label>

          {/* Stack on mobile, row on small+ */}
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
            <m.output
              id="amount-out"
              variants={reveal}
              aria-live="polite"
              // Smaller on mobile, grows at sm:, prevents overflow
              className="w-full min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-base sm:text-lg tabular-nums whitespace-nowrap overflow-x-auto"
            >
              {amountIn && priceA && priceB
                ? (
                    parseFloat(amountIn) * (priceA / priceB) || 0
                  ).toLocaleString(undefined, { maximumFractionDigits: 8 })
                : "—"}
            </m.output>

            <m.div variants={reveal} className="sm:justify-self-end">
              {/* Full width on mobile; auto on larger screens */}
              <div className="w-full sm:w-auto">
                <AssetSelect value={toSymbol} onChange={setToSymbol} />
              </div>
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
              id={errorId}
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
            >
              {error}
            </m.div>
          )}
        </AnimatePresence>

        <m.div
          variants={listItem}
          className="flex items-center gap-2 text-xs text-zinc-500"
          aria-live="polite"
        >
          {updatedAtLabel && (
            <>
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Updated {updatedAtLabel} · auto-refreshing
            </>
          )}
        </m.div>

        {/* CTA */}
        <m.div variants={listItem}>
          <m.button
            type="button"
            disabled={!canExchange}
            onClick={onExchange}
            className={`w-full rounded-2xl px-4 py-3 text-lg font-semibold text-white transition ${
              !canExchange
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            }`}
            {...press}
            aria-describedby={error ? errorId : undefined}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity="0.25"
                    strokeWidth="4"
                  />
                  <path
                    d="M22 12a10 10 0 0 0-10-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                Creating quote…
              </span>
            ) : (
              "Exchange"
            )}
          </m.button>
        </m.div>

        <m.p variants={listItem} className="text-center text-xs text-zinc-500">
          Next step: paste your receive address. Quote locks for 10 minutes.
        </m.p>
      </m.div>
    </LayoutGroup>
  );
}
