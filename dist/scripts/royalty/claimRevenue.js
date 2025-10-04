"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_sdk_1 = require("@story-protocol/core-sdk");
const config_1 = require("../../utils/config");
// TODO: You can change this. This is Ippy on Aeneid testnet.
const IP_ID = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';
const main = async function () {
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimrevenue
    const claim = await config_1.client.royalty.claimAllRevenue({
        ancestorIpId: IP_ID,
        claimer: IP_ID,
        currencyTokens: [core_sdk_1.WIP_TOKEN_ADDRESS],
        childIpIds: [],
        royaltyPolicies: [],
    });
    console.log('Claimed revenue:', claim.claimedTokens);
};
main();
