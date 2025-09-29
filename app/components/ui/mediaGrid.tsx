"use client";

import Image from "next/image";
import { motion as M } from "framer-motion";
import { cardHover, press } from "../../../utils/animation"; // your animation file

export default function MediaGrid({
  imageUrl,
  text,
}: {
  imageUrl: string;
  text: string;
}) {
  return (
    <M.article
      className="
        flex min-h-[180px] flex-col
        rounded-2xl border border-black/5 bg-white
        p-4 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md
      "
      whileHover={cardHover.whileHover}
      whileTap={press.whileTap}
      transition={cardHover.transition}
    >
      {/* Top image block */}
      <div className="mb-3 flex items-center justify-start">
        <Image
          src={imageUrl}
          alt="Publisher logo"
          width={100}
          height={100}
          className="h-10 w-10 sm:h-10 sm:w-30"
          sizes="48px"
        />
      </div>

      {/* Text */}
      <p className="mt-1 text-sm leading-6 text-black-900 sm:text-base">
        {text}
      </p>
    </M.article>
  );
}
