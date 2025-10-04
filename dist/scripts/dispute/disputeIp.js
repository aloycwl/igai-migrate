"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const config_1 = require("../../utils/config");
const sha256 = __importStar(require("multiformats/hashes/sha2"));
const cid_1 = require("multiformats/cid");
const uploadToIpfs_1 = require("../../utils/functions/uploadToIpfs");
const core_sdk_1 = require("@story-protocol/core-sdk");
// TODO: Replace with your own IP ID and fill out your evidence
const IP_ID = '0x876B03d1e756C5C24D4b9A1080387098Fcc380f5';
const EVIDENCE = 'Fill out your evidence here.';
const main = async function () {
    const disputeHash = await (0, uploadToIpfs_1.uploadTextToIPFS)(EVIDENCE);
    console.log(`Dispute evidence uploaded to IPFS: ${disputeHash}`);
    // Raise a Dispute
    //
    // Docs: https://docs.story.foundation/sdk-reference/dispute#raisedispute
    const disputeResponse = await config_1.client.dispute.raiseDispute({
        targetIpId: IP_ID,
        cid: disputeHash,
        // you must pick from one of the whitelisted tags here:
        // https://docs.story.foundation/concepts/dispute-module/overview#dispute-tags
        targetTag: core_sdk_1.DisputeTargetTag.IMPROPER_REGISTRATION,
        bond: (0, viem_1.parseEther)('0.1'),
        liveness: 2592000, // 30 days
    });
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`);
};
// example function you can use for testing purposes if you want
const generateCID = async () => {
    // Generate a random 32-byte buffer
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    // Hash the bytes using SHA-256
    const hash = await sha256.sha256.digest(randomBytes);
    // Create a CIDv1 in dag-pb format
    const cidv1 = cid_1.CID.createV1(0x70, hash); // 0x70 = dag-pb codec
    // Convert CIDv1 to CIDv0 (Base58-encoded)
    return cidv1.toV0().toString();
};
main();
