"use client";

import {
  ADDRESSES,
  DEXSCREENER_TOKEN,
  ETHERSCAN_ADDR,
  UNISWAP_BUY,
} from "@/lib/contracts";
import { formatUsd } from "@/lib/format";
import type { DexPair } from "@/lib/types";

export function TokenInfo({ pair }: { pair: DexPair | null }) {
  const priceUsd = pair?.priceUsd ? Number(pair.priceUsd) : null;
  const mcap = pair?.marketCap ?? pair?.fdv ?? null;
  const vol = pair?.volume?.h24 ?? null;
  const chg = pair?.priceChange?.h24 ?? null;

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              $ASTSTR token
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <div className="num text-3xl font-bold text-white">
                {priceUsd !== null
                  ? `$${priceUsd.toPrecision(4)}`
                  : "—"}
              </div>
              {chg !== null && (
                <div
                  className={`num text-sm font-semibold ${
                    chg >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {chg >= 0 ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}% 24h
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
              <Stat
                label="Market cap"
                value={mcap !== null ? formatUsd(mcap) : "—"}
              />
              <Stat
                label="24h volume"
                value={vol !== null ? formatUsd(vol) : "—"}
              />
              <Stat
                label="Liquidity"
                value={pair?.liquidity?.usd ? formatUsd(pair.liquidity.usd) : "—"}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              className="rounded-lg border border-ember-500/40 bg-ember-500/10 px-3 py-1.5 font-medium text-ember-200 hover:bg-ember-500/20"
              href={UNISWAP_BUY(ADDRESSES.ASTSTR)}
              target="_blank"
              rel="noreferrer"
            >
              Buy on Uniswap
            </a>
            <a
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
              href={pair?.url ?? DEXSCREENER_TOKEN(ADDRESSES.ASTSTR)}
              target="_blank"
              rel="noreferrer"
            >
              Chart
            </a>
            <a
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
              href={ETHERSCAN_ADDR(ADDRESSES.ASTSTR)}
              target="_blank"
              rel="noreferrer"
            >
              Etherscan
            </a>
            <a
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/70 hover:bg-white/10"
              href={ETHERSCAN_ADDR(ADDRESSES.ASTSTR)}
              target="_blank"
              rel="noreferrer"
              title={ADDRESSES.ASTSTR}
            >
              {ADDRESSES.ASTSTR.slice(0, 6)}…{ADDRESSES.ASTSTR.slice(-4)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className="num font-semibold text-white">{value}</div>
    </div>
  );
}
