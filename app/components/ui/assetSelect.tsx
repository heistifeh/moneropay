import { ASSETS, Asset } from "@/lib/constants";

type Props = {
  value: string; // symbol, e.g. "USDT"
  onChange: (symbol: string) => void;
};

export function AssetSelect({ value, onChange }: Props) {
  return (
    <div className="relative w-40">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-2 pr-10 text-sm font-medium text-zinc-700 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-zinc-300"
      >
        {ASSETS.map((a: Asset) => (
          <option key={a.symbol} value={a.symbol}>
            {a.symbol} — {a.name}
          </option>
        ))}
      </select>

      {/* custom dropdown arrow */}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
        ▼
      </span>
    </div>
  );
}
