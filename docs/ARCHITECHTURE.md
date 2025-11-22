# Gravity Protocol Architecture

Gravity fuses off-chain graph intelligence with on-chain Uniswap v4 hooks so that *any* ERC20 can settle to MNEE in a single transaction without trusting centralized routers. Prior to Gravity, Web3 payments either (a) relied on monolithic router contracts that could mutate paths mid-flight or (b) demanded users manually bridge through multiple pools. By externalizing route discovery, then cryptographically revalidating every hop, amount, and fee inside a hook-aware settlement contract, we’ve created the first payment rail that is both **route-flexible and MEV-resistant**. TokenRouter’s BFS-ready adjacency APIs, GravityPayment’s immutable receipts, and MNEESwapHook’s per-hop guards simply did not coexist elsewhere in the ecosystem—making Gravity an innovative blueprint for deterministic, multi-asset settlement.

## 1. System Topology

| Layer | Artifact | Responsibilities |
| --- | --- | --- |
| Client | `GravitySWAP.ts` | Builds an in-memory graph from `TokenRouter`, runs BFS, prices routes, enforces user slippage, and submits `GravityPayment.pay`. |
| Settlement | `GravityPayment.sol` | Custodies ERC20 input, revalidates routes, charges protocol fees, dispatches swaps through the hook, and stores immutable receipts. |
| Routing Registry | `TokenRouter.sol` | Canonical source of truth for supported tokens, pool adjacency, liquidity scores, and deterministic output simulation. |
| Execution Hook | `MNEESwapHook.sol` | Executes each hop inside the Uniswap v4 hook sandbox, enforcing allowlists, per-hop slippage, and swap fees before calling `PoolSwapTest`. |
| Tooling | Mocks, Hardhat, env templates | Provide deterministic test doubles, deployment automation, and network-aware configuration (Sepolia defaults via `.env.example`). |

## 2. Contract Deep Dive

### 2.1 GravityPayment.sol

**Storage (trimmed):**
- `ITokenRouter public immutable tokenRouter;`
- `IMNEESwapHook public immutable swapHook;`
- `IERC20 public immutable mneeToken;`
- `uint256 public protocolFeeBps;`
- `mapping(uint256 => Payment) public payments;`

**Critical invariants:**
1. `payments[paymentId]` is immutable after creation; no edits, ensuring off-chain reconciliation cannot be spoofed.
2. `protocolFeeBps < BASIS_POINTS` prevents fee math overflow and guarantees a positive payout for successful swaps.
3. Tokens/amounts forwarded to the hook equal the user-supplied `amountIn` minus protocol fees; no silent skimming occurs after validation.

**Lifecycle:**
1. `pay(...)` requires the caller to pre-approve `amountIn` of `tokenIn` to the contract. Funds are pulled with `_pullFunds` and the protocol fee is siphoned to `feeTreasury` (if configured).
2. The supplied `swapPath` is validated via `tokenRouter.validatePath`. Non-compliant paths revert with custom errors (e.g., `InvalidPath`).
3. The remaining amount flows to `swapHook.multihopSwap(...)`. Any revert inside the hook bubbles up, ensuring atomicity.
4. On success, the function emits `PaymentMade(paymentId, eventId, payer, recipient, tokenIn, amountIn, mneeAmount, swapPath, block.timestamp)` and returns `(paymentId, mneeAmount)`.

**Observability:** `PaymentMade` is intentionally verbose (includes stringified path) to support analytics without rehydrating calldata off-chain. Consumers can index by `paymentId` or `eventId`.

### 2.2 TokenRouter.sol

**Purpose:** deterministic routing registry that off-chain searchers trust for graph edges and expected outputs.

**Key data structures:**
- `mapping(address => TokenInfo) tokenRegistry;` (supports bool flags, decimals, liquidity score, timestamps).
- `mapping(address => address[]) adjacencyList;` – directional edges used by BFS.
- `mapping(address => mapping(address => bytes32)) poolIdsByPair;` – resolves a token edge to a Uniswap v4 `PoolId`.
- `mapping(bytes32 => uint256) poolExchangeRates;` – WAD-scaled price snapshots for quick output simulation.

**Public surfaces:**
- `getNeighbors(token)` — used by GravitySWAP for graph traversal.
- `calculateExpectedOutput(tokenIn, amountIn, path)` — multiplies through stored `rateWad` + fee data to approximate final MNEE; re-used on-chain for path sanity checks.
- `validatePath(path)` — ensures all tokens are registered, edges exist, and total hops ≤ `MAX_HOPS` (default 5).
- Admin APIs (`registerToken`, `registerPool`, `setIntermediateToken`, `setPoolExchangeRate`) gated by `Ownable` to keep registry integrity tight.

**Security levers:**
- `MIN_LIQUIDITY_SCORE` can be enforced off-chain to ignore illiquid tokens even if technically registered.
- All adjacency edits happen through `_linkTokens`, keeping `hasDirectPool` matrices in sync.

### 2.3 MNEESwapHook.sol

**Context:** runs alongside the Uniswap v4 `PoolManager` (Sepolia address `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`). Uses the official `PoolSwapTest` harness for deterministic swaps.

**Constructor inputs:** `_poolManager` and `_mneeToken` are injected to keep deployments flexible across networks. The hook instantiates its own `PoolSwapTest` tied to the manager, guaranteeing consistent state.

**Token controls:**
- `mapping(address => bool) allowedTokens` gates every hop. Constructor seeds USDC, USDT, DAI, WETH, and MNEE; governance can update via `registerToken` (owner or tokenRouter-only).
- `hopSlippageToleranceBps` (default 1000 = 10%) enforces per-hop minimums to avoid invisible value bleed.

**Swap path enforcement:**
- `multihopSwap(tokenIn, path, amountIn, amountOutMin, recipient)` pulls funds once, loops over `path`, and for each hop calculates `hopMinOut = isLastHop ? amountOutMin : _minHopOutput(currentAmount)` where `_minHopOutput` piggybacks `hopSlippageToleranceBps`.
- `_executeSwap` builds a `PoolKey` and calls `poolSwapTest.swap` with deterministic parameters (MIN/MAX sqrt price limits depending on direction). The returned `BalanceDelta` is converted into unsigned output, compared against `hopMinOut`, and transferred to the next hop or final recipient.

**Eventing:** `TokenSwap(tokenIn, tokenOut, amountIn, amountOut, recipient)` is emitted per hop, enabling auditors to replay full routes even when `swapPath` is long.

### 2.4 Support Contracts
- `MockERC20` — mint/burn, controllable decimals, simple permit support for tests.
- `MockPoolManager` — local shim mimicking `IPoolManager` behavior without full Uniswap v4 plumbing; used in Foundry/Hardhat tests.

## 3. Execution Timeline (Payer → Recipient)

1. **Graph hydration** — GravitySWAP fetches `getSupportedTokens`, `getIntermediateTokens`, and caches neighbor lists. Each call is a pure RPC read (no gas).
2. **Route search** — BFS from `tokenIn` to `MNEE_TOKEN_ADDRESS`, bounded by `MAX_HOPS`. Candidates are validated with `validatePath` before quote simulation.
3. **Quote + slippage** — Using `calculateExpectedOutput`, the client derives `expectedMNEE`. Slippage config (default 500 bps) yields `minMNEEOut = expectedMNEE * (1 - slippageBps/10_000)` enforced later on-chain.
4. **Allowance checks** — `_ensureApproval` compares current ERC20 allowance vs. `amountIn`, issuing an `approve` if needed (user sees this once per token).
5. **Transaction submission** — The client calls `GravityPayment.pay` with the full payload. Gas estimation reflects multi-hop complexity.
6. **On-chain validation** — `GravityPayment` re-runs `validatePath`, verifies allowances/balances, subtracts protocol fees, and forwards the net to `MNEESwapHook`.
7. **Per-hop enforcement** — The hook ensures each `(fromToken, toToken)` pair is allowlisted, enforces per-hop slippage, and executes `PoolSwapTest` swaps. Any hop failure reverts the entire transaction.
8. **Settlement** — Final MNEE proceeds are transferred to the `recipient`. `PaymentMade` + per-hop `TokenSwap` events are emitted, and `payments[paymentId]` is persisted for later queries.

## 4. Data Surfaces & Telemetry

| Event | Emitted by | Fields |
| --- | --- | --- |
| `PaymentMade` | GravityPayment | `paymentId`, `eventId`, `payer`, `recipient`, `originalToken`, `originalAmount`, `mneeAmount`, `swapPath`, `timestamp`. |
| `TokenSwap` | MNEESwapHook | `tokenIn`, `tokenOut`, `amountIn`, `amountOut`, `recipient`. |
| `TokenRegistered`, `PoolRegistered`, `PoolRateUpdated` | TokenRouter | Track governance mutations for off-chain synchronizers. |
| `TokenRouterUpdated`, `SwapFeeUpdated`, `HopSlippageToleranceUpdated` | MNEESwapHook | Signals runtime configuration changes to monitoring systems. |

**Read APIs:**
- `GravityPayment.payments(paymentId)` — immutable receipt view used by explorers/UI.
- `TokenRouter.tokenRegistry(token)` — returns metadata (decimals, liquidity score, support flags).
- `TokenRouter.getPoolRate(tokenA, tokenB)` — exposes the WAD-scaled price snapshot used for quotes.

## 5. Configuration & Deployment Notes

- `.env.example` (in `Gravity/`) contains Sepolia defaults for PoolManager, Permit2, Universal Router, etc., plus the canonical MNEE token `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`.
- `hardhat.config.ts` already declares a `sepolia` network using `SEPOLIA_RPC_URL` + `SEPOLIA_PRIVATE_KEY` configuration variables, so CI/CD can inject secrets without touching source.
- `config/networks.ts` exports `getNetworkAddresses(chainId)` so TypeScript clients automatically fill Permit2/Universal Router addresses for known chains (currently 11155111).

## 6. Security Considerations

- **Route integrity**: The path supplied by the client must pass both off-chain BPM validations and on-chain `validatePath`. Any attempt to inject unsupported tokens/pools reverts.
- **Slippage control**: Two layers exist — user-level `minMNEEOut` enforced by GravityPayment and per-hop tolerances enforced by the hook.
- **Token allowlists**: Only governance (owner) or the configured `tokenRouter` can toggle allowed tokens in the hook, limiting blast radius if a token becomes compromised.
- **Fee math**: All fees use WAD/bps arithmetic with `Math.mulDiv` (from OZ) to avoid rounding surprises. Protocol fees are capped via config to guarantee positive settlement.
- **Reentrancy**: Hooks operate on trusted Uniswap v4 primitives; ERC20 transfers leverage `SafeERC20` and the contract avoids external callbacks beyond the hook pipeline.

## 7. Off-chain Clients & Scripts (Gravity/scripts)

- `GravitySWAP.ts` — flagship router client (loads dotenv, fetches network defaults, performs BFS/BFS scoring, and triggers payments).
- `example-payment.ts` — thin wrapper showing how to integrate GravitySWAP in application code.
- `token-discovery.ts` — metadata helper for listing tokens/pools (future dashboard use).
- `swap-to-mnee.ts` — legacy Uniswap SDK script retained for reference but superseded by GravitySWAP.
- `send-op-tx.ts` — sandbox script for Optimism transactions; not part of the core payment flow.

> Recommendation: keep GravitySWAP as the canonical client, retire legacy helpers once dashboards migrate to the new routing API.

## 8. Future Extensions


This document serves as the technical reference for auditors, contributors, and integrators. For day-to-day usage instructions see `Gravity/README.md`; for contract APIs inspect the generated TypeChain typings.# Gravity ERC20 Architecture

## 9. Diagram Guidance

When producing a visual architecture diagram, capture the following layers and flows:

1. **Actors**: Payer wallet, GravitySWAP client, GravityPayment contract, TokenRouter registry, MNEESwapHook, Uniswap v4 PoolManager, Recipient wallet.
2. **Data paths**: Off-chain RPC reads (TokenRouter neighbors/quotes), on-chain `pay` transaction, funds flowing into the hook, hop-by-hop swaps across pools, final MNEE transfer.
3. **Control checks**: Highlight where validations occur (off-chain BFS validation, on-chain `validatePath`, hook allowlists/slippage enforcement).
4. **Event emission**: Show `PaymentMade` and `TokenSwap` outputs feeding monitoring/analytics systems.
5. **Configuration inputs**: `.env`/network defaults (Permit2, PoolManager, Universal Router) to illustrate environment-specific parameters.

A swim-lane or layered diagram (client → settlement → hook/pools → recipient) works well. Consider annotating each arrow with the ABI/function invoked and whether the call is read-only or state-changing. Tools like Excalidraw, Miro, or Mermaid can encode this for documentation reuse.

## System Overview
- **Goal**: Enable on-chain ERC20 payments that settle in MNEE while enforcing protocol fees, configurable swap protections, and auditable events.
- **Layers**: (1) Off-chain TypeScript router discovers viable swap paths, (2) On-chain contracts validate and execute payments, (3) Auxiliary tooling supports deployment, discovery, and demos.
- **Separation of concerns**: Route finding remains off-chain to minimize gas and allow complex graph searches, while smart contracts focus on validation, accounting, and execution safety.

## Core Contracts

### GravityPayment.sol
- Coordinates user payments and the final settlement into MNEE via Uniswap v4 pools.
- Requires callers to supply a path verified against `TokenRouter`; re-validates hops, poolIds, and amounts for trust minimization.
- Handles ERC20 transfers, protocol fee calculation, and swap execution by forwarding to `MNEESwapHook`.
- Emits structured events (payer, beneficiary, path, fees) for analytics and reconciliation.

### TokenRouter.sol
- Registry of supported tokens, pools, neighbor lists, and per-hop rate constraints.
- Exposes `calculateExpectedOutput` and `validatePath` so the off-chain router can price routes and the payment contract can double-check them.
- Allows governance/owner controls for registering pools, updating pool rates, and managing token metadata used by routing clients.

### MNEESwapHook.sol
- Runs inside Uniswap v4 hook environment to execute swaps safely on permitted pools.
- Maintains allowlists of tokens/pools and enforces per-hop slippage bounds and swap fees before sending proceeds back to `GravityPayment`.
- Emits `TokenSwap` for each hop so auditors can trace multi-hop executions.

### Support Contracts
- **MockERC20.sol** and **MockPoolManager.sol** back testing; they mimic ERC20 behavior and Uniswap pool interactions with extra guards that surface integration errors early.

## Swap Route Lifecycle
1. **Discovery (Off-chain)**: `GravitySWAP.ts` queries `TokenRouter` neighbor APIs, performs BFS/DFS to build candidate paths, and simulates `calculateExpectedOutput` to ensure the route satisfies the payer's constraints.
2. **Quote Lock-in**: The client packages the chosen path, per-hop limits, and desired beneficiary into a `GravityPayment.pay` transaction payload.
3. **On-chain Validation**: `GravityPayment` replays `TokenRouter.validatePath`, verifies allowances/balances, and computes protocol + liquidity provider fees.
4. **Execution via Hook**: Funds flow through `MNEESwapHook`; each hop checks allowlists and slippage before calling the Uniswap v4 pool. Proceeds are routed back and the beneficiary receives MNEE.
5. **Accounting & Events**: `GravityPayment` finalizes balances, emits payment + swap events, and updates any internal accounting structures consumed by off-chain services.

## Payer-to-Recipient Settlement Flow
1. **Route Search**: The payer’s client runs BFS over `TokenRouter.getNeighbors`, validates candidates with `TokenRouter.validatePath`, and scores them for hop count/liquidity.
2. **Pool Data Fetch**: For the winning path, the client queries `TokenRouter.calculateExpectedOutput` (which calls `_getPoolData`) to pull rate/fee info and locks in the quote with a slippage cushion.
3. **Payment Submission**: The payer signs `GravityPayment.pay(eventId, tokenIn, amountIn, recipient, minMNEEOut, swapPath)` and pushes it on-chain.
4. **Swap Execution**: `GravityPayment` hands the funds plus path to `MNEESwapHook`. The hook iterates each hop, checking allowlists and slippage, and calls the v4 pool (`PoolSwapTest`) to execute.
5. **Settlement & Receipt**: Once the final hop returns MNEE, `GravityPayment` credits the recipient, records the payment struct, and emits `PaymentMade` so off-chain services can reconcile.

## Script Inventory (Gravity/scripts)
- **GravitySWAP.ts**: Primary client used by demos/tests; performs the off-chain graph search and calls `GravityPayment.pay`.
- **example-payment.ts**: Minimal showcase that wraps `GravitySWAP`; contains unused `tokenDiscovery` import that can be culled when convenient.
- **token-discovery.ts**: Utility for querying router metadata; currently unused but can power future UX, so either wire it into tooling or mark it experimental.
- **swap-to-mnee.ts**: Legacy Uniswap SDK helper predating the off-chain router. Safe to delete or archive to prevent conflicting approaches.
- **send-op-tx.ts**: Standalone Optimism transaction example unrelated to current flow; remove or move to docs/examples if still needed.

> Recommendation: Keep only `GravitySWAP.ts` (and any scripts that actively use it) alongside documented utilities. Relocate or delete legacy helpers to reduce cognitive load for contributors.
