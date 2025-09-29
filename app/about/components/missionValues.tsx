// components/about/MissionValues.tsx
"use client";

import { motion as M } from "framer-motion";
import { inViewStagger, slide, revealUp, VIEWPORT } from "../../../utils/animation";
import { Shield, Rocket, Handshake } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "Privacy by default",
    desc: "We never take custody of your assets. Exchanges go directly wallet-to-wallet.",
  },
  {
    icon: Rocket,
    title: "Speed without friction",
    desc: "Clear quotes, minimal steps, and smart routing for rapid settlement.",
  },
  {
    icon: Handshake,
    title: "Support that shows up",
    desc: "24/7 help from real people for transaction lookups and guidance.",
  },
];

export default function MissionValues() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <M.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-2xl font-semibold sm:text-4xl text-black-900">Our mission & values</h2>
          <p className="mt-3 text-black-600">
            Bring private finance to everyday users with honesty, speed, and care.
          </p>
        </M.div>

        <M.div
          variants={inViewStagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map(({ icon: Icon, title, desc }, i) => (
            <M.div
              key={title}
              variants={slide("up", 28, i * 0.03)}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pumpkin-100 text-pumpkin-800">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black-600">{desc}</p>
                </div>
              </div>
            </M.div>
          ))}
        </M.div>
      </div>
    </section>
  );
}
