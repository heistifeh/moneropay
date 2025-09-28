"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion as m, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  VIEWPORT,
  inViewStagger,
  revealUp,
  listItem,
  modalFade,
  drawerSlide,
  press,
  iconTap,
  layoutSpring,
} from "@/utils/animation";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // If you truly want a different nav for /exchange, keep this.
  if (pathname === "/exchange") return null;
  if (pathname.startsWith("/auth/")) return null;
  if (pathname.startsWith("/dashboard")) return null;
  const toggle = () => setIsOpen((v) => !v);

  return (
    <m.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
      className="fixed inset-x-0 top-0 z-50"
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Shell with glass + subtle border */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-pumpkin-900/80 backdrop-blur supports-[backdrop-filter]:bg-pumpkin-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex h-16 items-center justify-between px-3 sm:px-4">
            {/* Brand */}
            <Link href="/" className="group flex items-center gap-3 py-2">
              <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15">
                <Image
                  src="/logo.jpg"
                  alt="MoneroPay"
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </span>
              <m.span
                variants={revealUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="text-lg sm:text-xl font-bold tracking-tight text-white"
              >
                MoneroPay
              </m.span>
            </Link>

            {/* Desktop Nav */}
            <LayoutGroup>
              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                <m.ul
                  variants={inViewStagger}
                  initial="hidden"
                  animate="show"
                  className="flex items-center gap-4 lg:gap-6"
                >
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <m.li
                        key={item.href}
                        variants={listItem}
                        className="relative"
                      >
                        <Link
                          href={item.href}
                          className={`group inline-flex items-center text-sm font-medium transition-colors ${
                            active
                              ? "text-pumpkin-50"
                              : "text-pumpkin-200/80 hover:text-pumpkin-50"
                          }`}
                        >
                          <span className="px-1.5 py-1">{item.name}</span>
                          {/* Animated underline */}
                          {active && (
                            <m.span
                              layoutId="active-underline"
                              className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-pumpkin-200"
                              transition={layoutSpring}
                            />
                          )}
                        </Link>
                      </m.li>
                    );
                  })}
                </m.ul>

                {/* Primary CTA */}
                <m.div {...press}>
                  <Link
                    href="/exchange"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-200/60"
                  >
                    <span>Exchange</span>
                  </Link>
                </m.div>
              </div>
            </LayoutGroup>

            {/* Mobile toggle */}
            <m.button
              onClick={toggle}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-pumpkin-50 ring-1 ring-white/15 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-200/60"
              {...iconTap}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </m.button>
          </div>

          {/* Mobile drawer */}
          <AnimatePresence>
            {isOpen && (
              <m.div
                key="backdrop"
                className="md:hidden"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={modalFade}
              >
                <div className="border-t border-white/10" />
                <m.div
                  variants={drawerSlide}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="px-4 pb-4 pt-3"
                >
                  <ul className="space-y-1.5">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-white/10 text-pumpkin-50"
                              : "text-pumpkin-200/80 hover:bg-white/10 hover:text-pumpkin-50"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/exchange"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg bg-white/10 px-3 py-2 text-base font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                      >
                        Exchange
                      </Link>
                    </li>
                  </ul>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </m.nav>
  );
}
