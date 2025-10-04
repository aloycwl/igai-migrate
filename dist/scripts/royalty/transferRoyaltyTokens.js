"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
const config_1 = require("../../utils/config");
const core_sdk_1 = require("@story-protocol/core-sdk");
const main = async function () {
    // FOR SETUP: Create a new IP Asset we can use
    const parentIp = await config_1.client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: utils_1.SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: core_sdk_1.PILFlavor.commercialRemix({
                    commercialRevShare: 0,
                    defaultMintingFee: 0,
                    currency: core_sdk_1.WIP_TOKEN_ADDRESS,
                }),
            },
        ],
    });
    console.log('Parent IPA created:', {
        'Transaction Hash': parentIp.txHash,
        'IPA ID': parentIp.ipId,
        'License Terms ID': parentIp.licenseTermsIds?.[0],
    });
    // FOR SETUP: Mint a license token in order to trigger IP Royalty Vault deployment
    const mintLicense = await config_1.client.license.mintLicenseTokens({
        licenseTermsId: parentIp.licenseTermsIds?.[0],
        licensorIpId: parentIp.ipId,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
    });
    console.log('Minted license:', {
        'Transaction Hash': mintLicense.txHash,
        'License Token ID': mintLicense.licenseTokenIds?.[0],
    });
    // Get the IP Royalty Vault Address
    // Note: This is equivalent to the currency address of the ERC-20
    // Royalty Tokens.
    const royaltyVaultAddress = await config_1.client.royalty.getRoyaltyVaultAddress(parentIp.ipId);
    console.log('Royalty Vault Address:', royaltyVaultAddress);
    // Transfer the Royalty Tokens from the IP Account to the address
    // executing this transaction (you could use any other address as well)
    const transferRoyaltyTokens = await config_1.client.ipAccount.transferErc20({
        ipId: parentIp.ipId,
        tokens: [
            {
                address: royaltyVaultAddress,
                amount: (0, utils_1.convertRoyaltyPercentToTokens)(1),
                target: config_1.account.address,
            },
        ],
    });
    console.log('Transferred royalty tokens:', { 'Transaction Hash': transferRoyaltyTokens.txHash });
};
main();
