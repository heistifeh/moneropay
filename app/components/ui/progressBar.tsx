import { memo, useMemo } from "react";
import { useFlow } from "@/store/store";
import { motion as m } from "framer-motion";

type StepKey =
  | "choose"
  | "address"
  | "create"
  | "success"
  | "expired"
  | "failed";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "choose", label: "Choose currencies" },
  { key: "address", label: "Enter the address" },
  { key: "create", label: "Create exchange" },
];

function normalize(step: string, status: string): StepKey {
  if (status === "failed") return "failed";
  if (status === "expired") return "expired";
  if (status === "success") return "success";
  if (step === "quote") return "choose";
  if (step === "address") return "address";
  return "create";
}
const activeIndexForKey = (k: StepKey) =>
  k === "choose" ? 0 : k === "address" ? 1 : 2;

export default memo(function ProgressBar() {
  const { step } = useFlow();
  // If 'status' is needed, ensure it exists in FlowStore or get it another way
  const status = ""; // Replace with correct source for status
  const key = normalize(step, status);
  const i = activeIndexForKey(key);
  const max = STEPS.length - 1; // 2
  const pct = useMemo(() => Math.max(0, Math.min(100, (i / max) * 100)), [i]);

  const isError = key === "failed" || key === "expired";
  const isSuccess = key === "success";

  return (
    <section
      className="mx-auto mb-3 w-full max-w-2xl"
      role="progressbar"
      aria-label="Exchange progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className="relative h-7">
        {/* track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-zinc-100" />

        {/* tiny ticks (3 points) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="grid grid-cols-3">
            {STEPS.map((_, idx) => (
              <div key={idx} className="relative">
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full ring-1 ${
                    idx <= i && !isError
                      ? "bg-pumpkin-500 ring-pumpkin-500"
                      : "bg-white ring-zinc-200"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* fill */}
        <m.div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full ${
            isError
              ? "bg-rose-500"
              : isSuccess
                ? "bg-emerald-500"
                : "bg-pumpkin-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "tween", duration: 0.35 }}
        />

        {/* active dot */}
        <m.span
          className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full ring-2 ${
            isError
              ? "bg-rose-500 ring-rose-200"
              : isSuccess
                ? "bg-emerald-500 ring-emerald-200"
                : "bg-pumpkin-500 ring-pumpkin-200"
          }`}
          initial={{ left: 0 }}
          animate={{ left: `calc(${pct}% - 7px)` }} // 7px ≈ half of 3.5
          transition={{ type: "spring", stiffness: 240, damping: 26 }}
        />
      </div>

      {/* labels (muted, hidden on xs) */}
      <div className="mt-1 hidden select-none text-[11px] text-zinc-500 sm:grid sm:grid-cols-3">
        {STEPS.map((s, idx) => {
          const active = idx === i && !isError;
          const done = idx < i && !isError;
          return (
            <div key={s.key} className="text-center">
              <span
                className={
                  isError
                    ? "text-rose-600"
                    : active || done
                      ? "text-zinc-900"
                      : "text-zinc-500"
                }
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* caption (only when terminal states) */}
      <div className="mt-1 text-[11px] text-zinc-600">
        {isSuccess && (
          <span className="text-emerald-600">Completed successfully.</span>
        )}
        {key === "expired" && (
          <span className="text-rose-600">
            Quote expired. Please request a new one.
          </span>
        )}
        {key === "failed" && (
          <span className="text-rose-600">
            Transaction failed. Please try again.
          </span>
        )}
      </div>
    </section>
  );
});
