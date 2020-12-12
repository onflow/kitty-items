import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from 'fs';
import * as path from 'path';


class KibblesService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly kibbleAddress: string,
  ) {}

  // async mintKibblesToAddress(
  //   destinationAddress: string,
  //   amount: string
  // ): Promise<string> {
  //   const authorization = this.flowService.authorizeMinter();
  //   const response = await fcl.send([
  //     fcl.transaction`
  //       ${mintKibblesTemplate}
  //     `,
  //     fcl.args([
  //       fcl.arg(destinationAddress, t.Address),
  //       fcl.arg(amount, t.UInt),
  //     ]),
  //     fcl.proposer(authorization),
  //     fcl.payer(authorization),
  //     fcl.limit(100),
  //   ]);

  //   return await fcl.tx(response).onceExecuted();
  // }

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/transactions/setup_account.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  mint = async (recipient: string, amount: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/transactions/mint_tokens.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(amount.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  burn = async (amount: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/transactions/burn_tokens.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(amount.toFixed(8).toString(), t.UFix64),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  transfer = async (recipient: string, amount: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/transactions/burn_tokens.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(amount.toFixed(8).toString(), t.UFix64),
        fcl.arg(recipient, t.Address),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  }

  getBalance = async (account: string) => {
    const script = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/scripts/get_balance.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.executeScript<number>({ script, args: [fcl.arg(account, t.Address)]});
  }

  getSupply = async () => {
    const script = fs
      .readFileSync(path.join(__dirname, `../../../kitty-items-cadence/cadence/kibble/scripts/get_supply.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${this.fungibleTokenAddress}`)
      .replace(/0xKIBBLE/gi, `0x${this.kibbleAddress}`);
    return this.flowService.executeScript<number>({ script, args: []});
  }
}

export { KibblesService };
