import { ALL_CG_IDS, ASSETS } from "../../lib/constants";
import PriceCard from "./PriceCard";

type PricesResp = Record<
  string,
  { usd: number; usd_24h_change?: number }
>;

const CG = "https://api.coingecko.com/api/v3";

export const revalidate = 60; // refresh every minute (ISR)

export default async function PriceBoard() {
  // Fetch prices (USD) + 24h %
  const url =
    `${CG}/simple/price?ids=${ALL_CG_IDS.join(",")}` +
    `&vs_currencies=usd&include_24hr_change=true`;

  let data: PricesResp | null = null;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`CG error ${res.status}`);
    data = (await res.json()) as PricesResp;
  } catch {
    data = null; // graceful fallback – skeletons render
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <header className="mb-8 flex items-end justify-between">
        <div>
          <span className="inline-block rounded-full bg-pumpkin-600/20 px-3 py-1 text-xs font-semibold text-pumpkin-100">
            Live prices
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-pumpkin-50 sm:text-3xl">
            Market at a glance
          </h2>
        </div>
        <span className="hidden text-sm text-zinc-400 sm:block">
          Updated every minute
        </span>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ASSETS.map((a) => {
          const row = data?.[a.id];

          return (
            <PriceCard
              key={a.id}
              asset={a}
              price={row?.usd}
              change24h={row?.usd_24h_change}
              iconSrc={`/coins/${a.symbol.toLowerCase()}.svg`}
            />
          );
        })}
      </div>
    </section>
  );
}
