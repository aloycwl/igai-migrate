"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_sdk_1 = require("@story-protocol/core-sdk");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const dotenv_1 = __importDefault(require("dotenv"));
const licensingModuleAbi_1 = require("../../utils/abi/licensingModuleAbi");
dotenv_1.default.config();
// This is a niche example showing how a user can pay (the tx cost + minting fee) to mint a PRIVATE license for a given IP Asset. They are able to do this because the IP owner signs the message, but the user runs the transaction with the signature.
const IP_ID = '0x656A767D7F32e2FA6BfB745ba21dD251bBc6E660';
const main = async function () {
    // ip owner wallet
    const walletClient = (0, viem_1.createWalletClient)({
        chain: core_sdk_1.aeneid,
        transport: (0, viem_1.http)('https://aeneid.storyrpc.io'),
        account: (0, accounts_1.privateKeyToAccount)(`0x${process.env.WALLET_PRIVATE_KEY_IP_OWNER}`),
    });
    // user wallet
    const userAccount = (0, accounts_1.privateKeyToAccount)(`0x${process.env.WALLET_PRIVATE_KEY_USER}`);
    const config = {
        account: userAccount,
        transport: (0, viem_1.http)('https://aeneid.storyrpc.io'),
        chainId: core_sdk_1.aeneid.id,
    };
    const client = core_sdk_1.StoryClient.newClient(config);
    const data = (0, viem_1.encodeFunctionData)({
        abi: licensingModuleAbi_1.licensingModuleAbi, // abi from another file
        functionName: 'mintLicenseTokens',
        args: [
            IP_ID, // ipId
            '0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316', // pil license template
            1n, // license terms id
            1n, // amount
            userAccount.address, // receiver (can be whoever you want to receive the license)
            '0x', // royalty contract (can leave as '0x')
            0n, // max minting fee (default)
            100_000_000, // max revenue share (default)
        ],
    });
    const VALID_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const nonceResult = await client.ipAccount.getIpAccountNonce(IP_ID);
    const { signature } = await (0, core_sdk_1.getSignature)({
        state: nonceResult,
        to: '0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f', // licensing module
        encodeData: data,
        wallet: walletClient,
        verifyingContract: IP_ID, // ipId
        deadline: VALID_DEADLINE,
        chainId: core_sdk_1.aeneid.id,
    });
    try {
        const response = await client.ipAccount.executeWithSig({
            to: '0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f', // licensing module
            data: data,
            ipId: IP_ID,
            signer: walletClient.account?.address, // ip owner
            deadline: VALID_DEADLINE,
            signature: signature,
        });
        console.log(`Transaction sent: https://aeneid.storyscan.io/tx/${response.txHash}`);
    }
    catch (error) {
        console.error(error);
    }
};
main();
