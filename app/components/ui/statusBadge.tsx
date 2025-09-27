import type { Quote } from "@/store/store";

type Props = { status: Quote["status"] };

const COLORS: Record<string, string> = {
  quoting: "bg-blue-500",
  awaiting_payment: "bg-orange-500",
  confirming: "bg-purple-500",
  success: "bg-green-500",
  expired: "bg-red-500",
  failed: "bg-red-500",
};

export function StatusBadge({ status }: Props) {
  const colorClass = COLORS[status] ?? "bg-gray-400";

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-sm font-medium text-white ${colorClass}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
