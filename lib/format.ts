import { formatEther, formatUnits } from "viem";

export function formatEth(value: bigint | string | number, decimals = 4): string {
  const v = typeof value === "bigint" ? value : BigInt(value);
  const asFloat = Number(formatEther(v));
  return asFloat.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatToken(
  value: bigint | string | number,
  tokenDecimals = 18,
  displayDecimals = 2,
): string {
  const v = typeof value === "bigint" ? value : BigInt(value);
  const asFloat = Number(formatUnits(v, tokenDecimals));
  return asFloat.toLocaleString(undefined, {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  });
}

// Picks a sensible number of display decimals based on magnitude so tiny
// values don't silently round to 0.00 and huge values aren't flooded with
// noise. Works for whole-token amounts (already scaled by decimals).
export function formatTokenSmart(
  value: bigint | string | number,
  tokenDecimals = 18,
): string {
  const v = typeof value === "bigint" ? value : BigInt(value);
  if (v === 0n) return "0";
  const asFloat = Number(formatUnits(v, tokenDecimals));
  if (!Number.isFinite(asFloat)) return "—";
  const abs = Math.abs(asFloat);
  let decimals: number;
  if (abs >= 1_000) decimals = 0;
  else if (abs >= 1) decimals = 2;
  else if (abs >= 0.01) decimals = 4;
  else if (abs >= 0.0001) decimals = 6;
  else decimals = 8;
  return asFloat.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function toNumber(value: bigint | string | number, decimals = 18): number {
  const v = typeof value === "bigint" ? value : BigInt(value);
  return Number(formatUnits(v, decimals));
}

export function toNumberWithDecimals(
  value: bigint | string | number,
  decimals: number,
): number {
  const v = typeof value === "bigint" ? value : BigInt(value);
  return Number(formatUnits(v, decimals));
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "$—";
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`;
  }
  if (value >= 1_000) {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatRelative(ts: number): string {
  const diff = Math.max(0, Date.now() / 1000 - ts);
  if (diff < 45) return `${Math.floor(diff)} sec ago`;
  if (diff < 90) return `1 min ago`;
  if (diff < 60 * 60) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 60 * 60 * 2) return `1 hr ago`;
  if (diff < 60 * 60 * 24) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 60 * 60 * 48) return `1 day ago`;
  return `${Math.floor(diff / 86_400)} days ago`;
}

export function truncateHash(hash: string, head = 6, tail = 4): string {
  if (hash.length <= head + tail + 2) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
}
