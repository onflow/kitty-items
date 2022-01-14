import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandAccountItemsKey} from "src/hooks/useAccountItems"

const FETCH_ACCOUNT_ITEMS_SCRIPT = `
  import NonFungibleToken from 0xNonFungibleToken
  import KittyItems from 0xKittyItems

  pub fun main(address: Address): [UInt64] {
    if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
      return collection.getIDs()
    }

    return []
  }
`

export function fetchAccountItems(key) {
  const {address} = expandAccountItemsKey(key)
  if (address == null) return Promise.resolve([])

  // prettier-ignore
  return fcl.query({
    cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
    args: (arg, t) => [
      fcl.arg(address, Address),
    ],
  })
}
