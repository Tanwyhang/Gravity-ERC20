"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PaymentModal } from "@/components/PaymentModal";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const config = {
    primaryColor: searchParams.get('primaryColor') || undefined,
    backgroundColor: searchParams.get('backgroundColor') || undefined,
    textColor: searchParams.get('textColor') || undefined,
    borderColor: searchParams.get('borderColor') || undefined,
    borderRadius: searchParams.get('borderRadius') ? parseInt(searchParams.get('borderRadius')!) : undefined,
    buttonStyle: (searchParams.get('buttonStyle') as any) || undefined,
    tokenSymbol: searchParams.get('tokenSymbol') || undefined,
    tokenAmount: searchParams.get('tokenAmount') || undefined,
    merchantName: searchParams.get('merchantName') || undefined,
    transactionId: searchParams.get('transactionId') || undefined,
    customTitle: searchParams.get('customTitle') || undefined,
    recipientAddress: searchParams.get('recipientAddress') || undefined,
    showTransactionId: searchParams.get('showTransactionId') === 'true',
    animation: (searchParams.get('animation') as any) || undefined,
    customThumbnail: searchParams.get('customThumbnail') || undefined,
  };

  return (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
        <PaymentModal 
            isOpen={isOpen} 
            onClose={() => {}} 
            amountUSD="124.50" 
            eventId={params.id as string}
            config={config}
        />
    </div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-foreground selection:text-background relative overflow-hidden">
      <AuroraBackground className="min-h-screen h-auto bg-background dark:bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentContent />
        </Suspense>
      </AuroraBackground>
    </div>
  );
}
