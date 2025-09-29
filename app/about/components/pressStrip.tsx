// components/about/PressStrip.tsx
"use client";

import Image from "next/image";

const logos = [
  "/partners/coin-gape.svg",
  "/partners/coin-gape.svg",
  "/partners/coin-gape.svg",
  "/partners/coin-gape.svg",
];

export default function PressStrip() {
  return (
    <section className="bg-pumpkin-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
          {logos.map((src, i) => (
            <div key={i} className="flex items-center justify-center rounded-xl bg-pumpkin-800/40 p-4">
              <Image src={src} alt="Press logo" width={120} height={40} className="h-6 w-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
