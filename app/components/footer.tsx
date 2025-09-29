"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="relative w-full bg-[#0e0703] text-pumpkin-100">
      {/* Top CTA */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <Link
          href="/exchange"
          className="inline-block rounded-xl bg-pumpkin-300 px-6 py-3 text-base font-extrabold text-[#0e0703] shadow-sm hover:bg-pumpkin-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin-400"
          aria-label="Exchange now"
        >
          Exchange now
        </Link>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Company & Team */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pumpkin-300">
              Company &amp; Team
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-white/90">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Team
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Exchange pairs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pumpkin-300">
              Exchange pairs
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-white/90">
                  BTC &rarr; USDT
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  ETH &rarr; BTC
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  XMR &rarr; USDT
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  SOL &rarr; USDC
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  More pairs
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported coins */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pumpkin-300">
              Supported coins
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-white/90">
                  Bitcoin (BTC)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Ethereum (ETH)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Monero (XMR)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Tether (USDT)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  USD Coin (USDC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-pumpkin-300">
              Legal
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="#" className="hover:text-white/90">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white/90">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-pumpkin-200/80">
              © {new Date().getFullYear()} MoneroPay. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link href="#" className="hover:text-white/90">
                Status
              </Link>
              <span className="text-pumpkin-200/40">•</span>
              <Link href="#" className="hover:text-white/90">
                Security
              </Link>
              <span className="text-pumpkin-200/40">•</span>
              <Link href="#" className="hover:text-white/90">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Extra height so it feels substantial (adjust as needed) */}
      <div className="pointer-events-none h-6 sm:h-8 lg:h-10" />
    </footer>
  );
}
