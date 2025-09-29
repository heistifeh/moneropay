"use client";

import Image from "next/image";
import { motion as M } from "framer-motion";
import {
  pageTransition,
  revealUp,
  inViewStagger,
  slide,
  listItem,
  VIEWPORT,
  lift,
} from "../../utils/animation";

type Fact = { title: string };

const FACTS: Fact[] = [
  { title: "Non-custodial: funds go directly to your wallet" },
  { title: "No registration required to start an exchange" },
  { title: "1500+ cryptocurrencies and major pairs supported" },
  { title: "Clear quotes up front — no hidden fees" },
  { title: "24/7 support for transaction lookups and help" },
];

export default function Facts() {
  return (
    <M.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700"
    >
      {/* soft vignette + accents */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-pumpkin-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-32 h-72 w-72 rounded-full bg-pumpkin-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Header */}
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block rounded-full bg-pumpkin-600/25 px-3 py-1 text-xs font-semibold text-pumpkin-100">
            Facts
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-pumpkin-50 sm:text-4xl">
            Facts About MoneroPay
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-pumpkin-100/90 sm:text-base">
            A quick look at why customers choose us for fast, private crypto swaps.
          </p>
        </M.div>

        {/* Content: 2 cols on lg (list + image) */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          {/* Left: Facts list */}
          <M.div
            variants={inViewStagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-white/5 bg-pumpkin-900/40 p-4 sm:p-5 lg:p-6 shadow-sm backdrop-blur">
              <ol className="space-y-4 sm:space-y-5">
                {FACTS.map((f, i) => (
                  <M.li key={i} variants={listItem}>
                    <FactRow index={i + 1} text={f.title} />
                  </M.li>
                ))}
              </ol>

              {/* CTA */}
              <M.div
                className="mt-6 flex flex-wrap items-center gap-3"
                whileHover={lift.whileHover}
                transition={lift.transition}
              >
                <a
                  href="/exchange"
                  className="inline-flex items-center rounded-xl bg-pumpkin-200 px-5 py-3 text-sm font-semibold text-pumpkin-900 shadow-sm hover:bg-pumpkin-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
                >
                  Exchange now
                </a>
                <span className="text-xs text-pumpkin-100/70">
                  No sign-up. Non-custodial by design.
                </span>
              </M.div>
            </div>
          </M.div>

          {/* Right: Image (placeholder) — visible on lg+ */}
          <M.div
            variants={slide("left", 50)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="relative hidden lg:col-span-5 lg:block"
          >
            <div className="rounded-2xl border border-white/5 bg-pumpkin-900/30 p-3 sm:p-4 shadow-sm backdrop-blur">
              {/* Replace `src` with your final asset; this is just a placeholder */}
              <Image
                src="/fact-monero.jpg"
                alt="Facts illustration"
                width={1600}
                height={1200}
                className="h-auto w-full rounded-xl object-cover"
                sizes="(min-width: 1024px) 40vw, 0px"
                priority={false}
              />
            </div>
            {/* caption vibe (optional) */}
            <p className="mt-3 text-center text-xs text-pumpkin-100/70">
              Visual overview of MoneroPay benefits
            </p>
          </M.div>
        </div>
      </div>
    </M.section>
  );
}

/** Single fact row with numbered badge */
function FactRow({ index, text }: { index: number; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pumpkin-500 text-sm font-extrabold text-pumpkin-900 ring-1 ring-pumpkin-200">
        {index}
      </div>
      <p className="min-w-0 flex-1 text-sm leading-7 text-pumpkin-50 sm:text-base sm:leading-7">
        {text}
      </p>
    </div>
  );
}
