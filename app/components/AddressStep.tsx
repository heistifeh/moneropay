"use client";

import { useState, useEffect, useMemo } from "react";
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

// lucide icons
import {
  ArrowRightLeft,
  Wallet,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

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

/** --- UI helpers --- */
function TokenBadge({
  symbol,
  tone = "zinc",
}: {
  symbol?: string;
  tone?: "zinc" | "pumpkin";
}) {
  const toneCls =
    tone === "pumpkin"
      ? "bg-pumpkin-50 text-pumpkin-700 ring-pumpkin-200"
      : "bg-zinc-50 text-zinc-700 ring-zinc-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneCls}`}
    >
      <span className="rounded-md bg-white/70 px-1.5 py-0.5 font-semibold">
        {symbol ?? "—"}
      </span>
    </span>
  );
}

function CountdownPill({
  expired,
  countdown,
}: {
  expired: boolean;
  countdown: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
        expired ? "bg-rose-50 text-rose-700" : "bg-pumpkin-50 text-pumpkin-700"
      }`}
      aria-live="polite"
      role="status"
    >
      <Clock className="h-3.5 w-3.5" />
      {expired ? "Expired" : `Expires in ${countdown}`}
    </span>
  );
}

export default function AddressStep() {
  const { next, prev, quote, attachPayout } = useFlow();

  const [addr, setAddr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { label: countdown, expired } = useCountdown(
    quote?.expires_at ? Number(quote.expires_at) : undefined
  );

  const fromSymbol = quote?.base_symbol ?? "FROM";
  const toSymbol = quote?.quote_symbol ?? "TO";
  const rate = quote?.rate ?? 0;

  // dynamic helper hint for address format
  const addrHint = useMemo(() => {
    if (toSymbol === "SOL")
      return "Solana addresses are Base58, 32–44 chars.";
    if (toSymbol === "BTC")
      return "Bitcoin addresses can be bc1… (Bech32) or 1/3… (legacy).";
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
    if (evmSyms.has(toSymbol))
      return "EVM addresses start with 0x followed by 40 hex characters.";
    return undefined;
  }, [toSymbol]);

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

    setLoading(true);
    try {
      await attachPayout(quote.public_id, addr.trim());
      next();
    } catch (err) {
      console.error("Failed to attach payout:", err);
      setError("Backend error: could not save payout address.");
    } finally {
      setLoading(false);
    }
  };

  if (!quote) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow"
      >
        <p className="text-zinc-700">
          No active quote. Please go back and create one.
        </p>
        <m.button
          type="button"
          onClick={prev}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm sm:text-base hover:bg-zinc-50"
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </m.button>
      </m.div>
    );
  }

  const canContinue = !!addr && !expired && !error && !loading;

  return (
    <LayoutGroup>
      <m.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-5 sm:p-6 shadow"
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
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-zinc-900">
                <ArrowRightLeft className="h-5 w-5 text-zinc-500" />
                Your Quote
              </h3>

              <div className="mt-2 grid grid-cols-1 gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-600">You send:</span>
                  <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap tabular-nums overflow-x-auto">
                    {quote.amount_in} {fromSymbol}
                  </span>
                  <TokenBadge symbol={fromSymbol} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-600">You get:</span>
                  <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap tabular-nums overflow-x-auto">
                    {quote.amount_out.toFixed(6)} {toSymbol}
                  </span>
                  <TokenBadge symbol={toSymbol} tone="pumpkin" />
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-500 whitespace-nowrap overflow-x-auto">
                Rate locked at: 1 {fromSymbol} = {rate.toFixed(6)} {toSymbol}
              </p>
            </div>

            <m.div variants={reveal}>
              <CountdownPill expired={expired} countdown={countdown} />
            </m.div>
          </div>
        </m.section>

        {/* Address input */}
        <m.section variants={listItem} className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm text-zinc-600">
            <Wallet className="h-4 w-4 text-zinc-500" />
            Your {toSymbol} receive address
          </label>

          <div className="relative">
            <m.input
              variants={reveal}
              type="text"
              aria-invalid={!!error}
              aria-describedby={error ? "address-error" : "address-hint"}
              className={`w-full rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none transition focus:ring-2 ${
                error
                  ? "border-rose-300 focus:ring-rose-200"
                  : "border-zinc-200 focus:ring-pumpkin-200"
              } font-mono tracking-tight`}
              placeholder={`Paste your ${toSymbol} address`}
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              whileFocus={{ scale: 1.005 }}
              transition={layoutSpring}
              disabled={expired}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>

          {!error && addrHint && (
            <p id="address-hint" className="text-xs text-zinc-500">
              {addrHint}
            </p>
          )}

          <AnimatePresence>
            {error && (
              <m.p
                id="address-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-sm text-rose-600"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </m.p>
            )}
          </AnimatePresence>
        </m.section>

        {/* Nav buttons */}
        <m.div variants={listItem} className="grid grid-cols-2 gap-3">
          <m.button
            type="button"
            onClick={prev}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-sm sm:text-base text-zinc-800 transition hover:bg-zinc-50"
            {...press}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </m.button>
          <m.button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm sm:text-base font-semibold text-white transition ${
              !canContinue
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-black/90"
            }`}
            {...press}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </m.button>
        </m.div>
      </m.div>
    </LayoutGroup>
  );
}
