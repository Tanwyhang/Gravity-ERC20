"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import PixelBlast from "@/components/PixelBlast";
import { parseUrlThemeParams } from "@/lib/themes";

const PaymentModal = dynamic(
  () => import("@/components/PaymentModal").then((mod) => mod.PaymentModal),
  { ssr: false }
);

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOpen] = useState(true);

  // Parse theme parameters from URL using the theme system
  const urlConfig = parseUrlThemeParams(searchParams);
  
  const styles = {
    backgroundColor: urlConfig.backgroundColor || '#09090b',
    primaryColor: urlConfig.primaryColor || '#6366f1',
  };

  // Helper function to calculate luminance
  const getLuminance = (hexColor: string): number => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Apply gamma correction
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const BEIGE_COLOR = '#FDFBF7';
  
  // Calculate luminance for both modal colors
  const bgLuminance = getLuminance(styles.backgroundColor);
  const primaryLuminance = getLuminance(styles.primaryColor);
  
  // Always use beige for page background
  // Use whichever modal color is darker for pixels
  const pageBackgroundColor = BEIGE_COLOR;
  const pixelColor = bgLuminance < primaryLuminance ? styles.backgroundColor : styles.primaryColor;

  console.log('Demo URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/dvhtzhe?primaryColor=%23243370&backgroundColor=%23d6fffa&textColor=%23000000&borderColor=%23030303&borderRadius=17&buttonStyle=solid&tokenSymbol=ETH&tokenAmount=0.05&merchantName=GRAVITY_PAY&transactionId=%23DEMO123&customTitle=PAY_WITH_CRYPTO&recipientAddress=0x0ce3580766DcdDAf281DcCE968885A989E9B0e99&showTransactionId=true&animation=pulse&usdAmount=124.50&customThumbnail=`);

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: pageBackgroundColor }}
    >
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color={pixelColor}
          patternScale={3}
          patternDensity={0.7}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={4}
          edgeFade={0.25}
          transparent
        />
      </div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-12">
        <PaymentModal
            isOpen={isOpen}
            onClose={() => {}}
            amountUSD={searchParams.get('usdAmount') || searchParams.get('ua') || urlConfig.usdAmount || "124.50"}
            eventId={params.id as string}
            config={urlConfig}
            inline={true}
        />
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
