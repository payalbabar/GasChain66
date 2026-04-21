# GasChain | LPG Connect: User Guide 📖

Welcome to **GasChain**, the decentralized LPG cylinder management protocol. This guide will help you navigate the platform and understand its core features.

## 🏁 Getting Started

### 1. Requirements
- **Browser**: Chrome or Brave (recommended).
- **Wallet**: [Freighter Wallet](https://www.freighter.app/) extension installed.
- **Network**: Switch Freighter to **Testnet** (Settings -> Network -> Testnet).

### 2. Connecting your Wallet
1. Open the [GasChain Web App](https://splendorous-clafoutis-f7b51c.netlify.app/).
2. Click **"Connect Wallet"** on the landing page.
3. Approve the connection request in your Freighter extension.
4. Once connected, your wallet address and XLM balance will appear in the top-right corner.

---

## ⛽ Core Features

### 📅 Booking a Cylinder
1. Go to the **"Book Cylinder"** page from the sidebar.
2. Select your category (General / Direct Benefit Transfer).
3. The system automatically calculates your **Subsidy Eligibility** based on your on-chain history.
4. Click **"Confirm Booking"**.
5. Sign the transaction in Freighter. 
   - *Note: Our platform uses **Fee Sponsorship**, so you don't need XLM for gas fees!*

### ⛓️ Tracking the Supply Chain
1. Visit the **"Supply Chain"** page.
2. View real-time tracking of every cylinder ID.
3. Every status update (Dispatched, Out for Delivery, Delivered) is anchored to the Stellar Blockchain.

### 📑 Viewing the Blockchain Ledger
1. Navigate to the **"Blockchain Ledger"** page.
2. View real-time blocks being added to the network.
3. Click on any Transaction Hash to view it on the **Stellar Expert** explorer.

### 📊 Real-time Metrics
- Admins and public users can view platform-wide stats at `/dashboard/metrics`.
- Track Daily Active Users (DAU), Transaction Volume, and Total Subsidies disbursed.

---

## 🛡️ Security & Privacy
- **Privacy**: Your personal details (phone/address) are encrypted off-chain, while only public IDs are stored on-chain.
- **Security**: All financial transactions are handled via smart contracts on the Stellar network.

## ❓ FAQ
**Q: Why is my XLM balance not decreasing?**
A: GasChain implements **Gasless Transactions**. Our platform sponsors the transaction fees for all legitimate bookings.

**Q: Can I use this on Mainnet?**
A: Currently, GasChain is in production-readiness on the **Stellar Testnet** for Level 6 validation.

---
*For support, reach out to the GasChain Community on GitHub.*
