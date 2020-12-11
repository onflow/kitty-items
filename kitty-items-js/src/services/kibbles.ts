import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import { mintKibblesTemplate } from "../templates";

class KibblesService {
  constructor(private readonly flowService: FlowService) {}
  async mintKibblesToAddress(destinationAddress: t.Address, amount: string) {
    const authorization = this.flowService.authorize(
      process.env.MINTER_FLOW_ADDRESS!,
      process.env.MINTER_ACCOUNT_KEY_IDX!,
      process.env.MINTER_PRIVATE_KEY!
    );
    const response = await fcl.send([
      fcl.transaction`
        ${mintKibblesTemplate}
      `,
      fcl.args([
        fcl.arg(destinationAddress, t.Address),
        fcl.arg(amount, t.UFix64),
      ]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.limit(100),
    ]);

    return await fcl.tx(response).onceExecuted();
  }
}
