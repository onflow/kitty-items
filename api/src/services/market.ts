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
          `../../../cadence/transactions/kittyItemsMarket/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `${this.marketAddress}`
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
          `../../../cadence/cadence/kittyItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `${this.marketAddress}`
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
          `../../../cadence/cadence/kittyItemsMarket/scripts/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `${this.marketAddress}`
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
          `../../../cadence/transactions/kittyItemsMarket/buy_market_item.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/FungibleToken.cdc"',
        `${this.fungibleTokenAddress}`
      )
      .replace(
        '"../../contracts/NonFungibleToken.cdc"',
        `${this.nonFungibleTokenAddress}`
      )
      .replace('"../../contracts/Kibble.cdc"', `${this.kibbleAddress}`)
      .replace('"../../contracts/KittyItems.cdc"', `${this.kittyItemsAddress}`)
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `${this.marketAddress}`
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
          `../../../cadence/transactions/kittyItemsMarket/sell_market_item.cdc`
        ),
        "utf8"
      )
      .replace(
        '"../../contracts/FungibleToken.cdc"',
        `${this.fungibleTokenAddress}`
      )
      .replace(
        '"../../contracts/NonFungibleToken.cdc"',
        `${this.nonFungibleTokenAddress}`
      )
      .replace('"../../contracts/Kibble.cdc"', `${this.kibbleAddress}`)
      .replace('"../../contracts/KittyItems.cdc"', `${this.kittyItemsAddress}`)
      .replace(
        '"../../contracts/KittyItemsMarket.cdc"',
        `${this.marketAddress}`
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
        saleItemId: saleOfferEvent.data.saleItemID,
        saleItemType: saleOfferEvent.data.saleItemType,
        saleItemCollection: saleOfferEvent.data.saleItemCollection,
        transactionId: saleOfferEvent.transactionId,
        price: saleOfferEvent.data.price,
      });
    });
  };

  removeSaleOffer = (saleOfferEvent) => {
    return SaleOffer.transaction(async (tx) => {
      return await SaleOffer.query(tx)
        .where({
          saleItemId: saleOfferEvent.data.saleItemID,
        })
        .del();
    });
  };

  findMostRecentSales = () => {
    return SaleOffer.transaction(async (tx) => {
      return await SaleOffer.query(tx).select("*");
    });
  };
}

export { MarketService };
