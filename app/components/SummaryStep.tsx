"use client";

import { useEffect } from "react";
import { motion as m, LayoutGroup } from "framer-motion";
import { VIEWPORT, listItem, inViewStagger } from "@/utils/animation";
import { useFlow } from "@/store/store";
import { useQuotePoller } from "@/hooks/useQuotePoller";

export default function SummaryStep() {
  const { quote, txHash, sellerDepositAddress, userReceiveAddress, reset } = useFlow();

  // keep backend status fresh
  useQuotePoller(quote?.public_id);

  // auto-reset once terminal state is reached
  useEffect(() => {
    if (!quote) return;
    if (["success", "failed", "expired"].includes(quote.status)) {
      // give user a short pause before resetting (e.g. 3s)
      const t = setTimeout(() => reset(), 3000);
      return () => clearTimeout(t);
    }
  }, [quote?.status, reset]);

  if (!quote) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow"
      >
        <p className="text-zinc-700">No active quote. Please start a new exchange.</p>
        <m.button
          onClick={reset}
          className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
        >
          Back to Start
        </m.button>
      </m.div>
    );
  }

  const formatNum = (val: number | string | null | undefined, digits = 6) => {
    const n = Number(val);
    return Number.isFinite(n) ? n.toFixed(digits) : "—";
  };

  return (
    <LayoutGroup>
      <m.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow"
      >
        {/* HEADER */}
        <m.header variants={listItem}>
          <h3 className="text-xl font-semibold text-zinc-900">Transaction Summary</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Status:{" "}
            <span
              className={`font-semibold ${
                quote.status === "success"
                  ? "text-green-600"
                  : quote.status === "failed" || quote.status === "expired"
                  ? "text-rose-600"
                  : "text-pumpkin-600"
              }`}
            >
              {quote.status}
            </span>
          </p>
        </m.header>

        {/* AMOUNTS */}
        <m.section variants={listItem} className="space-y-2">
          <p className="text-sm text-zinc-600">You send</p>
          <p className="font-semibold">
            {quote.amount_in} {quote.base_symbol}
          </p>
          <p className="text-sm text-zinc-600">You receive</p>
          <p className="font-semibold">
            {formatNum(quote.amount_out)} {quote.quote_symbol}
          </p>
          <p className="text-xs text-zinc-500">
            Rate locked: 1 {quote.base_symbol} = {formatNum(quote.rate)} {quote.quote_symbol}
          </p>
        </m.section>

        {/* ADDRESSES */}
        <m.section variants={listItem} className="space-y-2">
          <div>
            <p className="text-sm text-zinc-600">Deposit to seller</p>
            <p className="font-mono text-sm">{sellerDepositAddress ?? quote.deposit_address}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600">Your receive address</p>
            <p className="font-mono text-sm">{userReceiveAddress ?? quote.payout_address}</p>
          </div>
        </m.section>

        {/* TX HASH */}
        {txHash && (
          <m.section variants={listItem}>
            <p className="text-sm text-zinc-600">Transaction hash</p>
            <p className="font-mono text-sm break-all">{txHash}</p>
          </m.section>
        )}

        {/* NAV */}
        <m.div variants={listItem} className="flex justify-between gap-3">
          <m.button
            onClick={reset}
            className="flex-1 rounded-2xl border border-zinc-200 px-4 py-2 text-zinc-800 hover:bg-zinc-50"
          >
            New Exchange
          </m.button>
        </m.div>
      </m.div>
    </LayoutGroup>
  );
}
