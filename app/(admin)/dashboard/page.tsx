"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { StatusBadge } from "@/app/components/ui/statusBadge";
import { Separator } from "@/app/components/ui/separator";
import { usePathname } from "next/navigation";
import { Card } from "@/app/components/ui/card";

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
  }, []);

  return (
    <div className="bg-black p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Separator />

      {loading && <p className="text-sm text-zinc-500">Loading quotes…</p>}

      <div className="grid gap-4">
        {quotes.map((q) => (
          <Card key={q.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {q.amount_in} {q.base_symbol} → {q.amount_out}{" "}
                  {q.quote_symbol}
                </p>
                <p className="text-xs text-zinc-500">
                  Created {new Date(q.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={q.status as any} />
            </div>

            <div className="text-xs text-zinc-600">
              Deposit: {q.deposit_address}
              <br />
              Payout: {q.payout_address ?? "—"}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "success")}
              >
                Mark Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "failed")}
              >
                Mark Failed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus(q.id, "expired")}
              >
                Mark Expired
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
