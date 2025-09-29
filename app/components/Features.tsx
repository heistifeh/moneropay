"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Grid from "./ui/grid";
import Link from "next/link";

export default function Features() {
  return (
    <section className="container mx-w-7xl mx-auto px-4 ">
      <div className="mx-auto flex items-center justify-around max-w-5xl bg-pumpkin-700">
        <div>
          <Image
            src="/main_left_lg.webp"
            width={500}
            height={500}
            alt="Main left"
          />
        </div>

        <div className="loyalty text-center ">
          <span className="text-black-200">Move up Loyalty Program Levels</span>
          <h2 className="text-black-50 text-2xl font-bold">
            Earn Cashback up to 0.4% in USDT
          </h2>
          <div className="flex items-center gap-2 mt-2 text-center">
            <span>Explore</span>
            <ArrowRight />
          </div>
        </div>

        <div>
          <Image
            src="/main_right_lg.webp"
            width={500}
            height={500}
            alt="Main right"
          />
        </div>
      </div>

      {/* GRIDS */}

      <div className="py-20 max-w-5xl mx-auto">
        {/* grids */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          {/* <div className="feature-privacy p-6">
            <div>

            <span className="text-black-300"> Privacy</span>
            <h2>Sign-Up</h2>
            </div>

            </div> */}

          <Grid
            feature="Privacy"
            header="Sign-Up is not required"
            text="MoneroPays provides cryptocurrency exchange without registration."
            imageUrl="/privacy.webp"
          />
          <Grid
            feature="Wide choice"
            header="1500 cryptocurrencies"
            text="Hundreds of Crypto and fiat currencies are available for exchange."
            imageUrl="/wide-choice.webp"
          />
          <Grid
            feature="24/7 support"
            header="You won't be left alone"
            text="Our support team is available 24/7 to help you with any issues."
            imageUrl="/support.webp"
          />
          <Grid
            feature="Safety"
            header="Non-custodial"
            text="Crypto is sent directly to your wallet, we do not store any funds."
            imageUrl="/safety.webp"
          />
        </div>
      </div>

      {/* BUY CRYPTO WITH FIAT */}
      <div className="py-10 max-w-5xl mx-auto mt-10 bg-pumpkin-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="px-10 flex items-center justify-between text-center">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl text-black-50 pb-4">
              Buy Crypto with Fiat
            </h2>
            <div className="flex gap-2 my-4">
              <CheckCircle className="text-pumpkin-500" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm sm:text-base text-black-50">
                  Simple
                </span>
                <span className="text-sm sm:text-base text-black-50 font-semibold">
                  Buy 30+ coins using your debit/credit card
                </span>
              </div>
            </div>
            <div className="flex gap-2 my-4">
              <CheckCircle className="text-pumpkin-500" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm sm:text-base text-black-50">
                  Profitable
                </span>
                <span className="text-sm sm:text-base text-black-50 font-semibold">
                  Benefit from the market-leading rate
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 mb-8">
              <CheckCircle className="text-pumpkin-500" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm sm:text-base text-black-50">
                  Safe
                </span>
                <span className="text-sm sm:text-base text-black-50 font-semibold">
                  Receive crypto directly to your wallet
                </span>
              </div>
            </div>

            <Link
              href="/exchange"
              className="flex items-center   w-xs h-xl gap-2 mt-4 bg-pumpkin-500 text-black-50 rounded-md p-4"
            >
              <span className="text-center mx-auto">Create fiat exchange</span>
            </Link>
          </div>

          <div>
            <Image
              src="/buy-with-fiat.webp"
              width={500}
              height={500}
              alt="Main right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
