"use client";

import { formatEth, toNumber } from "@/lib/format";

export function ProgressBar({
  pendingBurnEth,
  burnThreshold,
}: {
  pendingBurnEth: string | null;
  burnThreshold: string | null;
}) {
  const loading = pendingBurnEth === null || burnThreshold === null;
  const pendingNum = pendingBurnEth ? toNumber(pendingBurnEth) : 0;
  const thresholdNum = burnThreshold ? toNumber(burnThreshold) : 0;
  const ratio =
    thresholdNum > 0 ? Math.min(1, pendingNum / thresholdNum) : 0;
  const pct = Math.round(ratio * 1000) / 10; // 1 decimal
  const imminent = ratio >= 1;

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div
        className={`card p-5 sm:p-6 ${
          imminent ? "card-ember animate-pulseBurn" : ""
        }`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            Next burn progress
          </div>
          {loading ? (
            <div className="h-4 w-40 rounded shimmer" />
          ) : (
            <div className="num text-sm text-white/80">
              <span className="font-semibold text-white">
                {formatEth(pendingBurnEth!, 4)}
              </span>{" "}
              / {formatEth(burnThreshold!, 4)} ETH
            </div>
          )}
        </div>
        <div className="relative mt-3 h-4 overflow-hidden rounded-full border border-white/10 bg-space-900">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${
              imminent
                ? "bg-gradient-to-r from-ember-500 via-ember-300 to-yellow-200"
                : "bg-gradient-to-r from-ember-700 via-ember-500 to-ember-300"
            }`}
            style={{ width: `${Math.max(2, pct)}%` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_50%,rgba(255,255,255,0.25),transparent_60%)]"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="text-white/60">
            {loading ? (
              <span className="inline-block h-3 w-24 rounded shimmer" />
            ) : (
              <>
                <span className="num font-semibold text-white">{pct.toFixed(1)}%</span>{" "}
                filled
              </>
            )}
          </div>
          {imminent && (
            <div className="rounded-md border border-ember-400/50 bg-ember-500/20 px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-ember-200">
              Burn imminent 🔥
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
