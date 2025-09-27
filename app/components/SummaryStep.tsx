"use client";

import { motion as m, LayoutGroup } from "framer-motion";
import { VIEWPORT, listItem, inViewStagger, reveal } from "@/utils/animation";
import { useFlow } from "@/store/store";
import { useQuotePoller } from "@/hooks/useQuotePoller";

export default function SummaryStep() {
  const { quote, txHash, sellerDepositAddress, userReceiveAddress, prev, reset } = useFlow();

  // keep backend status fresh
  useQuotePoller(quote?.public_id);

  if (!quote) {
    return (
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow"
      >
        <p className="text-zinc-700">No active quote. Please go back and create one.</p>
        <m.button
          onClick={prev}
          className="mt-4 rounded-xl border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
        >
          Back
        </m.button>
      </m.div>
    );
  }

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
                quote.status === "completed"
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
            {quote.amount_out.toFixed(6)} {quote.quote_symbol}
          </p>
          <p className="text-xs text-zinc-500">
            Rate locked: 1 {quote.base_symbol} = {quote.rate.toFixed(6)} {quote.quote_symbol}
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
