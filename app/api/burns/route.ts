import { NextResponse } from "next/server";
import { parseAbiItem } from "viem";
import { ADDRESSES } from "@/lib/contracts";
import { publicClient } from "@/lib/viem";
import { cached } from "@/lib/cache";
import type { BurnEvent, BurnsPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ASTEROID_BURNED_EVENT = parseAbiItem(
  "event AsteroidBurned(uint256 ethSpent, uint256 asteroidBurned)",
);

// Keep chunks well under the tightest public-RPC getLogs window (~5k blocks).
const CHUNK = 4_999n;
// 50k blocks ≈ 7 days — small enough to finish on rate-limited public RPCs.
const DEFAULT_LOOKBACK = 50_000n;

function runWithLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const idx = i++;
        if (idx >= items.length) return;
        results[idx] = await worker(items[idx], idx);
      }
    },
  );
  return Promise.all(runners).then(() => results);
}

async function loadBurns(lookback: bigint): Promise<BurnsPayload> {
  const latest = await publicClient.getBlockNumber();
  const envStart = process.env.EVENT_START_BLOCK?.trim();
  const startFromEnv = envStart ? BigInt(envStart) : null;
  const fromBlock =
    startFromEnv && startFromEnv > 0n
      ? startFromEnv
      : latest > lookback
        ? latest - lookback
        : 0n;

  const ranges: { from: bigint; to: bigint }[] = [];
  for (let cursor = fromBlock; cursor <= latest; cursor += CHUNK + 1n) {
    const to = cursor + CHUNK > latest ? latest : cursor + CHUNK;
    ranges.push({ from: cursor, to });
  }

  // Serial scan to avoid rate-limiting public RPCs. With 4999-block chunks
  // and 50k lookback this is ~10 calls; quick even on slow endpoints.
  const logsArrays = await runWithLimit(ranges, 2, async (range) => {
    try {
      return await publicClient.getLogs({
        address: ADDRESSES.ASTSTR,
        event: ASTEROID_BURNED_EVENT,
        fromBlock: range.from,
        toBlock: range.to,
      });
    } catch {
      return [];
    }
  });

  const logs = logsArrays.flat();

  const uniqBlocks = Array.from(new Set(logs.map((l) => l.blockNumber!.toString())));
  const blockTimestamps = new Map<string, number>();
  await runWithLimit(uniqBlocks, 4, async (blockStr) => {
    try {
      const block = await publicClient.getBlock({ blockNumber: BigInt(blockStr) });
      blockTimestamps.set(blockStr, Number(block.timestamp));
    } catch {
      blockTimestamps.set(blockStr, 0);
    }
  });

  const burns: BurnEvent[] = logs.map((log) => {
    const blockStr = log.blockNumber!.toString();
    return {
      txHash: log.transactionHash ?? "",
      blockNumber: blockStr,
      logIndex: Number(log.logIndex ?? 0),
      timestamp: blockTimestamps.get(blockStr) ?? 0,
      ethSpent: (log.args.ethSpent ?? 0n).toString(),
      asteroidBurned: (log.args.asteroidBurned ?? 0n).toString(),
    };
  });

  burns.sort((a, b) => {
    if (a.timestamp !== b.timestamp) return b.timestamp - a.timestamp;
    const ab = BigInt(a.blockNumber);
    const bb = BigInt(b.blockNumber);
    if (ab !== bb) return Number(bb - ab);
    return b.logIndex - a.logIndex;
  });

  return {
    burns,
    scannedFromBlock: fromBlock.toString(),
    latestBlock: latest.toString(),
    fetchedAt: Math.floor(Date.now() / 1000),
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const blocksParam = url.searchParams.get("blocks");
    const override = blocksParam ? BigInt(blocksParam) : null;
    const lookback =
      override && override > 0n && override <= 500_000n
        ? override
        : DEFAULT_LOOKBACK;

    const key = `burns:v2:${lookback.toString()}`;
    const data = await cached(key, 60_000, () => loadBurns(lookback));
    return NextResponse.json(data, {
      headers: { "cache-control": "public, max-age=0, s-maxage=60" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
