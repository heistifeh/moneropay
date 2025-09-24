"use client";

import { motion as m } from "framer-motion";
import { VIEWPORT, blurIn, revealUp, layoutSpring } from "@/utils/animation";
import { QuoteStep } from "./QuoteStep";
import AddressStep from "./AddressStep";
import { useFlow } from "@/store/store";
import SummaryStep from "./SummaryStep";
import ProgressBar from "./ui/progressBar";

export default function ExchangePanel() {
  const step = useFlow((s) => s.step);
  return (
    <m.section
      variants={blurIn}
      initial="initial"
      animate="animate"
      className="mx-auto my-10 max-w-3xl"
    >
      <m.div
        layout
        transition={layoutSpring}
        // white background, crisp border, soft shadow — no blur/opacity layers
        className="rounded-2xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="space-y-5 text-zinc-800">
          {/* heading of panel */}
          <m.header
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="border-b border-zinc-200 py-5 text-center"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              Crypto Exchange
            </h2>
            <p className="text-xs text-zinc-500">
              Fast quotes. Smooth UX. Live pricing.
            </p>
          </m.header>

          {/* Exchange Point */}
          <div className="mx-auto max-w-2xl p-4 sm:p-6">
            <ProgressBar />
            {step === "quote" && <QuoteStep />}
            {step === "address" && <AddressStep />}
            {step === "summary" && <SummaryStep />}
          </div>
        </div>
      </m.div>
    </m.section>
  );
}
// src/components/ExchangePanel.tsx
