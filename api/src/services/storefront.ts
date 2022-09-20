/**
 * Storefront Service
 * 
 * Service class used to execute scripts & transactions on the Flow blockchain to buy & sell Kitty Items. 
 * Also contains queries to interact with listings table to show Store/Marketplace listings on site.
 *
 */
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as fs from "fs"
import * as path from "path"
import {Listing} from "../models/listing"
import {FlowService} from "./flow"

const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"'
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"'
const metadataViewsPath = '"../../contracts/MetadataViews.cdc"'
const flowTokenPath = '"../../contracts/FlowToken.cdc"'
const kittyItemsPath = '"../../contracts/KittyItems.cdc"'
const storefrontPath = '"../../contracts/NFTStorefrontV2.cdc"'

const PER_PAGE = 12

class StorefrontService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly flowTokenAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly metadataViewsAddress: string,
    public readonly storefrontAddress: string,
    private readonly minterAddress: string
  ) {}

  setupAccount = () => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  getItem = (account: string, itemID: number) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/nftStorefront/get_listing.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.executeScript<any[]>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)],
    })
  }

  getItems = (account: string) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/nftStorefront/get_listings.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    })
  }

  buy = (account: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/purchase_listing.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
      .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(itemID, t.UInt64), fcl.arg(account, t.Address)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  sell = (itemID: number, price: number) => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/create_listing.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
      .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(itemID, t.UInt64),
        fcl.arg(price.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  getListingItem = async (
    account: string,
    listingResourceID: string
  ): Promise<any> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          "../../../cadence/scripts/nftStorefront/get_listing_item.cdc"
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(metadataViewsPath, fcl.withPrefix(this.metadataViewsAddress))
      .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

      return this.flowService.executeScript<any>({
        script,
        args: [fcl.arg(account, t.Address), fcl.arg(listingResourceID, t.UInt64)],
      })
  }

  addListing = async listingEvent => {
    const owner = listingEvent.data.storefrontAddress;
    const listingResourceID = listingEvent.data.listingResourceID;
    const item = await this.getListingItem(owner, listingResourceID);

    return Listing.transaction(async tx => {
      return await Listing.query(tx)
        .insert({
          listing_resource_id: listingResourceID,
          item_id: item.itemID,
          item_kind: item.kind,
          item_rarity: item.rarity,
          name: item.name,
          image: item.image,
          owner: owner,
          price: item.price,
          transaction_id: listingEvent.transactionId,
        })
        .returning("transaction_id")
        .onConflict("listing_resource_id")
        .ignore()
        .catch(e => {
          console.log(e)
        })
    });
  }

  removeListing = async listingEvent => {
    const listingResourceID = listingEvent.data.listingResourceID

    return Listing.transaction(async tx => {
      return await Listing.query(tx)
        .where({
          listing_resource_id: listingResourceID,
        })
        .del()
    })
  }

  findListing = itemID => {
    return Listing.transaction(async tx => {
      return await Listing.query(tx)
        .select("*")
        .where("item_id", itemID)
        .limit(1)
    })
  }

  findMostRecentSales = params => {
    return Listing.transaction(async tx => {
      const query = Listing.query(tx).select("*").orderBy("updated_at", "desc")

      if (params.owner) {
        query.where("owner", params.owner)
      }

      if (params.kind) {
        query.where("item_kind", params.kind)
      }

      if (params.rarity) {
        query.where("item_rarity", Number(params.rarity))
      }

      if (params.minPrice) {
        query.where("price", ">=", parseFloat(params.minPrice))
      }

      if (params.maxPrice) {
        query.where("price", "<=", parseFloat(params.maxPrice))
      }

      if (params.marketplace) {
        query.where("owner", "!=", this.minterAddress)
      }

      if (params.page) {
        query.page(Number(params.page) - 1, PER_PAGE)
      }

      return await query
    })
  }
}

export {StorefrontService}
