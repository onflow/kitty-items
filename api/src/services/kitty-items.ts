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

enum Rarity {
  Blue,
  Green,
  Purple,
  Gold
}

enum Kind {
  Fishbowl,
  Fishhat,
  Milkshake,
  TukTuk,
  Skateboard,
  Shades,
}

const randomKind = () => {
  const values = Object.keys(Kind);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return Kind[enumKey];
}

const ITEM_RARITY_PROBABILITIES = {
  [Rarity.Gold]: 2,
  [Rarity.Purple]: 8,
  [Rarity.Green]: 10,
  [Rarity.Blue]: 80,
}

const rarityTypes = Object.keys(ITEM_RARITY_PROBABILITIES)
const rarityProbabilities = rarityTypes.flatMap(rarityId =>
  Array(ITEM_RARITY_PROBABILITIES[rarityId]).fill(rarityId)
)

const randomRarity = () => {
  return rarityProbabilities[
    Math.floor(Math.random() * rarityProbabilities.length)
  ]
}

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

    const kind = randomKind()
    const rarity = randomRarity()

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
        fcl.arg(Number(kind), t.UInt8),
        fcl.arg(Number(rarity), t.UInt8),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  mintAndList = async (recipient: string) => {
    const authorization = this.flowService.authorizeMinter()

    const kind = randomKind()
    const rarity = randomRarity()

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
        fcl.arg(Number(kind), t.UInt8),
        fcl.arg(Number(rarity), t.UInt8),
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
