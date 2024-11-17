# Xentinel Agent

Your go-to agent for streamlined multisig operations and post-deployment monitoring. Xentinel Agent enables seamless Gnosis Safe management and on-chain transaction monitoring through intuitive chat commands with Frame integration for visualizing the transaction lifecycle.

## Features

- **Safe Transaction Management**
  - Propose new transactions (`/propose`)
  - Sign pending transactions (`/sign`)
  - Execute signed transactions (`/execute`)
  - Review pending transactions (`/pending`)
- **Frame Integration**
  - Rich transaction previews
  - Real-time status updates
  - Interactive confirmation flows
- **AI-Powered Assistant**
  - Smart command suggestions
  - Transaction analysis and help
  - Context-aware assistance
- **Monitoring & Alerts**
  - Transaction status tracking
  - Signature collection progress
  - Execution confirmations

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 20.0.0

## Setup

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd xentinel-agent
   ```

2. **Install dependencies:**
   ```sh
   bun install
   ```

3. **Environment Configuration:**
   ```sh
   cp .env.example .env
   ```
   Configure your environment variables in `.env`:
   ```sh
   # Bot Configuration
   KEY=                  # Bot wallet private key (with 0x prefix)
   SIGNER_PRIVATE_KEY=   # Bot wallet private key (with 0x prefix)
   MSG_LOG=true         # Enable message logging

   # Safe Configuration  
   SAFE_ADDRESS=        # Your Gnosis Safe contract address
   CHAIN_ID=           # Network chain ID
   RPC_URL=            # Your RPC endpoint URL

   # Frame Configuration
   FRAME_BASE_URL=     # Your Frame integration base URL
   
   # Database Configuration
   TURSO_DATABASE_URL= # Turso database URL
   TURSO_AUTH_TOKEN=   # Turso authentication token
   
   # Webhook
   WEB_HOOK=false     # Enable/disable webhook
   ```

4. **Start the service:**
   ```sh
   bun dev
   ```

## Command Reference

### Multisig Operations
- `/propose [to] [ether_amount] [data]` - Create new transaction proposal
- `/sign [safe_tx_hash]` - Sign pending transaction
- `/execute [safe_tx_hash]` - Execute fully signed transaction
- `/pending` - View all pending transactions

### AI Assistant
- `/agent [prompt]` - Get AI-powered assistance

## Project Structure
```
src/
├── handler/ # Command handlers and business logic
├── lib/ # Core utilities and shared functions
└── index.ts # Application entry point
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ using [MessageKit](https://message-kit.vercel.app), [XMTP](https://xmtp.org) and [Base](https://base.org)