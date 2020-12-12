import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from 'fs';
import * as path from 'path';

class KittyItemsService {

  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly kittyItemsAddress: string,
  ) {
  }

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/transactions/setup_account.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  mintKittyItem = async (recipient: string, typeId: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/transactions/mint_kitty_item.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(typeId, t.UInt64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  transferKittyItem = async (recipient: string, itemId: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/transactions/transfer_kitty_item.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(itemId, t.UInt64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/scripts/read_collection_ids.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number[]>({ script, args: [fcl.arg(account, t.Address)]});
  }

  getKittyItemType = async (itemId: number): Promise<number> => {
    // script should be fixed!
    const script = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/scripts/read_kitty_item_type_id.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number>({ script, args: [fcl.arg(itemId, t.UInt64)]});
  }

  getKittyItemsSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kittyItems/scripts/read_kitty_items_supply.cdc`), 'utf8')
      .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
    return this.flowService.executeScript<number>({ script, args: []});
  }
}

export {KittyItemsService};