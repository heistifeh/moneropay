"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;
  if (pathname.startsWith("/dashboard")) return null;
  return <div className="text-amber-300">Monero Pay Footer</div>;
}
