import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const RPC_URL = process.env.ETH_RPC_URL?.trim() || "https://eth.llamarpc.com";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL, {
    timeout: 15_000,
    retryCount: 2,
  }),
});
