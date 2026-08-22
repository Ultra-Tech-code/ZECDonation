# Zcash Testnet Donation App - Backend

A Node.js backend API for managing Zcash testnet donations.

## Features

- REST API for donation management
- Zcash testnet integration via LightwalletD gRPC
- SQLite database for persistence
- Donation tracking with status management
- Wallet balance queries
- Donation statistics

## Setup

### Prerequisites

- Node.js 14+ and npm
- A local Zcash wallet address exported from your SDK or wallet app
- Access to the public LightwalletD endpoint at testnet.zec.rocks

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your LightwalletD endpoint and local wallet address:
```
ZCASH_LIGHTWALLETD_URL=testnet.zec.rocks:443
ZCASH_RECEIVE_ADDRESS=your_local_receiving_address
PORT=3000
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health & Info

- `GET /api/health` - Health check
- `GET /api/blockchain/info` - Get blockchain information
- `GET /api/statistics` - Get donation statistics

### Donations

- `POST /api/donations` - Create a new donation
  ```json
  {
    "address": "tmPWLjYyHtYjZgYzqZJLV3HhVo1YziFu3X7",
    "amount": 0.001,
    "message": "Thank you for your work!"
  }
  ```

- `GET /api/donations` - List all donations
- `GET /api/donations?limit=50` - List with limit
- `GET /api/donations/:id` - Get specific donation
- `GET /api/donations/status/:status` - Filter by status (pending, completed, failed)
- `PATCH /api/donations/:id` - Update donation status
  ```json
  {
    "status": "completed",
    "tx_id": "abc123..."
  }
  ```

### Campaigns

- `POST /api/campaigns` - Create a campaign with a creator-provided receiving address
  ```json
  {
    "title": "Open Source Fundraiser",
    "description": "Support the project",
    "target_amount": 10,
    "deadline": "2026-12-31",
    "donation_address": "tmPWLjYyHtYjZgYzqZJLV3HhVo1YziFu3X7"
  }
  ```

### Wallet

- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/address` - Store or return the local receiving address

## Database Schema

### donations table
```sql
- id (TEXT) - Primary key
- address (TEXT) - Donation recipient address
- amount (REAL) - Donation amount in ZEC
- message (TEXT) - Donor message
- status (TEXT) - pending/completed/failed
- tx_id (TEXT) - Blockchain transaction ID
- created_at (DATETIME)
- updated_at (DATETIME)
```

### donation_history table
```sql
- id (TEXT) - Primary key
- donation_id (TEXT) - Foreign key to donations
- status (TEXT) - Status at this point
- timestamp (DATETIME)
- details (TEXT) - Additional information
```

## Development

Project structure:
```
src/
  server.js           - Main Express server
  database.js         - SQLite database setup
  lightwalletd-client.js - LightwalletD gRPC client and local wallet profile
  donation-service.js - Donation business logic
```

## Testing

Run tests:
```bash
npm test
```

## Notes

- This is a testnet-only implementation
- The `.env` file should never be committed to version control
- Testnet credentials are for development/testing only
- The frontend is not included in this setup
