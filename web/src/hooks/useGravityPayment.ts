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

      // Approve if needed
      if (allowance !== undefined && allowance < amountIn) {
        setState(prev => ({ ...prev, isApproving: true }));
        const approveTx = await writeContractAsync({
          address: tokenIn,
          abi: erc20Abi,
          functionName: 'approve',
          args: [GRAVITY_PAYMENT_ADDRESS, amountIn],
        });
        
        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        await refetchAllowance();
        setState(prev => ({ ...prev, isApproving: false }));
      }

      // Pay
      setState(prev => ({ ...prev, isPaying: true }));
      
      // Calculate minimum MNEE output with 5% slippage tolerance
      // For now, we'll use a simple calculation - in production this should use actual price data
      const minMNEEOut = 0n; // TODO: Calculate based on expected output with slippage
      
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
        gas: 5000000n, // Set reasonable gas limit (5M) to stay within block limit
      });

      setState(prev => ({ ...prev, txHash: payTx }));
      
      await publicClient?.waitForTransactionReceipt({ hash: payTx });
      setState(prev => ({ ...prev, isPaying: false }));

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
