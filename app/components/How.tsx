"use client";

import {
  CurrencyIcon,
  SendHorizontalIcon,
  ThumbsUpIcon,
  WalletCards,
} from "lucide-react";
import Step from "./ui/step";
import { motion as M } from "framer-motion";
import {
  inViewStagger,
  slide,
  revealUp,
  VIEWPORT,
} from "../../utils/animation";

export default function How() {
  return (
    <section className="bg-black-50 px-4 py-12 sm:px-6 lg:px-8">
      <M.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-6xl"
      >
        <h2 className="py-2 text-2xl font-semibold sm:text-3xl">
          How It Works
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-black-400 sm:text-base">
          Swap crypto in four quick steps.
        </p>
      </M.div>

      <M.div
        variants={inViewStagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
      >
        <M.div variants={slide("up", 24)}>
          <Step
            icon={<CurrencyIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            color="text-teal-400"
            title="Choose a currency pair"
            description="Select the currencies you want to swap and click the Exchange button."
            index={1}
            connectorRightOnLg // show connector to next (lg+ only)
          />
        </M.div>

        <M.div variants={slide("up", 28, 0.03)}>
          <Step
            icon={<WalletCards className="h-5 w-5 sm:h-6 sm:w-6" />}
            color="text-blue-300"
            title="Enter the recipient’s address"
            description="We’ll send the received currency to this wallet after the exchange."
            index={2}
            connectorRightOnLg
          />
        </M.div>

        <M.div variants={slide("up", 24, 0.06)}>
          <Step
            icon={<SendHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            color="text-blue-700"
            title="Send and receive coins"
            description="Transfer the indicated amount to the deposit address to continue."
            index={3}
            connectorRightOnLg
          />
        </M.div>

        <M.div variants={slide("up", 28, 0.09)}>
          <Step
            icon={<ThumbsUpIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            color="text-blue-700"
            title="That’s all!"
            description="When the status shows “success,” your swap is complete."
            index={4}
            // no connector on the last card
          />
        </M.div>
      </M.div>
    </section>
  );
}
