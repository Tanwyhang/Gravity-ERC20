# Gravity - Web2-to-Web3 ERC20 Payment Bridge

Web2-friendly payment links / QR that accept any ERC20 token and settle to MNEE through LiFi's multi-chain liquidity aggregation.

## Architecture

### LiFi Integration Layer
![LiFi Architecture](https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=1650&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=6547db988a36715e8378d8f356c63d46)

- **LiFi Diamond Contract** (`0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE`): Multi-facet proxy contract routing to specialized execution facets
- **Facet Contracts**: Modular contracts for bridges, DEXs, and solvers (EIP-2535 standard)
- **Smart Order Routing**: Off-chain API aggregation of 40+ bridges, DEXs, and solvers for optimal pricing
- **Cross-Chain Support**: Seamless transfers across 30+ EVM chains with automatic canonical token mapping

### Frontend Stack
- **Next.js 16.0.3** with React 19.2.0 and TypeScript 5.x
- **Wagmi 3.0.0 + RainbowKit 2.2.9** for wallet connectivity and management
- **Prisma 7.0.0** with SQLite (dev) / PostgreSQL (production)
- **Tailwind CSS 4.x** with shadcn/ui components and custom theming
- **LiFi SDK 3.13.5** for unified cross-chain routing and execution
- **QR Code**: `react-qrcode-logo 4.0.0` for fluid design with logo integration
- **Animations**: `framer-motion 12.23.24` for smooth transitions and effects
- **State Management**: `@tanstack/react-query 5.90.10` for server state and caching

### Key Features
- Universal ERC20 input acceptance via LiFi's liquidity aggregation
- Automatic conversion to MNEE through optimal multi-hop routing
- QR code generation with cryptographic receipts
- Customizable payment modals with live preview
- Event-based validation system
- Cross-chain payment support (same-chain default, cross-chain optional)

## Quick Start

### Prerequisites
```bash
# Install pnpm if not present
npm install -g pnpm
```

### Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd Gravity-ERC20/web
pnpm install

# Environment configuration
cp .env.example .env.local
# Configure required environment variables

# Database setup
pnpm prisma migrate dev
pnpm prisma generate

# Start development
pnpm dev
```

### Environment Variables
```env
# Core app
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# LiFi integration
LIFI_API_KEY=your_lifi_api_key

# Database
DATABASE_URL="file:./dev.db"

# Asset storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## LiFi Integration

### Payment Flow
![LiFi Contract Flow](https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=1650&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=7e15287d2dea819b1077e1b979559428)

1. User selects payment URL/QR code
2. Frontend fetches event metadata from `/api/events/[eventId]`
3. User connects wallet and selects input token
4. LiFi API queries 40+ bridges, DEXs, and solvers for optimal routes
5. Smart order routing determines best execution path and pricing
6. Transaction submitted to LiFi Diamond contract (`0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE`)
7. Diamond routes to appropriate facet contract for execution
8. Assets converted and settled as MNEE to recipient
9. Receipt QR generated with transaction proof

### Route Discovery & Execution
```typescript
import { getRoutes, executeRoute } from '@lifi/sdk';

// Get optimal routes from LiFi's aggregated liquidity
const routesRequest = {
  fromChainId: 11155111, // Sepolia
  toChainId: 11155111,   // Same chain (or cross-chain)
  fromTokenAddress: tokenIn,
  toTokenAddress: MNEE_ADDRESS,
  fromAmount: amount.toString(),
  fromAddress: userAddress,
  integrator: 'Gravity',
  allowDestinationCall: false,
  order: 'CHEAPEST' // Optimize for best rate
};

const routes = await getRoutes(routesRequest);
const bestRoute = routes.routes[0];

// Execute through LiFi Diamond contract
const executedRoute = await executeRoute(bestRoute, {
  updateRouteHook: (route) => console.log('Route updated:', route),
  acceptExchangeRateUpdateHook: (token, oldAmount, newAmount) => {
    // Handle slippage updates
    return newAmount >= oldAmount * 0.95; // 5% slippage tolerance
  }
});
```

## API Endpoints

### Events API
```typescript
// POST /api/events - Create payment event
{
  title: string;
  amount: string;
  recipient: string;
  theme: ThemeConfig;
}

// GET /api/events/[eventId] - Retrieve event metadata
{
  id: string;
  title: string;
  amount: string;
  recipient: string;
  theme: ThemeConfig;
  createdAt: string;
}
```

### Upload API
```typescript
// POST /api/upload - Store custom thumbnails
// Returns Vercel Blob URL for payment modal branding
```

## Payment Modal System

### Theme Configuration
```typescript
interface PaymentModalConfig {
  primaryColor: string;        // Main action button color
  backgroundColor: string;     // Modal background
  textColor: string;          // Text color
  borderColor: string;        // Border and accent color
  borderRadius: number;       // Corner radius in pixels
  buttonStyle: 'solid' | 'glow' | 'outline';
  tokenSymbol: string;        // Display token symbol
  tokenAmount: string;        // Payment amount
  merchantName: string;       // Merchant display name
  transactionId?: string;     // Optional transaction ID
  customTitle?: string;       // Custom modal title
  recipientAddress: string;   // Payment recipient
  showTransactionId?: boolean;
  animation?: 'pulse' | 'bounce';
  customThumbnail?: string;   // URL to custom image
}
```

### Template Types
1. **Custom Thumbnail**: Upload custom branding images
2. **Simple Clean**: Minimal design with color indicators

## QR Code Implementation

### Receipt QR Codes
- **Library**: `react-qrcode-logo 4.0.0` with fluid design styling
- **Logo Integration**: Automatic center logo from `/logo.png` with circular padding
- **Features**:
  - Embedded transaction hash and event ID
  - Remove QR cells behind logo for better scannability
  - Eye radius customization (rounded corners on position markers)
  - CORS support for external logo images
  - Dynamic sizing with ResizeObserver
- **Cryptographic**: Post-quantum attestation support for payment verification
- **Download**: PNG export functionality for both Canvas and SVG elements

### Verification System
```typescript
// QR verification flow
import { verifyPayment } from '@/lib/paymentVerification';

const scanResult = await qrScanner.scan();
const isValid = await verifyPayment(
  scanResult.eventId,
  scanResult.transactionHash,
  scanResult.recipient
);
```

## LiFi Integration Benefits

### Why LiFi?
- **Unified API**: Single integration replaces 40+ bridge/DEX integrations
- **Best Execution**: Aggregated liquidity ensures optimal pricing and slippage
- **Reliability**: Built-in fallback mechanisms prevent failed transactions
- **Cross-Chain**: Native support for 30+ EVM chains with canonical mapping
- **Security**: Audited smart contracts with $1M bug bounty program

### Multi-Hop Routing
- **Smart Order Routing**: Automatic discovery of optimal intermediate tokens
- **Canonical Mapping**: Handles token inconsistencies (USDC vs USDC.e, etc.)
- **Gas Optimization**: Routes optimized for lowest total cost including fees
- **Slippage Protection**: Per-hop and total slippage validation
- **MEV Protection**: Private mempool routing when available

### Supported Networks
LiFi Diamond contract (`0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE`) supports:
- Ethereum Mainnet
- Polygon, Arbitrum, Optimism
- Base, Avalanche, BSC
- And 25+ additional EVM chains

*Full list: [https://li.quest/v1/chains](https://li.quest/v1/chains)*

## Development Workflow

### Frontend Development (Primary Focus)
```bash
cd web
pnpm dev          # Development server with LiFi integration
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm type-check   # TypeScript validation
```

### LiFi SDK Testing
```bash
# Test LiFi integration in development
pnpm add @lifi/sdk
# Use LiFi's testnet environments for development
# Sepolia testnet supported with full liquidity routing
```

### Database Operations
```bash
pnpm prisma studio          # Visual database browser
pnpm prisma migrate dev     # Apply new migrations
pnpm prisma generate        # Generate Prisma client
```

## Security Considerations

### LiFi Smart Contract Security
- **Audited Contracts**: All LiFi Diamond and facet contracts undergo independent audits
- **$1M Bug Bounty**: Active program with Cantina for vulnerability discovery
- **Multi-Sig Protection**: Governance requires multiple signers for contract upgrades
- **Real-Time Monitoring**: Hexagate integration for anomaly detection and automated response
- **Transparent**: All audit reports publicly available at [LiFi GitHub](https://github.com/lifinance/contracts/tree/main/audit/reports)

### Frontend Security
- Input validation on all user inputs
- Rate limiting on API endpoints
- CORS configuration for asset loading
- Secure environment variable handling

### Wallet Security
- Hardware wallet support via WalletConnect
- Signature verification for all transactions
- Approval checks before token transfers
- Network validation (Sepolia-only for testing)

## Deployment

### Frontend Deployment
```bash
cd web
pnpm build
vercel --prod  # Deploy to Vercel
```

### Environment Configuration
- Production RPC URLs with fallback endpoints
- Database connection pooling for PostgreSQL
- CDN configuration for static assets
- SSL and security headers configuration

## Monitoring & Analytics

### Payment Tracking
- Real-time transaction status updates
- Conversion rate monitoring by token type
- Geographic distribution of payments
- Revenue analytics and reporting

### System Health
- API response time monitoring
- Database query performance
- RPC endpoint health checks
- Error rate tracking and alerting

## Contributing

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier configuration
- Conventional commit messages
- Minimum 80% test coverage

### Pull Request Process
1. Fork repository and create feature branch
2. Implement changes with comprehensive tests
3. Ensure all linting and type checks pass
4. Submit PR with detailed description of changes

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: `/docs` directory
- Issues: GitHub issue tracker
- Architecture: `docs/ARCHITECHTURE.md`
- QR Implementation: `docs/QRCODE_UPGRADE.md`
