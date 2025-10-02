"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { StatusBadge } from "@/app/components/ui/statusBadge";
import { Separator } from "@/app/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { logout } from "@/lib/utils/auth-helpers";
import toast from "react-hot-toast";
import {
  LogOut,
  CheckCircle2,
  XCircle,
  Hourglass,
  Loader2,
  Copy,
  RefreshCcw,
} from "lucide-react";

type Quote = {
  id: number;
  public_id: string;
  base_symbol: string;
  quote_symbol: string;
  amount_in: number;
  amount_out: number;
  status: string;
  deposit_address: string;
  payout_address: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  async function fetchQuotes() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotes");
      if (!res.ok) throw new Error("Failed to fetch quotes");
      const data = await res.json();
      setQuotes(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      toast.success(`Quote ${id} updated to ${status}`);
    } catch (e) {
      console.error(e);
      toast.error("Could not update status");
    }
  }

  // truncate helper
  const truncate = (text: string, length = 12) => {
    if (!text) return "—";
    return text.length > length
      ? `${text.slice(0, 6)}...${text.slice(-4)}`
      : text;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    fetchQuotes();
    // no more aggressive polling — only manual refresh
  }, []);

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) =>
    [q.public_id, q.base_symbol, q.quote_symbol, q.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Stats
  const total = quotes.length;
  const success = quotes.filter((q) => q.status === "success").length;
  const failed = quotes.filter((q) => q.status === "failed").length;
  const processing = quotes.filter((q) => q.status === "processing").length;

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchQuotes}
            disabled={loading}
            className="flex items-center gap-2 text-black-900"
          >
            <RefreshCcw className="h-4 w-4 text-black-900" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await logout();
              toast.success("You have been logged out");
              router.push("/auth/login");
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="bg-zinc-900 border border-zinc-800 p-4">
          <h3 className="text-sm text-zinc-400">Total Quotes</h3>
          <p className="text-2xl text-black-100 font-bold">{total}</p>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800 p-4">
          <h3 className="text-sm text-zinc-400">Success</h3>
          <p className="text-2xl font-bold text-green-500">{success}</p>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800 p-4">
          <h3 className="text-sm text-zinc-400">Failed</h3>
          <p className="text-2xl font-bold text-red-500">{failed}</p>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800 p-4">
          <h3 className="text-sm text-zinc-400">Processing</h3>
          <p className="text-2xl font-bold text-yellow-500">{processing}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search by ID, status, or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white"
        />
      </div>

      <Separator />

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 mt-6 text-zinc-400">
          <Loader2 className="animate-spin h-4 w-4" />
          Fetching quotes…
        </div>
      )}

      {/* Quotes */}
      <div className="mt-6">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Trade</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Deposit</th>
                <th className="px-4 py-2 text-left">Payout</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/60"
                >
                  <td className="px-4 py-2">{q.public_id}</td>
                  <td className="px-4 py-2">
                    {q.amount_in} {q.base_symbol} → {q.amount_out}{" "}
                    {q.quote_symbol}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(q.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-1">
                    <code className="font-mono">
                      {truncate(q.deposit_address)}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(q.deposit_address)}
                    >
                      <Copy className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </td>
                  <td className="px-4 py-2 flex items-center gap-1">
                    <code className="font-mono">
                      {q.payout_address ? truncate(q.payout_address) : "—"}
                    </code>
                    {q.payout_address && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(q.payout_address!)}
                      >
                        <Copy className="h-4 w-4 text-zinc-400" />
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={q.status as Quote["status"]} />
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(q.id, "success")}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(q.id, "failed")}
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(q.id, "expired")}
                    >
                      <Hourglass className="h-4 w-4 text-yellow-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid md:hidden gap-4">
          {filteredQuotes.map((q) => (
            <Card
              key={q.id}
              className="bg-zinc-900 border border-zinc-800 shadow-md rounded-xl"
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">
                    {q.amount_in} {q.base_symbol} → {q.amount_out}{" "}
                    {q.quote_symbol}
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {new Date(q.created_at).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={q.status as Quote["status"]} />
              </CardHeader>
              <CardContent className="text-sm text-zinc-200 space-y-2">
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Deposit:</span>
                  <code className="font-mono">
                    {truncate(q.deposit_address)}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(q.deposit_address)}
                  >
                    <Copy className="h-4 w-4 text-zinc-400" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-400">Payout:</span>
                  <code className="font-mono">
                    {q.payout_address ? truncate(q.payout_address) : "—"}
                  </code>
                  {q.payout_address && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(q.payout_address!)}
                    >
                      <Copy className="h-4 w-4 text-zinc-400" />
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(q.id, "success")}
                  className="flex items-center gap-1"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Success
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(q.id, "failed")}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4 text-red-500" /> Failed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(q.id, "expired")}
                  className="flex items-center gap-1"
                >
                  <Hourglass className="h-4 w-4 text-yellow-500" /> Expired
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
