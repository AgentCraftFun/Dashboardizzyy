"use client";

import { useMemo, useState } from "react";
import type { BurnEvent } from "@/lib/types";
import { toNumber } from "@/lib/format";

type Window = "24h" | "7d" | "all";

const WINDOWS: { id: Window; label: string; seconds: number | null; buckets: number }[] = [
  { id: "24h", label: "24h", seconds: 86_400, buckets: 24 },
  { id: "7d", label: "7d", seconds: 7 * 86_400, buckets: 14 },
  { id: "all", label: "All", seconds: null, buckets: 20 },
];

export function BurnRateChart({ burns }: { burns: BurnEvent[] }) {
  const [window, setWindow] = useState<Window>("24h");
  const cfg = WINDOWS.find((w) => w.id === window)!;

  const { series, max, totalEth } = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const oldest = burns.reduce(
      (m, b) => (b.timestamp > 0 && b.timestamp < m ? b.timestamp : m),
      now,
    );
    const start = cfg.seconds === null ? oldest : now - cfg.seconds;
    const span = Math.max(1, now - start);
    const bucketSize = span / cfg.buckets;
    const buckets = new Array(cfg.buckets).fill(0) as number[];
    let total = 0;
    for (const b of burns) {
      if (!b.timestamp || b.timestamp < start) continue;
      const offset = b.timestamp - start;
      const idx = Math.min(
        cfg.buckets - 1,
        Math.max(0, Math.floor(offset / bucketSize)),
      );
      const eth = toNumber(b.ethSpent);
      buckets[idx] += eth;
      total += eth;
    }
    const max = buckets.reduce((m, v) => (v > m ? v : m), 0);
    return { series: buckets, max, totalEth: total };
  }, [burns, cfg]);

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/60">
              Burn rate
            </div>
            <div className="num mt-1 text-lg font-semibold text-white">
              {totalEth.toFixed(4)}{" "}
              <span className="text-sm font-normal text-white/50">
                ETH burned ({cfg.label})
              </span>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-xs">
            {WINDOWS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWindow(w.id)}
                className={`rounded-md px-3 py-1 font-medium transition ${
                  w.id === window
                    ? "bg-ember-500/20 text-ember-200"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex h-28 items-end gap-1">
          {series.map((v, i) => {
            const h = max > 0 ? Math.max(2, Math.round((v / max) * 100)) : 2;
            return (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-ember-700/60 via-ember-500/70 to-ember-300/90"
                style={{ height: `${h}%` }}
                title={`${v.toFixed(4)} ETH`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
