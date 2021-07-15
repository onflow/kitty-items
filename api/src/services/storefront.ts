import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";
import { SaleOffer } from "../models/sale-offer";

const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const fusdPath = '"../../contracts/FUSD.cdc"';
const kibblePath = '"../../contracts/Kibble.cdc"';
const kittyItemsPath = '"../../contracts/KittyItems.cdc"';
const storefrontPath = '"../../contracts/NFTStorefront.cdc"';

class StorefrontService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly fusdAddress: string,
    private readonly kibbleAddress: string,
    private readonly nonFungibleTokenAddress: string,
    private readonly kittyItemsAddress: string,
    public readonly storefrontAddress: string
  ) {}

  setupAccount = () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  getItem = (account: string, itemID: number) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/nftStorefront/get_sale_offer.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.executeScript<any[]>({
      script,
      args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)]
    });
  };

  getItems = (account: string) => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/nftStorefront/get_sale_offers.cdc`
        ),
        "utf8"
      )
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)]
    });
  };

  buy = (account: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/buy_item_fusd.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(fusdPath, fcl.withPrefix(this.fusdAddress))
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(itemID, t.UInt64), fcl.arg(account, t.Address)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  sell = (itemID: number, price: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/nftStorefront/sell_item_fusd.cdc`
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kibblePath, fcl.withPrefix(this.kibbleAddress))
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(itemID, t.UInt64),
        fcl.arg(price.toFixed(8).toString(), t.UFix64)
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  getSaleOfferItem = async (
    account: string,
    saleOfferResourceID: string
  ): Promise<any> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          "../../../cadence/scripts/nftStorefront/get_sale_offer_item.cdc"
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));

    return this.flowService.executeScript<any>({
      script,
      args: [
        fcl.arg(account, t.Address),
        fcl.arg(saleOfferResourceID, t.UInt64)
      ]
    });
  };

  addSaleOffer = async (saleOfferEvent) => {
    const owner = saleOfferEvent.data.storefrontAddress;
    const saleOfferResourceID = saleOfferEvent.data.saleOfferResourceID;

    const item = await this.getSaleOfferItem(owner, saleOfferResourceID);

    return SaleOffer.transaction(async (tx) => {
      return await SaleOffer.query(tx)
        .insert({
          sale_item_id: item.itemID,
          sale_item_resource_id: saleOfferResourceID,
          sale_item_type: item.typeID,
          sale_item_owner: owner,
          sale_price: item.price,
          transaction_id: saleOfferEvent.transactionId
        })
        .returning("transaction_id")
        .catch((e) => {
          console.log(e);
        });
    });
  };

  removeSaleOffer = async (saleOfferEvent) => {
    const saleOfferResourceID = saleOfferEvent.data.saleOfferResourceID;

    return SaleOffer.transaction(async (tx) => {
      return await SaleOffer.query(tx)
        .where({
          sale_item_resource_id: saleOfferResourceID
        })
        .del();
    });
  };

  findMostRecentSales = () => {
    return SaleOffer.transaction(async (tx) => {
      const offers = await SaleOffer.query(tx).select("*");
      return offers;
    });
  };
}

export { StorefrontService };
