import KittyItems from "../../contracts/KittyItems.cdc"
 
 
transaction {

  let minter: &KittyItems.NFTMinter

  prepare(signer: AuthAccount) {

    self.minter = signer.borrow<&KittyItems.NFTMinter>(from: KittyItems.MinterStoragePath)
            ?? panic("Only authorized KittyItems NFT Minter can update KittyItems NFT...")

    let NewImages: { KittyItems.Kind: {KittyItems.Rarity: String}} = {
      KittyItems.Kind.shades: {
        KittyItems.Rarity.blue: "bafybeibtxvitlnvksnzwrwmsqdgnoznosknr3fx5jxjazjcerpa2qo4jy4",
        KittyItems.Rarity.green: "bafybeicp5bagsziwkyarey76m5jkr6i3a5yrgr7r435qyuutbtlqxcdbwu",
        KittyItems.Rarity.purple: "bafybeidjigkvt67dtuwrgrpdt2z4dojq2efpbw66ndnffkb6eyr4baml2i",
        KittyItems.Rarity.gold: "bafybeibtxvitlnvksnzwrwmsqdgnoznosknr3fx5jxjazjcerpa2qo4jy4"
      }
    }

    self.minter.addNewImagesForKind(from: signer, newImages: NewImages);
  
  }

  execute {}
}
