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
import { useFlow } from "@/store/store";
import { ASSET_BY_SYMBOL } from "@/lib/constants";
import type { PriceMap } from "@/lib/priceTypes";
import { AssetSelect } from "./ui/assetSelect";

export function QuoteStep() {
  // live prices + status
  const { prices, lastUpdated, error, reload } = usePrices({
    refreshMs: 25_000,
  });

  // flow actions
  const { createQuote, next } = useFlow();

  // local UI state
  const [fromSymbol, setFromSymbol] = useState("USDT");
  const [toSymbol, setToSymbol] = useState("SOL");
  const [amountIn, setAmountIn] = useState("");

  // derived ids + prices
  const fromId = ASSET_BY_SYMBOL[fromSymbol].id;
  const toId = ASSET_BY_SYMBOL[toSymbol].id;
  const priceA = prices?.[fromId];
  const priceB = prices?.[toId];

  const rate = useMemo(() => {
    if (!priceA || !priceB) return NaN;
    return priceA / priceB; // TO per 1 FROM
  }, [priceA, priceB]);

  const amountOut = useMemo(() => {
    const n = parseFloat(amountIn);
    if (!Number.isFinite(n) || !Number.isFinite(rate)) return "";
    return String(n * rate);
  }, [amountIn, rate]);

  // validation
  const sameAsset = fromSymbol === toSymbol;
  const invalidAmount =
    !amountIn ||
    Number.isNaN(parseFloat(amountIn)) ||
    parseFloat(amountIn) <= 0;
  const missingPrices = !Number.isFinite(rate);
  const canExchange = !invalidAmount && !sameAsset && !missingPrices;

  // actions
  const onSwap = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    if (Number.isFinite(rate) && amountIn) {
      const inv = 1 / (rate as number);
      const newAmount = parseFloat(amountIn) * inv;
      if (Number.isFinite(newAmount)) setAmountIn(String(newAmount));
    }
  };

  const onExchange = () => {
    if (!canExchange) return;
    const amountInNum = parseFloat(amountIn);
    createQuote({
      prices: prices as PriceMap,
      fromId,
      toId,
      amountInNum,
    });
    next(); // advance to Address step
  };

  // hydration-safe timestamp (client-only)
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
        <m.header
          variants={listItem}
          className="flex items-center justify-between"
        >
          <h3 className="text-xl font-semibold">Exchange</h3>
          <m.span
            variants={reveal}
            className={`px-3 py-1 rounded-full text-sm ${
              missingPrices
                ? "bg-zinc-100 text-zinc-700"
                : "bg-pumpkin-50 text-pumpkin-700"
            }`}
          >
            {missingPrices ? "Pricing…" : "Live pricing"}
          </m.span>
        </m.header>

        {/* You send */}
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

        {/* Swap */}
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

        {/* You get */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-2xl border border-zinc-200 p-4 bg-white"
        >
          <label className="text-sm text-zinc-500">You get</label>
          <div className="mt-2 flex items-center gap-3">
            <m.output
              variants={reveal}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-lg"
            >
              {amountOut
                ? Number(amountOut).toLocaleString(undefined, {
                    maximumFractionDigits: 8,
                  })
                : "—"}
            </m.output>
            <m.div variants={reveal}>
              <AssetSelect value={toSymbol} onChange={setToSymbol} />
            </m.div>
          </div>

          <m.div variants={reveal} className="mt-2 text-xs text-zinc-500">
            Rate: 1 {fromSymbol} ≈{" "}
            {Number.isFinite(rate) ? (rate as number).toFixed(8) : "—"}{" "}
            {toSymbol}
            {priceA && priceB && (
              <span className="ml-2">
                (${priceA.toLocaleString()} → ${priceB.toLocaleString()})
              </span>
            )}
          </m.div>

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

        {/* Error + timestamp */}
        <AnimatePresence>
          {error && (
            <m.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800"
            >
              Price feed error: {error}.{" "}
              <button onClick={reload} className="underline">
                Retry
              </button>
            </m.div>
          )}
        </AnimatePresence>

        <m.div variants={listItem} className="text-xs text-zinc-500">
          {updatedAtLabel && <>Updated {updatedAtLabel} · auto-refreshing</>}
        </m.div>

        {/* CTA */}
        <m.div variants={listItem}>
          <m.button
            disabled={!canExchange}
            onClick={onExchange}
            className={`w-full rounded-2xl px-4 py-3 text-lg font-semibold text-white transition ${
              !canExchange
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black-600 hover:bg-black-800 cursor-pointer"
            }`}
            {...press}
          >
            Exchange
          </m.button>
        </m.div>

        <m.p variants={listItem} className="text-center text-xs text-zinc-500">
          Next step: paste your receive address. Quote locks for 10 minutes.
        </m.p>
      </m.div>
    </LayoutGroup>
  );
}
