"use client";

import {
  ADDRESSES,
  DEXSCREENER_TOKEN,
  ETHERSCAN_ADDR,
  UNISWAP_BUY,
} from "@/lib/contracts";
import { Logo } from "./Logo";

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
        <Logo size={44} priority />
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
        <a
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
          href="https://t.me/AsteroidStrategy"
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden
          >
            <path d="M9.78 15.27 9.6 18.9c.3 0 .43-.13.58-.28l1.4-1.34 2.9 2.13c.53.3.9.14 1.05-.49l1.9-8.92c.18-.8-.29-1.11-.81-.92L4.6 13.78c-.78.3-.77.74-.13.94l3.2.99 7.42-4.68c.35-.22.67-.1.41.14"/>
          </svg>
          Telegram
        </a>
        <a
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 hover:bg-white/10"
          href="https://x.com/ASTEROIDSTR"
          target="_blank"
          rel="noreferrer"
          aria-label="X (Twitter)"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
            aria-hidden
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X
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
