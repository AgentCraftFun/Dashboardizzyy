"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BurnsPayload, PricePayload, StatsPayload } from "@/lib/types";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProgressBar } from "./ProgressBar";
import { StatsGrid } from "./StatsGrid";
import { BurnFeed } from "./BurnFeed";
import { TokenInfo } from "./TokenInfo";
import { BiggestBurns } from "./BiggestBurns";
import { BurnRateChart } from "./BurnRateChart";
import { Footer } from "./Footer";

type FetchState = {
  stats: StatsPayload | null;
  burns: BurnsPayload | null;
  prices: PricePayload | null;
  error: string | null;
};

async function loadJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return (await res.json()) as T;
}

export function Dashboard() {
  const [data, setData] = useState<FetchState>({
    stats: null,
    burns: null,
    prices: null,
    error: null,
  });
  const [soundOn, setSoundOn] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const results = await Promise.allSettled([
      loadJson<StatsPayload>("/api/stats", controller.signal),
      loadJson<BurnsPayload>("/api/burns", controller.signal),
      loadJson<PricePayload>("/api/price", controller.signal),
    ]);
    if (controller.signal.aborted) return;
    setData((prev) => {
      const next: FetchState = { ...prev, error: null };
      if (results[0].status === "fulfilled") next.stats = results[0].value;
      if (results[1].status === "fulfilled") next.burns = results[1].value;
      if (results[2].status === "fulfilled") next.prices = results[2].value;
      const firstReject = results.find((r) => r.status === "rejected") as
        | PromiseRejectedResult
        | undefined;
      if (firstReject) {
        const reason = firstReject.reason;
        next.error = reason instanceof Error ? reason.message : String(reason);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      abortRef.current?.abort();
    };
  }, [refresh]);

  const { stats, burns, prices, error } = data;
  const asteroidPrice = prices?.asteroid?.priceUsd
    ? Number(prices.asteroid.priceUsd)
    : null;
  const burnList = burns?.burns ?? [];

  return (
    <main className="min-h-screen pb-6">
      <Header soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)} />

      <Hero
        totalAsteroidBurned={stats?.totalAsteroidBurned ?? null}
        asteroidPriceUsd={asteroidPrice}
      />

      <ProgressBar
        pendingBurnEth={stats?.pendingBurnEth ?? null}
        burnThreshold={stats?.burnThreshold ?? null}
      />

      <StatsGrid
        totalEthToBurn={stats?.totalEthToBurn ?? null}
        totalEthToDev={stats?.totalEthToDev ?? null}
        burnCount={burns ? burnList.length : null}
        buyFee={stats?.buyTotalFees ?? null}
        sellFee={stats?.sellTotalFees ?? null}
      />

      <BurnFeed
        burns={burnList}
        loading={burns === null}
        soundOn={soundOn}
        lastUpdated={burns?.fetchedAt ?? null}
      />

      <BurnRateChart burns={burnList} />

      <BiggestBurns burns={burnList} />

      <TokenInfo pair={prices?.aststr ?? null} />

      {error && (
        <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-8">
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
            Live data partially unavailable — retrying automatically.{" "}
            <span className="opacity-70">({error})</span>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
