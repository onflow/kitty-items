import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";
import { SaleOffer } from "../models/sale-offer";

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
          `../../../kitty-items-cadence/cadence/kittyItemsMarket/transactions/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(/0xKITTYMARKET/gi, `0x${this.marketAddress}`);
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
      .replace(/0xKITTYMARKET/gi, `0x${this.marketAddress}`);
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
      .replace(/0xKITTYMARKET/gi, `0x${this.marketAddress}`);
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
          `../../../kitty-items-cadence/cadence/kittyItemsMarket/transactions/buy_market_item.cdc`
        ),
        "utf8"
      )
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`)
      .replace(/0xKITTYMARKET/gi, `0x${this.marketAddress}`);
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
          `../../../kitty-items-cadence/cadence/kittyItemsMarket/transactions/sell_market_item.cdc`
        ),
        "utf8"
      )
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`)
      .replace(/0xKITTYMARKET/gi, `0x${this.marketAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(itemId, t.UInt64), fcl.arg(price.toString(), t.UFix64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  findMostRecentSales = async () => {
    return SaleOffer.query().orderBy("created_at", "desc").limit(20);
  };

  upsertSaleOffer = async (itemId: number, price: number) => {
    return SaleOffer.transaction(async (tx) => {
      const saleOffers = await SaleOffer.query(tx).insertGraphAndFetch([
        {
          kitty_item: {
            id: itemId,
          },
          price: price,
          is_complete: false,
        },
      ]);
      return saleOffers[0];
    });
  };
}

export { MarketService };
