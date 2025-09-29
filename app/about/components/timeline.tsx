// components/about/Timeline.tsx
"use client";

import { motion as M } from "framer-motion";
import { inViewStagger, slide, VIEWPORT } from "../../../utils/animation";

const milestones = [
  { year: "2021", title: "First swap routed", desc: "Private, non-custodial MVP goes live." },
  { year: "2022", title: "150+ pairs", desc: "Expanded liquidity + 24/7 support." },
  { year: "2023", title: "1k+ assets", desc: "Deep market coverage, faster confirmations." },
  { year: "2024", title: "Fiat ramp", desc: "Buy crypto with cards while staying non-custodial." },
];

export default function Timeline() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <M.ul
          variants={inViewStagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative mx-auto max-w-3xl"
        >
          {/* center spine */}
          <span className="pointer-events-none absolute left-4 top-0 h-full w-px bg-black/10 sm:left-1/2" />
          {milestones.map((m, i) => (
            <M.li
              key={m.title}
              variants={slide(i % 2 ? "left" : "right", 40, i * 0.03)}
              className={`relative mb-10 flex flex-col gap-1 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:w-[calc(50%-1rem)] ${
                i % 2 ? "sm:ml-auto" : ""
              }`}
            >
              <span className="text-xs font-semibold text-pumpkin-700">{m.year}</span>
              <h3 className="text-lg font-semibold text-black-900">{m.title}</h3>
              <p className="text-sm text-black-600">{m.desc}</p>
            </M.li>
          ))}
        </M.ul>
      </div>
    </section>
  );
}
