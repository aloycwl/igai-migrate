"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletClient = exports.publicClient = exports.client = exports.account = exports.networkInfo = exports.network = void 0;
const core_sdk_1 = require("@story-protocol/core-sdk");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Network configurations
const networkConfigs = {
    aeneid: {
        rpcProviderUrl: 'https://aeneid.storyrpc.io',
        blockExplorer: 'https://aeneid.storyscan.io',
        protocolExplorer: 'https://aeneid.explorer.story.foundation',
        defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a',
        defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
        chain: core_sdk_1.aeneid,
    },
    mainnet: {
        rpcProviderUrl: 'https://mainnet.storyrpc.io',
        blockExplorer: 'https://storyscan.io',
        protocolExplorer: 'https://explorer.story.foundation',
        defaultNFTContractAddress: null,
        defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE',
        chain: core_sdk_1.mainnet,
    },
};
const getNetwork = () => {
    const network = process.env.STORY_NETWORK;
    if (network && !(network in networkConfigs)) {
        throw new Error(`Invalid network: ${network}. Must be one of: ${Object.keys(networkConfigs).join(', ')}`);
    }
    return network || 'aeneid';
};
// Initialize client configuration
exports.network = getNetwork();
exports.networkInfo = {
    ...networkConfigs[exports.network],
    rpcProviderUrl: process.env.RPC_PROVIDER_URL || networkConfigs[exports.network].rpcProviderUrl,
};
exports.account = (0, accounts_1.privateKeyToAccount)(`0x${process.env.WALLET_PRIVATE_KEY}`);
const config = {
    account: exports.account,
    transport: (0, viem_1.http)(exports.networkInfo.rpcProviderUrl),
    chainId: exports.network,
};
exports.client = core_sdk_1.StoryClient.newClient(config);
const baseConfig = {
    chain: exports.networkInfo.chain,
    transport: (0, viem_1.http)(exports.networkInfo.rpcProviderUrl),
};
exports.publicClient = (0, viem_1.createPublicClient)(baseConfig);
exports.walletClient = (0, viem_1.createWalletClient)({
    ...baseConfig,
    account: exports.account,
});
