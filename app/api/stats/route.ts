import { NextResponse } from "next/server";
import { ADDRESSES, ASTSTR_ABI, ERC20_ABI } from "@/lib/contracts";
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
    burnThreshold,
    totalEthToBurn,
    totalEthToDev,
    pendingBurnEth,
    totalAsteroidBurned,
    buyTotalFees,
    sellTotalFees,
    asteroidDecimalsRaw,
    asteroidAtDead,
    contractEthBalance,
    blockNumber,
  ] = await Promise.all([
    publicClient.readContract({ ...contract, functionName: "burnThreshold" }),
    publicClient.readContract({ ...contract, functionName: "totalEthToBurn" }),
    publicClient.readContract({ ...contract, functionName: "totalEthToDev" }),
    publicClient.readContract({ ...contract, functionName: "pendingBurnEth" }),
    publicClient.readContract({ ...contract, functionName: "totalAsteroidBurned" }),
    publicClient.readContract({ ...contract, functionName: "buyTotalFees" }),
    publicClient.readContract({ ...contract, functionName: "sellTotalFees" }),
    publicClient
      .readContract({
        address: ADDRESSES.ASTEROID,
        abi: ERC20_ABI,
        functionName: "decimals",
      })
      .catch(() => 18 as number),
    publicClient
      .readContract({
        address: ADDRESSES.ASTEROID,
        abi: [
          {
            type: "function",
            name: "balanceOf",
            stateMutability: "view",
            inputs: [{ name: "account", type: "address" }],
            outputs: [{ name: "", type: "uint256" }],
          },
        ] as const,
        functionName: "balanceOf",
        args: [ADDRESSES.DEAD],
      })
      .catch(() => 0n),
    publicClient.getBalance({ address: ADDRESSES.ASTSTR }).catch(() => 0n),
    publicClient.getBlockNumber(),
  ]);

  return {
    asteroidAtDead: (asteroidAtDead as bigint).toString(),
    contractEthBalance: (contractEthBalance as bigint).toString(),
    globalAsteroidBurned: (asteroidAtDead as bigint).toString(),
    totalAsteroidBurned: (totalAsteroidBurned as bigint).toString(),
    totalEthToDev: (totalEthToDev as bigint).toString(),
    pendingBurnEth: (pendingBurnEth as bigint).toString(),
    burnThreshold: (burnThreshold as bigint).toString(),
    totalEthToBurn: (totalEthToBurn as bigint).toString(),
    buyTotalFees: (buyTotalFees as bigint).toString(),
    sellTotalFees: (sellTotalFees as bigint).toString(),
    asteroidDecimals: Number(asteroidDecimalsRaw),
    blockNumber: blockNumber.toString(),
    fetchedAt: Math.floor(Date.now() / 1000),
  };
}

export async function GET() {
  try {
    const data = await cached("stats:v3", 10_000, loadStats);
    return NextResponse.json(data, {
      headers: { "cache-control": "public, max-age=0, s-maxage=10" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
