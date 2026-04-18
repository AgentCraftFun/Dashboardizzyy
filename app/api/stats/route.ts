import { NextResponse } from "next/server";
import { ADDRESSES, ASTSTR_ABI } from "@/lib/contracts";
import { publicClient } from "@/lib/viem";
import { cached } from "@/lib/cache";
import type { StatsPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadStats(): Promise<StatsPayload> {
  const contract = {
    address: ADDRESSES.ASTSTR,
    abi: ASTSTR_ABI,
  } as const;

  const [
    statsResult,
    burnThreshold,
    totalEthToBurn,
    buyTotalFees,
    sellTotalFees,
    blockNumber,
  ] = await Promise.all([
    publicClient.readContract({ ...contract, functionName: "stats" }),
    publicClient.readContract({ ...contract, functionName: "burnThreshold" }),
    publicClient.readContract({ ...contract, functionName: "totalEthToBurn" }),
    publicClient.readContract({ ...contract, functionName: "buyTotalFees" }),
    publicClient.readContract({ ...contract, functionName: "sellTotalFees" }),
    publicClient.getBlockNumber(),
  ]);

  const s = statsResult as readonly bigint[];

  return {
    asteroidAtDead: s[0].toString(),
    contractEthBalance: s[1].toString(),
    globalAsteroidBurned: s[2].toString(),
    totalAsteroidBurned: s[3].toString(),
    totalEthToDev: s[4].toString(),
    pendingBurnEth: s[5].toString(),
    burnThreshold: (burnThreshold as bigint).toString(),
    totalEthToBurn: (totalEthToBurn as bigint).toString(),
    buyTotalFees: (buyTotalFees as bigint).toString(),
    sellTotalFees: (sellTotalFees as bigint).toString(),
    blockNumber: blockNumber.toString(),
    fetchedAt: Math.floor(Date.now() / 1000),
  };
}

export async function GET() {
  try {
    const data = await cached("stats:v1", 10_000, loadStats);
    return NextResponse.json(data, {
      headers: { "cache-control": "public, max-age=0, s-maxage=10" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
