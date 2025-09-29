// components/about/FinalCTA.tsx
"use client";

import Link from "next/link";
import { motion as M } from "framer-motion";
import { revealUp, VIEWPORT, lift } from "../../../utils/animation";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-pumpkin-800 to-pumpkin-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <h3 className="text-2xl font-semibold text-pumpkin-50 sm:text-3xl">
            Ready to swap privately?
          </h3>
          <p className="mt-2 text-pumpkin-100/90">
            Start an exchange in seconds. No sign-up, no custody—just your
            wallet.
          </p>
          <M.div
            className="mt-6"
            whileHover={lift.whileHover}
            transition={lift.transition}
          >
            <Link
              href="/exchange"
              className="inline-flex items-center rounded-xl bg-pumpkin-200 px-6 py-3 text-sm font-semibold text-pumpkin-900 shadow-sm hover:bg-pumpkin-100"
            >
              Exchange now
            </Link>
          </M.div>
        </M.div>
      </div>
    </section>
  );
}
