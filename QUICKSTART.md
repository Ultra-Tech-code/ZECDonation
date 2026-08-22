# Quick Start Guide

## Prerequisites
- Node.js 14+ installed
- A local Zcash wallet address exported from your SDK or wallet app
- Access to the public LightwalletD endpoint at testnet.zec.rocks

## Quick Setup (2 minutes)

### 1. Configure your LightwalletD connection
Edit `.env` file:
```bash
nano .env
```

Update these lines with your LightwalletD endpoint and local wallet address:
```
ZCASH_LIGHTWALLETD_URL=testnet.zec.rocks:443
ZCASH_RECEIVE_ADDRESS=your_local_receiving_address
```

### 2. Start the server
```bash
npm run dev
```

You'll see:
```
Zcash Donation API server running on http://localhost:3000
```

### 3. Test the API
In another terminal:
```bash
# Health check
curl http://localhost:3000/api/health

# Get wallet balance
curl http://localhost:3000/api/wallet/balance

# Create a donation
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "address": "tmPWLjYyHtYjZgYzqZJLV3HhVo1YziFu3X7",
    "amount": 0.001,
    "message": "Test donation"
  }'

# List all donations
curl http://localhost:3000/api/donations
```

Or use the provided test script:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Features Implemented

✅ REST API for donation management
✅ Zcash testnet integration (LightwalletD gRPC)
✅ SQLite database for persistence
✅ Donation tracking with status (pending/completed/failed)
✅ Wallet operations (balance, new address)
✅ Statistics and reporting
✅ Error handling and validation

## Next Steps

1. **Add a frontend** - Create a web/mobile interface for donations
2. **Add WebSocket support** - Real-time donation updates
3. **Add authentication** - Secure admin endpoints
4. **Add transaction verification** - Verify on-chain donations
5. **Deploy to production** - Set up hosting and SSL certificates

## File Descriptions

- `src/server.js` - Main API server (all routes defined here)
- `src/database.js` - SQLite setup and initialization
- `src/lightwalletd-client.js` - LightwalletD gRPC client and local wallet profile
- `src/donation-service.js` - Business logic for donations
- `README.md` - Full API documentation
- `package.json` - Node.js dependencies

## Environment Variables

```
ZCASH_LIGHTWALLETD_URL  - LightwalletD gRPC endpoint (required)
ZCASH_RECEIVE_ADDRESS   - Local wallet receiving address (required)
ZCASH_WALLET_FILE       - Local wallet profile file (optional)
PORT               - Server port (default: 3000)
NODE_ENV           - development/production
DB_PATH            - Database file location (default: ./donations.db)
```

## Troubleshooting

**Error: "Cannot find module 'express'"**
- Run: `npm install`

**Error: "No local receiving address is configured"**
- Set `ZCASH_RECEIVE_ADDRESS` in `.env`
- Or store an address in the local wallet file
- Make sure the address was exported from your Zcash wallet SDK

**Database locked error**
- Stop the server and try again
- Check no other instances are running

## Support

For issues with:
- **Zcash testnet**: Visit https://testnet.zec.rocks
- **Node.js**: Check https://nodejs.org/docs/
- **Express**: Check https://expressjs.com/
