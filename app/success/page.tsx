"use client";

import { useEffect } from "react";
import { motion as m } from "framer-motion";
import { useFlow } from "@/store/store";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const { reset, quote } = useFlow();
  const router = useRouter();

  // Redirect home if no active quote
  useEffect(() => {
    if (!quote) router.replace("/");
  }, [quote, router]);

  return (
    <main className="flex flex-col items-center justify-center pt-24 pb-12">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full rounded-3xl bg-white p-8 text-center shadow-xl"
      >
        {/* Success Icon */}
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </m.div>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold text-green-600">
          Exchange Successful
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your {quote?.base_symbol} was successfully exchanged for{" "}
          {quote?.quote_symbol}.
        </p>

        {/* Transaction Details */}
        <div className="mt-6 space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-700">
          <p>
            Sent:{" "}
            <span className="font-semibold text-zinc-900">
              {quote?.amount_in} {quote?.base_symbol}
            </span>
          </p>
          <p>
            Received:{" "}
            <span className="font-semibold text-zinc-900">
              {quote?.amount_out} {quote?.quote_symbol}
            </span>
          </p>
        </div>

        {/* CTA */}
        <m.button
          onClick={() => {
            router.push("/");
            reset();
          }}
          className="mt-8 w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
          whileTap={{ scale: 0.98 }}
        >
          Start New Exchange
        </m.button>
      </m.div>
    </main>
  );
}
