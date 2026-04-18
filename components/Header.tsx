"use client";

import {
  ADDRESSES,
  DEXSCREENER_TOKEN,
  ETHERSCAN_ADDR,
  UNISWAP_BUY,
} from "@/lib/contracts";

export function Header({
  soundOn,
  onToggleSound,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ember-500 to-ember-700 shadow-ember text-xl">
          🪐
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight">
            ASTSTR Burn Tracker
          </div>
          <div className="text-xs text-white/50">
            $ASTSTR buys & burns $ASTEROID Shiba. Live on Ethereum.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <a
          className="rounded-lg border border-ember-500/40 bg-ember-500/10 px-3 py-1.5 font-medium text-ember-200 hover:bg-ember-500/20"
          href={UNISWAP_BUY(ADDRESSES.ASTSTR)}
          target="_blank"
          rel="noreferrer"
        >
          🚀 Buy $ASTSTR
        </a>
        <a
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
          href={DEXSCREENER_TOKEN(ADDRESSES.ASTSTR)}
          target="_blank"
          rel="noreferrer"
        >
          DEX Screener
        </a>
        <a
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
          href={ETHERSCAN_ADDR(ADDRESSES.ASTSTR)}
          target="_blank"
          rel="noreferrer"
        >
          Etherscan
        </a>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          title={soundOn ? "Sound on" : "Sound off"}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
        >
          {soundOn ? "🔊 Sound: On" : "🔈 Sound: Off"}
        </button>
      </div>
    </header>
  );
}
