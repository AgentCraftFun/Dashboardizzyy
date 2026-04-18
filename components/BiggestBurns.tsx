"use client";

import type { BurnEvent } from "@/lib/types";
import { ETHERSCAN_TX } from "@/lib/contracts";
import {
  formatEth,
  formatRelative,
  formatTokenSmart,
  truncateHash,
} from "@/lib/format";

export function BiggestBurns({
  burns,
  asteroidDecimals,
}: {
  burns: BurnEvent[];
  asteroidDecimals: number;
}) {
  const top = [...burns]
    .sort((a, b) => {
      const ab = BigInt(a.ethSpent);
      const bb = BigInt(b.ethSpent);
      if (ab === bb) return 0;
      return ab > bb ? -1 : 1;
    })
    .slice(0, 5);

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            🏆 Biggest burns — hall of fame
          </h2>
          <div className="text-xs text-white/40">top 5 by ETH spent</div>
        </div>
        {top.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-white/50">
            Awaiting enough data to rank burns.
          </div>
        ) : (
          <ol className="divide-y divide-white/5">
            {top.map((b, i) => (
              <li
                key={`${b.txHash}-${b.logIndex}`}
                className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm"
              >
                <div className="col-span-1 text-lg font-bold text-ember-300">
                  #{i + 1}
                </div>
                <div className="col-span-5 sm:col-span-4">
                  <div className="text-[11px] uppercase text-white/40">
                    ETH spent
                  </div>
                  <div className="num font-semibold text-ember-200">
                    {formatEth(b.ethSpent, 4)} ETH
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <div className="text-[11px] uppercase text-white/40">
                    $ASTEROID burned
                  </div>
                  <div className="num font-semibold text-white">
                    {formatTokenSmart(b.asteroidBurned, asteroidDecimals)}
                  </div>
                </div>
                <div className="col-span-6 text-xs text-white/50 sm:col-span-2">
                  {b.timestamp ? formatRelative(b.timestamp) : "—"}
                </div>
                <div className="col-span-6 text-right sm:col-span-1">
                  <a
                    className="text-xs text-white/70 hover:text-white"
                    href={ETHERSCAN_TX(b.txHash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {truncateHash(b.txHash, 4, 3)} ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
