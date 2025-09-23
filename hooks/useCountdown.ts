// src/hooks/useCountdown.ts
import { useEffect, useState } from "react";

function format(msLeft: number): string {
  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function useCountdown(expiresAt?: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!expiresAt) return;

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) {
    return { label: "--:--", expired: false };
  }

  const msLeft = expiresAt - now;
  const expired = msLeft <= 0;

  return {
    label: format(msLeft),
    expired,
  };
}
