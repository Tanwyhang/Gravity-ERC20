'use client';

import * as React from 'react';
import { X, Download, Share2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QRCode } from '@/components/ui/shadcn-io/qr-code';
import { QRDownload } from '@/components/ui/qr-download';

export interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  amountUSD: string;
  amountToken?: string;
  tokenSymbol?: string;
  recipientAddress?: string;
  eventId?: string;
  config?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
  };
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  txHash,
  amountUSD,
  amountToken,
  tokenSymbol,
  recipientAddress,
  eventId,
  config
}: PaymentSuccessModalProps) {
  const qrCodeRef = React.useRef<HTMLDivElement>(null);

  // Default styles if config is missing
  const styles = {
    backgroundColor: config?.backgroundColor || '#09090b',
    primaryColor: config?.primaryColor || '#6366f1',
    textColor: config?.textColor || '#ffffff',
    borderColor: config?.borderColor || '#e5e7eb',
    borderRadius: config?.borderRadius !== undefined ? `${config.borderRadius}px` : '0.75rem',
  };

  // QR Code data with Etherscan link
  const qrData = `https://etherscan.io/tx/${txHash}`;
  const paymentInfo = {
    type: 'gravity_payment',
    txHash,
    amountUSD,
    amountToken,
    tokenSymbol,
    recipientAddress,
    eventId,
    timestamp: new Date().toISOString(),
    contractAddress: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
    etherscanUrl: qrData
  };

  if (!isOpen) return null;

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'Gravity Payment Successful',
        text: `Paid ${amountUSD} USD using Gravity Payment System`,
        url: `https://etherscan.io/tx/${txHash}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        // Toast notification would be shown here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${styles.primaryColor}20` }}>
                  <CheckCircle className="w-6 h-6" style={{ color: styles.primaryColor }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Payment Successful!</h2>
                  <p className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Transaction confirmed
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{ color: styles.textColor, opacity: 0.7 }}
                className="hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="text-center py-4">
                <div className="text-sm mb-2" style={{ color: styles.primaryColor, opacity: 0.7 }}>
                  Amount Paid
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: styles.primaryColor }}>
                  ${amountUSD}
                </div>
                {amountToken && tokenSymbol && (
                  <div className="text-sm" style={{ color: styles.textColor, opacity: 0.8 }}>
                    ≈ {amountToken} {tokenSymbol}
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full text-center">
                  <div className="text-sm font-medium mb-3" style={{ color: styles.primaryColor, opacity: 0.8 }}>
                    Etherscan Transaction QR Code
                  </div>
                  <div className="flex justify-center mb-3">
                    <div
                      ref={qrCodeRef}
                      className="w-48 h-48 rounded-lg overflow-hidden border-2"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: styles.primaryColor
                      }}
                    >
                      <QRCode
                        data={qrData}
                        foreground="#000000"
                        background="#ffffff"
                        robustness="H"
                      />
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: styles.textColor, opacity: 0.6 }}>
                    Scan to view transaction on Etherscan
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full">
                  <QRDownload
                    qrCodeRef={qrCodeRef}
                    transactionHash={txHash}
                    amount={amountUSD}
                    tokenSymbol={tokenSymbol}
                    className="flex-1"
                    style={{
                      backgroundColor: `${styles.primaryColor}15`,
                      color: styles.primaryColor,
                      border: `1px solid ${styles.primaryColor}30`
                    }}
                    qrData={qrData}
                  />

                  <Button
                    onClick={handleShare}
                    className="flex-1 h-10"
                    style={{
                      backgroundColor: `${styles.primaryColor}15`,
                      color: styles.primaryColor,
                      border: `1px solid ${styles.primaryColor}30`
                    }}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    SHARE
                  </Button>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 border-t pt-4" style={{ borderColor: `${styles.primaryColor}20` }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Transaction
                  </span>
                  <div className="text-right">
                    <div className="text-xs font-mono" style={{ color: styles.primaryColor }}>
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline"
                      style={{ color: styles.primaryColor, opacity: 0.8 }}
                    >
                      View on Etherscan
                    </a>
                  </div>
                </div>

                {recipientAddress && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                      Recipient
                    </span>
                    <div className="text-xs font-mono text-right" style={{ color: styles.primaryColor }}>
                      {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}
                    </div>
                  </div>
                )}

                {eventId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                      Event ID
                    </span>
                    <span className="text-sm font-mono" style={{ color: styles.primaryColor }}>
                      {eventId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: styles.textColor, opacity: 0.7 }}>
                    Time
                  </span>
                  <span className="text-sm" style={{ color: styles.primaryColor }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full h-12"
                style={{
                  backgroundColor: styles.primaryColor,
                  color: '#ffffff',
                  borderRadius: styles.borderRadius
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}