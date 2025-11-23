import { Address, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { TOKEN_ROUTER_ADDRESS } from '@/contracts/addresses';
import TokenRouterABI from '@/contracts/abis/TokenRouter.json';

// Use custom RPC if available, otherwise use public endpoint
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/268702a6f88b4111a031782c39503bc0';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl, {
    batch: false, // Disable batching for immediate results
  }),
});

/**
 * Find optimal route between two tokens using BFS
 * Adapted from Gravity/scripts/GravitySWAP.ts
 */
export async function findOptimalPath(
  tokenIn: Address,
  tokenOut: Address,
  maxHops: number = 3
): Promise<Address[] | null> {
  try {
    console.log('🔍 Finding route from', tokenIn, 'to', tokenOut, 'with max hops:', maxHops);
    
    // If same token, return single-element path
    if (tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
      console.log('✅ Same token, returning direct path');
      return [tokenIn];
    }

    const normalizedOut = tokenOut.toLowerCase();
    const queue: Address[][] = [[tokenIn]];
    const visited = new Set<string>([tokenIn.toLowerCase()]);
    const neighborCache = new Map<string, Address[]>();

    let iterations = 0;
    while (queue.length > 0) {
      iterations++;
      const currentPath = queue.shift()!;
      const last = currentPath[currentPath.length - 1];

      console.log(`  Iteration ${iterations}: Exploring path`, currentPath.map(a => a.slice(0, 6)).join(' → '));

      // Stop if we've exceeded max hops
      if (currentPath.length - 1 >= maxHops) {
        console.log('  ⚠️ Max hops reached, skipping');
        continue;
      }

      // Get neighbors for current token
      const neighborKey = last.toLowerCase();
      let neighbors = neighborCache.get(neighborKey);
      
      if (!neighbors) {
        try {
          console.log('  📡 Fetching neighbors for', last.slice(0, 6));
          const fetchedNeighbors = await publicClient.readContract({
            address: TOKEN_ROUTER_ADDRESS,
            abi: TokenRouterABI.abi,
            functionName: 'getNeighbors',
            args: [last],
          }) as Address[];
          
          console.log('  ✅ Found', fetchedNeighbors.length, 'neighbors:', fetchedNeighbors.map(n => n.slice(0, 6)));
          neighborCache.set(neighborKey, fetchedNeighbors);
          neighbors = fetchedNeighbors;
        } catch (error) {
          console.error(`  ❌ Failed to get neighbors for ${last}:`, error);
          continue;
        }
      }

      if (!neighbors || neighbors.length === 0) {
        console.log('  ⚠️ No neighbors found');
        continue;
      }

      // Explore neighbors
      for (const neighbor of neighbors) {
        const neighborLower = neighbor.toLowerCase();
        
        if (visited.has(neighborLower)) {
          console.log('  ⏭️ Already visited', neighbor.slice(0, 6));
          continue;
        }
        
        visited.add(neighborLower);
        const nextPath = [...currentPath, neighbor];

        // Check if we've reached the destination
        if (neighborLower === normalizedOut) {
          console.log('  🎯 Found destination! Validating path...');
          // Validate the path
          try {
            const isValid = await publicClient.readContract({
              address: TOKEN_ROUTER_ADDRESS,
              abi: TokenRouterABI.abi,
              functionName: 'validatePath',
              args: [nextPath],
            }) as boolean;

            console.log('  Validation result:', isValid);
            if (isValid) {
              console.log('✅ Valid route found:', nextPath.map(a => a.slice(0, 6)).join(' → '));
              return nextPath;
            }
          } catch (error) {
            console.error('  ❌ Path validation failed:', error);
            continue;
          }
        }

        queue.push(nextPath);
      }
    }

    // No path found
    console.log('❌ No route found after', iterations, 'iterations');
    return null;
  } catch (error) {
    console.error('❌ Route discovery failed:', error);
    return null;
  }
}

/**
 * Calculate route confidence score
 */
export function calculateRouteConfidence(path: Address[], hopCount: number): number {
  let confidence = 100;

  // Penalize longer routes
  confidence -= hopCount * 15;

  // Bonus for high-quality intermediate tokens (stablecoins, major tokens)
  const highQualityTokens = [
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC Sepolia
  ].map(addr => addr.toLowerCase());

  for (const token of path.slice(1, -1)) {
    if (highQualityTokens.includes(token.toLowerCase())) {
      confidence += 10;
    }
  }

  return Math.max(Math.min(confidence, 100), 0);
}
