# ASTSTR Burn Tracker

Real-time dashboard for the **$ASTSTR** buyback-and-burn of **$ASTEROID Shiba** on Ethereum mainnet.

It reads live on-chain state from the ASTSTR contract, streams `AsteroidBurned`
events, and pulls token prices from DEX Screener — no database, no wallet
connect, no browser storage. Everything is fetched fresh every 15 seconds.

## What it shows

- **Hero**: total $ASTEROID burned by $ASTSTR + USD value
- **Progress bar**: `pendingBurnEth / burnThreshold` with a pulsing "BURN IMMINENT" badge at 100%
- **Stats grid**: cumulative ETH to burns, ETH to dev, total burn count, average burn size
- **Live burn feed**: last 20 `AsteroidBurned` events, auto-refresh + new-entry flash + optional chime
- **Burn rate chart**: 24h / 7d / all-time bars from parsed events
- **Hall of fame**: top 5 largest single burns
- **Token info**: $ASTSTR price, 24h change/volume/liquidity, quick links (Uniswap / DEX Screener / Etherscan)

## Contracts

| Token / Wallet | Address |
| --- | --- |
| $ASTSTR | `0xc43D355CAd4E773a03DfeFc994D143d5835Ea799` |
| $ASTEROID Shiba | `0xf280B16EF293D8e534e370794ef26bF312694126` |
| Dev wallet | `0xEAEdC01656E0e497Fd4a265170A3a9f839d92914` |
| Burn address | `0x000000000000000000000000000000000000dEaD` |

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Configuration

Optional environment variables (see `.env.example`):

- `ETH_RPC_URL` — override the default public RPC (`https://eth.llamarpc.com`) with Alchemy/Infura for higher reliability.
- `EVENT_START_BLOCK` — start block for the historical `AsteroidBurned` scan. If unset, the last ~200k blocks (~28 days) are scanned.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. (Optional) set `ETH_RPC_URL` in Project → Settings → Environment Variables.
4. Deploy — no extra config needed.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (dark space theme, ember/fire accents)
- viem for Ethereum RPC reads and event logs
- DEX Screener REST for prices
