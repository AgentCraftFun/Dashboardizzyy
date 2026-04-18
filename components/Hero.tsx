"use client";

import { formatTokenSmart, formatUsd, toNumberWithDecimals } from "@/lib/format";
import { Logo } from "./Logo";

export function Hero({
  totalAsteroidBurned,
  asteroidPriceUsd,
  asteroidDecimals,
}: {
  totalAsteroidBurned: string | null;
  asteroidPriceUsd: number | null;
  asteroidDecimals: number;
}) {
  const loading = totalAsteroidBurned === null;
  const usd =
    totalAsteroidBurned && asteroidPriceUsd !== null
      ? toNumberWithDecimals(totalAsteroidBurned, asteroidDecimals) *
        asteroidPriceUsd
      : null;

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="card card-ember relative overflow-hidden p-6 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-ember-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-space-600/40 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <Logo
              size={128}
              priority
              className="ring-2 ring-ember-500/40 ring-offset-2 ring-offset-space-900"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ember-200/80">
              <span>🔥</span>
              <span>Total $ASTEROID burned by $ASTSTR</span>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              {loading ? (
                <div className="h-14 w-72 rounded-lg shimmer" />
              ) : (
                <div className="num text-5xl font-black leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
                  {formatTokenSmart(totalAsteroidBurned!, asteroidDecimals)}
                </div>
              )}
              <div className="mb-1 text-sm text-white/50">$ASTEROID</div>
            </div>
            <div className="mt-3 text-base text-white/70">
              {usd !== null ? (
                <>
                  <span className="text-white/50">≈</span>{" "}
                  <span className="font-semibold text-ember-200">{formatUsd(usd)}</span>{" "}
                  <span className="text-white/40">incinerated</span>
                </>
              ) : loading ? (
                <div className="h-4 w-40 rounded shimmer" />
              ) : (
                <span className="text-white/40">USD value unavailable</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
