"use client";

import Image from "next/image";
import { motion as M } from "framer-motion";
import { slide, cardHover, press } from "../../../utils/animation";

export default function Grid({
  feature,
  header,
  text,
  imageUrl,
}: {
  feature: string;
  header: string;
  text: string;
  imageUrl?: string;
}) {
  return (
    <M.article
      variants={slide("up", 30)}
      className="w-full rounded-xl bg-pumpkin-900 p-5 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
      whileHover={cardHover.whileHover}
      whileTap={press.whileTap}
      transition={cardHover.transition}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-black-300">{feature}</span>
          <h3 className="pt-3 text-xl font-bold text-black-50">{header}</h3>
          <p className="pt-3 text-sm text-black-100 sm:text-base">{text}</p>
        </div>

        {/* Image (only on large screens and above) */}
        {imageUrl ? (
          <div className="hidden lg:block shrink-0">
            <Image
              src={imageUrl}
              alt={`${feature} illustration`}
              width={320}
              height={320}
              className="h-auto w-48 xl:w-56 rounded-lg object-contain"
              sizes="(min-width: 1024px) 220px"
            />
          </div>
        ) : null}
      </div>
    </M.article>
  );
}
