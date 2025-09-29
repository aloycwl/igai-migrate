# Story Protocol TypeScript SDK Examples

## Project Overview
This is a Story Protocol TypeScript SDK example project that provides multiple CLI scripts for interacting with the Story blockchain network. The project demonstrates various Story Protocol operations including IP registration, licensing, derivatives, royalties, and disputes.

## Current State
- ✅ Node.js 20 environment configured
- ✅ All dependencies installed via npm
- ✅ TypeScript compilation working
- ✅ CLI workflow configured
- ⚠️ Environment variables need to be configured by user

## Project Architecture
- **Language**: TypeScript/Node.js
- **Framework**: Story Protocol Core SDK v1.4.0-rc.2
- **Blockchain**: Story Network (testnet: aeneid, mainnet support)
- **IPFS**: Pinata integration for metadata uploads
- **Type**: CLI scripts (not a web application)

## Required Environment Variables
Users need to configure these in Replit Secrets:
- `WALLET_PRIVATE_KEY`: Story Network testnet wallet private key
- `PINATA_JWT`: Pinata API JWT for IPFS uploads (required for register scripts)
- `SPG_NFT_CONTRACT_ADDRESS`: Optional custom SPG NFT contract address
- `STORY_NETWORK`: Optional, defaults to 'aeneid' testnet
- `RPC_PROVIDER_URL`: Optional custom RPC endpoint

## Available Scripts
- `npm run register`: Mint NFT and register IP in one transaction
- `npm run register-custom`: Register IP with custom ERC-721 contract
- `npm run derivative-commercial`: Register commercial derivative IP
- `npm run derivative-non-commercial`: Register non-commercial derivative IP
- `npm run mint-license`: Mint license token from IP Asset
- `npm run create-spg-collection`: Create new SPG NFT collection
- `npm run dispute`: Dispute an IP Asset
- Plus additional royalty and licensing scripts

## Setup Status
- Project dependencies: ✅ Installed
- TypeScript configuration: ✅ Working
- CLI environment: ✅ Ready
- User secrets: ⚠️ Need to be configured

## Recent Changes
- 2025-09-29: Initial project import and setup completed
- 2025-09-29: Node.js environment and dependencies configured
- 2025-09-29: CLI workflow established for script execution

## Usage Notes
This project is designed to run CLI scripts that interact with the Story Protocol blockchain. It's not a web application, but rather a collection of example scripts that demonstrate various Story Protocol SDK capabilities.