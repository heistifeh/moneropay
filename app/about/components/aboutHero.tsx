// components/about/AboutHero.tsx
"use client";

import { motion as M } from "framer-motion";
import { pageTransition, revealUp, slide, VIEWPORT, lift } from "../../../utils/animation";
import Link from "next/link";

export default function AboutHero() {
  return (
    <M.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-block rounded-full bg-pumpkin-600/25 px-3 py-1 text-xs font-semibold text-pumpkin-100">
            About MoneroPay
          </span>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-pumpkin-50 sm:text-5xl">
            Private, fast, non-custodial crypto swaps—built for everyone
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pumpkin-100/90 sm:text-lg">
            We make privacy simple. No sign-ups, no custody—just straightforward
            exchanges sent directly to your wallet.
          </p>

          <M.div className="mt-6" whileHover={lift.whileHover} transition={lift.transition}>
            <Link
              href="/exchange"
              className="inline-flex items-center rounded-xl bg-pumpkin-200 px-6 py-3 text-sm font-semibold text-pumpkin-900 shadow-sm hover:bg-pumpkin-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-300"
            >
              Exchange now
            </Link>
          </M.div>
        </M.div>
      </div>
    </M.section>
  );
}
