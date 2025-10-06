"use client";

import { motion as M } from "framer-motion";
import { revealUp, slide, VIEWPORT, lift } from "../../utils/animation";
import { Mail, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const EMAIL = "support@moneropay.net";

export default function ContactHeader() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section className="bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block rounded-full bg-pumpkin-600/25 px-3 py-1 text-xs font-semibold text-pumpkin-100">
            Contact
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-pumpkin-50 sm:text-4xl">
            We’re here to help — 24/7
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pumpkin-100/90">
            Reach our support team anytime. Average response time is fast.
          </p>
        </M.div>

        <M.div
          variants={slide("up", 28)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-8 max-w-xl"
        >
          <div className="rounded-2xl border border-white/5 bg-pumpkin-900/40 p-4 sm:p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <a
                href={`mailto:${EMAIL}?subject=Support%20Request%20-%20MoneroPay`}
                className="inline-flex items-center gap-2 rounded-xl bg-pumpkin-200 px-4 py-3 font-semibold text-pumpkin-900 shadow-sm hover:bg-pumpkin-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>

              <M.button
                whileHover={lift.whileHover}
                transition={lift.transition}
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-pumpkin-800/40 px-4 py-3 text-sm font-semibold text-pumpkin-50 hover:bg-pumpkin-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
                aria-label="Copy support email to clipboard"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-pumpkin-300" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy email
                  </>
                )}
              </M.button>
            </div>

            <p className="mt-3 text-center text-xs text-pumpkin-100/70">
              Tip: include your transaction hash if you’re asking about a swap.
            </p>
          </div>
        </M.div>
      </div>
    </section>
  );
}
