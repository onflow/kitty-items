import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

class KittyItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly kittyItemsAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/NonFungibleToken.cdc\"", `0x${this.nonFungibleTokenAddress}`)
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  mint = async (recipient: string, typeId: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItems/mint_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/NonFungibleToken.cdc\"", `0x${this.nonFungibleTokenAddress}`)
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(typeId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  transfer = async (recipient: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/transactions/kittyItems/transfer_kitty_item.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/NonFungibleToken.cdc\"", `0x${this.nonFungibleTokenAddress}`)
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemId, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/scripts/kittyItems/read_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/NonFungibleToken.cdc\"", `0x${this.nonFungibleTokenAddress}`)
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  getKittyItemType = async (itemId: number): Promise<number> => {
    // script should be fixed!
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/scripts/kittyItems/read_kitty_item_type_id.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/NonFungibleToken.cdc\"", `0x${this.nonFungibleTokenAddress}`)
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(itemId, t.UInt64)],
    });
  };

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../kitty-items-cadence/scripts/kittyItems/read_kitty_items_supply.cdc`
        ),
        "utf8"
      )
      .replace("\"../../contracts/KittyItems.cdc\"", `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number>({ script, args: [] });
  };
}

export { KittyItemsService };
