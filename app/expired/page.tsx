"use client";

import { useEffect } from "react";
import { motion as m } from "framer-motion";
import { useFlow } from "@/store/store";
import { useRouter } from "next/navigation";

export default function ExpiredPage() {
  const { reset, quote } = useFlow();
  const router = useRouter();

  // If no active quote, redirect home
  useEffect(() => {
    if (!quote) router.replace("/");
  }, [quote, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-6">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full rounded-3xl bg-white p-8 text-center shadow"
      >
        <h1 className="text-2xl font-semibold text-amber-600">
          Quote Expired ⏳
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your quote for exchanging {quote?.base_symbol} → {quote?.quote_symbol} has expired.
        </p>

        <div className="mt-6 space-y-1 text-sm text-zinc-500">
          <p>
            Original amount:{" "}
            <span className="font-semibold">
              {quote?.amount_in} {quote?.base_symbol}
            </span>
          </p>
          <p>
            Expected to receive:{" "}
            <span className="font-semibold">
              {quote?.amount_out} {quote?.quote_symbol}
            </span>
          </p>
        </div>

        <m.button
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="mt-8 w-full rounded-2xl bg-black px-4 py-3 font-semibold text-white hover:bg-black/90"
          whileTap={{ scale: 0.98 }}
        >
          Get New Quote
        </m.button>
      </m.div>
    </main>
  );
}
