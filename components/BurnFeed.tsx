"use client";

import { useEffect, useRef, useState } from "react";
import type { BurnEvent } from "@/lib/types";
import { ETHERSCAN_TX } from "@/lib/contracts";
import {
  formatEth,
  formatRelative,
  formatToken,
  truncateHash,
} from "@/lib/format";

export function BurnFeed({
  burns,
  loading,
  soundOn,
  lastUpdated,
}: {
  burns: BurnEvent[];
  loading: boolean;
  soundOn: boolean;
  lastUpdated: number | null;
}) {
  const [flashSet, setFlashSet] = useState<Set<string>>(new Set());
  const seenKeys = useRef<Set<string>>(new Set());
  const initialized = useRef(false);
  // force relative-time re-render every 30s
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ids = burns.slice(0, 20).map(keyOf);
    if (!initialized.current) {
      ids.forEach((id) => seenKeys.current.add(id));
      initialized.current = true;
      return;
    }
    const fresh = ids.filter((id) => !seenKeys.current.has(id));
    if (fresh.length === 0) return;
    fresh.forEach((id) => seenKeys.current.add(id));
    setFlashSet((prev) => {
      const next = new Set(prev);
      fresh.forEach((id) => next.add(id));
      return next;
    });
    if (soundOn) playBurnChime();
    const timer = setTimeout(() => {
      setFlashSet((prev) => {
        const next = new Set(prev);
        fresh.forEach((id) => next.delete(id));
        return next;
      });
    }, 2_600);
    return () => clearTimeout(timer);
  }, [burns, soundOn]);

  const top = burns.slice(0, 20);

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-ember-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Live burn feed
            </h2>
          </div>
          <div className="text-xs text-white/40">
            {lastUpdated
              ? `updated ${formatRelative(lastUpdated)}`
              : loading
                ? "loading…"
                : ""}
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {loading && top.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-3 px-5 py-4">
                <div className="col-span-3 h-4 rounded shimmer" />
                <div className="col-span-3 h-4 rounded shimmer" />
                <div className="col-span-4 h-4 rounded shimmer" />
                <div className="col-span-2 h-4 rounded shimmer" />
              </div>
            ))
          ) : top.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-white/50">
              No burns in the scanned window yet. 🪐
            </div>
          ) : (
            top.map((b) => {
              const k = keyOf(b);
              const isFresh = flashSet.has(k);
              return (
                <div
                  key={k}
                  className={`grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm ${
                    isFresh ? "animate-flashGreen" : ""
                  }`}
                >
                  <div className="col-span-12 text-xs text-white/50 sm:col-span-3">
                    {b.timestamp ? formatRelative(b.timestamp) : "pending…"}
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                      {formatToken(b.asteroidBurned, 18, 2)}
                    </div>
                  </div>
                  <div className="col-span-12 text-right sm:col-span-2">
                    <a
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10"
                      href={ETHERSCAN_TX(b.txHash)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {truncateHash(b.txHash)} ↗
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function keyOf(b: BurnEvent): string {
  return `${b.txHash}-${b.logIndex}`;
}

let audioCtxSingleton: AudioContext | null = null;
function playBurnChime() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    if (!audioCtxSingleton) audioCtxSingleton = new AC();
    const ctx = audioCtxSingleton;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  } catch {
    // ignore audio errors
  }
}
