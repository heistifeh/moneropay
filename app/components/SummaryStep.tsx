"use client";

import { useEffect, useState } from "react";
import { motion as m, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  VIEWPORT,
  inViewStagger,
  listItem,
  reveal,
  revealUp,
  press,
  layoutSpring,
} from "@/utils/animation";
import { useFlow } from "@/store/store";
import { useCountdown } from "@/hooks/useCountdown";
import QRCode from "react-qr-code";

/** Small UI helper for symbol+name chip */
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
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneCls}`}>
      <span className="rounded-md bg-white/70 px-1.5 py-0.5 font-semibold">{symbol ?? "—"}</span>
      <span className="truncate">{name ?? "Unknown"}</span>
    </span>
  );
}

export default function SummaryStep() {
  const {
    quote,
    userReceiveAddress,
    sellerDepositAddress,
    setSellerDepositAddress,
    status,
    markAwaitingPayment,
    markConfirming,
    markSuccess,
    markFailed,
    expireQuote,
    reset,
    prev,
  } = useFlow();

  const { label: countdown, expired } = useCountdown(quote?.expiresAt);
  const [copied, setCopied] = useState(false);

  // Ensure we have a seller deposit address; move to awaiting_payment once quote exists
  useEffect(() => {
    if (!quote) return;
    if (!sellerDepositAddress) {
      // For demo: hardcode; in prod, fetch from backend by quote.id
      setSellerDepositAddress("0xSELLER_DEPOSIT_ADDRESS_DEMO");
    }
    if (status === "quoting") {
      markAwaitingPayment();
    }
  }, [quote, sellerDepositAddress, setSellerDepositAddress, status, markAwaitingPayment]);

  // Auto-expire when countdown hits zero
  useEffect(() => {
    if (expired && status !== "success" && status !== "failed") {
      expireQuote();
    }
  }, [expired, status, expireQuote]);

  const onCopy = async () => {
    if (!sellerDepositAddress) return;
    try {
      await navigator.clipboard.writeText(sellerDepositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onIHavePaid = async () => {
    if (expired || !quote) return;
    // In prod: POST /quotes/:id/paid then poll or subscribe for confirmations
    const demoHash = "0x_demo_tx_hash_123";
    markConfirming(demoHash);
    setTimeout(() => {
      // simulate success (or use markFailed() based on backend signal)
      markSuccess(demoHash);
    }, 3000);
  };

  if (!quote) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow"
      >
        <p className="text-zinc-700">No active quote. Please go back and create one.</p>
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

  // progress for countdown bar
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (!quote?.expiresAt) return;
    const now = Date.now();
    const total = quote.expiresAt - (quote.createdAt ?? now);
    const tick = () => {
      const n = Date.now();
      const rem = Math.max(0, quote.expiresAt - n);
      const pct = Math.max(0, Math.min(100, (rem / total) * 100));
      setProgress(pct);
    };
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [quote?.createdAt, quote?.expiresAt]);

  const disabled = expired || !sellerDepositAddress;

  const { fromSymbol, fromName, toSymbol, toName } = quote;

  return (
    <LayoutGroup>
      <m.section
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto w-full max-w-2xl space-y-6 rounded-3xl bg-white p-6 shadow"
      >
        <m.h2 variants={revealUp} className="text-xl font-semibold text-zinc-900">
          Confirm &amp; Pay
        </m.h2>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Send card */}
          <m.div variants={listItem} className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-zinc-500">Send exactly</div>
              <TokenBadge symbol={fromSymbol} name={fromName} />
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {quote.amountIn} {fromSymbol}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Locked rate: 1 {fromSymbol} ({fromName || "—"}) ≈ {quote.rate.toFixed(8)} {toSymbol} ({toName || "—"})
            </div>
          </m.div>

          {/* Receive card */}
          <m.div variants={listItem} className="rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm text-zinc-500">You will receive</div>
              <TokenBadge symbol={toSymbol} name={toName} tone="pumpkin" />
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              {quote.amountOut.toFixed(6)} {toSymbol}
            </div>
            <div className={`mt-2 text-xs ${expired ? "text-rose-600" : "text-zinc-500"}`}>
              {expired ? "Quote expired" : `Send before: ${countdown}`}
            </div>
          </m.div>
        </div>

        {/* Countdown pill + bar */}
        <m.div variants={listItem} className="rounded-2xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <m.span
              variants={reveal}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                expired ? "bg-rose-50 text-rose-700" : "bg-pumpkin-50 text-pumpkin-700"
              }`}
            >
              {expired ? "Expired" : `Expires in ${countdown}`}
            </m.span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "tween", duration: 0.25 }}
                className={`h-full ${expired ? "bg-rose-400" : "bg-pumpkin-500"}`}
              />
            </div>
          </div>
        </m.div>

        {/* Addresses */}
        <m.div variants={listItem} className="rounded-2xl border border-zinc-200 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Seller deposit */}
            <div>
              <div className="mb-1 text-sm text-zinc-500">
                Pay to (seller’s deposit address)
              </div>
              <div className="font-mono text-sm break-all text-zinc-800">
                {sellerDepositAddress || "Loading…"}
              </div>

              {/* Actions: copy + QR (optional) */}
              <div className="mt-3 flex items-center gap-2">
                <m.button
                  onClick={onCopy}
                  disabled={!sellerDepositAddress}
                  className={`rounded-xl border border-zinc-200 px-3 py-2 text-sm transition ${
                    sellerDepositAddress ? "bg-white hover:bg-zinc-50" : "cursor-not-allowed opacity-50"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {copied ? "Copied!" : "Copy address"}
                </m.button>

                <div className="hidden sm:block rounded-xl border border-zinc-200 p-2 bg-white">
                  <QRCode value={sellerDepositAddress || ""} size={92} />
                </div>
              </div>
            </div>

            {/* User receive */}
            <div>
              <div className="mb-1 text-sm text-zinc-500">Your receive address</div>
              <div className="font-mono text-sm break-all text-zinc-800">
                {userReceiveAddress}
              </div>
            </div>
          </div>
        </m.div>

        {/* Status banner */}
        <m.div
          variants={listItem}
          className={`rounded-xl border p-3 text-sm ${
            expired
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-pumpkin-200 bg-pumpkin-50 text-pumpkin-800"
          }`}
        >
          {expired
            ? "This quote has expired. Start over to request a new one."
            : "Please send the exact amount to the deposit address before the timer ends."}
        </m.div>

        {/* Actions */}
        <m.div variants={listItem} className="flex flex-col gap-2 sm:flex-row">
          <m.button
            onClick={onIHavePaid}
            disabled={disabled || status === "confirming" || status === "success"}
            className={`flex-1 rounded-2xl px-4 py-3 text-white font-semibold transition ${
              disabled ? "cursor-not-allowed bg-zinc-300" : "bg-black hover:bg-black/90"
            }`}
            {...press}
          >
            I’ve sent the funds
          </m.button>
          <m.button
            onClick={reset}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-zinc-800 transition hover:bg-zinc-50"
            {...press}
          >
            Start over
          </m.button>
        </m.div>

        {/* Status line */}
        <StatusLine />
      </m.section>
    </LayoutGroup>
  );
}

function StatusLine() {
  const { status, txHash } = useFlow();

  const steps = [
    { key: "awaiting_payment", label: "Awaiting payment" },
    { key: "confirming", label: "Confirming" },
    { key: "success", label: "Success" },
  ] as const;

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === (status === "quoting" ? "awaiting_payment" : status))
  );

  return (
    <m.div variants={listItem} className="mt-2">
      <div className="relative">
        {/* track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-zinc-100" />
        {/* progress */}
        <m.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-pumpkin-500"
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
          transition={{ type: "tween", duration: 0.4 }}
        />
        <div className="relative z-10 grid grid-cols-3">
          {steps.map((s, i) => {
            const active = i <= activeIndex && status !== "failed" && status !== "expired";
            return (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <m.div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ring-1 ${
                    active ? "bg-pumpkin-500 text-white ring-pumpkin-500" : "bg-white text-zinc-400 ring-zinc-200"
                  }`}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: active ? 1 : 0.95, opacity: 1 }}
                  transition={layoutSpring}
                >
                  {i < activeIndex ? "✓" : i + 1}
                </m.div>
                <div className={`text-xs ${active ? "text-pumpkin-700" : "text-zinc-500"}`}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {txHash && (
        <div className="mt-3 text-xs text-zinc-500">
          Tracking tx: <span className="font-mono">{txHash.slice(0, 10)}…</span>
        </div>
      )}
      {(status === "failed" || status === "expired") && (
        <div className="mt-3 text-xs text-rose-600">
          {status === "failed" ? "Transaction failed." : "Quote expired."}
        </div>
      )}
    </m.div>
  );
}
