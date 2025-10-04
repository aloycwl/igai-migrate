"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLicensingConfig = exports.RoyaltyPolicyLRP = exports.RoyaltyPolicyLAP = exports.NonCommercialSocialRemixingTerms = exports.NonCommercialSocialRemixingTermsId = exports.SPGNFTContractAddress = exports.NFTContractAddress = void 0;
exports.convertRoyaltyPercentToTokens = convertRoyaltyPercentToTokens;
const viem_1 = require("viem");
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
dotenv_1.default.config();
// Export contract addresses with appropriate defaults based on network
exports.NFTContractAddress = process.env.NFT_CONTRACT_ADDRESS || config_1.networkInfo.defaultNFTContractAddress || viem_1.zeroAddress;
exports.SPGNFTContractAddress = process.env.SPG_NFT_CONTRACT_ADDRESS || config_1.networkInfo.defaultSPGNFTContractAddress || viem_1.zeroAddress;
// This is a pre-configured PIL Flavor:
// https://docs.story.foundation/concepts/programmable-ip-license/pil-flavors#flavor-%231%3A-non-commercial-social-remixing
exports.NonCommercialSocialRemixingTermsId = '1';
exports.NonCommercialSocialRemixingTerms = {
    transferable: true,
    royaltyPolicy: viem_1.zeroAddress,
    defaultMintingFee: 0n,
    expiration: 0n,
    commercialUse: false,
    commercialAttribution: false,
    commercializerChecker: viem_1.zeroAddress,
    commercializerCheckerData: '0x',
    commercialRevShare: 0,
    commercialRevCeiling: 0n,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: 0n,
    currency: viem_1.zeroAddress,
    uri: 'https://github.com/piplabs/pil-document/blob/998c13e6ee1d04eb817aefd1fe16dfe8be3cd7a2/off-chain-terms/NCSR.json',
};
// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
exports.RoyaltyPolicyLAP = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E';
exports.RoyaltyPolicyLRP = '0x9156e603C949481883B1d3355c6f1132D191fC41';
exports.defaultLicensingConfig = {
    mintingFee: 0n,
    isSet: false,
    disabled: false,
    commercialRevShare: 0,
    expectGroupRewardPool: viem_1.zeroAddress,
    expectMinimumGroupRewardShare: 0,
    licensingHook: viem_1.zeroAddress,
    hookData: '0x',
};
function convertRoyaltyPercentToTokens(royaltyPercent) {
    // there are 100,000,000 tokens total (100, but 6 decimals)
    return royaltyPercent * 1_000_000;
}
