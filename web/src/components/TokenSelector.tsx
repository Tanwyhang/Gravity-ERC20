import * as React from 'react';
import { Address } from 'viem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  logoUrl?: string;
}

// Popular tokens on Sepolia
const POPULAR_TOKENS: Token[] = [
  { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap' },
];

interface TokenSelectorProps {
  selectedToken?: Token;
  onSelect: (token: Token) => void;
  className?: string;
}

export function TokenSelector({ selectedToken, onSelect, className }: TokenSelectorProps) {
  const handleValueChange = (value: string) => {
    const token = POPULAR_TOKENS.find(t => t.address === value);
    if (token) {
      onSelect(token);
    }
  };

  return (
    <Select value={selectedToken?.address} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select token..." />
      </SelectTrigger>
      <SelectContent>
        {POPULAR_TOKENS.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{token.symbol}</span>
              <span className="text-xs text-muted-foreground">{token.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
