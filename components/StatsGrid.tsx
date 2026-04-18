"use client";

import { formatEth, formatNumber, toNumber } from "@/lib/format";

type Props = {
  totalEthToBurn: string | null;
  totalEthToDev: string | null;
  burnCount: number | null;
  buyFee: string | null;
  sellFee: string | null;
};

function Card({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "ember" | "cool";
}) {
  return (
    <div
      className={`card p-4 sm:p-5 ${
        accent === "ember" ? "card-ember" : ""
      }`}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">
        {label}
      </div>
      <div className="mt-2 num text-2xl font-semibold text-white sm:text-3xl">
        {value}
      </div>
      {sub !== undefined && (
        <div className="mt-1 text-xs text-white/50">{sub}</div>
      )}
    </div>
  );
}

export function StatsGrid({
  totalEthToBurn,
  totalEthToDev,
  burnCount,
  buyFee,
  sellFee,
}: Props) {
  const avgBurn =
    totalEthToBurn && burnCount && burnCount > 0
      ? toNumber(totalEthToBurn) / burnCount
      : null;

  const buyFeePct = buyFee !== null ? Number(buyFee) / 100 : null;
  const sellFeePct = sellFee !== null ? Number(sellFee) / 100 : null;

  return (
    <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          label="ETH spent on burns"
          accent="ember"
          value={
            totalEthToBurn === null ? (
              <span className="inline-block h-7 w-28 rounded shimmer" />
            ) : (
              <>
                {formatEth(totalEthToBurn, 4)}{" "}
                <span className="text-sm text-white/50">ETH</span>
              </>
            )
          }
          sub="Cumulative ETH swapped for $ASTEROID"
        />
        <Card
          label="ETH paid to dev"
          value={
            totalEthToDev === null ? (
              <span className="inline-block h-7 w-28 rounded shimmer" />
            ) : (
              <>
                {formatEth(totalEthToDev, 4)}{" "}
                <span className="text-sm text-white/50">ETH</span>
              </>
            )
          }
          sub="Cumulative dev payouts"
        />
        <Card
          label="Total burns fired"
          value={
            burnCount === null ? (
              <span className="inline-block h-7 w-16 rounded shimmer" />
            ) : (
              <>
                {burnCount.toLocaleString()}{" "}
                <span className="text-sm text-white/50">txs</span>
              </>
            )
          }
          sub="From AsteroidBurned events"
        />
        <Card
          label="Average burn size"
          value={
            avgBurn === null ? (
              <span className="inline-block h-7 w-24 rounded shimmer" />
            ) : (
              <>
                {formatNumber(avgBurn, 4)}{" "}
                <span className="text-sm text-white/50">ETH</span>
              </>
            )
          }
          sub={
            buyFeePct !== null && sellFeePct !== null ? (
              <>
                Fees: buy{" "}
                <span className="text-white/80">{buyFeePct.toFixed(1)}%</span>,
                sell{" "}
                <span className="text-white/80">{sellFeePct.toFixed(1)}%</span>
              </>
            ) : (
              "per burn transaction"
            )
          }
        />
      </div>
    </section>
  );
}
