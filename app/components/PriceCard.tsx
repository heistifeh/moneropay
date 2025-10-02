"use client";

import { motion as M } from "framer-motion";
import Image from "next/image";
import type { Asset } from "@/lib/constants";
import { cardHover, press, slide } from "../../utils/animation";

function fmtUSD(n?: number) {
  if (n == null) return "—";
  const opts: Intl.NumberFormatOptions =
    n >= 1
      ? { style: "currency", currency: "USD", maximumFractionDigits: 2 }
      : { style: "currency", currency: "USD", maximumFractionDigits: 6 };
  return new Intl.NumberFormat("en-US", opts).format(n);
}

function fmtPct(n?: number) {
  if (n == null) return "—";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}

export default function PriceCard({
  asset,
  price,
  change24h,
  iconSrc,
}: {
  asset: Asset;
  price?: number;
  change24h?: number;
  iconSrc: string;
}) {
  const up = (change24h ?? 0) >= 0;

  return (
    <M.article
      variants={slide("up", 24)}
      initial="hidden"
      animate="show"
      whileHover={cardHover.whileHover}
      whileTap={press.whileTap}
      transition={cardHover.transition}
      className="
        group relative overflow-hidden
        rounded-2xl border border-white/10
        bg-zinc-900/80 backdrop-blur-sm
        p-5 shadow-md
      "
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pumpkin-500 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-zinc-800 p-2">
          <Image
            src={iconSrc}
            alt={`${asset.name} icon`}
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">
            {asset.symbol}
            <span className="ml-2 font-normal text-zinc-400">
              {asset.name}
            </span>
          </div>
          <div className="mt-1 text-lg font-bold leading-6 text-white">
            {fmtUSD(price)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        {/* 24h Change Chip */}
        <span
          className={`
            inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold
            border
            ${up
              ? "bg-green-500/15 text-green-400 border-green-500/30"
              : "bg-red-500/15 text-red-400 border-red-500/30"}
          `}
        >
          {fmtPct(change24h)}
        </span>

        {/* Placeholder micro-link */}
        <a
          href="#"
          className="text-xs font-semibold text-pumpkin-300 underline decoration-pumpkin-500 underline-offset-4 hover:text-pumpkin-100"
        >
          Trade
        </a>
      </div>
    </M.article>
  );
}
