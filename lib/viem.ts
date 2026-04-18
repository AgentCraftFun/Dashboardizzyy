import { createPublicClient, fallback, http } from "viem";
import { mainnet } from "viem/chains";

const envUrl = process.env.ETH_RPC_URL?.trim();

// Public RPCs used as a fallback ladder. The first one that responds wins;
// viem's fallback transport will rotate through the list on error/timeout.
const PUBLIC_RPCS = [
  "https://eth.llamarpc.com",
  "https://ethereum-rpc.publicnode.com",
  "https://rpc.ankr.com/eth",
  "https://cloudflare-eth.com",
];

const urls = envUrl ? [envUrl, ...PUBLIC_RPCS] : PUBLIC_RPCS;

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(
    urls.map((url) =>
      http(url, {
        timeout: 20_000,
        retryCount: 1,
        retryDelay: 300,
      }),
    ),
    { rank: false, retryCount: 0 },
  ),
});

export const RPC_URLS = urls;
