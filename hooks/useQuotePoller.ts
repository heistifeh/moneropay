import { useEffect } from "react";
import { useFlow } from "@/store/store";

const POLL_INTERVAL = 5000; // 5 seconds

export function useQuotePoller(publicId?: string) {
  const { refreshQuote } = useFlow();

  useEffect(() => {
    if (!publicId) return; // don’t start until we have a valid id

    let active = true;
    const poll = async () => {
      try {
        await refreshQuote(publicId);
      } catch (err) {
        console.error("Quote polling failed", err);
      }
      if (active) {
        timer = setTimeout(poll, POLL_INTERVAL);
      }
    };

    let timer = setTimeout(poll, POLL_INTERVAL);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [publicId, refreshQuote]);
}
