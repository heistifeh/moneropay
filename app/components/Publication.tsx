"use client";

import Image from "next/image";
import MediaGrid from "./ui/mediaGrid";
import { motion as M } from "framer-motion";
import {
  inViewStagger,
  slide,
  revealUp,
  VIEWPORT,
} from "../../utils/animation"; // your animation file

export default function Publication() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-54 pb-16 sm:pb-20 lg:pb-24 ">
      {/* Header */}
      <M.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="text-black-800"
      >
        <span className="text-sm font-bold text-black-400">Publication</span>
        <h2 className="my-3 sm:my-4 text-2xl font-semibold sm:text-4xl">
          Media About MoneroPay
        </h2>
      </M.div>

      {/* Content: list + image (image only on lg+) */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-12">
        {/* Left: media list */}
        <M.div
          variants={inViewStagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <M.div variants={slide("up", 24)}>
              <MediaGrid
                imageUrl="/partners/coin-gape.svg"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor."
              />
            </M.div>
            <M.div variants={slide("up", 28, 0.03)}>
              <MediaGrid
                imageUrl="/partners/crypto-news.svg"
                text="Integer facilisis, nibh in vulputate ultricies, augue massa interdum nunc."
              />
            </M.div>
            <M.div variants={slide("up", 24, 0.06)}>
              <MediaGrid
                imageUrl="/partners/crypto-slate.svg"
                text="Phasellus congue, sapien at aliquet ultricies, justo urna commodo metus."
              />
            </M.div>
            <M.div variants={slide("up", 28, 0.09)}>
              <MediaGrid
                imageUrl="/partners/money-mongers.svg"
                text="Nunc at risus vitae ipsum tincidunt fermentum in quis turpis."
              />
            </M.div>
          </div>
        </M.div>

        {/* Right: illustrative image — hidden on small/tablet, visible on lg+ */}
        <M.div
          variants={slide("left", 40)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative hidden lg:col-span-5 lg:block"
        >
          {/* Matches card styling to “rhyme” with grid */}
          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <Image
              src="/media.jpg"
              alt="Media coverage collage"
              width={1600}
              height={1200}
              className="h-auto w-full rounded-xl object-cover"
              sizes="(min-width: 1024px) 40vw, 0px"
            />
          </div>
        </M.div>
      </div>
    </section>
  );
}
