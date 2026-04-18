import { NextResponse } from "next/server";
import { ADDRESSES } from "@/lib/contracts";
import { cached } from "@/lib/cache";
import type { DexPair, PricePayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DexScreenerResponse = {
  pairs?: Array<{
    chainId?: string;
    priceUsd?: string;
    priceNative?: string;
    fdv?: number;
    marketCap?: number;
    volume?: { h24?: number };
    priceChange?: { h24?: number };
    liquidity?: { usd?: number };
    url?: string;
  }>;
};

async function fetchToken(address: string): Promise<DexPair | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as DexScreenerResponse;
    const pairs = json.pairs?.filter((p) => p.chainId === "ethereum") ?? [];
    if (pairs.length === 0) return null;
    // Pick the most liquid pair
    pairs.sort(
      (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0),
    );
    const p = pairs[0];
    return {
      priceUsd: p.priceUsd,
      priceNative: p.priceNative,
      fdv: p.fdv,
      marketCap: p.marketCap,
      volume: { h24: p.volume?.h24 },
      priceChange: { h24: p.priceChange?.h24 },
      liquidity: { usd: p.liquidity?.usd },
      url: p.url,
    };
  } catch {
    return null;
  }
}

async function loadPrices(): Promise<PricePayload> {
  const [asteroid, aststr] = await Promise.all([
    fetchToken(ADDRESSES.ASTEROID),
    fetchToken(ADDRESSES.ASTSTR),
  ]);
  return { asteroid, aststr, fetchedAt: Math.floor(Date.now() / 1000) };
}

export async function GET() {
  try {
    const data = await cached("prices:v1", 30_000, loadPrices);
    return NextResponse.json(data, {
      headers: { "cache-control": "public, max-age=0, s-maxage=30" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
