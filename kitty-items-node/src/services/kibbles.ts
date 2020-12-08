import * as fcl from "@onflow/fcl";
import * as t from '@onflow/types';
import * as flowService from './flow';
import * as templates from '../templates/templates';

export const mint = async ({ receiverAddr, amount }) => {
  try {
    const authorization = flowService.authorize(process.env.MINTER_FLOW_ADDRESS, process.env.MINTER_ACCOUNT_KEY_IDX, process.env.MINTER_PRIVATE_KEY)
    const response = await fcl.send([
      fcl.transaction`
        ${templates.mintKibblesTemplate}
      `,
      fcl.args([
        fcl.arg(receiverAddr, t.Address),
        fcl.arg(amount, t.UInt),
      ]),
      fcl.proposer(authorization),
      fcl.payer(authorization),
      fcl.limit(100)
    ]);

    return await fcl.tx(response).onceExecuted();
  } catch (e) {
    console.log(e);
    throw e;
  }
}
