import { NextResponse } from "next/server";
import { publicClient, RPC_URLS } from "@/lib/viem";
import { ADDRESSES, ASTSTR_ABI } from "@/lib/contracts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const started = Date.now();
  const result: Record<string, unknown> = {
    rpcs: RPC_URLS.map((u) => u.replace(/\/[^/]*$/, "/…")),
    envRpcSet: Boolean(process.env.ETH_RPC_URL),
  };
  try {
    const [blockNumber, totalAsteroidBurned, pendingBurnEth] = await Promise.all([
      publicClient.getBlockNumber(),
      publicClient.readContract({
        address: ADDRESSES.ASTSTR,
        abi: ASTSTR_ABI,
        functionName: "totalAsteroidBurned",
      }),
      publicClient.readContract({
        address: ADDRESSES.ASTSTR,
        abi: ASTSTR_ABI,
        functionName: "pendingBurnEth",
      }),
    ]);
    result.ok = true;
    result.blockNumber = blockNumber.toString();
    result.totalAsteroidBurned = (totalAsteroidBurned as bigint).toString();
    result.pendingBurnEth = (pendingBurnEth as bigint).toString();
  } catch (err) {
    result.ok = false;
    result.error = err instanceof Error ? err.message : String(err);
  }
  result.ms = Date.now() - started;
  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
    headers: { "cache-control": "no-store" },
  });
}
