// components/about/Stats.tsx
"use client";

import { motion as M } from "framer-motion";
import { revealUp, VIEWPORT } from "../../../utils/animation";

const stats = [
  { k: "1500+", v: "Supported coins" },
  { k: "2–10m", v: "Typical swap time" },
  { k: "24/7", v: "Human support" },
  { k: "0", v: "Accounts required" },
];

export default function Stats() {
  return (
    <section className="bg-pumpkin-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <M.ul
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4"
        >
          {stats.map((s) => (
            <li
              key={s.v}
              className="rounded-2xl border border-white/5 bg-pumpkin-800/40 p-6 shadow-sm"
            >
              <div className="text-3xl font-semibold text-pumpkin-50">{s.k}</div>
              <div className="mt-1 text-sm text-pumpkin-100/80">{s.v}</div>
            </li>
          ))}
        </M.ul>
      </div>
    </section>
  );
}
