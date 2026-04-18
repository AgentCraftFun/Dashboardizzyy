export type StatsPayload = {
  // all values encoded as base-10 strings (bigint-safe for JSON)
  asteroidAtDead: string;
  contractEthBalance: string;
  globalAsteroidBurned: string;
  totalAsteroidBurned: string;
  totalEthToDev: string;
  pendingBurnEth: string;
  burnThreshold: string;
  totalEthToBurn: string;
  buyTotalFees: string;
  sellTotalFees: string;
  asteroidDecimals: number;
  blockNumber: string;
  fetchedAt: number;
};

export type BurnEvent = {
  txHash: string;
  blockNumber: string;
  logIndex: number;
  timestamp: number; // unix seconds
  ethSpent: string; // wei
  asteroidBurned: string; // raw token units (18 decimals assumed)
};

export type BurnsPayload = {
  burns: BurnEvent[];
  scannedFromBlock: string;
  latestBlock: string;
  fetchedAt: number;
};

export type DexPair = {
  priceUsd?: string;
  priceNative?: string;
  fdv?: number;
  marketCap?: number;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  url?: string;
};

export type PricePayload = {
  asteroid: DexPair | null;
  aststr: DexPair | null;
  fetchedAt: number;
};
