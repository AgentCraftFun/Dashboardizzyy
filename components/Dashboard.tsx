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
  hasLoaded: boolean;
};

async function loadJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = `: ${body.error}`;
    } catch {
      // ignore
    }
    throw new Error(`${url} → HTTP ${res.status}${detail}`);
  }
  return (await res.json()) as T;
}

export function Dashboard() {
  const [data, setData] = useState<FetchState>({
    stats: null,
    burns: null,
    prices: null,
    error: null,
    hasLoaded: false,
  });
  const [soundOn, setSoundOn] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const results = await Promise.allSettled([
        loadJson<StatsPayload>("/api/stats"),
        loadJson<BurnsPayload>("/api/burns"),
        loadJson<PricePayload>("/api/price"),
      ]);
      setData((prev) => {
        const next: FetchState = { ...prev, hasLoaded: true };
        const errors: string[] = [];
        if (results[0].status === "fulfilled") next.stats = results[0].value;
        else errors.push(`stats ${extractErr(results[0].reason)}`);
        if (results[1].status === "fulfilled") next.burns = results[1].value;
        else errors.push(`burns ${extractErr(results[1].reason)}`);
        if (results[2].status === "fulfilled") next.prices = results[2].value;
        else errors.push(`price ${extractErr(results[2].reason)}`);
        next.error = errors.length ? errors.join(" · ") : null;
        return next;
      });
    } finally {
      inFlight.current = false;
    }
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
    };
  }, [refresh]);

  const { stats, burns, prices, error, hasLoaded } = data;
  const asteroidPrice = prices?.asteroid?.priceUsd
    ? Number(prices.asteroid.priceUsd)
    : null;
  const burnList = burns?.burns ?? [];
  const allFailed = hasLoaded && !stats && !burns && !prices;

  return (
    <main className="min-h-screen pb-6">
      <Header soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)} />

      {allFailed && error && (
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            <div className="font-semibold text-rose-200">
              Couldn’t reach the Ethereum RPC or DEX Screener.
            </div>
            <div className="mt-1 text-xs text-rose-200/80">
              Public RPCs throttle aggressively from cloud IPs. Set an{" "}
              <code className="rounded bg-black/30 px-1">ETH_RPC_URL</code> env
              var (Alchemy/Infura) and redeploy.
            </div>
            <div className="mt-2 font-mono text-[11px] text-rose-200/60">
              {error}
            </div>
          </div>
        </div>
      )}

      <Hero
        totalAsteroidBurned={stats?.totalAsteroidBurned ?? null}
        asteroidPriceUsd={asteroidPrice}
        asteroidDecimals={stats?.asteroidDecimals ?? 18}
      />

      <ProgressBar
        pendingBurnEth={stats?.pendingBurnEth ?? null}
        burnThreshold={stats?.burnThreshold ?? null}
      />

      <StatsGrid
        totalEthToBurn={stats?.totalEthToBurn ?? null}
        burnCount={burns ? burnList.length : null}
        buyFee={stats?.buyTotalFees ?? null}
        sellFee={stats?.sellTotalFees ?? null}
      />

      <BurnFeed
        burns={burnList}
        loading={burns === null}
        soundOn={soundOn}
        lastUpdated={burns?.fetchedAt ?? null}
        asteroidDecimals={stats?.asteroidDecimals ?? 18}
      />

      <BurnRateChart burns={burnList} />

      <BiggestBurns
        burns={burnList}
        asteroidDecimals={stats?.asteroidDecimals ?? 18}
      />

      <TokenInfo pair={prices?.aststr ?? null} />

      {!allFailed && error && (
        <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-8">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            Some data is temporarily unavailable — retrying automatically.{" "}
            <span className="opacity-70">({error})</span>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function extractErr(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}
