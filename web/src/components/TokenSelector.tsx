import { useState, useMemo } from 'react';
import { Address } from 'viem';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  logoUrl?: string;
  category?: string;
}

// Mock ERC20 tokens (addresses are placeholders for demonstration)
const ALL_TOKENS: Token[] = [
  // Stablecoins
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', category: 'stablecoins' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD', category: 'stablecoins' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai Stablecoin', category: 'stablecoins' },
  { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', symbol: 'FRAX', name: 'Frax', category: 'stablecoins' },
  { address: '0x7381aD6d21b9025903936C7E6541c8e6054F3d9e', symbol: 'LUSD', name: 'Liquity USD', category: 'stablecoins' },

  // Major cryptocurrencies
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin', category: 'major' },
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ethereum', category: 'major' },
  { address: '0x5118b3b4D5F4e3dA5e2e5d5e4d4e5d5e5d5e5d5e', symbol: 'WBNB', name: 'Wrapped BNB', category: 'major' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'ARB', name: 'Arbitrum', category: 'major' },

  // DeFi tokens
  { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', category: 'defi' },
  { address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', symbol: 'MATIC', name: 'Polygon', category: 'defi' },
  { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'Chainlink', category: 'defi' },
  { address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', symbol: 'AAVE', name: 'Aave', category: 'defi' },
  { address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', symbol: 'BAT', name: 'Basic Attention Token', category: 'defi' },
  { address: '0x1985365e9f78359a9B6AD760e32412f4a445E862', symbol: 'REP', name: 'Augur', category: 'defi' },
  { address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', symbol: 'MKR', name: 'Maker', category: 'defi' },
  { address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', symbol: 'YFI', name: 'yearn.finance', category: 'defi' },
  { address: '0x111111111117dC0aa78b770fA6A738034120C302', symbol: '1INCH', name: '1inch', category: 'defi' },
  { address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55', symbol: 'SUSHI', name: 'SushiSwap', category: 'defi' },
  { address: '0x4Dbd4fc535Ac27206064B98Ff41852b562c3E987', symbol: 'CRV', name: 'Curve DAO Token', category: 'defi' },
  { address: '0x0CE6a5Ff6A0A0e61C0bA2F0bA45b56b32e3b9F9d', symbol: 'COMP', name: 'Compound', category: 'defi' },
  { address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', symbol: 'SNX', name: 'Synthetix', category: 'defi' },
  { address: '0x5c9B4a1e4C95d814F16c3c9D48a6bB8D3B4F5E6', symbol: 'BAL', name: 'Balancer', category: 'defi' },
  { address: '0x7FC66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', name: 'Aave', category: 'defi' },

  // Gaming & NFT tokens
  { address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', symbol: 'APE', name: 'ApeCoin', category: 'gaming' },
  { address: '0xbc396689893D065F41bc2C6EcbeE5e0085233447', symbol: 'FLOKI', name: 'FLOKI', category: 'gaming' },
  { address: '0x2aE024F53E34B5ad51b4E4A0737e8De5D68D6863', symbol: 'GALA', name: 'Gala Games', category: 'gaming' },
  { address: '0x491604c0FDF08327D2F3B023588d29E90A6C1D1d', symbol: 'SAND', name: 'The Sandbox', category: 'gaming' },
  { address: '0x23581767a106ae21c074b2276D25e5C3e136a68b', symbol: 'MANA', name: 'Decentraland', category: 'gaming' },
  { address: '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d', symbol: 'AXS', name: 'Axie Infinity', category: 'gaming' },
  { address: '0x4645e4f2940c47A1a6d956EE852D4c49FC0cE61e', symbol: 'GTC', name: 'Gitcoin', category: 'gaming' },
  { address: '0x9A8f92a830A5cB89c3853b5c3d1D5A4D1d5D5d5d', symbol: 'IMX', name: 'Immutable X', category: 'gaming' },
  { address: '0x4d224452801ACe8b499A9A5E29F94A957fCe5d7A', symbol: 'MAGIC', name: 'MAGIC', category: 'gaming' },
  { address: '0xB89e3c0d6B8A7B7f4A5e5f6e5f6e5f6e5f6e5f6', symbol: 'PIXEL', name: 'Pixel', category: 'gaming' },

  // Utility tokens
  { address: '0x0821F9A0F0D7842c5786169628833F68e49221B8', symbol: 'GRT', name: 'The Graph', category: 'utility' },
  { address: '0xA9b1Eb5908CfC3cdf91F9B8B3a74108598008095', symbol: 'ENJ', name: 'Enjin Coin', category: 'utility' },
  { address: '0x4F57FeA7EA8b7b1F16c9b4a5e8F8dC3A8b3A7d8A', symbol: 'CHZ', name: 'Chiliz', category: 'utility' },
  { address: '0x3D6583213862B24C19945E340519B092785568C8', symbol: 'HOT', name: 'Holo', category: 'utility' },
  { address: '0xE5a7251299f69430108C79CB21610e6b4c61cEd4', symbol: 'C98', name: 'Coin98', category: 'utility' },
  { address: '0x6f259637dCd74C767781A379bb1548a982c7CFdB', symbol: 'ARPA', name: 'ARPA Network', category: 'utility' },
  { address: '0x1234567890123456789012345678901234567890', symbol: 'MNEE', name: 'Gravity Token', category: 'utility' },
  { address: '0x111111111117dC0aa78b770fA6A738034120C302', symbol: 'BAT', name: 'Basic Attention Token', category: 'utility' },
  { address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', symbol: 'RLC', name: 'iExec RLC', category: 'utility' },
  { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'BAND', name: 'Band Protocol', category: 'utility' },

  // Meme coins
  { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', symbol: 'SHIB', name: 'Shiba Inu', category: 'meme' },
  { address: '0x96eC7d1b2ebDA2a1D1c0D4E8241936d3212d9d41', symbol: 'DOGE', name: 'Dogecoin (WDOGE)', category: 'meme' },
  { address: '0x8Af0843997834982572c2DacFA7c3bC9eAfD40b5', symbol: 'PEPE', name: 'Pepe', category: 'meme' },
  { address: '0x2Ef3D8A5b069332464C094F9339C45aAAc19b0bB', symbol: 'MEME', name: 'Memecoin', category: 'meme' },
  { address: '0x3EE7B75d0A07B5f5E5C5C5c5c5c5c5c5c5c5c5c', symbol: 'WIF', name: 'Dogwifhat', category: 'meme' },
  { address: '0x1a2a3a4a5a6a7a8a9a0a1a2a3a4a5a6a7a8a9a0a', symbol: 'BONK', name: 'Bonk', category: 'meme' },
  { address: '0x4e4C6eEe73c2264256662930d5b7D4E5e4D3D3D3', symbol: 'FLOKI', name: 'Floki', category: 'meme' },
  { address: '0x5a5b5c5d5e5f606162636465666768696a6b6c6d', symbol: 'PEPE', name: 'Pepe', category: 'meme' },
];

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  stablecoins: '🪙 Stablecoins',
  major: '💎 Major Cryptocurrencies',
  defi: '🏦 DeFi Tokens',
  gaming: '🎮 Gaming & NFT',
  utility: '⚡ Utility Tokens',
  meme: '🐕 Meme Coins',
};

// Most popular tokens (shown at top)
const POPULAR_TOKENS: Token[] = [
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', category: 'stablecoins' },
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ethereum', category: 'major' },
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin', category: 'major' },
  { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', category: 'defi' },
  { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', symbol: 'SHIB', name: 'Shiba Inu', category: 'meme' },
];

interface TokenSelectorProps {
  selectedToken?: Token;
  onSelect: (token: Token) => void;
  className?: string;
}

export function TokenSelector({ selectedToken, onSelect, className }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tokens based on search
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return ALL_TOKENS;

    const query = searchQuery.toLowerCase();
    return ALL_TOKENS.filter(token =>
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group tokens by category
  const tokensByCategory = useMemo(() => {
    const groups: Record<string, Token[]> = {};
    filteredTokens.forEach(token => {
      const category = token.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(token);
    });
    return groups;
  }, [filteredTokens]);

  const handleValueChange = (value: string) => {
    const token = ALL_TOKENS.find(t => t.address === value);
    if (token) {
      onSelect(token);
      setIsOpen(false);
    }
  };

  return (
    <Select
      value={selectedToken?.address}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select token...">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedToken.symbol}</span>
              <span className="text-xs text-muted-foreground">{selectedToken.name}</span>
            </div>
          ) : (
            "Select token..."
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-96">
        {/* Search Input */}
        <div className="p-3 sticky top-0 bg-background border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Popular Tokens (shown when not searching) */}
        {!searchQuery && (
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">⭐ Popular</div>
            {POPULAR_TOKENS.map((token) => (
              <SelectItem key={token.address} value={token.address} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">{token.name}</span>
                </div>
              </SelectItem>
            ))}
          </div>
        )}

        {/* Categorized Tokens */}
        <div className="max-h-64 overflow-y-auto">
          {Object.entries(tokensByCategory).map(([category, tokens]) => (
            <div key={category} className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                {CATEGORY_LABELS[category] || `📁 ${category.charAt(0).toUpperCase() + category.slice(1)}`}
              </div>
              {tokens.map((token) => (
                <SelectItem
                  key={token.address}
                  value={token.address}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-xs text-muted-foreground">{token.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredTokens.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No tokens found matching "{searchQuery}"
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
