# Architecture Document: GasChain ⛽⛓️

## 1. System Overview
GasChain is a Next-Generation LPG Cylinder Management System built to address inefficiencies and lack of transparency in the LPG supply chain. By utilizing blockchain-inspired data structures (developed over Base44) and integrating the Stellar network via Freighter wallet, GasChain ensures immutable tracking, streamlined payments, and direct subsidy reimbursements.

## 2. Core Components

### 2.1 Frontend (React + Vite)
- **Framework**: React 18 for component-based UI.
- **Build Tool**: Vite for fast bundling and HMR.
- **Styling**: Tailwind CSS combined with Shadcn/UI for a modern, accessible, and responsive "glassmorphism" aesthetic.
- **State Management**: React Context, coupled with local state for form control and dashboard filters.

### 2.2 Wallet Integration (Stellar Freighter)
- **Library**: `@stellar/freighter-api`
- **Role**: Replaced traditional Web3 wallets (e.g., MetaMask).
- **Functionality**: Handles user authentication on the Landing page, transaction signing, and initiating XLM transfers for booking cylinders directly on the Stellar testnet.

### 2.3 Backend / Database Layer (Base44 SDK)
- **Role**: Serves as the Backend-as-a-Service and Database.
- **Entities**: 
  - `User`: Manages roles (Consumer, Distributor, Manufacturer, Regulator).
  - `Booking`: Tracks order requests, connected to payments via Stellar.
  - `SupplyEvent` & `SupplyBlock`: Forms an immutable, linked-list data structure simulating a blockchain. Each block points to a previous hash, securing the supply chain history.
  - `Subsidy`: Automated and transparent tracking of reimbursements to end consumers.

### 2.4 Smart Contracts (Soroban)
- **Framework**: Soroban Rust SDK
- **Role**: Decentralized logic for booking and validation on the Stellar network.
- **Contracts**: Located in the `/contracts` directory, written in Rust.


## 3. High-Level Workflows

### 3.1 Gas Booking & Payment
1. **Initiation**: A Consumer logs in, validates their Freighter wallet, and creates a booking payload.
2. **Payment Execution**: The user is prompted to sign a generic mock/test transaction using `signTransaction` via Freighter, validating their Stellar key. (Or transferring Testnet XLM).
3. **Record Creation**: Once the signature is confirmed, the Booking record is written to the Base44 backend.

### 3.2 Supply Chain Tracking (Immutable Logging)
1. **Event Trigger**: When a cylinder changes state (e.g., `DISPATCHED_TO_DISTRIBUTOR` or `DELIVERED`), a `SupplyEvent` is captured.
2. **Block Generation**: The system creates a `SupplyBlock` containing the event details, calculating a cryptographic hash (using SHA-256 equivalent logic) based on the current data and the `previousHash`.
3. **Commit**: The new block is appended to the ledger, making tampering computationally obvious.

### 3.3 Dashboard Interactions
- **Drill-down Analytics**: The dashboard aggregates complex data from Base44 (bookings, subsidies, blocks) into high-level metrics.
- **Interactive Modals**: Users can click stat panels to open detailed panels without losing their contextual view.

## 4. Security & Data Integrity 
- **Decentralized Authentication**: Trust is established via the Stellar network using public-key cryptography (Freighter).
- **Ledger Immutability**: Implementing hash-chaining in the Base44 database ensures any alterations to past events invalidate the entire subsequent chain. 
- **Role-Based Access Control (RBAC)**: Enforced both on the client via conditional rendering and on the Base44 entity permission layer.

## 5. CI/CD & Deployment
- **Pipeline**: Automated via **GitHub Actions**. The `.github/workflows/ci.yml` pipeline handles:
  - Linting (ESLint)
  - Type-checking (TSC)
  - Production builds (Vite)
- **Staging/Production**: Automatically deployed to **Vercel** on every push to the `main` branch.

