"use client";

import Link from "next/link";
import Image from "next/image";
import { motion as M } from "framer-motion";
import type { TargetAndTransition, Transition } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { blurIn } from "../../utils/animation";

// helper: returns props for a motion.div
const floatKf = (delay = 0): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
} => ({
  initial: { opacity: 0, y: 0, x: 0, rotate: 0 },
  animate: {
    opacity: 1,
    y: [0, -10, 0, 10, 0],
    x: [0, 6, 0, -6, 0],
    rotate: [0, 2, 0, -2, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      // Use a cubic-bezier to satisfy Transition typing
      ease: [0.42, 0, 0.58, 1], // ≈ ease-in-out
      delay,
    } as Transition,
  },
});

export default function Elementor() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <M.div
        variants={blurIn}
        initial="initial"
        animate="animate"
        className="
          relative mx-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5
          px-5 py-8 sm:px-8 sm:py-10 lg:px-10
          lg:absolute lg:left-0 lg:right-0 lg:top-[-100px]
        "
      >
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
          {/* Left floating column */}
          <div className="relative hidden h-full lg:block">
            <div className="pointer-events-none absolute inset-0">
              <M.div className="absolute left-2 top-2" {...floatKf(0)}>
                <Image
                  src="/promo-main-page/cag.svg"
                  alt="CAG logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
              <M.div className="absolute left-8 bottom-6" {...floatKf(1.2)}>
                <Image
                  src="/promo-main-page/dai.svg"
                  alt="DAI logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
              <M.div className="absolute right-4 top-12" {...floatKf(0.6)}>
                <Image
                  src="/promo-main-page/fun.svg"
                  alt="FUN logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
            </div>
          </div>

          {/* Center content */}
          <div className="text-center text-black-800">
            <h2 className="text-xl font-bold sm:text-2xl">Start Swapping Crypto</h2>
            <p className="mx-auto mt-2 max-w-md text-sm sm:text-base">
              Just make the first exchange to see how easy and profitable it is.
            </p>
            <div className="mt-5">
              <Link
                href="/exchange"
                className="inline-flex items-center gap-2 rounded-md bg-pumpkin-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pumpkin-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-500 focus-visible:ring-offset-2"
                aria-label="Create an exchange"
              >
                Create an exchange
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right floating column */}
          <div className="relative hidden h-full lg:block">
            <div className="pointer-events-none absolute inset-0">
              <M.div className="absolute right-4 top-2" {...floatKf(0.9)}>
                <Image
                  src="/promo-main-page/ioc.svg"
                  alt="IOC logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
              <M.div className="absolute left-6 top-16" {...floatKf(0.3)}>
                <Image
                  src="/promo-main-page/nxs.svg"
                  alt="NXS logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
              <M.div className="absolute right-10 bottom-4" {...floatKf(1.5)}>
                <Image
                  src="/promo-main-page/torn.svg"
                  alt="TORN logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </M.div>
            </div>
          </div>
        </div>
      </M.div>
    </div>
  );
}
