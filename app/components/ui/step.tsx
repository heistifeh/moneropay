"use client";

import { motion as M } from "framer-motion";
import { cardHover, press, lift } from "../../../utils/animation";
import clsx from "clsx";

export default function Step({
  icon,
  title,
  description,
  color,
  index,
  connectorRightOnLg = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string; // e.g. "text-teal-400"
  index?: number;
  connectorRightOnLg?: boolean;
}) {
  return (
    <M.article
      className="relative h-full rounded-2xl border border-black/5 bg-white p-5 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      whileHover={cardHover.whileHover}
      whileTap={press.whileTap}
      transition={cardHover.transition}
    >
      {/* Connector to next (desktop only) */}
      {connectorRightOnLg && (
        <div className="pointer-events-none absolute right-[-28px] top-1/2 hidden -translate-y-1/2 items-center lg:flex">
          <span className="block h-[2px] w-16 rounded bg-gradient-to-r from-black/10 to-black/0" />
          <span className="ml-1.5 block h-2 w-2 rounded-full bg-pumpkin-500/70" />
        </div>
      )}

      <div className="flex items-start gap-4 sm:gap-5">
        {/* Icon + number */}
        <div className="relative shrink-0">
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 sm:h-11 sm:w-11",
              color
            )}
            aria-hidden
          >
            {icon}
          </div>
          {typeof index === "number" ? (
            <span className="pointer-events-none absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-pumpkin-500 px-1 text-xs font-bold text-black-50">
              {index}
            </span>
          ) : null}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="text-base font-semibold leading-7 text-black-900 sm:text-lg">
            {title}
          </h3>
          <p
            className="
              text-sm sm:text-base text-black-700
              leading-6 sm:leading-7 tracking-normal
              break-words [overflow-wrap:anywhere]
              max-w-[48ch]
            "
          >
            {description}
          </p>
        </div>
      </div>

      {/* Soft divider with hover lift */}
      <M.div
        className="mt-5 h-px w-full bg-black/5"
        whileHover={lift.whileHover}
        transition={lift.transition}
      />
    </M.article>
  );
}
