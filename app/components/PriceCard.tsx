// app/components/prices/PriceCard.tsx
"use client";

import { motion as M } from "framer-motion";
import Image from "next/image";
import type { Asset } from "@/lib/constants";
import { cardHover, press, slide } from "../../utils/animation";

function fmtUSD(n?: number) {
  if (n == null) return "—";
  const opts: Intl.NumberFormatOptions = n >= 1
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
        rounded-2xl border border-white/5
        bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700
        p-4 shadow-sm
      "
    >
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pumpkin-500/20 blur-2xl" />
      </div>

      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-[var(--color-pumpkin-100)] ring-1 ring-[var(--color-pumpkin-200)] p-2">
          <Image
            src={iconSrc}
            alt={`${asset.name} icon`}
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-pumpkin-50">
            {asset.symbol}
            <span className="ml-2 font-normal text-pumpkin-100/70">{asset.name}</span>
          </div>
          <div className="mt-1 text-base font-bold leading-6 text-pumpkin-50">
            {fmtUSD(price)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {/* 24h chip */}
        <M.span
          animate={{ y: up ? [0, -2, 0] : [0, 2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className={`
            inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold
            ring-1
            ${up
              ? "bg-green-500/15 text-green-300 ring-green-500/30"
              : "bg-red-500/15 text-red-300 ring-red-500/30"}
          `}
        >
          {fmtPct(change24h)}
        </M.span>

        {/* CTA-ish micro-link (placeholder) */}
        <a
          href="#"
          className="text-xs font-semibold text-pumpkin-100/80 underline decoration-pumpkin-300/60 underline-offset-4 hover:text-pumpkin-50"
        >
          Trade
        </a>
      </div>
    </M.article>
  );
}
