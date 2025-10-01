"use client";

import { useEffect } from "react";
import { motion as m, LayoutGroup } from "framer-motion";
import { VIEWPORT, listItem, inViewStagger } from "@/utils/animation";
import { useFlow } from "@/store/store";
import { useQuotePoller } from "@/hooks/useQuotePoller";
import { useRouter } from "next/navigation";

// icons + qr code
import { ArrowRightLeft, Wallet, Hash, RefreshCcw, Copy } from "lucide-react";
import QRCode from "react-qr-code";

export default function SummaryStep() {
  const { quote, txHash, userReceiveAddress, reset } = useFlow();

  useQuotePoller(quote?.public_id);
  const router = useRouter();

  useEffect(() => {
    if (!quote) return;
    if (quote.status === "success") {
      router.replace("/success");
    } else if (quote.status === "failed") {
      router.replace("/failed");
    } else if (quote.status === "expired") {
      router.replace("/expired");
    }
  }, [quote, router]);

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
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 hover:bg-zinc-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Back to Start
        </m.button>
      </m.div>
    );
  }

  const formatNum = (val: number | string | null | undefined, digits = 6) => {
    const n = Number(val);
    return Number.isFinite(n) ? n.toFixed(digits) : "—";
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <LayoutGroup>
      <m.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto w-full max-w-md space-y-8 rounded-3xl bg-white p-6 shadow"
      >
        {/* HEADER */}
        <m.header variants={listItem} className="text-center space-y-1">
          <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold text-zinc-900">
            <ArrowRightLeft className="h-5 w-5 text-pumpkin-600" />
            Transaction Summary
          </h3>
          <p className="text-sm text-zinc-500">
            Status:{" "}
            <span
              className={`font-semibold ${
                quote.status === "success"
                  ? "text-green-600"
                  : ["failed", "expired"].includes(quote.status)
                  ? "text-rose-600"
                  : "text-pumpkin-600"
              }`}
            >
              {quote.status}
            </span>
          </p>
        </m.header>

        {/* AMOUNTS */}
        <m.section
          variants={listItem}
          className="rounded-2xl border border-zinc-200 p-4 space-y-2"
        >
          <p className="text-sm text-zinc-600">You send</p>
          <p className="font-semibold text-lg">
            {formatNum(quote.amount_in)} {quote.base_symbol}
          </p>
          <p className="text-sm text-zinc-600">You receive</p>
          <p className="font-semibold text-lg">
            {formatNum(quote.amount_out)} {quote.quote_symbol}
          </p>
          <p className="text-xs text-zinc-500">
            Rate locked: 1 {quote.base_symbol} = {formatNum(quote.rate)} {quote.quote_symbol}
          </p>
        </m.section>

        {/* ADDRESSES */}
        <m.section
          variants={listItem}
          className="rounded-2xl border border-zinc-200 p-4 space-y-4"
        >
          {/* Deposit */}
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Wallet className="h-4 w-4" />
              Deposit to seller
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-sm break-all flex-1">
                {quote.deposit_address ?? "Fetching deposit address…"}
              </p>
              {quote.deposit_address && (
                <button
                  onClick={() => copyToClipboard(quote.deposit_address!)}
                  className="p-1 rounded hover:bg-zinc-100"
                >
                  <Copy className="h-4 w-4 text-zinc-500" />
                </button>
              )}
            </div>

            {/* QR Code */}
            {quote.deposit_address && (
              <div className="mt-3 flex justify-center">
                <div className="rounded-lg bg-white p-2 shadow-inner">
                  <QRCode value={quote.deposit_address} size={128} />
                </div>
              </div>
            )}
          </div>

          {/* Payout */}
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Wallet className="h-4 w-4" />
              Your receive address
            </p>
            <p className="font-mono text-sm break-all">
              {userReceiveAddress ?? quote.payout_address ?? "Not provided"}
            </p>
          </div>
        </m.section>

        {/* TX HASH */}
        {txHash && (
          <m.section
            variants={listItem}
            className="rounded-2xl border border-zinc-200 p-4"
          >
            <p className="flex items-center gap-1.5 text-sm text-zinc-600">
              <Hash className="h-4 w-4" />
              Transaction hash
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-sm break-all flex-1">{txHash}</p>
              <button
                onClick={() => copyToClipboard(txHash)}
                className="p-1 rounded hover:bg-zinc-100"
              >
                <Copy className="h-4 w-4 text-zinc-500" />
              </button>
            </div>
          </m.section>
        )}

        {/* NAV */}
        <m.div variants={listItem} className="flex justify-center">
          <m.button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-4 py-2 text-zinc-800 hover:bg-zinc-50"
          >
            <RefreshCcw className="h-4 w-4" />
            New Exchange
          </m.button>
        </m.div>
      </m.div>
    </LayoutGroup>
  );
}
