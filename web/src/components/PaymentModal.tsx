'use client';

import * as React from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TokenSelector, Token } from './TokenSelector';
import { useGravityPayment } from '@/hooks/useGravityPayment';
import { formatUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export interface PaymentModalConfig {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  buttonStyle?: 'solid' | 'gradient' | 'outline' | 'glow';
  tokenSymbol?: string;
  tokenAmount?: string;
  merchantName?: string;
  transactionId?: string;
  customTitle?: string;
  recipientAddress?: string;
  showTransactionId?: boolean;
  animation?: 'none' | 'pulse' | 'bounce' | 'glow';
  customThumbnail?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountUSD: string;
  eventId?: string;
  config?: PaymentModalConfig;
}

export function PaymentModal({ isOpen, onClose, amountUSD, eventId = "1", config }: PaymentModalProps) {
  const { isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = React.useState<Token | undefined>();
  
  const { pay, state, path, isPathLoading, canPay } = useGravityPayment(
    selectedToken?.address,
    amountUSD,
    eventId
  );

  // Default styles if config is missing
  const styles = {
    backgroundColor: config?.backgroundColor || '#09090b',
    primaryColor: config?.primaryColor || '#6366f1',
    textColor: config?.textColor || '#ffffff',
    borderColor: config?.borderColor || '#e5e7eb',
    borderRadius: config?.borderRadius !== undefined ? `${config.borderRadius}px` : '0.75rem',
    buttonStyle: config?.buttonStyle || 'solid',
    animation: config?.animation || 'pulse',
    customTitle: config?.customTitle || 'Pay with Crypto',
    merchantName: config?.merchantName || '',
    transactionId: config?.transactionId || '',
    showTransactionId: config?.showTransactionId !== undefined ? config.showTransactionId : true,
    tokenSymbol: config?.tokenSymbol || 'USDC',
    tokenAmount: config?.tokenAmount || '0.00',
    recipientAddress: config?.recipientAddress || '',
    customThumbnail: config?.customThumbnail,
  };

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedToken(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getButtonStyle = () => {
    const baseClasses = "w-full h-12 text-lg font-medium border-0 transition-all flex items-center justify-center gap-2 relative overflow-hidden";
    const animationClasses = {
      none: '',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      glow: 'shadow-lg'
    };

    const animClass = animationClasses[styles.animation as keyof typeof animationClasses] || '';

    switch (styles.buttonStyle) {
      case 'solid':
        return `${baseClasses} ${animClass} hover:opacity-90`;
      case 'gradient':
        return `${baseClasses} ${animClass} hover:opacity-90`;
      case 'outline':
        return `${baseClasses} ${animClass} border-2 hover:opacity-90`;
      case 'glow':
        return `${baseClasses} ${animClass} shadow-lg hover:shadow-xl`;
      default:
        return baseClasses;
    }
  };

  const getButtonBackground = () => {
    switch (styles.buttonStyle) {
      case 'gradient':
        return `linear-gradient(135deg, ${styles.primaryColor}, ${styles.primaryColor}dd)`;
      case 'outline':
        return 'transparent';
      case 'glow':
        return styles.primaryColor;
      default:
        return styles.primaryColor;
    }
  };

  const getButtonTextColor = () => {
    if (styles.buttonStyle === 'outline') {
      return styles.primaryColor;
    }
    // Simple luminance check
    const color = styles.primaryColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card 
          className="relative overflow-hidden shadow-2xl"
          style={{ 
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            color: styles.textColor,
            borderColor: styles.borderColor,
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          {(styles.buttonStyle === 'glow' || styles.animation === 'glow') && (
            <div
              className="absolute inset-0 pointer-events-none rounded-xl opacity-20 blur-xl"
              style={{ backgroundColor: styles.primaryColor }}
            />
          )}

          <div className="relative p-6">
            {/* Custom Thumbnail */}
            {styles.customThumbnail && (
              <div className="flex justify-center mb-6">
                 <div className="w-full rounded-lg overflow-hidden relative" style={{ borderRadius: `${Math.min(parseInt(styles.borderRadius) / 2, 8)}px` }}>
                    <div className="aspect-video w-full">
                      <img
                        src={styles.customThumbnail}
                        alt="Merchant logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                 </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold" style={{ color: styles.primaryColor }}>{styles.customTitle}</h2>
                {styles.merchantName && (
                  <p className="text-xs" style={{ color: styles.primaryColor, opacity: 0.8 }}>{styles.merchantName}</p>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button onClick={onClose} style={{ color: styles.textColor, opacity: 0.7 }} className="hover:opacity-100 transition-opacity">
                  <X className="w-5 h-5" />
                </button>
                {styles.showTransactionId && styles.transactionId && (
                  <span className="text-xs font-mono" style={{ color: styles.primaryColor, opacity: 0.6 }}>{styles.transactionId}</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="text-center py-4 space-y-1">
                 <div className="text-sm mb-1" style={{ color: styles.primaryColor, opacity: 0.7 }}>
                    ≈ {styles.tokenAmount} <span className="font-bold" style={{ color: styles.primaryColor, opacity: 0.9 }}>{styles.tokenSymbol}</span>
                 </div>
                 <div className="relative inline-block">
                    <span className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 text-4xl font-bold tracking-tighter pr-1" style={{ color: styles.primaryColor, opacity: 0.5 }}>$</span>
                    <div className="text-4xl font-bold tracking-tighter" style={{ color: styles.primaryColor }}>
                      {amountUSD}
                    </div>
                 </div>
              </div>

              {/* Recipient Address */}
              {styles.recipientAddress && (
                <div className="mb-4">
                  <div className="text-xs mb-2 font-bold" style={{ color: styles.primaryColor, opacity: 0.7 }}>RECIPIENT_ADDRESS</div>
                  <div className="w-full text-xs font-mono border-2 rounded px-3 py-2 truncate" style={{
                    color: styles.primaryColor,
                    borderColor: `${styles.primaryColor}30`,
                    backgroundColor: `${styles.primaryColor}05`
                  }}>
                    {styles.recipientAddress}
                  </div>
                </div>
              )}

              {!isConnected ? (
                 <div className="flex justify-center">
                   <ConnectButton />
                 </div>
              ) : (
                <>
                  {/* Token Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: styles.textColor, opacity: 0.8 }}>Select Payment Token</label>
                    <TokenSelector
                      selectedToken={selectedToken}
                      onSelect={setSelectedToken}
                      className="w-full"
                    />
                  </div>

                  {/* Route Info */}
                  {selectedToken && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${styles.primaryColor}15`, borderColor: `${styles.primaryColor}30`, borderWidth: 1 }}>
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: styles.primaryColor }}>Best Route Found</span>
                        {isPathLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" style={{ color: styles.primaryColor }} />
                        ) : path ? (
                          <span className="font-mono text-xs" style={{ color: styles.primaryColor }}>
                            {selectedToken.symbol} → ... → MNEE
                          </span>
                        ) : (
                          <span className="text-red-400">No route found</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className={getButtonStyle()}
                    style={{ 
                      backgroundColor: getButtonBackground(),
                      color: getButtonTextColor(),
                      borderRadius: styles.borderRadius,
                      borderColor: styles.buttonStyle === 'outline' ? styles.primaryColor : 'transparent'
                    }}
                    disabled={!canPay}
                    onClick={pay}
                  >
                    {state.isApproving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Approving {selectedToken?.symbol}...
                      </>
                    ) : state.isPaying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Confirming Payment...
                      </>
                    ) : (
                      <>
                        Pay Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {state.error && (
                    <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded">
                      {state.error}
                    </p>
                  )}
                  {state.txHash && (
                    <div className="text-sm text-green-400 text-center bg-green-500/10 p-2 rounded">
                      <p>Payment Successful!</p>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${state.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-300"
                      >
                        View on Etherscan
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
