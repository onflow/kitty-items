import NonFungibleToken from 0xNONFUNGIBLETOKEN
import KittyItems from 0xKITTYITEMS

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(recipient: Address, typeID: UInt64) {
    
    // local variable for storing the minter reference
    let minter: &KittyItems.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&KittyItems.NFTMinter>(from: KittyItems.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Get the public account object for the recipient
        let recipient = getAccount(recipient)

        // Borrow the recipient's public NFT collection reference
        let receiver = recipient
            .getCapability(KittyItems.CollectionPublicPath)!
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(recipient: receiver, typeID: typeID)
    }
}
