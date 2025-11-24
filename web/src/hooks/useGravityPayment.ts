import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits, erc20Abi, Address } from 'viem';
import { GRAVITY_PAYMENT_ADDRESS, TOKEN_ROUTER_ADDRESS, MNEE_TOKEN_ADDRESS } from '@/contracts/addresses';
import GravityPaymentABI from '@/contracts/abis/GravityPayment.json';
import TokenRouterABI from '@/contracts/abis/TokenRouter.json';
import { findOptimalPath } from '@/lib/routeFinder';

export interface PaymentState {
  isApproving: boolean;
  isPaying: boolean;
  error: string | null;
  txHash: string | null;
}

export function useGravityPayment(
  tokenIn: Address | undefined,
  amountInRaw: string, // User input amount (e.g. "10.5")
  eventId: string = "1" // Default event ID for now
) {
  const { address } = useAccount();
  const [state, setState] = useState<PaymentState>({
    isApproving: false,
    isPaying: false,
    error: null,
    txHash: null,
  });
  const [path, setPath] = useState<Address[] | undefined>();
  const [isPathLoading, setIsPathLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // 1. Get Decimals
  const { data: decimals } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!tokenIn },
  });

  const amountIn = decimals && amountInRaw ? parseUnits(amountInRaw, decimals) : 0n;

  // 2. Find optimal path using offchain BFS algorithm
  useEffect(() => {
    if (!tokenIn || amountIn <= 0n) {
      setPath(undefined);
      return;
    }


    let cancelled = false;
    setIsPathLoading(true);

    findOptimalPath(tokenIn, MNEE_TOKEN_ADDRESS, 3)
      .then((discoveredPath) => {
        if (!cancelled) {
          setPath(discoveredPath || undefined);
          setIsPathLoading(false);
        }
      })
      .catch((error) => {
        console.error('Route discovery failed:', error);
        if (!cancelled) {
          setPath(undefined);
          setIsPathLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tokenIn, amountIn]);

  // 3. Check Allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, GRAVITY_PAYMENT_ADDRESS],
    query: { enabled: !!address && !!tokenIn },
  });

  const handlePay = async () => {
    if (!tokenIn || !amountIn || !address) return;

    setState(prev => ({ ...prev, error: null }));

    try {
      // Convert eventId string to a numeric BigInt
      // Use a simple hash function to convert any string to a number
      const eventIdBigInt = (() => {
        // If eventId is already numeric, use it directly
        if (/^\d+$/.test(eventId)) {
          return BigInt(eventId);
        }
        // Otherwise, create a hash from the string
        let hash = 0;
        for (let i = 0; i < eventId.length; i++) {
          const char = eventId.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        // Ensure positive number
        return BigInt(Math.abs(hash));
      })();

      // MOCK: Simulate approval process
      if (allowance !== undefined && allowance < amountIn) {
        setState(prev => ({ ...prev, isApproving: true }));
        // Mock approval delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('MOCK: Token approval simulated');
        setState(prev => ({ ...prev, isApproving: false }));
      }

      // MOCK: Simulate payment process
      setState(prev => ({ ...prev, isPaying: true }));

      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // MOCK: Use fixed transaction hash
      const mockTxHash = "0xaaccad9bd0f67ead92aa3e50b00eefd743feecabc7df5927c9d5db47d28ca86d";

      console.log('MOCK: Payment transaction simulated');
      console.log('MOCK: Transaction hash:', mockTxHash);
      console.log('MOCK: Event ID:', eventIdBigInt);
      console.log('MOCK: Token in:', tokenIn);
      console.log('MOCK: Amount in:', amountIn.toString());
      console.log('MOCK: Path:', path);

      /*
      // ORIGINAL BLOCKCHAIN INTERACTIONS (COMMENTED OUT):

      // Calculate minimum MNEE output with 5% slippage tolerance
      let minMNEEOut = 0n;
      try {
        if (publicClient) {
          const quote = await publicClient.readContract({
            address: GRAVITY_PAYMENT_ADDRESS,
            abi: GravityPaymentABI.abi,
            functionName: 'getQuote',
            args: [tokenIn, amountIn, path || []]
          }) as bigint;

          if (quote === 0n) {
            throw new Error('Quote is 0. Insufficient liquidity or invalid path.');
          }

          // 5% slippage = 95% of quote
          minMNEEOut = (quote * 95n) / 100n;
          console.log('Quote:', formatUnits(quote, 18), 'MinOut:', formatUnits(minMNEEOut, 18));
        }
      } catch (e) {
        console.error('Failed to get quote:', e);
        throw new Error('Failed to calculate exchange rate. The path may be invalid or liquidity is insufficient.');
      }

      // 4. Final Safety Checks
      const balance = await publicClient?.readContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      });

      if (balance !== undefined && balance < amountIn) {
        throw new Error(`Insufficient balance. You have ${formatUnits(balance, decimals || 18)} but need ${formatUnits(amountIn, decimals || 18)}`);
      }

      const currentAllowance = await publicClient?.readContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, GRAVITY_PAYMENT_ADDRESS],
      });

      if (currentAllowance !== undefined && currentAllowance < amountIn) {
        throw new Error(`Insufficient allowance. Please approve the contract to spend your tokens.`);
      }

      // Check if token is allowed in SwapHook
      try {
        const swapHookAddress = await publicClient?.readContract({
          address: GRAVITY_PAYMENT_ADDRESS,
          abi: GravityPaymentABI.abi,
          functionName: 'swapHook',
        }) as Address;

        if (swapHookAddress) {
           // We need a minimal ABI for allowedTokens
           const hookAbi = [{
             type: 'function',
             name: 'allowedTokens',
             inputs: [{ name: '', type: 'address' }],
             outputs: [{ name: '', type: 'bool' }],
             stateMutability: 'view'
           }] as const;

           const isAllowed = await publicClient?.readContract({
             address: swapHookAddress,
             abi: hookAbi,
             functionName: 'allowedTokens',
             args: [tokenIn]
           });

           if (isAllowed === false) {
             throw new Error(`Token ${tokenIn} is not whitelisted in the payment contract.`);
           }
        }
      } catch (e) {
        console.warn('Failed to check token allowlist:', e);
        // Don't block payment on this check failing, but log it
      }

      try {
        const payTx = await writeContractAsync({
          address: GRAVITY_PAYMENT_ADDRESS,
          abi: GravityPaymentABI.abi,
          functionName: 'pay',
          args: [
              eventIdBigInt,
              tokenIn,
              amountIn,
              address, // Recipient
              minMNEEOut, // Minimum MNEE output (slippage protection)
              path || [] // Swap path discovered by route finder
          ],
        });
        setState(prev => ({ ...prev, txHash: payTx }));
        await publicClient?.waitForTransactionReceipt({ hash: payTx });
        setState(prev => ({ ...prev, isPaying: false }));
      } catch (txErr: any) {
        console.error('Transaction failed:', txErr);
        if (txErr.message?.includes('gas') || txErr.message?.includes('revert')) {
           throw new Error('Transaction simulation failed. The liquidity pool might be empty or the path is invalid.');
        }
        throw txErr;
      }
      */

      // Set mock transaction hash and complete payment
      setState(prev => ({ ...prev, txHash: mockTxHash, isPaying: false }));

    } catch (err: any) {
      console.error('❌ Payment failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        data: err.data,
        tokenIn,
        amountIn: amountIn.toString(),
        path,
      });
      setState(prev => ({
        ...prev,
        isApproving: false,
        isPaying: false,
        error: err.message || 'Payment failed'
      }));
    }
  };

  return {
    pay: handlePay,
    state,
    path,
    isPathLoading,
    canPay: !!tokenIn && amountIn > 0n && !state.isPaying && !state.isApproving && !!path
  };
}
