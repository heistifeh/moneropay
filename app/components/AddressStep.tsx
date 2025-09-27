"use client";

import { useState, useEffect } from "react";
import { motion as m, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  VIEWPORT,
  inViewStagger,
  listItem,
  reveal,
  press,
  layoutSpring,
} from "@/utils/animation";
import { useFlow } from "@/store/store";
import { useCountdown } from "@/hooks/useCountdown";

/** --- Validators --- */
const isEvmAddr = (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v.trim());
const isSolAddr = (v: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v.trim());
const isBtcAddr = (v: string) => {
  const s = v.trim();
  const bech32 = /^(bc1)[0-9ac-hj-np-z]{11,71}$/i.test(s);
  const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(s);
  return bech32 || legacy;
};

function validateBySymbol(symbol: string, addr: string): string | null {
  const v = addr.trim();
  if (!v) return "Address is required";
  const evmSyms = new Set([
    "ETH",
    "USDT",
    "USDC",
    "ARB",
    "OP",
    "MATIC",
    "BNB",
    "AVAX",
    "BASE",
    "FTM",
    "CRO",
  ]);
  if (symbol === "SOL") return isSolAddr(v) ? null : "Invalid Solana address";
  if (symbol === "BTC") return isBtcAddr(v) ? null : "Invalid Bitcoin address";
  if (evmSyms.has(symbol))
    return isEvmAddr(v) ? null : "Invalid EVM address (must be 0x + 40 hex)";
  return v.length < 10 ? "Address looks too short" : null;
}

/** --- UI helper --- */
function TokenBadge({
  symbol,
  name,
  tone = "zinc",
}: {
  symbol?: string;
  name?: string;
  tone?: "zinc" | "pumpkin";
}) {
  const toneCls =
    tone === "pumpkin"
      ? "bg-pumpkin-50 text-pumpkin-700 ring-pumpkin-200"
      : "bg-zinc-50 text-zinc-700 ring-zinc-200";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneCls}`}
    >
      <span className="rounded-md bg-white/70 px-1.5 py-0.5 font-semibold">
        {symbol ?? "—"}
      </span>
      <span className="truncate">{name ?? "Unknown"}</span>
    </span>
  );
}

export default function AddressStep() {
  const { next, prev, quote, attachPayout } = useFlow();

  const [addr, setAddr] = useState("");
  const [error, setError] = useState<string | null>(null);

  // countdown from quote expiry
  const { label: countdown, expired } = useCountdown(
    quote?.expires_at ? Number(quote.expires_at) : undefined
  );

  console.log("AddressStep quote:", quote);

  // prettified pieces
  const fromSymbol = quote?.base_symbol ?? "FROM";
  const toSymbol = quote?.quote_symbol ?? "TO";
  const rate = quote?.rate ?? 0;

  // live validation
  useEffect(() => {
    if (!addr) return setError(null);
    if (!quote) return setError("No active quote");
    setError(validateBySymbol(toSymbol, addr));
  }, [addr, quote, toSymbol]);

  const onContinue = async () => {
    if (!quote) return;
    const msg = validateBySymbol(toSymbol, addr);
    if (msg) return setError(msg);

    try {
      await attachPayout(quote.public_id, addr.trim()); // ✅ updates store
      next(); // move to Summary step
    } catch (err) {
      console.error("Failed to attach payout:", err);
      setError("Failed to save payout address. Please try again.");
    }
  };

  if (!quote) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow"
      >
        <p className="text-zinc-700">
          No active quote. Please go back and create one.
        </p>
        <m.button
          onClick={prev}
          className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
          whileTap={{ scale: 0.98 }}
        >
          Back
        </m.button>
      </m.div>
    );
  }

  const canContinue = !!addr && !expired && !error;

  return (
    <LayoutGroup>
      <m.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow"
      >
        {/* Quote summary */}
        <m.section
          variants={listItem}
          layout
          transition={layoutSpring}
          className="rounded-2xl border border-zinc-200 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-900">
                Your Quote
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-zinc-600">You send:</span>
                <span className="text-sm font-semibold text-zinc-900">
                  {quote.amount_in} {fromSymbol}
                </span>
                <TokenBadge symbol={fromSymbol} />
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-zinc-600">You get:</span>
                <span className="text-sm font-semibold text-zinc-900">
                  {quote.amount_out.toFixed(6)} {toSymbol}
                </span>
                <TokenBadge symbol={toSymbol} tone="pumpkin" />
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                Rate locked at: 1 {fromSymbol} = {rate.toFixed(6)} {toSymbol}
              </p>
            </div>

            {/* Countdown pill */}
            <m.span
              variants={reveal}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                expired
                  ? "bg-rose-50 text-rose-700"
                  : "bg-pumpkin-50 text-pumpkin-700"
              }`}
            >
              {expired ? "Expired" : `Expires in ${countdown}`}
            </m.span>
          </div>
        </m.section>

        {/* Address input */}
        <m.section variants={listItem} className="space-y-2">
          <label className="text-sm text-zinc-600">
            Your {toSymbol} receive address
          </label>

          <div className="relative">
            <m.input
              variants={reveal}
              type="text"
              aria-invalid={!!error}
              className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition focus:ring-2 ${
                error
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-zinc-200 focus:ring-pumpkin-200"
              }`}
              placeholder={`Paste your ${toSymbol} address`}
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              whileFocus={{ scale: 1.005 }}
              transition={layoutSpring}
            />
          </div>

          <AnimatePresence>
            {error && (
              <m.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-rose-600"
              >
                {error}
              </m.p>
            )}
          </AnimatePresence>
        </m.section>

        {/* Nav buttons */}
        <m.div variants={listItem} className="flex justify-between gap-3">
          <m.button
            onClick={prev}
            className="flex-1 rounded-2xl border border-zinc-200 px-4 py-2 text-zinc-800 transition hover:bg-zinc-50"
            {...press}
          >
            Back
          </m.button>
          <m.button
            onClick={onContinue}
            disabled={!canContinue}
            className={`flex-1 rounded-2xl px-4 py-2 text-white font-semibold transition ${
              !canContinue
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-black/90"
            }`}
            {...press}
          >
            Continue
          </m.button>
        </m.div>
      </m.div>
    </LayoutGroup>
  );
}
