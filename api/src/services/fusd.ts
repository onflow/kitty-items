import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const fusdPath = '"../../contracts/FUSD.cdc"';

class FUSDService {
  constructor(
    private readonly flowService: FlowService,
    private readonly fungibleTokenAddress: string,
    private readonly fusdAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../../../cadence/transactions/fusd/setup_account.cdc"
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(fusdPath, fcl.withPrefix(this.fusdAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  mint = async (recipient: string, amount: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../../../cadence/transactions/fusd/mint_tokens.cdc"
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(fusdPath, fcl.withPrefix(this.fusdAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(amount.toFixed(8).toString(), t.UFix64)
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  transfer = async (recipient: string, amount: number) => {
    const authorization = this.flowService.authorizeMinter();
    const transaction = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../../../cadence/transactions/fusd/transfer_tokens.cdc"
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(fusdPath, fcl.withPrefix(this.fusdAddress));

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(amount.toFixed(8).toString(), t.UFix64),
        fcl.arg(recipient, t.Address)
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization
    });
  };

  getBalance = async (account: string) => {
    const script = fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../../../cadence/scripts/fusd/get_balance.cdc"
        ),
        "utf8"
      )
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(fusdPath, fcl.withPrefix(this.fusdAddress));

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(account, t.Address)]
    });
  };
}

export { FUSDService };
