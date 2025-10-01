"use client";

import { useState } from "react";
import { motion as M, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  pageTransition,
  inViewStagger,
  slide,
  revealUp,
  VIEWPORT,
  cardHover,
  press,
  lift,
} from "../../utils/animation";

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "What is MoneroPay and how does it work?",
    a: "MoneroPay lets you swap crypto quickly without registration. Choose a pair, enter your recipient address, send the deposit, and receive coins directly in your wallet.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. MoneroPay is non-custodial and does not require sign-up. You control your funds at all times.",
  },
  {
    q: "Which cryptocurrencies are supported?",
    a: "We support 1500+ cryptocurrencies and major stablecoins/fiat ramps. Availability can vary by region and liquidity.",
  },
  {
    q: "How long do exchanges take?",
    a: "Most swaps finalize in minutes after network confirmations. Exact timing depends on blockchain congestion and the pair you select.",
  },
  {
    q: "What are the fees?",
    a: "You’ll see a clear quoted rate before you confirm. Network fees are included or displayed upfront—no hidden charges.",
  },
  {
    q: "Is MoneroPay non-custodial?",
    a: "Yes. Funds are sent directly to your destination wallet. We never take custody of your assets.",
  },
  {
    q: "Can I track the status of my exchange?",
    a: "Yes. After initiating a swap, you can monitor confirmations and completion on the status screen (and via the provided link).",
  },
  {
    q: "What if I send the wrong amount?",
    a: "If the deposit differs from the quoted amount, the exchange may be recalculated or refunded based on policy and network conditions.",
  },
  {
    q: "Do you offer customer support?",
    a: "Our support operates 24/7 to help with transaction lookups, address issues, and verification of deposits.",
  },
  {
    q: "Is there a minimum or maximum amount?",
    a: "Minimums depend on network fees and pair liquidity; maximums depend on current market capacity. You’ll see limits before you confirm.",
  },
];

export default function FAQ() {
  // single-open behavior; set to true for multi-open accordions
  const allowMultiple = false;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    if (allowMultiple) {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(i)) {
          next.delete(i);
        } else {
          next.add(i);
        }
        return next;
      });
    } else {
      setOpenIndex((prev) => (prev === i ? null : i));
    }
  };

  const isOpen = (i: number) =>
    allowMultiple ? openSet.has(i) : openIndex === i;

  return (
    <M.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-24">
        {/* Header */}
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block rounded-full bg-pumpkin-600/20 px-3 py-1 text-xs font-semibold text-pumpkin-200">
            FAQ
          </span>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-pumpkin-50 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-pumpkin-200/90 sm:text-base">
            Everything you need to know about swapping with MoneroPay —
            security, timing, fees, and support.
          </p>
        </M.div>

        {/* Card wrapper */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/5 bg-pumpkin-900/40 p-2 sm:p-3 backdrop-blur">
          <M.ul
            variants={inViewStagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="divide-y divide-pumpkin-600/30"
            role="list"
          >
            {FAQS.map((item, i) => (
              <FAQItem
                key={item.q}
                i={i}
                q={item.q}
                a={item.a}
                open={isOpen(i)}
                onToggle={() => toggle(i)}
              />
            ))}
          </M.ul>
        </div>

        {/* CTA strip */}
        <M.div
          variants={slide("up", 24)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto mt-8 flex max-w-4xl items-center justify-between rounded-xl bg-pumpkin-800/60 p-4 sm:p-5 ring-1 ring-white/5"
        >
          <p className="text-sm text-pumpkin-100 sm:text-base">
            Still have questions? Our team is available 24/7.
          </p>
          <M.a
            href="/exchange"
            className="inline-flex items-center rounded-lg bg-pumpkin-200 px-4 py-2 text-sm font-semibold text-pumpkin-900 shadow-sm hover:bg-pumpkin-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
            whileHover={lift.whileHover}
            transition={lift.transition}
          >
            Exchange now
          </M.a>
        </M.div>
      </div>
    </M.section>
  );
}

/** FAQ item with accessible button + animated expand/collapse */
function FAQItem({
  i,
  q,
  a,
  open,
  onToggle,
}: {
  i: number;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <M.li variants={slide("up", 20)} className="group">
      <M.div
        className="rounded-xl p-2 sm:p-3 transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-pumpkin-900/20"
        whileHover={cardHover.whileHover}
        whileTap={press.whileTap}
        transition={cardHover.transition}
      >
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${i}`}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
        >
          <span className="flex-1 text-base font-semibold text-pumpkin-50 sm:text-lg">
            {q}
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-pumpkin-200 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <M.div
              id={`faq-panel-${i}`}
              initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
              animate={{
                height: "auto",
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                height: 0,
                opacity: 0,
                filter: "blur(4px)",
                transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
              }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-4 pt-1">
                <p className="max-w-[70ch] text-sm leading-7 text-pumpkin-100 sm:text-base sm:leading-7">
                  {a}
                </p>
              </div>
            </M.div>
          )}
        </AnimatePresence>
      </M.div>
    </M.li>
  );
}
