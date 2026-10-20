"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Vuelve a pedir la página al servidor cada cierto tiempo (estado de pedidos)
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
