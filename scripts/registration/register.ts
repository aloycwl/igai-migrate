import { SPGNFTContractAddress } from '../../utils/utils'
import { client, networkInfo } from '../../utils/config'
import { uploadJSONToIPFS } from '../../utils/functions/uploadToIpfs'
import { createHash } from 'crypto'
import { IpMetadata, PILFlavor, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk'
import { parseEther, Hex } from 'viem'
import { dbCID } from '../database/dbCID'
import axios from 'axios'

async function getHashFromUrl(url: string): Promise<Hex> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)
    return ('0x' + createHash('sha256').update(buffer).digest('hex')) as Hex
}

const main = async function () {
    // 0. Fetch data from database
    const dbResult = await dbCID()

    if (!dbResult.success) {
        console.error('Failed to fetch data from database:', dbResult.error)
        return
    }

    const { id, unixTimestamp, cid } = dbResult

    // 1. Generate hash from CID URL
    const mediaUrl = `https://${cid}.ipfs.w3s.link/`
    let mediaHash: Hex

    try {
        mediaHash = await getHashFromUrl(mediaUrl)
        console.log(`Successfully generated hash for CID: ${cid}`)
    } catch (error) {
        console.error(`Failed to fetch and hash content from CID: ${cid}`)
        return
    }

    // 2. Set up your IP Metadata
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
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
    })

    // 2. Set up your NFT Metadata
    //
    // Docs: https://docs.opensea.io/docs/metadata-standards#metadata-structure
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
    }

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/sdk-reference/ip-asset#mintandregisterip
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: PILFlavor.commercialRemix({
                    commercialRevShare: 5,
                    defaultMintingFee: parseEther('1'),
                    currency: WIP_TOKEN_ADDRESS,
                }),
            },
        ],
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
    })
    console.log('Root IPA created:', {
        'Transaction Hash': response.txHash,
        'IPA ID': response.ipId,
        'License Terms IDs': response.licenseTermsIds,
    })
    console.log(`View on the explorer: ${networkInfo.protocolExplorer}/ipa/${response.ipId}`)
}

export default main

// only run automatically if called directly via CLI
if (require.main === module) {
  main()
}