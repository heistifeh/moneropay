"use client";

import { useEffect } from "react";
import { motion as m } from "framer-motion";
import { useFlow } from "@/store/store";
import { useRouter } from "next/navigation";
import { Hourglass } from "lucide-react";

export default function ExpiredPage() {
  const { reset, quote } = useFlow();
  const router = useRouter();

  // Guard: redirect if not an expired quote
  useEffect(() => {
    if (!quote || quote.status !== "expired") {
      router.replace("/");
    }
  }, [quote, router]);

  if (!quote || quote.status !== "expired") return null;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 pt-25 pb-10">
      <m.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          w-full max-w-md
          rounded-2xl
          bg-white/90
          p-6 sm:p-8
          text-center
          shadow-xl
          backdrop-blur-md
        "
      >
        {/* Expired Icon */}
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100"
        >
          <Hourglass className="h-8 w-8 text-amber-600" />
        </m.div>

        {/* Heading */}
        <h1 className="mt-4 text-xl font-bold text-amber-700 sm:text-2xl">
          Quote Expired
        </h1>
        <p className="mt-2 text-sm text-zinc-600 sm:text-base">
          Your quote for exchanging {quote.base_symbol} → {quote.quote_symbol} has expired.
        </p>

        {/* Quote Details */}
        <div className="mt-6 space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 sm:text-base">
          <p>
            Original amount:{" "}
            <span className="font-semibold text-zinc-900">
              {quote.amount_in} {quote.base_symbol}
            </span>
          </p>
          <p>
            Expected to receive:{" "}
            <span className="font-semibold text-zinc-900">
              {quote.amount_out} {quote.quote_symbol}
            </span>
          </p>
        </div>

        {/* CTA */}
        <m.button
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="
            mt-8 w-full rounded-xl
            bg-amber-600 px-4 py-3
            text-sm font-semibold text-white
            shadow-sm transition hover:bg-amber-700
            sm:text-base
          "
          whileTap={{ scale: 0.97 }}
        >
          Get New Quote
        </m.button>
      </m.div>
    </div>
  );
}
