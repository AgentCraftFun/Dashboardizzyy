import type { Abi, Address } from "viem";

export const ADDRESSES = {
  ASTSTR: "0xc43D355CAd4E773a03DfeFc994D143d5835Ea799" as Address,
  ASTEROID: "0xf280B16EF293D8e534e370794ef26bF312694126" as Address,
  DEV: "0xEAEdC01656E0e497Fd4a265170A3a9f839d92914" as Address,
  DEAD: "0x000000000000000000000000000000000000dEaD" as Address,
} as const;

export const ETHERSCAN_TX = (hash: string) => `https://etherscan.io/tx/${hash}`;
export const ETHERSCAN_ADDR = (addr: string) => `https://etherscan.io/address/${addr}`;
export const UNISWAP_BUY = (token: string) =>
  `https://app.uniswap.org/swap?outputCurrency=${token}&chain=mainnet`;
export const DEXSCREENER_TOKEN = (token: string) =>
  `https://dexscreener.com/ethereum/${token}`;

export const ASTSTR_ABI = [
  {
    type: "function",
    name: "stats",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256[6]" }],
  },
  {
    type: "function",
    name: "burnThreshold",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalEthToBurn",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "buyTotalFees",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "sellTotalFees",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "AsteroidBurned",
    inputs: [
      { name: "ethSpent", type: "uint256", indexed: false },
      { name: "asteroidBurned", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DevPaid",
    inputs: [{ name: "amount", type: "uint256", indexed: false }],
    anonymous: false,
  },
] as const satisfies Abi;
