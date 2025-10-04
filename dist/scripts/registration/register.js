"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
const config_1 = require("../../utils/config");
const uploadToIpfs_1 = require("../../utils/functions/uploadToIpfs");
const crypto_1 = require("crypto");
const core_sdk_1 = require("@story-protocol/core-sdk");
const viem_1 = require("viem");
const dbCID_1 = require("../database/dbCID");
const axios_1 = __importDefault(require("axios"));
async function getHashFromUrl(url) {
    const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    return ('0x' + (0, crypto_1.createHash)('sha256').update(buffer).digest('hex'));
}
const main = async function () {
    console.log('>>> main() started <<<');
    process.stdout.write(''); // flush logs immediately (important for Replit)
    // 0. Fetch data from database
    const dbResult = await (0, dbCID_1.dbCID)();
    if (!dbResult.success) {
        console.error('Failed to fetch data from database:', dbResult.error);
        process.stdout.write('');
        return;
    }
    const { id, unixTimestamp, cid } = dbResult;
    console.log(`Fetched DB result → id: ${id}, cid: ${cid}`);
    process.stdout.write('');
    // 1. Generate hash from CID URL
    const mediaUrl = `https://${cid}.ipfs.w3s.link/`;
    let mediaHash;
    try {
        mediaHash = await getHashFromUrl(mediaUrl);
        console.log(`Successfully generated hash for CID: ${cid}`);
        process.stdout.write('');
    }
    catch (error) {
        console.error(`Failed to fetch and hash content from CID: ${cid}`, error);
        process.stdout.write('');
        return;
    }
    // 2. Set up your IP Metadata
    const ipMetadata = config_1.client.ipAsset.generateIpMetadata({
        title: 'IGAI Data #' + id,
        description: 'A decentralised personal health insight',
        createdAt: unixTimestamp,
        creators: [
            {
                name: 'Insight Genesis',
                address: '0x2e0aCE0129E66A36cee92c5146C73Ec4874d0109',
                contributionPercent: 100,
            },
        ],
        image: 'https://amber-implicit-jay-463.mypinata.cloud/ipfs/bafkreiecymi4o3zib7m3mdbanhzah4vssebktpqftjojj3gx7mgtykmray',
        imageHash: '0x82c311c76f280fd9b60c2069f203f2b29102a9be059a5c94ecd7fb0d3c299106',
        mediaUrl: mediaUrl,
        mediaHash: mediaHash,
        mediaType: 'application/json',
    });
    // 2b. NFT Metadata
    const nftMetadata = {
        name: 'IGAI Data #' + id,
        description: 'A decentralised personal health insight. This NFT represents ownership of the IP Asset.',
        image: 'https://amber-implicit-jay-463.mypinata.cloud/ipfs/bafkreiecymi4o3zib7m3mdbanhzah4vssebktpqftjojj3gx7mgtykmray ',
        attributes: [
            {
                key: 'Source',
                value: 'insightgenesis.ai',
            },
        ],
    };
    // 3. Upload your IP and NFT Metadata to IPFS
    console.log('Uploading metadata to IPFS...');
    const ipIpfsHash = await (0, uploadToIpfs_1.uploadJSONToIPFS)(ipMetadata);
    const ipHash = (0, crypto_1.createHash)('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
    const nftIpfsHash = await (0, uploadToIpfs_1.uploadJSONToIPFS)(nftMetadata);
    const nftHash = (0, crypto_1.createHash)('sha256').update(JSON.stringify(nftMetadata)).digest('hex');
    console.log('Uploaded → IP:', ipIpfsHash, ' NFT:', nftIpfsHash);
    process.stdout.write('');
    // 4. Register the NFT as an IP Asset
    console.log('Registering asset on Story Protocol...');
    const response = await config_1.client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: utils_1.SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: core_sdk_1.PILFlavor.commercialRemix({
                    commercialRevShare: 5,
                    defaultMintingFee: (0, viem_1.parseEther)('1'),
                    currency: core_sdk_1.WIP_TOKEN_ADDRESS,
                }),
            },
        ],
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
    });
    console.log('✅ Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Terms IDs': response.licenseTermsIds,
    });
    console.log(`View on the explorer: ${config_1.networkInfo.protocolExplorer}/ipa/${response.ipId}`);
    process.stdout.write('');
};
exports.default = main;
// Allow CLI usage (`npx ts-node scripts/registration/register.ts`)
if (require.main === module) {
    main();
}
