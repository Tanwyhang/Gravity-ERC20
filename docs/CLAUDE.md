# GRAVITY - Web3 Payment & Verification App

## Goal Description
Build a Web3 payment application that allows creators to generate customizable payment links/QRs for events. Users can pay with any ERC20 token (valued via Uniswap Oracle). The app generates a digital receipt (QR) which can be verified by the creator to ensure validity for the specific event.

## ⚠️ User Review Required
### IMPORTANT

**Payment Settlement:** The current plan assumes the input token is transferred to the recipient after value verification. If you prefer the tokens to be swapped to a specific currency (e.g., USDC) before sending to the recipient, please specify. For now, we assume "direct transfer of value-verified tokens".

### NOTE
**Database:** We will use SQLite for local development via Prisma. This is easy to switch to PostgreSQL for production.

---

## Proposed Changes

### Smart Contracts (Hardhat)
**[NEW] `contracts/GravityPayment.sol`**
**Core Logic:**
```solidity
pay(uint256 eventId, address tokenIn, uint256 amountIn, address recipient)
```
- Integration with Uniswap V3 Oracle to verify `value(tokenIn) >= requiredValue`
- Emits `PaymentMade(uint256 indexed eventId, address indexed payer, uint256 amount, address token)`
- Dependencies: `@uniswap/v3-periphery`, `@openzeppelin/contracts`

### Backend (Next.js API + Prisma)
**[NEW] `prisma/schema.prisma`**
**Models:**
```prisma
Event: id (String/UUID), creator (Address), recipient (Address), amount (Decimal), currency (String), theme (JSON), createdAt
```

**[NEW] `src/app/api/events/route.ts`**
- **POST:** Create new event (save metadata, return ID)
- **GET:** Fetch event details by ID

### Frontend (Next.js + Shadcn)

**[NEW] `src/app/create/page.tsx`**
**Event Creation Form:**
- Inputs: Title, Amount (USD/ETH), Recipient Address
- Customization: Color picker (Primary, Background, Text), Image Upload (URL)
- Preview Component: Real-time preview of the payment modal

**[NEW] `src/app/[eventId]/page.tsx` (Payment Page)**
**Payment Modal:**
- Fetches event data from API
- Applies custom theme (colors, fonts)
- **Token Selector:** List of whitelisted tokens (USDC, WETH, DAI, etc.)
- **Price Quote:** Read from Uniswap Oracle to show "You need to pay X [Token]"
- **Action:** Approve → Pay (calls Smart Contract)
- **Success State:** Displays Receipt QR Code

**[NEW] `src/app/verify/page.tsx`**
**QR Scanner:** Uses react-qr-reader or similar
**Validation Logic:**
- Decodes QR (contains eventId, txHash, payer)
- Verifies transaction on-chain (or via provider)
- **Checks:**
  - Tx is successful
  - Event PaymentMade exists in logs
  - `log.eventId` matches the creator's eventId
- Displays "Valid Payment" or "Invalid/Wrong Event"

---

## Verification Plan

### Automated Tests
- **Contracts:** Hardhat tests for `pay()` logic, Oracle price conversion, and event emission
- **Frontend:** Component tests for the Customization Preview

### Manual Verification
1. **Create Event:** Create an event with $10 USD requirement. Customize colors
2. **Pay:** Open link. Select a test token (e.g., UNI on Sepolia). Ensure Oracle calculates correct amount. Pay
3. **Receipt:** Verify QR code appears
4. **Verify:** Use a separate device/tab to scan the QR. Confirm it validates ONLY for the correct event ID

---

# GRAVITY Tasks

## 🚀 Project Initialization
- [ ] Initialize Next.js app with TypeScript, Tailwind, ESLint
- [ ] Initialize Hardhat project
- [ ] Install dependencies (shadcn/ui, rainbowkit, wagmi, prisma)

## 🔗 Smart Contract Development
- [ ] Design PaymentProcessor contract interface
- [ ] Implement Uniswap V3 Oracle integration for price feeds
- [ ] Implement pay function with token swapping/transfer logic
- [ ] Write tests for contracts
- [ ] Deploy to Sepolia testnet

## 🗄️ Backend & Database
- [ ] Setup Prisma with SQLite (or Postgres)
- [ ] Design schema for Event (id, creator, recipient, amount, currency, customization config)
- [ ] Create API routes for creating and fetching events

## 🎨 Frontend: Creator Dashboard
- [ ] Create Event Form (Amount, Recipient, Customization)
- [ ] Implement Customization Preview (Colors, Image)
- [ ] Generate Payment Link & Creator QR

## 💳 Frontend: Payment Page
- [ ] Dynamic Route [eventId]
- [ ] Fetch Event Metadata & Apply Custom Styles
- [ ] Connect Wallet (RainbowKit)
- [ ] Token Selector & Price Quote (Uniswap Oracle)
- [ ] Execute Payment Transaction
- [ ] Generate Receipt QR Code (signed/hashed)

## ✅ Frontend: Verification
- [ ] QR Scanner Component
- [ ] Verification Logic (Chain check + Event ID match)

## 🎯 Final Polish & Verification
- [ ] End-to-end testing
- [ ] UI/UX Polish



