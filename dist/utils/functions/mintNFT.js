"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintNFT = mintNFT;
const utils_1 = require("../utils");
const config_1 = require("../config");
const defaultNftContractAbi_1 = require("../abi/defaultNftContractAbi");
async function mintNFT(to, uri) {
    console.log('Minting a new NFT...');
    const { request } = await config_1.publicClient.simulateContract({
        address: utils_1.NFTContractAddress,
        functionName: 'mintNFT',
        args: [to, uri],
        abi: defaultNftContractAbi_1.defaultNftContractAbi,
    });
    const hash = await config_1.walletClient.writeContract({ ...request, account: config_1.account });
    const { logs } = await config_1.publicClient.waitForTransactionReceipt({
        hash,
    });
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16);
    }
}
