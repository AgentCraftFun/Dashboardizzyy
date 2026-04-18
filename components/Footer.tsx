"use client";

import { ADDRESSES, ETHERSCAN_ADDR } from "@/lib/contracts";

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-6xl px-4 pb-10 text-xs text-white/40 sm:px-8">
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <div className="font-semibold uppercase tracking-[0.18em] text-white/50">
            $ASTSTR
          </div>
          <a
            className="font-mono hover:text-white"
            href={ETHERSCAN_ADDR(ADDRESSES.ASTSTR)}
            target="_blank"
            rel="noreferrer"
          >
            {ADDRESSES.ASTSTR}
          </a>
        </div>
        <div>
          <div className="font-semibold uppercase tracking-[0.18em] text-white/50">
            $ASTEROID Shiba
          </div>
          <a
            className="font-mono hover:text-white"
            href={ETHERSCAN_ADDR(ADDRESSES.ASTEROID)}
            target="_blank"
            rel="noreferrer"
          >
            {ADDRESSES.ASTEROID}
          </a>
        </div>
        <div>
          <div className="font-semibold uppercase tracking-[0.18em] text-white/50">
            Dev wallet
          </div>
          <a
            className="font-mono hover:text-white"
            href={ETHERSCAN_ADDR(ADDRESSES.DEV)}
            target="_blank"
            rel="noreferrer"
          >
            {ADDRESSES.DEV}
          </a>
        </div>
      </div>
      <div className="mt-6 text-center text-[11px] text-white/30">
        Data from Ethereum mainnet via public RPC · prices via DEX Screener · this
        dashboard is informational only, not financial advice.
      </div>
    </footer>
  );
}
