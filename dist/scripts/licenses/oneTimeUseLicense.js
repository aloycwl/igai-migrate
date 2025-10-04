"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
const config_1 = require("../../utils/config");
const viem_1 = require("viem");
const core_sdk_1 = require("@story-protocol/core-sdk");
const viem_2 = require("viem");
const LICENSE_LIMIT = 1;
const main = async function () {
    // 1. Set up Licensing Config
    //
    // Docs: https://docs.story.foundation/concepts/licensing-module/license-config-hook#license-config
    const licensingConfig = {
        isSet: true,
        mintingFee: 0n,
        // address of TotalLicenseTokenLimitHook
        // from https://docs.story.foundation/developers/deployed-smart-contracts
        licensingHook: '0xaBAD364Bfa41230272b08f171E0Ca939bD600478',
        hookData: viem_2.zeroAddress,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: viem_2.zeroAddress,
    };
    // 2. Mint and register IP with the licensing config
    //
    // Docs: https://docs.story.foundation/sdk-reference/ipasset#mintandregisteripassetwithpilterms
    const response = await config_1.client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: utils_1.SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: core_sdk_1.PILFlavor.commercialRemix({
                    commercialRevShare: 0,
                    defaultMintingFee: 0,
                    currency: core_sdk_1.WIP_TOKEN_ADDRESS,
                }),
                licensingConfig,
                // set the license limit here
                maxLicenseTokens: LICENSE_LIMIT,
            },
        ],
        ipMetadata: {
            ipMetadataURI: 'test-uri',
            ipMetadataHash: (0, viem_1.toHex)('test-metadata-hash', { size: 32 }),
            nftMetadataHash: (0, viem_1.toHex)('test-nft-metadata-hash', { size: 32 }),
            nftMetadataURI: 'test-nft-uri',
        },
    });
    console.log('Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Term IDs': response.licenseTermsIds,
        'License Limit': LICENSE_LIMIT,
    });
};
main();
