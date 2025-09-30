"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Grid from "./ui/grid";
import { motion as M } from "framer-motion";
import {
  slide,
  inViewStagger,
  revealUp,
  pageTransition,
  VIEWPORT,
  lift,
} from "../../utils/animation"; // <- your animation file

export default function Features() {
  return (
    <M.section
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 md:pb-30"
    >
      {/* HERO */}
      <div className="mx-auto max-w-5xl bg-pumpkin-800/80 rounded-2xl">
        <div className="grid grid-cols-1 items-center gap-6 p-4 sm:p-6 lg:p-8 lg:grid-cols-12">
          {/* Left image (desktop only) */}
          <M.div
            variants={slide("left", 60, 0)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="hidden lg:block lg:col-span-4"
          >
            <Image
              src="/main_left_lg.webp"
              width={560}
              height={560}
              alt="Earn more as you level up"
              className="h-auto w-full rounded-xl"
              sizes="(min-width: 1024px) 33vw, 100vw"
              priority
            />
          </M.div>

          {/* Center content */}
          <M.div
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="text-center lg:col-span-4"
          >
            <span className="text-sm font-medium text-black-200">
              Move up Loyalty Program Levels
            </span>
            <h2 className="mt-2 text-2xl font-bold text-black-50 sm:text-3xl">
              Earn Cashback up to 0.4% in USDT
            </h2>

            <M.div
              variants={slide("up", 20, 0.05)}
              className="mx-auto mt-4 inline-flex items-center gap-2"
            >
              <Link
                href="/exchange"
                className="inline-flex items-center gap-2 rounded-md bg-pumpkin-500 px-4 py-2 text-sm font-semibold text-black-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-pumpkin-500/40"
                aria-label="Explore loyalty levels"
              >
                Explore
                <ArrowRight className="size-4" />
              </Link>
            </M.div>
          </M.div>

          {/* Right image (desktop only) */}
          <M.div
            variants={slide("right", 60, 0)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="hidden lg:block lg:col-span-4"
          >
            <Image
              src="/main_right_lg.webp"
              width={560}
              height={560}
              alt="Cashback illustration"
              className="h-auto w-full rounded-xl"
              sizes="(min-width: 1024px) 33vw, 100vw"
              priority
            />
          </M.div>

          {/* Mobile image (stacked) */}
          <M.div
            variants={slide("up", 30, 0.02)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="lg:hidden"
          >
            <Image
              src="/main_right_lg.webp"
              width={720}
              height={480}
              alt="Cashback illustration"
              className="mx-auto h-auto w-full rounded-xl"
              sizes="100vw"
              priority
            />
          </M.div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="mx-auto max-w-5xl py-14 sm:py-16">
        <M.div
          variants={inViewStagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2"
        >
          <Grid
            feature="Privacy"
            header="Sign-Up is not required"
            text="MoneroPays provides cryptocurrency exchange without registration."
            imageUrl="/privacy_pumpkin.webp"
          />
          <Grid
            feature="Wide choice"
            header="1500 cryptocurrencies"
            text="Hundreds of crypto and fiat currencies are available for exchange."
            imageUrl="/wide-choice_pumpkin.webp"
          />
          <Grid
            feature="24/7 support"
            header="You won't be left alone"
            text="Our support team is available 24/7 to help you with any issues."
            imageUrl="/support_pumpkin.webp"
          />
          <Grid
            feature="Safety"
            header="Non-custodial"
            text="Crypto is sent directly to your wallet — we do not store any funds."
            imageUrl="/safety_pumpkin.webp"
          />
        </M.div>
      </div>

      {/* BUY CRYPTO WITH FIAT */}
      <M.div
        variants={slide("up", 40, 0)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto mt-6 max-w-5xl rounded-xl bg-pumpkin-900 shadow-sm transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="flex flex-col items-center justify-between gap-8 p-6 sm:p-8 md:flex-row md:p-10">
          {/* Text */}
          <div className="w-full md:max-w-xl">
            <h3 className="text-2xl font-bold text-black-50 sm:text-3xl">
              Buy Crypto with Fiat
            </h3>

            <FeatureLine
              title="Simple"
              desc="Buy 30+ coins using your debit/credit card"
            />
            <FeatureLine
              title="Profitable"
              desc="Benefit from the market-leading rate"
            />
            <FeatureLine
              title="Safe"
              desc="Receive crypto directly to your wallet"
              last
            />

            <M.div whileHover={lift.whileHover} transition={lift.transition}>
              <Link
                href="/exchange"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-pumpkin-500 px-4 py-3 text-sm font-semibold text-black-50 sm:w-auto"
              >
                Create fiat exchange
              </Link>
            </M.div>
          </div>

          {/* Image */}
          <M.div
            variants={slide("left", 50, 0.05)}
            className="w-full md:w-auto"
          >
            <Image
              src="/buy-with-fiat_pumpkin.webp"
              alt="Buy crypto with fiat card"
              width={800} // give Next a big intrinsic source
              height={800}
              priority
              className="mx-auto h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl rounded-lg"
              sizes="(max-width: 640px) 90vw,
         (max-width: 768px) 70vw,
         (max-width: 1024px) 50vw,
         40vw"
            />
          </M.div>
        </div>
      </M.div>
    </M.section>
  );
}

/** Small subcomponent to keep the markup tidy */
function FeatureLine({
  title,
  desc,
  last = false,
}: {
  title: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className={`mt-4 flex items-start gap-3 ${last ? "mb-6" : ""}`}>
      <CheckCircle className="mt-0.5 size-5 text-pumpkin-500" />
      <div className="flex flex-col text-left">
        <span className="text-sm font-bold text-black-50 sm:text-base">
          {title}
        </span>
        <span className="text-sm font-semibold text-black-50 sm:text-base">
          {desc}
        </span>
      </div>
    </div>
  );
}
