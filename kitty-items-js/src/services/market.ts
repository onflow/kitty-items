import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";

import * as fs from "fs";

import * as path from "path";

import { SaleOfferEvent } from "../models/sale-offer-event";
import { SaleOffer } from "../models/sale-offer";

import { FlowService } from "./flow";

class MarketService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly kibbleAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly kittyItemsAddress: string,
    private readonly marketAddress: string
  ) {}

  setupAccount = () => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItemsMarket/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `0x${this.marketAddress}`
      );
    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getItem = (account: string, itemId: number) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/cadence/kittyItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `0x${this.marketAddress}`
      );
    return this.flowService.executeScript<any[]>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(itemId, t.UInt64)],
    });
  };

  getItems = (account: string) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/cadence/kittyItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `0x${this.marketAddress}`
      );
    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  buy = (account: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItemsMarket/buy_market_item.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/FungibleToken.cdc"',
        `0x${this.fungibleTokenAddress}`
      )
      .replace(
        '"../../contracts/NonFungibleToken.cdc"',
        `0x${this.nonFungibleTokenAddress}`
      )
      .replace('"../../contracts/Kibble.cdc"', `0x${this.kibbleAddress}`)
      .replace(
        '"../../contracts/KittyItems.cdc"',
        `0x${this.kittyItemsAddress}`
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `0x${this.marketAddress}`
      );

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(account, t.Address), fcl.arg(itemId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  sell = (itemId: number, price: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItemsMarket/sell_market_item.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/FungibleToken.cdc"',
        `0x${this.fungibleTokenAddress}`
      )
      .replace(
        '"../../contracts/NonFungibleToken.cdc"',
        `0x${this.nonFungibleTokenAddress}`
      )
      .replace('"../../contracts/Kibble.cdc"', `0x${this.kibbleAddress}`)
      .replace(
        '"../../contracts/KittyItems.cdc"',
        `0x${this.kittyItemsAddress}`
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `0x${this.marketAddress}`
      );

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(itemId, t.UInt64),
        fcl.arg(price.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  addSaleOffer = async (saleOfferEvent) => {
    return SaleOffer.transaction(async (tx) => {
      return await SaleOffer.query(tx).insert({
        saleItemID: saleOfferEvent.data.saleItemID,
        saleItemType: saleOfferEvent.data.saleItemType,
        saleItemCollection: saleOfferEvent.data.saleItemCollection,
        price: saleOfferEvent.data.price,
      });
    });
  };

  removeSaleOffer = (saleOfferEvent) => {
    // TODO
  };

  findMostRecentSales = () => {
    // TODO
  };

  storeEvent = (event) => {
    console.log("Got event: ", event);
    return SaleOfferEvent.transaction(async (tx) => {
      return await SaleOfferEvent.query(tx).insert({
        event: event,
      });
    });
  };
}

export { MarketService };
