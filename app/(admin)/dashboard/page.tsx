"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { StatusBadge } from "@/app/components/ui/statusBadge";
import { Separator } from "@/app/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { logout } from "@/lib/utils/auth-helpers";

// lucide-react icons
import { LogOut, CheckCircle2, XCircle, Hourglass } from "lucide-react";

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

  async function fetchQuotes() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/quotes");
      if (!res.ok) throw new Error("Failed to fetch quotes");
      const data = await res.json();
      setQuotes(data);
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 5000); // every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="destructive"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <Separator />

      {/* Loading State */}
      {loading && (
        <p className="mt-6 text-sm text-zinc-400 animate-pulse">
          Fetching quotes…
        </p>
      )}

      {/* Quotes Grid */}
      <div className="grid gap-6 mt-6">
        {quotes.map((q) => (
          <Card
            key={q.id}
            className="bg-zinc-900 border border-zinc-800 shadow-md rounded-2xl"
          >
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">
                  {q.amount_in} {q.base_symbol} → {q.amount_out}{" "}
                  {q.quote_symbol}
                </h2>
                <p className="text-xs text-zinc-500">
                  Created {new Date(q.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={q.status as any} />
            </CardHeader>

            <CardContent className="text-sm text-zinc-200 space-y-1">
              <p>
                <span className="text-zinc-400">Deposit:</span>{" "}
                {q.deposit_address}
              </p>
              <p>
                <span className="text-zinc-400">Payout:</span>{" "}
                {q.payout_address ?? "—"}
              </p>
            </CardContent>

            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "success")}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "failed")}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4 text-red-500" />
                Failed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "expired")}
                className="flex items-center gap-2"
              >
                <Hourglass className="h-4 w-4 text-yellow-500" />
                Expired
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
