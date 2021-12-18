import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as fs from "fs"
import * as path from "path"
import {FlowService} from "./flow"

const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"'
const kittyItemsPath = '"../../contracts/KittyItems.cdc"'
const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"'
const flowTokenPath = '"../../contracts/FlowToken.cdc"'
const storefrontPath = '"../../contracts/NFTStorefront.cdc"'

const ITEM_RARITY_PROBABILITIES = {
  1: 2,
  2: 8,
  3: 10,
  4: 80,
}

const rarityTypes = Object.keys(ITEM_RARITY_PROBABILITIES)
const rarityProbabilities = rarityTypes.flatMap(rarityId =>
  Array(ITEM_RARITY_PROBABILITIES[rarityId]).fill(rarityId)
)

class KittyItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly kittyItemsAddress: string,
    private readonly fungibleTokenAddress: string,
    private readonly flowTokenAddress: string,
    private readonly storefrontAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/kittyItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  mint = async (recipient: string) => {
    const authorization = this.flowService.authorizeMinter()

    // Random typeID between 1 - 6
    const typeID = Math.floor(Math.random() * 6) + 1
    const rarityID =
      rarityProbabilities[
        Math.floor(Math.random() * rarityProbabilities.length)
      ]

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/kittyItems/mint_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(typeID, t.UInt64),
        fcl.arg(Number(rarityID), t.UInt64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  mintAndList = async (recipient: string) => {
    const authorization = this.flowService.authorizeMinter()

    const typeID = Math.floor(Math.random() * 6) + 1
    const rarityID =
      rarityProbabilities[
        Math.floor(Math.random() * rarityProbabilities.length)
      ]

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/kittyItems/mint_and_list_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(typeID, t.UInt64),
        fcl.arg(Number(rarityID), t.UInt64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  transfer = async (recipient: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/kittyItems/transfer_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/kittyItems/get_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    })
  }

  getKittyItem = async (itemID: number, address: string): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/kittyItems/get_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(address, t.Address), fcl.arg(itemID, t.UInt64)],
    })
  }

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/kittyItems/get_kitty_items_supply.cdc`
        ),
        "utf8"
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))

    return this.flowService.executeScript<number>({script, args: []})
  }
}

export {KittyItemsService}
