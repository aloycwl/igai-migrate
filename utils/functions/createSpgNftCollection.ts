import { zeroAddress } from 'viem'
import { client } from '../config'

const main = async function () {
    const newCollection = await client.nftClient.createNFTCollection({
        name: 'IGAI Data',
        symbol: 'IGAI',
        isPublicMinting: true,
        mintOpen: true,
        mintFeeRecipient: zeroAddress,
        contractURI: '',
    })

    console.log('New collection created:', {
        'SPG NFT Contract Address': newCollection.spgNftContract,
        'Transaction Hash': newCollection.txHash,
    })
}

main()
