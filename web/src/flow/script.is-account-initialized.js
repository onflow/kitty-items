import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Kibble from 0xKibble
  import KittyItems from 0xKittyItems
  import KittyItemsMarket from 0xKittyItemsMarket

  pub fun hasKibble(_ address: Address): Bool {
    let receiver: Bool = getAccount(address)
      .getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)
      .check()

    let balance: Bool = getAccount(address)
      .getCapability<&Kibble.Vault{FungibleToken.Balance}>(Kibble.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasKittyItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath)
      .check()
  }

  pub fun hasKittyItemsMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath)
      .check()
  }

  pub fun main(address: Address): {String: Bool} {
    let ret: {String: Bool} = {}
    ret["Kibble"] = hasKibble(address)
    ret["KittyItems"] = hasKittyItems(address)
    ret["KittyItemsMarket"] = hasKittyItemsMarket(address)
    return ret
  }
`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
